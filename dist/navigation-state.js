(function(){
  const mainRoutes=new Set(['today','calendar','prayer','worship','platform','celestial','earth','games','followups','youth','localization','assistant']);
  const platformTabs=new Set(['adhan','recitation','dua']);
  const celestialTabs=new Set(['moon','sky','heritage','sync']);
  const earthTabs=new Set(['magnetosphere','atmosphere','interior','surface','tilt','shape']);
  const legacyCelestial=new Set(['crescent','sky','heritage','sync']);
  const sessionKey='calendar.navigation-state';
  let restoring=false;

  function remember(hash){
    try{sessionStorage.setItem(sessionKey,hash)}catch{}
    return hash;
  }

  function rememberedHash(){
    try{return sessionStorage.getItem(sessionKey)||''}catch{return ''}
  }

  function selected(selector,key,fallback){
    const active=document.querySelector(`${selector}.active[${key}]`)||document.querySelector(`${selector}[aria-selected="true"][${key}]`);
    return active?.getAttribute(key)||fallback;
  }

  function activeRoute(){
    const navigation=document.querySelector('.side-nav [data-route].active, .mobile-nav [data-route].active, .more-grid [data-route].active');
    if(navigation?.dataset.route)return navigation.dataset.route;
    const page=document.querySelector('.page.active');
    if(!page)return 'today';
    if(page.id.startsWith('celestial-'))return 'celestial';
    if(page.id.startsWith('earth-'))return 'earth';
    return page.id;
  }

  function currentHash(){
    const route=activeRoute();
    const parts=[route];
    if(route==='calendar')parts.push(selected('[data-calendar-tab]','data-calendar-tab','dates'));
    if(route==='followups')parts.push(selected('[data-followups-tab]','data-followups-tab','news'));
    if(route==='youth')parts.push(selected('[data-youth-tab]','data-youth-tab','engineering'));
    if(route==='platform')parts.push(selected('[data-platform-tab]','data-platform-tab','adhan'));
    if(route==='celestial'){
      const celestial=selected('[data-celestial-tab]','data-celestial-tab','moon');
      parts.push(celestial);
      if(celestial==='moon')parts.push(selected('[data-moon-info-tab]','data-moon-info-tab','mansions'));
      if(celestial==='heritage')parts.push(selected('[data-heritage-tab]','data-heritage-tab','zodiac'));
    }
    if(route==='earth')parts.push(selected('[data-earth-tab]','data-earth-tab','magnetosphere'));
    return '#'+parts.join('/');
  }

  function parseHash(hash=location.hash){
    let decoded='';
    try{decoded=decodeURIComponent(String(hash).replace(/^#/,''))}catch{}
    const parts=decoded.split('/').filter(Boolean);
    if(!parts.length)return {route:'today'};
    if(legacyCelestial.has(parts[0]))return {route:'celestial',celestial:parts[0]==='crescent'?'moon':parts[0]};
    if(earthTabs.has(parts[0]))return {route:'earth',earth:parts[0]};
    const route=mainRoutes.has(parts[0])?parts[0]:'today';
    if(route==='celestial'&&earthTabs.has(parts[1]))return {route:'earth',earth:parts[1]};
    const state={route};
    if(route==='calendar')state.calendar=parts[1]||'dates';
    if(route==='followups')state.followups=parts[1]||'news';
    if(route==='youth')state.youth=parts[1]||'engineering';
    if(route==='platform')state.platform=platformTabs.has(parts[1])?parts[1]:'adhan';
    if(route==='celestial'){
      state.celestial=celestialTabs.has(parts[1])?parts[1]:'moon';
      if(state.celestial==='moon')state.moon=parts[2]||'mansions';
      if(state.celestial==='heritage')state.heritage=parts[2]||'zodiac';
    }
    if(route==='earth')state.earth=earthTabs.has(parts[1])?parts[1]:'magnetosphere';
    return state;
  }

  function choose(attribute,value){
    if(!value)return;
    const escaped=window.CSS?.escape?window.CSS.escape(value):String(value).replace(/[^a-z0-9_-]/gi,'');
    document.querySelector(`[${attribute}="${escaped}"]`)?.click();
  }

  function sync(mode='replace'){
    if(restoring)return;
    const hash=remember(currentHash());
    if(location.hash===hash)return;
    history[mode==='push'?'pushState':'replaceState'](null,'',location.pathname+location.search+hash);
  }

  function restore(){
    const targetHash=location.hash||rememberedHash();
    if(!targetHash)return;
    const state=parseHash(targetHash);
    restoring=true;
    try{
      if(state.route==='celestial'){
        setCelestialTab(state.celestial||'moon',false);
      }else if(state.route==='earth'){
        setEarthTab(state.earth||'magnetosphere',false);
      }else{
        setRoute(state.route,false);
      }
      if(state.route==='calendar')choose('data-calendar-tab',state.calendar);
      if(state.route==='followups')choose('data-followups-tab',state.followups);
      if(state.route==='youth')choose('data-youth-tab',state.youth);
      if(state.route==='platform')choose('data-platform-tab',state.platform);
      if(state.route==='celestial'&&state.celestial==='moon')choose('data-moon-info-tab',state.moon);
      if(state.route==='celestial'&&state.celestial==='heritage')choose('data-heritage-tab',state.heritage);
    }finally{
      restoring=false;
    }
    remember(currentHash());
    const normalized=currentHash();
    if(location.hash!==normalized)history.replaceState(null,'',location.pathname+location.search+normalized);
  }

  document.addEventListener('click',event=>{
    const control=event.target.closest('[data-route],[data-celestial-tab],[data-earth-tab],[data-calendar-tab],[data-followups-tab],[data-youth-tab],[data-platform-tab],[data-moon-info-tab],[data-heritage-tab]');
    if(!control||restoring)return;
    queueMicrotask(()=>sync(control.matches('[data-route],[data-celestial-tab],[data-earth-tab]')?'replace':'push'));
  });
  window.addEventListener('load',restore,{once:true});
  window.addEventListener('popstate',restore);
  window.addEventListener('hashchange',restore);
  window.addEventListener('pagehide',()=>remember(currentHash()));
  document.addEventListener('DOMContentLoaded',restore,{once:true});
  window.CalendarNavigation={parseHash,currentHash,rememberedHash,sync,restore};
})();
