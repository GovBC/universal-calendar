const arDigits = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const routes = {
  today: globalThis.CalendarPrebootState?.todayRoute || ['اليوم','أهلًا بك'],
  calendar: ['التقويم والتحويل','التقويمات العالمية'],
  prayer: ['الشمس والمواقيت','الصلاة والتحقق البصري'],
  worship: ['تنبيهات الصلوات والسنن','المنبه'],
  platform: ['منصة مجتمع صوتية','الأذان والتلاوات والأدعية'],
  celestial: ['القمر والهلال والطوالع والحضارات','السماء'],
  earth: ['الغلاف والحقول وشكل الكوكب','الأرض'],
  games: ['تعلم الفلك بالحركة','الألعاب التعليمية'],
  followups: ['أخبار ونتائج عالمية','المتابعات'],
  youth: ['الطب التجديدي وأفق العمر الصحي','الشباب الدائم'],
  localization: ['مساهمة المستخدمين في الترجمة','إضافة لغة للموقع'],
  assistant: ['مساعد متخصص ذو مصادر','المساعد العلمي']
};

let celestialTab='moon', earthTab='magnetosphere';
const celestialPanes={moon:'celestial-moon',sky:'celestial-sky',heritage:'celestial-heritage',sync:'celestial-sync'};
const earthPanes={magnetosphere:'earth-magnetosphere',atmosphere:'earth-atmosphere',interior:'earth-interior',surface:'earth-surface',tilt:'earth-tilt',shape:'earth-shape'};
function setCelestialTab(tab,updateHistory=true){
  if(!celestialPanes[tab]) return;
  celestialTab=tab;
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===celestialPanes[tab]));
  document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route==='celestial'));
  document.querySelectorAll('[data-celestial-tab]').forEach(b=>{
    const active=b.dataset.celestialTab===tab;
    b.classList.toggle('active',active);
    if(b.getAttribute('role')==='tab') b.setAttribute('aria-selected',String(active));
  });
  document.getElementById('sectionEyebrow').textContent=routes.celestial[0];
  document.getElementById('sectionTitle').textContent=routes.celestial[1];
  const more=document.getElementById('moreDialog');if(more?.open)more.close();
  document.getElementById('openMore')?.classList.toggle('more-active',true);
  if(tab==='moon') setTimeout(()=>window.lunarTracker?.activate(),40);
  if(tab==='sky') setTimeout(drawSky,40);
  if(tab==='heritage') setTimeout(()=>{window.zodiacExplorer?.activate();drawHeritage();drawPrecession()},40);
  if(tab==='sync') setTimeout(drawSync,40);
  if(updateHistory&&location.hash!=='#'+(tab==='moon'?'celestial':tab)) history.pushState(null,'','#'+(tab==='moon'?'celestial':tab));
  if(updateHistory)queueMicrotask(()=>window.CalendarNavigation?.sync('replace'));
  window.scrollTo({top:0,behavior:'smooth'});
}
function setEarthTab(tab,updateHistory=true){
  if(!earthPanes[tab]) return;
  earthTab=tab;
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===earthPanes[tab]));
  document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route==='earth'));
  document.querySelectorAll('[data-earth-tab]').forEach(b=>{
    const active=b.dataset.earthTab===tab;
    b.classList.toggle('active',active);
    if(b.getAttribute('role')==='tab') b.setAttribute('aria-selected',String(active));
  });
  document.getElementById('sectionEyebrow').textContent=routes.earth[0];
  document.getElementById('sectionTitle').textContent=routes.earth[1];
  const more=document.getElementById('moreDialog');if(more?.open)more.close();
  document.getElementById('openMore')?.classList.toggle('more-active',true);
  if(tab==='magnetosphere') setTimeout(()=>window.magnetosphere?.activate(),40);
  if(tab==='atmosphere') setTimeout(()=>window.atmosphereModel?.activate(),40);
  if(tab==='interior') setTimeout(()=>window.earthInterior?.activate(),40);
  if(tab==='surface') setTimeout(()=>window.earthOcean?.activate(),40);
  if(tab==='tilt') setTimeout(()=>window.earthTilt3D?.activate(),40);
  if(tab==='shape') setTimeout(()=>window.earthShape3D?.activate(),40);
  if(updateHistory&&location.hash!=='#earth/'+tab) history.pushState(null,'','#earth/'+tab);
  if(updateHistory)queueMicrotask(()=>window.CalendarNavigation?.sync('replace'));
  window.scrollTo({top:0,behavior:'smooth'});
}
function setRoute(route,updateHistory=true){
  if(['crescent','sky','heritage','sync'].includes(route)){celestialTab=route==='crescent'?'moon':route;route='celestial';}
  if(['magnetosphere','atmosphere','interior','surface','tilt','shape'].includes(route)){earthTab=route;route='earth';}
  if(route==='celestial'){setCelestialTab(celestialTab,updateHistory);return}
  if(route==='earth'){setEarthTab(earthTab,updateHistory);return}
  if(!routes[route]) return;
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===route));
  document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===route));
  document.getElementById('sectionEyebrow').textContent=routes[route][0];
  document.getElementById('sectionTitle').textContent=routes[route][1];
  const more=document.getElementById('moreDialog');if(more?.open)more.close();
  document.getElementById('openMore')?.classList.toggle('more-active',['platform','celestial','earth','games','followups','youth','localization','assistant'].includes(route));
  if(route==='prayer'||route==='worship') setTimeout(drawEclipse,40);
  if(route==='platform') setTimeout(()=>window.AudioPlatform?.activate(),0);
  if(route==='games') setTimeout(()=>window.EducationalGames?.activate(),40);
  if(route==='youth') setTimeout(()=>{if(!document.getElementById('youthEngineeringPane')?.hidden)drawYouthOrgan()},40);
  window.scrollTo({top:0,behavior:'smooth'});
  if(updateHistory&&location.hash!=='#'+route)history.pushState(null,'','#'+route);
  if(updateHistory)queueMicrotask(()=>window.CalendarNavigation?.sync('replace'));
}
document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>setRoute(b.dataset.route)));
document.querySelectorAll('[data-celestial-tab]').forEach(b=>b.addEventListener('click',()=>setCelestialTab(b.dataset.celestialTab)));
document.querySelectorAll('[data-earth-tab]').forEach(b=>b.addEventListener('click',()=>setEarthTab(b.dataset.earthTab)));

