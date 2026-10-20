'use client';
import { useEffect,useState } from 'react';
import { ArrowRight,ArrowUpRight,BookOpen,ChevronDown,Moon } from 'lucide-react';
import { chooseDaily,dailyVerses,localDay,type DailyChoice } from '@/lib/daily-verse';
import { read,write } from '@/lib/storage';
import { displayArabic } from '@/lib/arabic-display';
import { prepareOffline } from '@/lib/offline';
import ThemeControls,{useTheme} from './theme-controls';

export default function Home(){
  const {theme,setTheme}=useTheme();
  const [choice,setChoice]=useState<DailyChoice|null>(null);
  useEffect(()=>{
    let timeout:ReturnType<typeof setTimeout>;
    const update=()=>{
      const random=crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;
      const next=chooseDaily(localDay(),read<DailyChoice|null>('dailyVerse',null),random);
      setChoice(next);write('dailyVerse',next);
      clearTimeout(timeout);const midnight=new Date();midnight.setHours(24,0,0,0);
      timeout=setTimeout(update,midnight.getTime()-Date.now()+100);
    };
    const onVisible=()=>{if(document.visibilityState==='visible')update();};
    update();prepareOffline();document.addEventListener('visibilitychange',onVisible);
    return()=>{clearTimeout(timeout);document.removeEventListener('visibilitychange',onVisible);};
  },[]);
  const verse=dailyVerses.find(verse=>verse.id===choice?.id);
  const date=choice?new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long'}).format(new Date(choice.day+'T12:00:00')):'';
  return <div className="app-shell home-shell">
    <header className="topbar home-header"><a href="/" className="brand" aria-label="Huşu ana sayfa"><span className="logo"><Moon size={23}/></span><span>huşu<span className="brand-dot">.</span></span></a><div className="header-actions"><ThemeControls theme={theme} onChange={setTheme}/></div></header>
    <main className="home-stage">
      <div className="home-intro"><span className="home-eyebrow"><span/>KUR’AN VE DUA</span><h1>Anlamıyla{' '}<span>oku.</span></h1><p>Sure ve duaları, kelimelerin anlamlarıyla birlikte keşfet.</p></div>
      <section className="daily-card" aria-labelledby="daily-title" aria-busy={!verse}>
        <div className="daily-heading"><span className="daily-kicker" id="daily-title">GÜNÜN AYETİ</span><time dateTime={choice?.day}>{date}</time></div>
        <span className="daily-ornament" aria-hidden="true"><svg viewBox="0 0 48 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M14 11 21 16 24 6 27 16 34 11v12c0 6-4 10-10 10s-10-4-10-10Z" fill="currentColor" fillOpacity=".06"/><path d="M21 16c-1 7 0 12 3 17 3-5 4-10 3-17M24 33v18M24 46c-6 0-11-4-13-10 7 0 12 4 13 10ZM24 42c6-1 11-5 13-11-7 1-12 5-13 11Z"/></svg></span>
        {verse?<><p className="daily-translation">{verse.translation}</p><div className="daily-attribution"><span className="attribution-rule"/><p>{verse.name} Suresi<span>{verse.surah}. sure · {verse.verse}. ayet</span></p></div><div className="daily-card-bottom"><details className="daily-original"><summary>Arapça metin<ChevronDown size={14}/></summary><p className="daily-arabic" dir="rtl" lang="ar">{displayArabic(verse.arabic)}</p></details><a className="daily-context" href={verse.contextUrl} target="_blank" rel="noopener noreferrer">Ayetin bağlamı<ArrowUpRight size={14}/></a></div><p className="daily-source"><a href={verse.sourceUrl} target="_blank" rel="noopener noreferrer">Diyanet İşleri meali · AlQuran Cloud</a></p></>:<div className="daily-loading" role="status">Günün ayeti hazırlanıyor…</div>}
      </section>
      <div className="home-actions"><a className="home-read-button" href="/oku"><BookOpen size={20}/><span>Okumaya başla</span><ArrowRight size={19}/></a><p className="home-library-note">114 sure<span>·</span>8 namaz duası</p></div>
    </main>
  </div>;
}
