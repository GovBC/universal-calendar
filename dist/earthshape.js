import * as THREE from './vendor/three.module.min.js';
import {A, F, B, sampleGeoid, earthPosition} from './earthshape-math.js';

const $ = id => document.getElementById(id);
const page = $('celestial-shape'), canvas = $('earthShapeCanvas'), stage = $('shapeStage');
const fmt = (x, digits = 0) => new Intl.NumberFormat('ar-SA', {maximumFractionDigits:digits}).format(x);
const state = {mode:'ellipsoid',factor:1,yaw:-.72,pitch:.12,zoom:1,playing:false,coasts:true};
let renderer, camera, scene, globe, group, coastline, reference, grid, coordinates, coastCoordinates;
let labels = [], initialized = false, loading, frame = 0, previous = 0, visible = false, dirty = true;
let modeRequest = 0;
const pointers = new Map();
const colorStops = [[-110,'#142d89'],[-55,'#20b8cc'],[0,'#d4e8dc'],[45,'#ebc253'],[90,'#d95530']].map(([n,c])=>[n,new THREE.Color(c)]);

function paintHeight(h) {
  let i = 0; while (i < colorStops.length - 2 && h > colorStops[i + 1][0]) i++;
  const [lo, a] = colorStops[i], [hi, b] = colorStops[i + 1];
  return a.clone().lerp(b, THREE.MathUtils.clamp((h-lo)/(hi-lo),0,1));
}

function point(lat, lon, lift = 0) {
  return earthPosition(lat,lon,state.mode,state.factor,grid ? sampleGeoid(grid,lat,lon) : 0,lift);
}

function createGlobe() {
  const positions = [], colors = [], indices = [];
  coordinates = [];
  for (let row=0;row<=180;row++) for (let col=0;col<=360;col++) {
    const lat=90-row,lon=-180+col;
    coordinates.push([lat,lon]); positions.push(...earthPosition(lat,lon)); colors.push(.06,.28,.4);
    if(row<180 && col<360){const a=row*361+col,b=a+1,c=a+361;indices.push(a,c,b,b,c,c+1);}
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geometry.setIndex(indices);geometry.computeVertexNormals();
  globe=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.72,metalness:.08}));
  group.add(globe);
}

function makeCoasts(geojson) {
  coastCoordinates=[];
  const rings=[];
  for(const f of geojson.features||[]) {
    const g=f.geometry;
    if(g.type==='Polygon') rings.push(...g.coordinates);
    if(g.type==='MultiPolygon') for(const polygon of g.coordinates) rings.push(...polygon);
  }
  for(const ring of rings) for(let i=1;i<ring.length;i++) {
    const [lon0,lat0]=ring[i-1], [lon1,lat1]=ring[i];
    const dl=((lon1-lon0+540)%360)-180, dp=lat1-lat0;
    const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dl)*Math.cos(lat0*Math.PI/180),Math.abs(dp))));
    for(let k=0;k<steps;k++) coastCoordinates.push([lat0+dp*k/steps,lon0+dl*k/steps],[lat0+dp*(k+1)/steps,lon0+dl*(k+1)/steps]);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(coastCoordinates.length*3),3));
  coastline=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xbde7df,transparent:true,opacity:.8}));
  group.add(coastline);updateGeometry();
}

