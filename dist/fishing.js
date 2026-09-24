(function(){
  'use strict';

  const C=globalThis.CalendarCore;
  const $=selector=>document.querySelector(selector);
  const all=selector=>[...document.querySelectorAll(selector)];
  if(!C||!$('#fishingCalendarPane'))return;

  const months=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const regionData={
    'red-sea':{
      name:'البحر الأحمر',
      summary:'مناسب لسواحل المملكة الغربية واليمن ومصر والسودان، مع اختلاف واضح بين الساحل المفتوح والخلجان والشعاب.',
      regulation:'في السعودية تتغير فترات السماح والمنع والمقاسات والأدوات بقرارات رسمية؛ لا تُعد هذه الخريطة تصريحًا بالصيد، وخصوصًا في مواسم حماية الربيان والأنواع المتكاثرة.',
      source:'https://www.mewa.gov.sa/ar/Ministry/Agencies/AgencyFisheries/Pages/agency.aspx',
      sourceLabel:'تعليمات وكالة الثروة السمكية السعودية',
      species:[
        {name:'الأسماك الشعابية',type:'fish',icon:'🐟',season:[10,11,12,1,2,3,4],peak:[11,12,1,2],aliases:'هامور • شعري • أسماك القاع',note:'تزداد الفرص الإرشادية مع اعتدال حرارة الماء واستقرار البحر حول الشعاب.'},
        {name:'الأسماك السطحية المهاجرة',type:'fish',icon:'🐟',season:[9,10,11,12,1,2],peak:[10,11,12],aliases:'كنعد • تونة ساحلية • أنواع مهاجرة',note:'تتأثر بالتيارات والحرارة وتجمعات الطُعم أكثر من تأثرها بالشهر وحده.'},
        {name:'الحبار والأسماك الساحلية',type:'fish',icon:'🐟',season:[3,4,5,9,10,11],peak:[3,4,10],aliases:'حبار • باراكودا • أسماك شاطئية',note:'قد تتحسن الفرص عند الفجر والغروب وفي المياه الهادئة نسبيًا.'},
        {name:'الربيان الساحلي',type:'shrimp',icon:'🦐',season:[8,9,10,11,12,1,2],peak:[9,10,11],aliases:'ربيان البحر الأحمر',note:'الموسم الإرشادي مرتبط بدورة الربيان، لكن تاريخ الفتح والمنع الرسمي يتغير بحسب القرار الساري.'}
      ]
    },
    'arabian-gulf':{
      name:'الخليج العربي',
      summary:'مناسب لسواحل المنطقة الشرقية ودول الخليج، حيث تتغير الفرص مع حرارة المياه والرياح الشمالية ومواسم الربيان.',
      regulation:'أعلنت الجهات السعودية في أعوام سابقة مواسم موسمية للربيان، كما فُرضت فترات حماية لبعض الأسماك مثل الكنعد؛ راجع القرار المنشور للسنة والموقع قبل الخروج.',
      source:'https://www.mewa.gov.sa/ar/MediaCenter/PressReleases/PressFiles/2025-07-22.pdf',
      sourceLabel:'إعلان وزارة البيئة عن موسم الربيان في المنطقة الشرقية',
      species:[
        {name:'الربيان الساحلي',type:'shrimp',icon:'🦐',season:[8,9,10,11,12,1],peak:[9,10,11],aliases:'ربيان الخليج العربي',note:'تظهر الذروة الإرشادية بعد بداية الموسم المفتوح عادةً، لكن التواريخ القانونية سنوية.'},
        {name:'الكنعد والأسماك السطحية',type:'fish',icon:'🐟',season:[9,10,11,12,1,2],peak:[10,11],aliases:'كنعد • صافي • أسماك مهاجرة',note:'تتحسن الفرص مع مرور الأسراب واستقرار الرياح والتيارات.'},
        {name:'الهامور والشعري',type:'fish',icon:'🐟',season:[10,11,12,1,2,3,4],peak:[11,12,1,2],aliases:'أسماك قاعية وشعابية',note:'المياه الأبرد نسبيًا تساعد على نشاط الصيد في كثير من المواقع.'},
        {name:'الصافي والبدح والأسماك الساحلية',type:'fish',icon:'🐟',season:[3,4,5,6,9,10],peak:[3,4,5,10],aliases:'أسماك ضحلة • أنواع ساحلية',note:'تختلف الفرص كثيرًا بحسب عمق الموقع والقاع والمد والجزر.'}
      ]
    },
    'arabian-sea':{
      name:'بحر العرب وخليج عُمان',
      summary:'مواسم واسعة تتأثر بالرياح الموسمية والتيارات، وتختلف بين خليج عُمان وسواحل بحر العرب المفتوحة.',
      regulation:'تُحدَّد الرخص وفترات المنع والمعدات المسموحة محليًا في كل دولة وساحل؛ استخدم هذا العرض للمقارنة الموسمية فقط.',
      source:'https://www.fao.org/4/x8691e/x8691e06.htm',
      sourceLabel:'مرجع إقليمي لمنظمة الأغذية والزراعة',
      species:[
        {name:'الربيان',type:'shrimp',icon:'🦐',season:[9,10,11,12],peak:[9,10,11,12],aliases:'مصايد الربيان الساحلية',note:'يميل النشاط الإرشادي إلى الخريف في بعض سواحل خليج عُمان، مع اختلاف الموقع واللوائح.'},
        {name:'الكنعد والتونة الساحلية',type:'fish',icon:'🐟',season:[9,10,11,12,1,2,3,4],peak:[10,11,12,1],aliases:'أسماك سطحية مهاجرة',note:'التيارات الموسمية وتجمعات الطُعم من أهم محددات النجاح.'},
        {name:'أسماك الشعاب والقاع',type:'fish',icon:'🐟',season:[11,12,1,2,3,4,5],peak:[12,1,2,3],aliases:'هامور • شعري • أنواع شعابية',note:'تتحسن الفرص عادةً مع البحر الأهدأ واعتدال الحرارة.'},
        {name:'الحبار',type:'fish',icon:'🐟',season:[11,12,1,2,3],peak:[12,1,2],aliases:'حبار وأصناف قريبة',note:'الفجر والليل والمد والجزر قد تغير النتيجة اليومية بصورة كبيرة.'}
      ]
    },
    mediterranean:{
      name:'البحر المتوسط',
      summary:'عرض عام لسواحل المتوسط؛ يلزم اختيار الدولة والخلجان المحلية للحصول على جدول أدق ومحدث قانونيًا.',
      regulation:'تختلف فترات المنع والمقاسات ومناطق الحماية بين دول المتوسط؛ راجع الجهة البحرية المحلية قبل أي رحلة صيد.',
      source:'https://www.fao.org/fishery/en/collection/firms',
      sourceLabel:'إحصاءات ومراجع مصايد منظمة الأغذية والزراعة',
      species:[
        {name:'الدنيس والقاروص',type:'fish',icon:'🐟',season:[3,4,5,9,10,11,12],peak:[4,5,10,11],aliases:'أسماك ساحلية وقاعية',note:'الربيع والخريف يقدمان نافذتين إرشاديتين شائعتين، مع اختلاف السواحل.'},
        {name:'السردين والماكريل',type:'fish',icon:'🐟',season:[6,7,8,9,10],peak:[7,8,9],aliases:'أسماك سطحية أسرابية',note:'تتبع الأسراب حرارة الماء وتوفر الغذاء والتيارات.'},
        {name:'الربيان',type:'shrimp',icon:'🦐',season:[4,5,6,9,10,11],peak:[5,10,11],aliases:'ربيان ساحلي',note:'يتغير موسم الذروة باختلاف الحوض والعمق والحماية المحلية.'},
        {name:'الحبار',type:'fish',icon:'🐟',season:[10,11,12,1,2,3],peak:[11,12,1],aliases:'حبار وأصناف رأسيات الأرجل',note:'يُراعى الصيد المسؤول أثناء فترات التكاثر ومناطق الحضانة.'}
      ]
    },
    global:{
      name:'عرض عام عالمي',
      summary:'نمط مقارن عام للمواسم البحرية؛ لا يحدد نوعًا أو بلدًا بعينه، ولذلك لا يغني عن بيانات الساحل المحلي.',
      regulation:'الأنظمة والمواسم الرسمية محلية. استخدم هذا العرض لفهم فكرة الموسم فقط، ثم راجع الجهة المختصة في بلدك.',
      source:'https://www.fao.org/fishery/en/collection/firms',
      sourceLabel:'مراجع المصايد العالمية — منظمة الأغذية والزراعة',
      species:[
        {name:'أسماك سطحية مهاجرة',type:'fish',icon:'🐟',season:[3,4,5,9,10,11],peak:[4,5,10,11],aliases:'أنواع أسرابية واسعة الانتشار',note:'الهجرة مرتبطة بالتيارات والحرارة والغذاء.'},
        {name:'أسماك قاعية وشعابية',type:'fish',icon:'🐟',season:[10,11,12,1,2,3],peak:[11,12,1],aliases:'أنواع قاعية وساحلية',note:'العمق، القاع، حرارة الماء والطقس عوامل حاسمة.'},
        {name:'الربيان',type:'shrimp',icon:'🦐',season:[8,9,10,11,12,1],peak:[9,10,11],aliases:'أنواع ربيان ساحلية',note:'الموسم القانوني ودورة التكاثر يختلفان بين المصايد.'},
        {name:'الحبار',type:'fish',icon:'🐟',season:[10,11,12,1,2,3],peak:[11,12,1],aliases:'رأسيات الأرجل',note:'تؤثر الإضاءة والمد والجزر والعمق في النشاط اليومي.'}
      ]
    }
  };

  const regionSelect=$('#fishingRegion'),typeSelect=$('#fishingType');
  let manualRegion=false;
  const number=value=>new Intl.NumberFormat('ar-SA',{useGrouping:false,maximumFractionDigits:0}).format(value);
  const localMonth=()=>{
    const parts=new Intl.DateTimeFormat('en-u-ca-gregory',{timeZone:C.location.zone,month:'numeric'}).formatToParts(new Date());
    return +(parts.find(part=>part.type==='month')?.value||1);
  };
  function inferredRegion(loc){
    const name=String(loc?.name||'').toLowerCase();
    if(/دمام|قطيف|جبيل|خبر|خفجي|رأس تنورة|رأس تنوره|البحرين|الكويت|الدوحة|أبو ظبي|ابوظبي|دبي/.test(name))return'arabian-gulf';
    if(/مسقط|صلالة|صلاله|صحار|صور|خصب|عُمان|عمان/.test(name))return'arabian-sea';
    if(/الإسكندرية|الاسكندرية|طرابلس|بيروت|اللاذقية|تونس|الجزائر|طنجة|مرسيليا|برشلونة/.test(name))return'mediterranean';
    if(Number.isFinite(+loc?.lon)&&+loc.lon>=47&&+loc.lon<=62&&+loc.lat>=14&&+loc.lat<=31)return'arabian-gulf';
    if(Number.isFinite(+loc?.lon)&&+loc.lon>=48&&+loc.lon<=66&&+loc.lat<25)return'arabian-sea';
    if(Number.isFinite(+loc?.lon)&&+loc.lon>=32&&+loc.lon<44&&+loc.lat>=10&&+loc.lat<=31)return'red-sea';
    return'red-sea';
  }
  function selectedSpecies(profile){
    const kind=typeSelect.value;
    return profile.species.filter(item=>kind==='all'||item.type===kind);
  }
  function rating(profile,month){
    const list=selectedSpecies(profile);
    if(!list.length)return{score:0,label:'لا بيانات',className:'low',list:[]};
    const peaks=list.filter(item=>item.peak.includes(month)).length;
    const seasons=list.filter(item=>item.season.includes(month)).length;
    const score=Math.round(((peaks/list.length)*.7+(seasons/list.length)*.3)*100);
    if(score>=70)return{score,label:'ذروة',className:'peak',list};
    if(score>=45)return{score,label:'جيد',className:'good',list};
    if(score>=20)return{score,label:'متوسط',className:'fair',list};
    return{score,label:'أقل نشاطًا',className:'low',list};
  }
  function bestNames(profile,month){
    const list=selectedSpecies(profile),peaks=list.filter(item=>item.peak.includes(month));
    return(peaks.length?peaks:list.filter(item=>item.season.includes(month))).map(item=>item.name).slice(0,3);
  }
  function render(){
    const key=regionSelect.value||'red-sea',profile=regionData[key]||regionData['red-sea'],month=localMonth(),list=selectedSpecies(profile);
    $('#fishingRegionSummary').textContent=`${profile.summary} الموقع الحالي: ${C.location.name}.`;
    $('#fishingRegulationNote').textContent=profile.regulation;
    const source=$('#fishingSourceLink');source.href=profile.source;source.textContent=profile.sourceLabel+' ↗';
    $('#fishingMonthGrid').innerHTML=months.map((monthName,index)=>{
      const monthNumber=index+1,r=rating(profile,monthNumber),names=bestNames(profile,monthNumber),current=monthNumber===month;
      return `<article class="fishing-month-card ${r.className}${current?' current':''}" aria-label="${monthName}: ${r.label}، ${number(r.score)} من ١٠٠"><div class="fishing-month-top"><b>${monthName}</b>${current?'<span class="fishing-now-badge">الآن</span>':''}</div><div class="fishing-month-status"><span>${r.label}</span><b>${number(r.score)}</b></div><div class="fishing-meter" aria-hidden="true"><i style="--value:${r.score}%"></i></div><p>${names.length?names.join(' • '):'لا ذروة واضحة في هذا الشهر'}</p></article>`;
    }).join('');

    const nowRating=rating(profile,month),nowNames=bestNames(profile,month);
    $('#fishingNowTitle').textContent=`${months[month-1]} • ${profile.name}`;
    $('#fishingNowText').textContent=nowNames.length?`أفضل الفرص الإرشادية هذا الشهر: ${nowNames.join('، ')}. راقب الطقس والمد والجزر وتعليمات الصيد المحلية.`:'لا تظهر ذروة واضحة في هذا الشهر ضمن المجموعة المختارة؛ قد يظل الصيد ممكنًا بحسب الموقع والظروف اليومية.';
    $('#fishingNowScore').textContent=`${number(nowRating.score)} / ١٠٠`;
    $('#fishingNowLabel').textContent=nowRating.label;
    $('#fishingSpeciesCount').textContent=`${number(list.length)} أنواع إرشادية`;
    $('#fishingSpeciesList').innerHTML=list.map(item=>`<article class="fishing-species-row"><span class="fishing-species-icon" aria-hidden="true">${item.icon}</span><div><div class="fishing-species-head"><h4>${item.name}</h4><em>${item.type==='shrimp'?'ربيان':'أسماك'}</em></div><p>${item.aliases}</p><small><b>الذروة:</b> ${item.peak.map(m=>months[m-1]).join('، ')}</small><small class="fishing-species-note">${item.note}</small></div></article>`).join('');
  }

  function setCalendarTab(tab){
    if(!['dates','fishing'].includes(tab))return;
    const fishing=tab==='fishing';
    all('[data-calendar-tab]').forEach(button=>{
      const active=button.dataset.calendarTab===tab;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });
    const dates=$('#calendarDatesPane'),pane=$('#fishingCalendarPane');
    dates.classList.toggle('active',!fishing);dates.hidden=fishing;
    pane.classList.toggle('active',fishing);pane.hidden=!fishing;
    if(fishing)render();
  }

  regionSelect.value=inferredRegion(C.location);
  all('[data-calendar-tab]').forEach(button=>button.addEventListener('click',()=>setCalendarTab(button.dataset.calendarTab)));
  regionSelect.addEventListener('change',()=>{manualRegion=true;render();});
  typeSelect.addEventListener('change',render);
  addEventListener('calendar-location',()=>{if(!manualRegion)regionSelect.value=inferredRegion(C.location);render();});
  render();
})();
