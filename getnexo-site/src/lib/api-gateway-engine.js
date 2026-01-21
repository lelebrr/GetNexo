/**
 * API Gateway Engine Inteligente
 * Gateway inteligente com roteamento, autenticação, rate limiting e mais
 */
class ApiGatewayEngine {
    constructor() {
        this.routes = new Map(); // Rotas configuradas
        this.middlewares = new Map(); // Middlewares globais e por rota
        this.services = new Map(); // Serviços backend registrados
        this.plugins = new Map(); // Plugins carregáveis
        this.metrics = new Map(); // Métricas de performance
        this.circuitBreakers = new Map(); // Circuit breakers
        this.rateLimiters = new Map(); // Rate limiters por endpoint
    }

    /**
     * Adiciona rota ao gateway
     */
    addRoute(routeConfig) {
        const route = {
            id: this.generateRouteId(),
            path: routeConfig.path,
            method: routeConfig.method || 'GET',
            service: routeConfig.service,
            endpoint: routeConfig.endpoint,
            plugins: routeConfig.plugins || [],
            middlewares: routeConfig.middlewares || [],
            timeout: routeConfig.timeout || 30000,
            retries: routeConfig.retries || 0,
            rateLimit: routeConfig.rateLimit || null,
            auth: routeConfig.auth || null,
            cors: routeConfig.cors || null,
            caching: routeConfig.caching || null
        };

        const key = `${route.method}:${route.path}`;
        this.routes.set(key, route);

        // Configura rate limiting se especificado
        if (route.rateLimit) {
            this.configureRateLimit(key, route.rateLimit);
        }

        return route;
    }

    /**
     * Registra serviço backend
     */
    registerService(serviceName, serviceConfig) {
        this.services.set(serviceName, {
            name: serviceName,
            baseUrl: serviceConfig.baseUrl,
            healthCheck: serviceConfig.healthCheck,
            loadBalancer: serviceConfig.loadBalancer || 'round-robin',
            instances: serviceConfig.instances || [serviceConfig.baseUrl],
            currentIndex: 0
        });
    }

    /**
     * Processa requisição HTTP
     */
    async processRequest(request) {
        const startTime = Date.now();
        const routeKey = `${request.method}:${request.path}`;

        try {
            // Encontra rota
            const route = this.findRoute(request.method, request.path);
            if (!route) {
                return this.createResponse(404, { error: 'Route not found' });
            }

            // Aplica middlewares globais
            await this.applyMiddlewares(request, this.middlewares.get('global') || []);

            // Aplica middlewares da rota
            await this.applyMiddlewares(request, route.middlewares);

            // Verifica autenticação
            if (route.auth) {
                await this.authenticateRequest(request, route.auth);
            }

            // Verifica rate limiting
            if (route.rateLimit) {
                const allowed = this.checkRateLimit(routeKey, request);
                if (!allowed) {
                    return this.createResponse(429, { error: 'Rate limit exceeded' });
                }
            }

            // Verifica CORS
            if (route.cors) {
                this.handleCors(request, route.cors);
            }

            // Verifica cache
            if (route.caching && request.method === 'GET') {
                const cached = this.checkCache(routeKey, request);
                if (cached) {
                    this.recordMetric(routeKey, 'cache_hit', Date.now() - startTime);
                    return cached;
                }
            }

            // Encaminha para serviço backend
            const response = await this.forwardToService(route, request);

            // Aplica plugins de resposta
            for (const pluginName of route.plugins) {
                const plugin = this.plugins.get(pluginName);
                if (plugin && plugin.onResponse) {
                    await plugin.onResponse(response, request);
                }
            }

            // Cache se configurado
            if (route.caching && response.status === 200) {
                this.setCache(routeKey, request, response, route.caching.ttl);
            }

            // Registra métricas
            this.recordMetric(routeKey, 'success', Date.now() - startTime);

            return response;

        } catch (error) {
            // Registra erro
            this.recordMetric(routeKey, 'error', Date.now() - startTime);

            // Retorna resposta de erro
            return this.createResponse(500, { error: error.message });
        }
    }

    /**
     * Encontra rota compatível
     */
    findRoute(method, path) {
        // Busca rota exata primeiro
        const exactKey = `${method}:${path}`;
        if (this.routes.has(exactKey)) {
            return this.routes.get(exactKey);
        }

        // Busca rotas com parâmetros
        for (const [routeKey, route] of this.routes) {
            if (routeKey.startsWith(`${method}:`)) {
                const routePath = routeKey.substring(method.length + 1);
                if (this.matchPath(routePath, path)) {
                    return route;
                }
            }
        }

        return null;
    }

    /**
     * Match de path com parâmetros
     */
    matchPath(routePath, requestPath) {
        const routeParts = routePath.split('/');
        const requestParts = requestPath.split('/');

        if (routeParts.length !== requestParts.length) return false;

        for (let i = 0; i < routeParts.length; i++) {
            const routePart = routeParts[i];
            const requestPart = requestParts[i];

            if (routePart.startsWith('{') && routePart.endsWith('}')) {
                // Parâmetro dinâmico - sempre match
                continue;
            }

            if (routePart !== requestPart) {
                return false;
            }
        }

        return true;
    }

    /**
     * Aplica middlewares
     */
    async applyMiddlewares(request, middlewares) {
        for (const middleware of middlewares) {
            await middleware(request);
        }
    }

