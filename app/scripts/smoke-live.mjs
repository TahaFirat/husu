import assert from 'node:assert/strict';
const base='http://127.0.0.1:5173';
const homepage=await fetch(base);assert.equal(homepage.status,200);
for(const id of ['0','115','abc']){const r=await fetch(base+'/api/quran/'+id);assert.equal(r.status,400);}
for(const [id,count] of [[67,30],[2,286]]){const r=await fetch(base+'/api/quran/'+id);assert.equal(r.status,200);const data=await r.json();assert.equal(data.verses.length,count);assert(data.verses.every((v,i)=>v.number===i+1&&v.arabic&&v.translation&&v.audio));console.log(`live-tested: surah ${id}, ${count} Arabic/Turkish/audio entries; ${data.source}`);}
const ai=await fetch(base+'/api/analyze',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({verses:[{number:1,arabic:'وَالْعَصْرِ',translation:'Asra andolsun.'}]})});assert.equal(ai.status,503);console.log('degraded: missing Gemini key returns 503 with explicit message; generation skipped.');
console.log('live-tested: page 200; invalid surah IDs rejected.');

for(const path of ['/api/words/0?from=1&to=5','/api/words/115?from=1&to=5','/api/words/67?from=1&to=31','/api/words/67?from=5&to=1','/api/words/67?from=1&to=16']){assert.equal((await fetch(base+path)).status,400);}
const wr=await fetch(base+'/api/words/67?from=28&to=30');assert.equal(wr.status,200);const words=await wr.json();assert.deepEqual(Object.keys(words),['28','29','30']);for(const value of Object.values(words)){assert(Array.isArray(value));assert(value.every(w=>w.arabic&&w.meaning&&typeof w.transliteration==='string'));}
for(const [number,value] of Object.entries(words))console.log(value.length?`live-tested: Mulk ${number}, ${value.length} Turkish word entries.`:`degraded: Mulk ${number}, incomplete Turkish source; entire verse word interaction disabled.`);
console.log('live-tested: invalid and oversized word ranges rejected.');
