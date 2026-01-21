/**
 * Rate Limiting Engine com Quotas
 * Implementa controle de taxa e quotas de uso
 */
class RateLimitingEngine {
    constructor() {
        this.limiters = new Map(); // Limiters por chave
        this.quotas = new Map(); // Quotas por usuário/recurso
        this.rules = new Map(); // Regras de rate limiting
    }

    /**
     * Cria limiter
     */
    createLimiter(key, config = {}) {
        const limiter = {
            key,
            type: config.type || 'sliding-window', // fixed-window, sliding-window, token-bucket, leaky-bucket
            windowMs: config.windowMs || 60000, // 1min
            maxRequests: config.maxRequests || 100,
            requests: [],
            tokens: config.maxRequests || 100,
            lastRefill: Date.now(),
            refillRate: config.refillRate || (config.maxRequests / (config.windowMs / 1000)), // tokens por segundo
            stats: {
                totalRequests: 0,
                allowedRequests: 0,
                rejectedRequests: 0,
                resetTime: Date.now() + (config.windowMs || 60000)
            }
        };

        this.limiters.set(key, limiter);
        return limiter;
    }

    /**
     * Verifica se requisição é permitida
     */
    async checkLimit(key, config = {}) {
        const limiter = this.limiters.get(key) || this.createLimiter(key, config);
        limiter.stats.totalRequests++;

        const now = Date.now();
        let allowed = false;

        switch (limiter.type) {
            case 'fixed-window':
                allowed = this.checkFixedWindow(limiter, now);
                break;
            case 'sliding-window':
                allowed = this.checkSlidingWindow(limiter, now);
                break;
            case 'token-bucket':
                allowed = this.checkTokenBucket(limiter, now);
                break;
            case 'leaky-bucket':
                allowed = this.checkLeakyBucket(limiter, now);
                break;
            default:
                allowed = true;
        }

        if (allowed) {
            limiter.stats.allowedRequests++;
        } else {
            limiter.stats.rejectedRequests++;
        }

        return {
            allowed,
            remaining: this.getRemainingRequests(limiter),
            resetTime: limiter.stats.resetTime,
            totalRequests: limiter.stats.totalRequests
        };
    }

    /**
     * Fixed Window: conta requisições em janela fixa
     */
    checkFixedWindow(limiter, now) {
        if (now >= limiter.stats.resetTime) {
            // Reset janela
            limiter.requests = [];
            limiter.stats.resetTime = now + limiter.windowMs;
            limiter.stats.allowedRequests = 0;
            limiter.stats.rejectedRequests = 0;
        }

        if (limiter.requests.length < limiter.maxRequests) {
            limiter.requests.push(now);
            return true;
        }

        return false;
    }

    /**
     * Sliding Window: remove requisições antigas da janela
     */
    checkSlidingWindow(limiter, now) {
        // Remove requisições fora da janela
        limiter.requests = limiter.requests.filter(time => now - time < limiter.windowMs);

        if (limiter.requests.length < limiter.maxRequests) {
            limiter.requests.push(now);
            return true;
        }

        return false;
    }

    /**
     * Token Bucket: tokens são adicionados a uma taxa constante
     */
    checkTokenBucket(limiter, now) {
        // Refill tokens
        const elapsed = now - limiter.lastRefill;
        const tokensToAdd = Math.floor((elapsed / 1000) * limiter.refillRate);
        limiter.tokens = Math.min(limiter.maxRequests, limiter.tokens + tokensToAdd);
        limiter.lastRefill = now;

        if (limiter.tokens > 0) {
            limiter.tokens--;
            return true;
        }

        return false;
    }

    /**
     * Leaky Bucket: requisições vazam a uma taxa constante
     */
    checkLeakyBucket(limiter, now) {
        // Simulação simplificada - em produção precisaria de queue
        const elapsed = now - limiter.lastRefill;
        const leaked = Math.floor((elapsed / 1000) * limiter.refillRate);
        limiter.tokens = Math.min(limiter.maxRequests, limiter.tokens + leaked);
        limiter.lastRefill = now;

        if (limiter.tokens > 0) {
            limiter.tokens--;
            return true;
        }

        return false;
    }

    /**
     * Obtém requisições restantes
     */
    getRemainingRequests(limiter) {
        switch (limiter.type) {
            case 'fixed-window':
            case 'sliding-window':
                return Math.max(0, limiter.maxRequests - limiter.requests.length);
            case 'token-bucket':
            case 'leaky-bucket':
                return limiter.tokens;
            default:
                return limiter.maxRequests;
        }
    }

    /**
     * Cria quota para usuário/recurso
     */
    createQuota(quotaKey, config = {}) {
        const quota = {
            key: quotaKey,
            type: config.type || 'monthly', // daily, weekly, monthly, yearly
            limit: config.limit || 1000,
            used: 0,
            resetTime: this.calculateResetTime(config.type || 'monthly'),
            stats: {
                totalUsed: 0,
                resetCount: 0,
                lastReset: new Date().toISOString()
            }
        };

        this.quotas.set(quotaKey, quota);
        return quota;
    }

