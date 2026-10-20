import type { Selection } from './readings';
export const defaultSelection:Selection={id:'1',start:1,end:7};
export function sameSelection(a:Selection,b:Selection){return a.id===b.id&&a.start===b.start&&a.end===b.end;}
export function validSelection(value:unknown):value is Selection {
  if(!value||typeof value!=='object')return false;
  const s=value as Selection;
  return typeof s.id==='string'&&Number.isInteger(s.start)&&Number.isInteger(s.end)&&s.start>0&&s.end>=s.start;
}
export function uniqueSelections(values:unknown[]):Selection[]{
  return values.filter(validSelection).filter((s,index,all)=>all.findIndex(other=>sameSelection(s,other))===index);
}
export function migrateFavorites(old:unknown[]):Selection[]{
  return uniqueSelections(old.flatMap(item=>item&&typeof item==='object'&&'selections' in item&&Array.isArray(item.selections)?item.selections:[]));
}
export function rememberSelection(previous:Selection[],selection:Selection){
  return [selection,...previous.filter(s=>!sameSelection(s,selection))].slice(0,8);
}
