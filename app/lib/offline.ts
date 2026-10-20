export async function prepareOffline(){
 if(!('serviceWorker' in navigator)||location.hostname==='127.0.0.1'||location.hostname==='localhost')return;
 try{const registration=await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;const urls=['/',location.pathname,...performance.getEntriesByType('resource').map(r=>r.name).filter(url=>/\.(js|css|woff2?|svg)(\?|$)/.test(url))];(registration.active||registration.waiting)?.postMessage({type:'CACHE_SHELL',urls});}catch{}
}
