import './api-shim';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/noto-naskh-arabic/400.css';
import '@fontsource/noto-naskh-arabic/500.css';
import '@fontsource/noto-naskh-arabic/600.css';
import '@/app/globals.css';
import './native.css';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Home from '@/app/home';
import HusuApp from '@/app/husu-app';
import { setupNative } from './native';

// Two screens, same paths as the web app: "/" (home) and "/oku" (reading).
const routeOf = () => (window.location.pathname.replace(/\/+$/, '').endsWith('/oku') ? 'oku' : 'home');

function App() {
  const [route, setRoute] = useState(routeOf);
  useEffect(() => {
    const onPop = () => setRoute(routeOf());
    // Turn the web app's plain <a href="/"> / <a href="/oku"> links into SPA navigation.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a');
      const href = anchor?.getAttribute('href');
      if (!anchor || anchor.target || (href !== '/' && href !== '/oku')) return;
      event.preventDefault();
      if (window.location.pathname !== href) window.history.pushState(null, '', href);
      setRoute(routeOf());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('popstate', onPop); document.removeEventListener('click', onClick); };
  }, []);
  return route === 'oku' ? <HusuApp key="oku" /> : <Home key="home" />;
}

setupNative();
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
