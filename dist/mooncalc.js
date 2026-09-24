/* Astronomy Engine adapter. Positions: topocentric; Odeh (2004/2006) uses airless topocentric ARCV and W. */
(function(root){
'use strict';
const A=root.Astronomy, DEG=Math.PI/180, AU=149597870.7, DAY=86400000;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function parts(date,zone){const p=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date);const g=k=>+p.find(x=>x.type===k).value;return {y:g('year'),m:g('month'),d:g('day'),h:g('hour'),min:g('minute'),s:g('second')};}
function dateISO(date,zone){const p=parts(date,zone);return `${p.y}-${String(p.m).padStart(2,'0')}-${String(p.d).padStart(2,'0')}`;}
function localDate(iso,minute,zone){const [y,m,d]=iso.split('-').map(Number);const target=Date.UTC(y,m-1,d,0,minute);let n=target;for(let i=0;i<5;i++){const p=parts(new Date(n),zone);const delta=target-Date.UTC(p.y,p.m-1,p.d,p.h,p.min,p.s);if(!delta)return new Date(n);n+=delta;}throw new Error('هذا الوقت المحلي غير موجود بسبب الانتقال إلى التوقيت الصيفي. اختر وقتًا آخر.');}
const boundsCache=new Map();
function dayBounds(iso,zone){const key=iso+zone;if(boundsCache.has(key))return boundsCache.get(key);const first=day=>{for(let minute=0;minute<=180;minute++){try{return localDate(day,minute,zone);}catch{}}throw new Error('بداية هذا التاريخ المحلي غير متاحة في المنطقة الزمنية المحددة.');};const start=first(iso),next=new Date(Date.parse(iso+'T12:00:00Z')+DAY).toISOString().slice(0,10),result={start,end:first(next)};if(boundsCache.size>200)boundsCache.clear();boundsCache.set(key,result);return result;}
function observer(loc){return new A.Observer(loc.lat,loc.lon,loc.elevation);}
function horizontal(body,date,loc,refract=true){const o=observer(loc),e=A.Equator(body,date,o,true,true),h=A.Horizon(date,o,e.ra,e.dec,refract?'normal':undefined);return {...h,dist:e.dist};}
function separation(a,b){return Math.acos(clamp(Math.sin(a.altitude*DEG)*Math.sin(b.altitude*DEG)+Math.cos(a.altitude*DEG)*Math.cos(b.altitude*DEG)*Math.cos((a.azimuth-b.azimuth)*DEG),-1,1))/DEG;}
function snapshot(date,loc){const moon=horizontal('Moon',date,loc),sun=horizontal('Sun',date,loc),airMoon=horizontal('Moon',date,loc,false),airSun=horizontal('Sun',date,loc,false);return {date,moon,sun,airMoon,airSun,diameter:2*Math.asin(1737.4/(moon.dist*AU))/DEG*60,elongation:separation(airMoon,airSun),illum:A.Illumination('Moon',date).phase_fraction,phase:A.MoonPhase(date)};}
function direction(az){return ['الشمال','الشمال الشرقي','الشرق','الجنوب الشرقي','الجنوب','الجنوب الغربي','الغرب','الشمال الغربي'][Math.round(az/45)%8];}
function event(body,dir,start,end,loc){const t=A.SearchRiseSet(body,observer(loc),dir,start,(end-start)/DAY)?.date;return t&&t>=start&&t<end?t:null;}
function grade(v){return v>=5.65?'A':v>=2?'B':v>=-.96?'C':'D';}
function evening(iso,loc,obstruction=0){const {start,end}=dayBounds(iso,loc.zone);const sunset=event('Sun',-1,start,end,loc),rise=event('Moon',1,start,end,loc),set=event('Moon',-1,start,end,loc);const result={start,end,sunset,rise,set,best:null,lag:null,zone:null,reason:'',label:'',window:null};
 if(!sunset){return {...result,label:'لا يوجد غروب للشمس في هذا اليوم المحلي',reason:'قد تكون الشمس فوق الأفق أو تحته طوال اليوم في العروض العالية؛ لا يُطبّق معيار الهلال المسائي.'};}
 const s=snapshot(sunset,loc);if(s.phase>180)return {...result,label:'القمر متناقص؛ ليس هلالًا مسائيًا متزايدًا',reason:'تتبّع موضعه خلال اليوم أو قبل شروق الشمس. معيار عودة هنا مخصص للهلال المسائي.'};
 if(s.airMoon.altitude<-.9)return {...result,label:'القمر تحت الأفق عند غروب الشمس',reason:'لا تتوفر فترة رصد مسائية بعد غروب الشمس.',lag:set?(set-sunset)/60000:null};
 const nextSet=A.SearchRiseSet('Moon',observer(loc),-1,sunset,1)?.date;
 if(!nextSet)return {...result,label:'لا يغرب القمر خلال ٢٤ ساعة بعد غروب الشمس',reason:'لا يتوفر مكث محدود لحساب وقت تقييم الهلال في هذا الموقع.'};
 const lag=(nextSet-sunset)/60000;result.lag=lag;result.nextSet=nextSet;
 if(s.phase>30)return {...result,label:'القمر تجاوز نطاق الهلال الرفيع في هذا الراصد',reason:'يقتصر تطبيق معيار الهلال هنا على أول ٣٠° من زاوية الطور المتزايد؛ استخدم الارتفاع والطور لتتبّع القمر في بقية الشهر.'};
 if(lag<=0||lag>240)return {...result,label:'لا تتوفر فترة مناسبة لتطبيق معيار الهلال هنا',reason:'المكث خارج نطاق الرصد المسائي القصير المعتمد في هذه الواجهة.'};
 const best=new Date(+sunset+lag*4/9*60000),b=snapshot(best,loc),arcv=b.airMoon.altitude-b.airSun.altitude,w=b.diameter/2*(1-Math.cos(b.elongation*DEG));
 const v=arcv-(-.1018*w**3+.7319*w**2-6.3226*w+7.1651),zone=grade(v);
 const labels={A:'متوقّع بالعين المجردة وفق معيار عودة',B:'متوقّع بأداة بصرية؛ وقد يُرى بالعين',C:'متوقّع بأداة بصرية فقط وفق المعيار',D:'غير متوقّع حتى بأداة بصرية وفق المعيار'};
 Object.assign(result,{best,arcv,w,v,zone,label:labels[zone],reason:'تقدير حسابي يتأثر بصفاء الجو وخبرة الراصد؛ الطقس غير متصل بهذا الحساب.'});
 // Candidate interval is geometric availability after sunset, not a confidence interval for visibility.
 let first=null,last=null;for(let t=+sunset;t<=+nextSet;t+=60000){const h=horizontal('Moon',new Date(t),loc);if(h.altitude>obstruction){if(first===null)first=t;last=t;}}
 if(first!==null)result.window=[new Date(first),new Date(last)];
 result.blocked=b.moon.altitude<=obstruction;
 return result;
}
function dayPath(iso,loc){const {start,end}=dayBounds(iso,loc.zone),out=[];for(let t=+start;t<+end;t+=10*60000)out.push({date:new Date(t),moon:horizontal('Moon',new Date(t),loc),sun:horizontal('Sun',new Date(t),loc)});out.push({date:end,moon:horizontal('Moon',end,loc),sun:horizontal('Sun',end,loc)});return out;}
root.LunarCalc={parts,dateISO,localDate,dayBounds,horizontal,snapshot,direction,evening,dayPath,grade,previousNewMoon:date=>A.SearchMoonPhase(0,date,-35)?.date};
})(globalThis);
