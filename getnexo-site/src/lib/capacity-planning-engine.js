/**
 * Capacity Planning Engine - GetNexo Platform
 *
 * @description Sistema avançado de capacity planning automatizado usando machine learning
 * para otimização de recursos, forecasting e recomendações proativas
 * @version 1.0.0
 * @author GetNexo SRE Team
 */

class CapacityPlanningEngine {
    constructor() {
        this.models = new Map();
        this.historicalData = new Map();
        this.capacityPlans = new Map();
        this.resourceAllocations = new Map();
        this.predictionHistory = [];
        this.optimizationHistory = [];

        this.config = {
            predictionHorizon: 24 * 60 * 60 * 1000, // 24 horas
            dataRetentionDays: 90,
            confidenceThreshold: 0.8,
            optimizationInterval: 60 * 60 * 1000, // 1 hora
            minTrainingSamples: 100
        };

        this.initialize();
    }

    async initialize() {
        this.loadModels();
        this.loadHistoricalData();
        this.startOptimizationCycle();

        console.log('🏗️ Capacity Planning Engine inicializado');
    }

    // Modelos de ML para capacity planning
    loadModels() {
        // Modelo de forecasting de demanda
        this.models.set('demand_forecast', {
            type: 'time_series',
            algorithm: 'ARIMA', // AutoRegressive Integrated Moving Average
            features: ['cpu_usage', 'memory_usage', 'network_traffic', 'request_rate', 'active_users'],
            target: 'resource_usage',
            trained: false,
            accuracy: 0.0,
            parameters: {
                p: 2, d: 1, q: 2, // ARIMA parameters
                seasonal: true,
                seasonality: 24 // Horária
            }
        });

        // Modelo de predição de picos
        this.models.set('peak_prediction', {
            type: 'classification',
            algorithm: 'RandomForest',
            features: ['hour_of_day', 'day_of_week', 'month', 'is_holiday', 'weather_impact', 'marketing_campaigns'],
            target: 'is_peak',
            trained: false,
            accuracy: 0.0
        });

        // Modelo de otimização de recursos
        this.models.set('resource_optimization', {
            type: 'optimization',
            algorithm: 'LinearProgramming',
            constraints: ['cpu_limit', 'memory_limit', 'cost_budget', 'performance_sla'],
            objective: 'maximize_efficiency',
            trained: false
        });

        // Modelo de eficiência energética
        this.models.set('energy_efficiency', {
            type: 'regression',
            algorithm: 'GradientBoosting',
            features: ['workload_type', 'resource_allocation', 'time_of_day', 'data_center_location'],
            target: 'energy_consumption',
            trained: false,
            accuracy: 0.0
        });
    }

    // Carregar dados históricos
    async loadHistoricalData() {
        // Em produção, carregaria de banco de dados/timeseries DB
        const resources = ['cpu', 'memory', 'storage', 'network'];

        resources.forEach(resource => {
            this.historicalData.set(resource, {
                usage: [],
                predictions: [],
                anomalies: [],
                trends: {},
                seasonality: {}
            });
        });

        console.log('📊 Dados históricos carregados');
    }

    // Forecasting de recursos
    async forecastResourceUsage(resource, hours = 24) {
        const model = this.models.get('demand_forecast');
        const historical = this.historicalData.get(resource);

        if (!historical || historical.usage.length < this.config.minTrainingSamples) {
            return this.fallbackForecast(resource, hours);
        }

        try {
            const forecast = await this.generateForecast(historical.usage, hours, model);
            const confidence = this.calculateForecastConfidence(forecast);

            return {
                resource,
                forecast,
                confidence,
                method: model.algorithm,
                generatedAt: new Date(),
                horizon: hours
            };
        } catch (error) {
            console.error(`Erro no forecasting de ${resource}:`, error);
            return this.fallbackForecast(resource, hours);
        }
    }

