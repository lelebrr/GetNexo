import { resetPassword } from '../../../lib/auth.js';

export async function post({ request }) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return new Response(JSON.stringify({ error: 'Token e nova senha são obrigatórios' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (newPassword.length < 6) {
            return new Response(JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await resetPassword(token, newPassword);

        if (!result) {
            return new Response(JSON.stringify({ error: 'Token inválido ou expirado' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Erro interno do servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}