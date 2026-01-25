
import { defineMiddleware } from 'astro:middleware';
import crypto from 'node:crypto';

export const onRequest = defineMiddleware(async (context, next) => {
    // Gerar um nonce único para cada requisição
    const nonce = crypto.randomBytes(16).toString('base64');
    context.locals.nonce = nonce;

    // Disponibilizar nonce para os componentes
    context.locals.trustedTypesPolicy = 'getnexo-trusted';

    const response = await next();

    // Configurar CSP dinâmico com o nonce
    // Nota: 'unsafe-eval' mantido por compatibilidade com algumas libs (hotjar, etc) se necessário
    const csp = [
        `default-src 'self'`,
        `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' https: http: *.getnexo.com.br *.cloudflare.com *.googletagmanager.com`,
        `style-src 'self' 'unsafe-inline' https: http:`,
        `img-src 'self' data: blob: https: http:`,
        `font-src 'self' data: https: http:`,
        `connect-src 'self' https: http: wss: ws:`,
        `frame-src 'self' https: http:`,
        `object-src 'none'`,
        `base-uri 'self'`,
        `form-action 'self'`,
        `frame-ancestors 'self'`
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('X-Nonce', nonce); // Debug help

    return response;
});