    /**
     * Verifica quota
     */
    async checkQuota(quotaKey, amount = 1, config = {}) {
        const quota = this.quotas.get(quotaKey) || this.createQuota(quotaKey, config);

        const now = Date.now();

        // Reset se necessário
        if (now >= quota.resetTime) {
            quota.used = 0;
            quota.resetTime = this.calculateResetTime(quota.type);
            quota.stats.resetCount++;
            quota.stats.lastReset = new Date().toISOString();
        }

        if (quota.used + amount <= quota.limit) {
            quota.used += amount;
            quota.stats.totalUsed += amount;
            return {
                allowed: true,
                used: quota.used,
                remaining: quota.limit - quota.used,
                resetTime: quota.resetTime
            };
        }

        return {
            allowed: false,
            used: quota.used,
            remaining: quota.limit - quota.used,
            resetTime: quota.resetTime
        };
    }

    /**
     * Calcula tempo de reset baseado no tipo
     */
    calculateResetTime(type) {
        const now = new Date();

        switch (type) {
            case 'daily':
                now.setDate(now.getDate() + 1);
                now.setHours(0, 0, 0, 0);
                break;
            case 'weekly':
                const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
                now.setDate(now.getDate() + daysUntilMonday);
                now.setHours(0, 0, 0, 0);
                break;
            case 'monthly':
                now.setMonth(now.getMonth() + 1);
                now.setDate(1);
                now.setHours(0, 0, 0, 0);
                break;
            case 'yearly':
                now.setFullYear(now.getFullYear() + 1);
                now.setMonth(0, 1);
                now.setHours(0, 0, 0, 0);
                break;
        }

        return now.getTime();
    }

    /**
     * Cria regra de rate limiting
     */
    createRule(ruleName, conditions, actions) {
        this.rules.set(ruleName, {
            name: ruleName,
            conditions,
            actions,
            enabled: true,
            stats: {
                evaluated: 0,
                triggered: 0
            }
        });
    }

    /**
     * Avalia regras
     */
    async evaluateRules(request) {
        const results = [];

        for (const [ruleName, rule] of this.rules) {
            if (!rule.enabled) continue;

            rule.stats.evaluated++;

            const conditionMet = await this.evaluateConditions(rule.conditions, request);

            if (conditionMet) {
                rule.stats.triggered++;
                const actionResult = await this.executeActions(rule.actions, request);
                results.push({
                    rule: ruleName,
                    triggered: true,
                    actions: actionResult
                });
            }
        }

        return results;
    }

    /**
     * Avalia condições da regra
     */
    async evaluateConditions(conditions, request) {
        for (const condition of conditions) {
            const met = await this.evaluateCondition(condition, request);
            if (!met) return false;
        }
        return true;
    }

    /**
     * Avalia condição individual
     */
    async evaluateCondition(condition, request) {
        switch (condition.type) {
            case 'ip-range':
                return this.checkIpRange(request.ip, condition.value);
            case 'user-agent':
                return request.userAgent?.includes(condition.value);
            case 'path':
                return request.path?.startsWith(condition.value);
            case 'method':
                return request.method === condition.value;
            case 'header':
                return request.headers?.[condition.key] === condition.value;
            default:
                return false;
        }
    }

    /**
     * Executa ações da regra
     */
    async executeActions(actions, request) {
        const results = [];

        for (const action of actions) {
            const result = await this.executeAction(action, request);
            results.push(result);
        }

        return results;
    }

    /**
     * Executa ação individual
     */
    async executeAction(action, request) {
        switch (action.type) {
            case 'block':
                return { type: 'block', reason: action.reason || 'Blocked by rule' };
            case 'limit':
                const limitResult = await this.checkLimit(action.key, action.config);
                return { type: 'limit', result: limitResult };
            case 'quota':
                const quotaResult = await this.checkQuota(action.key, action.amount, action.config);
                return { type: 'quota', result: quotaResult };
            case 'log':
                console.log(`Rule triggered: ${action.message}`, request);
                return { type: 'log', logged: true };
            default:
                return { type: 'unknown', action };
        }
    }

    /**
     * Verifica range de IP (simplificado)
     */
    checkIpRange(ip, range) {
        // Implementação simplificada
        return ip.startsWith(range.split('/')[0]);
    }

    /**
     * Obtém estatísticas do limiter
     */
    getLimiterStats(key) {
        const limiter = this.limiters.get(key);
        if (!limiter) return null;

        return {
            ...limiter.stats,
            remaining: this.getRemainingRequests(limiter),
            type: limiter.type
        };
    }

    /**
     * Obtém estatísticas da quota
     */
    getQuotaStats(quotaKey) {
        const quota = this.quotas.get(quotaKey);
        if (!quota) return null;

        return {
            used: quota.used,
            limit: quota.limit,
            remaining: quota.limit - quota.used,
            resetTime: quota.resetTime,
            ...quota.stats
        };
    }

    /**
     * Lista limiters
     */
    listLimiters() {
        return Array.from(this.limiters.keys());
    }

    /**
     * Lista quotas
     */
    listQuotas() {
        return Array.from(this.quotas.keys());
    }

    /**
     * Estatísticas gerais
     */
    getStats() {
        const limiters = Array.from(this.limiters.values());
        const quotas = Array.from(this.quotas.values());

        return {
            limiters: limiters.length,
            totalLimiterRequests: limiters.reduce((sum, l) => sum + l.stats.totalRequests, 0),
            totalLimiterRejections: limiters.reduce((sum, l) => sum + l.stats.rejectedRequests, 0),
            quotas: quotas.length,
            totalQuotaUsed: quotas.reduce((sum, q) => sum + q.stats.totalUsed, 0),
            rules: this.rules.size
        };
    }
}

// Singleton instance
const rateLimitingEngine = new RateLimitingEngine();

module.exports = rateLimitingEngine;