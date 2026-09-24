const fs=require('node:fs');
const vm=require('node:vm');
const test=require('node:test');
const assert=require('node:assert/strict');
const Astronomy=require('../dist/vendor/astronomy.browser.min.js');
const lunarSource=fs.readFileSync('dist/mooncalc.js','utf8');
const gameSource=fs.readFileSync('dist/crescent-hunter.js','utf8');
const context={Astronomy,Date};
vm.runInNewContext(lunarSource,context);
vm.runInNewContext(gameSource,context);
const game=context.CrescentHunterModel;
const bestMinute=round=>Math.round((round.evening.best-round.evening.sunset)/60000);
const settings=(round,overrides={})=>({minute:bestMinute(round),horizon:0,equipment:'eye',...overrides});

test('training evenings use the existing engine and retain their intended classifications',()=>{
  assert.equal(game.createRound('first').evening.zone,'A');
  assert.equal(game.createRound('optics').evening.zone,'C');
  assert.equal(game.createRound('patience').evening.zone,'D');
  for(const mission of game.missions){
    const round=game.createRound(mission.id);
    const state=game.reading(round,mission.minute);
    assert.ok(Number.isFinite(state.moon.altitude));
    assert.ok(Number.isFinite(state.elongation));
    const result=game.evaluate(round,settings(round,{equipment:mission.id==='optics'?'optical':'eye'}),mission.id==='patience'?'wait':'observe');
    assert.ok(result.solved,mission.id+': '+result.message);
  }
});

test('time, obstructions, equipment and deferral affect the result independently',()=>{
  const first=game.createRound('first');
  assert.equal(game.evaluate(first,settings(first,{minute:0}),'observe').code,'time');
  assert.equal(game.evaluate(first,settings(first,{minute:95}),'observe').code,'set');
  assert.equal(game.evaluate(first,settings(first,{horizon:8}),'observe').code,'blocked');
  assert.equal(game.evaluate(first,settings(first),'wait').solved,false);
  const optics=game.createRound('optics');
  assert.equal(game.evaluate(optics,settings(optics),'observe').code,'equipment');
  assert.equal(game.evaluate(optics,settings(optics,{equipment:'optical'}),'observe').solved,true);
  const patience=game.createRound('patience');
  assert.equal(game.evaluate(patience,settings(patience,{equipment:'optical'}),'observe').solved,false);
  assert.equal(game.evaluate(patience,settings(patience),'wait').solved,true);
});

test('every mission starts unsolved and duplicate wins cannot inflate the score',()=>{
  const session=game.createSession();
  for(const mission of game.missions){
    const round=game.createRound(mission.id);
    assert.equal(game.evaluate(round,{minute:mission.minute,horizon:mission.horizon,equipment:'eye'},'observe').solved,false);
    session.complete(mission.id);session.complete(mission.id);
  }
  session.complete('unknown');
  assert.equal(session.count,5);assert.equal(session.score,500);
  session.reset();assert.equal(session.score,0);assert.equal(session.has('first'),false);
});

test('new and existing games remain selectable and required scripts are offline assets',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  const sw=fs.readFileSync('dist/sw.js','utf8');
  const gamesSource=fs.readFileSync('dist/educational-games.js','utf8');
  assert.match(html,/data-educational-game="crescent"[^>]*aria-pressed="true"/);
  assert.match(html,/id="seasonGamePane"[^>]*hidden/);
  assert.match(gamesSource,/global\.CrescentHunter\?\.activate/);
  assert.ok(html.indexOf('./mooncalc.js')<html.indexOf('./crescent-hunter.js'));
  assert.ok(html.indexOf('./crescent-hunter.js')<html.indexOf('./educational-games.js'));
  for(const asset of ['crescent-hunter.js','crescent-hunter.css']){
    assert.ok(fs.existsSync('dist/'+asset));assert.ok(sw.includes('./'+asset));assert.ok(html.includes('./'+asset));
  }
});

