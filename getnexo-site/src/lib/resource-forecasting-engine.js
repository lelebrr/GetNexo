/**
 * Resource Forecasting Engine - GetNexo Platform
 *
 * @description Engine avançado de forecasting de recursos usando algoritmos de ML
 * especializados para predição de CPU, memória, storage e network
 * @version 1.0.0
 * @author GetNexo SRE Team
 */

class ResourceForecastingEngine {
    constructor() {
        this.models = new Map();
        this.historicalMetrics = new Map();
        this.forecastCache = new Map();
        this.anomalyDetectors = new Map();
        this.seasonalPatterns = new Map();

        this.config = {
            forecastHorizon: 168, // 7 dias em horas
            dataRetentionDays: 90,
            updateInterval: 60 * 60 * 1000, // 1 hora
            confidenceThreshold: 0.75,
            anomalyThreshold: 2.5 // desvios padrão
        };

        this.initialize();
    }

    async initialize() {
        this.initializeModels();
        this.loadHistoricalData();
        this.startForecastingCycle();

        console.log('🔮 Resource Forecasting Engine inicializado');
    }

    // Inicializar modelos de forecasting
    initializeModels() {
        const resources = ['cpu', 'memory', 'storage', 'network', 'disk_io', 'connections'];

        resources.forEach(resource => {
            // Modelo principal de forecasting
            this.models.set(`${resource}_forecast`, {
                type: 'time_series',
                algorithm: 'Prophet', // Inspirado no Facebook Prophet
                trained: false,
                accuracy: 0.0,
                parameters: {
                    changepoint_prior_scale: 0.05,
                    seasonality_mode: 'multiplicative',
                    interval_width: 0.8
                }
            });

            // Detector de anomalias
            this.anomalyDetectors.set(`${resource}_anomaly`, {
                algorithm: 'IsolationForest',
                trained: false,
                contamination: 0.1,
                threshold: this.config.anomalyThreshold
            });

            // Analisador de tendências
            this.models.set(`${resource}_trend`, {
                type: 'regression',
                algorithm: 'LinearTrend',
                slope: 0,
                intercept: 0,
                r_squared: 0
            });
        });

        console.log('🧠 Modelos de forecasting inicializados');
    }

    // Carregar dados históricos
    async loadHistoricalData() {
        const resources = ['cpu', 'memory', 'storage', 'network'];

        // Em produção, carregaria de Prometheus/InfluxDB
        resources.forEach(resource => {
            this.historicalMetrics.set(resource, {
                data: [],
                lastUpdated: new Date(),
                dataPoints: 0,
                avgValue: 0,
                stdDev: 0
            });
        });

        // Simular dados históricos
        this.generateSampleData();

        console.log('📊 Dados históricos carregados');
    }

    // Gerar dados de exemplo para demonstração
    generateSampleData() {
        const now = new Date();
        const resources = ['cpu', 'memory', 'storage', 'network'];

        resources.forEach(resource => {
            const data = [];
            const baseValue = resource === 'cpu' ? 50 : resource === 'memory' ? 60 :
                resource === 'storage' ? 70 : 30;

            // Gerar dados das últimas 24 horas (1 ponto por hora)
            for (let i = 23; i >= 0; i--) {
                const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
                const hour = timestamp.getHours();

                // Adicionar sazonalidade horária
                let seasonalFactor = 1;
                if (hour >= 9 && hour <= 17) seasonalFactor = 1.3; // Horário comercial
                if (hour >= 12 && hour <= 14) seasonalFactor = 1.5; // Almoço
                if (hour >= 18 && hour <= 22) seasonalFactor = 1.2; // Noite

                // Adicionar ruído
                const noise = (Math.random() - 0.5) * 20;
                const value = Math.max(0, Math.min(100, baseValue * seasonalFactor + noise));

                data.push({
                    timestamp,
                    value,
                    resource
                });
            }

            this.historicalMetrics.get(resource).data = data;
            this.historicalMetrics.get(resource).dataPoints = data.length;
        });
    }

    // Forecasting principal
    async forecastResource(resource, hours = 24) {
        const cacheKey = `${resource}_${hours}`;
        const cached = this.forecastCache.get(cacheKey);

        // Retornar cache se ainda válido (< 1 hora)
        if (cached && Date.now() - cached.generatedAt < 60 * 60 * 1000) {
            return cached;
        }

        const historical = this.historicalMetrics.get(resource);
        if (!historical || historical.data.length < 10) {
            return this.fallbackForecast(resource, hours);
        }

        try {
            const forecast = await this.generateForecast(resource, historical.data, hours);
            const forecastObj = {
                resource,
                forecast,
                confidence: this.calculateForecastConfidence(forecast),
                method: 'Prophet-inspired',
                generatedAt: new Date(),
                horizon: hours,
                historicalPoints: historical.data.length
            };

            // Cachear resultado
            this.forecastCache.set(cacheKey, forecastObj);

            return forecastObj;

        } catch (error) {
            console.error(`Erro no forecasting de ${resource}:`, error);
            return this.fallbackForecast(resource, hours);
        }
    }

