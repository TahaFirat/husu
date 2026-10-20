import { getOffline, surahs } from './data';
import { loadSurah } from './quran';
import { read, write } from './storage';
import type { Reading, Verse } from './types';
import { validWordRange } from './source-validation';

export type Selection = { id:string; start:number; end:number };
export function nameOf(id:string) {
  return getOffline(id)?.name || surahs.find(s=>String(s.id)===id)?.name || 'Sure';
}
export function selectedVerses(reading:Reading, selection:Selection) {
  return reading.verses.filter(v=>v.number>=selection.start && v.number<=selection.end);
}
export async function resolveReading(selection:Selection, signal?:AbortSignal):Promise<Reading> {
  const local=getOffline(selection.id);
  if(local && selectedVerses(local,selection).length===selection.end-selection.start+1) return local;
  const loaded=await loadSurah(Number(selection.id),signal);
  if(!local) return loaded;
  return {...loaded, husuMessage:local.husuMessage, keyWords:local.keyWords,
    verses:loaded.verses.map(v=>{
      const embedded=local.verses.find(e=>e.number===v.number && e.arabic.trim()===v.arabic.trim());
      return embedded?{...v, words:embedded.words, transliteration:v.transliteration||embedded.transliteration}:v;
    })};
}
export async function loadWordMeanings(selection:Selection, signal:AbortSignal) {
  const key=`words:v2:${selection.id}:${selection.start}:${selection.end}`;
  const cached=read<Record<string,NonNullable<Verse['words']>>|null>(key,null);
  if(validWordRange(cached,selection.start,selection.end)) return cached;
  const response=await fetch(`/api/words/${selection.id}?from=${selection.start}&to=${selection.end}`,{signal});
  if(!response.ok) throw new Error('Kelime anlamları şu an yüklenemedi. Ayet ve mealden devam edebilirsin.');
  const words:unknown=await response.json();
  if(!validWordRange(words,selection.start,selection.end))throw new Error('Kelime verisinin ayet aralığı doğrulanamadı. Ayet ve mealden devam edebilirsin.');
  if(Object.values(words).every(verseWords=>verseWords.length>0))write(key,words);
  return words;
}