    // Forecasting fallback (média móvel simples)
    fallbackForecast(resource, hours) {
        const historical = this.historicalData.get(resource);
        const recentUsage = historical?.usage.slice(-24) || []; // Últimas 24 horas

        if (recentUsage.length === 0) {
            return {
                resource,
                forecast: Array(hours).fill(50), // 50% uso médio
                confidence: 0.5,
                method: 'fallback',
                generatedAt: new Date()
            };
        }

        const avgUsage = recentUsage.reduce((a, b) => a + b.usage, 0) / recentUsage.length;
        const forecast = Array(hours).fill(avgUsage);

        return {
            resource,
            forecast,
            confidence: 0.6,
            method: 'moving_average',
            generatedAt: new Date(),
            horizon: hours
        };
    }

    // Gerar forecast usando ARIMA simplificado
    async generateForecast(historicalData, hours, model) {
        const data = historicalData.slice(-168); // Última semana (168 horas)
        const forecast = [];

        // ARIMA simplificado - em produção usaria biblioteca especializada
        for (let i = 0; i < hours; i++) {
            const prediction = this.arimaPredict(data, model.parameters, i + 1);
            forecast.push(Math.max(0, Math.min(100, prediction)));
            data.push({ usage: prediction, timestamp: new Date() }); // Adicionar para próxima predição
        }

        return forecast;
    }

    // Predição ARIMA simplificada
    arimaPredict(data, params, stepsAhead) {
        const { p, d, q } = params;
        const values = data.map(d => d.usage);

        // Diferenciação
        let diff = values;
        for (let i = 0; i < d; i++) {
            diff = this.differentiate(diff);
        }

        // Componente AR (AutoRegressive)
        const arCoeffs = this.calculateARCoefficients(diff, p);
        const arPrediction = this.predictAR(diff, arCoeffs, stepsAhead);

        // Componente MA (Moving Average) - simplificado
        const maPrediction = values.slice(-q).reduce((a, b) => a + b, 0) / q;

        // Combinar componentes
        const prediction = arPrediction + maPrediction;

        // Adicionar tendência sazonal se disponível
        const seasonalAdjustment = this.getSeasonalAdjustment(data, stepsAhead);
        const finalPrediction = prediction + seasonalAdjustment;

        return Math.max(0, Math.min(100, finalPrediction));
    }

    // Calcular coeficientes AR
    calculateARCoefficients(data, p) {
        // Implementação simplificada de Yule-Walker
        const coeffs = [];
        for (let i = 1; i <= p; i++) {
            const autocorr = this.autocorrelation(data, i);
            coeffs.push(autocorr);
        }
        return coeffs;
    }

    // Predição AR
    predictAR(data, coeffs, steps) {
        if (data.length < coeffs.length) return data[data.length - 1] || 50;

        let prediction = 0;
        const recent = data.slice(-coeffs.length);

        coeffs.forEach((coeff, i) => {
            prediction += coeff * recent[recent.length - 1 - i];
        });

        return prediction;
    }

    // Autocorrelação
    autocorrelation(data, lag) {
        const n = data.length;
        const mean = data.reduce((a, b) => a + b, 0) / n;
        let numerator = 0;
        let denominator = 0;

        for (let i = lag; i < n; i++) {
            numerator += (data[i] - mean) * (data[i - lag] - mean);
            denominator += Math.pow(data[i] - mean, 2);
        }

        return denominator > 0 ? numerator / denominator : 0;
    }

    // Diferenciação
    differentiate(data) {
        const diff = [];
        for (let i = 1; i < data.length; i++) {
            diff.push(data[i] - data[i - 1]);
        }
        return diff;
    }

    // Ajuste sazonal
    getSeasonalAdjustment(data, stepsAhead) {
        // Detecção simples de sazonalidade horária
        const hourlyPattern = Array(24).fill(0);
        const counts = Array(24).fill(0);

        data.forEach((point, index) => {
            const hour = new Date(point.timestamp).getHours();
            hourlyPattern[hour] += point.usage;
            counts[hour]++;
        });

        // Calcular médias horárias
        hourlyPattern.forEach((sum, hour) => {
            hourlyPattern[hour] = counts[hour] > 0 ? sum / counts[hour] : 0;
        });

        // Ajuste baseado na hora futura
        const futureHour = (new Date().getHours() + stepsAhead) % 24;
        const currentAvg = data.slice(-24).reduce((a, b) => a + b.usage, 0) / Math.min(24, data.length);

        return hourlyPattern[futureHour] - currentAvg;
    }

