const db = require('../server').db || global.dbInstance;

/**
 * Modelo para sessões de usuário - rastreamento de visitas
 */
class UserSession {
    constructor(data) {
        this.id = data.id;
        this.session_id = data.session_id;
        this.user_id = data.user_id || null; // ID do usuário autenticado (opcional)
        this.visitor_id = data.visitor_id; // ID anônimo para visitantes não autenticados
        this.ip_address = data.ip_address;
        this.user_agent = data.user_agent;
        this.referrer = data.referrer;
        this.utm_source = data.utm_source;
        this.utm_medium = data.utm_medium;
        this.utm_campaign = data.utm_campaign;
        this.utm_term = data.utm_term;
        this.utm_content = data.utm_content;
        this.device_type = data.device_type;
        this.browser = data.browser;
        this.os = data.os;
        this.screen_resolution = data.screen_resolution;
        this.timezone = data.timezone;
        this.language = data.language;
        this.gdpr_consent = data.gdpr_consent || false;
        this.gdpr_consent_date = data.gdpr_consent_date;
        this.gdpr_consent_version = data.gdpr_consent_version;
        this.start_time = data.start_time || new Date().toISOString();
        this.end_time = data.end_time;
        this.duration = data.duration || 0; // em segundos
        this.page_views = data.page_views || 0;
        this.events_count = data.events_count || 0;
        this.is_active = data.is_active || true;
        this.last_activity = data.last_activity || new Date().toISOString();
        this.exit_page = data.exit_page;
        this.entry_page = data.entry_page;
        this.pages_visited = data.pages_visited ? JSON.stringify(data.pages_visited) : '[]';
        this.converted = data.converted || false;
        this.conversion_type = data.conversion_type;
        this.conversion_value = data.conversion_value || 0;
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
    }

