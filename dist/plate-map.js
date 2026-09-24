(function(){
  const canvas=document.getElementById('plateMapCanvas'),wrap=canvas?.closest('.plate-map-real'),loading=document.getElementById('plateMapLoading');
  if(!canvas||!wrap)return;
  const ctx=canvas.getContext('2d'); let land=null,queued=0;
  const labels=[
    ['الهادئ',-151,8],['أمريكا الشمالية',-105,48],['أمريكا الجنوبية',-60,-19],
    ['الأوراسية',55,52],['الإفريقية',21,9],['العربية',46,26],['الهندية',79,19],['الأسترالية',135,-24],['القطب الجنوبي',18,-68]
  ];
  const boundaries={
    divergent:[
      [[-30,72],[-29,58],[-35,42],[-29,25],[-17,5],[-14,-18],[-20,-42],[-27,-55]],
      [[-108,27],[-111,12],[-113,-5],[-116,-22],[-119,-42],[-127,-56]],
      [[32,30],[42,16],[51,8],[57,-8],[63,-28]],[[72,-35],[91,-45],[112,-50],[133,-48]]
    ],
    convergent:[
      [[-78,56],[-106,49],[-125,42],[-121,32],[-112,21],[-104,7],[-99,-11],[-94,-26],[-88,-43],[-80,-55]],
      [[160,56],[169,48],[178,42],[-175,38],[-166,31],[-158,22]],
      [[143,46],[145,36],[141,27],[132,20],[125,13],[121,4],[122,-7],[132,-17],[142,-28],[154,-39]],
      [[22,37],[41,37],[59,33],[76,32],[91,28],[102,24]],[[-10,37],[5,40],[17,38],[28,36]]
    ],
    transform:[
      [[-125,41],[-120,37],[-116,33]],[[26,40],[36,40],[44,38]],[[165,-42],[172,-44],[178,-46]]
    ]
  };
  const colors={divergent:'#58d8ee',convergent:'#ffb45e',transform:'#c8a8ff'};
  const project=(lon,lat,w,h)=>[(lon+180)/360*w,(90-lat)/180*h];
  function ringPath(ring,w,h){
    let previous=null,started=false;
    for(const point of ring){const [x,y]=project(point[0],point[1],w,h);if(!previous||Math.abs(x-previous[0])>w*.48){ctx.moveTo(x,y);started=true;}else ctx.lineTo(x,y);previous=[x,y];}
    return started;
  }
  function allRings(geo){
    if(geo.type==='Polygon')return geo.coordinates;
    if(geo.type==='MultiPolygon')return geo.coordinates.flat();
    return [];
  }
  function drawText(text,lon,lat,w,h){
    const [x,y]=project(lon,lat,w,h),small=w<430; ctx.save();ctx.font=`700 ${small?9:11}px system-ui, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    const width=ctx.measureText(text).width+16,height=small?20:23;ctx.fillStyle='rgba(5,22,35,.78)';ctx.strokeStyle='rgba(203,236,239,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x-width/2,y-height/2,width,height,7);ctx.fill();ctx.stroke();ctx.fillStyle='#e8f6f7';ctx.fillText(text,x,y+1);ctx.restore();
  }
  function drawBoundary(type,lines,w,h){
    ctx.save();ctx.strokeStyle=colors[type];ctx.lineWidth=type==='convergent'?2.4:2;ctx.lineCap='round';ctx.lineJoin='round';ctx.setLineDash(type==='divergent'?[6,4]:type==='transform'?[2,5]:[]);
    for(const line of lines){ctx.beginPath();ringPath(line,w,h);ctx.stroke();}ctx.restore();
  }
  function draw(){
    queued=0;const rect=wrap.getBoundingClientRect(),w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height)),dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const ocean=ctx.createLinearGradient(0,0,w,h);ocean.addColorStop(0,'#154f70');ocean.addColorStop(.5,'#0c3856');ocean.addColorStop(1,'#071c31');ctx.fillStyle=ocean;ctx.fillRect(0,0,w,h);
    ctx.save();ctx.strokeStyle='rgba(159,227,237,.12)';ctx.lineWidth=1;for(let lon=-150;lon<180;lon+=30){const [x]=project(lon,0,w,h);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let lat=-60;lat<90;lat+=30){const [,y]=project(0,lat,w,h);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}ctx.restore();
    if(land){ctx.beginPath();for(const feature of land.features||[])for(const ring of allRings(feature.geometry||{}))ringPath(ring,w,h);ctx.fillStyle='#4d856f';ctx.fill('evenodd');ctx.strokeStyle='rgba(218,245,222,.78)';ctx.lineWidth=.7;ctx.stroke();}
    for(const [type,lines] of Object.entries(boundaries))drawBoundary(type,lines,w,h);
    ctx.save();ctx.fillStyle='rgba(255,194,103,.92)';ctx.font=`700 ${w<430?9:11}px system-ui, sans-serif`;ctx.textAlign='center';ctx.fillText('حلقة النار',w*.165,h*.82);ctx.restore();
    labels.filter(([text])=>w>=430||text!=='القطب الجنوبي').forEach(([text,lon,lat])=>drawText(text,lon,lat,w,h));
  }
  function requestDraw(){if(!queued)queued=requestAnimationFrame(draw);}
  new ResizeObserver(requestDraw).observe(wrap);
  fetch('./vendor/land.geojson').then(r=>{if(!r.ok)throw new Error('land unavailable');return r.json();}).then(data=>{land=data;loading.hidden=true;requestDraw();}).catch(()=>{loading.textContent='تعذّر تحميل شكل القارات؛ ما زالت حدود الصفائح التعليمية معروضة.';loading.classList.add('error');requestDraw();});
  requestDraw();
})();
