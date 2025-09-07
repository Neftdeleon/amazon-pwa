const CACHE_NAME = 'neftaleon-cache-v1';
const OFFLINE_URL = '/amazon-pwa/index.html';

const FILES_TO_CACHE = [
  '/amazon-pwa/',
  '/amazon-pwa/index.html',
  '/amazon-pwa/style.css',
  '/amazon-pwa/images/avatar-192.png',
  '/amazon-pwa/images/avatar-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, res.clone());
          return res;
        });
      }).catch(() => {
        return caches.match(OFFLINE_URL);
      });
    })
  );
});
