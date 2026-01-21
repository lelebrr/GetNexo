/**
 * Auto-Scaling Engine - GetNexo Platform
 *
 * @description Sistema inteligente de escalabilidade automática horizontal e vertical
 * @version 1.0.0
 * @author GetNexo SRE Team
 */

class AutoScalingEngine {
    constructor() {
        this.scalingRules = new Map();
        this.scalingHistory = [];
        this.currentScaling = new Map();
        this.cooldowns = new Map();

        this.config = {
            minReplicas: 2,
            maxReplicas: 20,
            scaleUpCooldown: 300000, // 5 minutos
            scaleDownCooldown: 600000, // 10 minutos
            stabilizationTime: 300000 // 5 minutos para estabilizar
        };

        this.initialize();
    }

    async initialize() {
        this.loadDefaultRules();
        this.startMonitoring();

        console.log('📈 Auto-Scaling Engine inicializado');
    }

    // Regras padrão de escalabilidade
    loadDefaultRules() {
        // Scale up baseado em CPU
        this.addRule({
            id: 'cpu_scale_up',
            name: 'Scale Up por CPU Alta',
            type: 'horizontal',
            direction: 'up',
            condition: (metrics) => metrics.cpu > 80 && metrics.cpuTrend === 'increasing',
            action: 'scale_replicas',
            factor: 1.5, // +50% de réplicas
            cooldown: this.config.scaleUpCooldown,
            minThreshold: 75,
            maxThreshold: 95
        });

        // Scale down baseado em CPU baixa
        this.addRule({
            id: 'cpu_scale_down',
            name: 'Scale Down por CPU Baixa',
            type: 'horizontal',
            direction: 'down',
            condition: (metrics) => metrics.cpu < 30 && metrics.cpuTrend === 'decreasing',
            action: 'scale_replicas',
            factor: 0.7, // -30% de réplicas
            cooldown: this.config.scaleDownCooldown,
            minThreshold: 10,
            maxThreshold: 40
        });

        // Scale up baseado em latência
        this.addRule({
            id: 'latency_scale_up',
            name: 'Scale Up por Latência Alta',
            type: 'horizontal',
            direction: 'up',
            condition: (metrics) => metrics.avgResponseTime > 1000 && metrics.requestRate > 100,
            action: 'scale_replicas',
            factor: 2.0, // +100% de réplicas
            cooldown: this.config.scaleUpCooldown,
            minThreshold: 800,
            maxThreshold: 2000
        });

        // Scale up baseado em queue depth
        this.addRule({
            id: 'queue_scale_up',
            name: 'Scale Up por Fila Profunda',
            type: 'horizontal',
            direction: 'up',
            condition: (metrics) => metrics.queueDepth > 1000,
            action: 'scale_replicas',
            factor: 1.3, // +30% de réplicas
            cooldown: this.config.scaleUpCooldown,
            minThreshold: 500,
            maxThreshold: 5000
        });

        // Vertical scaling - aumentar CPU limits
        this.addRule({
            id: 'vertical_cpu_scale',
            name: 'Vertical Scale - CPU',
            type: 'vertical',
            resource: 'cpu',
            condition: (metrics) => metrics.cpu > 85 && this.currentScaling.get('replicas') >= this.config.maxReplicas,
            action: 'increase_limits',
            increment: '500m',
            cooldown: 1800000, // 30 minutos
            maxLimit: '4000m'
        });

        // Vertical scaling - aumentar memória
        this.addRule({
            id: 'vertical_memory_scale',
            name: 'Vertical Scale - Memória',
            type: 'vertical',
            resource: 'memory',
            condition: (metrics) => metrics.memory > 90 && this.currentScaling.get('replicas') >= this.config.maxReplicas,
            action: 'increase_limits',
            increment: '1Gi',
            cooldown: 1800000, // 30 minutos
            maxLimit: '8Gi'
        });
    }

