/**
 * Game Day Test Processor - GetNexo Platform
 *
 * Processador customizado para testes de carga que simulam cenários de disaster recovery
 * e game days com integração com o sistema de incident response.
 */

class GameDayProcessor {
    constructor() {
        this.incidents = [];
        this.metrics = [];
        this.phaseStartTime = Date.now();
        this.currentPhase = '';
    }

    // Função executada antes do teste começar
    beforeRequest(requestParams, context, ee, next) {
        // Adicionar headers customizados baseados na fase do teste
        const phase = this.getCurrentPhase();

        if (phase === 'Incident Simulation') {
            // Durante incidente, adicionar header para simular degradação
            requestParams.headers['X-Incident-Simulation'] = 'true';
            requestParams.headers['X-Degraded-Mode'] = 'true';
        }

        if (phase === 'Recovery Phase') {
            requestParams.headers['X-Recovery-Mode'] = 'true';
        }

        // Adicionar timestamp para rastreamento
        requestParams.headers['X-Request-Timestamp'] = Date.now().toString();

        return next();
    }

    // Função executada após cada request
    afterResponse(requestParams, response, context, ee, next) {
        const responseTime = response.timings.phases.total;
        const statusCode = response.statusCode;
        const phase = this.getCurrentPhase();

        // Coletar métricas por fase
        this.metrics.push({
            timestamp: Date.now(),
            phase: phase,
            responseTime: responseTime,
            statusCode: statusCode,
            url: requestParams.url,
            method: requestParams.method
        });

        // Detectar incidentes baseado em métricas
        if (this.shouldTriggerIncident(responseTime, statusCode, phase)) {
            this.triggerIncidentSimulation({
                phase: phase,
                responseTime: responseTime,
                statusCode: statusCode,
                url: requestParams.url
            });
        }

        // Simular recovery baseado na fase
        if (phase === 'Recovery Phase' && this.incidents.length > 0) {
            this.simulateRecovery();
        }

        return next();
    }

    // Determinar fase atual baseada no tempo
    getCurrentPhase() {
        const elapsed = Date.now() - this.phaseStartTime;
        const elapsedMinutes = elapsed / 60000;

        if (elapsedMinutes < 5) return 'Normal Operation';
        if (elapsedMinutes < 8) return 'Load Increase';
        if (elapsedMinutes < 10) return 'Incident Simulation';
        if (elapsedMinutes < 15) return 'Recovery Phase';
        return 'Post-Incident Normal';
    }

    // Lógica para decidir quando simular incidente
    shouldTriggerIncident(responseTime, statusCode, phase) {
        // Durante fase de incidente, simular falhas
        if (phase === 'Incident Simulation') {
            return Math.random() < 0.3; // 30% chance de falha
        }

        // Durante alta carga, falhas baseadas em performance
        if (phase === 'Load Increase' && responseTime > 3000) {
            return Math.random() < 0.1; // 10% chance se lento
        }

        return false;
    }

    // Simular trigger de incidente
    triggerIncidentSimulation(details) {
        const incident = {
            id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            type: 'load_test_simulated',
            details: details,
            severity: details.phase === 'Incident Simulation' ? 'high' : 'medium',
            status: 'active'
        };

        this.incidents.push(incident);

        console.log(`🚨 INCIDENTE SIMULADO: ${incident.type} - ${JSON.stringify(details)}`);

        // Integrar com sistema de alertas (se disponível)
        if (window.alerts && window.alerts.trigger) {
            window.alerts.trigger('simulated_incident', {
                incidentId: incident.id,
                type: incident.type,
                details: details
            });
        }
    }

    // Simular recovery do sistema
    simulateRecovery() {
        const activeIncidents = this.incidents.filter(i => i.status === 'active');

        activeIncidents.forEach(incident => {
            // Simular recovery após algum tempo
            const incidentDuration = Date.now() - incident.timestamp;
            if (incidentDuration > 30000) { // 30 segundos de "incidente"
                incident.status = 'resolved';
                incident.resolvedAt = Date.now();

                console.log(`✅ INCIDENTE RESOLVIDO: ${incident.id} (${incidentDuration}ms)`);

                // Notificar resolução
                if (window.alerts && window.alerts.resolve) {
                    window.alerts.resolve(`simulated_incident_${incident.id}`);
                }
            }
        });
    }

