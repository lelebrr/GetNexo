import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url, cookies }) => {
    let authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        const token = cookies.get('admin_token')?.value;
        if (token) authHeader = `Bearer ${token}`;
    }

    try {
        const backendUrl = process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL.replace(/\/users$/, '')}/settings`
            : (import.meta.env.PROD ? `http://backend:3006/api/settings` : `http://localhost:3006/api/settings`);

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
        console.error('Settings proxy error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const POST: APIRoute = async ({ request, url, cookies }) => {
    let authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        const token = cookies.get('admin_token')?.value;
        if (token) authHeader = `Bearer ${token}`;
    }

    try {
        const body = await request.text();
        const backendUrl = process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL.replace(/\/users$/, '')}/settings`
            : (import.meta.env.PROD ? `http://backend:3006/api/settings` : `http://localhost:3006/api/settings`);

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || ''
            },
            body: body
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Settings proxy POST error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
