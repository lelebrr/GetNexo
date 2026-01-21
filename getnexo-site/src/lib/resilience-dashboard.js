/**
 * Resilience Dashboard - GetNexo Platform
 *
 * Dashboard unificado para monitoramento de todos os sistemas de teste de resiliência,
 * disaster recovery e engenharia do caos.
 */

class ResilienceDashboard {
    constructor() {
        this.components = new Map();
        this.metrics = new Map();
        this.alerts = [];

        this.config = {
            refreshInterval: 30000, // 30 segundos
            retentionPeriod: 24 * 60 * 60 * 1000, // 24 horas
            enableRealTimeUpdates: true
        };

        this.initialize();
    }

    async initialize() {
        this.loadComponents();
        this.startDataCollection();

        console.log('📊 Dashboard de Resiliência inicializado');
    }

    // Carregar componentes integrados
    loadComponents() {
        this.components.set('alerts', window.AdvancedAlertSystem);
        this.components.set('chaos', window.ChaosEngineering);
        this.components.set('loadTesting', window.LoadTestingEngine);
        this.components.set('gameDay', window.GameDayEngine);
        this.components.set('backupTesting', window.BackupTestingEngine);
        this.components.set('failoverTesting', window.FailoverTestingEngine);
        this.components.set('onCall', window.OnCallRotation);
        this.components.set('runbooks', window.AutomatedRunbooks);
        this.components.set('autoScaling', window.AutoScalingEngine);
        this.components.set('autoRestart', window.AutoRestartEngine);
        this.components.set('autoRollback', window.AutoRollbackEngine);
        this.components.set('selfHealing', window.AdvancedSelfHealing);

        // Novos engines de capacity planning e orquestração
        this.components.set('capacityPlanning', window.CapacityPlanningEngine);
        this.components.set('resourceForecasting', window.ResourceForecastingEngine);
        this.components.set('kubernetesOrchestration', window.KubernetesOrchestrationEngine);
        this.components.set('intelligentLoadBalancer', window.IntelligentLoadBalancer);

        console.log(`🔗 ${Array.from(this.components.values()).filter(c => c).length} componentes integrados`);
    }

    // Iniciar coleta de dados
    startDataCollection() {
        // Coleta inicial
        this.collectAllMetrics();

        // Atualizações periódicas
        if (this.config.enableRealTimeUpdates) {
            setInterval(() => {
                this.collectAllMetrics();
            }, this.config.refreshInterval);
        }
    }

    // Coletar métricas de todos os componentes
    async collectAllMetrics() {
        const timestamp = new Date();

        for (const [componentName, component] of this.components) {
            if (!component || !component.getDashboardData) continue;

            try {
                const data = await component.getDashboardData();
                this.metrics.set(componentName, {
                    data: data,
                    timestamp: timestamp,
                    component: componentName
                });
            } catch (error) {
                console.error(`Erro ao coletar métricas de ${componentName}:`, error);
            }
        }

        // Limpar métricas antigas
        this.cleanupOldMetrics();
    }

    // Limpar métricas antigas
    cleanupOldMetrics() {
        const cutoffTime = Date.now() - this.config.retentionPeriod;

        for (const [key, metric] of this.metrics) {
            if (metric.timestamp.getTime() < cutoffTime) {
                this.metrics.delete(key);
            }
        }
    }

    // Dashboard principal consolidado
    getUnifiedDashboard() {
        const dashboard = {
            timestamp: new Date(),
            systemHealth: this.getSystemHealthScore(),
            activeIncidents: this.getActiveIncidentsCount(),
            components: {},
            alerts: this.getConsolidatedAlerts(),
            trends: this.getTrendsAnalysis(),
            recommendations: this.getProactiveRecommendations()
        };

        // Dados de cada componente
        for (const [componentName, metric] of this.metrics) {
            dashboard.components[componentName] = metric.data;
        }

        return dashboard;
    }

    // Calcular score de saúde do sistema
    getSystemHealthScore() {
        let totalScore = 0;
        let componentCount = 0;

        for (const [componentName, metric] of this.metrics) {
            const score = this.calculateComponentScore(componentName, metric.data);
            totalScore += score;
            componentCount++;
        }

        return componentCount > 0 ? Math.round(totalScore / componentCount) : 0;
    }

    // Calcular score individual do componente
    calculateComponentScore(componentName, data) {
        switch (componentName) {
            case 'alerts':
                return this.calculateAlertScore(data);
            case 'chaos':
                return this.calculateChaosScore(data);
            case 'loadTesting':
                return this.calculateLoadTestingScore(data);
            case 'gameDay':
                return this.calculateGameDayScore(data);
            case 'backupTesting':
                return this.calculateBackupScore(data);
            case 'failoverTesting':
                return this.calculateFailoverScore(data);
            default:
                return 85; // Score padrão
        }
    }

