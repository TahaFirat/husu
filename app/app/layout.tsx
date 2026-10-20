import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Huşu — Kalbini namaza hazırla', description: 'Namaz öncesi sure ve duaların anlamlarına doğrudan bak. Arapça ifadeye dokunarak anlamını gör. Sade okuma, büyük yazılar ve açık/koyu tema.' };
export default function Layout({children}: {children: React.ReactNode}) {
 return <html lang="tr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{var t=JSON.parse(localStorage.getItem('husu:v1:theme')||'null');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}`} }/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/></head><body>{children}</body></html>;
}
