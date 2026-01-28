import type { APIRoute } from 'astro';

export const PUT: APIRoute = async ({ request, params }) => {
    const { id } = params;
    const authHeader = request.headers.get('Authorization');

    try {
        const body = await request.json();

        const backendUrl = process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL.replace(/\/users$/, '')}/products/${id}`
            : (import.meta.env.PROD ? `http://backend:3006/api/products/${id}` : `http://localhost:3006/api/products/${id}`);

        const response = await fetch(backendUrl, {
            method: 'PUT',
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

export const DELETE: APIRoute = async ({ request, params }) => {
    const { id } = params;
    const authHeader = request.headers.get('Authorization');

    try {
        const backendUrl = process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL.replace(/\/users$/, '')}/products/${id}`
            : (import.meta.env.PROD ? `http://backend:3006/api/products/${id}` : `http://localhost:3006/api/products/${id}`);

        const response = await fetch(backendUrl, {
            method: 'DELETE',
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
