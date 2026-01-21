/**
 * A/B Testing e Feature Flags Engine
 * Motores para testes A/B, feature flags e experimentação controlada
 */

class ABTestingFeatureFlagsEngine {
    constructor() {
        this.experiments = new Map();
        this.featureFlags = new Map();
        this.variants = new Map();
        this.userAssignments = new Map();
        this.metrics = new Map();
        this.audiences = new Map();
        this.rollouts = new Map();
    }

    /**
     * Cria experimento A/B
     */
    createExperiment(experimentId, config) {
        const experiment = {
            id: experimentId,
            name: config.name || experimentId,
            description: config.description || '',
            type: config.type || 'ab-test', // ab-test, multivariate, multi-armed-bandit
            status: 'draft',
            variants: config.variants || [],
            audience: config.audience || {},
            metrics: config.metrics || [],
            hypothesis: config.hypothesis || '',
            startDate: config.startDate || null,
            endDate: config.endDate || null,
            trafficAllocation: config.trafficAllocation || 100, // porcentagem
            randomizationUnit: config.randomizationUnit || 'user', // user, session, device
            confidenceLevel: config.confidenceLevel || 95,
            results: {
                winner: null,
                confidence: 0,
                statisticalSignificance: false,
                effectSize: 0
            },
            data: {
                variantA: { impressions: 0, conversions: 0 },
                variantB: { impressions: 0, conversions: 0 }
            },
            createdAt: new Date()
        };

        this.experiments.set(experimentId, experiment);
        console.log(`Experimento A/B ${experimentId} criado`);
        return experiment;
    }

