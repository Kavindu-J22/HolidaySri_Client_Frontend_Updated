// Service Worker for Holidaysri PWA
// IMPORTANT: Change this version number when deploying updates to force cache refresh
const CACHE_VERSION = 'v2';
const CACHE_NAME = `holidaysri-${CACHE_VERSION}`;

// Static assets to pre-cache (only truly static files)
const STATIC_ASSETS = [
  '/logo.png',
  '/manifest.json'
];

// Install event - cache essential static files only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Installing new version:', CACHE_VERSION);
        return cache.addAll(STATIC_ASSETS);
      })
  );
  // Force the waiting service worker to become active immediately
  self.skipWaiting();
});

// Activate event - clean up ALL old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all caches that don't match current version
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activated new version:', CACHE_VERSION);
      // Take control of all pages immediately
      return self.clients.claim();
    }).then(() => {
      // Notify all clients about the update
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
});

// Fetch event - Network First strategy for HTML/navigation, Cache First for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests and external URLs - always fetch from network
  if (url.pathname.startsWith('/api') || url.origin !== location.origin) {
    return;
  }

  // For navigation requests (HTML pages) - use Network First strategy
  if (request.mode === 'navigate' || request.destination === 'document' ||
      url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Return network response directly, don't cache HTML
          return response;
        })
        .catch(() => {
          // Only use cache as fallback when offline
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline page if available, or just the cached index
            return caches.match('/');
          });
        })
    );
    return;
  }

  // For JS and CSS files - use Network First with cache fallback
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the new response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache when offline
          return caches.match(request);
        })
    );
    return;
  }

  // For static assets (images, fonts, etc.) - use Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Fetch from network in background to update cache
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      // Return cached response immediately, or wait for network
      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update from Holidaysri',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Holidaysri', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

