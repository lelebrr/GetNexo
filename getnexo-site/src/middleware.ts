
import { defineMiddleware } from 'astro:middleware';
import crypto from 'node:crypto';

export const onRequest = defineMiddleware(async (context, next) => {
    // Gerar um nonce único para cada requisição
    const nonce = crypto.randomBytes(16).toString('base64');
    context.locals.nonce = nonce;

    // Disponibilizar nonce para os componentes
    context.locals.trustedTypesPolicy = 'getnexo-trusted';

    // 🔒 Auth Protection for /admin
    // 🔒 Auth Protection for /admin (DISABLED TEMPORARILY)
    /*
    if (context.url.pathname.startsWith('/admin') && !context.url.pathname.startsWith('/admin/login')) {
        const token = context.cookies.get('admin_token')?.value;
        if (!token) {
            return context.redirect('/admin/login', 302);
        }
    }
    */

    const response = await next();

    // Configurar CSP dinâmico - Strict Mode com Nonce
    // 'strict-dynamic' permite scripts com nonce correto carregar dependências
    const csp = [
        "default-src 'self' https: http: data: blob:",
        `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'strict-dynamic' https: http: 'unsafe-inline' *.cloudflare.com static.cloudflareinsights.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://api.getnexo.com.br https://*.getnexo.com.br https://www.googletagmanager.com https://cdn.skypack.dev https://openrouter.ai https://fonts.googleapis.com`,
        "style-src 'self' 'unsafe-inline' https: http: https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com",
        "img-src 'self' data: blob: https: http: https://*.getnexo.com.br https://i.pravatar.cc https://*.pravatar.cc",
        "font-src 'self' data: https: http: https://fonts.gstatic.com",
        "connect-src 'self' https: http: ws: wss:",
        "frame-src 'self' https: http:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        "require-trusted-types-for 'script'",
        "trusted-types getnexo-trusted default"
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('X-Nonce', nonce);

    // 🛡️ Enhanced Security Headers for PageSpeed & Security
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
});