test('UI supports hints, retry after a bad answer, all five wins and a fresh round',()=>{
  const ids=['Canvas','Progress','Score','ProgressBar','Next','Restart','Mission','Feedback','Loading','Content','Error','Brief','Place','Minute','Horizon','Equipment','MinuteValue','Clock','Altitude','Elongation','Illumination','Lag','Observe','Wait','Hint','Retry','GamePane'];
  const elements={};
  const drawing=new Proxy({},{get(target,key){return target[key]||(()=>{})},set(target,key,value){target[key]=value;return true}});
  for(const id of ids)elements['crescent'+id]={hidden:false,value:'',dataset:{},events:{},options:[],setAttribute(){},focus(){},addEventListener(event,fn){this.events[event]=fn}};
  elements.crescentCanvas.getContext=()=>drawing;
  elements.crescentCanvas.getBoundingClientRect=()=>({width:360,height:360});
  elements.crescentMission.options=game.missions.map(m=>({value:m.id}));
  const ui={Astronomy,Date,document:{getElementById:id=>elements[id]},setTimeout:fn=>fn(),addEventListener(){}};
  vm.runInNewContext(lunarSource,ui);
  vm.runInNewContext(gameSource,ui);
  ui.CrescentHunter.activate();
  const click=id=>elements['crescent'+id].events.click();
  click('Hint');assert.match(elements.crescentFeedback.textContent,/وقت التقييم/);
  click('Observe');assert.equal(elements.crescentFeedback.dataset.kind,'retry');
  for(const mission of game.missions){
    const round=game.createRound(mission.id);
    elements.crescentMinute.value=bestMinute(round);
    elements.crescentHorizon.value='0';
    elements.crescentEquipment.value=mission.id==='optics'?'optical':'eye';
    elements.crescentMinute.events.input();
    click(mission.id==='patience'?'Wait':'Observe');
    assert.equal(elements.crescentFeedback.dataset.kind,'success',mission.id);
    if(mission.id!=='patience')click('Next');
  }
  assert.equal(elements.crescentProgressBar.value,5);
  assert.equal(elements.crescentNext.hidden,true);
  assert.equal(elements.crescentRestart.hidden,false);
  click('Restart');
  assert.equal(elements.crescentProgressBar.value,0);
  assert.equal(elements.crescentMission.value,'first');
  assert.equal(elements.crescentNext.disabled,true);

  const seasonIds=['games','eclipseBuilderPane','prayerTimeGamePane','seasonGamePane','seasonGameCanvas','seasonTilt','seasonDay','seasonTiltValue','seasonDayValue','seasonGameScore','seasonChallengeTitle','seasonChallengeHint','seasonGameStatus','seasonDeclination','seasonNorthLabel','seasonNorthDaylight','seasonSouthDaylight','seasonCheck','seasonReset'];
  for(const id of seasonIds)elements[id]={value:0,hidden:false,classList:{toggle(){}},addEventListener(){}};
  elements.seasonGamePane.hidden=true;
  elements.seasonGameCanvas.getContext=()=>drawing;
  elements.seasonGameCanvas.getBoundingClientRect=()=>({width:360,height:350});
  drawing.createRadialGradient=drawing.createLinearGradient=()=>({addColorStop(){}});
  ui.document.querySelectorAll=()=>[];
  ui.window=ui;
  let eclipseActivated=0;
  ui.EclipseBuilder={activate(){eclipseActivated++}};
  let prayerActivated=0;
  ui.PrayerTimeGame={activate(){prayerActivated++}};
  vm.runInNewContext(fs.readFileSync('dist/educational-games.js','utf8'),ui);
  ui.EducationalGames.selectGame('prayer');
  assert.equal(elements.prayerTimeGamePane.hidden,false);
  assert.equal(elements.crescentGamePane.hidden,true);
  assert.equal(elements.eclipseBuilderPane.hidden,true);
  assert.equal(elements.seasonGamePane.hidden,true);
  assert.equal(prayerActivated,1);
  ui.EducationalGames.selectGame('eclipse');
  assert.equal(elements.eclipseBuilderPane.hidden,false);
  assert.equal(elements.crescentGamePane.hidden,true);
  assert.equal(elements.seasonGamePane.hidden,true);
  assert.equal(eclipseActivated,1);
  ui.EducationalGames.selectGame('season');
  ui.EducationalGames.setChallenge('north-summer');
  assert.equal(elements.crescentGamePane.hidden,true);
  assert.equal(elements.eclipseBuilderPane.hidden,true);
  assert.equal(elements.prayerTimeGamePane.hidden,true);
  assert.equal(elements.seasonGamePane.hidden,false);
  assert.match(elements.seasonChallengeTitle.textContent,/صيف/);
  ui.EducationalGames.selectGame('crescent');
  assert.equal(elements.crescentGamePane.hidden,false);
  assert.equal(elements.seasonGamePane.hidden,true);
  assert.equal(elements.crescentMission.value,'first');
});

test('missing calculations show a recoverable error',()=>{
  const elements={};
  const ui={Date,document:{getElementById(id){return elements[id]||(elements[id]={hidden:false,addEventListener(){},getContext(){return null}})}},setTimeout:fn=>fn(),addEventListener(){}};
  vm.runInNewContext(gameSource,ui);
  ui.CrescentHunter.activate();
  assert.equal(elements.crescentError.hidden,false);
  assert.equal(elements.crescentLoading.hidden,true);
  assert.equal(elements.crescentContent.hidden,true);
  ui.Astronomy=Astronomy;vm.runInNewContext(lunarSource,ui);
  assert.equal(ui.CrescentHunterModel.createRound('first').evening.zone,'A');
});