    /**
     * Inicia experimento
     */
    startExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) {
            throw new Error(`Experimento ${experimentId} não encontrado`);
        }

        experiment.status = 'running';
        experiment.startDate = new Date();

        console.log(`Experimento ${experimentId} iniciado`);
        return experiment;
    }

    /**
     * Para experimento
     */
    stopExperiment(experimentId, winner = null) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) {
            throw new Error(`Experimento ${experimentId} não encontrado`);
        }

        experiment.status = 'completed';
        experiment.endDate = new Date();

        if (winner) {
            experiment.results.winner = winner;
            experiment.results.confidence = this.calculateConfidence(experiment);
            experiment.results.statisticalSignificance = experiment.results.confidence >= experiment.confidenceLevel;
        }

        console.log(`Experimento ${experimentId} parado com vencedor: ${winner}`);
        return experiment;
    }

    /**
     * Atribui usuário/variant a experimento
     */
    assignUserToExperiment(experimentId, userId, context = {}) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment || experiment.status !== 'running') {
            return null; // Não participa do experimento
        }

        // Verificar se usuário está na audiência
        if (!this.isUserInAudience(userId, experiment.audience, context)) {
            return null;
        }

        // Verificar se usuário já foi atribuído
        const userKey = `${experimentId}:${userId}`;
        if (this.userAssignments.has(userKey)) {
            return this.userAssignments.get(userKey);
        }

        // Atribuir variant baseado na randomização
        const variant = this.randomizeVariant(experiment, userId);
        const assignment = {
            experimentId,
            userId,
            variant,
            assignedAt: new Date(),
            context
        };

        this.userAssignments.set(userKey, assignment);

        // Registrar impressão
        this.recordImpression(experimentId, variant);

        return assignment;
    }

    /**
     * Registra conversão para experimento
     */
    recordConversion(experimentId, userId, metricName, value = 1) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) {
            return;
        }

        const userKey = `${experimentId}:${userId}`;
        const assignment = this.userAssignments.get(userKey);
        if (!assignment) {
            return; // Usuário não participou do experimento
        }

        this.recordConversionForVariant(experimentId, assignment.variant, metricName, value);
    }

    /**
     * Obtém resultados do experimento
     */
    getExperimentResults(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) {
            throw new Error(`Experimento ${experimentId} não encontrado`);
        }

        const results = this.calculateExperimentResults(experiment);
        experiment.results = { ...experiment.results, ...results };

        return {
            experimentId,
            status: experiment.status,
            results: experiment.results,
            data: experiment.data,
            metrics: this.calculateStatisticalMetrics(experiment)
        };
    }

    /**
     * Cria feature flag
     */
    createFeatureFlag(flagId, config) {
        const featureFlag = {
            id: flagId,
            name: config.name || flagId,
            description: config.description || '',
            type: config.type || 'boolean', // boolean, string, number, json
            defaultValue: config.defaultValue || false,
            rules: config.rules || [],
            rollout: config.rollout || {
                percentage: 0,
                conditions: []
            },
            status: 'disabled',
            versions: new Map(),
            metrics: {
                evaluations: 0,
                lastEvaluated: null
            },
            createdAt: new Date()
        };

        this.featureFlags.set(flagId, featureFlag);
        console.log(`Feature flag ${flagId} criado`);
        return featureFlag;
    }

    /**
     * Habilita feature flag
     */
    enableFeatureFlag(flagId) {
        const flag = this.featureFlags.get(flagId);
        if (!flag) {
            throw new Error(`Feature flag ${flagId} não encontrado`);
        }

        flag.status = 'enabled';
        console.log(`Feature flag ${flagId} habilitado`);
        return flag;
    }

    /**
     * Desabilita feature flag
     */
    disableFeatureFlag(flagId) {
        const flag = this.featureFlags.get(flagId);
        if (!flag) {
            throw new Error(`Feature flag ${flagId} não encontrado`);
        }

        flag.status = 'disabled';
        console.log(`Feature flag ${flagId} desabilitado`);
        return flag;
    }

    /**
     * Avalia feature flag para usuário
     */
    evaluateFeatureFlag(flagId, userId, context = {}) {
        const flag = this.featureFlags.get(flagId);
        if (!flag) {
            throw new Error(`Feature flag ${flagId} não encontrado`);
        }

        if (flag.status !== 'enabled') {
            flag.metrics.evaluations++;
            flag.metrics.lastEvaluated = new Date();
            return flag.defaultValue;
        }

        // Avaliar regras
        for (const rule of flag.rules) {
            if (this.evaluateRule(rule, userId, context)) {
                flag.metrics.evaluations++;
                flag.metrics.lastEvaluated = new Date();
                return rule.value;
            }
        }

        // Avaliar rollout
        if (this.isUserInRollout(flag.rollout, userId)) {
            flag.metrics.evaluations++;
            flag.metrics.lastEvaluated = new Date();
            return flag.rollout.value !== undefined ? flag.rollout.value : true;
        }

        flag.metrics.evaluations++;
        flag.metrics.lastEvaluated = new Date();
        return flag.defaultValue;
    }

    /**
     * Cria rollout gradual
     */
    createRollout(flagId, rolloutConfig) {
        const flag = this.featureFlags.get(flagId);
        if (!flag) {
            throw new Error(`Feature flag ${flagId} não encontrado`);
        }

        const rollout = {
            id: `rollout_${flagId}_${Date.now()}`,
            flagId,
            stages: rolloutConfig.stages || [],
            currentStage: 0,
            status: 'created',
            schedule: rolloutConfig.schedule || null,
            metrics: {
                totalUsers: 0,
                activatedUsers: 0,
                completionRate: 0
            },
            createdAt: new Date()
        };

        this.rollouts.set(rollout.id, rollout);
        flag.rollout = rollout;

        console.log(`Rollout criado para feature flag ${flagId}`);
        return rollout;
    }

    /**
     * Avança estágio do rollout
     */
    advanceRollout(rolloutId) {
        const rollout = this.rollouts.get(rolloutId);
        if (!rollout) {
            throw new Error(`Rollout ${rolloutId} não encontrado`);
        }

        if (rollout.currentStage < rollout.stages.length - 1) {
            rollout.currentStage++;
            rollout.metrics.completionRate = (rollout.currentStage + 1) / rollout.stages.length;

            const currentStage = rollout.stages[rollout.currentStage];
            const flag = this.featureFlags.get(rollout.flagId);
            if (flag) {
                flag.rollout.percentage = currentStage.percentage;
            }

            console.log(`Rollout ${rolloutId} avançado para estágio ${rollout.currentStage + 1}`);
        }

        return rollout;
    }

    /**
     * Cria audiência
     */
    createAudience(audienceId, config) {
        const audience = {
            id: audienceId,
            name: config.name || audienceId,
            conditions: config.conditions || [],
            size: config.size || null, // tamanho estimado
            description: config.description || '',
            createdAt: new Date()
        };

        this.audiences.set(audienceId, audience);
        console.log(`Audiência ${audienceId} criada`);
        return audience;
    }

    /**
     * Verifica se usuário está na audiência
     */
    isUserInAudience(userId, audienceConfig, context = {}) {
        if (!audienceConfig.conditions || audienceConfig.conditions.length === 0) {
            return true; // Audiência universal
        }

        // Simulação simples de avaliação de condições
        for (const condition of audienceConfig.conditions) {
            const userValue = context[condition.attribute] || this.getUserAttribute(userId, condition.attribute);
            const conditionMet = this.evaluateCondition(userValue, condition.operator, condition.value);

            if (condition.logic === 'AND' && !conditionMet) {
                return false;
            }
            if (condition.logic === 'OR' && conditionMet) {
                return true;
            }
        }

        return audienceConfig.conditions.some(c => c.logic === 'OR') ? false : true;
    }

    /**
     * Cria variant para experimento
     */
    createVariant(variantId, config) {
        const variant = {
            id: variantId,
            name: config.name || variantId,
            description: config.description || '',
            changes: config.changes || {}, // mudanças em relação ao controle
            traffic: config.traffic || 50, // porcentagem de tráfego
            status: 'active',
            metrics: {
                impressions: 0,
                conversions: 0,
                conversionRate: 0
            },
            createdAt: new Date()
        };

        this.variants.set(variantId, variant);
        console.log(`Variant ${variantId} criado`);
        return variant;
    }

    /**
     * Métodos auxiliares para A/B testing
     */

    randomizeVariant(experiment, userId) {
        // Hash consistente para randomização
        const hash = this.simpleHash(`${experiment.id}:${userId}`);
        const normalizedHash = (hash % 100) / 100;

        let cumulativeTraffic = 0;
        for (const variant of experiment.variants) {
            cumulativeTraffic += variant.traffic / 100;
            if (normalizedHash <= cumulativeTraffic) {
                return variant.id;
            }
        }

        return experiment.variants[0].id; // fallback
    }

    recordImpression(experimentId, variantId) {
        const experiment = this.experiments.get(experimentId);
        if (experiment && experiment.data[variantId]) {
            experiment.data[variantId].impressions++;
        }
    }

    recordConversionForVariant(experimentId, variantId, metricName, value) {
        const experiment = this.experiments.get(experimentId);
        if (experiment && experiment.data[variantId]) {
            if (metricName === 'conversion') {
                experiment.data[variantId].conversions += value;
            }
        }
    }

    calculateExperimentResults(experiment) {
        const variants = experiment.variants;
        if (variants.length < 2) return {};

        const control = experiment.data.variantA || { impressions: 0, conversions: 0 };
        const treatment = experiment.data.variantB || { impressions: 0, conversions: 0 };

        const controlRate = control.impressions > 0 ? control.conversions / control.impressions : 0;
        const treatmentRate = treatment.impressions > 0 ? treatment.conversions / treatment.impressions : 0;

        const improvement = treatmentRate > controlRate ?
            ((treatmentRate - controlRate) / controlRate) * 100 : 0;

        return {
            controlConversionRate: controlRate,
            treatmentConversionRate: treatmentRate,
            improvement: improvement,
            winner: treatmentRate > controlRate ? 'variantB' : 'variantA',
            effectSize: Math.abs(treatmentRate - controlRate)
        };
    }

    calculateConfidence(experiment) {
        // Cálculo simplificado de confiança estatística
        const control = experiment.data.variantA;
        const treatment = experiment.data.variantB;

        if (!control || !treatment || control.impressions === 0 || treatment.impressions === 0) {
            return 0;
        }

        // Teste Z simplificado
        const p1 = control.conversions / control.impressions;
        const p2 = treatment.conversions / treatment.impressions;
        const n1 = control.impressions;
        const n2 = treatment.impressions;

        const se = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);
        const z = Math.abs(p2 - p1) / se;

        // Aproximação da confiança baseada em Z-score
        return Math.min(z * 10, 99.9); // Valor simulado
    }

    calculateStatisticalMetrics(experiment) {
        return {
            sampleSize: experiment.data.variantA.impressions + experiment.data.variantB.impressions,
            power: 0.8, // potência estatística simulada
            minimumDetectableEffect: 0.05,
            confidenceInterval: [0.02, 0.08]
        };
    }

    /**
     * Métodos auxiliares para feature flags
     */

    evaluateRule(rule, userId, context) {
        // Avaliação simplificada de regras
        if (rule.type === 'user-percentage') {
            const hash = this.simpleHash(userId);
            const percentage = (hash % 100) / 100;
            return percentage <= (rule.percentage / 100);
        }

        if (rule.type === 'user-attribute') {
            const userValue = context[rule.attribute] || this.getUserAttribute(userId, rule.attribute);
            return this.evaluateCondition(userValue, rule.operator, rule.value);
        }

        if (rule.type === 'time-based') {
            const now = new Date();
            const startTime = new Date(rule.startTime);
            const endTime = new Date(rule.endTime);
            return now >= startTime && now <= endTime;
        }

        return false;
    }

    isUserInRollout(rollout, userId) {
        if (!rollout || rollout.percentage === 0) return false;

        const hash = this.simpleHash(userId);
        const percentage = (hash % 100) / 100;
        return percentage <= (rollout.percentage / 100);
    }

    evaluateCondition(value, operator, expectedValue) {
        switch (operator) {
            case 'equals': return value === expectedValue;
            case 'not_equals': return value !== expectedValue;
            case 'contains': return String(value).includes(String(expectedValue));
            case 'greater_than': return Number(value) > Number(expectedValue);
            case 'less_than': return Number(value) < Number(expectedValue);
            default: return false;
        }
    }

    getUserAttribute(userId, attribute) {
        // Simulação de atributos de usuário
        const userAttributes = {
            'country': ['US', 'BR', 'UK', 'DE'][Math.floor(Math.random() * 4)],
            'age': Math.floor(Math.random() * 60) + 18,
            'subscription': ['free', 'premium', 'enterprise'][Math.floor(Math.random() * 3)]
        };

        return userAttributes[attribute] || null;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Estatísticas gerais
     */
    getStats() {
        return {
            experiments: this.experiments.size,
            runningExperiments: Array.from(this.experiments.values()).filter(e => e.status === 'running').length,
            completedExperiments: Array.from(this.experiments.values()).filter(e => e.status === 'completed').length,
            featureFlags: this.featureFlags.size,
            enabledFeatureFlags: Array.from(this.featureFlags.values()).filter(f => f.status === 'enabled').length,
            variants: this.variants.size,
            audiences: this.audiences.size,
            rollouts: this.rollouts.size,
            totalUserAssignments: this.userAssignments.size
        };
    }

    /**
     * Lista experimentos
     */
    listExperiments() {
        return Array.from(this.experiments.values()).map(exp => ({
            id: exp.id,
            name: exp.name,
            status: exp.status,
            variants: exp.variants.length,
            winner: exp.results.winner,
            confidence: exp.results.confidence
        }));
    }

    /**
     * Lista feature flags
     */
    listFeatureFlags() {
        return Array.from(this.featureFlags.values()).map(flag => ({
            id: flag.id,
            name: flag.name,
            status: flag.status,
            type: flag.type,
            evaluations: flag.metrics.evaluations
        }));
    }
}

// Singleton instance
const abTestingFeatureFlagsEngine = new ABTestingFeatureFlagsEngine();

module.exports = abTestingFeatureFlagsEngine;