    // Adicionar regra de escalabilidade
    addRule(rule) {
        this.scalingRules.set(rule.id, {
            ...rule,
            created: new Date(),
            active: true,
            lastTriggered: null,
            triggerCount: 0
        });
    }

    // Verificar condições e executar scaling
    async checkAndScale(metrics) {
        const now = Date.now();

        // Primeiro, verificar scaling baseado em anomalias
        await this.anomalyBasedScaling(metrics);

        // Depois, verificar regras tradicionais
        for (const [ruleId, rule] of this.scalingRules) {
            if (!rule.active) continue;

            try {
                // Verificar cooldown
                const lastTrigger = this.cooldowns.get(ruleId);
                if (lastTrigger && now - lastTrigger < rule.cooldown) {
                    continue;
                }

                // Verificar condição
                const shouldScale = await rule.condition(metrics);
                if (shouldScale) {
                    console.log(`📈 Condição atendida para scaling: ${rule.name}`);

                    const success = await this.executeScaling(rule, metrics);
                    if (success) {
                        rule.lastTriggered = now;
                        rule.triggerCount++;
                        this.cooldowns.set(ruleId, now);

                        this.scalingHistory.push({
                            ruleId,
                            timestamp: new Date(),
                            type: rule.type,
                            direction: rule.direction,
                            action: rule.action,
                            metrics: { ...metrics },
                            trigger: 'rule_based'
                        });

                        console.log(`✅ Scaling executado: ${rule.name}`);
                        break; // Só uma ação de scaling por vez
                    }
                }
            } catch (error) {
                console.error(`Erro na verificação da regra ${ruleId}:`, error);
            }
        }

        // Por fim, executar otimização inteligente
        await this.intelligentResourceOptimization();
    }

    // Executar ação de scaling
    async executeScaling(rule, metrics) {
        try {
            switch (rule.action) {
                case 'scale_replicas':
                    return await this.scaleReplicas(rule, metrics);
                case 'increase_limits':
                    return await this.increaseLimits(rule, metrics);
                default:
                    console.warn(`Ação de scaling não reconhecida: ${rule.action}`);
                    return false;
            }
        } catch (error) {
            console.error(`Erro durante scaling ${rule.action}:`, error);
            return false;
        }
    }

    // Scaling horizontal - réplicas
    async scaleReplicas(rule, metrics) {
        const currentReplicas = await this.getCurrentReplicas();
        let targetReplicas = Math.round(currentReplicas * rule.factor);

        // Aplicar limites
        targetReplicas = Math.max(this.config.minReplicas, Math.min(this.config.maxReplicas, targetReplicas));

        // Não scale down abaixo do mínimo ou acima do máximo
        if (rule.direction === 'down' && targetReplicas >= currentReplicas) {
            console.log('📉 Scale down não necessário - já no mínimo');
            return true;
        }

        if (rule.direction === 'up' && targetReplicas <= currentReplicas) {
            console.log('📈 Scale up não possível - já no máximo');
            return true;
        }

        console.log(`${rule.direction === 'up' ? '⬆️' : '⬇️'} Scaling de ${currentReplicas} para ${targetReplicas} réplicas`);

        // Executar scaling
        const command = `kubectl scale deployment getnexo-app --replicas=${targetReplicas}`;
        await this.executeCommand(command, 60000);

        // Aguardar scaling completar
        const success = await this.waitForScaling(targetReplicas, 300000);

        if (success) {
            this.currentScaling.set('replicas', targetReplicas);
            this.currentScaling.set('lastScale', Date.now());

            // Aguardar estabilização antes de permitir novos scalings
            await this.waitForStabilization();

            return true;
        }

        return false;
    }

