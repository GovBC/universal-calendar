(() => {
  const q = (selector) => document.querySelector(selector);
  const canvas = q('#atmosphereCanvas');
  if (!canvas) return;

  const layers = [
    {
      id: 'troposphere', label: 'التروبوسفير', short: 'الطبقة السفلى', number: 'الأولى',
      altitude: '٠–٨/١٨ كم', range: '٠–١٢ كم تقريبًا', color: '#55d8f2',
      temp: 'تنخفض مع الارتفاع', pressure: 'الأعلى؛ نحو ١٠١٣ هكتوباسكال عند السطح',
      role: 'الطقس والسحب ومعظم بخار الماء والهواء الذي نتنفسه.', radius: 1.04,
      table: 'الطقس، السحب، الطيران المدني، معظم كتلة الهواء.'
    },
    {
      id: 'stratosphere', label: 'الستراتوسفير', short: 'طبقة الأوزون', number: 'الثانية',
      altitude: 'نحو ١٢–٥٠ كم', range: '١٢–٥٠ كم تقريبًا', color: '#748cff',
      temp: 'ترتفع تدريجيًا بسبب امتصاص الأوزون للأشعة فوق البنفسجية', pressure: 'منخفض؛ يقارب ١ هكتوباسكال قرب أعلاها',
      role: 'تضم أعلى تراكيز الأوزون، وتتميز باستقرار نسبي مقارنة بالتروبوسفير.', radius: 1.13,
      table: 'الأوزون، امتصاص الأشعة فوق البنفسجية، تيارات نفاثة.'
    },
    {
      id: 'mesosphere', label: 'الميزوسفير', short: 'احتراق الشهب', number: 'الثالثة',
      altitude: 'نحو ٥٠–٨٥ كم', range: '٥٠–٨٥ كم تقريبًا', color: '#ad7fe4',
      temp: 'تنخفض حتى نحو −٩٠°م عند الميزوبوز', pressure: 'شديد الانخفاض',
      role: 'تحترق فيها معظم الشهب الصغيرة بسبب الاحتكاك مع الجزيئات.', radius: 1.24,
      table: 'أبرد منطقة تقريبًا، واحتراق معظم الشهب.'
    },
    {
      id: 'thermosphere', label: 'الثرموسفير', short: 'الأيونوسفير والشفق', number: 'الرابعة',
      altitude: 'نحو ٨٥–٦٠٠ كم', range: '٨٥–٦٠٠ كم تقريبًا', color: '#f6b85d',
      temp: 'ترتفع كثيرًا مع امتصاص الأشعة السينية وفوق البنفسجية', pressure: 'بالغ الانخفاض؛ الجزيئات متباعدة',
      role: 'توجد فيها أجزاء كبيرة من الأيونوسفير، وتظهر فيها الشفقات وتدور محطة الفضاء الدولية.', radius: 1.39,
      table: 'الأيونوسفير، الشفق القطبي، امتصاص الطاقة الشمسية.'
    },
    {
      id: 'exosphere', label: 'الإكسوسفير', short: 'الحد الخارجي التدريجي', number: 'الخامسة',
      altitude: 'نحو ٦٠٠–١٠٬٠٠٠ كم', range: '٦٠٠–١٠٬٠٠٠ كم تقريبًا', color: '#68d6ad',
      temp: 'لا تُقارن مباشرة بحرارة الهواء الكثيف؛ التصادمات نادرة جدًا', pressure: 'قريب من الفراغ',
      role: 'منطقة انتقال تدريجي إلى الفضاء، يغلب فيها الهيدروجين والهيليوم الخفيفان.', radius: 1.62,
      table: 'انتقال تدريجي إلى الفضاء، ذرات خفيفة ومدارات بعيدة.'
    }
  ];
  const ozone = layers[1];
  const state = { yaw: -0.52, pitch: -0.14, zoom: 1, playing: true, showHole: true, view: 'layers', selected: 'stratosphere', phase: 0, last: 0, raf: 0, dragging: false, px: 0, py: 0 };
  const arDigits = (value) => String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

  function active() { return q('#celestial-atmosphere')?.classList.contains('active'); }
  function getSize() { const r = canvas.getBoundingClientRect(); return { w: Math.max(1, r.width), h: Math.max(1, r.height) }; }
  function project(v, size) {
    const cy = Math.cos(state.yaw), sy = Math.sin(state.yaw);
    const x1 = v[0] * cy + v[2] * sy;
    const z1 = -v[0] * sy + v[2] * cy;
    const cp = Math.cos(state.pitch), sp = Math.sin(state.pitch);
    const y2 = v[1] * cp - z1 * sp;
    const z2 = v[1] * sp + z1 * cp;
    const perspective = 1 / (1 + z2 * 0.11);
    const scale = Math.min(size.w, size.h) * 0.205 * state.zoom;
    return { x: size.w * 0.43 + x1 * scale * perspective, y: size.h * 0.53 - y2 * scale * perspective, z: z2 };
  }
  function spherePoint(radius, latitude, longitude) {
    const cl = Math.cos(latitude);
    return [radius * cl * Math.cos(longitude), radius * Math.sin(latitude), radius * cl * Math.sin(longitude)];
  }
  function path3d(ctx, points, size, close = false) {
    const projected = points.map((p) => project(p, size));
    if (!projected.length) return;
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    for (let i = 1; i < projected.length; i++) ctx.lineTo(projected[i].x, projected[i].y);
    if (close) ctx.closePath();
    return projected;
  }
  function drawSphereShell(ctx, layer, size, index) {
    const center = project([0, 0, 0], size);
    const scale = Math.min(size.w, size.h) * 0.205 * state.zoom;
    const radius = layer.radius * scale;
    const selected = state.selected === layer.id;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `${layer.color}${selected ? '20' : '0b'}`;
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, radius * (0.96 + Math.abs(Math.sin(state.pitch)) * .05), radius * .82, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `${layer.color}${selected ? 'c9' : '65'}`;
    ctx.lineWidth = selected ? 2.3 : 1.05;
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, radius * .99, radius * .82, 0, 0, Math.PI * 2);
    ctx.stroke();
    for (let latitude = -60; latitude <= 60; latitude += 30) {
      const lat = latitude * Math.PI / 180;
      const pts = [];
      for (let i = 0; i <= 64; i++) pts.push(spherePoint(layer.radius, lat, -Math.PI + i * Math.PI * 2 / 64));
      path3d(ctx, pts, size);
      ctx.strokeStyle = `${layer.color}${selected ? '7b' : '32'}`;
      ctx.lineWidth = selected ? 1.05 : .65;
      ctx.stroke();
    }
    for (let longitude = 0; longitude < 180; longitude += 45) {
      const lon = longitude * Math.PI / 180;
      const pts = [];
      for (let i = 0; i <= 42; i++) pts.push(spherePoint(layer.radius, -Math.PI / 2 + i * Math.PI / 42, lon));
      path3d(ctx, pts, size);
      ctx.strokeStyle = `${layer.color}${selected ? '5b' : '22'}`;
      ctx.lineWidth = .65;
      ctx.stroke();
    }
    ctx.restore();
    if (index === 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,.12)';
      ctx.setLineDash([3, 7]);
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, radius * 1.03, radius * .85, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
  function drawEarth(ctx, size) {
    const center = project([0, 0, 0], size);
    const r = Math.min(size.w, size.h) * .205 * state.zoom;
    const g = ctx.createRadialGradient(center.x - r * .35, center.y - r * .42, r * .05, center.x, center.y, r * 1.12);
    g.addColorStop(0, '#55c9e2'); g.addColorStop(.52, '#1e6e9b'); g.addColorStop(1, '#092b4d');
    ctx.save();
    ctx.shadowColor = 'rgba(85,216,242,.38)'; ctx.shadowBlur = 26;
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(center.x, center.y, r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.clip();
    ctx.fillStyle = 'rgba(104,214,173,.68)';
    const land = [[-.34,-.18,.20,.28],[.17,-.31,.18,.28],[.25,.18,.24,.15],[-.12,.36,.14,.2]];
    land.forEach(([x,y,rx,ry]) => { ctx.beginPath(); ctx.ellipse(center.x + x*r, center.y + y*r, rx*r, ry*r, -.25, 0, Math.PI*2); ctx.fill(); });
    ctx.restore();
    ctx.strokeStyle = 'rgba(213,246,255,.65)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(center.x, center.y, r, 0, Math.PI * 2); ctx.stroke();
  }
  function drawHole(ctx, size) {
    if (!state.showHole || state.view !== 'layers') return;
    const r = ozone.radius;
    const pts = [];
    const limit = .32 + Math.sin(state.phase) * .025;
    for (let lat = -Math.PI / 2 + .025; lat <= -Math.PI / 2 + limit; lat += .035) {
      const ring = Math.cos(lat);
      for (let i = 0; i <= 52; i++) pts.push([r * ring * Math.cos(i * Math.PI * 2 / 52), r * Math.sin(lat), r * ring * Math.sin(i * Math.PI * 2 / 52)]);
    }
    const projected = pts.map((p) => project(p, size));
    if (projected.length) {
      ctx.save();
      ctx.fillStyle = 'rgba(239,94,119,.52)'; ctx.strokeStyle = 'rgba(255,177,135,.9)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(projected[0].x, projected[0].y); projected.slice(1).forEach((p) => ctx.lineTo(p.x, p.y)); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(255,221,159,.75)';
      const border = [];
      for (let i = 0; i <= 70; i++) border.push(project(spherePoint(r + .01, -Math.PI / 2 + limit, i * Math.PI * 2 / 70), size));
      ctx.beginPath(); ctx.moveTo(border[0].x, border[0].y); border.slice(1).forEach((p) => ctx.lineTo(p.x, p.y)); ctx.stroke();
      ctx.restore();
    }
  }
  function drawAxis(ctx, size) {
    const a = project([0, -1.82, 0], size), b = project([0, 1.82, 0], size);
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.setLineDash([4, 6]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
  }
  function drawSection(ctx, size) {
    const cx = size.w * .44, bottom = size.h * .84, earthR = Math.min(size.w, size.h) * .105 * state.zoom;
    const sectionHeights = [earthR * .43, earthR * .28, earthR * .26, earthR * .36, earthR * .58];
    let y = bottom - earthR * 1.6;
    ctx.save();
    ctx.fillStyle = '#1b6f9a'; ctx.shadowColor = 'rgba(85,216,242,.34)'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(cx, bottom, earthR, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(104,214,173,.64)'; ctx.beginPath(); ctx.ellipse(cx - earthR*.2, bottom - earthR*.08, earthR*.5, earthR*.26, -.2, 0, Math.PI*2); ctx.fill();
    ctx.restore();
    layers.forEach((layer, index) => {
      const h = sectionHeights[index]; const width = earthR * (1.12 + index * .33); const selected = state.selected === layer.id;
      const grad = ctx.createLinearGradient(cx - width, y, cx + width, y + h); grad.addColorStop(0, `${layer.color}${selected ? '55' : '23'}`); grad.addColorStop(1, `${layer.color}${selected ? '18' : '0b'}`);
      ctx.fillStyle = grad; ctx.strokeStyle = `${layer.color}${selected ? 'd7' : '7a'}`; ctx.lineWidth = selected ? 2.2 : 1;
      ctx.beginPath(); ctx.roundRect(cx - width, y, width*2, h - 3, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = selected ? '#fff' : 'rgba(235,248,255,.7)'; ctx.font = `${selected ? '700 ' : ''}12px Tajawal, sans-serif`; ctx.textAlign = 'center'; ctx.fillText(layer.label, cx, y + h/2 + 4);
      if (layer.id === 'stratosphere' && state.showHole) { ctx.fillStyle = 'rgba(239,94,119,.65)'; ctx.beginPath(); ctx.ellipse(cx + width*.36, y + h*.5, width*.18, h*.28, 0, 0, Math.PI*2); ctx.fill(); }
      y -= h;
    });
    ctx.fillStyle = 'rgba(145,169,189,.8)'; ctx.font = '11px Tajawal, sans-serif'; ctx.textAlign = 'right'; ctx.fillText('الفضاء', cx + earthR*1.2, y - 8); ctx.fillText('سطح الأرض', cx + earthR*1.2, bottom + 4);
  }
  function draw() {
    const size = getSize(); const d = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size.w * d; canvas.height = size.h * d;
    const ctx = canvas.getContext('2d'); if (!ctx) { q('#atmosphereFallback').hidden = false; return; }
    ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h);
    const bg = ctx.createRadialGradient(size.w*.42, size.h*.48, 5, size.w*.42, size.h*.5, Math.max(size.w,size.h)*.72); bg.addColorStop(0,'rgba(27,72,101,.23)'); bg.addColorStop(1,'rgba(2,10,20,0)'); ctx.fillStyle=bg; ctx.fillRect(0,0,size.w,size.h);
    if (state.view === 'section') drawSection(ctx, size); else { layers.slice().reverse().forEach((layer, idx) => drawSphereShell(ctx, layer, size, layers.length - 1 - idx)); drawEarth(ctx, size); drawHole(ctx, size); drawAxis(ctx, size); }
    if (state.playing && active()) { state.phase += .035; state.yaw += .0018; }
  }
  function renderFacts(layer) {
    q('#atmosphereHudLayer').textContent = layer.label;
    q('#atmosphereHudAltitude').textContent = layer.range;
    q('#atmosphereDetailKicker').textContent = `الطبقة ${layer.number}`;
    q('#atmosphereDetailTitle').textContent = layer.label;
    q('#atmosphereDetailText').textContent = layer.role;
    q('#atmosphereDetailFacts').innerHTML = `<div><dt>الارتفاع</dt><dd>${layer.altitude}</dd></div><div><dt>الحرارة</dt><dd>${layer.temp}</dd></div><div><dt>الضغط</dt><dd>${layer.pressure}</dd></div>`;
    document.querySelectorAll('[data-atmosphere-layer]').forEach((button) => { const on = button.dataset.atmosphereLayer === layer.id; button.classList.toggle('active', on); button.setAttribute('aria-selected', String(on)); });
  }
  function renderList() {
    q('#atmosphereLayerList').innerHTML = layers.map((layer) => `<button type="button" role="tab" aria-selected="${layer.id === state.selected}" data-atmosphere-layer="${layer.id}" style="--layer-color:${layer.color}"><i>${layer.number.slice(0,1)}</i><span><b>${layer.label}</b><small>${layer.short} • ${layer.range}</small></span></button>`).join('');
    document.querySelectorAll('[data-atmosphere-layer]').forEach((button) => button.addEventListener('click', () => { state.selected = button.dataset.atmosphereLayer; renderFacts(layers.find((layer) => layer.id === state.selected)); draw(); }));
  }
  function renderTable() { q('#atmosphereTableBody').innerHTML = layers.map((layer) => `<tr><th scope="row"><i style="--layer-color:${layer.color}"></i>${layer.label}</th><td>${layer.altitude}</td><td>${layer.temp}</td><td>${layer.table}</td></tr>`).join(''); }
  function reset() { state.yaw = -.52; state.pitch = -.14; state.zoom = 1; state.view = 'layers'; document.querySelectorAll('[data-atmosphere-view]').forEach((b) => b.classList.toggle('active', b.dataset.atmosphereView === 'layers')); draw(); }
  function frame(now) { const dt = Math.min(.05, (now - state.last) / 1000 || 0); state.last = now; if (active() && state.playing) { state.phase += dt * 1.4; state.yaw += dt * .075; draw(); } state.raf = requestAnimationFrame(frame); }
  canvas.addEventListener('pointerdown', (event) => { state.dragging = true; state.px = event.clientX; state.py = event.clientY; canvas.setPointerCapture?.(event.pointerId); });
  canvas.addEventListener('pointermove', (event) => { if (!state.dragging) return; state.yaw += (event.clientX - state.px) * .008; state.pitch = Math.max(-.9, Math.min(.9, state.pitch + (event.clientY - state.py) * .006)); state.px = event.clientX; state.py = event.clientY; draw(); });
  canvas.addEventListener('pointerup', () => { state.dragging = false; }); canvas.addEventListener('pointercancel', () => { state.dragging = false; });
  canvas.addEventListener('wheel', (event) => { event.preventDefault(); state.zoom = Math.max(.72, Math.min(1.45, state.zoom - event.deltaY * .001)); draw(); }, { passive: false });
  canvas.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') state.yaw -= .08; if (event.key === 'ArrowRight') state.yaw += .08; if (event.key === 'ArrowUp') state.pitch = Math.min(.9, state.pitch + .06); if (event.key === 'ArrowDown') state.pitch = Math.max(-.9, state.pitch - .06); draw(); });
  q('#atmospherePlay').addEventListener('click', (event) => { state.playing = !state.playing; event.currentTarget.textContent = state.playing ? 'Ⅱ إيقاف الحركة' : '▶ تشغيل الحركة'; event.currentTarget.setAttribute('aria-pressed', String(state.playing)); if (state.playing) draw(); });
  q('#atmosphereHoleToggle').addEventListener('click', (event) => { state.showHole = !state.showHole; event.currentTarget.classList.toggle('active', state.showHole); event.currentTarget.setAttribute('aria-pressed', String(state.showHole)); q('#atmosphereHoleLabel').hidden = !state.showHole; draw(); });
  q('#atmosphereReset').addEventListener('click', reset);
  document.querySelectorAll('[data-atmosphere-view]').forEach((button) => button.addEventListener('click', () => { state.view = button.dataset.atmosphereView; document.querySelectorAll('[data-atmosphere-view]').forEach((b) => b.classList.toggle('active', b === button)); q('#atmosphereHoleLabel').hidden = !state.showHole || state.view !== 'layers'; draw(); }));
  addEventListener('resize', draw);
  function activate() { renderFacts(layers.find((layer) => layer.id === state.selected)); renderList(); renderTable(); q('#atmosphereHoleLabel').hidden = !state.showHole || state.view !== 'layers'; draw(); }
  renderList(); renderTable(); renderFacts(ozone); requestAnimationFrame(frame);
  window.atmosphereModel = { activate };
})();
