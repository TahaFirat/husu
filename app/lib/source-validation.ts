import type { Reading,Verse } from './types';

export const nonEmpty=(value:unknown):value is string=>typeof value==='string'&&value.trim().length>0;
const validWords=(words:unknown):words is NonNullable<Verse['words']>=>Array.isArray(words)&&words.length>0&&words.every(word=>word&&nonEmpty(word.arabic)&&nonEmpty(word.meaning)&&typeof word.transliteration==='string');
export function validReading(value:unknown,id:number,count:number):value is Reading{
  const reading=value as Reading|null;
  return !!reading&&reading.id===String(id)&&reading.count===count&&nonEmpty(reading.name)&&nonEmpty(reading.source)&&Array.isArray(reading.verses)&&reading.verses.length===count&&reading.verses.every((verse,index)=>verse&&verse.number===index+1&&nonEmpty(verse.arabic)&&nonEmpty(verse.translation)&&(verse.words===undefined||validWords(verse.words))&&(verse.transliteration===undefined||typeof verse.transliteration==='string')&&(verse.groups===undefined||(Array.isArray(verse.groups)&&verse.groups.every(group=>group&&Number.isInteger(group.start)&&Number.isInteger(group.end)&&nonEmpty(group.meaning)&&typeof group.transliteration==='string'))));
}
export function validWordRange(value:unknown,from:number,to:number):value is Record<string,NonNullable<Verse['words']>>{
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==to-from+1)return false;
  const range=value as Record<string,unknown>;
  for(let number=from;number<=to;number++){
    const words=range[number];
    if(!Array.isArray(words)||(words.length>0&&!validWords(words)))return false;
  }
  return true;
}
