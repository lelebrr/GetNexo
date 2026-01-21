/**
 * Serviço de Alertas em Tempo Real
 * Gerencia notificações WebSocket para alertas de sentimento
 */
class RealtimeAlertsService {
    constructor(io) {
        this.io = io;
        this.connectedClients = new Map(); // userId -> socket
        this.alertHistory = [];
        this.maxHistorySize = 1000;

        this.setupSocketHandlers();
        console.log('[REALTIME ALERTS] Serviço inicializado');
    }

    /**
     * Configura handlers de socket
     */
    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`[REALTIME ALERTS] Cliente conectado: ${socket.id}`);

            // Autenticação do cliente
            socket.on('authenticate', (data) => {
                const { userId, token } = data;
                if (this.authenticateSocket(socket, userId, token)) {
                    this.connectedClients.set(userId, socket);
                    socket.userId = userId;
                    socket.emit('authenticated', { success: true });

                    console.log(`[REALTIME ALERTS] Cliente autenticado: ${userId}`);
                } else {
                    socket.emit('authenticated', { success: false, error: 'Autenticação falhou' });
                }
            });

            // Cliente solicita histórico de alertas
            socket.on('get_alert_history', (data) => {
                if (socket.userId) {
                    const userAlerts = this.getUserAlertHistory(socket.userId, data.limit || 50);
                    socket.emit('alert_history', userAlerts);
                }
            });

            // Cliente marca alerta como lido
            socket.on('mark_alert_read', (data) => {
                if (socket.userId) {
                    this.markAlertAsRead(data.alertId, socket.userId);
                    socket.emit('alert_updated', { alertId: data.alertId, read: true });
                }
            });

            // Desconexão
            socket.on('disconnect', () => {
                if (socket.userId) {
                    this.connectedClients.delete(socket.userId);
                    console.log(`[REALTIME ALERTS] Cliente desconectado: ${socket.userId}`);
                }
            });

            // Ping para manter conexão viva
            socket.on('ping', () => {
                socket.emit('pong');
            });
        });
    }

    /**
     * Autentica socket do cliente
     * @param {Socket} socket - Socket do cliente
     * @param {string} userId - ID do usuário
     * @param {string} token - Token de autenticação
     * @returns {boolean} Se autenticação foi bem-sucedida
     */
    authenticateSocket(socket, userId, token) {
        // Implementação básica - em produção, verificar token JWT
        return userId && token && token.length > 10;
    }

    /**
     * Envia alerta para usuário específico
     * @param {string} userId - ID do usuário destinatário
     * @param {Object} alert - Dados do alerta
     */
    sendAlertToUser(userId, alert) {
        const socket = this.connectedClients.get(userId);
        if (socket) {
            socket.emit('new_alert', alert);
            console.log(`[REALTIME ALERTS] Alerta enviado para usuário ${userId}: ${alert.type}`);
        } else {
            console.log(`[REALTIME ALERTS] Usuário ${userId} não conectado, alerta armazenado`);
        }

        // Armazena no histórico
        this.storeAlert({ ...alert, userId, sent: true, sentAt: new Date() });
    }

    /**
     * Envia alerta para todos os usuários conectados
     * @param {Object} alert - Dados do alerta
     */
    broadcastAlert(alert) {
        this.io.emit('new_alert', alert);
        console.log(`[REALTIME ALERTS] Alerta broadcast enviado: ${alert.type}`);

        // Armazena no histórico para todos os usuários
        for (const userId of this.connectedClients.keys()) {
            this.storeAlert({ ...alert, userId, sent: true, sentAt: new Date() });
        }
    }

    /**
     * Envia alerta para usuários com permissões específicas
     * @param {string[]} permissions - Permissões necessárias
     * @param {Object} alert - Dados do alerta
     */
    sendAlertToUsersWithPermissions(permissions, alert) {
        let sentCount = 0;
        for (const [userId, socket] of this.connectedClients.entries()) {
            // Em produção, verificar permissões do usuário
            if (this.userHasPermissions(userId, permissions)) {
                socket.emit('new_alert', alert);
                this.storeAlert({ ...alert, userId, sent: true, sentAt: new Date() });
                sentCount++;
            }
        }

        console.log(`[REALTIME ALERTS] Alerta enviado para ${sentCount} usuários com permissões: ${permissions.join(', ')}`);
    }

    /**
     * Verifica se usuário tem permissões
     * @param {string} userId - ID do usuário
     * @param {string[]} permissions - Permissões necessárias
     * @returns {boolean} Se usuário tem permissões
     */
    userHasPermissions(userId, permissions) {
        // Implementação básica - em produção, consultar banco de dados
        return permissions.includes('admin') || permissions.includes('agent');
    }

    /**
     * Cria e envia alerta de sentimento
     * @param {Object} sentimentAnalysis - Resultado da análise
     * @param {Object} ticket - Ticket relacionado
     * @param {string} messageId - ID da mensagem (opcional)
     */
    sendSentimentAlert(sentimentAnalysis, ticket, messageId = null) {
        const alert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: sentimentAnalysis.alertType || 'sentiment',
            title: this.getAlertTitle(sentimentAnalysis.alertType),
            message: sentimentAnalysis.alertMessage,
            severity: this.getAlertSeverity(sentimentAnalysis.score),
            data: {
                ticketId: ticket._id || ticket.id,
                ticketTitle: ticket.title,
                score: sentimentAnalysis.score,
                sentiment: sentimentAnalysis.sentiment,
                category: sentimentAnalysis.category,
                confidence: sentimentAnalysis.confidence,
                messageId,
                agentId: ticket.assignee?.userId,
                department: ticket.department
            },
            timestamp: new Date(),
            read: false,
            actionable: true
        };

        // Decide como enviar o alerta
        if (alert.severity === 'critical') {
            // Alertas críticos vão para todos os admins
            this.sendAlertToUsersWithPermissions(['admin', 'supervisor'], alert);
        } else if (ticket.assignee?.userId) {
            // Alertas normais vão para o agente responsável
            this.sendAlertToUser(ticket.assignee.userId, alert);
        } else {
            // Sem agente específico, envia para admins
            this.sendAlertToUsersWithPermissions(['admin'], alert);
        }
    }

    /**
     * Obtém título do alerta baseado no tipo
     * @param {string} alertType - Tipo do alerta
     * @returns {string} Título do alerta
     */
    getAlertTitle(alertType) {
        const titles = {
            escalation: '🚨 Escalonamento Urgente',
            warning: '⚠️ Atenção Necessária',
            reward: '🎉 Cliente Satisfeito',
            sentiment: '💭 Análise de Sentimento'
        };
        return titles[alertType] || '📢 Novo Alerta';
    }

    /**
     * Obtém severidade do alerta baseado no score
     * @param {number} score - Score de sentimento
     * @returns {string} Severidade
     */
    getAlertSeverity(score) {
        if (score <= 2) return 'critical';
        if (score <= 4) return 'high';
        if (score >= 9) return 'medium';
        return 'low';
    }

    /**
     * Envia notificação de sistema
     * @param {string} title - Título da notificação
     * @param {string} message - Mensagem
     * @param {string} severity - Severidade (info, warning, error, success)
     * @param {Object} data - Dados adicionais
     */
    sendSystemNotification(title, message, severity = 'info', data = {}) {
        const alert = {
            id: `system_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'system',
            title,
            message,
            severity,
            data,
            timestamp: new Date(),
            read: false,
            actionable: false
        };

        this.broadcastAlert(alert);
    }

    /**
     * Envia alerta de performance
     * @param {Object} metrics - Métricas de performance
     */
    sendPerformanceAlert(metrics) {
        const alert = {
            id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'performance',
            title: '📊 Alerta de Performance',
            message: this.getPerformanceMessage(metrics),
            severity: this.getPerformanceSeverity(metrics),
            data: metrics,
            timestamp: new Date(),
            read: false,
            actionable: true
        };

        this.sendAlertToUsersWithPermissions(['admin', 'dev'], alert);
    }

    /**
     * Obtém mensagem de performance
     * @param {Object} metrics - Métricas
     * @returns {string} Mensagem
     */
    getPerformanceMessage(metrics) {
        if (metrics.errorRate > 0.1) {
            return `Taxa de erro elevada: ${(metrics.errorRate * 100).toFixed(1)}%`;
        }
        if (metrics.responseTime > 5000) {
            return `Tempo de resposta alto: ${metrics.responseTime}ms`;
        }
        if (metrics.sentimentScore < 3) {
            return `Score médio de sentimento baixo: ${metrics.sentimentScore.toFixed(1)}`;
        }
        return 'Métricas de performance fora do padrão';
    }

    /**
     * Obtém severidade de performance
     * @param {Object} metrics - Métricas
     * @returns {string} Severidade
     */
    getPerformanceSeverity(metrics) {
        if (metrics.errorRate > 0.1 || metrics.responseTime > 10000) return 'critical';
        if (metrics.errorRate > 0.05 || metrics.responseTime > 5000) return 'high';
        if (metrics.sentimentScore < 5) return 'medium';
        return 'low';
    }

    /**
     * Armazena alerta no histórico
     * @param {Object} alert - Alerta para armazenar
     */
    storeAlert(alert) {
        this.alertHistory.unshift(alert);

        // Mantém tamanho máximo do histórico
        if (this.alertHistory.length > this.maxHistorySize) {
            this.alertHistory = this.alertHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Obtém histórico de alertas do usuário
     * @param {string} userId - ID do usuário
     * @param {number} limit - Limite de resultados
     * @returns {Object[]} Histórico de alertas
     */
    getUserAlertHistory(userId, limit = 50) {
        return this.alertHistory
            .filter(alert => alert.userId === userId)
            .slice(0, limit);
    }

    /**
     * Marca alerta como lido
     * @param {string} alertId - ID do alerta
     * @param {string} userId - ID do usuário
     */
    markAlertAsRead(alertId, userId) {
        const alert = this.alertHistory.find(a => a.id === alertId && a.userId === userId);
        if (alert) {
            alert.read = true;
        }
    }

    /**
     * Obtém estatísticas de alertas
     * @returns {Object} Estatísticas
     */
    getAlertStats() {
        const total = this.alertHistory.length;
        const unread = this.alertHistory.filter(a => !a.read).length;
        const byType = {};
        const bySeverity = {};

        this.alertHistory.forEach(alert => {
            byType[alert.type] = (byType[alert.type] || 0) + 1;
            bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
        });

        return {
            total,
            unread,
            byType,
            bySeverity,
            connectedClients: this.connectedClients.size
        };
    }

    /**
     * Limpa alertas antigos
     * @param {number} daysOld - Dias para considerar antigo
     * @returns {number} Número de alertas removidos
     */
    cleanupOldAlerts(daysOld = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const initialLength = this.alertHistory.length;
        this.alertHistory = this.alertHistory.filter(alert =>
            new Date(alert.timestamp) > cutoffDate
        );

        const removed = initialLength - this.alertHistory.length;
        console.log(`[REALTIME ALERTS] ${removed} alertas antigos removidos`);
        return removed;
    }

    /**
     * Envia heartbeat para manter conexões vivas
     */
    startHeartbeat() {
        setInterval(() => {
            this.io.emit('heartbeat', { timestamp: new Date() });
        }, 30000); // A cada 30 segundos
    }

    /**
     * Para o serviço
     */
    shutdown() {
        console.log('[REALTIME ALERTS] Serviço parado');
        this.connectedClients.clear();
        this.alertHistory = [];
    }
}

module.exports = RealtimeAlertsService;