const followupRecords=[
  {tab:'sports',year:'2025',category:'كرة القدم',symbol:'⚽',tone:'#55d8f2',event:'كأس العالم للأندية ٢٠٢٥',winner:'تشيلسي — فاز على باريس سان جيرمان ٣–٠',organizer:'FIFA',date:'١٣ يوليو ٢٠٢٥',source:'https://inside.fifa.com/official-documents/annual-report/2025/fifa-club-world-cup-2025/summary'},
  {tab:'sports',year:'2026',category:'كرة القدم',symbol:'⚽',tone:'#55d8f2',event:'دوري أبطال أوروبا ٢٠٢٥–٢٠٢٦',winner:'باريس سان جيرمان — ٤–٣ بركلات الترجيح أمام أرسنال',organizer:'UEFA',date:'٣٠ مايو ٢٠٢٦',source:'https://www.uefa.com/uefachampionsleague/history/seasons/2026/'},
  {tab:'sports',year:'2026',category:'الألعاب الأولمبية',symbol:'◉',tone:'#f6c85f',event:'أولمبياد ميلانو–كورتينا الشتوي',winner:'النرويج — ١٨ ذهبية و٤١ ميدالية إجمالًا',organizer:'اللجنة الأولمبية الإيطالية',date:'٢٢ فبراير ٢٠٢٦',source:'https://www.coni.it/en/italia-team/medals-milano-cortina-2026.html'},
  {tab:'sports',year:'2024',category:'الألعاب الأولمبية',symbol:'◉',tone:'#f6c85f',event:'أولمبياد باريس الصيفي',winner:'الولايات المتحدة — ٤٠ ذهبية و١٢٦ ميدالية إجمالًا',organizer:'اللجنة الأولمبية الدولية',date:'١١ أغسطس ٢٠٢٤',source:'https://www.olympics.com/en/olympic-games/paris-2024/medals'},
  {tab:'sports',year:'2026',category:'سباقات الخيل',symbol:'♞',tone:'#f6c85f',event:'كأس السعودية للخيل',winner:'فوريفر يونغ — الخيّال ريوسي ساكاي • ١:٥١٫٠٢٧',organizer:'نادي سباقات الخيل السعودي',date:'١٤ فبراير ٢٠٢٦',source:'https://www.jcsa.sa/ar/news/20260214_saudicup'},
  {tab:'sports',year:'2025',category:'سباقات الإبل',symbol:'♧',tone:'#68d6ad',event:'كأس العرب للهجن — النسخة الثانية',winner:'المنتخب السعودي — بطل الترتيب العام',organizer:'الاتحاد العربي للهجن',date:'٢٤ أكتوبر ٢٠٢٥',source:'https://www.spa.gov.sa/N2427424'},
  {tab:'sports',year:'2026',category:'سباقات الحمير',symbol:'◈',tone:'#c9b7ff',event:'بطولة العالم لسباق الحمير المُحمَّلة — المسار الطويل',winner:'مارفن ساندوفال والحمار Buttercup • ٥:٥٣:٣٧',organizer:'بلدة فيربلاي — كولورادو',date:'٢٦ يوليو ٢٠٢٦',source:'https://burrodays.org/wp-content/uploads/2026/07/2026-Long-Course-Results.pdf'},
  {tab:'sports',year:'2025',category:'الجري',symbol:'◐',tone:'#55d8f2',event:'ماراثون بطولة العالم لألعاب القوى — طوكيو',winner:'ألفونس فيليكس سيمبو للرجال • بيريس جيبتشيرشير للسيدات',organizer:'الاتحاد الدولي لألعاب القوى',date:'١٤–١٥ سبتمبر ٢٠٢٥',source:'https://worldathletics.org/competitions/world-athletics-championships/world-athletics-championships-tokyo-2025-7190593'},
  {tab:'deaths',country:'السعودية',city:'الرياض',year:'2025',category:'السعودية',symbol:'◌',tone:'#aab6c5',event:'الشيخ عبدالعزيز بن عبدالله آل الشيخ',winner:'المفتي العام للمملكة العربية السعودية — إعلان الديوان الملكي',organizer:'الرئاسة العامة للبحوث العلمية والإفتاء',date:'٢٣ سبتمبر ٢٠٢٥',source:'https://alifta.gov.sa/news/1055'},
  {tab:'deaths',country:'الفاتيكان',city:'الفاتيكان',year:'2025',category:'الفاتيكان',symbol:'◌',tone:'#aab6c5',event:'البابا فرنسيس',winner:'وفاته في الفاتيكان عن ٨٨ عامًا',organizer:'Vatican News',date:'٢١ أبريل ٢٠٢٥',source:'https://www.vaticannews.va/en/pope/news/2025-04/pope-francis-dies-on-easter-monday-aged-88.html'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'١',tone:'#f6c85f',event:'إيلون ماسك',winner:'٨٣٩ مليار دولار • تسلا وسبيس إكس',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ١',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'٢',tone:'#55d8f2',event:'لاري بايج',winner:'٢٥٧ مليار دولار • جوجل',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ٢',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'٣',tone:'#68d6ad',event:'سيرغي برين',winner:'٢٣٧ مليار دولار • جوجل',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ٣',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'٤',tone:'#c9b7ff',event:'جيف بيزوس',winner:'٢٢٤ مليار دولار • أمازون',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ٤',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'٥',tone:'#f6b85d',event:'مارك زوكربيرغ',winner:'٢٢٢ مليار دولار • ميتا',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ٥',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'٦',tone:'#55d8f2',event:'لاري إليسون',winner:'١٩٠ مليار دولار • أوراكل',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ٦',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'٧',tone:'#f6c85f',event:'برنار أرنو وعائلته',winner:'١٧١ مليار دولار • إل في إم إتش',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ٧',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'٨',tone:'#68d6ad',event:'جنسن هوانغ',winner:'١٥٤ مليار دولار • إنفيديا',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ٨',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'٩',tone:'#c9b7ff',event:'وارن بافيت',winner:'١٤٩ مليار دولار • الاستثمارات',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ٩',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
  {tab:'wealth',year:'2026',category:'تصنيف فوربس ٢٠٢٦',symbol:'١٠',tone:'#f6b85d',event:'أمانسيو أورتيغا',winner:'١٤٨ مليار دولار • إنديتكس',organizer:'Forbes — بيانات ١ مارس ٢٠٢٦',date:'المركز ١٠',source:'https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/'},
{"tab": "awards", "year": "2025", "category": "نوبل", "event": "جائزة نوبل في الفيزياء ٢٠٢٥", "winner": "جون كلارك، ميشيل ديفوريه، جون مارتينيس", "organizer": "نوبل", "date": "٧ أكتوبر ٢٠٢٥", "source": "https://www.nobelprize.org/prizes/physics/2025/press-release/"},
{"tab": "awards", "year": "2026", "category": "الملك فيصل", "event": "جائزة الملك فيصل في الطب ٢٠٢٦", "winner": "سفيتلانا مويسوف", "organizer": "جائزة الملك فيصل", "date": "٧ يناير ٢٠٢٦", "source": "https://kingfaisalprize.org/professor-svetlana-mojsov/"},
{"tab": "awards", "year": "2026", "category": "الملك فيصل", "event": "جائزة الملك فيصل في العلوم ٢٠٢٦ — الرياضيات", "winner": "كارلوس كينيغ", "organizer": "جائزة الملك فيصل", "date": "٧ يناير ٢٠٢٦", "source": "https://kingfaisalprize.org/professor-carlos-kenig/"},
{"tab": "competitions", "year": "2026", "category": "القرآن الكريم", "event": "مسابقة الملك سلمان للقرآن ١٤٤٧ — الفرع الأول للبنات", "winner": "هبة بنت ماجد بن رشدي الصفدي — المركز الأول", "organizer": "وزارة الشؤون الإسلامية", "date": "١٩ فبراير ٢٠٢٦", "source": "https://www.moia.gov.sa/MediaCenter/News/Pages/5546695.aspx"},
{"tab": "other", "year": "2025", "category": "التصوير", "event": "جوائز سوني للتصوير ٢٠٢٥ — مصور العام", "winner": "زيد نيلسون — وهم الأنثروبوسين", "organizer": "سوني", "date": "١٦ أبريل ٢٠٢٥", "source": "https://www.sony.co.uk/presscentre/sony-world-photography-awards-overall-winners-2025-announced"},
{"tab": "other", "year": "2025", "category": "الروبوتات", "event": "بطولة FIRST للروبوتات ٢٠٢٥ — جائزة الأثر", "winner": "فريق بروجكت بوسيفالوس ٥٩٨٥ — أستراليا", "organizer": "FIRST", "date": "بيان ٢٨ أبريل ٢٠٢٥", "source": "https://community.firstinspires.org/2025-thank-you-for-an-outstanding-first-championship"}
];
followupRecords.forEach(r=>{r.symbol??='✦';r.tone??='#68d6ad';});
const followupTabLabels={news:'الأخبار',sports:'الرياضات',competitions:'المسابقات',awards:'الجوائز',other:'أخرى',deaths:'الوفيات',wealth:'أثرياء العالم'};
let followupTab='news',deathScope='local';
followupRecords.filter(r=>r.tab==='wealth').forEach((r,index)=>{r.rank=index+1});
const followupsGrid=document.getElementById('followupsGrid'),followupsFeature=document.getElementById('followupsFeature'),followupsEmpty=document.getElementById('followupsEmpty'),followupsSearch=document.getElementById('followupsSearch'),followupsYear=document.getElementById('followupsYear'),followupsCategory=document.getElementById('followupsCategory'),deathScopeControl=document.getElementById('deathScope'),deathCountry=document.getElementById('deathCountry'),deathCity=document.getElementById('deathCity'),wealthSort=document.getElementById('wealthSort');
const normalizeFollowup=value=>value.toLowerCase().replace(/[أإآ]/g,'ا').replace(/[\u064B-\u065F\u0670]/g,'').trim();
function refreshFollowupCategories(){
  const categories=[...new Set(followupRecords.filter(r=>r.tab===followupTab).map(r=>r.category))];
  followupsCategory.innerHTML='<option value="all">كل المجالات</option>'+categories.map(c=>`<option value="${c}">${c}</option>`).join('');
  followupsCategory.value='all';
  document.getElementById('followupsCategoryWrap').hidden=['wealth','deaths'].includes(followupTab);
}
function renderFollowups(){
  const isNews=followupTab==='news',isDeath=followupTab==='deaths',isWealth=followupTab==='wealth';
  document.getElementById('followupsNews').hidden=!isNews;
  deathScopeControl.hidden=!isDeath;
  document.getElementById('wealthSortWrap').hidden=!isWealth;
  document.querySelectorAll('#followups .followups-toolbar,#followups .followups-feature,#followups .followups-grid,#followups .followups-note,#followups .followups-updated').forEach(el=>el.hidden=isNews);
  if(isNews){followupsEmpty.hidden=true;return}
  const query=normalizeFollowup(followupsSearch.value),year=followupsYear.value,category=followupsCategory.value;
  document.getElementById('deathCountryWrap').hidden=deathScope!=='local';
  document.getElementById('deathCityWrap').hidden=deathScope!=='local';
  const locationQuery=deathScope==='local'?` ${deathCountry.value} ${deathCity.value.trim()}`:'';
  document.getElementById('deathMore').href='https://news.google.com/search?q='+encodeURIComponent('وفاة'+locationQuery)+'&hl=ar&gl=SA&ceid=SA:ar';
  followupsSearch.placeholder=isDeath?'ابحث باسم المتوفى…':isWealth?'ابحث باسم الثري أو مصدر الثروة…':'ابحث باسم الفائز أو الحدث أو الجائزة…';
  const records=followupRecords.filter(r=>r.tab===followupTab&&
    (!isDeath||deathScope==='global'||(r.country===deathCountry.value&&normalizeFollowup(r.city||'').includes(normalizeFollowup(deathCity.value))))&&
    (year==='all'||r.year===year)&&(category==='all'||r.category===category)&&
    normalizeFollowup(`${r.event} ${r.winner} ${r.organizer} ${r.category}`).includes(query));
  if(isWealth)records.sort((a,b)=>wealthSort.value==='name'?a.event.localeCompare(b.event,'ar'):wealthSort.value==='reverse'?b.rank-a.rank:a.rank-b.rank);
  document.getElementById('followupsCount').textContent=arDigits(records.length);
  const badge=document.querySelector('#followups .followups-updated');
  badge.querySelector('span').textContent=isWealth?'قائمة سنوية':isDeath?'سجل موثق مختار':followupTab==='sports'?'نتائج موثقة':'نتائج موثقة مختارة';
  badge.querySelector('small').textContent=isWealth?'بيانات ١ مارس ٢٠٢٦':isDeath?'آخر مراجعة: ٦ سبتمبر ٢٠٢٦':followupTab==='sports'?'آخر تحقق: ٥ سبتمبر ٢٠٢٦':'آخر مراجعة: ٦ سبتمبر ٢٠٢٦';
  document.querySelector('#followups .followups-note p').textContent=isWealth?
    'أعلى ١٠ في قائمة فوربس السنوية ٢٠٢٦. الثروات تقديرية بالدولار الأمريكي وفق بيانات ١ مارس ٢٠٢٦؛ هذه ليست أسعارًا لحظية.':
    isDeath?'تاريخ كل بطاقة هو تاريخ الوفاة. «عالمية» تشمل جميع الدول، و«محلية» تصفّي بحسب الدولة والمدينة. لا توجد متابعة تلقائية أو إشعارات.':
    followupTab==='sports'?'نتائج مختارة مع روابط الجهات الرسمية وصفحات النتائج الأصلية.':
    'نتائج موثقة مختارة بتاريخ كل إعلان ورابط الجهة الأصلية. ليست تغطية شاملة أو بثًا لحظيًا.';
  followupsGrid.innerHTML=records.map(r=>`<article class="panel followup-card" style="--card-tone:${r.tone}"><header><span class="followup-symbol">${r.symbol}</span><span class="followup-category">${r.category}<br>${arDigits(r.year)}</span></header><h3>${r.event}</h3><div class="followup-winner">${r.winner}</div><footer><span>${r.date}</span>${r.source?`<a href="${r.source}" target="_blank" rel="noopener noreferrer">المصدر ↗</a>`:`<b>${r.organizer}</b>`}</footer></article>`).join('');
  followupsEmpty.hidden=records.length>0;
  followupsEmpty.querySelector('h3').textContent=isDeath?'لا توجد وفيات موثقة مدرجة تطابق اختيارك':'لا توجد نتائج مطابقة';
  followupsEmpty.querySelector('p').textContent=isDeath?'غيّر الدولة أو المدينة أو السنة، أو افتح رابط البحث الخارجي. خلو السجل لا يعني عدم وقوع وفيات.':'جرّب عبارة بحث أو سنة مختلفة.';
  const highlighted=records[0];
  followupsFeature.hidden=!highlighted||isDeath;
  followupsFeature.innerHTML=highlighted?`<span class="followups-feature-icon">${highlighted.symbol}</span><div><span class="kicker">${isWealth?'قائمة فوربس السنوية • أعلى ١٠':'أبرز متابعة • '+followupTabLabels[followupTab]}</span><h3>${highlighted.event}</h3><p>${highlighted.winner} — ${highlighted.organizer}</p></div>${highlighted.source?`<a href="${highlighted.source}" target="_blank" rel="noopener noreferrer">المصدر ↗</a>`:`<time>${highlighted.date}</time>`}`:'';
}
document.querySelectorAll('[data-followups-tab]').forEach(button=>button.addEventListener('click',()=>{
  followupTab=button.dataset.followupsTab;followupsSearch.value='';followupsYear.value='all';
  document.querySelectorAll('[data-followups-tab]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});
  refreshFollowupCategories();renderFollowups();
}));
document.querySelectorAll('[data-death-scope]').forEach(button=>button.addEventListener('click',()=>{
  deathScope=button.dataset.deathScope;
  document.querySelectorAll('[data-death-scope]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
  renderFollowups();
}));
[deathCountry,wealthSort].forEach(el=>el.addEventListener('change',renderFollowups));
deathCity.addEventListener('input',renderFollowups);
[followupsSearch,followupsYear,followupsCategory].forEach(element=>element.addEventListener(element===followupsSearch?'input':'change',renderFollowups));
refreshFollowupCategories();renderFollowups();
// نختار القسم الرئيس قبل أول رسم للواجهة حتى لا تظهر «اليوم» لحظةً أثناء التحديث.
function initialNavigation(){
  let raw=location.hash;
  if(!raw)try{raw=sessionStorage.getItem('calendar.navigation-state')||''}catch{}
  const parts=String(raw).replace(/^#/,'').split('/').filter(Boolean);
  const first=parts[0]||'today',celestialTabs=['crescent','sky','heritage','sync'],earthTabs=['magnetosphere','atmosphere','interior','surface','tilt','shape'];
  if(celestialTabs.includes(first))return {route:'celestial',celestial:first==='crescent'?'moon':first};
  if(earthTabs.includes(first))return {route:'earth',earth:first};
  if(first==='celestial'&&earthTabs.includes(parts[1]))return {route:'earth',earth:parts[1]};
  if(first==='celestial')return {route:'celestial',celestial:celestialTabs.includes(parts[1])?parts[1]:'moon'};
  if(first==='earth')return {route:'earth',earth:earthTabs.includes(parts[1])?parts[1]:'magnetosphere'};
  return {route:routes[first]?first:'today'};
}
const initial=initialNavigation();
if(initial.route==='celestial')setCelestialTab(initial.celestial,false);
else if(initial.route==='earth')setEarthTab(initial.earth,false);
else setRoute(initial.route,false);
globalThis.CalendarPrebootReveal?.();

function makeDays(id,total,start,today){
  const box=document.getElementById(id);let html='';
  for(let i=0;i<start;i++) html+='<span class="muted">•</span>';
  for(let i=1;i<=total;i++) html+=`<span class="${i===today?'today':''}">${arDigits(i)}</span>`;
  box.innerHTML=html;
}

const youthCanvas=document.getElementById('youthOrganCanvas'),youthCtx=youthCanvas.getContext('2d'),youthStageSlider=document.getElementById('youthStageSlider');
const youthState={organ:'esophagus',yaw:-.28,pitch:.14,stage:0,dragging:false,lastX:0,lastY:0};
const youthStages=[
  {short:'خلايا مصدر',label:'خلايا مصدر',meta:'خلايا أولية مضبوطة'},
  {short:'توجيه وهوية',label:'هيكل أولي',meta:'تشكيل الهوية النسيجية'},
  {short:'هيكل وأوعية',label:'نسيج نامٍ',meta:'هيكل وتروية أولية'},
  {short:'نضج واختبار',label:'نضج وظيفي',meta:'اختبار الوظيفة والسلامة'},
  {short:'زراعة ومتابعة',label:'محاكاة الزراعة',meta:'موضع الزراعة والمتابعة'}
];
const youthEsophagusStages=[
  {short:'iPSC والتوسع النسيلي',label:'خلية جذعية واحدة',meta:'خلية واحدة تنقسم إلى مستعمرة',process:'iPSC ثم توسع نسلي بالانقسام'},
  {short:'تحديد السلالة الجنينية',label:'الأديم الباطن النهائي',meta:'السلالة المكوّنة للبطانة',process:'تحديد السلالة الجنينية المكوّنة للبطانة'},
  {short:'المعي الأمامي والهوية المريئية',label:'السلف المريئي',meta:'خلايا ظهارية مريئية ناشئة',process:'المعي الأمامي ثم خلايا ظهارية مريئية'},
  {short:'تجميع الطبقات والتروية',label:'العضية والهيكل الحيوي',meta:'بطانة وعضلات ودعم وتروية',process:'ترتيب الظهارة والدعم والعضلات والتروية'},
  {short:'حاجز وحركة واختبار',label:'النضج متعدد الطبقات',meta:'نموذج مريئي بحثي متعدد الطبقات',process:'حاجز ظهاري وحركة دودية واختبار السلامة'}
];
const youthOrgans={
  esophagus:{title:'المريء',canvas:'المريء',meta:'نموذج تشريحي واقعي للعضلات الخارجية',status:'بحث انتقالي',tone:'#df8d83',description:'تجري أبحاث على أنسجة أنبوبية بديلة وهياكل حيوية قابلة لإعادة التبطين؛ ولا يتاح مريء كامل مزروع مخبريًا كعلاج عام.',target:'رقعة أو وصلة نسيجية',evidence:'نماذج وتجارب انتقالية',kind:'esophagus'},
  ureters:{title:'الحالبان',canvas:'الحالبان',meta:'قناتان بين الكلى والمثانة',status:'قبل سريري',tone:'#c5afff',description:'تُدرس هياكل وخلايا بطانية وعضلية لتجديد المجرى البولي؛ ولا توجد زراعة حالب كامل مزروع مخبريًا معتمدة للاستخدام العام.',target:'إصلاح مقطع أو وصلة',evidence:'نماذج حيوانية ومختبرية',kind:'ureters'},
  tooth:{title:'الأسنان',canvas:'سن وجذر',meta:'تاج وجذور وأنسجة داعمة',status:'قبل سريري',tone:'#f6c85f',description:'يتقدم البحث في برعم السن الحيوي وتجدد اللثة والعظم الداعم؛ أما السن البشري الكامل المزروع مخبريًا فليس علاجًا متاحًا بعد.',target:'تجديد سن أو جذر',evidence:'نماذج حيوانية وخلوية',kind:'tooth'},
  bladder:{title:'المثانة',canvas:'المثانة',meta:'تجويف مرن وأنسجة بولية',status:'تجارب بشرية محدودة',tone:'#68d6ad',description:'وصلت هندسة أنسجة المثانة إلى تطبيقات وتجارب بشرية محدودة في سياقات متخصصة، لكنها ليست بديلًا عامًا لكل حالات المثانة.',target:'ترميم أو تكبير نسيجي',evidence:'تجارب بشرية محدودة',kind:'bladder'},
  cornea:{title:'القرنية',canvas:'القرنية',meta:'طبقات شفافة لسطح العين',status:'تطبيقات متخصصة',tone:'#7fcfff',description:'توجد علاجات خلوية وبدائل سطحية متخصصة للقرنية، بينما تتطور هندسة قرنية كاملة ذات شفافية وتعصيب ووظيفة متكاملة.',target:'سطح قرني شفاف',evidence:'تطبيقات وخلايا متخصصة',kind:'cornea'},
  skin:{title:'الجلد',canvas:'الجلد',meta:'طبقات وخلايا وأوعية دقيقة',status:'مطبق سريريًا',tone:'#ee9e79',description:'تُستخدم بدائل جلدية وزراعات خلايا في حالات سريرية محددة، مع استمرار تطوير جلد كامل يضم الأوعية والأعصاب وملحقات الجلد.',target:'جلد كامل الوظائف',evidence:'تطبيقات سريرية متعددة',kind:'skin'}
};
function youthProject(point,w,h){const [x,y,z]=point,cy=Math.cos(youthState.yaw),sy=Math.sin(youthState.yaw),cp=Math.cos(youthState.pitch),sp=Math.sin(youthState.pitch),x1=x*cy-z*sy,z1=x*sy+z*cy,y1=y*cp-z1*sp,z2=y*sp+z1*cp,focal=Math.min(w,h)*1.95,scale=focal/(focal+z2+focal*.18);return{x:w*.5+x1*scale,y:h*.54-y1*scale,z:z2,s:scale}}
function youthPath(points,w,h,color,width,glow=0){const ps=points.map(p=>youthProject(p,w,h));youthCtx.save();youthCtx.lineJoin='round';youthCtx.lineCap='round';youthCtx.shadowColor=color;youthCtx.shadowBlur=glow;youthCtx.beginPath();ps.forEach((p,i)=>i?youthCtx.lineTo(p.x,p.y):youthCtx.moveTo(p.x,p.y));youthCtx.strokeStyle=color;youthCtx.lineWidth=Math.max(1,width*(ps.reduce((n,p)=>n+p.s,0)/ps.length));youthCtx.stroke();youthCtx.restore();return ps}
function youthTube(points,w,h,width,color){const ps=points.map(p=>youthProject(p,w,h)),scale=ps.reduce((n,p)=>n+p.s,0)/ps.length;const stroke=(tone,line,blur=0)=>{youthCtx.save();youthCtx.beginPath();ps.forEach((p,i)=>i?youthCtx.lineTo(p.x,p.y):youthCtx.moveTo(p.x,p.y));youthCtx.lineCap='round';youthCtx.lineJoin='round';youthCtx.strokeStyle=tone;youthCtx.lineWidth=Math.max(2,line*scale);youthCtx.shadowColor=tone;youthCtx.shadowBlur=blur;youthCtx.stroke();youthCtx.restore()};stroke('rgba(1,8,15,.72)',width*1.56,0);stroke(color,width,10);stroke('rgba(234,251,255,.46)',width*.22,0);return ps}
function youthBlob(point,rx,ry,w,h,color,alpha=1){const p=youthProject(point,w,h);youthCtx.save();youthCtx.globalAlpha=alpha;const g=youthCtx.createRadialGradient(p.x-rx*p.s*.26,p.y-ry*p.s*.33,2,p.x,p.y,Math.max(rx,ry)*p.s*1.18);g.addColorStop(0,'rgba(244,255,255,.72)');g.addColorStop(.28,color);g.addColorStop(1,'rgba(4,15,26,.2)');youthCtx.fillStyle=g;youthCtx.shadowColor=color;youthCtx.shadowBlur=18;youthCtx.beginPath();youthCtx.ellipse(p.x,p.y,rx*p.s,ry*p.s*.78,youthState.yaw*.16,0,Math.PI*2);youthCtx.fill();youthCtx.strokeStyle='rgba(233,249,255,.32)';youthCtx.lineWidth=1.2;youthCtx.stroke();youthCtx.restore();return p}
function youthPoly(points,w,h,fill,stroke='rgba(230,248,255,.24)'){const ps=points.map(p=>youthProject(p,w,h));youthCtx.save();youthCtx.beginPath();ps.forEach((p,i)=>i?youthCtx.lineTo(p.x,p.y):youthCtx.moveTo(p.x,p.y));youthCtx.closePath();youthCtx.fillStyle=fill;youthCtx.fill();youthCtx.strokeStyle=stroke;youthCtx.lineWidth=1;youthCtx.stroke();youthCtx.restore();return ps}
function youthBackdrop(w,h){if(youthState.organ==='esophagus'){const g=youthCtx.createRadialGradient(w*.51,h*.47,0,w*.51,h*.47,Math.max(w,h)*.72);g.addColorStop(0,'#3c2023');g.addColorStop(.46,'#1c1015');g.addColorStop(1,'#070a11');youthCtx.fillStyle=g;youthCtx.fillRect(0,0,w,h);const halo=youthCtx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,Math.min(w,h)*.43);halo.addColorStop(0,'rgba(224,126,109,.16)');halo.addColorStop(.65,'rgba(162,71,77,.04)');halo.addColorStop(1,'rgba(0,0,0,0)');youthCtx.fillStyle=halo;youthCtx.fillRect(0,0,w,h);return}const g=youthCtx.createRadialGradient(w*.5,h*.42,0,w*.5,h*.42,Math.max(w,h)*.7);g.addColorStop(0,'#18475c');g.addColorStop(.48,'#0a1b2c');g.addColorStop(1,'#030912');youthCtx.fillStyle=g;youthCtx.fillRect(0,0,w,h);for(let i=0;i<86;i++){const x=(i*151%991)/991*w,y=(i*239%983)/983*h,a=.06+(i%7)*.025;youthCtx.fillStyle=`rgba(218,246,255,${a})`;youthCtx.fillRect(x,y,i%13===0?2:1,i%13===0?2:1)}const rg=youthCtx.createLinearGradient(0,h*.8,w,h*.8);rg.addColorStop(0,'rgba(104,214,173,.04)');rg.addColorStop(.5,'rgba(104,214,173,.26)');rg.addColorStop(1,'rgba(104,214,173,.04)');youthCtx.strokeStyle=rg;youthCtx.lineWidth=1;youthCtx.beginPath();youthCtx.moveTo(0,h*.81);youthCtx.quadraticCurveTo(w*.5,h*.75,w,h*.81);youthCtx.stroke()}
function youthCells(w,h){const color=youthOrgans[youthState.organ].tone;for(let i=0;i<44;i++){const a=i*2.399,r=16+(i%9)*12,x=Math.cos(a)*r,y=Math.sin(a)*r*.74,z=(i%5-2)*8,p=youthProject([x,y,z],w,h),radius=2.4+(i%4)*.65;youthCtx.save();youthCtx.fillStyle=color;youthCtx.shadowColor=color;youthCtx.shadowBlur=9;youthCtx.beginPath();youthCtx.arc(p.x,p.y,radius*p.s,0,Math.PI*2);youthCtx.fill();youthCtx.restore()}}
function youthScaffold(w,h){const color='rgba(150,216,235,.3)';for(let y=-110;y<=110;y+=22)youthPath([[-98,y,0],[0,y+(y%44?7:-7),0],[98,y,0]],w,h,color,1);for(let x=-100;x<=100;x+=24)youthPath([[x,-115,0],[x+Math.sin(x)*7,0,0],[x,115,0]],w,h,color,1)}
function youthVessels(w,h){const color='rgba(104,214,173,.8)';for(let i=0;i<8;i++){const x=-72+i*19;youthPath([[x,102,-14],[x*.55,43,10],[x*.2,-30,18],[x*.42,-92,3]],w,h,color,1.4,5)}}
function youthEsophagus(w,h){const pts=[];for(let i=0;i<=34;i++){const y=-126+i*7.4;pts.push([Math.sin(i*.42)*9,y,Math.cos(i*.33)*9])}youthTube(pts,w,h,27,'rgba(184,83,89,.85)')}
function youthUreters(w,h){youthBlob([-76,-80,5],43,54,w,h,'rgba(186,153,255,.72)');youthBlob([76,-80,5],43,54,w,h,'rgba(186,153,255,.72)');youthBlob([0,92,0],52,41,w,h,'rgba(88,202,188,.78)');youthTube([[-65,-47,5],[-56,-8,12],[-38,38,4],[-24,68,1]],w,h,11,'rgba(135,222,242,.8)');youthTube([[65,-47,5],[56,-8,12],[38,38,4],[24,68,1]],w,h,11,'rgba(135,222,242,.8)')}
function youthTooth(w,h){const crown=[[-52,-78,0],[-36,-111,6],[-10,-120,11],[10,-120,11],[36,-111,6],[52,-78,0],[43,-25,6],[24,-8,10],[0,0,13],[-24,-8,10],[-43,-25,6]];youthPoly(crown,w,h,'rgba(247,236,194,.88)','rgba(255,255,255,.7)');youthTube([[-23,-6,5],[-35,43,3],[-27,99,0]],w,h,17,'rgba(229,196,115,.88)');youthTube([[18,-4,8],[38,43,3],[27,99,0]],w,h,17,'rgba(229,196,115,.88)');youthPath([[-38,-64,12],[0,-78,27],[39,-64,12]],w,h,'rgba(255,255,255,.55)',2)}
function youthBladder(w,h){youthBlob([0,34,0],77,62,w,h,'rgba(85,204,186,.76)');youthTube([[-70,-132,10],[-63,-72,16],[-42,-24,7]],w,h,13,'rgba(131,216,243,.8)');youthTube([[70,-132,10],[63,-72,16],[42,-24,7]],w,h,13,'rgba(131,216,243,.8)');youthTube([[0,94,2],[0,129,3]],w,h,16,'rgba(85,204,186,.76)')}
function youthCornea(w,h){const rings=[];for(let r=1;r<=4;r++){const pts=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI*2;pts.push([Math.cos(a)*r*31,Math.sin(a)*r*17,Math.sin(a)*12])}rings.push(pts)}youthBlob([0,0,0],145,75,w,h,'rgba(104,205,244,.47)');rings.forEach((ring,i)=>youthPath(ring,w,h,i===3?'rgba(246,200,95,.7)':'rgba(207,245,255,.25)',i===3?1.8:1));youthBlob([0,0,13],28,24,w,h,'rgba(14,52,82,.85)')}
function youthSkin(w,h){const layers=[{y:-58,c:'rgba(238,158,121,.83)'},{y:-18,c:'rgba(245,197,157,.65)'},{y:24,c:'rgba(163,91,81,.63)'},{y:63,c:'rgba(86,156,175,.6)'}];layers.forEach((layer,i)=>youthPoly([[-132,layer.y-18,0],[132,layer.y-18,0],[125,layer.y+18,8],[-125,layer.y+18,8]],w,h,layer.c));for(let x=-95;x<=95;x+=29)youthTube([[x,65,8],[x+8,28,14],[x-4,-10,10]],w,h,3,'rgba(104,214,173,.65)')}
function drawYouthModel(w,h){const kind=youthOrgans[youthState.organ].kind;if(kind==='esophagus')youthEsophagus(w,h);if(kind==='ureters')youthUreters(w,h);if(kind==='tooth')youthTooth(w,h);if(kind==='bladder')youthBladder(w,h);if(kind==='cornea')youthCornea(w,h);if(kind==='skin')youthSkin(w,h)}
function drawYouthOrgan(){const esophagus=youthState.organ==='esophagus';document.querySelector('.youth-growth-play').style.display=esophagus&&window.youth3D?'':'none';document.getElementById('youth3DFallback').style.display=esophagus?'':'none';document.querySelector('.youth-canvas-hud > span').textContent=esophagus?'مراحل نمو المريء':'رسم تعليمي مبسط';document.querySelectorAll('.youth-3d-stage-rail,.youth-3d-counts,.youth-tissue-key,.youth-3d-label-layer').forEach(el=>el.style.display=esophagus?'':'none');if(youthState.organ==='esophagus'&&window.youth3D){window.youth3D.setActive(true);window.youth3D.setProgress(youthState.stage);return}if(window.youth3D)window.youth3D.setActive(false);const rect=youthCanvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const dpr=Math.min(devicePixelRatio||1,2),w=rect.width,h=rect.height;youthCanvas.width=w*dpr;youthCanvas.height=h*dpr;youthCtx.setTransform(dpr,0,0,dpr,0,0);youthCtx.clearRect(0,0,w,h);youthBackdrop(w,h);const stage=Math.min(4,Math.floor(youthState.stage+.0001));if(youthState.organ==='esophagus'){youthEsophagus(w,h);return}if(stage===0){youthCells(w,h);youthCtx.globalAlpha=.18;drawYouthModel(w,h);youthCtx.globalAlpha=1}else{if(stage===1)youthScaffold(w,h);youthCtx.globalAlpha=stage===1?.58:1;drawYouthModel(w,h);youthCtx.globalAlpha=1;if(stage>=2)youthCells(w,h);if(stage>=3)youthVessels(w,h);if(stage===4){youthCtx.save();youthCtx.strokeStyle='rgba(246,200,95,.42)';youthCtx.setLineDash([5,7]);youthCtx.lineWidth=1.4;youthCtx.beginPath();youthCtx.ellipse(w*.5,h*.54,Math.min(w,h)*.3,Math.min(w,h)*.39,0,0,Math.PI*2);youthCtx.stroke();youthCtx.restore()}}}
function updateYouthProcess(stageSet){const activeIndex=Math.min(4,Math.floor(youthState.stage+.0001));document.querySelectorAll('[data-youth-process]').forEach((card,index)=>{const stage=stageSet[index],title=card.querySelector('[data-youth-process-title]'),note=card.querySelector('[data-youth-process-note]');if(stage&&title&&note){title.textContent=stage.short;note.textContent=stage.process||stage.meta}card.classList.toggle('active-stage',index===activeIndex)})}
function updateYouthSources(key){const records={esophagus:['https://pubmed.ncbi.nlm.nih.gov/30244869/','عضيات مريئية من خلايا متعددة القدرات؛ ليس مريئًا كاملًا قابلًا للزرع'],ureters:['https://pmc.ncbi.nlm.nih.gov/articles/PMC4477215/','هياكل حالبية خنزيرية وتجارب نسيجية'],tooth:['https://pubmed.ncbi.nlm.nih.gov/19666587/','هندسة برعم السن وزراعته في الفئران'],bladder:['https://pubmed.ncbi.nlm.nih.gov/16631879/','إعادة بناء المثانة في دراسة بشرية صغيرة بخلايا المرضى'],cornea:['https://www.ema.europa.eu/en/medicines/human/EPAR/holoclar','علاج محدد لخلايا سطح القرنية'],skin:['https://www.fda.gov/vaccines-blood-biologics/approved-blood-products/epicel-cultured-epidermal-autografts','رقع بشرة خلوية لاستطبابات حروق محددة']};const record=records[key];let link=document.getElementById('youthStudy');if(!link){link=document.createElement('a');link.id='youthStudy';link.target='_blank';link.rel='noopener noreferrer';link.className='live-caption';document.getElementById('youthEvidence').closest('.youth-facts').after(link);}if(record){link.href=record[0];link.textContent='المصدر العلمي: '+record[1]+' ↗';}}
function updateYouthInfo(){updateYouthSources(youthState.organ);const organ=youthOrgans[youthState.organ],stageSet=organ.kind==='esophagus'?youthEsophagusStages:youthStages,stageIndex=Math.min(4,Math.floor(youthState.stage+.0001)),stage=stageSet[stageIndex],status=document.getElementById('youthStatus');document.getElementById('youthSceneTitle').textContent=organ.title;document.getElementById('youthCanvasLabel').textContent=organ.canvas;document.getElementById('youthCanvasMeta').textContent=organ.kind==='esophagus'?stage.meta:organ.meta;document.getElementById('youthOrganName').textContent=organ.title;document.getElementById('youthOrganDescription').textContent=organ.description;document.getElementById('youthNearTerm').textContent=organ.target;document.getElementById('youthEvidence').textContent=organ.evidence;document.getElementById('youthStageLabel').textContent=stage.label;document.getElementById('youthStageNumber').textContent=`${arDigits(stageIndex+1)} / ٥`;document.getElementById('youthStageReadout').textContent=stage.short;status.textContent=organ.status;status.style.borderColor=`${organ.tone}66`;status.style.color=organ.tone;status.style.background=`${organ.tone}16`;document.querySelectorAll('[data-youth-organ]').forEach(button=>button.classList.toggle('active',button.dataset.youthOrgan===youthState.organ));updateYouthProcess(stageSet);drawYouthOrgan()}
function selectYouthOrgan(key){if(!youthOrgans[key])return;youthState.organ=key;if(window.youth3D)window.youth3D.setActive(key==='esophagus');updateYouthInfo()}
window.syncYouthStage=value=>{youthState.stage=Math.max(0,Math.min(4,Number(value)||0))};
document.querySelectorAll('[data-youth-organ]').forEach(button=>button.addEventListener('click',()=>selectYouthOrgan(button.dataset.youthOrgan)));
youthStageSlider.addEventListener('input',()=>{youthState.stage=+youthStageSlider.value;updateYouthInfo()});
document.getElementById('youthRotateRight').addEventListener('click',()=>{if(youthState.organ==='esophagus'&&window.youth3D){window.youth3D.rotate(.32);return}youthState.yaw+=.32;drawYouthOrgan()});document.getElementById('youthRotateLeft').addEventListener('click',()=>{if(youthState.organ==='esophagus'&&window.youth3D){window.youth3D.rotate(-.32);return}youthState.yaw-=.32;drawYouthOrgan()});
youthCanvas.addEventListener('pointerdown',event=>{youthState.dragging=true;youthState.lastX=event.clientX;youthState.lastY=event.clientY;youthCanvas.setPointerCapture(event.pointerId)});youthCanvas.addEventListener('pointermove',event=>{if(!youthState.dragging)return;youthState.yaw+=(event.clientX-youthState.lastX)*.012;youthState.pitch=Math.max(-.55,Math.min(.55,youthState.pitch+(event.clientY-youthState.lastY)*.01));youthState.lastX=event.clientX;youthState.lastY=event.clientY;drawYouthOrgan()});youthCanvas.addEventListener('pointerup',()=>{youthState.dragging=false});youthCanvas.addEventListener('pointercancel',()=>{youthState.dragging=false});
function setYouthTab(tab){const engineering=tab==='engineering';document.querySelectorAll('[data-youth-tab]').forEach(button=>{const active=button.dataset.youthTab===tab;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))});document.getElementById('youthEngineeringPane').hidden=!engineering;document.getElementById('youthRegenerationPane').hidden=engineering;if(engineering)setTimeout(drawYouthOrgan,0);else window.youth3D?.setActive(false)}
document.querySelectorAll('[data-youth-tab]').forEach(button=>button.addEventListener('click',()=>setYouthTab(button.dataset.youthTab)));
updateYouthInfo();
const syncCanvas=document.getElementById('syncCanvas'),syncCtx=syncCanvas.getContext('2d'),syncSlider=document.getElementById('syncSlider');
const SYNC_TROPICAL_YEAR=365.2421896698,SYNC_SYNODIC_MONTH=29.5305888531,SYNC_LUNAR_YEAR=SYNC_SYNODIC_MONTH*12,SYNC_YEAR_GAP=SYNC_TROPICAL_YEAR-SYNC_LUNAR_YEAR,SYNC_RETURN_LUNAR=SYNC_TROPICAL_YEAR/SYNC_YEAR_GAP,SYNC_SECOND_RETURN=SYNC_RETURN_LUNAR*2;
const syncState={year:0,view:'drift',yaw:-.58,pitch:.2,timer:null,labelMode:'north',referenceMonth:'رمضان',referenceYear:1447,referenceDate:'2026-02-18'};
const syncLandmarkNames={global:['اعتدال مارس','انقلاب يونيو','اعتدال سبتمبر','انقلاب ديسمبر'],north:['الربيع','الصيف','الخريف','الشتاء'],south:['الخريف','الشتاء','الربيع','الصيف']};
const syncPeriodNames={global:['مارس–يونيو','يونيو–سبتمبر','سبتمبر–ديسمبر','ديسمبر–مارس'],north:['الربيع','الصيف','الخريف','الشتاء'],south:['الخريف','الشتاء','الربيع','الصيف']};
const syncSeasonColors=['#70d7ad','#f6c85f','#ee9369','#82d8f3'];
function syncDigits(value,places=1){return arDigits(Number(value).toFixed(places))}
const syncPhaseCache=new Map();
function syncAnnualPhase(n){const key=syncState.referenceDate+':'+n;if(!syncPhaseCache.has(key))syncPhaseCache.set(key,Astronomy.SunPosition(new Date(Date.parse(syncState.referenceDate+'T12:00:00Z')+n*SYNC_LUNAR_YEAR*86400000)).elon/360);return syncPhaseCache.get(key);}
function syncReferencePhase(){return syncAnnualPhase(0);}
function syncReferenceName(offset=0){return `${syncState.referenceMonth} ${arDigits(syncState.referenceYear+Math.floor(offset+1e-6))} هـ`}
function syncSeasonAt(year){const n=Math.floor(year),a=syncAnnualPhase(n),b=syncAnnualPhase(n+1),delta=((b-a+1.5)%1)-.5,phase=((a+(year-n)*delta)%1+1)%1,index=Math.floor(phase*4);return {phase,index,label:syncPeriodNames[syncState.labelMode][index],angle:-Math.PI/2+phase*Math.PI*2,longitude:phase*360};}
function syncYearRange(start,end){const first=arDigits(syncState.referenceYear+start),last=arDigits(syncState.referenceYear+end);return start===end?first:`${first}–${last}`}
function syncSeasonRuns(){const items=[];for(let offset=0;offset<=Math.floor(SYNC_SECOND_RETURN);offset++){const season=syncSeasonAt(offset);items.push({offset,...season})}const runs=[];items.forEach(item=>{const previous=runs[runs.length-1];if(previous&&previous.index===item.index){previous.end=item.offset;previous.count+=1}else runs.push({index:item.index,label:item.label,start:item.offset,end:item.offset,count:1})});return runs}
function renderSyncSeasonSchedule(){const track=document.getElementById('syncSeasonTrack'),list=document.getElementById('syncSeasonSummaryList'),title=document.getElementById('syncSeasonSummaryTitle'),lead=document.getElementById('syncSeasonSummaryLead'),note=document.getElementById('syncSeasonRibbonNote');if(syncState.view==='metonic'){track.innerHTML='';list.innerHTML='';title.textContent='دورة ميتون';lead.textContent='لا تُصنّف هذه الدورة حسب الفصول.';note.textContent='يتوقف جدول المواسم في وضع ميتون';return}const runs=syncSeasonRuns(),current=runs[0],nextSame=runs.find(run=>run.start>0&&run.index===current.index);title.textContent=`مواسم ${syncReferenceName()}`;lead.textContent=nextSame?`الفترة التالية من ${current.label}: ${syncYearRange(nextSame.start,nextSame.end)} هـ، بعد ${syncDigits(nextSame.start)} سنة قمرية.`:`تُعرض الفترات ضمن دورة العودة الكاملة.`;note.textContent=`السنوات الهجرية خلال ${syncDigits(SYNC_SECOND_RETURN,3)} سنة قمرية`;track.innerHTML=runs.map(run=>`<button type="button" class="sync-season-segment" data-sync-season-start="${run.start}" style="--season-color:${syncSeasonColors[run.index]}"><b>${run.label}</b><small>${syncYearRange(run.start,run.end)} هـ</small></button>`).join('');list.innerHTML=runs.map(run=>`<div><i style="background:${syncSeasonColors[run.index]}"></i><span><b>${run.label}</b><small>${syncYearRange(run.start,run.end)} هـ</small></span><em>${arDigits(run.count)} سنوات</em></div>`).join('')}
function setSyncView(view){
  if(syncState.timer){clearInterval(syncState.timer);syncState.timer=null;document.getElementById('syncPlay').textContent='▶';document.getElementById('syncPlay').setAttribute('aria-pressed','false');document.getElementById('syncPlay').setAttribute('aria-label','تشغيل المحاكاة')}
  syncState.view=view;syncState.year=0;const max=view==='metonic'?19:SYNC_SECOND_RETURN;syncSlider.max=String(max);document.getElementById('syncLabels').disabled=view==='metonic';document.querySelectorAll('[data-sync-reference]').forEach(control=>control.disabled=view==='metonic');document.getElementById('syncReferenceBar').hidden=view==='metonic';document.getElementById('syncSeasonRibbon').hidden=view==='metonic';document.getElementById('metonicExplainer').hidden=view!=='metonic';
  document.querySelectorAll('[data-sync-view]').forEach(button=>{const active=button.dataset.syncView===view;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
  document.getElementById('syncSceneTitle').textContent=view==='metonic'?'تقارب ١٩ سنة و٢٣٥ شهرًا اقترانيًا':'عودة الشهر الهجري عبر المواسم';
  document.getElementById('syncControlLabel').textContent=view==='metonic'?'السنوات الشمسية داخل دورة ميتون':'السنوات القمرية المتوسطة';
  updateSyncReadout();drawSync();
}
function updateSyncReadout(){
  const year=syncState.year,metonic=syncState.view==='metonic',season=syncSeasonAt(year);syncSlider.value=year.toFixed(1);
  if(metonic){
    const months=year*235/19,gap=year/19*Math.abs(19*SYNC_TROPICAL_YEAR-235*SYNC_SYNODIC_MONTH),hours=gap*24;
    document.getElementById('syncYears').textContent=syncDigits(year)+' سنة شمسية';document.getElementById('syncReadoutTitle').textContent='فارق دورة ميتون';document.getElementById('syncDrift').textContent=syncDigits(hours)+' ساعة';document.getElementById('syncDriftCaption').textContent='الفرق التراكمي بين المدتين المتوسطتين';
    document.getElementById('syncSolarYearsLabel').textContent='الأشهر الاقترانية المنقضية';document.getElementById('syncSolarYears').textContent=syncDigits(months)+' شهرًا';document.getElementById('syncLongitudeLabel').textContent='المدة الشمسية';document.getElementById('syncLongitude').textContent=syncDigits(year*SYNC_TROPICAL_YEAR)+' يومًا';document.getElementById('syncSeasonLabel').textContent='الإقحام في النظام الميتوني';document.getElementById('syncSeasonStat').textContent='٧ أشهر خلال ١٩ سنة';document.getElementById('syncReturnLabel').textContent='المتبقي لإكمال الدورة';document.getElementById('syncReturn').textContent=syncDigits(19-year)+' سنة';
    document.getElementById('syncSeason').textContent='تقارب زمني';document.getElementById('syncHudLabel').textContent='دورة ميتون';document.getElementById('syncHudMeta').textContent=`${syncDigits(year)} من ١٩ سنة شمسية`;
    document.getElementById('syncLegendNote').textContent='الخطّان يمثلان طول ١٩ سنة شمسية و٢٣٥ شهرًا اقترانيًا؛ يقتربان كثيرًا ولا يتطابقان تمامًا.';
  }else{
    const drift=year*SYNC_YEAR_GAP,solarYears=year*SYNC_LUNAR_YEAR/SYNC_TROPICAL_YEAR,atFirst=Math.abs(year-SYNC_RETURN_LUNAR)<.08,atSecond=Math.abs(year-SYNC_SECOND_RETURN)<.08;let nextReturn;
    if(atFirst)nextReturn='اكتملت العودة الأولى';else if(atSecond)nextReturn='اكتملت العودة الثانية';else if(year<SYNC_RETURN_LUNAR)nextReturn=syncDigits(SYNC_RETURN_LUNAR-year,3)+' قمرية';else nextReturn=syncDigits(Math.max(0,SYNC_SECOND_RETURN-year),3)+' قمرية';
    document.getElementById('syncSceneTitle').textContent=`عودة ${syncReferenceName()} عبر المواسم`;document.getElementById('syncYears').textContent=syncDigits(year)+' سنة قمرية';document.getElementById('syncReadoutTitle').textContent=`عودة ${syncReferenceName(year)}`;document.getElementById('syncDrift').textContent=syncDigits(drift)+' يومًا';document.getElementById('syncDriftCaption').textContent=`نحو ${syncDigits(drift/SYNC_TROPICAL_YEAR,2)} دورة شمسية`;
    document.getElementById('syncSolarYearsLabel').textContent='الزمن الشمسي المنقضي';document.getElementById('syncSolarYears').textContent=syncDigits(solarYears,2)+' سنة';document.getElementById('syncLongitudeLabel').textContent='الطول الشمسي المرجعي';document.getElementById('syncLongitude').textContent=syncDigits(season.longitude)+'°';document.getElementById('syncSeasonLabel').textContent='الموقع في الدورة';document.getElementById('syncSeasonStat').textContent=season.label;document.getElementById('syncReturnLabel').textContent='التقارب التالي';document.getElementById('syncReturn').textContent=nextReturn;
    document.getElementById('syncSeason').textContent=season.label;document.getElementById('syncHudLabel').textContent=syncReferenceName(year);document.getElementById('syncHudMeta').textContent=`مرجع البداية ${arDigits(syncState.referenceDate.split('-').reverse().join('/'))} • بعد ${syncDigits(year)} قمرية`;
    document.getElementById('syncLegendNote').textContent='يكمل الحلزون دورة كاملة بعد ٣٣٫٥٨٥ سنة قمرية متوسطة، أي نحو ٣٢٫٥٨٥ سنة شمسية من الزمن المنقضي.';
  }
  renderSyncSeasonSchedule();
}
function syncProject(point,w,h){
  const [x,y,z]=point,cy=Math.cos(syncState.yaw),sy=Math.sin(syncState.yaw),cp=Math.cos(syncState.pitch),sp=Math.sin(syncState.pitch);
  const x1=x*cy-z*sy,z1=x*sy+z*cy,y1=y*cp-z1*sp,z2=y*sp+z1*cp,focal=Math.min(w,h)*1.72,scale=focal/(focal+z2+focal*.3);
  return {x:w*.5+x1*scale,y:h*.56-y1*scale,z:z2,s:scale};
}
function syncStroke(points,w,h,color,width=1,dash=[]){
  const projected=points.map(point=>syncProject(point,w,h));syncCtx.save();syncCtx.beginPath();projected.forEach((point,index)=>index?syncCtx.lineTo(point.x,point.y):syncCtx.moveTo(point.x,point.y));syncCtx.strokeStyle=color;syncCtx.lineWidth=width;syncCtx.setLineDash(dash);syncCtx.stroke();syncCtx.restore();return projected;
}
function syncDot(point,w,h,radius,color,glow=0){
  const p=syncProject(point,w,h);syncCtx.save();syncCtx.shadowColor=color;syncCtx.shadowBlur=glow;syncCtx.fillStyle=color;syncCtx.beginPath();syncCtx.arc(p.x,p.y,Math.max(2,radius*p.s),0,Math.PI*2);syncCtx.fill();syncCtx.restore();return p;
}
function syncText(text,point,w,h,color='#d8ebf7',size=11){const p=syncProject(point,w,h);syncCtx.save();syncCtx.fillStyle=color;syncCtx.font=`600 ${size}px Tajawal, sans-serif`;syncCtx.textAlign='center';syncCtx.fillText(text,p.x,p.y);syncCtx.restore()}
function syncRing(radius,y,w,h,color='rgba(117,216,232,.22)',dash=[]){const pts=[];for(let i=0;i<=96;i++){const a=i/96*Math.PI*2;pts.push([Math.cos(a)*radius,y,Math.sin(a)*radius])}return syncStroke(pts,w,h,color,1,dash)}
function syncBackdrop(w,h){
  const g=syncCtx.createRadialGradient(w*.48,h*.44,0,w*.48,h*.44,Math.max(w,h)*.72);g.addColorStop(0,'#173c61');g.addColorStop(.52,'#0a1b2d');g.addColorStop(1,'#040b14');syncCtx.fillStyle=g;syncCtx.fillRect(0,0,w,h);
  for(let i=0;i<82;i++){const x=(i*137%997)/997*w,y=(i*229%991)/991*h,alpha=.12+(i%6)*.07;syncCtx.fillStyle=`rgba(222,243,255,${alpha})`;syncCtx.fillRect(x,y,i%5===0?1.5:1,i%5===0?1.5:1)}
}
function drawSyncDrift(w,h){
  const r=Math.min(w*.25,h*.22,142),height=Math.min(h*.35,205),year=syncState.year,max=SYNC_SECOND_RETURN,landmarks=syncLandmarkNames[syncState.labelMode];
  syncCtx.save();syncCtx.globalAlpha=.92;
  for(let i=0;i<=8;i++){const y=-height+i/8*height*2,major=i===0||i===4||i===8;syncRing(r,y,w,h,major?'rgba(246,200,95,.36)':'rgba(126,197,230,.13)',major?[5,5]:[2,8])}
  for(let i=0;i<4;i++){const a=-Math.PI/2+i*Math.PI/2;syncStroke([[Math.cos(a)*r,-height,Math.sin(a)*r],[Math.cos(a)*r,height,Math.sin(a)*r]],w,h,'rgba(153,210,238,.19)',1,[3,7]);syncText(landmarks[i],[Math.cos(a)*r*1.28,-height-12,Math.sin(a)*r*1.28],w,h,'rgba(223,241,251,.82)',10)}
  syncStroke([[0,-height-20,0],[0,height+24,0]],w,h,'rgba(246,200,95,.45)',1.4,[5,5]);
  const all=[],progress=[],referenceAngle=-Math.PI/2+syncReferencePhase()*Math.PI*2;for(let i=0;i<=300;i++){const t=i/300*max,a=syncSeasonAt(t).angle,y=-height+t/max*height*2,p=[Math.cos(a)*r,y,Math.sin(a)*r];all.push(p);if(t<=year)progress.push(p)}
  syncStroke(all,w,h,'rgba(188,168,255,.22)',1.5,[4,5]);for(let segment=0;segment<Math.ceil(max);segment++){const from=segment,to=Math.min(max,segment+1),points=[];for(let i=0;i<=12;i++){const t=from+(to-from)*i/12,a=syncSeasonAt(t).angle,y=-height+t/max*height*2;points.push([Math.cos(a)*r,y,Math.sin(a)*r])}syncStroke(points,w,h,syncSeasonColors[syncSeasonAt(from+.5).index],segment<year?3:1.5,segment<year?[]:[4,5])}
  for(let lunarYear=0;lunarYear<=Math.floor(max);lunarYear++){const a=syncSeasonAt(lunarYear).angle,y=-height+lunarYear/max*height*2,color=syncSeasonColors[syncSeasonAt(lunarYear).index];syncDot([Math.cos(a)*r,y,Math.sin(a)*r],w,h,lunarYear%5===0?2.6:1.6,lunarYear<=year?color:'rgba(188,168,255,.42)',lunarYear<=year&&lunarYear%5===0?6:0)}
  if(w>510)syncSeasonRuns().forEach(run=>{const t=Math.min(max,(run.start+run.end)/2),a=syncSeasonAt(t).angle,y=-height+t/max*height*2;syncText(`${run.label} • ${syncYearRange(run.start,run.end)}`,[Math.cos(a)*r*1.42,y,Math.sin(a)*r*1.42],w,h,syncSeasonColors[run.index],10)});
  const compact=w<500,markers=[{t:0,label:compact?'٠':'البداية • ٠'},{t:SYNC_RETURN_LUNAR,label:compact?'٣٣٫٦ ق.':'العودة ١ • ٣٣٫٥٨٥ ق.'},{t:SYNC_SECOND_RETURN,label:compact?'٦٧٫٢ ق.':'العودة ٢ • ٦٧٫١٧٠ ق.'}];markers.forEach(marker=>{const y=-height+marker.t/max*height*2;syncRing(r,y,w,h,'rgba(246,200,95,.62)',[5,5]);syncText(marker.label,[r*(compact?1.25:1.43),y,0],w,h,'#ffe0a0',compact?9:10)});
  const currentA=syncSeasonAt(year).angle,currentY=-height+year/max*height*2,current=[Math.cos(currentA)*r,currentY,Math.sin(currentA)*r];syncDot(current,w,h,9,'#55d8f2',24);
  syncCtx.restore();syncCtx.save();syncCtx.fillStyle='rgba(219,239,250,.7)';syncCtx.font='600 11px Tajawal, sans-serif';syncCtx.textAlign='left';syncCtx.fillText(compact?'↑ الزمن القمري':'↑ الزمن: سنوات قمرية متوسطة',16,23);if(!compact){syncCtx.fillStyle='rgba(188,168,255,.82)';syncCtx.fillText('↺ الشهر ينتقل إلى تاريخ شمسي أبكر',16,42)}syncCtx.restore();
}
function drawSyncMetonic(w,h){
  const r=Math.min(w*.22,h*.23,130),height=Math.min(h*.35,170),year=syncState.year;
  syncStroke([[0,-height-22,0],[0,height+25,0]],w,h,'rgba(223,241,251,.34)',1.2,[5,6]);
  [-height,0,height].forEach((y,index)=>{syncRing(r,y,w,h,index===1?'rgba(85,216,242,.3)':'rgba(85,216,242,.16)',[4,7]);syncText(index===0?'بداية الدورة':index===1?'منتصف الدورة':'١٩ سنة',[r*1.35,y,0],w,h,'rgba(221,240,250,.7)',10)});
  const cycleGap=Math.abs(19*SYNC_TROPICAL_YEAR-235*SYNC_SYNODIC_MONTH),residualAngle=cycleGap/SYNC_SYNODIC_MONTH*Math.PI*2,solar=[],lunar=[],solarPartial=[],lunarPartial=[];for(let i=0;i<=180;i++){const t=i/180*19,a=-Math.PI/2+t/19*Math.PI*4,y=-height+t/19*height*2;solar.push([Math.cos(a)*r,y,Math.sin(a)*r]);lunar.push([Math.cos(a+residualAngle*t/19)*(r*.94),y,Math.sin(a+residualAngle*t/19)*(r*.94)]);if(t<=year){solarPartial.push(solar[solar.length-1]);lunarPartial.push(lunar[lunar.length-1])}}
  syncStroke(solar,w,h,'rgba(246,200,95,.23)',1,[4,6]);syncStroke(lunar,w,h,'rgba(85,216,242,.25)',1,[4,6]);syncStroke(solarPartial,w,h,'rgba(246,200,95,.95)',2.4);syncStroke(lunarPartial,w,h,'rgba(85,216,242,.95)',2.4);
  const t=year,a=-Math.PI/2+t/19*Math.PI*4,y=-height+t/19*height*2,currentSolar=[Math.cos(a)*r,y,Math.sin(a)*r],currentLunar=[Math.cos(a+residualAngle*t/19)*(r*.94),y,Math.sin(a+residualAngle*t/19)*(r*.94)];syncDot(currentSolar,w,h,7,'#f6c85f',18);syncDot(currentLunar,w,h,6,'#55d8f2',18);syncText('١٩ سنة شمسية',[0,height+26,0],w,h,'#ffe1a0',11);syncText('٢٣٥ شهرًا اقترانيًا',[0,height+45,0],w,h,'#8ce8f8',11);
  syncCtx.save();syncCtx.fillStyle='rgba(219,239,250,.72)';syncCtx.font='600 11px Tajawal, sans-serif';syncCtx.textAlign='left';syncCtx.fillText(w<430?'الفرق النهائي ≈ ٢٫١ ساعة':'الفرق بعد الدورة الكاملة ≈ ساعتان و٥ دقائق',16,23);syncCtx.restore();
}
function drawSync(){
  const rect=syncCanvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const dpr=Math.min(devicePixelRatio||1,2),w=rect.width,h=rect.height;syncCanvas.width=w*dpr;syncCanvas.height=h*dpr;syncCtx.setTransform(dpr,0,0,dpr,0,0);syncBackdrop(w,h);if(syncState.view==='metonic')drawSyncMetonic(w,h);else drawSyncDrift(w,h);
}
syncSlider.addEventListener('input',()=>{syncState.year=+syncSlider.value;updateSyncReadout();drawSync()});
document.querySelectorAll('[data-sync-view]').forEach(button=>button.addEventListener('click',()=>setSyncView(button.dataset.syncView)));
document.getElementById('syncLabels').addEventListener('change',event=>{syncState.labelMode=event.target.value;updateSyncReadout();drawSync()});
document.getElementById('syncReferenceMonth').addEventListener('change',event=>{syncState.referenceMonth=event.target.value;updateSyncReadout();drawSync()});
document.getElementById('syncReferenceYear').addEventListener('input',event=>{syncState.referenceYear=Math.max(1,+event.target.value||1);updateSyncReadout();drawSync()});
document.getElementById('syncReferenceDate').addEventListener('change',event=>{if(event.target.value){syncState.referenceDate=event.target.value;updateSyncReadout();drawSync()}});
document.getElementById('syncSeasonTrack').addEventListener('click',event=>{const button=event.target.closest('[data-sync-season-start]');if(!button||syncState.view==='metonic')return;syncState.year=+button.dataset.syncSeasonStart;updateSyncReadout();drawSync()});
document.getElementById('syncReset').addEventListener('click',()=>{if(syncState.timer){clearInterval(syncState.timer);syncState.timer=null}const play=document.getElementById('syncPlay');play.textContent='▶';play.setAttribute('aria-pressed','false');play.setAttribute('aria-label','تشغيل المحاكاة');syncState.year=0;syncState.yaw=-.58;syncState.pitch=.2;updateSyncReadout();drawSync()});
document.getElementById('syncPlay').addEventListener('click',event=>{if(syncState.timer){clearInterval(syncState.timer);syncState.timer=null;event.currentTarget.textContent='▶';event.currentTarget.setAttribute('aria-pressed','false');event.currentTarget.setAttribute('aria-label','تشغيل المحاكاة')}else{event.currentTarget.textContent='Ⅱ';event.currentTarget.setAttribute('aria-pressed','true');event.currentTarget.setAttribute('aria-label','إيقاف المحاكاة');syncState.timer=setInterval(()=>{const max=+syncSlider.max;syncState.year=+(syncState.year+.1>max?0:syncState.year+.1).toFixed(1);updateSyncReadout();drawSync()},75)}});
let syncDrag=null;syncCanvas.addEventListener('pointerdown',event=>{syncDrag={x:event.clientX,y:event.clientY};syncCanvas.setPointerCapture(event.pointerId)});syncCanvas.addEventListener('pointermove',event=>{if(!syncDrag)return;syncState.yaw+=(event.clientX-syncDrag.x)*.009;syncState.pitch=Math.max(-.25,Math.min(1.05,syncState.pitch+(event.clientY-syncDrag.y)*.007));syncDrag={x:event.clientX,y:event.clientY};drawSync()});['pointerup','pointercancel','lostpointercapture'].forEach(type=>syncCanvas.addEventListener(type,()=>{syncDrag=null}));addEventListener('resize',drawSync);setSyncView('drift');

const dialog=document.getElementById('cameraDialog');
let skyRotation=0;
const starSeed=Array.from({length:150},(_,i)=>({x:(i*83%997)/997,y:(i*191%991)/991,r:.45+(i%4)*.27,a:.25+(i%7)/10}));
function drawSky(){window.skyLive?.draw();}
const skyTime=document.getElementById('skyTime');function updateSky(){window.skyLive?.draw();}
const toast=document.getElementById('appToast');let toastTimer;
function showToast(message){
  toast.querySelector('b').textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800);
}
const eclipseData={2026:CalendarCore.eclipses(2026)};
let eclipseYear=2026,eclipseEvent=eclipseData[2026][0],eclipseView='space';
const eclipseCanvas=document.getElementById('eclipseCanvas'),eclipseCtx=eclipseCanvas.getContext('2d'),eclipseTime=document.getElementById('eclipseTime');
const eclipseLegend=document.getElementById('eclipseLegend'),eclipsePhase=document.getElementById('eclipsePhase');
function renderEclipseEvents(){
  document.getElementById('agendaYear').textContent=arDigits(eclipseYear);
  const events=eclipseData[eclipseYear]=CalendarCore.eclipses(eclipseYear);document.getElementById('eclipseEvents').innerHTML=events.map((event,index)=>`<button class="eclipse-event ${event.type==='lunar'?'lunar':''} ${index===0?'active':''}" data-event-index="${index}"><span class="event-orb">${event.type==='solar'?'◉':'◒'}</span><span><b>${event.title}</b><small>${event.date}</small></span><em>${event.visibility}</em></button>`).join('');
  document.querySelectorAll('[data-event-index]').forEach(button=>button.addEventListener('click',()=>selectEclipseEvent(+button.dataset.eventIndex)));
  selectEclipseEvent(0);
}
function selectEclipseEvent(index){
  eclipseEvent=eclipseData[eclipseYear][index];document.querySelectorAll('[data-event-index]').forEach((button,i)=>button.classList.toggle('active',i===index));
  document.getElementById('eclipseSceneTitle').textContent=eclipseEvent.title;document.getElementById('eclipseSceneMeta').textContent=`${eclipseEvent.date} • ${CalendarCore.location.name} • ${eclipseEvent.visibility}`;
  document.getElementById('phaseStart').textContent=eclipseEvent.start;document.getElementById('phasePeak').textContent=eclipseEvent.peak;document.getElementById('phaseEnd').textContent=eclipseEvent.end;document.getElementById('prayerWindow').textContent=eclipseEvent.window;eclipseTime.value=100*(eclipseEvent.peakAt-eclipseEvent.startAt)/(eclipseEvent.endAt-eclipseEvent.startAt);updateEclipse();
}
document.querySelectorAll('#eclipseYears button').forEach(button=>button.addEventListener('click',()=>{eclipseYear=+button.dataset.year;document.querySelectorAll('#eclipseYears button').forEach(b=>b.classList.toggle('active',b===button));renderEclipseEvents()}));
document.querySelectorAll('[data-eclipse-view]').forEach(button=>button.addEventListener('click',()=>{eclipseView=button.dataset.eclipseView;document.querySelectorAll('[data-eclipse-view]').forEach(b=>b.classList.toggle('active',b===button));selectEclipseEvent([...document.querySelectorAll('[data-event-index]')].findIndex(b=>b.classList.contains('active'))||0)}));

function eclipsePhaseAt(event,time){
  if(event.type==='solar'){
    if(!event.local){if(Math.abs(time-event.peakAt)<=120000)return'الذروة العالمية';return time<event.peakAt?'قبل الذروة العالمية':'بعد الذروة العالمية'}
    if(time<event.contactStartAt)return'قبل التماس الأول';if(time>event.contactEndAt)return'بعد التماس الأخير';
    if(event.centralStartAt&&time>=event.centralStartAt&&time<=event.centralEndAt)return event.localKind==='annular'?'الطور الحلقي':'الطور الكلي';
    return Math.abs(time-event.peakAt)<=120000?'ذروة الكسوف':'كسوف جزئي';
  }
  if(time<event.penumbralStartAt)return'قبل دخول شبه الظل';if(time>event.penumbralEndAt)return'بعد الخسوف';
  if(event.totalStartAt&&time>=event.totalStartAt&&time<=event.totalEndAt)return'الخسوف الكلي';
  if(event.partialStartAt&&time>=event.partialStartAt&&time<=event.partialEndAt)return Math.abs(time-event.peakAt)<=120000?'ذروة الخسوف':'الخسوف الجزئي';
  return event.kind==='penumbral'&&Math.abs(time-event.peakAt)<=120000?'ذروة شبه الظل':'خسوف شبه ظلي';
}
function drawOrb(context,x,y,r,inner,outer){const g=context.createRadialGradient(x-r*.35,y-r*.35,r*.08,x,y,r);g.addColorStop(0,inner);g.addColorStop(1,outer);context.fillStyle=g;context.beginPath();context.arc(x,y,r,0,Math.PI*2);context.fill()}
function eclipsePolygon(c,points,fill){c.fillStyle=fill;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}
function eclipseLabel(c,text,x,y,color='rgba(225,241,250,.76)',align='center'){c.fillStyle=color;c.font='12px sans-serif';c.textAlign=align;c.fillText(text,x,y)}
function setEclipseLegend(){
  const items=eclipseView==='space'?[['sun','الشمس'],['earth','الأرض'],['moon','القمر'],['shadow','الظل وشبه الظل']]:eclipseEvent.type==='solar'?[['sun','قرص الشمس'],['moon','قرص القمر']]:[['moon','القمر'],['umbra','ظل الأرض التام'],['shadow','شبه ظل الأرض']];
  eclipseLegend.innerHTML=items.map(([kind,label])=>`<span><i class="legend-${kind}"></i>${label}</span>`).join('');
}
function observerBody(body,date,loc,radiusKm){const o=new Astronomy.Observer(loc.lat,loc.lon,loc.elevation||0),eq=Astronomy.Equator(body,date,o,true,true),hz=Astronomy.Horizon(date,o,eq.ra,eq.dec,'normal'),AU=149597870.7;return{alt:hz.altitude,az:hz.azimuth,radius:Math.asin(radiusKm/(eq.dist*AU))*180/Math.PI}}
function circleOverlap(r,R,d){if(d>=r+R)return 0;if(d<=Math.abs(r-R))return Math.min(1,R*R/(r*r));const a=Math.acos((d*d+r*r-R*R)/(2*d*r)),b=Math.acos((d*d+R*R-r*r)/(2*d*R)),area=r*r*a+R*R*b-.5*Math.sqrt((-d+r+R)*(d+r-R)*(d-r+R)*(d+r+R));return Math.max(0,Math.min(1,area/(Math.PI*r*r)))}
function lunarShadowGeometry(date){const AU=149597870.7,earthR=6378.137,sunR=695700,moonR=1737.4,m=Astronomy.GeoVector('Moon',date,true),s=Astronomy.GeoVector('Sun',date,true),md=Math.hypot(m.x,m.y,m.z),sd=Math.hypot(s.x,s.y,s.z),dot=-(m.x*s.x+m.y*s.y+m.z*s.z)/(md*sd),separation=Math.acos(Math.max(-1,Math.min(1,dot)))*180/Math.PI,moonDistance=md*AU,sunDistance=sd*AU,angular=n=>Math.asin(n/moonDistance)*180/Math.PI;return{separation,moonRadius:angular(moonR),umbraRadius:angular(earthR-moonDistance*(sunR-earthR)/sunDistance),penumbraRadius:angular(earthR+moonDistance*(sunR+earthR)/sunDistance)}}
function drawSolarObserver(c,w,h,time){
  const loc=CalendarCore.location,date=new Date(time),sun=observerBody('Sun',date,loc,695700),moon=observerBody('Moon',date,loc,1737.4),rad=Math.PI/180,azDelta=((moon.az-sun.az+540)%360)-180,dx=azDelta*Math.cos((sun.alt+moon.alt)*.5*rad),dy=moon.alt-sun.alt,cosSep=Math.sin(sun.alt*rad)*Math.sin(moon.alt*rad)+Math.cos(sun.alt*rad)*Math.cos(moon.alt*rad)*Math.cos(azDelta*rad),separation=Math.acos(Math.max(-1,Math.min(1,cosSep)))/rad,spanX=Math.abs(dx)+sun.radius+moon.radius+.18,spanY=Math.abs(dy)+sun.radius+moon.radius+.48,maxScale=Math.min(w,h)*.42/.56,scale=Math.min((w-42)/Math.max(.95,spanX),(h-58)/Math.max(1.05,spanY),maxScale),cx=w*.5-dx*scale*.5,cy=h*.5+dy*scale*.5,sunR=sun.radius*scale,moonR=moon.radius*scale,mx=cx+dx*scale,my=cy-dy*scale,daylight=sun.alt>-.833,edgeGap=Math.max(0,separation-sun.radius-moon.radius);
  const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,daylight?'#245f8a':'#030914');sky.addColorStop(1,daylight?'#79b8d3':'#13263b');c.fillStyle=sky;c.fillRect(0,0,w,h);
  c.save();c.shadowColor='#ffd46f';c.shadowBlur=28;drawOrb(c,cx,cy,sunR,'#fffbd0','#f0ad38');c.restore();drawOrb(c,mx,my,moonR,'#67737c','#111923');
  c.strokeStyle='rgba(255,255,255,.28)';c.setLineDash([4,6]);c.beginPath();c.moveTo(cx,cy);c.lineTo(mx,my);c.stroke();c.setLineDash([]);
  c.strokeStyle='rgba(225,241,250,.7)';c.lineWidth=2;c.beginPath();c.moveTo(20,h-24);c.lineTo(20+.5*scale,h-24);c.stroke();eclipseLabel(c,'٠٫٥°',20+.25*scale,h-31,'rgba(225,241,250,.72)');
  eclipseLabel(c,'منظر سماوي من موقعك • المقياس الزاوي محفوظ',w/2,28,'rgba(225,241,250,.8)');
  if(!daylight){c.fillStyle='rgba(3,9,20,.7)';c.fillRect(0,h-48,w,48);eclipseLabel(c,'الشمس تحت الأفق في هذا الوقت',w/2,h-20,'#f6c85f')}
  return{alt:sun.alt,separation,obscuration:circleOverlap(sun.radius,moon.radius,separation),edgeGap,daylight};
}
function lunarShadowOffset(event,time,moonR,penumbraR){const reach=penumbraR+moonR,progress=(time-event.peakAt)/Math.max(event.peakAt-event.startAt,event.endAt-event.peakAt),peakOffset=event.kind==='total'?moonR*.25:event.kind==='partial'?Math.max(0,moonR*2.65+moonR-2*moonR*(event.obscuration||.5)):Math.max(moonR*2.7,penumbraR+moonR-2*moonR*(event.obscuration||.5));return{x:progress*Math.sqrt(Math.max(0,reach*reach-peakOffset*peakOffset)),y:peakOffset}}
function drawLunarObserver(c,w,h,time){
  const loc=CalendarCore.location,date=new Date(time),moon=observerBody('Moon',date,loc,1737.4),shadow=lunarShadowGeometry(date),peakShadow=lunarShadowGeometry(new Date(eclipseEvent.peakAt)),scale=Math.min(w,h)*.39/(shadow.penumbraRadius+shadow.moonRadius),r=shadow.moonRadius*scale,umbraR=shadow.umbraRadius*scale,penumbraR=shadow.penumbraRadius*scale,centerX=w*.5,centerY=h*.52,pathX=Math.sign(time-eclipseEvent.peakAt)*Math.sqrt(Math.max(0,shadow.separation*shadow.separation-peakShadow.separation*peakShadow.separation))*scale,mx=centerX+pathX,my=centerY-peakShadow.separation*scale;
  c.fillStyle='#030914';c.fillRect(0,0,w,h);for(let i=0;i<65;i++){c.fillStyle=`rgba(220,240,255,${.15+(i%5)*.07})`;c.fillRect((i*89)%w,(i*47)%h,1,1)}
  c.fillStyle='rgba(122,95,139,.12)';c.beginPath();c.arc(centerX,centerY,penumbraR,0,Math.PI*2);c.fill();c.strokeStyle='rgba(166,130,187,.45)';c.stroke();
  c.fillStyle='rgba(24,8,18,.76)';c.beginPath();c.arc(centerX,centerY,umbraR,0,Math.PI*2);c.fill();c.strokeStyle='rgba(172,88,83,.55)';c.stroke();
  drawOrb(c,mx,my,r,'#f0f1e8','#777e84');c.save();c.beginPath();c.arc(mx,my,r,0,Math.PI*2);c.clip();c.fillStyle='rgba(96,68,112,.34)';c.beginPath();c.arc(centerX,centerY,penumbraR,0,Math.PI*2);c.fill();c.fillStyle='rgba(66,18,25,.82)';c.beginPath();c.arc(centerX,centerY,umbraR,0,Math.PI*2);c.fill();c.restore();
  eclipseLabel(c,'شبه الظل',centerX,Math.max(42,centerY-penumbraR+18),'#b99bc9');eclipseLabel(c,'الظل التام',centerX,centerY-umbraR+18,'#d88a78');eclipseLabel(c,'مقطع ظلي مكبّر كما يُرى باتجاه القمر',w/2,28);
  if(moon.alt<-.25){c.fillStyle='rgba(3,9,20,.72)';c.fillRect(0,h-48,w,48);eclipseLabel(c,'القمر تحت الأفق في هذا الوقت',w/2,h-20,'#f6c85f')}
  return{alt:moon.alt,separation:shadow.separation,umbraRadius:shadow.umbraRadius,moonRadius:shadow.moonRadius};
}
function drawEclipseSpace(c,w,h,v){
  const sunX=w*.12,centerY=h*.52,sunR=Math.min(w,h)*.105,earthR=Math.min(w,h)*.068,moonR=Math.min(w,h)*.029;c.fillStyle='#030914';c.fillRect(0,0,w,h);for(let i=0;i<70;i++){c.fillStyle=`rgba(220,240,255,${.16+(i%5)*.07})`;c.fillRect((i*89)%w,(i*47)%h,1,1)}c.save();c.shadowColor='#f6c85f';c.shadowBlur=38;drawOrb(c,sunX,centerY,sunR,'#fff5a6','#e8992e');c.restore();
  if(eclipseEvent.type==='solar'){
    const moonX=w*.51,earthX=w*.84,miss=Math.min(earthR*1.55,(eclipseEvent.shadowAxisDistanceKm||0)/6378*earthR),moonY=centerY+miss+(v-.5)*h*.48,far=w*.98;
    eclipsePolygon(c,[[moonX,moonY-moonR],[far,moonY-moonR*3.5],[far,moonY+moonR*3.5],[moonX,moonY+moonR]],'rgba(139,107,157,.16)');
    const annular=eclipseEvent.kind==='annular',hybrid=eclipseEvent.kind==='hybrid',apex=annular?w*.70:hybrid?earthX:w*.96;eclipsePolygon(c,[[moonX,moonY-moonR*.58],[apex,moonY],[moonX,moonY+moonR*.58]],'rgba(23,8,30,.72)');
    if(annular||hybrid)eclipsePolygon(c,[[apex,moonY],[far,moonY-moonR*.8],[far,moonY+moonR*.8]],'rgba(80,42,83,.5)');
    c.strokeStyle='rgba(205,179,218,.4)';c.setLineDash([5,6]);c.beginPath();c.moveTo(moonX,moonY);c.lineTo(far,moonY);c.stroke();c.setLineDash([]);drawOrb(c,earthX,centerY,earthR,'#65c3ee','#173b69');drawOrb(c,moonX,moonY,moonR,'#edf2f4','#64717a');
    eclipseLabel(c,'شبه الظل',w*.76,moonY-moonR*2.25,'#b99bc9');eclipseLabel(c,annular?'الظل العكسي':hybrid?'حد الظل والظل العكسي':'الظل التام',w*.70,moonY+22,annular||hybrid?'#c69aca':'#a981b4');eclipseLabel(c,'القمر',moonX,moonY+moonR+18);eclipseLabel(c,'الأرض',earthX,centerY+earthR+20);
  }else{
    const earthX=w*.45,moonX=w*.85,umbraEnd=w*1.15,penumbraTop=centerY-earthR*2.9,penumbraBottom=centerY+earthR*2.9,umbraAtMoon=earthR*.62,offset=lunarShadowOffset(eclipseEvent,eclipseEvent.startAt+(eclipseEvent.endAt-eclipseEvent.startAt)*v,moonR,earthR*1.25),moonY=centerY-offset.y*.85+offset.x*.38;
    eclipsePolygon(c,[[earthX,centerY-earthR],[w,penumbraTop],[w,penumbraBottom],[earthX,centerY+earthR]],'rgba(139,107,157,.16)');eclipsePolygon(c,[[earthX,centerY-earthR*.72],[umbraEnd,centerY],[earthX,centerY+earthR*.72]],'rgba(22,7,27,.7)');
    drawOrb(c,earthX,centerY,earthR,'#65c3ee','#173b69');drawOrb(c,moonX,moonY,moonR,'#df9b7f','#5d2932');eclipseLabel(c,'شبه ظل الأرض',w*.73,penumbraTop+24,'#b99bc9');eclipseLabel(c,'ظل الأرض التام',w*.72,centerY+umbraAtMoon+26,'#d88a78');eclipseLabel(c,'الأرض',earthX,centerY+earthR+20);eclipseLabel(c,'القمر',moonX,moonY+moonR+18);
  }
  eclipseLabel(c,'رسم هندسي غير مقياسي',w/2,27,'rgba(225,241,250,.68)');eclipseLabel(c,'الشمس',sunX,centerY+sunR+22);
}
function drawEclipse(time){
  if(!Number.isFinite(time))time=eclipseEvent.startAt+(eclipseEvent.endAt-eclipseEvent.startAt)*Number(eclipseTime.value)/100;
  const rect=eclipseCanvas.getBoundingClientRect();if(!rect.width||!rect.height)return null;const dpr=Math.min(devicePixelRatio||1,2);eclipseCanvas.width=rect.width*dpr;eclipseCanvas.height=rect.height*dpr;eclipseCtx.setTransform(dpr,0,0,dpr,0,0);const c=eclipseCtx,w=rect.width,h=rect.height,v=+eclipseTime.value/100;c.clearRect(0,0,w,h);c.direction='rtl';
  setEclipseLegend();if(eclipseView==='observer')return eclipseEvent.type==='solar'?drawSolarObserver(c,w,h,time):drawLunarObserver(c,w,h,time);drawEclipseSpace(c,w,h,v);return null;
}
function updateEclipse(){
  const t=eclipseEvent.startAt+(eclipseEvent.endAt-eclipseEvent.startAt)*Number(eclipseTime.value)/100,diff=Math.round((t-eclipseEvent.peakAt)/60000),geometry=drawEclipse(t),percent=n=>arDigits((n*100).toFixed(1).replace('.','٫'))+'٪',deg=n=>arDigits(n.toFixed(3).replace('.','٫'))+'°';document.getElementById('eclipseClock').textContent=CalendarCore.clock(new Date(t),true);document.getElementById('eclipseMoment').textContent=diff===0?(eclipseEvent.type==='solar'&&!eclipseEvent.local?'عند الذروة العالمية':'عند الذروة'):(diff<0?'قبل الذروة بـ ':'بعد الذروة بـ ')+arDigits(Math.abs(diff))+' دقيقة';
  eclipsePhase.classList.remove('not-local','below-horizon');let phase=eclipsePhaseAt(eclipseEvent,t);if(eclipseView==='observer'&&eclipseEvent.type==='solar'&&!eclipseEvent.local){phase='لا يحدث كسوف من موقعك';eclipsePhase.classList.add('not-local')}else if(eclipseView==='observer'&&geometry&&geometry.alt<-.25){phase=(eclipseEvent.type==='solar'?'الشمس':'القمر')+' تحت الأفق من موقعك';eclipsePhase.classList.add('below-horizon')}eclipsePhase.textContent=phase;
  const m1=document.getElementById('eclipseMetric1'),m2=document.getElementById('eclipseMetric2'),m3=document.getElementById('eclipseMetric3');if(eclipseView==='observer'&&geometry){m1.textContent=(eclipseEvent.type==='solar'?'ارتفاع الشمس: ':'ارتفاع القمر: ')+arDigits(geometry.alt.toFixed(1).replace('.','٫'))+'°';m2.textContent=eclipseEvent.type==='solar'?'الفصل بين مركزي القرصين: '+deg(geometry.separation):'بعد القمر عن مركز ظل الأرض: '+deg(geometry.separation);m3.textContent=eclipseEvent.type==='solar'?(!eclipseEvent.local?'لا يوجد تداخل محلي؛ الفاصل بين الحافتين: '+deg(geometry.edgeGap):'احتجاب قرص الشمس الآن: '+percent(geometry.obscuration)):'المرحلة: '+phase}else{m1.textContent=eclipseEvent.type==='solar'?'المحاذاة: الشمس — القمر — الأرض':'المحاذاة: الشمس — الأرض — القمر';m2.textContent=eclipseEvent.type==='solar'?(eclipseEvent.kind==='annular'?'الظل العكسي يصل إلى الأرض':eclipseEvent.kind==='partial'?'شبه الظل يعبر الأرض ومحور الظل يفوتها':eclipseEvent.kind==='hybrid'?'يتبدل المسار بين الظل التام والعكسي':'الظل التام يصل إلى الأرض'):'القمر يعبر شبه ظل الأرض أو ظلها التام';m3.textContent='رسم هندسي توضيحي؛ الأحجام والمسافات غير مقياسية'}
}
eclipseTime.addEventListener('input',updateEclipse);let eclipseTimer;document.getElementById('eclipsePlay').addEventListener('click',e=>{if(eclipseTimer){clearInterval(eclipseTimer);eclipseTimer=null;e.currentTarget.textContent='▶'}else{e.currentTarget.textContent='Ⅱ';eclipseTimer=setInterval(()=>{eclipseTime.value=(+eclipseTime.value+1)%101;updateEclipse()},75)}});addEventListener('resize',drawEclipse);renderEclipseEvents();updateEclipse();

