// service-worker.js

const CACHE_NAME = "amazon-pwa-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/images/icon-192.png",
  "/images/icon-512.png"
];

// Instalación del SW y cache inicial
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación: limpia versiones viejas del caché
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Intercepta peticiones: sirve desde caché o red
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
