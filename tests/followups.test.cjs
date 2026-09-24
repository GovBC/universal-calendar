const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const elements=new Map();
function element(key){
  if(!elements.has(key))elements.set(key,{value:'',hidden:false,innerHTML:'',textContent:'',dataset:{},style:{},classList:{toggle(){}},setAttribute(){},addEventListener(){},querySelector(selector){return element(key+' '+selector)}});
  return elements.get(key);
}
const document={getElementById:element,querySelector:element,querySelectorAll(selector){return selector.includes(',')?selector.split(',').map(element):[]}};
element('followupsYear').value='all';element('followupsCategory').value='all';element('deathCountry').value='السعودية';element('wealthSort').value='rank';
const source=fs.readFileSync('dist/app.js','utf8');
assert(!source.includes('<<<<<<<'));
const slice=source.slice(source.indexOf('const followupRecords='),source.indexOf('function initialNavigation()'));
const context=vm.createContext({document,arDigits:v=>String(v),encodeURIComponent});
vm.runInContext(slice,context);
function tab(value){vm.runInContext(`followupTab='${value}';refreshFollowupCategories();renderFollowups()`,context)}
function count(){return Number(element('followupsCount').textContent)}
tab('wealth');assert.equal(count(),10);assert.equal(element('deathScope').hidden,true);
assert(element('followupsGrid').innerHTML.indexOf('إيلون ماسك')<element('followupsGrid').innerHTML.indexOf('لاري بايج'));
element('wealthSort').value='reverse';vm.runInContext('renderFollowups()',context);
assert(element('followupsGrid').innerHTML.indexOf('أمانسيو أورتيغا')<element('followupsGrid').innerHTML.indexOf('إيلون ماسك'));
element('followupsSearch').value='ايلون';vm.runInContext('renderFollowups()',context);assert.equal(count(),1);
element('followupsSearch').value='';element('followupsYear').value='2024';vm.runInContext('renderFollowups()',context);assert.equal(count(),0);assert.equal(element('followupsFeature').hidden,true);
element('followupsYear').value='all';tab('deaths');assert.equal(count(),1);assert.equal(element('deathScope').hidden,false);
element('deathCity').value='جدة';vm.runInContext('renderFollowups()',context);assert.equal(count(),0);assert.equal(element('followupsFeature').hidden,true);
vm.runInContext("deathScope='global';renderFollowups()",context);assert.equal(count(),2);assert.equal(element('deathCityWrap').hidden,true);
assert(!decodeURIComponent(element('deathMore').href).includes('جدة'));
tab('sports');assert.equal(count(),8);assert.equal(element('deathScope').hidden,true);
tab('news');assert.equal(element('followupsNews').hidden,false);assert.equal(element('followupsEmpty').hidden,true);
const html=fs.readFileSync('dist/index.html','utf8');assert(!html.includes('<<<<<<<'));
for(const id of ['deaths','wealth','news'])assert(html.includes(`data-followups-tab="${id}"`));
for(const match of html.matchAll(/(?:src|href)="\.\/([^"?#]+)(?:[?#][^"]*)?"/g))assert(fs.existsSync('dist/'+match[1]),'Missing asset: '+match[1]);
console.log('Followups: sorting, search, local/global filtering, empty states, news and assets passed.');
