(function(){
  'use strict';
  const D=globalThis.HuntingData,C=globalThis.CalendarCore,root=document.getElementById('huntingCalendarRoot');
  if(!D||!C||!root)return;
  const language=globalThis.CALENDAR_LANGUAGE||'ar';
  const tr=(ar,en,ml)=>language==='ar'?ar:language==='ml'&&ml?ml:en;
  const label=obj=>language==='ar'?obj.name:obj.en;
  const note=obj=>language==='ar'?obj.note:obj.enNote;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=n=>new Intl.NumberFormat(language==='ar'?'ar':'en',{useGrouping:false}).format(n);
  const months=Array.from({length:12},(_,m)=>new Intl.DateTimeFormat(language==='ar'?'ar-SA':language==='ml'?'ml-IN':'en-US',{calendar:'gregory',timeZone:'UTC',month:'long'}).format(new Date(Date.UTC(2026,m,1))));
  const groups={all:tr('جميع الطيور','All birds','എല്ലാ പക്ഷികളും'),birds:tr('الطيور المهاجرة','Migratory birds','ദേശാടനപ്പക്ഷികൾ'),falcons:tr('الصقور','Falcons','ഫാൽക്കണുകൾ'),eagles:tr('العقبان','Eagles','പരുന്തുകൾ'),vultures:tr('النسور','Vultures','കഴുകന്മാർ')};
  const states={spring:tr('عبور ربيعي','Spring passage','വസന്തകാല ദേശാടനം'),autumn:tr('عبور خريفي','Autumn passage','ശരത്കാല ദേശാടനം'),winter:tr('إشتاء','Wintering','ശൈത്യകാല വാസം'),resident:tr('إقامة أو تجوال','Resident or dispersive','സ്ഥിരവാസം അല്ലെങ്കിൽ സഞ്ചാരം'),quiet:tr('خارج النافذة المعتادة','Outside typical window','സാധാരണ കാലയളവിന് പുറത്ത്'),unknown:tr('بيانات غير كافية','Insufficient data','മതിയായ വിവരമില്ല')};
  const todayParts=Object.fromEntries(new Intl.DateTimeFormat('en-u-ca-gregory-nu-latn',{timeZone:C.location.zone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).filter(p=>['year','month','day'].includes(p.type)).map(p=>[p.type,Number(p.value)]));
  let selectedDate=C.calendarDate(todayParts.year,todayParts.month,todayParts.day,'gregory');
  let regionChoice=C.read('calendar.hunting.region','auto'),group=C.read('calendar.hunting.group','all'),activeOnly=Boolean(C.read('calendar.hunting.activeOnly',false));
  if(regionChoice!=='auto'&&!D.region(regionChoice))regionChoice='auto';
  if(!groups[group])group='all';
  const monthList=values=>values.length?values.map(m=>months[m-1]).join(tr('، ', ', ', ', ')):tr('لا نافذة محددة','No assigned window','നിശ്ചിത കാലയളവില്ല');
  const activeRegion=()=>D.region(regionChoice==='auto'?D.inferRegion(C.location):regionChoice);
  const link=(key)=>{const s=D.sources[key];return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(label(s))} ↗</a>`;};
  const statusBadge=(bird,region)=>{
    if(bird.legal==='protected-sa'&&region.country==='sa')return `<span class="hunt-badge protected">${tr('ممنوع صيده في السعودية','Hunting prohibited in Saudi Arabia','സൗദിയിൽ വേട്ട നിരോധിച്ചിരിക്കുന്നു')}</span>`;
    if(bird.legal==='listed'&&region.country==='sa')return `<span class="hunt-badge permit">${tr('مذكور في دليل المركز · تحقّق من الرخصة','Listed in NCW guidance · check your permit','NCW പട്ടികയിൽ · അനുമതി പരിശോധിക്കുക')}</span>`;
    if(bird.legal==='falcon')return `<span class="hunt-badge observation">${tr('هجرة الصقور · الطرح يحتاج ترخيصًا خاصًا','Falcon migration · capture needs separate authorization','ദേശാടനം · പിടിക്കാൻ പ്രത്യേക അനുമതി വേണം')}</span>`;
    return `<span class="hunt-badge observation">${tr('للرصد · سماح الصيد غير مثبت هنا','Observation · hunting permission not established here','നിരീക്ഷണം · വേട്ടാനുമതി ഇവിടെ സ്ഥിരീകരിച്ചിട്ടില്ല')}</span>`;
  };
  function huntingAdvice(bird,region,p,year){
    if(region.country!=='sa'||bird.legal!=='listed')return '';
    const autumn=p.autumn.filter(m=>D.legalWindow(region.id,year,m)==='announced');
    const preferred=p.focus.filter(m=>autumn.includes(m));
    return `<div class="hunt-opportunity"><b>${tr('أفضل نافذة خريفية إرشادية للصيد','Indicative autumn hunting window','ശരത്കാല വേട്ടയ്ക്കുള്ള സൂചനാ കാലയളവ്')}</b><span>${esc(autumn.length?monthList(preferred.length?preferred:autumn):tr('لا يوجد موسم رسمي موثّق لهذا العام في البيانات','No official season for this year is recorded here','ഈ വർഷത്തെ ഔദ്യോഗിക സീസൺ ഇവിടെ രേഖപ്പെടുത്തിയിട്ടില്ല'))}</span><small>${tr('عند إدراج النوع في رخصتك، وداخل المكان والوقت والحصة المصرّح بها.','Only if your permit includes this species, location, dates and quota.','അനുമതിയിലെ ഇനം, സ്ഥലം, തീയതി, പരിധി എന്നിവയ്ക്ക് വിധേയമായി.')}</small></div>`;
  }
  function birdCard(bird,region,month,year){
    const p=D.profile(bird,region.id),state=D.state(bird,region.id,month);
    const purelyResident=state.resident&&!p.spring.length&&!p.autumn.length;
    return `<article class="hunt-bird panel ${esc(state.key)}" data-hunting-bird="${bird.id}">
      <header><div><span class="hunt-group">${esc(groups[bird.group])}</span><h4>${esc(label(bird))}</h4><i lang="la" dir="ltr">${esc(bird.latin)}</i></div><span class="hunt-badge ${state.key}">${esc(states[state.key])}${state.focus?' · '+tr('مرجّح','Favoured','അനുകൂലം'):''}</span></header>
      ${statusBadge(bird,region)}<p>${esc(note(bird))}</p>
      <div class="hunt-bird-year" aria-label="${esc(tr('التوزيع السنوي','Annual pattern','വാർഷിക ക്രമം'))}">${months.map((m,i)=>{const s=D.state(bird,region.id,i+1);return `<span class="${s.key}${s.focus?' focus':''}${i+1===month?' selected':''}" title="${esc(m+': '+states[s.key])}" aria-label="${esc(m+': '+states[s.key])}">${number(i+1)}</span>`;}).join('')}</div>
      ${purelyResident?`<p class="hunt-resident-note">${tr('على مدار العام في الموئل المناسب؛ لا يُحتسب ذروة هجرة.','Year-round in suitable habitat; not counted as a migration peak.','അനുയോജ്യമായ ആവാസവ്യവസ്ഥയിൽ വർഷം മുഴുവൻ; ദേശാടന ഉച്ചസ്ഥിതി അല്ല.')}</p>`:`<dl><div><dt>${states.spring}</dt><dd>${esc(monthList(p.spring))}</dd></div><div><dt>${states.autumn}</dt><dd>${esc(monthList(p.autumn))}</dd></div>${p.winter.length?`<div><dt>${states.winter}</dt><dd>${esc(monthList(p.winter))}</dd></div>`:''}</dl>`}
      ${huntingAdvice(bird,region,p,year)}
      <footer>${bird.sources.slice(0,2).map(link).join('')}</footer>
    </article>`;
  }
  function regulation(region,year,month){
    if(region.country!=='sa')return `<aside class="hunt-regulation panel"><h3>${tr('اللوائح حسب الدولة','Regulations by country','രാജ്യത്തെ നിയമങ്ങൾ')}</h3><p>${tr('المعروض هنا مواسم وجود وهجرة. لم تُثبت مواعيد السماح للصيد في هذا النطاق؛ راجع جهة الحياة الفطرية المحلية قبل الصيد.','This view shows seasonal presence and migration. Hunting dates are not verified for this region; check the local wildlife authority.','ഇവ പക്ഷികളുടെ സാന്നിധ്യവും ദേശാടനവും കാണിക്കുന്ന കാലയളവുകളാണ്. വേട്ടാനുമതിയുടെ തീയതികൾ പ്രാദേശിക അധികൃതരോട് പരിശോധിക്കുക.')}</p></aside>`;
    const announced=D.legalWindow(region.id,year,month)==='announced';
    return `<aside class="hunt-regulation panel"><div><span class="hunt-eyebrow">${tr('الإعلان السعودي الموثّق · ٢٠٢٦–٢٠٢٧','Verified Saudi announcement · 2026–2027','സൗദി ഔദ്യോഗിക അറിയിപ്പ് · 2026–2027')}</span><h3>${tr('١ سبتمبر ٢٠٢٦ — ٣١ يناير ٢٠٢٧','1 September 2026 — 31 January 2027','1 സെപ്റ്റംബർ 2026 — 31 ജനുവരി 2027')}</h3><p>${announced?tr('الشهر المختار داخل الفترة العامة المعلنة. تحدد الرخصة النوع والموعد والحصة؛ وقد تكون نافذة النوع أقصر.','The selected month falls within the announced general period. Your permit determines species, dates and quota; species windows can be shorter.','തിരഞ്ഞെടുത്ത മാസം പൊതുവായ സീസണിലാണ്. ഇനം, തീയതി, പരിധി എന്നിവ അനുമതി നിർണ്ണയിക്കുന്നു.'):tr('الشهر المختار خارج فترة الإعلان الموثّق هنا؛ لا تُمدد المواعيد تلقائيًا إلى موسم آخر.','The selected month is outside this recorded announcement; dates are not automatically repeated for another season.','തിരഞ്ഞെടുത്ത മാസം രേഖപ്പെടുത്തിയ സീസണിന് പുറത്താണ്; അടുത്ത വർഷത്തേക്ക് തീയതികൾ സ്വയം ആവർത്തിക്കില്ല.')}</p><p>${tr('الصيد محظور في المحميات والمدن والقرى والمزارع والمشاريع الكبرى، وعلى السواحل بعمق ٢٠ كم باتجاه البر. اختيار المنطقة لا يثبت أن موقعك مسموح.','Hunting is prohibited in reserves, towns, villages, farms, major projects and the coastal belt extending 20 km inland. Selecting a region does not authorize a specific site.','സംരക്ഷിത പ്രദേശങ്ങൾ, പട്ടണങ്ങൾ, ഗ്രാമങ്ങൾ, കൃഷിയിടങ്ങൾ, പ്രധാന പദ്ധതികൾ, തീരത്തുനിന്ന് 20 കി.മീ. ഉള്ളിലേക്കുള്ള പ്രദേശങ്ങൾ എന്നിവിടങ്ങളിൽ വേട്ട നിരോധിച്ചിരിക്കുന്നു.')}</p></div><div class="hunt-regulation-links">${link('fitri')}${link('season')}</div></aside>`;
  }
  function render(date){
    if(date instanceof Date&&Number.isFinite(+date))selectedDate=date;
    const {year,month}=C.parts(selectedDate,'gregory'),region=activeRegion();
    const focusId=root.contains(document.activeElement)?document.activeElement.id:'';
    const monthValue=`${year}-${String(month).padStart(2,'0')}`;
    const options=country=>D.regions.filter(r=>r.country===country).map(r=>`<option value="${r.id}"${regionChoice===r.id?' selected':''}>${esc(label(r))}</option>`).join('');
    root.innerHTML=`<div class="hunt-toolbar panel"><div><span class="hunt-eyebrow">${tr('تقويم الصيد','Hunting calendar','വേട്ട കലണ്ടർ')}</span><h2>${tr('مواسم الطيور المهاجرة والجوارح','Bird migration and hunting seasons','പക്ഷികളുടെ ദേശാടനവും വേട്ടക്കാലവും')}</h2><p>${tr('اختر المنطقة والشهر للتعرّف على الأنواع ومواسمها المعتادة.','Choose a region and month to explore species and typical seasons.','ഇനങ്ങളും സാധാരണ സീസണുകളും കാണാൻ പ്രദേശവും മാസവും തിരഞ്ഞെടുക്കുക.')}</p></div>
      <div class="hunt-controls"><label for="huntingRegion">${tr('المنطقة','Region','പ്രദേശം')}<select id="huntingRegion"><option value="auto"${regionChoice==='auto'?' selected':''}>${tr('تلقائي حسب الموقع','Use current location','നിലവിലെ സ്ഥാനം')}</option><optgroup label="${tr('مناطق السعودية','Saudi regions','സൗദി പ്രദേശങ്ങൾ')}">${options('sa')}</optgroup><optgroup label="${tr('مسارات مجاورة','Nearby flyways','അടുത്ത ദേശാടന പാതകൾ')}">${options('other')}</optgroup></select></label><label for="huntingGroup">${tr('مجموعة الطيور','Bird group','പക്ഷികളുടെ വിഭാഗം')}<select id="huntingGroup">${Object.entries(groups).map(([key,value])=>`<option value="${key}"${group===key?' selected':''}>${esc(value)}</option>`).join('')}</select></label><label for="huntingMonth">${tr('الشهر والسنة الميلاديان','Gregorian month and year','ഗ്രിഗോറിയൻ മാസവും വർഷവും')}<input id="huntingMonth" type="month" min="0623-01" max="9999-12" value="${monthValue}"></label></div>
      <div class="hunt-toolbar-bottom"><label for="huntingActiveOnly"><input id="huntingActiveOnly" type="checkbox"${activeOnly?' checked':''}>${tr('الأنواع المتوقعة في الشهر فقط','Only species expected this month','ഈ മാസത്തിൽ പ്രതീക്ഷിക്കുന്ന ഇനങ്ങൾ മാത്രം')}</label><button type="button" id="huntingToday">${tr('الشهر الحالي','Current month','നിലവിലെ മാസം')}</button></div></div>
      ${region?`<div class="hunt-region-note"><strong>${esc(label(region))}</strong><span>${esc(label(D.areas[region.area]))}</span><p>${esc(note(D.areas[region.area]))}</p><small>${tr('تقديرات على مستوى نطاق الهجرة؛ المناطق المتشاركة في المسار تستخدم نافذة إقليمية واحدة.','Flyway-level estimates; regions sharing a flyway use the same regional window.','ദേശാടന പാതയെ അടിസ്ഥാനമാക്കിയുള്ള കണക്കുകൾ; ഒരേ പാതയിലുള്ള പ്രദേശങ്ങൾക്ക് ഒരേ കാലയളവ്.')}</small></div>`:`<div class="hunt-empty panel" role="status"><h3>${tr('اختر منطقة من القائمة','Choose a region from the list','പട്ടികയിൽനിന്ന് ഒരു പ്രദേശം തിരഞ്ഞെടുക്കുക')}</h3><p>${tr('تعذّر ربط الموقع الحالي بنطاق موثّق. يغطي هذا الإصدار السعودية والخليج وعُمان والشام ومصر.','The current location could not be matched to a documented region. Coverage includes Saudi Arabia, the Gulf, Oman, the Levant and Egypt.','നിലവിലെ സ്ഥാനം തിരിച്ചറിയാനായില്ല. സൗദി, ഗൾഫ്, ഒമാൻ, ലെവന്റ്, ഈജിപ്ത് എന്നിവയാണ് ഉൾപ്പെടുത്തിയിരിക്കുന്നത്.')}</p></div>`}
      <div id="huntingResults" aria-live="polite"></div>`;
    if(region){
      const all=D.list(region.id,group,month),visible=D.list(region.id,group,month,activeOnly);
      const active=all.filter(b=>!['quiet','unknown'].includes(D.state(b,region.id,month).key));
      const migrants=active.filter(b=>['spring','autumn'].includes(D.state(b,region.id,month).key));
      const residents=active.filter(b=>D.state(b,region.id,month).key==='resident');
      const nowNames=active.slice().sort((a,b)=>Number(D.state(b,region.id,month).focus)-Number(D.state(a,region.id,month).focus)).slice(0,5).map(label);
      const results=root.querySelector('#huntingResults');
      results.innerHTML=`<section class="hunt-now panel"><div><span class="hunt-eyebrow">${esc(months[month-1])} ${number(year)} · ${esc(label(region))}</span><h3>${tr('ما الأنواع المتوقعة؟','Which birds are expected?','ഏത് പക്ഷികളെയാണ് പ്രതീക്ഷിക്കുന്നത്?')}</h3><p>${esc(nowNames.length?nowNames.join(tr('، ', ', ', ', ')):tr('لا نافذة معتادة للمجموعة المختارة في هذا الشهر.','No typical seasonal window for the selected group this month.','ഈ മാസം തിരഞ്ഞെടുത്ത വിഭാഗത്തിന് സാധാരണ സീസണില്ല.'))}</p></div><div class="hunt-counts"><span><b>${number(migrants.length)}</b>${tr('نوع عابر','passage species','ദേശാടന ഇനങ്ങൾ')}</span><span><b>${number(residents.length)}</b>${tr('مقيم أو متجوّل','resident / dispersive','സ്ഥിരവാസം / സഞ്ചാരം')}</span></div></section>
        ${regulation(region,year,month)}
        <section class="hunt-year panel"><div class="hunt-section-head"><h3>${tr('خريطة المواسم السنوية','Annual season calendar','വാർഷിക സീസൺ കലണ്ടർ')}</h3><span>${tr('اضغط شهرًا لاستكشافه','Select a month','ഒരു മാസം തിരഞ്ഞെടുക്കുക')}</span></div><div class="hunt-legend"><span><i class="autumn"></i>${states.autumn}</span><span><i class="spring"></i>${states.spring}</span><span><i class="winter"></i>${states.winter}</span><span><i class="resident"></i>${states.resident}</span></div><div class="hunt-month-grid">${months.map((name,i)=>{const m=i+1,counts={spring:0,autumn:0,winter:0};all.forEach(b=>{const s=D.state(b,region.id,m);if(Object.hasOwn(counts,s.key))counts[s.key]++;});const total=Object.values(counts).reduce((a,b)=>a+b,0),dominant=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];return `<button type="button" id="huntingMonth${m}" data-hunting-month="${m}" aria-pressed="${m===month}" class="hunt-month ${total?dominant:'quiet'}${m===month?' selected':''}"><b>${esc(name)}</b><span>${total?esc(states[dominant]):tr('لا عبور أو إشتاء مدرج','No listed passage or wintering','ദേശാടനമോ ശൈത്യവാസമോ രേഖപ്പെടുത്തിയിട്ടില്ല')}</span><small>${number(counts.spring+counts.autumn)} ${tr('عابر','passage','ദേശാടനം')} · ${number(counts.winter)} ${tr('مُشتٍ','wintering','ശൈത്യവാസം')}</small></button>`;}).join('')}</div><p class="hunt-footnote">${tr('الأعداد تخص الأنواع المدرجة في التقويم، وليست أعداد الطيور المرصودة. لا تدخل الأنواع المقيمة في عداد العبور.','Counts refer to listed species, not observed birds. Residents are excluded from passage counts.','ഇവ പട്ടികയിലെ ഇനങ്ങളുടെ എണ്ണമാണ്; നിരീക്ഷിച്ച പക്ഷികളുടെ എണ്ണമല്ല. സ്ഥിരവാസികളെ ദേശാടന എണ്ണത്തിൽ ഉൾപ്പെടുത്തുന്നില്ല.')}</p></section>
        <div class="hunt-section-head"><h3>${tr('الأنواع ومواسمها بحسب المنطقة','Species and seasons by region','പ്രദേശത്തെ ഇനങ്ങളും സീസണുകളും')}</h3><span>${number(visible.length)} ${tr('نوعًا','species','ഇനങ്ങൾ')}</span></div><div class="hunt-bird-grid">${visible.map(b=>birdCard(b,region,month,year)).join('')||`<div class="hunt-empty panel" role="status">${tr('لا توجد أنواع مطابقة لهذا الاختيار؛ غيّر الشهر أو المجموعة أو ألغِ تصفية الشهر.','No matching species. Change the month or group, or disable the monthly filter.','പൊരുത്തപ്പെടുന്ന ഇനങ്ങളില്ല. മാസം, വിഭാഗം അല്ലെങ്കിൽ ഫിൽട്ടർ മാറ്റുക.')}</div>`}</div>
        <details class="hunt-method panel"><summary>${tr('المصادر وحدود الدقة','Sources and accuracy','സ്രോതസ്സുകളും കൃത്യതയും')}</summary><p>${tr('مواعيد الأشهر تقديرات تحريرية مبنية على نوافذ الهجرة المنشورة والسجلات الإقليمية، وليست قياسات يومية أو توقعًا لوفرة الطيور. الأشهر المرجّحة لا تعني ذروة محسوبة إحصائيًا. قد تتقدم الهجرة أو تتأخر مع الرياح والحرارة والأمطار والعمر والجماعة؛ ولا تكفي المنطقة الإدارية لتحديد موئل الطائر.','Month ranges are editorial estimates based on published migration windows and regional records, not daily measurements or abundance forecasts. Favoured months are not statistically measured peaks. Timing varies with weather, age and population; an administrative region alone does not identify suitable habitat.','മാസങ്ങൾ പ്രസിദ്ധീകരിച്ച ദേശാടനകാലവും പ്രാദേശിക രേഖകളും അടിസ്ഥാനമാക്കിയുള്ള ഏകദേശ കണക്കുകളാണ്. ഇവ തത്സമയ അളവുകളോ പക്ഷികളുടെ എണ്ണത്തിന്റെ പ്രവചനമോ അല്ല. കാലാവസ്ഥയും പ്രായവും അനുസരിച്ച് സമയങ്ങൾ മാറാം.')}</p><p>${tr('فترات الوجود والعبور لا تثبت السماح بالصيد. إعلان موسم ٢٠٢٦–٢٠٢٧ يحدد الفترة العامة؛ دليل الأنواع والرخصة يحددان التفاصيل. البيانات محفوظة للعمل دون اتصال، ولا تتحدث اللوائح تلقائيًا.','Presence and passage do not establish hunting permission. The 2026–2027 announcement sets the general period; species guidance and your permit set the details. Data is available offline; regulations do not update automatically.','സാന്നിധ്യമോ ദേശാടനമോ വേട്ടാനുമതിയല്ല. ഔദ്യോഗിക പട്ടികയും അനുമതിയും പരിശോധിക്കുക. വിവരങ്ങൾ ഓഫ്‌ലൈനിലും ലഭ്യമാണ്; നിയമങ്ങൾ സ്വയം പുതുക്കില്ല.')}</p><p><b>${tr('آخر مراجعة للمصادر: ١٠ سبتمبر ٢٠٢٦','Sources last reviewed: 10 September 2026','അവസാന പരിശോധന: 10 സെപ്റ്റംബർ 2026')}</b></p><div class="hunt-sources">${Array.from(new Set(['season','rules',D.areas[region.area].source,...all.flatMap(b=>b.sources),'levant','egypt'])).map(link).join('')}</div></details>`;
    }
    if(focusId)document.getElementById(focusId)?.focus({preventScroll:true});
    globalThis.CalendarLanguage?.apply?.();
  }
  function chooseMonth(year,month){
    if(!Number.isInteger(year)||year<623||year>9999||!Number.isInteger(month)||month<1||month>12)return;
    selectedDate=C.calendarDate(year,month,1,'gregory');
    const input=document.getElementById('calendarSelectDate');
    if(input){input.value=selectedDate.toISOString().slice(0,10);input.dispatchEvent(new Event('change',{bubbles:true}));}
    render(selectedDate);
  }
  root.addEventListener('change',event=>{
    const el=event.target;
    if(el.id==='huntingRegion'){regionChoice=el.value;C.save('calendar.hunting.region',regionChoice);}
    else if(el.id==='huntingGroup'){group=el.value;C.save('calendar.hunting.group',group);}
    else if(el.id==='huntingActiveOnly'){activeOnly=el.checked;C.save('calendar.hunting.activeOnly',activeOnly);}
    else if(el.id==='huntingMonth'){const p=el.value.split('-').map(Number);chooseMonth(p[0],p[1]);return;}
    else return;
    render();
  });
  root.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.huntingMonth){const p=C.parts(selectedDate,'gregory');chooseMonth(p.year,Number(button.dataset.huntingMonth));}
    if(button.id==='huntingToday'){const parts=Object.fromEntries(new Intl.DateTimeFormat('en',{timeZone:C.location.zone,year:'numeric',month:'numeric'}).formatToParts(new Date()).filter(p=>p.type==='year'||p.type==='month').map(p=>[p.type,Number(p.value)]));chooseMonth(parts.year,parts.month);}
  });
  addEventListener('calendar-location',()=>render());
  globalThis.HuntingCalendar={render};
})(globalThis);
