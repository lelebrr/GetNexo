/**
 * Service Discovery Engine Automático
 * Descoberta automática de serviços com registro dinâmico
 */
class ServiceDiscoveryEngine {
    constructor() {
        this.services = new Map(); // Serviço -> instâncias
        this.watchers = new Map(); // Observadores de mudanças
        this.heartbeats = new Map(); // Heartbeats por instância
        this.metadata = new Map(); // Metadados por serviço
        this.consulLike = true; // Modo Consul-like
    }

    /**
     * Registra serviço
     */
    async registerService(serviceName, instance) {
        if (!this.services.has(serviceName)) {
            this.services.set(serviceName, new Map());
        }

        const instances = this.services.get(serviceName);
        const instanceId = instance.id || this.generateInstanceId();

        instances.set(instanceId, {
            ...instance,
            id: instanceId,
            registeredAt: new Date().toISOString(),
            lastHeartbeat: new Date().toISOString(),
            status: 'passing'
        });

        // Inicia heartbeat
        this.startHeartbeat(serviceName, instanceId);

        // Notifica watchers
        this.notifyWatchers(serviceName, 'register', instanceId);

        return instanceId;
    }

    /**
     * Remove registro de serviço
     */
    async deregisterService(serviceName, instanceId) {
        const instances = this.services.get(serviceName);
        if (instances) {
            instances.delete(instanceId);

            // Para heartbeat
            this.stopHeartbeat(instanceId);

            // Remove serviço se vazio
            if (instances.size === 0) {
                this.services.delete(serviceName);
            }

            // Notifica watchers
            this.notifyWatchers(serviceName, 'deregister', instanceId);
        }
    }

    /**
     * Descobre instâncias de um serviço
     */
    discoverService(serviceName, options = {}) {
        const instances = this.services.get(serviceName);
        if (!instances) return { instances: [] };

        let availableInstances = Array.from(instances.values());

        // Filtra por status
        if (options.onlyHealthy !== false) {
            availableInstances = availableInstances.filter(inst => inst.status === 'passing');
        }

        // Filtra por tags
        if (options.tags) {
            availableInstances = availableInstances.filter(inst =>
                options.tags.every(tag => inst.tags?.includes(tag))
            );
        }

        // Filtra por metadados
        if (options.metadata) {
            availableInstances = availableInstances.filter(inst =>
                Object.entries(options.metadata).every(([key, value]) => inst[key] === value)
            );
        }

        return {
            instances: availableInstances,
            serviceName,
            queryTime: new Date().toISOString()
        };
    }

    /**
     * Busca serviços por tag ou metadados
     */
    findServices(criteria) {
        const results = [];

        for (const [serviceName, instances] of this.services) {
            const serviceInstances = Array.from(instances.values());

            let matches = serviceInstances;

            // Filtra por critérios
            if (criteria.tags) {
                matches = matches.filter(inst =>
                    criteria.tags.some(tag => inst.tags?.includes(tag))
                );
            }

            if (criteria.metadata) {
                matches = matches.filter(inst =>
                    Object.entries(criteria.metadata).every(([key, value]) => inst[key] === value)
                );
            }

            if (matches.length > 0) {
                results.push({
                    serviceName,
                    instances: matches,
                    instanceCount: matches.length
                });
            }
        }

        return results;
    }

    /**
     * Atualiza metadados de serviço
     */
    updateServiceMetadata(serviceName, metadata) {
        this.metadata.set(serviceName, {
            ...this.metadata.get(serviceName),
            ...metadata,
            lastUpdated: new Date().toISOString()
        });
    }

    /**
     * Obtém metadados de serviço
     */
    getServiceMetadata(serviceName) {
        return this.metadata.get(serviceName) || {};
    }

    /**
     * Registra watcher para mudanças de serviço
     */
    watchService(serviceName, callback) {
        if (!this.watchers.has(serviceName)) {
            this.watchers.set(serviceName, []);
        }
        this.watchers.get(serviceName).push(callback);

        // Retorna função para remover watcher
        return () => {
            const watchers = this.watchers.get(serviceName);
            if (watchers) {
                const index = watchers.indexOf(callback);
                if (index > -1) {
                    watchers.splice(index, 1);
                }
            }
        };
    }

    /**
     * Notifica watchers de mudanças
     */
    notifyWatchers(serviceName, event, instanceId) {
        const watchers = this.watchers.get(serviceName) || [];
        const instances = this.services.get(serviceName);

        for (const watcher of watchers) {
            try {
                watcher({
                    event,
                    serviceName,
                    instanceId,
                    instances: instances ? Array.from(instances.values()) : [],
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error in service watcher:', error);
            }
        }
    }

    /**
     * Inicia heartbeat para instância
     */
    startHeartbeat(serviceName, instanceId) {
        const interval = setInterval(async () => {
            const instances = this.services.get(serviceName);
            if (!instances) return;

            const instance = instances.get(instanceId);
            if (!instance) {
                this.stopHeartbeat(instanceId);
                return;
            }

            try {
                // Simula verificação de saúde
                const isHealthy = await this.checkInstanceHealth(instance);

                if (isHealthy) {
                    instance.lastHeartbeat = new Date().toISOString();
                    instance.status = 'passing';
                } else {
                    instance.status = 'failing';
                    instance.failureCount = (instance.failureCount || 0) + 1;

                    // Remove após múltiplas falhas
                    if (instance.failureCount >= 3) {
                        console.warn(`Removing failing instance ${instanceId} for service ${serviceName}`);
                        this.deregisterService(serviceName, instanceId);
                    }
                }
            } catch (error) {
                console.error(`Heartbeat failed for ${serviceName}:${instanceId}:`, error);
            }
        }, 30000); // 30s

        this.heartbeats.set(instanceId, interval);
    }

    /**
     * Para heartbeat
     */
    stopHeartbeat(instanceId) {
        const interval = this.heartbeats.get(instanceId);
        if (interval) {
            clearInterval(interval);
            this.heartbeats.delete(instanceId);
        }
    }

    /**
     * Verifica saúde da instância
     */
    async checkInstanceHealth(instance) {
        // Simulação de health check
        const latency = Math.random() * 100 + 10; // 10-110ms
        await new Promise(resolve => setTimeout(resolve, latency));

        // 95% chance de saudável
        return Math.random() < 0.95;
    }

    /**
     * Lista todos os serviços
     */
    listServices() {
        const services = [];
        for (const [serviceName, instances] of this.services) {
            const instanceList = Array.from(instances.values());
            services.push({
                name: serviceName,
                instanceCount: instanceList.length,
                healthyCount: instanceList.filter(inst => inst.status === 'passing').length,
                metadata: this.getServiceMetadata(serviceName)
            });
        }
        return services;
    }

    /**
     * Estatísticas de descoberta
     */
    getStats() {
        let totalInstances = 0;
        let healthyInstances = 0;

        for (const instances of this.services.values()) {
            for (const instance of instances.values()) {
                totalInstances++;
                if (instance.status === 'passing') healthyInstances++;
            }
        }

        return {
            services: this.services.size,
            totalInstances,
            healthyInstances,
            healthRate: totalInstances > 0 ? (healthyInstances / totalInstances) * 100 : 0,
            watchers: Array.from(this.watchers.values()).reduce((sum, w) => sum + w.length, 0)
        };
    }

    /**
     * Gera ID único para instância
     */
    generateInstanceId() {
        return `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Singleton instance
const serviceDiscoveryEngine = new ServiceDiscoveryEngine();

module.exports = serviceDiscoveryEngine;