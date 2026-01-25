// Middleware de autenticação e segurança para GetNexo
import { verifyToken } from './lib/auth.js';
import logger from './lib/logger.js';
import crypto from 'node:crypto';

// Rate limiting granular por endpoint e tipo de usuário
const rateLimitStore = new Map();

const RATE_LIMITS = {
    // API endpoints
    '/api/graphql': { window: 60 * 1000, max: 500, burst: 100 },
    '/api/stream': { window: 60 * 1000, max: 300, burst: 50 },
    '/api/payments': { window: 60 * 1000, max: 200, burst: 30 },
    '/api/webhooks': { window: 60 * 1000, max: 1000, burst: 200 },
    // Páginas públicas - Muito permissivo para evitar bloqueios falso-positivos
    '/': { window: 60 * 1000, max: 2000, burst: 500 },
    '/pt': { window: 60 * 1000, max: 2000, burst: 500 },
    '/en': { window: 60 * 1000, max: 2000, burst: 500 },
    '/es': { window: 60 * 1000, max: 2000, burst: 500 },
    // Admin endpoints
    '/admin': { window: 60 * 1000, max: 500, burst: 100 },
    // Padrão para outros
    'default': { window: 60 * 1000, max: 1000, burst: 100 }
};

function getClientIP(request) {
    const cfIP = request.headers.get('cf-connecting-ip');
    if (cfIP) return cfIP;

    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    return request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(clientIP, endpoint) {
    const now = Date.now();

    // Encontrar configuração específica ou usar padrão
    const config = RATE_LIMITS[endpoint] ||
        Object.entries(RATE_LIMITS).find(([key]) => endpoint.startsWith(key))?.[1] ||
        RATE_LIMITS.default;

    const windowStart = now - config.window;

    const key = `${clientIP}:${endpoint}`;
    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, { requests: [], burstCount: 0, lastBurstReset: now });
    }

    const data = rateLimitStore.get(key);

    // Cleanup old requests once in a while
    if (data.requests.length > config.max * 2) {
        data.requests = data.requests.filter(time => time > windowStart);
    }

    // Check burst limit (requests in short time - 10s)
    const burstWindow = 10000;
    const recentRequests = data.requests.filter(time => now - time < burstWindow);
    if (recentRequests.length >= config.burst) {
        return { allowed: false, retryAfter: Math.ceil((burstWindow - (now - recentRequests[0])) / 1000) || 1 };
    }

    // Check general limit
    const validRequests = data.requests.filter(time => time > windowStart);
    if (validRequests.length >= config.max) {
        return { allowed: false, retryAfter: Math.ceil((config.window - (now - validRequests[0])) / 1000) || 1 };
    }

    // Add current request
    data.requests.push(now);
    return { allowed: true };
}

export const onRequest = async (context, next) => {
    const startTime = Date.now();
    const url = new URL(context.request.url);
    const endpoint = url.pathname;
    const method = context.request.method;
    const clientIP = getClientIP(context.request);

    // 1. Language Redirection for Root (Only if on root exactly)
    if (endpoint === '/' || endpoint === '') {
        // Redirection logic...
    }

    // Log de request
    logger.info(`Request: ${method} ${endpoint}`, {
        method,
        endpoint,
        clientIP,
        userAgent: context.request.headers.get('user-agent')
    });

    // Ignorar rate limit para assets estáticos
    const isStatic = /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|webp|avif|ico|json|map|glb)$/.test(endpoint);

    if (!isStatic) {
        const result = checkRateLimit(clientIP, endpoint);
        if (!result.allowed) {
            logger.warn(`Rate limit exceeded: ${endpoint}`, {
                clientIP,
                endpoint,
                retryAfter: result.retryAfter
            });
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

    // Generate Nonce for CSP (usado para permitir scripts inline seguros)
    const nonce = crypto.randomBytes(16).toString('base64');
    context.locals.nonce = nonce;

    // Generate Trusted Types policy name (para mitigar XSS baseado em DOM)
    const trustedTypesPolicy = `getnexo-trusted-${crypto.randomBytes(8).toString('hex')}`;
    context.locals.trustedTypesPolicy = trustedTypesPolicy;

    // Detect client_id for white-label
    const clientId = context.request.headers.get('x-client-id') ||
        context.url.searchParams.get('client_id') ||
        context.cookies?.get('client_id') ||
        'default';
    context.locals.clientId = clientId;

    // Check authentication for protected routes
    const requestUrl = new URL(context.request.url);
    const protectedPaths = ['/admin', '/meu-painel', '/revenda'];

    // Allow login endpoints (public)
    const publicAuthPaths = ['/api/login', '/api/auth/google', '/api/auth/github'];
    const isPublicAuth = publicAuthPaths.some(path => requestUrl.pathname.startsWith(path)) ||
        (requestUrl.pathname === '/admin/login' && method === 'GET');

    const isProtected = protectedPaths.some(path => requestUrl.pathname.startsWith(path)) && !isPublicAuth;

    if (isProtected) {
        const authHeader = context.request.headers.get('Authorization');
        const acceptHeader = context.request.headers.get('Accept') || '';

        // If it's a browser navigation (HTML) and no token, redirect to login
        if ((!authHeader || !authHeader.startsWith('Bearer ')) && acceptHeader.includes('text/html')) {
            return context.redirect('/admin/login');
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn(`Authentication failed: Token não fornecido`, {
                endpoint,
                clientIP
            });
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

    // Security Headers (CSP, COOP)
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

    // CSP avançada com proteção contra XSS
    // - Usa nonces para scripts inline seguros
    // - Adiciona strict-dynamic para proteção contra bypass de listas de permissões
    // - Adiciona Trusted Types para mitigar XSS baseado em DOM
    // - Remove 'unsafe-inline' e 'unsafe-eval' sempre que possível
    const csp = [
        // Base policy
        "default-src 'self'",

        // Scripts: usa nonce + strict-dynamic para segurança máxima
        // Permite scripts de terceiros confiáveis (Cloudflare, CDN)
        // unsafe-hashes para permitir event handlers inline (temporário até refatorar)
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-hashes' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://api.getnexo.com.br https://*.getnexo.com.br https://www.googletagmanager.com https://static.cloudflareinsights.com`,

        // Styles: usa apenas unsafe-inline para atributos de estilo legados
        // Nota: se houver nonce, 'unsafe-inline' é ignorado em navegadores modernos. Removendo nonce de style-src.
        `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com`,

        // Images: permite de todas as fontes (necessário para widgets e CDN)
        "img-src * data: blob:",

        // Fonts: apenas fontes confiáveis
        "font-src 'self' https://fonts.gstatic.com",

        // Conexões: restringe para domínios confiáveis
        "connect-src 'self' https://api.getnexo.com.br https://*.getnexo.com.br wss://*.getnexo.com.br",

        // Frames: restringe para domínios confiáveis (removido 'frame-ancestors *' inseguro)
        "frame-ancestors 'self' https://*.getnexo.com.br",

        // Trusted Types: requer Trusted Types para scripts inline
        "require-trusted-types-for 'script'",

        // Trusted Types policy: permite apenas as políticas específicas do app
        `trusted-types getnexo-trusted getnexo-api-data`,

        // Object: desabilita objetos embutidos (proteção contra XSS)
        "object-src 'none'",

        // Base URI: previne ataques de base URI
        "base-uri 'self'",

        // Form Action: restringe envios de formulário
        "form-action 'self'",

        // Upgrade insecure requests: força HTTPS
        "upgrade-insecure-requests"
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);

    return response;
};
