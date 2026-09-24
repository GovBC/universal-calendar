(function(){
  'use strict';
  const records=[
    {id:'everest',name:'إيفرست',region:'الهيمالايا · نيبال / الصين',value:8848.86,lat:27.9881,lon:86.925,kind:'peak'},
    {id:'k2',name:'كي ٢',region:'قراقرم · باكستان / الصين',value:8611,lat:35.8808,lon:76.5133,kind:'peak'},
    {id:'kangchenjunga',name:'كانغشينجونغا',region:'الهيمالايا · نيبال / الهند',value:8586,lat:27.7025,lon:88.1475,kind:'peak'},
    {id:'challenger',name:'تشالنجر ديب',region:'الهادئ · خندق ماريانا',value:-10924,lat:11.369,lon:142.587,kind:'deep'},
    {id:'brownson',name:'براونسون ديب',region:'الأطلسي · خندق بورتوريكو',value:-8378,lat:19.712,lon:-67.311,kind:'deep'},
    {id:'factorian',name:'فاكتوريان ديب',region:'المحيط الجنوبي · خندق ساندويتش الجنوبي',value:-7432,lat:-60.479,lon:-25.542,kind:'deep'},
    {id:'java',name:'أعمق نقطة في خندق جاوة',region:'المحيط الهندي',value:-7187,lat:-11.129,lon:114.942,kind:'deep'},
    {id:'molloy',name:'حفرة مولوي',region:'المحيط المتجمد الشمالي',value:-5551,lat:79.194,lon:2.706,kind:'deep'}
  ];
  const currents=[
    {id:'gulf',name:'تيار الخليج',warm:true,points:[[-80,25],[-78,31],[-71,37],[-57,41],[-43,46]],text:'ينقل مياه دافئة من منطقة فلوريدا شمالًا ثم نحو شمال شرق الأطلسي. يمتد النقل شرقًا وشمالًا عبر تيار شمال الأطلسي.'},
    {id:'kuroshio',name:'كوروشيو',warm:true,points:[[123,22],[128,28],[134,32],[142,35],[153,36]],text:'يتجه شمالًا بمحاذاة تايوان وجنوب اليابان، ثم يمتد شرقًا إلى شمال المحيط الهادئ.'},
    {id:'brazil',name:'البرازيل',warm:true,points:[[-34,-10],[-38,-18],[-42,-24],[-48,-34]],text:'يحمل مياه دافئة جنوبًا بمحاذاة الساحل الشرقي لأمريكا الجنوبية.'},
    {id:'eastAustralia',name:'شرق أستراليا',warm:true,points:[[151,-16],[155,-24],[155,-32],[159,-37]],text:'يتحرك جنوبًا بمحاذاة الساحل الشرقي لأستراليا؛ تنفصل عنه دوامات وتتفرع مياهه.'},
    {id:'agulhas',name:'أغولهاس',warm:true,points:[[39,-19],[36,-27],[30,-33],[25,-37],[30,-40]],text:'يتجه جنوب غرب على امتداد جنوب شرق إفريقيا ثم يرتد قسم كبير من مياهه شرقًا.'},
    {id:'california',name:'كاليفورنيا',warm:false,points:[[-130,46],[-128,38],[-123,31],[-116,24]],text:'يتجه جنوبًا بمحاذاة الساحل الغربي لأمريكا الشمالية، مع صعود مياه أبرد في مناطق ساحلية.'},
    {id:'humboldt',name:'بيرو «همبولت»',warm:false,points:[[-78,-44],[-78,-31],[-81,-18],[-85,-5],[-96,-2]],text:'يتحرك شمالًا على امتداد تشيلي وبيرو؛ يرتبط بصعود مياه عميقة غنية بالمغذيات.'},
    {id:'canary',name:'الكناري',warm:false,points:[[-14,36],[-18,27],[-23,17],[-31,12]],text:'يتجه عمومًا جنوب غرب بمحاذاة شمال غرب إفريقيا.'},
    {id:'benguela',name:'بنغويلا',warm:false,points:[[14,-34],[10,-26],[8,-17],[3,-11]],text:'يتجه شمالًا بمحاذاة جنوب غرب إفريقيا، وترتبط به مناطق صعود مياه باردة.'},
    {id:'labrador',name:'لابرادور',warm:false,points:[[-55,61],[-56,53],[-51,46],[-48,43]],text:'ينقل مياه باردة جنوبًا على امتداد لابرادور ونيوفاوندلاند.'},
    {id:'oyashio',name:'أوياشيو',warm:false,points:[[166,53],[157,48],[149,42],[146,38]],text:'يتجه جنوب غرب من شمال غرب الهادئ إلى منطقة شرق اليابان.'},
    {id:'westAustralia',name:'غرب أستراليا',warm:false,points:[[109,-36],[107,-28],[106,-20],[101,-15]],text:'تيار محيطي عام يتجه شمالًا قبالة غرب أستراليا. لا يمثل تيار ليوين الساحلي الدافئ الذي يسير جنوبًا.'}
  ];
  const MATH={records,project:(lon,lat)=>[(lon+180)/360*100,(90-lat)/180*100],scalePercent:value=>Math.abs(value)/20000*100,tideAmplitude:degrees=>Math.sqrt(1.25+Math.cos(2*degrees*Math.PI/180)),latestDate:domain=>domain.split(',').map(s=>s.trim().split('/')).map(a=>a[1]||a[0]).filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s)).sort().pop(),dateAvailable:(date,domain)=>domain.split(',').some(s=>{const a=s.trim().split('/');return date>=a[0]&&date<=(a[1]||a[0]);})};
  globalThis.EarthOceanMath=MATH;
  if(typeof document==='undefined')return;
  const $=id=>document.getElementById(id),page=$('earth-surface');if(!page)return;
  const fmt=(n,d=0)=>new Intl.NumberFormat('ar-SA',{maximumFractionDigits:d}).format(n);
  const SNAPSHOT='2026-09-09',SST_LAYER='GHRSST_L4_MUR_Sea_Surface_Temperature';
  const metadataUrl=`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/${SST_LAYER}/default/GoogleMapsCompatible_Level7/all/all.xml`;
  let layer='relief',zoom=1,initialized=false,selectedCurrent='gulf',domain='',latest='',request=0,loading=false,feedback='',blobUrl='';
  let shown={date:SNAPSHOT,local:true};
  const options=(list)=>list.map(r=>`<option value="${r.id}">${r.name} — ${r.region}</option>`).join('');
  $('oceanPlace').innerHTML='<optgroup label="أعلى القمم">'+options(records.filter(r=>r.kind==='peak'))+'</optgroup><optgroup label="أعمق المحيطات">'+options(records.filter(r=>r.kind==='deep'))+'</optgroup>';
  $('oceanPeakSelect').innerHTML=options(records.filter(r=>r.kind==='peak'));$('oceanDeepSelect').innerHTML=options(records.filter(r=>r.kind==='deep'));
  $('oceanRecords').innerHTML=records.map(r=>`<tr><td>${r.name}<small>${r.region}</small></td><td dir="rtl">${fmt(Math.abs(r.value),r.id==='everest'?2:0)} م<small>${r.kind==='peak'?'فوق مستوى البحر':'تحت مستوى البحر'}</small></td></tr>`).join('');
  $('oceanScaleGrid').innerHTML=[8000,6000,4000,2000,0,-2000,-4000,-6000,-8000,-10000].map(n=>`<div class="ocean-scale-tick ${n===0?'zero':''}" style="--y:${(9000-n)/20000*100}%">${n===0?'مستوى البحر · ٠':(n>0?'+':'−')+fmt(Math.abs(n)/1000)+' كم'}</div>`).join('');
  $('oceanSstDate').value=SNAPSHOT;$('oceanSstDate').max=new Date().toISOString().slice(0,10);
  function choosePlace(){
    const p=records.find(r=>r.id===$('oceanPlace').value)||records[0],[x,y]=MATH.project(p.lon,p.lat);
    $('oceanMarker').style.setProperty('--x',x+'%');$('oceanMarker').style.setProperty('--y',y+'%');
    $('oceanPlaceDetail').innerHTML=`<strong>${p.name} · ${fmt(Math.abs(p.value),p.id==='everest'?2:0)} م</strong><p>${p.region} · ${p.kind==='peak'?'فوق مستوى البحر':'تحت مستوى البحر'}</p><span class="ocean-note">${fmt(Math.abs(p.lat),3)}° ${p.lat>=0?'شمالًا':'جنوبًا'}، ${fmt(Math.abs(p.lon),3)}° ${p.lon>=0?'شرقًا':'غربًا'}</span>`;
    if(zoom>1)centerMap();
  }
  function centerMap(){
    const p=records.find(r=>r.id===$('oceanPlace').value)||records[0],[x,y]=MATH.project(p.lon,p.lat),viewport=$('oceanMapViewport'),world=$('oceanMapWorld');
    viewport.scrollLeft=world.clientWidth*x/100-viewport.clientWidth/2;viewport.scrollTop=world.clientHeight*y/100-viewport.clientHeight/2;
  }
  function setZoom(value){zoom=Math.max(1,Math.min(4,value));$('oceanMapWorld').style.width=zoom*100+'%';$('oceanZoomReadout').textContent=fmt(zoom)+'×';$('oceanZoomOut').disabled=zoom===1;$('oceanZoomIn').disabled=zoom===4;requestAnimationFrame(centerMap);}
  function comparison(){
    const peak=records.find(r=>r.id===$('oceanPeakSelect').value),deep=records.find(r=>r.id===$('oceanDeepSelect').value),depth=-deep.value;
    $('oceanPeakBar').style.setProperty('--height',MATH.scalePercent(peak.value)+'%');$('oceanDeepBar').style.setProperty('--height',MATH.scalePercent(depth)+'%');
    $('oceanPeakName').textContent=peak.name;$('oceanDeepName').textContent=deep.name;$('oceanPeakValue').textContent=fmt(peak.value,2)+' م ارتفاعًا';$('oceanDeepValue').textContent=fmt(depth)+' م عمقًا';
    const delta=depth-peak.value;
    $('oceanComparisonText').textContent=`عمق ${deep.name} يعادل ${fmt(depth/peak.value,2)} مرة ارتفاع ${peak.name}. لو نقلنا طول هذا الارتفاع افتراضيًا إلى قاع الخندق، ${delta>=0?'لبقي أعلاه تحت سطح الماء بـ '+fmt(delta,2)+' م.':'لتجاوز سطح الماء بـ '+fmt(-delta,2)+' م.'}`;
    $('oceanScale').setAttribute('aria-label',`${peak.name} ${peak.value} متر فوق مستوى البحر و${deep.name} ${depth} متر تحته، بمقياس رأسي واحد من موجب ٩ إلى سالب ١١ كيلومترًا`);
  }
  function drawCurrents(){
    const svg=$('oceanCurrentsMap');
    svg.innerHTML='<defs><marker id="oceanArrowWarm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ffaf79"/></marker><marker id="oceanArrowCold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64d7ff"/></marker></defs>'+currents.map(c=>{
      const path=c.points.map(([lon,lat],i)=>{const [x,y]=MATH.project(lon,lat);return(i?'L':'M')+(x*14.4).toFixed(1)+' '+(y*7.2).toFixed(1);}).join(' ');
      return `<path d="${path}" fill="none" stroke="${c.warm?'#ffaf79':'#64d7ff'}" stroke-width="${c.id===selectedCurrent?5:3}" stroke-linecap="round" stroke-linejoin="round" opacity="${c.id===selectedCurrent?1:.65}" marker-end="url(#${c.warm?'oceanArrowWarm':'oceanArrowCold'})"/>`;
    }).join('');
    $('oceanCurrentList').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.oceanCurrent===selectedCurrent)));
    const c=currents.find(c=>c.id===selectedCurrent);$('oceanCurrentDetail').textContent=c.name+' · '+(c.warm?'دافئ نسبيًا. ':'بارد نسبيًا. ')+c.text;
  }
  $('oceanCurrentList').innerHTML=currents.map(c=>`<button data-ocean-current="${c.id}" aria-pressed="${c.id===selectedCurrent}">${c.name}</button>`).join('');
  function tide(){
    const angle=+$('oceanTidePhase').value,amp=MATH.tideAmplitude(angle),labels={0:'المحاق',90:'التربيع الأول',180:'البدر',270:'التربيع الأخير',360:'المحاق'},name=labels[angle]||'بين المراحل الرئيسية';
    $('oceanTidePhaseLabel').textContent=name+' · '+fmt(angle)+'°';$('oceanTidePhase').setAttribute('aria-valuetext',name+'، '+fmt(angle)+' درجة');
    const label=amp>1.3?'مدى أكبر، قريب من مدّ الربيع (المدّ السيزيجي).':amp<.7?'مدى أصغر، قريب من المدّ الضعيف عند التربيع.':'مدى متوسط بين حالتي الاصطفاف والتربيع.';
    $('oceanTideExplanation').textContent=label+' المقصود بمدّ الربيع زيادة المدى بين المد والجزر، وليس فصل الربيع.';
    const points=[];for(let x=0;x<=640;x+=4){const y=85-amp*40*Math.cos(x/640*Math.PI*4);points.push((x===0?'M':'L')+x+' '+y.toFixed(2));}
    $('oceanTideChart').innerHTML='<path d="M0 85H640" stroke="currentColor" opacity=".2" stroke-dasharray="6 6"/><path d="'+points.join(' ')+' L640 170L0 170Z" fill="rgba(85,216,242,.12)"/><path d="'+points.join(' ')+'" fill="none" stroke="#55c5e8" stroke-width="3"/>';
    $('oceanTideChart').setAttribute('aria-label',name+' — '+label+' الرسم نسبي وليس توقعًا ساحليًا.');
  }
  function status(){
    $('oceanMapSource').textContent=layer==='sst'?'NASA GIBS · GHRSST MUR SST':'NOAA NCEI · ETOPO1';
    $('oceanMapStatus').textContent=layer==='sst'?`${loading?'جارٍ التحديث؛ المعروض حاليًا: ':''}${shown.local?'نسخة محفوظة':'تحليل يومي'} · ${shown.date} (UTC)${feedback?' · '+feedback:''}`:layer==='currents'?'مسارات تعليمية عامة؛ ليست تيارات لحظية':'خريطة مرجعية ثابتة؛ ليست رصدًا آنيًا';
    $('oceanSstImage').alt='حرارة سطح البحر، تحليل MUR بتاريخ '+shown.date+(shown.local?'، نسخة محفوظة':'');
  }
  function chooseLayer(value){
    layer=value;$('oceanMapWorld').dataset.layer=value;
    page.querySelectorAll('[data-ocean-layer]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.oceanLayer===value)));
    $('oceanReliefImage').hidden=value==='sst';$('oceanSstImage').hidden=value!=='sst';$('oceanCurrentsMap').toggleAttribute('hidden',value!=='currents');$('oceanMarker').hidden=value==='currents';
    $('oceanReliefLegend').hidden=value!=='relief';$('oceanCurrentsPanel').hidden=value!=='currents';$('oceanSstPanel').hidden=value!=='sst';
    if(value==='sst'&&!initialized){initialized=true;$('oceanSstImage').src='./data/ocean-sst-'+SNAPSHOT+'.png';loadSst(null);}
    status();
  }
  async function fetchTimed(url,ms=16000,type='text'){const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),ms);try{const r=await fetch(url,{signal:abort.signal});if(!r.ok)throw new Error('HTTP '+r.status);if(type==='blob'&&!r.headers.get('content-type')?.includes('image/png'))throw new Error('image unavailable');return await r[type]();}finally{clearTimeout(timer);}}
  async function loadSst(date){
    const token=++request;loading=true;feedback='';status();
    try{
      if(!date||!domain){const text=await fetchTimed(metadataUrl,10000),xml=new DOMParser().parseFromString(text,'application/xml');const d=Array.from(xml.getElementsByTagNameNS('*','Domain')).map(n=>n.textContent).find(t=>/\d{4}-\d{2}-\d{2}/.test(t));if(!d)throw new Error('dates unavailable');domain=d;latest=MATH.latestDate(d);if(!latest)throw new Error('latest unavailable');if(token!==request)return;$('oceanSstDate').max=latest;}
      const requested=date||latest;
      if(!/^\d{4}-\d{2}-\d{2}$/.test(requested)||!MATH.dateAvailable(requested,domain))throw new Error('date unavailable');
      const params=new URLSearchParams({SERVICE:'WMS',REQUEST:'GetMap',VERSION:'1.1.1',LAYERS:SST_LAYER,STYLES:'',FORMAT:'image/png',TRANSPARENT:'TRUE',SRS:'EPSG:4326',BBOX:'-180,-90,180,90',WIDTH:'1440',HEIGHT:'720',TIME:requested});
      const blob=await fetchTimed('https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?'+params,20000,'blob');if(token!==request)return;
      const url=URL.createObjectURL(blob),probe=new Image();probe.src=url;
      try{await probe.decode();}catch(error){URL.revokeObjectURL(url);throw error;}
      if(token!==request){URL.revokeObjectURL(url);return;}
      if(blobUrl)URL.revokeObjectURL(blobUrl);blobUrl=url;$('oceanSstImage').src=url;shown={date:requested,local:false};$('oceanSstDate').value=requested;feedback='';
    }catch(error){if(token!==request)return;feedback=error.message==='date unavailable'?'لا تتوفر صورة لهذا التاريخ؛ أُبقيت الصورة المؤرخة المعروضة':'تعذّر التحديث؛ أُبقيت الصورة المؤرخة المعروضة';}
    finally{if(token===request){loading=false;status();}}
  }
  $('oceanReliefImage').addEventListener('error',()=>{if(layer!=='sst')$('oceanMapStatus').textContent='تعذّر تحميل خريطة التضاريس؛ أعد فتح التبويب عند توفر الاتصال.';});
  $('oceanSstImage').addEventListener('error',()=>{feedback='تعذّر تحميل الصورة';status();});
  page.querySelectorAll('[data-ocean-layer]').forEach(b=>b.addEventListener('click',()=>chooseLayer(b.dataset.oceanLayer)));
  $('oceanPlace').addEventListener('change',choosePlace);$('oceanZoomIn').addEventListener('click',()=>setZoom(zoom+1));$('oceanZoomOut').addEventListener('click',()=>setZoom(zoom-1));$('oceanZoomReset').addEventListener('click',()=>setZoom(1));
  $('oceanPeakSelect').addEventListener('change',comparison);$('oceanDeepSelect').addEventListener('change',comparison);$('oceanTidePhase').addEventListener('input',tide);
  page.querySelectorAll('[data-tide-phase]').forEach(b=>b.addEventListener('click',()=>{$('oceanTidePhase').value=b.dataset.tidePhase;tide();}));
  $('oceanCurrentList').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{selectedCurrent=b.dataset.oceanCurrent;drawCurrents();}));
  $('oceanSstLatest').addEventListener('click',()=>loadSst(null));$('oceanSstLoad').addEventListener('click',()=>loadSst($('oceanSstDate').value));
  window.earthOcean={activate(){if(zoom>1)requestAnimationFrame(centerMap);}};
  choosePlace();comparison();tide();drawCurrents();status();
})();
