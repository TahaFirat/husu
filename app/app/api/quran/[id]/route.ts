import { surahs } from '@/lib/data';
import { nonEmpty } from '@/lib/source-validation';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;const num=Number(id);if(!Number.isInteger(num)||num<1||num>114)return Response.json({error:'Geçersiz sure'},{status:400});
 const meta=surahs[num-1];
 try{
  const r=await fetch(`https://api.acikkuran.com/surah/${num}?author=11`,{signal:AbortSignal.timeout(4500)});
  if(r.ok){const {data:d}=await r.json() as any;if(d?.id===num&&Array.isArray(d.verses)&&d.verses.length===meta.count&&d.verses.every((v:any,i:number)=>v.verse_number===i+1&&nonEmpty(v.verse)&&nonEmpty(v.translation?.text)))return Response.json({...meta,id:String(num),source:'Açık Kuran · meal yazar no. 11',verses:d.verses.map((v:any)=>({number:v.verse_number,arabic:v.verse,translation:v.translation.text,transliteration:v.transcription||undefined,audio:v.audio?.mp3}))});}
 }catch{}
 try{
  const r=await fetch(`https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,tr.diyanet,ar.alafasy`,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error();
  const {data}=await r.json() as any;if(!Array.isArray(data))throw Error();
  const ar=data.find((e:any)=>e.edition?.identifier==='quran-uthmani'),tr=data.find((e:any)=>e.edition?.identifier==='tr.diyanet'),audio=data.find((e:any)=>e.edition?.identifier==='ar.alafasy');
  for(const edition of [ar,tr])if(edition?.number!==num||!Array.isArray(edition.ayahs)||edition.ayahs.length!==meta.count||!edition.ayahs.every((v:any,i:number)=>v.numberInSurah===i+1&&nonEmpty(v.text)))throw Error();
  return Response.json({...meta,id:String(num),source:'AlQuran Cloud · Diyanet İşleri meali (tr.diyanet)',verses:ar.ayahs.map((v:any,i:number)=>({number:v.numberInSurah,arabic:v.text,translation:tr.ayahs[i].text,audio:audio?.number===num&&audio.ayahs?.[i]?.numberInSurah===v.numberInSurah?audio.ayahs[i].audio:undefined}))});
 }catch{return Response.json({error:'Kaynaklara erişilemedi'},{status:503});}
}
