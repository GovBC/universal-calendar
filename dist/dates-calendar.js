/* Global country shell with a source-backed Saudi date-palm catalogue. */
(() => {
  'use strict';
  const D = window.SaudiDatesData, root = document.getElementById('datesCalendarRoot');
  if (!D || !root) return;
  const C = window.CalendarCore;
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const maturity = {early:'مبكر',mid:'منتصف الموسم',late:'متأخر',veryLate:'متأخر جدًا'};
  const stages = {bisr:'بلوغ البسر / الخلال',rutab:'بلوغ الرطب',tamr:'بلوغ التمر',maturity:'موعد النضج المذكور'};
  const countryCodes = 'AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW PS'.split(' ');
  const countryOverrides = {SA:'المملكة العربية السعودية',PS:'فلسطين',VA:'دولة الفاتيكان'};
  const regionNames = typeof Intl.DisplayNames==='function' ? new Intl.DisplayNames(['ar-SA','ar'],{type:'region'}) : null;
  const countries = countryCodes.map(code=>({code,name:countryOverrides[code]||regionNames?.of(code)||code})).sort((a,b)=>a.name.localeCompare(b.name,'ar'));
  const featuredNames = ['سكري','خلاص','عجوة','صقعي','برحي','صفري','خضري','صفاوي','شيشي','روثانة','منيفي','نبوت سيف'];
  const num = n => new Intl.NumberFormat('ar-SA').format(n);
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = s => String(s ?? '').normalize('NFKC').replace(/[\u064b-\u065f\u0670ـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase().trim().replace(/(^|\s)ال/g,'$1').replace(/\s+/g,' ');
  const names = [...D.cultivars].sort((a,b)=>normalize(a.name).localeCompare(normalize(b.name),'ar'));
  const featured = featuredNames.map(name=>D.cultivars.find(d=>d.name===name)).filter(Boolean);
  const index = new Map(names.map(d=>[d.id,normalize([d.name,...d.aliases,...d.regions.map(r=>D.regions[r])].join(' '))]));
  const defaultId = D.cultivars.find(x=>x.name==='عجوة')?.id;
  const rememberedView = C?.read?.('calendar.dates.view','featured');
  const rememberedCountry = C?.read?.('calendar.dates.country','SA');
  const state = {country:countries.some(c=>c.code===rememberedCountry)?rememberedCountry:'SA',view:rememberedView==='all'?'all':'featured',query:'',region:'all',maturity:'all',evidence:'all',page:1,month:9,selected:defaultId,featuredSelected:defaultId,manualMonth:false};
  const pageSize = 24;
  const country = code => countries.find(item=>item.code===code) || countries.find(item=>item.code==='SA');
  const flag = code => String.fromCodePoint(...code.split('').map(char=>127397+char.charCodeAt(0)));
  const countryOptionsHTML = () => countries.map(item=>`<option value="${item.code}" ${state.country===item.code?'selected':''}>${flag(item.code)} ${esc(item.name)}</option>`).join('');
  const regionText = d => d.regions.map(r=>D.regions[r]).join('، ') || 'المنطقة غير محددة في المرجع';
  const observations = (d,region=state.region) => d.observations.filter(o=>region==='all'||!o.region||o.region===region);
  const badge = d => d.historicalOnly ? 'اسم في سجل تاريخي' : d.traits.length ? 'خصائص موثقة' : 'اسم وانتشار موثقان';
  const timingText = d => {
    const labels=[...new Set(observations(d,'all').map(o=>o.label))];
    return labels.length?labels.join('، '):'لا يتوفر شهر محدد';
  };
  const sourceLink = (ref,label) => {
    const s=D.sources[ref.source];if(!s)return '';
    const url=ref.page&&s.pdf?`${s.pdf}#page=${ref.page}`:s.url;
    return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label || (ref.source==='ncpd2024'?'دليل المركز ٢٠٢٤':ref.source==='ministry'?'دليل وزارة الزراعة':s.title))}${ref.page?` · صفحة PDF ${num(ref.page)}`:''} ↗</a>`;
  };
  function filter(items=names,options=state) {
    const words=normalize(options.query).split(' ').filter(Boolean);
    return items.filter(d=>(options.region==='all'||(options.region==='unknown'?!d.regions.length:d.regions.includes(options.region)))
      &&(options.maturity==='all'||(options.maturity==='unknown'?!d.maturity:d.maturity===options.maturity))
      &&(options.evidence==='all'||(options.evidence==='profile'?d.traits.length:options.evidence==='monthly'?d.observations.some(o=>options.region==='all'||!o.region||o.region===options.region):d.historicalOnly))
      &&words.every(w=>index.get(d.id).includes(w)));
  }
  function selectMonth(date) {
    if(!date||state.manualMonth)return;
    const month=C?.parts?.(date,'gregory')?.month || date.getUTCMonth?.()+1;
    if(Number.isInteger(month)&&month>=1&&month<=12)state.month=month;
  }
  function calendarHTML(items) {
    const timed=items.filter(d=>observations(d,'all').length);
    const inMonth=timed.flatMap(d=>observations(d,'all').filter(o=>o.months.includes(state.month)).map(o=>({d,o})));
    return `<div class="dc-heading"><div><span class="kicker">مواعيد الأصناف الرئيسية</span><h3 id="datesSeasonTitle">تقويم النضج الموثق</h3></div><label class="dc-month-select">الشهر<select id="datesMonth">${months.map((m,i)=>`<option value="${i+1}" ${state.month===i+1?'selected':''}>${m}</option>`).join('')}</select></label></div>
      <p class="dc-muted">يعرض فقط الأشهر المذكورة صراحة في المراجع، ولا يحول شهر النضج إلى بداية أو ذروة أو نهاية للجني.</p>
      <div class="dc-months" aria-label="أشهر مواعيد النضج الموثقة">${months.map((m,i)=>{
        const count=timed.filter(d=>observations(d,'all').some(o=>o.months.includes(i+1))).length;
        return `<button type="button" data-dates-month="${i+1}" aria-pressed="${state.month===i+1}" class="${count?'documented':''} ${state.month===i+1?'current':''}"><b>${m}</b><span>${count?num(count):'—'}</span><small>${count?'مواعيد موثقة':'لا موعد منشور'}</small></button>`;
      }).join('')}</div>
      <div class="dc-season-results"><h4>${months[state.month-1]}</h4>${inMonth.length?`<div class="dc-events">${inMonth.map(({d,o})=>`<article><div><button type="button" class="dc-name-link" data-dates-feature="${d.id}">${esc(d.name)}</button><span class="dc-tag">${stages[o.kind]}</span></div><b>${esc(o.label)}</b><p>${esc(o.scope)}</p>${sourceLink(o.ref)}</article>`).join('')}</div>`:`<p class="dc-empty">لا تتوفر مواعيد شهرية موثقة للأصناف الرئيسية في هذا الشهر. هذا لا يعني انعدام المحصول.</p>`}</div>`;
  }
  function featuredCardsHTML() {
    return featured.map(d=>`<button type="button" class="dc-feature-card ${state.featuredSelected===d.id?'selected':''}" data-dates-feature="${d.id}" aria-pressed="${state.featuredSelected===d.id}" aria-controls="datesFeaturedDetail"><span class="dc-card-title">${esc(d.name)} <span aria-hidden="true">↗</span></span><small>${esc(regionText(d))}</small><span class="dc-feature-meta"><b>${maturity[d.maturity]||'النضج غير موثق'}</b><span>${esc(timingText(d))}</span></span></button>`).join('');
  }
  function featuredDetailHTML(d) {
    if(!d)return '<h3 id="datesFeaturedTitle">اختر صنفًا</h3>';
    const timed=observations(d,'all');
    return `<div class="dc-heading"><div><span class="kicker">الصنف المختار</span><h3 id="datesFeaturedTitle">${esc(d.name)}</h3><p class="dc-muted">${esc(regionText(d))}</p></div><span class="dc-tag">${maturity[d.maturity]||'النضج غير موثق'}</span></div>
      <div class="dc-feature-facts"><div><small>أطوار الاستهلاك المذكورة</small><b>${d.consumption.length?esc(d.consumption.join('، ')):'غير محددة في المرجع'}</b></div><div><small>المواعيد الشهرية المنشورة</small><b>${esc(timingText(d))}</b></div></div>
      ${timed.length?`<ul class="dc-timing-list">${timed.map(o=>`<li><span>${stages[o.kind]}</span><b>${esc(o.label)}</b><small>${esc(o.scope)}</small></li>`).join('')}</ul>`:'<p class="dc-empty">يوثق الدليل ترتيب النضج وخصائص الثمرة، لكنه لا يحدد شهرًا لهذا الصنف.</p>'}
      ${d.traits.length?`<div class="dc-mini-traits">${d.traits.map(t=>`<div><b>${esc(t.stage)}</b><span>${esc(t.color||'لون غير مذكور')}</span><small>${esc(t.shape||'شكل غير مذكور')} · ${esc(t.size||'حجم غير مذكور')}</small></div>`).join('')}</div>`:''}
      <button type="button" class="primary-button dc-open-directory" data-dates-open-all="${d.id}">التفاصيل الكاملة والمصادر</button>`;
  }
  function detailHTML(d) {
    if(!d)return '<h3 id="datesDetailTitle">بطاقة الصنف</h3><div class="dc-empty">غيّر خيارات البحث لعرض تفاصيل صنف.</div>';
    const refs=[...new Map(d.refs.map(r=>[`${r.source}-${r.page||''}`,r])).values()];
    const timed=observations(d);
    return `<div class="dc-heading"><div><span class="kicker">بطاقة الصنف</span><h3 id="datesDetailTitle">${esc(d.name)}</h3><p class="dc-muted">${esc(regionText(d))}</p></div><span class="dc-tag">${badge(d)}</span></div>
      ${d.aliases.length?`<p class="dc-aliases"><b>صيغ للبحث:</b> ${esc([...new Set(d.aliases.map(x=>x.trim()).filter(x=>x!==d.name))].join('، '))}</p>`:''}
      <div class="dc-detail-columns"><div><div class="dc-facts"><div><small>ترتيب النضج</small><b>${maturity[d.maturity]||'غير موثق'}</b></div><div><small>أطوار الاستهلاك المذكورة</small><b>${d.consumption.length?esc(d.consumption.join('، ')):'غير محددة في المرجع'}</b></div></div>
      <div class="dc-boundaries" aria-label="حدود الموسم وذروته"><div><small>بداية جني الرطب</small><b>غير موثقة</b></div><div><small>ذروة الجني</small><b>غير موثقة</b></div><div><small>نهاية الجني</small><b>غير موثقة</b></div></div>
      <p class="dc-muted">بلوغ طور النضج يختلف عن بداية الجني وذروته ونهايته. لا تُستنتج هذه الحدود من كلمة «مبكر» أو من شهر النضج وحده.</p>
      ${timed.length?`<ul class="dc-observations">${timed.map(o=>`<li><b>${stages[o.kind]}: ${esc(o.label)}</b><span>${esc(o.scope)}</span>${sourceLink(o.ref)}</li>`).join('')}</ul>`:`<p class="dc-empty">${d.observations.length?'لا توجد مواعيد خاصة بالمنطقة المختارة؛ المواعيد المتوفرة للصنف مرتبطة بمنطقة أخرى.':'لم نعثر في المراجع المعتمدة على أشهر موثقة لهذا الاسم.'}</p>`}
      ${d.name==='سكري'&&(state.region==='all'||state.region==='qassim')?`<details class="dc-regional"><summary>رصد تاريخي لذروة السكري · بريدة ٢٠٢٠</summary><p>${esc(D.historicalPeak.text)}</p>${sourceLink(D.historicalPeak.ref)}</details>`:''}</div>
      <div><h4>خصائص الثمرة بحسب الطور</h4>${d.traits.length?`<div class="dc-table-scroll"><table class="dc-traits"><caption>الألوان والأحجام الوصفية في دليل ٢٠٢٤؛ ليست معيار تصنيف تجاري</caption><thead><tr><th scope="col">الطور</th><th scope="col">الشكل</th><th scope="col">الحجم</th><th scope="col">اللون</th></tr></thead><tbody>${d.traits.map(t=>`<tr><th scope="row">${esc(t.stage)}</th><td>${esc(t.shape||'غير مذكور')}</td><td>${esc(t.size||'غير مذكور')}</td><td>${esc(t.color||'غير مذكور')}</td></tr>`).join('')}</tbody></table></div>${sourceLink({source:'ncpd2024',page:d.traits[0].page},'مصدر خصائص الثمرة')}`:'<p class="dc-empty">المتوفر لهذا الاسم هو وروده في قائمة الأصناف. لا تتوفر هنا خصائص تفصيلية موثقة للثمرة.</p>'}
      ${d.notes.length?`<ul class="dc-notes">${d.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}${d.historicalOnly?'<p class="dc-history-note">اسم ورد في سجل قديم؛ لم يُثبت في هذه البيانات استمرار زراعته أو منطقة انتشاره حاليًا.</p>':''}</div></div>
      <details class="dc-references"><summary>مراجع هذا الاسم (${num(refs.length)})</summary><div>${refs.map(r=>sourceLink(r)).join('')}</div></details>`;
  }
  function catalogueHTML(items) {
    const pages=Math.max(1,Math.ceil(items.length/pageSize));state.page=Math.min(state.page,pages);
    const visible=items.slice((state.page-1)*pageSize,state.page*pageSize);
    return `<div class="dc-heading"><div><span class="kicker">مرتّب هجائيًا</span><h3>دليل الأسماء والأصناف</h3></div><b class="dc-result-count" role="status">${num(items.length)} نتيجة من ${num(names.length)}</b></div>
      <p class="dc-muted">يشمل الأصناف الرئيسية وبقية الأسماء المحلية والتاريخية. اختر بطاقة لعرض المعلومات والمصادر.</p>
      ${visible.length?`<div class="dc-cards">${visible.map(d=>`<button type="button" class="dc-card ${state.selected===d.id?'selected':''}" data-dates-pick="${d.id}" aria-pressed="${state.selected===d.id}" aria-controls="datesDetail"><span class="dc-card-title">${esc(d.name)} <span aria-hidden="true">↗</span></span><small>${esc(regionText(d))}</small><span class="dc-card-meta"><span>${maturity[d.maturity]||'النضج غير موثق'}</span><span>${d.observations.length?'موعد شهري منشور':badge(d)}</span></span></button>`).join('')}</div>`:'<p class="dc-empty">لم يظهر اسم يطابق البحث. جرّب صيغة محلية أخرى أو امسح عوامل التصفية. عدم ظهور الاسم لا ينفي وجوده في المملكة.</p>'}
      <nav class="dc-pagination" aria-label="صفحات دليل التمور"><button type="button" data-dates-page="${state.page-1}" ${state.page===1?'disabled':''}>السابق</button><span>صفحة ${num(state.page)} من ${num(pages)}</span><button type="button" data-dates-page="${state.page+1}" ${state.page===pages?'disabled':''}>التالي</button></nav>`;
  }
  function setCountry(code,{focus=false}={}) {
    if(!countries.some(item=>item.code===code))return;
    state.country=code;C?.save?.('calendar.dates.country',code);paint();
    if(focus)root.querySelector('#datesCountry')?.focus();
  }
  function syncCountry() {
    const selected=country(state.country),isSaudi=state.country==='SA';
    const select=root.querySelector('#datesCountry');if(select)select.value=state.country;
    root.querySelector('#datesCountryFlag').textContent=flag(selected.code);
    root.querySelector('#datesCountryName').textContent=selected.name;
    root.querySelector('#datesHeroKicker').textContent=isSaudi?'نخيل المملكة · معرفة موثقة':'نخيل العالم · بيانات مستقلة لكل دولة';
    root.querySelector('#datesHeroText').textContent=isSaudi?'واجهة مختصرة لأهم أصناف المملكة، ودليل مستقل للبحث في جميع الأسماء الموثقة.':`أضيفت ${selected.name} إلى نطاق تقويم التمور العالمي، وتبقى بياناتها مستقلة عن بيانات الدول الأخرى.`;
    root.querySelector('#datesSaudiContent').hidden=!isSaudi;
    root.querySelector('#datesCountryEmpty').hidden=isSaudi;
    if(!isSaudi){
      root.querySelector('#datesEmptyFlag').textContent=flag(selected.code);
      root.querySelector('#datesEmptyCountry').textContent=selected.name;
      root.querySelector('#datesEmptyCode').textContent=selected.code;
    }
  }
  function setView(view,{focus=false}={}) {
    state.view=view==='all'?'all':'featured';C?.save?.('calendar.dates.view',state.view);
    root.querySelectorAll('[data-dates-view]').forEach(button=>{const active=button.dataset.datesView===state.view;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    root.querySelector('#datesFeaturedView').hidden=state.view!=='featured';
    root.querySelector('#datesAllView').hidden=state.view!=='all';
    if(focus)root.querySelector(`[data-dates-view="${state.view}"]`)?.focus();
  }
  function paint({focusDetail=false,focusList=false,focusFeatured=false}={}) {
    syncCountry();
    if(state.country!=='SA')return;
    const items=filter();
    if(!items.some(d=>d.id===state.selected))state.selected=items[0]?.id;
    if(!featured.some(d=>d.id===state.featuredSelected))state.featuredSelected=featured[0]?.id;
    root.querySelector('#datesFeaturedGrid').innerHTML=featuredCardsHTML();
    root.querySelector('#datesFeaturedDetail').innerHTML=featuredDetailHTML(featured.find(d=>d.id===state.featuredSelected));
    root.querySelector('#datesSeason').innerHTML=calendarHTML(featured);
    root.querySelector('#datesDetail').innerHTML=detailHTML(items.find(d=>d.id===state.selected));
    root.querySelector('#datesCatalogue').innerHTML=catalogueHTML(items);
    setView(state.view);
    if(focusDetail){root.querySelector('#datesDetail').focus({preventScroll:true});root.querySelector('#datesDetail').scrollIntoView({behavior:'smooth',block:'start'});}
    if(focusList){root.querySelector('#datesCatalogue').focus({preventScroll:true});root.querySelector('#datesCatalogue').scrollIntoView({behavior:'smooth',block:'start'});}
    if(focusFeatured){root.querySelector('#datesFeaturedDetail').focus({preventScroll:true});root.querySelector('#datesFeaturedDetail').scrollIntoView({behavior:'smooth',block:'nearest'});}
  }
  function render(date) {
    selectMonth(date);
    if(!root.querySelector('#datesCountry')){
      root.setAttribute('lang','ar');root.setAttribute('dir','rtl');
      root.innerHTML=`<header class="panel dc-hero"><div class="dc-hero-copy"><span id="datesHeroKicker" class="kicker">نخيل العالم · بيانات مستقلة لكل دولة</span><h2>تقويم التمور</h2><p id="datesHeroText">اختر الدولة لعرض تقويمها وأصنافها الموثقة دون خلط بيانات الدول.</p></div><div class="dc-country-switcher"><div class="dc-country-current"><span id="datesCountryFlag" aria-hidden="true">🇸🇦</span><span><small>الدولة المختارة</small><b id="datesCountryName">المملكة العربية السعودية</b></span></div><label for="datesCountry">اختر الدولة<select id="datesCountry" aria-describedby="datesCountryScope">${countryOptionsHTML()}</select></label><small id="datesCountryScope">${num(countries.length)} دولة في قائمة واحدة</small></div></header>
        <section id="datesCountryEmpty" class="panel dc-country-empty" aria-labelledby="datesCountryEmptyTitle" hidden><div class="dc-country-empty-heading"><span id="datesEmptyFlag" class="dc-country-empty-flag" aria-hidden="true"></span><div><span class="kicker">صفحة دولة مستقلة</span><h3 id="datesCountryEmptyTitle"><span id="datesEmptyCountry"></span></h3><p>هذه الدولة مدرجة في تقويم التمور العالمي، ولا تُعرض فيها بيانات دولة أخرى.</p></div></div><div class="dc-country-empty-facts"><div><small>رمز الدولة</small><b id="datesEmptyCode"></b></div><div><small>حالة البيانات التفصيلية</small><b>لم تُربط مصادرها الوطنية بعد</b></div></div><p class="dc-muted">لن نضع مواعيد أو أصنافًا تقديرية بلا مرجع. عند إضافة مصادر موثقة لهذه الدولة ستظهر مناطقها وأصنافها وبداية الموسم وذروته ونهايته في هذه الصفحة.</p><button type="button" class="primary-button dc-back-saudi" data-dates-country="SA">عرض بيانات المملكة العربية السعودية</button><details class="dc-country-scope"><summary>ما نطاق قائمة الدول؟</summary><p>تشمل القائمة الدول الأعضاء في الأمم المتحدة وعددها ${num(193)}، إضافة إلى فلسطين والكرسي الرسولي (الفاتيكان) بصفتهما دولتين مراقبتين.</p><div><a href="https://www.un.org/en/about-us/member-states" target="_blank" rel="noopener noreferrer">قائمة الدول الأعضاء في الأمم المتحدة ↗</a><a href="https://www.un.org/en/about-us/non-member-states" target="_blank" rel="noopener noreferrer">الدولتان المراقبتان ↗</a></div></details></section>
        <div id="datesSaudiContent">
          <nav class="dc-view-tabs" role="tablist" aria-label="أقسام تقويم التمور"><button id="datesFeaturedViewTab" type="button" class="active" role="tab" aria-selected="true" aria-controls="datesFeaturedView" tabindex="0" data-dates-view="featured"><span aria-hidden="true">★</span> أهم الأصناف</button><button id="datesAllViewTab" type="button" role="tab" aria-selected="false" aria-controls="datesAllView" tabindex="-1" data-dates-view="all"><span aria-hidden="true">☰</span> دليل جميع الأصناف <small>${num(names.length)}</small></button></nav>
          <section id="datesFeaturedView" class="dc-view-panel" role="tabpanel" aria-labelledby="datesFeaturedViewTab">
            <div class="dc-featured-intro"><div><span class="kicker">اختيار سريع</span><h3>أهم الأصناف في المملكة</h3><p>اثنا عشر صنفًا واسع الحضور أو بارزًا تجاريًا وإقليميًا في المراجع المعتمدة. ترتيب البطاقات لا يمثل مفاضلة في الجودة.</p></div><button type="button" class="dc-text-button" data-dates-view-jump="all">ابحث في جميع الأصناف ←</button></div>
            <div class="dc-featured-layout"><section class="panel dc-featured-list"><div id="datesFeaturedGrid" class="dc-featured-grid"></div></section><article id="datesFeaturedDetail" class="panel dc-featured-detail" tabindex="-1" aria-labelledby="datesFeaturedTitle"></article></div>
            <section id="datesSeason" class="panel dc-section" aria-labelledby="datesSeasonTitle"></section>
          </section>
          <section id="datesAllView" class="dc-view-panel" role="tabpanel" aria-labelledby="datesAllViewTab" hidden>
            <div class="dc-stats"><div class="panel"><b>${num(names.length)}</b><span>اسمًا في المراجع</span></div><div class="panel"><b>${num(names.filter(d=>d.traits.length).length)}</b><span>بطاقة بخصائص الثمرة</span></div><div class="panel"><b>${num(Object.keys(D.regions).length)}</b><span>منطقة في دليل الانتشار</span></div><div class="panel"><b>${num(names.filter(d=>d.observations.length).length)}</b><span>أصناف بمواعيد شهرية منشورة</span></div></div>
            <div class="dc-coverage"><b>نطاق الدليل</b><p>يذكر إعلان الوزارة أكثر من ٤٠٤ أصناف في المملكة. تضم هذه النسخة ${num(names.length)} اسمًا وردت في المراجع، بما فيها أسماء محلية وتاريخية؛ وليست حصرًا مكتملًا لكل الأصناف الحية أو عددًا لأصناف مثبتة وراثيًا. لا توجد مواعيد منشورة لكل اسم.</p>${sourceLink({source:'mewaMadina'},'إعلان الوزارة')}</div>
            <section class="panel dc-filter-panel" aria-label="البحث وتصفية أصناف التمور"><div class="dc-filters"><label class="dc-search">الصنف أو الاسم المحلي<input type="search" id="datesSearch" placeholder="مثال: العجوة، نبتة سيف، فنخا…" autocomplete="off" /></label><label>المنطقة<select id="datesRegion"><option value="all">جميع مناطق المملكة</option>${Object.entries(D.regions).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}<option value="unknown">غير محددة في المصدر</option></select></label><label>ترتيب النضج<select id="datesMaturity"><option value="all">جميع المواعيد</option>${Object.entries(maturity).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}<option value="unknown">غير موثق</option></select></label><label>المعلومات المتاحة<select id="datesEvidence"><option value="all">جميع الأسماء</option><option value="profile">خصائص الثمرة</option><option value="monthly">موعد شهري منشور</option><option value="historical">أسماء تاريخية فقط</option></select></label></div><button type="button" id="datesReset" class="dc-text-button">مسح البحث والتصفية</button></section>
            <section id="datesCatalogue" class="panel dc-section" tabindex="-1" aria-label="نتائج البحث في أصناف التمور"></section>
            <section id="datesDetail" class="panel dc-section dc-detail" tabindex="-1" aria-labelledby="datesDetailTitle"></section>
            <details class="panel dc-method"><summary>المصادر وطريقة قراءة التقويم</summary><p>آخر مراجعة: ١٠ سبتمبر ٢٠٢٦. بيانات وصفية من مراجع منشورة، وليست رصدًا مباشرًا لمحصول هذا العام. يختلف الموسم باختلاف الموقع والطقس والمزرعة وطور الثمرة.</p><p>يشمل الدليل الأسماء المقروءة في قوائم المناطق وبطاقات الثمار بدليل المركز الوطني لعام ٢٠٢٤، مع أسماء إضافية من سجل وزارة الزراعة وإعلاناتها. عدّ الأسماء لا يساوي عدّ الأصناف الوراثية، والأسماء المتقاربة لم تُدمج دون دليل. قد تستخدم مناطق مختلفة الاسم نفسه لأصناف محلية مختلفة.</p><p>البسر أو الخلال طور اكتمال حجم الثمرة قبل ترطبها. الرطب طور الليونة، والتمر طور النضج المتقدم. شهر بلوغ أحد هذه الأطوار لا يثبت بدء الجني أو ذروته أو نهايته. «غير موثق» تعني نقص بيانات، وليست «خارج الموسم».</p><p>ترتيب النضج مبكر/متوسط/متأخر من وصف المرجع، ولم يُحوّل إلى تواريخ مصطنعة. يعرض الرصد التاريخي لذروة السكري سنة الرصد ومكانه. الخصائص الوصفية للثمرة ليست مواصفات إلزامية لكل ثمرة أو درجات تجارية.</p><div class="dc-source-list">${Object.entries(D.sources).map(([key,s])=>`<article><b>${sourceLink({source:key},s.title)}</b><small>${esc(s.edition)}</small><p>${esc(s.note)}</p></article>`).join('')}</div></details>
          </section>
        </div>`;
    }
    paint();
  }
  root.addEventListener('input',e=>{if(e.target.id==='datesSearch'){state.query=e.target.value;state.page=1;paint();}});
  root.addEventListener('change',e=>{
    const fields={datesRegion:'region',datesMaturity:'maturity',datesEvidence:'evidence'};
    if(e.target.id==='datesCountry')setCountry(e.target.value);
    else if(fields[e.target.id]){state[fields[e.target.id]]=e.target.value;state.page=1;paint();}
    else if(e.target.id==='datesMonth'){const m=Number(e.target.value);if(m>=1&&m<=12){state.month=m;state.manualMonth=true;paint();}}
  });
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.datesCountry){setCountry(b.dataset.datesCountry,{focus:true});}
    else if(b.dataset.datesView){setView(b.dataset.datesView);}
    else if(b.dataset.datesViewJump){setView(b.dataset.datesViewJump,{focus:true});}
    else if(b.dataset.datesFeature){state.featuredSelected=b.dataset.datesFeature;paint({focusFeatured:true});}
    else if(b.dataset.datesOpenAll){state.selected=b.dataset.datesOpenAll;state.view='all';paint({focusDetail:true});C?.save?.('calendar.dates.view','all');}
    else if(b.dataset.datesPick){state.selected=b.dataset.datesPick;paint({focusDetail:true});}
    else if(b.dataset.datesMonth){state.month=Number(b.dataset.datesMonth);state.manualMonth=true;paint();root.querySelector(`[data-dates-month="${state.month}"]`)?.focus({preventScroll:true});}
    else if(b.dataset.datesPage&&!b.disabled){state.page=Math.max(1,Number(b.dataset.datesPage));paint({focusList:true});}
    else if(b.id==='datesReset'){
      Object.assign(state,{query:'',region:'all',maturity:'all',evidence:'all',page:1});
      root.querySelector('#datesSearch').value='';for(const id of ['datesRegion','datesMaturity','datesEvidence'])root.querySelector('#'+id).value='all';paint();root.querySelector('#datesSearch').focus();
    }
  });
  window.DatesCalendar={render,filter,normalize,featured,countries};
})();
