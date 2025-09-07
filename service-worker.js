const CACHE_NAME = 'neftaleon-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  // Añade aquí todas las rutas y recursos que necesites para que la app funcione offline.
  // Si tienes otras páginas o assets, inclúyelos.
  // Por ejemplo: '/about.html', '/images/logo.png', etc.
  '/images/perfil.jpg',
  '/images/icon-192.png', // Asegúrate que los nombres coincidan con el manifest.json
  '/images/icon-512.png'
];

self.addEventListener('install', evt => {
  // Almacena en caché los archivos necesarios para que la app funcione offline.
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Archivos cacheados exitosamente');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Asegura que el nuevo service worker tome el control inmediatamente.
});

self.addEventListener('activate', evt => {
  // Elimina cachés antiguas para evitar conflictos.
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('Caché antigua eliminada:', key);
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim(); // Asegura que este service worker controle todas las ventanas/clientes.
});

self.addEventListener('fetch', evt => {
  // Si la solicitud es GET, intenta servir desde la caché primero, luego desde la red.
  if (evt.request.method !== 'GET') {
    return; // No cacheados otros métodos (POST, etc.)
  }

  evt.respondWith(
    caches.match(evt.request).then(cachedResponse => {
      // Si la respuesta está en la caché, la devuelve.
      if (cachedResponse) {
        return cachedResponse;
      }
      // Si no, la busca en la red.
      return fetch(evt.request).then(networkResponse => {
        // Si la respuesta de la red es válida, la cachea para futuras solicitudes.
        // Es buena práctica cachear solo las respuestas OK (status 200).
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(evt.request, networkResponse.clone());
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Si falla la caché y la red (ej: offline total), podrías servir una página offline.
      // Para este caso, como la página principal sí carga, no es un problema inmediato.
      // Si tuvieras una página 'offline.html', podrías devolverla aquí.
      console.warn('Solicitud fallida (caché y red):', evt.request.url);
      // return caches.match('/offline.html'); // Descomenta si creas una página offline
    })
  );
});
