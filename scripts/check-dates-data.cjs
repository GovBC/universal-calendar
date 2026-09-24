// Run with node scripts/check-dates-data.cjs. Checks evidence and important regression risks.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const context={window:{}};vm.createContext(context);vm.runInContext(read('dist/dates-data.js'),context);
const D=context.window.SaudiDatesData,all=D.cultivars,find=name=>all.find(d=>d.name===name);
assert.equal(new Set(all.map(d=>d.id)).size,all.length);
assert.equal(Object.keys(D.regions).length,13);
for(const r of Object.keys(D.regions))assert(all.some(d=>d.regions.includes(r)),`Empty region ${r}`);
for(const d of all){
  assert(d.refs.length,`No citation for ${d.name}`);
  for(const r of d.refs){assert(D.sources[r.source]);if(r.region)assert(d.regions.includes(r.region));if(r.page)assert(Number.isInteger(r.page)&&r.page>0);}
  for(const r of d.regions)assert(D.regions[r]);
  assert.equal(d.start,null,`Unverified start: ${d.name}`);assert.equal(d.peak,null,`Unverified peak: ${d.name}`);assert.equal(d.end,null,`Unverified end: ${d.name}`);
  if(d.maturity)assert(d.maturityRef&&D.sources[d.maturityRef.source]);
  assert.equal(new Set(d.traits.map(t=>t.stage)).size,d.traits.length,`Duplicate ambiguous stage: ${d.name}`);
  for(const t of d.traits){assert(['بسر','رطب','تمر'].includes(t.stage));assert(t.page>=49&&t.page<=212);}
  for(const o of d.observations){assert(o.months.length);assert(o.ref?.page&&D.sources[o.ref.source]);assert(o.scope);for(const m of o.months)assert(Number.isInteger(m)&&m>=1&&m<=12);}
}
assert(find('عجوة').observations.some(o=>o.kind==='tamr'&&o.months.includes(8)));
assert(find('عجوة').observations.every(o=>o.kind!=='rutab'));
assert(find('غر').observations.some(o=>o.kind==='rutab'&&o.months.includes(6)));
assert.equal(find('سكري أحمر').observations.length,0,'Do not copy Sukkari timing to red Sukkari');
assert(find('نبتة قرين'));assert(find('نبوت سيف').aliases.includes('نبتة سيف'));
assert.equal(D.historicalPeak.year,2020);assert.equal(D.historicalPeak.region,'qassim');
const html=read('dist/index.html');assert(html.indexOf('src="./dates-data.js"')<html.indexOf('src="./dates-calendar.js"'));
for(const f of ['dates-data.js','dates-calendar.js','dates-calendar.css'])assert(read('dist/sw.js').includes(`'./${f}'`));
for(const f of ['dates-calendar.js','dates-data.js','fishing.js','live-app.js','sw.js'])new vm.Script(read('dist/'+f),{filename:f});
console.log(`PASS: ${all.length} cited names; 13 regions; ${all.filter(d=>d.traits.length).length} fruit profiles; ${all.filter(d=>d.observations.length).length} cultivars with monthly evidence; no inferred harvest boundaries.`);