const heritageSystems={
  arabic:{label:'النظام العربي والإسلامي',symbol:'✦',native:'الثُّرَيَّا • al-Thurayyā',name:'الثريا',meaning:'اسم عربي لنجوم كثيرة متقاربة، ويقابلها عنقود الثريا النجمي.',modern:'عنقود الثريا M45',phenomenon:'ارتبط طلوعها الشروقي عند العرب بتحولات موسمية وأنواء تختلف باختلاف المنطقة.',evidence:'ملاحظة موسمية تاريخية • لا تعني تأثير النجم في الطقس'},
  egyptian:{label:'النظام المصري القديم',symbol:'𓇼',native:'سوبدت • Spdt',name:'سوبدت',meaning:'اسم مصري قديم للشعرى اليمانية، وصُوّرت في تقاليد مصرية بهيئة إلهة.',modern:'الشعرى اليمانية • Sirius',phenomenon:'تزامن طلوعها الشروقي تاريخيًا مع مطلع السنة وموسم فيضان النيل في عصور محددة.',evidence:'ارتباط تاريخي موثق • تغير موعده النسبي عبر العصور'},
  chinese:{label:'النظام الصيني',symbol:'昴',native:'昴宿 • Mǎo Xiù',name:'منزلة ماو',meaning:'إحدى المنازل الصينية الثماني والعشرين، ويرتبط اسمها بصورة الرأس ذي الشعر.',modern:'عنقود الثريا ضمن الثور',phenomenon:'استُخدمت المنازل القمرية لتعيين موضع القمر وتنظيم الرصد والتقويم.',evidence:'تقليد فلكي تاريخي • المقابل الحديث تقريبي الحدود'},
  indian:{label:'النظام الهندي',symbol:'रो',native:'रोहिणी • Rohiṇī',name:'روهيني',meaning:'اسم سنسكريتي يرتبط بالحمرة والنمو، وهي من أشهر منازل القمر الهندية.',modern:'منطقة حول الدبران • Aldebaran',phenomenon:'يدخل موضع القمر في روهيني ضمن عناصر البانشانغا وتحديد التوقيت التقليدي.',evidence:'نظام تقويمي تاريخي • لا يثبت أحكامًا تنجيمية'},
  maya:{label:'نظام المايا',symbol:'✣',native:'Tzab • تزّاب',name:'الثريا عند المايا',meaning:'اسم منقول من تقاليد المايا اليوكاتية لعنقود الثريا، مع اختلاف النقل والتهجئة.',modern:'عنقود الثريا M45',phenomenon:'دخلت دورات الشمس والقمر والزهرة ونجوم لامعة في الرصد والتقويم والطقوس.',evidence:'شواهد أثرية ونصية • بعض التفاصيل موضع بحث'},
  aztec:{label:'نظام الأزتك والناهوا',symbol:'✺',native:'Tiānquiztli • تيانكيزتلي',name:'السوق السماوي',meaning:'اسم ناهواتلي للثريا يعني السوق أو موضع الاجتماع، تشبيهًا بازدحام نجومها.',modern:'عنقود الثريا M45',phenomenon:'رُصد عبورها قرب كبد السماء في طقس النار الجديدة عند اكتمال دورة ٥٢ سنة.',evidence:'موثق تاريخيًا • يعرض بوصفه سياقًا ثقافيًا'},
  inca:{label:'نظام الإنكا والأنديز',symbol:'◇',native:'Yacana • ياكانا',name:'اللاما السماوية',meaning:'كوكبة مظلمة تُرى في سحب الغبار داخل درب التبانة على هيئة لاما.',modern:'سحب مظلمة قرب كيس الفحم والمجرة',phenomenon:'ارتبط ظهور كوكبات درب التبانة المظلمة بالمطر والرعي والدورات الزراعية في الأنديز.',evidence:'توثيق إثنوغرافي • الأسماء والحدود محلية'},
  africa:{label:'تقاليد إفريقيا جنوب الصحراء',symbol:'✧',native:'Selemela • سِليميلا',name:'نجوم موسم الحرث',meaning:'اسم إقليمي للثريا في تقاليد من جنوب القارة، ويرتبط لغويًا وموسميًا بالزراعة.',modern:'عنقود الثريا M45',phenomenon:'استُخدم ظهور الثريا علامة لاقتراب أعمال زراعية موسمية في بعض المجتمعات.',evidence:'تقاليد شفهية وإقليمية • لا يجوز تعميمها على القارة'}
};

