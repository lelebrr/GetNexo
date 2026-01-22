import { generatePasswordResetLink } from '../../../lib/auth.js';

export async function post({ request }) {
    try {
        const { email } = await request.json();

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email é obrigatório' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await generatePasswordResetLink(email);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Erro interno do servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}