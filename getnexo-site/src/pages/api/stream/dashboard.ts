import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { calculateKPIs, generateForecast, checkRisks } from '../../../lib/kpis.js';
import { getMetrics } from '../../../lib/metrics.js';

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

    // Calcular KPIs em tempo real
    const kpis = calculateKPIs();
    const forecasts = generateForecast(3); // 3 meses de projeção
    const risks = checkRisks(kpis);

    // Obter métricas do sistema
    const systemMetrics = await getMetrics();

    // Combinar tudo
    const dashboardData = {
        ...kpis,
        forecasts,
        risks,
        systemMetrics: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        },
        timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(dashboardData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};