    calculateAlertScore(data) {
        const activeAlerts = data.activeAlerts || 0;
        const criticalAlerts = data.criticalAlerts || 0;
        const resolvedToday = data.resolvedToday || 0;

        let score = 100;
        score -= activeAlerts * 5; // -5 por alerta ativo
        score -= criticalAlerts * 15; // -15 por alerta crítico
        score += resolvedToday * 2; // +2 por resolução

        return Math.max(0, Math.min(100, score));
    }

    calculateChaosScore(data) {
        const successRate = data.successRate || 0;
        const activeExperiments = data.activeExperiments || 0;

        let score = successRate;
        score -= activeExperiments * 10; // Penalizar experimentos ativos

        return Math.max(0, Math.min(100, score));
    }

    calculateLoadTestingScore(data) {
        const successRate = data.successRate || 0;
        const activeTests = data.activeTests || 0;

        let score = successRate;
        score -= activeTests * 5; // Penalizar testes ativos

        return Math.max(0, Math.min(100, score));
    }

    calculateGameDayScore(data) {
        const successRate = data.successRate || 0;
        const activeScenarios = data.activeScenarios || 0;

        let score = successRate;
        score -= activeScenarios * 20; // Penalizar cenários ativos

        return Math.max(0, Math.min(100, score));
    }

    calculateBackupScore(data) {
        const successRate = data.successRate || 0;
        const compliance = data.complianceStatus?.overall ? 100 : 0;

        return Math.round((successRate + compliance) / 2);
    }

    calculateFailoverScore(data) {
        const successRate = data.successRate || 0;
        const activeTests = data.activeTests || 0;

        let score = successRate;
        score -= activeTests * 10; // Penalizar testes ativos

        return Math.max(0, Math.min(100, score));
    }

    // Contar incidentes ativos
    getActiveIncidentsCount() {
        let total = 0;

        // Alertas ativos
        const alertsData = this.metrics.get('alerts');
        if (alertsData) {
            total += alertsData.data.activeAlerts || 0;
        }

        // Experimentos caóticos ativos
        const chaosData = this.metrics.get('chaos');
        if (chaosData) {
            total += chaosData.data.activeExperiments || 0;
        }

        // Game days ativos
        const gameDayData = this.metrics.get('gameDay');
        if (gameDayData) {
            total += gameDayData.data.activeScenarios || 0;
        }

        return total;
    }

    // Alertas consolidados
    getConsolidatedAlerts() {
        const consolidatedAlerts = [];

        // Coletar alertas de diferentes sistemas
        for (const [componentName, metric] of this.metrics) {
            if (metric.data.recentAlerts || metric.data.recentTests) {
                const alerts = metric.data.recentAlerts || metric.data.recentTests.filter(t => !t.result?.overallSuccess);
                alerts.forEach(alert => {
                    consolidatedAlerts.push({
                        ...alert,
                        source: componentName,
                        severity: this.mapSeverity(componentName, alert)
                    });
                });
            }
        }

        return consolidatedAlerts.slice(-10); // Últimos 10
    }

    mapSeverity(componentName, alert) {
        switch (componentName) {
            case 'alerts':
                return alert.level || 'warning';
            case 'chaos':
            case 'loadTesting':
            case 'gameDay':
            case 'backupTesting':
            case 'failoverTesting':
                return alert.status === 'failed' ? 'critical' : 'warning';
            default:
                return 'info';
        }
    }

    // Análise de tendências
    getTrendsAnalysis() {
        return {
            systemHealthTrend: this.calculateHealthTrend(),
            incidentTrend: this.calculateIncidentTrend(),
            testSuccessTrend: this.calculateTestSuccessTrend(),
            period: 'last_24h'
        };
    }

    calculateHealthTrend() {
        // Simulação - em produção analisaria histórico
        return Math.random() > 0.5 ? 'improving' : 'stable';
    }

    calculateIncidentTrend() {
        // Simulação
        return Math.random() > 0.6 ? 'decreasing' : 'increasing';
    }

    calculateTestSuccessTrend() {
        // Simulação
        return Math.random() > 0.4 ? 'improving' : 'stable';
    }

