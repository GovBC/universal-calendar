const fs=require('node:fs');
const vm=require('node:vm');
const test=require('node:test');
const assert=require('node:assert/strict');
const Astronomy=require('../dist/vendor/astronomy.browser.min.js');

const context={Astronomy,Date};
vm.runInNewContext(fs.readFileSync('dist/mooncalc.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('dist/core.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('dist/prayer-time-game.js','utf8'),context);
const game=context.PrayerTimeGameModel;

test('the prayer game uses the same calculated Makkah day as the prayer page',()=>{
  const now=new Date('2026-09-11T12:00:00Z');
  const day=game.buildTrainingDay(now,context.CalendarCore.defaults);
  assert.equal(day.fallback,false);
  assert.equal(day.prayers.methodName,'أم القرى');
  assert.equal(day.missions.length,5);
  assert.deepEqual(Array.from(day.missions,item=>item.id),['fajr','dhuhr','asr','maghrib','isha']);
  const targets=day.missions.map(item=>item.target);
  assert.ok(targets.every((target,index)=>index===0||target>targets[index-1]));
  assert.equal(targets[4]-targets[3],90);
  day.missions.forEach(mission=>assert.equal(game.evaluate(mission.target,mission.start).solved,false,mission.id));
});

test('Bahrain training follows the Zubarah method and astronomical Isha',()=>{
  const bahrain={name:'المنامة',lat:26.2235,lon:50.5876,elevation:4,zone:'Asia/Bahrain',fajr:18.5,asr:1,prayerMethod:'auto'};
  const day=game.buildTrainingDay(new Date('2026-09-11T12:00:00Z'),bahrain);
  assert.equal(day.fallback,false);
  assert.equal(day.prayers.methodName,'روزنامة الزبارة والبحرين');
  assert.equal(day.prayers.ishaRule,'angle18');
  assert.ok(day.missions.find(item=>item.id==='isha').target>day.missions.find(item=>item.id==='maghrib').target);
});

test('high-latitude days without all five solar events fall back to Makkah training',()=>{
  const polar={name:'موقع قطبي',lat:89,lon:0,elevation:0,zone:'UTC',fajr:18.5,asr:1,prayerMethod:'ummalqura'};
  const day=game.buildTrainingDay(new Date('2026-06-21T12:00:00Z'),polar);
  assert.equal(day.fallback,true);
  assert.equal(day.loc.name,'مكة المكرمة');
  assert.equal(day.missions.length,5);
});

test('four-minute game tolerance and shadow ratios are internally consistent',()=>{
  assert.equal(game.evaluate(720,716).solved,true);
  assert.equal(game.evaluate(720,724).solved,true);
  assert.equal(game.evaluate(720,715).solved,false);
  assert.equal(game.evaluate(720,725).direction,'late');
  assert.equal(game.evaluate(720,700).direction,'early');
  assert.equal(game.shadowRatio(0),null);
  assert.ok(Math.abs(game.shadowRatio(45)-1)<1e-12);
  assert.ok(Math.abs(game.shadowRatio(Math.atan(.5)*180/Math.PI)-2)<1e-12);
});

test('completed prayers award once and a new round clears the score',()=>{
  const session=game.createSession();
  session.complete('fajr');session.complete('fajr');session.complete('unknown');
  assert.equal(session.count,1);assert.equal(session.score,100);
  game.keys.forEach(key=>session.complete(key));
  assert.equal(session.count,5);assert.equal(session.score,500);
  session.reset();assert.equal(session.count,0);assert.equal(session.has('fajr'),false);
});

test('prayer game is selectable, loaded after calculations and cached offline',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  const controller=fs.readFileSync('dist/educational-games.js','utf8');
  const sw=fs.readFileSync('dist/sw.js','utf8');
  assert.match(html,/data-educational-game="prayer"[^>]*aria-controls="prayerTimeGamePane"/);
  assert.match(html,/id="prayerTimeGamePane"[^>]*hidden/);
  assert.match(controller,/global\.PrayerTimeGame\?\.activate/);
  assert.ok(html.indexOf('./core.js')<html.indexOf('./prayer-time-game.js'));
  assert.ok(html.indexOf('./prayer-time-game.js')<html.indexOf('./educational-games.js'));
  for(const asset of ['prayer-time-game.js','prayer-time-game.css']){
    assert.ok(fs.existsSync('dist/'+asset));
    assert.ok(html.includes('./'+asset));
    assert.ok(sw.includes('./'+asset));
  }
});