    // Calcular confiança do forecast
    calculateForecastConfidence(forecast) {
        // Confiança baseada na variabilidade histórica
        const historical = this.historicalData.get('cpu'); // Usar CPU como referência
        if (!historical?.usage.length) return 0.5;

        const recentUsage = historical.usage.slice(-24);
        const mean = recentUsage.reduce((a, b) => a + b.usage, 0) / recentUsage.length;
        const variance = recentUsage.reduce((a, b) => a + Math.pow(b.usage - mean, 2), 0) / recentUsage.length;
        const stdDev = Math.sqrt(variance);

        // Confiança inversamente proporcional ao desvio padrão
        const confidence = Math.max(0.1, Math.min(1, 1 - (stdDev / 50)));

        return confidence;
    }

    // Análise de tendências e sazonalidade
    analyzeTrendsAndSeasonality(resource) {
        const historical = this.historicalData.get(resource);
        if (!historical?.usage.length) return {};

        const data = historical.usage;

        // Análise de tendência (regressão linear)
        const trend = this.calculateTrend(data);

        // Análise de sazonalidade
        const seasonality = this.detectSeasonality(data);

        // Padrões de uso
        const patterns = this.identifyUsagePatterns(data);

        return {
            trend,
            seasonality,
            patterns,
            lastAnalyzed: new Date()
        };
    }

    // Calcular tendência
    calculateTrend(data) {
        const n = data.length;
        if (n < 2) return { slope: 0, direction: 'stable' };

        const x = Array.from({ length: n }, (_, i) => i);
        const y = data.map(d => d.usage);

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const direction = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable';

        return {
            slope: slope,
            direction: direction,
            confidence: Math.min(1, n / 100) // Confiança aumenta com mais dados
        };
    }

    // Detectar sazonalidade
    detectSeasonality(data) {
        const seasonality = {
            hourly: this.detectHourlySeasonality(data),
            daily: this.detectDailySeasonality(data),
            weekly: this.detectWeeklySeasonality(data)
        };

        return seasonality;
    }

    // Detecção de sazonalidade horária
    detectHourlySeasonality(data) {
        if (data.length < 24) return { detected: false };

        const hourlyUsage = Array(24).fill(0);
        const counts = Array(24).fill(0);

        data.forEach(point => {
            const hour = new Date(point.timestamp).getHours();
            hourlyUsage[hour] += point.usage;
            counts[hour]++;
        });

        // Calcular médias horárias
        const hourlyAvg = hourlyUsage.map((sum, hour) => counts[hour] > 0 ? sum / counts[hour] : 0);

        // Verificar variabilidade sazonal
        const overallAvg = hourlyAvg.reduce((a, b) => a + b, 0) / 24;
        const variance = hourlyAvg.reduce((sum, val) => sum + Math.pow(val - overallAvg, 2), 0) / 24;
        const stdDev = Math.sqrt(variance);

        const seasonalityStrength = stdDev / overallAvg;

        return {
            detected: seasonalityStrength > 0.2,
            strength: seasonalityStrength,
            peakHour: hourlyAvg.indexOf(Math.max(...hourlyAvg)),
            troughHour: hourlyAvg.indexOf(Math.min(...hourlyAvg))
        };
    }

    // Detecção de sazonalidade diária (simplificada)
    detectDailySeasonality(data) {
        // Implementação básica - em produção usaria análise mais sofisticada
        return { detected: false, strength: 0 };
    }

    // Detecção de sazonalidade semanal
    detectWeeklySeasonality(data) {
        if (data.length < 168) return { detected: false }; // Menos de uma semana

        const weeklyUsage = Array(7).fill(0);
        const counts = Array(7).fill(0);

        data.forEach(point => {
            const day = new Date(point.timestamp).getDay();
            weeklyUsage[day] += point.usage;
            counts[day]++;
        });

        const weeklyAvg = weeklyUsage.map((sum, day) => counts[day] > 0 ? sum / counts[day] : 0);
        const overallAvg = weeklyAvg.reduce((a, b) => a + b, 0) / 7;
        const variance = weeklyAvg.reduce((sum, val) => sum + Math.pow(val - overallAvg, 2), 0) / 7;
        const stdDev = Math.sqrt(variance);

        const seasonalityStrength = stdDev / overallAvg;

        return {
            detected: seasonalityStrength > 0.15,
            strength: seasonalityStrength,
            peakDay: weeklyAvg.indexOf(Math.max(...weeklyAvg)),
            troughDay: weeklyAvg.indexOf(Math.min(...weeklyAvg))
        };
    }