    // Gerar forecast usando abordagem Prophet-like
    async generateForecast(resource, historicalData, hours) {
        const data = [...historicalData];
        const forecast = [];

        // Componentes do Prophet: trend, seasonality, holidays
        const trend = this.extractTrend(data);
        const seasonality = this.extractSeasonality(data);
        const changepoints = this.detectChangepoints(data);

        for (let i = 0; i < hours; i++) {
            const futureTimestamp = new Date(data[data.length - 1].timestamp.getTime() + (i + 1) * 60 * 60 * 1000);

            // Predição base
            let prediction = trend.predict(futureTimestamp);

            // Adicionar sazonalidade
            prediction *= seasonality.getMultiplier(futureTimestamp);

            // Adicionar efeito de changepoints
            changepoints.forEach(cp => {
                if (futureTimestamp > cp.timestamp) {
                    prediction *= cp.effect;
                }
            });

            // Adicionar ruído controlado
            const noise = (Math.random() - 0.5) * 5;
            prediction += noise;

            // Garantir limites
            prediction = Math.max(0, Math.min(100, prediction));

            forecast.push({
                timestamp: futureTimestamp,
                value: prediction,
                components: {
                    trend: trend.predict(futureTimestamp),
                    seasonal: seasonality.getMultiplier(futureTimestamp),
                    changepoint: changepoints.reduce((acc, cp) => acc * cp.effect, 1)
                }
            });
        }

        return forecast;
    }

    // Extrair tendência
    extractTrend(data) {
        const n = data.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = data.map(d => d.value);

        // Regressão linear
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return {
            slope,
            intercept,
            predict: (timestamp) => {
                // Converter timestamp para índice relativo
                const hoursDiff = (timestamp - data[0].timestamp) / (1000 * 60 * 60);
                return slope * (data.length - 1 + hoursDiff) + intercept;
            }
        };
    }

    // Extrair sazonalidade
    extractSeasonality(data) {
        const hourlyPatterns = Array(24).fill().map(() => ({ sum: 0, count: 0 }));

        data.forEach(point => {
            const hour = point.timestamp.getHours();
            hourlyPatterns[hour].sum += point.value;
            hourlyPatterns[hour].count++;
        });

        const overallMean = data.reduce((sum, d) => sum + d.value, 0) / data.length;
        const hourlyMultipliers = hourlyPatterns.map(pattern => {
            const avg = pattern.count > 0 ? pattern.sum / pattern.count : overallMean;
            return avg / overallMean;
        });

        return {
            getMultiplier: (timestamp) => {
                const hour = timestamp.getHours();
                return hourlyMultipliers[hour] || 1;
            },
            multipliers: hourlyMultipliers
        };
    }

    // Detectar changepoints
    detectChangepoints(data) {
        const changepoints = [];
        const minDistance = 6; // Mínimo 6 horas entre changepoints

        for (let i = minDistance; i < data.length - minDistance; i++) {
            const before = data.slice(i - minDistance, i);
            const after = data.slice(i, i + minDistance);

            const beforeMean = before.reduce((sum, d) => sum + d.value, 0) / before.length;
            const afterMean = after.reduce((sum, d) => sum + d.value, 0) / after.length;

            const change = Math.abs(afterMean - beforeMean);
            const threshold = 15; // Threshold de mudança significativa

            if (change > threshold) {
                changepoints.push({
                    timestamp: data[i].timestamp,
                    effect: afterMean / beforeMean,
                    magnitude: change
                });
            }
        }

        return changepoints.slice(0, 5); // Máximo 5 changepoints
    }

    // Forecast fallback
    fallbackForecast(resource, hours) {
        const historical = this.historicalMetrics.get(resource);
        const recentAvg = historical?.data?.length > 0 ?
            historical.data.slice(-6).reduce((sum, d) => sum + d.value, 0) / Math.min(6, historical.data.length) :
            50;

        const forecast = Array(hours).fill().map((_, i) => ({
            timestamp: new Date(Date.now() + (i + 1) * 60 * 60 * 1000),
            value: recentAvg + (Math.random() - 0.5) * 10,
            components: { fallback: true }
        }));

        return {
            resource,
            forecast,
            confidence: 0.5,
            method: 'fallback_average',
            generatedAt: new Date(),
            horizon: hours
        };
    }

