(()=>{
  const $=s=>document.querySelector(s),canvas=$('#magnetosphereCanvas');
  if(!canvas)return;
  const recent=[['٢١ أغسطس ٢٠٢٤','عاصفة شديدة بعد قذف كتلي إكليلي','G4','أحد أقوى الأحداث في الدورة الشمسية الحالية.'],['١٠–١٢ مايو ٢٠٢٤','عاصفة تاريخية خلال الدورة ٢٥','G5','وصل النشاط إلى مستويات نادرة وأنتج شفقًا في مناطق واسعة.'],['٢٣–٢٤ مارس ٢٠٢٣','عاصفة قوية متعددة المراحل','G4','تسببت في اضطرابات مغناطيسية وشفق على عروض جغرافية منخفضة نسبيًا.']];
  const historic=[['١٣–١٥ مارس ١٩٨٩','عاصفة كيبيك','G5','أدت إلى انقطاع كهربائي واسع في كيبيك.'],['٢–٤ أغسطس ١٩٧٢','عاصفة شمسية سريعة','G5','حدثت بين بعثتي أبولو ١٦ و١٧ وكادت تكون خطرة على الرحلات المأهولة.'],['١–٢ سبتمبر ١٨٥٩','حدث كارينغتون','G5','من أشهر العواصف المسجلة تاريخيًا، قبل عصر الأقمار الصناعية.']];
  let storm=28,playing=true,raf=0,dragX=0;
  const arabic=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
  const fmt=n=>n==null?'—':arabic((Math.round(n*10)/10).toString().replace('.', '٫'));
  function arrow(c,x,y,angle,color){c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=color;c.beginPath();c.moveTo(0,0);c.lineTo(-8,-4);c.lineTo(-6,0);c.lineTo(-8,4);c.closePath();c.fill();c.restore()}
  function draw(){
    const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1,w=Math.max(1,r.width),h=Math.max(1,r.height);canvas.width=w*d;canvas.height=h*d;const c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);
    const cx=w*.43+dragX,cy=h*.52,earth=Math.min(w,h)*.065,pressure=storm/100,nose=Math.max(earth*2.6,earth*(5-pressure*2.3)),tail=Math.min(w*.66,earth*(13+pressure*7)),tailHalf=Math.min(h*.34,earth*(3.5+pressure*2.6));
    c.fillStyle='rgba(255,255,255,.025)';for(let i=0;i<35;i++){const x=(i*97)%w,y=(i*53)%h;c.fillRect(x,y,1,1)}
    const windColor=pressure>.62?'rgba(255,91,91,.72)':'rgba(240,155,93,.48)';
    for(let i=0;i<8;i++){const y=h*(.12+i*.105),start=-20,end=cx-nose-12;c.beginPath();c.moveTo(start,y);c.lineTo(end,y+Math.sin(i)*4);c.strokeStyle=windColor;c.lineWidth=1.4+pressure*1.2;c.stroke();for(let x=start+35+i*13;x<end-10;x+=72)arrow(c,x,y,0,windColor)}
    c.fillStyle='rgba(239,98,98,.08)';c.beginPath();c.ellipse(cx-nose-18,cy,nose*.32,h*.34,0,0,Math.PI*2);c.fill();
    c.beginPath();c.moveTo(cx-nose,cy);c.bezierCurveTo(cx-nose*.9,cy-h*.18,cx-earth*1.6,cy-h*.28,cx,cy-h*.30);c.bezierCurveTo(cx+tail*.42,cy-h*.24,cx+tail*.83,cy-h*.12,cx+tail,cy);c.bezierCurveTo(cx+tail*.83,cy+h*.12,cx+tail*.42,cy+h*.24,cx,cy+h*.30);c.bezierCurveTo(cx-earth*1.6,cy+h*.28,cx-nose*.9,cy+h*.18,cx-nose,cy);c.closePath();c.fillStyle=`rgba(48,141,255,${.07+pressure*.05})`;c.fill();c.strokeStyle=`rgba(85,216,242,${.45+pressure*.25})`;c.lineWidth=1.5+pressure*1.8;c.stroke();
    for(let i=0;i<7;i++){const f=i/6,spread=earth*(.72+f*.16),bow=nose*(.28+f*.15);c.beginPath();c.moveTo(cx-earth*.15,cy-spread);c.bezierCurveTo(cx-bow,cy-spread-earth*(1.6+f*.5),cx-nose*.88,cy-h*(.13+f*.035),cx-nose*.82,cy);c.bezierCurveTo(cx-nose*.88,cy+h*(.13+f*.035),cx-bow,cy+spread+earth*(1.6+f*.5),cx-earth*.15,cy+spread);c.strokeStyle=pressure>.62?'rgba(255,125,126,.82)':'rgba(92,197,255,.78)';c.lineWidth=1.1+f*.55;c.stroke()}
    for(let i=0;i<8;i++){const f=i/7,spread=earth*(.72+f*.17),y=tailHalf*(.16+f*.82);for(const sign of [-1,1]){c.beginPath();c.moveTo(cx+earth*.1,cy+sign*spread);c.bezierCurveTo(cx+tail*.18,cy+sign*y*.72,cx+tail*.58,cy+sign*y*.98,cx+tail*.98,cy+sign*y);c.strokeStyle=pressure>.62?'rgba(255,137,137,.72)':'rgba(84,178,255,.7)';c.lineWidth=1.05+f*.4;c.stroke()}}
    c.save();c.translate(cx,cy);c.strokeStyle=`rgba(104,214,173,${.35+pressure*.35})`;c.lineWidth=3;c.beginPath();c.ellipse(0,0,earth*1.35,earth*.72,0,0,Math.PI*2);c.stroke();const g=c.createRadialGradient(-earth*.35,-earth*.45,1,0,0,earth*1.4);g.addColorStop(0,'#fff0ae');g.addColorStop(.45,'#4ab8d0');g.addColorStop(1,'#14518b');c.fillStyle=g;c.shadowColor='#55d8f2';c.shadowBlur=20;c.beginPath();c.arc(0,0,earth,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle='rgba(255,255,255,.65)';c.stroke();c.restore();
    c.font='600 12px Tajawal, sans-serif';c.fillStyle='rgba(224,239,249,.76)';c.textAlign='center';c.fillText('الأرض',cx,cy+earth+19);c.textAlign='left';c.fillStyle='rgba(255,177,116,.8)';c.fillText('الرياح الشمسية →',16,28);c.fillStyle='rgba(121,196,255,.7)';c.fillText('ذيل مغناطيسي ممتد خلف الأرض',Math.min(w-220,cx+earth*2.2),cy-tailHalf*.75);
    if(playing)raf=requestAnimationFrame(draw);
  }
  function render(list){$('#magStormList').innerHTML=list.map(x=>`<article class="mag-storm-item"><time>${x[0]}</time><div><b>${x[1]}</b><p>${x[3]}</p></div><em>${x[2]}</em></article>`).join('')}
  function setStorm(v){storm=+v;$('#magStormValue').textContent=storm>70?'شديدة':storm>42?'نشطة':'هادئة';$('#magExplainTitle').textContent=storm>62?'انضغاط واضح أثناء العاصفة':'غلاف الأرض المغناطيسي';$('#magExplainText').textContent=storm>62?'يزداد ضغط الرياح الشمسية، فتتقلص الجهة المواجهة للشمس ويزداد اضطراب الذيل المغناطيسي حول الأرض.':'الأرض هي مصدر المجال هنا: تضغط الرياح الشمسية الجهة المواجهة للشمس، وتمدد خطوط المجال في ذيل مغناطيسي خلفها.';draw()}
  async function live(){
    try{
      const [m,k,f]=await Promise.all([
        fetch('https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json').then(r=>r.json()),
        fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json').then(r=>r.json()),
        fetch('https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json').then(r=>r.json())
      ]);
      const mag=m.at(-1),kp=k.at(-1),speed=f.at(-1);
      const bt=Number(mag?.[4]),kpv=Number(kp?.[1]),sp=Number(speed?.[2]);
      if(Number.isFinite(kpv)){
        $('#magKp').textContent=fmt(kpv);
        $('#magKpLabel').textContent=kpv>=5?'نشاط عاصفي':'هادئ إلى نشط';
        setStorm(Math.min(100,kpv*10));
      }
      if(Number.isFinite(bt))$('#magBt').textContent=fmt(bt);
      if(Number.isFinite(sp))$('#magPressure').textContent=fmt(Math.max(0,sp/430)**2*1.6);
      $('#magLiveLabel').textContent='بيانات حية';
      $('#magUpdatedAt').textContent='آخر قياس من SWPC';
      $('#magSourceStatus').textContent='متصل بمركز NOAA/SWPC';
    }catch(e){
      $('#magLiveLabel').textContent='وضع العرض المحلي';
      $('#magUpdatedAt').textContent='تتعذر قراءة المصدر الآن';
      $('#magSourceStatus').textContent='السجل المحلي يعمل دون اتصال';
    }
  }
  function activate(){render(recent);$('#magStormRange').value=storm;draw();live();clearInterval(window.__magTimer);window.__magTimer=setInterval(live,300000)}
  $('#magStormRange').oninput=e=>setStorm(e.target.value);$('#magPlay').onclick=e=>{playing=!playing;e.currentTarget.textContent=playing?'Ⅱ إيقاف الحركة':'▶ تشغيل الحركة';if(playing)draw();else cancelAnimationFrame(raf)};canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);canvas.dataset.x=e.clientX});canvas.addEventListener('pointermove',e=>{if(e.buttons){dragX+=(e.clientX-Number(canvas.dataset.x||e.clientX))*.35;canvas.dataset.x=e.clientX;draw()}});canvas.addEventListener('wheel',e=>{e.preventDefault();setStorm(Math.max(0,Math.min(100,storm-e.deltaY*.05)));$('#magStormRange').value=storm;},{passive:false});document.querySelectorAll('[data-mag-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-mag-view]').forEach(x=>x.classList.remove('active'));b.classList.add('active');setStorm(b.dataset.magView==='storm'?78:28)});document.querySelectorAll('[data-mag-record]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-mag-record]').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.magRecord==='historic'?historic:b.dataset.magRecord==='forecast'?[['الأيام القادمة','توقع SWPC يتغير مع الرصد','—','اضغط تحديث البيانات عند فتح التبويب لرؤية أحدث توقع.']]:recent)});addEventListener('resize',draw);window.magnetosphere={activate};
})();
