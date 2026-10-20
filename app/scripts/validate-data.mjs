import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
const json=p=>JSON.parse(readFileSync(new URL('../lib/'+p,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const index=json('quran-index.json').data.surahs.references;
assert.equal(index.length,114);assert.equal(index.reduce((n,s)=>n+s.numberOfAyahs,0),6236);
assert.deepEqual(index.map(s=>s.number),Array.from({length:114},(_,i)=>i+1));
const core=json('core.json'),notes=json('enrichment.json'),words=json('words.json');let count=0;
for(const s of core.surahs){for(const v of s.verses){assert(v.arabic&&v.translation&&v.audio?.startsWith('https://'));assert(words[s.id][v.number]?.length>0);count++;}const note=notes[s.id];assert.equal(note.keyWords.length,3);for(const k of note.keyWords){const v=s.verses.find(v=>v.number===k.verse);assert(v?.arabic.includes(k.arabic));assert(v.translation.includes(k.match));assert(!k.transliteration.startsWith('anahtar'));}}
assert.equal(count,156);assert.equal(notes['2-285'].keyWords.length,3);
const modules={};function load(name){if(modules[name])return modules[name];const exports={};const code=ts.transpileModule(readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;vm.runInNewContext(code,{exports,require:p=>load(p.replace('./',''))});return modules[name]=exports;}
const {prayers}=load('prayers');assert.equal(prayers.length,8);
for(const p of prayers){assert.equal(p.keyWords.length,3);const v=p.verses[0];assert.equal(v.words.length,v.arabic.split(/\s+/).length,`Missing word in ${p.name}`);for(const k of p.keyWords){assert(v.arabic.includes(k.arabic));assert(v.translation.includes(k.match));}}
console.log('fixture-tested: 114 surahs / 6236 metadata ayahs; 156 offline ayahs with word data; 26 curated readings; 8 complete prayers and keyword matches.');
