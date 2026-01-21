import type { APIRoute } from 'astro';
import { sendWhatsAppMagicLink } from '../../../lib/auth.js';

export const POST: APIRoute = async ({ request }) => {
    const { phone } = await request.json();

    if (!phone) {
        return new Response(JSON.stringify({ error: 'Telefone é obrigatório' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const result = await sendWhatsAppMagicLink(phone);
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao enviar link WhatsApp' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

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