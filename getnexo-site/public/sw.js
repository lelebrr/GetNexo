const CACHE_NAMES = {
    static: 'getnexo-static-v2',
    images: 'getnexo-images-v2',
    fonts: 'getnexo-fonts-v2',
    api: 'getnexo-api-v2',
    neural: 'getnexo-neural-v2'
};

// Estratégias de cache CDN-like
const CACHE_STRATEGIES = {
    // Cache-first para assets estáticos (como CDN)
    cacheFirst: async (request, cacheName) => {
        const cached = await caches.match(request);
        if (cached) return cached;

        try {
            const response = await fetch(request);
            if (response.ok) {
                const cache = await caches.open(cacheName);
                cache.put(request, response.clone());
            }
            return response;
        } catch (error) {
            console.warn('Cache-first strategy failed:', error);
            return new Response('Offline', { status: 503 });
        }
    },

    // Network-first para conteúdo dinâmico
    networkFirst: async (request, cacheName) => {
        try {
            const response = await fetch(request);
            if (response.ok) {
                const cache = await caches.open(cacheName);
                cache.put(request, response.clone());
            }
            return response;
        } catch (error) {
            const cached = await caches.match(request);
            return cached || new Response('Offline', { status: 503 });
        }
    },

    // Stale-while-revalidate para assets não críticos
    staleWhileRevalidate: async (request, cacheName) => {
        const cached = await caches.match(request);
        const fetchPromise = fetch(request).then(async (response) => {
            if (response.ok) {
                const cache = await caches.open(cacheName);
                cache.put(request, response.clone());
            }
            return response;
        });

        return cached || fetchPromise;
    }
};

const CRITICAL_ASSETS = [
    '/',
    '/favicon.svg',
    '/scripts/performance/neural-bg.js',
    '/scripts/performance/ui-features.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAMES.static).then(cache => cache.addAll(CRITICAL_ASSETS)),
            caches.open(CACHE_NAMES.fonts)
        ]).catch(e => console.log('SW Install error:', e))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!Object.values(CACHE_NAMES).includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (!url.protocol.startsWith('http')) return;

    // Estratégia baseada no tipo de recurso
    if (url.pathname.match(/\.(js|css)$/)) {
        event.respondWith(CACHE_STRATEGIES.cacheFirst(request, CACHE_NAMES.static));
    } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/)) {
        event.respondWith(CACHE_STRATEGIES.cacheFirst(request, CACHE_NAMES.images));
    } else if (url.pathname.match(/\.(woff|woff2|ttf)$/)) {
        event.respondWith(CACHE_STRATEGIES.cacheFirst(request, CACHE_NAMES.fonts));
    } else if (url.pathname.includes('/api/') && !url.pathname.includes('/stream/')) {
        // Cache API responses por 5 minutos (stale-while-revalidate)
        event.respondWith(CACHE_STRATEGIES.staleWhileRevalidate(request, CACHE_NAMES.api));
    } else if (url.pathname.includes('/neural') || url.pathname.includes('neural-bg')) {
        event.respondWith(CACHE_STRATEGIES.cacheFirst(request, CACHE_NAMES.neural));
    } else {
        // Páginas: network-first
        event.respondWith(CACHE_STRATEGIES.networkFirst(request, CACHE_NAMES.static));
    }
});

// Cache inteligente para animações neurais
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_NEURAL_CONFIG') {
        caches.open(CACHE_NAMES.neural).then(cache => {
            const configResponse = new Response(JSON.stringify(event.data.config), {
                headers: { 'Content-Type': 'application/json' }
            });
            cache.put('/neural-config', configResponse);
        });
    }

    if (event.data && event.data.type === 'CLEAR_NEURAL_CACHE') {
        caches.delete(CACHE_NAMES.neural);
    }
});

// Limpeza periódica de cache antigo
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(cleanOldCache());
    }
});

async function cleanOldCache() {
    const maxAge = 24 * 60 * 60 * 1000; // 24h
    const now = Date.now();

    for (const cacheName of Object.values(CACHE_NAMES)) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();

        for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
                const date = response.headers.get('date');
                if (date && (now - new Date(date).getTime()) > maxAge) {
                    cache.delete(request);
                }
            }
        }
    }
}

// Push Notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nova notificação do GetNexo',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver mais',
                icon: '/favicon.svg'
            },
            {
                action: 'close',
                title: 'Fechar'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('GetNexo', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
