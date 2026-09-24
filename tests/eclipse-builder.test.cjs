const fs=require('node:fs');
const vm=require('node:vm');
const test=require('node:test');
const assert=require('node:assert/strict');

const source=fs.readFileSync('dist/eclipse-builder.js','utf8');
const context={};
vm.runInNewContext(source,context);
const game=context.EclipseBuilderMath;

test('disc geometry distinguishes no, partial, total and annular solar eclipses',()=>{
  const none=game.analyze({eastWest:40,northSouth:0,moonDiameter:31.6});
  const partial=game.analyze({eastWest:15,northSouth:0,moonDiameter:31.6});
  const total=game.analyze({eastWest:0,northSouth:0,moonDiameter:33.5});
  const annular=game.analyze({eastWest:0,northSouth:0,moonDiameter:29.3});
  assert.equal(none.type,'none');assert.equal(none.obscuration,0);
  assert.equal(partial.type,'partial');assert.ok(partial.obscuration>.25&&partial.obscuration<.75);
  assert.equal(total.type,'total');assert.equal(total.obscuration,1);
  assert.equal(annular.type,'annular');
  assert.ok(Math.abs(annular.obscuration-(29.3/31.6)**2)<1e-12);
});

test('tangency has zero covered area and offsets combine as an angular distance',()=>{
  const radius=game.SUN_DIAMETER/2;
  assert.equal(game.overlapFraction(radius,radius,radius*2),0);
  assert.equal(game.overlapFraction(radius,radius,0),1);
  assert.equal(game.analyze({eastWest:3,northSouth:4,moonDiameter:31.6}).separation,5);
});

test('all five missions have an unsolved start and a scientifically consistent solution',()=>{
  const solutions={
    partial:{eastWest:15,northSouth:0,moonDiameter:31.6},
    total:{eastWest:0,northSouth:0,moonDiameter:33.5},
    annular:{eastWest:0,northSouth:0,moonDiameter:29.3},
    monthly:{eastWest:0,northSouth:40,moonDiameter:31.6},
    grazing:{eastWest:31,northSouth:0,moonDiameter:31.6}
  };
  for(const mission of game.missions){
    assert.equal(game.evaluate(mission.id,mission.start).solved,false,mission.id+' starts solved');
    assert.equal(game.evaluate(mission.id,solutions[mission.id]).solved,true,mission.id+' cannot be solved');
  }
  assert.equal(game.analyze(solutions.monthly).type,'none');
  assert.ok(Math.abs(solutions.monthly.eastWest)<=2);
});

test('one mission can only award points once and a new round clears progress',()=>{
  const session=game.createSession();
  session.complete('partial');session.complete('partial');session.complete('unknown');
  assert.equal(session.count,1);assert.equal(session.score,100);
  game.missions.forEach(mission=>session.complete(mission.id));
  assert.equal(session.count,5);assert.equal(session.score,500);
  session.reset();assert.equal(session.count,0);assert.equal(session.has('partial'),false);
});

test('eclipse builder is selectable, loaded in order and cached for offline use',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  const controller=fs.readFileSync('dist/educational-games.js','utf8');
  const sw=fs.readFileSync('dist/sw.js','utf8');
  assert.match(html,/data-educational-game="eclipse"[^>]*aria-controls="eclipseBuilderPane"/);
  assert.match(html,/id="eclipseBuilderPane"[^>]*hidden/);
  assert.match(controller,/global\.EclipseBuilder\?\.activate/);
  assert.ok(html.indexOf('./eclipse-builder.js')<html.indexOf('./educational-games.js'));
  for(const asset of ['eclipse-builder.js','eclipse-builder.css']){
    assert.ok(fs.existsSync('dist/'+asset));
    assert.ok(html.includes('./'+asset));
    assert.ok(sw.includes('./'+asset));
  }
});
