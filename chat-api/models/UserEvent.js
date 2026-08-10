const db = require('../server').db || global.dbInstance;

/**
 * Modelo para eventos de usuário - rastreamento de ações individuais
 */
class UserEvent {
    constructor(data) {
        this.id = data.id;
        this.session_id = data.session_id;
        this.event_type = data.event_type; // click, scroll, mouse_move, page_view, form_submit, etc.
        this.event_data = data.event_data ? JSON.stringify(data.event_data) : '{}';
        this.page_url = data.page_url;
        this.page_title = data.page_title;
        this.element_selector = data.element_selector; // CSS selector do elemento
        this.element_text = data.element_text; // texto do elemento (se aplicável)
        this.element_type = data.element_type; // button, link, input, etc.
        this.position_x = data.position_x; // posição X do mouse/clique
        this.position_y = data.position_y; // posição Y do mouse/clique
        this.viewport_width = data.viewport_width;
        this.viewport_height = data.viewport_height;
        this.scroll_x = data.scroll_x || 0;
        this.scroll_y = data.scroll_y || 0;
        this.device_pixel_ratio = data.device_pixel_ratio || 1;
        this.timestamp = data.timestamp || new Date().toISOString();
        this.duration = data.duration || 0; // duração do evento (para mouse_move, etc.)
        this.metadata = data.metadata ? JSON.stringify(data.metadata) : '{}';
        this.created_at = data.created_at || new Date().toISOString();
    }

