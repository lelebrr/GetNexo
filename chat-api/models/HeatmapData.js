const db = require('../server').db || global.dbInstance;

/**
 * Modelo para dados de heatmap - agregação de dados de rastreamento
 */
class HeatmapData {
    constructor(data) {
        this.id = data.id;
        this.page_url = data.page_url;
        this.page_title = data.page_title;
        this.viewport_width = data.viewport_width;
        this.viewport_height = data.viewport_height;
        this.date = data.date; // data no formato YYYY-MM-DD
        this.hour = data.hour; // hora do dia (0-23)
        this.device_type = data.device_type;
        this.heatmap_type = data.heatmap_type; // 'click', 'scroll', 'move', 'attention'

        // Dados agregados
        this.clicks_data = data.clicks_data ? JSON.stringify(data.clicks_data) : '[]'; // array de {x, y, count, elements[]}
        this.scroll_data = data.scroll_data ? JSON.stringify(data.scroll_data) : '[]'; // array de {x, y, frequency, avg_duration}
        this.move_data = data.move_data ? JSON.stringify(data.move_data) : '[]'; // array de {x, y, duration, path[]}
        this.attention_data = data.attention_data ? JSON.stringify(data.attention_data) : '[]'; // array de {x, y, attention_time}

        // Estatísticas
        this.total_sessions = data.total_sessions || 0;
        this.total_events = data.total_events || 0;
        this.avg_session_duration = data.avg_session_duration || 0;
        this.bounce_rate = data.bounce_rate || 0;

        // Metadados
        this.metadata = data.metadata ? JSON.stringify(data.metadata) : '{}';
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
    }