    // Identificar padrões de uso
    identifyUsagePatterns(data) {
        const patterns = {
            peak_hours: [],
            low_usage_periods: [],
            growth_trends: [],
            anomalies: []
        };

        // Encontrar horas de pico
        const hourlyStats = this.calculateHourlyStats(data);
        patterns.peak_hours = hourlyStats.filter(h => h.avgUsage > 70).map(h => h.hour);

        // Períodos de baixo uso
        patterns.low_usage_periods = hourlyStats.filter(h => h.avgUsage < 30).map(h => h.hour);

        // Tendências de crescimento
        const recentTrend = this.calculateTrend(data.slice(-168)); // Última semana
        patterns.growth_trends = [{
            period: 'last_week',
            slope: recentTrend.slope,
            direction: recentTrend.direction
        }];

        return patterns;
    }

    // Calcular estatísticas horárias
    calculateHourlyStats(data) {
        const hourlyStats = Array(24).fill().map((_, hour) => ({
            hour,
            usages: [],
            avgUsage: 0,
            maxUsage: 0,
            minUsage: 100
        }));

        data.forEach(point => {
            const hour = new Date(point.timestamp).getHours();
            const usage = point.usage;

            hourlyStats[hour].usages.push(usage);
            hourlyStats[hour].maxUsage = Math.max(hourlyStats[hour].maxUsage, usage);
            hourlyStats[hour].minUsage = Math.min(hourlyStats[hour].minUsage, usage);
        });

        hourlyStats.forEach(stat => {
            stat.avgUsage = stat.usages.length > 0 ?
                stat.usages.reduce((a, b) => a + b, 0) / stat.usages.length : 0;
        });

        return hourlyStats;
    }

    // Predição de demanda baseada em dados históricos
    async predictDemand(timeframe = '24h') {
        const hours = timeframe === '24h' ? 24 : timeframe === '7d' ? 168 : 24;

        const predictions = {
            cpu: await this.forecastResourceUsage('cpu', hours),
            memory: await this.forecastResourceUsage('memory', hours),
            storage: await this.forecastResourceUsage('storage', hours),
            network: await this.forecastResourceUsage('network', hours)
        };

        // Análise de tendências agregada
        const trends = {
            cpu: this.analyzeTrendsAndSeasonality('cpu'),
            memory: this.analyzeTrendsAndSeasonality('memory'),
            storage: this.analyzeTrendsAndSeasonality('storage'),
            network: this.analyzeTrendsAndSeasonality('network')
        };

        // Predições de picos
        const peakPredictions = await this.predictPeaks(hours);

        return {
            timeframe,
            predictions,
            trends,
            peakPredictions,
            generatedAt: new Date(),
            confidence: this.calculateOverallConfidence(predictions)
        };
    }

    // Predição de picos
    async predictPeaks(hours) {
        const peaks = [];

        for (let i = 0; i < hours; i++) {
            const futureTime = new Date(Date.now() + i * 60 * 60 * 1000);
            const features = {
                hour_of_day: futureTime.getHours(),
                day_of_week: futureTime.getDay(),
                month: futureTime.getMonth(),
                is_holiday: this.isHoliday(futureTime),
                weather_impact: 0, // Placeholder
                marketing_campaigns: false // Placeholder
            };

            const isPeak = await this.classifyPeak(features);
            if (isPeak.prediction) {
                peaks.push({
                    timestamp: futureTime,
                    confidence: isPeak.confidence,
                    expectedLoad: isPeak.expectedLoad
                });
            }
        }

        return peaks;
    }

    // Classificar se é pico (simplificado)
    async classifyPeak(features) {
        // Lógica simplificada - em produção usaria modelo treinado
        const peakHours = [9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20];
        const isPeak = peakHours.includes(features.hour_of_day);

        return {
            prediction: isPeak,
            confidence: 0.75,
            expectedLoad: isPeak ? 85 : 45
        };
    }

