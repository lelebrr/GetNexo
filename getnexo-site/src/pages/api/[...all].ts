import type { APIRoute } from 'astro';

const handler: APIRoute = async ({ request, params }) => {
    // Construct target URL
    const url = new URL(request.url);
    const path = params.all || '';
    const query = url.search;

    // Determinar a URL do backend baseado no ambiente
    const isProduction = import.meta.env.PROD;
    const backendUrl = isProduction
        ? `https://api.getnexo.com.br/api/${path}${query}`
        : `http://localhost:3006/api/${path}${query}`;

    // console.log(`[Proxy] Forwarding ${request.method} ${url.pathname} to ${backendUrl}`);

    try {
        const headers = new Headers(request.headers);
        // Remove host header to avoid confusion at backend
        headers.delete('host');

        const fetchOptions: RequestInit = {
            method: request.method,
            headers: headers,
        };

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            // Forward body
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
        console.error('[Proxy] Error:', error);
        return new Response(JSON.stringify({
            error: 'Proxy Error',
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
