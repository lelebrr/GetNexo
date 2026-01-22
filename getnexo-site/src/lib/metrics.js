import promClient from 'prom-client';
import logger from './logger.js';

// Criar registro de métricas
const register = new promClient.Registry();

// Adicionar métricas padrão
promClient.collectDefaultMetrics({ register });

// Métricas customizadas desabilitadas para evitar conflitos

// Middleware para coletar métricas de requisições HTTP
function metricsMiddleware(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;

        // Log de performance
        if (duration > 2) {
            logger.performance('Slow request detected', {
                method: req.method,
                path: req.path,
                duration,
                status: res.statusCode
            });
        }
    });

    next();
}

// Funções helper para atualizar métricas
function incrementError(type, endpoint = 'unknown') {
    logger.error(`Error incremented: ${type} on ${endpoint}`);
}

function updateActiveConnections(count) {
    // Métricas desabilitadas
}

function getMetrics() {
    return register.metrics();
}

export {
    metricsMiddleware,
    incrementError,
    updateActiveConnections,
    getMetrics,
    register
};

export default {
    metricsMiddleware,
    incrementError,
    updateActiveConnections,
    getMetrics,
    register
};