    // Verificar se é feriado
    isHoliday(date) {
        // Implementação básica - em produção usaria calendário completo
        const holidays = [
            '2024-01-01', // Ano novo
            '2024-12-25', // Natal
            // Adicionar mais feriados
        ];

        const dateStr = date.toISOString().split('T')[0];
        return holidays.includes(dateStr);
    }

    // Calcular confiança geral
    calculateOverallConfidence(predictions) {
        const confidences = Object.values(predictions).map(p => p.confidence);
        return confidences.reduce((a, b) => a + b, 0) / confidences.length;
    }

    // Recomendações proativas de scaling
    async generateScalingRecommendations() {
        const demand = await this.predictDemand('24h');
        const recommendations = [];

        // Análise de CPU
        const cpuForecast = demand.predictions.cpu;
        const avgCpuForecast = cpuForecast.forecast.reduce((a, b) => a + b, 0) / cpuForecast.forecast.length;
        const maxCpuForecast = Math.max(...cpuForecast.forecast);

        if (maxCpuForecast > 80 && cpuForecast.confidence > 0.7) {
            recommendations.push({
                type: 'horizontal_scale_up',
                resource: 'cpu',
                reason: `Previsão de pico de CPU em ${maxCpuForecast.toFixed(1)}%`,
                confidence: cpuForecast.confidence,
                action: 'scale_replicas',
                factor: Math.min(2.0, maxCpuForecast / 60), // Scaling baseado na carga prevista
                urgency: maxCpuForecast > 90 ? 'high' : 'medium'
            });
        }

        // Análise de memória
        const memoryForecast = demand.predictions.memory;
        const maxMemoryForecast = Math.max(...memoryForecast.forecast);

        if (maxMemoryForecast > 85 && memoryForecast.confidence > 0.7) {
            recommendations.push({
                type: 'vertical_scale_up',
                resource: 'memory',
                reason: `Previsão de pico de memória em ${maxMemoryForecast.toFixed(1)}%`,
                confidence: memoryForecast.confidence,
                action: 'increase_limits',
                increment: '1Gi',
                urgency: maxMemoryForecast > 95 ? 'high' : 'medium'
            });
        }

        // Recomendações baseadas em tendências
        const cpuTrend = demand.trends.cpu;
        if (cpuTrend.trend.direction === 'increasing' && cpuTrend.trend.confidence > 0.8) {
            recommendations.push({
                type: 'capacity_planning',
                resource: 'cpu',
                reason: 'Tendência de crescimento consistente de CPU',
                confidence: cpuTrend.trend.confidence,
                action: 'plan_capacity_increase',
                timeline: 'next_week',
                urgency: 'low'
            });
        }

        // Recomendações de otimização
        const optimizationRecs = await this.generateOptimizationRecommendations();
        recommendations.push(...optimizationRecs);

        return {
            recommendations: recommendations.sort((a, b) => {
                const urgencyOrder = { high: 3, medium: 2, low: 1 };
                return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
            }),
            generatedAt: new Date(),
            basedOn: demand
        };
    }

    // Recomendações de otimização
    async generateOptimizationRecommendations() {
        const recommendations = [];

        // Otimização de recursos subutilizados
        const currentUsage = await this.getCurrentResourceUsage();

        if (currentUsage.cpu < 40) {
            recommendations.push({
                type: 'optimization',
                resource: 'cpu',
                reason: `CPU subutilizado em ${currentUsage.cpu.toFixed(1)}%`,
                confidence: 0.9,
                action: 'scale_down',
                factor: 0.8,
                urgency: 'low'
            });
        }

        // Recomendações de storage
        if (currentUsage.storage > 85) {
            recommendations.push({
                type: 'optimization',
                resource: 'storage',
                reason: `Storage alto em ${currentUsage.storage.toFixed(1)}%`,
                confidence: 0.95,
                action: 'cleanup_old_data',
                urgency: 'medium'
            });
        }

        return recommendations;
    }

    // Obter uso atual de recursos (simulado)
    async getCurrentResourceUsage() {
        return {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            storage: Math.random() * 100,
            network: Math.random() * 50
        };
    }

