/**
 * Advanced Self-Healing Engine - GetNexo Platform
 *
 * @description Sistema de auto-recuperação inteligente usando machine learning
 * @version 1.0.0
 * @author GetNexo SRE Team
 */

class AdvancedSelfHealing {
    constructor() {
        this.trainingData = [];
        this.models = new Map();
        this.incidentPatterns = new Map();
        this.recoveryStrategies = new Map();
        this.predictionHistory = [];
        this.learningMetrics = new Map();

        this.config = {
            confidenceThreshold: 0.8,
            minTrainingSamples: 10,
            retrainInterval: 86400000, // 24 horas
            predictionHorizon: 3600000, // 1 hora
            featureWindow: 300000 // 5 minutos
        };

        this.initialize();
    }

    async initialize() {
        this.loadBaseModels();
        this.loadRecoveryStrategies();
        this.startLearning();

        console.log('🧠 Advanced Self-Healing Engine inicializado');
    }

    // Modelos base de ML
    loadBaseModels() {
        // Modelo de predição de incidentes
        this.models.set('incident_prediction', {
            type: 'classification',
            features: ['cpu', 'memory', 'errorRate', 'responseTime', 'requestRate', 'diskUsage'],
            target: 'willFail',
            accuracy: 0.85,
            trained: false,
            weights: this.initializeWeights(6)
        });

        // Modelo de seleção de estratégia de recuperação
        this.models.set('recovery_strategy', {
            type: 'multiclass',
            features: ['incidentType', 'severity', 'duration', 'affectedServices', 'timeOfDay', 'dayOfWeek'],
            target: 'bestStrategy',
            accuracy: 0.78,
            trained: false,
            weights: this.initializeWeights(6)
        });

        // Modelo de predição de tempo de recuperação
        this.models.set('recovery_time', {
            type: 'regression',
            features: ['incidentType', 'severity', 'strategy', 'resourcesAffected', 'timeOfDay'],
            target: 'recoveryTime',
            accuracy: 0.72,
            trained: false,
            weights: this.initializeWeights(5)
        });

        // Modelo de detecção de anomalias
        this.models.set('anomaly_detection', {
            type: 'unsupervised',
            features: ['cpu', 'memory', 'errorRate', 'responseTime', 'requestRate', 'connections'],
            threshold: 2.5, // Desvio padrão
            trained: false,
            centroids: []
        });
    }

    // Estratégias de recuperação aprendidas
    loadRecoveryStrategies() {
        this.recoveryStrategies.set('cpu_high', {
            strategies: [
                { name: 'scale_out', successRate: 0.85, avgTime: 180000 },
                { name: 'increase_limits', successRate: 0.65, avgTime: 120000 },
                { name: 'restart_affected', successRate: 0.75, avgTime: 90000 }
            ],
            learnedPatterns: []
        });

        this.recoveryStrategies.set('memory_leak', {
            strategies: [
                { name: 'force_gc', successRate: 0.60, avgTime: 30000 },
                { name: 'rolling_restart', successRate: 0.90, avgTime: 240000 },
                { name: 'rollback', successRate: 0.95, avgTime: 300000 }
            ],
            learnedPatterns: []
        });

        this.recoveryStrategies.set('service_down', {
            strategies: [
                { name: 'pod_restart', successRate: 0.70, avgTime: 60000 },
                { name: 'circuit_breaker', successRate: 0.80, avgTime: 15000 },
                { name: 'failover', successRate: 0.85, avgTime: 120000 }
            ],
            learnedPatterns: []
        });
    }

    // Coletar dados de treinamento
    async collectTrainingData(incident, outcome) {
        const features = await this.extractFeatures(incident);

        this.trainingData.push({
            features,
            outcome,
            timestamp: new Date(),
            incident: incident.id,
            success: outcome.success,
            recoveryTime: outcome.recoveryTime,
            strategy: outcome.strategy
        });

        // Limitar tamanho dos dados de treinamento
        if (this.trainingData.length > 1000) {
            this.trainingData = this.trainingData.slice(-1000);
        }

        // Retrain models se temos dados suficientes
        if (this.trainingData.length >= this.config.minTrainingSamples) {
            await this.retrainModels();
        }
    }

