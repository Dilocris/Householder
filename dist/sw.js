const VERSION = 'casa-pwa-v1';
const BASE = new URL('./', self.registration.scope);
const CACHE_ASSETS = [
  new URL('./', BASE).toString(),
  new URL('./index.html', BASE).toString(),
  new URL('./app.js?v=13', BASE).toString(),
  new URL('./style.css?v=13', BASE).toString(),
  new URL('./manifest.webmanifest', BASE).toString(),
  new URL('./icon-192.png', BASE).toString(),
  new URL('./icon-512.png', BASE).toString()
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CACHE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) caches.open(VERSION).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => request.mode === 'navigate' ? caches.match(new URL('./index.html', BASE).toString()) : Response.error()))
  );
});