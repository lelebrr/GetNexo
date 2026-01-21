import type { APIRoute } from 'astro';
import { createUser, findUserByEmail, generateToken } from '../../../lib/auth.js';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { email, password, name, whatsapp, cpf_cnpj, website, platform, segment, company } = body;

        // Basic validation
        if (!email || !password || !name || !whatsapp || !cpf_cnpj || !website || !platform || !segment) {
            return new Response(JSON.stringify({ success: false, error: 'Campos obrigatórios ausentes' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if user exists
        const existing = findUserByEmail(email);
        if (existing) {
            return new Response(JSON.stringify({ success: false, error: 'E-mail já cadastrado' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create user
        const user = await createUser({
            email,
            password,
            name,
            whatsapp,
            cpf_cnpj,
            website,
            platform,
            segment,
            company
        });

        const token = generateToken(user);

        return new Response(JSON.stringify({
            success: true,
            user,
            token
        }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
            }
        });

    } catch (e) {
        console.error('Registration API Error:', e);
        return new Response(JSON.stringify({ success: false, error: 'Erro interno no servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
