/**
 * Microservices Architecture Simulation Engine
 * Simula arquitetura de microserviços com registro, descoberta e comunicação
 */
class MicroservicesEngine {
    constructor() {
        this.services = new Map(); // Serviços registrados
        this.serviceDiscovery = new Map(); // Descoberta de serviços
        this.apiGateways = new Map(); // API Gateways
        this.serviceMesh = new Map(); // Service mesh para observabilidade
        this.circuitBreakers = new Map(); // Circuit breakers por serviço
        this.healthChecks = new Map(); // Health checks
        this.serviceDependencies = new Map(); // Dependências entre serviços
    }

    /**
     * Registra um microserviço
     */
    registerService(serviceName, serviceConfig) {
        const service = {
            name: serviceName,
            version: serviceConfig.version || '1.0.0',
            endpoints: serviceConfig.endpoints || [],
            healthCheck: serviceConfig.healthCheck,
            dependencies: serviceConfig.dependencies || [],
            instances: [], // Instâncias ativas
            status: 'starting',
            metadata: serviceConfig.metadata || {},
            registeredAt: new Date().toISOString()
        };

        this.services.set(serviceName, service);

        // Registra dependências
        for (const dep of service.dependencies) {
            if (!this.serviceDependencies.has(dep)) {
                this.serviceDependencies.set(dep, []);
            }
            this.serviceDependencies.get(dep).push(serviceName);
        }

        // Inicia health checks
        if (service.healthCheck) {
            this.startHealthChecks(serviceName, service.healthCheck);
        }

        return service;
    }

    /**
     * Registra instância de serviço
     */
    registerServiceInstance(serviceName, instanceConfig) {
        const service = this.services.get(serviceName);
        if (!service) throw new Error(`Service ${serviceName} not registered`);

        const instance = {
            id: this.generateInstanceId(),
            host: instanceConfig.host,
            port: instanceConfig.port,
            status: 'healthy',
            lastHealthCheck: new Date().toISOString(),
            metadata: instanceConfig.metadata || {}
        };

        service.instances.push(instance);

        // Atualiza service discovery
        this.updateServiceDiscovery(serviceName);

        return instance;
    }

    /**
     * Remove instância de serviço
     */
    deregisterServiceInstance(serviceName, instanceId) {
        const service = this.services.get(serviceName);
        if (service) {
            service.instances = service.instances.filter(inst => inst.id !== instanceId);
            this.updateServiceDiscovery(serviceName);
        }
    }

    /**
     * Atualiza descoberta de serviços
     */
    updateServiceDiscovery(serviceName) {
        const service = this.services.get(serviceName);
        if (service) {
            const healthyInstances = service.instances.filter(inst => inst.status === 'healthy');
            this.serviceDiscovery.set(serviceName, {
                instances: healthyInstances,
                loadBalancer: this.createLoadBalancer(healthyInstances)
            });
        }
    }

    /**
     * Cria load balancer simples
     */
    createLoadBalancer(instances) {
        let currentIndex = 0;
        return {
            getNextInstance: () => {
                if (instances.length === 0) return null;
                const instance = instances[currentIndex];
                currentIndex = (currentIndex + 1) % instances.length;
                return instance;
            },
            getAllInstances: () => instances
        };
    }

    /**
     * Descobre serviço
     */
    discoverService(serviceName) {
        return this.serviceDiscovery.get(serviceName) || { instances: [], loadBalancer: null };
    }

    /**
     * Faz chamada entre serviços
     */
    async callService(fromService, toService, endpoint, data = {}) {
        const discovery = this.discoverService(toService);
        if (!discovery.loadBalancer) {
            throw new Error(`Service ${toService} not available`);
        }

        const instance = discovery.loadBalancer.getNextInstance();
        if (!instance) {
            throw new Error(`No healthy instances available for ${toService}`);
        }

        // Verifica circuit breaker
        const circuitKey = `${fromService}->${toService}`;
        const circuitBreaker = this.circuitBreakers.get(circuitKey);
        if (circuitBreaker && circuitBreaker.state === 'open') {
            throw new Error(`Circuit breaker open for ${circuitKey}`);
        }

        try {
            // Simula chamada HTTP
            const result = await this.simulateHttpCall(instance, endpoint, data);

            // Registra no service mesh
            this.recordServiceCall(fromService, toService, endpoint, 'success');

            // Fecha circuit breaker se estava half-open
            if (circuitBreaker && circuitBreaker.state === 'half-open') {
                circuitBreaker.state = 'closed';
                circuitBreaker.failures = 0;
            }

            return result;

        } catch (error) {
            // Registra falha
            this.recordServiceCall(fromService, toService, endpoint, 'failure');

            // Atualiza circuit breaker
            if (circuitBreaker) {
                circuitBreaker.failures++;
                if (circuitBreaker.failures >= circuitBreaker.threshold) {
                    circuitBreaker.state = 'open';
                    circuitBreaker.lastFailure = new Date().toISOString();
                }
            }

            throw error;
        }
    }

    /**
     * Simula chamada HTTP (em simulação real seria fetch/axios)
     */
    async simulateHttpCall(instance, endpoint, data) {
        // Simulação de latência e possível falha
        const latency = Math.random() * 100 + 50; // 50-150ms
        await new Promise(resolve => setTimeout(resolve, latency));

        // Simula falha ocasional (5%)
        if (Math.random() < 0.05) {
            throw new Error('Simulated service failure');
        }

        return {
            status: 200,
            data: { message: `Response from ${instance.id}`, ...data },
            instance: instance.id
        };
    }