    // Extrair features de um incidente
    async extractFeatures(incident) {
        const metrics = incident.metrics || {};
        const timestamp = incident.timestamp || new Date();

        return {
            cpu: metrics.cpu || 0,
            memory: metrics.memory || 0,
            errorRate: metrics.errorRate || 0,
            responseTime: metrics.avgResponseTime || 0,
            requestRate: metrics.requestRate || 0,
            diskUsage: metrics.diskSpace || 0,
            incidentType: incident.ruleId || 'unknown',
            severity: this.getSeverityScore(incident.level),
            duration: incident.duration || 0,
            affectedServices: incident.affectedServices || 1,
            timeOfDay: timestamp.getHours(),
            dayOfWeek: timestamp.getDay(),
            isWeekend: timestamp.getDay() === 0 || timestamp.getDay() === 6,
            isBusinessHours: timestamp.getHours() >= 9 && timestamp.getHours() <= 18
        };
    }

    // Converter nível de severidade para score
    getSeverityScore(level) {
        const scores = {
            'info': 1,
            'warning': 2,
            'error': 3,
            'critical': 4,
            'emergency': 5
        };
        return scores[level] || 1;
    }

    // Predição de incidentes
    async predictIncident(metrics) {
        const model = this.models.get('incident_prediction');
        if (!model.trained) {
            return { prediction: false, confidence: 0.5 }; // Fallback
        }

        const features = this.normalizeFeatures(metrics, model.features);
        const prediction = this.classify(features, model.weights);
        const confidence = this.calculateConfidence(features, model.weights);

        const result = {
            willFail: prediction > 0.5,
            confidence,
            predictedAt: new Date(),
            features: metrics
        };

        this.predictionHistory.push(result);

        if (result.willFail && confidence > this.config.confidenceThreshold) {
            console.log(`🔮 ML Previu incidente com ${Math.round(confidence * 100)}% de confiança`);

            // Acionar ação preventiva
            await this.preventiveAction(metrics, confidence);
        }

        return result;
    }

    // Recomendar estratégia de recuperação
    async recommendRecoveryStrategy(incident) {
        const model = this.models.get('recovery_strategy');
        if (!model.trained) {
            return this.fallbackStrategy(incident);
        }

        const features = await this.extractFeatures(incident);
        const normalizedFeatures = this.normalizeFeatures(features, model.features);

        const strategyIndex = this.predictClass(normalizedFeatures, model.weights);
        const strategies = ['scale_out', 'restart', 'rollback', 'circuit_breaker', 'increase_limits'];
        const recommendedStrategy = strategies[strategyIndex] || 'scale_out';

        // Verificar aprendizado histórico para este tipo de incidente
        const historicalSuccess = this.getHistoricalSuccessRate(incident.ruleId, recommendedStrategy);

        return {
            strategy: recommendedStrategy,
            confidence: model.accuracy,
            historicalSuccessRate: historicalSuccess,
            expectedTime: await this.predictRecoveryTime(incident, recommendedStrategy),
            reasoning: `ML recomendou ${recommendedStrategy} baseado em padrões históricos similares`
        };
    }

    // Predição de tempo de recuperação
    async predictRecoveryTime(incident, strategy) {
        const model = this.models.get('recovery_time');
        if (!model.trained) {
            const baseTimes = {
                'scale_out': 180000,
                'restart': 90000,
                'rollback': 300000,
                'circuit_breaker': 15000,
                'increase_limits': 120000
            };
            return baseTimes[strategy] || 120000;
        }

        const features = {
            ...await this.extractFeatures(incident),
            strategy: this.strategyToNumber(strategy)
        };

        const normalizedFeatures = this.normalizeFeatures(features, model.features);
        const predictedTime = this.regress(normalizedFeatures, model.weights);

        return Math.max(30000, Math.min(600000, predictedTime)); // Entre 30s e 10min
    }

    // Detecção de anomalias
    async detectAnomalies(metrics) {
        const model = this.models.get('anomaly_detection');
        if (!model.trained) {
            return { isAnomaly: false, score: 0 };
        }

        const features = this.normalizeFeatures(metrics, model.features);
        const distances = model.centroids.map(centroid => this.euclideanDistance(features, centroid));

        const minDistance = Math.min(...distances);
        const threshold = model.threshold;

        const isAnomaly = minDistance > threshold;
        const score = minDistance / threshold;

        if (isAnomaly) {
            console.log(`🚨 Anomalia detectada (score: ${score.toFixed(2)})`);

            // Investigar automaticamente
            await this.investigateAnomaly(metrics, score);
        }

        return { isAnomaly, score, minDistance };
    }

