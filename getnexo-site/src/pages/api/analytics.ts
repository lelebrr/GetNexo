import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url, cookies }) => {
    let authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        const token = cookies.get('admin_token')?.value;
        if (token) authHeader = `Bearer ${token}`;
    }

    const type = url.searchParams.get('type') || '';
    const queryParams = url.searchParams.toString();

    try {
        let endpoint = 'analytics';
        // Map frontend types to backend endpoints
        if (type === 'clustering') endpoint = 'analytics/clustering';
        else if (type === 'trends') endpoint = 'analytics/trends';
        else if (type === 'prediction') endpoint = 'analytics/prediction';
        else if (type === 'dashboard') endpoint = 'analytics/dashboard-stats';
        else if (type === 'recent-sales') endpoint = 'analytics/recent-sales';
        else if (type === 'export-sales') endpoint = 'analytics/export-sales';
        else if (type === 'active-chats') endpoint = 'analytics/active-chats';
        else if (type === 'top-products') endpoint = 'analytics/top-products';
        else endpoint = 'analytics/dashboard-stats'; // Default fallback

        const backendUrl = process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL.replace(/\/users$/, '')}/${endpoint}?${queryParams}`
            : (import.meta.env.PROD ? `http://backend:3006/api/${endpoint}?${queryParams}` : `http://localhost:3006/api/${endpoint}?${queryParams}`);

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
