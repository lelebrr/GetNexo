import { verifyToken } from './lib/auth';
import logger from './lib/logger.js';
import { metricsMiddleware, incrementError } from './lib/metrics.js';

// Rate limiting granular por endpoint e tipo de usuário
const rateLimitStore = new Map();

const RATE_LIMITS = {
    // API endpoints
    '/api/graphql': { window: 60 * 1000, max: 50, burst: 10 },
    '/api/stream': { window: 60 * 1000, max: 30, burst: 5 },
    '/api/payments': { window: 60 * 1000, max: 20, burst: 3 },
    '/api/webhooks': { window: 60 * 1000, max: 100, burst: 20 },
    // Páginas públicas
    '/': { window: 60 * 1000, max: 500, burst: 50 },
    // Admin endpoints (mais restritivo)
    '/admin': { window: 60 * 1000, max: 100, burst: 10 },
    // Padrão para outros
    'default': { window: 60 * 1000, max: 200, burst: 30 }
};

function checkRateLimit(clientIP, endpoint) {
    const now = Date.now();

    // Encontrar configuração específica ou usar padrão
    const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
    const windowStart = now - config.window;

    const key = `${clientIP}:${endpoint}`;
    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, { requests: [], burstCount: 0, lastBurstReset: now });
    }

    const data = rateLimitStore.get(key);
    const { requests, burstCount, lastBurstReset } = data;

    // Reset burst counter se necessário
    if (now - lastBurstReset > config.window) {
        data.burstCount = 0;
        data.lastBurstReset = now;
    }

    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);

    // Check burst limit (requests in short time)
    const recentRequests = validRequests.filter(time => now - time < 10000); // 10s burst window
    if (recentRequests.length >= config.burst) {
        return { allowed: false, retryAfter: Math.ceil((config.window - (now - windowStart)) / 1000) };
    }

    // Check general limit
    if (validRequests.length >= config.max) {
        return { allowed: false, retryAfter: Math.ceil((config.window - (now - windowStart)) / 1000) };
    }

    // Add current request
    validRequests.push(now);
    data.requests = validRequests;
    data.burstCount++;

    return { allowed: true };
}

export const onRequest = async (context, next) => {
    const startTime = Date.now();
    const url = new URL(context.request.url);
    const endpoint = url.pathname;
    const method = context.request.method;
    const clientIP = context.request.headers.get('x-forwarded-for') ||
        context.request.headers.get('x-real-ip') || 'unknown';

    // Log de request
    logger.info(`Request: ${method} ${endpoint}`, {
        method,
        endpoint,
        clientIP,
        userAgent: context.request.headers.get('user-agent')
    });

    // Verificar se endpoint tem rate limiting configurado
    const hasRateLimit = Object.keys(RATE_LIMITS).some(key => endpoint.startsWith(key)) || RATE_LIMITS.default;

    if (hasRateLimit) {
        const clientIP = context.request.headers.get('x-forwarded-for') ||
            context.request.headers.get('x-real-ip') ||
            'unknown';

        const result = checkRateLimit(clientIP, endpoint);
        if (!result.allowed) {
            logger.warn(`Rate limit exceeded: ${endpoint}`, {
                clientIP,
                endpoint,
                retryAfter: result.retryAfter
            });
            incrementError('rate_limit', endpoint);
            return new Response(JSON.stringify({
                error: 'Rate limit exceeded',
                retryAfter: result.retryAfter,
                endpoint: endpoint
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': result.retryAfter.toString(),
                    'X-RateLimit-Reset': (Date.now() + result.retryAfter * 1000).toString()
                }
            });
        }
    }

    // Generate Nonce for CSP
    const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');
    context.locals.nonce = nonce;

    // Check authentication for protected routes
    const requestUrl = new URL(context.request.url);
    const protectedPaths = ['/admin', '/meu-painel', '/revenda'];
    const isProtected = protectedPaths.some(path => requestUrl.pathname.startsWith(path));

    if (isProtected) {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn(`Authentication failed: Token não fornecido`, {
                endpoint,
                clientIP
            });
            incrementError('auth_missing_token', endpoint);
            return new Response(JSON.stringify({ error: 'Token não fornecido' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const token = authHeader.slice(7);
        const decoded = verifyToken(token);
        if (!decoded) {
            logger.warn(`Authentication failed: Token inválido`, {
                endpoint,
                clientIP
            });
            incrementError('auth_invalid_token', endpoint);
            return new Response(JSON.stringify({ error: 'Token inválido' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        context.locals.user = decoded; // Make user available in pages
    }

    const response = await next();

    // Log response com performance
    const duration = Date.now() - startTime;
    const status = response.status;
    logger.info(`Response: ${status} in ${duration}ms`, {
        method,
        endpoint,
        status,
        duration,
        clientIP
    });

    if (duration > 2000) {
        logger.performance('Slow response detected', {
            method,
            endpoint,
            duration,
            status
        });
    }

    // Allow Iframes (Widget)
    response.headers.delete('X-Frame-Options'); // Remove blocking header
    response.headers.set('Content-Security-Policy', "frame-ancestors *"); // Allow all

    // Cache Control for Admin Panel (1 hour)
    const currentUrl = new URL(context.request.url);
    if (currentUrl.pathname.startsWith('/dashboard')) {
        response.headers.set('Cache-Control', 'public, max-age=3600');
    }

    // Compressão avançada para assets estáticos
    if (currentUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|webp|avif)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        response.headers.set('Vary', 'Accept-Encoding');
        // Brotli e gzip são suportados automaticamente pelo servidor
    }

    // CORS (for font loading or api calls)
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Security Headers (HSTS, CSP, COOP)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

    // Hardened CSP
    // - uses 'strict-dynamic' with nonce for modern browsers
    // - uses 'require-trusted-types-for' for DOM XSS mitigation
    const csp = [
        "default-src 'self'",
        `script-src 'strict-dynamic' 'nonce-${nonce}' 'unsafe-inline' http: https:; object-src 'none'; base-uri 'none';`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src * data:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src *",
        "frame-ancestors *",
        "require-trusted-types-for 'script'"
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);

    return response;
};
