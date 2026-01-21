/**
 * Database Sharding Engine com Read Replicas
 * Implementa sharding de banco de dados e réplicas de leitura
 */
class DatabaseShardingEngine {
    constructor() {
        this.shards = new Map(); // Shards de banco
        this.replicas = new Map(); // Réplicas de leitura
        this.shardingStrategy = null; // Estratégia de sharding
        this.routingRules = new Map(); // Regras de roteamento
        this.connectionPools = new Map(); // Pools de conexões
        this.stats = new Map(); // Estatísticas por shard
    }

    /**
     * Define estratégia de sharding
     */
    setShardingStrategy(strategy) {
        this.shardingStrategy = strategy;
    }

    /**
     * Adiciona shard
     */
    addShard(shardId, config) {
        const shard = {
            id: shardId,
            type: config.type || 'primary', // primary, replica
            connectionString: config.connectionString,
            database: config.database,
            tables: config.tables || [],
            range: config.range, // Para range-based sharding
            hashKey: config.hashKey, // Para hash-based sharding
            status: 'connecting',
            stats: {
                connections: 0,
                queries: 0,
                writes: 0,
                reads: 0,
                errors: 0,
                avgQueryTime: 0
            }
        };

        this.shards.set(shardId, shard);
        this.stats.set(shardId, shard.stats);

        // Simula conexão
        this.connectShard(shardId);

        return shard;
    }

    /**
     * Adiciona réplica de leitura
     */
    addReadReplica(primaryShardId, replicaConfig) {
        const replicaId = `${primaryShardId}_replica_${Date.now()}`;

        const replica = {
            id: replicaId,
            primaryShardId,
            connectionString: replicaConfig.connectionString,
            lag: 0, // Lag de replicação em ms
            status: 'connecting',
            stats: {
                connections: 0,
                queries: 0,
                reads: 0,
                errors: 0,
                avgQueryTime: 0
            }
        };

        if (!this.replicas.has(primaryShardId)) {
            this.replicas.set(primaryShardId, []);
        }
        this.replicas.get(primaryShardId).push(replica);

        // Simula conexão
        this.connectReplica(replicaId);

        return replica;
    }

    /**
     * Conecta shard (simulação)
     */
    async connectShard(shardId) {
        const shard = this.shards.get(shardId);
        if (!shard) return;

        // Simula tempo de conexão
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

        shard.status = 'connected';
        console.log(`Shard ${shardId} connected`);
    }

    /**
     * Conecta réplica (simulação)
     */
    async connectReplica(replicaId) {
        // Simula tempo de conexão
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

        // Encontra réplica e marca como conectada
        for (const replicas of this.replicas.values()) {
            const replica = replicas.find(r => r.id === replicaId);
            if (replica) {
                replica.status = 'connected';
                console.log(`Replica ${replicaId} connected`);
                break;
            }
        }
    }

    /**
     * Determina shard para uma chave
     */
    getShardForKey(key, operation = 'read') {
        if (!this.shardingStrategy) {
            throw new Error('No sharding strategy defined');
        }

        const shardIds = Array.from(this.shards.keys());

        switch (this.shardingStrategy.type) {
            case 'range-based':
                return this.getShardByRange(key, shardIds);

            case 'hash-based':
                return this.getShardByHash(key, shardIds);

            case 'list-based':
                return this.getShardByList(key, shardIds);

            default:
                // Round-robin simples
                const index = Math.abs(this.hashCode(key)) % shardIds.length;
                return shardIds[index];
        }
    }

    /**
     * Shard por range
     */
    getShardByRange(key, shardIds) {
        for (const shardId of shardIds) {
            const shard = this.shards.get(shardId);
            if (shard.range && key >= shard.range.min && key <= shard.range.max) {
                return shardId;
            }
        }
        return shardIds[0]; // Fallback
    }

    /**
     * Shard por hash
     */
    getShardByHash(key, shardIds) {
        const hash = this.hashCode(key);
        const index = Math.abs(hash) % shardIds.length;
        return shardIds[index];
    }

    /**
     * Shard por lista
     */
    getShardByList(key, shardIds) {
        for (const shardId of shardIds) {
            const shard = this.shards.get(shardId);
            if (shard.list && shard.list.includes(key)) {
                return shardId;
            }
        }
        return shardIds[0]; // Fallback
    }

    /**
     * Executa query com roteamento automático
     */
    async executeQuery(query, options = {}) {
        const { key, operation = 'read', useReplica = true } = options;

        let targetShardId = null;
        let isReplica = false;

        if (operation === 'write') {
            // Writes sempre vão para primary
            targetShardId = this.getShardForKey(key, 'write');
        } else if (useReplica && this.hasReplicas(key)) {
            // Reads podem usar réplicas
            const replicaInfo = this.getReadReplica(key);
            targetShardId = replicaInfo.shardId;
            isReplica = replicaInfo.isReplica;
        } else {
            // Read do primary
            targetShardId = this.getShardForKey(key, 'read');
        }

        const startTime = Date.now();
        let result = null;
        let error = null;

        try {
            result = await this.executeOnShard(targetShardId, query, isReplica);
        } catch (err) {
            error = err;
            throw err;
        } finally {
            const executionTime = Date.now() - startTime;
            this.recordStats(targetShardId, operation, executionTime, !!error, isReplica);
        }

        return result;
    }