    // Hook executado no final do teste
    afterScenario(context, ee, next) {
        // Gerar relatório final
        this.generateFinalReport();
        return next();
    }

    // Gerar relatório final do game day
    generateFinalReport() {
        const report = {
            testDuration: Date.now() - this.phaseStartTime,
            totalRequests: this.metrics.length,
            incidentsTriggered: this.incidents.length,
            incidentsResolved: this.incidents.filter(i => i.status === 'resolved').length,
            metricsByPhase: this.analyzeMetricsByPhase(),
            recommendations: this.generateRecommendations()
        };

        console.log('🎭 GAME DAY REPORT:', JSON.stringify(report, null, 2));

        // Salvar relatório
        try {
            const reportData = JSON.stringify(report, null, 2);
            // Em produção, salvaria em arquivo ou banco
            localStorage.setItem('nexo-game-day-report', reportData);
        } catch (error) {
            console.error('Erro ao salvar relatório:', error);
        }
    }

    // Análise de métricas por fase
    analyzeMetricsByPhase() {
        const phases = {};
        const phaseNames = ['Normal Operation', 'Load Increase', 'Incident Simulation', 'Recovery Phase', 'Post-Incident Normal'];

        phaseNames.forEach(phase => {
            const phaseMetrics = this.metrics.filter(m => m.phase === phase);
            if (phaseMetrics.length > 0) {
                const responseTimes = phaseMetrics.map(m => m.responseTime);
                phases[phase] = {
                    requestCount: phaseMetrics.length,
                    avgResponseTime: this.average(responseTimes),
                    p95ResponseTime: this.percentile(responseTimes, 95),
                    errorCount: phaseMetrics.filter(m => m.statusCode >= 400).length,
                    errorRate: phaseMetrics.filter(m => m.statusCode >= 400).length / phaseMetrics.length
                };
            }
        });

        return phases;
    }

    // Gerar recomendações baseadas nos resultados
    generateRecommendations() {
        const recommendations = [];
        const analysis = this.analyzeMetricsByPhase();

        // Verificar performance durante incidente
        const incidentPhase = analysis['Incident Simulation'];
        if (incidentPhase) {
            if (incidentPhase.p95ResponseTime > 5000) {
                recommendations.push('Considere implementar circuit breakers para melhorar resiliência durante incidentes');
            }
            if (incidentPhase.errorRate > 0.1) {
                recommendations.push('Taxa de erro alta durante incidente - revise estratégia de fallback');
            }
        }

        // Verificar recovery
        const recoveryPhase = analysis['Recovery Phase'];
        if (recoveryPhase && recoveryPhase.avgResponseTime > 2000) {
            recommendations.push('Recovery lento - otimize processos de auto-healing');
        }

        return recommendations;
    }

    // Utilitários matemáticos
    average(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    }

    percentile(array, p) {
        const sorted = array.sort((a, b) => a - b);
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[index];
    }
}

// Exportar para uso no Artillery
module.exports = {
    beforeRequest: function (requestParams, context, ee, next) {
        if (!global.gameDayProcessor) {
            global.gameDayProcessor = new GameDayProcessor();
        }
        return global.gameDayProcessor.beforeRequest(requestParams, context, ee, next);
    },

    afterResponse: function (requestParams, response, context, ee, next) {
        if (global.gameDayProcessor) {
            return global.gameDayProcessor.afterResponse(requestParams, response, context, ee, next);
        }
        return next();
    },

    afterScenario: function (context, ee, next) {
        if (global.gameDayProcessor) {
            return global.gameDayProcessor.afterScenario(context, ee, next);
        }
        return next();
    }
};