    // Recomendações proativas
    getProactiveRecommendations() {
        const recommendations = [];

        const systemHealth = this.getSystemHealthScore();

        if (systemHealth < 70) {
            recommendations.push({
                priority: 'high',
                message: 'Saúde do sistema baixa - considerar game day de emergência',
                action: 'run_emergency_gameday'
            });
        }

        const activeIncidents = this.getActiveIncidentsCount();
        if (activeIncidents > 5) {
            recommendations.push({
                priority: 'high',
                message: `${activeIncidents} incidentes ativos - ativar protocolo de resposta`,
                action: 'activate_incident_response'
            });
        }

        // Verificar testes pendentes
        const loadTestingData = this.metrics.get('loadTesting');
        if (loadTestingData && loadTestingData.data.scheduledTests > 0) {
            const lastTest = loadTestingData.data.recentTests[0];
            if (lastTest && Date.now() - lastTest.startTime > 7 * 24 * 60 * 60 * 1000) { // 7 dias
                recommendations.push({
                    priority: 'medium',
                    message: 'Testes de carga desatualizados - executar testes recentes',
                    action: 'run_load_tests'
                });
            }
        }

        return recommendations.slice(0, 5); // Top 5
    }

    // Dashboard específico por categoria
    getResilienceDashboard() {
        return this.getUnifiedDashboard();
    }

    getChaosDashboard() {
        return this.metrics.get('chaos')?.data || {};
    }

    getLoadTestingDashboard() {
        return this.metrics.get('loadTesting')?.data || {};
    }

    getGameDayDashboard() {
        return this.metrics.get('gameDay')?.data || {};
    }

    getBackupDashboard() {
        return this.metrics.get('backupTesting')?.data || {};
    }

    getFailoverDashboard() {
        return this.metrics.get('failoverTesting')?.data || {};
    }

    getCapacityPlanningDashboard() {
        return this.metrics.get('capacityPlanning')?.data || {};
    }

    getResourceForecastingDashboard() {
        return this.metrics.get('resourceForecasting')?.data || {};
    }

    getKubernetesDashboard() {
        return this.metrics.get('kubernetesOrchestration')?.data || {};
    }

    getLoadBalancerDashboard() {
        return this.metrics.get('intelligentLoadBalancer')?.data || {};
    }

    getIncidentResponseDashboard() {
        const alerts = this.metrics.get('alerts')?.data || {};
        const onCall = this.metrics.get('onCall')?.data || {};
        const runbooks = this.metrics.get('runbooks')?.data || {};

        return {
            ...alerts,
            onCallStatus: onCall,
            automatedRunbooks: runbooks
        };
    }

    // Executar ação recomendada
    async executeRecommendation(action) {
        console.log(`🎯 Executando recomendação: ${action}`);

        switch (action) {
            case 'run_emergency_gameday':
                if (window.GameDayEngine) {
                    return await window.GameDayEngine.runGameDay('database_outage', { emergency: true });
                }
                break;

            case 'activate_incident_response':
                if (window.OnCallRotation) {
                    return await window.OnCallRotation.activateOnCall({
                        type: 'multiple_incidents',
                        severity: 'high'
                    });
                }
                break;

            case 'run_load_tests':
                if (window.LoadTestingEngine) {
                    return await window.LoadTestingEngine.runTest('basic_load');
                }
                break;
        }

        return { success: false, message: 'Ação não suportada' };
    }

    // API para integração com UI
    getDashboardData() {
        return this.getUnifiedDashboard();
    }

    refreshData() {
        this.collectAllMetrics();
        return this.getDashboardData();
    }

    getMetrics() {
        return Object.fromEntries(this.metrics);
    }

    getAlerts() {
        return this.getConsolidatedAlerts();
    }

    getHealthScore() {
        return this.getSystemHealthScore();
    }
}

// Instância global
window.ResilienceDashboard = new ResilienceDashboard();

// API global para dashboards
window.dashboards = {
    resilience: () => window.ResilienceDashboard.getResilienceDashboard(),
    chaos: () => window.ResilienceDashboard.getChaosDashboard(),
    loadTesting: () => window.ResilienceDashboard.getLoadTestingDashboard(),
    gameDay: () => window.ResilienceDashboard.getGameDayDashboard(),
    backup: () => window.ResilienceDashboard.getBackupDashboard(),
    failover: () => window.ResilienceDashboard.getFailoverDashboard(),
    incidentResponse: () => window.ResilienceDashboard.getIncidentResponseDashboard(),

    // Novos dashboards de capacity planning e orquestração
    capacityPlanning: () => window.ResilienceDashboard.getCapacityPlanningDashboard(),
    resourceForecasting: () => window.ResilienceDashboard.getResourceForecastingDashboard(),
    kubernetes: () => window.ResilienceDashboard.getKubernetesDashboard(),
    loadBalancer: () => window.ResilienceDashboard.getLoadBalancerDashboard(),

    unified: () => window.ResilienceDashboard.getUnifiedDashboard(),
    refresh: () => window.ResilienceDashboard.refreshData(),
    executeAction: (action) => window.ResilienceDashboard.executeRecommendation(action)
};

export default ResilienceDashboard;