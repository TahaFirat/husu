import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
const core=JSON.parse(readFileSync(new URL('../lib/core.json',import.meta.url),'utf8'));
const sourceAudit=JSON.parse(readFileSync(new URL('../outputs/daily-source-audit.json',import.meta.url),'utf8'));
const sourceById=new Map(sourceAudit.records.map(record=>[record.id,record]));
const dailySource=JSON.parse(readFileSync(new URL('../lib/daily-verses.json',import.meta.url),'utf8'));
const exports={};const source=readFileSync(new URL('../lib/daily-verse.ts',import.meta.url),'utf8');vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,{exports,require:name=>{if(name==='./core.json')return core;if(name==='./daily-verses.json')return dailySource;throw new Error(`Unexpected dependency ${name}`);}});
const {dailyVerses,chooseDaily,localDay}=exports;
assert.equal(dailyVerses.length,7);assert.equal(new Set(dailyVerses.map(v=>v.id)).size,dailyVerses.length);
for(const v of dailyVerses){const original=core.surahs.find(s=>s.id===v.surah)?.verses.find(a=>a.number===v.verse);const source=sourceById.get(v.id);assert(source);if(original){assert.equal(v.arabic,original.arabic);assert.equal(v.translation,original.translation);}assert.equal(v.arabic,source.arabic);assert.equal(v.translation,source.translation);assert.equal(v.edition,'tr.diyanet');assert.match(v.sourceUrl,/\/editions\/quran-uthmani,tr\.diyanet$/);assert.equal(v.contextUrl,`https://quran.com/tr/${v.surah}/${v.verse}`);assert.equal(source.sourceUrl,v.sourceUrl);assert(v.translation.length<=200);assert(v.arabic.length<=200);const responses=source.completeResponses;assert.equal(responses.length,2);assert(responses.some(r=>r.edition.identifier==='quran-uthmani'&&r.edition.type==='quran'&&r.numberInSurah===v.verse&&r.text===v.arabic));assert(responses.some(r=>r.edition.identifier==='tr.diyanet'&&r.edition.type==='translation'&&r.numberInSurah===v.verse&&r.text===v.translation));}
assert.equal(sourceById.size,7);
const initial=chooseDaily('2026-10-20',null,0);assert.equal(chooseDaily('2026-10-20',initial,.99).id,initial.id);
for(const random of [0,.2,.8,.999999]){const next=chooseDaily('2026-10-21',initial,random);assert.notEqual(next.id,initial.id);assert(dailyVerses.some(v=>v.id===next.id));}
assert(dailyVerses.some(v=>v.id===chooseDaily('2026-10-20',{day:'2026-10-20',id:'removed'},.5).id));
assert.equal(localDay(new Date(2026,9,20,23,59)),'2026-10-20');
console.log('fixture-tested: short complete source verses, precise references, same-day stability, next-day rotation, invalid old selection, local date.');
