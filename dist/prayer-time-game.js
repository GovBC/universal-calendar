(function(global){
  'use strict';

  const keys=['fajr','dhuhr','asr','maghrib','isha'];
  const definitions={
    fajr:{name:'الفجر',title:'دخول وقت الفجر',brief:'اضبط الساعة عند بداية الفجر المحسوبة من زاوية الشمس تحت الأفق الشرقي.',offset:75},
    dhuhr:{name:'الظهر',title:'دخول وقت الظهر',brief:'اضبط الساعة عند الزوال، حين تعبر الشمس أعلى موضع في مسارها اليومي.',offset:-80},
    asr:{name:'العصر',title:'دخول وقت العصر',brief:'استخدم ارتفاع الشمس وطول الظل للوصول إلى بداية العصر وفق الإعداد المختار.',offset:-70},
    maghrib:{name:'المغرب',title:'دخول وقت المغرب',brief:'اضبط الساعة عند غروب الشمس الحسابي تحت الأفق الغربي.',offset:65},
    isha:{name:'العشاء',title:'دخول وقت العشاء',brief:'اعثر على بداية العشاء وفق قاعدة طريقة الحساب المستخدمة في موقعك.',offset:-70}
  };

  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function minuteOfDay(date,zone,L=global.LunarCalc){
    const parts=L.parts(date,zone);
    return parts.h*60+parts.min;
  }
  function evaluate(targetMinute,selectedMinute,tolerance=4){
    const target=clamp(Math.round(Number(targetMinute)),0,1439);
    const selected=clamp(Math.round(Number(selectedMinute)),0,1439);
    const difference=selected-target,absolute=Math.abs(difference);
    return {target,selected,difference,absolute,solved:absolute<=tolerance,direction:difference<0?'early':difference>0?'late':'exact'};
  }
  function createSession(){
    const completed=new Set();
    return {
      complete(id){if(keys.includes(id))completed.add(id)},
      has(id){return completed.has(id)},
      reset(){completed.clear()},
      get count(){return completed.size},
      get score(){return completed.size*100}
    };
  }
  function completePrayerDay(prayers){return keys.every(key=>prayers.events.some(event=>event.key===key&&event.date))}
  function buildTrainingDay(now=new Date(),preferredLoc){
    const C=global.CalendarCore,L=global.LunarCalc;
    if(!C||!L)throw new Error('Prayer calculations unavailable');
    const preferred={...(preferredLoc||C.location)};
    const sourceIso=L.dateISO(now,preferred.zone);
    let loc=preferred,iso=sourceIso,prayers=C.prayers(iso,loc),fallback=false;
    if(!completePrayerDay(prayers)){
      loc={...C.defaults};iso=L.dateISO(now,loc.zone);prayers=C.prayers(iso,loc);fallback=true;
    }
    if(!completePrayerDay(prayers))throw new Error('Complete prayer day unavailable');
    const events=Object.fromEntries(prayers.events.filter(event=>keys.includes(event.key)).map(event=>[event.key,event.date]));
    const missions=keys.map(key=>{
      const definition=definitions[key],target=minuteOfDay(events[key],loc.zone,L);
      return {...definition,id:key,target,start:clamp(target+definition.offset,0,1439)};
    });
    return {loc,iso,sourceIso,prayers,events,missions,fallback};
  }
  function shadowRatio(altitude){
    if(!Number.isFinite(altitude)||altitude<=0)return null;
    return 1/Math.tan(altitude*Math.PI/180);
  }

  global.PrayerTimeGameModel={keys,definitions,minuteOfDay,evaluate,createSession,completePrayerDay,buildTrainingDay,shadowRatio};
  if(typeof document==='undefined')return;

  const $=id=>document.getElementById(id);
  const canvas=$('prayerTimeCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const session=createSession();
  let day=null,mission=null,minute=360,path=[],prepared=false;
  const ar=(value,digits=0)=>new Intl.NumberFormat('ar-SA',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);

  function localDateSafe(value){
    const L=global.LunarCalc;
    for(let delta=0;delta<=90;delta++){
      for(const candidate of delta?[value+delta,value-delta]:[value]){
        if(candidate<0||candidate>1439)continue;
        try{return L.localDate(day.iso,candidate,day.loc.zone)}catch{}
      }
    }
    throw new Error('Local time unavailable');
  }
  function clock(value){return global.CalendarCore.clock(value,false,day.loc)}
  function formatDate(){
    return global.CalendarCore.format(localDateSafe(720),'gregory',day.loc.zone);
  }
  function sunState(altitude){
    if(altitude>=0)return 'الشمس فوق الأفق';
    if(altitude>=-6)return 'الشفق قريب من الأفق';
    if(altitude>=-18)return 'الشمس تحت الأفق أثناء الشفق';
    return 'ليل فلكي';
  }
  function methodText(){
    const p=day.prayers;
    const isha=p.ishaRule==='angle18'?'العشاء −١٨°':p.ishaRule==='offset120'?'العشاء بعد ١٢٠ د':'العشاء بعد ٩٠ د';
    return p.methodName+' · الفجر −'+ar(p.fajrAngle,1)+'° · '+isha;
  }
  function hintText(){
    const p=day.prayers;
    if(mission.id==='fajr')return 'راقب الأفق الشرقي: يعتمد هذا اليوم زاوية '+ar(p.fajrAngle,1)+'° تحت الأفق.';
    if(mission.id==='dhuhr')return 'ابحث عن قمة منحنى الشمس؛ الزوال المحلي لا يلزم أن يكون عند الساعة ١٢:٠٠.';
    if(mission.id==='asr')return 'إعداد العصر هنا: ظل الشيء '+ar(day.loc.asr)+'× مضافًا إليه ظل الزوال.';
    if(mission.id==='maghrib')return 'حرّك المؤشر إلى عبور الشمس الأفق الغربي في نهاية النهار.';
    if(p.ishaRule==='angle18')return 'ابحث بعد المغرب عن بلوغ الشمس ١٨° تحت الأفق الغربي.';
    return 'قاعدة هذا اليوم تجعل العشاء بعد المغرب بـ '+(p.ishaRule==='offset120'?'١٢٠':'٩٠')+' دقيقة.';
  }
  function updateProgress(){
    $('prayerTimeProgress').textContent=ar(session.count)+' / '+ar(keys.length)+' مهام';
    $('prayerTimeScore').textContent=ar(session.score)+' نقطة';
    $('prayerTimeProgressBar').value=session.count;
    $('prayerTimeNext').disabled=!mission||!session.has(mission.id);
    $('prayerTimeNext').hidden=session.count===keys.length;
    $('prayerTimeRestart').hidden=session.count!==keys.length;
    Array.from($('prayerTimeMission').options).forEach((option,index)=>{
      option.textContent=ar(index+1)+'. '+day.missions[index].title+(session.has(option.value)?' · مكتملة':'');
    });
  }
  function feedback(text,kind='info'){
    $('prayerTimeFeedback').textContent=text;
    $('prayerTimeFeedback').dataset.kind=kind;
  }
  function buildPath(){
    const points=[];
    for(let value=0;value<=1439;value+=10){
      try{
        const date=localDateSafe(value),sun=global.LunarCalc.horizontal('Sun',date,day.loc);
        points.push({minute:value,altitude:sun.altitude});
      }catch{}
    }
    if(points.at(-1)?.minute!==1439){
      try{points.push({minute:1439,altitude:global.LunarCalc.horizontal('Sun',localDateSafe(1439),day.loc).altitude})}catch{}
    }
    return points;
  }
  function draw(position){
    if(!ctx||$('prayerTimeGamePane').hidden)return;
    const bounds=canvas.getBoundingClientRect();
    if(!bounds.width||!bounds.height)return;
    const w=bounds.width,h=bounds.height,dpr=Math.min(global.devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);ctx.fillStyle='#071725';ctx.fillRect(0,0,w,h);
    const left=43,right=w-16,top=30,bottom=h-38,minAlt=-25;
    const maxAlt=Math.max(55,Math.ceil(Math.max(...path.map(point=>point.altitude))/10)*10+5);
    const x=value=>left+value/1439*(right-left);
    const y=value=>top+(maxAlt-clamp(value,minAlt,maxAlt))/(maxAlt-minAlt)*(bottom-top);
    ctx.fillStyle='rgba(246,200,95,.045)';ctx.fillRect(left,top,right-left,y(0)-top);
    ctx.fillStyle='rgba(85,216,242,.035)';ctx.fillRect(left,y(0),right-left,bottom-y(0));
    ctx.font='12px Tajawal, Arial';ctx.textAlign='left';ctx.fillStyle='rgba(217,237,248,.68)';
    [maxAlt,0,-18].forEach(altitude=>{
      ctx.strokeStyle=altitude===0?'rgba(246,200,95,.48)':'rgba(174,211,232,.2)';ctx.lineWidth=altitude===0?1.4:1;ctx.setLineDash(altitude===-18?[5,5]:[]);
      ctx.beginPath();ctx.moveTo(left,y(altitude));ctx.lineTo(right,y(altitude));ctx.stroke();ctx.fillText(ar(altitude)+'°',5,y(altitude)+4);
    });
    ctx.setLineDash([]);
    [0,360,720,1080,1439].forEach((value,index)=>{
      const labels=['٠٠','٦','١٢','١٨','٢٤'];ctx.textAlign=index===0?'left':index===4?'right':'center';ctx.fillText(labels[index],x(value),h-12);
    });
    for(let i=1;i<path.length;i++){
      const a=path[i-1],b=path[i],above=(a.altitude+b.altitude)/2>=0;
      ctx.strokeStyle=above?'#f6c85f':'#55d8f2';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x(a.minute),y(a.altitude));ctx.lineTo(x(b.minute),y(b.altitude));ctx.stroke();
    }
    if(session.has(mission.id)){
      ctx.strokeStyle='rgba(104,214,173,.7)';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x(mission.target),top);ctx.lineTo(x(mission.target),bottom);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#68d6ad';ctx.textAlign='center';ctx.fillText('الإجابة',x(mission.target),top+13);
    }
    const markerX=x(minute),markerY=y(position.altitude);
    ctx.strokeStyle='rgba(255,255,255,.36)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(markerX,top);ctx.lineTo(markerX,bottom);ctx.stroke();
    ctx.fillStyle=position.altitude>=0?'#f6c85f':'#55d8f2';ctx.beginPath();ctx.arc(markerX,markerY,8,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(markerX,markerY,11,0,Math.PI*2);ctx.stroke();
  }
  function render(){
    if(!prepared||!day||!mission)return;
    const date=localDateSafe(minute),position=global.LunarCalc.horizontal('Sun',date,day.loc),ratio=shadowRatio(position.altitude);
    $('prayerTimeMinute').value=minute;
    $('prayerTimeMinuteValue').textContent=clock(date);
    $('prayerTimeClock').textContent=clock(date);
    $('prayerTimeSkyState').textContent=sunState(position.altitude);
    $('prayerTimeAltitude').textContent=(position.altitude>=0?'+':'−')+ar(Math.abs(position.altitude),1)+'°';
    $('prayerTimeDirection').textContent=global.LunarCalc.direction(position.azimuth)+' · '+ar(position.azimuth,1)+'°';
    $('prayerTimeShadow').textContent=ratio===null?'لا ظل شمسي':ratio>20?'أطول من ٢٠×':ar(ratio,1)+'× طول الجسم';
    $('prayerTimeMethod').textContent=day.prayers.methodName;
    $('prayerTimeMinute').setAttribute('aria-valuetext',clock(date));
    canvas.setAttribute('aria-label','الوقت '+clock(date)+'؛ ارتفاع الشمس '+ar(position.altitude,1)+' درجة، واتجاهها '+global.LunarCalc.direction(position.azimuth)+'.');
    draw(position);
  }
  function selectMission(id){
    mission=day.missions.find(item=>item.id===id)||day.missions[0];minute=mission.start;
    $('prayerTimeMission').value=mission.id;
    $('prayerTimeMissionTitle').textContent=mission.title;
    $('prayerTimeBrief').textContent=mission.brief;
    feedback(session.has(mission.id)?'هذه المهمة مكتملة. يظهر خط الإجابة الأخضر ويمكنك إعادتها دون زيادة النقاط.':'استدل بموضع الشمس، ثم اضبط الساعة وتحقق.');
    updateProgress();render();
  }
  function prepare(){
    try{
      day=buildTrainingDay(new Date());prepared=true;path=buildPath();
      $('prayerTimeLocation').textContent=day.loc.name;
      $('prayerTimeDate').textContent=formatDate();
      $('prayerTimeFallback').hidden=!day.fallback;
      $('prayerTimeFallback').textContent=day.fallback?'لا تتوافر العلامات الخمس كلها في موقعك اليوم؛ يستخدم التدريب مكة المكرمة.':'';
      $('prayerTimeMethod').title=methodText();
      $('prayerTimeError').hidden=true;$('prayerTimeContent').hidden=false;
      selectMission(mission?.id||keys[0]);
    }catch{
      prepared=false;$('prayerTimeError').hidden=false;$('prayerTimeContent').hidden=true;
    }
  }
  function check(){
    const result=evaluate(mission.target,minute);
    if(result.solved){
      session.complete(mission.id);updateProgress();render();
      const finish=session.count===keys.length?' أكملت الصلوات الخمس وحصلت على '+ar(session.score)+' نقطة.':'';
      feedback('أحسنت. وقت '+mission.name+' المحسوب اليوم هو '+clock(day.events[mission.id])+'، وفارق اختيارك '+ar(result.absolute)+' دقائق.'+finish,'success');
      return;
    }
    const direction=result.direction==='early'?'أبكر من الوقت':'متأخر عن الوقت';
    feedback('اختيارك '+direction+' بـ '+ar(result.absolute)+' دقيقة. '+hintText(),'retry');
  }
  function nudge(amount){minute=clamp(minute+amount,0,1439);render();feedback('تغيّر الوقت المختار. تحقق عندما تصل إلى العلامة المناسبة.')}
  function activate(){
    const C=global.CalendarCore,L=global.LunarCalc;
    if(!C||!L){prepare();return}
    const expected=L.dateISO(new Date(),C.location.zone);
    if(!prepared||day.sourceIso!==expected||day.fallback&&C.location.name===C.defaults.name)prepare();else render();
  }

  $('prayerTimeMission').addEventListener('change',()=>selectMission($('prayerTimeMission').value));
  $('prayerTimeMinute').addEventListener('input',()=>{minute=+$('prayerTimeMinute').value;render();feedback('تغيّر الوقت المختار. تحقق عندما تصل إلى العلامة المناسبة.')});
  document.querySelectorAll('[data-prayer-time-step]').forEach(button=>button.addEventListener('click',()=>nudge(+button.dataset.prayerTimeStep)));
  $('prayerTimeCheck').addEventListener('click',check);
  $('prayerTimeReset').addEventListener('click',()=>selectMission(mission.id));
  $('prayerTimeHint').addEventListener('click',()=>feedback(hintText()));
  $('prayerTimeNext').addEventListener('click',()=>{
    const index=day.missions.findIndex(item=>item.id===mission.id);
    const next=day.missions.slice(index+1).concat(day.missions.slice(0,index+1)).find(item=>!session.has(item.id));
    if(next){selectMission(next.id);$('prayerTimeMission').focus()}
  });
  $('prayerTimeRestart').addEventListener('click',()=>{session.reset();selectMission(keys[0]);$('prayerTimeMission').focus()});
  $('prayerTimeRetry').addEventListener('click',prepare);
  global.addEventListener('resize',()=>{if(prepared&&!$('prayerTimeGamePane').hidden)render()});
  global.addEventListener('calendar-location',()=>{prepared=false;if(!$('prayerTimeGamePane').hidden)prepare()});
  global.addEventListener('calendar-hour-cycle',()=>{if(prepared)render()});
  global.PrayerTimeGame={activate,selectMission};
})(typeof globalThis!=='undefined'?globalThis:window);
