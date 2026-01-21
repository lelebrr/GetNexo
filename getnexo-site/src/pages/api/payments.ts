import type { APIRoute } from 'astro';
import { StripeConnector } from '../../lib/connectors/stripe';
import { verifyToken } from '../../lib/auth';

const stripe = new StripeConnector();

export const POST: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Token não fornecido' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
        return new Response(JSON.stringify({ error: 'Token inválido' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { amount, currency } = await request.json();
    if (!amount) {
        return new Response(JSON.stringify({ error: 'Valor é obrigatório' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const paymentIntent = await stripe.createPaymentIntent(amount, currency || 'brl');

        return new Response(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao processar pagamento' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};