    // Ação preventiva baseada em predição
    async preventiveAction(metrics, confidence) {
        console.log('🛡️ Executando ação preventiva baseada em ML');

        // Estratégias preventivas baseadas no tipo de risco previsto
        if (metrics.cpu > 70) {
            // Pré-scale baseado em predição de CPU alta
            if (window.AutoScalingEngine) {
                await window.AutoScalingEngine.manualScale(
                    Math.min(window.AutoScalingEngine.config.maxReplicas,
                        Math.ceil(window.AutoScalingEngine.getCurrentState().replicas * 1.2))
                );
            }
        }

        if (metrics.memory > 75) {
            // Pré-GC ou restart preventivo
            if (window.AutoRestartEngine) {
                await window.AutoRestartEngine.checkAndRestart(metrics);
            }
        }

        // Log da ação preventiva
        this.learningMetrics.set('preventive_actions', (this.learningMetrics.get('preventive_actions') || 0) + 1);
    }

    // Investigação automática de anomalias
    async investigateAnomaly(metrics, score) {
        console.log('🔍 Investigando anomalia automaticamente...');

        // Coletar dados adicionais
        const investigation = {
            timestamp: new Date(),
            metrics,
            score,
            findings: [],
            recommendations: []
        };

        // Verificar padrões similares no histórico
        const similarIncidents = this.findSimilarIncidents(metrics);

        if (similarIncidents.length > 0) {
            investigation.findings.push(`Encontrados ${similarIncidents.length} incidentes similares`);
            investigation.recommendations.push('Aplicar estratégia de recuperação usada anteriormente');

            // Aplicar aprendizado
            const bestStrategy = this.getBestStrategyFromHistory(similarIncidents);
            if (bestStrategy) {
                investigation.recommendations.push(`Estratégia recomendada: ${bestStrategy}`);
            }
        }

        // Verificar correlações
        const correlations = this.findCorrelations(metrics);
        if (correlations.length > 0) {
            investigation.findings.push(`Correlações encontradas: ${correlations.join(', ')}`);
        }

        // Armazenar investigação
        this.incidentPatterns.set(`anomaly_${Date.now()}`, investigation);

        return investigation;
    }

    // Treinar modelos
    async retrainModels() {
        console.log('🧠 Retreinando modelos de ML...');

        if (this.trainingData.length < this.config.minTrainingSamples) {
            return;
        }

        // Treinar modelo de predição de incidentes
        await this.trainIncidentPredictionModel();

        // Treinar modelo de estratégia de recuperação
        await this.trainRecoveryStrategyModel();

        // Treinar modelo de tempo de recuperação
        await this.trainRecoveryTimeModel();

        // Treinar modelo de detecção de anomalias
        await this.trainAnomalyDetectionModel();

        console.log('✅ Modelos retreinados com sucesso');
    }

    // Treinar modelo de predição de incidentes
    async trainIncidentPredictionModel() {
        const model = this.models.get('incident_prediction');

        // Preparar dados
        const X = this.trainingData.map(d => this.featureArray(d.features, model.features));
        const y = this.trainingData.map(d => d.outcome.success ? 0 : 1); // 0 = sucesso, 1 = falha

        // Treinar usando gradiente descendente simples
        model.weights = this.gradientDescent(X, y, model.weights, 0.01, 1000);
        model.trained = true;

        // Calcular acurácia
        model.accuracy = this.calculateAccuracy(X, y, model.weights);
        console.log(`📊 Acurácia do modelo de predição: ${(model.accuracy * 100).toFixed(1)}%`);
    }

    // Treinar modelo de estratégia de recuperação
    async trainRecoveryStrategyModel() {
        const model = this.models.get('recovery_strategy');

        // Mapeamento de estratégias para números
        const strategyMap = {
            'scale_out': 0,
            'restart': 1,
            'rollback': 2,
            'circuit_breaker': 3,
            'increase_limits': 4
        };

        const X = this.trainingData.map(d => this.featureArray(d.features, model.features));
        const y = this.trainingData.map(d => strategyMap[d.outcome.strategy] || 0);

        model.weights = this.trainMulticlass(X, y, 5, model.weights); // 5 classes
        model.trained = true;

        model.accuracy = this.calculateMulticlassAccuracy(X, y, model.weights);
        console.log(`📊 Acurácia do modelo de estratégia: ${(model.accuracy * 100).toFixed(1)}%`);
    }

    // Treinar modelo de tempo de recuperação
    async trainRecoveryTimeModel() {
        const model = this.models.get('recovery_time');

        const X = this.trainingData.map(d => this.featureArray(d.features, model.features));
        const y = this.trainingData.map(d => d.outcome.recoveryTime || 120000);

        model.weights = this.linearRegression(X, y, model.weights);
        model.trained = true;

        model.accuracy = this.calculateRegressionAccuracy(X, y, model.weights);
        console.log(`📊 Acurácia do modelo de tempo: ${(model.accuracy * 100).toFixed(1)}%`);
    }

