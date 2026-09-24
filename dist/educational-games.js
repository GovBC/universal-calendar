(function(global){
  'use strict';

  var YEAR_DAYS=365;
  var DAY_MS=86400000;
  var LATITUDE=24;
  var challenges=[
    {id:'north-summer',title:'صيف النصف الشمالي',hint:'اجعل القطب الشمالي مائلًا نحو الشمس قرب انقلاب يونيو.',start:{tilt:8,day:35},tiltRange:[20,27],dayRanges:[[158,186]],declinationRange:[18,28],weights:{day:.38,tilt:.34,declination:.28}},
    {id:'north-winter',title:'شتاء النصف الشمالي',hint:'اجعل القطب الشمالي بعيدًا عن الشمس قرب انقلاب ديسمبر.',start:{tilt:8,day:172},tiltRange:[20,27],dayRanges:[[340,365],[1,14]],declinationRange:[-28,-18],weights:{day:.38,tilt:.34,declination:.28}},
    {id:'equinox',title:'اعتدال الربيع أو الخريف',hint:'اجعل الشمس قريبة من خط الاستواء السماوي.',start:{tilt:32,day:172},tiltRange:[5,45],dayRanges:[[74,86],[260,272]],declinationRange:[-2,2],weights:{day:.55,tilt:.05,declination:.4}},
    {id:'no-seasons',title:'كوكب بلا فصول تقريبًا',hint:'قرّب ميل المحور من الصفر لتختفي الفروق الفصلية الكبيرة.',start:{tilt:23.4,day:172},tiltRange:[0,1.5],dayRanges:[[1,365]],declinationRange:[-1.5,1.5],weights:{day:0,tilt:.74,declination:.26}},
    {id:'strong-seasons',title:'فصول قوية جدًا',hint:'ارفع الميل كثيرًا واجعل الشمال مواجهًا للشمس عند الانقلاب.',start:{tilt:12,day:80},tiltRange:[34,45],dayRanges:[[158,186]],declinationRange:[30,45],weights:{day:.32,tilt:.38,declination:.3}}
  ];

  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function ar(value){return String(value).replace(/[0-9]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[Number(d)]})}
  function fmt(value,digits){return ar(Number(value).toFixed(digits===undefined?1:digits).replace('.', '٫'))}
  function signed(value){return (value>=0?'+':'−')+fmt(Math.abs(value),1)+'°'}
  function phaseForDay(day){return (day-80)/YEAR_DAYS*Math.PI*2}
  function solarDeclination(tilt,day){return Number(tilt)*Math.sin(phaseForDay(day))}
  function circularDistance(day,target){var delta=Math.abs(day-target);return Math.min(delta,YEAR_DAYS-delta)}
  function dayRangeDistance(day,ranges){
    var best=YEAR_DAYS;
    ranges.forEach(function(range){
      var start=range[0],end=range[1],inside=start<=end?day>=start&&day<=end:day>=start||day<=end;
      if(inside){best=0;return}
      best=Math.min(best,circularDistance(day,start),circularDistance(day,end));
    });
    return best;
  }
  function rangeDistance(value,range){
    if(!range)return 0;
    if(value>=range[0]&&value<=range[1])return 0;
    return Math.min(Math.abs(value-range[0]),Math.abs(value-range[1]));
  }
  function scoreFromDistance(distance,tolerance){return clamp(1-distance/tolerance,0,1)}
  function daylightHours(latitude,declination){
    var lat=latitude*Math.PI/180,dec=declination*Math.PI/180;
    var term=-Math.tan(lat)*Math.tan(dec);
    if(term<=-1)return 24;
    if(term>=1)return 0;
    return 24*Math.acos(term)/Math.PI;
  }
  function hourText(hours){
    var total=Math.round(hours*60),h=Math.floor(total/60),m=total%60;
    return ar(h)+'س '+ar(String(m).padStart(2,'0'))+'د';
  }
  function seasonName(declination,day){
    if(Math.abs(declination)<1.8)return day<180?'اعتدال ربيعي':'اعتدال خريفي';
    return declination>0?'الصيف':'الشتاء';
  }
  function challengeById(id){return challenges.find(function(item){return item.id===id})||challenges[0]}
  function evaluate(tilt,day,id){
    var challenge=challengeById(id),declination=solarDeclination(tilt,day),weights=challenge.weights||{day:.4,tilt:.3,declination:.3};
    var dayScore=scoreFromDistance(dayRangeDistance(day,challenge.dayRanges),55);
    var tiltScore=scoreFromDistance(rangeDistance(tilt,challenge.tiltRange),18);
    var declinationScore=scoreFromDistance(rangeDistance(declination,challenge.declinationRange),18);
    var score=Math.round(100*(dayScore*(weights.day||0)+tiltScore*(weights.tilt||0)+declinationScore*(weights.declination||0)));
    return {
      score:clamp(score,0,100),
      solved:score>=85,
      close:score>=62&&score<85,
      declination:declination,
      northSeason:seasonName(declination,day),
      northDaylight:daylightHours(LATITUDE,declination),
      southDaylight:daylightHours(-LATITUDE,declination),
      challenge:challenge
    };
  }

  global.EducationalGamesMath={challenges:challenges,solarDeclination:solarDeclination,daylightHours:daylightHours,evaluate:evaluate,seasonName:seasonName,dayRangeDistance:dayRangeDistance};
  if(typeof document==='undefined')return;

  var page=document.getElementById('games');
  var canvas=document.getElementById('seasonGameCanvas');
  var tiltInput=document.getElementById('seasonTilt');
  var dayInput=document.getElementById('seasonDay');
  if(!page||!canvas||!tiltInput||!dayInput)return;

  var ctx=canvas.getContext('2d');
  var state={tilt:+tiltInput.value,day:+dayInput.value,challenge:'north-summer'};
  var els={
    tiltValue:document.getElementById('seasonTiltValue'),
    dayValue:document.getElementById('seasonDayValue'),
    score:document.getElementById('seasonGameScore'),
    title:document.getElementById('seasonChallengeTitle'),
    hint:document.getElementById('seasonChallengeHint'),
    status:document.getElementById('seasonGameStatus'),
    declination:document.getElementById('seasonDeclination'),
    northLabel:document.getElementById('seasonNorthLabel'),
    northDaylight:document.getElementById('seasonNorthDaylight'),
    southDaylight:document.getElementById('seasonSouthDaylight')
  };

  function dateText(day){
    var date=new Date(Date.UTC(2026,0,1,12)+(Math.round(day)-1)*DAY_MS);
    try{return new Intl.DateTimeFormat('ar-SA-u-ca-gregory',{day:'numeric',month:'long',timeZone:'UTC'}).format(date)}
    catch{return 'اليوم '+ar(day)}
  }

  function drawStars(w,h){
    ctx.save();
    for(var i=0;i<90;i++){
      var x=(i*137%997)/997*w,y=(i*271%991)/991*h,r=i%19===0?1.7:1;
      ctx.fillStyle='rgba(218,239,255,'+(.16+(i%7)*.045)+')';
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  function drawArrow(x1,y1,x2,y2,color){
    var angle=Math.atan2(y2-y1,x2-x1);
    ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-Math.cos(angle-.42)*10,y2-Math.sin(angle-.42)*10);ctx.lineTo(x2-Math.cos(angle+.42)*10,y2-Math.sin(angle+.42)*10);ctx.closePath();ctx.fill();ctx.restore();
  }

  function drawScene(result){
    var rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,rect.width),h=Math.max(1,rect.height);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    var bg=ctx.createRadialGradient(w*.48,h*.43,0,w*.48,h*.43,Math.max(w,h)*.75);
    bg.addColorStop(0,'#123a5f');bg.addColorStop(.55,'#071726');bg.addColorStop(1,'#02070d');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    drawStars(w,h);

    var sunX=w*.16,sunY=h*.43,earthX=w*.65,earthY=h*.45,earthR=Math.min(w,h)*.122;
    var sunR=Math.min(w,h)*.07;
    var sunGlow=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,sunR*2.4);
    sunGlow.addColorStop(0,'rgba(255,218,119,.9)');sunGlow.addColorStop(.35,'rgba(246,200,95,.28)');sunGlow.addColorStop(1,'rgba(246,200,95,0)');
    ctx.fillStyle=sunGlow;ctx.beginPath();ctx.arc(sunX,sunY,sunR*2.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffd66f';ctx.beginPath();ctx.arc(sunX,sunY,sunR,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(4,13,22,.72)';ctx.font='700 13px Tajawal, Arial';ctx.textAlign='center';ctx.fillText('الشمس',sunX,sunY+sunR+22);
    for(var ray=-2;ray<=2;ray++)drawArrow(sunX+sunR+10,sunY+ray*23,earthX-earthR-8,earthY+ray*18,'rgba(246,200,95,.42)');

    var dayNight=ctx.createLinearGradient(earthX-earthR,earthY,earthX+earthR,earthY);
    dayNight.addColorStop(0,'#2c8fc1');dayNight.addColorStop(.45,'#1d6c9d');dayNight.addColorStop(.55,'#0d2942');dayNight.addColorStop(1,'#051321');
    ctx.save();ctx.beginPath();ctx.arc(earthX,earthY,earthR,0,Math.PI*2);ctx.clip();ctx.fillStyle=dayNight;ctx.fillRect(earthX-earthR,earthY-earthR,earthR*2,earthR*2);
    ctx.fillStyle='rgba(104,214,173,.8)';ctx.beginPath();ctx.ellipse(earthX-earthR*.2,earthY-earthR*.18,earthR*.34,earthR*.16,-.25,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(earthX+earthR*.28,earthY+earthR*.2,earthR*.26,earthR*.14,.38,0,Math.PI*2);ctx.fill();
    ctx.restore();
    ctx.strokeStyle='rgba(174,232,255,.45)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(earthX,earthY,earthR,0,Math.PI*2);ctx.stroke();

    var lean=clamp(result.declination/45,-1,1)*.85,axisAngle=-Math.PI/2-lean,axisLength=earthR*1.55;
    var nx=earthX+Math.cos(axisAngle)*axisLength,ny=earthY+Math.sin(axisAngle)*axisLength;
    var sx=earthX-Math.cos(axisAngle)*axisLength,sy=earthY-Math.sin(axisAngle)*axisLength;
    ctx.strokeStyle='#55d8f2';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(nx,ny);ctx.stroke();
    ctx.fillStyle=result.declination>=0?'#f6c85f':'#7fcfff';ctx.beginPath();ctx.arc(nx,ny,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=result.declination>=0?'#7fcfff':'#f6c85f';ctx.beginPath();ctx.arc(sx,sy,4.5,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.translate(earthX,earthY);ctx.rotate(axisAngle+Math.PI/2);ctx.strokeStyle='rgba(104,214,173,.78)';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(0,0,earthR*1.04,earthR*.22,0,0,Math.PI*2);ctx.stroke();ctx.restore();

    var orbitX=w*.23,orbitY=h*.78,orbitW=w*.32,orbitH=h*.16,phase=phaseForDay(state.day)-Math.PI/2;
    ctx.strokeStyle='rgba(139,120,230,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(orbitX,orbitY,orbitW*.5,orbitH*.5,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#f6c85f';ctx.beginPath();ctx.arc(orbitX,orbitY,7,0,Math.PI*2);ctx.fill();
    var dotX=orbitX+Math.cos(phase)*orbitW*.5,dotY=orbitY+Math.sin(phase)*orbitH*.5;
    ctx.fillStyle='#55d8f2';ctx.beginPath();ctx.arc(dotX,dotY,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(217,237,248,.72)';ctx.font='12px Tajawal, Arial';ctx.textAlign='center';ctx.fillText(dateText(state.day),orbitX,orbitY+orbitH*.5+24);

    var barX=w*.73,barY=h*.72,barW=Math.min(170,w*.2),barH=8,north=clamp((result.northDaylight-8)/8,0,1),south=clamp((result.southDaylight-8)/8,0,1);
    ctx.textAlign='right';ctx.font='700 12px Tajawal, Arial';ctx.fillStyle='rgba(217,237,248,.78)';ctx.fillText('طول النهار',barX+barW,barY-12);
    [['الشمال',north,0],['الجنوب',south,24]].forEach(function(item){
      ctx.fillStyle='rgba(255,255,255,.09)';ctx.fillRect(barX,barY+item[2],barW,barH);
      ctx.fillStyle=item[1]>.55?'#f6c85f':'#7fcfff';ctx.fillRect(barX,barY+item[2],barW*item[1],barH);
      ctx.fillStyle='rgba(217,237,248,.7)';ctx.fillText(item[0],barX-8,barY+item[2]+9);
    });
  }

  function messageFor(result,checked){
    if(result.solved)return checked?'أحسنت، هذا يطابق التحدي. جرّب تحديًا آخر.':'الحل مضبوط تقريبًا؛ اضغط تحقق لتثبيته.';
    if(result.close)return checked?'قريب جدًا. راقب هل اليوم حول الانقلاب أو الاعتدال وهل الميل في النطاق المطلوب.':'قريب من الحل، جرّب تعديلًا صغيرًا.';
    return checked?'لم يصل بعد. الفصول تحتاج ميلًا مناسبًا وموضعًا مناسبًا في السنة معًا.':'حرّك المنزلقين ثم اضغط تحقق من الحل.';
  }

  function render(checked){
    if(document.getElementById('seasonGamePane')?.hidden)return;
    var result=evaluate(state.tilt,state.day,state.challenge);
    tiltInput.value=state.tilt;dayInput.value=state.day;
    els.tiltValue.textContent=fmt(state.tilt,1)+'°';
    els.dayValue.textContent='اليوم '+ar(Math.round(state.day))+' • '+dateText(state.day);
    els.score.textContent=ar(result.score)+'٪';
    els.title.textContent=result.challenge.title;
    els.hint.textContent=result.challenge.hint;
    els.declination.textContent=signed(result.declination);
    els.northLabel.textContent=result.northSeason;
    els.northDaylight.textContent=hourText(result.northDaylight);
    els.southDaylight.textContent=hourText(result.southDaylight);
    els.status.textContent=messageFor(result,checked);
    els.status.classList.toggle('success',result.solved);
    els.status.classList.toggle('close',result.close);
    document.querySelectorAll('[data-season-challenge]').forEach(function(button){button.classList.toggle('active',button.dataset.seasonChallenge===state.challenge)});
    drawScene(result);
  }

  function setChallenge(id){
    var challenge=challengeById(id);
    state.challenge=challenge.id;state.tilt=challenge.start.tilt;state.day=challenge.start.day;render(false);
  }

  tiltInput.addEventListener('input',function(){state.tilt=+tiltInput.value;render(false)});
  dayInput.addEventListener('input',function(){state.day=+dayInput.value;render(false)});
  document.getElementById('seasonCheck')?.addEventListener('click',function(){render(true)});
  document.getElementById('seasonReset')?.addEventListener('click',function(){setChallenge(state.challenge)});
  document.querySelectorAll('[data-season-challenge]').forEach(function(button){button.addEventListener('click',function(){setChallenge(button.dataset.seasonChallenge)})});
  window.addEventListener('resize',function(){render(false)});

  var selectedGame='crescent';
  function activate(){
    if(selectedGame==='crescent')global.CrescentHunter?.activate();
    else if(selectedGame==='eclipse')global.EclipseBuilder?.activate();
    else if(selectedGame==='prayer')global.PrayerTimeGame?.activate();
    else render(false);
  }
  function selectGame(name){
    selectedGame=['crescent','eclipse','prayer','season'].includes(name)?name:'crescent';
    document.getElementById('seasonGamePane').hidden=selectedGame!=='season';
    document.getElementById('crescentGamePane').hidden=selectedGame!=='crescent';
    document.getElementById('eclipseBuilderPane').hidden=selectedGame!=='eclipse';
    document.getElementById('prayerTimeGamePane').hidden=selectedGame!=='prayer';
    document.querySelectorAll('[data-educational-game]').forEach(function(button){
      button.setAttribute('aria-pressed',String(button.dataset.educationalGame===selectedGame));
    });
    activate();
  }
  document.querySelectorAll('[data-educational-game]').forEach(function(button){
    button.addEventListener('click',function(){selectGame(button.dataset.educationalGame)});
  });
  global.EducationalGames={activate:activate,setChallenge:setChallenge,selectGame:selectGame};
})(typeof globalThis!=='undefined'?globalThis:window);
