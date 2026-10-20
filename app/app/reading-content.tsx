'use client';
import { useEffect,useRef,useState } from 'react';
import { BookOpen,ChevronDown,LoaderCircle,Pause,Volume2,X } from 'lucide-react';
import { loadWordMeanings,resolveReading,selectedVerses,type Selection } from '@/lib/readings';
import { arabicTokens,meaningGroups } from '@/lib/word-interaction';
import { displayArabic } from '@/lib/arabic-display';
import { turkishPronunciation } from '@/lib/reading-pronunciation';
import type { Reading,Verse } from '@/lib/types';

type Props={selection:Selection;scope:string;playing:string|null;onPlay:(verse:Verse,key:string)=>void;onRange?:(reading:Reading)=>void;onSelectRange?:(reading:Reading,start:number,end:number)=>void};
export default function ReadingContent({selection,scope,playing,onPlay,onRange,onSelectRange}:Props){
  const [reading,setReading]=useState<Reading|null>(null),[error,setError]=useState(''),[wordStatus,setWordStatus]=useState('');
  const [active,setActive]=useState<{verse:number;group:number}|null>(null),[latinVerses,setLatinVerses]=useState<Record<number,boolean>>({});
  const [speechStatus,setSpeechStatus]=useState(''),[canSpeak,setCanSpeak]=useState(false);
  const spoken=useRef<SpeechSynthesisUtterance|null>(null);
  const selectionKey=`${selection.id}:${selection.start}:${selection.end}`;
  const verses=reading?selectedVerses(reading,selection):[];
  function stopSpeech(){if(spoken.current&&'speechSynthesis' in window){spoken.current=null;window.speechSynthesis.cancel();}}
  useEffect(()=>{if(!('speechSynthesis' in window))return;const update=()=>setCanSpeak(window.speechSynthesis.getVoices().some(voice=>voice.lang.toLowerCase().startsWith('tr')));update();window.speechSynthesis.addEventListener('voiceschanged',update);return()=>window.speechSynthesis.removeEventListener('voiceschanged',update);},[]);
  useEffect(()=>{
    const controller=new AbortController();let cancelled=false;
    setReading(null);setError('');setActive(null);setLatinVerses({});setWordStatus('');
    resolveReading(selection,controller.signal).then(async result=>{
      if(cancelled)return;setReading(result);
      if(selectedVerses(result,selection).every(verse=>verse.words?.length))return;
      setWordStatus('Kelime anlamları yükleniyor…');
      try{const words=await loadWordMeanings(selection,controller.signal);if(!cancelled){setReading({...result,verses:result.verses.map(verse=>({...verse,words:verse.words?.length?verse.words:words[verse.number],transliteration:verse.transliteration||words[verse.number]?.map(word=>word.transliteration).join(' ')}))});setWordStatus('');}}
      catch(e){if(!cancelled)setWordStatus((e as Error).message);}
    }).catch(e=>{if(!cancelled)setError((e as Error).message);});
    return()=>{cancelled=true;controller.abort();stopSpeech();};
  },[selectionKey]);
  useEffect(()=>{stopSpeech();setSpeechStatus('');if(active)document.getElementById(`${scope}-meaning-${active.verse}`)?.scrollIntoView({behavior:'smooth',block:'nearest'});},[active?.verse,active?.group]);
  function selectWord(verse:Verse,index:number){
    const group=meaningGroups(verse).findIndex(item=>index>=item.start&&index<item.end);
    if(group<0)return;
    setActive(previous=>previous?.verse===verse.number&&previous.group===group?null:{verse:verse.number,group});
  }
  function speak(meaning:string){
    if(!('speechSynthesis' in window)){setSpeechStatus('Bu tarayıcı sesli okumayı desteklemiyor.');return;}
    const voice=window.speechSynthesis.getVoices().find(voice=>voice.lang.toLowerCase().startsWith('tr'));
    if(!voice){setSpeechStatus('Bu cihazda Türkçe okuma sesi bulunamadı.');return;}
    stopSpeech();const utterance=new SpeechSynthesisUtterance(meaning);utterance.lang='tr-TR';utterance.voice=voice;utterance.rate=.9;
    utterance.onend=()=>{if(spoken.current===utterance)spoken.current=null;};utterance.onerror=()=>{if(spoken.current===utterance){spoken.current=null;setSpeechStatus('Sesli okuma başlatılamadı.');}};
    spoken.current=utterance;window.speechSynthesis.speak(utterance);
  }
  if(error)return <p className="error" role="alert">{error}</p>;
  if(!reading)return <section className="loading" aria-busy="true"><LoaderCircle className="spin" size={23}/>Metin yükleniyor…</section>;
  return <section className="reading-section" aria-labelledby={`${scope}-title`}>
    <div className="reading-heading"><h2 id={`${scope}-title`}>{reading.name}</h2>{onRange&&Number(selection.id)>0&&reading.count>15&&<button className="secondary-button" onClick={()=>onRange(reading)}>Ayet aralığı<ChevronDown size={15}/></button>}</div>
    {onSelectRange&&Number(selection.id)>0&&reading.count>15&&<div className="range-presets inline-ranges" aria-label="Hızlı ayet aralığı">{[[1,5],[6,10],[reading.count-2,reading.count]].map(([start,end],index)=><button key={start} aria-pressed={selection.start===start&&selection.end===end} onClick={()=>onSelectRange(reading,start,end)}>{index===2?'Son 3 Ayet':`${start}–${end}`}</button>)}<span>{selection.start}–{selection.end}. ayetler</span></div>}
    {verses.some(verse=>arabicTokens(verse).some(token=>token.wordIndex!==undefined))&&<p className="interaction-hint">Anlamı için Arapça kelimeye dokun.</p>}
    {wordStatus&&<p className="word-status" role="status">{wordStatus}</p>}
    <div className="verse-list">{verses.map(verse=>{
      const audioKey=`${scope}:${verse.number}`,groups=meaningGroups(verse),tokens=arabicTokens(verse);
      const aligned=tokens.some(token=>token.wordIndex!==undefined);
      const selected=active?.verse===verse.number?groups[active.group]:undefined;
      const selectedArabic=selected?verse.words?.slice(selected.start,selected.end).map(word=>word.arabic).join(' '):'';
      const pronunciation=turkishPronunciation(reading.id,verse);
      return <article key={verse.number} className="verse-card">
        <div className="verse-toolbar"><span className="verse-badge">{verse.number}</span><span>{reading.id.startsWith('p-')?'Dua':`${verse.number}. ayet`}</span>{verse.audio&&<button className={`listen-button ${playing===audioKey?'audio-active':''}`} onClick={()=>onPlay(verse,audioKey)} aria-label={`${reading.name} ${verse.number}. ayeti ${playing===audioKey?'duraklat':'dinle'}`}>{playing===audioKey?<Pause size={16}/>:<Volume2 size={16}/>}<span>{playing===audioKey?'Duraklat':'Dinle'}</span></button>}</div>
        <p dir="rtl" lang="ar" className="arabic-verse interactive-arabic">{tokens.map((token,index)=>{
          if(token.wordIndex===undefined)return <span key={index}>{displayArabic(token.text)}</span>;
          const chosen=selected&&token.wordIndex>=selected.start&&token.wordIndex<selected.end;
          return <span key={index}><button className={`arabic-token ${chosen?'token-selected':''}`} aria-pressed={!!chosen} aria-label={`${displayArabic(token.text.trim())} anlamını göster`} onClick={()=>selectWord(verse,token.wordIndex!)}>{displayArabic(token.text.trim())}</button>{/\s$/.test(token.text)?' ':''}</span>;
        })}</p>
        {verse.words!==undefined&&!aligned&&<p className="word-status">Bu ayette Türkçe kelime verisi veya metin eşleştirmesi eksik. Tam meal aşağıdadır.</p>}
        {selected&&<div className="meaning-panel" id={`${scope}-meaning-${verse.number}`} role="region" aria-label="Seçilen ifadenin anlamı"><div className="meaning-panel-top"><span>{reading.id.startsWith('p-')?'İfade anlamı':'Kelime anlamı'}</span><button aria-label="Anlamı kapat" onClick={()=>setActive(null)}><X size={18}/></button></div><p dir="rtl" lang="ar" className="selected-arabic">{displayArabic(selectedArabic||'')}</p>{reading.id.startsWith('p-')&&selected.transliteration&&<p className="selected-latin">{selected.transliteration}</p>}<p className="selected-meaning" aria-live="polite">{selected.meaning}</p>{canSpeak&&<button className="meaning-speak" onClick={()=>speak(selected.meaning)}><Volume2 size={17}/>Türkçe anlamı dinle</button>}{speechStatus&&<p className="speech-status" role="status">{speechStatus}</p>}</div>}
        {pronunciation&&<button className="latin-button" aria-expanded={!!latinVerses[verse.number]} onClick={()=>setLatinVerses(previous=>({...previous,[verse.number]:!previous[verse.number]}))}>{latinVerses[verse.number]?'Okunuşu Gizle':'Okunuşu Göster'}<ChevronDown className={latinVerses[verse.number]?'rotated':''} size={16}/></button>}
        {pronunciation&&latinVerses[verse.number]&&<p className="transliteration">{pronunciation}</p>}
        <p className="translation">{verse.translation}</p>
      </article>;
    })}</div>
    <details className="source-details"><summary><BookOpen size={15}/>Kaynak bilgisi<ChevronDown size={15}/></summary><p>{reading.source}. Görünümde vasıl işaretli elif (ٱ), sade elif (ا) olarak gösterilir; harekeler korunur. Kaynak metin ve ses değiştirilmez. Dua grupları editoryal ifade anlamlarıdır. Diğer metinlerde Quran.com Türkçe kelime verisi kullanılır; kelime karşılıkları tam mealin yerine geçmez. Metinle sıra eşleştirmesi doğrulanmayan kelimeler açılmaz. Fâtiha, Asr ve dualarda Türkçe editoryal okunuş vardır. Kaynağın kelime bazlı Latin çevriyazısı gösterilmez; Türkçe okunuşu bulunmayan ayetlerde okunuş düğmesi açılmaz.</p></details>
  </section>;
}
