import type { APIRoute } from 'astro';
import { verifyToken } from '../../lib/auth';

// Dados simulados para análise
const mockUserData = [
    { id: 1, age: 25, income: 3000, purchases: 15, category: 'tech' },
    { id: 2, age: 30, income: 4500, purchases: 22, category: 'fashion' },
    { id: 3, age: 35, income: 5200, purchases: 28, category: 'home' },
    { id: 4, age: 28, income: 3800, purchases: 18, category: 'tech' },
    { id: 5, age: 42, income: 6000, purchases: 35, category: 'books' },
    { id: 6, age: 31, income: 4100, purchases: 20, category: 'fashion' },
    { id: 7, age: 38, income: 5500, purchases: 30, category: 'home' },
    { id: 8, age: 26, income: 3200, purchases: 12, category: 'tech' },
];

// Tipos para dados
interface UserData {
    id: number;
    age: number;
    income: number;
    purchases: number;
    category: string;
}

interface Centroid {
    age: number;
    income: number;
    purchases: number;
}

// Função simples de clustering (K-means simplificado)
function simpleClustering(data: UserData[], k = 3): UserData[] {
    // Inicializar centroids aleatoriamente
    const centroids: Centroid[] = [];
    for (let i = 0; i < k; i++) {
        centroids.push({
            age: Math.random() * 50 + 20,
            income: Math.random() * 5000 + 2000,
            purchases: Math.random() * 30 + 5
        });
    }

    // Atribuir pontos aos clusters mais próximos
    const clusters = data.map(point => {
        let minDistance = Infinity;
        let clusterId = 0;

        centroids.forEach((centroid, index) => {
            const distance = Math.sqrt(
                Math.pow(point.age - centroid.age, 2) +
                Math.pow(point.income - centroid.income, 2) +
                Math.pow(point.purchases - centroid.purchases, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                clusterId = index;
            }
        });

        return { ...point, cluster: clusterId };
    });

    return clusters;
}

// Análise de tendências
function analyzeTrends(data: UserData[]) {
    const categories: { [key: string]: number[] } = {};
    data.forEach((item: UserData) => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item.purchases);
    });

    const trends = Object.keys(categories).map(category => {
        const purchases = categories[category];
        const avg = purchases.reduce((a: number, b: number) => a + b, 0) / purchases.length;
        const trend = purchases.length > 1 ?
            (purchases[purchases.length - 1] - purchases[0]) / purchases.length : 0;

        return {
            category,
            averagePurchases: Math.round(avg * 100) / 100,
            trend: Math.round(trend * 100) / 100,
            count: purchases.length
        };
    });

    return trends;
}

// Predição simples baseada em regressão linear
function predictPurchases(age: number, income: number): number {
    // Fórmula simplificada baseada nos dados
    return Math.max(5, Math.min(40, (income / 100) + (age / 10) - 10));
}

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

    const analysisType = url.searchParams.get('type') || 'clustering'; // clustering, trends, prediction

    try {
        let result = {};

        switch (analysisType) {
            case 'clustering':
                result = {
                    type: 'clustering',
                    clusters: simpleClustering(mockUserData),
                    insights: 'Usuários agrupados por comportamento de compra similar.'
                };
                break;

            case 'trends':
                result = {
                    type: 'trends',
                    trends: analyzeTrends(mockUserData),
                    insights: 'Análise de tendências por categoria de produto.'
                };
                break;

            case 'prediction':
                const age = parseInt(url.searchParams.get('age') || '30');
                const income = parseInt(url.searchParams.get('income') || '4000');
                const prediction = predictPurchases(age, income);
                result = {
                    type: 'prediction',
                    input: { age, income },
                    prediction: Math.round(prediction),
                    insights: `Predição baseada em dados históricos. Usuários com renda de R$${income} e idade ${age} tendem a fazer cerca de ${Math.round(prediction)} compras.`
                };
                break;

            default:
                result = {
                    type: 'summary',
                    summary: {
                        totalUsers: mockUserData.length,
                        averageAge: Math.round(mockUserData.reduce((a, b) => a + b.age, 0) / mockUserData.length),
                        averageIncome: Math.round(mockUserData.reduce((a, b) => a + b.income, 0) / mockUserData.length),
                        totalPurchases: mockUserData.reduce((a, b) => a + b.purchases, 0)
                    },
                    insights: 'Estatísticas gerais dos usuários.'
                };
        }

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erro na análise:', error);
        return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};