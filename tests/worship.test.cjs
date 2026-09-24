const fs=require('node:fs'),vm=require('node:vm'),test=require('node:test'),assert=require('node:assert/strict');
const A=require('../dist/vendor/astronomy.browser.min.js'),saved=new Map(),c=vm.createContext({Astronomy:A,Intl,Date,console,localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)}});
for(const file of ['mooncalc.js','core.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),c);
const C=c.CalendarCore,L=c.LunarCalc,loc={...C.defaults};
test('Ishraq and later Duha are inside the daylight prayer window; sunrise is never a prayer reminder',()=>{
 for(const iso of ['2026-03-20','2026-06-21','2026-09-06','2026-12-21']){
  const p=C.prayers(iso,loc),w=C.worship(iso,loc);
  assert(p.sunrise<w.ishraq&&w.ishraq<w.duhaReminder&&w.duhaReminder<w.duhaEnd&&w.duhaEnd<p.dhuhr);
  assert(!w.events.some(e=>e.date&&+e.date===+p.sunrise));
  assert.notEqual(w.events[0].group,w.events[1].group);
 }
});
test('Witr before Fajr belongs to the preceding night and stays on the correct civil day',()=>{
 const iso='2026-09-06',p=C.prayers(iso,loc),w=C.worship(iso,loc,'before_fajr'),events=w.events.filter(e=>e.key==='witr');
 assert.equal(events.length,1);assert.equal(+events[0].date,+p.fajr-1800000);
 assert(w.previousNight.isha<events[0].date&&events[0].date<w.previousNight.fajr);
 assert.equal(L.dateISO(w.previousNight.isha,loc.zone),'2026-09-05');
 assert.equal(L.dateISO(w.tonight.fajr,loc.zone),'2026-09-07');
});
test('Witr after Isha is a reminder within the night, separate from entry of Isha',()=>{
 const p=C.prayers('2026-09-06',loc),w=C.worship(p.iso,loc,'after_isha'),e=w.events.find(e=>e.key==='witr');
 assert(e.date>p.isha&&e.date<w.tonight.fajr);assert.equal(+e.date,+p.isha+1800000);
});
test('seven local days across DST export one Witr per day without duplicates',()=>{
 const ny={...loc,lat:40.7128,lon:-74.006,zone:'America/New_York'};
 for(const start of ['2026-03-06','2026-10-30'])for(const mode of ['before_fajr','after_isha']){
  let iso=start;const dates=[];
  for(let i=0;i<7;i++){const p=C.prayers(iso,ny),w=C.worship(iso,ny,mode),events=w.events.filter(e=>e.key==='witr');assert.equal(events.length,1);assert.equal(L.dateISO(events[0].date,ny.zone),iso);dates.push(+events[0].date);iso=L.dateISO(new Date(+p.end+3600000),ny.zone);}
  assert.equal(new Set(dates).size,7);
 }
});
test('polar day does not fabricate Ishraq, Duha or Witr',()=>{
 const w=C.worship('2026-06-21',{...loc,lat:69.6492,lon:18.9553,zone:'Europe/Oslo'},'before_fajr');
 assert.equal(w.ishraq,null);assert.equal(w.duhaReminder,null);assert.equal(w.tonight.reminder,null);assert(!w.events.some(e=>e.date));
});
test('migration preserves an old disabled combined alert and explicit newer choices',()=>{
 const old={'تنبيهات الشروق والضحى':false},m=C.worshipAlerts(old);
 assert.equal(m['تنبيهات الإشراق'],false);assert.equal(m['تنبيهات الضحى'],false);assert.equal(Object.keys(old).length,1);
 const current=C.worshipAlerts({...old,'تنبيهات الإشراق':true,'تنبيهات الوتر':false});
 assert.equal(current['تنبيهات الإشراق'],true);assert.equal(current['تنبيهات الضحى'],false);assert.equal(current['تنبيهات الوتر'],false);
});
test('Friday and Eid reminders use separate groups and special sound keys',()=>{
 vm.runInContext(fs.readFileSync('dist/prayer-alerts.js','utf8'),c);
 const events=c.PrayerAlerts.dayEvents(C,'2026-03-20',loc,'after_isha',0);
 const friday=events.find(e=>e.key==='jumuah'),eid=events.find(e=>e.key==='eid');
 assert.equal(friday.name,'صلاة الجمعة');assert.equal(friday.group,'تنبيهات الجمعة');assert.equal(eid.name,'صلاة عيد الفطر');assert.equal(eid.group,'تنبيهات العيد');assert.equal(+eid.date,+C.worship('2026-03-20',loc,'after_isha').ishraq);
});
test('custom Friday and Eid times plus estimated iqamah alarms use local wall time',()=>{
 C.save('calendar.alarmTiming',{jumuahTime:'13:15',eidTime:'06:45',iqamah:{fajr:22,dhuhr:15,asr:15,maghrib:10,isha:15,jumuah:25}});
 const events=c.PrayerAlerts.dayEvents(C,'2026-03-20',loc,'after_isha',0),friday=events.find(e=>e.key==='jumuah'),eid=events.find(e=>e.key==='eid'),iqamah=events.find(e=>e.key==='iqamah-jumuah');
 assert.equal(+friday.date,+L.localDate('2026-03-20',13*60+15,loc.zone));assert.equal(+eid.date,+L.localDate('2026-03-20',6*60+45,loc.zone));assert.equal(iqamah.group,'تنبيهات الإقامة التقديرية');assert.equal(iqamah.soundKey,'iqamah');assert.equal(+iqamah.date,+friday.date+25*60000);
 C.save('calendar.alarmTiming',{});
});
test('Istisqa reminder uses the manually selected local date and time',()=>{
 C.save('calendar.alarmTiming',{istisqaAt:'2026-03-21T07:30'});
 const event=c.PrayerAlerts.dayEvents(C,'2026-03-21',loc,'after_isha',0).find(e=>e.key==='istisqa');
 assert.equal(event.name,'صلاة الاستسقاء');assert.equal(event.group,'تنبيهات الاستسقاء');assert.equal(event.soundKey,'istisqa');assert.equal(+event.date,+L.localDate('2026-03-21',7*60+30,loc.zone));assert(!c.PrayerAlerts.dayEvents(C,'2026-03-20',loc,'after_isha',0).some(e=>e.key==='istisqa'));
 C.save('calendar.alarmTiming',{});
});
test('calendar export honors groups and does not advance prayer alarms',()=>{
 vm.runInContext(fs.readFileSync('dist/prayer-alerts.js','utf8'),c);c.TextEncoder=TextEncoder;
 const now=new Date('2026-09-05T21:00:00Z'),result=c.PrayerAlerts.calendar(C,L,{now,days:7,alerts:{'تنبيهات الصلوات':false,'تنبيهات السنن الرواتب':false,'تنبيهات الجمعة':false,'تنبيهات العيد':false,'تنبيهات الإقامة التقديرية':false,'تنبيهات الكسوف والخسوف':false,'تنبيهات الإشراق':true,'تنبيهات الضحى':false,'تنبيهات الوتر':true},mode:'before_fajr'});
 const ics=result.text.replace(/\r\n /g,''),events=ics.split('BEGIN:VEVENT').slice(1);
 assert.equal(result.count,14);assert.equal(events.filter(e=>e.includes('SUMMARY:صلاة الإشراق')).length,7);assert.equal(events.filter(e=>e.includes('SUMMARY:صلاة الوتر')).length,7);assert(!ics.includes('SUMMARY:صلاة الضحى'));assert(events.every(e=>e.includes('TRIGGER:PT0S')));assert.equal(new Set(events.map(e=>e.match(/UID:(.+)/)[1])).size,14);
});
test('web push schedule mirrors enabled worship groups without browser APIs',()=>{
 vm.runInContext(fs.readFileSync('dist/prayer-alerts.js','utf8'),c);vm.runInContext(fs.readFileSync('dist/push-alerts.js','utf8'),c);
 const now=new Date('2026-09-05T21:00:00Z'),schedule=c.PrayerPush.pushSchedule(C,L,{now,days:7,alerts:{'تنبيهات الصلوات':false,'تنبيهات السنن الرواتب':false,'تنبيهات الجمعة':false,'تنبيهات العيد':false,'تنبيهات الإقامة التقديرية':false,'تنبيهات الكسوف والخسوف':false,'تنبيهات الإشراق':true,'تنبيهات الضحى':false,'تنبيهات الوتر':true},mode:'before_fajr'});
 assert.equal(schedule.length,14);assert(schedule.every(e=>e.at&&e.title&&e.tag));
 assert.equal(schedule.filter(e=>e.title==='صلاة الإشراق').length,7);
 assert.equal(schedule.filter(e=>e.title==='صلاة الوتر').length,7);
 assert(!schedule.some(e=>e.title==='صلاة الضحى'||e.title==='الفجر'));
});
test('30 days of native calendar prayer alarms use exact daily times and valid UTF-8 folding',()=>{
 const now=new Date('2026-09-05T21:00:00Z'),alerts={'تنبيهات السنن الرواتب':false,'تنبيهات الجمعة':false,'تنبيهات العيد':false,'تنبيهات الإقامة التقديرية':false,'تنبيهات الكسوف والخسوف':false,'تنبيهات الإشراق':false,'تنبيهات الضحى':false,'تنبيهات الوتر':false};
 const result=c.PrayerAlerts.calendar(C,L,{now,days:30,alerts});assert.equal(result.count,146);
 for(const line of result.text.split('\r\n'))assert(Buffer.byteLength(line)<=75);
 const text=result.text.replace(/\r\n /g,'');assert(!text.includes('TRIGGER:-'));assert(text.includes('DTSTART:'+C.prayers('2026-09-06').fajr.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')));
 const again=c.PrayerAlerts.calendar(C,L,{now,days:30,alerts});assert.equal(result.text,again.text);
 const later=c.PrayerAlerts.calendar(C,L,{now:new Date('2026-09-06T20:59:00Z'),days:7,alerts});assert.equal(later.count,29);
});
test('rawatib individual switches, location escaping, and DST are preserved',()=>{
 const loc={...C.defaults,lat:40.7128,lon:-74.006,zone:'America/New_York',name:'مدينة; اختبار, آمن\nسطر'},now=new Date('2026-10-30T04:00:00Z');
 const result=c.PrayerAlerts.calendar(C,L,{now,days:7,loc,offset:5,alerts:{'تنبيهات الإقامة التقديرية':false,'تنبيهات الكسوف والخسوف':false,'سنة الفجر':false}});
 const text=result.text.replace(/\r\n /g,'');assert(!text.includes('SUMMARY:سنة الفجر'));assert(text.includes('SUMMARY:سنة الظهر القبلية'));assert(text.includes('LOCATION:مدينة\\; اختبار\\, آمن\\nسطر'));
 const events=text.split('BEGIN:VEVENT').slice(1);assert.equal(events.filter(e=>e.includes('SUMMARY:الفجر\r\n')).length,7);
 assert.equal(new Set(events.map(e=>e.match(/UID:(.+)/)[1])).size,events.length);
});
