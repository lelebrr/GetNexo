import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    try {
        // Determinar a URL do backend baseado no ambiente
        // Em Docker (produção), usar o nome do serviço interno para evitar problemas de DNS/Tunnel
        const backendUrl = process.env.INTERNAL_API_URL ||
            (import.meta.env.PROD ? 'http://backend:3006/api/users' : 'http://localhost:3006/api/users');

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || ''
            }
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const POST: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    try {
        const body = await request.json();

        // Determinar a URL do backend baseado no ambiente
        const isProduction = import.meta.env.PROD;
        const backendUrl = isProduction
            ? 'https://api.getnexo.com.br/api/users'
            : 'http://localhost:3006/api/users';

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || ''
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};