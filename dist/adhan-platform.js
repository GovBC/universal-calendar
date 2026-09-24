(function(root){
'use strict';
const API='https://ogzugbskrhdtbjzaqgxg.supabase.co',KEY='sb_publishable_FVPG7eXkTCkDABk2TtAyAw_t00ai3cH',SESSION='calendar.adhan.session',GUEST_PHONE='calendar.adhan.guestPhone',LIMIT=20,MAX=8*1024*1024;
const KINDS={
 adhan:{label:'الأذان',share:'شارك الأذان بصوتك',direct:'أو سجّل الأذان مباشرة',intro:'شارك الأذان بصوتك واستمع إلى أصوات المجتمع. التسجيلات مرتبة من أول تسجيل إلى آخر تسجيل.',placeholder:'الأذان بصوتي',timeline:'تسجيلات الأذان — الأقدم أولًا',empty:'لم تُنشر تسجيلات أذان بعد. كن أول من يشارك الأذان بصوته.',published:'نُشر الأذان في نهاية الخط الزمني.'},
 recitation:{label:'التلاوات',share:'شارك تلاوة بصوتك',direct:'أو سجّل تلاوة مباشرة',intro:'شارك تلاوة مسجلة بصوتك واستمع إلى تلاوات المجتمع. التسجيلات مرتبة من أول تسجيل إلى آخر تسجيل.',placeholder:'تلاوة سورة أو آيات',timeline:'التلاوات — الأقدم أولًا',empty:'لم تُنشر تلاوات بعد. كن أول من يشارك تلاوة بصوته.',published:'نُشرت التلاوة في نهاية الخط الزمني.'},
 dua:{label:'الأدعية',share:'شارك دعاء بصوتك',direct:'أو سجّل دعاءً مباشرة',intro:'شارك دعاءً مسجلاً بصوتك واستمع إلى أدعية المجتمع. التسجيلات مرتبة من أول تسجيل إلى آخر تسجيل.',placeholder:'دعاء بصوتي',timeline:'الأدعية — الأقدم أولًا',empty:'لم تُنشر أدعية بعد. كن أول من يشارك دعاءً بصوته.',published:'نُشر الدعاء في نهاية الخط الزمني.'}
};
const $=id=>document.getElementById(id),number=n=>new Intl.NumberFormat('ar-SA').format(n);
let session=null,guestPhone='',refreshing=null,started=false,loading=false,cursor=null,epoch=0,activeKind='adhan',recordStream=null,mediaRecorder=null,recordChunks=[],recordStarted=0,recordTimer=null,recordedBlob=null,recordedURL=null,discardRecording=false;
try{session=JSON.parse(localStorage.getItem(SESSION)||'null');}catch{}
try{guestPhone=localStorage.getItem(GUEST_PHONE)||'';}catch{}
function kindInfo(kind=activeKind){return KINDS[kind]||KINDS.adhan;}
function accountLabel(user){const meta=user?.user_metadata||{},phone=user?.phone||meta.phone_label||guestPhone;if(phone)return phone+(user?.phone?'':' — غير موثّق');return user?.email||'حساب ضيف غير موثّق';}
function saveGuestPhone(phone){guestPhone=phone;try{localStorage.setItem(GUEST_PHONE,phone);}catch{}}
function clearGuestPhone(){guestPhone='';try{localStorage.removeItem(GUEST_PHONE);}catch{}}
function asciiDigits(value){return String(value||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));}
function normalizePhone(value){let phone=asciiDigits(value).trim().replace(/[^\d+]/g,'');if(phone.startsWith('00'))phone='+'+phone.slice(2);if(/^05\d{8}$/.test(phone))phone='+966'+phone.slice(1);else if(/^5\d{8}$/.test(phone))phone='+966'+phone;if(!/^\+[1-9]\d{7,14}$/.test(phone))throw Error('أدخل رقم الجوال بالصيغة الدولية، مثل +9665xxxxxxxx.');return phone;}
function remember(value){session=value;try{if(value)localStorage.setItem(SESSION,JSON.stringify(value));else localStorage.removeItem(SESSION);}catch{}paintAccount();}
function message(value){$('adhanPlatformStatus').textContent=value;}
function paintAccount(){const auth=$('adhanAuth'),signed=$('adhanSignedIn'),name=$('adhanAccountName');if(!auth||!signed||!name)return;const on=!!session?.user;auth.hidden=on;signed.hidden=!on;name.textContent=on?'تم الدخول: '+accountLabel(session.user):'';}
function failure(status,data){const detail=[data?.error_code,data?.msg,data?.message,data?.error_description].filter(Boolean).join(' ');if(status===401)return Error('تعذّر الوصول العام إلى المنصة؛ حدّث الصفحة ثم أعد المحاولة.');if(status===429)return Error('طلبات كثيرة؛ انتظر قليلًا ثم أعد المحاولة.');if(status===409)return Error('هذا الإعجاب أو التسجيل محفوظ بالفعل.');if(status===413)return Error('حجم الملف يتجاوز ٨ ميغابايت.');if(data?.error_code==='email_not_confirmed')return Error('أكد بريدك الإلكتروني أولًا ثم أعد المحاولة.');if(data?.error_code==='email_address_not_authorized')return Error('خدمة البريد لم تُهيأ بعد لاستقبال مستخدمين من خارج فريق التطبيق.');if(data?.error_code==='anonymous_provider_disabled'||/anonymous/i.test(detail)&&/(disabled|not enabled|unsupported|provider)/i.test(detail))return Error('النشر العام غير متاح من الخادم الآن؛ أعد المحاولة بعد قليل.');if(data?.error_code==='phone_provider_disabled')return Error('النشر برقم الجوال غير متاح من الخادم الآن؛ أعد المحاولة بعد قليل.');if(/otp|token/i.test(detail)&&/(expired|invalid|wrong)/i.test(detail))return Error('تعذّر إكمال الطلب؛ حدّث الصفحة ثم أعد المحاولة.');if(/sms|phone|twilio|messagebird|vonage/i.test(detail)&&/(config|provider|disabled|unsupported|not enabled|not configured|delivery channel)/i.test(detail))return Error('النشر برقم الجوال غير متاح من الخادم الآن؛ أعد المحاولة بعد قليل.');return Error('تعذّر إكمال الطلب. تحقق من بياناتك واتصالك ثم أعد المحاولة.');}
async function request(path,{method='GET',body,raw=false,auth=true,headers={}}={}){
 if(auth&&session&&session.expires_at*1000<Date.now()+60000){
  if(!refreshing)refreshing=request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token},auth:false}).then(remember).catch(e=>{remember(null);throw e;}).finally(()=>{refreshing=null;});
  await refreshing;
 }
 const h={apikey:KEY,Authorization:'Bearer '+(auth&&session?.access_token?session.access_token:KEY),...headers};
 if(body&&!raw)h['Content-Type']='application/json';
 let response;try{response=await fetch(API+path,{method,headers:h,body:body?(raw?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(30000)});}catch{throw Error('تعذّر الاتصال بالمنصة؛ تحقق من الإنترنت وأعد المحاولة.');}
 const text=await response.text();let data=null;try{data=text?JSON.parse(text):null;}catch{}
 if(!response.ok)throw failure(response.status,data);return data;
}
function requireAccount(){if(session?.user)return;throw Error('الإعجاب يحتاج حسابًا لاحقًا؛ النشر الآن متاح بدون تسجيل.');}
async function busy(button,action){button.disabled=true;try{await action();}catch(e){message(e.message);}finally{button.disabled=false;}}
async function authBusy(button,action){button.disabled=true;$('adhanAuthStatus').textContent='';try{await action();}catch(e){$('adhanAuthStatus').textContent=e.message;message(e.message);}finally{button.disabled=false;}}
function recordClock(seconds){const digits=new Intl.NumberFormat('ar-SA',{minimumIntegerDigits:2,useGrouping:false});return digits.format(Math.floor(seconds/60))+':'+digits.format(seconds%60);}
function recorderMime(){if(!root.MediaRecorder?.isTypeSupported)return '';return ['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(type=>root.MediaRecorder.isTypeSupported(type))||'';}
function clearRecordTimer(){if(recordTimer){clearInterval(recordTimer);recordTimer=null;}}
function stopRecordTracks(){if(recordStream)recordStream.getTracks().forEach(track=>track.stop());recordStream=null;}
function clearRecordPreview(){const preview=$('adhanRecordPreview');preview.pause();preview.removeAttribute('src');preview.load();preview.hidden=true;if(recordedURL){URL.revokeObjectURL(recordedURL);recordedURL=null;}}
function paintRecorder(){const recording=mediaRecorder?.state==='recording',saved=!!recordedBlob?.size;$('adhanRecord').textContent=recording?'إيقاف وحفظ التسجيل':saved?'إعادة التسجيل':'بدء التسجيل';$('adhanRecord').classList.toggle('recording',recording);$('adhanRecord').setAttribute('aria-pressed',String(recording));$('adhanClearRecord').hidden=!recording&&!saved;$('adhanClearRecord').textContent=recording?'إلغاء التسجيل':'حذف التسجيل';$('adhanRecordState').textContent=recording?'جارٍ التسجيل الآن…':saved?'تم حفظ تسجيل الميكروفون للمراجعة والنشر.':'لم يبدأ التسجيل.';if(!recording&&!saved)$('adhanRecordTimer').textContent='٠٠:٠٠';}
function updateRecordTimer(){$('adhanRecordTimer').textContent=recordClock(Math.floor((Date.now()-recordStarted)/1000));}
function discardDirectRecording(){recordedBlob=null;clearRecordPreview();if(mediaRecorder?.state==='recording'){discardRecording=true;mediaRecorder.stop();return;}clearRecordTimer();stopRecordTracks();paintRecorder();}
async function beginDirectRecording(){if(!navigator.mediaDevices?.getUserMedia||!root.MediaRecorder)throw Error('التسجيل المباشر غير مدعوم في هذا المتصفح. اختر ملفًا صوتيًا أو استخدم متصفحًا حديثًا.');let stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});const mime=recorderMime(),recorder=new root.MediaRecorder(stream,mime?{mimeType:mime}:undefined);discardRecording=false;recordedBlob=null;clearRecordPreview();recordChunks=[];recordStream=stream;mediaRecorder=recorder;recordStarted=Date.now();recorder.ondataavailable=event=>{if(event.data?.size)recordChunks.push(event.data);};recorder.onerror=()=>{discardRecording=true;message('حدث خطأ أثناء التسجيل؛ أعد المحاولة.');};recorder.onstop=()=>{const discard=discardRecording,chunks=recordChunks,type=recorder.mimeType||mime||'audio/webm';clearRecordTimer();stopRecordTracks();mediaRecorder=null;recordChunks=[];discardRecording=false;if(!discard&&chunks.length){const blob=new Blob(chunks,{type});if(!blob.size)message('لم يُحفظ أي صوت. أعد التسجيل.');else if(blob.size>MAX)message('التسجيل يتجاوز ٨ ميغابايت؛ سجّل مقطعًا أقصر.');else{recordedBlob=blob;recordedURL=URL.createObjectURL(blob);const preview=$('adhanRecordPreview');preview.src=recordedURL;preview.hidden=false;}}paintRecorder();};recorder.start(250);$('adhanFile').value='';$('adhanLocal').value='';clearRecordTimer();updateRecordTimer();recordTimer=setInterval(updateRecordTimer,250);paintRecorder();}catch(error){if(stream)stream.getTracks().forEach(track=>track.stop());if(recordStream===stream){recordStream=null;mediaRecorder=null;}throw Error(error?.name==='NotAllowedError'||error?.name==='SecurityError'?'اسمح باستخدام الميكروفون لبدء التسجيل.':'تعذّر بدء التسجيل بالميكروفون؛ أعد المحاولة.');}}
function audioURL(path){return API+'/storage/v1/object/public/adhan-community/'+path.split('/').map(encodeURIComponent).join('/');}
function node(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function renderPost(post){
 const card=node('article',undefined,'panel adhan-post');card.dataset.recording=post.id;
 const category=kindInfo(post.audio_kind);card.append(node('h3',post.title),node('div',post.display_name),node('small',category.label,'adhan-post-kind'));const time=node('time',new Intl.DateTimeFormat('ar-SA',{dateStyle:'medium',timeStyle:'short',calendar:'gregory'}).format(new Date(post.created_at)));time.dateTime=post.created_at;card.append(time);
 const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=audioURL(post.object_path);audio.setAttribute('aria-label','استماع إلى '+post.title);audio.addEventListener('play',()=>document.querySelectorAll('#adhanTimeline audio').forEach(other=>{if(other!==audio)other.pause();}));card.append(audio);
 const actions=node('div',undefined,'adhan-actions'),like=node('button',(post.liked?'♥':'♡')+' '+number(post.likes)+' إعجاب','outline-button');like.type='button';like.setAttribute('aria-pressed',String(post.liked));
 like.onclick=()=>busy(like,async()=>{requireAccount();if(post.liked)await request('/rest/v1/adhan_likes?recording_id=eq.'+post.id+'&user_id=eq.'+session.user.id,{method:'DELETE'});else await request('/rest/v1/adhan_likes',{method:'POST',body:{recording_id:post.id}});const [updated]=await request('/rest/v1/adhan_feed?id=eq.'+post.id);if(updated){post=updated;like.textContent=(post.liked?'♥':'♡')+' '+number(post.likes)+' إعجاب';like.setAttribute('aria-pressed',String(post.liked));}await leader(activeKind);});
 const add=node('button','إضافة إلى أصوات التنبيه','primary-button');add.type='button';
 add.onclick=()=>busy(add,async()=>{const existing=(await root.PrayerSounds.listSounds()).find(s=>s.communityId===post.id);if(!existing){const response=await fetch(audioURL(post.object_path),{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('تعذّر تنزيل الصوت؛ أعد المحاولة.');const blob=await response.blob();await root.PrayerSounds.addSound(blob,post.title+' — '+post.display_name,post.id);}root.dispatchEvent(new Event('prayer-library-change'));add.textContent='أُضيف إلى مكتبتك';message('أُضيف الصوت يدويًا إلى قائمة أصوات التنبيه على هذا الجهاز. اختره للصلاة المطلوبة من تبويب «الأصوات»؛ لم تتغير أي تعيينات تلقائيًا.');});
 actions.append(like,add);
 if(session?.user?.id===post.user_id){const remove=node('button','حذف تسجيلي','outline-button');remove.type='button';remove.onclick=()=>busy(remove,async()=>{if(!confirm('حذف تسجيلك من المنصة وإعجاباته؟ لا تُحذف النسخ التي أضافها الآخرون إلى أجهزتهم.'))return;await request('/rest/v1/adhan_recordings?id=eq.'+post.id,{method:'DELETE'});try{await request('/storage/v1/object/adhan-community',{method:'DELETE',body:{prefixes:[post.object_path]}});}catch{message('حُذف التسجيل من الخط الزمني، وتعذّر حذف ملفه من التخزين.');}await load(true);});actions.append(remove);}
 card.append(actions);return card;
}
async function leader(kind=activeKind){const top=await request('/rest/v1/adhan_feed?select=display_name,title,likes&audio_kind=eq.'+kind+'&order=likes.desc,created_at.asc,id.asc&limit=2',{auth:false});if(kind!==activeKind)return;const label=kindInfo(kind).label;$('adhanLeader').textContent=!top.length||!top[0].likes?'لا يوجد متصدر في '+label+' بعد؛ يبدأ الترتيب مع أول إعجاب.':top[1]?.likes===top[0].likes?'تعادل في صدارة '+label+' — '+number(top[0].likes)+' إعجاب. لم تُحسم المكافأة.':'المتصدر الحالي في '+label+': '+top[0].display_name+' — '+top[0].title+' — '+number(top[0].likes)+' إعجاب. النتيجة غير نهائية.';}
async function load(reset=false){
 if(loading&&!reset)return;const ticket=++epoch,kind=activeKind;loading=true;$('adhanMore').disabled=true;
 if(reset){cursor=null;message('جارٍ تحميل '+kindInfo(kind).label+'…');}
 try{const filter=cursor?'&or='+encodeURIComponent('(created_at.gt.'+cursor.created_at+',and(created_at.eq.'+cursor.created_at+',id.gt.'+cursor.id+'))'):'';
 const posts=await request('/rest/v1/adhan_feed?audio_kind=eq.'+kind+'&order=created_at.asc,id.asc&limit='+LIMIT+filter,{auth:false});if(ticket!==epoch||kind!==activeKind)return;
 if(reset){document.querySelectorAll('#adhanTimeline audio').forEach(a=>a.pause());$('adhanTimeline').replaceChildren();}
 posts.forEach(p=>$('adhanTimeline').append(renderPost(p)));if(posts.length)cursor=posts[posts.length-1];$('adhanMore').hidden=posts.length<LIMIT;
 message($('adhanTimeline').children.length?'إضافة التسجيل إلى منبّهاتك اختيارية؛ اضغط «إضافة إلى أصوات التنبيه».':kindInfo(kind).empty);await leader(kind);
 }catch(e){if(ticket===epoch)message(e.message);}finally{if(ticket===epoch){loading=false;$('adhanMore').disabled=false;}}
}
async function localRecordings(){try{const selected=$('adhanLocal').value;$('adhanLocal').replaceChildren(new Option('اختر تسجيلًا شخصيًا',''));for(const s of await root.PrayerSounds.listSounds())$('adhanLocal').append(new Option(s.name,s.id));$('adhanLocal').value=selected;}catch{}}
function paintKind(){const type=kindInfo();document.querySelectorAll('[data-platform-tab]').forEach(button=>{const active=button.dataset.platformTab===activeKind;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});$('adhanPlatformLead').textContent=type.intro;$('adhanComposeTitle').textContent=type.share;$('adhanRecordLegend').textContent=type.direct;$('adhanTitle').placeholder=type.placeholder;$('adhanTimelineTitle').textContent=type.timeline;}
function setKind(kind){if(!KINDS[kind])return;const changed=activeKind!==kind;activeKind=kind;cursor=null;paintKind();if(changed&&started)load(true);}
function activate(){localRecordings();if(!started){started=true;load(true);}}
if(guestPhone)$('adhanPhone').value=guestPhone;
$('adhanRecord').onclick=()=>{if(mediaRecorder?.state==='recording'){mediaRecorder.stop();return;}busy($('adhanRecord'),beginDirectRecording);};
$('adhanClearRecord').onclick=()=>discardDirectRecording();
$('adhanFile').addEventListener('change',()=>{if($('adhanFile').files[0]){discardDirectRecording();$('adhanLocal').value='';}});
$('adhanLocal').addEventListener('change',()=>{if($('adhanLocal').value){discardDirectRecording();$('adhanFile').value='';}});
$('adhanPublish').onsubmit=e=>{e.preventDefault();busy($('adhanPublishButton'),async()=>{
 if(mediaRecorder)throw Error('أوقف التسجيل وانتظر حتى يظهر مشغّل المعاينة قبل النشر.');if(!$('adhanConsent').checked)throw Error('يلزم الإقرار بملكية التسجيل والسماح بمشاركته.');
 const kind=activeKind,type=kindInfo(kind),own=$('adhanFile').files[0],local=!recordedBlob&&!own&&$('adhanLocal').value?await root.PrayerSounds.getSound($('adhanLocal').value):null,blob=recordedBlob||own||local?.blob;
 if(!blob||!blob.size||blob.size>MAX)throw Error('اختر تسجيلًا صوتيًا صالحًا لا يتجاوز ٨ ميغابايت.');
 if(!blob.type.startsWith('audio/'))throw Error('الملف المختار ليس ملفًا صوتيًا مدعومًا.');
 await new Promise((resolve,reject)=>{const url=URL.createObjectURL(blob),probe=new Audio(),timer=setTimeout(()=>finish(false),15000);function finish(ok){clearTimeout(timer);probe.onloadedmetadata=null;probe.onerror=null;probe.removeAttribute('src');probe.load();URL.revokeObjectURL(url);ok?resolve():reject(Error('تعذّر قراءة التسجيل الصوتي؛ اختر ملفًا قابلًا للتشغيل.'));}probe.onloadedmetadata=()=>finish(probe.duration>0);probe.onerror=()=>finish(false);probe.src=url;});
 const phone=normalizePhone($('adhanPhone').value),path='public/'+kind+'/'+crypto.randomUUID(),display_name=$('adhanName').value.trim(),title=$('adhanTitle').value.trim();
 if(display_name.length<2||title.length<2)throw Error('أدخل الاسم والعنوان بحرفين على الأقل.');
 message('جارٍ رفع '+type.label+'…');await request('/storage/v1/object/adhan-community/'+path,{method:'POST',raw:true,auth:false,body:blob,headers:{'Content-Type':blob.type.split(';')[0],'x-upsert':'false'}});
 await request('/rest/v1/adhan_recordings',{method:'POST',auth:false,headers:{Prefer:'return=minimal'},body:{display_name,title,contact_phone:phone,object_path:path,audio_kind:kind}});
 saveGuestPhone(phone);$('adhanPublish').reset();$('adhanPhone').value=phone;discardDirectRecording();if(activeKind===kind){await load(true);message(type.published+' لم يُضف تلقائيًا إلى أصوات التنبيه.');}else message(type.published+' افتح قسم '+type.label+' لمشاهدته.');
 });};
document.querySelectorAll('[data-platform-tab]').forEach(button=>button.addEventListener('click',()=>setKind(button.dataset.platformTab)));
document.querySelectorAll('[data-route="platform"]').forEach(button=>button.addEventListener('click',activate));
$('adhanRefresh').onclick=()=>load(true);$('adhanMore').onclick=()=>load();
root.addEventListener('prayer-library-change',localRecordings);root.addEventListener('beforeunload',discardDirectRecording);root.AudioPlatform={activate,setKind};paintAccount();paintRecorder();paintKind();if($('platform')?.classList.contains('active'))activate();
})(globalThis);
