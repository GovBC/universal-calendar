(function(){
'use strict';
const N=window.AndroidCalendar;if(!N)return;
const C=CalendarCore,L=LunarCalc,$=s=>document.querySelector(s);
const number=n=>new Intl.NumberFormat('ar-SA').format(n);
const status=()=>JSON.parse(N.status());
const center=$('.alert-center'),panel=document.createElement('section');
panel.className='android-alarms';panel.innerHTML=`<h3>منبّه الهاتف</h3><p id="nativeAlarmStatus" role="status"></p><p id="nativeAlarmNext"></p><button class="primary-button" id="nativeSetup">إعداد المنبّه</button>`;center.prepend(panel);
const dialog=document.createElement('dialog');dialog.className='live-dialog';dialog.id='nativeAlarmDialog';
dialog.innerHTML=`<div class="live-heading"><h2>منبّه الصلاة على أندرويد</h2><button data-close aria-label="إغلاق">×</button></div><p>يتولى نظام الهاتف التنبيه عند المواعيد المحفوظة، حتى عند إغلاق التطبيق أو انقطاع الإنترنت.</p><div class="native-permission"><span id="nativeNotificationState"></span><button class="outline-button" id="nativeNotifications">إذن الإشعارات والصوت</button></div><div class="native-permission"><span id="nativeExactState"></span><button class="outline-button" id="nativeExact">إذن المنبّهات والتذكيرات</button></div><p id="nativeCoverage"></p><div class="live-actions"><button class="primary-button" id="nativeRefresh">تحديث المواعيد</button><button class="outline-button" id="nativeTest">اختبار بعد دقيقة</button></div><p id="nativeResult" role="status"></p><p>تُحفظ مواعيد سنة قادمة وتتجدد عند فتح التطبيق. بعد السفر افتح التطبيق وحدّث الموقع. يُعاد ضبط التنبيه التالي بعد إعادة تشغيل الهاتف. الإيقاف الإجباري للتطبيق من إعدادات أندرويد يعطّل تنبيهاته حتى فتحه مجددًا.</p><p>يمكنك تعديل أذان الجمعة وصلاة العيد ودقائق الإقامة التقديرية من صفحة المنبّه؛ تُعاد جدولة المواعيد في الهاتف تلقائيًا.</p><p>أذان التطبيق الرسمي هو الاختيار الافتراضي للصلوات، والجرس للإقامات. ويمكنك تغيير صوت كل صلاة إلى أذان الحرم المكي أو المسجد الأقصى أو أي ملف مرفوع أو تسجيل. زر «استماع» يشغّل الصوت الآن من نظام الهاتف مباشرة. بعض الهواتف تحتاج السماح للتطبيق بالعمل في الخلفية من إعدادات البطارية.</p><p>الإصدار ١٫٥٫٠ • بيانات الحساب والأصوات محفوظة على جهازك. الأقسام التي تجلب أخبارًا أو بيانات خارجية تحتاج الإنترنت.</p>`;
document.body.append(dialog);dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
let busy=false,generation=0,timer=null,lastSignature='';
function message(text){$('#nativeResult').textContent=text;}
function signature(){return JSON.stringify([C.location,C.read('calendar.alerts',{}),C.read('calendar.witrMode','after_isha'),C.read('calendar.offset',0),C.read('calendar.alarmTiming',{}),C.read('calendar.prayerSoundAssignments',{})]);}
function nativeSoundKey(event){const target=event.soundKey||(event.group==='تنبيهات السنن الرواتب'?'rawatib':event.key),selected=C.read('calendar.prayerSoundAssignments',{})[target]||(target==='iqamah'?'builtin:iqamah-bell':'builtin:official-adhan');return typeof selected==='string'&&selected.startsWith('builtin:')?selected.slice(8):target;}
function paint(){
 const s=status(),active=s.enabled&&s.notifications&&s.exact&&s.count>0;
 const title=busy?'جارٍ تجهيز مواعيد المنبّه…':!s.enabled?'المنبّه متوقف':!s.notifications?'يلزم السماح بالإشعارات':!s.exact?'يلزم السماح بالمنبّهات الدقيقة':!s.count?'لا توجد تنبيهات قادمة مفعّلة':'المنبّه مفعّل على الهاتف';
 $('#nativeAlarmStatus').textContent=title;
 $('#nativeAlarmNext').textContent=s.enabled&&s.next?'التنبيه التالي: '+C.clock(new Date(s.next),true):'';
 const master=$('#notificationMaster');master.classList.toggle('active',active);master.setAttribute('aria-pressed',String(!!s.enabled));master.querySelector('b').textContent=title;master.querySelector('small').textContent='تنبيه محلي يعمل دون إنترنت';
 const alerts=C.worshipAlerts(C.read('calendar.alerts',{}));document.querySelectorAll('.alert-toggle').forEach(b=>{const on=alerts[b.getAttribute('aria-label')]!==false;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
 $('#nativeNotificationState').textContent=s.notifications?'✓ الإشعارات مسموحة':'الإشعارات غير مسموحة';$('#nativeExactState').textContent=s.exact?'✓ المنبّهات الدقيقة مسموحة':'المنبّهات الدقيقة غير مسموحة';
 $('#nativeCoverage').textContent=s.validUntil?'حُفظ '+number(s.count)+' تنبيهًا قادمًا حتى '+C.format(new Date(s.validUntil-1),'gregory')+' • '+s.location:'لم تُحفظ مواعيد على الهاتف بعد.';
 $('.alert-policy b').textContent=active?'التنبيه المحلي مفعّل':'راجع إعداد منبّه الهاتف';
}
async function rebuild(invalidate=false){
 const ticket=++generation;clearTimeout(timer);if(invalidate)N.invalidateSchedule();busy=true;paint();
 const loc={...C.location},alerts=C.worshipAlerts(C.read('calendar.alerts',{})),mode=C.read('calendar.witrMode','after_isha'),offset=Number(C.read('calendar.offset',0))||0,now=new Date(),events=[];
 let iso=L.dateISO(now,loc.zone),end;
 try{
  for(let i=0;i<366;i++){
   if(ticket!==generation)return;
   for(const e of PrayerAlerts.dayEvents(C,iso,loc,mode,offset))if(e.date&&e.date>now&&alerts[e.group]!==false&&alerts[e.key]!==false)events.push({at:+e.date,title:e.name,soundKey:nativeSoundKey(e)});
   const day=C.prayers(iso,loc);end=day.end;iso=L.dateISO(new Date(+end+3600000),loc.zone);
   if(i%6===5)await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(alerts['تنبيهات الكسوف والخسوف']!==false)for(let year=now.getFullYear()-1;year<=end.getUTCFullYear()+1;year++)for(const e of C.eclipses(year,loc)){const at=e.startAt-86400000;if(e.visible&&at>now&&at<end)events.push({at,title:e.title+' غدًا',soundKey:nativeSoundKey({key:'eclipse-'+e.type})});}
  // A visible reminder keeps the finite offline coverage explicit.
  if(events.length)events.push({at:+end-7*86400000,title:'افتح التقويم لتجديد مواعيد منبّه الصلاة'});
  if(ticket!==generation)return;
  const result=JSON.parse(N.saveSchedule(JSON.stringify({events:events.filter(e=>e.at<end),validUntil:+end,location:loc.name})));
  if(result.error)throw Error(result.error);
  lastSignature=signature();message('حُفظت المواعيد على الهاتف. '+(result.enabled?'تحقق من الأذونات أعلاه.':'اضغط زر تفعيل التنبيهات في الصفحة لتشغيل المنبّه.'));
 }catch(error){message('تعذّر تحديث المواعيد: '+error.message);}
 finally{if(ticket===generation){busy=false;paint();}}
}
function openSetup(){paint();dialog.showModal();}
$('#nativeSetup').onclick=openSetup;$('.alert-policy span').textContent='بعد إغلاق التطبيق';$('.alert-policy button').textContent='إعداد منبّه الهاتف';$('.alert-policy button').onclick=openSetup;
$('#notificationMaster').onclick=()=>{const s=status();N.setEnabled(!s.enabled);paint();if(!s.enabled){if(!s.notifications||!s.exact)openSetup();if(!s.count&&!busy)rebuild();}};
$('#nativeNotifications').onclick=()=>N.requestNotifications();$('#nativeExact').onclick=()=>N.requestExactAlarms();$('#nativeRefresh').onclick=()=>rebuild(true);
function test(){const s=status();if(!s.notifications||!s.exact){openSetup();message('اسمح بالإشعارات والمنبّهات الدقيقة أولًا.');return;}const at=N.testAlarm();if(at){message('حُفظ اختبار عند '+C.clock(new Date(at))+'. أغلق التطبيق واقفل الشاشة الآن؛ يصل التنبيه بعد دقيقة.');showToast('جُدول اختبار المنبّه بعد دقيقة');}else message('تعذّر جدولة الاختبار؛ راجع الأذونات.');}
$('#nativeTest').onclick=test;$('#testAlert').onclick=()=>{openSetup();test();};$('#testAlert').textContent='اختبار المنبّه';
function changed(){if(signature()===lastSignature)return;generation++;busy=false;N.invalidateSchedule();clearTimeout(timer);timer=setTimeout(()=>rebuild(),250);paint();}
document.addEventListener('click',e=>{if(e.target.closest('.alert-toggle')){paint();changed();}});
document.addEventListener('change',e=>{if(['rawatibOffset','witrReminderMode','jumuahTimeMode','jumuahCustomTime','eidTimeMode','eidCustomTime','iqamahFajr','iqamahDhuhr','iqamahAsr','iqamahMaghrib','iqamahIsha','iqamahJumuah'].includes(e.target.id))changed();});window.addEventListener('calendar-location',changed);window.addEventListener('calendar-alarm-timing-change',changed);window.addEventListener('prayer-sound-change',changed);
window.addEventListener('android-resume',()=>{paint();const s=status();if(!busy&&(signature()!==lastSignature||Date.now()-s.updatedAt>86400000))rebuild();});
// Route downloads through Android's document picker without storage access.
const click=HTMLAnchorElement.prototype.click;
HTMLAnchorElement.prototype.click=function(){if(this.download&&/^(blob:|data:)/.test(this.href)){const name=this.download;fetch(this.href).then(r=>r.blob()).then(blob=>{const reader=new FileReader();reader.onload=()=>N.saveFile(name,blob.type.split(';')[0]||'application/octet-stream',String(reader.result).split(',')[1]);reader.readAsDataURL(blob);}).catch(()=>showToast('تعذّر تجهيز الملف للحفظ'));return;}return click.call(this);};
paint();rebuild();
})();
