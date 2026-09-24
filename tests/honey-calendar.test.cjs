const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const path = require('node:path');

const root = path.join(__dirname, '..', 'dist');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('honey calendar is wired into tabs, navigation panes, offline cache, and localization', () => {
  const html = read('index.html');
  const live = read('live-app.js');
  const fishing = read('fishing.js');
  const worker = read('sw.js');
  const malayalam = read('today-localization.js');
  const english = read('english-localization.js');

  assert.match(html, /data-calendar-tab="honey"/);
  assert.match(html, /id="calendar-honey-pane"/);
  assert.match(html, /id="honeyMonthGrid"/);
  assert.match(html, /src="\.\/honey-calendar\.js"/);
  assert.match(live, /honey:'calendar-honey-pane'/);
  assert.match(live, /HoneyCalendar\?\.render\(selected\)/);
  assert.match(fishing, /if\(!\['dates','fishing'\]\.includes\(tab\)\)return/);
  assert.match(worker, /"\.\/honey-calendar\.js"/);
  assert.match(malayalam, /calendar\.tabs\.honey\\tتقويم العسل\\t/);
  assert.match(english, /calendar\.tabs\.honey\\tتقويم العسل\\tHoney calendar/);
});

test('honey calendar separates blossom and honeydew and includes Saudi forage trees', () => {
  const source = read('honey-calendar.js');
  for (const value of ['category:\'flower\'', 'category:\'tree\'', 'category:\'honeydew\'', 'السدر', 'السَّمُر والسَّلَم', 'الطلح والسيال']) {
    assert.ok(source.includes(value), `missing ${value}`);
  }
  assert.match(source, /إفرازات حشرات ماصّة للعصارة/);
});
