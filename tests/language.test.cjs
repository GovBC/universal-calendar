const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const arabic = /[\u0621-\u063a\u0641-\u064a\u066e-\u066f\u0671-\u06d3\u06fa-\u06ff]/;

class TextNode {
  constructor(value) {
    this.nodeType = 3;
    this.nodeValue = value;
    this.parentNode = null;
  }
}

class Element {
  constructor(tagName = 'DIV', id = '') {
    this.nodeType = 1;
    this.tagName = tagName;
    this.id = id;
    this.childNodes = [];
    this.dataset = {};
    this.attributes = new Map();
    this.active = false;
    this.classes = new Set(tagName === 'SECTION' ? ['page'] : []);
    this.classList = {
      contains: name => name === 'active' ? this.active : this.classes.has(name),
      remove() {},
      toggle() {}
    };
  }
  append(node) { node.parentNode = this; this.childNodes.push(node); return node; }
  contains(node) { return node === this || this.childNodes.some(child => child === node || (child.contains && child.contains(node))); }
  getAttribute(name) { return this.attributes.get(name) || null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  querySelectorAll() { return []; }
  addEventListener() {}
}

class HTMLInputElement extends Element {
  constructor() {
    super('INPUT');
    this.type = 'text';
    this.value = '';
  }
}

const body = new Element('BODY', 'body');
const today = new Element('SECTION', 'today');
today.active = true;
const todayText = today.append(new TextNode('السماء الآن'));
const calendar = new Element('SECTION', 'calendar');
const calendarText = calendar.append(new TextNode('محول التقويمات'));
const prayer = new Element('SECTION', 'prayer');
const prayerText = prayer.append(new TextNode('الصلاة والتحقق البصري'));
body.append(today);
body.append(calendar);
body.append(prayer);

const elements = new Map([['today', today], ['calendar', calendar], ['prayer', prayer]]);
const documentElement = {lang: 'ar', dir: 'rtl'};
const document = {
  body,
  documentElement,
  title: '',
  querySelector() { return null; },
  querySelectorAll() { return []; },
  getElementById(id) { return elements.get(id) || null; }
};

const observers = [];
class MutationObserver {
  constructor(callback) { this.callback = callback; observers.push(this); }
  observe() {}
}
const context = {
  console,
  document,
  Element,
  HTMLInputElement,
  Node: {ELEMENT_NODE: 1, TEXT_NODE: 3},
  MutationObserver,
  localStorage: {
    getItem(key) { return key === 'calendar.language' ? 'ml' : null; },
    setItem() {}
  },
  location: {reload() {}}
};
context.window = context;
context.globalThis = context;
vm.createContext(context);
for (const file of ['today-localization.js', 'english-localization.js', 'language.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'dist', file), 'utf8'), context, {filename: file});
}

const translate = context.CalendarLanguage.translate;

function makeLanguageContext(language) {
  const testBody = new Element('BODY', 'body');
  const testToday = new Element('SECTION', 'today');
  testToday.active = true;
  const testTodayText = testToday.append(new TextNode('السماء الآن'));
  const testCalendar = new Element('SECTION', 'calendar');
  const testCalendarText = testCalendar.append(new TextNode('محول التقويمات'));
  const testPrayer = new Element('SECTION', 'prayer');
  const testPrayerText = testPrayer.append(new TextNode('الصلاة والتحقق البصري'));
  testBody.append(testToday);
  testBody.append(testCalendar);
  testBody.append(testPrayer);

  const testElements = new Map([['today', testToday], ['calendar', testCalendar], ['prayer', testPrayer]]);
  const testDocumentElement = {lang: 'ar', dir: 'rtl'};
  const testDocument = {
    body: testBody,
    documentElement: testDocumentElement,
    title: '',
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById(id) { return testElements.get(id) || null; }
  };

  const testContext = {
    console,
    document: testDocument,
    Element,
    HTMLInputElement,
    Node: {ELEMENT_NODE: 1, TEXT_NODE: 3},
    MutationObserver,
    localStorage: {
      getItem(key) { return key === 'calendar.language' ? language : null; },
      setItem() {}
    },
    location: {reload() {}}
  };
  testContext.window = testContext;
  testContext.globalThis = testContext;
  vm.createContext(testContext);
  for (const file of ['today-localization.js', 'english-localization.js', 'language.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'dist', file), 'utf8'), testContext, {filename: file});
  }
  return {
    context: testContext,
    documentElement: testDocumentElement,
    today: testToday,
    todayText: testTodayText,
    calendar: testCalendar,
    calendarText: testCalendarText,
    prayer: testPrayer,
    prayerText: testPrayerText
  };
}

test('catalog exposes semantic strings for the Today and Calendar pages', () => {
  const {ar, ml} = context.TodayLocalization.messages;
  const {en} = context.EnglishLocalization.messages;
  const keys = Object.keys(ml);
  assert.ok(keys.length >= 250, `expected at least 250 localized strings, found ${keys.length}`);
  assert.deepEqual(keys.sort(), Object.keys(ar).sort());
  assert.ok(keys.some(key => key.startsWith('calendar.')));
  assert.ok(keys.every(key => /^(today|calendar)\./.test(key)));
  assert.ok(Object.keys(en).length >= 250, `expected at least 250 English strings, found ${Object.keys(en).length}`);
  assert.ok(Object.values(ml).every(value => !arabic.test(value)));
  assert.ok(Object.values(en).every(value => !arabic.test(value)));
  assert.equal(context.CalendarLanguage.scope, 'today,calendar');
});

test('Malayalam is applied to Today and Calendar while another page stays Arabic', () => {
  assert.equal(todayText.nodeValue, 'ഇപ്പോഴത്തെ ആകാശം');
  assert.equal(calendarText.nodeValue, 'محول التقويمات');
  assert.equal(today.getAttribute('lang'), 'ml');
  assert.equal(today.getAttribute('dir'), 'ltr');
  assert.equal(documentElement.lang, 'ml');
  assert.equal(documentElement.dir, 'rtl');
  assert.equal(document.title, 'സമഗ്ര ആഗോള കലണ്ടർ');

  today.active = false;
  calendar.active = true;
  context.CalendarLanguage.apply();
  assert.equal(documentElement.lang, 'ml');
  assert.equal(document.title, 'കലണ്ടർ പരിവർത്തകൻ — സമഗ്ര ആഗോള കലണ്ടർ');
  assert.equal(calendarText.nodeValue, 'കലണ്ടർ പരിവർത്തകൻ');

  calendar.active = false;
  prayer.active = true;
  context.CalendarLanguage.apply();
  assert.equal(documentElement.lang, 'ar');
  assert.equal(document.title, 'التقويم العالمي الشامل');
  assert.equal(calendarText.nodeValue, 'محول التقويمات');
  assert.equal(prayerText.nodeValue, 'الصلاة والتحقق البصري');
  prayer.active = false;
  today.active = true;
  context.CalendarLanguage.apply();
});

test('static and live Today values have Malayalam translations', () => {
  const fixtures = new Map([
    ['الصلاة التالية', 'അടുത്ത നമസ്കാരം'],
    ['أين يظهر القمر؟', 'ചന്ദ്രൻ എവിടെ കാണപ്പെടും?'],
    ['أفق حي محسوب من الموقع والوقت الحاليين؛ الشمس ١٢٫٥ درجة، والقمر -٣٫٢ درجة.', 'നിലവിലെ സ്ഥലവും സമയവും ഉപയോഗിച്ച് കണക്കാക്കിയ തത്സമയ ക്ഷിതിജം; സൂര്യന്റെ ഉയരം 12.5 ഡിഗ്രിയും ചന്ദ്രന്റെ ഉയരം -3.2 ഡിഗ്രിയുമാണ്.'],
    ['فجر ١٨٫٥° • عصر ١× • عشاء ٩٠ دقيقة', 'ഫജർ 18.5° • അസർ 1× • ഇശാ 90 മിനിറ്റ്'],
    ['٤٧ دقيقة', '47 മിനിറ്റ്'],
    ['٢١ ساعة', '21 മണിക്കൂർ'],
    ['١٤٤٨ هـ', '1448 ഹി.'],
    ['⌖ مكة المكرمة ⌄', '⌖ മക്ക ⌄'],
    ['القمر تحت الأفق عند غروب الشمس', 'സൂര്യാസ്തമയ സമയത്ത് ചന്ദ്രൻ ക്ഷിതിജത്തിന് താഴെയാണ്'],
    ['متوقّع بأداة بصرية فقط وفق المعيار', 'മാനദണ്ഡപ്രകാരം ദൃശ്യോപകരണത്തിലൂടെ മാത്രം കാണുമെന്ന് പ്രതീക്ഷിക്കുന്നു']
  ]);
  fixtures.forEach((expected, source) => assert.equal(translate(source), expected, source));
});

test('static and live Calendar values have Malayalam translations', () => {
  const fixtures = new Map([
    ['محول التقويمات', 'കലണ്ടർ പരിവർത്തകൻ'],
    ['التقويم السمكي', 'മത്സ്യബന്ധന കലണ്ടർ'],
    ['التقويم الزراعي', 'കൃഷി കലണ്ടർ'],
    ['الهجري القمري — أم القرى', 'ചന്ദ്ര ഹിജ്റി — ഉമ്മുൽ ഖുറാ'],
    ['١٤ تقويمًا', '14 കലണ്ടറുകൾ'],
    ['الموافق ٤ سبتمبر ٢٠٢٦؛ تتغير جميع البطاقات مع التاريخ المختار.', 'തുല്യം 2026 സെപ്റ്റംബർ 4; തിരഞ്ഞെടുത്ത തീയതിയോടൊപ്പം എല്ലാ കാർഡുകളും മാറും.'],
    ['سبتمبر: ذروة، ٧٠ من ١٠٠', 'സെപ്റ്റംബർ: ഉച്ചസ്ഥിതി, 70 / 100'],
    ['٣ أنواع إرشادية', '3 മാർഗ്ഗനിർദ്ദേശ ജാതികൾ'],
    ['٣ محاصيل في نافذتها', '3 വിളകൾ ജാലകത്തിലാണ്'],
    ['تفاصيل الطماطم', 'തക്കാളി വിശദാംശങ്ങൾ'],
    ['الزراعة: سبتمبر–نوفمبر، يناير–فبراير', 'നടൽ: സെപ്റ്റംബർ–നവംബർ, ജനുവരി–ഫെബ്രുവരി']
  ]);
  fixtures.forEach((expected, source) => assert.equal(translate(source), expected, source));

  [
    'أفضل الفرص الإرشادية هذا الشهر: الربيان الساحلي، الكنعد والأسماك السطحية. راقب الطقس والمد والجزر وتعليمات الصيد المحلية.',
    'مناسب لسواحل المنطقة الشرقية ودول الخليج، حيث تتغير الفرص مع حرارة المياه والرياح الشمالية ومواسم الربيان. الموقع الحالي: مكة المكرمة.',
    'الطماطم: الزراعة سبتمبر–نوفمبر، يناير–فبراير • الحصاد نوفمبر–أبريل',
    '٤ من الشهر ٧ • سنة الحصان، عنصر النار'
  ].forEach(source => assert.ok(!arabic.test(translate(source)), source));
});

test('English is applied to Today and Calendar while another page stays Arabic', () => {
  const english = makeLanguageContext('en');
  assert.equal(english.todayText.nodeValue, 'Sky now');
  assert.equal(english.today.getAttribute('lang'), 'en');
  assert.equal(english.today.getAttribute('dir'), 'ltr');
  assert.equal(english.documentElement.lang, 'en');
  assert.equal(english.context.document.title, 'Universal Comprehensive Calendar');

  english.today.active = false;
  english.calendar.active = true;
  english.context.CalendarLanguage.apply();
  assert.equal(english.documentElement.lang, 'en');
  assert.equal(english.context.document.title, 'Calendar Converter — Universal Comprehensive Calendar');
  assert.equal(english.calendarText.nodeValue, 'Calendar Converter');

  english.calendar.active = false;
  english.prayer.active = true;
  english.context.CalendarLanguage.apply();
  assert.equal(english.documentElement.lang, 'ar');
  assert.equal(english.calendarText.nodeValue, 'محول التقويمات');
  assert.equal(english.prayerText.nodeValue, 'الصلاة والتحقق البصري');
});

test('static and live values have English translations', () => {
  const english = makeLanguageContext('en').context.CalendarLanguage.translate;
  const fixtures = new Map([
    ['الصلاة التالية', 'Next prayer'],
    ['أين يظهر القمر؟', 'Where does the Moon appear?'],
    ['أفق حي محسوب من الموقع والوقت الحاليين؛ الشمس ١٢٫٥ درجة، والقمر -٣٫٢ درجة.', 'Live horizon calculated from current location and time; Sun altitude 12.5 degrees and Moon altitude -3.2 degrees.'],
    ['فجر ١٨٫٥° • عصر ١× • عشاء ٩٠ دقيقة', 'Fajr 18.5° • Asr 1× • Isha 90 minutes'],
    ['٤٧ دقيقة', '47 minutes'],
    ['٢١ ساعة', '21 hours'],
    ['١٤٤٨ هـ', '1448 AH'],
    ['⌖ مكة المكرمة ⌄', '⌖ Makkah ⌄'],
    ['محول التقويمات', 'Calendar Converter'],
    ['التقويم السمكي', 'Fishing calendar'],
    ['التقويم الزراعي', 'Agriculture calendar'],
    ['الهجري القمري — أم القرى', 'Lunar Hijri — Umm al-Qura'],
    ['١٤ تقويمًا', '14 calendars'],
    ['الموافق ٤ سبتمبر ٢٠٢٦؛ تتغير جميع البطاقات مع التاريخ المختار.', 'Corresponding to September 4, 2026; all cards change with the selected date.'],
    ['سبتمبر: ذروة، ٧٠ من ١٠٠', 'September: Peak, 70 out of 100'],
    ['٣ أنواع إرشادية', '3 indicative species'],
    ['٣ محاصيل في نافذتها', '3 crops in their window'],
    ['تفاصيل الطماطم', 'tomato details'],
    ['الزراعة: سبتمبر–نوفمبر، يناير–فبراير', 'Planting: September–November, January–February']
  ]);
  fixtures.forEach((expected, source) => assert.equal(english(source), expected, source));

  [
    'أفضل الفرص الإرشادية هذا الشهر: الربيان الساحلي، الكنعد والأسماك السطحية. راقب الطقس والمد والجزر وتعليمات الصيد المحلية.',
    'مناسب لسواحل المنطقة الشرقية ودول الخليج، حيث تتغير الفرص مع حرارة المياه والرياح الشمالية ومواسم الربيان. الموقع الحالي: مكة المكرمة.',
    'الطماطم: الزراعة سبتمبر–نوفمبر، يناير–فبراير • الحصاد نوفمبر–أبريل',
    '٤ من الشهر ٧ • سنة الحصان، عنصر النار'
  ].forEach(source => assert.ok(!arabic.test(english(source)), source));
});

test('all Arabic strings visible in the Today and Calendar shells can leave Arabic script', () => {
  const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
  const todayShell = html.slice(html.indexOf('<header class="topbar">'), html.indexOf('<section class="page" id="calendar"'));
  const calendarShell = html.slice(html.indexOf('<section class="page" id="calendar"'), html.indexOf('<section class="page" id="prayer"'));
  const dialogStart = html.indexOf('<dialog id="languageDialog"');
  const languageDialog = html.slice(dialogStart, html.indexOf('</dialog>', dialogStart) + 9);
  const source = todayShell + calendarShell + languageDialog;
  const fragments = [
    ...[...source.matchAll(/>([^<>]+)</g)].map(match => match[1].trim()),
    ...[...source.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/g)].map(match => match[1].trim())
  ].filter(value => value && arabic.test(value));
  assert.ok(fragments.length >= 140);
  for (const fragment of fragments) {
    assert.ok(!arabic.test(translate(fragment)), `Arabic remained after translating: ${fragment}`);
  }
});

test('the Today catalog loads before its scoped controller', () => {
  const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
  const serviceWorker = fs.readFileSync(path.join(root, 'dist', 'sw.js'), 'utf8');
  const catalogIndex = html.indexOf('./today-localization.js');
  const englishIndex = html.indexOf('./english-localization.js');
  const controllerIndex = html.indexOf('./language.js');
  assert.ok(catalogIndex > 0);
  assert.ok(englishIndex > catalogIndex);
  assert.ok(controllerIndex > englishIndex);
  assert.ok(!html.includes('./malayalam-content.js'));
  assert.ok(html.includes("selectedLanguage === 'en' ? 'en-US' : 'ar-SA'"));
  assert.ok(serviceWorker.includes('"./today-localization.js"'));
  assert.ok(serviceWorker.includes('"./english-localization.js"'));
});
