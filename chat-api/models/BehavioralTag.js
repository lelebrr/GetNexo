const db = require('../server').db || global.dbInstance;

/**
 * Modelo para tags comportamentais aplicadas automaticamente aos usuários
 * baseado em seu comportamento observado
 */
class BehavioralTag {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id; // ID do usuário (pode ser visitor_id ou user_id autenticado)
        this.tag_name = data.tag_name; // Nome da tag (ex: 'Interesse Alto', 'Comprador Recorrente')
        this.tag_category = data.tag_category; // Categoria da tag (ex: 'Interesse', 'Frequência', 'Valor')
        this.confidence_score = data.confidence_score || 0; // Pontuação de confiança (0-100)
        this.trigger_events = data.trigger_events ? JSON.stringify(data.trigger_events) : '[]'; // Eventos que dispararam a tag
        this.metadata = data.metadata ? JSON.stringify(data.metadata) : '{}'; // Dados adicionais
        this.is_active = data.is_active !== undefined ? data.is_active : true; // Se a tag está ativa
        this.expires_at = data.expires_at; // Data de expiração da tag
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
    }

    // Criar nova tag comportamental
    static create(tagData) {
        try {
            const tag = new BehavioralTag(tagData);

            const stmt = db.prepare(`
                INSERT INTO behavioral_tags (
                    user_id, tag_name, tag_category, confidence_score,
                    trigger_events, metadata, is_active, expires_at, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const result = stmt.run(
                tag.user_id, tag.tag_name, tag.tag_category, tag.confidence_score,
                tag.trigger_events, tag.metadata, tag.is_active, tag.expires_at,
                tag.created_at, tag.updated_at
            );

            tag.id = result.lastInsertRowid;
            return tag;
        } catch (error) {
            console.error('[BehavioralTag.create] Error:', error);
            throw error;
        }
    }

    // Atualizar tag existente
    static update(id, updateData) {
        try {
            const updateFields = [];
            const params = [];

            if (updateData.tag_name !== undefined) {
                updateFields.push('tag_name = ?');
                params.push(updateData.tag_name);
            }
            if (updateData.tag_category !== undefined) {
                updateFields.push('tag_category = ?');
                params.push(updateData.tag_category);
            }
            if (updateData.confidence_score !== undefined) {
                updateFields.push('confidence_score = ?');
                params.push(updateData.confidence_score);
            }
            if (updateData.trigger_events !== undefined) {
                updateFields.push('trigger_events = ?');
                params.push(JSON.stringify(updateData.trigger_events));
            }
            if (updateData.metadata !== undefined) {
                updateFields.push('metadata = ?');
                params.push(JSON.stringify(updateData.metadata));
            }
            if (updateData.is_active !== undefined) {
                updateFields.push('is_active = ?');
                params.push(updateData.is_active);
            }
            if (updateData.expires_at !== undefined) {
                updateFields.push('expires_at = ?');
                params.push(updateData.expires_at);
            }

            updateFields.push('updated_at = ?');
            params.push(new Date().toISOString());

            params.push(id);

            const stmt = db.prepare(`
                UPDATE behavioral_tags
                SET ${updateFields.join(', ')}
                WHERE id = ?
            `);

            const result = stmt.run(...params);
            return result.changes > 0;
        } catch (error) {
            console.error('[BehavioralTag.update] Error:', error);
            throw error;
        }
    }

    // Buscar tags por usuário
    static findByUserId(userId, options = {}) {
        try {
            const { includeExpired = false, activeOnly = true, limit = 50 } = options;

            let query = 'SELECT * FROM behavioral_tags WHERE user_id = ?';
            const params = [userId];

            if (activeOnly) {
                query += ' AND is_active = 1';
            }

            if (!includeExpired) {
                query += ' AND (expires_at IS NULL OR expires_at > ?)';
                params.push(new Date().toISOString());
            }

            query += ' ORDER BY created_at DESC LIMIT ?';
            params.push(limit);

            const stmt = db.prepare(query);
            const rows = stmt.all(...params);

            return rows.map(row => {
                row.trigger_events = JSON.parse(row.trigger_events || '[]');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new BehavioralTag(row);
            });
        } catch (error) {
            console.error('[BehavioralTag.findByUserId] Error:', error);
            throw error;
        }
    }

    // Buscar tags por nome e categoria
    static findByTag(tagName, tagCategory = null, options = {}) {
        try {
            const { activeOnly = true, limit = 100 } = options;

            let query = 'SELECT * FROM behavioral_tags WHERE tag_name = ?';
            const params = [tagName];

            if (tagCategory) {
                query += ' AND tag_category = ?';
                params.push(tagCategory);
            }

            if (activeOnly) {
                query += ' AND is_active = 1';
            }

            query += ' ORDER BY created_at DESC LIMIT ?';
            params.push(limit);

            const stmt = db.prepare(query);
            const rows = stmt.all(...params);

            return rows.map(row => {
                row.trigger_events = JSON.parse(row.trigger_events || '[]');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new BehavioralTag(row);
            });
        } catch (error) {
            console.error('[BehavioralTag.findByTag] Error:', error);
            throw error;
        }
    }

    // Buscar tags com filtros avançados
    static findWithFilters(filters = {}, options = {}) {
        try {
            const { limit = 100, offset = 0, orderBy = 'created_at', orderDir = 'DESC' } = options;

            let query = 'SELECT * FROM behavioral_tags WHERE 1=1';
            const params = [];

            if (filters.user_id) {
                query += ' AND user_id = ?';
                params.push(filters.user_id);
            }

            if (filters.tag_name) {
                query += ' AND tag_name LIKE ?';
                params.push(`%${filters.tag_name}%`);
            }

            if (filters.tag_category) {
                query += ' AND tag_category = ?';
                params.push(filters.tag_category);
            }

            if (filters.min_confidence !== undefined) {
                query += ' AND confidence_score >= ?';
                params.push(filters.min_confidence);
            }

            if (filters.max_confidence !== undefined) {
                query += ' AND confidence_score <= ?';
                params.push(filters.max_confidence);
            }

            if (filters.is_active !== undefined) {
                query += ' AND is_active = ?';
                params.push(filters.is_active ? 1 : 0);
            }

            if (filters.created_after) {
                query += ' AND created_at >= ?';
                params.push(filters.created_after);
            }

            if (filters.created_before) {
                query += ' AND created_at <= ?';
                params.push(filters.created_before);
            }

            // Validate orderBy and orderDir to prevent SQL injection
            const safeOrderDir = ['ASC', 'DESC'].includes(String(orderDir).toUpperCase()) ? String(orderDir).toUpperCase() : 'DESC';
            const safeOrderBy = /^[a-zA-Z0-9_]+$/.test(orderBy) ? orderBy : 'created_at';


            query += ` ORDER BY ${safeOrderBy} ${safeOrderDir} LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const stmt = db.prepare(query);
            const rows = stmt.all(...params);

            return rows.map(row => {
                row.trigger_events = JSON.parse(row.trigger_events || '[]');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new BehavioralTag(row);
            });
        } catch (error) {
            console.error('[BehavioralTag.findWithFilters] Error:', error);
            throw error;
        }
    }

    // Contar tags por categoria
    static countByCategory(options = {}) {
        try {
            const { activeOnly = true, dateRange } = options;

            let query = `
                SELECT tag_category, COUNT(*) as count
                FROM behavioral_tags
                WHERE 1=1
            `;
            const params = [];

            if (activeOnly) {
                query += ' AND is_active = 1';
            }

            if (dateRange?.start) {
                query += ' AND created_at >= ?';
                params.push(dateRange.start);
            }

            if (dateRange?.end) {
                query += ' AND created_at <= ?';
                params.push(dateRange.end);
            }

            query += ' GROUP BY tag_category ORDER BY count DESC';

            const stmt = db.prepare(query);
            return stmt.all(...params);
        } catch (error) {
            console.error('[BehavioralTag.countByCategory] Error:', error);
            throw error;
        }
    }

    // Desativar tags expiradas
    static deactivateExpired() {
        try {
            const stmt = db.prepare(`
                UPDATE behavioral_tags
                SET is_active = 0, updated_at = ?
                WHERE expires_at IS NOT NULL AND expires_at <= ?
            `);

            const result = stmt.run(new Date().toISOString(), new Date().toISOString());
            return result.changes;
        } catch (error) {
            console.error('[BehavioralTag.deactivateExpired] Error:', error);
            throw error;
        }
    }

    // Remover tags antigas (manutenção)
    static cleanup(oldThanDays = 365) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - oldThanDays);

            const stmt = db.prepare('DELETE FROM behavioral_tags WHERE created_at < ? AND is_active = 0');
            const result = stmt.run(cutoffDate.toISOString());

            return result.changes;
        } catch (error) {
            console.error('[BehavioralTag.cleanup] Error:', error);
            throw error;
        }
    }
}

module.exports = BehavioralTag;