const heritageEntries=[
  {system:'arabic',group:'arabic',civ:'العربية والإسلامية',glyph:'✦',name:'الثريا',native:'الثُّرَيَّا • al-Thurayyā',kind:'عنقود نجمي',meaning:'اسم يدل على اجتماع نجوم صغيرة كثيرة متقاربة.',modern:'عنقود نجمي مفتوح M45 في كوكبة الثور.',phenomenon:'استُخدم طلوعها وغروبها علامة موسمية للأنواء والزراعة والسفر.',interpretation:'التزامن سببه ثبات موعد ظهورها النسبي في السنة، ولا يثبت تأثيرًا سببيًا في المطر.',evidence:'موثق تاريخيًا'},
  {system:'arabic',group:'arabic',civ:'العربية والإسلامية',glyph:'★',name:'سهيل',native:'سُهَيْل • Suhayl',kind:'نجم',meaning:'اسم عربي قديم؛ وصيغة التصغير قد تحمل معنى السهل أو اللين.',modern:'نجم كانوبس • Canopus',phenomenon:'كان ظهوره قبيل الفجر علامة موسمية بارزة في الجزيرة العربية والخليج.',interpretation:'موعد ظهوره يتغير مع خط العرض والأفق والعصر، لذلك يختلف التقويم الشعبي محليًا.',evidence:'موثق تاريخيًا'},
  {system:'egyptian',group:'egyptian',civ:'مصر القديمة',glyph:'𓇼',name:'سوبدت',native:'Spdt • سوبدت',kind:'نجم وتقويم',meaning:'الاسم المصري القديم المرتبط بالشعرى اليمانية.',modern:'الشعرى اليمانية • Sirius',phenomenon:'اقترن طلوعها الشروقي بمطلع السنة وموسم النيل في حقب تاريخية.',interpretation:'السبق الاعتدالي والتقويم المدني يغيّران المطابقة الدقيقة عبر القرون.',evidence:'موثق نصيًا'},
  {system:'egyptian',group:'egyptian',civ:'مصر القديمة',glyph:'⌁',name:'ساح',native:'Sꜣḥ • ساح',kind:'كوكبة',meaning:'شخصية سماوية مصرية اقترنت في نصوص لاحقة بأوزيريس.',modern:'منطقة كوكبة الجبار • Orion',phenomenon:'دخلت نجومه ضمن قياس الليل والعشريات والرمزية الجنائزية.',interpretation:'المقابلة مع حدود كوكبة الجبار الحديثة تقريبية وليست تطابقًا حدّيًا.',evidence:'موثق تاريخيًا'},
  {system:'chinese',group:'chinese',civ:'الصينية',glyph:'狼',name:'تيان لانغ',native:'天狼 • Tiānláng',kind:'نجم',meaning:'الذئب السماوي.',modern:'الشعرى اليمانية • Sirius',phenomenon:'جزء من نظام الصور النجمية الصينية ومراجع الرصد الإمبراطوري.',interpretation:'الاسم صورة ثقافية مستقلة عن اسم الكوكبة الغربي الحديث.',evidence:'موثق فلكيًا'},
  {system:'chinese',group:'chinese',civ:'الصينية',glyph:'斗',name:'بيدو',native:'北斗 • Běidǒu',kind:'كوكبة نجمية',meaning:'المغرفة الشمالية.',modern:'النجوم السبعة البارزة من الدب الأكبر',phenomenon:'استُخدمت للدلالة على الاتجاه والمواسم وقياس دوران السماء.',interpretation:'اتجاه مقبضها في ساعات ومواسم مختلفة نتيجة دوران الأرض ومدارها.',evidence:'موثق تاريخيًا'},
  {system:'indian',group:'indian',civ:'الهندية',glyph:'रो',name:'روهيني',native:'रोहिणी • Rohiṇī',kind:'ناكشاترا',meaning:'الحمراء أو النامية.',modern:'منطقة حول الدبران في الثور',phenomenon:'منزلة قمرية مستخدمة في البانشانغا.',interpretation:'هي تقسيم تقويمي/فلكي تاريخي؛ الأحكام التنجيمية معتقد ثقافي.',evidence:'موثق تقويميًا'},
  {system:'indian',group:'indian',civ:'الهندية',glyph:'कृ',name:'كريتيكا',native:'कृत्तिका • Kṛttikā',kind:'ناكشاترا',meaning:'القاطعات أو السكاكين، وترتبط بصورة جماعة نجمية.',modern:'عنقود الثريا M45',phenomenon:'استُخدمت منزلة للقمر ومرجعًا في تقاويم هندية قديمة.',interpretation:'موضع بدايات القوائم تغير بين المدارس والعصور.',evidence:'موثق تاريخيًا'},
  {system:'maya',group:'americas',civ:'المايا',glyph:'✣',name:'تزّاب',native:'Tzab • تزّاب',kind:'عنقود نجمي',meaning:'اسم يوكاتي منقول للثريا؛ تختلف كتابته في المراجع الحديثة.',modern:'عنقود الثريا M45',phenomenon:'ارتبط رصد نجوم ودورات كوكبية بالسنة والطقوس في مجتمعات المايا.',interpretation:'لا تعمم قراءة موقع أثري واحد على جميع مناطق المايا وعصورهم.',evidence:'توثيق متفاوت'},
  {system:'aztec',group:'americas',civ:'الأزتك والناهوا',glyph:'✺',name:'تيانكيزتلي',native:'Tiānquiztli',kind:'عنقود نجمي',meaning:'السوق أو موضع الاجتماع.',modern:'عنقود الثريا M45',phenomenon:'رُصدت في سياق طقس النار الجديدة ودورة ٥٢ سنة.',interpretation:'المشهد يعيد تمثيل الرصد التاريخي ولا يعيد إنشاء المعتقد كحقيقة علمية.',evidence:'موثق تاريخيًا'},
  {system:'inca',group:'americas',civ:'الإنكا والأنديز',glyph:'◇',name:'ياكانا',native:'Yacana • ياكانا',kind:'كوكبة مظلمة',meaning:'اللاما.',modern:'سحب غبار مظلمة في درب التبانة',phenomenon:'ظهر شكلها في موسم يرتبط بالأمطار والرعي في بعض تقاليد الأنديز.',interpretation:'تُرى من الفراغات المعتمة لا من وصل نجوم لامعة؛ حدودها محلية.',evidence:'موثق إثنوغرافيًا'},
  {system:'inca',group:'americas',civ:'الإنكا والأنديز',glyph:'⌇',name:'ماتشاكواي',native:'Mach’acuay',kind:'كوكبة مظلمة',meaning:'الأفعى.',modern:'قطاع مظلم من درب التبانة',phenomenon:'ارتبطت بالدورة الموسمية والحيوانات في تقاليد الأنديز.',interpretation:'النقل الصوتي والتحديد السماوي يختلفان بين الباحثين والمناطق.',evidence:'توثيق متفاوت'},
  {system:'africa',group:'africa',civ:'جنوب القارة الإفريقية',glyph:'✧',name:'سِليميلا',native:'Selemela',kind:'عنقود وموسم',meaning:'اسم إقليمي للثريا مرتبط بموسم العمل الزراعي.',modern:'عنقود الثريا M45',phenomenon:'كان ظهورها علامة لبدء أو توقع أعمال زراعية في تقاليد محلية.',interpretation:'إفريقيا متعددة اللغات والتقاليد؛ لا يمثل الاسم نظامًا قاريًا واحدًا.',evidence:'روايات إقليمية'}
];

