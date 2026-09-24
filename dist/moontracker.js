import * as THREE from './vendor/three.module.min.js';
const C=globalThis.LunarCalc,A=globalThis.Astronomy,$=id=>document.getElementById(id),rad=Math.PI/180;
const fmt=(v,n=1)=>Number.isFinite(v)?new Intl.NumberFormat('ar-SA',{maximumFractionDigits:n,minimumFractionDigits:n}).format(v):'—';
const digits=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const cities=[
 ['makkah','مكة المكرمة',21.3891,39.8579,277,'Asia/Riyadh'],['medina','المدينة المنورة',24.5247,39.5692,620,'Asia/Riyadh'],['sudair','حوطة سدير',25.4376,45.5487,915,'Asia/Riyadh'],['muscat','مسقط',23.588,58.3829,25,'Asia/Muscat'],['doha','الدوحة',25.2854,51.531,7,'Asia/Qatar'],['cairo','القاهرة',30.0444,31.2357,23,'Africa/Cairo'],['rabat','الرباط',34.0209,-6.8416,75,'Africa/Casablanca'],['london','لندن',51.5074,-.1278,11,'Europe/London'],['newyork','نيويورك',40.7128,-74.006,10,'America/New_York'],['jakarta','جاكرتا',-6.2088,106.8456,8,'Asia/Jakarta'],['sydney','سيدني',-33.8688,151.2093,58,'Australia/Sydney'],['cape','كيب تاون',-33.9249,18.4241,25,'Africa/Johannesburg'],['tromso','ترومسو',69.6492,18.9553,10,'Europe/Oslo']
].map(([id,name,lat,lon,elevation,zone])=>({id,name,lat,lon,elevation,zone}));
const state={loc:{...CalendarCore.location,id:'custom'},date:'',minute:1080,obstruction:0,method:'eye',view:'dome',measure:null,trueScale:false,yaw:0,pitch:.48,zoom:1,playing:false,pins:[],data:null,path:[],snap:null,conjunction:null};
const moonMansions=[
 ['الشرطان','بداية المنازل عند قرني الحمل في التقسيم العربي.'],
 ['البطين','منطقة صغيرة بعد الشرطين، واسمها من بطن الحمل.'],
 ['الثريا','عنقود نجمي لامع، من أشهر علامات السماء العربية.'],
 ['الدبران','نجم أحمر لامع يتبع الثريا ظاهريًا.'],
 ['الهقعة','من منازل الجوزاء، واستعملت في عد الليالي.'],
 ['الهنعة','من مواضع الجوزاء في ترتيب المنازل.'],
 ['الذراع','منزل مرتبط بامتداد نجمي ظاهر في السماء الشتوية.'],
 ['النثرة','موضع قرب السرطان، ويقابله عنقود خافت في السماء.'],
 ['الطرف','بداية منازل الأسد في التقسيم التراثي.'],
 ['الجبهة','نجوم في جبهة الأسد كما تخيلها القدماء.'],
 ['الزبرة','منطقة في الأسد، واستعمل اسمها في المواسم.'],
 ['الصرفة','سميت لصرف الحر أو البرد في الموروث الموسمي.'],
 ['العواء','نجوم قريبة من العذراء في الخرائط الحديثة.'],
 ['السماك','يرتبط بالسماك الأعزل، أحد ألمع نجوم السماء.'],
 ['الغفر','منزلة خافتة نسبيًا في ترتيب المنازل.'],
 ['الزبانا','كفتا الميزان في الموروث العربي.'],
 ['الإكليل','إكليل العقرب عند مقدمة كوكبته.'],
 ['القلب','قلب العقرب، ويرتبط بالنجم الأحمر اللامع قلب العقرب.'],
 ['الشولة','ذنب العقرب ونهاية هذا الجزء من المسار.'],
 ['النعائم','نجوم في القوس، وتأتي قبل البلدة.'],
 ['البلدة','منطقة قليلة النجوم بين النعائم وسعد الذابح.'],
 ['سعد الذابح','أول منازل السعود، في جهة الجدي.'],
 ['سعد بلع','من منازل السعود في منتصف الشتاء التراثي.'],
 ['سعد السعود','منزل ارتبط بتغيرات موسمية مبشرة في الموروث.'],
 ['سعد الأخبية','آخر منازل السعود قبل الفرغين.'],
 ['الفرغ المقدم','أحد فرغي الدلو في ترتيب المنازل.'],
 ['الفرغ المؤخر','الفرغ الثاني قبل الرشاء.'],
 ['الرشاء','آخر المنازل، ويعرف أيضًا ببطن الحوت.']
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mansionRange(index){const span=360/moonMansions.length,start=index*span,end=(index+1)*span;return `${fmt(start,2)}° – ${fmt(end,2)}°`;}
function renderMoonMansions(){const grid=$('moonMansionsGrid');if(!grid)return;grid.innerHTML=moonMansions.map(([name,note],index)=>`<article class="panel moon-mansion-card" data-moon-mansion-index="${index}"><span>${digits(index+1)}</span><h3>${esc(name)}</h3><p>${esc(note)}</p><small>${mansionRange(index)}</small></article>`).join('');updateMoonMansionReading();}
function updateMoonMansionReading(){const name=$('moonMansionName');if(!name||!A?.EclipticGeoMoon)return;try{const date=state.snap?.date||state.data?.start||new Date(),ecl=A.EclipticGeoMoon(date),lon=((ecl.lon%360)+360)%360,span=360/moonMansions.length,index=Math.floor(lon/span)%moonMansions.length,progress=(lon-index*span)/span*100;name.textContent=moonMansions[index][0];$('moonMansionRange').textContent=`النطاق: ${mansionRange(index)} من الدائرة البروجية`;$('moonMansionDegree').textContent=`طول القمر الكسوفي: ${fmt(lon,2)}° • تقدّم داخل المنزلة ${fmt(progress,0)}٪`;$('moonMansionDate').textContent=`آخر حساب: ${clock(date,state.loc.zone)} • ${C.dateISO(date,state.loc.zone)}`;document.querySelectorAll('[data-moon-mansion-index]').forEach(card=>card.classList.toggle('active',+card.dataset.moonMansionIndex===index));}catch{}}
function setMoonInfoTab(tab){const ids={mansions:'moonMansionsPane',history:'moonHistoryPane',general:'moonGeneralPane'};if(!ids[tab])return;document.querySelectorAll('[data-moon-info-tab]').forEach(button=>{const active=button.dataset.moonInfoTab===tab;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});document.querySelectorAll('.moon-info-pane').forEach(pane=>{pane.hidden=pane.id!==ids[tab];pane.classList.toggle('active',pane.id===ids[tab]);});if(tab==='general')setTimeout(()=>{window.lunarTracker?.activate();window.moonMonthModel?.activate();},30);}
const city=$('lunarCity');for(const c of cities)city.add(new Option(c.name,c.id));city.add(new Option('موقع مخصص','custom'));
const zones=[...new Set(['UTC',...cities.map(c=>c.zone),...(Intl.supportedValuesOf?.('timeZone')||[])])].sort();for(const z of zones)$('lunarZone').add(new Option(z,z));
function clock(date,zone=state.loc.zone){return new Intl.DateTimeFormat('ar-SA',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:CalendarCore.hourCycle}).format(date);}
function dateTime(date){if(!date)return 'لا يحدث في هذا اليوم';date=new Date(Math.round(+date/60000)*60000);return `${clock(date)}${C.dateISO(date,state.loc.zone)!==state.date?' (اليوم التالي)':''}`;}
function error(message=''){$('lunarError').textContent=message;$('lunarError').hidden=!message;}
function safely(fn){try{fn();error();}catch(e){stop();error(e.message||'تعذّر حساب البيانات المختارة.');}}
function setFields(){const l=state.loc;city.value=l.id;$('lunarLat').value=l.lat;$('lunarLon').value=l.lon;$('lunarElevation').value=l.elevation;$('lunarZone').value=l.zone;}
function now(){const d=new Date();state.date=C.dateISO(d,state.loc.zone);$('lunarDate').value=state.date;const b=C.dayBounds(state.date,state.loc.zone);state.minute=Math.floor((d-b.start)/60000);recalculate();}
function recalculate(){
 const l=state.loc;if(!Number.isFinite(l.lat)||!Number.isFinite(l.lon)||!Number.isFinite(l.elevation)||l.lat< -90||l.lat>90||l.lon< -180||l.lon>180||l.elevation< -500||l.elevation>9000)throw new Error('أدخل إحداثيات صحيحة وارتفاعًا بين −٥٠٠ و٩٠٠٠ متر.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(state.date)||state.date<'1900-01-01'||state.date>'2100-12-31')throw new Error('اختر تاريخًا صحيحًا بين ١٩٠٠ و٢١٠٠.');
 state.data=C.evening(state.date,l,state.obstruction);state.path=C.dayPath(state.date,l);state.minute=Math.min(state.minute,Math.round((state.data.end-state.data.start)/60000)-1);$('lunarTime').max=Math.round((state.data.end-state.data.start)/60000)-1;
 state.conjunction=C.previousNewMoon(state.data.start);$('lunarZoneSummary').textContent=l.zone;
 updateEvening();update();updatePath();drawMap();drawCompare();updateRecord();
}
function update(){if(!state.data)return;const d=new Date(+state.data.start+state.minute*60000);state.snap=C.snapshot(d,state.loc);const s=state.snap;
 let previous=state.conjunction;const next=previous?A.SearchMoonPhase(0,new Date(+previous+DAY/2),35)?.date:null;if(next&&next<=d)previous=next;
 $('lunarTime').value=state.minute;const p=C.parts(d,state.loc.zone);$('lunarClock').value=`${String(p.h).padStart(2,'0')}:${String(p.min).padStart(2,'0')}`;
 const upper=s.moon.altitude+s.diameter/120,lower=s.moon.altitude-s.diameter/120;
 $('lunarPosition').textContent=upper<=0?'القمر تحت الأفق حسابيًا':s.moon.altitude<=0?'حافة القمر فوق الأفق':upper<=state.obstruction?'القمر خلف العوائق المحددة':lower<=state.obstruction?'جزء من القمر محجوب بالعوائق':'القمر فوق الأفق حسابيًا';
 $('lunarLook').textContent=`اتجاه ${C.direction(s.moon.azimuth)} • ${clock(d)} بالتوقيت المحلي`;
 $('lunarAlt').textContent=fmt(s.moon.altitude)+'°';$('lunarAz').textContent=fmt(s.moon.azimuth)+'°';$('lunarIllum').textContent=fmt(s.illum*100)+'٪';$('lunarDiameter').textContent=fmt(s.diameter,2)+' دقيقة قوسية';$('lunarElongation').textContent=fmt(s.elongation)+'°';$('lunarAge').textContent=previous?fmt((d-previous)/3600000)+' ساعة':'—';$('lunarSunAlt').textContent=fmt(s.sun.altitude)+'°';
 drawChart();drawScene();updateMoonMansionReading();if($('lunarMap').closest('details').open)drawCompare();
}
const DAY=86400000;
function updateEvening(){const d=state.data;$('lunarVisibility').textContent=d.label;
 let reason=d.reason;if(d.zone==='C'&&state.method==='eye')reason+=' الوسيلة المختارة هي العين المجردة؛ هذه الفئة تحتاج أداة بصرية.';
 if(d.blocked)reason+=' عند وقت التقييم يقع مركز القمر خلف العوائق المحددة؛ جرّب موقعًا بأفق مكشوف.';
 $('lunarVisibilityReason').textContent=reason;$('lunarSunset').textContent=dateTime(d.sunset);$('lunarRise').textContent=dateTime(d.rise);$('lunarSet').textContent=dateTime(d.set);$('lunarLag').textContent=d.lag===null?'—':fmt(d.lag,0)+' دقيقة';
 $('lunarBest').disabled=!d.best;$('lunarBest').textContent=d.best?`اعرض وقت التقييم: ${clock(d.best)}`:'لا يتوفر وقت تقييم';
 const w=$('lunarWindow');w.replaceChildren();if(d.window){w.append('الفترة فوق العوائق بعد غروب الشمس: من ');const a=document.createElement('bdi');a.textContent=dateTime(d.window[0]);w.append(a,' إلى ');const b=document.createElement('bdi');b.textContent=dateTime(d.window[1]);w.append(b,' — فترة هندسية متاحة، وليست ضمانًا لرؤية الهلال.');}else w.textContent=d.best?'لا تتوفر فترة يكون فيها مركز القمر فوق العوائق بعد الغروب.':'لا تُعرض فترة لرصد الهلال خارج نطاق هذا التقييم.';
 $('lunarCriterionValues').textContent=d.zone?`الفئة ${d.zone} • V = ${fmt(d.v,3)} • فرق الارتفاع ${fmt(d.arcv,2)}° • عرض الهلال ${fmt(d.w,3)} دقيقة قوسية. لا يدخل الانكسار الجوي في هذه القيم.`:'لا يُحسب تصنيف عودة لهذه الحالة.';
}
function drawChart(){const width=560,height=230,left=45,right=12,top=15,bottom=35,iw=width-left-right,ih=height-top-bottom,b=state.data;
 const x=t=>left+(t-b.start)/(b.end-b.start)*iw,y=v=>top+(90-v)/180*ih;let out=`<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><rect x="${left}" y="${y(0)}" width="${iw}" height="${height-bottom-y(0)}" fill="#071522"/>`;
 for(const alt of [-90,-45,0,45,90])out+=`<line x1="${left}" y1="${y(alt)}" x2="${width-right}" y2="${y(alt)}" stroke="${alt===0?'#7299ad':'#284053'}"/><text x="${left-7}" y="${y(alt)+4}" fill="#b9cddd" font-size="13" text-anchor="end">${alt}°</text>`;
 for(let i=0;i<=4;i++){const t=new Date(+b.start+i*(b.end-b.start)/4);out+=`<text x="${x(t)}" y="${height-10}" fill="#b9cddd" font-size="13" text-anchor="${i===0?'start':i===4?'end':'middle'}">${clock(t)}</text>`;}
 for(const [key,color] of [['sun','#f6c85f'],['moon','#55d8f2']])out+=`<polyline points="${state.path.map(p=>`${x(p.date).toFixed(1)},${y(p[key].altitude).toFixed(1)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2"/>`;
 out+=`<line x1="${left}" x2="${width-right}" y1="${y(state.obstruction)}" y2="${y(state.obstruction)}" stroke="#e0a979" stroke-dasharray="4 4"/><line x1="${x(state.snap.date)}" x2="${x(state.snap.date)}" y1="${top}" y2="${height-bottom}" stroke="#dceff9" opacity=".6"/><circle cx="${x(state.snap.date)}" cy="${y(state.snap.moon.altitude)}" r="4" fill="#55d8f2"/></svg>`;$('lunarChart').innerHTML=out;
}
// Three-dimensional horizon coordinates: east +x, north -z, up +y.
const point=(az,alt,r=9)=>new THREE.Vector3(Math.sin(az*rad)*Math.cos(alt*rad)*r,Math.sin(alt*rad)*r,-Math.cos(az*rad)*Math.cos(alt*rad)*r);
let renderer,scene,camera,ground,pathGroup,measureGroup,obstacle,moon,sun,marker;const labels=[];let phaseTexture,lastPhase=-1;
function line(points,color,opacity=1,dashed=false){const g=new THREE.BufferGeometry().setFromPoints(points),m=dashed?new THREE.LineDashedMaterial({color,transparent:true,opacity,dashSize:.17,gapSize:.12}):new THREE.LineBasicMaterial({color,transparent:true,opacity});const l=new THREE.Line(g,m);if(dashed)l.computeLineDistances();return l;}
function disposeGroup(group){if(!group)return;for(const c of [...group.children]){c.geometry?.dispose();c.material?.dispose();group.remove(c);}}
function makeLabel(text,cls=''){const el=document.createElement('span');el.className='lunar-label '+cls;el.textContent=text;$('lunarLabels').append(el);const l={el,position:new THREE.Vector3(),offset:0};labels.push(l);return l;}
let moonLabel,sunLabel;
function initScene(){try{
 renderer=new THREE.WebGLRenderer({canvas:$('lunarCanvas'),antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(48,1,.05,120);
 ground=new THREE.Mesh(new THREE.CircleGeometry(9,96),new THREE.MeshBasicMaterial({color:0x183746,side:THREE.DoubleSide,transparent:true,opacity:.8,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.position.y=-.025;scene.add(ground);
 scene.add(line(Array.from({length:129},(_,i)=>point(i*360/128,0)),0x86b9c6));
 for(const alt of [30,60])scene.add(line(Array.from({length:97},(_,i)=>point(i*360/96,alt)),0x48627a,.34));
 for(const az of [0,90,180,270])scene.add(line(Array.from({length:49},(_,i)=>point(az,i*90/48)),0x48627a,.34));
 for(const [az,text] of [[0,'شمال'],[90,'شرق'],[180,'جنوب'],[270,'غرب']]){const l=makeLabel(text);l.position=point(az,0,9.65);}
 const obs=new THREE.Mesh(new THREE.SphereGeometry(.075,12,8),new THREE.MeshBasicMaterial({color:0xffffff}));obs.position.y=.08;scene.add(obs);
 pathGroup=new THREE.Group();measureGroup=new THREE.Group();scene.add(pathGroup,measureGroup);
 obstacle=new THREE.Group();scene.add(obstacle);
 const phaseCanvas=document.createElement('canvas');phaseCanvas.width=128;phaseCanvas.height=128;phaseTexture=new THREE.CanvasTexture(phaseCanvas);phaseTexture.colorSpace=THREE.SRGBColorSpace;
 moon=new THREE.Sprite(new THREE.SpriteMaterial({map:phaseTexture,transparent:true,depthTest:false}));scene.add(moon);
 const sunCanvas=document.createElement('canvas');sunCanvas.width=64;sunCanvas.height=64;const ctx=sunCanvas.getContext('2d');ctx.fillStyle='#ffce68';ctx.beginPath();ctx.arc(32,32,30,0,Math.PI*2);ctx.fill();const sunTexture=new THREE.CanvasTexture(sunCanvas);sunTexture.colorSpace=THREE.SRGBColorSpace;sun=new THREE.Sprite(new THREE.SpriteMaterial({map:sunTexture,transparent:true,depthTest:false}));scene.add(sun);
 marker=new THREE.Mesh(new THREE.RingGeometry(.1,.112,48),new THREE.MeshBasicMaterial({color:0x78e4ff,side:THREE.DoubleSide,depthTest:false,transparent:true,opacity:.8}));scene.add(marker);
 moonLabel=makeLabel('القمر','moon');sunLabel=makeLabel('الشمس','sun');
 new ResizeObserver(()=>drawScene()).observe($('lunarStage'));
 $('lunarCanvas').addEventListener('webglcontextlost',e=>{e.preventDefault();$('lunarFallback').hidden=false;});$('lunarCanvas').addEventListener('webglcontextrestored',()=>location.reload());
 }catch(e){renderer=null;$('lunarFallback').hidden=false;$('lunarCanvas').hidden=true;$('lunarLabels').hidden=true;}
}
function updatePath(){if(!renderer)return;disposeGroup(pathGroup);for(let i=1;i<state.path.length;i++){const a=state.path[i-1].moon,b=state.path[i].moon;const below=(a.altitude+b.altitude)/2<0;pathGroup.add(line([point(a.azimuth,a.altitude),point(b.azimuth,b.altitude)],below?0x8fa3b6:0x55d8f2,below?.28:.95,below));}
 disposeGroup(obstacle);if(state.obstruction>0){const top=Array.from({length:129},(_,i)=>point(i*360/128,state.obstruction));obstacle.add(line(top,0xe0a979,.8));const vertices=[];for(let i=0;i<128;i++){const a=point(i*360/128,0),b=point((i+1)*360/128,0),c=top[i],d=top[i+1];for(const p of [a,b,c,b,d,c])vertices.push(...p.toArray());}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));obstacle.add(new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0xba7751,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false})));}
 drawScene();
}
function phaseImage(fraction){const rounded=Math.round(fraction*1000);if(rounded===lastPhase)return;lastPhase=rounded;const ctx=phaseTexture.image.getContext('2d'),im=ctx.createImageData(128,128),z=2*fraction-1,x=Math.sqrt(Math.max(0,1-z*z));for(let j=0;j<128;j++)for(let i=0;i<128;i++){const nx=(i-63.5)/61,ny=(63.5-j)/61,r=nx*nx+ny*ny;if(r>1)continue;const light=Math.max(0,nx*x+Math.sqrt(1-r)*z),v=light>0?Math.round(145+105*Math.sqrt(light)):24;const k=(j*128+i)*4;im.data[k]=v;im.data[k+1]=Math.min(255,v+5);im.data[k+2]=Math.min(255,v+9);im.data[k+3]=255;}ctx.putImageData(im,0,0);phaseTexture.needsUpdate=true;}
function drawScene(){if(!renderer||!state.snap||!$('celestial-moon').classList.contains('active'))return;const stage=$('lunarStage'),w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;
 if(state.view==='dome'){camera.fov=48;camera.position.set(Math.sin(state.yaw)*23*Math.cos(state.pitch)*state.zoom,23*Math.sin(state.pitch)*state.zoom,-Math.cos(state.yaw)*23*Math.cos(state.pitch)*state.zoom);camera.lookAt(0,1,0);ground.material.opacity=.8;}else{camera.position.set(0,.005,0);camera.fov=65*state.zoom;camera.lookAt(point(state.yaw/rad,state.pitch/rad));ground.material.opacity=1;}
 camera.updateProjectionMatrix();camera.updateMatrixWorld();const s=state.snap;moon.position.copy(point(s.moon.azimuth,s.moon.altitude));sun.position.copy(point(s.sun.azimuth,s.sun.altitude));phaseImage(s.illum);
 const radius=state.trueScale?9*Math.tan(s.diameter/60*rad/2)*2:.43;moon.scale.setScalar(radius);sun.scale.setScalar(state.trueScale?9*.0093:.34);marker.position.copy(moon.position);marker.quaternion.copy(camera.quaternion);marker.visible=state.trueScale;
 moon.visible=state.view==='dome'||s.moon.altitude+s.diameter/120>0;sun.visible=state.view==='dome'||s.sun.altitude+.27>0;marker.visible=marker.visible&&moon.visible;
 const mp=moon.position.clone().project(camera),sp=sun.position.clone().project(camera);moon.material.rotation=Math.atan2((sp.y-mp.y)*h,(sp.x-mp.x)*w);
 moonLabel.position.copy(moon.position);moonLabel.offset=-20;sunLabel.position.copy(sun.position);sunLabel.offset=22;
 disposeGroup(measureGroup);if(state.measure==='alt'){measureGroup.add(line(Array.from({length:65},(_,i)=>point(s.moon.azimuth,s.moon.altitude*i/64)),0xf6c85f));measureGroup.add(line([new THREE.Vector3(),point(s.moon.azimuth,0)],0xf6c85f,.6));measureGroup.add(line([new THREE.Vector3(),moon.position],0xf6c85f,.6));}else if(state.measure==='az'){measureGroup.add(line(Array.from({length:97},(_,i)=>point(s.moon.azimuth*i/96,0,6)),0xf6c85f));measureGroup.add(line([point(0,0,6),new THREE.Vector3(),point(s.moon.azimuth,0,9)],0xf6c85f,.6));}
 renderer.render(scene,camera);
 const occupied=[];for(const l of [...labels].reverse()){const p=l.position.clone().project(camera);let visible=p.z>-1&&p.z<1&&Math.abs(p.x)<.93&&Math.abs(p.y)<.94;if(l===moonLabel&&!moon.visible||l===sunLabel&&!sun.visible)visible=false;let x=(p.x+1)*w/2,y=(1-p.y)*h/2+l.offset;
 for(const r of occupied){if(Math.abs(x-r.x)<65&&Math.abs(y-r.y)<26)y+=29;}if(y<10||y>h-18)visible=false;
 l.el.hidden=!visible;if(visible){l.el.style.left=`${x}px`;l.el.style.top=`${y}px`;occupied.push({x,y});}}
}
function focus(){if(!state.snap)return;state.yaw=state.snap.moon.azimuth*rad;state.pitch=state.view==='dome'?.48:Math.max(5,Math.min(65,state.snap.moon.altitude))*rad;state.zoom=1;drawScene();}
let drag=null;const canvas=$('lunarCanvas');canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!drag)return;state.yaw+=(e.clientX-drag.x)*.006*(state.view==='dome'?1:-1);state.pitch=Math.max(state.view==='dome'?.08:-.35,Math.min(1.35,state.pitch+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY};drawScene();});for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();state.zoom=Math.max(.55,Math.min(1.65,state.zoom+e.deltaY*.001));drawScene();},{passive:false});canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')state.yaw-=.12;if(e.key==='ArrowRight')state.yaw+=.12;if(e.key==='ArrowUp')state.pitch=Math.min(1.35,state.pitch+.1);if(e.key==='ArrowDown')state.pitch=Math.max(.08,state.pitch-.1);if(e.key==='+'||e.key==='=')state.zoom=Math.max(.55,state.zoom-.1);if(e.key==='-')state.zoom=Math.min(1.65,state.zoom+.1);drawScene();});
// Natural Earth land outlines, equirectangular coordinate selection, with a numerical alternative.
const comparisonCache=new Map();
let landPaths='',landLoaded=false;
function mapPath(ring){return ring.map((p,i)=>`${i?'L':'M'}${(p[0]+180).toFixed(2)},${(90-p[1]).toFixed(2)}`).join(' ')+'Z';}
async function loadLand(){if(landLoaded)return;landLoaded=true;try{const r=await fetch('./vendor/land.geojson');if(!r.ok)throw Error();const data=await r.json();for(const f of data.features){const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;for(const poly of polys)landPaths+=`<path d="${poly.map(mapPath).join(' ')}"/>`;}drawMap();}catch{landLoaded=false;$('lunarMap').textContent='تعذّر تحميل الخريطة؛ يمكنك اختيار المدينة أو إدخال الإحداثيات في الإعدادات.';}}
function drawMap(){if(!landPaths)return;let grid='';for(let lon=-180;lon<=180;lon+=30)grid+=`<path d="M ${lon+180} 0 V 180"/>`;for(let lat=-60;lat<=60;lat+=30)grid+=`<path d="M 0 ${90-lat} H 360"/>`;
 $('lunarMap').innerHTML=`<svg viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg" aria-label="اختر موقعًا على خريطة العالم"><g fill="#294b5b" stroke="#557b88" stroke-width=".2">${landPaths}</g><g class="lunar-map-grid">${grid}</g><circle cx="${state.loc.lon+180}" cy="${90-state.loc.lat}" r="2.8" fill="#f6c85f" stroke="#fff" stroke-width=".7"/><text x="5" y="12" fill="#b9cddd" font-size="6">90° N</text><text x="5" y="176" fill="#b9cddd" font-size="6">90° S</text></svg>`;
 $('lunarMap').firstElementChild.addEventListener('click',e=>{const svg=e.currentTarget,p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const v=p.matrixTransform(svg.getScreenCTM().inverse());if(v.x<0||v.x>360||v.y<0||v.y>180)return;state.loc={id:'custom',name:'نقطة على الخريطة',lat:+(90-v.y).toFixed(4),lon:+(v.x-180).toFixed(4),elevation:0,zone:'UTC'};setFields();safely(recalculate);});
}
function safeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function drawCompare(){const wrap=$('lunarCompare');if(!state.pins.length){wrap.textContent='أضف موقعين أو أكثر لمقارنة موضع القمر في اللحظة نفسها.';return;}
 let rows='';for(let i=0;i<state.pins.length;i++){const l=state.pins[i],s=C.snapshot(state.snap.date,l),iso=C.dateISO(state.snap.date,l.zone),key=[l.lat,l.lon,l.elevation,l.zone,iso].join('|');if(!comparisonCache.has(key))comparisonCache.set(key,C.evening(iso,l,0));const d=comparisonCache.get(key);rows+=`<tr><td>${safeText(l.name)}<br><small>${fmt(l.lat,2)}، ${fmt(l.lon,2)}</small></td><td><bdi>${clock(s.date,l.zone)}</bdi></td><td><bdi>${fmt(s.moon.altitude)}°</bdi></td><td>${C.direction(s.moon.azimuth)}</td><td><bdi>${d.sunset?clock(d.sunset,l.zone):'لا يحدث'}</bdi></td><td><button data-lunar-remove="${i}" class="ghost-button" aria-label="حذف ${safeText(l.name)} من المقارنة">حذف</button></td></tr>`;}
 wrap.innerHTML=`<div class="lunar-compare-scroll"><table><thead><tr><th>الموقع</th><th>الوقت المحلي</th><th>ارتفاع القمر</th><th>الاتجاه</th><th>غروب الشمس</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;wrap.querySelectorAll('[data-lunar-remove]').forEach(b=>b.addEventListener('click',()=>{state.pins.splice(+b.dataset.lunarRemove,1);drawCompare();}));
}
const records=[
 {id:'pierce',name:'جون بيرس',place:'كولينز غاب، تينيسي، الولايات المتحدة',time:'1990-02-25T23:55:00Z',loc:{id:'custom',name:'كولينز غاب — سجل بيرس',lat:35.6,lon:-83.5,elevation:1500,zone:'America/New_York'},method:'eye',equipment:'العين المجردة',event:'أول رؤية مسجلة'},
 {id:'stamm',name:'جيم ستام',place:'توسان، أريزونا، الولايات المتحدة',time:'2012-03-23T01:54:00Z',loc:{id:'custom',name:'توسان — سجل ستام',lat:32.4322,lon:-110.9808,elevation:876,zone:'America/Phoenix'},method:'optical',equipment:'تلسكوب قطره ٨ بوصات',event:'آخر رؤية مسجلة'}
];
function updateRecord(){const r=records.find(r=>r.loc.lat===state.loc.lat&&r.loc.lon===state.loc.lon&&C.dateISO(new Date(r.time),r.loc.zone)===state.date);$('lunarSample').value=r?.id||'';$('lunarRecordStatus').textContent=r?'يوجد سجل مشاهدة منشور لهذا الموقع والتاريخ؛ تفاصيله أدناه.':'لا يوجد سجل ميداني مضاف لهذا الموقع والتاريخ. الحساب أعلاه ليس سجل مشاهدة.';$('lunarRecordDetail').innerHTML=r?`<dl class="lunar-values"><div><dt>الراصد</dt><dd>${r.name}</dd></div><div><dt>الموقع</dt><dd>${r.place}</dd></div><div><dt>الإحداثيات</dt><dd><bdi>${r.loc.lat}, ${r.loc.lon}</bdi></dd></div><div><dt>الارتفاع</dt><dd>${fmt(r.loc.elevation,0)} متر</dd></div><div><dt>${r.event}</dt><dd>${C.dateISO(new Date(r.time),r.loc.zone)} — <bdi>${clock(new Date(r.time),r.loc.zone)}</bdi> محليًا</dd></div><div><dt>الوقت العالمي UTC</dt><dd><bdi>${r.time.replace('T',' ').replace(':00Z','')}</bdi></dd></div><div><dt>الوسيلة</dt><dd>${r.equipment}</dd></div><div><dt>النتيجة بحسب المصدر</dt><dd>رُصد الهلال</dd></div></dl><a href="https://astronomycenter.net/record.html?l=en" target="_blank" rel="noopener">السجل المنشور لدى مركز الفلك الدولي ↗</a>`:'';}
$('lunarSample').addEventListener('change',()=>safely(()=>{const r=records.find(r=>r.id===$('lunarSample').value);if(!r)return;stop();state.loc={...r.loc};state.method=r.method;state.obstruction=0;$('lunarMethod').value=r.method;$('lunarObstruction').value=0;$('lunarObstructionLabel').textContent='٠°';state.date=C.dateISO(new Date(r.time),r.loc.zone);$('lunarDate').value=state.date;setFields();const start=C.dayBounds(state.date,r.loc.zone).start;state.minute=Math.round((Date.parse(r.time)-start)/60000);recalculate();focus();}));
function stop(){state.playing=false;clearInterval(timer);$('lunarPlay').textContent='▶';$('lunarPlay').setAttribute('aria-pressed','false');$('lunarPlay').setAttribute('aria-label','تشغيل حركة اليوم');}
let timer;
$('lunarPlay').addEventListener('click',()=>{if(state.playing){stop();drawCompare();return;}state.playing=true;$('lunarPlay').textContent='Ⅱ';$('lunarPlay').setAttribute('aria-pressed','true');$('lunarPlay').setAttribute('aria-label','إيقاف حركة اليوم');timer=setInterval(()=>{if(document.hidden||!$('celestial-moon').classList.contains('active')){stop();return;}if(state.minute>=+$('lunarTime').max){state.minute=+$('lunarTime').max;stop();drawCompare();return;}state.minute=Math.min(state.minute+4,+$('lunarTime').max);safely(update);},180);});
$('lunarTime').addEventListener('input',()=>{stop();state.minute=+$('lunarTime').value;safely(update);});$('lunarTime').addEventListener('change',()=>safely(drawCompare));
$('lunarClock').addEventListener('change',()=>safely(()=>{stop();const v=$('lunarClock').value;if(!v)throw Error('أدخل وقتًا صحيحًا.');const [h,m]=v.split(':').map(Number),d=C.localDate(state.date,h*60+m,state.loc.zone);state.minute=Math.round((d-state.data.start)/60000);update();drawCompare();}));
$('lunarDate').addEventListener('change',()=>safely(()=>{stop();state.date=$('lunarDate').value;recalculate();}));city.addEventListener('change',()=>safely(()=>{stop();const c=cities.find(c=>c.id===city.value);state.loc=c?{...c}:{...state.loc,id:'custom',name:'موقع مخصص'};setFields();recalculate();}));
for(const [id,key] of [['lunarLat','lat'],['lunarLon','lon'],['lunarElevation','elevation']])$(id).addEventListener('change',()=>safely(()=>{stop();if(!$(id).value||!$(id).checkValidity())throw Error('أدخل قيمة صحيحة ضمن النطاق الموضح.');state.loc={...state.loc,id:'custom',name:'موقع مخصص',[key]:+$(id).value};city.value='custom';recalculate();}));
$('lunarZone').addEventListener('change',()=>safely(()=>{stop();state.loc.zone=$('lunarZone').value;recalculate();}));$('lunarNow').addEventListener('click',()=>safely(()=>{stop();now();}));
$('lunarObstruction').addEventListener('input',()=>{state.obstruction=+$('lunarObstruction').value;$('lunarObstructionLabel').textContent=fmt(state.obstruction)+'°';});$('lunarObstruction').addEventListener('change',()=>safely(recalculate));
$('lunarMethod').addEventListener('change',()=>{state.method=$('lunarMethod').value;updateEvening();});$('lunarBest').addEventListener('click',()=>safely(()=>{stop();if(!state.data.best)return;const best=state.data.best,iso=C.dateISO(best,state.loc.zone);if(iso!==state.date){state.date=iso;$('lunarDate').value=iso;recalculate();}state.minute=Math.floor((best-state.data.start)/60000);update();focus();drawCompare();}));
$('lunarGeolocate').addEventListener('click',()=>{if(!navigator.geolocation){error('تحديد الموقع غير مدعوم؛ أدخل الإحداثيات يدويًا.');return;}const b=$('lunarGeolocate');b.disabled=true;b.textContent='جارٍ تحديد الموقع…';navigator.geolocation.getCurrentPosition(p=>{b.disabled=false;b.textContent='استخدم موقعي';safely(()=>{stop();state.loc={id:'custom',name:'موقعي',lat:p.coords.latitude,lon:p.coords.longitude,elevation:Math.max(-500,Math.min(9000,p.coords.altitude??0)),zone:Intl.DateTimeFormat().resolvedOptions().timeZone};if(!zones.includes(state.loc.zone))$('lunarZone').add(new Option(state.loc.zone,state.loc.zone));setFields();now();});},()=>{b.disabled=false;b.textContent='استخدم موقعي';error('تعذّر تحديد موقعك. اسمح بالوصول إلى الموقع أو أدخل الإحداثيات يدويًا.');},{timeout:12000,maximumAge:60000});});
for(const b of document.querySelectorAll('[data-lunar-view]'))b.addEventListener('click',()=>{state.view=b.dataset.lunarView;document.querySelectorAll('[data-lunar-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('lunarViewNote').textContent=state.view==='dome'?'قبة السماء حول الراصد • اسحب للدوران':'من موقع الراصد • اسحب أفقيًا لتغيير الاتجاه';focus();});
$('lunarFocus').addEventListener('click',focus);$('lunarTrueScale').addEventListener('change',()=>{state.trueScale=$('lunarTrueScale').checked;$('lunarScaleNote').textContent=state.trueScale?'الحجم الزاوي نسبةً للقبة • الحلقة لتحديد الموضع':'حجم القمر والشمس مكبّر للتوضيح';drawScene();});
for(const b of document.querySelectorAll('[data-lunar-measure]'))b.addEventListener('click',()=>{state.measure=state.measure===b.dataset.lunarMeasure?null:b.dataset.lunarMeasure;document.querySelectorAll('[data-lunar-measure]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.lunarMeasure===state.measure)));$('lunarMeasureNote').textContent=state.measure==='alt'?'الارتفاع: الزاوية من الأفق إلى مركز القمر، سالبة تحت الأفق.':state.measure==='az'?'السمت: الزاوية من الشمال نحو الشرق، من ٠° إلى ٣٦٠°.':'المس الارتفاع أو السمت لعرض زاويته على المجسم.';if(state.view==='eye'){document.querySelector('[data-lunar-view="dome"]').click();}drawScene();});
$('lunarPin').addEventListener('click',()=>safely(()=>{if(state.pins.length>=5)throw Error('يمكن مقارنة خمسة مواقع؛ احذف موقعًا لإضافة آخر.');if(!state.pins.some(l=>l.lat===state.loc.lat&&l.lon===state.loc.lon))state.pins.push({...state.loc});drawCompare();}));
$('lunarMap').closest('details').addEventListener('toggle',e=>{if(e.currentTarget.open){loadLand();drawCompare();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
addEventListener('calendar-location',event=>{state.loc={...event.detail,id:'custom'};setFields();safely(now);});
addEventListener('calendar-hour-cycle',()=>safely(recalculate));
window.lunarTracker={activate(){if(!renderer&&!$('lunarCanvas').hidden){initScene();updatePath();}drawScene();},stop};
document.querySelectorAll('[data-moon-info-tab]').forEach(button=>button.addEventListener('click',()=>setMoonInfoTab(button.dataset.moonInfoTab)));
renderMoonMansions();
setFields();safely(now);if($('celestial-moon').classList.contains('active'))window.lunarTracker.activate();