    // Criar novo evento
    static create(eventData) {
        try {
            const event = new UserEvent(eventData);

            const stmt = db.prepare(`
                INSERT INTO user_events (
                    session_id, event_type, event_data, page_url, page_title,
                    element_selector, element_text, element_type, position_x, position_y,
                    viewport_width, viewport_height, scroll_x, scroll_y, device_pixel_ratio,
                    timestamp, duration, metadata, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const result = stmt.run(
                event.session_id, event.event_type, event.event_data, event.page_url,
                event.page_title, event.element_selector, event.element_text, event.element_type,
                event.position_x, event.position_y, event.viewport_width, event.viewport_height,
                event.scroll_x, event.scroll_y, event.device_pixel_ratio,
                event.timestamp, event.duration, event.metadata, event.created_at
            );

            event.id = result.lastInsertRowid;
            return event;
        } catch (error) {
            console.error('[UserEvent.create] Error:', error);
            throw error;
        }
    }

    // Criar múltiplos eventos (bulk insert)
    static createBulk(events) {
        try {
            if (!Array.isArray(events) || events.length === 0) {
                return [];
            }

            const stmt = db.prepare(`
                INSERT INTO user_events (
                    session_id, event_type, event_data, page_url, page_title,
                    element_selector, element_text, element_type, position_x, position_y,
                    viewport_width, viewport_height, scroll_x, scroll_y, device_pixel_ratio,
                    timestamp, duration, metadata, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const createdEvents = [];
            const insertMany = db.transaction((eventList) => {
                for (const eventData of eventList) {
                    const event = new UserEvent(eventData);
                    const result = stmt.run(
                        event.session_id, event.event_type, event.event_data, event.page_url,
                        event.page_title, event.element_selector, event.element_text, event.element_type,
                        event.position_x, event.position_y, event.viewport_width, event.viewport_height,
                        event.scroll_x, event.scroll_y, event.device_pixel_ratio,
                        event.timestamp, event.duration, event.metadata, event.created_at
                    );
                    event.id = result.lastInsertRowid;
                    createdEvents.push(event);
                }
            });

            insertMany(events);
            return createdEvents;
        } catch (error) {
            console.error('[UserEvent.createBulk] Error:', error);
            throw error;
        }
    }

    // Buscar eventos por session_id
    static findBySessionId(sessionId, options = {}) {
        try {
            const { limit = 1000, offset = 0, eventTypes = [], startDate, endDate } = options;

            let query = 'SELECT * FROM user_events WHERE session_id = ?';
            const params = [sessionId];

            if (eventTypes.length > 0) {
                query += ` AND event_type IN (${eventTypes.map(() => '?').join(',')})`;
                params.push(...eventTypes);
            }

            if (startDate) {
                query += ' AND timestamp >= ?';
                params.push(startDate);
            }

            if (endDate) {
                query += ' AND timestamp <= ?';
                params.push(endDate);
            }

            query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const stmt = db.prepare(query);
            const rows = stmt.all(...params);

            return rows.map(row => {
                row.event_data = JSON.parse(row.event_data || '{}');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new UserEvent(row);
            });
        } catch (error) {
            console.error('[UserEvent.findBySessionId] Error:', error);
            throw error;
        }
    }

    // Buscar eventos com filtros avançados
    static findWithFilters(filters = {}, options = {}) {
        try {
            let query = 'SELECT * FROM user_events WHERE 1=1';
            const params = [];
            let { limit = 1000, offset = 0, orderBy = 'timestamp', orderDir = 'DESC' } = options;

            // Validate orderBy and orderDir to prevent SQL injection
            orderBy = /^[a-zA-Z0-9_]+$/.test(orderBy) ? orderBy : 'timestamp';
            orderDir = ['ASC', 'DESC'].includes(String(orderDir).toUpperCase()) ? String(orderDir).toUpperCase() : 'DESC';

            // Security: Prevent SQL injection in ORDER BY
            const safeOrderBy = /^[a-zA-Z0-9_]+$/.test(orderBy) ? orderBy : 'timestamp';
            const safeOrderDir = String(orderDir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

            // Filtros
            if (filters.session_id) {
                query += ' AND session_id = ?';
                params.push(filters.session_id);
            }

            if (filters.event_type) {
                query += ' AND event_type = ?';
                params.push(filters.event_type);
            }

            if (filters.event_types && Array.isArray(filters.event_types)) {
                query += ` AND event_type IN (${filters.event_types.map(() => '?').join(',')})`;
                params.push(...filters.event_types);
            }

            if (filters.page_url) {
                query += ' AND page_url LIKE ?';
                params.push(`%${filters.page_url}%`);
            }

            if (filters.element_type) {
                query += ' AND element_type = ?';
                params.push(filters.element_type);
            }

            if (filters.start_date) {
                query += ' AND timestamp >= ?';
                params.push(filters.start_date);
            }

            if (filters.end_date) {
                query += ' AND timestamp <= ?';
                params.push(filters.end_date);
            }

            if (filters.position_x_min !== undefined) {
                query += ' AND position_x >= ?';
                params.push(filters.position_x_min);
            }

            if (filters.position_x_max !== undefined) {
                query += ' AND position_x <= ?';
                params.push(filters.position_x_max);
            }

            if (filters.position_y_min !== undefined) {
                query += ' AND position_y >= ?';
                params.push(filters.position_y_min);
            }

            if (filters.position_y_max !== undefined) {
                query += ' AND position_y <= ?';
                params.push(filters.position_y_max);
            }

            // Ordenação e limite
            query += ` ORDER BY ${safeOrderBy} ${safeOrderDir} LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const stmt = db.prepare(query);
            const rows = stmt.all(...params);

            return rows.map(row => {
                row.event_data = JSON.parse(row.event_data || '{}');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new UserEvent(row);
            });
        } catch (error) {
            console.error('[UserEvent.findWithFilters] Error:', error);
            throw error;
        }
    }

    // Estatísticas de eventos por tipo
    static getEventStats(sessionId = null, dateRange = {}) {
        try {
            const { start_date, end_date } = dateRange;
            let query = `
                SELECT event_type, COUNT(*) as count, AVG(duration) as avg_duration
                FROM user_events WHERE 1=1
            `;
            const params = [];

            if (sessionId) {
                query += ' AND session_id = ?';
                params.push(sessionId);
            }

            if (start_date) {
                query += ' AND timestamp >= ?';
                params.push(start_date);
            }

            if (end_date) {
                query += ' AND timestamp <= ?';
                params.push(end_date);
            }

            query += ' GROUP BY event_type ORDER BY count DESC';

            const stmt = db.prepare(query);
            const stats = stmt.all(...params);

            return stats.map(stat => ({
                event_type: stat.event_type,
                count: stat.count,
                avg_duration: Math.round(stat.avg_duration || 0)
            }));
        } catch (error) {
            console.error('[UserEvent.getEventStats] Error:', error);
            throw error;
        }
    }

    // Buscar cliques em elementos específicos
    static getElementClicks(elementSelector, pageUrl = null, dateRange = {}) {
        try {
            const { start_date, end_date } = dateRange;
            let query = `
                SELECT position_x, position_y, COUNT(*) as click_count,
                       AVG(scroll_x) as avg_scroll_x, AVG(scroll_y) as avg_scroll_y
                FROM user_events
                WHERE event_type = 'click' AND element_selector = ?
            `;
            const params = [elementSelector];

            if (pageUrl) {
                query += ' AND page_url = ?';
                params.push(pageUrl);
            }

            if (start_date) {
                query += ' AND timestamp >= ?';
                params.push(start_date);
            }

            if (end_date) {
                query += ' AND timestamp <= ?';
                params.push(end_date);
            }

            query += ' GROUP BY position_x, position_y ORDER BY click_count DESC';

            const stmt = db.prepare(query);
            const clicks = stmt.all(...params);

            return clicks.map(click => ({
                x: click.position_x,
                y: click.position_y,
                count: click.click_count,
                avg_scroll_x: Math.round(click.avg_scroll_x || 0),
                avg_scroll_y: Math.round(click.avg_scroll_y || 0)
            }));
        } catch (error) {
            console.error('[UserEvent.getElementClicks] Error:', error);
            throw error;
        }
    }

    // Buscar dados de scroll para heatmap
    static getScrollData(pageUrl = null, dateRange = {}) {
        try {
            const { start_date, end_date } = dateRange;
            let query = `
                SELECT scroll_x, scroll_y, viewport_width, viewport_height,
                       COUNT(*) as frequency, AVG(duration) as avg_duration
                FROM user_events
                WHERE event_type = 'scroll'
            `;
            const params = [];

            if (pageUrl) {
                query += ' AND page_url = ?';
                params.push(pageUrl);
            }

            if (start_date) {
                query += ' AND timestamp >= ?';
                params.push(start_date);
            }

            if (end_date) {
                query += ' AND timestamp <= ?';
                params.push(end_date);
            }

            query += ' GROUP BY scroll_x, scroll_y, viewport_width, viewport_height ORDER BY frequency DESC';

            const stmt = db.prepare(query);
            const scrollData = stmt.all(...params);

            return scrollData.map(data => ({
                scroll_x: data.scroll_x,
                scroll_y: data.scroll_y,
                viewport_width: data.viewport_width,
                viewport_height: data.viewport_height,
                frequency: data.frequency,
                avg_duration: Math.round(data.avg_duration || 0)
            }));
        } catch (error) {
            console.error('[UserEvent.getScrollData] Error:', error);
            throw error;
        }
    }

    // Limpar eventos antigos (manutenção)
    static cleanup(oldThanDays = 90) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - oldThanDays);

            const stmt = db.prepare('DELETE FROM user_events WHERE timestamp < ?');
            const result = stmt.run(cutoffDate.toISOString());

            return result.changes;
        } catch (error) {
            console.error('[UserEvent.cleanup] Error:', error);
            throw error;
        }
    }
}

module.exports = UserEvent;