const heritageCatalogs={
  zodiac:[['الحمل','الكبش • Aries'],['الثور','الثور • Taurus'],['الجوزاء','التوأمان • Gemini'],['السرطان','السلطعون • Cancer'],['الأسد','الأسد • Leo'],['السنبلة','العذراء/سنبلة القمح • Virgo'],['الميزان','كفتا الميزان • Libra'],['العقرب','العقرب • Scorpius'],['القوس','الرامي • Sagittarius'],['الجدي','جدي البحر • Capricornus'],['الدلو','حامل الماء • Aquarius'],['الحوت','السمكتان • Pisces']],
  rashi:[['ميشا • Meṣa','الكبش'],['فريشابها • Vṛṣabha','الثور'],['ميثونا • Mithuna','الزوج/التوأمان'],['كاركا • Karka','السرطان'],['سيمها • Siṃha','الأسد'],['كانيا • Kanyā','العذراء'],['تولا • Tulā','الميزان'],['فريششيكا • Vṛścika','العقرب'],['دانوس • Dhanus','القوس'],['ماكارا • Makara','مخلوق مائي/الجدي'],['كومبها • Kumbha','الجرة'],['مينا • Mīna','السمكتان']],
  nakshatra:[['أشفيني • Aśvinī','الفرسان/التوأمان الطبيبان'],['بهاراني • Bharanī','الحاملة'],['كريتيكا • Kṛttikā','القاطعات'],['روهيني • Rohiṇī','الحمراء/النامية'],['مريغاشيرشا • Mṛgaśīrṣa','رأس الغزال'],['أردرا • Ārdrā','الرطبة'],['بونارفاسو • Punarvasu','عودة النور'],['بوشيا • Puṣya','المغذية'],['أشليشا • Āśleṣā','المعانقة'],['ماغها • Maghā','العظيمة'],['بورفا فالغوني','فالغوني الأولى'],['أوتارا فالغوني','فالغوني التالية'],['هاستا • Hasta','اليد'],['تشيترا • Citrā','اللامعة'],['سفاتي • Svātī','المستقلة'],['فيشاخا • Viśākhā','ذات الفروع'],['أنورادها • Anurādhā','التالية لرادها'],['جييشثا • Jyeṣṭhā','الكبرى'],['مولا • Mūla','الجذر'],['بورفا أشادا','التي لا تُقهر الأولى'],['أوتارا أشادا','التي لا تُقهر التالية'],['شرافانا • Śravaṇa','السماع'],['دهانيشثا • Dhaniṣṭhā','الأغنى/الطبل'],['شاتابهيشا','مئة معالج'],['بورفا بهادرابادا','القدم المباركة الأولى'],['أوتارا بهادرابادا','القدم المباركة التالية'],['ريفاتي • Revatī','المزدهرة'],['أبهيجيت • Abhijit','المنتصرة • منزلة إضافية']],
  xiu:[['جياو • 角','القرن'],['كانغ • 亢','العنق'],['دي • 氐','الجذر'],['فانغ • 房','الحجرة'],['شين • 心','القلب'],['وي • 尾','الذيل'],['جي • 箕','الغربال'],['دو • 斗','المغرفة'],['نيو • 牛','الثور'],['نو • 女','الفتاة'],['شو • 虛','الفراغ'],['وي • 危','الخطر'],['شي • 室','المعسكر'],['بي • 壁','الجدار'],['كوي • 奎','الساقان'],['لو • 婁','الرابطة'],['وي • 胃','المعدة'],['ماو • 昴','الرأس ذو الشعر'],['بي • 畢','الشبكة'],['تسي • 觜','منقار السلحفاة'],['شِن • 參','النجوم الثلاثة'],['جينغ • 井','البئر'],['غوي • 鬼','الشبح'],['ليو • 柳','الصفصاف'],['شينغ • 星','النجم'],['جانغ • 張','الشبكة الممدودة'],['يي • 翼','الجناحان'],['جِن • 軫','العربة']],
  afroamerica:[['سوبدت • مصر','الشعرى اليمانية وبداية موسمية'],['ساح • مصر','منطقة الجبار'],['مسختيو • مصر','الساق الأمامية/الدب الأكبر'],['سِليميلا • جنوب إفريقيا','الثريا وموسم الزراعة'],['تزّاب • المايا','الثريا'],['تيانكيزتلي • الأزتك','السوق/الثريا'],['ممالهوازتلي • ناهوا','عصي إشعال النار/نجوم قرب الجبار'],['ياكانا • الإنكا','اللاما المظلمة'],['ماتشاكواي • الإنكا','الأفعى المظلمة'],['هانباتو • الأنديز','العلجوم المظلم'],['أتوق • الأنديز','الثعلب المظلم'],['إيما • غواراني','الريا المظلمة في درب التبانة']]
};

