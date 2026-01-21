const UserBehavior = require('../models/UserBehavior');
const BehavioralTag = require('../models/BehavioralTag');

class UserClusteringService {
    constructor() {
        this.k = 5; // Número padrão de clusters
        this.maxIterations = 100;
        this.convergenceThreshold = 0.001;
        this.lastClustering = null;
    }

    /**
     * Executa clustering completo dos usuários
     * @param {Object} options - Opções de clustering
     */
    async performClustering(options = {}) {
        try {
            const {
                k = this.k,
                minUsers = 10,
                forceRecalculate = false
            } = options;

            console.log(`[UserClustering] Starting clustering with k=${k}`);

            // Buscar perfis comportamentais
            const allProfiles = await this.getAllUserProfiles();

            if (allProfiles.length < minUsers) {
                console.log(`[UserClustering] Insufficient data: ${allProfiles.length} profiles (minimum: ${minUsers})`);
                return {
                    success: false,
                    reason: 'insufficient_data',
                    profilesCount: allProfiles.length
                };
            }

            // Verificar se precisa recalcular
            if (!forceRecalculate && this.shouldSkipClustering(allProfiles)) {
                console.log('[UserClustering] Skipping clustering - data unchanged');
                return {
                    success: true,
                    reason: 'no_changes',
                    profilesCount: allProfiles.length
                };
            }

            // Preparar dados para clustering
            const features = this.extractFeatures(allProfiles);

            if (features.length === 0) {
                return {
                    success: false,
                    reason: 'no_features',
                    profilesCount: allProfiles.length
                };
            }

            // Normalizar features
            const normalizedFeatures = this.normalizeFeatures(features);

            // Executar K-means
            const clusteringResult = this.kMeansClustering(normalizedFeatures, k);

            // Atribuir clusters aos usuários
            const clusterAssignments = await this.assignClustersToUsers(allProfiles, clusteringResult.clusters);

            // Calcular estatísticas dos clusters
            const clusterStats = this.calculateClusterStatistics(allProfiles, clusteringResult.clusters, features);

            // Atualizar perfis com scores preditivos
            await this.updatePredictiveScores(allProfiles, clusteringResult.clusters, clusterStats);

            // Salvar resultados
            this.lastClustering = {
                timestamp: new Date().toISOString(),
                k,
                profilesCount: allProfiles.length,
                clusters: clusteringResult.clusters,
                centroids: clusteringResult.centroids,
                iterations: clusteringResult.iterations,
                converged: clusteringResult.converged,
                clusterStats,
                silhouetteScore: this.calculateSilhouetteScore(normalizedFeatures, clusteringResult.clusters)
            };

            console.log(`[UserClustering] Completed clustering: ${allProfiles.length} users in ${k} clusters`);

            return {
                success: true,
                k,
                profilesCount: allProfiles.length,
                clusters: clusteringResult.clusters.length,
                iterations: clusteringResult.iterations,
                converged: clusteringResult.converged,
                silhouetteScore: this.lastClustering.silhouetteScore,
                clusterStats
            };

        } catch (error) {
            console.error('[UserClusteringService.performClustering] Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Busca todos os perfis comportamentais
     */
    async getAllUserProfiles() {
        try {
            // Buscar diretamente do banco (método otimizado)
            const db = require('../server').db || global.dbInstance;
            const rows = db.prepare(`
                SELECT * FROM user_behaviors
                WHERE total_sessions > 0
                ORDER BY updated_at DESC
                LIMIT 10000
            `).all();

            return rows.map(row => {
                row.favorite_pages = JSON.parse(row.favorite_pages || '[]');
                row.click_patterns = JSON.parse(row.click_patterns || '{}');
                row.time_patterns = JSON.parse(row.time_patterns || '{}');
                row.device_preferences = JSON.parse(row.device_preferences || '{}');
                row.interests = JSON.parse(row.interests || '[]');
                row.feature_vector = JSON.parse(row.feature_vector || '[]');
                row.metadata = JSON.parse(row.metadata || '{}');
                return row;
            });

        } catch (error) {
            console.error('[UserClusteringService.getAllUserProfiles] Error:', error);
            return [];
        }
    }

    /**
     * Verifica se deve pular o clustering
     */
    shouldSkipClustering(profiles) {
        if (!this.lastClustering) return false;

        const lastUpdate = new Date(this.lastClustering.timestamp);
        const hoursSinceLastClustering = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);

        // Pular se foi executado nas últimas 6 horas e dados não mudaram significativamente
        if (hoursSinceLastClustering < 6) {
            const significantChanges = profiles.filter(p => {
                const updated = new Date(p.updated_at);
                return (Date.now() - updated.getTime()) / (1000 * 60 * 60) < 1; // Mudanças na última hora
            }).length;

            return significantChanges < profiles.length * 0.1; // Menos de 10% de mudanças
        }

        return false;
    }

    /**
     * Extrai features dos perfis para clustering
     */
    extractFeatures(profiles) {
        return profiles.map(profile => {
            const features = [];

            // Métricas básicas de engajamento
            features.push(profile.total_sessions || 0); // 0
            features.push(profile.total_page_views || 0); // 1
            features.push(profile.total_clicks || 0); // 2
            features.push(profile.total_scroll_events || 0); // 3
            features.push(profile.total_time_spent || 0); // 4
            features.push(profile.avg_session_duration || 0); // 5
            features.push(profile.max_scroll_depth || 0); // 6
            features.push(profile.bounce_rate || 0); // 7

            // Scores calculados
            features.push(profile.engagement_score || 0); // 8

            // Padrões de comportamento
            const favoritePagesCount = (profile.favorite_pages || []).length;
            features.push(favoritePagesCount); // 9

            const clickPatternDiversity = Object.keys(profile.click_patterns || {}).length;
            features.push(clickPatternDiversity); // 10

            // Padrões temporais
            const activeHours = Object.keys(profile.time_patterns || {}).length;
            features.push(activeHours); // 11

            // Preferências de dispositivo
            const deviceDiversity = Object.keys(profile.device_preferences || {}).length;
            features.push(deviceDiversity); // 12

            // Sinais de intenção de compra
            features.push(profile.purchase_intent_signals || 0); // 13
            features.push(profile.abandonment_instances || 0); // 14

            return features;
        });
    }

    /**
     * Normaliza as features usando z-score
     */
    normalizeFeatures(features) {
        if (features.length === 0) return [];

        const numFeatures = features[0].length;
        const normalized = [];

        for (let i = 0; i < numFeatures; i++) {
            const values = features.map(f => f[i]);
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            const std = Math.sqrt(
                values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
            );

            // Evitar divisão por zero
            const safeStd = std === 0 ? 1 : std;

            features.forEach((feature, idx) => {
                if (!normalized[idx]) normalized[idx] = [];
                normalized[idx][i] = (feature[i] - mean) / safeStd;
            });
        }

        return normalized;
    }

    /**
     * Algoritmo K-means implementado em JavaScript puro
     */
    kMeansClustering(data, k) {
        const n = data.length;
        const dimensions = data[0].length;

        // Inicializar centroids aleatoriamente
        let centroids = [];
        for (let i = 0; i < k; i++) {
            const randomIndex = Math.floor(Math.random() * n);
            centroids.push([...data[randomIndex]]);
        }

        let clusters = new Array(n).fill(0);
        let iterations = 0;
        let converged = false;

        while (iterations < this.maxIterations && !converged) {
            iterations++;

            // Atribuir pontos aos clusters mais próximos
            const newClusters = new Array(n);
            for (let i = 0; i < n; i++) {
                let minDistance = Infinity;
                let closestCentroid = 0;

                for (let j = 0; j < k; j++) {
                    const distance = this.euclideanDistance(data[i], centroids[j]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCentroid = j;
                    }
                }

                newClusters[i] = closestCentroid;
            }

            // Calcular novos centroids
            const newCentroids = [];
            for (let j = 0; j < k; j++) {
                const clusterPoints = data.filter((_, i) => newClusters[i] === j);
                if (clusterPoints.length === 0) {
                    // Se cluster vazio, manter centroid anterior
                    newCentroids.push([...centroids[j]]);
                } else {
                    const centroid = new Array(dimensions).fill(0);
                    for (const point of clusterPoints) {
                        for (let d = 0; d < dimensions; d++) {
                            centroid[d] += point[d];
                        }
                    }
                    for (let d = 0; d < dimensions; d++) {
                        centroid[d] /= clusterPoints.length;
                    }
                    newCentroids.push(centroid);
                }
            }

            // Verificar convergência
            let totalMovement = 0;
            for (let j = 0; j < k; j++) {
                totalMovement += this.euclideanDistance(centroids[j], newCentroids[j]);
            }

            converged = totalMovement < this.convergenceThreshold;
            centroids = newCentroids;
            clusters = newClusters;
        }

        return {
            clusters,
            centroids,
            iterations,
            converged,
            dataPoints: n
        };
    }

    /**
     * Calcula distância euclidiana entre dois pontos
     */
    euclideanDistance(point1, point2) {
        let sum = 0;
        for (let i = 0; i < point1.length; i++) {
            sum += Math.pow(point1[i] - point2[i], 2);
        }
        return Math.sqrt(sum);
    }

    /**
     * Atribui clusters aos usuários no banco de dados
     */
    async assignClustersToUsers(profiles, clusterAssignments) {
        try {
            const updates = profiles.map((profile, index) => ({
                user_id: profile.user_id,
                cluster_id: clusterAssignments[index]
            }));

            await UserBehavior.bulkUpdateClusters(updates);

            console.log(`[UserClustering] Assigned ${updates.length} users to clusters`);

            return updates.length;

        } catch (error) {
            console.error('[UserClusteringService.assignClustersToUsers] Error:', error);
            throw error;
        }
    }

    /**
     * Calcula estatísticas dos clusters
     */
    calculateClusterStatistics(profiles, clusterAssignments, features) {
        const stats = {};
        const k = Math.max(...clusterAssignments) + 1;

        for (let i = 0; i < k; i++) {
            const clusterProfiles = profiles.filter((_, idx) => clusterAssignments[idx] === i);
            const clusterFeatures = features.filter((_, idx) => clusterAssignments[idx] === i);

            if (clusterProfiles.length === 0) continue;

            // Estatísticas básicas
            const avgEngagement = clusterProfiles.reduce((sum, p) => sum + (p.engagement_score || 0), 0) / clusterProfiles.length;
            const avgSessions = clusterProfiles.reduce((sum, p) => sum + (p.total_sessions || 0), 0) / clusterProfiles.length;
            const avgTime = clusterProfiles.reduce((sum, p) => sum + (p.total_time_spent || 0), 0) / clusterProfiles.length;
            const conversionSignals = clusterProfiles.reduce((sum, p) => sum + (p.purchase_intent_signals || 0), 0);

            // Características do cluster
            const characteristics = {
                highEngagement: avgEngagement > 60,
                frequentVisitor: avgSessions > 5,
                longSessions: avgTime > 600, // 10+ minutos
                highIntent: conversionSignals > clusterProfiles.length * 0.5,
                mobilePreferred: this.isMobilePreferred(clusterProfiles),
                nightOwl: this.isNightOwl(clusterProfiles)
            };

            stats[i] = {
                size: clusterProfiles.length,
                avgEngagement: Math.round(avgEngagement),
                avgSessions: Math.round(avgSessions),
                avgTimeSpent: Math.round(avgTime),
                conversionSignals,
                characteristics,
                centroid: this.calculateCentroid(clusterFeatures)
            };
        }

        return stats;
    }

    /**
     * Verifica se o cluster prefere dispositivos móveis
     */
    isMobilePreferred(profiles) {
        let mobileCount = 0;
        let totalCount = 0;

        profiles.forEach(profile => {
            const devices = profile.device_preferences || {};
            Object.entries(devices).forEach(([device, count]) => {
                totalCount += count;
                if (device === 'mobile') mobileCount += count;
            });
        });

        return totalCount > 0 && (mobileCount / totalCount) > 0.6;
    }

    /**
     * Verifica se o cluster é ativo à noite
     */
    isNightOwl(profiles) {
        let nightActivity = 0;
        let totalActivity = 0;

        profiles.forEach(profile => {
            const times = profile.time_patterns || {};
            Object.entries(times).forEach(([hour, count]) => {
                totalActivity += count;
                const hourNum = parseInt(hour);
                if (hourNum >= 22 || hourNum <= 5) {
                    nightActivity += count;
                }
            });
        });

        return totalActivity > 0 && (nightActivity / totalActivity) > 0.4;
    }

    /**
     * Calcula centróide de um cluster
     */
    calculateCentroid(features) {
        if (features.length === 0) return [];

        const dimensions = features[0].length;
        const centroid = new Array(dimensions).fill(0);

        for (const feature of features) {
            for (let d = 0; d < dimensions; d++) {
                centroid[d] += feature[d];
            }
        }

        for (let d = 0; d < dimensions; d++) {
            centroid[d] /= features.length;
        }

        return centroid;
    }

    /**
     * Calcula Silhouette Score para avaliar qualidade do clustering
     */
    calculateSilhouetteScore(data, clusters) {
        if (data.length < 2) return 0;

        const n = data.length;
        const k = Math.max(...clusters) + 1;
        let totalScore = 0;

        for (let i = 0; i < n; i++) {
            const cluster = clusters[i];
            const point = data[i];

            // Calcular distância média intra-cluster (a)
            let intraDistance = 0;
            let intraCount = 0;
            for (let j = 0; j < n; j++) {
                if (clusters[j] === cluster && i !== j) {
                    intraDistance += this.euclideanDistance(point, data[j]);
                    intraCount++;
                }
            }
            const a = intraCount > 0 ? intraDistance / intraCount : 0;

            // Calcular menor distância média inter-cluster (b)
            let minInterDistance = Infinity;
            for (let c = 0; c < k; c++) {
                if (c === cluster) continue;

                let interDistance = 0;
                let interCount = 0;
                for (let j = 0; j < n; j++) {
                    if (clusters[j] === c) {
                        interDistance += this.euclideanDistance(point, data[j]);
                        interCount++;
                    }
                }

                if (interCount > 0) {
                    const avgInterDistance = interDistance / interCount;
                    minInterDistance = Math.min(minInterDistance, avgInterDistance);
                }
            }

            // Calcular silhouette
            const b = minInterDistance === Infinity ? 0 : minInterDistance;
            const silhouette = (b - a) / Math.max(a, b);
            totalScore += isNaN(silhouette) ? 0 : silhouette;
        }

        return totalScore / n;
    }

    /**
     * Atualiza scores preditivos baseados nos clusters
     */
    async updatePredictiveScores(profiles, clusterAssignments, clusterStats) {
        try {
            const updates = profiles.map((profile, index) => {
                const clusterId = clusterAssignments[index];
                const cluster = clusterStats[clusterId];

                // Calcular scores baseados no cluster
                let conversionProbability = 50; // baseline
                let churnRisk = 50; // baseline

                if (cluster) {
                    // Probabilidade de conversão baseada nas características do cluster
                    if (cluster.characteristics.highIntent) conversionProbability += 30;
                    if (cluster.characteristics.frequentVisitor) conversionProbability += 20;
                    if (cluster.avgEngagement > 70) conversionProbability += 15;

                    // Risco de churn
                    if (cluster.characteristics.highEngagement) churnRisk -= 20;
                    if (cluster.characteristics.frequentVisitor) churnRisk -= 15;
                    if (profile.total_sessions < 2) churnRisk += 25;
                }

                // Limitar aos ranges
                conversionProbability = Math.max(0, Math.min(100, conversionProbability));
                churnRisk = Math.max(0, Math.min(100, churnRisk));

                return {
                    user_id: profile.user_id,
                    engagement_score: profile.engagement_score || 0,
                    conversion_probability: conversionProbability,
                    churn_risk: churnRisk
                };
            });

            await UserBehavior.bulkUpdatePredictiveScores(updates);

            console.log(`[UserClustering] Updated predictive scores for ${updates.length} users`);

        } catch (error) {
            console.error('[UserClusteringService.updatePredictiveScores] Error:', error);
        }
    }

    /**
     * Obtém estatísticas do último clustering
     */
    getLastClusteringStats() {
        return this.lastClustering;
    }

    /**
     * Prediz cluster para um novo perfil
     */
    predictCluster(userProfile) {
        if (!this.lastClustering) {
            throw new Error('No clustering model available. Run clustering first.');
        }

        const features = this.extractFeatures([userProfile]);
        if (features.length === 0) return null;

        const normalizedFeatures = this.normalizeFeatures(features.concat([features[0]]))[0]; // Normalizar com contexto

        let bestCluster = 0;
        let minDistance = Infinity;

        for (let i = 0; i < this.lastClustering.centroids.length; i++) {
            const distance = this.euclideanDistance(normalizedFeatures, this.lastClustering.centroids[i]);
            if (distance < minDistance) {
                minDistance = distance;
                bestCluster = i;
            }
        }

        return {
            clusterId: bestCluster,
            confidence: 1 / (1 + minDistance), // Confiança baseada na distância
            clusterStats: this.lastClustering.clusterStats[bestCluster]
        };
    }

    /**
     * Otimiza número de clusters usando método do cotovelo
     */
    async optimizeClusters(maxK = 10, minK = 2) {
        try {
            const profiles = await this.getAllUserProfiles();
            if (profiles.length < 50) {
                return { optimalK: 3, reason: 'insufficient_data' };
            }

            const features = this.extractFeatures(profiles);
            const normalizedFeatures = this.normalizeFeatures(features);

            const wcss = []; // Within-Cluster Sum of Squares

            for (let k = minK; k <= maxK; k++) {
                const result = this.kMeansClustering(normalizedFeatures, k);
                const wcssValue = this.calculateWCSS(normalizedFeatures, result.clusters, result.centroids);
                wcss.push({ k, wcss: wcssValue });
            }

            // Método do cotovelo simplificado
            let optimalK = minK;
            let maxElbow = 0;

            for (let i = minK + 1; i < maxK; i++) {
                const elbow = Math.abs(wcss[i - minK].wcss - wcss[i - minK - 1].wcss) -
                    Math.abs(wcss[i - minK + 1].wcss - wcss[i - minK].wcss);
                if (elbow > maxElbow) {
                    maxElbow = elbow;
                    optimalK = i;
                }
            }

            return {
                optimalK,
                wcss,
                method: 'elbow',
                profilesAnalyzed: profiles.length
            };

        } catch (error) {
            console.error('[UserClusteringService.optimizeClusters] Error:', error);
            return { optimalK: 3, error: error.message };
        }
    }

    /**
     * Calcula Within-Cluster Sum of Squares
     */
    calculateWCSS(data, clusters, centroids) {
        let wcss = 0;

        for (let i = 0; i < data.length; i++) {
            const cluster = clusters[i];
            const centroid = centroids[cluster];
            wcss += Math.pow(this.euclideanDistance(data[i], centroid), 2);
        }

        return wcss;
    }
}

// Instância singleton
const userClusteringService = new UserClusteringService();

module.exports = userClusteringService;