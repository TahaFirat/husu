import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
const json=name=>JSON.parse(readFileSync(new URL('../lib/'+name,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const core=json('core.json').surahs;
function module(name,dependencies={}){const exports={};const output=ts.transpileModule(readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;vm.runInNewContext(output,{exports,require:path=>{assert(path in dependencies,`Unexpected dependency ${path}`);return dependencies[path];}});return exports;}
const {defaultSelection,migrateFavorites,rememberSelection,sameSelection,uniqueSelections}=module('library');
assert.equal(JSON.stringify(defaultSelection),JSON.stringify({id:'1',start:1,end:7}));
const selections=[{id:'2',start:255,end:255},{id:'67',start:28,end:30}];
const migrated=JSON.parse(JSON.stringify(migrateFavorites([{name:'old',selections}, {name:'duplicate',selections:[selections[0]]}])));
assert.deepEqual(migrated,selections);
assert.equal(migrateFavorites([null,{},'invalid',{selections:[{id:'1',start:0,end:5}]}]).length,0);
assert.equal(uniqueSelections([...selections,selections[0]]).length,2);
const history=rememberSelection(Array.from({length:9},(_,i)=>({id:String(i+1),start:1,end:3})),selections[0]);
assert.equal(history.length,8);assert(sameSelection(history[0],selections[0]));
assert.equal(rememberSelection([selections[0]],selections[0]).length,1);
const {sourceKeywords}=module('reading-keywords');const words=json('words.json');
const verses=core.find(s=>s.id===103).verses.map(v=>({...v,words:words['103'][v.number]}));
const keys=sourceKeywords(verses);assert.equal(keys.length,3);assert.equal(new Set(keys.map(k=>k.arabic)).size,3);
for(const key of keys){const v=verses.find(v=>v.number===key.verse);assert(v.arabic.includes(key.arabic));assert(v.words.some(w=>w.arabic===key.arabic&&w.meaning===key.meaning));if(key.match)assert(v.translation.includes(key.match));}
assert.equal(sourceKeywords([{number:1,arabic:'النص',translation:'Metin'}]).length,0);
console.log('fixture-tested: legacy-favorite migration, duplicate removal, recent-reading limits and source-backed keyword fallback.');
