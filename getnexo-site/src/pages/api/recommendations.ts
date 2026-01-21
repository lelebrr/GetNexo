import type { APIRoute } from 'astro';
import { verifyToken } from '../../lib/auth';

// Dados simulados para recomendações
const mockData = {
    popular: [
        { id: 1, title: 'Produto Popular 1', category: 'eletronicos', rating: 4.5, image: '/uploads/sample1.jpg' },
        { id: 2, title: 'Produto Popular 2', category: 'roupas', rating: 4.2, image: '/uploads/sample2.jpg' },
        { id: 3, title: 'Produto Popular 3', category: 'livros', rating: 4.8, image: '/uploads/sample3.jpg' },
    ],
    similar: [
        { id: 4, title: 'Similar 1', category: 'eletronicos', rating: 4.1, image: '/uploads/sample4.jpg' },
        { id: 5, title: 'Similar 2', category: 'eletronicos', rating: 4.3, image: '/uploads/sample5.jpg' },
    ],
    trending: [
        { id: 6, title: 'Tendência 1', category: 'beleza', rating: 4.6, image: '/uploads/sample6.jpg' },
        { id: 7, title: 'Tendência 2', category: 'casa', rating: 4.4, image: '/uploads/sample7.jpg' },
    ]
};

export const GET: APIRoute = async ({ request, url }) => {
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

    const type = url.searchParams.get('type') || 'popular'; // popular, similar, trending
    const category = url.searchParams.get('category'); // opcional filtro por categoria
    const limit = parseInt(url.searchParams.get('limit') || '6');

    try {
        let recommendations = mockData[type as keyof typeof mockData] || mockData.popular;

        // Filtrar por categoria se especificada
        if (category) {
            recommendations = recommendations.filter(item => item.category === category);
        }

        // Limitar resultados
        recommendations = recommendations.slice(0, limit);

        return new Response(JSON.stringify({
            recommendations,
            type,
            total: recommendations.length
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erro ao gerar recomendações:', error);
        return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};