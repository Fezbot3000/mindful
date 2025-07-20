// Mindful Track Service Worker v1.0.0
// Provides offline functionality and caching for PWA experience

const CACHE_NAME = 'mindful-track-v1';
const STATIC_CACHE = 'mindful-static-v1';
const DYNAMIC_CACHE = 'mindful-dynamic-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/mindful/',
  '/mindful/dashboard',
  '/mindful/journal',
  '/mindful/insights',
  '/mindful/tools',
  '/mindful/settings',
  '/mindful/manifest.json',
  '/mindful/logo.svg',
  // Core CSS and JS will be added dynamically by Next.js
];

// Cache-first strategy for these resource types
const CACHE_FIRST_RESOURCES = [
  /\.(js|css|woff|woff2|ttf|eot)$/,
  /\/icons\//,
  /\/screenshots\//,
  /\/_next\/static\//,
];

// Network-first strategy for these paths
const NETWORK_FIRST_PATHS = [
  /\/api\//,
  /\/_next\/image/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => {
          return new Request(url, { credentials: 'same-origin' });
        }));
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different request types with appropriate strategies
  event.respondWith(handleFetch(request));
});

// Main fetch handler with caching strategies
async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Network-first for API calls and dynamic content
    if (NETWORK_FIRST_PATHS.some(pattern => pattern.test(url.pathname))) {
      return await networkFirst(request);
    }
    
    // Cache-first for static assets
    if (CACHE_FIRST_RESOURCES.some(pattern => pattern.test(url.pathname))) {
      return await cacheFirst(request);
    }
    
    // Stale-while-revalidate for HTML pages
    return await staleWhileRevalidate(request);
    
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    return await handleOffline(request);
  }
}

// Cache-first strategy: check cache first, fallback to network
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }
  
  console.log('[SW] Cache miss, fetching:', request.url);
  const response = await fetch(request);
  
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network-first strategy: try network first, fallback to cache
async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    console.log('[SW] Network first:', request.url);
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, checking cache:', request.url);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// Stale-while-revalidate: return cached version immediately, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Network failed, but we might have cached version
  });
  
  // Return cached version immediately if available
  if (cached) {
    console.log('[SW] Serving cached while revalidating:', request.url);
    return cached;
  }
  
  // If no cached version, wait for network
  console.log('[SW] No cache, waiting for network:', request.url);
  return await networkResponsePromise;
}

// Handle offline scenarios
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // For navigation requests, return cached main page
  if (request.mode === 'navigate') {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedPage = await cache.match('/') || await cache.match('/dashboard');
    
    if (cachedPage) {
      console.log('[SW] Offline: serving cached page');
      return cachedPage;
    }
  }
  
  // For other requests, try to find any cached version
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[SW] Offline: serving cached resource');
    return cached;
  }
  
  // Return offline fallback
  console.log('[SW] Offline: no cached resource available');
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This feature requires an internet connection.',
    }),
    {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Handle service worker messages
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Perform background synchronization
async function doBackgroundSync() {
  console.log('[SW] Performing background sync...');
  
  try {
    // Here you would sync any pending data when connection is restored
    // For now, just clear dynamic cache to refresh data
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Re-fetch critical data
    for (const request of requests) {
      if (request.url.includes('/api/')) {
        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.put(request, response);
          }
        } catch (error) {
          console.log('[SW] Failed to sync:', request.url);
        }
      }
    }
    
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification handling (for future implementation)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'mindful-notification',
    renotify: true,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Mindful Track', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 