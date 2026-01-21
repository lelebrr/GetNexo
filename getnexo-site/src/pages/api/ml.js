import { MLModelsEngine } from '../../lib/ml-models-engine.js';
import { CachingEngine } from '../../lib/caching-engine.js';

const mlEngine = new MLModelsEngine();
const cacheEngine = new CachingEngine();

export async function post({ request }) {
    try {
        const { modelId, inputData, options = {} } = await request.json();

        if (!modelId || !inputData) {
            return new Response(JSON.stringify({ error: 'modelId and inputData are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create model if it doesn't exist (for testing)
        if (!mlEngine.models.has(modelId)) {
            // Create a basic sentiment model for demo
            mlEngine.createModel(modelId, {
                name: `Model ${modelId}`,
                type: options.type || 'sentiment',
                algorithm: 'keyword-based',
                parameters: {}
            });
        }

        // Check cache first
        const cacheKey = `ml_${modelId}_${JSON.stringify(inputData)}_${JSON.stringify(options)}`;
        let cachedResult = await cacheEngine.get(cacheKey, 'ml');

        if (cachedResult) {
            return cachedResult;
        }

        const result = await mlEngine.predict(modelId, inputData, options);

        // Cache the result for 5 minutes
        await cacheEngine.set(cacheKey, result, 300000, 'ml');

        return new Response(JSON.stringify({
            success: true,
            result
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('ML API error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function get({ url }) {
    try {
        const stats = mlEngine.getStats();
        return new Response(JSON.stringify({
            success: true,
            stats
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('ML Stats API error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}