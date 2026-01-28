
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    // Mock data for reseller dashboard

    const dashboardData = {
        totalRevenue: 15420,
        monthlyCommission: 3240,
        activeClients: 18,
        pendingCommissions: 1200,
        commissionProgress: 68,
        commissions: [1200, 1900, 1500, 2500, 2200, 3100, 2800, 3500, 2900, 3800, 3200, 4100],
        clientsGrowth: {
            active: [5, 8, 12, 15, 18, 22],
            inactive: [2, 3, 4, 3, 5, 4]
        },
        recentClients: [
            {
                id: '1',
                name: 'Empresa Demo Ltda',
                email: 'contato@demo.com.br',
                plan: 'Professional',
                commission: 360,
                date: '15 Jan 2026',
                avatar: ''
            },
            {
                id: '2',
                name: 'Loja Exemplo',
                email: 'admin@lojaexemplo.com',
                plan: 'Starter',
                commission: 255,
                date: '10 Jan 2026',
                avatar: ''
            },
            {
                id: '4',
                name: 'Tech Solutions',
                email: 'suporte@techsolutions.com.br',
                plan: 'Enterprise',
                commission: 750,
                date: '05 Jan 2026',
                avatar: ''
            }
        ]
    };

    return new Response(JSON.stringify(dashboardData), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
