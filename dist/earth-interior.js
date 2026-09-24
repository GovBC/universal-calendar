(function(){
  const $=id=>document.getElementById(id),canvas=$('interiorCanvas'),stage=$('interiorStage');
  if(!canvas||!stage)return;
  const data={
    crust:{title:'القشرة الأرضية',type:'الغلاف الصخري الخارجي',depth:'٠–٧٠ كم',color:'#8fc4d3',text:'القشرة هي الطبقة الخارجية الرقيقة التي نعيش عليها. تكون أرق تحت المحيطات وأسمك تحت القارات، وتتحرك فوقها الصفائح التكتونية.',facts:[['السماكة','٥–٧٠ كم'],['الحالة','صلبة'],['التركيب','صخور سيليكاتية'],['ما يميزها','قارات ومحيطات']]},
    mantle:{title:'الوشاح',type:'صخور حارة قابلة للجريان البطيء',depth:'حتى ٢٬٩٠٠ كم',color:'#bc704d',text:'الوشاح صخري في معظمه، لكنه يتشوه ويجري ببطء شديد على الأزمنة الجيولوجية. تنقل حركته الحرارية الطاقة وتؤثر في حركة الصفائح.',facts:[['السماكة','نحو ٢٬٩٠٠ كم'],['الحالة','صلب لدن ببطء'],['الحرارة','تزداد مع العمق'],['الدور','حمل حراري طويل الأمد']]},
    outerCore:{title:'اللب الخارجي',type:'معدن سائل تحت ضغط هائل',depth:'٢٬٩٠٠–٥٬١٥٠ كم',color:'#ed9c3b',text:'يتكون اللب الخارجي أساسًا من الحديد والنيكل في حالة سائلة. حركة هذا السائل الموصل للكهرباء هي جزء أساسي من الدينامو الذي يولد المجال المغناطيسي للأرض.',facts:[['السماكة','نحو ٢٬٢٦٠ كم'],['الحالة','سائل'],['المادة','حديد ونيكل'],['الدور','دينامو مغناطيسي']]},
    innerCore:{title:'اللب الداخلي',type:'معدن صلب في مركز الأرض',depth:'٥٬١٥٠–٦٬٣٧١ كم',color:'#fff0ba',text:'اللب الداخلي غني بالحديد والنيكل، وهو صلب رغم حرارته الشديدة لأن الضغط في مركز الأرض هائل جدًا. ينمو ببطء مع تبرد الكوكب على المدى الطويل.',facts:[['نصف القطر','نحو ١٬٢٢١ كم'],['الحالة','صلب'],['الضغط','شديد جدًا'],['الحرارة','آلاف الدرجات مئوية']]}
  };
  const plates={
    divergent:{label:'تباعد',title:'قاع بحر يتسع ببطء',text:'عند حيد وسط المحيط تصعد مواد ساخنة من الوشاح وتبرد، فتضيف قشرة محيطية جديدة بين صفيحتين تتباعدان.'},
    convergent:{label:'تقارب واندساس',title:'صخور تصطدم أو تهبط تحت بعضها',text:'قد تغوص صفيحة محيطية أكثر كثافة تحت أخرى، فتتكون خنادق وبراكين وأقواس جبلية، أو تتصادم قارتان فترتفع سلاسل جبلية.'},
    transform:{label:'انزلاق',title:'حركة جانبية على صدع',text:'تنزلق الصفائح بمحاذاة بعضها، فيتراكم الإجهاد ثم يتحرر أحيانًا في صورة زلزال. لا يمكن تحديد زمان زلزال بعينه بدقة من هذا النموذج.'}
  };
  let selected='crust',yaw=.22,drag=null,visible=false,frame=0;
  const ctx=canvas.getContext('2d');
  const fit=()=>{const rect=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));canvas.style.width=rect.width+'px';canvas.style.height=rect.height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);draw();};
  function pathRing(cx,cy,r,a0,a1){ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);}
  function draw(){
    frame=0;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;
    ctx.clearRect(0,0,w,h);const cx=w*.49,cy=h*.54,R=Math.min(w,h)*.395;
    const bg=ctx.createRadialGradient(cx,cy,4,cx,cy,R*1.8);bg.addColorStop(0,'rgba(255,165,83,.13)');bg.addColorStop(.5,'rgba(14,27,45,.06)');bg.addColorStop(1,'rgba(3,10,18,0)');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    const layers=[['crust',1],['mantle',.955],['outerCore',.56],['innerCore',.28]];
    const cutStart=-Math.PI*.18+yaw,cutEnd=Math.PI*.62+yaw;
    layers.forEach(([key,factor],i)=>{const d=data[key],r=R*factor;const grad=ctx.createRadialGradient(cx-r*.25,cy-r*.32,r*.08,cx,cy,r);grad.addColorStop(0, key==='innerCore'?'#fff9cf':d.color);grad.addColorStop(1,key==='crust'?'#356a78':key==='mantle'?'#713426':key==='outerCore'?'#a64e1d':'#e5ab55');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle=selected===key?'#ffffff':'rgba(255,255,255,.22)';ctx.lineWidth=selected===key?3:1;ctx.stroke();if(i<layers.length-1){ctx.save();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(cx,cy,R*layers[i+1][1],0,Math.PI*2);ctx.fill();ctx.restore();}});
    // Cutaway sector restores the complete nested layers so their depth relationship is immediately visible.
    layers.slice().reverse().forEach(([key,factor])=>{const d=data[key],r=R*factor;ctx.save();ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,cutStart,cutEnd);ctx.closePath();const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,key==='innerCore'?'#fff8cb':d.color);g.addColorStop(1,key==='crust'?'#6aa8b8':key==='mantle'?'#d17a50':key==='outerCore'?'#ef9d34':'#f7d576');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=selected===key?'#ffffff':'rgba(255,255,255,.3)';ctx.lineWidth=selected===key?3:1;ctx.stroke();ctx.restore();});
    ctx.save();ctx.setLineDash([4,5]);ctx.strokeStyle='rgba(255,255,255,.26)';ctx.lineWidth=1;pathRing(cx,cy,R*1.09,cutStart,cutEnd);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    const current=data[selected],labelX=Math.min(w-118,cx+Math.cos((cutStart+cutEnd)/2)*R*.72),labelY=cy+Math.sin((cutStart+cutEnd)/2)*R*.72;ctx.fillStyle='rgba(4,13,23,.82)';ctx.strokeStyle=current.color;ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(labelX-55,labelY-17,110,34,9);ctx.fill();ctx.stroke();ctx.fillStyle='#eef8fb';ctx.font='700 12px system-ui';ctx.textAlign='center';ctx.fillText(current.title,labelX,labelY+4);
  }
  function renderFacts(facts){return facts.map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');}
  function chooseLayer(key){if(!data[key])return;selected=key;const d=data[key];$('interiorLayerType').textContent=d.type;$('interiorLayerTitle').textContent=d.title;$('interiorLayerText').textContent=d.text;$('interiorDepthReadout').textContent=d.depth;$('interiorLayerFacts').innerHTML=renderFacts(d.facts);document.querySelectorAll('[data-interior-layer]').forEach(b=>{const on=b.dataset.interiorLayer===key;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));});draw();}
  function choosePlate(key){const d=plates[key];if(!d)return;$('plateTypeLabel').textContent=d.label;$('plateTypeTitle').textContent=d.title;$('plateTypeText').textContent=d.text;document.querySelectorAll('[data-plate-type]').forEach(b=>b.classList.toggle('active',b.dataset.plateType===key));}
  function fromPointer(e){const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,cx=r.width*.49,cy=r.height*.54,R=Math.min(r.width,r.height)*.395,d=Math.hypot(x-cx,y-cy)/R;return d>.955?'crust':d>.56?'mantle':d>.28?'outerCore':'innerCore';}
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>2){drag.moved=true;yaw+=dx*.008;drag.x=e.clientX;drag.y=e.clientY;draw();}});canvas.addEventListener('pointerup',e=>{if(!drag)return;if(!drag.moved)chooseLayer(fromPointer(e));drag=null;});canvas.addEventListener('pointercancel',()=>drag=null);
  document.querySelectorAll('[data-interior-layer]').forEach(b=>b.addEventListener('click',()=>chooseLayer(b.dataset.interiorLayer)));document.querySelectorAll('[data-plate-type]').forEach(b=>b.addEventListener('click',()=>choosePlate(b.dataset.plateType)));
  new ResizeObserver(fit).observe(stage);document.addEventListener('visibilitychange',()=>{if(!document.hidden&&visible)fit();});
  window.earthInterior={activate(){visible=true;fit();},deactivate(){visible=false;if(frame)cancelAnimationFrame(frame);}};
  chooseLayer(selected);choosePlate('divergent');
  if(document.getElementById('earth-interior')?.classList.contains('active'))window.earthInterior.activate();
})();
