// Service Worker for Holidaysri PWA
// IMPORTANT: Change this version number when deploying updates to force cache refresh
const CACHE_VERSION = 'v2';
const CACHE_NAME = `holidaysri-${CACHE_VERSION}`;
// Separate cache for images - this persists across app updates for faster loading
const IMAGE_CACHE_NAME = 'holidaysri-images-v1';

// Static assets to pre-cache (only truly static files)
const STATIC_ASSETS = [
  '/logo.png',
  '/manifest.json'
];

// Trusted image CDN domains that we should cache
const TRUSTED_IMAGE_DOMAINS = [
  'res.cloudinary.com',
  'cloudinary.com',
  'images.unsplash.com',
  'imgur.com',
  'i.imgur.com'
];

// Check if URL is an image request
const isImageRequest = (url) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp', '.avif'];
  const pathname = url.pathname.toLowerCase();
  return imageExtensions.some(ext => pathname.includes(ext)) ||
         url.href.includes('/image/upload/') || // Cloudinary
         url.href.includes('images.unsplash.com');
};

// Check if URL is from a trusted image CDN
const isTrustedImageDomain = (url) => {
  return TRUSTED_IMAGE_DOMAINS.some(domain => url.hostname.includes(domain));
};

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

// Activate event - clean up old APP caches but KEEP image cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Keep the image cache - only delete old app caches
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
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

// Fetch event - Different strategies for different content types
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests - always fetch from network
  if (url.pathname.startsWith('/api')) {
    return;
  }

  // Handle IMAGE requests - Cache First (for fast loading)
  // This applies to both local and external CDN images
  if (isImageRequest(url) || request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached image immediately
            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(request).then((networkResponse) => {
            // Cache the image for future use
            // Clone before caching since response can only be used once
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              cache.put(request, responseToCache);
            }
            return networkResponse;
          }).catch((error) => {
            console.log('[SW] Image fetch failed:', url.href);
            // Return a placeholder or just fail gracefully
            return new Response('', { status: 404, statusText: 'Image not found' });
          });
        });
      })
    );
    return;
  }

  // Handle external URLs (non-image) - skip caching
  if (url.origin !== location.origin) {
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

  // For other static assets (fonts, etc.) - use Cache First with network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      });
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

