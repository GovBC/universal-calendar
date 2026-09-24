const fs=require('node:fs'),vm=require('node:vm'),test=require('node:test'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/earth-ocean.js','utf8'),context={};vm.runInNewContext(source,context);const math=context.EarthOceanMath;
test('ocean atlas uses one vertical scale above and below sea level',()=>{
  assert.equal(math.scalePercent(8000),math.scalePercent(-8000));assert.equal(math.scalePercent(1000),5);
  assert.equal(math.records.filter(r=>r.kind==='deep').length,5);assert.equal(math.records.filter(r=>r.kind==='peak').length,3);
  assert.equal(math.records.find(r=>r.id==='everest').value,8848.86);assert.equal(math.records.find(r=>r.id==='challenger').value,-10924);
  assert.ok(math.records.every(r=>r.kind==='peak'?r.value>0:r.value<0));
});
test('equirectangular map places dateline, equator and poles correctly',()=>{
  assert.deepEqual([...math.project(-180,90)],[0,0]);assert.deepEqual([...math.project(0,0)],[50,50]);assert.deepEqual([...math.project(180,-90)],[100,100]);
  for(const p of math.records)assert.ok(math.project(p.lon,p.lat).every(n=>n>=0&&n<=100));
});
test('educational tide range peaks at new/full moons and weakens at quadrature',()=>{
  assert.equal(math.tideAmplitude(0),1.5);assert.equal(math.tideAmplitude(180),1.5);assert.equal(math.tideAmplitude(90),.5);assert.equal(math.tideAmplitude(270),.5);
  for(let a=0;a<=360;a++)assert.ok(math.tideAmplitude(a)>=.5&&math.tideAmplitude(a)<=1.5);
});
test('SST dates are discovered without guessing today and data gaps are rejected',()=>{
  const domain='2002-06-01/2026-09-05/P1D,2026-09-07,2026-09-09';
  assert.equal(math.latestDate(domain),'2026-09-09');assert.equal(math.dateAvailable('2026-09-06',domain),false);assert.equal(math.dateAvailable('2026-09-10',domain),false);assert.equal(math.dateAvailable('2026-09-04',domain),true);
  assert.match(source,/VERSION:'1.1.1'/);assert.match(source,/BBOX:'-180,-90,180,90'/);assert.match(source,/token!==request/);assert.match(source,/SNAPSHOT='2026-09-09'/);
});
test('ocean atlas assets, script targets and every Earth tab are wired',()=>{
  const html=fs.readFileSync('dist/index.html','utf8'),sw=fs.readFileSync('dist/sw.js','utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);const targets=[...source.matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]);
  for(const id of targets)assert.equal(ids.filter(x=>x===id).length,1,id);
  for(const file of ['earth-ocean.js','earth-ocean.css','data/etopo1-relief-2160.jpg','data/ocean-sst-2026-09-09.png','data/ocean-sst-legend.png']){assert.ok(fs.existsSync('dist/'+file),file);assert.ok(sw.includes('./'+file),file);}
  const tabs=[...html.matchAll(/<div class="celestial-tabs[^>]*aria-label="تبويبات صفحة الأرض"[\s\S]*?<\/div>/g)];assert.equal(tabs.length,6);tabs.forEach(t=>assert.equal((t[0].match(/data-earth-tab="surface"/g)||[]).length,1));
  assert.match(source,/oceanCurrentsMap'\)\.toggleAttribute\('hidden'/);
});