    /**
     * Executa query em shard específico
     */
    async executeOnShard(shardId, query, isReplica = false) {
        const shard = this.shards.get(shardId);
        if (!shard || shard.status !== 'connected') {
            throw new Error(`Shard ${shardId} not available`);
        }

        // Simula latência de query
        const baseLatency = isReplica ? 50 : 100; // Réplicas mais rápidas
        const latency = baseLatency + Math.random() * 200;

        await new Promise(resolve => setTimeout(resolve, latency));

        // Simula falha ocasional
        if (Math.random() < 0.02) { // 2% chance de erro
            throw new Error('Database query failed');
        }

        // Simula resultado
        return {
            rows: [
                { id: Math.floor(Math.random() * 1000), data: `Result from ${isReplica ? 'replica' : 'primary'} ${shardId}` }
            ],
            rowCount: 1,
            executionTime: latency
        };
    }

    /**
     * Verifica se há réplicas disponíveis
     */
    hasReplicas(key) {
        const primaryShardId = this.getShardForKey(key, 'read');
        const replicas = this.replicas.get(primaryShardId);
        return replicas && replicas.some(r => r.status === 'connected');
    }

    /**
     * Obtém réplica de leitura
     */
    getReadReplica(key) {
        const primaryShardId = this.getShardForKey(key, 'read');
        const replicas = this.replicas.get(primaryShardId);

        if (replicas && replicas.length > 0) {
            // Load balancing simples - round-robin
            const healthyReplicas = replicas.filter(r => r.status === 'connected');
            if (healthyReplicas.length > 0) {
                const index = Math.floor(Math.random() * healthyReplicas.length);
                return {
                    shardId: healthyReplicas[index].id,
                    isReplica: true
                };
            }
        }

        // Fallback para primary
        return {
            shardId: primaryShardId,
            isReplica: false
        };
    }

    /**
     * Balanceia carga entre shards
     */
    async rebalanceShards() {
        // Implementação simplificada - em produção seria mais complexa
        const shardStats = Array.from(this.shards.entries()).map(([id, shard]) => ({
            id,
            load: shard.stats.queries
        }));

        shardStats.sort((a, b) => b.load - a.load);

        console.log('Shard rebalancing needed:', shardStats);
        // Lógica de rebalanceamento seria implementada aqui
    }

    /**
     * Adiciona novo shard dinamicamente
     */
    async addShardOnline(shardId, config) {
        await this.addShard(shardId, config);

        // Migrar dados se necessário
        if (this.shardingStrategy.type === 'hash-based') {
            await this.reshardData(shardId);
        }
    }

    /**
     * Re-sharding de dados (simulação)
     */
    async reshardData(newShardId) {
        console.log(`Resharding data for new shard ${newShardId}`);

        // Simula migração de dados
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Redistribui conexões
        this.rebalanceShards();

        console.log(`Resharding completed for ${newShardId}`);
    }

    /**
     * Registra estatísticas
     */
    recordStats(shardId, operation, executionTime, hadError, isReplica) {
        const stats = this.stats.get(shardId);
        if (!stats) return;

        stats.queries++;

        if (operation === 'write') {
            stats.writes++;
        } else {
            stats.reads++;
        }

        if (hadError) {
            stats.errors++;
        }

        // Atualiza tempo médio
        const currentAvg = stats.avgQueryTime;
        const totalQueries = stats.queries;
        stats.avgQueryTime = ((currentAvg * (totalQueries - 1)) + executionTime) / totalQueries;
    }

    /**
     * Hash code simples
     */
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }

    /**
     * Obtém estatísticas de um shard
     */
    getShardStats(shardId) {
        const shard = this.shards.get(shardId);
        if (!shard) return null;

        const replicas = this.replicas.get(shardId) || [];
        const replicaStats = replicas.map(r => ({
            id: r.id,
            status: r.status,
            lag: r.lag,
            stats: r.stats
        }));

        return {
            ...shard,
            replicas: replicaStats,
            replicaCount: replicas.length
        };
    }

    /**
     * Lista todos os shards
     */
    listShards() {
        return Array.from(this.shards.keys());
    }

    /**
     * Estatísticas gerais
     */
    getStats() {
        const shards = Array.from(this.shards.values());
        const allReplicas = Array.from(this.replicas.values()).flat();

        return {
            shards: shards.length,
            replicas: allReplicas.length,
            totalQueries: shards.reduce((sum, s) => sum + s.stats.queries, 0),
            totalWrites: shards.reduce((sum, s) => sum + s.stats.writes, 0),
            totalReads: shards.reduce((sum, s) => sum + s.stats.reads, 0),
            totalErrors: shards.reduce((sum, s) => sum + s.stats.errors, 0),
            replicaQueries: allReplicas.reduce((sum, r) => sum + r.stats.queries, 0)
        };
    }

    /**
     * Health check de todos os shards
     */
    async healthCheck() {
        const results = {};

        for (const [shardId, shard] of this.shards) {
            try {
                await this.executeOnShard(shardId, 'SELECT 1', false);
                results[shardId] = { status: 'healthy', latency: Math.random() * 100 + 10 };
            } catch (error) {
                results[shardId] = { status: 'unhealthy', error: error.message };
            }
        }

        return results;
    }
}

// Singleton instance
const databaseShardingEngine = new DatabaseShardingEngine();

module.exports = databaseShardingEngine;