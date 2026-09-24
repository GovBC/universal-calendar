const test=require('node:test');
const assert=require('node:assert/strict');
global.Astronomy=require('../dist/vendor/astronomy.browser.min.js');
require('../dist/mooncalc.js');require('../dist/zodiac-data.js');require('../dist/zodiac-calc.js');
const A=global.Astronomy,C=global.ZodiacCalc,D=global.ZodiacData,L=global.LunarCalc;
const loc={lat:24.4672,lon:39.6111,zone:'Asia/Riyadh',elevation:0};
const date=new Date('2026-09-06T18:00:00Z');
test('all 13 physical constellations and 28 mansions have usable reference data',()=>{
 assert.equal(D.constellations.length,13);assert.ok(D.constellations.some(x=>x.id==='Oph'));assert.equal(D.mansions.length,28);
 const hip=new Set(D.stars.map(s=>s.hip));assert.equal(hip.size,D.stars.length);
 for(const s of [...D.constellations,...D.mansions]){if(s.ref)assert.ok(hip.has(s.ref));else{assert.equal(s.id,'m21');assert.deepEqual(s.coord,[285,-21]);}for(const id of s.stars||[])assert.ok(hip.has(id));}
});
test('star horizon coordinates agree with independent sidereal spherical formula in both hemispheres',()=>{
 for(const latitude of [-70,-33.9,0,24.4672,70])for(const id of [9884,21421,65474,80763,106278]){
  const s=D.stars.find(x=>x.hip===id),l={...loc,lat:latitude},f=C.frame(date,l),actual=C.star(s,f);
  const eq=A.EquatorFromVector(A.RotateVector(A.Rotation_EQJ_EQD(date),new A.Vector(...C.equatorial(s.ra,s.dec),date)));
  const H=(A.SiderealTime(date)*15+l.lon-eq.ra*15)*C.D,phi=l.lat*C.D,dec=eq.dec*C.D;
  const alt=Math.asin(Math.sin(phi)*Math.sin(dec)+Math.cos(phi)*Math.cos(dec)*Math.cos(H))/C.D;
  const az=C.mod(Math.atan2(-Math.sin(H),Math.tan(dec)*Math.cos(phi)-Math.sin(phi)*Math.cos(H))/C.D);
  assert.ok(Math.abs(actual.altitude-alt)<1e-8);assert.ok(Math.abs(actual.azimuth-az)<1e-8);
 }
});
test('six hours of daily rotation agrees with a 90 degree longitude shift',()=>{
 const s=D.stars.find(s=>s.hip===9884),a=C.star(s,C.frame(date,loc));
 const b=C.star(s,C.frame(new Date(+date+21600000),loc));
 const c=C.star(s,C.frame(date,{...loc,lon:loc.lon+90}));
 assert.ok(Math.abs(a.altitude-b.altitude)>20);assert.ok(Math.abs(b.altitude-c.altitude)<1);
});
test('real Sun constellation includes Ophiuchus and differs from tropical sign',()=>{
 const identity=C.solarIdentity(new Date('2026-12-10T12:00:00Z'));
 assert.equal(identity.constellation,'Oph');assert.equal(identity.sign,8);
 const s=C.solarIdentity(date);assert.equal(s.constellation,'Leo');assert.equal(s.sign,5);
});
test('lunar plane inclination and arc agree and the geocentric Moon lies on the plane',()=>{
 for(const d of [date,new Date('2026-03-20T00:00:00Z'),new Date('2030-01-01T00:00:00Z')]){
  const f=C.frame(d,loc),p=C.lunarPlane(f),angle=Math.acos(C.dot(p.arc[0],p.arc.at(-1)))/C.D;
  assert.ok(p.inclination>4.8&&p.inclination<5.5);assert.ok(Math.abs(angle-p.inclination)<1e-7);
  for(const v of p.path)assert.ok(Math.abs(Math.hypot(...v)-1)<1e-12);
  const m=A.GeoMoon(d),expected=C.norm(C.rotate(f.hor,[m.x,m.y,m.z],d));
  assert.ok(Math.hypot(...p.path[0].map((v,i)=>v-expected[i]))<1e-6);
 }
});
test('future rise/set are horizon crossings with correct directions and polar statuses',()=>{
 const s=D.stars.find(x=>x.hip===9884),e=C.starEvents(s,date,loc);
 assert.ok(e.rise>date&&e.rise<+date+86400000);assert.ok(e.set>date&&e.set<+date+86400000);
 for(const [t,dir] of [[e.rise,1],[e.set,-1]]){
  const before=C.star(s,C.frame(new Date(+t-60000),loc)).altitude,after=C.star(s,C.frame(new Date(+t+60000),loc)).altitude;
  assert.ok(before*dir<0&&after*dir>0);
 }
 assert.ok(C.starEvents({ra:0,dec:89},date,{...loc,lat:70}).alwaysUp);
 assert.ok(C.starEvents({ra:0,dec:-89},date,{...loc,lat:70}).alwaysDown);
});
test('local date controls retain leap day and daylight saving day lengths',()=>{
 const leap=L.localDate('2028-02-29',12*60,'Asia/Riyadh');assert.equal(L.dateISO(leap,'Asia/Riyadh'),'2028-02-29');
 const short=L.dayBounds('2026-03-29','Europe/London'),long=L.dayBounds('2026-10-25','Europe/London');
 assert.equal((short.end-short.start)/3600000,23);assert.equal((long.end-long.start)/3600000,25);
});
