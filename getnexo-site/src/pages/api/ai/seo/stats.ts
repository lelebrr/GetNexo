import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, cookies }) => {
    let authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        const token = cookies.get('admin_token')?.value;
        if (token) authHeader = `Bearer ${token}`;
    }

    try {
        const backendUrl = process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL.replace(/\/users$/, '')}/ai/seo/stats`
            : (import.meta.env.PROD ? `http://backend:3006/api/ai/seo/stats` : `http://localhost:3006/api/ai/seo/stats`);

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
