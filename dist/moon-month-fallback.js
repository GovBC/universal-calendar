/* A WebGL-free renderer for the monthly Moon model. It is deliberately a
   classic script so it can run even when module or GPU support is unavailable. */
(()=>{
  'use strict';
  const waitForPage=()=>new Promise(resolve=>{
    if(document.readyState==='complete')resolve();
    else globalThis.addEventListener('load',resolve,{once:true});
  });
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const digits=value=>String(value).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const cityRows=[
    ['saved','موقعي المحفوظ'],
    ['makkah','مكة المكرمة',21.3891,39.8579,277,'Asia/Riyadh'],
    ['medina','المدينة المنورة',24.5247,39.5692,620,'Asia/Riyadh'],
    ['sudair','حوطة سدير',25.4376,45.5487,915,'Asia/Riyadh'],
    ['riyadh','الرياض',24.7136,46.6753,612,'Asia/Riyadh'],
    ['cairo','القاهرة',30.0444,31.2357,23,'Africa/Cairo'],
    ['london','لندن',51.5074,-.1278,11,'Europe/London']
  ];
  const cities=new Map(cityRows.map(row=>[row[0],{id:row[0],name:row[1],lat:row[2],lon:row[3],elevation:row[4],zone:row[5]}]));
  const constellationNames={Ari:'الحمل',Tau:'الثور',Gem:'التوأمان',Cnc:'السرطان',Leo:'الأسد',Vir:'العذراء',Lib:'الميزان',Sco:'العقرب',Oph:'الحواء',Sgr:'القوس',Cap:'الجدي',Aqr:'الدلو',Psc:'الحوت'};

  async function boot(){
    await waitForPage();
    await delay(750);
    const root=document.getElementById('moonMonthModel');
    if(!root||root.dataset.moonModelReady||root.dataset.moonFlatReady)return;
    const A=globalThis.Astronomy,Z=globalThis.ZodiacCalc,D=globalThis.ZodiacData;
    if(!A||!Z||!D){
      const retry=+root.dataset.moonFallbackRetries||0;
      if(retry<8){root.dataset.moonFallbackRetries=retry+1;setTimeout(boot,350);}
      return;
    }
    try{start(root,A,Z,D);}catch(error){console.error('Moon 2D fallback failed',error);}
  }

  function start(root,A,Z,D){
    if(root.dataset.moonModelReady||root.dataset.moonFlatReady)return;
    const $=id=>document.getElementById(id);
    const stage=$('moonMonthStage'),labels=$('moonMonthLabels'),fallback=$('moonMonthFallback');
    const select=$('moonMonthCity'),monthInput=$('moonMonthMonth'),timeInput=$('moonMonthTime');
    if(!stage||!select||!monthInput||!timeInput)return;
    if(!select.options.length)cityRows.forEach(row=>select.add(new Option(row[1],row[0])));
    if(!monthInput.value){const now=new Date();monthInput.value=`${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;}
    const previous=$('moonMonthCanvas'),canvas=document.createElement('canvas');
    canvas.id='moonMonthCanvas';canvas.tabIndex=0;canvas.setAttribute('aria-label','خريطة سماء تفاعلية للقمر والنجوم؛ اسحب لتغيير الاتجاه');
    previous.replaceWith(canvas);
    const ctx=canvas.getContext('2d');
    if(!ctx)return;
    if(labels)labels.hidden=true;
    if(fallback)fallback.hidden=true;

    const state={view:'observer',day:1,days:30,loc:null,date:null,frame:null,daily:[],orbit:[],yaw:0,orbitYaw:0,drag:null,playing:false,lastTick:0};
    const stars=(D.stars||[]).filter(star=>star.mag<=5.15);
    const formatter=new Intl.DateTimeFormat('ar-u-ca-gregory',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
    const number=value=>new Intl.NumberFormat('ar-u-nu-arab',{maximumFractionDigits:1}).format(value);

    function localToUtc(year,month,day,hour,minute,zone){
      const wanted=Date.UTC(year,month-1,day,hour,minute),format={timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'};
      let guess=new Date(wanted);
      for(let index=0;index<3;index++){
        const parts=new Intl.DateTimeFormat('en-CA',format).formatToParts(guess);
        const read=Object.fromEntries(parts.filter(part=>part.type!=='literal').map(part=>[part.type,+part.value]));
        guess=new Date(+guess+(wanted-Date.UTC(read.year,read.month-1,read.day,read.hour,read.minute)));
      }
      return guess;
    }
    function location(){
      const city=cities.get(select.value);
      if(city&&city.id!=='saved')return city;
      const saved=(globalThis.CalendarCore&&globalThis.CalendarCore.location)||{};
      return {id:'saved',name:'موقعي المحفوظ',lat:+saved.lat||21.3891,lon:+saved.lon||39.8579,elevation:+saved.elevation||0,zone:saved.zone||'Asia/Riyadh'};
    }
    function dateAt(day){
      const parts=monthInput.value.split('-').map(Number),clock=timeInput.value.split(':').map(Number);
      return localToUtc(parts[0],parts[1],day,clock[0]||0,clock[1]||0,state.loc.zone);
    }
    function moonAt(day){const date=dateAt(day),frame=Z.frame(date,state.loc);return {...Z.body('Moon',frame),date,frame};}
    function resize(){
      const ratio=Math.min(globalThis.devicePixelRatio||1,2),width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);
      canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(ratio,0,0,ratio,0,0);draw();
    }
    function point(altitude,azimuth,width,height){
      const side=Math.min(width,height),reveal=$('moonMonthBelow').checked,base=side*(reveal ? .29 : .43),radius=base*(1-altitude/90),angle=(azimuth+state.yaw)*Math.PI/180;
      return {x:width/2+radius*Math.sin(angle),y:height/2-radius*Math.cos(angle),inside:reveal||altitude>=0};
    }
    function circle(x,y,radius,fill,stroke){ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
    function label(text,x,y,color,size){ctx.fillStyle=color||'#dff4ff';ctx.font=`${size||11}px Tajawal,Arial,sans-serif`;ctx.textAlign='center';ctx.direction='rtl';ctx.fillText(text,x,y);}
    function moon(pointValue,illumination,large){
      const radius=large?12:($('moonMonthScale').checked?1737.4/149597870.7*state.orbitScale:10);circle(pointValue.x,pointValue.y,radius,'#eef7ff','#ffffff');
      ctx.save();ctx.beginPath();ctx.arc(pointValue.x,pointValue.y,radius,0,Math.PI*2);ctx.clip();ctx.globalAlpha=clamp(1-illumination,0,.92);ctx.fillStyle='#07111f';ctx.fillRect(pointValue.x-radius,pointValue.y-radius,radius*2,radius*2);ctx.restore();
    }
    function observer(width,height){
      ctx.fillStyle='#07111f';ctx.fillRect(0,0,width,height);
      const side=Math.min(width,height),reveal=$('moonMonthBelow').checked,base=side*(reveal ? .29 : .43),center={x:width/2,y:height/2};
      ctx.beginPath();ctx.arc(center.x,center.y,base,0,Math.PI*2);ctx.fillStyle='rgba(16,49,73,.3)';ctx.fill();ctx.strokeStyle='rgba(121,185,214,.68)';ctx.stroke();
      for(const star of stars){
        const local=Z.star(star,state.frame),p=point(local.altitude,local.azimuth,width,height);
        if(!p.inside||p.x<0||p.x>width||p.y<0||p.y>height)continue;
        ctx.globalAlpha=local.altitude<0 ? .16 : clamp(1-star.mag*.13,.22,.94);circle(p.x,p.y,Math.max(.65,2.6-star.mag*.25),'#eaf5ff');
      }
      ctx.globalAlpha=1;
      if($('moonMonthTrail').checked){
        ctx.beginPath();ctx.strokeStyle='#55d8f2';ctx.lineWidth=1.7;let begun=false;
        state.daily.forEach(item=>{const p=point(item.altitude,item.azimuth,width,height);if(!p.inside){begun=false;return;}if(begun)ctx.lineTo(p.x,p.y);else{ctx.moveTo(p.x,p.y);begun=true;}});ctx.stroke();
        state.daily.forEach((item,index)=>{if(index%3&&index+1!==state.day)return;const p=point(item.altitude,item.azimuth,width,height);if(!p.inside)return;circle(p.x,p.y,index+1===state.day?4:2.3,index+1===state.day?'#f6c85f':'#55d8f2');label(digits(index+1),p.x,p.y-7,'#e8f6ff',10);});
      }
      const sun=Z.body('Sun',state.frame),sunPoint=point(sun.altitude,sun.azimuth,width,height);
      if(sunPoint.inside){circle(sunPoint.x,sunPoint.y,7,'#ffcf70');label('الشمس',sunPoint.x,sunPoint.y-12,'#ffd989',10);}
      const current=moonAt(state.day),moonPoint=point(current.altitude,current.azimuth,width,height);
      if(moonPoint.inside){moon(moonPoint,A.Illumination('Moon',state.date).phase_fraction,true);label('القمر',moonPoint.x,moonPoint.y-17,'#eef7ff',11);}
      [['شمال',0],['شرق',90],['جنوب',180],['غرب',270]].forEach(item=>{const p=point(0,item[1],width,height);label(item[0],p.x,p.y+14,'#a6c7db',10);});
    }
    function rotate(value,angle){return [value.x*Math.cos(angle)-value.y*Math.sin(angle),value.x*Math.sin(angle)+value.y*Math.cos(angle)];}
    function orbit(width,height){
      ctx.fillStyle='#07111f';ctx.fillRect(0,0,width,height);
      const center={x:width/2,y:height/2},scale=Math.min(width,height)*.31,points=state.orbit.map(value=>rotate(value,state.orbitYaw));
      const max=Math.max(...points.map(value=>Math.hypot(value[0],value[1])),1e-9),screen=value=>({x:center.x+value[0]/max*scale,y:center.y-value[1]/max*scale});state.orbitScale=scale/max;
      ctx.beginPath();ctx.strokeStyle='rgba(85,216,242,.8)';ctx.lineWidth=1.8;points.forEach((value,index)=>{const p=screen(value);if(index)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);});ctx.stroke();
      if($('moonMonthTrail').checked)state.orbit.forEach((value,index)=>{if(index%6||((index/6)%3&&index/6+1!==state.day))return;const p=screen(rotate(value,state.orbitYaw));circle(p.x,p.y,index/6+1===state.day?4:2.3,index/6+1===state.day?'#f6c85f':'#55d8f2');label(digits(index/6+1),p.x,p.y-7,'#e8f6ff',10);});
      const earth=$('moonMonthScale').checked?6378.137/149597870.7*state.orbitScale:19;circle(center.x,center.y,earth,'#237fa7','#70d5f2');label('الأرض',center.x,center.y+earth+15,'#bfe8f7',11);
      const current=screen(rotate(state.orbit[(state.day-1)*6],state.orbitYaw));moon(current,A.Illumination('Moon',state.date).phase_fraction,false);label('القمر',current.x,current.y-16,'#eef7ff',11);
      const vector=A.GeoVector('Sun',state.date,true),sunVector=rotate(vector,state.orbitYaw),length=Math.hypot(sunVector[0],sunVector[1])||1,sun={x:center.x+sunVector[0]/length*scale*1.45,y:center.y-sunVector[1]/length*scale*1.45};
      ctx.beginPath();ctx.strokeStyle='rgba(255,207,112,.45)';ctx.moveTo(center.x,center.y);ctx.lineTo(sun.x,sun.y);ctx.stroke();circle(sun.x,sun.y,10,'#ffcf70');label('الشمس',sun.x,sun.y-16,'#ffd989',10);
    }
    function draw(){const width=stage.clientWidth,height=stage.clientHeight;if(!width||!height||!state.date)return;ctx.clearRect(0,0,width,height);if(state.view==='observer')observer(width,height);else orbit(width,height);}
    function update(){
      state.loc=location();const month=monthInput.value.split('-').map(Number);state.days=new Date(Date.UTC(month[0],month[1],0)).getUTCDate();state.day=clamp(state.day,1,state.days);
      $('moonMonthDay').max=state.days;$('moonMonthDay').value=state.day;state.date=dateAt(state.day);state.frame=Z.frame(state.date,state.loc);
      if($('moonMonthTrack').checked)state.yaw=-Z.body('Moon',state.frame).azimuth;
      state.daily=Array.from({length:state.days},(_,index)=>moonAt(index+1));
      state.orbit=Array.from({length:state.days*6+1},(_,index)=>{const value=A.GeoVector('Moon',new Date(+dateAt(1)+index*14400000),true);return {x:value.x,y:value.y};});
      const current=Z.body('Moon',state.frame),observerLocation=new A.Observer(state.loc.lat,state.loc.lon,state.loc.elevation||0),equator=A.Equator('Moon',state.date,observerLocation,false,true),constellation=A.Constellation(equator.ra,equator.dec),phase=A.Illumination('Moon',state.date).phase_fraction;
      $('moonMonthDate').textContent=formatter.format(new Date(Date.UTC(month[0],month[1]-1,state.day)));$('moonMonthDayValue').textContent=`${digits(state.day)} / ${digits(state.days)}`;
      $('moonMonthReadout').textContent=`القمر ${number(current.altitude)}° · ${current.altitude>=0?'فوق الأفق':'تحت الأفق'}`;
      $('moonMonthStatus').textContent=`رسم متوافق مع الهاتف · كوكبة القمر: ${constellationNames[constellation.symbol]||constellation.name} · الجزء المضاء ${number(phase*100)}٪ · المواضع عند الساعة المحلية نفسها.`;
      $('moonMonthScaleLabel').textContent=$('moonMonthScale').checked?'أحجام الأجرام والمدار بمقياس واحد':'الأرض والقمر مكبّران للتوضيح';resize();
    }
    function stop(){state.playing=false;$('moonMonthPlay').textContent='▶';$('moonMonthPlay').setAttribute('aria-pressed','false');}
    function step(by){stop();state.day=clamp(state.day+by,1,state.days);update();}
    function animate(now){if(!state.playing||!root.isConnected)return;if(now-state.lastTick>850){state.lastTick=now;if(state.day>=state.days){stop();return;}state.day++;update();}requestAnimationFrame(animate);}
    $('moonMonthPrev').onclick=()=>step(-1);$('moonMonthNext').onclick=()=>step(1);
    $('moonMonthPlay').onclick=()=>{if(state.playing){stop();return;}if(state.day>=state.days)state.day=1;state.playing=true;state.lastTick=performance.now();$('moonMonthPlay').textContent='Ⅱ';$('moonMonthPlay').setAttribute('aria-pressed','true');update();requestAnimationFrame(animate);};
    $('moonMonthDay').oninput=()=>{stop();state.day=+$('moonMonthDay').value;update();};
    ['moonMonthCity','moonMonthMonth','moonMonthTime','moonMonthTrack','moonMonthTrail','moonMonthBelow','moonMonthScale'].forEach(id=>$(id).onchange=()=>{stop();update();});
    root.querySelectorAll('[data-moon-month-view]').forEach(button=>button.onclick=()=>{stop();state.view=button.dataset.moonMonthView;root.querySelectorAll('[data-moon-month-view]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});update();});
    canvas.addEventListener('pointerdown',event=>{if(state.view==='observer'&&$('moonMonthTrack').checked)$('moonMonthTrack').checked=false;state.drag={x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);});
    canvas.addEventListener('pointermove',event=>{if(!state.drag)return;const dx=event.clientX-state.drag.x;state.drag={x:event.clientX,y:event.clientY};if(state.view==='observer')state.yaw-=dx*.35;else state.orbitYaw-=dx*.008;draw();});
    ['pointerup','pointercancel'].forEach(type=>canvas.addEventListener(type,()=>state.drag=null));
    if(globalThis.ResizeObserver)new ResizeObserver(resize).observe(stage);else globalThis.addEventListener('resize',resize);
    update();resize();root.dataset.moonFlatReady='true';globalThis.moonMonthModel={activate:update};
  }
  boot();
})();
