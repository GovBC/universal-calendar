const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const context={Intl,Date,Math,Number};vm.createContext(context);
for(const file of ['vendor/astronomy.browser.min.js','mooncalc.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),context);
const C=context.LunarCalc,loc={lat:23.588,lon:58.3829,elevation:25,zone:'Asia/Muscat'};
test('Muscat events agree within one minute with USNO on 2025-03-01',()=>{
 // https://aa.usno.navy.mil/api/rstt/oneday?date=2025-03-01&coords=23.588,58.3829&tz=4
 const e=C.evening('2025-03-01',loc);
 for(const [key,utc] of [['sunset','14:09'],['rise','03:19'],['set','15:43']])assert(Math.abs(e[key]-Date.parse('2025-03-01T'+utc+':00Z'))<60000);
 assert(Math.abs(C.previousNewMoon(e.start)-Date.parse('2025-02-28T00:45:00Z'))<60000);
});
test('local dates respect DST and reject nonexistent wall times',()=>{
 for(const [iso,h] of [['2026-03-08',23],['2026-11-01',25]]){const b=C.dayBounds(iso,'America/New_York');assert.equal((b.end-b.start)/3600000,h);}
 assert.throws(()=>C.localDate('2026-03-08',150,'America/New_York'));
});
test('polar days without sunset do not receive a crescent classification',()=>{
 for(const iso of ['2026-06-21','2026-12-21']){const e=C.evening(iso,{lat:69.6492,lon:18.9553,elevation:10,zone:'Europe/Oslo'});assert.equal(e.sunset,null);assert.equal(e.zone,null);assert.equal(e.best,null);}
});
test('waning Moon is excluded, and obstructions can eliminate the available interval',()=>{
 assert.equal(C.evening('2026-09-06',loc).zone,null);
 const e=C.evening('2025-03-01',loc,30);assert.equal(e.blocked,true);assert.equal(e.window,null);
});
test('Odeh boundary inclusivity',()=>{
 assert.equal(C.grade(5.65),'A');assert.equal(C.grade(2),'B');assert.equal(C.grade(-.96),'C');assert.equal(C.grade(-.96001),'D');
});
test('event searches do not leak into the next local day',()=>{
 for(const l of [{lat:-33.8688,lon:151.2093,elevation:58,zone:'Australia/Sydney'},{lat:0,lon:179.9,elevation:0,zone:'Pacific/Kiritimati'}]){const e=C.evening('2026-09-06',l);for(const k of ['rise','set','sunset'])if(e[k])assert(e[k]>=e.start&&e[k]<e.end);}
});