const civilizationData={
  arabic:{region:'العالم العربي والإسلامي',title:'سماء الأنواء ومنازل القمر',orbit:'الثريا',description:'استُخدمت النجوم في معرفة الاتجاهات والفصول ومواسم السفر والزراعة، مع نظام منازل القمر الثمانية والعشرين.',tags:['٢٨ منزلة','تقويم قمري','ملاحة','زراعة'],calendar:'هجري قمري وتقويمات موسمية محلية',division:'منازل القمر والبروج وصور النجوم',rising:'الطلوع الشروقي والأنواء',stars:'الثريا، سهيل، الدبران، الشعرى',observations:'اتجاهات، مواسم، سفر وزراعة',context:'فلك رصدي وموروث موسمي؛ يفصل التطبيق بينهما وبين التنجيم.'},
  egyptian:{region:'مصر القديمة',title:'العشريات وسماء النيل',orbit:'سوبدت',description:'ربط المصريون تقويمهم المدني بالعشريات وراقبوا طلوع سوبدت ضمن سياق النيل والسنة الجديدة.',tags:['٣٦ عشرية','تقويم شمسي','النيل','قياس الليل'],calendar:'مدني ٣٦٥ يومًا مع خمسة أيام مضافة',division:'عشريات وصور نجمية',rising:'طلوع سوبدت الشروقي',stars:'سوبدت، ساح، مسختيو',observations:'مطلع السنة، مواسم النيل، ساعات الليل',context:'مصادر نصية وأثرية؛ المطابقات الحديثة لبعض الصور تقريبية.'},
  chinese:{region:'الصين وشرق آسيا',title:'المنازل الثمانية والعشرون',orbit:'بيدو',description:'نظام واسع يقسم مسار القمر إلى ٢٨ منزلة، مع الأسوار الثلاثة وصور نجمية مستقلة.',tags:['٢٨ منزلًا','شمسي قمري','٢٤ حدًا شمسيًا','رصد إمبراطوري'],calendar:'شمسي قمري مع ٢٤ حدًا شمسيًا',division:'٢٨ منزلًا والأسوار الثلاثة',rising:'مرور القمر والنجوم المرجعية',stars:'بيدو، تيان لانغ، فيغا وألتير بأسماء محلية',observations:'تقويم، اتجاه، مواسم وتسجيل ظواهر',context:'نظام مستقل؛ لا يطابق البروج الغربية خانة بخانة.'},
  indian:{region:'شبه القارة الهندية',title:'الناكشاترا والبانشانغا',orbit:'روهيني',description:'تجمع التقاليد الهندية بين منازل القمر وتقسيمات راشي وعناصر زمنية متعددة ضمن تقاويم إقليمية.',tags:['٢٧/٢٨ ناكشاترا','١٢ راشي','شمسي قمري','بانشانغا'],calendar:'تقاويم شمسية قمرية وشمسية إقليمية',division:'ناكشاترا وراشي',rising:'موضع القمر والشمس بالنسبة للمنازل',stars:'روهيني، كريتيكا، أغاستيا',observations:'حساب اليوم والشهر والمواسم',context:'يعرض الحساب التقويمي منفصلًا عن الأحكام التنجيمية.'},
  maya:{region:'المايا وأمريكا الوسطى',title:'دورات متداخلة ورصد دقيق',orbit:'تزّاب',description:'تداخل تزولكين وهاب والعد الطويل مع رصد الشمس والقمر والزهرة في مدن وعصور متعددة.',tags:['٢٦٠ يومًا','٣٦٥ يومًا','العد الطويل','الزهرة'],calendar:'تزولكين وهاب والعد الطويل',division:'دورات عددية واتجاهات ومراصد معمارية',rising:'شروق وغروب الشمس والزهرة ونجوم مختارة',stars:'الثريا وأجرام ساطعة بأسماء محلية',observations:'انقلابات، زراعة، طقوس ودورات كوكبية',context:'تقاليد متعددة؛ لا تعمم قراءة مدينة واحدة على عالم المايا كله.'},
  aztec:{region:'الأزتك والناهوا',title:'دورة النار الجديدة',orbit:'تيانكيزتلي',description:'تلتقي دورة ٢٦٠ يومًا مع السنة ٣٦٥ يومًا بعد ٥٢ سنة، وارتبطت بطقس النار الجديدة.',tags:['٢٦٠ يومًا','٣٦٥ يومًا','٥٢ سنة','الثريا'],calendar:'تونالبوالّي وشيوهبوالّي',division:'أيام وأشهر ودورات طقسية',rising:'عبور الثريا قرب كبد السماء',stars:'تيانكيزتلي، ممالهوازتلي',observations:'إكمال الدورة وتقويم الاحتفالات',context:'سياق تاريخي وطقسي، لا علاقة له بالتنبؤ العلمي الحديث.'},
  inca:{region:'الإنكا والأنديز',title:'السماء المضيئة والمظلمة',orbit:'ياكانا',description:'قرأ أهل الأنديز النجوم اللامعة وسحب الغبار المظلمة في درب التبانة، وربطوها بالمطر والرعي والزراعة.',tags:['كوكبات مظلمة','مراصد أفقية','زراعة','مطر'],calendar:'إعادة بناء لتقويم شمسي قمري',division:'كوكبات مظلمة وعلامات أفقية',rising:'مواضع الشمس وظهور درب التبانة',stars:'ياكانا، ماتشاكواي، أتوق',observations:'أمطار، رعي ودورات زراعية',context:'مصادر استعمارية وإثنوغرافية؛ التوثيق غير متساوٍ.'},
  africa:{region:'إفريقيا جنوب الصحراء',title:'تقاويم محلية متعددة',orbit:'سِليميلا',description:'مئات التقاليد اللغوية ربطت الشمس والقمر ونجومًا مختارة بالمطر والزراعة والرعي والملاحة.',tags:['تقاليد شفهية','زراعة','رعي','تنوع محلي'],calendar:'تقاويم قمرية وشمسية وموسمية محلية',division:'أسماء نجمية تختلف بحسب المجتمع',rising:'طلوع الثريا ونجوم موسمية في أمثلة إقليمية',stars:'سِليميلا وأسماء محلية متعددة',observations:'مطر، حرث، رعي وملاحة',context:'لا يوجد نظام إفريقي واحد؛ يعرض التطبيق المصدر والمنطقة لكل اسم.'}
};

