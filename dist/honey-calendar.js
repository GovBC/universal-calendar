(() => {
  'use strict';

  const C = globalThis.CalendarCore;
  const $ = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const zoneNames = {
    'arabia-west':'غرب وجنوب غرب الجزيرة العربية',
    'arabia-interior':'وسط وشمال الجزيرة العربية',
    gulf:'الخليج العربي والسواحل الحارة',
    mediterranean:'المناخ المتوسطي',
    temperate:'المناخ المعتدل والبارد',
    tropical:'المناخ المداري'
  };
  const categoryNames = {flower:'الورود والنباتات المزهرة',tree:'أزهار الأشجار',honeydew:'الندوة العسلية'};
  const icons = {flower:'✿',tree:'♧',honeydew:'◌'};
  const common = {
    'arabia-west': {flower:[2,3,4,5], tree:[3,4,5,6,7,8,9,10,11], honeydew:[3,4,5,9,10,11]},
    'arabia-interior': {flower:[2,3,4,5], tree:[4,5,6,7,8,9,10], honeydew:[3,4,5,9,10]},
    gulf: {flower:[1,2,3,4,11,12], tree:[2,3,4,5,9,10,11], honeydew:[2,3,4,10,11]},
    mediterranean: {flower:[3,4,5,6,9,10], tree:[2,3,4,5,6,7,8,9], honeydew:[4,5,6,7,8,9]},
    temperate: {flower:[4,5,6,7,8,9], tree:[3,4,5,6,7], honeydew:[5,6,7,8,9]},
    tropical: {flower:[1,2,3,4,5,6,7,8,9,10,11,12], tree:[1,2,3,4,5,6,7,8,9,10,11,12], honeydew:[1,2,3,4,5,6,7,8,9,10,11,12]}
  };
  const sources = [
    {key:'spring',name:'الزهور البرية الربيعية',category:'flower',scientific:'مزيج من الحوليات والنباتات الرعوية',description:'مرعى متنوع للرحيق وحبوب اللقاح يشتد بعد أمطار نافعة واعتدال الحرارة.',seasons:{'arabia-west':[[2,3,4,5],[3,4]],'arabia-interior':[[2,3,4,5],[3,4]],gulf:[[1,2,3,4],[2,3]],mediterranean:[[3,4,5,6],[4,5]],temperate:[[4,5,6,7],[5,6]],tropical:[[2,3,4,8,9,10],[3,9]]}},
    {key:'lavender',name:'الضرم والخزامى البرية',category:'flower',scientific:'Lavandula spp.',description:'مصدر رحيق عطري مهم في البيئات الجبلية والمتوسطية، ويتبدل موعده مع الارتفاع.',seasons:{'arabia-west':[[4,5,6,7],[5,6]],'arabia-interior':[[2,3,4],[3]],gulf:[[1,2,3],[2]],mediterranean:[[5,6,7],[6]],temperate:[[6,7,8],[7]],tropical:[[1,2,7,8],[2,8]]}},
    {key:'clover',name:'البرسيم والنباتات العلفية',category:'flower',scientific:'Medicago وTrifolium spp.',description:'قد يطول موسمه مع الري وتتابع الحش، ويجمع النحل منه الرحيق وحبوب اللقاح.',seasons:{'arabia-west':[[2,3,4,5,10,11],[3,4]],'arabia-interior':[[3,4,5,9,10],[4,10]],gulf:[[1,2,3,4,11,12],[2,3]],mediterranean:[[4,5,6,9,10],[5,9]],temperate:[[5,6,7,8],[6,7]],tropical:[[1,2,3,7,8,9],[2,8]]}},
    {key:'basil',name:'الريحان والحبق',category:'flower',scientific:'Ocimum spp.',description:'إزهار ممتد في الجو الدافئ إذا توفر الماء؛ يفيد خصوصًا بين مواسم الأشجار.',seasons:{'arabia-west':[[4,5,6,7,8,9,10],[6,7,8]],'arabia-interior':[[5,6,7,8,9],[6,7]],gulf:[[3,4,5,10,11],[4,10]],mediterranean:[[5,6,7,8,9],[7,8]],temperate:[[6,7,8,9],[7,8]],tropical:[[1,2,3,4,5,6,7,8,9,10,11,12],[3,4,8,9]]}},
    {key:'sidr',name:'السدر',category:'tree',scientific:'Ziziphus spina-christi',description:'من أهم أشجار العسل في الجزيرة العربية؛ قد تكون له موجات إزهار مختلفة محليًا.',seasons:{'arabia-west':[[3,8,9,10,11],[9,10]],'arabia-interior':[[8,9,10],[9]],gulf:[[8,9,10,11],[9,10]],mediterranean:[[6,7,8],[7]],temperate:[[6,7],[6]],tropical:[[2,3,7,8,9],[3,8]]}},
    {key:'samr',name:'السَّمُر والسَّلَم',category:'tree',scientific:'Vachellia tortilis وVachellia ehrenbergiana',description:'أشجار صحراوية رحيقية؛ يتأثر تدفقها بقوة بالأمطار السابقة ودرجات الحرارة.',seasons:{'arabia-west':[[4,5,6],[4,5]],'arabia-interior':[[4,5,6],[5]],gulf:[[3,4,5],[4]],mediterranean:[[5,6],[5]],temperate:[[6,7],[6]],tropical:[[1,2,6,7],[2,7]]}},
    {key:'talh',name:'الطلح والسيال',category:'tree',scientific:'Vachellia spp.',description:'مجموعة من أشجار الأكاسيا المحلية ذات مواسم متعاقبة بحسب النوع والمنطقة.',seasons:{'arabia-west':[[6,7,8,9],[7,8]],'arabia-interior':[[5,6,7,8],[6,7]],gulf:[[4,5,6],[5]],mediterranean:[[5,6,7],[6]],temperate:[[6,7],[6]],tropical:[[1,2,7,8],[2,8]]}},
    {key:'citrus',name:'الحمضيات',category:'tree',scientific:'Citrus spp.',description:'أزهار غزيرة وقصيرة نسبيًا، ويُراعى إبعاد الخلايا وقت استخدام مبيدات ضارة بالنحل.',seasons:{'arabia-west':[[2,3,4],[3]],'arabia-interior':[[3,4],[3]],gulf:[[2,3,4],[3]],mediterranean:[[3,4,5],[4]],temperate:[[4,5,6],[5]],tropical:[[1,2,6,7],[2,7]]}},
    {key:'eucalyptus',name:'الكافور والأشجار المزروعة المزهرة',category:'tree',scientific:'Eucalyptus spp. وأشجار حضرية',description:'تختلف الأنواع كثيرًا؛ قد تسد فجوة موسمية عندما تتوفر كثافة زهرية كافية.',seasons:{'arabia-west':[[1,2,3,4,5,9,10,11,12],[2,10]],'arabia-interior':[[3,4,5,9,10],[4,9]],gulf:[[1,2,3,4,10,11,12],[2,11]],mediterranean:[[2,3,4,5,9,10],[3,9]],temperate:[[5,6,7,8],[6,7]],tropical:[[1,2,3,4,5,6,7,8,9,10,11,12],[4,10]]}},
    {key:'orchard-dew',name:'ندوة البساتين والأشجار الظليلة',category:'honeydew',scientific:'إفرازات حشرات ماصّة للعصارة',description:'فرصة مشروطة تُرصد على الأوراق والأغصان؛ وجودها في البستان قد يستلزم تقييم آفة نباتية.',seasons:{'arabia-west':[[3,4,5,9,10,11],[4,10]],'arabia-interior':[[3,4,5,9,10],[4,9]],gulf:[[2,3,4,10,11],[3,10]],mediterranean:[[4,5,6,7,8,9],[6,7]],temperate:[[5,6,7,8],[6,7]],tropical:[[1,2,3,4,5,6,7,8,9,10,11,12],[3,4,9,10]]}},
    {key:'oak-dew',name:'ندوة البلوط والسنديان',category:'honeydew',scientific:'Quercus spp. وحشرات مرتبطة به',description:'تظهر في الغابات الملائمة عند اجتماع الشجرة المضيفة والحشرة والطقس المناسب.',seasons:{'arabia-west':[[5,6,7,8],[6,7]],'arabia-interior':[[5,6],[6]],gulf:[[],[]],mediterranean:[[5,6,7,8,9],[6,7]],temperate:[[6,7,8,9],[7,8]],tropical:[[],[]]}},
    {key:'conifer-dew',name:'ندوة الصنوبر والتنوب',category:'honeydew',scientific:'Pinus وAbies وPicea spp.',description:'مصدر غابي معروف في بعض المناطق الباردة والجبلية، ولا يُفترض وجوده من المناخ وحده.',seasons:{'arabia-west':[[6,7,8],[7]],'arabia-interior':[[],[]],gulf:[[],[]],mediterranean:[[6,7,8,9],[7,8]],temperate:[[6,7,8,9],[7,8]],tropical:[[],[]]}}
  ];

  let selectedDate = new Date();
  let manualZone = false;

  function number(value){return new Intl.NumberFormat('ar',{maximumFractionDigits:0}).format(value);}
  function monthYear(date){
    try{return new Intl.DateTimeFormat('ar-SA',{calendar:'gregory',timeZone:C?.location?.zone||'UTC',month:'long',year:'numeric'}).format(date);}
    catch{return months[date.getMonth()]+' '+number(date.getFullYear());}
  }
  function inferredZone(location){
    const lat=Number(location?.lat)||21.4,lon=Number(location?.lon)||39.8,name=String(location?.name||'');
    if(/عسير|الباحة|جازان|نجران|الطائف|مكة|جدة|المدينة|ينبع|تبوك/.test(name)||(lat>=16&&lat<=29&&lon>=34&&lon<=43))return 'arabia-west';
    if(/الدمام|الخبر|الجبيل|الأحساء|الكويت|الدوحة|المنامة|دبي|أبوظبي|مسقط/.test(name)||(lat>=18&&lat<=31&&lon>48&&lon<=60))return 'gulf';
    if(lat<16)return 'tropical';
    if(lat>=30&&lat<42)return 'mediterranean';
    if(lat>=42)return 'temperate';
    return 'arabia-interior';
  }
  function activeZone(){const selected=$('#honeyZoneSelect')?.value||'auto';return selected==='auto'?inferredZone(C?.location):selected;}
  function filteredSources(){const category=$('#honeyCategorySelect')?.value||'all';return sources.filter(source=>category==='all'||source.category===category);}
  function profile(source,zone){return source.seasons[zone]||[common[zone]?.[source.category]||[],[]];}
  function status(source,zone,month){const [flow,peak]=profile(source,zone);if(peak.includes(month))return {key:'peak',label:'ذروة',weight:3};if(flow.includes(month))return {key:source.category==='honeydew'?'possible':'flow',label:source.category==='honeydew'?'فرصة مشروطة':'تدفق',weight:2};return {key:'quiet',label:'هدوء',weight:0};}
  function monthRange(values){
    const sorted=[...new Set(values)].sort((a,b)=>a-b);if(!sorted.length)return 'غير شائع في هذا النطاق';
    const groups=[];let group=[sorted[0]];for(let i=1;i<sorted.length;i++){if(sorted[i]===sorted[i-1]+1)group.push(sorted[i]);else{groups.push(group);group=[sorted[i]];}}groups.push(group);
    return groups.map(items=>items.length===1?months[items[0]-1]:months[items[0]-1]+'–'+months[items.at(-1)-1]).join('، ');
  }
  function nextPeak(items,zone,month){
    for(let offset=1;offset<=12;offset++){const target=(month-1+offset)%12+1,candidates=items.filter(source=>profile(source,zone)[1].includes(target));if(candidates.length)return months[target-1]+' • '+candidates[0].name;}
    return 'لا توجد ذروة مسجلة';
  }
  function monthScore(items,zone,month){if(!items.length)return 0;const total=items.reduce((sum,source)=>sum+status(source,zone,month).weight,0);return Math.round(total/(items.length*3)*100);}
  function scoreLabel(score){return score>=55?'مرعى قوي':score>=30?'مرعى جيد':score>=12?'مرعى محدود':'فترة هدوء';}

  function render(date){
    if(date instanceof Date&&!Number.isNaN(+date))selectedDate=date;
    if(!C||!$('#calendar-honey-pane'))return;
    const zone=activeZone(),items=filteredSources(),parts=C.parts(selectedDate,'gregory'),month=parts.month;
    const current=items.map(source=>({source,state:status(source,zone,month)})),active=current.filter(item=>item.state.key!=='quiet'),peaks=current.filter(item=>item.state.key==='peak');
    const counts=category=>current.filter(item=>item.source.category===category&&item.state.key!=='quiet').length;
    const score=monthScore(items,zone,month),location=C.location?.name||'الموقع الحالي';
    $('#honeyLocationName').textContent=location;
    $('#honeyZoneLabel').textContent=zoneNames[zone]+' • يتغير مع الموقع';
    $('#honeyNowTitle').textContent=monthYear(selectedDate)+' • '+zoneNames[zone];
    $('#honeyNowDescription').textContent=active.length?`أفضل المصادر المرشحة: ${active.sort((a,b)=>b.state.weight-a.state.weight).slice(0,4).map(item=>item.source.name).join('، ')}. تحقّق ميدانيًا من بدء الإزهار أو ظهور الندوة.`:'لا يظهر تدفق مرعى معتاد في هذا الشهر ضمن المرشح الحالي؛ راقب الإزهار المحلي ومخزون الطائفة.';
    $('#honeyFlowScore').textContent=number(score)+' / ١٠٠';
    $('#honeyFlowLabel').textContent=scoreLabel(score);
    $('#honeyFlowerCount').textContent=number(counts('flower'))+' مصادر نشطة';
    $('#honeyTreeCount').textContent=number(counts('tree'))+' مصادر نشطة';
    $('#honeyDewCount').textContent=number(counts('honeydew'))+' فرص مشروطة';
    $('#honeyNextPeak').textContent=nextPeak(items,zone,month);

    $('#honeyMonthGrid').innerHTML=months.map((name,index)=>{
      const m=index+1,states=items.map(source=>status(source,zone,m)),peakCount=states.filter(state=>state.key==='peak').length,flowCount=states.filter(state=>state.key==='flow'||state.key==='possible').length,value=monthScore(items,zone,m),state=peakCount?'peak':flowCount?'flow':'quiet';
      return `<button type="button" class="honey-month ${state}${m===month?' current':''}" data-honey-month="${m}" role="listitem" aria-label="${name}: ${peakCount} ذروة و${flowCount} مصادر متاحة"><span><b>${name}</b>${m===month?'<em>المحدد</em>':''}</span><div class="honey-month-meter"><i style="--honey-value:${value}%"></i></div><small>${peakCount?number(peakCount)+' ذروة':flowCount?number(flowCount)+' تدفق':'هدوء'}</small></button>`;
    }).join('');

    $('#honeySourceGrid').innerHTML=items.map(source=>{
      const [flow,peak]=profile(source,zone),state=status(source,zone,month);
      return `<article class="honey-source-card ${state.key}"><header><span aria-hidden="true">${icons[source.category]}</span><div><small>${categoryNames[source.category]}</small><h4>${source.name}</h4><em>${source.scientific}</em></div><b>${state.label}</b></header><p>${source.description}</p><footer><span><small>الموسم المعتاد</small><b>${monthRange(flow)}</b></span><span><small>أشهر الذروة</small><b>${monthRange(peak)}</b></span></footer></article>`;
    }).join('');
    $('#honeySourceCount').textContent=number(items.length)+' مصادر';

    all('[data-honey-month]').forEach(button=>button.onclick=()=>{
      const currentParts=C.parts(selectedDate,'gregory'),day=Math.min(currentParts.day,28);
      selectedDate=C.calendarDate(currentParts.year,+button.dataset.honeyMonth,day,'gregory');
      render(selectedDate);
    });
    globalThis.CalendarLanguage?.apply?.();
  }

  $('#honeyZoneSelect')?.addEventListener('change',event=>{manualZone=event.target.value!=='auto';render();});
  $('#honeyCategorySelect')?.addEventListener('change',()=>render());
  addEventListener('calendar-location',()=>{if(!manualZone&&$('#honeyZoneSelect'))$('#honeyZoneSelect').value='auto';render();});
  globalThis.HoneyCalendar={render};
})();
