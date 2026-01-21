import type { APIRoute } from 'astro';
import { getMetrics } from '../../lib/metrics.js';

export const GET: APIRoute = async () => {
    try {
        const metrics = await getMetrics();

        return new Response(metrics, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('Error generating metrics:', error);
        return new Response('Error generating metrics', { status: 500 });
    }
};