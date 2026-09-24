(function(global){
  'use strict';

  const MINUTE=60000;
  const location={lat:24.7136,lon:46.6753,elevation:612,zone:'Asia/Riyadh'};
  const missions=[
    {id:'first',title:'أول رصد',date:'2026-02-18',minute:0,horizon:0,brief:'اختر وقتًا مناسبًا لمحاولة رصد الهلال بالعين بعد الغروب.'},
    {id:'horizon',title:'خلف العائق',date:'2026-02-18',minute:26,horizon:8,brief:'المبنى يحجب الأفق الغربي. اختر موقعًا ووقتًا مناسبين للرصد.'},
    {id:'optics',title:'هلال دقيق',date:'2026-03-19',minute:13,horizon:0,brief:'الهلال رفيع هذا المساء. هل تكفي العين، أم تحتاج وسيلة أخرى؟'},
    {id:'late',title:'فات الموعد',date:'2026-02-18',minute:95,horizon:0,brief:'وصلت متأخرًا. أعد الوقت إلى فرصة أنسب قبل غروب الهلال.'},
    {id:'patience',title:'قرار الراصد',date:'2026-04-17',minute:3,horizon:0,brief:'افحص هذه الأمسية. وجود القمر فوق الأفق وحده لا يكفي؛ هل تحاول أم تؤجل؟'}
  ];
  const cache=new Map();
  function createRound(id){
    const mission=missions.find(item=>item.id===id)||missions[0];
    const C=global.LunarCalc;
    if(!C||!global.Astronomy)throw new Error('Astronomy engine unavailable');
    if(!cache.has(mission.date)){
      const evening=C.evening(mission.date,location);
      if(!evening.sunset)throw new Error('Training sunset unavailable');
      cache.set(mission.date,evening);
    }
    return {mission,evening:cache.get(mission.date)};
  }
  function reading(round,minute){
    const offset=Math.max(0,Math.min(110,Number(minute)||0));
    const date=new Date(+round.evening.sunset+offset*MINUTE);
    return global.LunarCalc.snapshot(date,location);
  }
  function evaluate(round,settings,action){
    const e=round.evening;
    const possible=['A','B','C'].includes(e.zone);
    if(action==='wait')return possible
      ?{solved:false,code:'possible',message:'توجد فرصة متوقعة وفق المعيار. جرّب تعديل وقت الرصد أو الأفق أو الوسيلة.'}
      :{solved:true,code:'wait',message:'قرار صحيح. '+e.label+'؛ الانتظار لأمسية أخرى هو الحل هنا.'};
    if(!possible)return {solved:false,code:'unfavorable',message:'هذا المساء غير ملائم وفق معيار اللعبة، حتى مع أداة بصرية. لا تعتمد على وجود القمر فوق الأفق وحده.'};
    const s=reading(round,settings.minute);
    const lowerLimb=s.moon.altitude-s.diameter/120;
    if(lowerLimb<=0)return {solved:false,code:'set',message:'قرص القمر لم يعد كاملًا فوق الأفق. أعد الوقت إلى ما قبل غروبه.'};
    if(lowerLimb<=Number(settings.horizon))return {solved:false,code:'blocked',message:'العائق يحجب الهلال. اختر أفقًا غربيًا مفتوحًا ثم أعد المحاولة.'};
    if(e.zone!=='A'&&settings.equipment!=='optical')return {solved:false,code:'equipment',message:'هذه المهمة تحتاج أداة بصرية وفق التصنيف التدريبي. غيّر وسيلة الرصد الافتراضية.'};
    const distance=Math.abs((s.date-e.best)/MINUTE);
    if(distance>6)return {solved:false,code:'time',message:s.date<e.best
      ?'ما زلت مبكرًا عن وقت التقييم. تقدّم قليلًا مع الانتباه إلى هبوط القمر.'
      :'ابتعدت عن وقت التقييم. ارجع قليلًا لتوازن بين خفوت الشفق وارتفاع الهلال.'};
    return {solved:true,code:'observed',message:'أحسنت اختيار ظروف المحاولة في المحاكاة. '+e.label+'؛ الرؤية الفعلية ليست مضمونة.'};
  }
  function createSession(){
    const completed=new Set();
    return {
      complete(id){if(missions.some(m=>m.id===id))completed.add(id)},
      has(id){return completed.has(id)},
      reset(){completed.clear()},
      get count(){return completed.size},
      get score(){return completed.size*100}
    };
  }
  global.CrescentHunterModel={missions,location,createRound,reading,evaluate,createSession};
  if(typeof document==='undefined')return;

  const $=id=>document.getElementById(id);
  const canvas=$('crescentCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const session=createSession();
  let round=null;
  let busy=false;
  let settings={minute:0,horizon:0,equipment:'eye'};
  const format=(value,digits=0)=>new Intl.NumberFormat('ar-SA',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);
  const clock=date=>new Intl.DateTimeFormat('ar-SA',{timeZone:location.zone,hour:'numeric',minute:'2-digit'}).format(date);
  const localDay=date=>new Intl.DateTimeFormat('ar-SA-u-ca-gregory',{timeZone:location.zone,day:'numeric',month:'long',year:'numeric'}).format(date);

  function feedback(text,kind='info'){
    $('crescentFeedback').textContent=text;
    $('crescentFeedback').dataset.kind=kind;
  }
  function progress(){
    $('crescentProgress').textContent=format(session.count)+' / '+format(missions.length)+' مهام';
    $('crescentScore').textContent=format(session.score)+' نقطة';
    $('crescentProgressBar').value=session.count;
    $('crescentNext').disabled=!round||!session.has(round.mission.id);
    $('crescentNext').hidden=session.count===missions.length;
    $('crescentRestart').hidden=session.count!==missions.length;
    Array.from($('crescentMission').options).forEach((option,index)=>{
      option.textContent=format(index+1)+'. '+missions[index].title+(session.has(option.value)?' · مكتملة':'');
    });
  }
  function draw(s){
    if(!ctx)return;
    const bounds=canvas.getBoundingClientRect();
    if(!bounds.width||!bounds.height)return;
    const w=bounds.width,h=bounds.height,dpr=Math.min(global.devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const twilight=Math.max(0,Math.min(1,-s.sun.altitude/20));
    ctx.fillStyle='rgb('+Math.round(62-37*twilight)+','+Math.round(110-56*twilight)+','+Math.round(132-59*twilight)+')';
    ctx.fillRect(0,0,w,h);
    const left=38,right=w-16,top=28,bottom=h-34;
    const x=az=>left+(az-220)/110*(right-left);
    const y=alt=>top+(26-alt)/44*(bottom-top);
    ctx.font='14px Arial';ctx.textAlign='left';ctx.fillStyle='#e4f1f5';
    ctx.fillText('°',10,20);
    [-10,0,10,20].forEach(alt=>{
      ctx.strokeStyle=alt===0?'#b8e2dd':'rgba(228,241,245,.22)';
      ctx.lineWidth=alt===0?1.5:1;ctx.setLineDash(alt===0?[]:[3,5]);
      ctx.beginPath();ctx.moveTo(left,y(alt));ctx.lineTo(right,y(alt));ctx.stroke();
      ctx.fillText(format(alt),5,y(alt)+5);
    });
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(13,31,33,.74)';ctx.fillRect(left,y(0),right-left,bottom-y(0));
    ctx.textAlign='center';ctx.fillStyle='#e4f1f5';
    [240,270,300].forEach(az=>ctx.fillText(az===270?'الغرب ٢٧٠°':format(az)+'°',x(az),h-10));

    const sx=x(s.sun.azimuth),sy=y(s.sun.altitude),mx=x(s.moon.azimuth),my=y(s.moon.altitude);
    ctx.save();ctx.beginPath();ctx.rect(left,top,right-left,bottom-top);ctx.clip();
    if(sy>=top&&sy<=bottom){
      ctx.fillStyle='#ffda80';ctx.beginPath();ctx.arc(sx,sy,7,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ffebbc';ctx.fillText('الشمس',Math.max(left+25,Math.min(right-25,sx)),Math.min(bottom-4,sy+26));
    }
    if(my>=top&&my<=bottom){
      const radius=w<400?19:25;
      ctx.save();ctx.translate(mx,my);ctx.rotate(Math.atan2(sy-my,sx-mx));
      ctx.fillStyle='#406574';ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();
      // The terminator scales with illumination; the lit limb faces the Sun in this schematic projection.
      ctx.fillStyle='#fff9db';ctx.beginPath();ctx.arc(0,0,radius,-Math.PI/2,Math.PI/2);
      for(let step=0;step<=80;step++){
        const yy=radius-2*radius*step/80;
        ctx.lineTo((1-2*s.illum)*Math.sqrt(Math.max(0,radius*radius-yy*yy)),yy);
      }
      ctx.closePath();ctx.fill();ctx.restore();
      ctx.strokeStyle='rgba(232,249,252,.7)';ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(mx,my,radius+6,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#f2fafc';ctx.fillText('القمر',Math.max(left+25,Math.min(right-25,mx)),Math.max(top+14,my-radius-14));
    }
    if(settings.horizon>0){
      ctx.fillStyle='rgba(39,66,60,.94)';ctx.fillRect(left,y(settings.horizon),right-left,y(0)-y(settings.horizon));
      ctx.strokeStyle='#a5c8b5';ctx.beginPath();ctx.moveTo(left,y(settings.horizon));ctx.lineTo(right,y(settings.horizon));ctx.stroke();
      ctx.fillStyle='#ecf6ee';ctx.fillText('عائق ٨°',left+(right-left)/2,y(settings.horizon)+20);
    }
    ctx.restore();
    ctx.textAlign='right';ctx.fillStyle='#e4f1f5';ctx.fillText('تحت الأفق',right-6,bottom-7);
  }
  function render(){
    if(!round||$('crescentGamePane').hidden)return;
    const s=reading(round,settings.minute);
    $('crescentMinute').value=settings.minute;
    $('crescentHorizon').value=String(settings.horizon);
    $('crescentEquipment').value=settings.equipment;
    $('crescentMinuteValue').textContent=format(settings.minute)+' دقيقة';
    $('crescentMinute').setAttribute('aria-valuetext',format(settings.minute)+' دقيقة بعد الغروب، '+clock(s.date));
    $('crescentClock').textContent=clock(s.date);
    $('crescentClock').dateTime=s.date.toISOString();
    $('crescentAltitude').textContent=format(s.moon.altitude,1)+'°';
    $('crescentElongation').textContent=format(s.elongation,1)+'°';
    $('crescentIllumination').textContent=format(s.illum*100,1)+'٪';
    $('crescentLag').textContent=round.evening.lag===null?'غير متاح':format(round.evening.lag)+' دقيقة';
    canvas.setAttribute('aria-label','موضع القمر: ارتفاع '+format(s.moon.altitude,1)+' درجة، سمت '+format(s.moon.azimuth)+' درجة. ارتفاع الشمس '+format(s.sun.altitude,1)+' درجة.');
    draw(s);
  }
  function showError(){
    $('crescentLoading').hidden=true;$('crescentContent').hidden=true;$('crescentError').hidden=false;
  }
  function selectMission(id){
    round=createRound(id);
    settings={minute:round.mission.minute,horizon:round.mission.horizon,equipment:'eye'};
    $('crescentMission').value=round.mission.id;
    $('crescentBrief').textContent=round.mission.brief;
    $('crescentPlace').textContent='الرياض · '+localDay(round.evening.sunset);
    feedback(session.has(round.mission.id)?'هذه المهمة مكتملة. يمكنك تجربتها مجددًا دون زيادة النقاط.':'هدفك اختيار ظروف المحاولة المناسبة، أو تأجيل الرصد عند غياب فرصة متوقعة.');
    $('crescentLoading').hidden=true;$('crescentError').hidden=true;$('crescentContent').hidden=false;
    progress();render();
  }
  function activate(){
    if(busy)return;
    if(round&&!$('crescentContent').hidden){render();return}
    busy=true;$('crescentLoading').hidden=false;$('crescentError').hidden=true;
    global.setTimeout(()=>{
      try{selectMission(round?.mission.id||missions[0].id)}catch{showError()}
      finally{busy=false}
    },0);
  }
  function attempt(action){
    if(!round)return;
    try{
      const result=evaluate(round,settings,action);
      if(result.solved)session.complete(round.mission.id);
      progress();
      const finish=session.count===missions.length?' أكملت المهام الخمس وحصلت على '+format(session.score)+' نقطة.':'';
      feedback(result.message+finish,result.solved?'success':'retry');
    }catch{showError()}
  }
  $('crescentMission').addEventListener('change',()=>{
    try{selectMission($('crescentMission').value)}catch{showError()}
  });
  ['Minute','Horizon','Equipment'].forEach(name=>{
    $('crescent'+name).addEventListener(name==='Minute'?'input':'change',()=>{
      settings={minute:+$('crescentMinute').value,horizon:+$('crescentHorizon').value,equipment:$('crescentEquipment').value};
      try{render();feedback('تغيّرت إعدادات المحاولة. اختبر قرارك عندما تكون جاهزًا.')}catch{showError()}
    });
  });
  $('crescentObserve').addEventListener('click',()=>attempt('observe'));
  $('crescentWait').addEventListener('click',()=>attempt('wait'));
  $('crescentHint').addEventListener('click',()=>{
    if(!round)return;
    const e=round.evening;
    const timing=e.best&&e.zone!=='D'?' وقت التقييم نحو '+format((e.best-e.sunset)/MINUTE)+' دقيقة بعد الغروب.':'';
    feedback(e.label+'.'+timing+' افحص العائق ووسيلة الرصد أيضًا.');
  });
  $('crescentNext').addEventListener('click',()=>{
    const index=missions.findIndex(m=>m.id===round?.mission.id);
    const next=missions.slice(index+1).concat(missions.slice(0,index+1)).find(m=>!session.has(m.id));
    if(next){try{selectMission(next.id);$('crescentMission').focus()}catch{showError()}}
  });
  $('crescentRestart').addEventListener('click',()=>{
    session.reset();try{selectMission(missions[0].id);$('crescentMission').focus()}catch{showError()}
  });
  $('crescentRetry').addEventListener('click',activate);
  global.addEventListener('resize',()=>{
    if(document.getElementById('games')?.classList.contains('active')){try{render()}catch{showError()}}
  });
  global.CrescentHunter={activate};
})(typeof globalThis!=='undefined'?globalThis:window);
