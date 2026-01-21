/**
 * Circuit Breaker Engine com Retry Logic
 * Implementa padrão circuit breaker para resiliência
 */
class CircuitBreakerEngine {
    constructor() {
        this.breakers = new Map(); // Circuit breakers por chave
        this.states = {
            CLOSED: 'closed',     // Normal - permite todas as chamadas
            OPEN: 'open',         // Falha - rejeita chamadas imediatamente
            HALF_OPEN: 'half-open' // Teste - permite chamadas limitadas
        };
    }

    /**
     * Cria ou obtém circuit breaker
     */
    getBreaker(key, config = {}) {
        if (!this.breakers.has(key)) {
            this.breakers.set(key, {
                state: this.states.CLOSED,
                failures: 0,
                successes: 0,
                lastFailureTime: null,
                nextAttemptTime: null,
                config: {
                    failureThreshold: config.failureThreshold || 5,     // Falhas para abrir
                    recoveryTimeout: config.recoveryTimeout || 60000,   // Tempo para tentar fechar (1min)
                    successThreshold: config.successThreshold || 3,     // Sucessos para fechar
                    monitoringPeriod: config.monitoringPeriod || 10000, // Período de monitoramento (10s)
                    ...config
                },
                stats: {
                    totalCalls: 0,
                    successfulCalls: 0,
                    failedCalls: 0,
                    rejectedCalls: 0
                }
            });
        }
        return this.breakers.get(key);
    }

    /**
     * Executa função com circuit breaker
     */
    async execute(key, fn, config = {}) {
        const breaker = this.getBreaker(key, config);
        breaker.stats.totalCalls++;

        // Verifica se pode executar
        if (!this.canExecute(breaker)) {
            breaker.stats.rejectedCalls++;
            throw new Error(`Circuit breaker ${key} is ${breaker.state}`);
        }

        try {
            const result = await fn();
            this.onSuccess(breaker);
            breaker.stats.successfulCalls++;
            return result;
        } catch (error) {
            this.onFailure(breaker);
            breaker.stats.failedCalls++;
            throw error;
        }
    }

    /**
     * Executa com retry logic
     */
    async executeWithRetry(key, fn, retryConfig = {}) {
        const config = {
            maxRetries: retryConfig.maxRetries || 3,
            backoffMultiplier: retryConfig.backoffMultiplier || 2,
            initialDelay: retryConfig.initialDelay || 1000,
            maxDelay: retryConfig.maxDelay || 30000,
            ...retryConfig
        };

        let lastError;
        let delay = config.initialDelay;

        for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
            try {
                return await this.execute(key, fn);
            } catch (error) {
                lastError = error;

                if (attempt < config.maxRetries) {
                    await this.delay(delay);
                    delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
                }
            }
        }

        throw lastError;
    }

    /**
     * Verifica se pode executar
     */
    canExecute(breaker) {
        const now = Date.now();

        switch (breaker.state) {
            case this.states.CLOSED:
                return true;

            case this.states.OPEN:
                if (now >= breaker.nextAttemptTime) {
                    breaker.state = this.states.HALF_OPEN;
                    breaker.successes = 0;
                    return true;
                }
                return false;

            case this.states.HALF_OPEN:
                return true;

            default:
                return false;
        }
    }

    /**
     * Manipula sucesso
     */
    onSuccess(breaker) {
        if (breaker.state === this.states.HALF_OPEN) {
            breaker.successes++;
            if (breaker.successes >= breaker.config.successThreshold) {
                this.closeBreaker(breaker);
            }
        }
    }

    /**
     * Manipula falha
     */
    onFailure(breaker) {
        breaker.failures++;

        if (breaker.state === this.states.HALF_OPEN) {
            this.openBreaker(breaker);
        } else if (breaker.state === this.states.CLOSED &&
            breaker.failures >= breaker.config.failureThreshold) {
            this.openBreaker(breaker);
        }
    }

    /**
     * Abre circuit breaker
     */
    openBreaker(breaker) {
        breaker.state = this.states.OPEN;
        breaker.lastFailureTime = Date.now();
        breaker.nextAttemptTime = Date.now() + breaker.config.recoveryTimeout;
    }

    /**
     * Fecha circuit breaker
     */
    closeBreaker(breaker) {
        breaker.state = this.states.CLOSED;
        breaker.failures = 0;
        breaker.successes = 0;
    }

    /**
     * Força estado do breaker
     */
    setBreakerState(key, state) {
        const breaker = this.breakers.get(key);
        if (breaker) {
            breaker.state = state;
            if (state === this.states.CLOSED) {
                breaker.failures = 0;
                breaker.successes = 0;
            }
        }
    }

    /**
     * Obtém estado do breaker
     */
    getBreakerState(key) {
        const breaker = this.breakers.get(key);
        return breaker ? breaker.state : null;
    }

    /**
     * Obtém estatísticas do breaker
     */
    getBreakerStats(key) {
        const breaker = this.breakers.get(key);
        if (!breaker) return null;

        const successRate = breaker.stats.totalCalls > 0 ?
            (breaker.stats.successfulCalls / breaker.stats.totalCalls) * 100 : 0;

        return {
            state: breaker.state,
            failures: breaker.failures,
            successes: breaker.successes,
            stats: { ...breaker.stats, successRate },
            config: breaker.config,
            lastFailureTime: breaker.lastFailureTime,
            nextAttemptTime: breaker.nextAttemptTime
        };
    }

    /**
     * Lista todos os breakers
     */
    listBreakers() {
        const breakers = [];
        for (const [key, breaker] of this.breakers) {
            breakers.push({
                key,
                state: breaker.state,
                stats: breaker.stats
            });
        }
        return breakers;
    }

    /**
     * Reset breaker
     */
    resetBreaker(key) {
        const breaker = this.breakers.get(key);
        if (breaker) {
            this.closeBreaker(breaker);
        }
    }

    /**
     * Delay utilitário
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Estatísticas gerais
     */
    getStats() {
        const totalBreakers = this.breakers.size;
        const openBreakers = Array.from(this.breakers.values())
            .filter(b => b.state === this.states.OPEN).length;
        const halfOpenBreakers = Array.from(this.breakers.values())
            .filter(b => b.state === this.states.HALF_OPEN).length;

        const totalCalls = Array.from(this.breakers.values())
            .reduce((sum, b) => sum + b.stats.totalCalls, 0);
        const totalFailures = Array.from(this.breakers.values())
            .reduce((sum, b) => sum + b.stats.failedCalls, 0);

        return {
            totalBreakers,
            openBreakers,
            halfOpenBreakers,
            closedBreakers: totalBreakers - openBreakers - halfOpenBreakers,
            totalCalls,
            totalFailures,
            failureRate: totalCalls > 0 ? (totalFailures / totalCalls) * 100 : 0
        };
    }
}

// Singleton instance
const circuitBreakerEngine = new CircuitBreakerEngine();

module.exports = circuitBreakerEngine;