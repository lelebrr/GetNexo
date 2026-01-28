import type { APIRoute } from 'astro';

const handler: APIRoute = async ({ request, params }) => {
    // Construct target URL
    const url = new URL(request.url);
    const path = params.all || '';
    const query = url.search;

    // Determinar a URL do backend baseado no ambiente
    // Removemos o prefixo 'api/' se ele já estiver vindo na rota (ex: /api-proxy/api/...)
    // A rota capturada por params.all será 'api/analytics/dashboard' se a URL for /api-proxy/api/analytics/dashboard

    const isProduction = import.meta.env.PROD;
    const backendUrl = isProduction
        ? `https://api.getnexo.com.br/${path}${query}`
        : `http://localhost:3006/${path}${query}`;

    // console.log(`[Proxy-Legacy] Forwarding ${request.method} ${url.pathname} to ${backendUrl}`);

    try {
        const headers = new Headers(request.headers);
        headers.delete('host');

        const fetchOptions: RequestInit = {
            method: request.method,
            headers: headers,
        };

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            const bodyBuffer = await request.arrayBuffer();
            fetchOptions.body = bodyBuffer;
        }

        const response = await fetch(backendUrl, fetchOptions);

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });

    } catch (error) {
        console.error('[Proxy-Legacy] Error:', error);
        return new Response(JSON.stringify({
            error: 'Proxy Error (Legacy Path)',
            details: error instanceof Error ? error.message : String(error),
            target: backendUrl
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const all = handler;
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
