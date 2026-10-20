import type { MeaningGroup,Verse } from './types';
// Remove vocalisation, not consonants: hamza above/below remains significant.
const signature=(text:string)=>text.normalize('NFD').replace(/\u0640[\u064b-\u0653]*\u0654/g,'ء').replace(/[\u0610-\u061a\u0640\u064b-\u0653\u0656-\u065f\u0670\u06d6-\u06ed]/g,'').replace(/ٱ/g,'ا').trim();
export function meaningGroups(verse:Verse):MeaningGroup[]{
  const groups=verse.groups!==undefined?verse.groups:(verse.words||[]).map((word,index)=>({start:index,end:index+1,transliteration:word.transliteration,meaning:word.meaning}));
  let cursor=0;
  for(const group of groups){
    if(!Number.isInteger(group.start)||!Number.isInteger(group.end)||group.start!==cursor||group.end<=cursor||group.end>(verse.words?.length||0)||!group.meaning.trim())return [];
    cursor=group.end;
  }
  return cursor===(verse.words?.length||0)?groups:[];
}
export function arabicTokens(verse:Verse){
  const tokens=verse.arabic.match(/\s+|\S+\s*/g)||[],words=verse.words||[];
  const plain=tokens.map(text=>({text,wordIndex:undefined as number|undefined}));
  if(!words.length||!meaningGroups(verse).length)return plain;
  const positions=tokens.map((text,index)=>({key:signature(text),index})).filter(token=>token.key);
  const keys=words.map(word=>signature(word.arabic));
  // Some surah editions include the complete basmala before verse 1;
  // only this exact four-word prefix may be absent from the word provider.
  const basmala=['بسم','الله','الرحمن','الرحيم'];
  const offset=verse.number===1&&positions.length===words.length+4&&basmala.every((word,index)=>positions[index].key===word)?4:0;
  if(positions.length!==words.length+offset||keys.some((key,index)=>!key||key!==positions[index+offset].key))return plain;
  positions.slice(offset).forEach((token,index)=>{plain[token.index].wordIndex=index;});
  return plain;
}
