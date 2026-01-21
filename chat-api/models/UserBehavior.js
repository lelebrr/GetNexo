const db = require('../server').db || global.dbInstance;

/**
 * Modelo para perfis comportamentais agregados dos usuários
 * Usado para clustering e análise preditiva
 */
class UserBehavior {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id; // ID do usuário (visitor_id ou user_id autenticado)
        this.cluster_id = data.cluster_id; // ID do cluster ML ao qual o usuário pertence

        // Métricas comportamentais agregadas
        this.total_sessions = data.total_sessions || 0;
        this.total_page_views = data.total_page_views || 0;
        this.total_clicks = data.total_clicks || 0;
        this.total_scroll_events = data.total_scroll_events || 0;
        this.total_time_spent = data.total_time_spent || 0; // em segundos
        this.avg_session_duration = data.avg_session_duration || 0;
        this.max_scroll_depth = data.max_scroll_depth || 0;
        this.bounce_rate = data.bounce_rate || 0;

        // Métricas de engajamento
        this.engagement_score = data.engagement_score || 0; // 0-100
        this.conversion_probability = data.conversion_probability || 0; // 0-100
        this.churn_risk = data.churn_risk || 0; // 0-100

        // Padrões de navegação
        this.favorite_pages = data.favorite_pages ? JSON.stringify(data.favorite_pages) : '[]';
        this.click_patterns = data.click_patterns ? JSON.stringify(data.click_patterns) : '{}';
        this.time_patterns = data.time_patterns ? JSON.stringify(data.time_patterns) : '{}'; // horários preferidos
        this.device_preferences = data.device_preferences ? JSON.stringify(data.device_preferences) : '{}';

        // Dados de interesse
        this.interests = data.interests ? JSON.stringify(data.interests) : '[]'; // produtos/categorias de interesse
        this.purchase_intent_signals = data.purchase_intent_signals || 0; // sinais de intenção de compra
        this.abandonment_instances = data.abandonment_instances || 0; // carrinhos abandonados

        // Metadados ML
        this.feature_vector = data.feature_vector ? JSON.stringify(data.feature_vector) : '[]'; // vetor para ML
        this.last_ml_update = data.last_ml_update; // última atualização do modelo ML

