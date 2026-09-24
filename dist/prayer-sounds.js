(function(root){
'use strict';
const STORAGE_KEY='calendar.prayerSoundAssignments';
const DB_NAME='universal-calendar-audio',STORE='sounds',MAX_BYTES=8*1024*1024,MAX_RECORD_MS=120000;
const OFFICIAL_ADHAN_URL='./audio/official-adhan.mp3';
const MANSOUR_ADHAN_URL='./audio/adhan-sheikh-mansour-altamimi.m4a';
const PRAYERS=[
 {key:'fajr',name:'الفجر'},
 {key:'dhuhr',name:'الظهر'},
 {key:'asr',name:'العصر'},
 {key:'maghrib',name:'المغرب'},
 {key:'isha',name:'العشاء'},
 {key:'rawatib',name:'السنن الرواتب'},
 {key:'eclipse-lunar',name:'صلاة الخسوف'},
 {key:'eclipse-solar',name:'صلاة الكسوف'},
 {key:'jumuah',name:'صلاة الجمعة'},
 {key:'eid',name:'صلاة العيد'},
 {key:'istisqa',name:'صلاة الاستسقاء'},
 {key:'iqamah',name:'الإقامة التقديرية'}
];
const BUILTIN_SOUNDS=[
 {key:'official-adhan',name:'الأذان الأول — الشيخ عبدالعزيز الزري',url:OFFICIAL_ADHAN_URL},
 {key:'adhan-mansour-altamimi',name:'الأذان الثاني — الشيخ منصور التميمي',url:MANSOUR_ADHAN_URL}
];
let currentAudio,currentUrl,dbPromise,mediaRecorder,recordStream,recordChunks=[],recordStarted=0,recordTimer;
const byId=id=>document.getElementById(id);
const defaultSoundFor=()=> 'builtin:official-adhan';
function defaults(){return Object.fromEntries(PRAYERS.map(p=>[p.key,defaultSoundFor(p.key)]));}
function normalizeAssignments(value={}){
 const result=defaults();
 for(const prayer of PRAYERS){const selected=String(value&&value[prayer.key]||'');if(BUILTIN_SOUNDS.some(tone=>selected==='builtin:'+tone.key)||/^custom:[a-zA-Z0-9-]{6,80}$/.test(selected))result[prayer.key]=selected;}
 return result;
}
function readAssignments(){try{return normalizeAssignments(JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'));}catch{return defaults();}}
function saveAssignments(value){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(normalizeAssignments(value)));return true;}catch{return false;}}
function openDb(){
 if(dbPromise)return dbPromise;
 dbPromise=new Promise((resolve,reject)=>{if(!root.indexedDB){reject(Error('حفظ الملفات الصوتية غير مدعوم في هذا الجهاز'));return;}const request=indexedDB.open(DB_NAME,1);request.onupgradeneeded=()=>request.result.createObjectStore(STORE,{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(Error('تعذّر فتح مكتبة الأصوات'));});
 return dbPromise;
}
async function request(mode,operation){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE),result=operation(store);result.onsuccess=()=>resolve(result.result);result.onerror=()=>reject(Error('تعذّر حفظ الصوت'));});}
const listSounds=()=>request('readonly',store=>store.getAll()).then(items=>items.sort((a,b)=>b.createdAt-a.createdAt));
const getSound=id=>request('readonly',store=>store.get(id));
const removeSound=id=>request('readwrite',store=>store.delete(id));
async function addSound(blob,name,communityId=null){
 if(!(blob instanceof Blob)||!blob.size)throw Error('اختر ملفًا صوتيًا صالحًا');
 if(blob.size>MAX_BYTES)throw Error('حجم الصوت يجب ألا يتجاوز ٨ ميغابايت');
 if(blob.type&&!blob.type.startsWith('audio/'))throw Error('الملف المختار ليس ملفًا صوتيًا');
 const id='custom:'+((crypto.randomUUID&&crypto.randomUUID())||Date.now()+'-'+Math.random().toString(36).slice(2));
 const item={id,name:String(name||'صوت مخصص').trim().slice(0,60)||'صوت مخصص',blob,type:blob.type||'audio/webm',size:blob.size,createdAt:Date.now(),communityId};
 await request('readwrite',store=>store.add(item));return item;
}
function stopCurrent(){if(currentAudio){currentAudio.pause();currentAudio=null;}if(currentUrl){URL.revokeObjectURL(currentUrl);currentUrl=null;}}
async function playFor(prayerKey){
 const aliases={'سنة الفجر':'rawatib','سنة الظهر القبلية':'rawatib','سنة الظهر البعدية':'rawatib','سنة المغرب':'rawatib','سنة العشاء':'rawatib'};
 const prayer=PRAYERS.find(p=>p.key===(aliases[prayerKey]||prayerKey))||PRAYERS[0],selected=readAssignments()[prayer.key];stopCurrent();
 if(selected.startsWith('custom:')){const item=await getSound(selected);if(item){currentUrl=URL.createObjectURL(item.blob);currentAudio=new Audio(currentUrl);currentAudio.onended=stopCurrent;currentAudio.onerror=stopCurrent;await currentAudio.play();return true;}}
 if(selected==='builtin:official-adhan'&&root.AndroidCalendar?.previewAlarmSound){root.AndroidCalendar.previewAlarmSound('official-adhan');return true;}
 const tone=BUILTIN_SOUNDS.find(item=>selected==='builtin:'+item.key)||BUILTIN_SOUNDS[0];
 currentAudio=new Audio(tone.url);currentAudio.onended=stopCurrent;currentAudio.onerror=stopCurrent;await currentAudio.play();return true;
}
function fileToBase64(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');reader.onerror=()=>reject(Error('تعذّر قراءة الصوت'));reader.readAsDataURL(blob);});}
async function syncNative(prayerKey,selected){
 const bridge=root.AndroidCalendar;if(!bridge)return;
 try{
  if(selected.startsWith('custom:')){const item=await getSound(selected);if(item)bridge.saveAlarmSound(prayerKey,await fileToBase64(item.blob),item.type);return;}
  if(selected==='builtin:official-adhan'){bridge.clearAlarmSound(prayerKey);return;}
  const tone=BUILTIN_SOUNDS.find(item=>selected==='builtin:'+item.key);
  if(!tone){bridge.clearAlarmSound(prayerKey);return;}
  const response=await fetch(tone.url);if(!response.ok)throw Error('تعذّر تحميل الأذان');
  const blob=await response.blob();bridge.saveAlarmSound(prayerKey,await fileToBase64(blob),blob.type||'audio/mp4');
 }catch{}
}
function bytes(value){return value<1024*1024?Math.max(1,Math.round(value/1024))+' كيلوبايت':(value/1024/1024).toFixed(1)+' ميغابايت';}
function mount({toast=()=>{}}={}){
 const page=byId('worship');if(!page||page.dataset.soundsReady)return;page.dataset.soundsReady='true';
 const status=message=>{const element=byId('soundStatus');if(element)element.textContent=message;};
 const tabs=[...page.querySelectorAll('[data-worship-tab]')],panes=[...page.querySelectorAll('[data-worship-pane]')];
 function selectTab(name){tabs.forEach(button=>{const active=button.dataset.worshipTab===name;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});panes.forEach(pane=>pane.hidden=pane.dataset.worshipPane!==name);}
 tabs.forEach(button=>button.onclick=()=>selectTab(button.dataset.worshipTab));
 const assignments=readAssignments();
 root.addEventListener('prayer-library-change',()=>render());
 async function render(){
  let sounds=[];try{sounds=await listSounds();}catch(error){status(error.message);}
  const grid=byId('prayerSoundAssignments');grid.replaceChildren();
  for(const prayer of PRAYERS){
   const row=document.createElement('article');row.className='prayer-sound-row';
   const identity=document.createElement('div');identity.innerHTML=`<span aria-hidden="true">◷</span><span><b>${prayer.name}</b><small>صوت مستقل لهذا المنبّه</small></span>`;
   const select=document.createElement('select');select.setAttribute('aria-label','صوت صلاة '+prayer.name);
   for(const tone of BUILTIN_SOUNDS){const option=document.createElement('option');option.value='builtin:'+tone.key;option.textContent=tone.name;select.append(option);}
   for(const sound of sounds){const option=document.createElement('option');option.value=sound.id;option.textContent=sound.name;select.append(option);}
   select.value=assignments[prayer.key];if(!select.value){assignments[prayer.key]=defaultSoundFor(prayer.key);select.value=assignments[prayer.key];}
   select.onchange=async()=>{assignments[prayer.key]=select.value;const saved=saveAssignments(assignments);await syncNative(prayer.key,select.value);status(saved?'حُفظ صوت صلاة '+prayer.name+' على هذا الجهاز.':'طُبّق الصوت لهذه الجلسة، وتعذّر حفظ الاختيار.');root.dispatchEvent(new CustomEvent('prayer-sound-change',{detail:{prayer:prayer.key,sound:select.value}}));};
   const test=document.createElement('button');test.className='outline-button compact';test.type='button';test.textContent='استماع';test.onclick=()=>playFor(prayer.key).catch(error=>status(error.message||'تعذّر تشغيل الصوت'));
   row.append(identity,select,test);grid.append(row);
  }
  const library=byId('soundLibrary');library.replaceChildren();
  if(!sounds.length){const empty=document.createElement('p');empty.className='sound-empty';empty.textContent='لم تضف أصواتًا بعد.';library.append(empty);}
  for(const sound of sounds){
   const row=document.createElement('div');row.className='sound-library-row';
   const info=document.createElement('span');const title=document.createElement('b'),meta=document.createElement('small');title.textContent=sound.name;meta.textContent=bytes(sound.size)+' • محفوظ على هذا الجهاز';info.append(title,meta);
   const listen=document.createElement('button');listen.className='ghost-button';listen.type='button';listen.textContent='تشغيل';listen.onclick=async()=>{stopCurrent();currentUrl=URL.createObjectURL(sound.blob);currentAudio=new Audio(currentUrl);currentAudio.onended=stopCurrent;await currentAudio.play();};
   const remove=document.createElement('button');remove.className='ghost-button danger';remove.type='button';remove.textContent='حذف';remove.onclick=async()=>{await removeSound(sound.id);for(const prayer of PRAYERS)if(assignments[prayer.key]===sound.id){assignments[prayer.key]=defaultSoundFor(prayer.key);await syncNative(prayer.key,assignments[prayer.key]);}saveAssignments(assignments);status('حُذف الصوت وأُعيدت المنبّهات المرتبطة به إلى أصواتها الأصلية.');render();};
   row.append(info,listen,remove);library.append(row);
  }
 }
 async function saveAndAssign(blob,name,prayerKey){const item=await addSound(blob,name);assignments[prayerKey]=item.id;saveAssignments(assignments);await syncNative(prayerKey,item.id);await render();status('حُفظ «'+item.name+'» وعُيّن لمنبّه '+PRAYERS.find(p=>p.key===prayerKey).name+'.');toast('تم حفظ صوت المنبه');}
 byId('saveUploadedSound').onclick=async()=>{const input=byId('soundFile'),file=input.files&&input.files[0],button=byId('saveUploadedSound');button.disabled=true;try{await saveAndAssign(file,byId('soundUploadName').value||file?.name,byId('soundUploadPrayer').value);input.value='';byId('soundUploadName').value='';}catch(error){status(error.message||'تعذّر حفظ الملف الصوتي');}finally{button.disabled=false;}};
 function finishRecordingUi(){clearInterval(recordTimer);byId('recordSound').classList.remove('recording');byId('recordSound').textContent='بدء التسجيل';byId('recordTimer').textContent='٠٠:٠٠';recordStream?.getTracks().forEach(track=>track.stop());recordStream=null;mediaRecorder=null;}
 byId('recordSound').onclick=async()=>{
  const button=byId('recordSound');
  if(mediaRecorder&&mediaRecorder.state==='recording'){mediaRecorder.stop();return;}
  if(!navigator.mediaDevices?.getUserMedia||!root.MediaRecorder){status('التسجيل بالميكروفون غير مدعوم في هذا المتصفح');return;}
  try{
   recordStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
   const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(type=>MediaRecorder.isTypeSupported?.(type));recordChunks=[];mediaRecorder=new MediaRecorder(recordStream,mime?{mimeType:mime}:undefined);recordStarted=Date.now();
   mediaRecorder.ondataavailable=event=>{if(event.data.size)recordChunks.push(event.data);};
   mediaRecorder.onstop=async()=>{const blob=new Blob(recordChunks,{type:mediaRecorder?.mimeType||mime||'audio/webm'});finishRecordingUi();try{await saveAndAssign(blob,byId('recordSoundName').value||'تسجيل صوتي',byId('recordSoundPrayer').value);byId('recordSoundName').value='';}catch(error){status(error.message||'تعذّر حفظ التسجيل');}};
   mediaRecorder.start(500);button.classList.add('recording');button.textContent='إيقاف وحفظ';
   recordTimer=setInterval(()=>{const seconds=Math.floor((Date.now()-recordStarted)/1000);byId('recordTimer').textContent=new Intl.NumberFormat('ar-SA',{minimumIntegerDigits:2}).format(Math.floor(seconds/60))+':'+new Intl.NumberFormat('ar-SA',{minimumIntegerDigits:2}).format(seconds%60);if(Date.now()-recordStarted>=MAX_RECORD_MS)mediaRecorder?.stop();},250);
   status('جارٍ التسجيل… اضغط «إيقاف وحفظ» عند الانتهاء.');
  }catch(error){finishRecordingUi();status(error.name==='NotAllowedError'?'لم يُمنح إذن الميكروفون. اسمح به ثم أعد المحاولة.':'تعذّر بدء التسجيل بالميكروفون.');}
 };
 render().then(()=>Promise.all(PRAYERS.map(prayer=>syncNative(prayer.key,assignments[prayer.key]))));
}
root.PrayerSounds={PRAYERS,BUILTIN_SOUNDS,defaults,normalizeAssignments,readAssignments,saveAssignments,addSound,listSounds,getSound,removeSound,playFor,mount};
})(globalThis);
