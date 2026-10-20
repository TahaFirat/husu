'use client';
import { useEffect,useRef,useState } from 'react';
import { ArrowRight,BookOpen,Bookmark,Check,ChevronRight,LoaderCircle,Moon,Search,X } from 'lucide-react';
import { prepareOffline } from '@/lib/offline';
import { getOffline,normalize,offline,surahs } from '@/lib/data';
import { prayers } from '@/lib/prayers';
import { loadSurah } from '@/lib/quran';
import { nameOf,type Selection } from '@/lib/readings';
import { defaultSelection,migrateFavorites,rememberSelection,sameSelection,uniqueSelections } from '@/lib/library';
import { read,write } from '@/lib/storage';
import type { Reading,Verse } from '@/lib/types';
import ReadingContent from './reading-content';
import ThemeControls,{useTheme} from './theme-controls';

type FontSize='normal'|'large'|'xlarge';
const fontSizes:{id:FontSize;button:string;label:string}[]=[{id:'normal',button:'A−',label:'Normal'},{id:'large',button:'A+',label:'Büyük'},{id:'xlarge',button:'A++',label:'Çok Büyük'}];

export default function HusuApp(){
  const [selection,setSelection]=useState<Selection>(defaultSelection);
  const {theme,setTheme}=useTheme();
  const [fontSize,setFontSize]=useState<FontSize>('large'),[ready,setReady]=useState(false);
  const [tab,setTab]=useState('all'),[query,setQuery]=useState(''),[modal,setModal]=useState(false);
  const [range,setRange]=useState<Reading|null>(null),[from,setFrom]=useState(1),[to,setTo]=useState(5);
  const [choosing,setChoosing]=useState(false),[error,setError]=useState(''),[favorites,setFavorites]=useState<Selection[]>([]),[recent,setRecent]=useState<Selection[]>([]),[toast,setToast]=useState('');
  const [playing,setPlaying]=useState<string|null>(null);
  const dialog=useRef<HTMLDialogElement>(null),audio=useRef<HTMLAudioElement|null>(null),selectionVersion=useRef(0);
  type Option={id:string;name:string;arabicName:string;count:number;full:boolean;saved?:Selection};
  const savedOptions=(items:Selection[]):Option[]=>items.map(item=>{const meta=getOffline(item.id)||surahs.find(s=>String(s.id)===item.id);return {id:item.id,name:selectionLabel(item),arabicName:meta?.arabicName||'',count:meta?.count||0,full:false,saved:item};});
  const options:Option[]=tab==='favorites'?savedOptions(favorites):tab==='recent'?savedOptions(recent):tab==='all'?[...surahs.map(item=>({...item,id:String(item.id),full:true})),...prayers.map(item=>({...item,full:false})),...offline.filter(item=>item.id.includes('-')).map(item=>({...item,full:false}))]:(tab==='prayers'?prayers:offline).map(item=>({...item,full:false}));
  const matchingOptions=options.filter(item=>normalize(`${item.id} ${item.name} ${item.arabicName}`).includes(normalize(query)));

  useEffect(()=>{
    setFavorites(uniqueSelections(read<unknown[]>('library',migrateFavorites(read<unknown[]>('favorites',[])))));
    setRecent(uniqueSelections(read<unknown[]>('recent',[])));
    const saved=read<string>('fontSize','large');setFontSize(fontSizes.some(f=>f.id===saved)?saved as FontSize:'large');
    setReady(true);prepareOffline();
  },[]);
  useEffect(()=>{if(!ready)return;write('selection',selection);setRecent(previous=>{const next=rememberSelection(previous,selection);write('recent',next);return next;});},[selection,ready]);
  useEffect(()=>{if(ready)write('fontSize',fontSize);},[fontSize,ready]);
  useEffect(()=>{audio.current?.pause();setPlaying(null);},[selection]);
  useEffect(()=>()=>audio.current?.pause(),[]);
  useEffect(()=>{if(!toast)return;const timeout=setTimeout(()=>setToast(''),4500);return()=>clearTimeout(timeout);},[toast]);
  useEffect(()=>{if(modal||range){if(!dialog.current?.open)dialog.current?.showModal();}else dialog.current?.close();},[modal,range]);

  function closeDialog(){selectionVersion.current++;setChoosing(false);setModal(false);setRange(null);setError('');setQuery('');}
  function commit(reading:Reading,start:number,end:number){
    setSelection({id:reading.id,start,end});setRange(null);setError('');setQuery('');
  }
  async function choose(id:string,full=false){
    const version=++selectionVersion.current;setError('');setChoosing(true);
    try{
      const embedded=getOffline(id);
      const reading=(embedded&&(!full||embedded.verses.length===embedded.count)?embedded:undefined)||await loadSurah(Number(id));
      if(version!==selectionVersion.current)return;
      setModal(false);
      if(reading.count>15&&reading.verses.length>15){setRange(reading);setFrom(1);setTo(5);}
      else commit(reading,reading.verses[0].number,reading.verses[reading.verses.length-1].number);
    }catch(e){if(version===selectionVersion.current)setError((e as Error).message);}
    finally{if(version===selectionVersion.current)setChoosing(false);}
  }
  async function changeRange(reading:Reading,start:number,end:number){
    const version=++selectionVersion.current;setChoosing(true);setError('');
    try{
      const full=reading.verses.filter(v=>v.number>=start&&v.number<=end).length===end-start+1?reading:await loadSurah(Number(reading.id));
      if(version===selectionVersion.current)commit(full,start,end);
    }catch(e){if(version===selectionVersion.current)setError((e as Error).message);}
    finally{if(version===selectionVersion.current)setChoosing(false);}
  }
  function openRange(reading:Reading){setRange(reading);setFrom(selection.start);setTo(selection.end);}
  function openChoose(){setTab('all');setQuery('');setError('');setModal(true);}
  function saveFavorite(){
    const exists=favorites.some(item=>sameSelection(item,selection));
    const next=exists?favorites.filter(item=>!sameSelection(item,selection)):[...favorites,{...selection}];
    setFavorites(next);write('library',next);setToast(exists?'Favorilerden kaldırıldı.':'Favorilere eklendi.');
  }
  function selectionLabel(item:Selection){return `${nameOf(item.id)}${item.id.startsWith('p-')?'':` · ${item.start}–${item.end}`}`;}
  async function play(verse:Verse,key:string){
    if(playing===key){audio.current?.pause();setPlaying(null);return;}
    audio.current?.pause();setPlaying(null);
    if(!verse.audio){setToast('Bu metin için ses kaydı bulunmuyor.');return;}
    const player=new Audio(verse.audio);audio.current=player;setPlaying(key);
    player.onended=()=>{if(audio.current===player)setPlaying(null);};
    player.onerror=()=>{if(audio.current===player){setPlaying(null);setToast('Ses kaydı yüklenemedi.');}};
    try{await player.play();}catch{if(audio.current===player){setPlaying(null);setToast('Ses başlatılamadı. Yeniden dene.');}}
  }
  const isFavorite=favorites.some(item=>sameSelection(item,selection));
  return <div className="app-shell" data-font-size={fontSize}>
    <header className="topbar">
      <a href="/" className="brand" aria-label="Huşu ana sayfa"><span className="logo"><Moon size={23}/></span><span>huşu<span className="brand-dot">.</span></span></a>
      <div className="header-actions"><ThemeControls theme={theme} onChange={setTheme}/>
      <div className="font-controls" role="group" aria-label="Yazı boyutu">{fontSizes.map(size=><button key={size.id} aria-label={`Yazı boyutu: ${size.label}`} aria-pressed={fontSize===size.id} title={size.label} onClick={()=>setFontSize(size.id)}>{size.button}</button>)}</div></div>
    </header>
    <main className="container">
      <div className="selection-top"><button className="primary-selector" onClick={openChoose}><Search size={20}/><span>Sure veya dua seç</span><ChevronRight size={18}/></button><button className="icon-button" onClick={saveFavorite} aria-pressed={isFavorite} aria-label={isFavorite?'Favorilerden kaldır':'Favorilere ekle'} title={isFavorite?'Favorilerden kaldır':'Favorilere ekle'}><Bookmark size={20}/></button></div>
      {choosing&&<p className="selection-loading" role="status"><LoaderCircle size={18} className="spin"/>Metin yükleniyor…</p>}{error&&<p className="error" role="alert">{error}</p>}
      <ReadingContent selection={selection} scope="reading" playing={playing} onPlay={play} onRange={openRange} onSelectRange={changeRange}/>

    </main>
    <dialog ref={dialog} className="selection-dialog" onCancel={closeDialog} onClick={event=>{if(event.target===event.currentTarget)closeDialog();}}>
      <div className="dialog-head"><h2>{range?`${range.name} · Ayet aralığı`:'Sure seçimi'}</h2><button className="icon-button" aria-label="Kapat" onClick={closeDialog}><X size={22}/></button></div>
      {range?<div className="range-body"><div className="range-presets">{[[1,5],[6,10],[range.count-2,range.count]].map(([start,end],index)=><button key={start} className={from===start&&to===end?'chosen':''} disabled={choosing} onClick={()=>changeRange(range,start,end)}>{index===2?'Son 3 Ayet':`${start}–${end}. ayetler`}</button>)}</div><div className="range-inputs"><label>Başlangıç ayeti<input type="number" min="1" max={range.count} value={from} onChange={event=>setFrom(Number(event.target.value))}/></label><label>Bitiş ayeti<input type="number" min={from} max={range.count} value={to} onChange={event=>setTo(Number(event.target.value))}/></label></div><p>{range.count} ayet · Bir aralıkta en fazla 15 ayet.</p><button className="primary-button" disabled={choosing||from<1||to<from||to>range.count||to-from>=15||!Number.isInteger(from)||!Number.isInteger(to)} onClick={()=>changeRange(range,from,to)}>Aralığı uygula<ArrowRight size={18}/></button></div>:<><div className="picker-tools"><label className="inline-search dialog-search"><Search size={20}/><input autoFocus placeholder="Ad veya sure numarasıyla ara…" aria-label="Metin ara" value={query} onChange={event=>setQuery(event.target.value)}/></label><label className="picker-filter"><span>İçerik</span><select aria-label="İçerik türü" value={tab} onChange={event=>{setTab(event.target.value);setQuery('');}}><option value="short">Sureler ve aşırlar</option><option value="all">Tüm sure ve dualar</option><option value="prayers">Namaz duaları</option><option value="favorites">Favorilerim</option><option value="recent">Son okunanlar</option></select></label></div><div className="surah-results">{matchingOptions.map(item=><button key={`${item.id}-${item.saved?.start||0}-${item.saved?.end||0}`} className="surah-option" disabled={choosing} onClick={()=>{if(item.saved){setSelection({...item.saved});closeDialog();}else void choose(item.id,item.full);}}><span><strong>{item.name}</strong><small>{item.id.startsWith('p-')?'Dua':`${item.count} ayet`}</small></span><b dir="rtl" lang="ar">{item.arabicName.replace('سُورَةُ ','')}</b><ChevronRight size={16}/></button>)}{!matchingOptions.length&&<p>Gösterilecek metin bulunamadı.</p>}</div></>}

      {choosing&&<p className="selection-loading" role="status"><LoaderCircle className="spin" size={18}/>Yükleniyor…</p>}{error&&<p className="error" role="alert">{error}</p>}
    </dialog>
    {toast&&<div className="toast" role="status">{toast}<button aria-label="Bildirimi kapat" onClick={()=>setToast('')}><X size={18}/></button></div>}
  </div>;
}
