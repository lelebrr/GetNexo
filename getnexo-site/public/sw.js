const CACHE_NAME = 'getnexo-admin-v1';
const ASSETS = [
    '/dashboard',
    '/assets/logo.png', // Assuming exists, or generic
    // Add other critical static assets here if known, otherwise rely on runtime caching
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(e => console.log('SW Cache error', e));
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Only cache GET requests and avoid caching API calls dynamically here if not needed
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/')) return; // Don't cache API by default here

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchRes) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // Check valid response
                    if (!fetchRes || fetchRes.status !== 200 || fetchRes.type !== 'basic') {
                        return fetchRes;
                    }
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