    /**
     * Autenticação de requisição
     */
    async authenticateRequest(request, authConfig) {
        if (authConfig.type === 'jwt') {
            const token = this.extractToken(request);
            if (!token) {
                throw new Error('No authentication token provided');
            }

            // Simula validação JWT
            if (!this.validateJwt(token)) {
                throw new Error('Invalid authentication token');
            }

        } else if (authConfig.type === 'api-key') {
            const apiKey = request.headers['x-api-key'];
            if (!apiKey || !this.validateApiKey(apiKey)) {
                throw new Error('Invalid API key');
            }
        }
    }

    /**
     * Configura rate limiting
     */
    configureRateLimit(routeKey, config) {
        this.rateLimiters.set(routeKey, {
            windowMs: config.windowMs || 60000, // 1min
            maxRequests: config.maxRequests || 100,
            requests: new Map()
        });
    }

    /**
     * Verifica rate limiting
     */
    checkRateLimit(routeKey, request) {
        const limiter = this.rateLimiters.get(routeKey);
        if (!limiter) return true;

        const key = request.ip || request.headers['x-forwarded-for'] || 'anonymous';
        const now = Date.now();

        const userRequests = limiter.requests.get(key) || [];
        const recentRequests = userRequests.filter(time => now - time < limiter.windowMs);

        if (recentRequests.length >= limiter.maxRequests) {
            return false;
        }

        recentRequests.push(now);
        limiter.requests.set(key, recentRequests);

        return true;
    }

    /**
     * Manipula CORS
     */
    handleCors(request, corsConfig) {
        // Implementação simplificada
        request.corsHeaders = {
            'Access-Control-Allow-Origin': corsConfig.origin || '*',
            'Access-Control-Allow-Methods': corsConfig.methods || 'GET,POST,PUT,DELETE',
            'Access-Control-Allow-Headers': corsConfig.headers || 'Content-Type,Authorization'
        };
    }

    /**
     * Verifica cache
     */
    checkCache(routeKey, request) {
        // Implementação simplificada - em produção usaria Redis/memcached
        return null;
    }

    /**
     * Define cache
     */
    setCache(routeKey, request, response, ttl) {
        // Implementação simplificada
    }

    /**
     * Encaminha para serviço backend
     */
    async forwardToService(route, request) {
        const service = this.services.get(route.service);
        if (!service) {
            throw new Error(`Service ${route.service} not configured`);
        }

        const targetUrl = this.buildTargetUrl(service, route.endpoint, request);

        // Simula chamada HTTP
        const response = await this.makeHttpRequest(targetUrl, {
            method: request.method,
            headers: request.headers,
            body: request.body,
            timeout: route.timeout
        });

        return response;
    }

    /**
     * Constrói URL do target
     */
    buildTargetUrl(service, endpoint, request) {
        let baseUrl = service.baseUrl;

        // Load balancing simples
        if (service.instances.length > 1) {
            baseUrl = service.instances[service.currentIndex];
            service.currentIndex = (service.currentIndex + 1) % service.instances.length;
        }

        return `${baseUrl}${endpoint}`;
    }

    /**
     * Simula requisição HTTP
     */
    async makeHttpRequest(url, options) {
        // Simulação - em produção seria fetch ou axios
        const latency = Math.random() * 200 + 50; // 50-250ms
        await new Promise(resolve => setTimeout(resolve, latency));

        if (Math.random() < 0.05) { // 5% chance de erro
            throw new Error('Backend service error');
        }

        return {
            status: 200,
            headers: { 'content-type': 'application/json' },
            body: { message: 'Success', url }
        };
    }

    /**
     * Registra plugin
     */
    registerPlugin(name, plugin) {
        this.plugins.set(name, plugin);
    }

    /**
     * Adiciona middleware global
     */
    addGlobalMiddleware(middleware) {
        if (!this.middlewares.has('global')) {
            this.middlewares.set('global', []);
        }
        this.middlewares.get('global').push(middleware);
    }

    /**
     * Registra métricas
     */
    recordMetric(routeKey, type, duration) {
        const key = `${routeKey}:${type}`;
        if (!this.metrics.has(key)) {
            this.metrics.set(key, { count: 0, totalDuration: 0, avgDuration: 0 });
        }

        const metric = this.metrics.get(key);
        metric.count++;
        metric.totalDuration += duration;
        metric.avgDuration = metric.totalDuration / metric.count;
    }

    /**
     * Cria resposta padrão
     */
    createResponse(status, body) {
        return {
            status,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body)
        };
    }

    /**
     * Métodos auxiliares de validação
     */
    extractToken(request) {
        return request.headers.authorization?.replace('Bearer ', '');
    }

    validateJwt(token) {
        // Simulação - em produção validaria JWT real
        return token && token.length > 10;
    }

    validateApiKey(apiKey) {
        // Simulação
        return apiKey === 'valid-api-key';
    }

    /**
     * Gera ID único para rota
     */
    generateRouteId() {
        return `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Estatísticas do gateway
     */
    getStats() {
        const totalRequests = Array.from(this.metrics.values()).reduce((sum, m) => sum + m.count, 0);
        const errorCount = (this.metrics.get('error')?.count || 0);

        return {
            routes: this.routes.size,
            services: this.services.size,
            plugins: this.plugins.size,
            totalRequests,
            errorRate: totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0,
            metrics: Object.fromEntries(this.metrics)
        };
    }
}

// Singleton instance
const apiGatewayEngine = new ApiGatewayEngine();

module.exports = apiGatewayEngine;