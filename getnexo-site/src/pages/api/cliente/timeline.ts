import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    // Mock timeline data for customer
    const timeline = [
        {
            id: 1,
            type: 'purchase',
            title: 'Compra realizada',
            description: 'Tênis Nike Air Max',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
            icon: 'shopping-bag',
            color: 'green'
        },
        {
            id: 2,
            type: 'ticket',
            title: 'Chamado aberto',
            description: 'Problema com entrega #1234',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            icon: 'ticket',
            color: 'blue'
        },
        {
            id: 3,
            type: 'coupon',
            title: 'Cupom vencendo',
            description: '10% de desconto expira em 3 dias',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            icon: 'coupon',
            color: 'yellow'
        },
        {
            id: 4,
            type: 'points',
            title: 'Pontos ganhos',
            description: '+50 pontos por avaliação',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            icon: 'star',
            color: 'purple'
        },
        {
            id: 5,
            type: 'wishlist',
            title: 'Preço reduzido',
            description: 'Produto na lista de desejos ficou mais barato',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            icon: 'heart',
            color: 'red'
        }
    ];

    // Sort by date descending
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return new Response(JSON.stringify({ timeline }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};