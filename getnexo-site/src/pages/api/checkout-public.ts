import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { cart, userData } = await request.json();

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return new Response(JSON.stringify({ error: 'Carrinho vazio' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Calcular total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Gerar PIX mock (em produção, integrar com serviço real de pagamento)
        const pixData = {
            qr_code: `00020126580014BR.GOV.BCB.PIX2561${Math.random().toString(36).substring(2, 15)}52040000530398654065402.005802BR59${Math.random().toString(36).substring(2, 11)}6009SAOPAULO62070503***6304A1`,
            qr_code_base64: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
            expiration_minutes: 30,
            transaction_id: `pix_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        };

        // Simular processamento do pedido
        const order = {
            id: `order_${Date.now()}`,
            total,
            items: cart,
            status: 'pending',
            pix: pixData,
            created_at: new Date().toISOString()
        };

        // Em produção, salvar no banco de dados aqui
        console.log('Pedido criado:', order);

        return new Response(JSON.stringify({
            success: true,
            order,
            pix: pixData
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Erro no checkout:', error);
        return new Response(JSON.stringify({ error: 'Erro ao processar pedido' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};