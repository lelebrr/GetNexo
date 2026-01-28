
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    // In a real implementation, this would fetch from a backend or database
    // For now, we return mock data to allow the frontend to render correctly

    const clients = [
        {
            nome: 'Empresa Demo Ltda',
            dominio: 'demo.com.br',
            plataforma: 'Woocommerce',
            status: 'active',
            receita: 'R$ 1.200,00',
            comissao: 'R$ 360,00',
            data: '15/01/2026'
        },
        {
            nome: 'Loja Exemplo',
            dominio: 'lojaexemplo.com',
            plataforma: 'Shopify',
            status: 'active',
            receita: 'R$ 850,00',
            comissao: 'R$ 255,00',
            data: '10/01/2026'
        },
        {
            nome: 'Teste Revenda',
            dominio: 'teste.net',
            plataforma: 'Nuvemshop',
            status: 'trial',
            receita: 'R$ 0,00',
            comissao: 'R$ 0,00',
            data: '20/01/2026'
        },
        {
            nome: 'Tech Solutions',
            dominio: 'techsolutions.com.br',
            plataforma: 'Woocommerce',
            status: 'active',
            receita: 'R$ 2.500,00',
            comissao: 'R$ 750,00',
            data: '05/01/2026'
        },
        {
            nome: 'Moda Virtual',
            dominio: 'modavirtual.com',
            plataforma: 'Vtex',
            status: 'active',
            receita: 'R$ 3.100,00',
            comissao: 'R$ 930,00',
            data: '02/01/2026'
        }
    ];

    return new Response(JSON.stringify(clients), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const POST: APIRoute = async ({ request }) => {
    // Mock client creation
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.nome || !body.domain || !body.whatsapp) {
            return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            ok: true,
            message: 'Cliente criado com sucesso',
            clientId: Math.random().toString(36).substring(7)
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Erro ao processar requisição' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