        this.metadata = data.metadata ? JSON.stringify(data.metadata) : '{}';
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
    }

    // Criar novo perfil comportamental
    static create(behaviorData) {
        try {
            const behavior = new UserBehavior(behaviorData);

            const stmt = db.prepare(`
                INSERT INTO user_behaviors (
                    user_id, cluster_id, total_sessions, total_page_views, total_clicks,
                    total_scroll_events, total_time_spent, avg_session_duration, max_scroll_depth,
                    bounce_rate, engagement_score, conversion_probability, churn_risk,
                    favorite_pages, click_patterns, time_patterns, device_preferences,
                    interests, purchase_intent_signals, abandonment_instances,
                    feature_vector, last_ml_update, metadata, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const result = stmt.run(
                behavior.user_id, behavior.cluster_id, behavior.total_sessions,
                behavior.total_page_views, behavior.total_clicks, behavior.total_scroll_events,
                behavior.total_time_spent, behavior.avg_session_duration, behavior.max_scroll_depth,
                behavior.bounce_rate, behavior.engagement_score, behavior.conversion_probability,
                behavior.churn_risk, behavior.favorite_pages, behavior.click_patterns,
                behavior.time_patterns, behavior.device_preferences, behavior.interests,
                behavior.purchase_intent_signals, behavior.abandonment_instances,
                behavior.feature_vector, behavior.last_ml_update, behavior.metadata,
                behavior.created_at, behavior.updated_at
            );

            behavior.id = result.lastInsertRowid;
            return behavior;
        } catch (error) {
            console.error('[UserBehavior.create] Error:', error);
            throw error;
        }
    }

    // Atualizar perfil existente
    static update(userId, updateData) {
        try {
            const updateFields = [];
            const params = [];

            // Métricas comportamentais
            if (updateData.cluster_id !== undefined) {
                updateFields.push('cluster_id = ?');
                params.push(updateData.cluster_id);
            }
            if (updateData.total_sessions !== undefined) {
                updateFields.push('total_sessions = ?');
                params.push(updateData.total_sessions);
            }
            if (updateData.total_page_views !== undefined) {
                updateFields.push('total_page_views = ?');
                params.push(updateData.total_page_views);
            }
            if (updateData.total_clicks !== undefined) {
                updateFields.push('total_clicks = ?');
                params.push(updateData.total_clicks);
            }
            if (updateData.total_scroll_events !== undefined) {
                updateFields.push('total_scroll_events = ?');
                params.push(updateData.total_scroll_events);
            }
            if (updateData.total_time_spent !== undefined) {
                updateFields.push('total_time_spent = ?');
                params.push(updateData.total_time_spent);
            }
            if (updateData.avg_session_duration !== undefined) {
                updateFields.push('avg_session_duration = ?');
                params.push(updateData.avg_session_duration);
            }
            if (updateData.max_scroll_depth !== undefined) {
                updateFields.push('max_scroll_depth = ?');
                params.push(updateData.max_scroll_depth);
            }
            if (updateData.bounce_rate !== undefined) {
                updateFields.push('bounce_rate = ?');
                params.push(updateData.bounce_rate);
            }

            // Scores preditivos
            if (updateData.engagement_score !== undefined) {
                updateFields.push('engagement_score = ?');
                params.push(updateData.engagement_score);
            }
            if (updateData.conversion_probability !== undefined) {
                updateFields.push('conversion_probability = ?');
                params.push(updateData.conversion_probability);
            }
            if (updateData.churn_risk !== undefined) {
                updateFields.push('churn_risk = ?');
                params.push(updateData.churn_risk);
            }

            // Padrões
            if (updateData.favorite_pages !== undefined) {
                updateFields.push('favorite_pages = ?');
                params.push(JSON.stringify(updateData.favorite_pages));
            }
            if (updateData.click_patterns !== undefined) {
                updateFields.push('click_patterns = ?');
                params.push(JSON.stringify(updateData.click_patterns));
            }
            if (updateData.time_patterns !== undefined) {
                updateFields.push('time_patterns = ?');
                params.push(JSON.stringify(updateData.time_patterns));
            }
            if (updateData.device_preferences !== undefined) {
                updateFields.push('device_preferences = ?');
                params.push(JSON.stringify(updateData.device_preferences));
            }

            // Interesses
            if (updateData.interests !== undefined) {
                updateFields.push('interests = ?');
                params.push(JSON.stringify(updateData.interests));
            }
            if (updateData.purchase_intent_signals !== undefined) {
                updateFields.push('purchase_intent_signals = ?');
                params.push(updateData.purchase_intent_signals);
            }
            if (updateData.abandonment_instances !== undefined) {
                updateFields.push('abandonment_instances = ?');
                params.push(updateData.abandonment_instances);
            }

            // ML
            if (updateData.feature_vector !== undefined) {
                updateFields.push('feature_vector = ?');
                params.push(JSON.stringify(updateData.feature_vector));
            }
            if (updateData.last_ml_update !== undefined) {
                updateFields.push('last_ml_update = ?');
                params.push(updateData.last_ml_update);
            }

            if (updateData.metadata !== undefined) {
                updateFields.push('metadata = ?');
                params.push(JSON.stringify(updateData.metadata));
            }

            updateFields.push('updated_at = ?');
            params.push(new Date().toISOString());

            params.push(userId);

            const stmt = db.prepare(`
                UPDATE user_behaviors
                SET ${updateFields.join(', ')}
                WHERE user_id = ?
            `);

            const result = stmt.run(...params);
            return result.changes > 0;
        } catch (error) {
            console.error('[UserBehavior.update] Error:', error);
            throw error;
        }
    }

    // Buscar perfil comportamental por user_id
    static findByUserId(userId) {
        try {
            const stmt = db.prepare('SELECT * FROM user_behaviors WHERE user_id = ?');
            const row = stmt.get(userId);

            if (!row) return null;

            // Parse JSON fields
            row.favorite_pages = JSON.parse(row.favorite_pages || '[]');
            row.click_patterns = JSON.parse(row.click_patterns || '{}');
            row.time_patterns = JSON.parse(row.time_patterns || '{}');
            row.device_preferences = JSON.parse(row.device_preferences || '{}');
            row.interests = JSON.parse(row.interests || '[]');
            row.feature_vector = JSON.parse(row.feature_vector || '[]');
            row.metadata = JSON.parse(row.metadata || '{}');

            return new UserBehavior(row);
        } catch (error) {
            console.error('[UserBehavior.findByUserId] Error:', error);
            throw error;
        }
    }

    // Buscar perfis por cluster
    static findByCluster(clusterId, options = {}) {
        try {
            const { limit = 100, offset = 0 } = options;

            const stmt = db.prepare(`
                SELECT * FROM user_behaviors
                WHERE cluster_id = ?
                ORDER BY engagement_score DESC
                LIMIT ? OFFSET ?
            `);

            const rows = stmt.all(clusterId, limit, offset);

            return rows.map(row => {
                row.favorite_pages = JSON.parse(row.favorite_pages || '[]');
                row.click_patterns = JSON.parse(row.click_patterns || '{}');
                row.time_patterns = JSON.parse(row.time_patterns || '{}');
                row.device_preferences = JSON.parse(row.device_preferences || '{}');
                row.interests = JSON.parse(row.interests || '[]');
                row.feature_vector = JSON.parse(row.feature_vector || '[]');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new UserBehavior(row);
            });
        } catch (error) {
            console.error('[UserBehavior.findByCluster] Error:', error);
            throw error;
        }
    }

    // Buscar usuários com alta probabilidade de conversão
    static findHighConversionProbability(minProbability = 70, limit = 50) {
        try {
            const stmt = db.prepare(`
                SELECT * FROM user_behaviors
                WHERE conversion_probability >= ?
                ORDER BY conversion_probability DESC
                LIMIT ?
            `);

            const rows = stmt.all(minProbability, limit);

            return rows.map(row => {
                row.favorite_pages = JSON.parse(row.favorite_pages || '[]');
                row.click_patterns = JSON.parse(row.click_patterns || '{}');
                row.time_patterns = JSON.parse(row.time_patterns || '{}');
                row.device_preferences = JSON.parse(row.device_preferences || '{}');
                row.interests = JSON.parse(row.interests || '[]');
                row.feature_vector = JSON.parse(row.feature_vector || '[]');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new UserBehavior(row);
            });
        } catch (error) {
            console.error('[UserBehavior.findHighConversionProbability] Error:', error);
            throw error;
        }
    }

    // Estatísticas de clusters
    static getClusterStats() {
        try {
            const stmt = db.prepare(`
                SELECT
                    cluster_id,
                    COUNT(*) as user_count,
                    AVG(engagement_score) as avg_engagement,
                    AVG(conversion_probability) as avg_conversion_prob,
                    AVG(churn_risk) as avg_churn_risk,
                    AVG(total_sessions) as avg_sessions,
                    AVG(total_time_spent) as avg_time_spent
                FROM user_behaviors
                WHERE cluster_id IS NOT NULL
                GROUP BY cluster_id
                ORDER BY user_count DESC
            `);

            const stats = stmt.all();

            return stats.map(stat => ({
                cluster_id: stat.cluster_id,
                user_count: stat.user_count,
                avg_engagement: Math.round(stat.avg_engagement || 0),
                avg_conversion_prob: Math.round(stat.avg_conversion_prob || 0),
                avg_churn_risk: Math.round(stat.avg_churn_risk || 0),
                avg_sessions: Math.round(stat.avg_sessions || 0),
                avg_time_spent: Math.round(stat.avg_time_spent || 0)
            }));
        } catch (error) {
            console.error('[UserBehavior.getClusterStats] Error:', error);
            throw error;
        }
    }

    // Atualizar scores preditivos para múltiplos usuários
    static bulkUpdatePredictiveScores(updates) {
        try {
            const stmt = db.prepare(`
                UPDATE user_behaviors
                SET engagement_score = ?, conversion_probability = ?, churn_risk = ?,
                    last_ml_update = ?, updated_at = ?
                WHERE user_id = ?
            `);

            const updateMany = db.transaction((updateList) => {
                for (const update of updateList) {
                    stmt.run(
                        update.engagement_score,
                        update.conversion_probability,
                        update.churn_risk,
                        new Date().toISOString(),
                        new Date().toISOString(),
                        update.user_id
                    );
                }
            });

            updateMany(updates);
            return updates.length;
        } catch (error) {
            console.error('[UserBehavior.bulkUpdatePredictiveScores] Error:', error);
            throw error;
        }
    }

    // Atualizar clusters para múltiplos usuários
    static bulkUpdateClusters(updates) {
        try {
            const stmt = db.prepare(`
                UPDATE user_behaviors
                SET cluster_id = ?, updated_at = ?
                WHERE user_id = ?
            `);

            const updateMany = db.transaction((updateList) => {
                for (const update of updateList) {
                    stmt.run(
                        update.cluster_id,
                        new Date().toISOString(),
                        update.user_id
                    );
                }
            });

            updateMany(updates);
            return updates.length;
        } catch (error) {
            console.error('[UserBehavior.bulkUpdateClusters] Error:', error);
            throw error;
        }
    }

    // Criar ou atualizar perfil (upsert)
    static upsert(behaviorData) {
        try {
            const existing = db.prepare('SELECT id FROM user_behaviors WHERE user_id = ?').get(behaviorData.user_id);

            if (existing) {
                // Update
                this.update(behaviorData.user_id, behaviorData);
                behaviorData.id = existing.id;
                return behaviorData;
            } else {
                // Create
                return this.create(behaviorData);
            }
        } catch (error) {
            console.error('[UserBehavior.upsert] Error:', error);
            throw error;
        }
    }
}

module.exports = UserBehavior;