    /**
     * Cria API Gateway
     */
    createApiGateway(gatewayName, config) {
        const gateway = {
            name: gatewayName,
            routes: config.routes || [],
            middleware: config.middleware || [],
            rateLimiter: config.rateLimiter || null,
            authentication: config.authentication || null,
            status: 'running'
        };

        this.apiGateways.set(gatewayName, gateway);
        return gateway;
    }

    /**
     * Processa requisição através do API Gateway
     */
    async processGatewayRequest(gatewayName, request) {
        const gateway = this.apiGateways.get(gatewayName);
        if (!gateway) throw new Error(`Gateway ${gatewayName} not found`);

        // Aplica middleware
        for (const middleware of gateway.middleware) {
            await middleware(request);
        }

        // Encontra rota
        const route = gateway.routes.find(r => this.matchRoute(r.path, request.path));
        if (!route) {
            throw new Error('Route not found');
        }

        // Verifica rate limiting
        if (gateway.rateLimiter) {
            const allowed = this.checkRateLimit(gateway.rateLimiter, request);
            if (!allowed) {
                throw new Error('Rate limit exceeded');
            }
        }

        // Aplica autenticação se necessário
        if (gateway.authentication && route.requiresAuth) {
            await gateway.authentication(request);
        }

        // Encaminha para serviço
        return await this.callService(gatewayName, route.service, route.endpoint, request.body);
    }

    /**
     * Verifica rate limiting (simplificado)
     */
    checkRateLimit(limiter, request) {
        const key = request.ip || 'anonymous';
        const now = Date.now();

        if (!limiter.requests) limiter.requests = new Map();

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
     * Match simples de rota
     */
    matchRoute(routePattern, requestPath) {
        // Implementação simplificada
        return routePattern === requestPath || routePattern === '/*';
    }

    /**
     * Inicia health checks para serviço
     */
    startHealthChecks(serviceName, healthCheckConfig) {
        const interval = setInterval(async () => {
            const service = this.services.get(serviceName);
            if (!service) {
                clearInterval(interval);
                return;
            }

            for (const instance of service.instances) {
                try {
                    await this.performHealthCheck(instance, healthCheckConfig);
                    instance.status = 'healthy';
                } catch (error) {
                    instance.status = 'unhealthy';
                    console.warn(`Health check failed for ${serviceName}:${instance.id}`);
                }
                instance.lastHealthCheck = new Date().toISOString();
            }

            // Atualiza descoberta após health checks
            this.updateServiceDiscovery(serviceName);

        }, healthCheckConfig.interval || 30000); // 30s default

        this.healthChecks.set(serviceName, { interval, config: healthCheckConfig });
    }

    /**
     * Executa health check
     */
    async performHealthCheck(instance, config) {
        // Simulação de health check
        const latency = Math.random() * 50 + 10; // 10-60ms
        await new Promise(resolve => setTimeout(resolve, latency));

        if (Math.random() < 0.1) { // 10% chance de falha
            throw new Error('Health check failed');
        }
    }

    /**
     * Registra chamada no service mesh
     */
    recordServiceCall(from, to, endpoint, status) {
        const key = `${from}->${to}`;
        if (!this.serviceMesh.has(key)) {
            this.serviceMesh.set(key, { calls: 0, failures: 0, latency: [] });
        }

        const metrics = this.serviceMesh.get(key);
        metrics.calls++;

        if (status === 'failure') {
            metrics.failures++;
        }

        // Simula latência
        metrics.latency.push(Math.random() * 100 + 20);
        if (metrics.latency.length > 100) {
            metrics.latency.shift(); // Mantém apenas últimas 100
        }
    }

    /**
     * Cria circuit breaker
     */
    createCircuitBreaker(fromService, toService, config = {}) {
        const key = `${fromService}->${toService}`;
        this.circuitBreakers.set(key, {
            state: 'closed', // closed, open, half-open
            failures: 0,
            threshold: config.threshold || 5,
            timeout: config.timeout || 60000, // 1min
            lastFailure: null
        });
    }

    /**
     * Gera ID único para instância
     */
    generateInstanceId() {
        return `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Estatísticas da arquitetura de microserviços
     */
    getStats() {
        return {
            services: this.services.size,
            totalInstances: Array.from(this.services.values()).reduce((sum, svc) => sum + svc.instances.length, 0),
            healthyInstances: Array.from(this.services.values()).reduce((sum, svc) =>
                sum + svc.instances.filter(inst => inst.status === 'healthy').length, 0),
            apiGateways: this.apiGateways.size,
            serviceCalls: Array.from(this.serviceMesh.values()).reduce((sum, metrics) => sum + metrics.calls, 0),
            circuitBreakers: {
                total: this.circuitBreakers.size,
                open: Array.from(this.circuitBreakers.values()).filter(cb => cb.state === 'open').length
            }
        };
    }

    /**
     * Lista serviços registrados
     */
    listServices() {
        return Array.from(this.services.keys());
    }

    /**
     * Obtém detalhes de um serviço
     */
    getServiceDetails(serviceName) {
        return this.services.get(serviceName);
    }
}

// Singleton instance
const microservicesEngine = new MicroservicesEngine();

module.exports = microservicesEngine;