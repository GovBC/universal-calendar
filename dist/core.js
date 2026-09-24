/* Shared calendar, observer and astronomical calculations. No network required. */
(function(root){
'use strict';
const A=root.Astronomy,L=root.LunarCalc,DAY=86400000,rad=Math.PI/180;
const defaults={name:'مكة المكرمة',lat:21.4225,lon:39.8262,elevation:0,zone:'Asia/Riyadh',fajr:18.5,asr:1,prayerMethod:'auto'};
// The modern Bahraini calendar uses a single national timetable: the eastern
// populated edge for Fajr/sunrise and the western populated edge for the
// remaining prayers. These reference observers deliberately do not follow the
// user's exact position once the Zubarah method is active.
const BAHRAIN_EAST={lat:26.3078,lon:50.6627,elevation:0}; // Dilmunia Island
const BAHRAIN_WEST={lat:26.2338,lon:50.4667,elevation:0}; // Salman City
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
function isBahrainLocation(loc){return loc?.zone==='Asia/Bahrain'||Number.isFinite(+loc?.lat)&&Number.isFinite(+loc?.lon)&&+loc.lat>=25.72&&+loc.lat<=26.36&&+loc.lon>=50.36&&+loc.lon<=50.85;}
function resolvedPrayerMethod(loc){const selected=['auto','ummalqura','zubarah'].includes(loc?.prayerMethod)?loc.prayerMethod:'auto';return selected==='auto'?(isBahrainLocation(loc)?'zubarah':'ummalqura'):selected;}
function validate(loc){if(!loc||!Number.isFinite(+loc.lat)||Math.abs(+loc.lat)>90||!Number.isFinite(+loc.lon)||Math.abs(+loc.lon)>180||!Number.isFinite(+loc.elevation)||+loc.elevation<0||+loc.elevation>9000||!Number.isFinite(+loc.fajr)||+loc.fajr<12||+loc.fajr>22||![1,2].includes(+loc.asr)||loc.prayerMethod&&!['auto','ummalqura','zubarah'].includes(loc.prayerMethod))throw Error('تحقق من الإحداثيات والارتفاع وطريقة الحساب.');new Intl.DateTimeFormat('en',{timeZone:loc.zone}).format();return {...defaults,...loc,name:String(loc.name||'موقع مخصص').slice(0,80),lat:+loc.lat,lon:+loc.lon,elevation:+loc.elevation,fajr:+loc.fajr,asr:+loc.asr,prayerMethod:loc.prayerMethod||'auto'};}
let location={...defaults};try{location=validate({...defaults,...read('calendar.location',{})})}catch{}
function setLocation(loc){location=validate({...location,...loc});const saved=save('calendar.location',location);root.dispatchEvent(new CustomEvent('calendar-location',{detail:{...location}}));return saved;}
let hourCycle=read('calendar.hourCycle','h23');if(!['h12','h23'].includes(hourCycle))hourCycle='h23';
function setHourCycle(value){hourCycle=value==='h12'?'h12':'h23';const saved=save('calendar.hourCycle',hourCycle);if(typeof root.dispatchEvent==='function'&&typeof root.CustomEvent==='function')root.dispatchEvent(new CustomEvent('calendar-hour-cycle',{detail:{hourCycle}}));return saved;}
function numeric(value){return Number(String(value).replace(/[٠-٩۰-۹]/g,c=>'٠١٢٣٤٥٦٧٨٩'.includes(c)?'٠١٢٣٤٥٦٧٨٩'.indexOf(c):'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).trim());}
function parts(date,calendar='gregory',zone='UTC'){
 const p=new Intl.DateTimeFormat('en-u-nu-latn',{calendar,timeZone:zone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date),result=Object.fromEntries(p.filter(x=>['year','month','day'].includes(x.type)).map(x=>[x.type,+x.value]));
 // ICU returns Hebrew month names even when a numeric month is requested.
 // Number them in their actual civil-year order so the shared converter stays monotonic.
 if(calendar==='hebrew'&&!Number.isFinite(result.month)){
  const name=p.find(x=>x.type==='month')?.value,leap=((7*result.year+1)%19)<7;
  const common=['Tishri','Heshvan','Kislev','Tevet','Shevat','Adar','Nisan','Iyar','Sivan','Tamuz','Av','Elul'];
  const intercalary=['Tishri','Heshvan','Kislev','Tevet','Shevat','Adar I','Adar II','Nisan','Iyar','Sivan','Tamuz','Av','Elul'];
  result.month=(leap?intercalary:common).indexOf(name)+1;
 }
 return result;
}
function calendarDate(year,month,day,calendar='gregory'){
 [year,month,day]=[year,month,day].map(numeric);const maxMonth=['hebrew','ethiopic','coptic'].includes(calendar)?13:12;if(![year,month,day].every(Number.isInteger)||year<1||month<1||month>maxMonth||day<1||day>31)throw Error('أدخل سنة وشهرًا ويومًا صحيحًا.');
 const target=year*10000+month*100+day;let lo=-719162,hi=1106684; // Gregorian years 1…4999
 while(lo<=hi){const mid=Math.floor((lo+hi)/2),date=new Date(mid*DAY+DAY/2),p=parts(date,calendar),key=p.year*10000+p.month*100+p.day;if(key===target)return date;if(key<target)lo=mid+1;else hi=mid-1;}
 throw Error('هذا التاريخ غير موجود أو خارج نطاق التحويل (الميلادي ١–٤٩٩٩).');
}
function format(date,calendar='gregory',zone=location.zone){return new Intl.DateTimeFormat('ar-SA',{calendar,timeZone:zone,day:'numeric',month:'long',year:'numeric'}).format(date);}
function clock(date,full=false,loc=location){return date?new Intl.DateTimeFormat('ar-SA-u-ca-gregory',{timeZone:loc.zone,...(full?{day:'numeric',month:'short'}:{}),hour:'2-digit',minute:'2-digit',hourCycle}).format(date):'لا يحدث في هذا اليوم';}
const prayerCache=new Map();
// Published prayer timetables use whole minutes. Always advance a fractional
// entry time to the next minute so the displayed/advised time is never early.
function prayerMinute(date){return date?new Date(Math.ceil(+date/60000)*60000):null;}
function prayers(iso=L.dateISO(new Date(),location.zone),loc=location){
 const key=iso+JSON.stringify(loc);if(prayerCache.has(key))return prayerCache.get(key);
 const {start,end}=L.dayBounds(iso,loc.zone),days=(end-start)/DAY,method=resolvedPrayerMethod(loc),o=new A.Observer(loc.lat,loc.lon,loc.elevation||0),east=new A.Observer(BAHRAIN_EAST.lat,BAHRAIN_EAST.lon,0),west=new A.Observer(BAHRAIN_WEST.lat,BAHRAIN_WEST.lon,0),dawnObserver=method==='zubarah'?east:o,eveningObserver=method==='zubarah'?west:o,asrLat=method==='zubarah'?BAHRAIN_WEST.lat:loc.lat;
 const within=t=>t&&t.date>=start&&t.date<end?t.date:null;
 const fajrAngle=method==='zubarah'?18:loc.fajr;
 const rawFajr=within(A.SearchAltitude('Sun',dawnObserver,1,start,days,-fajrAngle));
 const rawSunrise=within(A.SearchRiseSet('Sun',dawnObserver,1,start,days));
 const rawDhuhr=within(A.SearchHourAngle('Sun',eveningObserver,0,start).time);
 const rawSunset=within(A.SearchRiseSet('Sun',eveningObserver,-1,start,days));
 let rawAsr=null;if(rawDhuhr){const dec=A.Equator('Sun',rawDhuhr,eveningObserver,true,true).dec,alt=Math.atan(1/(loc.asr+Math.tan(Math.abs(asrLat-dec)*rad)))/rad;if(Math.abs(asrLat-dec)<90&&alt>0)rawAsr=within(A.SearchAltitude('Sun',eveningObserver,-1,rawDhuhr,(end-rawDhuhr)/DAY,alt));}
 const ramadan=parts(new Date(+end+DAY/2),'islamic-umalqura',loc.zone).month===9;
 const fajr=prayerMinute(rawFajr),sunrise=prayerMinute(rawSunrise),dhuhr=prayerMinute(rawDhuhr),asr=prayerMinute(rawAsr),sunset=prayerMinute(rawSunset);
 const rawIsha=method==='zubarah'&&rawSunset?within(A.SearchAltitude('Sun',eveningObserver,-1,rawSunset,(end-rawSunset)/DAY,-18)):null;
 const isha=method==='zubarah'?prayerMinute(rawIsha):rawSunset?prayerMinute(new Date(+rawSunset+(ramadan?120:90)*60000)):null;
 const duha=prayerMinute(within(A.SearchAltitude('Sun',dawnObserver,1,start,days,3.5)));
 const methodName=method==='zubarah'?'روزنامة الزبارة والبحرين':'أم القرى';
 const result={iso,start,end,loc,method,methodName,fajrAngle,ishaRule:method==='zubarah'?'angle18':ramadan?'offset120':'offset90',fajr,sunrise,dhuhr,asr,maghrib:sunset,isha,duha,ramadan,events:[['الفجر',fajr],['الشروق',sunrise],['الظهر',dhuhr],['العصر',asr],['المغرب',sunset],['العشاء',isha]].map(([name,date],i)=>({name,date,key:['fajr','sunrise','dhuhr','asr','maghrib','isha'][i]}))};
 if(prayerCache.size>60)prayerCache.clear();prayerCache.set(key,result);return result;
}
function solarTimeline(date=new Date(),loc=location,sampleCount=72){
 const iso=L.dateISO(date,loc.zone),p=prayers(iso,loc),sun=L.horizontal('Sun',date,loc),start=p.sunrise,end=p.maghrib;
 if(!start||!end||end<=start)return {iso,start,end,sun,daylight:false,progress:null,points:[]};
 const count=Math.max(12,Math.min(288,Math.round(sampleCount)||72)),span=end-start,points=[];
 for(let i=0;i<=count;i++){const at=new Date(+start+span*i/count),position=L.horizontal('Sun',at,loc);points.push({date:at,altitude:position.altitude,azimuth:position.azimuth,progress:i/count});}
 const progress=(date-start)/span,daylight=progress>=0&&progress<=1&&sun.altitude>=-.9;
 return {iso,start,end,sun,daylight,progress,points,maxAltitude:Math.max(...points.map(point=>point.altitude))};
}
// Keep the user's old combined preference when introducing independent reminders.
function worshipAlerts(state={}){const result={...state};for(const key of ['تنبيهات الإشراق','تنبيهات الضحى'])if(typeof result[key]!=='boolean'&&typeof result['تنبيهات الشروق والضحى']==='boolean')result[key]=result['تنبيهات الشروق والضحى'];return result;}
function worship(iso=L.dateISO(new Date(),location.zone),loc=location,witrMode='after_isha'){
 const p=prayers(iso,loc),previous=prayers(L.dateISO(new Date(+p.start-1),loc.zone),loc),following=prayers(L.dateISO(new Date(+p.end+3600000),loc.zone),loc);
 const ishraq=p.sunrise&&p.duha&&p.dhuhr&&p.duha>p.sunrise&&p.duha<p.dhuhr?p.duha:null;
 const end=ishraq?new Date(+p.dhuhr-10*60000):null,duhaEnd=end&&end>ishraq?end:null;
 const later=p.dhuhr?new Date(+p.dhuhr-120*60000):null,duhaReminder=ishraq&&duhaEnd&&later>ishraq&&later<duhaEnd?later:null;
 function night(evening,morning){
  const isha=evening.isha,fajr=morning.fajr,valid=isha&&fajr&&isha<fajr;
  const candidate=valid?new Date(witrMode==='before_fajr'?+fajr-30*60000:+isha+30*60000):null;
  return {isha,fajr,reminder:candidate&&candidate>isha&&candidate<fajr?candidate:null};
 }
 const previousNight=night(previous,p),tonight=night(p,following);
 const events=[{key:'ishraq',name:'صلاة الإشراق',date:ishraq,group:'تنبيهات الإشراق'},{key:'duha',name:'صلاة الضحى',date:duhaReminder,group:'تنبيهات الضحى'},...[previousNight,tonight].map(n=>({key:'witr',name:'صلاة الوتر',date:n.reminder,group:'تنبيهات الوتر'}))].filter(e=>e.key!=='witr'||e.date&&e.date>=p.start&&e.date<p.end);
 return {ishraq,duhaEnd,duhaReminder,previousNight,tonight,events};
}
const eclipseCache=new Map();
function eclipses(year,loc=location){const key=year+JSON.stringify(loc)+hourCycle;if(eclipseCache.has(key))return eclipseCache.get(key);const from=new Date(Date.UTC(year,0,1)),end=new Date(Date.UTC(year+1,0,1)),o=new A.Observer(loc.lat,loc.lon,loc.elevation||0),list=[],kind={total:'كلي',partial:'جزئي',annular:'حلقي',penumbral:'شبه ظلي'};
 for(let e=A.SearchGlobalSolarEclipse(from);e.peak.date<end;e=A.NextGlobalSolarEclipse(e.peak)){
  const local=A.SearchLocalSolarEclipse(e.peak.AddDays(-1),o),sameLocal=Math.abs(local.peak.time.ut-e.peak.ut)<.5,hybrid=e.peak.date.toISOString().startsWith('2031-11-14');
  const peak=sameLocal?local.peak.time.date:e.peak.date,contactStart=sameLocal?local.partial_begin.time.date:null,contactEnd=sameLocal?local.partial_end.time.date:null,start=contactStart||new Date(+peak-7200000),finish=contactEnd||new Date(+peak+7200000);
  let visible=false,visibleStart=null,visibleEnd=null;
  if(sameLocal){
   const horizon=-.833,span=(finish-start)/DAY,startAbove=local.partial_begin.altitude>horizon,endAbove=local.partial_end.altitude>horizon,peakAbove=local.peak.altitude>horizon;
   visibleStart=start;visibleEnd=finish;
   const rise=A.SearchRiseSet('Sun',o,1,start,span),set=A.SearchRiseSet('Sun',o,-1,start,span);
   if(!startAbove&&rise&&rise.date<finish)visibleStart=rise.date;
   if(!endAbove&&set&&set.date>start)visibleEnd=set.date;
   visible=(startAbove||peakAbove||endAbove||rise&&rise.date<finish||set&&set.date>start)&&(visibleStart<visibleEnd);
   if(!visible){visibleStart=null;visibleEnd=null;}
  }
  const centralStart=sameLocal&&local.total_begin?local.total_begin.time.date:null,centralEnd=sameLocal&&local.total_end?local.total_end.time.date:null;
  list.push({type:'solar',kind:hybrid?'hybrid':e.kind,localKind:sameLocal?local.kind:null,title:'كسوف شمسي '+(hybrid?'هجين':kind[e.kind]),date:format(peak,'gregory',loc.zone),visibility:visible?'مرئي محليًا • '+kind[local.kind]:(sameLocal?'يحدث محليًا تحت الأفق':'غير مرئي من هذا الموقع'),start:sameLocal?clock(contactStart,true,loc):'لا تماس محلي',peak:clock(peak,true,loc)+(sameLocal?'':' (ذروة عالمية)'),end:sameLocal?clock(contactEnd,true,loc):'لا تماس محلي',window:visible?clock(visibleStart,true,loc)+' — '+clock(visibleEnd,true,loc):'لا توجد فترة رؤية محلية',startAt:+start,peakAt:+peak,endAt:+finish,contactStartAt:contactStart?+contactStart:null,contactEndAt:contactEnd?+contactEnd:null,centralStartAt:centralStart?+centralStart:null,centralEndAt:centralEnd?+centralEnd:null,visibleStartAt:visibleStart?+visibleStart:null,visibleEndAt:visibleEnd?+visibleEnd:null,visible,local:sameLocal,obscuration:sameLocal?local.obscuration:(Number.isFinite(e.obscuration)?e.obscuration:null),globalObscuration:Number.isFinite(e.obscuration)?e.obscuration:null,shadowAxisDistanceKm:e.distance,centralLat:Number.isFinite(e.latitude)?e.latitude:null,centralLon:Number.isFinite(e.longitude)?e.longitude:null});
 }
 for(let e=A.SearchLunarEclipse(from);e.peak.date<end;e=A.NextLunarEclipse(e.peak)){
  const peak=e.peak.date,start=e.peak.AddDays(-e.sd_penum/1440).date,finish=e.peak.AddDays(e.sd_penum/1440).date,intervals=[];
  let t=+start,on=L.horizontal('Moon',start,loc).altitude>-.25,begin=on?+start:null;
  // Clip the entire eclipse, including its early phases, to rise/set contacts.
  const crossings=[];for(const direction of [1,-1]){let search=new Date(+start-1000);for(let k=0;k<2;k++){const v=A.SearchRiseSet('Moon',o,direction,search,(finish-search)/DAY);if(!v||v.date>finish)break;crossings.push({t:+v.date,on:direction===1});search=new Date(+v.date+1000);}}
  crossings.sort((a,b)=>a.t-b.t).forEach(c=>{if(c.on){if(begin===null)begin=c.t}else if(begin!==null){intervals.push([begin,c.t]);begin=null;}on=c.on;});if(begin!==null)intervals.push([begin,+finish]);
  const visible=intervals.length>0,window=intervals.map(([a,b])=>clock(new Date(a),true,loc)+' — '+clock(new Date(b),true,loc)).join('؛ ');
  const partialStart=e.sd_partial?e.peak.AddDays(-e.sd_partial/1440).date:null,partialEnd=e.sd_partial?e.peak.AddDays(e.sd_partial/1440).date:null,totalStart=e.sd_total?e.peak.AddDays(-e.sd_total/1440).date:null,totalEnd=e.sd_total?e.peak.AddDays(e.sd_total/1440).date:null;
  list.push({type:'lunar',kind:e.kind,title:'خسوف قمري '+kind[e.kind],date:format(peak,'gregory',loc.zone),visibility:visible?'بعض المراحل مرئية محليًا':'غير مرئي من هذا الموقع',start:clock(start,true,loc),peak:clock(peak,true,loc),end:clock(finish,true,loc),window:window||'لا توجد فترة رؤية محلية',startAt:+start,peakAt:+peak,endAt:+finish,penumbralStartAt:+start,penumbralEndAt:+finish,partialStartAt:partialStart?+partialStart:null,partialEndAt:partialEnd?+partialEnd:null,totalStartAt:totalStart?+totalStart:null,totalEndAt:totalEnd?+totalEnd:null,obscuration:Number.isFinite(e.obscuration)?e.obscuration:null,visible,intervals});
 }
 list.sort((a,b)=>a.peakAt-b.peakAt);eclipseCache.set(key,list);return list;
}
root.CalendarCore={defaults,get location(){return {...location}},setLocation,get hourCycle(){return hourCycle},setHourCycle,validate,read,save,numeric,parts,calendarDate,format,clock,prayerMinute,isBahrainLocation,resolvedPrayerMethod,prayers,solarTimeline,worship,worshipAlerts,eclipses};
})(globalThis);
