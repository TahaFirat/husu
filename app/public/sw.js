const CACHE='husu-shell-v9';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{
 if(event.data?.type==='CACHE_SHELL')event.waitUntil(caches.open(CACHE).then(async cache=>{
  const urls=event.data.urls.filter(url=>{const u=new URL(url,self.location.origin);return u.origin===self.location.origin&&!u.pathname.startsWith('/api/')&&!u.pathname.startsWith('/signin');});
  await Promise.allSettled(urls.map(url=>cache.add(url)));
 }));
});
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/')||u.pathname.startsWith('/signin')||u.pathname.startsWith('/signout')||u.pathname.startsWith('/callback'))return;
 if(event.request.mode==='navigate')event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(u.pathname).then(hit=>hit||caches.match('/'))));
 else if(/\.(js|css|woff2?|svg)$/.test(u.pathname))event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;})));
});
