/**
 * Bulkhead Engine com Timeouts
 * Implementa isolamento de falhas e controle de recursos
 */
class BulkheadEngine {
    constructor() {
        this.bulkheads = new Map(); // Bulkheads por chave
        this.timeouts = new Map(); // Timeouts ativos
        this.resourcePools = new Map(); // Pools de recursos
    }

    /**
     * Cria bulkhead
     */
    createBulkhead(key, config = {}) {
        const bulkhead = {
            key,
            semaphore: {
                permits: config.maxConcurrentCalls || 10,
                available: config.maxConcurrentCalls || 10,
                waitingQueue: []
            },
            timeout: config.timeout || 30000, // 30s
            fallback: config.fallback || null,
            stats: {
                totalCalls: 0,
                successfulCalls: 0,
                failedCalls: 0,
                rejectedCalls: 0,
                timeoutCalls: 0,
                averageExecutionTime: 0
            }
        };

        this.bulkheads.set(key, bulkhead);
        return bulkhead;
    }

    /**
     * Executa função dentro de bulkhead
     */
    async execute(key, fn, config = {}) {
        const bulkhead = this.bulkheads.get(key) || this.createBulkhead(key, config);
        bulkhead.stats.totalCalls++;

        // Tenta adquirir permissão
        const permit = await this.acquirePermit(bulkhead);
        if (!permit) {
            bulkhead.stats.rejectedCalls++;
            if (bulkhead.fallback) {
                return await bulkhead.fallback();
            }
            throw new Error(`Bulkhead ${key} is full`);
        }

        const startTime = Date.now();
        let timeoutId;

        try {
            // Configura timeout
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                    reject(new Error('Bulkhead timeout'));
                }, bulkhead.timeout);
            });

            // Executa função com timeout
            const result = await Promise.race([fn(), timeoutPromise]);

            const executionTime = Date.now() - startTime;
            this.updateAverageTime(bulkhead, executionTime);

            bulkhead.stats.successfulCalls++;
            return result;

        } catch (error) {
            bulkhead.stats.failedCalls++;
            if (error.message === 'Bulkhead timeout') {
                bulkhead.stats.timeoutCalls++;
            }
            throw error;
        } finally {
            // Libera permissão
            this.releasePermit(bulkhead);
            if (timeoutId) clearTimeout(timeoutId);
        }
    }

    /**
     * Adquire permissão do semáforo
     */
    async acquirePermit(bulkhead) {
        return new Promise((resolve) => {
            if (bulkhead.semaphore.available > 0) {
                bulkhead.semaphore.available--;
                resolve(true);
            } else {
                // Adiciona à fila de espera
                bulkhead.semaphore.waitingQueue.push(resolve);

                // Timeout para fila de espera
                setTimeout(() => {
                    const index = bulkhead.semaphore.waitingQueue.indexOf(resolve);
                    if (index > -1) {
                        bulkhead.semaphore.waitingQueue.splice(index, 1);
                        resolve(false);
                    }
                }, bulkhead.timeout);
            }
        });
    }

    /**
     * Libera permissão
     */
    releasePermit(bulkhead) {
        bulkhead.semaphore.available++;

        // Acorda próxima na fila
        if (bulkhead.semaphore.waitingQueue.length > 0) {
            const nextResolve = bulkhead.semaphore.waitingQueue.shift();
            bulkhead.semaphore.available--;
            nextResolve(true);
        }
    }

    /**
     * Executa com timeout personalizado
     */
    async executeWithTimeout(key, fn, timeoutMs) {
        const timeoutPromise = new Promise((_, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`Timeout after ${timeoutMs}ms`));
            }, timeoutMs);
            this.timeouts.set(`timeout_${Date.now()}`, timeoutId);
        });

        try {
            return await Promise.race([fn(), timeoutPromise]);
        } finally {
            // Cleanup timeout
            const timeoutKey = `timeout_${Date.now()}`;
            const timeoutId = this.timeouts.get(timeoutKey);
            if (timeoutId) {
                clearTimeout(timeoutId);
                this.timeouts.delete(timeoutKey);
            }
        }
    }

    /**
     * Cria pool de recursos
     */
    createResourcePool(poolName, config = {}) {
        const pool = {
            name: poolName,
            resources: [],
            available: [],
            waitingQueue: [],
            maxSize: config.maxSize || 10,
            minSize: config.minSize || 1,
            createResource: config.createResource,
            destroyResource: config.destroyResource,
            validateResource: config.validateResource || (() => true),
            stats: {
                created: 0,
                destroyed: 0,
                borrowed: 0,
                returned: 0
            }
        };

        // Inicializa recursos mínimos
        for (let i = 0; i < pool.minSize; i++) {
            this.createResource(pool);
        }

        this.resourcePools.set(poolName, pool);
        return pool;
    }

    /**
     * Empresta recurso do pool
     */
    async borrowResource(poolName) {
        const pool = this.resourcePools.get(poolName);
        if (!pool) throw new Error(`Resource pool ${poolName} not found`);

        return new Promise((resolve, reject) => {
            if (pool.available.length > 0) {
                const resource = pool.available.pop();
                pool.stats.borrowed++;
                resolve(resource);
            } else if (pool.resources.length < pool.maxSize) {
                // Cria novo recurso
                const resource = this.createResource(pool);
                pool.stats.borrowed++;
                resolve(resource);
            } else {
                // Adiciona à fila de espera
                pool.waitingQueue.push({ resolve, reject });

                // Timeout
                setTimeout(() => {
                    const index = pool.waitingQueue.findIndex(item => item.resolve === resolve);
                    if (index > -1) {
                        pool.waitingQueue.splice(index, 1);
                        reject(new Error('Resource pool timeout'));
                    }
                }, 30000); // 30s
            }
        });
    }

    /**
     * Devolve recurso ao pool
     */
    async returnResource(poolName, resource) {
        const pool = this.resourcePools.get(poolName);
        if (!pool) return;

        // Valida recurso antes de devolver
        if (await pool.validateResource(resource)) {
            pool.available.push(resource);
            pool.stats.returned++;

            // Acorda esperando
            if (pool.waitingQueue.length > 0) {
                const { resolve } = pool.waitingQueue.shift();
                const nextResource = pool.available.pop();
                pool.stats.borrowed++;
                resolve(nextResource);
            }
        } else {
            // Remove recurso inválido
            this.destroyResource(pool, resource);
        }
    }

    /**
     * Cria recurso para pool
     */
    async createResource(pool) {
        const resource = await pool.createResource();
        pool.resources.push(resource);
        pool.available.push(resource);
        pool.stats.created++;
        return resource;
    }

    /**
     * Destroi recurso do pool
     */
    async destroyResource(pool, resource) {
        const index = pool.resources.indexOf(resource);
        if (index > -1) {
            pool.resources.splice(index, 1);
        }

        const availIndex = pool.available.indexOf(resource);
        if (availIndex > -1) {
            pool.available.splice(availIndex, 1);
        }

        if (pool.destroyResource) {
            await pool.destroyResource(resource);
        }
        pool.stats.destroyed++;
    }

    /**
     * Atualiza tempo médio de execução
     */
    updateAverageTime(bulkhead, executionTime) {
        const currentAvg = bulkhead.stats.averageExecutionTime;
        const totalCalls = bulkhead.stats.successfulCalls;
        bulkhead.stats.averageExecutionTime = ((currentAvg * (totalCalls - 1)) + executionTime) / totalCalls;
    }

    /**
     * Obtém estatísticas do bulkhead
     */
    getBulkheadStats(key) {
        const bulkhead = this.bulkheads.get(key);
        if (!bulkhead) return null;

        return {
            ...bulkhead.stats,
            availablePermits: bulkhead.semaphore.available,
            waitingQueueSize: bulkhead.semaphore.waitingQueue.length
        };
    }

    /**
     * Obtém estatísticas do pool de recursos
     */
    getResourcePoolStats(poolName) {
        const pool = this.resourcePools.get(poolName);
        if (!pool) return null;

        return {
            totalResources: pool.resources.length,
            availableResources: pool.available.length,
            waitingQueueSize: pool.waitingQueue.length,
            ...pool.stats
        };
    }

    /**
     * Lista bulkheads
     */
    listBulkheads() {
        return Array.from(this.bulkheads.keys());
    }

    /**
     * Lista pools de recursos
     */
    listResourcePools() {
        return Array.from(this.resourcePools.keys());
    }

    /**
     * Estatísticas gerais
     */
    getStats() {
        const bulkheads = Array.from(this.bulkheads.values());
        const pools = Array.from(this.resourcePools.values());

        return {
            bulkheads: bulkheads.length,
            totalBulkheadCalls: bulkheads.reduce((sum, b) => sum + b.stats.totalCalls, 0),
            totalBulkheadRejections: bulkheads.reduce((sum, b) => sum + b.stats.rejectedCalls, 0),
            resourcePools: pools.length,
            totalPoolResources: pools.reduce((sum, p) => sum + p.resources.length, 0),
            totalAvailableResources: pools.reduce((sum, p) => sum + p.available.length, 0)
        };
    }
}

// Singleton instance
const bulkheadEngine = new BulkheadEngine();

module.exports = bulkheadEngine;