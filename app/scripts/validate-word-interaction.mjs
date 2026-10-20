import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
const modules={};function load(name){if(modules[name])return modules[name];if(name.endsWith('.json'))return JSON.parse(readFileSync(new URL('../lib/'+name,import.meta.url),'utf8').replace(/^\uFEFF/,''));const exports={};const code=ts.transpileModule(readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{exports,require:path=>load(path.replace('./',''))});return modules[name]=exports;}
const {prayers}=load('prayers'),{arabicTokens,meaningGroups}=load('word-interaction');
for(const prayer of prayers){const verse=prayer.verses[0],groups=meaningGroups(verse);assert(groups.length>0,prayer.id);let cursor=0;for(const group of groups){assert.equal(group.start,cursor);assert(group.end>group.start);assert(group.meaning&&group.transliteration);cursor=group.end;}assert.equal(cursor,verse.words.length,prayer.id);const tokens=arabicTokens(verse);assert.equal(tokens.map(t=>t.text).join(''),verse.arabic);assert.equal(tokens.filter(t=>t.wordIndex!==undefined).length,verse.words.length,prayer.id);for(const token of tokens){assert(groups.some(g=>token.wordIndex>=g.start&&token.wordIndex<g.end),`${prayer.id}: ungrouped word`);}}
const kunut=prayers.find(p=>p.id==='p-kunut1').verses[0];const negative=meaningGroups(kunut).find(g=>g.meaning==='Sana nankörlük etmeyiz.');assert(negative);assert.equal(kunut.words.slice(negative.start,negative.end).map(w=>w.arabic).join(' '),'وَلَا نَكْفُرُكَ');
const tahiyyat=prayers.find(p=>p.id==='p-tahiyyat').verses[0];const profession=meaningGroups(tahiyyat).find(g=>g.meaning.includes('Allah’tan başka ilah yoktur'));assert(profession);assert.equal(profession.end-profession.start,6);
const word=(arabic,meaning='fixture')=>({arabic,meaning,transliteration:'fixture'});
const prefixed={number:1,arabic:'بِسْمِ ٱللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ',translation:'',words:[word('قُلْ')]};
assert.equal(arabicTokens(prefixed).at(-1).wordIndex,0);
for(const verse of [
 {...prefixed,arabic:'بِسْمِ ٱللَّهِ ۝ قُلْ'},
 {...prefixed,number:2},
 {number:1,arabic:'قُلْ قُلْ هُوَ',translation:'',words:[word('قُلْ'),word('هُوَ')]},
 {number:1,arabic:'احد',translation:'',words:[word('أحد')]},
 {...prefixed,groups:[{start:1,end:2,meaning:'fixture',transliteration:''}]},
 {...prefixed,groups:[]}
])assert(arabicTokens(verse).every(t=>t.wordIndex===undefined),'unverified token sequence must disable all bindings');
const repeated=arabicTokens({number:1,arabic:'قُلْ قُلْ هُوَ',translation:'',words:[word('قُلْ'),word('قُلْ'),word('هُوَ')]});assert.deepEqual(Array.from(repeated,t=>t.wordIndex),[0,1,2]);
const invalid={number:1,arabic:'قُلْ',translation:'',words:[word('قُلْ')],groups:[{start:0,end:2,meaning:'fixture',transliteration:''}]};assert.equal(meaningGroups(invalid).length,0);
console.log('fixture-tested: all 8 prayers aligned/grouped; negation and shahadah intact; repeated tokens, exact basmala, consonant distinction, invalid bounds and missing groups guarded.');

