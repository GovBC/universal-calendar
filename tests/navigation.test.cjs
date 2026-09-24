const fs=require('node:fs'),vm=require('node:vm'),test=require('node:test'),assert=require('node:assert/strict');

function loadNavigation(hash='#today',saved=''){
  const listeners={};
  const sessionStorage={getItem(){return saved},setItem(key,value){saved=value}};
  const context={
    location:{hash,pathname:'/',search:''},
    history:{pushState(){},replaceState(){}},
    document:{querySelector(){return null},addEventListener(){}},
    sessionStorage,queueMicrotask,
    setRoute(){},setCelestialTab(){},
    window:{CSS:{escape:String},addEventListener(type,handler){listeners[type]=handler}}
  };
  context.window.window=context.window;
  vm.runInNewContext(fs.readFileSync('dist/navigation-state.js','utf8'),context);
  return context.window.CalendarNavigation;
}

test('navigation hash restores main pages and their nested tabs',()=>{
 const navigation=loadNavigation();
 assert.deepEqual({...navigation.parseHash('#calendar/agriculture')},{route:'calendar',calendar:'agriculture'});
 assert.deepEqual({...navigation.parseHash('#followups/deaths')},{route:'followups',followups:'deaths'});
 assert.deepEqual({...navigation.parseHash('#games')},{route:'games'});
 assert.deepEqual({...navigation.parseHash('#youth/regeneration')},{route:'youth',youth:'regeneration'});
 assert.deepEqual({...navigation.parseHash('#platform/dua')},{route:'platform',platform:'dua'});
});

test('navigation hash restores nested celestial and earth tabs, including legacy links',()=>{
  const navigation=loadNavigation();
  assert.deepEqual({...navigation.parseHash('#celestial/moon/history')},{route:'celestial',celestial:'moon',moon:'history'});
  assert.deepEqual({...navigation.parseHash('#celestial/heritage/timeline')},{route:'celestial',celestial:'heritage',heritage:'timeline'});
  assert.deepEqual({...navigation.parseHash('#magnetosphere')},{route:'earth',earth:'magnetosphere'});
  assert.deepEqual({...navigation.parseHash('#earth/interior')},{route:'earth',earth:'interior'});
  assert.deepEqual({...navigation.parseHash('#earth/surface')},{route:'earth',earth:'surface'});
  assert.deepEqual({...navigation.parseHash('#celestial/shape')},{route:'earth',earth:'shape'});
});

test('navigation state survives a refresh even when the browser drops the hash',()=>{
  const navigation=loadNavigation('','#calendar/fishing');
  assert.equal(navigation.rememberedHash(),'#calendar/fishing');
  assert.deepEqual({...navigation.parseHash(navigation.rememberedHash())},{route:'calendar',calendar:'fishing'});
});

test('the main page is restored before the interface first paints',()=>{
  const source=fs.readFileSync('dist/app.js','utf8');
  const start=source.indexOf('function initialNavigation()');
  const end=source.indexOf('const initial=initialNavigation();',start);
  const context={location:{hash:'#celestial/heritage/timeline'},sessionStorage:{getItem(){return '#today'}},routes:{today:[],celestial:[],calendar:[],followups:[]}};
  vm.runInNewContext(source.slice(start,end),context);
  assert.deepEqual({...context.initialNavigation()},{route:'celestial',celestial:'heritage'});
  context.location.hash='';context.sessionStorage.getItem=()=> '#followups/sports';
  assert.deepEqual({...context.initialNavigation()},{route:'followups'});
  context.location.hash='#earth/surface';
  assert.deepEqual({...context.initialNavigation()},{route:'earth',earth:'surface'});
});
