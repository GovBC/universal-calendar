(function(global){
  'use strict';

  const SUN_DIAMETER=31.6;
  const missions=[
    {id:'partial',title:'ابنِ كسوفًا جزئيًا',brief:'اجعل القمر يحجب ما بين ربع قرص الشمس وثلاثة أرباعه.',hint:'قرّب مركزي القرصين، لكن اترك بينهما مسافة واضحة.',start:{eastWest:50,northSouth:45,moonDiameter:31.6}},
    {id:'total',title:'ابنِ كسوفًا كليًا',brief:'غطِّ قرص الشمس كاملًا بقمر يبدو أكبر منها قليلًا.',hint:'كبّر قطر القمر الظاهري، ثم قرّب المركزين من التطابق.',start:{eastWest:12,northSouth:12,moonDiameter:29.5}},
    {id:'annular',title:'ابنِ كسوفًا حلقيًا',brief:'اترك حلقة كاملة من الشمس ظاهرة حول القمر.',hint:'صغّر قطر القمر الظاهري، ثم طابق مركزي القرصين تقريبًا.',start:{eastWest:-13,northSouth:10,moonDiameter:33.4}},
    {id:'monthly',title:'اصنع محاقًا بلا كسوف',brief:'اجعل القمر عند الاقتران شرقًا وغربًا، ثم أبعده عن مسار الشمس شمالًا أو جنوبًا.',hint:'اجعل الإزاحة الشرقية والغربية صفرًا تقريبًا، والإزاحة الشمالية أو الجنوبية أكبر من مجموع نصفي القطرين.',start:{eastWest:22,northSouth:0,moonDiameter:31.6}},
    {id:'grazing',title:'المس حافة الشمس',brief:'اصنع كسوفًا جزئيًا بالغ الصغر يحجب أقل من ١٠٪ من قرص الشمس.',hint:'حرّك القمر حتى تتقاطع حافتا القرصين تقاطعًا صغيرًا فقط.',start:{eastWest:0,northSouth:0,moonDiameter:32.8}}
  ];

  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function normalized(state){
    return {
      eastWest:clamp(Number(state.eastWest)||0,-60,60),
      northSouth:clamp(Number(state.northSouth)||0,-60,60),
      moonDiameter:clamp(Number(state.moonDiameter)||SUN_DIAMETER,29.3,33.5)
    };
  }
  function overlapFraction(sunRadius,moonRadius,distance){
    if(distance>=sunRadius+moonRadius)return 0;
    if(distance<=Math.abs(sunRadius-moonRadius))return Math.min(1,moonRadius*moonRadius/(sunRadius*sunRadius));
    const sunAngle=Math.acos((distance*distance+sunRadius*sunRadius-moonRadius*moonRadius)/(2*distance*sunRadius));
    const moonAngle=Math.acos((distance*distance+moonRadius*moonRadius-sunRadius*sunRadius)/(2*distance*moonRadius));
    const triangle=.5*Math.sqrt(Math.max(0,(-distance+sunRadius+moonRadius)*(distance+sunRadius-moonRadius)*(distance-sunRadius+moonRadius)*(distance+sunRadius+moonRadius)));
    const area=sunRadius*sunRadius*sunAngle+moonRadius*moonRadius*moonAngle-triangle;
    return clamp(area/(Math.PI*sunRadius*sunRadius),0,1);
  }
  function analyze(input){
    const state=normalized(input);
    const sunRadius=SUN_DIAMETER/2,moonRadius=state.moonDiameter/2;
    const separation=Math.hypot(state.eastWest,state.northSouth);
    const obscuration=overlapFraction(sunRadius,moonRadius,separation);
    let type='none';
    if(separation<sunRadius+moonRadius){
      if(separation<=Math.abs(moonRadius-sunRadius))type=moonRadius>=sunRadius?'total':'annular';
      else type='partial';
    }
    const magnitude=clamp((sunRadius+moonRadius-separation)/(2*sunRadius),0,1.2);
    return {state,sunRadius,moonRadius,separation,obscuration,magnitude,type};
  }
  function challengeById(id){return missions.find(item=>item.id===id)||missions[0]}
  function isSolved(id,result){
    if(id==='partial')return result.type==='partial'&&result.obscuration>=.25&&result.obscuration<=.75;
    if(id==='total')return result.type==='total';
    if(id==='annular')return result.type==='annular';
    if(id==='monthly')return result.type==='none'&&Math.abs(result.state.eastWest)<=2&&Math.abs(result.state.northSouth)>=35;
    if(id==='grazing')return result.type==='partial'&&result.obscuration>=.003&&result.obscuration<=.1;
    return false;
  }
  function guidance(id,result){
    if(id==='total'){
      if(result.state.moonDiameter<SUN_DIAMETER)return 'القمر يبدو أصغر من الشمس؛ زد قطره الظاهري.';
      return 'القمر كبير بما يكفي، لكن المركزين يحتاجان إلى محاذاة أدق.';
    }
    if(id==='annular'){
      if(result.state.moonDiameter>=SUN_DIAMETER)return 'القمر ليس أصغر من الشمس؛ قلّل قطره الظاهري.';
      return 'الحجم مناسب للحلقة، فقرّب مركزي القرصين أكثر.';
    }
    if(id==='monthly'){
      if(Math.abs(result.state.eastWest)>2)return 'أعد القمر إلى الاقتران بجعل موضعه الشرقي أو الغربي قريبًا من الصفر.';
      return 'أبعد القمر شمال مسار الشمس أو جنوبه حتى يمر ظله بعيدًا عنها.';
    }
    if(result.type==='none')return 'لا تتلامس الحافتان بعد؛ قرّب القمر من الشمس.';
    if(id==='grazing')return 'التداخل كبير؛ أبعد المركزين حتى تبقى ملامسة صغيرة عند الحافة.';
    return result.obscuration<.25?'التداخل قليل؛ قرّب القمر أكثر.':'التداخل تجاوز ثلاثة أرباع القرص؛ أبعد القمر قليلًا.';
  }
  function evaluate(id,state){
    const result=analyze(state),solved=isSolved(id,result);
    return {...result,solved,message:solved?'نجح البناء. حققت الشكل المطلوب مع الحفاظ على النسب الزاوية للقرصين.':guidance(id,result)};
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

  global.EclipseBuilderMath={SUN_DIAMETER,missions,normalized,overlapFraction,analyze,evaluate,isSolved,createSession};
  if(typeof document==='undefined')return;

  const $=id=>document.getElementById(id);
  const canvas=$('eclipseBuilderCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const session=createSession();
  let mission=missions[0];
  let state={...mission.start};
  const typeNames={none:'لا كسوف',partial:'كسوف جزئي',total:'كسوف كلي',annular:'كسوف حلقي'};
  const ar=value=>new Intl.NumberFormat('ar-SA',{maximumFractionDigits:1}).format(value);
  const percent=value=>new Intl.NumberFormat('ar-SA',{style:'percent',maximumFractionDigits:1}).format(value);

  function direction(value,positive,negative){
    if(Math.abs(value)<.05)return 'على المركز · ٠′';
    return (value>0?positive:negative)+' '+ar(Math.abs(value))+'′';
  }
  function feedback(text,kind='info'){
    $('eclipseBuilderFeedback').textContent=text;
    $('eclipseBuilderFeedback').dataset.kind=kind;
  }
  function updateProgress(){
    $('eclipseBuilderProgress').textContent=ar(session.count)+' / '+ar(missions.length)+' مهام';
    $('eclipseBuilderScore').textContent=ar(session.score)+' نقطة';
    $('eclipseBuilderProgressBar').value=session.count;
    $('eclipseBuilderNext').disabled=!session.has(mission.id);
    $('eclipseBuilderNext').hidden=session.count===missions.length;
    $('eclipseBuilderRestart').hidden=session.count!==missions.length;
    Array.from($('eclipseBuilderMission').options).forEach((option,index)=>{
      option.textContent=ar(index+1)+'. '+missions[index].title+(session.has(option.value)?' · مكتملة':'');
    });
  }
  function drawCross(x,y,color){
    ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+6,y);ctx.moveTo(x,y-6);ctx.lineTo(x,y+6);ctx.stroke();
  }
  function draw(result){
    if(!ctx||$('eclipseBuilderPane').hidden)return;
    const bounds=canvas.getBoundingClientRect();
    if(!bounds.width||!bounds.height)return;
    const w=bounds.width,h=bounds.height,dpr=Math.min(global.devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);ctx.fillStyle='#06131f';ctx.fillRect(0,0,w,h);
    const sunX=w/2,sunY=h*.52,scale=Math.min(w,h)*.105/result.sunRadius;
    const sunR=result.sunRadius*scale,moonR=result.moonRadius*scale;
    const moonX=sunX+result.state.eastWest*scale,moonY=sunY-result.state.northSouth*scale;
    ctx.font='12px Tajawal, Arial';ctx.textAlign='center';ctx.fillStyle='rgba(219,238,248,.72)';
    ctx.fillText('منظر زاوي من الأرض',w/2,22);
    for(let value=-60;value<=60;value+=15){
      const gx=sunX+value*scale,gy=sunY-value*scale;
      ctx.strokeStyle=value===0?'rgba(85,216,242,.34)':'rgba(174,211,232,.1)';ctx.lineWidth=value===0?1.3:1;ctx.setLineDash(value===0?[]:[3,5]);
      if(gx>8&&gx<w-8){ctx.beginPath();ctx.moveTo(gx,32);ctx.lineTo(gx,h-22);ctx.stroke()}
      if(gy>32&&gy<h-22){ctx.beginPath();ctx.moveTo(8,gy);ctx.lineTo(w-8,gy);ctx.stroke()}
    }
    ctx.setLineDash([]);
    ctx.fillStyle='#f6c85f';ctx.beginPath();ctx.arc(sunX,sunY,sunR,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(255,225,139,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sunX,sunY,sunR+2,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#07121d';ctx.beginPath();ctx.arc(moonX,moonY,moonR,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(217,233,241,.75)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(moonX,moonY,moonR,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(sunX,sunY);ctx.lineTo(moonX,moonY);ctx.stroke();ctx.setLineDash([]);
    drawCross(sunX,sunY,'rgba(59,47,20,.78)');drawCross(moonX,moonY,'rgba(222,239,247,.72)');
    ctx.fillStyle='rgba(219,238,248,.7)';ctx.textAlign='center';ctx.fillText('شمال',sunX,42);ctx.fillText('جنوب',sunX,h-10);
    ctx.textAlign='right';ctx.fillText('شرق',w-10,sunY-8);ctx.textAlign='left';ctx.fillText('غرب',10,sunY-8);
    if(result.type==='total'){
      ctx.strokeStyle='#68d6ad';ctx.lineWidth=3;ctx.beginPath();ctx.arc(moonX,moonY,moonR+5,0,Math.PI*2);ctx.stroke();
    }
    if(result.type==='annular'){
      ctx.strokeStyle='#ffe19a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sunX,sunY,sunR-1,0,Math.PI*2);ctx.stroke();
    }
  }
  function render(){
    const result=analyze(state);
    $('eclipseBuilderEastWest').value=state.eastWest;
    $('eclipseBuilderNorthSouth').value=state.northSouth;
    $('eclipseBuilderMoonDiameter').value=state.moonDiameter;
    $('eclipseBuilderEastWestValue').textContent=direction(state.eastWest,'شرق','غرب');
    $('eclipseBuilderNorthSouthValue').textContent=direction(state.northSouth,'شمال','جنوب');
    $('eclipseBuilderMoonDiameterValue').textContent=ar(state.moonDiameter)+'′';
    $('eclipseBuilderType').textContent=typeNames[result.type];
    $('eclipseBuilderType').parentElement.dataset.kind=result.type;
    $('eclipseBuilderObscuration').textContent=percent(result.obscuration);
    $('eclipseBuilderSeparation').textContent=ar(result.separation)+'′';
    $('eclipseBuilderMoonReadout').textContent=ar(state.moonDiameter)+'′';
    canvas.setAttribute('aria-label',typeNames[result.type]+'؛ يحجب القمر '+percent(result.obscuration)+' من قرص الشمس، والمسافة بين المركزين '+ar(result.separation)+' دقيقة قوسية.');
    draw(result);
    return result;
  }
  function readControls(){
    state=normalized({eastWest:$('eclipseBuilderEastWest').value,northSouth:$('eclipseBuilderNorthSouth').value,moonDiameter:$('eclipseBuilderMoonDiameter').value});
    render();feedback('تغيّر البناء. اضغط تحقق عندما يطابق هدف المهمة.');
  }
  function selectMission(id){
    mission=challengeById(id);state={...mission.start};
    $('eclipseBuilderMission').value=mission.id;
    $('eclipseBuilderMissionTitle').textContent=mission.title;
    $('eclipseBuilderBrief').textContent=mission.brief;
    feedback(session.has(mission.id)?'هذه المهمة مكتملة. يمكنك إعادة بنائها دون زيادة النقاط.':'حرّك القمر حتى يحقق الهدف، ثم تحقق من البناء.');
    updateProgress();render();
  }
  function check(){
    const result=evaluate(mission.id,state);
    if(result.solved)session.complete(mission.id);
    updateProgress();
    const finish=session.count===missions.length?' أكملت المهام الخمس وحصلت على '+ar(session.score)+' نقطة.':'';
    feedback(result.message+finish,result.solved?'success':'retry');
  }
  function activate(){render()}

  $('eclipseBuilderMission').addEventListener('change',()=>selectMission($('eclipseBuilderMission').value));
  ['eclipseBuilderEastWest','eclipseBuilderNorthSouth','eclipseBuilderMoonDiameter'].forEach(id=>$(id).addEventListener('input',readControls));
  $('eclipseBuilderCheck').addEventListener('click',check);
  $('eclipseBuilderReset').addEventListener('click',()=>selectMission(mission.id));
  $('eclipseBuilderHint').addEventListener('click',()=>feedback(mission.hint));
  $('eclipseBuilderNext').addEventListener('click',()=>{
    const index=missions.findIndex(item=>item.id===mission.id);
    const next=missions.slice(index+1).concat(missions.slice(0,index+1)).find(item=>!session.has(item.id));
    if(next){selectMission(next.id);$('eclipseBuilderMission').focus()}
  });
  $('eclipseBuilderRestart').addEventListener('click',()=>{session.reset();selectMission(missions[0].id);$('eclipseBuilderMission').focus()});
  global.addEventListener('resize',()=>{if(!$('eclipseBuilderPane').hidden)render()});
  global.EclipseBuilder={activate,selectMission};
  selectMission(missions[0].id);
})(typeof globalThis!=='undefined'?globalThis:window);