    // Ciclo de otimização contínua
    startOptimizationCycle() {
        setInterval(async () => {
            try {
                console.log('🔄 Executando ciclo de otimização de capacity planning');

                // Gerar recomendações
                const recommendations = await this.generateScalingRecommendations();

                // Aplicar recomendações automáticas se confiança alta
                for (const rec of recommendations) {
                    if (rec.confidence > this.config.confidenceThreshold && rec.urgency === 'high') {
                        await this.applyRecommendation(rec);
                    }
                }

                // Log do ciclo
                this.optimizationHistory.push({
                    timestamp: new Date(),
                    recommendationsCount: recommendations.recommendations.length,
                    appliedCount: recommendations.recommendations.filter(r => r.applied).length
                });

                // Limitar histórico
                if (this.optimizationHistory.length > 100) {
                    this.optimizationHistory = this.optimizationHistory.slice(-100);
                }

            } catch (error) {
                console.error('Erro no ciclo de otimização:', error);
            }
        }, this.config.optimizationInterval);
    }

    // Aplicar recomendação
    async applyRecommendation(recommendation) {
        try {
            console.log(`🎯 Aplicando recomendação: ${recommendation.type} para ${recommendation.resource}`);

            switch (recommendation.action) {
                case 'scale_replicas':
                    if (window.AutoScalingEngine) {
                        const currentReplicas = await window.AutoScalingEngine.getCurrentState().replicas;
                        const targetReplicas = Math.round(currentReplicas * recommendation.factor);
                        await window.AutoScalingEngine.manualScale(targetReplicas);
                    }
                    break;

                case 'increase_limits':
                    // Implementar aumento de limits via Kubernetes
                    console.log(`📊 Aumentando limite de ${recommendation.resource} em ${recommendation.increment}`);
                    break;

                case 'scale_down':
                    if (window.AutoScalingEngine) {
                        const currentReplicas = await window.AutoScalingEngine.getCurrentState().replicas;
                        const targetReplicas = Math.max(1, Math.round(currentReplicas * recommendation.factor));
                        await window.AutoScalingEngine.manualScale(targetReplicas);
                    }
                    break;

                default:
                    console.log(`Ação não implementada: ${recommendation.action}`);
            }

            recommendation.applied = true;
            recommendation.appliedAt = new Date();

        } catch (error) {
            console.error(`Erro ao aplicar recomendação ${recommendation.type}:`, error);
            recommendation.failed = true;
            recommendation.error = error.message;
        }
    }

    // API pública
    async getCapacityPlan(timeframe = '24h') {
        const demand = await this.predictDemand(timeframe);
        const recommendations = await this.generateScalingRecommendations();

        return {
            timeframe,
            demandForecast: demand,
            recommendations: recommendations.recommendations,
            optimizationHistory: this.optimizationHistory.slice(-10),
            generatedAt: new Date()
        };
    }

    async getResourceForecast(resource, hours = 24) {
        return await this.forecastResourceUsage(resource, hours);
    }

    getOptimizationHistory(limit = 50) {
        return this.optimizationHistory.slice(-limit);
    }

    // Integração com dashboard
    getDashboardData() {
        const recentOptimizations = this.optimizationHistory.slice(-5);
        const activeRecommendations = []; // Implementar busca de recomendações ativas

        return {
            totalOptimizations: this.optimizationHistory.length,
            recentOptimizations,
            activeRecommendations,
            modelPerformance: this.getModelPerformance(),
            capacityMetrics: this.getCapacityMetrics()
        };
    }

    // Performance dos modelos
    getModelPerformance() {
        const performance = {};

        this.models.forEach((model, name) => {
            performance[name] = {
                accuracy: model.accuracy,
                trained: model.trained,
                algorithm: model.algorithm
            };
        });

        return performance;
    }

    // Métricas de capacity
    getCapacityMetrics() {
        return {
            predictionAccuracy: 0.85, // Placeholder
            optimizationEfficiency: 0.92, // Placeholder
            resourceUtilization: 0.78, // Placeholder
            costSavings: 15.5 // Percentual
        };
    }
}

// Instância global
window.CapacityPlanningEngine = new CapacityPlanningEngine();

export default CapacityPlanningEngine;