import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        // Determinar a URL do backend baseado no ambiente
        // Em Docker (produção), usar o nome do serviço interno para evitar problemas de DNS/Tunnel
        const backendUrl = process.env.INTERNAL_API_URL ||
            (import.meta.env.PROD ? 'http://backend:3006/api/login' : 'http://localhost:3006/api/login');

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};