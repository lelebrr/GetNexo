import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url, cookies }) => {
    let authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        const token = cookies.get('admin_token')?.value;
        if (token) authHeader = `Bearer ${token}`;
    }

    try {
        const backendUrl = process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL.replace(/\/users$/, '')}/alert`
            : (import.meta.env.PROD ? `http://backend:3006/api/alert` : `http://localhost:3006/api/alert`);

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
        console.error('Alerts proxy error:', error);
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

    const action = url.searchParams.get('action');
    const id = url.searchParams.get('id');

    try {
        let endpoint = 'alert'; // Default

        if (action === 'resolve-all') {
            endpoint = 'alert/resolve-all';
        } else if (action === 'resolve' && id) {
            endpoint = `alert/${id}/resolve`;
        } else {
            return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
        }

        const backendUrl = process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL.replace(/\/users$/, '')}/${endpoint}`
            : (import.meta.env.PROD ? `http://backend:3006/api/${endpoint}` : `http://localhost:3006/api/${endpoint}`);

        const response = await fetch(backendUrl, {
            method: 'POST',
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
        console.error('Alerts proxy action error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