    // Scaling vertical - aumentar limits
    async increaseLimits(rule, metrics) {
        const currentLimits = await this.getCurrentLimits();
        const currentValue = this.parseResourceValue(currentLimits[rule.resource]);
        const incrementValue = this.parseResourceValue(rule.increment);

        let newValue = currentValue + incrementValue;
        const maxValue = this.parseResourceValue(rule.maxLimit);

        if (newValue > maxValue) {
            console.log(`📊 Limite máximo atingido para ${rule.resource}: ${rule.maxLimit}`);
            return true; // Não é erro, apenas limite atingido
        }

        const newLimit = this.formatResourceValue(newValue, rule.resource);

        console.log(`📊 Aumentando limite de ${rule.resource} de ${currentLimits[rule.resource]} para ${newLimit}`);

        const command = `kubectl patch deployment getnexo-app -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"limits":{"${rule.resource}":"${newLimit}"}}}]}}}'`;
        await this.executeCommand(command, 30000);

        // Aguardar rollout
        await this.waitForRollout(180000);

        this.currentScaling.set(`${rule.resource}_limit`, newLimit);
        return true;
    }

    // Aguardar scaling completar
    async waitForScaling(targetReplicas, timeout = 300000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            const currentReplicas = await this.getCurrentReplicas();
            if (currentReplicas === targetReplicas) {
                const healthy = await this.checkScalingHealth();
                if (healthy) {
                    return true;
                }
            }
            await this.sleep(10000); // Verificar a cada 10 segundos
        }