    // Criar ou atualizar dados de heatmap
    static upsert(heatmapData) {
        try {
            const existing = db.prepare(`
                SELECT id FROM heatmap_data
                WHERE page_url = ? AND date = ? AND hour = ? AND device_type = ? AND heatmap_type = ?
                AND viewport_width = ? AND viewport_height = ?
            `).get(
                heatmapData.page_url,
                heatmapData.date,
                heatmapData.hour,
                heatmapData.device_type,
                heatmapData.heatmap_type,
                heatmapData.viewport_width,
                heatmapData.viewport_height
            );

            if (existing) {
                // Update existing
                const stmt = db.prepare(`
                    UPDATE heatmap_data SET
                        clicks_data = ?, scroll_data = ?, move_data = ?, attention_data = ?,
                        total_sessions = ?, total_events = ?, avg_session_duration = ?,
                        bounce_rate = ?, metadata = ?, updated_at = ?
                    WHERE id = ?
                `);

                stmt.run(
                    heatmapData.clicks_data,
                    heatmapData.scroll_data,
                    heatmapData.move_data,
                    heatmapData.attention_data,
                    heatmapData.total_sessions,
                    heatmapData.total_events,
                    heatmapData.avg_session_duration,
                    heatmapData.bounce_rate,
                    heatmapData.metadata,
                    new Date().toISOString(),
                    existing.id
                );

                heatmapData.id = existing.id;
                return heatmapData;
            } else {
                // Insert new
                const stmt = db.prepare(`
                    INSERT INTO heatmap_data (
                        page_url, page_title, viewport_width, viewport_height, date, hour,
                        device_type, heatmap_type, clicks_data, scroll_data, move_data,
                        attention_data, total_sessions, total_events, avg_session_duration,
                        bounce_rate, metadata, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                const result = stmt.run(
                    heatmapData.page_url,
                    heatmapData.page_title,
                    heatmapData.viewport_width,
                    heatmapData.viewport_height,
                    heatmapData.date,
                    heatmapData.hour,
                    heatmapData.device_type,
                    heatmapData.heatmap_type,
                    heatmapData.clicks_data,
                    heatmapData.scroll_data,
                    heatmapData.move_data,
                    heatmapData.attention_data,
                    heatmapData.total_sessions,
                    heatmapData.total_events,
                    heatmapData.avg_session_duration,
                    heatmapData.bounce_rate,
                    heatmapData.metadata,
                    heatmapData.created_at,
                    heatmapData.updated_at
                );

                heatmapData.id = result.lastInsertRowid;
                return heatmapData;
            }
        } catch (error) {
            console.error('[HeatmapData.upsert] Error:', error);
            throw error;
        }
    }

    // Buscar dados de heatmap por página e filtros
    static findByPage(pageUrl, filters = {}) {
        try {
            const {
                date,
                start_date,
                end_date,
                device_type,
                heatmap_type,
                viewport_width,
                viewport_height
            } = filters;

            let query = 'SELECT * FROM heatmap_data WHERE page_url = ?';
            const params = [pageUrl];

            if (date) {
                query += ' AND date = ?';
                params.push(date);
            }

            if (start_date) {
                query += ' AND date >= ?';
                params.push(start_date);
            }

            if (end_date) {
                query += ' AND date <= ?';
                params.push(end_date);
            }

            if (device_type) {
                query += ' AND device_type = ?';
                params.push(device_type);
            }

            if (heatmap_type) {
                query += ' AND heatmap_type = ?';
                params.push(heatmap_type);
            }

            if (viewport_width) {
                query += ' AND viewport_width = ?';
                params.push(viewport_width);
            }

            if (viewport_height) {
                query += ' AND viewport_height = ?';
                params.push(viewport_height);
            }

            query += ' ORDER BY date DESC, hour DESC';

            const stmt = db.prepare(query);
            const rows = stmt.all(...params);

            return rows.map(row => {
                row.clicks_data = JSON.parse(row.clicks_data || '[]');
                row.scroll_data = JSON.parse(row.scroll_data || '[]');
                row.move_data = JSON.parse(row.move_data || '[]');
                row.attention_data = JSON.parse(row.attention_data || '[]');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new HeatmapData(row);
            });
        } catch (error) {
            console.error('[HeatmapData.findByPage] Error:', error);
            throw error;
        }
    }

    // Buscar dados agregados para múltiplas páginas
    static getAggregatedData(pageUrls = [], filters = {}) {
        try {
            const {
                start_date,
                end_date,
                device_type,
                heatmap_type,
                group_by = 'page' // 'page', 'date', 'hour'
            } = filters;

            let query = `
                SELECT
                    page_url,
                    ${group_by === 'date' ? 'date,' : ''}
                    ${group_by === 'hour' ? 'hour,' : ''}
                    heatmap_type,
                    SUM(total_sessions) as total_sessions,
                    SUM(total_events) as total_events,
                    AVG(avg_session_duration) as avg_session_duration,
                    AVG(bounce_rate) as avg_bounce_rate,
                    GROUP_CONCAT(clicks_data) as all_clicks_data,
                    GROUP_CONCAT(scroll_data) as all_scroll_data,
                    GROUP_CONCAT(move_data) as all_move_data,
                    GROUP_CONCAT(attention_data) as all_attention_data
                FROM heatmap_data
                WHERE 1=1
            `;
            const params = [];

            if (pageUrls.length > 0) {
                query += ` AND page_url IN (${pageUrls.map(() => '?').join(',')})`;
                params.push(...pageUrls);
            }

            if (start_date) {
                query += ' AND date >= ?';
                params.push(start_date);
            }

            if (end_date) {
                query += ' AND date <= ?';
                params.push(end_date);
            }

            if (device_type) {
                query += ' AND device_type = ?';
                params.push(device_type);
            }

            if (heatmap_type) {
                query += ' AND heatmap_type = ?';
                params.push(heatmap_type);
            }

            const groupFields = [];
            if (group_by === 'page') groupFields.push('page_url');
            if (group_by === 'date') groupFields.push('date');
            if (group_by === 'hour') groupFields.push('hour');
            groupFields.push('heatmap_type');

            query += ` GROUP BY ${groupFields.join(', ')} ORDER BY total_sessions DESC`;

            const stmt = db.prepare(query);
            const rows = stmt.all(...params);

            return rows.map(row => ({
                ...row,
                all_clicks_data: row.all_clicks_data ? row.all_clicks_data.split(',').map(data => JSON.parse(data || '[]')) : [],
                all_scroll_data: row.all_scroll_data ? row.all_scroll_data.split(',').map(data => JSON.parse(data || '[]')) : [],
                all_move_data: row.all_move_data ? row.all_move_data.split(',').map(data => JSON.parse(data || '[]')) : [],
                all_attention_data: row.all_attention_data ? row.all_attention_data.split(',').map(data => JSON.parse(data || '[]')) : []
            }));
        } catch (error) {
            console.error('[HeatmapData.getAggregatedData] Error:', error);
            throw error;
        }
    }

    // Gerar dados de heatmap a partir de eventos brutos
    static generateFromEvents(pageUrl, date, hour, deviceType, viewportWidth, viewportHeight) {
        try {
            const startTime = new Date(date);
            startTime.setHours(hour, 0, 0, 0);
            const endTime = new Date(startTime);
            endTime.setHours(hour + 1, 0, 0, 0);

            // Buscar sessões da página neste período
            const sessionsStmt = db.prepare(`
                SELECT * FROM user_sessions
                WHERE entry_page = ? AND start_time >= ? AND start_time < ?
                AND device_type = ?
            `);
            const sessions = sessionsStmt.all(pageUrl, startTime.toISOString(), endTime.toISOString(), deviceType);

            if (sessions.length === 0) {
                return null; // Não há dados para gerar heatmap
            }

            // Buscar eventos das sessões
            const sessionIds = sessions.map(s => s.session_id);
            const eventsStmt = db.prepare(`
                SELECT * FROM user_events
                WHERE session_id IN (${sessionIds.map(() => '?').join(',')})
                AND page_url = ?
                AND timestamp >= ? AND timestamp < ?
                ORDER BY timestamp ASC
            `);
            const events = eventsStmt.all(...sessionIds, pageUrl, startTime.toISOString(), endTime.toISOString());

            // Processar dados de clique
            const clicksMap = new Map();
            const scrollMap = new Map();
            const moveMap = new Map();
            const attentionMap = new Map();

            events.forEach(event => {
                const key = `${event.position_x || 0},${event.position_y || 0}`;

                switch (event.event_type) {
                    case 'click':
                        if (!clicksMap.has(key)) {
                            clicksMap.set(key, {
                                x: event.position_x,
                                y: event.position_y,
                                count: 0,
                                elements: []
                            });
                        }
                        const clickData = clicksMap.get(key);
                        clickData.count++;
                        if (event.element_selector && !clickData.elements.includes(event.element_selector)) {
                            clickData.elements.push(event.element_selector);
                        }
                        break;

                    case 'scroll':
                        const scrollKey = `${event.scroll_x || 0},${event.scroll_y || 0}`;
                        if (!scrollMap.has(scrollKey)) {
                            scrollMap.set(scrollKey, {
                                x: event.scroll_x || 0,
                                y: event.scroll_y || 0,
                                frequency: 0,
                                avg_duration: 0,
                                total_duration: 0
                            });
                        }
                        const scrollData = scrollMap.get(scrollKey);
                        scrollData.frequency++;
                        scrollData.total_duration += event.duration || 0;
                        scrollData.avg_duration = scrollData.total_duration / scrollData.frequency;
                        break;

                    case 'mouse_move':
                        // Para heatmap de movimento, agregamos por regiões
                        const moveKey = `${Math.floor((event.position_x || 0) / 50) * 50},${Math.floor((event.position_y || 0) / 50) * 50}`;
                        if (!moveMap.has(moveKey)) {
                            moveMap.set(moveKey, {
                                x: Math.floor((event.position_x || 0) / 50) * 50,
                                y: Math.floor((event.position_y || 0) / 50) * 50,
                                duration: 0,
                                path_count: 0
                            });
                        }
                        const moveData = moveMap.get(moveKey);
                        moveData.duration += event.duration || 0;
                        moveData.path_count++;
                        break;
                }
            });

            // Calcular dados de atenção (regiões com mais tempo de foco)
            sessions.forEach(session => {
                const sessionEvents = events.filter(e => e.session_id === session.session_id);
                const attentionPoints = new Map();

                sessionEvents.forEach(event => {
                    if (event.event_type === 'mouse_move' || event.event_type === 'scroll') {
                        const key = `${Math.floor((event.position_x || 0) / 25) * 25},${Math.floor((event.position_y || 0) / 25) * 25}`;
                        if (!attentionPoints.has(key)) {
                            attentionPoints.set(key, { x: Math.floor((event.position_x || 0) / 25) * 25, y: Math.floor((event.position_y || 0) / 25) * 25, time: 0 });
                        }
                        attentionPoints.get(key).time += event.duration || 1;
                    }
                });

                attentionPoints.forEach(point => {
                    const key = `${point.x},${point.y}`;
                    if (!attentionMap.has(key)) {
                        attentionMap.set(key, { x: point.x, y: point.y, attention_time: 0 });
                    }
                    attentionMap.get(key).attention_time += point.time;
                });
            });

            // Criar dados de heatmap
            const heatmapData = new HeatmapData({
                page_url: pageUrl,
                page_title: sessions[0]?.pages_visited?.[0]?.title || 'Unknown',
                viewport_width: viewportWidth,
                viewport_height: viewportHeight,
                date,
                hour,
                device_type: deviceType,
                heatmap_type: 'combined', // click, scroll, move, attention

                clicks_data: Array.from(clicksMap.values()),
                scroll_data: Array.from(scrollMap.values()),
                move_data: Array.from(moveMap.values()),
                attention_data: Array.from(attentionMap.values()),

                total_sessions: sessions.length,
                total_events: events.length,
                avg_session_duration: sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length,
                bounce_rate: sessions.filter(s => s.page_views === 1).length / sessions.length,

                metadata: {
                    generated_at: new Date().toISOString(),
                    data_quality: events.length > 0 ? 'good' : 'insufficient'
                }
            });

            return this.upsert(heatmapData);
        } catch (error) {
            console.error('[HeatmapData.generateFromEvents] Error:', error);
            throw error;
        }
    }

    // Limpar dados antigos de heatmap
    static cleanup(oldThanDays = 365) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - oldThanDays);

            const stmt = db.prepare('DELETE FROM heatmap_data WHERE date < ?');
            const result = stmt.run(cutoffDate.toISOString().split('T')[0]);

            return result.changes;
        } catch (error) {
            console.error('[HeatmapData.cleanup] Error:', error);
            throw error;
        }
    }

    // Obter estatísticas de heatmap
    static getStats(pageUrl = null, dateRange = {}) {
        try {
            const { start_date, end_date } = dateRange;
            let query = 'SELECT COUNT(*) as total_heatmaps, SUM(total_sessions) as total_sessions, SUM(total_events) as total_events FROM heatmap_data WHERE 1=1';
            const params = [];

            if (pageUrl) {
                query += ' AND page_url = ?';
                params.push(pageUrl);
            }

            if (start_date) {
                query += ' AND date >= ?';
                params.push(start_date);
            }

            if (end_date) {
                query += ' AND date <= ?';
                params.push(end_date);
            }

            const stmt = db.prepare(query);
            const stats = stmt.get(...params);

            return {
                total_heatmaps: stats.total_heatmaps || 0,
                total_sessions: stats.total_sessions || 0,
                total_events: stats.total_events || 0
            };
        } catch (error) {
            console.error('[HeatmapData.getStats] Error:', error);
            throw error;
        }
    }
}

module.exports = HeatmapData;