function updateGeometry() {
  if(!globe)return;
  const pos=globe.geometry.attributes.position, colors=globe.geometry.attributes.color;
  const ocean=new THREE.Color('#176589');
  for(let i=0;i<coordinates.length;i++) {
    const [lat,lon]=coordinates[i], p=point(lat,lon);
    pos.setXYZ(i,...p);
    const c=state.mode==='geoid'&&grid?paintHeight(sampleGeoid(grid,lat,lon)):ocean;
    colors.setXYZ(i,c.r,c.g,c.b);
  }
  pos.needsUpdate=true;colors.needsUpdate=true;globe.geometry.computeVertexNormals();
  // Average coincident seam normals to avoid a false meridian ridge.
  const normals=globe.geometry.attributes.normal;
  for(let row=0;row<=180;row++){
    const left=row*361,right=left+360;
    const n=new THREE.Vector3().fromBufferAttribute(normals,left).add(new THREE.Vector3().fromBufferAttribute(normals,right)).normalize();
    normals.setXYZ(left,n.x,n.y,n.z);normals.setXYZ(right,n.x,n.y,n.z);
  }
  normals.needsUpdate=true;globe.geometry.computeBoundingSphere();
  if(coastline){
    const p=coastline.geometry.attributes.position;
    coastCoordinates.forEach(([lat,lon],i)=>p.setXYZ(i,...point(lat,lon,.0018)));
    p.needsUpdate=true;coastline.geometry.computeBoundingSphere();
    coastline.material.color.set(state.mode==='geoid'?0x112638:0xc5eeec);
    coastline.material.opacity=state.mode==='geoid'?.7:.82;
    coastline.visible=state.coasts;
  }
  reference.visible=state.mode==='ellipsoid';
  const polar=1-F*state.factor;
  reference.geometry.setAttribute('position',new THREE.Float32BufferAttribute([
    0,-polar-.12,0,0,polar+.12,0,
    -1.13,0,0,1.13,0,0
  ],3));
  labels=[{el:$('shapeNorth'),p:[0,polar+.16,0]},{el:$('shapeSouth'),p:[0,-polar-.16,0]}];
  requestDraw();
}

function updateText() {
  const geoid=state.mode==='geoid',real=state.factor===1;
  document.querySelectorAll('[data-shape-mode]').forEach(b=>{const yes=b.dataset.shapeMode===state.mode;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});
  $('shapeScale').max=geoid?'10000':'50';$('shapeScale').value=state.factor;
  $('shapeScaleValue').textContent=fmt(state.factor)+' ×';
  $('shapeScale').setAttribute('aria-valuetext',fmt(state.factor)+' مرة');
  $('shapeScaleLabel').textContent=geoid?'تضخيم ارتفاع الجيويد':'تضخيم التفلطح القطبي';
  $('shapeReal').classList.toggle('active',real);$('shapeReal').setAttribute('aria-pressed',String(real));
  $('shapeExaggerate').classList.toggle('active',state.factor===(geoid?10000:50));
  $('shapeExaggerate').setAttribute('aria-pressed',String(state.factor===(geoid?10000:50)));
  $('shapeExaggerate').textContent=geoid?'إظهار التعرجات ×١٠٬٠٠٠':'إظهار التفلطح ×٥٠';
  $('shapeModeBadge').textContent=geoid?'الجيويد • EGM96':'الإهليلج المرجعي • WGS 84';
  $('shapeScaleBadge').textContent=real?'المقياس الحقيقي ×١':`تضخيم توضيحي ×${fmt(state.factor)}`;
  $('shapeScaleBadge').classList.toggle('amplified',!real);
  $('shapeScaleNote').textContent=geoid
    ? (real?'تُعرض ارتفاعات الجيويد بحجمها الحقيقي، لذلك لا تكاد تُرى التعرجات على حجم الكوكب.':'يُضخّم ارتفاع الجيويد عن الإهليلج فقط؛ يبقى التفلطح القطبي بقيمته الحقيقية. الألوان تعبّر عن الأمتار الأصلية.')
    : (real?'هذه النسبة الحقيقية بين نصفي القطر؛ التفلطح صغير جدًا ولا يظهر بوضوح من الفضاء.':'تضخيم تعليمي للتفلطح القطبي فقط. الأرقام في البطاقة هي مقاييس الأرض الأصلية.');
  $('shapeReadoutTitle').textContent=geoid?'سطح مرتبط بالجاذبية':'الأرض أعرض عند الاستواء';
  $('shapeReadoutNumber').textContent=geoid?'EGM96':fmt(2*(A-B)/1000,2)+' كم';
  $('shapeReadoutCaption').textContent=geoid?'ارتفاع الجيويد بالنسبة إلى إهليلج WGS 84':'الفرق بين القطر الاستوائي والقطبي';
  $('shapeEllipsoidFacts').hidden=geoid;$('shapeGeoidFacts').hidden=!geoid;$('shapeLegend').hidden=!geoid;
  $('shapeNorth').hidden=geoid;$('shapeSouth').hidden=geoid;
}

