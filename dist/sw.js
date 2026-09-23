const VERSION = 'casa-householder-__BUILD_ID__';
const BASE = new URL('./', self.registration.scope);
const ASSETS = ['./','./index.html','./app.js?v=15','./style.css?v=15','./cloud.js','./google-calendar.js','./pwa-register.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'].map(path=>new URL(path,BASE).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if((key.startsWith('casa-householder-')||key==='casa-pwa-v1')&&key!==VERSION)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   // Keep HTML and scripts from the same installed release. Updates require user action.
   const cached=await (await caches.open(VERSION)).match(new URL('./index.html',BASE).href);
   return cached||fetch(request);
  })());return;
 }
 if(!ASSETS.includes(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(VERSION);return await cache.match(request)||fetch(request)})());
});