    // Criar nova sessão
    static create(sessionData) {
        try {
            const session = new UserSession(sessionData);

            const stmt = db.prepare(`
                INSERT INTO user_sessions (
                    session_id, user_id, visitor_id, ip_address, user_agent, referrer,
                    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
                    device_type, browser, os, screen_resolution, timezone, language,
                    gdpr_consent, gdpr_consent_date, gdpr_consent_version,
                    start_time, end_time, duration, page_views, events_count, is_active,
                    last_activity, exit_page, entry_page, pages_visited,
                    converted, conversion_type, conversion_value, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const result = stmt.run(
                session.session_id, session.user_id, session.visitor_id, session.ip_address,
                session.user_agent, session.referrer, session.utm_source, session.utm_medium,
                session.utm_campaign, session.utm_term, session.utm_content,
                session.device_type, session.browser, session.os, session.screen_resolution,
                session.timezone, session.language, session.gdpr_consent, session.gdpr_consent_date,
                session.gdpr_consent_version, session.start_time, session.end_time, session.duration,
                session.page_views, session.events_count, session.is_active, session.last_activity,
                session.exit_page, session.entry_page, session.pages_visited,
                session.converted, session.conversion_type, session.conversion_value,
                session.created_at, session.updated_at
            );

            session.id = result.lastInsertRowid;
            return session;
        } catch (error) {
            console.error('[UserSession.create] Error:', error);
            throw error;
        }
    }

    // Buscar sessão por ID
    static findById(id) {
        try {
            const stmt = db.prepare('SELECT * FROM user_sessions WHERE id = ?');
            const row = stmt.get(id);

            if (row) {
                row.pages_visited = JSON.parse(row.pages_visited || '[]');
                return new UserSession(row);
            }
            return null;
        } catch (error) {
            console.error('[UserSession.findById] Error:', error);
            throw error;
        }
    }

    // Buscar sessão por session_id
    static findBySessionId(sessionId) {
        try {
            const stmt = db.prepare('SELECT * FROM user_sessions WHERE session_id = ?');
            const row = stmt.get(sessionId);

            if (row) {
                row.pages_visited = JSON.parse(row.pages_visited || '[]');
                return new UserSession(row);
            }
            return null;
        } catch (error) {
            console.error('[UserSession.findBySessionId] Error:', error);
            throw error;
        }
    }

    // Buscar sessão ativa por visitor_id
    static findActiveByVisitorId(visitorId) {
        try {
            const stmt = db.prepare('SELECT * FROM user_sessions WHERE visitor_id = ? AND is_active = 1 ORDER BY start_time DESC LIMIT 1');
            const row = stmt.get(visitorId);

            if (row) {
                row.pages_visited = JSON.parse(row.pages_visited || '[]');
                return new UserSession(row);
            }
            return null;
        } catch (error) {
            console.error('[UserSession.findActiveByVisitorId] Error:', error);
            throw error;
        }
    }

    // Atualizar sessão
    update(updates) {
        try {
            const allowedFields = [
                'end_time', 'duration', 'page_views', 'events_count', 'is_active',
                'last_activity', 'exit_page', 'pages_visited', 'converted',
                'conversion_type', 'conversion_value', 'updated_at'
            ];

            const updateData = { ...updates, updated_at: new Date().toISOString() };
            const setClause = allowedFields.filter(field => updateData[field] !== undefined)
                .map(field => `${field} = ?`).join(', ');

            if (setClause) {
                const values = allowedFields.filter(field => updateData[field] !== undefined)
                    .map(field => field === 'pages_visited' ? JSON.stringify(updateData[field]) : updateData[field]);

                const stmt = db.prepare(`UPDATE user_sessions SET ${setClause} WHERE id = ?`);
                stmt.run(...values, this.id);

                // Atualizar objeto em memória
                Object.assign(this, updateData);
            }

            return this;
        } catch (error) {
            console.error('[UserSession.update] Error:', error);
            throw error;
        }
    }

    // Finalizar sessão
    end(exitPage = null) {
        const now = new Date();
        const startTime = new Date(this.start_time);
        const duration = Math.floor((now - startTime) / 1000);

        return this.update({
            end_time: now.toISOString(),
            duration,
            is_active: false,
            exit_page: exitPage
        });
    }

    // Adicionar página visitada
    addPageVisit(pageUrl, timestamp = new Date().toISOString()) {
        try {
            const pagesVisited = Array.isArray(this.pages_visited) ? this.pages_visited : JSON.parse(this.pages_visited || '[]');
            pagesVisited.push({
                url: pageUrl,
                timestamp,
                time_spent: 0 // será calculado depois
            });

            return this.update({
                pages_visited: pagesVisited,
                page_views: pagesVisited.length
            });
        } catch (error) {
            console.error('[UserSession.addPageVisit] Error:', error);
            throw error;
        }
    }

    // Buscar sessões com filtros
    static findWithFilters(filters = {}, options = {}) {
        try {
            let query = 'SELECT * FROM user_sessions WHERE 1=1';
            const params = [];
            let { limit = 100, offset = 0, orderBy = 'start_time', orderDir = 'DESC' } = options;

            // Validate orderBy and orderDir to prevent SQL injection
            orderBy = /^[a-zA-Z0-9_]+$/.test(orderBy) ? orderBy : 'start_time';
            orderDir = ['ASC', 'DESC'].includes(String(orderDir).toUpperCase()) ? String(orderDir).toUpperCase() : 'DESC';

            // Filtros
            if (filters.user_id) {
                query += ' AND user_id = ?';
                params.push(filters.user_id);
            }

            if (filters.visitor_id) {
                query += ' AND visitor_id = ?';
                params.push(filters.visitor_id);
            }

            if (filters.is_active !== undefined) {
                query += ' AND is_active = ?';
                params.push(filters.is_active ? 1 : 0);
            }

            if (filters.gdpr_consent !== undefined) {
                query += ' AND gdpr_consent = ?';
                params.push(filters.gdpr_consent ? 1 : 0);
            }

            if (filters.start_date) {
                query += ' AND start_time >= ?';
                params.push(filters.start_date);
            }

            if (filters.end_date) {
                query += ' AND start_time <= ?';
                params.push(filters.end_date);
            }

            if (filters.device_type) {
                query += ' AND device_type = ?';
                params.push(filters.device_type);
            }

            if (filters.converted !== undefined) {
                query += ' AND converted = ?';
                params.push(filters.converted ? 1 : 0);
            }

            // Ordenação e limite
            query += ` ORDER BY ${orderBy} ${orderDir} LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const stmt = db.prepare(query);
            const rows = stmt.all(...params);

            return rows.map(row => {
                row.pages_visited = JSON.parse(row.pages_visited || '[]');
                return new UserSession(row);
            });
        } catch (error) {
            console.error('[UserSession.findWithFilters] Error:', error);
            throw error;
        }
    }

    // Estatísticas de sessões
    static getStats(dateRange = {}) {
        try {
            const { start_date, end_date } = dateRange;
            let query = 'SELECT COUNT(*) as total_sessions, AVG(duration) as avg_duration, SUM(page_views) as total_page_views FROM user_sessions WHERE 1=1';
            const params = [];

            if (start_date) {
                query += ' AND start_time >= ?';
                params.push(start_date);
            }

            if (end_date) {
                query += ' AND start_time <= ?';
                params.push(end_date);
            }

            const stmt = db.prepare(query);
            const stats = stmt.get(...params);

            // Sessões ativas
            const activeQuery = 'SELECT COUNT(*) as active_sessions FROM user_sessions WHERE is_active = 1';
            const activeParams = [];
            if (start_date) {
                activeQuery += ' AND start_time >= ?';
                activeParams.push(start_date);
            }
            const activeStats = db.prepare(activeQuery).get(...activeParams);

            return {
                total_sessions: stats.total_sessions || 0,
                active_sessions: activeStats.active_sessions || 0,
                avg_duration: Math.round(stats.avg_duration || 0),
                total_page_views: stats.total_page_views || 0
            };
        } catch (error) {
            console.error('[UserSession.getStats] Error:', error);
            throw error;
        }
    }
}

module.exports = UserSession;