async function loadData() {
  if(loading)return loading;
  $('shapeDataStatus').textContent='جارٍ تحميل بيانات الجيويد…';
  loading=(async()=>{
    try {
      const response=await fetch('./data/egm96-1deg.bin');
      if(!response.ok)throw new Error('Grid unavailable');
      const data=await response.arrayBuffer();
      if(data.byteLength!==181*360*2)throw new Error('Invalid grid length');
      const dv=new DataView(data);grid=new Int16Array(181*360);
      for(let i=0;i<grid.length;i++)grid[i]=dv.getInt16(i*2,true);
      let min=Infinity,max=-Infinity;for(const n of grid){min=Math.min(min,n/100);max=Math.max(max,n/100);}
      if(min< -120||max>100||min> -90||max<60)throw new Error('Invalid grid range');
      $('shapeGridMin').textContent=fmt(min,2)+' م';$('shapeGridMax').textContent='+'+fmt(max,2)+' م';
      $('shapeDataStatus').textContent='بيانات EGM96 محمّلة • شبكة عرض بدرجة واحدة';
      $('shapeRetry').hidden=true;
      updateGeometry();return true;
    }catch(e){
      grid=null;$('shapeDataStatus').textContent='تعذّر تحميل بيانات الجيويد. يمكنك إعادة المحاولة؛ الإهليلج متاح.';
      $('shapeRetry').hidden=false;
      if(state.mode==='geoid'){state.mode='ellipsoid';state.factor=1;updateText();updateGeometry();}
      return false;
    }finally{loading=null;}
  })();
  return loading;
}

function initialize() {
  if(initialized)return;
  initialized=true;
  try {
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.05,30);
    group=new THREE.Group();scene.add(group);
    scene.add(new THREE.HemisphereLight(0xeaf8ff,0x264360,2));
    const key=new THREE.DirectionalLight(0xfff0db,2.1);key.position.set(-3,4,5);scene.add(key);
    const fill=new THREE.DirectionalLight(0x68c3ed,.8);fill.position.set(3,-1,3);scene.add(fill);
    reference=new THREE.LineSegments(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x81dcef,transparent:true,opacity:.5}));
    group.add(reference);createGlobe();updateGeometry();
    new ResizeObserver(requestDraw).observe(stage);
    fetch('./vendor/land.geojson').then(r=>{if(!r.ok)throw new Error('Coasts');return r.json();}).then(makeCoasts).catch(()=>{
      $('shapeCoasts').checked=false;$('shapeCoasts').disabled=true;$('shapeCoastLabel').textContent='حدود القارات غير متاحة';
    });
    loadData();
  }catch(e){renderer?.dispose();renderer=null;$('shapeFallback').hidden=false;canvas.hidden=true;}
}

function active(){return visible&&!document.hidden&&renderer&&!renderer.getContext().isContextLost();}
function requestDraw(){dirty=true;if(!frame&&active())frame=requestAnimationFrame(draw);}
function draw(time){
  frame=0;if(!active())return;
  const dt=Math.min((time-(previous||time))/1000,.05);previous=time;
  if(state.playing)state.yaw+=dt*.13;
  if(dirty||state.playing){
    dirty=false;
    const width=stage.clientWidth,height=stage.clientHeight;
    if(!width||!height)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
    // Fit in both portrait and landscape without clipping an exaggerated geoid.
    const fit=Math.min(1,camera.aspect);camera.position.set(0,0,4.1/(fit*state.zoom));camera.lookAt(0,0,0);
    group.rotation.set(state.pitch,state.yaw,0);group.updateMatrixWorld(true);
    renderer.render(scene,camera);
    if(state.mode==='ellipsoid')for(const label of labels){
      const v=new THREE.Vector3(...label.p).applyMatrix4(group.matrixWorld).project(camera);
      label.el.style.left=`${(v.x+1)*width/2}px`;label.el.style.top=`${(1-v.y)*height/2}px`;
      label.el.hidden=Math.abs(v.x)>1||Math.abs(v.y)>.91;
    }
  }
  if(state.playing)frame=requestAnimationFrame(draw);
}

