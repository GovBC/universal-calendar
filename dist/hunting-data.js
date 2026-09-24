/* Monthly regional estimates, not live observations or hunting permits.
 * Sources and verification date travel with the offline dataset. */
(function(root){
  'use strict';
  const sources = {
    season:{name:'المركز الوطني لتنمية الحياة الفطرية — موسم ٢٠٢٦–٢٠٢٧',en:'NCW — 2026–2027 season',url:'https://www.ncw.gov.sa/news/ncw-hunting-season-2026-2027'},
    rules:{name:'الحياة الفطرية — دليل الأنواع والصيد والهجرة',en:'NCW — species, hunting and migration guidance',url:'https://ncw.gov.sa/faq'},
    fitri:{name:'منصة فطري — التراخيص والقائمة السارية',en:'Fitri — permits and current species list',url:'https://eservices.ncw.gov.sa/'},
    raptors:{name:'OSME — مراجعة هجرة الجوارح في الجزيرة العربية',en:'OSME — raptor migration in Arabia',url:'https://osme.org/wp-content/uploads/2023/07/Diurnal-raptor-migration-including-wintering-on-the-Arabian-peninsula-an-overview.pdf'},
    birds:{name:'OSME — سجل ميداني للطيور في السعودية',en:'OSME — field records from Saudi Arabia',url:'https://osme.org/trip-reports/satrip1/'},
    falcons:{name:'دراسة الشاهين والحر في السعودية — ٢٠١٥',en:'Peregrine and Saker study — 2015',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC4486468/'},
    steppe:{name:'CMS — هجرة عقاب السهوب',en:'CMS — Steppe Eagle migration',url:'https://www.cms.int/sites/default/files/document/cms_cop12_doc.25.1.13(b)_listing-proposal-steppe-eagle-sau_e.pdf'},
    north:{name:'واس — هجرة الخريف في شمال المملكة، سبتمبر ٢٠٢٦',en:'SPA — autumn passage in northern Saudi Arabia, September 2026',url:'https://www.spa.gov.sa/en/N2669828'},
    levant:{name:'الجمعية الملكية لحماية الطبيعة — دراسات الطيور في الأردن',en:'RSCN — bird studies in Jordan',url:'https://www.rscn.org.jo/uploaded_files/journal/6983381de5d621770207261.pdf'},
    egypt:{name:'OSME — مواسم الهجرة في مصر',en:'OSME — migration seasons in Egypt',url:'https://osme.org/country-profiles/egypt/'},
    residents:{name:'الحياة الفطرية — الطيور المقيمة في المناطق المحمية',en:'NCW — resident birds in protected areas',url:'https://www.ncw.gov.sa/protected-areas'}
  };
  const regions = [
    {id:'riyadh',name:'الرياض',en:'Riyadh',area:'central',country:'sa'},
    {id:'makkah',name:'مكة المكرمة',en:'Makkah',area:'west',country:'sa'},
    {id:'madinah',name:'المدينة المنورة',en:'Madinah',area:'west',country:'sa'},
    {id:'qassim',name:'القصيم',en:'Al Qassim',area:'central',country:'sa'},
    {id:'eastern',name:'المنطقة الشرقية',en:'Eastern Province',area:'east',country:'sa'},
    {id:'asir',name:'عسير',en:'Aseer',area:'southwest',country:'sa'},
    {id:'tabuk',name:'تبوك',en:'Tabuk',area:'north',country:'sa'},
    {id:'hail',name:'حائل',en:'Hail',area:'north',country:'sa'},
    {id:'northern',name:'الحدود الشمالية',en:'Northern Borders',area:'north',country:'sa'},
    {id:'jazan',name:'جازان',en:'Jazan',area:'southwest',country:'sa'},
    {id:'najran',name:'نجران',en:'Najran',area:'southwest',country:'sa'},
    {id:'bahah',name:'الباحة',en:'Al Bahah',area:'southwest',country:'sa'},
    {id:'jouf',name:'الجوف',en:'Al Jouf',area:'north',country:'sa'},
    {id:'kuwait',name:'الكويت وشمال الخليج',en:'Kuwait and the northern Gulf',area:'north',country:'other'},
    {id:'gulf',name:'البحرين وقطر والإمارات',en:'Bahrain, Qatar and UAE',area:'gulf',country:'other'},
    {id:'oman',name:'سلطنة عُمان',en:'Oman',area:'oman',country:'other'},
    {id:'levant',name:'بلاد الشام',en:'The Levant',area:'levant',country:'other'},
    {id:'egypt',name:'مصر وسيناء',en:'Egypt and Sinai',area:'egypt',country:'other'}
  ];
  const areas = {
    north:{name:'شمال الجزيرة العربية',en:'Northern Arabia',note:'عبور بين أوراسيا والجزيرة العربية؛ تبرز الهجرة الخريفية في سبتمبر وأكتوبر.',enNote:'Passage between Eurasia and Arabia; September and October are a broad autumn window.',source:'north'},
    central:{name:'داخل الجزيرة العربية',en:'Interior Arabia',note:'عبور فوق الداخل، مع قضاء بعض الأنواع الشتاء حيث يتوافر الموئل المناسب.',enNote:'Inland passage, with some species wintering where suitable habitat is available.',source:'birds'},
    east:{name:'شرق الجزيرة العربية',en:'Eastern Arabia',note:'مسار خليجي للعبور والإشتاء؛ تعتمد الطيور المائية على وجود الأراضي الرطبة.',enNote:'Gulf passage and wintering; waterbirds require suitable wetlands.',source:'raptors'},
    west:{name:'غرب الجزيرة العربية والبحر الأحمر',en:'Western Arabia and the Red Sea',note:'ممر غربي للجوارح والطيور المهاجرة؛ يبرز عبور عقاب السهوب في الخريف.',enNote:'A western corridor for migrants and raptors, including autumn Steppe Eagle passage.',source:'steppe'},
    southwest:{name:'جنوب غرب الجزيرة العربية',en:'Southwestern Arabia',note:'امتداد للممر الغربي نحو اليمن وأفريقيا، مع وجود جوارح ونسور مقيمة.',enNote:'The western corridor continues towards Yemen and Africa, alongside resident raptors and vultures.',source:'raptors'},
    gulf:{name:'جنوب الخليج العربي',en:'Southern Arabian Gulf',note:'تتفاوت كثافة العبور بين البلدان؛ الأنواع المسجلة لا تتوافر بالقدر نفسه في كل موقع.',enNote:'Passage varies between countries; listed species are not equally frequent at every site.',source:'raptors'},
    oman:{name:'جنوب شرق الجزيرة العربية',en:'Southeastern Arabia',note:'منطقة إشتاء مهمة لبعض العقبان والرخمة المصرية؛ بعضها مقيم أيضًا.',enNote:'A wintering region for some eagles and Egyptian Vultures, including resident birds.',source:'raptors'},
    levant:{name:'الأخدود وغرب آسيا',en:'The Rift Valley and western Asia',note:'نافذتان واسعتان للهجرة: الربيع والخريف. البيانات الإقليمية لا تحدد موسم الصيد في كل دولة.',enNote:'Broad spring and autumn passage windows. Regional records do not establish hunting seasons in each country.',source:'levant'},
    egypt:{name:'السويس وسيناء وشمال شرق أفريقيا',en:'Suez, Sinai and northeastern Africa',note:'الربيع نافذة بارزة لهجرة الجوارح شمالًا؛ يختلف مسار العودة عن مسار الخريف لبعض الأنواع.',enNote:'Spring is important for northbound raptors; some species use different autumn routes.',source:'egypt'}
  };
  const season=(spring=[],autumn=[],winter=[],focus=[])=>({spring,autumn,winter,focus});
  const passerine={north:season([3,4,5],[8,9,10],[],[4,9]),central:season([3,4,5],[8,9,10],[],[4,9]),east:season([3,4,5],[8,9,10],[],[4,9]),west:season([3,4,5],[8,9,10],[],[4,9]),southwest:season([3,4,5],[8,9,10],[],[4,9]),gulf:season([3,4,5],[8,9,10],[],[4,9]),oman:season([3,4,5],[8,9,10],[],[4,9]),levant:season([3,4,5],[8,9,10],[],[4,9]),egypt:season([3,4,5],[8,9,10],[],[4,9])};
  const waterbird={north:season([3,4],[9,10,11],[12,1,2],[1,2,12]),central:season([3,4],[9,10,11],[12,1,2],[1,2,12]),east:season([3,4],[9,10,11],[12,1,2],[1,2,12]),west:season([3,4],[9,10,11],[12,1,2],[1,2,12]),southwest:season([3,4],[9,10,11],[12,1,2],[1,2,12]),gulf:season([3,4],[9,10,11],[12,1,2],[1,2,12]),oman:season([3,4],[9,10,11],[12,1,2],[1,2,12]),levant:season([3,4],[9,10,11],[12,1,2],[1,2,12]),egypt:season([3,4],[9,10,11],[12,1,2],[1,2,12])};
  const largeFalcon={north:season([3,4],[9,10,11],[12,1,2],[10]),central:season([3,4],[9,10,11],[12,1,2],[10]),east:season([3,4],[9,10,11],[12,1,2],[10]),west:season([3,4],[9,10,11],[12,1,2],[10]),southwest:season([3,4],[9,10,11],[12,1,2],[10]),gulf:season([3,4],[9,10,11],[12,1,2],[10]),oman:season([3,4],[9,10,11],[12,1,2],[10])};
  const smallFalcon={...passerine,north:season([2,3,4],[8,9,10],[],[3,4]),central:season([2,3,4],[8,9,10],[],[3,4]),gulf:season([2,3,4],[9,10],[],[3,4])};
  const species = [
    {id:'quail',name:'السمان الشائع',en:'Common Quail',latin:'Coturnix coturnix',group:'birds',legal:'listed',note:'عابر في البيئات العشبية؛ قد توجد جماعات متكاثرة محليًا. أفضل نافذة خريفية إرشادية: سبتمبر.',enNote:'A migrant of grassy habitats; some local breeding occurs. September is an indicative autumn window.',seasons:passerine,sources:['birds','north','rules']},
    {id:'oriole',name:'الصفارية الأوراسية «الصفّار»',en:'Eurasian Golden Oriole',latin:'Oriolus oriolus',group:'birds',legal:'listed',note:'عابر يرتبط بالأشجار؛ قد تبقى أفراد في الصيف. النافذة الخريفية الإرشادية: أغسطس وسبتمبر.',enNote:'A tree-associated migrant; some birds remain in summer. August and September form an indicative autumn window.',seasons:Object.fromEntries(Object.keys(passerine).map(k=>[k,season([4,5],[8,9,10],[],[5,8,9])])),sources:['birds','rules']},
    {id:'turtle-dove',name:'القمري الأوروبي «القميري»',en:'European Turtle Dove',latin:'Streptopelia turtur',group:'birds',legal:'protected-sa',note:'يُعرض موسم عبوره للتعرّف والرصد. المركز يوضح منع صيده في السعودية.',enNote:'Passage is shown for identification and observation. NCW states that hunting this species is prohibited in Saudi Arabia.',seasons:passerine,sources:['birds','rules']},
    {id:'teal',name:'الحذف الشتوي «البط صغير الحجم»',en:'Eurasian Teal',latin:'Anas crecca',group:'birds',legal:'unverified',note:'زائر شتوي للأراضي الرطبة؛ الشتاء فترة وجود، وليس كله هجرة متواصلة.',enNote:'A winter visitor to wetlands. Winter presence does not mean continuous migration.',seasons:waterbird,sources:['birds']},
    {id:'snipe',name:'الشنقب الشائع',en:'Common Snipe',latin:'Gallinago gallinago',group:'birds',legal:'unverified',note:'يرتبط بالموائل الرطبة، ويزداد ظهوره المعتاد شتاءً. لا يُفترض السماح بصيده من وجوده.',enNote:'Associated with wet habitats and usually more apparent in winter. Presence does not establish hunting permission.',seasons:waterbird,sources:['birds']},
    {id:'peregrine',name:'الشاهين المهاجر',en:'Migratory Peregrine Falcon',latin:'Falco peregrinus',group:'falcons',legal:'falcon',note:'الجدول للجماعات المهاجرة؛ لا يشمل الشواهين المقيمة. عبور خريفي وبعض الإشتاء.',enNote:'The calendar covers migrants, excluding resident Peregrines. Autumn passage and some wintering.',seasons:largeFalcon,sources:['falcons','raptors']},
    {id:'saker',name:'الصقر الحر',en:'Saker Falcon',latin:'Falco cherrug',group:'falcons',legal:'falcon',note:'مهاجر قليل العدد، خصوصًا في جنوب الخليج وعُمان؛ تواتر وجوده أقل من الشاهين.',enNote:'A scarce migrant, especially in the southern Gulf and Oman; less frequent than Peregrine.',seasons:largeFalcon,sources:['falcons','raptors']},
    {id:'lesser-kestrel',name:'العوسق الصغير',en:'Lesser Kestrel',latin:'Falco naumanni',group:'falcons',legal:'observe',note:'عابر؛ نافذته الربيعية أوضح في شمال الجزيرة والخليج.',enNote:'A passage migrant, especially noticeable in spring in northern Arabia and the Gulf.',seasons:smallFalcon,sources:['birds','raptors']},
    {id:'hobby',name:'الشويهين الأوراسي',en:'Eurasian Hobby',latin:'Falco subbuteo',group:'falcons',legal:'observe',note:'عابر ربيعي وخريفي؛ يصلح سبتمبر وأبريل نافذتين إرشاديتين للرصد.',enNote:'A spring and autumn migrant; September and April are indicative observation windows.',seasons:passerine,sources:['birds','raptors']},
    {id:'steppe-eagle',name:'عقاب السهوب',en:'Steppe Eagle',latin:'Aquila nipalensis',group:'eagles',legal:'observe',note:'عبوره الخريفي بارز غرب الجزيرة؛ بعض العقبان تعود شمالًا عبر السويس في الربيع.',enNote:'Prominent autumn passage in western Arabia; some birds return north via Suez in spring.',seasons:{north:season([2,3,4],[9,10,11],[12,1],[3,9,10]),central:season([2,3,4],[9,10,11],[12,1],[10]),east:season([2,3,4],[9,10,11],[12,1],[10]),west:season([2,3,4],[9,10,11],[12,1],[10]),southwest:season([2,3,4],[9,10,11],[12,1],[10]),oman:season([3,4],[10],[11,12,1,2],[11,12,1,2]),levant:season([2,3,4],[9,10,11],[],[3,10]),egypt:season([2,3,4],[9,10,11],[],[3])},sources:['steppe','raptors']},
    {id:'spotted-eagle',name:'العقاب المنقّط الكبير',en:'Greater Spotted Eagle',latin:'Clanga clanga',group:'eagles',legal:'observe',note:'إشتاء في الموائل المناسبة، خاصة الأراضي الرطبة؛ أعداده وتوزيعه متفاوتان.',enNote:'Winters in suitable habitats, particularly wetlands; numbers and distribution vary.',seasons:{central:waterbird.central,east:waterbird.east,west:waterbird.west,oman:waterbird.oman,gulf:waterbird.gulf,levant:waterbird.levant,egypt:waterbird.egypt},sources:['birds','raptors']},
    {id:'imperial-eagle',name:'العقاب الملكي الشرقي',en:'Eastern Imperial Eagle',latin:'Aquila heliaca',group:'eagles',legal:'observe',note:'زائر شتوي وعابر؛ تظهر بعض الجماعات في داخل الجزيرة وعُمان.',enNote:'A winter visitor and passage migrant, including birds in interior Arabia and Oman.',seasons:{north:waterbird.north,central:waterbird.central,east:waterbird.east,oman:waterbird.oman,levant:waterbird.levant},sources:['birds','raptors']},
    {id:'egyptian-vulture',name:'الرخمة المصرية',en:'Egyptian Vulture',latin:'Neophron percnopterus',group:'vultures',legal:'observe',note:'منها جماعات مهاجرة وأخرى مقيمة، خصوصًا في عُمان؛ الهجرة لا تشمل جميع الأفراد.',enNote:'Includes both migrants and residents, particularly in Oman; not every bird migrates.',seasons:{north:season([3,4,5],[8,9,10],[],[3,4,9]),central:season([3,4,5],[8,9,10],[],[3,4,9]),west:season([3,4,5],[8,9,10],[],[3,4,9]),southwest:season([3,4,5],[8,9,10],[11,12,1,2],[9]),oman:season([3,4],[9,10],[11,12,1,2],[11,12,1,2]),levant:season([3,4,5],[8,9,10],[],[3,4,9]),egypt:season([3,4,5],[8,9,10],[],[3,4,9])},residentAreas:['southwest','oman'],sources:['raptors']},
    {id:'griffon-vulture',name:'النسر الأسمر',en:'Griffon Vulture',latin:'Gyps fulvus',group:'vultures',legal:'observe',note:'مقيم أو متجوّل في هذه النطاقات؛ لا تتوافر هنا ذروة هجرة شهرية موثقة له.',enNote:'Resident or dispersive in these regions; no documented monthly migration peak is assigned here.',seasons:{north:season(),west:season(),southwest:season(),levant:season()},residentAreas:['north','west','southwest','levant'],sources:['raptors','residents']},
    {id:'lappet-vulture',name:'النسر الأذون',en:'Lappet-faced Vulture',latin:'Torgos tracheliotos',group:'vultures',legal:'observe',note:'مقيم في موائله الصحراوية؛ تُعرض الإقامة طوال العام دون افتراض موسم هجرة.',enNote:'Resident in suitable desert habitats; year-round residency is shown without assigning a migration season.',seasons:{central:season(),west:season(),southwest:season()},residentAreas:['central','west','southwest'],sources:['residents']}
  ];
  // Deliberately no precise population estimates, daily forecasts or synthetic scores.
  const officialSeason={start:'2026-09-01',end:'2027-01-31',reviewed:'2026-09-10',source:'season'};
  function region(id){return regions.find(r=>r.id===id)||null;}
  function profile(bird,regionId){const r=region(regionId);return r?bird.seasons[r.area]||null:null;}
  function state(bird,regionId,month){
    const r=region(regionId),p=profile(bird,regionId);
    if(!p||!Number.isInteger(month)||month<1||month>12)return {key:'unknown',focus:false,resident:false};
    const resident=Boolean(bird.residentAreas?.includes(r.area));
    const key=p.spring.includes(month)?'spring':p.autumn.includes(month)?'autumn':p.winter.includes(month)?'winter':resident?'resident':'quiet';
    return {key,focus:p.focus.includes(month),resident};
  }
  function list(regionId,group='all',month=1,activeOnly=false){return species.filter(b=>profile(b,regionId)&&(group==='all'||b.group===group)&&(!activeOnly||!['quiet','unknown'].includes(state(b,regionId,month).key)));}
  function legalWindow(regionId,year,month){
    const r=region(regionId);
    if(!r||r.country!=='sa')return 'unverified';
    if(!Number.isInteger(month)||month<1||month>12||!Number.isInteger(year))return 'unverified';
    if((year===2026&&month>=9)||(year===2027&&month===1))return 'announced';
    return 'unverified';
  }
  function inferRegion(loc){
    const name=String(loc?.name||'').toLowerCase();
    const aliases=[['makkah',/مكة|مكه|جدة|الطائف|makkah|mecca|jeddah|taif/],['madinah',/المدينة|madinah|medina|ينبع|yanbu/],['riyadh',/الرياض|riyadh/],['qassim',/القصيم|بريدة|عنيزة|qassim|buraidah/],['eastern',/الدمام|الخبر|الأحساء|dammam|khobar|ahsa/],['asir',/عسير|أبها|خميس|asir|aseer|abha/],['tabuk',/تبوك|tabuk/],['hail',/حائل|hail/],['northern',/عرعر|طريف|رفحاء|arar|turaif|rafha/],['jazan',/جازان|جيزان|jazan|jizan/],['najran',/نجران|najran/],['bahah',/الباحة|bahah/],['jouf',/الجوف|سكاكا|القريات|jouf|sakaka/],['kuwait',/الكويت|kuwait/],['oman',/مسقط|صلالة|عُمان|سلطنة عمان|muscat|salalah|oman/],['gulf',/دبي|أبوظبي|ابوظبي|الدوحة|المنامة|dubai|dhabi|doha|manama/],['egypt',/مصر|القاهرة|cairo|egypt/],['levant',/عمّان|عمان|دمشق|بيروت|القدس|amman|damascus|beirut|jerusalem/]];
    // Name matching is accepted only within regional geographic coverage.
    const lat=Number(loc?.lat),lon=Number(loc?.lon);
    if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<16||lat>38||lon<24||lon>60)return null;
    const named=aliases.find(([,re])=>re.test(name));
    if(named)return named[0];
    // No guessed administrative boundaries: ask for manual selection when unknown.
    return null;
  }
  root.HuntingData={sources,regions,areas,species,officialSeason,region,profile,state,list,legalWindow,inferRegion};
})(globalThis);
