import * as THREE from './vendor/three.module.min.js';

const root=document.getElementById('moonMonthModel');
if(root){
  const A=globalThis.Astronomy,Z=globalThis.ZodiacCalc,D=globalThis.ZodiacData;
  const $=id=>document.getElementById(id),deg=Math.PI/180,AU_IN_EARTH_RADII=149597870.7/6378.137;
  const cities=[
    ['saved','موقعي المحفوظ'],['makkah','مكة المكرمة',21.3891,39.8579,277,'Asia/Riyadh'],['medina','المدينة المنورة',24.5247,39.5692,620,'Asia/Riyadh'],['sudair','حوطة سدير',25.4376,45.5487,915,'Asia/Riyadh'],['riyadh','الرياض',24.7136,46.6753,612,'Asia/Riyadh'],['cairo','القاهرة',30.0444,31.2357,23,'Africa/Cairo'],['london','لندن',51.5074,-.1278,11,'Europe/London']
  ];
  const cityById=new Map(cities.map(([id,name,lat,lon,elevation,zone])=>[id,{id,name,lat,lon,elevation,zone}]));
  const constellationNames={Ari:'الحمل',Tau:'الثور',Gem:'التوأمان',Cnc:'السرطان',Leo:'الأسد',Vir:'العذراء',Lib:'الميزان',Sco:'العقرب',Oph:'الحواء',Sgr:'القوس',Cap:'الجدي',Aqr:'الدلو',Psc:'الحوت',Cet:'قيطس',Ori:'الجبار'};
  const starLabels={8903:'الشرطان',17702:'الثريا',21421:'الدبران',49669:'قلب الأسد',65474:'السماك الأعزل',80763:'قلب العقرب',90185:'النجم القوسي',113368:'فم الحوت'};
  const digits=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
  const number=n=>new Intl.NumberFormat('ar-u-nu-arab',{maximumFractionDigits:1}).format(n);
  const dateFormatter=new Intl.DateTimeFormat('ar-u-ca-gregory',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
  const state={view:'observer',day:1,days:30,playing:false,lastTick:0,frame:null,date:null,loc:null,moonLocal:null,moonOrbit:null,localDaily:[],daily:[],orbital:[],cacheKey:'',yaw:0,pitch:.35,orbitYaw:.55,orbitPitch:.38,drag:null};
  const canvas=$('moonMonthCanvas'),stage=$('moonMonthStage'),labelsLayer=$('moonMonthLabels'),fallback=$('moonMonthFallback');
  const labels=[];

  function localToUtc(year,month,day,hour,minute,zone){
    const wanted=Date.UTC(year,month-1,day,hour,minute);
    let guess=new Date(wanted);
    for(let i=0;i<3;i++){
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(guess);
      const read=Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,+p.value]));
      guess=new Date(+guess+(wanted-Date.UTC(read.year,read.month-1,read.day,read.hour,read.minute)));
    }
    return guess;
  }
  function selectedLocation(){
    const item=cityById.get($('moonMonthCity').value);
    if(item?.id!=='saved')return item;
    const loc=globalThis.CalendarCore?.location||{};
    return {id:'saved',name:'موقعي المحفوظ',lat:+loc.lat||21.3891,lon:+loc.lon||39.8579,elevation:+loc.elevation||0,zone:loc.zone||'Asia/Riyadh'};
  }
  function selectedDate(day=state.day){
    const [year,month]=$('moonMonthMonth').value.split('-').map(Number);
    const [hour,minute]=$('moonMonthTime').value.split(':').map(Number);
    return localToUtc(year,month,day,hour,minute,state.loc.zone);
  }
  function vectorFromLocal(point,radius){return new THREE.Vector3(point[0],point[2],-point[1]).multiplyScalar(radius);}
  function vectorFromEquatorial(ra,dec,radius){const c=Math.cos(dec*deg);return new THREE.Vector3(c*Math.cos(ra*deg),Math.sin(dec*deg),-c*Math.sin(ra*deg)).multiplyScalar(radius);}
  function vectorFromAstro(v,scale=1){return new THREE.Vector3(v.x,v.z,-v.y).multiplyScalar(scale);}
  function setGeometry(object,points){object.geometry.dispose();object.geometry=new THREE.BufferGeometry().setFromPoints(points);}
  function line(points,color,opacity=1){return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));}
  function addLabel(text,getPosition,priority=2,visible=()=>true){const el=document.createElement('span');el.className='moon-month-label';el.textContent=text;labels.push({el,getPosition,priority,visible});labelsLayer.append(el);}
  function bodyLocal(name,frame){return vectorFromLocal(Z.body(name,frame).p,75);}
  function styleLabels(){for(const label of labels)label.el.hidden=true;}

  function startCanvasFallback(){
    if(!A||!Z||!D){fallback.hidden=false;return;}
    const citySelect=$('moonMonthCity');
    if(!citySelect.options.length)for(const [id,name] of cities)citySelect.add(new Option(name,id));
    if(!$('moonMonthMonth').value){const now=new Date();$('moonMonthMonth').value=`${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;}
    const oldCanvas=$('moonMonthCanvas'),flatCanvas=document.createElement('canvas');
    flatCanvas.id='moonMonthCanvas';flatCanvas.setAttribute('aria-label','خريطة سماء تفاعلية للقمر والنجوم؛ اسحب لتغيير الاتجاه');oldCanvas.replaceWith(flatCanvas);
    const ctx=flatCanvas.getContext('2d');if(!ctx){fallback.hidden=false;return;}
    labelsLayer.hidden=true;fallback.hidden=true;
    const flat={view:'observer',day:1,days:30,loc:null,date:null,frame:null,daily:[],orbit:[],yaw:0,orbitYaw:0,playing:false,lastTick:0,drag:null};
    const starCatalog=D.stars.filter(star=>star.mag<=5.3),namedStars=Object.entries(starLabels).map(([hip,name])=>({star:D.stars.find(item=>item.hip===+hip),name})).filter(item=>item.star);
    const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
    const location=()=>selectedLocation();
    const dateAt=day=>{const [year,month]=$('moonMonthMonth').value.split('-').map(Number),[hour,minute]=$('moonMonthTime').value.split(':').map(Number);return localToUtc(year,month,day,hour,minute,flat.loc.zone);};
    const moonAt=day=>{const date=dateAt(day),frame=Z.frame(date,flat.loc);return {...Z.body('Moon',frame),date,frame};};
    const rotate=(x,y,angle)=>[x*Math.cos(angle)-y*Math.sin(angle),x*Math.sin(angle)+y*Math.cos(angle)];
    function resize(){const ratio=Math.min(devicePixelRatio||1,2),width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);flatCanvas.width=Math.round(width*ratio);flatCanvas.height=Math.round(height*ratio);flatCanvas.style.width=width+'px';flatCanvas.style.height=height+'px';ctx.setTransform(ratio,0,0,ratio,0,0);draw();}
    function skyPoint(altitude,azimuth,width,height){const side=Math.min(width,height),reveal=$('moonMonthBelow').checked,base=side*(reveal ? .29 : .43),radius=base*(1-altitude/90),angle=(azimuth+flat.yaw)*deg;return {x:width/2+radius*Math.sin(angle),y:height/2-radius*Math.cos(angle),radius,inside:reveal||altitude>=0};}
    function text(label,x,y,color='#dff4ff',size=11){ctx.fillStyle=color;ctx.font=`${size}px Tajawal, Arial, sans-serif`;ctx.textAlign='center';ctx.direction='rtl';ctx.fillText(label,x,y);}
    function circle(x,y,r,fill,stroke){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
    function drawMoon(point,illumination){const radius=flat.view==='observer'?12:($('moonMonthScale').checked?1737.4/149597870.7*flat.orbitScale:10);circle(point.x,point.y,radius,'#eaf3ff','#ffffff');ctx.save();ctx.beginPath();ctx.arc(point.x,point.y,radius,0,Math.PI*2);ctx.clip();ctx.globalAlpha=clamp(1-illumination,0,.96);ctx.fillStyle='#06101d';ctx.fillRect(point.x-radius,point.y-radius,radius*2,radius*2);ctx.restore();}
    function drawObserver(width,height){
      ctx.fillStyle='#07111f';ctx.fillRect(0,0,width,height);const side=Math.min(width,height),reveal=$('moonMonthBelow').checked,base=side*(reveal ? .29 : .43),center={x:width/2,y:height/2};
      ctx.beginPath();ctx.arc(center.x,center.y,base,0,Math.PI*2);ctx.fillStyle='rgba(16,49,73,.28)';ctx.fill();ctx.strokeStyle='rgba(121,185,214,.7)';ctx.lineWidth=1;ctx.stroke();
      for(const star of starCatalog){const position=Z.star(star,flat.frame),point=skyPoint(position.altitude,position.azimuth,width,height);if(!point.inside||point.x<0||point.x>width||point.y<0||point.y>height)continue;ctx.globalAlpha=position.altitude<0 ? .18 : clamp(1-star.mag*.12,.22,.92);circle(point.x,point.y,Math.max(.7,2.8-star.mag*.26),'#eaf3ff');}ctx.globalAlpha=1;
      ctx.strokeStyle='rgba(107,169,197,.28)';ctx.lineWidth=.8;for(const con of D.constellations)for(const path of con.lines){ctx.beginPath();let started=false;for(const coords of path){const position=Z.point(...coords,flat.frame),point=skyPoint(Z.angles(position).altitude,Z.angles(position).azimuth,width,height);if(!point.inside){started=false;continue;}if(!started){ctx.moveTo(point.x,point.y);started=true;}else ctx.lineTo(point.x,point.y);}ctx.stroke();}
      if($('moonMonthTrail').checked){ctx.strokeStyle='#55d8f2';ctx.lineWidth=1.8;ctx.beginPath();let started=false;flat.daily.forEach(item=>{const point=skyPoint(item.altitude,item.azimuth,width,height);if(!point.inside){started=false;return;}if(!started){ctx.moveTo(point.x,point.y);started=true;}else ctx.lineTo(point.x,point.y);});ctx.stroke();flat.daily.forEach((item,index)=>{if((index%3&&index+1!==flat.day)||!skyPoint(item.altitude,item.azimuth,width,height).inside)return;const point=skyPoint(item.altitude,item.azimuth,width,height);circle(point.x,point.y,index+1===flat.day?4:2.4,index+1===flat.day?'#f6c85f':'#55d8f2');text(digits(index+1),point.x,point.y-7,'#e8f6ff',10);});}
      const sun=Z.body('Sun',flat.frame),sunPoint=skyPoint(sun.altitude,sun.azimuth,width,height);if(sunPoint.inside){circle(sunPoint.x,sunPoint.y,7,'#ffcf70');text('الشمس',sunPoint.x,sunPoint.y-12,'#ffd989',10);}
      const moon=moonAt(flat.day),moonPoint=skyPoint(moon.altitude,moon.azimuth,width,height);if(moonPoint.inside){drawMoon(moonPoint,A.Illumination('Moon',flat.date).phase_fraction);text('القمر',moonPoint.x,moonPoint.y-17,'#eaf6ff',11);}
      for(const item of namedStars){const position=Z.star(item.star,flat.frame),point=skyPoint(position.altitude,position.azimuth,width,height);if(point.inside&&position.altitude>0)text(item.name,point.x,point.y-6,'#bdddf0',9);}
      for(const [label,azimuth] of [['شمال',0],['شرق',90],['جنوب',180],['غرب',270]]){const point=skyPoint(0,azimuth,width,height);text(label,point.x,point.y+14,'#a6c7db',10);}
    }
    function drawOrbit(width,height){
      ctx.fillStyle='#07111f';ctx.fillRect(0,0,width,height);const center={x:width/2,y:height/2},side=Math.min(width,height),scale=side*.31,points=flat.orbit.map(v=>rotate(v.x,v.y,flat.orbitYaw));
      const max=Math.max(...points.map(v=>Math.hypot(...v)),1e-9),toScreen=v=>({x:center.x+v[0]/max*scale,y:center.y-v[1]/max*scale});flat.orbitScale=scale/max;
      for(const star of starCatalog.filter(star=>star.mag<4.5)){const x=((star.ra/360+.5+flat.orbitYaw/(Math.PI*2))%1+1)%1*width,y=height*(.5-star.dec/240);circle(x,y,Math.max(.5,2.5-star.mag*.28),'rgba(234,245,255,.7)');}
      ctx.strokeStyle='rgba(85,216,242,.78)';ctx.lineWidth=1.8;ctx.beginPath();points.forEach((value,index)=>{const point=toScreen(value);if(index)ctx.lineTo(point.x,point.y);else ctx.moveTo(point.x,point.y);});ctx.stroke();
      if($('moonMonthTrail').checked)flat.orbit.filter((_,index)=>index%6===0).forEach((value,index)=>{if(index%3&&index+1!==flat.day)return;const point=toScreen(rotate(value.x,value.y,flat.orbitYaw));circle(point.x,point.y,index+1===flat.day?4:2.5,index+1===flat.day?'#f6c85f':'#55d8f2');text(digits(index+1),point.x,point.y-7,'#e8f6ff',10);});
      const earthRadius=$('moonMonthScale').checked?6378.137/149597870.7*flat.orbitScale:19;circle(center.x,center.y,earthRadius,'#237fa7','#70d5f2');text('الأرض',center.x,center.y+earthRadius+15,'#bfe8f7',11);
      const current=toScreen(rotate(flat.orbit[(flat.day-1)*6].x,flat.orbit[(flat.day-1)*6].y,flat.orbitYaw));drawMoon(current,A.Illumination('Moon',flat.date).phase_fraction);text('القمر',current.x,current.y-16,'#eaf6ff',11);
      const sunVector=A.GeoVector('Sun',flat.date,true),sunDirection=rotate(sunVector.x,sunVector.y,flat.orbitYaw),sunLength=Math.hypot(...sunDirection)||1,sun={x:center.x+sunDirection[0]/sunLength*scale*1.45,y:center.y-sunDirection[1]/sunLength*scale*1.45};ctx.strokeStyle='rgba(255,207,112,.44)';ctx.beginPath();ctx.moveTo(center.x,center.y);ctx.lineTo(sun.x,sun.y);ctx.stroke();circle(sun.x,sun.y,10,'#ffcf70');text('الشمس',sun.x,sun.y-16,'#ffd989',10);
    }
    function draw(){const width=stage.clientWidth,height=stage.clientHeight;if(!width||!height||!flat.date)return;ctx.clearRect(0,0,width,height);if(flat.view==='observer')drawObserver(width,height);else drawOrbit(width,height);}
    function update(){
      flat.loc=location();const [year,month]=$('moonMonthMonth').value.split('-').map(Number);flat.days=new Date(Date.UTC(year,month,0)).getUTCDate();flat.day=clamp(flat.day,1,flat.days);$('moonMonthDay').max=flat.days;$('moonMonthDay').value=flat.day;flat.date=dateAt(flat.day);flat.frame=Z.frame(flat.date,flat.loc);
      flat.daily=Array.from({length:flat.days},(_,index)=>moonAt(index+1));flat.orbit=Array.from({length:flat.days*6+1},(_,index)=>{const value=A.GeoVector('Moon',new Date(+dateAt(1)+index*86400000/6),true);return {x:value.x,y:value.y,z:value.z};});
      const moon=Z.body('Moon',flat.frame),sun=Z.body('Sun',flat.frame),observer=new A.Observer(flat.loc.lat,flat.loc.lon,flat.loc.elevation||0),eq=A.Equator('Moon',flat.date,observer,false,true),con=A.Constellation(eq.ra,eq.dec),illumination=A.Illumination('Moon',flat.date).phase_fraction;
      $('moonMonthDate').textContent=dateFormatter.format(new Date(Date.UTC(year,month-1,flat.day)));$('moonMonthDayValue').textContent=`${digits(flat.day)} / ${digits(flat.days)}`;$('moonMonthReadout').textContent=`القمر ${number(moon.altitude)}° · ${moon.altitude>=0?'فوق الأفق':'تحت الأفق'}`;
      $('moonMonthStatus').textContent=`عرض متوافق مع الهاتف · كوكبة القمر: ${constellationNames[con.symbol]||con.name} · الجزء المضاء ${number(illumination*100)}٪ · الشمس ${sun.altitude>0?'فوق الأفق':'تحت الأفق'} · المواضع عند الساعة المحلية نفسها.`;$('moonMonthScaleLabel').textContent=$('moonMonthScale').checked?'أحجام الأجرام والمدار بمقياس واحد':'الأرض والقمر مكبّران للتوضيح';resize();
    }
    function stop(){flat.playing=false;$('moonMonthPlay').textContent='▶';$('moonMonthPlay').setAttribute('aria-pressed','false');}
    function step(by){stop();flat.day=clamp(flat.day+by,1,flat.days);$('moonMonthDay').value=flat.day;update();}
    function animate(now){if(!flat.playing||!root.isConnected)return;if(now-flat.lastTick>850){flat.lastTick=now;if(flat.day>=flat.days){stop();return}flat.day++;$('moonMonthDay').value=flat.day;update();}requestAnimationFrame(animate);}
    $('moonMonthPrev').onclick=()=>step(-1);$('moonMonthNext').onclick=()=>step(1);$('moonMonthPlay').onclick=()=>{if(flat.playing){stop();return}if(flat.day>=flat.days)flat.day=1;flat.playing=true;flat.lastTick=performance.now();$('moonMonthPlay').textContent='Ⅱ';$('moonMonthPlay').setAttribute('aria-pressed','true');update();requestAnimationFrame(animate);};
    $('moonMonthDay').addEventListener('input',()=>{stop();flat.day=+$('moonMonthDay').value;update();});for(const id of ['moonMonthCity','moonMonthMonth','moonMonthTime','moonMonthTrack','moonMonthTrail','moonMonthBelow','moonMonthScale'])$(id).addEventListener('change',()=>{stop();update();});
    root.querySelectorAll('[data-moon-month-view]').forEach(button=>button.addEventListener('click',()=>{stop();flat.view=button.dataset.moonMonthView;root.querySelectorAll('[data-moon-month-view]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});update();}));
    flatCanvas.addEventListener('pointerdown',event=>{if(flat.view==='observer'&&$('moonMonthTrack').checked)$('moonMonthTrack').checked=false;flat.drag={x:event.clientX,y:event.clientY};flatCanvas.setPointerCapture(event.pointerId);});flatCanvas.addEventListener('pointermove',event=>{if(!flat.drag)return;const dx=event.clientX-flat.drag.x;flat.drag={x:event.clientX,y:event.clientY};if(flat.view==='observer')flat.yaw-=dx*.35;else flat.orbitYaw-=dx*.008;draw();});flatCanvas.addEventListener('pointerup',()=>flat.drag=null);flatCanvas.addEventListener('pointercancel',()=>flat.drag=null);
    if(globalThis.ResizeObserver)new ResizeObserver(resize).observe(stage);
    update();root.dataset.moonModelReady='true';globalThis.moonMonthModel={activate:update};
  }

  function initialize(){
    if(!A||!Z||!D)throw new Error('Astronomy data unavailable');
    for(const [id,name] of cities)$('moonMonthCity').add(new Option(name,id));
    const now=new Date(),month=`${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;
    $('moonMonthMonth').value=month;
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setClearColor(0x07111f,1);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(55,1,.04,13000);
    const ambient=new THREE.AmbientLight(0xffffff,.09),sunLight=new THREE.DirectionalLight(0xffffff,2.2);
    scene.add(ambient,sunLight);
    const observerGroup=new THREE.Group(),orbitGroup=new THREE.Group();scene.add(observerGroup,orbitGroup);
    const ground=new THREE.Mesh(new THREE.CircleGeometry(110,128),new THREE.MeshBasicMaterial({color:0x06101d,transparent:true,opacity:.92,depthWrite:false,side:THREE.DoubleSide}));ground.rotation.x=-Math.PI/2;observerGroup.add(ground);
    const horizon=line(Array.from({length:161},(_,i)=>new THREE.Vector3(100*Math.cos(i*Math.PI/80),0,100*Math.sin(i*Math.PI/80))),0x79b9d6,.48);observerGroup.add(horizon);
    const earth=new THREE.Mesh(new THREE.SphereGeometry(1,48,32),new THREE.MeshLambertMaterial({color:0x237fa7}));orbitGroup.add(earth);
    const observerMarker=new THREE.Mesh(new THREE.SphereGeometry(.22,14,10),new THREE.MeshBasicMaterial({color:0xf6c85f}));orbitGroup.add(observerMarker);
    const moon=new THREE.Mesh(new THREE.SphereGeometry(1,48,32),new THREE.MeshLambertMaterial({color:0xeaf3ff}));scene.add(moon);
    const sun=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),new THREE.MeshBasicMaterial({color:0xffcf70}));scene.add(sun);
    const observerPath=line([],0x55d8f2,.82),orbitPath=line([],0x55d8f2,.78);
    const dayPoints=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:0xf6c85f,size:5,sizeAttenuation:false,transparent:true,opacity:.95}));scene.add(observerPath,orbitPath,dayPoints);
    const stars=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:0xeaf5ff,size:2.2,sizeAttenuation:false,transparent:true,opacity:.85,depthWrite:false}));
    const constellations=new THREE.LineSegments(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x6ba9c5,transparent:true,opacity:.2,depthWrite:false}));scene.add(stars,constellations);
    const starCatalog=D.stars.filter(star=>star.mag<=5.6);
    const dragStart=()=>{if(state.view==='observer'&&$('moonMonthTrack').checked)$('moonMonthTrack').checked=false;};
    const namedStars=Object.entries(starLabels).map(([hip,name])=>({star:D.stars.find(st=>st.hip===+hip),name})).filter(item=>item.star);

    addLabel('القمر',()=>moon.position.clone().add(new THREE.Vector3(0,moon.scale.x+1.3,0)),0,()=>moon.visible);
    addLabel('الشمس',()=>sun.position.clone().add(new THREE.Vector3(0,sun.scale.x+1.2,0)),1);
    addLabel('الأرض',()=>new THREE.Vector3(0,-earth.scale.x-2,0),0,()=>state.view==='orbit');
    addLabel('الرائي',()=>observerMarker.position.clone().add(new THREE.Vector3(0,1.6,0)),1,()=>state.view==='orbit');
    for(const item of namedStars)addLabel(item.name,()=>state.view==='observer'?vectorFromLocal(Z.star(item.star,state.frame).p,80):vectorFromEquatorial(item.star.ra,item.star.dec,10000),4);
    for(let i=0;i<31;i++)addLabel(digits(i+1),()=>state.daily[i]?.clone().add(new THREE.Vector3(0,1.2,0))||new THREE.Vector3(),3,()=>$('moonMonthTrail').checked&&i<state.days&&(i%3===0||i+1===state.day));
    for(const [name,vector] of [['شمال',new THREE.Vector3(0,0,-72)],['شرق',new THREE.Vector3(72,0,0)],['جنوب',new THREE.Vector3(0,0,72)],['غرب',new THREE.Vector3(-72,0,0)]])addLabel(name,()=>vector,2,()=>state.view==='observer');

    function updateStarField(){
      const starPositions=[],linePositions=[];
      if(state.view==='observer'){
        for(const star of starCatalog)starPositions.push(vectorFromLocal(Z.star(star,state.frame).p,100));
        for(const con of D.constellations)for(const path of con.lines)for(let i=1;i<path.length;i++)linePositions.push(vectorFromLocal(Z.point(...path[i-1],state.frame),99.5),vectorFromLocal(Z.point(...path[i],state.frame),99.5));
      }else{
        for(const star of starCatalog)starPositions.push(vectorFromEquatorial(star.ra,star.dec,10000));
        for(const con of D.constellations)for(const path of con.lines)for(let i=1;i<path.length;i++)linePositions.push(vectorFromEquatorial(...path[i-1],9900),vectorFromEquatorial(...path[i],9900));
      }
      setGeometry(stars,starPositions);setGeometry(constellations,linePositions);
    }
    function calculatePaths(){
      const key=[$('moonMonthMonth').value,$('moonMonthTime').value,$('moonMonthCity').value,state.loc.lat,state.loc.lon,state.loc.zone].join('|');
      if(key===state.cacheKey)return;
      state.cacheKey=key;
      const [year,month]=$('moonMonthMonth').value.split('-').map(Number);state.days=new Date(Date.UTC(year,month,0)).getUTCDate();
      $('moonMonthDay').max=state.days;state.day=Math.min(state.day,state.days);$('moonMonthDay').value=state.day;
      const observer=new A.Observer(state.loc.lat,state.loc.lon,state.loc.elevation||0);
      state.localDaily=Array.from({length:state.days},(_,index)=>{
        const date=selectedDate(index+1),frame=Z.frame(date,state.loc);return vectorFromLocal(Z.body('Moon',frame).p,76);
      });
      const start=selectedDate(1),steps=state.days*6;
      state.orbital=Array.from({length:steps+1},(_,index)=>vectorFromAstro(A.GeoVector('Moon',new Date(+start+index*86400000/6),true),AU_IN_EARTH_RADII));
      setGeometry(orbitPath,state.orbital);
    }
    function update(){
      state.loc=selectedLocation();calculatePaths();state.date=selectedDate(state.day);state.frame=Z.frame(state.date,state.loc);
      const observer=new A.Observer(state.loc.lat,state.loc.lon,state.loc.elevation||0);
      const moonData=Z.body('Moon',state.frame),sunData=Z.body('Sun',state.frame);
      const moonVector=A.GeoVector('Moon',state.date,true),sunVector=A.GeoVector('Sun',state.date,true);
      const isObserver=state.view==='observer',trueScale=$('moonMonthScale').checked;
      state.moonLocal=vectorFromLocal(moonData.p,76);state.moonOrbit=vectorFromAstro(moonVector,AU_IN_EARTH_RADII);
      moon.position.copy(isObserver?state.moonLocal:state.moonOrbit);moon.scale.setScalar(isObserver?1.8:(trueScale?1737.4/6378.137:1.45));
      sun.position.copy(isObserver?bodyLocal('Sun',state.frame):vectorFromAstro(sunVector).normalize().multiplyScalar(170));sun.scale.setScalar(isObserver?2.2:4.5);sunLight.position.copy(sun.position).normalize().multiplyScalar(6000);
      earth.visible=observerMarker.visible=!isObserver;earth.scale.setScalar(trueScale?1:2.7);
      const observerVector=vectorFromAstro(A.ObserverVector(state.date,observer,false),AU_IN_EARTH_RADII).normalize();observerMarker.position.copy(observerVector.multiplyScalar(earth.scale.x+.3));
      observerGroup.visible=isObserver;orbitGroup.visible=!isObserver;
      const path=isObserver?state.localDaily:state.orbital.filter((_,index)=>index%6===0);
      state.daily=path.map(point=>point.clone());
      setGeometry(observerPath,state.daily);setGeometry(dayPoints,state.daily);
      observerPath.visible=isObserver&&$('moonMonthTrail').checked;orbitPath.visible=!isObserver;dayPoints.visible=$('moonMonthTrail').checked;
      ground.material.opacity=$('moonMonthBelow').checked ? .15 : .93;
      ground.material.depthWrite=!$('moonMonthBelow').checked;
      moon.visible=!isObserver||$('moonMonthBelow').checked||moonData.altitude>=0;
      updateStarField();updateCamera();updateText(moonData,sunData);draw();
    }
    function updateText(moonData,sunData){
      const eq=A.Equator('Moon',state.date,new A.Observer(state.loc.lat,state.loc.lon,state.loc.elevation||0),false,true),con=A.Constellation(eq.ra,eq.dec),illumination=A.Illumination('Moon',state.date).phase_fraction;
      const [year,month]=$('moonMonthMonth').value.split('-').map(Number);
      $('moonMonthDate').textContent=dateFormatter.format(new Date(Date.UTC(year,month-1,state.day)));
      $('moonMonthDayValue').textContent=`${digits(state.day)} / ${digits(state.days)}`;
      $('moonMonthReadout').textContent=`القمر ${number(moonData.altitude)}° · ${moonData.altitude>=0?'فوق الأفق':'تحت الأفق'}`;
      $('moonMonthStatus').textContent=`كوكبة القمر: ${constellationNames[con.symbol]||con.name} · الجزء المضاء ${number(illumination*100)}٪ · الشمس ${sunData.altitude>0?'فوق الأفق':'تحت الأفق'} · المواضع المعروضة عند الساعة المحلية نفسها.`;
      $('moonMonthScaleLabel').textContent=$('moonMonthScale').checked?'أحجام الأجرام والمدار بمقياس واحد':'الأرض والقمر مكبّران للتوضيح';
    }
    function updateCamera(){
      if(state.view==='observer'){
        const eye=new THREE.Vector3(0,1.15,0);camera.position.copy(eye);camera.up.set(0,1,0);
        let direction;
        if($('moonMonthTrack').checked)direction=moon.position.clone().sub(eye).normalize();
        else direction=new THREE.Vector3(Math.sin(state.yaw)*Math.cos(state.pitch),Math.sin(state.pitch),-Math.cos(state.yaw)*Math.cos(state.pitch));
        camera.lookAt(eye.clone().add(direction));
      }else{
        const radius=stage.clientWidth<540?130:155;camera.up.set(0,1,0);camera.position.set(radius*Math.cos(state.orbitPitch)*Math.cos(state.orbitYaw),radius*Math.sin(state.orbitPitch),radius*Math.cos(state.orbitPitch)*Math.sin(state.orbitYaw));camera.lookAt(0,0,0);
      }
      camera.updateMatrixWorld();
    }
    function draw(){
      renderer.render(scene,camera);styleLabels();
      const width=stage.clientWidth,height=stage.clientHeight,occupied=[];
      for(const item of [...labels].sort((a,b)=>a.priority-b.priority)){
        if(!item.visible())continue;const point=item.getPosition().project(camera);
        if(point.z>1||point.z<-1||Math.abs(point.x)>.96||Math.abs(point.y)>.94)continue;
        const x=(point.x+1)*width/2,y=(1-point.y)*height/2,box={l:x-item.el.offsetWidth/2-3,r:x+item.el.offsetWidth/2+3,t:y-item.el.offsetHeight/2-3,b:y+item.el.offsetHeight/2+3};
        if(box.l<0||box.r>width||box.t<0||box.b>height||occupied.some(other=>box.l<other.r&&box.r>other.l&&box.t<other.b&&box.b>other.t))continue;
        occupied.push(box);item.el.style.left=x+'px';item.el.style.top=y+'px';item.el.hidden=false;
      }
    }
    function resize(){const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();if(state.date){updateCamera();draw();}}
    function stop(){state.playing=false;$('moonMonthPlay').textContent='▶';$('moonMonthPlay').setAttribute('aria-pressed','false');}
    function step(by){stop();state.day=Math.max(1,Math.min(state.days,state.day+by));$('moonMonthDay').value=state.day;update();}
    function animate(now){if(!state.playing||!root.isConnected)return;if(now-state.lastTick>850){state.lastTick=now;if(state.day>=state.days){stop();return}state.day++;$('moonMonthDay').value=state.day;update();}requestAnimationFrame(animate);}
    $('moonMonthPrev').onclick=()=>step(-1);$('moonMonthNext').onclick=()=>step(1);
    $('moonMonthPlay').onclick=()=>{if(state.playing){stop();return}if(state.day>=state.days)state.day=1;state.playing=true;state.lastTick=performance.now();$('moonMonthPlay').textContent='Ⅱ';$('moonMonthPlay').setAttribute('aria-pressed','true');update();requestAnimationFrame(animate);};
    $('moonMonthDay').addEventListener('input',()=>{stop();state.day=+$('moonMonthDay').value;update();});
    for(const id of ['moonMonthCity','moonMonthMonth','moonMonthTime','moonMonthTrack','moonMonthTrail','moonMonthBelow','moonMonthScale'])$(id).addEventListener('change',()=>{stop();update();});
    root.querySelectorAll('[data-moon-month-view]').forEach(button=>button.addEventListener('click',()=>{stop();state.view=button.dataset.moonMonthView;root.querySelectorAll('[data-moon-month-view]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});update();}));
    canvas.addEventListener('pointerdown',event=>{dragStart();state.drag={x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);});
    canvas.addEventListener('pointermove',event=>{if(!state.drag)return;const dx=event.clientX-state.drag.x,dy=event.clientY-state.drag.y;state.drag={x:event.clientX,y:event.clientY};if(state.view==='observer'){state.yaw-=dx*.005;state.pitch=THREE.MathUtils.clamp(state.pitch+dy*.005,-1.4,1.4);}else{state.orbitYaw-=dx*.006;state.orbitPitch=THREE.MathUtils.clamp(state.orbitPitch+dy*.006,-1.4,1.4);}updateCamera();draw();});
    canvas.addEventListener('pointerup',()=>state.drag=null);canvas.addEventListener('pointercancel',()=>state.drag=null);
    if(globalThis.ResizeObserver)new ResizeObserver(resize).observe(stage);
    update();resize();fallback.hidden=true;
    root.dataset.moonModelReady='true';
    globalThis.moonMonthModel={activate:()=>{resize();update();}};
  }
  try{initialize();}catch(error){console.error(error);try{startCanvasFallback();}catch(fallbackError){console.error(fallbackError);fallback.hidden=false;}}
}
