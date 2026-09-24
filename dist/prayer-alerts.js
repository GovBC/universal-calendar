(function(root){
'use strict';
const L=root.LunarCalc;
const escapeText=value=>String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function fold(line){let result='',bytes=0;for(const char of line){const size=new TextEncoder().encode(char).length;if(bytes+size>75){result+='\r\n ';bytes=1;}result+=char;bytes+=size;}return result;}
const IQAMAH_DEFAULTS={fajr:20,dhuhr:15,asr:15,maghrib:10,isha:15,jumuah:20};
function readTiming(C){
 const value=C.read('calendar.alarmTiming',{}),validTime=time=>/^([01]\d|2[0-3]):[0-5]\d$/.test(String(time||'')),validDateTime=input=>{const text=String(input||'');if(!/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(text))return false;const date=new Date(text.slice(0,10)+'T12:00:00Z');return Number.isFinite(+date)&&date.toISOString().slice(0,10)===text.slice(0,10);},integer=(key,fallback)=>Math.max(0,Math.min(120,Math.round(Number(value?.iqamah?.[key]??fallback)||0)));
 return {jumuahTime:validTime(value?.jumuahTime)?value.jumuahTime:'',eidTime:validTime(value?.eidTime)?value.eidTime:'',istisqaAt:validDateTime(value?.istisqaAt)?String(value.istisqaAt):'',iqamah:Object.fromEntries(Object.entries(IQAMAH_DEFAULTS).map(([key,fallback])=>[key,integer(key,fallback)]))};
}
function customTime(L,iso,time,loc,fallback){
 if(!time)return fallback;const [hour,minute]=time.split(':').map(Number);try{return L.localDate(iso,hour*60+minute,loc.zone);}catch{return fallback;}
}
function dayEvents(C,iso,loc,mode,offset){
 const p=C.prayers(iso,loc),w=C.worship(iso,loc,mode),timing=readTiming(C);
 const raw=[['سنة الفجر',p.fajr],['سنة الظهر القبلية',p.dhuhr],['سنة الظهر البعدية',p.dhuhr],['سنة المغرب',p.maghrib],['سنة العشاء',p.isha]].map(([name,date],i)=>({name,key:name,date:date?new Date(+date+(i<2?offset:20)*60000):null,group:'تنبيهات السنن الرواتب'}));
 const isFriday=new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:loc.zone}).format(p.start)==='Fri';
 const jumuahDate=customTime(L,iso,timing.jumuahTime,loc,p.dhuhr);
 const prayers=p.events.filter(e=>e.key!=='sunrise').map(e=>e.key==='dhuhr'&&isFriday?{...e,name:'صلاة الجمعة',key:'jumuah',date:jumuahDate,group:'تنبيهات الجمعة'}:{...e,group:'تنبيهات الصلوات'});
 const hijri=C.parts(p.start,'islamic-umalqura',loc.zone);
 const eid=(hijri.month===10&&hijri.day===1)|| (hijri.month===12&&hijri.day===10)?[{name:hijri.month===10?'صلاة عيد الفطر':'صلاة عيد الأضحى',key:'eid',date:customTime(L,iso,timing.eidTime,loc,w.ishraq),group:'تنبيهات العيد'}]:[];
 const istisqaAt=timing.istisqaAt.startsWith(iso+'T')?customTime(L,iso,timing.istisqaAt.slice(11),loc,null):null;
 const istisqa=istisqaAt?[{name:'صلاة الاستسقاء',key:'istisqa',soundKey:'istisqa',date:istisqaAt,group:'تنبيهات الاستسقاء'}]:[];
 const iqamahBases=(isFriday?[{key:'jumuah',name:'صلاة الجمعة',date:jumuahDate}]:p.events.filter(e=>e.key!=='sunrise')).filter(e=>e.date);
 const iqamah=iqamahBases.map(e=>({name:'إقامة '+e.name,key:'iqamah-'+e.key,soundKey:'iqamah',date:new Date(+e.date+timing.iqamah[e.key]*60000),group:'تنبيهات الإقامة التقديرية'}));
 return [...prayers,...raw,...w.events,...eid,...istisqa,...iqamah];
}
function calendar(C,L,{now=new Date(),days=30,loc=C.location,alerts={},mode='after_isha',offset=0}={}){
 if(![7,30].includes(days))throw Error('مدة التنبيهات غير صالحة');
 let iso=L.dateISO(now,loc.zone),end;const events=[];
 for(let i=0;i<days;i++){events.push(...dayEvents(C,iso,loc,mode,offset));const p=C.prayers(iso,loc);end=p.end;iso=L.dateISO(new Date(+end+3600000),loc.zone);}
 if(alerts['تنبيهات الكسوف والخسوف']!==false){for(let year=now.getUTCFullYear()-1;year<=end.getUTCFullYear()+1;year++)for(const e of C.eclipses(year,loc))if(e.visible)events.push({name:e.title+' غدًا',key:'eclipse-'+e.type,date:new Date(e.startAt-86400000),group:'تنبيهات الكسوف والخسوف'});}
 const selected=events.filter(e=>e.date&&e.date>now&&e.date<end&&alerts[e.group]!==false&&alerts[e.key]!==false).sort((a,b)=>a.date-b.date);
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Universal Calendar//Prayer Alarms AR','CALSCALE:GREGORIAN','X-WR-CALNAME:'+escapeText('تنبيهات العبادات — '+loc.name)];
 const unique=new Set();let count=0;
 for(const e of selected){const uid=encodeURIComponent(e.key)+'-'+stamp(e.date)+'-'+loc.lat+'-'+loc.lon+'@universal-calendar';if(unique.has(uid))continue;unique.add(uid);count++;
 const description='موعد محسوب لموقع '+loc.name+'؛ المنطقة الزمنية '+loc.zone+'. راجع المواقيت المحلية. '+(e.group==='تنبيهات السنن الرواتب'?'تذكير للنافلة؛ أدِّ السنة البعدية بعد الفريضة. ':'')+'هذه نسخة ثابتة؛ أعد التصدير عند تغيير الموقع أو الإعدادات.';
 lines.push('BEGIN:VEVENT','UID:'+uid,'DTSTAMP:'+stamp(now),'DTSTART:'+stamp(e.date),'DTEND:'+stamp(new Date(+e.date+60000)),'SUMMARY:'+escapeText(e.name),'LOCATION:'+escapeText(loc.name),'DESCRIPTION:'+escapeText(description),'TRANSP:TRANSPARENT','BEGIN:VALARM','TRIGGER:PT0S','ACTION:DISPLAY','DESCRIPTION:'+escapeText(e.name),'END:VALARM','END:VEVENT');}
 lines.push('END:VCALENDAR');return {text:lines.map(fold).join('\r\n')+'\r\n',count,end};
}
root.PrayerAlerts={calendar,dayEvents,readTiming};
})(globalThis);
