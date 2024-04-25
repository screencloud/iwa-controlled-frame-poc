// @ts-nocheck

/// <reference lib="WebWorker" />

const serviceWorkerSelf = self;

serviceWorkerSelf.skipWaiting();

serviceWorkerSelf.addEventListener('install', () => {
  console.log('Service Worker installing.');
});

serviceWorkerSelf.addEventListener('activate', (e) => {
  console.log('Service Worker activated.');
  e.waitUntil(serviceWorkerSelf.clients.claim()); // Take control immediately for testing
});

// Define maximum cache age (e.g., 24 hours)
const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

serviceWorkerSelf.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  const patterns = [
    { regex: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i, type: 'Font' },
    { regex: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i, type: 'Image' },
    { regex: /\.(?:js)$/i, type: 'JavaScript' },
    { regex: /\.(?:css|less)$/i, type: 'Style' },
  ];

  // Process each pattern to find a match and log the type
  let matched = false;
  for (const pattern of patterns) {
    if (pattern.regex.test(e.request.url)) {
      console.log(`Handling ${pattern.type} request.`);
      matched = true;
      break; // Stop checking after the first match
    }
  }
  // Only handle GET requests
  if (e.request.method !== 'GET' || !matched) return;

  // Clone the request to modify it because Request objects are immutable
  const originalRequest = e.request;
  const modifiedUrl = new URL(originalRequest.url);

  // Modify the URL here. For example, replace 'http://' with 'https://'
  if (modifiedUrl.protocol === 'isolated-app:') {
    modifiedUrl.protocol = 'http:';
  }

  const modifiedRequest = new Request(modifiedUrl, {
    ...originalRequest,
  });

  e.respondWith(
    caches.match(modifiedRequest).then((cachedResponse) => {
      if (cachedResponse) {
        // Check when the cached response was stored
        const storedTime = cachedResponse.headers.get('sw-cache-time');
        const now = new Date().getTime();

        if (storedTime && now - parseInt(storedTime) < maxAge) {
          // Cached response is still valid
          return cachedResponse;
        }
      }

      // Fetch from network and update cache
      return fetch(e.request).then((networkResponse) => {
        // Open the cache
        return caches.open('universal-cache').then((cache) => {
          // Clone the response to save it in the cache
          const responseToCache = networkResponse.clone();

          // Store the current time as a custom header in the cached response
          const headers = new Headers(networkResponse.headers);
          headers.append('sw-cache-time', String(new Date().getTime()));

          // Put the response in the cache
          cache.put(
            modifiedRequest,
            new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: headers,
            })
          );

          return networkResponse;
        });
      });
    })
  );
});

serviceWorkerSelf.addEventListener('message', (event) => {
  if (event.data.action === 'skip_waiting') {
    serviceWorkerSelf.skipWaiting();
  }
});