        console.error(`Timeout aguardando scaling para ${targetReplicas} réplicas`);
        return false;
    }

    // Aguardar rollout completar
    async waitForRollout(timeout = 180000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            try {
                const command = `kubectl rollout status deployment/getnexo-app --timeout=30s`;
                await this.executeCommand(command, 35000);
                return true;
            } catch (error) {
                // Rollout ainda em andamento
                await this.sleep(5000);
            }
        }

        throw new Error('Timeout aguardando rollout completar');
    }

    // Aguardar estabilização do sistema
    async waitForStabilization() {
        console.log('⏳ Aguardando estabilização do sistema...');
        await this.sleep(this.config.stabilizationTime);
    }

    // Verificar saúde após scaling
    async checkScalingHealth() {
        try {
            const metrics = await this.getCurrentMetrics();

            // Verificar se métricas estão dentro de limites aceitáveis
            return metrics.cpu < 95 && metrics.memory < 95 && metrics.errorRate < 10;
        } catch (error) {
            console.error('Erro ao verificar saúde pós-scaling:', error);
            return false;
        }
    }

    // Predição de scaling baseada em tendências
    async predictiveScaling(metrics) {
        // Análise de tendências para scaling preventivo
        const trends = await this.analyzeTrends(metrics);

        if (trends.cpuPredicted > 85 && trends.confidence > 0.8) {
            console.log('🔮 Scaling preventivo detectado - CPU alta prevista');
            await this.proactiveScale('cpu', trends.cpuPredicted);
        }

        if (trends.memoryPredicted > 90 && trends.confidence > 0.8) {
            console.log('🔮 Scaling preventivo detectado - Memória alta prevista');
            await this.proactiveScale('memory', trends.memoryPredicted);
        }

        // Integração com Capacity Planning Engine
        if (window.CapacityPlanningEngine) {
            try {
                const capacityPlan = await window.CapacityPlanningEngine.getCapacityPlan('24h');
                const recommendations = capacityPlan.recommendations;

                for (const rec of recommendations) {
                    if (rec.confidence > 0.8 && rec.urgency === 'high') {
                        console.log(`🎯 Recomendação de capacity planning: ${rec.reason}`);
                        await this.applyCapacityRecommendation(rec);
                    }
                }
            } catch (error) {
                console.error('Erro ao consultar capacity planning:', error);
            }
        }

        // Integração com Resource Forecasting Engine
        if (window.ResourceForecastingEngine) {
            try {
                const forecasts = await window.ResourceForecastingEngine.getAllForecasts(6); // 6 horas

                // Scaling baseado em forecast de CPU
                const cpuForecast = forecasts.forecasts.cpu;
                if (cpuForecast && cpuForecast.confidence > 0.8) {
                    const avgForecast = cpuForecast.forecast.reduce((sum, f) => sum + f.value, 0) / cpuForecast.forecast.length;
                    if (avgForecast > 80) {
                        console.log(`🔮 Forecast indica CPU alta (${avgForecast.toFixed(1)}%) - preparando scaling`);
                        await this.preparePredictiveScaling('cpu', avgForecast);
                    }
                }

                // Scaling baseado em forecast de memória
                const memoryForecast = forecasts.forecasts.memory;
                if (memoryForecast && memoryForecast.confidence > 0.8) {
                    const avgForecast = memoryForecast.forecast.reduce((sum, f) => sum + f.value, 0) / memoryForecast.forecast.length;
                    if (avgForecast > 85) {
                        console.log(`🔮 Forecast indica memória alta (${avgForecast.toFixed(1)}%) - preparando vertical scaling`);
                        await this.prepareVerticalScaling('memory', avgForecast);
                    }
                }

            } catch (error) {
                console.error('Erro ao consultar resource forecasting:', error);
            }
        }
    }

    // Scaling proativo
    async proactiveScale(resource, predictedValue) {
        const rule = {
            id: `predictive_${resource}`,
            name: `Predictive Scale - ${resource.toUpperCase()}`,
            type: 'horizontal',
            direction: 'up',
            factor: 1.2
        };

        await this.scaleReplicas(rule, { predictive: true });
    }

    // Análise de tendências (simplificada)
    async analyzeTrends(metrics) {
        // Em produção, usaria algoritmos de ML mais sofisticados
        const history = this.scalingHistory.slice(-10); // Últimas 10 ações

        const cpuTrend = this.calculateTrend(history.map(h => h.metrics.cpu || 0));
        const memoryTrend = this.calculateTrend(history.map(h => h.metrics.memory || 0));

        return {
            cpuPredicted: Math.max(0, metrics.cpu + cpuTrend * 30), // Predição para próximos 30 minutos
            memoryPredicted: Math.max(0, metrics.memory + memoryTrend * 30),
            confidence: 0.7 // Confiança da predição
        };
    }

    calculateTrend(values) {
        if (values.length < 2) return 0;

        const n = values.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
        const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }

    // Iniciar monitoramento
    startMonitoring() {
        // Verificar condições de scaling a cada 60 segundos
        setInterval(async () => {
            try {
                const metrics = await this.getCurrentMetrics();
                await this.checkAndScale(metrics);

                // Scaling preditivo a cada 5 minutos
                if (Math.floor(Date.now() / 300000) % 5 === 0) {
                    await this.predictiveScaling(metrics);
                }
            } catch (error) {
                console.error('Erro no monitoramento de scaling:', error);
            }
        }, 60000);

        // Limpar histórico antigo
        setInterval(() => {
            if (this.scalingHistory.length > 200) {
                this.scalingHistory = this.scalingHistory.slice(-200);
            }
        }, 3600000); // A cada hora
    }

    // Métodos auxiliares (implementações simuladas)
    async getCurrentReplicas() {
        return this.currentScaling.get('replicas') || 3;
    }

    async getCurrentLimits() {
        return {
            cpu: this.currentScaling.get('cpu_limit') || '2000m',
            memory: this.currentScaling.get('memory_limit') || '4Gi'
        };
    }

    parseResourceValue(value) {
        if (value.endsWith('m')) {
            return parseInt(value.slice(0, -1));
        } else if (value.endsWith('Gi')) {
            return parseInt(value.slice(0, -2)) * 1024;
        } else if (value.endsWith('Mi')) {
            return parseInt(value.slice(0, -2));
        }
        return parseInt(value);
    }

    formatResourceValue(value, resource) {
        if (resource === 'cpu') {
            return `${value}m`;
        } else {
            return value >= 1024 ? `${Math.round(value / 1024)}Gi` : `${value}Mi`;
        }
    }

    async getCurrentMetrics() {
        // Simulação - em produção consultaria Prometheus
        return {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            avgResponseTime: Math.random() * 2000,
            requestRate: Math.random() * 1000,
            queueDepth: Math.random() * 2000,
            cpuTrend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
            errorRate: Math.random() * 10
        };
    }

    async executeCommand(command, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout após ${timeout}ms`));
            }, timeout);

            console.log(`💻 Executando: ${command}`);

            setTimeout(() => {
                clearTimeout(timer);
                resolve({
                    success: true,
                    output: 'Command executed successfully',
                    exitCode: 0
                });
            }, Math.random() * 3000 + 1000);
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // API pública
    getScalingHistory(limit = 50) {
        return this.scalingHistory.slice(-limit);
    }

    getScalingRules() {
        return Array.from(this.scalingRules.values());
    }

    getCurrentState() {
        return {
            replicas: this.currentScaling.get('replicas') || 3,
            cpuLimit: this.currentScaling.get('cpu_limit') || '2000m',
            memoryLimit: this.currentScaling.get('memory_limit') || '4Gi',
            lastScale: this.currentScaling.get('lastScale') || null
        };
    }

    disableRule(ruleId) {
        const rule = this.scalingRules.get(ruleId);
        if (rule) {
            rule.active = false;
            console.log(`🚫 Regra de scaling desativada: ${ruleId}`);
        }
    }

    enableRule(ruleId) {
        const rule = this.scalingRules.get(ruleId);
        if (rule) {
            rule.active = true;
            console.log(`✅ Regra de scaling ativada: ${ruleId}`);
        }
    }

    // Aplicar recomendação do capacity planning
    async applyCapacityRecommendation(recommendation) {
        console.log(`🎯 Aplicando recomendação de capacity planning: ${recommendation.type}`);

        try {
            switch (recommendation.action) {
                case 'scale_replicas':
                    const currentReplicas = await this.getCurrentReplicas();
                    const targetReplicas = Math.round(currentReplicas * recommendation.factor);
                    return await this.manualScale(targetReplicas);

                case 'increase_limits':
                    return await this.increaseResourceLimits(recommendation.resource, recommendation.increment);

                case 'scale_down':
                    const currentReplicasDown = await this.getCurrentReplicas();
                    const targetReplicasDown = Math.max(1, Math.round(currentReplicasDown * recommendation.factor));
                    return await this.manualScale(targetReplicasDown);

                default:
                    console.log(`Ação de capacity planning não suportada: ${recommendation.action}`);
                    return false;
            }
        } catch (error) {
            console.error(`Erro ao aplicar recomendação de capacity planning:`, error);
            return false;
        }
    }

    // Preparar scaling preditivo baseado em forecast
    async preparePredictiveScaling(resource, predictedValue) {
        console.log(`🔮 Preparando scaling preditivo para ${resource}: ${predictedValue.toFixed(1)}% previsto`);

        // Pré-escalar se necessário
        if (resource === 'cpu' && predictedValue > 85) {
            const currentReplicas = await this.getCurrentReplicas();
            if (currentReplicas < this.config.maxReplicas) {
                const preventiveReplicas = Math.min(this.config.maxReplicas,
                    Math.ceil(currentReplicas * 1.3));
                console.log(`🛡️ Pré-escalando de ${currentReplicas} para ${preventiveReplicas} réplicas`);
                return await this.manualScale(preventiveReplicas);
            }
        }
    }

    // Preparar vertical scaling baseado em forecast
    async prepareVerticalScaling(resource, predictedValue) {
        console.log(`📊 Preparando vertical scaling para ${resource}: ${predictedValue.toFixed(1)}% previsto`);

        if (resource === 'memory' && predictedValue > 90) {
            // Verificar se já estamos no máximo de réplicas
            const currentReplicas = await this.getCurrentReplicas();
            if (currentReplicas >= this.config.maxReplicas) {
                // Fazer vertical scaling
                return await this.increaseResourceLimits('memory', '512Mi');
            }
        }

        if (resource === 'cpu' && predictedValue > 90) {
            const currentReplicas = await this.getCurrentReplicas();
            if (currentReplicas >= this.config.maxReplicas) {
                return await this.increaseResourceLimits('cpu', '200m');
            }
        }
    }

    // Aumentar limites de recursos (vertical scaling)
    async increaseResourceLimits(resource, increment) {
        const currentLimits = await this.getCurrentLimits();
        const currentValue = this.parseResourceValue(currentLimits[resource]);
        const incrementValue = this.parseResourceValue(increment);

        const newValue = currentValue + incrementValue;
        const newLimit = this.formatResourceValue(newValue, resource);

        console.log(`📈 Aumentando limite de ${resource} de ${currentLimits[resource]} para ${newLimit}`);

        // Aplicar via Kubernetes
        const command = `kubectl patch deployment getnexo-app -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"limits":{"${resource}":"${newLimit}"}}}]}}}'`;

        try {
            await this.executeCommand(command, 30000);
            this.currentScaling.set(`${resource}_limit`, newLimit);

            // Aguardar rollout
            await this.waitForRollout(180000);

            console.log(`✅ Limite de ${resource} aumentado para ${newLimit}`);
            return true;
        } catch (error) {
            console.error(`Erro ao aumentar limite de ${resource}:`, error);
            return false;
        }
    }

    // Scaling baseado em anomalias detectadas
    async anomalyBasedScaling(metrics) {
        // Verificar se há anomalias críticas
        if (metrics.anomaly && metrics.severity === 'critical') {
            console.log('🚨 Scaling emergencial devido a anomalia crítica');

            const currentReplicas = await this.getCurrentReplicas();
            const emergencyReplicas = Math.min(this.config.maxReplicas,
                Math.ceil(currentReplicas * 1.5));

            return await this.manualScale(emergencyReplicas);
        }
    }

    // Otimização inteligente de recursos
    async intelligentResourceOptimization() {
        const currentMetrics = await this.getCurrentMetrics();
        const currentReplicas = await this.getCurrentReplicas();

        // Otimização baseada em ML se disponível
        if (window.AdvancedSelfHealing) {
            try {
                const optimization = await window.AdvancedSelfHealing.getResourceOptimization(currentMetrics);

                if (optimization.recommendedReplicas && optimization.recommendedReplicas !== currentReplicas) {
                    console.log(`🧠 ML recomenda ${optimization.recommendedReplicas} réplicas (atual: ${currentReplicas})`);
                    return await this.manualScale(optimization.recommendedReplicas);
                }
            } catch (error) {
                console.error('Erro na otimização inteligente:', error);
            }
        }

        // Otimização baseada em regras tradicionais
        if (currentMetrics.cpu < 30 && currentReplicas > this.config.minReplicas) {
            const optimizedReplicas = Math.max(this.config.minReplicas,
                Math.floor(currentReplicas * 0.8));
            console.log(`💡 Otimizando: reduzindo para ${optimizedReplicas} réplicas (CPU baixa)`);
            return await this.manualScale(optimizedReplicas);
        }
    }

    // Scale manual
    async manualScale(replicas) {
        const rule = {
            id: 'manual_scale',
            name: 'Manual Scale',
            type: 'horizontal',
            direction: replicas > await this.getCurrentReplicas() ? 'up' : 'down',
            factor: replicas / await this.getCurrentReplicas()
        };

        return await this.scaleReplicas(rule, {});
    }
}

// Instância global
window.AutoScalingEngine = new AutoScalingEngine();

export default AutoScalingEngine;