import verifiedVerses from './daily-verses.json';

// Full provider text, with edition and a retained source response for auditing.
export const dailyVerses=verifiedVerses;
export type DailyChoice={day:string;id:string};
export function chooseDaily(day:string,previous:DailyChoice|null,random:number):DailyChoice{
  if(previous?.day===day&&dailyVerses.some(verse=>verse.id===previous.id))return previous;
  const candidates=dailyVerses.filter(verse=>verse.id!==previous?.id);
  const index=Math.min(candidates.length-1,Math.max(0,Math.floor(random*candidates.length)));
  return {day,id:candidates[index].id};
}
export function localDay(date=new Date()){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
