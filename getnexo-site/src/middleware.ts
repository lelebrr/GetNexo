
import { defineMiddleware } from 'astro:middleware';
import crypto from 'node:crypto';

export const onRequest = defineMiddleware(async (context, next) => {
    // Gerar um nonce único para cada requisição
    const nonce = crypto.randomBytes(16).toString('base64');
    context.locals.nonce = nonce;

    // Disponibilizar nonce para os componentes
    context.locals.trustedTypesPolicy = 'getnexo-trusted';

    const response = await next();

    // Configurar CSP dinâmico - Modo Permissivo para Debug
    // Removido strict-dynamic para permitir whitelists normais
    const csp = [
        `default-src 'self' *`,
        `script-src 'self' 'unsafe-inline' 'unsafe-eval' * blob: data:`,
        `style-src 'self' 'unsafe-inline' *`,
        `img-src 'self' data: blob: *`,
        `font-src 'self' data: *`,
        `connect-src 'self' *`,
        `frame-src 'self' *`,
        `object-src 'none'`,
        `base-uri 'self'`,
        `form-action 'self'`,
        `frame-ancestors 'self'`
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('X-Nonce', nonce); // Debug help

    return response;
});
