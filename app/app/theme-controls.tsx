'use client';
import { useEffect,useState } from 'react';
import { Moon,Sun } from 'lucide-react';
import { read,write } from '@/lib/storage';
export function useTheme(){
  const [theme,setTheme]=useState<'light'|'dark'>('dark'),[ready,setReady]=useState(false);
  useEffect(()=>{const saved=read<string|null>('theme',null);setTheme(saved==='light'||saved==='dark'?saved:window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');setReady(true);},[]);
  useEffect(()=>{if(!ready)return;write('theme',theme);document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;},[theme,ready]);
  return {theme,setTheme};
}
export default function ThemeControls({theme,onChange}:{theme:'light'|'dark';onChange:(theme:'light'|'dark')=>void}){
  return <div className="theme-controls" role="group" aria-label="Tema seçimi"><button aria-pressed={theme==='light'} aria-label="Açık tema" title="Açık tema" onClick={()=>onChange('light')}><Sun size={18}/><span>Açık</span></button><button aria-pressed={theme==='dark'} aria-label="Koyu tema" title="Koyu tema" onClick={()=>onChange('dark')}><Moon size={18}/><span>Koyu</span></button></div>;
}