const {offline}=load('data'),raw=load('words.json'),verified=new Set(load('verified-word-sources.json').references);
const audit=JSON.parse(readFileSync(new URL('../outputs/word-source-audit.json',import.meta.url),'utf8'));
assert.equal(verified.size,audit.references.filter(r=>r.status==='matched').length);
for(const record of audit.references)assert.equal(verified.has(record.key),record.status==='matched');
let checked=0,enabled=0;
for(const reading of offline)for(const verse of reading.verses){
 const sid=reading.id.split('-')[0],sourceWords=raw[sid][verse.number];
 const words=sid!=='1'&&verse.number===1?[...raw['1']['1'],...sourceWords]:sourceWords;
 const tokens=arabicTokens({...verse,words});assert.equal(tokens.map(t=>t.text).join(''),verse.arabic);assert.equal(tokens.filter(t=>t.wordIndex!==undefined).length,words.length,`${reading.id}:${verse.number}`);
 const allowed=verified.has(`${sid}:${verse.number}`),actual=arabicTokens(verse).filter(t=>t.wordIndex!==undefined).length;
 assert.equal(actual,allowed?words.length:0);if(allowed)enabled++;checked++;
}
assert.equal(checked,156);assert.equal(enabled,verified.size);
console.log(`fixture-tested: 156 embedded ayahs preserve Arabic and word order; ${enabled} verified Turkish word sets enabled; ${checked-enabled} incomplete sets disabled.`);
const {validReading,validWordRange}=load('source-validation');
const reading={id:'1',count:1,name:'fixture',source:'fixture',verses:[{number:1,arabic:'قُلْ',translation:'fixture'}]};
assert(validReading(reading,1,1));
for(const value of [null,{}, {...reading,id:'2'}, {...reading,verses:[null]}, {...reading,verses:[{...reading.verses[0],number:2}]}, {...reading,verses:[{...reading.verses[0],translation:''}]}, {...reading,verses:[{...reading.verses[0],words:[null]}]}])assert(!validReading(value,1,1));
assert(validWordRange({'2':[word('قُلْ')]},2,2));assert(validWordRange({'2':[]},2,2));
for(const value of [null,[],{}, {'1':[word('قُلْ')]},{'2':[null]},{'2':[word('قُلْ','')]},{'2':[word('قُلْ')],'3':[word('قُلْ')]}])assert(!validWordRange(value,2,2));
console.log('fixture-tested: wrong IDs/order, blank text, malformed cached words and mismatched word ranges rejected.');

const {displayArabic}=load('arabic-display');
const sourceWord='وَٱلزَّيْتُونِ';
assert.equal(displayArabic(sourceWord),'وَالزَّيْتُونِ');
assert.equal(sourceWord,'وَٱلزَّيْتُونِ');
for(const text of ['أَإِآء ؤ ئ','لَا إِلَٰهَ إِلَّا اللَّهُ','وَلَا نَكْفُرُكَ','ۖ ۚ ۗ ۛ','بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'])assert.equal(displayArabic(text),text);
for(const reading of offline)for(const verse of reading.verses){const displayed=displayArabic(verse.arabic);assert(!displayed.includes('ٱ'));assert.equal([...displayed].length,[...verse.arabic].length);assert.equal(displayed.replace(/ا/g,'ٱ'),verse.arabic.replace(/ا/g,'ٱ'));}
console.log('fixture-tested: reported At-Tin spelling simplified; hamza, shadda, vowels, negation and pause signs retained; source strings unchanged across 156 ayahs.');

const {turkishPronunciation}=load('reading-pronunciation');
const sample={number:1,arabic:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',translation:'fixture',transliteration:'bis’mi l-lahi l-rahmani l-rahimi'};
assert.equal(turkishPronunciation('1',sample),'Bismillâhirrahmânirrahîm');
assert.equal(turkishPronunciation('95',{...sample,transliteration:'wal-tini wal-zaytuni'}),null);
assert.equal(turkishPronunciation('67',{...sample,transliteration:'provider-latin'}),null);
const asr={...sample,arabic:'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَالْعَصْرِ'};
assert(turkishPronunciation('103',asr).startsWith('Bismillâhirrahmânirrahîm. '));
assert(!turkishPronunciation('103',{...asr,arabic:'وَالْعَصْرِ'}).startsWith('Bismillâh'));
for(const prayer of prayers)assert.equal(turkishPronunciation(prayer.id,prayer.verses[0]),prayer.verses[0].transliteration);
console.log('fixture-tested: provider transliterations never used as Turkish reading; Fatiha/Asr editorial readings and all 8 prayer readings preserved; basmala follows actual verse.');
