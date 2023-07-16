// service-worker.js

// Define the cache name and the files to be cached
const cacheName = 'TTOTravel';
const cacheFiles = [
//   '/',
//   '/index.html',
  '/icons/512.png'
];

// Install event - cache the static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(cacheFiles))
      .then(() => self.skipWaiting())
  );
});

// Fetch event - serve cached files when offline, otherwise fetch from the network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the file is found in the cache, return it
        if (response) {
          return response;
        }

        // Otherwise, fetch the file from the network
        return fetch(event.request)
          .then(response => {
            // If the response is valid, clone it and store it in the cache
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();

              caches.open(cacheName)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // If fetching fails and the file is not found in the cache, return a fallback response
            return new Response('Offline Page', {
              headers: { 'Content-Type': 'text/html' }
            });
          });
      })
  );
});
