import type { Verse,Word } from './types';

// A transparent lexical fallback when no curated or AI selection is available.
// Every displayed word and meaning comes directly from the word-data provider.
export function sourceKeywords(verses:Verse[]):Word[] {
  const common=new Set(['ve','bir','bu','şu','o','ki','de','da','ne','ey','ile','için','olan','onlar','siz','biz','ben','sen','mı','mi','yoksa']);
  const candidates=verses.flatMap(verse=>(verse.words||[]).filter(word=>word.meaning.trim().length>2&&!common.has(word.meaning.toLocaleLowerCase('tr'))&&verse.arabic.includes(word.arabic)).map(word=>({word,verse})))
    .sort((a,b)=>b.word.meaning.length-a.word.meaning.length);
  const selected:typeof candidates=[];
  function add(candidate:typeof candidates[number]){if(!selected.some(item=>item.word.arabic===candidate.word.arabic))selected.push(candidate);}
  for(const verse of verses){const candidate=candidates.find(item=>item.verse.number===verse.number);if(candidate)add(candidate);if(selected.length===3)break;}
  for(const candidate of candidates){if(selected.length===3)break;add(candidate);}
  return selected.map(({word,verse})=>{
    const start=verse.translation.toLocaleLowerCase('tr').indexOf(word.meaning.toLocaleLowerCase('tr'));
    return {arabic:word.arabic,transliteration:word.transliteration,meaning:word.meaning,verse:verse.number,
      match:start>=0?verse.translation.slice(start,start+word.meaning.length):undefined,
      deepNote:`Kaynak kelime anlamı: ${word.meaning}. İfadeyi ayetin bütünüyle birlikte oku.`};
  });
}
