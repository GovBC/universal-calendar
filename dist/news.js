(() => {
  'use strict';
  const root = document.getElementById('followupsNews');
  if (!root) return;
  const countrySelect = document.getElementById('newsCountry');
  const cityInput = document.getElementById('newsCity');
  const suggestions = document.getElementById('newsCitySuggestions');
  const cityCountry = document.getElementById('newsCityCountry');
  const countries = 'AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW'.split(' ');
  const names = new Intl.DisplayNames(['ar'], { type: 'region' });
  countries.map(code => ({ code, name: names.of(code) })).sort((a,b) => a.name.localeCompare(b.name,'ar')).forEach(({code,name}) => {
    const option = document.createElement('option');
    option.value = code; option.textContent = name; countrySelect.append(option);
  });
  countrySelect.value = CalendarCore.read('calendar.newsCountry','SA');
  cityInput.value = CalendarCore.read('calendar.newsCity','مكة المكرمة');
  const cities = { SA:['مكة المكرمة','المدينة المنورة','الرياض','جدة','الدمام','الطائف','أبها','تبوك'], AE:['أبوظبي','دبي','الشارقة'], EG:['القاهرة','الإسكندرية','الجيزة'], QA:['الدوحة'], KW:['مدينة الكويت'], BH:['المنامة'], OM:['مسقط'], JO:['عمّان'], IQ:['بغداد','البصرة'], MA:['الرباط','الدار البيضاء'], DZ:['الجزائر','وهران'], TN:['تونس'], LB:['بيروت'], US:['نيويورك','واشنطن'], GB:['لندن'], TR:['أنقرة','إسطنبول'] };
  function updateCityOptions() {
    cityCountry.textContent = names.of(countrySelect.value);
    suggestions.replaceChildren();
    (cities[countrySelect.value] || []).forEach(name => { const option=document.createElement('option'); option.value=name; suggestions.append(option); });
  }
  updateCityOptions();
  const requests = new Map();
  const cache = new Map();
  let initialized = false;
  function locations(scope) {
    const country = names.of(countrySelect.value);
    if(scope === 'world') return { label:'العالم', rss:'https://news.google.com/rss/headlines/section/topic/WORLD?hl=ar&gl=SA&ceid=SA:ar', more:'https://news.google.com/headlines/section/topic/WORLD?hl=ar&gl=SA&ceid=SA:ar' };
    const city = cityInput.value.trim();
    const query = scope === 'city' ? '"'+city+'" "'+country+'"' : '"'+country+'"';
    const params = new URLSearchParams({q:query+' when:7d',hl:'ar',gl:'SA',ceid:'SA:ar'});
    return {label:scope==='city'? city+'، '+country:country, rss:'https://news.google.com/rss/search?'+params, more:'https://news.google.com/search?'+params};
  }
  function safeLink(value) {
    try { const url=new URL(value); return url.protocol==='https:'?url.href:null; } catch { return null; }
  }
  function renderItems(container, items) {
    container.replaceChildren();
    items.slice(0,6).forEach(item => {
      const href=safeLink(item.link);
      if(!href || typeof item.title !== 'string' || !item.title.trim()) return;
      const article=document.createElement('article'); article.className='news-item';
      const heading=document.createElement('h4'); const link=document.createElement('a');
      link.href=href; link.target='_blank'; link.rel='noopener noreferrer'; link.textContent=item.title;
      heading.append(link); article.append(heading);
      // rss2json returns UTC timestamps without an explicit timezone.
      const raw=String(item.pubDate||'');
      const date=new Date(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)?raw.replace(' ','T')+'Z':raw);
      if(Number.isFinite(date.getTime())) { const time=document.createElement('time');time.dateTime=date.toISOString();time.textContent=date.toLocaleString('ar',{dateStyle:'medium',timeStyle:'short'});article.append(time); }
      container.append(article);
    });
  }
  async function load(scope, force=false) {
    const panel=root.querySelector('[data-news-scope="'+scope+'"]');
    const status=panel.querySelector('.news-status'), items=panel.querySelector('.news-items'), more=panel.querySelector('.news-more');
    requests.get(scope)?.abort();
    const controller=new AbortController(); requests.set(scope,controller);
    if(scope==='city' && !cityInput.value.trim()) {
      items.replaceChildren(); more.hidden=true; status.textContent='اكتب اسم مدينة لعرض أخبارها.';panel.removeAttribute('aria-busy');return;
    }
    const location=locations(scope);
    more.href=location.more;more.hidden=false;
    items.replaceChildren();status.textContent='جارٍ تحميل أخبار '+location.label+'…';panel.setAttribute('aria-busy','true');
    const timeout=setTimeout(()=>controller.abort(),15000);
    try {
      let data=cache.get(location.rss);
      if(force || !data || Date.now()-data.fetchedAt>600000) {
        const response=await fetch('https://api.rss2json.com/v1/api.json?'+new URLSearchParams({rss_url:location.rss}),{signal:controller.signal,credentials:'omit'});
        if(!response.ok) throw new Error('feed_unavailable');
        const payload=await response.json();
        if(payload.status!=='ok'||!Array.isArray(payload.items)) throw new Error('invalid_feed');
        data={items:payload.items,fetchedAt:Date.now()};cache.set(location.rss,data);
      }
      if(requests.get(scope)!==controller) return;
      renderItems(items,data.items);
      status.textContent=items.children.length ? 'أخبار '+location.label+' • جُلبت '+new Date(data.fetchedAt).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit',hourCycle:CalendarCore.hourCycle}) : 'لا توجد عناوين متاحة لهذا الاختيار خلال الأيام السبعة الماضية.';
    } catch {
      if(requests.get(scope)!==controller) return;
      status.textContent='تعذّر تحميل أخبار '+location.label+'. أعد المحاولة أو افتح الأخبار عبر الرابط أدناه.';
      const retry=document.createElement('button');retry.type='button';retry.textContent='إعادة المحاولة';retry.addEventListener('click',()=>load(scope,true));items.append(retry);
    } finally {
      clearTimeout(timeout);
      if(requests.get(scope)===controller) panel.removeAttribute('aria-busy');
    }
  }
  function initialize() {
    if(initialized || root.hidden || !document.getElementById('followups').classList.contains('active')) return;
    initialized=true;['world','country','city'].forEach(scope=>load(scope));
  }
  function changeCountry() {
    CalendarCore.save('calendar.newsCountry',countrySelect.value);CalendarCore.save('calendar.newsCity','');updateCityOptions();cityInput.value='';load('country');load('city');
  }
  countrySelect.addEventListener('change',changeCountry);
  document.getElementById('newsCountryForm').addEventListener('submit',event=>{event.preventDefault();load('country',true)});
  document.getElementById('newsCityForm').addEventListener('submit',event=>{event.preventDefault();if(cityInput.value.trim()){CalendarCore.save('calendar.newsCity',cityInput.value.trim());load('city',true);}else{cityInput.value='';cityInput.reportValidity()}});
  root.querySelector('[data-news-refresh]').addEventListener('click',()=>load('world',true));
  document.querySelectorAll('[data-route="followups"],[data-followups-tab="news"]').forEach(button=>button.addEventListener('click',initialize));
  window.addEventListener('hashchange',initialize);
  function refreshVisible(){if(document.hidden||root.hidden||!document.getElementById('followups').classList.contains('active'))return;['world','country','city'].forEach(scope=>load(scope));}
  window.addEventListener('calendar-hour-cycle',refreshVisible);
  setInterval(refreshVisible,600000);document.addEventListener('visibilitychange',refreshVisible);
  initialize();
})();
