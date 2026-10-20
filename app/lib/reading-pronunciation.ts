import editorial from './transliterations.json';
import { canonicalArabic } from './prayer-groups';
import type { Verse } from './types';

// Provider word transliterations describe connected script, not Turkish reading.
// Never turn those fragments into a pronunciation guide by joining or rewriting.
export function turkishPronunciation(id:string,verse:Verse):string|null{
  if(id.startsWith('p-'))return verse.transliteration||null;
  const readings=editorial.verses as Record<string,Record<string,string|null>>;
  const text=readings[id]?.[String(verse.number)];
  if(!text)return null;
  const arabic=canonicalArabic(verse.arabic).trim().replace(/\s+/g,' ');
  const prefix=id!=='1'&&verse.number===1&&arabic.startsWith('بسم الله الرحمن الرحيم ')?'Bismillâhirrahmânirrahîm. ':'';
  return prefix+text;
}
