const CACHE_NAME = 'neftaleon-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './images/perfil.jpg',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Precaching assets.');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('Removing old cache.', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  if (evt.request.method !== 'GET') return;

  // Manejar navegación
  if (evt.request.mode === 'navigate') {
    evt.respondWith(
      caches.match('./index.html').then(response => {
        return response || fetch(evt.request);
      })
    );
    return;
  }

  // Cache-first
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});
