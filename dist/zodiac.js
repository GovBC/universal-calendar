(function(){
'use strict';
const root=document.getElementById('zodiacExplorer');if(!root)return;
const C=window.ZodiacCalc,A=window.Astronomy,D=window.ZodiacData,L=window.LunarCalc;
if(!C||!A||!D||!L){root.innerHTML='<p role="alert">تعذّر تحميل حسابات النجوم. أعد تحميل الصفحة.</p>';return;}
const $=id=>document.getElementById('zx'+id),num=(v,n=1)=>new Intl.NumberFormat('ar-SA',{maximumFractionDigits:n,minimumFractionDigits:n}).format(v);
const cities=[['makkah','مكة المكرمة',21.4225,39.8262,'Asia/Riyadh'],['madinah','المدينة المنورة',24.4672,39.6111,'Asia/Riyadh'],['riyadh','الرياض',24.7136,46.6753,'Asia/Riyadh'],['doha','الدوحة',25.2854,51.531,'Asia/Qatar'],['cairo','القاهرة',30.0444,31.2357,'Africa/Cairo'],['london','لندن',51.5074,-.1278,'Europe/London'],['sydney','سيدني',-33.8688,151.2093,'Australia/Sydney']];
const stars=new Map(D.stars.map(s=>[s.hip,s]));
const referenceArabic={9884:'نجم الحمل',21421:'الدبران',37826:'رأس التوأم المؤخر',40526:'بيتا السرطان',49669:'قلب الأسد',65474:'السماك الأعزل',74785:'الزبانى الشمالية',80763:'قلب العقرب',86032:'رأس الحوّاء',90185:'القوس الجنوبي',107556:'ذنب الجدي',106278:'سعد السعود',7097:'إيتا الحوت',8903:'الشرطان',13209:'دلتا الحمل',17702:'ألسيوني في الثريا',26207:'لامبدا الجبار',31681:'غاما الجوزاء',37279:'الشعرى الشامية',42911:'دلتا السرطان',47908:'إبسيلون الأسد',54872:'ظهر الأسد',57632:'الصرفة',63608:'إبسيلون السنبلة',69701:'يوتا السنبلة',78401:'دلتا العقرب',85927:'الشولة',100345:'سعد الذابح',102618:'إبسيلون الدلو',110395:'سعد الأخبية',113963:'منكب الفرس',677:'سرة الفرس',5447:'بطن الحوت'};
const signs=D.constellations.filter(c=>c.id!=='Oph');
const state={kind:'constellations',selected:{constellations:'Ari',signs:'Ari',mansions:'m1'},loc:{...CalendarCore.location},date:new Date(),view:'globe',paths:true,bounds:true,yaw:.8,pitch:.4,zoom:1,playing:null};
let f,selectedPosition,sceneData=[],labelData=[],timer,eventTimer,engine=null,enginePromise=null,engineError=false,flat=null,flatPoints=[],expanded=false;
root.innerHTML=`
 <div class="zx-head"><h2>الأبراج والطوالع على الكرة السماوية</h2><div class="zx-modes" aria-label="نوع الخريطة"><button data-zx-kind="constellations" aria-pressed="true">الكوكبات ١٣</button><button data-zx-kind="signs" aria-pressed="false">الأبراج ١٢</button><button data-zx-kind="mansions" aria-pressed="false">المنازل ٢٨</button></div></div>
 <p class="zx-intro" id="zxModeNote"></p>
 <div class="zx-controls panel">
  <label class="zx-city">الموقع<select id="zxCity">${cities.map(c=>`<option value="${c[0]}">${c[1]}</option>`).join('')}<option value="custom">موقع مخصص</option></select></label>
  <label>التاريخ المحلي<input id="zxDate" type="date" min="1900-01-01" max="2100-12-31" required dir="ltr"></label>
  <label>الساعة المحلية<input id="zxClock" type="time" required dir="ltr"></label><button class="zx-now" id="zxNow">الآن</button>
  <details class="zx-location" id="zxLocation"><summary>الإحداثيات والمنطقة الزمنية · <span id="zxPlaceSummary"></span></summary><div class="zx-coordinates"><label>خط العرض<input id="zxLat" type="number" min="-90" max="90" step="0.0001" dir="ltr" required></label><label>خط الطول<input id="zxLon" type="number" min="-180" max="180" step="0.0001" dir="ltr" required></label><label>المنطقة الزمنية<input id="zxZone" list="zxZones" dir="ltr" required></label><button id="zxLocationApply">تطبيق الموقع</button><button id="zxLocate">استخدم موقعي</button></div><datalist id="zxZones">${[...new Set([...cities.map(c=>c[4]),'UTC','America/New_York'])].map(z=>`<option value="${z}">`).join('')}</datalist><small>المنطقة الزمنية تحدد معنى الساعة المدخلة؛ الإحداثيات تحدد الأفق.</small></details>
 </div>
 <p id="zxError" class="zx-error" role="alert" hidden></p>
 <div class="zx-select-row"><label>اختر عنصراً<select id="zxSelect"></select></label><button id="zxFocus">ركّز على الاختيار</button></div>
 <div class="zx-layout">
  <article class="panel zx-view-card">
   <div class="zx-tools"><div class="zx-views"><button data-zx-view="globe" aria-pressed="true">الكرة السماوية</button><button data-zx-view="observer" aria-pressed="false">من موقعي</button></div><div class="zx-views"><button id="zxReset">إعادة الضبط</button><button id="zxZoomIn" aria-label="تكبير المشهد">＋</button><button id="zxZoomOut" aria-label="تصغير المشهد">−</button><button id="zxFullscreen">ملء الشاشة</button></div></div>
   <div id="zxScene" class="zx-scene" tabindex="0" aria-label="مشهد نجوم ثلاثي الأبعاد. اسحب للتدوير، أو استخدم مفاتيح الأسهم وأزرار التكبير."><div class="zx-labels" id="zxLabels"></div><button id="zxExitFullscreen" class="zx-fullscreen-exit">إغلاق العرض الكامل</button></div>
   <p class="zx-caption" id="zxViewNote">اسحب للتدوير وقرّب بإصبعين. الأجرام على كرة رمزية حول الراصد؛ الجزء تحت الأفق خافت.</p>
   <div class="zx-legend"><span><i style="background:#72dcf5"></i>دائرة البروج</span><span><i style="background:#ef9f69"></i>مستوى مدار القمر</span><span><i style="background:#b1c0ce"></i>الأفق</span><span><i style="background:#ffd586"></i>الاختيار</span></div>
   <div class="zx-views"><button id="zxPaths" aria-pressed="true">المسارات</button><button id="zxBounds" aria-pressed="true">حدود الكوكبة</button></div>
   <div class="zx-scale"><label for="zxDayTime">الحركة اليومية <b id="zxTimeLabel"></b></label><input id="zxDayTime" type="range" min="0" max="1439" step="1" dir="ltr"><b>تغيّر الموضع خلال اليوم</b><button id="zxPlayDay" aria-pressed="false">تشغيل اليوم</button></div>
   <div class="zx-scale"><label for="zxYearTime">الحركة السنوية <b id="zxYearLabel"></b></label><input id="zxYearTime" type="range" min="0" max="364" step="1" dir="ltr"><b>نفس الساعة عبر السنة</b><button id="zxPlayYear" aria-pressed="false">تشغيل السنة</button></div>
  </article>
  <aside class="panel zx-detail">
   <span id="zxKind" class="zx-kind"></span><h3 id="zxName"></h3><p id="zxMeaning"></p>
   <div class="zx-ref"><span>النقطة التي يُحسب لها الارتفاع</span><b id="zxReference"></b><small id="zxReferenceNote"></small></div>
   <dl class="zx-numbers"><div><dt>الارتفاع الهندسي</dt><dd id="zxAltitude"></dd></div><div><dt>السمت من الشمال</dt><dd id="zxAzimuth"></dd></div></dl>
   <p id="zxStatus" class="zx-status"></p><p id="zxVisibility"></p>
   <div class="zx-events"><div><span>الشروق التالي</span><b id="zxRise">—</b></div><div><span>الغروب التالي</span><b id="zxSet">—</b></div></div>
   <div class="zx-solar"><b>الشمس في هذا الوقت</b><p id="zxSunIdentity"></p><p id="zxInclination"></p><p id="zxMoment"></p></div>
  </aside>
 </div>
 <div class="zx-picker" id="zxPicker" aria-label="قائمة عناصر السماء"></div>
 <details class="panel zx-science"><summary>كيف تقرأ الخريطة؟ الدقة والمصادر</summary>
  <p><b>الأبراج الحسابية</b> اثنا عشر قطاعاً، عرض كل منها ٣٠° بدءاً من الاعتدال الربيعي. <b>الكوكبات</b> مناطق فعلية متفاوتة الحدود؛ يعبر مسار الشمس ثلاث عشرة منها، بما فيها الحوّاء. يغيّر تقدّم الاعتدال موضع التقسيم الموسمي بالنسبة إلى النجوم عبر القرون.</p>
  <p><b>منازل القمر</b> ثمان وعشرون مجموعة أو منطقة نجمية في الموروث العربي. «الطالع» هنا طلوع نجومها فوق الأفق، وليس برج الميلاد. لا نعطيها حدوداً حسابية متساوية ولا مواعيد طلوع سنوية ثابتة. قد تختلف نجوم بعض المنازل بين الروايات، ومنها الذراع والفرغان.</p>
  <p>تصل الخطوط بين أبرز النجوم لتوضيح الشكل، ولا تمثل أجساماً أو روابط مادية. لا يعرض الرسم جميع أعضاء العناقيد. تحسب الكوكبة عند نجم مرجعي مسمّى، والبرج الحسابي عند منتصف قطاعه، والبلدة عند نقطة تمثيلية موضّحة.</p>
  <p>الإحداثيات النجمية مرجعها J2000 مع تصحيح تقدّم الاعتدال والترنّح. لا تُطبّق الحركة الذاتية للنجوم. الارتفاع والشروق والغروب هندسية لأفق مستوٍ، دون انكسار جوي أو تضاريس. ظهور النجم فوق الأفق لا يضمن رؤيته وسط ضوء النهار أو الغيوم.</p>
  <p>دائرة البروج هي المسار السنوي الظاهري للشمس. الدائرة البرتقالية تمثل مستوى مدار القمر اللحظي حول الأرض؛ ميله نحو ٥٫١° بالنسبة إلى دائرة البروج. موضع القمر محسوب من موقع الراصد وقد يبتعد قليلاً عن تلك الدائرة بسبب اختلاف المنظر. الدائرة ليست تنبؤاً دقيقاً بمساره طوال الشهر.</p>
  <p>المواعيد في البطاقة تخص عبور النقطة المحددة للأفق خلال الساعات الأربع والعشرين التالية. الطلوع الشروقي هو ظهور النجم قبل الشمس بعد غيابه في وهجها؛ يختلف بحسب المكان والجو، ولا يساوي مجرد شروقه اليومي. ارتباط الأنواء بالمواسم موروث محلي، وليس تأثيراً للنجم في الطقس.</p>
  <ul><li><a href="https://www.iau.org/IAU/IAU/Astronomy-FAQs/FAQs.aspx" target="_blank" rel="noopener noreferrer">الاتحاد الفلكي الدولي: الكوكبات والأبراج</a></li><li><a href="https://github.com/ofrohn/d3-celestial" target="_blank" rel="noopener noreferrer">بيانات النجوم والحدود: d3-celestial وHYG</a></li><li><a href="https://github.com/Stellarium/stellarium-skycultures/tree/master/arabic_lunar_stations" target="_blank" rel="noopener noreferrer">منازل القمر: توثيق خالد العجاجي في Stellarium</a></li><li><a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noopener noreferrer">حسابات Astronomy Engine</a> · <a href="https://eclipse.gsfc.nasa.gov/SEhelp/moonorbit.html" target="_blank" rel="noopener noreferrer">NASA: مدار القمر</a></li></ul>
 </details>`;
function items(){return state.kind==='signs'?signs:state.kind==='mansions'?D.mansions:D.constellations;}
function selected(){return items().find(x=>x.id===state.selected[state.kind])||items()[0];}
function reference(){const s=selected();if(state.kind==='signs')return null;return stars.get(s.ref)||{ra:s.coord[0],dec:s.coord[1]};}
function clock(d){return new Intl.DateTimeFormat('ar-SA',{timeZone:state.loc.zone,hour:'2-digit',minute:'2-digit',hourCycle:CalendarCore.hourCycle}).format(d);}
function moment(d){return new Intl.DateTimeFormat('ar-SA',{timeZone:state.loc.zone,calendar:'gregory',dateStyle:'medium',timeStyle:'short',hourCycle:CalendarCore.hourCycle}).format(d);}
function error(message=''){$('Error').textContent=message;$('Error').hidden=!message;}
function safely(fn){try{fn();error();}catch(e){stop();error(e.message||'تعذر الحساب. راجع التاريخ والموقع.');}}
function stop(){clearInterval(timer);timer=null;state.playing=null;$('PlayDay').textContent='تشغيل اليوم';$('PlayYear').textContent='تشغيل السنة';$('PlayDay').setAttribute('aria-pressed','false');$('PlayYear').setAttribute('aria-pressed','false');}
function validDate(d){const iso=L.dateISO(d,state.loc.zone);if(!Number.isFinite(+d)||iso<'1900-01-01'||iso>'2100-12-31')throw new Error('اختر تاريخاً بين ١٩٠٠ و٢١٠٠.');}
function fields(){
 const p=L.parts(state.date,state.loc.zone),iso=L.dateISO(state.date,state.loc.zone),b=L.dayBounds(iso,state.loc.zone);
 $('Date').value=iso;$('Clock').value=`${String(p.h).padStart(2,'0')}:${String(p.min).padStart(2,'0')}`;$('DayTime').max=Math.round((b.end-b.start)/60000)-1;$('DayTime').value=Math.floor((state.date-b.start)/60000);
 const start=Date.UTC(p.y,0,1),day=Date.UTC(p.y,p.m-1,p.d);$('YearTime').max=(Date.UTC(p.y+1,0,1)-start)/86400000-1;$('YearTime').value=(day-start)/86400000;
 $('TimeLabel').textContent=clock(state.date);$('YearLabel').textContent=new Intl.DateTimeFormat('ar-SA',{timeZone:state.loc.zone,calendar:'gregory',dateStyle:'medium'}).format(state.date);
 $('Lat').value=state.loc.lat;$('Lon').value=state.loc.lon;$('Zone').value=state.loc.zone;$('PlaceSummary').textContent=`${num(state.loc.lat,2)}°، ${num(state.loc.lon,2)}° · ${state.loc.zone}`;
}
function fillItems(){
 const notes={constellations:'نجوم وحدود الكوكبات الفلكية التي يعبرها مسار الشمس. اختر كوكبة لإبراز نجومها.',signs:'اثنا عشر قطاعاً متساوياً، كل منها ٣٠° من دائرة البروج. يبدأ الحمل الحسابي عند الاعتدال الربيعي.',mansions:'منازل القمر الثماني والعشرون عند العرب، ممثلة بنجومها المرجعية وتشكيلاتها.'};
 $('ModeNote').textContent=notes[state.kind];const arr=items(),id=selected().id;
 $('Select').innerHTML=arr.map((s,i)=>`<option value="${s.id}">${num(i+1,0)}. ${s.name}</option>`).join('');$('Select').value=id;
 $('Picker').innerHTML=arr.map((s,i)=>`<button data-zx-pick="${s.id}" aria-pressed="${s.id===id}">${s.name}${state.kind==='signs'?`<small dir="ltr">${i*30}°–${(i+1)*30}°</small>`:''}</button>`).join('');
 $('Bounds').hidden=state.kind!=='constellations';
 root.querySelectorAll('[data-zx-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.zxKind===state.kind)));
}
function choose(id){if(!items().some(x=>x.id===id))return;state.selected[state.kind]=id;$('Select').value=id;root.querySelectorAll('[data-zx-pick]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.zxPick===id)));update(true);}
function setDate(d){validDate(d);state.date=d;fields();update();}
function fromFields(){if(!$('Date').value||!$('Clock').value)throw new Error('أدخل التاريخ والساعة.');const [h,m]=$('Clock').value.split(':').map(Number);setDate(L.localDate($('Date').value,h*60+m,state.loc.zone));}
function setDayOfYear(day){const p=L.parts(state.date,state.loc.zone),iso=new Date(Date.UTC(p.y,0,1+day)).toISOString().slice(0,10);setDate(L.localDate(iso,p.h*60+p.min,state.loc.zone));}
function scheduleEvents(){
 clearTimeout(eventTimer);$('Rise').textContent='…';$('Set').textContent='…';
 eventTimer=setTimeout(()=>safely(()=>{
  let r=reference();if(!r){const i=signs.indexOf(selected()),v=C.rotate(f.ecl,C.equatorial(i*30+15,0),f.date),e=A.EquatorFromVector(new A.Vector(...v,f.date));r={ra:e.ra*15,dec:e.dec};}
  const e=C.starEvents(r,state.date,state.loc);const fmt=d=>d?`${clock(d)}${L.dateISO(d,state.loc.zone)!==L.dateISO(state.date,state.loc.zone)?' · اليوم التالي':''}`:e.alwaysUp?'دائم فوق الأفق':e.alwaysDown?'دائم تحت الأفق':'لا عبور خلال ٢٤ ساعة';
  $('Rise').textContent=fmt(e.rise);$('Set').textContent=fmt(e.set);
 }),180);
}
function update(focus=false){
 f=C.frame(state.date,state.loc);const s=selected(),i=signs.indexOf(s);selectedPosition=state.kind==='signs'?C.ecliptic(i*30+15,0,f):C.star(reference(),f).p;
 const h=C.angles(selectedPosition),sun=C.body('Sun',f),moon=C.body('Moon',f),plane=C.lunarPlane(f),identity=C.solarIdentity(state.date);
 $('Kind').textContent={constellations:'كوكبة فلكية',signs:'قطاع حسابي موسمي',mansions:'منزل قمري عربي'}[state.kind];$('Name').textContent=s.name;
 $('Meaning').textContent=state.kind==='signs'?`القطاع ${num(i*30,0)}°–${num((i+1)*30,0)}° من دائرة البروج؛ الاسم موروث من صورة ${s.meaning}.`:`معنى الاسم أو صورته: ${s.meaning}.`;
 $('Reference').textContent=state.kind==='signs'?`منتصف قطاع ${s.name} · ${num(i*30+15,0)}°`:(referenceArabic[s.ref]?referenceArabic[s.ref]+' · ':'')+s.refName+(s.ref?` · HIP ${s.ref}`:'');
 $('ReferenceNote').textContent=state.kind==='signs'?'نقطة حسابية؛ ليست نجماً.':s.ref?'ارتفاع النجم المرجعي؛ تختلف ارتفاعات بقية النجوم.':'نقطة تمثيلية: RA 285°، Dec −21° (J2000). ليست نجماً.';
 $('Altitude').textContent=num(h.altitude)+'°';$('Azimuth').textContent=num(h.azimuth)+'°';$('Status').textContent=`${h.altitude>=0?'فوق الأفق':'تحت الأفق'} · جهة ${L.direction(h.azimuth)}`;
 $('Visibility').textContent=h.altitude<0?'النقطة المختارة تحت الأفق في هذا الوقت.':sun.altitude>-.833?'الشمس فوق الأفق أو قربه؛ ظهور النقطة حسابياً لا يعني رؤية النجوم.':sun.altitude> -18?'وقت الشفق؛ تتأثر رؤية النجوم بسطوع السماء.':'سماء ليلية حسابياً؛ الرؤية تتأثر بالطقس والتلوث الضوئي.';
 $('SunIdentity').textContent=`الكوكبة: ${D.constellations.find(x=>x.id===identity.constellation)?.name||identity.constellation} · البرج الحسابي: ${signs[identity.sign].name}`;
 $('Inclination').textContent=`ميل مستوى مدار القمر: ${num(plane.inclination,2)}° عن دائرة البروج.`;$('Moment').textContent=moment(state.date)+' · '+state.loc.zone;
 buildScene(s,sun,moon,plane);if(focus)focusOnSelection(false);render();scheduleEvents();
}
function path(coords,color,alpha=1){sceneData.push({type:'line',points:coords,color,alpha});}
function marker(p,color,size,label,selected=false,id=null){sceneData.push({type:'point',points:[p],color,size,id});if(label)labelData.push({p,text:label,selected});}
function buildScene(s,sun,moon,plane){
 sceneData=[];labelData=[];
 const active=new Set(state.kind==='mansions'?s.stars:[]),ref=s.ref;
 const starPositions=D.stars.map(st=>{const p=C.star(st,f).p;return {p,mag:st.mag,bv:st.bv,selected:active.has(st.hip)||st.hip===ref};});sceneData.push({type:'stars',stars:starPositions});
 if(state.kind==='constellations'){
  for(const con of D.constellations)for(const points of con.lines)path(points.map(p=>C.point(...p,f)),con.id===s.id?'#ffd586':'#547b92',con.id===s.id?1:.4);
  if(state.bounds)for(const polygon of s.bounds)path(polygon.map(p=>C.point(...p,f)),'#a4b6ce',.65);
 }else if(state.kind==='mansions'){
  if(s.stars.length>1&&s.id!=='m3'&&s.id!=='m8')path(s.stars.map(id=>C.star(stars.get(id),f).p),'#ffd586',.85);
  for(const m of D.mansions){const p=m.ref?C.star(stars.get(m.ref),f).p:C.point(...m.coord,f);marker(p,m.id===s.id?'#ffd586':'#9c8bc9',4,null,false,m.id);}
 }
 const horizon=Array.from({length:181},(_,i)=>[Math.cos(i*Math.PI/90),-Math.sin(i*Math.PI/90),0]);path(horizon,'#b1c0ce',.75);
 if(state.paths){
  if(state.kind==='signs'){for(let i=0;i<12;i++){const points=Array.from({length:31},(_,j)=>C.ecliptic(i*30+j,0,f));path(points,signs[i].id===s.id?'#ffd586':i%2?'#72dcf5':'#3c8eaa',1);path([C.ecliptic(i*30,-3,f),C.ecliptic(i*30,3,f)],'#72dcf5',.8);}}
  else path(Array.from({length:181},(_,i)=>C.ecliptic(i*2,0,f)),'#72dcf5',.9);
  path(plane.path,'#ef9f69',.75);path(plane.arc,'#f6dcba',1);labelData.push({p:plane.label,text:num(plane.inclination,1)+'°',selected:false});
  marker(C.ecliptic(0,0,f),'#72dcf5',6,'الاعتدال · ٠°');
 }
 marker(selectedPosition,'#ffd586',9,s.name,true);
 marker(sun.p,'#ffda79',14,'الشمس');marker(moon.p,'#e5eef7',10,'القمر');
 if(state.view==='globe')marker([0,0,0],'#74e7dd',8,'الراصد');
 for(const [t,p] of [['الشمال',[1,0,0]],['الشرق',[0,-1,0]],['الجنوب',[-1,0,0]],['الغرب',[0,1,0]]])labelData.push({p:p.map(v=>v*1.07),text:t});
}
function sceneXYZ(p){return [-p[1]*1.6,p[2]*1.6,p[0]*1.6];}
async function initEngine(){
 if(enginePromise||engine)return enginePromise;
 enginePromise=(async()=>{
  try{
   const T=await import('./vendor/three.module.min.js'),renderer=new T.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,1,.01,50),group=new T.Group();scene.add(group);const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');$('Scene').prepend(canvas);
   engine={T,renderer,scene,camera,group,revision:null};render();
  }catch(e){engineError=true;const c=document.createElement('canvas');$('Scene').prepend(c);flat=c;const note=document.createElement('div');note.className='zx-fallback';note.textContent='تعذر العرض المجسم؛ هذا إسقاط تفاعلي مبسّط مع الحسابات نفسها.';$('Scene').append(note);render();}
 })();return enginePromise;
}
function cameraPosition(){const cp=Math.cos(state.pitch);return [Math.sin(state.yaw)*cp,Math.sin(state.pitch),Math.cos(state.yaw)*cp];}
function focusOnSelection(draw=true){const p=sceneXYZ(selectedPosition);state.yaw=Math.atan2(p[0],p[2]);state.pitch=Math.max(-1.35,Math.min(1.35,Math.asin(p[1]/1.6)));if(draw)render();}
function clearGroup(){const g=engine.group;while(g.children.length){const child=g.children[0];g.remove(child);child.geometry?.dispose();if(Array.isArray(child.material))child.material.forEach(m=>m.dispose());else child.material?.dispose();}}
function buildWebGL(){
 const {T,group}=engine;clearGroup();
 const circle=new T.Mesh(new T.CircleGeometry(1.6,96),new T.MeshBasicMaterial({color:'#132438',transparent:true,opacity:state.view==='globe'?.35:.12,side:T.DoubleSide,depthWrite:false}));circle.rotation.x=-Math.PI/2;circle.position.y=-.008;group.add(circle);
 for(const item of sceneData){
  const positions=[],colors=[],sizes=[];let points=item.points;
  if(item.type==='stars')points=item.stars.map(s=>s.p);
  points.forEach((p,i)=>{positions.push(...sceneXYZ(p));let color,size,fade=p[2]<0?.19:1;
   if(item.type==='stars'){const st=item.stars[i];color=new T.Color(st.selected?'#ffd586':st.bv>.9?'#ffe0bf':st.bv<.1?'#c3dcff':'#f2f4ff');size=st.selected?6:Math.max(1.6,5.1-st.mag*.62);}
   else{color=new T.Color(item.color);size=item.size||4;}color.multiplyScalar(fade*(item.alpha||1));colors.push(color.r,color.g,color.b);sizes.push(size);
  });
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  if(item.type==='line')group.add(new T.Line(g,new T.LineBasicMaterial({vertexColors:true,transparent:true,opacity:1,depthWrite:false})));
  else{g.setAttribute('size',new T.Float32BufferAttribute(sizes,1));const m=new T.ShaderMaterial({vertexColors:true,transparent:true,depthWrite:false,uniforms:{ratio:{value:Math.min(devicePixelRatio||1,2)}},vertexShader:'attribute float size; varying vec3 vColor; uniform float ratio; void main(){vColor=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_PointSize=size*ratio;}',fragmentShader:'varying vec3 vColor; void main(){float d=length(gl_PointCoord-vec2(0.5));if(d>0.5)discard;gl_FragColor=vec4(vColor,smoothstep(0.5,0.24,d));}'});group.add(new T.Points(g,m));}
 }
}
function render(){
 const rect=$('Scene').getBoundingClientRect();if(!rect.width||!rect.height)return;
 if(!engine&&!engineError){initEngine();return;}if(!f)return;
 if(engine){
  const {T,renderer,camera}=engine;renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.fov=state.view==='globe'?45:80/state.zoom;camera.updateProjectionMatrix();const p=cameraPosition();
  if(state.view==='globe'){const half=Math.min(22.5*C.D,Math.atan(Math.tan(22.5*C.D)*camera.aspect)),distance=1.85/Math.sin(half);camera.position.set(...p.map(x=>x*distance/state.zoom));camera.lookAt(0,0,0);}else{camera.position.set(0,0,0);camera.lookAt(...p);}
  if(engine.revision!==sceneData){buildWebGL();engine.revision=sceneData;}renderer.render(engine.scene,camera);
  const project=p=>{const v=new T.Vector3(...sceneXYZ(p)).project(camera);return {x:(v.x+1)*rect.width/2,y:(1-v.y)*rect.height/2,visible:v.z>=-1&&v.z<=1&&Math.abs(v.x)<1&&Math.abs(v.y)<1};};labels(project,rect);flatPoints=sceneData.filter(x=>x.id).map(x=>({...project(x.points[0]),id:x.id}));
 }else drawFlat(rect);
}
function labels(project,rect){
 const layer=$('Labels');layer.replaceChildren();const placed=[];
 // Selected name has priority. Other labels move only into vacant space.
 for(const l of [...labelData].sort((a,b)=>Number(!!b.selected)-Number(!!a.selected))){const p=project(l.p);if(!p.visible)continue;
  const el=document.createElement('span');el.className='zx-label'+(l.selected?' selected':'');el.textContent=l.text;layer.append(el);const w=el.offsetWidth,h=el.offsetHeight;let box=null;
  for(const dy of [-23,23,-48,48]){const x=Math.max(w/2+6,Math.min(rect.width-w/2-6,p.x)),y=Math.max(h/2+6,Math.min(rect.height-h/2-6,p.y+dy)),b={x:x-w/2,y:y-h/2,w,h};if(!placed.some(q=>b.x<q.x+q.w+6&&b.x+b.w+6>q.x&&b.y<q.y+q.h+5&&b.y+b.h+5>q.y)){box=b;break;}}
  if(!box){el.remove();continue;}placed.push(box);el.style.left=(box.x+w/2)+'px';el.style.top=(box.y+h/2)+'px';
 }
}
function drawFlat(rect){
 if(!flat)return;const dpr=Math.min(devicePixelRatio||1,2),c=flat.getContext('2d');flat.width=rect.width*dpr;flat.height=rect.height*dpr;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,rect.width,rect.height);const scale=Math.min(rect.width,rect.height)*.37*state.zoom;
 const project=p=>{const v=sceneXYZ(p),yaw=state.yaw,cp=Math.cos(state.pitch),sp=Math.sin(state.pitch),x=v[0]*Math.cos(yaw)-v[2]*Math.sin(yaw),z=v[0]*Math.sin(yaw)+v[2]*Math.cos(yaw),y=v[1]*cp-z*sp;return {x:rect.width/2+x/1.6*scale,y:rect.height/2-y/1.6*scale,visible:true};};
 c.beginPath();c.arc(rect.width/2,rect.height/2,scale,0,Math.PI*2);c.strokeStyle='#48627a';c.stroke();flatPoints=[];
 for(const item of sceneData){if(item.type==='stars'){for(const s of item.stars){const p=project(s.p);c.globalAlpha=s.p[2]<0?.18:.8;c.fillStyle=s.selected?'#ffd586':'#ecf3ff';c.beginPath();c.arc(p.x,p.y,s.selected?3:Math.max(.7,2.5-s.mag*.3),0,Math.PI*2);c.fill();}}else if(item.type==='line'){for(let i=1;i<item.points.length;i++){const a=project(item.points[i-1]),b=project(item.points[i]);c.globalAlpha=(item.points[i][2]<0?.2:1)*(item.alpha||1);c.strokeStyle=item.color;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}}else{const p=project(item.points[0]);c.globalAlpha=item.points[0][2]<0?.25:1;c.fillStyle=item.color;c.beginPath();c.arc(p.x,p.y,(item.size||5)/2,0,Math.PI*2);c.fill();if(item.id)flatPoints.push({...p,id:item.id});}}
 c.globalAlpha=1;labels(project,rect);
}
function activate(){if(!f)safely(()=>{fields();fillItems();update(true);});else render();}
root.addEventListener('click',e=>{
 const kind=e.target.closest('[data-zx-kind]'),pick=e.target.closest('[data-zx-pick]'),view=e.target.closest('[data-zx-view]');
 if(kind)safely(()=>{stop();state.kind=kind.dataset.zxKind;fillItems();update(true);});
 if(pick)safely(()=>choose(pick.dataset.zxPick));
 if(view){state.view=view.dataset.zxView;root.querySelectorAll('[data-zx-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===view)));$('ViewNote').textContent=state.view==='globe'?'اسحب للتدوير وقرّب بإصبعين. الأجرام على كرة رمزية حول الراصد؛ الجزء تحت الأفق خافت.':'من داخل القبة السماوية: اسحب لتغيير اتجاه النظر. الجهات مكتوبة على الأفق؛ النجوم تحت الأفق خافتة.';safely(()=>update(true));}
});
$('Select').addEventListener('change',()=>safely(()=>choose($('Select').value)));
$('Now').addEventListener('click',()=>safely(()=>{stop();setDate(new Date());}));
for(const id of ['Date','Clock'])$(id).addEventListener('change',()=>safely(()=>{stop();fromFields();}));
$('City').addEventListener('change',()=>safely(()=>{const city=cities.find(c=>c[0]===$('City').value);stop();if(!city){$('Location').open=true;return;}state.loc={lat:city[2],lon:city[3],zone:city[4],elevation:0};fields();update();}));
$('LocationApply').addEventListener('click',()=>safely(()=>{const lat=+$('Lat').value,lon=+$('Lon').value,zone=$('Zone').value.trim();if(!$('Lat').value||!$('Lon').value||!Number.isFinite(lat)||!Number.isFinite(lon)||lat< -90||lat>90||lon< -180||lon>180)throw new Error('خط العرض من −٩٠ إلى ٩٠، وخط الطول من −١٨٠ إلى ١٨٠.');try{new Intl.DateTimeFormat('en',{timeZone:zone}).format();}catch{throw new Error('أدخل منطقة زمنية صحيحة مثل Asia/Riyadh أو UTC.');}stop();state.loc={lat,lon,zone,elevation:0};$('City').value='custom';fields();update();}));
$('Locate').addEventListener('click',()=>{if(!navigator.geolocation){error('تحديد الموقع غير متاح؛ أدخل الإحداثيات يدوياً.');return;}$('Locate').disabled=true;navigator.geolocation.getCurrentPosition(p=>{safely(()=>{state.loc={lat:+p.coords.latitude.toFixed(4),lon:+p.coords.longitude.toFixed(4),zone:Intl.DateTimeFormat().resolvedOptions().timeZone,elevation:0};$('City').value='custom';stop();fields();update();});$('Locate').disabled=false;},()=>{error('تعذّر تحديد الموقع. اختر مدينة أو أدخل إحداثياتك.');$('Locate').disabled=false;},{timeout:12000,maximumAge:60000});});
$('DayTime').addEventListener('input',()=>safely(()=>{stop();const b=L.dayBounds($('Date').value,state.loc.zone);setDate(new Date(+b.start+ +$('DayTime').value*60000));}));
$('YearTime').addEventListener('input',()=>safely(()=>{stop();setDayOfYear(+$('YearTime').value);}));
function play(kind){if(state.playing===kind){stop();return;}stop();state.playing=kind;const b=$(kind==='day'?'PlayDay':'PlayYear');b.textContent='إيقاف';b.setAttribute('aria-pressed','true');timer=setInterval(()=>safely(()=>{if(document.hidden||!root.closest('.page')?.classList.contains('active')||!root.closest('.heritage-pane')?.classList.contains('active')){stop();return;}if(kind==='day')setDate(new Date(+state.date+15*60000));else{const p=L.parts(state.date,state.loc.zone),iso=new Date(Date.UTC(p.y,p.m-1,p.d+1)).toISOString().slice(0,10);setDate(L.localDate(iso,p.h*60+p.min,state.loc.zone));}}),450);}
$('PlayDay').addEventListener('click',()=>play('day'));$('PlayYear').addEventListener('click',()=>play('year'));
$('Focus').addEventListener('click',()=>focusOnSelection());$('Reset').addEventListener('click',()=>{state.zoom=1;focusOnSelection();});
function zoom(d){state.zoom=Math.max(.75,Math.min(state.view==='globe'?1.55:2,state.zoom*d));render();}
$('ZoomIn').addEventListener('click',()=>zoom(1.12));$('ZoomOut').addEventListener('click',()=>zoom(1/1.12));
$('Paths').addEventListener('click',()=>{state.paths=!state.paths;$('Paths').setAttribute('aria-pressed',String(state.paths));safely(()=>update());});$('Bounds').addEventListener('click',()=>{state.bounds=!state.bounds;$('Bounds').setAttribute('aria-pressed',String(state.bounds));safely(()=>update());});
$('Fullscreen').addEventListener('click',async()=>{try{if($('Scene').requestFullscreen)await $('Scene').requestFullscreen();else throw new Error();}catch{expanded=true;$('Scene').classList.add('expanded');$('ExitFullscreen').focus();render();}});
$('ExitFullscreen').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen();expanded=false;$('Scene').classList.remove('expanded');render();$('Fullscreen').focus();});
document.addEventListener('fullscreenchange',()=>render());
const pointers=new Map();let dragStart=null,pinch=null;
$('Scene').addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;$('Scene').setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});dragStart={x:e.clientX,y:e.clientY};pinch=null;});
$('Scene').addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch)zoom(d/pinch);pinch=d;}else{state.yaw-=(e.clientX-old.x)*.006;state.pitch=Math.max(-1.45,Math.min(1.45,state.pitch+(e.clientY-old.y)*.006));render();}});
function release(e){const isTap=dragStart&&Math.hypot(e.clientX-dragStart.x,e.clientY-dragStart.y)<5;if(isTap&&state.kind==='mansions'){const r=$('Scene').getBoundingClientRect(),hit=flatPoints.filter(p=>p.visible).map(p=>({...p,d:Math.hypot(e.clientX-r.left-p.x,e.clientY-r.top-p.y)})).sort((a,b)=>a.d-b.d)[0];if(hit&&hit.d<18)safely(()=>choose(hit.id));}pointers.delete(e.pointerId);pinch=null;dragStart=null;}
$('Scene').addEventListener('pointerup',release);$('Scene').addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);pinch=null;dragStart=null;});
$('Scene').addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(-e.deltaY*.001));},{passive:false});
$('Scene').addEventListener('keydown',e=>{if(e.key==='Escape'&&expanded){$('ExitFullscreen').click();return;}const keys={ArrowLeft:[.08,0],ArrowRight:[-.08,0],ArrowUp:[0,.08],ArrowDown:[0,-.08]};if(keys[e.key]){e.preventDefault();state.yaw+=keys[e.key][0];state.pitch=Math.max(-1.45,Math.min(1.45,state.pitch+keys[e.key][1]));render();}if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.12);}if(e.key==='-'){e.preventDefault();zoom(1/1.12);}});
new ResizeObserver(()=>render()).observe($('Scene'));document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
addEventListener('calendar-location',event=>{state.loc={...event.detail};safely(()=>{fields();update(true);});});
addEventListener('calendar-hour-cycle',()=>safely(()=>update(true)));
window.zodiacExplorer={activate};safely(()=>{fields();fillItems();update(true);});
})();