    // Treinar modelo de detecção de anomalias
    async trainAnomalyDetectionModel() {
        const model = this.models.get('anomaly_detection');

        // Usar K-means simples para encontrar centroids
        const features = this.trainingData.map(d => this.featureArray(d.features, model.features));
        model.centroids = this.kMeans(features, 3); // 3 clusters
        model.trained = true;

        console.log(`📊 Modelo de anomalias treinado com ${model.centroids.length} centroids`);
    }

    // Algoritmos de ML simplificados

    initializeWeights(size) {
        return Array(size).fill(0).map(() => Math.random() - 0.5);
    }

    gradientDescent(X, y, weights, learningRate, epochs) {
        let w = [...weights];

        for (let epoch = 0; epoch < epochs; epoch++) {
            const predictions = X.map(x => this.sigmoid(this.dotProduct(x, w)));
            const errors = predictions.map((p, i) => p - y[i]);

            // Atualizar pesos
            for (let j = 0; j < w.length; j++) {
                const gradient = X.reduce((sum, x, i) => sum + errors[i] * x[j], 0) / X.length;
                w[j] -= learningRate * gradient;
            }
        }

        return w;
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    dotProduct(a, b) {
        return a.reduce((sum, val, i) => sum + val * b[i], 0);
    }

    classify(features, weights) {
        return this.sigmoid(this.dotProduct(features, weights));
    }

    calculateConfidence(features, weights) {
        const prediction = this.classify(features, weights);
        return Math.abs(prediction - 0.5) * 2; // 0-1 confidence
    }

    // Métodos auxiliares
    normalizeFeatures(features, featureNames) {
        // Normalização simples (em produção usaria StandardScaler)
        return featureNames.map(name => {
            const value = features[name] || 0;
            // Normalizar baseado em ranges conhecidos
            switch (name) {
                case 'cpu': return Math.min(value / 100, 1);
                case 'memory': return Math.min(value / 100, 1);
                case 'errorRate': return Math.min(value / 10, 1);
                case 'responseTime': return Math.min(value / 5000, 1);
                default: return Math.min(value / 100, 1);
            }
        });
    }

    featureArray(features, featureNames) {
        return featureNames.map(name => features[name] || 0);
    }

    calculateAccuracy(X, y, weights) {
        const predictions = X.map(x => this.classify(x, weights) > 0.5 ? 1 : 0);
        const correct = predictions.filter((p, i) => p === y[i]).length;
        return correct / X.length;
    }

    // Métodos de aprendizado adicionais (simplificados)
    trainMulticlass(X, y, numClasses, initialWeights) {
        // One-vs-all approach simplificado
        const weights = [];
        for (let i = 0; i < numClasses; i++) {
            const binaryY = y.map(label => label === i ? 1 : 0);
            weights.push(this.gradientDescent(X, binaryY, initialWeights.slice(), 0.01, 500));
        }
        return weights;
    }

    predictClass(features, weights) {
        const predictions = weights.map(w => this.classify(features, w));
        return predictions.indexOf(Math.max(...predictions));
    }

    calculateMulticlassAccuracy(X, y, weights) {
        const predictions = X.map(x => this.predictClass(x, weights));
        const correct = predictions.filter((p, i) => p === y[i]).length;
        return correct / X.length;
    }

    linearRegression(X, y, weights) {
        // Regressão linear simples usando gradiente descendente
        let w = [...weights];

        for (let epoch = 0; epoch < 1000; epoch++) {
            const predictions = X.map(x => this.dotProduct(x, w));
            const errors = predictions.map((p, i) => p - y[i]);

            for (let j = 0; j < w.length; j++) {
                const gradient = X.reduce((sum, x, i) => sum + errors[i] * x[j], 0) / X.length;
                w[j] -= 0.01 * gradient; // learning rate
            }
        }

        return w;
    }

    regress(features, weights) {
        return this.dotProduct(features, weights);
    }

    calculateRegressionAccuracy(X, y, weights) {
        const predictions = X.map(x => this.regress(x, weights));
        const errors = predictions.map((p, i) => Math.abs(p - y[i]) / y[i]);
        const meanError = errors.reduce((a, b) => a + b, 0) / errors.length;
        return Math.max(0, 1 - meanError); // 1 - erro relativo médio
    }

    kMeans(data, k) {
        // K-means simplificado
        let centroids = data.slice(0, k); // Inicializar com primeiros k pontos

        for (let iter = 0; iter < 10; iter++) { // 10 iterações
            const clusters = Array(k).fill().map(() => []);

            // Atribuir pontos aos centroids
            data.forEach(point => {
                const distances = centroids.map(c => this.euclideanDistance(point, c));
                const closest = distances.indexOf(Math.min(...distances));
                clusters[closest].push(point);
            });

            // Recalcular centroids
            centroids = clusters.map(cluster => {
                if (cluster.length === 0) return centroids[clusters.indexOf(cluster)];
                return cluster[0].map((_, i) =>
                    cluster.reduce((sum, point) => sum + point[i], 0) / cluster.length
                );
            });
        }

        return centroids;
    }

    euclideanDistance(a, b) {
        return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
    }

    strategyToNumber(strategy) {
        const map = {
            'scale_out': 0,
            'restart': 1,
            'rollback': 2,
            'circuit_breaker': 3,
            'increase_limits': 4
        };
        return map[strategy] || 0;
    }

    fallbackStrategy(incident) {
        return {
            strategy: 'scale_out',
            confidence: 0.5,
            expectedTime: 180000,
            reasoning: 'Estratégia padrão - ML não treinado'
        };
    }

    getHistoricalSuccessRate(incidentType, strategy) {
        const relevantData = this.trainingData.filter(d =>
            d.features.incidentType === incidentType &&
            d.outcome.strategy === strategy
        );

        if (relevantData.length === 0) return 0.5;

        const successes = relevantData.filter(d => d.success).length;
        return successes / relevantData.length;
    }

    findSimilarIncidents(metrics) {
        return this.trainingData.filter(d => {
            const distance = this.euclideanDistance(
                this.featureArray(d.features, ['cpu', 'memory', 'errorRate', 'responseTime']),
                [metrics.cpu || 0, metrics.memory || 0, metrics.errorRate || 0, metrics.responseTime || 0]
            );
            return distance < 0.5; // Threshold de similaridade
        });
    }

    getBestStrategyFromHistory(similarIncidents) {
        const strategyCount = {};
        similarIncidents.forEach(incident => {
            const strategy = incident.outcome.strategy;
            strategyCount[strategy] = (strategyCount[strategy] || 0) + (incident.success ? 1 : 0);
        });

        const bestStrategy = Object.entries(strategyCount)
            .sort(([, a], [, b]) => b - a)[0];

        return bestStrategy ? bestStrategy[0] : null;
    }

    findCorrelations(metrics) {
        const correlations = [];

        if (metrics.cpu > 80 && metrics.memory > 80) {
            correlations.push('CPU e memória altos simultaneamente');
        }

        if (metrics.errorRate > 5 && metrics.responseTime > 2000) {
            correlations.push('Erros e latência alta');
        }

        return correlations;
    }

    // Iniciar aprendizado contínuo
    startLearning() {
        // Retreinar modelos periodicamente
        setInterval(async () => {
            if (this.trainingData.length >= this.config.minTrainingSamples) {
                await this.retrainModels();
            }
        }, this.config.retrainInterval);

        // Limpar dados antigos
        setInterval(() => {
            const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 dias
            this.trainingData = this.trainingData.filter(d => d.timestamp.getTime() > cutoff);
        }, 86400000); // Diariamente
    }

    // API pública
    async analyzeIncident(incident) {
        const features = await this.extractFeatures(incident);
        const prediction = await this.predictIncident(incident.metrics || {});
        const recommendation = await this.recommendRecoveryStrategy(incident);
        const anomaly = await this.detectAnomalies(incident.metrics || {});

        return {
            features,
            prediction,
            recommendation,
            anomaly,
            confidence: Math.min(prediction.confidence, recommendation.confidence)
        };
    }

    async learnFromOutcome(incident, outcome) {
        await this.collectTrainingData(incident, outcome);
    }

    getModelPerformance() {
        return Array.from(this.models.entries()).map(([name, model]) => ({
            name,
            accuracy: model.accuracy,
            trained: model.trained,
            samples: this.trainingData.length
        }));
    }

    getLearningMetrics() {
        return {
            trainingSamples: this.trainingData.length,
            predictionsMade: this.predictionHistory.length,
            preventiveActions: this.learningMetrics.get('preventive_actions') || 0,
            incidentPatterns: this.incidentPatterns.size
        };
    }

    // Reset de modelos (para debug)
    async resetModels() {
        this.models.forEach(model => {
            model.trained = false;
            model.accuracy = 0;
        });
        this.trainingData = [];
        console.log('🔄 Modelos resetados');
    }
}

// Instância global
window.AdvancedSelfHealing = new AdvancedSelfHealing();

export default AdvancedSelfHealing;