const heritageCanvas=document.getElementById('heritageCanvas'),heritageCtx=heritageCanvas.getContext('2d'),heritageTime=document.getElementById('heritageTime');let heritageLayer='horizon',heritageTimer;
function formatHeritageYear(year){const y=+year;if(y<0)return`${arDigits(Math.abs(y))} ق.م`;if(y===0)return'بداية الميلاد';return`${arDigits(y)}م`}
function drawHeritage(){
  const rect=heritageCanvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const dpr=Math.min(devicePixelRatio||1,2),w=rect.width,h=rect.height,c=heritageCtx;heritageCanvas.width=w*dpr;heritageCanvas.height=h*dpr;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
  const sky=c.createRadialGradient(w*.5,h*.43,4,w*.5,h*.48,w*.7);sky.addColorStop(0,'#173f68');sky.addColorStop(.55,'#091b30');sky.addColorStop(1,'#030914');c.fillStyle=sky;c.fillRect(0,0,w,h);
  const phase=(+heritageTime.value/1440)*Math.PI*2,cx=w*.5,cy=h*.72,rx=w*.46,ry=h*.48;c.save();c.beginPath();c.ellipse(cx,cy,rx,ry,0,Math.PI,Math.PI*2);c.clip();
  starSeed.forEach((s,i)=>{const a=s.x*Math.PI*2+phase,ring=.18+s.y*.82,x=cx+Math.cos(a)*rx*ring,y=cy-Math.abs(Math.sin(a))*ry*(.28+.72*ring);c.beginPath();c.arc(x,y,s.r+(i%13===0?1.2:0),0,Math.PI*2);c.fillStyle=i%13===0?'rgba(246,200,95,.9)':`rgba(220,242,255,${Math.min(.9,s.a)})`;c.fill()});
  c.strokeStyle='rgba(85,216,242,.16)';c.lineWidth=1;for(let i=1;i<5;i++){c.beginPath();c.ellipse(cx,cy,rx*i/5,ry*i/5,0,Math.PI,Math.PI*2);c.stroke()}for(let i=0;i<=10;i++){const x=cx-rx+i*rx/5;c.beginPath();c.moveTo(cx,cy);c.quadraticCurveTo(x,cy-ry*.8,x,cy);c.stroke()}
  if(heritageLayer!=='horizon'){c.strokeStyle=heritageLayer==='zodiac'?'rgba(246,200,95,.7)':'rgba(180,131,255,.72)';c.lineWidth=2;c.beginPath();c.ellipse(cx,cy-ry*.12,rx*.94,ry*.43,-.18,Math.PI,Math.PI*2);c.stroke();const labels=heritageLayer==='zodiac'?['الحمل','الثور','الجوزاء','السرطان','الأسد','السنبلة','الميزان']:['الشرطان','البطين','الثريا','الدبران','الهقعة','الهنعة','الذراع'];c.fillStyle='rgba(230,241,248,.78)';c.font='10px sans-serif';c.textAlign='center';labels.forEach((name,i)=>{const a=Math.PI+(i/(labels.length-1))*Math.PI;c.fillText(name,cx+Math.cos(a)*rx*.8,cy+Math.sin(a)*ry*.36-ry*.12)})}
  c.restore();c.fillStyle='rgba(3,10,17,.76)';c.beginPath();c.moveTo(0,h*.78);for(let x=0;x<=w;x+=w/10)c.lineTo(x,h*(.79-(x%Math.max(1,w/5)===0?.035:0)));c.lineTo(w,h);c.lineTo(0,h);c.fill();c.strokeStyle='rgba(246,200,95,.42)';c.lineWidth=1.5;c.beginPath();c.moveTo(0,h*.78);c.quadraticCurveTo(w*.5,h*.72,w,h*.78);c.stroke();
}
function updateHeritageTime(){const mins=+heritageTime.value,h=Math.floor(mins/60)%24,m=mins%60;document.getElementById('heritageClock').textContent=`${arDigits(h>12?h-12:h||12)}:${arDigits(String(m).padStart(2,'0'))} ${h>=12?'م':'ص'}`;drawHeritage()}
function updateHeritageSystem(){const key=document.getElementById('heritageSystem').value,d=heritageSystems[key];document.getElementById('heritageSystemLabel').textContent=d.label;document.getElementById('heritageCanvasName').textContent=d.name;document.getElementById('risingSymbol').textContent=d.symbol;document.getElementById('risingNative').textContent=d.native;document.getElementById('risingName').textContent=d.name;document.getElementById('risingMeaning').textContent=d.meaning;document.getElementById('risingModern').textContent=d.modern;document.getElementById('risingPhenomenon').textContent=d.phenomenon;document.getElementById('risingEvidence').textContent=d.evidence;drawHeritage()}
heritageTime.addEventListener('input',updateHeritageTime);document.getElementById('heritagePlay').addEventListener('click',e=>{if(heritageTimer){clearInterval(heritageTimer);heritageTimer=null;e.currentTarget.textContent='▶'}else{e.currentTarget.textContent='Ⅱ';heritageTimer=setInterval(()=>{heritageTime.value=(+heritageTime.value+3)%1441;updateHeritageTime()},65)}});document.querySelectorAll('[data-heritage-layer]').forEach(button=>button.addEventListener('click',()=>{heritageLayer=button.dataset.heritageLayer;document.querySelectorAll('[data-heritage-layer]').forEach(b=>b.classList.toggle('active',b===button));drawHeritage()}));document.getElementById('heritageSystem').addEventListener('change',event=>selectCivilization(event.target.value));document.getElementById('heritageAlert').addEventListener('click',()=>setHeritageTab('zodiac'));

