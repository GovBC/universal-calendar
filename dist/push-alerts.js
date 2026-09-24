(function(root){
'use strict';
const CONFIG={
 url:'https://ogzugbskrhdtbjzaqgxg.supabase.co/functions/v1/prayer-push',
 anon:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nenVnYnNrcmhkdGJqemFxZ3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODk3OTAsImV4cCI6MjEwNDM2NTc5MH0.-i6vXC-9EsOJEfraZi6SvAQyHJ-7t_v65jEkjSMB4jA',
 vapid:'BFWkYYiI4KlIqwp7vB3cXkNHjt1J16Vohy2goPz3JRQq11BRnEziCCfu7tdpeTYID8CWwMZtju6Jk0CuPW7I5Ko'
};
function id(C){let value=C.read('calendar.installationId','');if(!value){value=(crypto.randomUUID&&crypto.randomUUID())||String(Date.now())+'-'+Math.random().toString(36).slice(2);C.save('calendar.installationId',value);}return value;}
function key(value){const pad='='.repeat((4-value.length%4)%4),base=(value+pad).replace(/-/g,'+').replace(/_/g,'/'),raw=atob(base);return Uint8Array.from(raw,c=>c.charCodeAt(0));}
async function post(action,payload){
 const response=await fetch(CONFIG.url,{method:'POST',headers:{'Content-Type':'application/json','apikey':CONFIG.anon,'Authorization':'Bearer '+CONFIG.anon},body:JSON.stringify({action,...payload})});
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(data.error||'تعذر الاتصال بخدمة التنبيهات');
 return data;
}
function pushSchedule(C,L,{now=new Date(),days=30,loc=C.location,alerts={},mode='after_isha',offset=0}={}){
 let iso=L.dateISO(now,loc.zone),end;const items=[];
 for(let i=0;i<days;i++){for(const e of root.PrayerAlerts.dayEvents(C,iso,loc,mode,offset))if(e.date&&e.date>now&&alerts[e.group]!==false&&alerts[e.key]!==false)items.push(e);const p=C.prayers(iso,loc);end=p.end;iso=L.dateISO(new Date(+end+3600000),loc.zone);}
 if(alerts['تنبيهات الكسوف والخسوف']!==false){for(let year=now.getUTCFullYear()-1;year<=end.getUTCFullYear()+1;year++)for(const e of C.eclipses(year,loc))if(e.visible){const at=new Date(e.startAt-86400000);if(at>now&&at<end)items.push({name:e.title+' غدًا',key:'eclipse-'+e.type,date:at,group:'تنبيهات الكسوف والخسوف'});}}
 return items.sort((a,b)=>a.date-b.date).map(e=>({at:e.date.toISOString(),title:e.name,body:loc.name+' • '+(e.group||'تنبيهات العبادات'),tag:e.key||e.name}));
}
async function subscription(registration){
 let sub=await registration.pushManager.getSubscription();
 if(!sub)sub=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key(CONFIG.vapid)});
 return sub;
}
async function enable(C,L,options){
 if(!('serviceWorker'in navigator)||!('PushManager'in root)||typeof Notification==='undefined')throw Error('تنبيهات الخلفية غير مدعومة في هذا المتصفح');
 const permission=Notification.permission==='granted'?'granted':await Notification.requestPermission();
 if(permission!=='granted')throw Error('لم يُمنح إذن الإشعارات');
 const registration=await navigator.serviceWorker.ready;
 const sub=await subscription(registration),schedule=pushSchedule(C,L,options);
 const data=await post('subscribe',{subscription:sub.toJSON(),schedule,installationId:id(C),location:C.location,alerts:options.alerts,userAgent:navigator.userAgent});
 C.save('calendar.pushNotifications',true);
 return data;
}
async function test(C){
 if(!('serviceWorker'in navigator)||!('PushManager'in root)||typeof Notification==='undefined')throw Error('تنبيهات الخلفية غير مدعومة في هذا المتصفح');
 const permission=Notification.permission==='granted'?'granted':await Notification.requestPermission();
 if(permission!=='granted')throw Error('لم يُمنح إذن الإشعارات');
 const registration=await navigator.serviceWorker.ready,sub=await subscription(registration),at=new Date(Date.now()+65000);
 const data=await post('subscribe',{subscription:sub.toJSON(),installationId:id(C),location:C.location,alerts:{},userAgent:navigator.userAgent,schedule:[{at:at.toISOString(),title:'اختبار تنبيه الخلفية',body:C.location.name+' • التقويم العالمي الشامل',tag:'background-test'}]});
 C.save('calendar.pushNotifications',true);
 return {at,...data};
}
async function disable(C){
 const registration=await navigator.serviceWorker.ready,sub=await registration.pushManager.getSubscription();
 if(sub){await post('unsubscribe',{endpoint:sub.endpoint});await sub.unsubscribe().catch(()=>{});}
 C.save('calendar.pushNotifications',false);
 return true;
}
root.PrayerPush={enable,test,disable,pushSchedule,publicKey:CONFIG.vapid};
})(globalThis);