    // Calcular confiança do forecast
    calculateForecastConfidence(forecast) {
        if (forecast.method === 'fallback_average') return 0.5;

        // Confiança baseada na consistência histórica
        const historical = this.historicalMetrics.get(forecast.resource);
        if (!historical?.data?.length) return 0.5;

        const values = historical.data.map(d => d.value);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        // Confiança inversamente proporcional à variabilidade
        const baseConfidence = Math.max(0.3, 1 - (stdDev / 30));

        // Ajustar baseado no tamanho da amostra
        const sampleAdjustment = Math.min(1, historical.data.length / 100);

        return Math.min(0.95, baseConfidence * sampleAdjustment);
    }

    // Detecção de anomalias
    async detectAnomalies(resource, recentData = null) {
        const data = recentData || this.historicalMetrics.get(resource)?.data;
        if (!data || data.length < 10) {
            return { anomalies: [], score: 0 };
        }

        const detector = this.anomalyDetectors.get(`${resource}_anomaly`);
        const anomalies = [];

        // Método simplificado de detecção de anomalias
        const values = data.map(d => d.value);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

        data.forEach((point, index) => {
            const zScore = Math.abs(point.value - mean) / stdDev;
            if (zScore > detector.threshold) {
                anomalies.push({
                    timestamp: point.timestamp,
                    value: point.value,
                    zScore,
                    severity: zScore > 3 ? 'critical' : 'warning',
                    expectedRange: {
                        min: mean - 2 * stdDev,
                        max: mean + 2 * stdDev
                    }
                });
            }
        });

        return {
            anomalies,
            score: anomalies.length > 0 ? Math.max(...anomalies.map(a => a.zScore)) : 0,
            totalPoints: data.length,
            threshold: detector.threshold
        };
    }

    // Análise de tendências avançada
    async analyzeTrends(resource, period = '7d') {
        const historical = this.historicalMetrics.get(resource);
        if (!historical?.data?.length) return {};

        const hours = period === '7d' ? 168 : period === '24h' ? 24 : 24;
        const data = historical.data.slice(-hours);

        const trend = this.extractTrend(data);
        const seasonality = this.extractSeasonality(data);
        const patterns = this.identifyPatterns(data);
        const forecast = await this.forecastResource(resource, 24);

        return {
            resource,
            period,
            trend: {
                slope: trend.slope,
                direction: trend.slope > 0.1 ? 'increasing' : trend.slope < -0.1 ? 'decreasing' : 'stable',
                significance: Math.abs(trend.slope) * Math.sqrt(data.length) // Teste t simplificado
            },
            seasonality: {
                detected: seasonality.multipliers.some(m => m > 1.2 || m < 0.8),
                peakHour: seasonality.multipliers.indexOf(Math.max(...seasonality.multipliers)),
                troughHour: seasonality.multipliers.indexOf(Math.min(...seasonality.multipliers))
            },
            patterns,
            forecast: forecast.confidence > 0.7 ? forecast : null,
            analyzedAt: new Date()
        };
    }

    // Identificar padrões
    identifyPatterns(data) {
        const patterns = {
            spikes: [],
            drops: [],
            plateaus: [],
            oscillations: false
        };

        // Detectar spikes
        const values = data.map(d => d.value);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

        data.forEach((point, index) => {
            if (point.value > mean + 2 * stdDev) {
                patterns.spikes.push({
                    timestamp: point.timestamp,
                    value: point.value,
                    index
                });
            }
        });

        // Detectar oscilações
        let oscillationCount = 0;
        for (let i = 2; i < values.length; i++) {
            const diff1 = values[i - 1] - values[i - 2];
            const diff2 = values[i] - values[i - 1];
            if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
                oscillationCount++;
            }
        }
        patterns.oscillations = oscillationCount > values.length * 0.3;

