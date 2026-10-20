import type { Reading } from './types';
import { read,write } from './storage';
import { surahs } from './data';
import { validReading } from './source-validation';
export async function loadSurah(id:number,signal?:AbortSignal):Promise<Reading>{
 const count=surahs.find(surah=>surah.id===id)?.count;
 if(!count)throw new Error('Geçersiz sure.');
 const cached=read<Reading|null>(`surah:${id}`,null);if(validReading(cached,id,count))return cached;
 const response=await fetch(`/api/quran/${id}`,{signal});
 if(!response.ok)throw new Error('Sureye şu an ulaşılamıyor. İnternetini kontrol et veya çevrimdışı surelerden birini seç.');
 const data:unknown=await response.json();
 if(!validReading(data,id,count))throw new Error('Kaynak metnin ayet sırası doğrulanamadı. Lütfen tekrar dene.');
 write(`surah:${id}`,data);return data;
}