function setHeritageTab(tab){document.getElementById('heritageEra').closest('label').hidden=tab!=='timeline';document.getElementById('heritageSystem').closest('label').hidden=!['now','civilizations'].includes(tab);document.querySelectorAll('[data-heritage-tab]').forEach(button=>{const active=button.dataset.heritageTab===tab;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))});document.querySelectorAll('[data-heritage-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.heritagePanel===tab));if(tab==='zodiac')setTimeout(()=>window.zodiacExplorer?.activate(),30);if(tab==='now')setTimeout(drawHeritage,30);if(tab==='timeline')setTimeout(drawPrecession,30)}
document.querySelectorAll('[data-heritage-tab]').forEach(button=>button.addEventListener('click',()=>setHeritageTab(button.dataset.heritageTab)));

let selectedHeritageEntry=heritageEntries[0];
function showHeritageEntry(item){selectedHeritageEntry=item;document.querySelectorAll('.heritage-item').forEach(card=>card.classList.toggle('active',card.dataset.name===item.name&&card.dataset.system===item.system));document.getElementById('detailGlyph').textContent=item.glyph;document.getElementById('detailEvidence').textContent=item.evidence;document.getElementById('detailName').textContent=item.name;document.getElementById('detailNative').textContent=item.native;document.getElementById('detailMeaning').textContent=item.meaning;document.getElementById('detailModern').textContent=item.modern;document.getElementById('detailPhenomenon').textContent=item.phenomenon;document.getElementById('detailInterpretation').textContent=item.interpretation}
function renderHeritageEntries(){const query=document.getElementById('heritageSearch').value.trim().toLowerCase(),filter=document.getElementById('heritageCivilizationFilter').value,items=heritageEntries.filter(item=>(filter==='all'||item.group===filter)&&[item.name,item.native,item.civ,item.meaning,item.modern].join(' ').toLowerCase().includes(query));const box=document.getElementById('heritageItems');document.getElementById('heritageDetail').hidden=!items.length;if(!items.length){box.innerHTML='<div class="heritage-empty">لا توجد نتيجة مطابقة. جرّب اسمًا آخر أو اعرض كل الحضارات.</div>';return}if(!items.includes(selectedHeritageEntry))showHeritageEntry(items[0]);box.innerHTML=items.map(item=>`<button class="heritage-item ${item===selectedHeritageEntry?'active':''}" data-system="${item.system}" data-name="${item.name}"><span class="heritage-item-head"><span>${item.glyph}</span><em>${item.evidence}</em></span><h3>${item.name}</h3><small>${item.native}</small><p>${item.modern}</p></button>`).join('');box.querySelectorAll('.heritage-item').forEach(card=>card.addEventListener('click',()=>{const item=items.find(entry=>entry.system===card.dataset.system&&entry.name===card.dataset.name);if(item)showHeritageEntry(item)}))}
document.getElementById('heritageSearch').addEventListener('input',renderHeritageEntries);document.getElementById('heritageCivilizationFilter').addEventListener('change',renderHeritageEntries);

function renderCatalog(key){const items=heritageCatalogs[key];document.getElementById('catalogCount').textContent=`${arDigits(items.length)} اسمًا`;document.getElementById('heritageCatalog').innerHTML=items.map(([name,meaning],index)=>`<div class="catalog-entry"><b>${arDigits(index+1)}. ${name}</b><small>${meaning}</small></div>`).join('');document.querySelectorAll('[data-catalog]').forEach(button=>button.classList.toggle('active',button.dataset.catalog===key))}
document.querySelectorAll('[data-catalog]').forEach(button=>button.addEventListener('click',()=>renderCatalog(button.dataset.catalog)));

let selectedCivilization='arabic';
function selectCivilization(key){const d=civilizationData[key];if(!d)return;selectedCivilization=key;document.querySelectorAll('[data-civ]').forEach(button=>button.classList.toggle('active',button.dataset.civ===key));document.getElementById('civOrbitName').textContent=d.orbit;document.getElementById('civRegion').textContent=d.region;document.getElementById('civTitle').textContent=d.title;document.getElementById('civDescription').textContent=d.description;document.getElementById('civTags').innerHTML=d.tags.map(tag=>`<span>${tag}</span>`).join('');document.getElementById('heritageSystem').value=key;updateHeritageSystem()}
document.querySelectorAll('[data-civ]').forEach(button=>button.addEventListener('click',()=>selectCivilization(button.dataset.civ)));document.getElementById('openCivEncyclopedia').addEventListener('click',()=>{const group=['maya','aztec','inca'].includes(selectedCivilization)?'americas':selectedCivilization;document.getElementById('heritageCivilizationFilter').value=group;document.getElementById('heritageSearch').value='';renderHeritageEntries();setHeritageTab('encyclopedia')});

function renderComparison(){const a=civilizationData[document.getElementById('compareA').value],b=civilizationData[document.getElementById('compareB').value],rows=[['التقويم','calendar'],['تقسيم السماء','division'],['ما يُراقب عند الطلوع','rising'],['أسماء بارزة','stars'],['الظواهر والمواسم','observations'],['السياق العلمي','context']];document.getElementById('comparisonTable').innerHTML=`<div class="comparison-row header"><span>وجه المقارنة</span><span>${a.region}</span><span>${b.region}</span></div>${rows.map(([label,key])=>`<div class="comparison-row"><span>${label}</span><span>${a[key]}</span><span>${b[key]}</span></div>`).join('')}`}
document.getElementById('compareA').addEventListener('change',renderComparison);document.getElementById('compareB').addEventListener('change',renderComparison);document.querySelector('.compare-swap').addEventListener('click',()=>{const a=document.getElementById('compareA'),b=document.getElementById('compareB'),v=a.value;a.value=b.value;b.value=v;renderComparison()});

const precessionCanvas=document.getElementById('precessionCanvas'),precessionCtx=precessionCanvas.getContext('2d'),eraSlider=document.getElementById('eraSlider');
function eraState(year){if(year<=-1500)return{star:'الثعبان • Thuban',status:'قرب التنين',title:'قطب عصر الأهرام',text:'كان الثعبان أقرب إلى القطب السماوي الشمالي؛ ومع ذلك لم يكن التطابق كاملًا طوال الحقبة.'};if(year<500)return{star:'لا نجم قطبي شديد القرب',status:'بين نجوم خافتة',title:'قطب بلا نجم ساطع ملاصق',text:'تحرك القطب بعيدًا عن الثعبان قبل أن يقترب تدريجيًا من نجوم الدب الأصغر.'};if(year<1700)return{star:'الكوكب • Kochab',status:'قرب الدب الأصغر',title:'مرحلة الاقتراب من الجدي',text:'كان الكوكب من أبرز نجوم الاستدلال على الشمال، بينما واصل الجدي اقترابه من القطب.'};return{star:'النجم القطبي • Polaris',status:'قرب الجدي',title:'السماء القريبة من عصرنا',text:'يقع النجم القطبي قريبًا من القطب السماوي الشمالي، وتتغير المسافة ببطء بفعل السبق الاعتدالي.'}}
function drawPrecession(){const rect=precessionCanvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const dpr=Math.min(devicePixelRatio||1,2),w=rect.width,h=rect.height,c=precessionCtx;precessionCanvas.width=w*dpr;precessionCanvas.height=h*dpr;c.setTransform(dpr,0,0,dpr,0,0);const cx=w*.5,cy=h*.5,r=Math.min(w,h)*.32,year=+eraSlider.value,angle=-Math.PI*.64+((year-2026)/25772)*Math.PI*2;c.clearRect(0,0,w,h);const bg=c.createRadialGradient(cx,cy,4,cx,cy,w*.55);bg.addColorStop(0,'#173855');bg.addColorStop(1,'#030914');c.fillStyle=bg;c.fillRect(0,0,w,h);for(let i=0;i<72;i++){c.fillStyle=`rgba(220,242,255,${.16+(i%6)*.08})`;c.fillRect((i*79)%w,(i*43)%h,i%11===0?2:1,i%11===0?2:1)}c.strokeStyle='rgba(85,216,242,.25)';c.setLineDash([6,8]);c.lineWidth=1.5;c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.stroke();c.setLineDash([]);c.strokeStyle='rgba(255,255,255,.12)';c.beginPath();c.moveTo(cx-r*1.2,cy);c.lineTo(cx+r*1.2,cy);c.moveTo(cx,cy-r*1.2);c.lineTo(cx,cy+r*1.2);c.stroke();c.fillStyle='#f6c85f';c.shadowColor='#f6c85f';c.shadowBlur=14;c.beginPath();c.arc(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r,6,0,Math.PI*2);c.fill();c.shadowBlur=0;c.fillStyle='rgba(226,241,250,.7)';c.font='11px sans-serif';c.textAlign='center';c.fillText('مسار القطب السماوي',cx,cy-r-17);c.fillStyle='#55d8f2';c.beginPath();c.arc(cx,cy,3,0,Math.PI*2);c.fill()}
function updateEra(year,fromSelect=false){const y=Math.max(-3000,Math.min(2100,+year)),state=eraState(y),offset=Math.abs(2026-y)/71.6;eraSlider.value=Math.max(-3000,Math.min(2100,y));document.getElementById('eraYear').textContent=formatHeritageYear(y);document.getElementById('poleStar').textContent=state.star;document.getElementById('eraInsightTitle').textContent=state.title;document.getElementById('eraInsightText').textContent=state.text;document.getElementById('precessionOffset').textContent=`${arDigits(offset.toFixed(1).replace('.', '٫'))}°`;document.getElementById('poleStatus').textContent=state.status;document.getElementById('heritageEraLabel').textContent=y===2026?'رسم تراثي توضيحي':`محاكاة السماء • ${formatHeritageYear(y)}`;if(!fromSelect){const select=document.getElementById('heritageEra'),closest=[...select.options].sort((a,b)=>Math.abs(+a.value-y)-Math.abs(+b.value-y))[0];select.value=closest.value}drawPrecession();drawHeritage()}
eraSlider.addEventListener('input',()=>updateEra(eraSlider.value));document.getElementById('heritageEra').addEventListener('change',e=>updateEra(e.target.value,true));

const moreDialog=document.getElementById('moreDialog');document.getElementById('openMore').addEventListener('click',()=>moreDialog.showModal());document.getElementById('closeMore').addEventListener('click',()=>moreDialog.close());moreDialog.addEventListener('click',event=>{if(event.target===moreDialog)moreDialog.close()});
addEventListener('resize',()=>{drawHeritage();drawPrecession();drawYouthOrgan()});renderHeritageEntries();showHeritageEntry(heritageEntries[0]);renderCatalog('zodiac');selectCivilization('arabic');renderComparison();updateHeritageTime();updateEra(2026,true);

function addMessage(text){window.calendarAssistant?.(text);}
document.getElementById('sendChat').addEventListener('click',()=>{const i=document.getElementById('chatInput');if(i.value.trim()){addMessage(i.value.trim());i.value=''}});document.getElementById('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('sendChat').click()});
document.querySelectorAll('.prompt-chips button').forEach(b=>b.addEventListener('click',()=>addMessage(b.textContent)));
function quickAsk(text){setRoute('assistant');setTimeout(()=>addMessage(text),150)}
document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>quickAsk(b.dataset.prompt)));
document.getElementById('quickAskBtn').addEventListener('click',()=>{const i=document.getElementById('quickAsk');if(i.value.trim()){quickAsk(i.value.trim());i.value=''}});
