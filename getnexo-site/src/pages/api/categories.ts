import type { APIRoute } from 'astro';

// Mock data for categories - replace with real database
const categories = [
    { id: 1, name: 'E-commerce', slug: 'ecommerce', icon: '🛍️' },
    { id: 2, name: 'Chatbots', slug: 'chatbots', icon: '🤖' },
    { id: 3, name: 'Marketing', slug: 'marketing', icon: '📢' },
    { id: 4, name: 'Vendas', slug: 'vendas', icon: '💼' },
    { id: 5, name: 'Automação', slug: 'automacao', icon: '⚙️' },
    { id: 6, name: 'Analytics', slug: 'analytics', icon: '📊' },
    { id: 7, name: 'Segurança', slug: 'seguranca', icon: '🔒' },
    { id: 8, name: 'Integrações', slug: 'integracoes', icon: '🔗' }
];

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify(categories), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
        }
    });
};