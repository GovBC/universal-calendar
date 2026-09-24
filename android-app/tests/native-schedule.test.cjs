const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const A=require('../../dist/vendor/astronomy.browser.min.js');
async function plan(alerts={}){
 const elements=new Map(),store=new Map([['calendar.alerts',JSON.stringify(alerts)],['calendar.witrMode','"before_fajr"']]);
 function element(){return {innerHTML:'',textContent:'',className:'',classList:{toggle(){}},setAttribute(){},prepend(){},append(){},addEventListener(){},querySelector:()=>element(),showModal(){},close(){}};}
 const doc={querySelector:s=>{if(!elements.has(s))elements.set(s,element());return elements.get(s);},querySelectorAll:()=>[],createElement:()=>element(),addEventListener(){},body:{append(){}}};
 let complete,fail;const done=new Promise((resolve,reject)=>{complete=resolve;fail=reject;});
 const context={Astronomy:A,Intl,Date,TextEncoder,console,setTimeout,clearTimeout,document:doc,HTMLAnchorElement:function(){},showToast(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},addEventListener(){},dispatchEvent(){},CustomEvent:class {}};
 context.AndroidCalendar={status:()=>JSON.stringify({enabled:false,notifications:true,exact:true,count:0,updatedAt:0}),saveSchedule:payload=>{complete(JSON.parse(payload));return '{}';},invalidateSchedule(){},setEnabled(){},testAlarm(){}};
 context.window=context;context.HTMLAnchorElement.prototype.click=function(){};
 const c=vm.createContext(context);
 for(const name of ['mooncalc.js','core.js','prayer-alerts.js'])vm.runInContext(fs.readFileSync('dist/'+name,'utf8'),c);
 vm.runInContext(fs.readFileSync('android-app/web/android.js','utf8'),c);
 const timeout=setTimeout(()=>fail(Error('Schedule generation did not finish')),30000);
 try{return {payload:await done,c};}finally{clearTimeout(timeout);}
}
test('native year schedule uses existing prayer engine and includes future events only',async()=>{
 const before=Date.now(),{payload:p,c}=await plan({'تنبيهات الكسوف والخسوف':false}),after=Date.now();
 assert(p.events.length>3000);assert(p.validUntil>before+364*86400000&&p.validUntil<after+367*86400000);
 assert(p.events.every(e=>e.at>before&&e.at<p.validUntil));
 assert.equal(new Set(p.events.map(e=>e.at+'|'+e.title)).size,p.events.length);
 assert(!p.events.some(e=>e.title==='الشروق'));
 const fajr=p.events.filter(e=>e.title==='الفجر');assert(fajr.length>=365);
 assert(fajr.every(e=>e.soundKey==='official-adhan'));
 assert(p.events.filter(e=>e.title==='الظهر').every(e=>e.soundKey==='official-adhan'));
 assert(p.events.filter(e=>e.title==='العصر').every(e=>e.soundKey==='official-adhan'));
 assert(p.events.filter(e=>e.title==='المغرب').every(e=>e.soundKey==='official-adhan'));
 assert(p.events.filter(e=>e.title==='العشاء').every(e=>e.soundKey==='official-adhan'));
 const friday=p.events.filter(e=>e.title==='صلاة الجمعة');assert(friday.length>=52);assert(friday.every(e=>e.soundKey==='official-adhan'));
 const rawatib=p.events.filter(e=>e.title==='سنة الفجر');assert(rawatib.length>=365);assert(rawatib.every(e=>e.soundKey==='official-adhan'));
 const iqamah=p.events.filter(e=>e.title==='إقامة الفجر');assert(iqamah.length>=300);assert(iqamah.every(e=>e.soundKey==='iqamah-bell'));
 for(const e of fajr){const iso=c.LunarCalc.dateISO(new Date(e.at),c.CalendarCore.location.zone);assert.equal(e.at,+c.CalendarCore.prayers(iso).fajr);}
 for(const e of p.events.filter(e=>e.title==='صلاة الوتر')){const iso=c.LunarCalc.dateISO(new Date(e.at),c.CalendarCore.location.zone);assert.equal(e.at,+c.CalendarCore.prayers(iso).fajr-1800000);}
});
test('disabling all groups produces an empty native schedule, including renewal reminder',async()=>{
 const groups=['تنبيهات الصلوات','تنبيهات السنن الرواتب','تنبيهات الإشراق','تنبيهات الضحى','تنبيهات الوتر','تنبيهات الجمعة','تنبيهات العيد','تنبيهات الإقامة التقديرية','تنبيهات الكسوف والخسوف'];
 const {payload}=await plan(Object.fromEntries(groups.map(g=>[g,false])));assert.equal(payload.events.length,0);
});
test('Android packaging prevents duplicate browser alerts and retains web assets',t=>{
 const assets='android-app/build/'+(process.env.ANDROID_BUILD_FORMAT||'apk')+'/assets/';
 if(!fs.existsSync(assets+'live-app.js'))return t.skip('Build the separate android-app package first');
 const script=fs.readFileSync(assets+'live-app.js','utf8'),html=fs.readFileSync(assets+'index.html','utf8');
 assert(script.includes('const swReady=Promise.resolve(null);'));assert(script.includes('function paintAlerts(){if(window.AndroidCalendar)return;'));
 assert(html.indexOf('CalendarCore.save("calendar.notifications",false)')<html.indexOf('<script src="./live-app.js"'));
 assert(html.includes('./android.js'));assert(!fs.existsSync(assets+'sw.js'));assert(fs.existsSync(assets+'vendor/astronomy.browser.min.js'));
});