        return patterns;
    }

    // Forecasting multi-recursos
    async forecastAllResources(hours = 24) {
        const resources = ['cpu', 'memory', 'storage', 'network'];
        const forecasts = {};

        for (const resource of resources) {
            try {
                forecasts[resource] = await this.forecastResource(resource, hours);
            } catch (error) {
                console.error(`Erro no forecasting de ${resource}:`, error);
                forecasts[resource] = this.fallbackForecast(resource, hours);
            }
        }

        return {
            forecasts,
            aggregated: this.aggregateForecasts(forecasts),
            generatedAt: new Date(),
            horizon: hours
        };
    }

    // Agregar forecasts
    aggregateForecasts(forecasts) {
        const aggregated = {
            totalLoad: [],
            bottleneckRisk: [],
            optimizationOpportunities: []
        };

        // Encontrar horizonte comum
        const horizon = Math.min(...Object.values(forecasts).map(f => f.forecast?.length || 0));

        for (let i = 0; i < horizon; i++) {
            const cpu = forecasts.cpu?.forecast?.[i]?.value || 0;
            const memory = forecasts.memory?.forecast?.[i]?.value || 0;
            const storage = forecasts.storage?.forecast?.[i]?.value || 0;
            const network = forecasts.network?.forecast?.[i]?.value || 0;

            // Load total (média ponderada)
            const totalLoad = (cpu * 0.4 + memory * 0.3 + storage * 0.2 + network * 0.1);
            aggregated.totalLoad.push(totalLoad);

            // Risco de gargalo
            const bottleneckRisk = Math.max(cpu, memory, storage, network) > 85 ? 'high' :
                Math.max(cpu, memory, storage, network) > 70 ? 'medium' : 'low';
            aggregated.bottleneckRisk.push(bottleneckRisk);

            // Oportunidades de otimização
            const opportunities = [];
            if (cpu < 40) opportunities.push('cpu_underutilized');
            if (memory < 40) opportunities.push('memory_underutilized');
            if (storage > 80) opportunities.push('storage_pressure');
            if (network > 60) opportunities.push('network_congestion');

            aggregated.optimizationOpportunities.push(opportunities);
        }

        return aggregated;
    }

    // Ciclo de forecasting contínuo
    startForecastingCycle() {
        setInterval(async () => {
            try {
                console.log('🔄 Executando ciclo de forecasting de recursos');

                // Atualizar dados históricos
                await this.updateHistoricalData();

                // Gerar forecasts atualizados
                const forecasts = await this.forecastAllResources(24);

                // Verificar anomalias
                for (const resource of ['cpu', 'memory', 'storage', 'network']) {
                    const anomalies = await this.detectAnomalies(resource);
                    if (anomalies.anomalies.length > 0) {
                        console.warn(`🚨 Anomalias detectadas em ${resource}: ${anomalies.anomalies.length}`);

                        // Integrar com sistema de alertas
                        if (window.AdvancedAlertSystem && anomalies.anomalies.length > 0) {
                            const latestAnomaly = anomalies.anomalies[anomalies.anomalies.length - 1];
                            window.AdvancedAlertSystem.checkMetrics({
                                [resource]: latestAnomaly.value,
                                anomaly: true,
                                severity: latestAnomaly.severity
                            });
                        }
                    }
                }

                // Log do ciclo
                console.log(`📊 Forecasts atualizados - Confiança média: ${(forecasts.aggregated.totalLoad.reduce((a, b) => a + b, 0) / forecasts.aggregated.totalLoad.length).toFixed(1)}%`);

            } catch (error) {
                console.error('Erro no ciclo de forecasting:', error);
            }
        }, this.config.updateInterval);
    }

    // Atualizar dados históricos
    async updateHistoricalData() {
        const resources = ['cpu', 'memory', 'storage', 'network'];

        resources.forEach(resource => {
            const metric = this.historicalMetrics.get(resource);
            if (metric) {
                // Adicionar novo ponto de dados (simulado)
                const newPoint = {
                    timestamp: new Date(),
                    value: Math.max(0, Math.min(100, metric.data[metric.data.length - 1]?.value + (Math.random() - 0.5) * 20))
                };

                metric.data.push(newPoint);
                metric.lastUpdated = new Date();
                metric.dataPoints++;

                // Limitar tamanho histórico
                if (metric.data.length > 1000) {
                    metric.data = metric.data.slice(-1000);
                }
            }
        });
    }

    // API pública
    async getResourceForecast(resource, hours = 24) {
        return await this.forecastResource(resource, hours);
    }

    async getAllForecasts(hours = 24) {
        return await this.forecastAllResources(hours);
    }

    async getTrendAnalysis(resource, period = '7d') {
        return await this.analyzeTrends(resource, period);
    }

    async getAnomalyReport(resource, hours = 24) {
        const recentData = this.historicalMetrics.get(resource)?.data?.slice(-hours);
        return await this.detectAnomalies(resource, recentData);
    }

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

    getDashboardData() {
        const recentForecasts = {};
        const resources = ['cpu', 'memory', 'storage', 'network'];

        resources.forEach(resource => {
            const forecast = this.forecastCache.get(`${resource}_24`);
            if (forecast) {
                recentForecasts[resource] = {
                    current: forecast.forecast[0]?.value || 0,
                    predicted: forecast.forecast.slice(0, 6), // Próximas 6 horas
                    confidence: forecast.confidence
                };
            }
        });

        return {
            forecasts: recentForecasts,
            modelPerformance: this.getModelPerformance(),
            lastUpdate: new Date(),
            totalDataPoints: Array.from(this.historicalMetrics.values())
                .reduce((sum, m) => sum + m.dataPoints, 0)
        };
    }
}

// Instância global
window.ResourceForecastingEngine = new ResourceForecastingEngine();

export default ResourceForecastingEngine;