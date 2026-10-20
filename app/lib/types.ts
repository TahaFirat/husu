export type Word = { arabic:string; transliteration:string; meaning:string; deepNote:string; verse?:number; match?:string };
export type MeaningGroup = { start:number; end:number; transliteration:string; meaning:string };
export type Verse = { number:number; arabic:string; translation:string; transliteration?:string; audio?:string; words?:{arabic:string; transliteration:string; meaning:string}[]; groups?:MeaningGroup[] };
export type Reading = { id:string; name:string; arabicName:string; verses:Verse[]; count:number; source:string; husuMessage?:string; keyWords?:Word[] };
export type Surah = { id:number; name:string; arabicName:string; count:number; revelation:string };
export type Analysis = { husuMessage:string; keyWords:Word[]; highlightedVerses?:{number:number; phrases:{text:string; keywordIndex:number}[]}[] };
