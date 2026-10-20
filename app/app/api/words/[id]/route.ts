import { surahs } from '@/lib/data';
import type { Verse } from '@/lib/types';
import { nonEmpty } from '@/lib/source-validation';

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}) {
  const id=Number((await params).id), url=new URL(request.url);
  const from=Number(url.searchParams.get('from')), to=Number(url.searchParams.get('to'));
  if(!Number.isInteger(id)||id<1||id>114||!Number.isInteger(from)||!Number.isInteger(to)||from<1||to<from||to>surahs[id-1].count||to-from>=15)
    return Response.json({error:'Geçersiz sure veya ayet aralığı'},{status:400});
  const result:Record<string,NonNullable<Verse['words']>>={};
  // Fixed provider origin and bounded batches; no visitor-supplied URL is fetched.
  try {
    for(let start=from;start<=to;start+=5) {
      await Promise.all(Array.from({length:Math.min(5,to-start+1)},async(_,offset)=>{
        const number=start+offset;
        const response=await fetch(`https://api.quran.com/api/v4/verses/by_key/${id}:${number}?language=tr&words=true&word_fields=text_uthmani`,{signal:AbortSignal.timeout(12000)});
        if(!response.ok)throw new Error();
        const payload=await response.json() as {verse?:{verse_key?:string;words?:{position?:number;char_type_name?:string;text_uthmani?:string;translation?:{text?:string;language_name?:string};transliteration?:{text?:string}}[]}};
        if(payload.verse?.verse_key!==`${id}:${number}`||!Array.isArray(payload.verse.words))throw new Error();
        const sourceWords=payload.verse.words.filter(w=>w.char_type_name!=='end');
        if(!sourceWords.length||!sourceWords.every((w,index)=>w.char_type_name==='word'&&w.position===index+1&&nonEmpty(w.text_uthmani)))throw new Error();
        // Do not drop individual words or expose the provider's English fallback.
        // An empty verse array explicitly disables that verse's word interaction.
        if(!sourceWords.every(w=>w.translation?.language_name==='turkish'&&nonEmpty(w.translation.text))){result[number]=[];return;}
        const words=sourceWords
          .map(w=>({arabic:w.text_uthmani!,meaning:w.translation!.text!,transliteration:w.transliteration?.text||''}));
        if(!words?.length)throw new Error();
        result[number]=words;
      }));
    }
    return Response.json(result);
  } catch { return Response.json({error:'Kelime kaynağına erişilemedi'},{status:503}); }
}