function setPlaying(value){state.playing=value;$('shapePlay').setAttribute('aria-pressed',String(value));$('shapePlay').textContent=value?'إيقاف الدوران':'تشغيل الدوران';requestDraw();}
async function setMode(mode){
  const request=++modeRequest;
  if(mode===state.mode)return;
  if(mode==='geoid'&&!grid){if(!await loadData())return;}
  if(request!==modeRequest)return;
  state.mode=mode;state.factor=mode==='geoid'?10000:1;
  updateText();updateGeometry();
}
function setFactor(n){state.factor=Math.max(1,Math.min(state.mode==='geoid'?10000:50,Math.round(n)));updateText();updateGeometry();}
document.querySelectorAll('[data-shape-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.shapeMode)));
$('shapeScale').addEventListener('input',e=>setFactor(+e.target.value));
$('shapeReal').addEventListener('click',()=>setFactor(1));
$('shapeExaggerate').addEventListener('click',()=>setFactor(state.mode==='geoid'?10000:50));
$('shapePlay').addEventListener('click',()=>setPlaying(!state.playing));
$('shapeReset').addEventListener('click',()=>{state.yaw=-.72;state.pitch=.12;state.zoom=1;setPlaying(false);requestDraw();});
$('shapeZoomIn').addEventListener('click',()=>zoom(1.15));
$('shapeZoomOut').addEventListener('click',()=>zoom(1/1.15));
$('shapeCoasts').addEventListener('change',e=>{state.coasts=e.target.checked;if(coastline)coastline.visible=state.coasts;requestDraw();});
$('shapeRetry').addEventListener('click',loadData);
function zoom(multiplier){state.zoom=THREE.MathUtils.clamp(state.zoom*multiplier,.75,2);requestDraw();}
canvas.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);setPlaying(false);});
canvas.addEventListener('pointermove',e=>{
  const old=pointers.get(e.pointerId);if(!old)return;
  if(pointers.size===1){state.yaw+=(e.clientX-old.x)*.007;state.pitch=THREE.MathUtils.clamp(state.pitch+(e.clientY-old.y)*.006,-1.35,1.35);}
  else if(pointers.size===2){const other=[...pointers.entries()].find(([id])=>id!==e.pointerId)[1];const before=Math.hypot(old.x-other.x,old.y-other.y);const after=Math.hypot(e.clientX-other.x,e.clientY-other.y);if(before>10)zoom(after/before);}
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});requestDraw();
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>pointers.delete(e.pointerId));
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(-e.deltaY*.001));},{passive:false});
canvas.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=','Home',' '].includes(e.key))return;
  e.preventDefault();
  if(e.key==='ArrowLeft')state.yaw-=.12;if(e.key==='ArrowRight')state.yaw+=.12;
  if(e.key==='ArrowUp')state.pitch=Math.max(-1.35,state.pitch-.1);if(e.key==='ArrowDown')state.pitch=Math.min(1.35,state.pitch+.1);
  if(e.key==='+'||e.key==='=')zoom(1.1);if(e.key==='-')zoom(1/1.1);
  if(e.key==='Home')$('shapeReset').click();if(e.key===' ')setPlaying(!state.playing);requestDraw();
});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();setPlaying(false);$('shapeFallback').hidden=false;});
canvas.addEventListener('webglcontextrestored',()=>{$('shapeFallback').hidden=true;requestDraw();});
new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible){initialize();requestDraw();}else{previous=0;}},{threshold:.05}).observe(stage);
document.addEventListener('visibilitychange',()=>{previous=0;requestDraw();});
window.earthShape3D={activate(){if(page.classList.contains('active')){initialize();requestDraw();}}};
updateText();
if(page.classList.contains('active'))window.earthShape3D.activate();
