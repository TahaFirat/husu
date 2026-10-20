import index from './quran-index.json';
import core from './core.json';
import enrichment from './enrichment.json';
import transliterations from './transliterations.json';
import wordData from './words.json';
import verifiedWordSources from './verified-word-sources.json';
import { prayers } from './prayers';
import type { Reading, Surah, Analysis } from './types';
const names = 'Fâtiha|Bakara|Âl-i İmrân|Nisâ|Mâide|En‘âm|A‘râf|Enfâl|Tevbe|Yûnus|Hûd|Yûsuf|Ra‘d|İbrâhim|Hicr|Nahl|İsrâ|Kehf|Meryem|Tâhâ|Enbiyâ|Hac|Mü’minûn|Nûr|Furkân|Şuarâ|Neml|Kasas|Ankebût|Rûm|Lokmân|Secde|Ahzâb|Sebe|Fâtır|Yâsîn|Sâffât|Sâd|Zümer|Mü’min|Fussilet|Şûrâ|Zuhruf|Duhân|Câsiye|Ahkâf|Muhammed|Fetih|Hucurât|Kâf|Zâriyât|Tûr|Necm|Kamer|Rahmân|Vâkıa|Hadîd|Mücâdele|Haşr|Mümtehine|Saf|Cuma|Münâfikûn|Tegâbün|Talâk|Tahrîm|Mülk|Kalem|Hâkka|Meâric|Nûh|Cin|Müzzemmil|Müddessir|Kıyâmet|İnsân|Mürselât|Nebe|Nâziât|Abese|Tekvîr|İnfitâr|Mutaffifîn|İnşikâk|Bürûc|Târık|A‘lâ|Gâşiye|Fecr|Beled|Şems|Leyl|Duhâ|İnşirâh|Tîn|Alak|Kadir|Beyyine|Zilzâl|Âdiyât|Kâria|Tekâsür|Asr|Hümeze|Fîl|Kureyş|Mâûn|Kevser|Kâfirûn|Nasr|Tebbet|İhlâs|Felak|Nâs'.split('|');
export const surahs: Surah[] = index.data.surahs.references.map(s=>({id:s.number,name:names[s.number-1],arabicName:s.name,count:s.numberOfAyahs,revelation:s.revelationType==='Meccan'?'Mekkî':'Medenî'}));
const notes=enrichment as unknown as Record<string,Analysis>;
const latin=transliterations.verses as Record<string,Record<string,string|null>>;
const wbw=wordData as Record<string,Record<string,{arabic:string;transliteration:string;meaning:string}[]>>;
const verifiedWords=new Set(verifiedWordSources.references);
function verseData(sid:number,v:any){const sourceWords=wbw[String(sid)]?.[String(v.number)];const hasBasmala=sid!==1&&v.number===1;const allWords=sourceWords?(hasBasmala?[...wbw['1']['1'],...sourceWords]:sourceWords):undefined;const words=verifiedWords.has(`${sid}:${v.number}`)?allWords:[];const editorial=latin[String(sid)]?.[String(v.number)];return {...v,transliteration:editorial?(hasBasmala?'Bismillâhirrahmânirrahîm. ':'')+editorial:allWords?.map(w=>w.transliteration).join(' '),words};}
export const offline: Reading[] = core.surahs.filter(s=>s.id!==2).map(s=>({id:String(s.id),name:s.id===59?'Hüvallahüllezi':s.id===96?'Alak (1–5)':names[s.id-1],arabicName:s.name,count:s.numberOfAyahs,source:'AlQuran Cloud · Diyanet meali / Quran.com · kelime anlamları ve Latin çevriyazı',verses:s.verses.map(v=>verseData(s.id,v)),...notes[String(s.id)]}));
const baqara=core.surahs.find(s=>s.id===2)!;
offline.push(...[{id:'2-255',name:'Ayetel Kürsi',start:255,end:255},{id:'2-285',name:'Âmenerrasûlü',start:285,end:286}].map(s=>({id:s.id,name:s.name,arabicName:baqara.name,count:baqara.numberOfAyahs,source:'AlQuran Cloud · Diyanet meali / Quran.com · kelime anlamları ve Latin çevriyazı',verses:baqara.verses.filter(v=>v.number>=s.start&&v.number<=s.end).map(v=>verseData(2,v)),...(notes[s.id]||notes['2']),keyWords:(notes[s.id]||notes['2']).keyWords.filter(k=>k.verse!>=s.start&&k.verse!<=s.end)})));
export const allOffline=[...offline,...prayers];
export function getOffline(id:string){return allOffline.find(s=>s.id===id);}
export const normalize=(s:string)=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f\u0610-\u061a\u0640\u064b-\u065f\u0670\u06d6-\u06ed]/g,'').replace(/ٱ/g,'ا').replace(/ı/g,'i').replace(/[‘’'\-\s]/g,'');
