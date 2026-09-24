const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const dist = path.join(__dirname, '../dist');
const read = file => fs.readFileSync(path.join(dist, file), 'utf8');
const A = require('../dist/vendor/astronomy.browser.min.js');

// Runtime integration harness, not a browser: real astronomy and Three maths,
// with DOM/GPU adapters that validate emitted drawing coordinates and controls.
async function harness({ gpu = true, standalone = false, width = 360 } = {}) {
  const elements = new Map(), drawing = [], errors = [], timers = [];
  class Element {
    constructor(tag = 'div') {
      this.tagName = tag; this.dataset = {}; this.style = {}; this.children = [];
      this.options = []; this.listeners = {}; this.value = ''; this.textContent = '';
      this.hidden = false; this.checked = false; this.isConnected = true;
      this.clientWidth = width; this.clientHeight = 320;
      this.offsetWidth = 50; this.offsetHeight = 20;
      this.classList = { toggle() {} };
    }
    set id(value) { this._id = value; elements.set(value, this); }
    get id() { return this._id; }
    setAttribute(key, value) { this[key] = String(value); }
    add(option) { this.options.push(option); if (this.options.length === 1) this.value = option.value; }
    append(child) { this.children.push(child); }
    replaceWith(next) { elements.set(this.id, next); this.isConnected = false; }
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
    fire(type) { const event = { target: this }; this['on' + type]?.(event); for (const fn of this.listeners[type] || []) fn(event); }
    querySelectorAll() { return buttons; }
    setPointerCapture() {}
    getContext() {
      const record = (name, args) => {
        assert.ok(args.every(value => typeof value !== 'number' || Number.isFinite(value)), name + ' emitted nonfinite coordinates');
        drawing.push([name, ...args]);
      };
      return new Proxy({}, { get: (target, key) => (...args) => record(key, args) });
    }
  }
  for (const [, id] of read('index.html').matchAll(/id="(moonMonth[^"]+)"/g)) { const element = new Element(); element.id = id; }
  const buttons = ['observer', 'orbit'].map(view => { const button = new Element('button'); button.dataset.moonMonthView = view; return button; });
  elements.get('moonMonthTime').value = '20:00';
  for (const name of ['Track', 'Trail', 'Below']) elements.get('moonMonth' + name).checked = true;
  elements.get('moonMonthFallback').hidden = true;
  const document = { readyState: 'complete', getElementById: id => elements.get(id), createElement: tag => new Element(tag) };
  const base = await import(pathToFileURL(path.join(dist, 'vendor/three.module.min.js')).href);
  const THREE = { ...base, WebGLRenderer: class {
    constructor() { if (!gpu) throw new Error('Simulated WebGL unavailable'); }
    setPixelRatio() {} setClearColor() {} setSize() {}
    render(scene, camera) {
      scene.updateMatrixWorld(); camera.updateMatrixWorld();
      scene.traverse(object => {
        const positions = object.geometry?.getAttribute('position')?.array;
        if (positions) assert.ok(Array.from(positions).every(Number.isFinite));
      });
      drawing.push(['render']);
    }
  } };
  const context = vm.createContext({ document, Astronomy: A, THREE, Date, Intl, Option: class {
    constructor(text, value) { this.text = text; this.value = value; }
  }, console: { error: error => errors.push(String(error)) }, ResizeObserver: class { observe() {} },
  devicePixelRatio: 2, performance: { now: () => 0 }, requestAnimationFrame: fn => timers.push(fn),
  setTimeout: fn => { timers.push(fn); }, addEventListener() {} });
  vm.runInContext(read('zodiac-data.js'), context);
  vm.runInContext(read('zodiac-calc.js'), context);
  if (standalone) {
    vm.runInContext(read('moon-month-fallback.js'), context);
    await Promise.resolve();
    timers.shift()?.();
    await Promise.resolve();
  } else vm.runInContext(read('moon-month-model.js').replace(/^import[^\n]+\n/, ''), context);
  return { elements, buttons, drawing, errors, context, timers };
}

test('hidden error overlay has an explicit CSS override for its display:grid', () => {
  assert.match(read('moon-month-model.css'), /\.moon-month-stage\s+\[hidden\]\s*\{\s*display:\s*none\s*!important\s*;?\s*\}/);
});

for (const mode of [{ name: '3D', gpu: true }, { name: 'no WebGL', gpu: false }, { name: 'module unavailable', standalone: true }]) {
  test('monthly Moon controls and rendering: ' + mode.name, async () => {
    const h = await harness(mode), $ = id => h.elements.get('moonMonth' + id);
    assert.ok(h.context.moonMonthModel, JSON.stringify(h.errors));
    assert.equal($('Fallback').hidden, true, JSON.stringify(h.errors));
    assert.ok(h.drawing.length > 0, JSON.stringify(h.errors));
    assert.ok($('Status').textContent.includes('كوكبة القمر'));
    const firstDate = $('Date').textContent;
    $('Next').fire('click');
    assert.notEqual($('Date').textContent, firstDate);
    h.buttons[1].fire('click');
    assert.ok(h.drawing.length > 0);
    if (!mode.gpu) {
      const lastMoon = h.drawing.filter(item => item[0] === 'fillText' && item[1] === 'القمر').at(-1);
      assert.ok(Math.hypot(lastMoon[2] - 180, lastMoon[3] + 16 - 160) > 60, 'Moon orbit must not collapse into the Earth');
    }
    $('Scale').checked = true; $('Scale').fire('change');
    h.buttons[0].fire('click');
    $('Month').value = '2028-02'; $('Month').fire('change');
    assert.equal(+$('Day').max, 29);
    $('Day').value = 12; $('Day').fire('input');
    assert.ok($('DayValue').textContent.includes('١٢'));
    $('Play').fire('click');
    assert.equal($('Play')['aria-pressed'], 'true');
    h.timers.pop()(1000);
    assert.ok($('DayValue').textContent.includes('١٣'));
    assert.equal(h.errors.filter(error => !error.includes('Simulated WebGL unavailable')).length, 0, JSON.stringify(h.errors));
  });
}
