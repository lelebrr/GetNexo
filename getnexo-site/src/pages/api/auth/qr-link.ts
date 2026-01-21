import type { APIRoute } from 'astro';
import { verifyMagicLink } from '../../../lib/auth.js';

export const GET: APIRoute = async ({ url }) => {
    const token = url.searchParams.get('token');

    if (!token) {
        return new Response(JSON.stringify({ error: 'Token inválido' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Redirect to login page with token
    const baseUrl = process.env.BASE_URL || 'http://localhost:4321';
    return Response.redirect(`${baseUrl}/cliente/login?token=${token}`);
};