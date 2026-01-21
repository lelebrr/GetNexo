const UserEvent = require('../models/UserEvent');
const UserBehavior = require('../models/UserBehavior');
const BehavioralTag = require('../models/BehavioralTag');
const BehaviorRule = require('../models/BehaviorRule');

class BehavioralTrackingService {
    constructor() {
        this.eventBuffer = new Map(); // Buffer para processamento em lote
        this.processingInterval = setInterval(() => this.processBufferedEvents(), 30000); // Processar a cada 30 segundos
    }

    /**
     * Processa eventos comportamentais recebidos
     * @param {Array} events - Array de eventos
     * @param {string} sessionId - ID da sessão
     */
    async processEvents(events, sessionId) {
        try {
            if (!Array.isArray(events) || events.length === 0) {
                return { success: false, message: 'Nenhum evento válido fornecido' };
            }

            // Filtrar eventos válidos
            const validEvents = events.filter(event =>
                event.event_type &&
                event.page_url &&
                event.timestamp &&
                event.session_id === sessionId
            );

            if (validEvents.length === 0) {
                return { success: false, message: 'Nenhum evento válido após filtragem' };
            }

            // Salvar eventos no banco (já feito pelo endpoint de tracking)
            // Aqui focamos no processamento comportamental

            // Adicionar ao buffer para processamento em lote
            this.addToBuffer(sessionId, validEvents);

            // Processar regras de tagging em tempo real para eventos importantes
            await this.processRealtimeTagging(sessionId, validEvents);

            // Atualizar perfil comportamental
            await this.updateUserBehaviorProfile(sessionId, validEvents);

            return {
                success: true,
                processed: validEvents.length,
                message: `${validEvents.length} eventos processados`
            };

        } catch (error) {
            console.error('[BehavioralTrackingService.processEvents] Error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Adiciona eventos ao buffer para processamento em lote
     */
    addToBuffer(sessionId, events) {
        if (!this.eventBuffer.has(sessionId)) {
            this.eventBuffer.set(sessionId, []);
        }

        const buffer = this.eventBuffer.get(sessionId);
        buffer.push(...events);

        // Limitar tamanho do buffer (últimos 1000 eventos por sessão)
        if (buffer.length > 1000) {
            buffer.splice(0, buffer.length - 1000);
        }
    }

    /**
     * Processa regras de tagging em tempo real para eventos importantes
     */
    async processRealtimeTagging(sessionId, events) {
        try {
            // Buscar regras ativas
            const activeRules = BehaviorRule.findActive();

            for (const rule of activeRules) {
                // Verificar se os eventos atendem às condições da regra
                const ruleMatches = this.evaluateRuleConditions(rule, events, sessionId);

                if (ruleMatches.matched) {
                    // Buscar sessão para obter user_id
                    const UserSession = require('../models/UserSession');
                    const session = UserSession.findBySessionId(sessionId);

                    if (session && session.user_id) {
                        // Verificar se a regra pode ser aplicada
                        const canApply = BehaviorRule.canApplyToUser(rule.id, session.user_id);

                        if (canApply) {
                            // Aplicar tag
                            await this.applyBehavioralTag(session.user_id, rule, ruleMatches.evidence);

                            // Incrementar contador da regra
                            BehaviorRule.incrementApplications(rule.id);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[BehavioralTrackingService.processRealtimeTagging] Error:', error);
        }
    }

    /**
     * Avalia se os eventos atendem às condições de uma regra
     */
    evaluateRuleConditions(rule, events, sessionId) {
        try {
            const conditions = rule.conditions;
            let matched = false;
            const evidence = {
                events: [],
                score: 0
            };

            // Filtrar eventos relevantes da sessão
            const sessionEvents = events.filter(e => e.session_id === sessionId);

            switch (conditions.type || 'behavior') {
                case 'behavior':
                    matched = this.evaluateBehaviorConditions(conditions, sessionEvents, evidence);
                    break;

                case 'sequence':
                    matched = this.evaluateSequenceConditions(conditions, sessionEvents, evidence);
                    break;

                case 'threshold':
                    matched = this.evaluateThresholdConditions(conditions, sessionEvents, evidence);
                    break;

                default:
                    return { matched: false };
            }

            return {
                matched,
                evidence,
                confidence: evidence.score / 100
            };

        } catch (error) {
            console.error('[BehavioralTrackingService.evaluateRuleConditions] Error:', error);
            return { matched: false };
        }
    }

    /**
     * Avalia condições comportamentais básicas
     */
    evaluateBehaviorConditions(conditions, events, evidence) {
        let score = 0;

        // Verificar tipo de evento
        if (conditions.event_type) {
            const relevantEvents = events.filter(e => e.event_type === conditions.event_type);
            if (relevantEvents.length > 0) {
                score += 30;
                evidence.events.push(...relevantEvents);
            }
        }

        // Verificar ocorrências mínimas
        if (conditions.min_occurrences) {
            const eventCount = this.countEventsInWindow(events, conditions.event_type, conditions.time_window_hours);
            if (eventCount >= conditions.min_occurrences) {
                score += 40;
            }
        }

        // Verificar profundidade de scroll
        if (conditions.min_scroll_depth) {
            const maxScroll = Math.max(...events.map(e => e.scroll_depth || 0));
            if (maxScroll >= conditions.min_scroll_depth) {
                score += 20;
            }
        }

        // Verificar tempo gasto
        if (conditions.min_time_spent_seconds) {
            const totalTime = events.reduce((sum, e) => sum + (e.duration || 0), 0);
            if (totalTime >= conditions.min_time_spent_seconds) {
                score += 10;
            }
        }

        evidence.score = score;
        return score >= (conditions.confidence_threshold || 50);
    }

    /**
     * Avalia condições de sequência de eventos
     */
    evaluateSequenceConditions(conditions, events, evidence) {
        if (!conditions.sequence || !Array.isArray(conditions.sequence)) {
            return false;
        }

        const sortedEvents = events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        let sequenceIndex = 0;

        for (const event of sortedEvents) {
            if (event.event_type === conditions.sequence[sequenceIndex]) {
                sequenceIndex++;
                evidence.events.push(event);

                if (sequenceIndex === conditions.sequence.length) {
                    evidence.score = 100;
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Avalia condições baseadas em limiares
     */
    evaluateThresholdConditions(conditions, events, evidence) {
        let score = 0;

        for (const [metric, threshold] of Object.entries(conditions.thresholds || {})) {
            switch (metric) {
                case 'total_clicks':
                    const clickCount = events.filter(e => e.event_type === 'click').length;
                    if (clickCount >= threshold) score += 25;
                    break;

                case 'total_scroll':
                    const scrollCount = events.filter(e => e.event_type === 'scroll').length;
                    if (scrollCount >= threshold) score += 25;
                    break;

                case 'session_duration':
                    const totalDuration = events.reduce((sum, e) => sum + (e.duration || 0), 0);
                    if (totalDuration >= threshold) score += 25;
                    break;

                case 'page_views':
                    const pageViews = new Set(events.map(e => e.page_url)).size;
                    if (pageViews >= threshold) score += 25;
                    break;
            }
        }

        evidence.score = score;
        return score >= 75; // 75% dos critérios atendidos
    }

    /**
     * Conta eventos em uma janela de tempo
     */
    countEventsInWindow(events, eventType, hours) {
        if (!hours) return events.filter(e => e.event_type === eventType).length;

        const cutoff = new Date(Date.now() - (hours * 60 * 60 * 1000));

        return events.filter(e =>
            e.event_type === eventType &&
            new Date(e.timestamp) >= cutoff
        ).length;
    }

    /**
     * Aplica uma tag comportamental a um usuário
     */
    async applyBehavioralTag(userId, rule, evidence) {
        try {
            const tagData = {
                user_id: userId,
                tag_name: rule.tag_name,
                tag_category: rule.tag_category,
                confidence_score: Math.min(evidence.confidence * rule.confidence_threshold, 100),
                trigger_events: evidence.events.slice(0, 10), // Limitar a 10 eventos
                metadata: {
                    rule_id: rule.id,
                    rule_name: rule.name,
                    applied_at: new Date().toISOString(),
                    evidence_count: evidence.events.length
                }
            };

            // Adicionar expiração se definida na regra
            if (rule.expiration_days) {
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + rule.expiration_days);
                tagData.expires_at = expiresAt.toISOString();
            }

            // Aplicar configuração adicional da tag
            if (rule.tag_config) {
                Object.assign(tagData, rule.tag_config);
            }

            const tag = BehavioralTag.create(tagData);

            console.log(`[BehavioralTracking] Applied tag "${rule.tag_name}" to user ${userId} (confidence: ${tagData.confidence_score}%)`);

            return tag;

        } catch (error) {
            console.error('[BehavioralTrackingService.applyBehavioralTag] Error:', error);
            throw error;
        }
    }

    /**
     * Atualiza o perfil comportamental do usuário
     */
    async updateUserBehaviorProfile(sessionId, events) {
        try {
            // Buscar sessão para obter user_id
            const UserSession = require('../models/UserSession');
            const session = UserSession.findBySessionId(sessionId);

            if (!session || !session.user_id) {
                return; // Não há usuário identificado
            }

            const userId = session.user_id;

            // Buscar perfil existente ou criar novo
            let profile = UserBehavior.findByUserId(userId);

            if (!profile) {
                profile = {
                    user_id: userId,
                    total_sessions: 0,
                    total_page_views: 0,
                    total_clicks: 0,
                    total_scroll_events: 0,
                    total_time_spent: 0,
                    engagement_score: 0
                };
            }

            // Calcular métricas dos novos eventos
            const metrics = this.calculateBehaviorMetrics(events);

            // Atualizar perfil
            const updatedProfile = {
                ...profile,
                total_sessions: profile.total_sessions + 1,
                total_page_views: profile.total_page_views + metrics.pageViews,
                total_clicks: profile.total_clicks + metrics.clicks,
                total_scroll_events: profile.total_scroll_events + metrics.scrolls,
                total_time_spent: profile.total_time_spent + metrics.totalTime,
                avg_session_duration: profile.total_sessions > 0 ?
                    (profile.total_time_spent + metrics.totalTime) / (profile.total_sessions + 1) :
                    metrics.totalTime,
                max_scroll_depth: Math.max(profile.max_scroll_depth || 0, metrics.maxScrollDepth),
                bounce_rate: profile.total_sessions > 0 ?
                    ((profile.bounce_rate || 0) * profile.total_sessions + (metrics.pageViews === 1 ? 1 : 0)) / (profile.total_sessions + 1) :
                    (metrics.pageViews === 1 ? 1 : 0),
                engagement_score: this.calculateEngagementScore({
                    ...profile,
                    ...metrics,
                    total_sessions: profile.total_sessions + 1
                }),
                favorite_pages: this.updateFavoritePages(profile.favorite_pages || [], events),
                click_patterns: this.updateClickPatterns(profile.click_patterns || {}, events),
                time_patterns: this.updateTimePatterns(profile.time_patterns || {}, events),
                device_preferences: this.updateDevicePreferences(profile.device_preferences || {}, session),
                last_ml_update: new Date().toISOString()
            };

            // Salvar ou atualizar perfil
            UserBehavior.upsert(updatedProfile);

        } catch (error) {
            console.error('[BehavioralTrackingService.updateUserBehaviorProfile] Error:', error);
        }
    }

    /**
     * Calcula métricas comportamentais de um conjunto de eventos
     */
    calculateBehaviorMetrics(events) {
        const metrics = {
            pageViews: new Set(events.map(e => e.page_url)).size,
            clicks: events.filter(e => e.event_type === 'click').length,
            scrolls: events.filter(e => e.event_type === 'scroll').length,
            totalTime: events.reduce((sum, e) => sum + (e.duration || 0), 0),
            maxScrollDepth: Math.max(...events.map(e => e.scroll_depth || 0), 0)
        };

        return metrics;
    }

    /**
     * Calcula score de engajamento
     */
    calculateEngagementScore(profile) {
        let score = 0;

        // Tempo gasto (até 30 pontos)
        const avgTime = profile.avg_session_duration || 0;
        score += Math.min(avgTime / 300, 1) * 30; // Máximo 5 minutos

        // Cliques (até 25 pontos)
        const avgClicks = profile.total_sessions > 0 ?
            profile.total_clicks / profile.total_sessions : 0;
        score += Math.min(avgClicks / 20, 1) * 25; // Máximo 20 cliques

        // Scroll (até 20 pontos)
        const avgScrolls = profile.total_sessions > 0 ?
            profile.total_scroll_events / profile.total_sessions : 0;
        score += Math.min(avgScrolls / 10, 1) * 20; // Máximo 10 scrolls

        // Profundidade de scroll (até 15 pontos)
        const scrollScore = (profile.max_scroll_depth || 0) / 100;
        score += Math.min(scrollScore, 1) * 15;

        // Bounce rate negativo (até 10 pontos)
        const bouncePenalty = (profile.bounce_rate || 0) * 10;
        score -= bouncePenalty;

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Atualiza páginas favoritas
     */
    updateFavoritePages(currentFavorites, events) {
        const favorites = Array.isArray(currentFavorites) ? [...currentFavorites] : [];

        // Contar visitas por página
        const pageVisits = {};
        events.forEach(event => {
            if (event.page_url) {
                pageVisits[event.page_url] = (pageVisits[event.page_url] || 0) + 1;
            }
        });

        // Atualizar contadores existentes
        favorites.forEach(fav => {
            if (pageVisits[fav.url]) {
                fav.visits += pageVisits[fav.url];
                fav.last_visit = new Date().toISOString();
                delete pageVisits[fav.url];
            }
        });

        // Adicionar novas páginas
        Object.entries(pageVisits).forEach(([url, visits]) => {
            favorites.push({
                url,
                visits,
                first_visit: new Date().toISOString(),
                last_visit: new Date().toISOString()
            });
        });

        // Ordenar por visitas e limitar a 10
        return favorites
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 10);
    }

    /**
     * Atualiza padrões de clique
     */
    updateClickPatterns(currentPatterns, events) {
        const patterns = { ...currentPatterns };

        events
            .filter(e => e.event_type === 'click' && e.element_selector)
            .forEach(event => {
                const selector = event.element_selector;
                patterns[selector] = (patterns[selector] || 0) + 1;
            });

        return patterns;
    }

    /**
     * Atualiza padrões de horário
     */
    updateTimePatterns(currentPatterns, events) {
        const patterns = { ...currentPatterns };

        events.forEach(event => {
            const hour = new Date(event.timestamp).getHours();
            patterns[hour] = (patterns[hour] || 0) + 1;
        });

        return patterns;
    }

    /**
     * Atualiza preferências de dispositivo
     */
    updateDevicePreferences(currentPreferences, session) {
        const preferences = { ...currentPreferences };

        if (session.device_type) {
            preferences[session.device_type] = (preferences[session.device_type] || 0) + 1;
        }

        return preferences;
    }

    /**
     * Processa eventos em buffer (executado periodicamente)
     */
    async processBufferedEvents() {
        try {
            if (this.eventBuffer.size === 0) return;

            console.log(`[BehavioralTracking] Processing ${this.eventBuffer.size} buffered sessions`);

            for (const [sessionId, events] of this.eventBuffer) {
                try {
                    // Processamento adicional em lote pode ser feito aqui
                    // Por exemplo: análise de padrões complexos, clustering, etc.

                    // Limpar buffer antigo (manter apenas últimas 2 horas)
                    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
                    const recentEvents = events.filter(e =>
                        new Date(e.timestamp) >= cutoff
                    );

                    if (recentEvents.length === 0) {
                        this.eventBuffer.delete(sessionId);
                    } else {
                        this.eventBuffer.set(sessionId, recentEvents);
                    }

                } catch (error) {
                    console.error(`[BehavioralTracking] Error processing session ${sessionId}:`, error);
                }
            }

        } catch (error) {
            console.error('[BehavioralTrackingService.processBufferedEvents] Error:', error);
        }
    }

    /**
     * Executa manutenção periódica
     */
    async maintenance() {
        try {
            console.log('[BehavioralTracking] Running maintenance tasks');

            // Desativar tags expiradas
            const expiredTags = BehavioralTag.deactivateExpired();
            if (expiredTags > 0) {
                console.log(`[BehavioralTracking] Deactivated ${expiredTags} expired tags`);
            }

            // Limpar dados antigos
            const cleanedTags = BehavioralTag.cleanup();
            if (cleanedTags > 0) {
                console.log(`[BehavioralTracking] Cleaned up ${cleanedTags} old tags`);
            }

            // Atualizar regras padrão se necessário
            const defaultRules = BehaviorRule.createDefaultRules();
            if (defaultRules.length > 0) {
                console.log(`[BehavioralTracking] Created ${defaultRules.length} default rules`);
            }

        } catch (error) {
            console.error('[BehavioralTrackingService.maintenance] Error:', error);
        }
    }

    /**
     * Obtém estatísticas do sistema
     */
    async getStats() {
        try {
            const tagStats = BehavioralTag.countByCategory();
            const ruleStats = BehaviorRule.getStats();
            const behaviorStats = UserBehavior.getClusterStats();

            return {
                tags: {
                    total: tagStats.reduce((sum, cat) => sum + cat.count, 0),
                    by_category: tagStats
                },
                rules: ruleStats,
                behaviors: {
                    total_profiles: behaviorStats.reduce((sum, cluster) => sum + cluster.user_count, 0),
                    clusters: behaviorStats
                },
                buffer: {
                    active_sessions: this.eventBuffer.size,
                    total_buffered_events: Array.from(this.eventBuffer.values())
                        .reduce((sum, events) => sum + events.length, 0)
                }
            };

        } catch (error) {
            console.error('[BehavioralTrackingService.getStats] Error:', error);
            return { error: error.message };
        }
    }

    /**
     * Limpa recursos ao fechar
     */
    cleanup() {
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
        }
        this.eventBuffer.clear();
    }
}

// Instância singleton
const behavioralTrackingService = new BehavioralTrackingService();

// Configurar manutenção periódica (a cada 6 horas)
setInterval(() => {
    behavioralTrackingService.maintenance();
}, 6 * 60 * 60 * 1000);

// Limpar recursos ao fechar aplicação
process.on('SIGINT', () => {
    behavioralTrackingService.cleanup();
});

process.on('SIGTERM', () => {
    behavioralTrackingService.cleanup();
});

module.exports = behavioralTrackingService;