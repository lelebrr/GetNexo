const promClient = require('prom-client');
const logger = require('./logger');

// Criar registro de métricas
const register = new promClient.Registry();

// Adicionar métricas padrão
promClient.collectDefaultMetrics({ register });

// Métricas customizadas
const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in microseconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

const activeConnections = new promClient.Gauge({
    name: 'active_connections',
    help: 'Number of active connections'
});

const errorCounter = new promClient.Counter({
    name: 'application_errors_total',
    help: 'Total number of application errors',
    labelNames: ['type', 'endpoint']
});

const uptimeGauge = new promClient.Gauge({
    name: 'application_uptime_seconds',
    help: 'Application uptime in seconds'
});

// Registrar métricas
register.registerMetric(httpRequestDuration);
register.registerMetric(activeConnections);
register.registerMetric(errorCounter);
register.registerMetric(uptimeGauge);

// Inicializar uptime
uptimeGauge.set(process.uptime());

// Middleware para coletar métricas de requisições HTTP
function metricsMiddleware(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestDuration
            .labels(req.method, req.route?.path || req.path, res.statusCode)
            .observe(duration);

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
    errorCounter.inc({ type, endpoint });
    logger.error(`Error incremented: ${type} on ${endpoint}`);
}

function updateActiveConnections(count) {
    activeConnections.set(count);
}

function getMetrics() {
    return register.metrics();
}

// Endpoint para Prometheus scraper
function metricsEndpoint(req, res) {
    res.set('Content-Type', register.contentType);
    res.end(register.metrics());
}

module.exports = {
    metricsMiddleware,
    incrementError,
    updateActiveConnections,
    getMetrics,
    metricsEndpoint,
    register,
    httpRequestDuration,
    activeConnections,
    errorCounter,
    uptimeGauge
};