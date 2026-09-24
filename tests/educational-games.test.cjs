const fs=require('node:fs'),vm=require('node:vm'),test=require('node:test'),assert=require('node:assert/strict');

const source=fs.readFileSync('dist/educational-games.js','utf8');
const context={};
vm.runInNewContext(source,context);
const math=context.EducationalGamesMath;

test('educational games page, route and offline assets are wired',()=>{
  const html=fs.readFileSync('dist/index.html','utf8'),app=fs.readFileSync('dist/app.js','utf8'),navigation=fs.readFileSync('dist/navigation-state.js','utf8'),sw=fs.readFileSync('dist/sw.js','utf8');
  assert.match(html,/id="games"/);
  assert.match(html,/data-route="games"/);
  assert.match(html,/educational-games\.css/);
  assert.match(html,/educational-games\.js/);
  assert.match(app,/games: \['تعلم الفلك بالحركة','الألعاب التعليمية'\]/);
  assert.match(app,/EducationalGames\?\.activate/);
  assert.match(navigation,/['"]games['"]/);
  assert.match(sw,/educational-games\.js/);
  assert.match(sw,/educational-games\.css/);
});

test('season tilt challenges reward the intended astronomical states',()=>{
  assert.ok(math.evaluate(23.4,172,'north-summer').score>=85);
  assert.ok(math.evaluate(23.4,355,'north-winter').score>=85);
  assert.ok(math.evaluate(23.4,80,'equinox').score>=85);
  assert.ok(math.evaluate(.4,172,'no-seasons').score>=85);
  assert.ok(math.evaluate(40,172,'strong-seasons').score>=85);
  assert.ok(math.evaluate(0,172,'north-summer').score<70);
  assert.ok(math.evaluate(23.4,172,'north-winter').score<70);
});

test('daylight responds to axial tilt in opposite hemispheres',()=>{
  const summer=math.evaluate(23.4,172,'north-summer');
  const winter=math.evaluate(23.4,355,'north-winter');
  assert.ok(summer.declination>18);
  assert.ok(winter.declination<-18);
  assert.ok(summer.northDaylight>summer.southDaylight);
  assert.ok(winter.northDaylight<winter.southDaylight);
});
