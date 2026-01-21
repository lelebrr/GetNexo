import type { APIRoute } from 'astro';
import { verifyToken } from '../../lib/auth';

// Tipos
interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    points: number;
    requirement: { type: string; value: number };
}

interface UserStats {
    points: number;
    level: number;
    achievements: Achievement[];
    stats: { [key: string]: number };
}

// Conquistas disponíveis
const achievements: Achievement[] = [
    {
        id: 'first_login',
        title: 'Primeiro Login',
        description: 'Faça seu primeiro login na plataforma',
        icon: '🎉',
        points: 10,
        requirement: { type: 'login_count', value: 1 }
    },
    {
        id: 'file_uploader',
        title: 'Uploader Iniciante',
        description: 'Envie seu primeiro arquivo',
        icon: '📁',
        points: 25,
        requirement: { type: 'files_uploaded', value: 1 }
    },
    {
        id: 'file_master',
        title: 'Mestre dos Arquivos',
        description: 'Envie 10 arquivos',
        icon: '📂',
        points: 100,
        requirement: { type: 'files_uploaded', value: 10 }
    },
    {
        id: 'map_explorer',
        title: 'Explorador',
        description: 'Use o mapa interativo',
        icon: '🗺️',
        points: 15,
        requirement: { type: 'map_views', value: 1 }
    },
    {
        id: 'data_analyst',
        title: 'Analista de Dados',
        description: 'Execute uma análise de dados',
        icon: '📊',
        points: 50,
        requirement: { type: 'analytics_used', value: 1 }
    },
    {
        id: 'social_sharer',
        title: 'Compartilhador Social',
        description: 'Compartilhe conteúdo nas redes sociais',
        icon: '📱',
        points: 30,
        requirement: { type: 'social_shares', value: 1 }
    }
];

// Simulação de dados do usuário (em produção, seria um banco de dados)
const userStats: UserStats = {
    points: 0,
    level: 1,
    achievements: [],
    stats: {
        login_count: 0,
        files_uploaded: 0,
        map_views: 0,
        analytics_used: 0,
        social_shares: 0
    }
};

// Calcular nível baseado em pontos
function calculateLevel(points: number): number {
    return Math.floor(points / 100) + 1;
}

// Verificar conquistas desbloqueadas
function checkAchievements(stats: { [key: string]: number }) {
    return achievements.filter(achievement => {
        const userValue = stats[achievement.requirement.type] || 0;
        return userValue >= achievement.requirement.value;
    });
}

export const GET: APIRoute = async ({ request }) => {
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

    try {
        // Simular progresso do usuário
        userStats.stats.login_count = Math.min(5, userStats.stats.login_count + 1);
        userStats.points = Object.values(userStats.stats).reduce((sum, val) => sum + val * 5, 0);
        userStats.level = calculateLevel(userStats.points);
        userStats.achievements = checkAchievements(userStats.stats);

        const result = {
            user: {
                points: userStats.points,
                level: userStats.level,
                nextLevelPoints: userStats.level * 100,
                achievements: userStats.achievements
            },
            availableAchievements: achievements,
            progress: {
                totalAchievements: achievements.length,
                unlockedAchievements: userStats.achievements.length,
                completionPercentage: Math.round((userStats.achievements.length / achievements.length) * 100)
            },
            leaderboard: [
                { name: 'Você', points: userStats.points, level: userStats.level },
                { name: 'Usuário 1', points: 250, level: 3 },
                { name: 'Usuário 2', points: 180, level: 2 },
                { name: 'Usuário 3', points: 120, level: 2 }
            ].sort((a, b) => b.points - a.points)
        };

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erro na gamificação:', error);
        return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// Endpoint para adicionar pontos/ações
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

    try {
        const { action, points = 0 }: { action?: string; points?: number } = await request.json();

        if (action && userStats.stats[action] !== undefined) {
            userStats.stats[action] += 1;
        }

        if (points > 0) {
            userStats.points += points;
        }

        userStats.level = calculateLevel(userStats.points);
        userStats.achievements = checkAchievements(userStats.stats);

        return new Response(JSON.stringify({
            success: true,
            newPoints: userStats.points,
            level: userStats.level,
            achievements: userStats.achievements
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erro ao adicionar pontos:', error);
        return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};