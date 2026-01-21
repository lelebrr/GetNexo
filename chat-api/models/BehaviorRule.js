const db = require('../server').db || global.dbInstance;

/**
 * Modelo para regras de tagging comportamental configuráveis
 * Define condições para aplicação automática de tags baseada em comportamento
 */
class BehaviorRule {
    constructor(data) {
        this.id = data.id;
        this.name = data.name; // Nome da regra
        this.description = data.description; // Descrição da regra
        this.tag_name = data.tag_name; // Nome da tag a ser aplicada
        this.tag_category = data.tag_category; // Categoria da tag
        this.priority = data.priority || 1; // Prioridade da regra (1-10, maior = mais prioritária)

        // Condições da regra (JSON)
        this.conditions = data.conditions ? JSON.stringify(data.conditions) : '{}';

        // Configuração da tag resultante
        this.tag_config = data.tag_config ? JSON.stringify(data.tag_config) : '{}';

        // Configurações adicionais
        this.confidence_threshold = data.confidence_threshold || 50; // Limiar de confiança mínimo
        this.expiration_days = data.expiration_days; // Dias para expiração da tag (opcional)
        this.max_applications = data.max_applications; // Máximo de aplicações por usuário (opcional)
        this.cooldown_hours = data.cooldown_hours || 24; // Horas de cooldown entre aplicações

        // Controle de ativação
        this.is_active = data.is_active !== undefined ? data.is_active : true;
        this.is_system = data.is_system || false; // Se é uma regra do sistema (não editável)

        // Estatísticas
        this.applications_count = data.applications_count || 0;
        this.last_applied = data.last_applied;

        this.metadata = data.metadata ? JSON.stringify(data.metadata) : '{}';
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
    }

    // Criar nova regra
    static create(ruleData) {
        try {
            const rule = new BehaviorRule(ruleData);

            const stmt = db.prepare(`
                INSERT INTO behavior_rules (
                    name, description, tag_name, tag_category, priority, conditions,
                    tag_config, confidence_threshold, expiration_days, max_applications,
                    cooldown_hours, is_active, is_system, applications_count,
                    last_applied, metadata, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const result = stmt.run(
                rule.name, rule.description, rule.tag_name, rule.tag_category, rule.priority,
                rule.conditions, rule.tag_config, rule.confidence_threshold, rule.expiration_days,
                rule.max_applications, rule.cooldown_hours, rule.is_active, rule.is_system,
                rule.applications_count, rule.last_applied, rule.metadata,
                rule.created_at, rule.updated_at
            );

            rule.id = result.lastInsertRowid;
            return rule;
        } catch (error) {
            console.error('[BehaviorRule.create] Error:', error);
            throw error;
        }
    }

    // Atualizar regra existente
    static update(id, updateData) {
        try {
            const updateFields = [];
            const params = [];

            if (updateData.name !== undefined) {
                updateFields.push('name = ?');
                params.push(updateData.name);
            }
            if (updateData.description !== undefined) {
                updateFields.push('description = ?');
                params.push(updateData.description);
            }
            if (updateData.tag_name !== undefined) {
                updateFields.push('tag_name = ?');
                params.push(updateData.tag_name);
            }
            if (updateData.tag_category !== undefined) {
                updateFields.push('tag_category = ?');
                params.push(updateData.tag_category);
            }
            if (updateData.priority !== undefined) {
                updateFields.push('priority = ?');
                params.push(updateData.priority);
            }
            if (updateData.conditions !== undefined) {
                updateFields.push('conditions = ?');
                params.push(JSON.stringify(updateData.conditions));
            }
            if (updateData.tag_config !== undefined) {
                updateFields.push('tag_config = ?');
                params.push(JSON.stringify(updateData.tag_config));
            }
            if (updateData.confidence_threshold !== undefined) {
                updateFields.push('confidence_threshold = ?');
                params.push(updateData.confidence_threshold);
            }
            if (updateData.expiration_days !== undefined) {
                updateFields.push('expiration_days = ?');
                params.push(updateData.expiration_days);
            }
            if (updateData.max_applications !== undefined) {
                updateFields.push('max_applications = ?');
                params.push(updateData.max_applications);
            }
            if (updateData.cooldown_hours !== undefined) {
                updateFields.push('cooldown_hours = ?');
                params.push(updateData.cooldown_hours);
            }
            if (updateData.is_active !== undefined) {
                updateFields.push('is_active = ?');
                params.push(updateData.is_active);
            }
            if (updateData.applications_count !== undefined) {
                updateFields.push('applications_count = ?');
                params.push(updateData.applications_count);
            }
            if (updateData.last_applied !== undefined) {
                updateFields.push('last_applied = ?');
                params.push(updateData.last_applied);
            }
            if (updateData.metadata !== undefined) {
                updateFields.push('metadata = ?');
                params.push(JSON.stringify(updateData.metadata));
            }

            updateFields.push('updated_at = ?');
            params.push(new Date().toISOString());

            params.push(id);

            const stmt = db.prepare(`
                UPDATE behavior_rules
                SET ${updateFields.join(', ')}
                WHERE id = ?
            `);

            const result = stmt.run(...params);
            return result.changes > 0;
        } catch (error) {
            console.error('[BehaviorRule.update] Error:', error);
            throw error;
        }
    }

    // Buscar todas as regras ativas ordenadas por prioridade
    static findActive() {
        try {
            const stmt = db.prepare(`
                SELECT * FROM behavior_rules
                WHERE is_active = 1
                ORDER BY priority DESC, created_at ASC
            `);

            const rows = stmt.all();

            return rows.map(row => {
                row.conditions = JSON.parse(row.conditions || '{}');
                row.tag_config = JSON.parse(row.tag_config || '{}');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new BehaviorRule(row);
            });
        } catch (error) {
            console.error('[BehaviorRule.findActive] Error:', error);
            throw error;
        }
    }

    // Buscar regras por categoria de tag
    static findByTagCategory(tagCategory) {
        try {
            const stmt = db.prepare(`
                SELECT * FROM behavior_rules
                WHERE tag_category = ? AND is_active = 1
                ORDER BY priority DESC
            `);

            const rows = stmt.all(tagCategory);

            return rows.map(row => {
                row.conditions = JSON.parse(row.conditions || '{}');
                row.tag_config = JSON.parse(row.tag_config || '{}');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new BehaviorRule(row);
            });
        } catch (error) {
            console.error('[BehaviorRule.findByTagCategory] Error:', error);
            throw error;
        }
    }

    // Buscar regra por ID
    static findById(id) {
        try {
            const stmt = db.prepare('SELECT * FROM behavior_rules WHERE id = ?');
            const row = stmt.get(id);

            if (!row) return null;

            row.conditions = JSON.parse(row.conditions || '{}');
            row.tag_config = JSON.parse(row.tag_config || '{}');
            row.metadata = JSON.parse(row.metadata || '{}');

            return new BehaviorRule(row);
        } catch (error) {
            console.error('[BehaviorRule.findById] Error:', error);
            throw error;
        }
    }

    // Buscar regras com filtros
    static findWithFilters(filters = {}, options = {}) {
        try {
            const { limit = 50, offset = 0, orderBy = 'priority', orderDir = 'DESC' } = options;

            let query = 'SELECT * FROM behavior_rules WHERE 1=1';
            const params = [];

            if (filters.is_active !== undefined) {
                query += ' AND is_active = ?';
                params.push(filters.is_active ? 1 : 0);
            }

            if (filters.is_system !== undefined) {
                query += ' AND is_system = ?';
                params.push(filters.is_system ? 1 : 0);
            }

            if (filters.tag_category) {
                query += ' AND tag_category = ?';
                params.push(filters.tag_category);
            }

            if (filters.priority_min !== undefined) {
                query += ' AND priority >= ?';
                params.push(filters.priority_min);
            }

            if (filters.priority_max !== undefined) {
                query += ' AND priority <= ?';
                params.push(filters.priority_max);
            }

            query += ` ORDER BY ${orderBy} ${orderDir} LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const stmt = db.prepare(query);
            const rows = stmt.all(...params);

            return rows.map(row => {
                row.conditions = JSON.parse(row.conditions || '{}');
                row.tag_config = JSON.parse(row.tag_config || '{}');
                row.metadata = JSON.parse(row.metadata || '{}');
                return new BehaviorRule(row);
            });
        } catch (error) {
            console.error('[BehaviorRule.findWithFilters] Error:', error);
            throw error;
        }
    }

    // Incrementar contador de aplicações
    static incrementApplications(id) {
        try {
            const stmt = db.prepare(`
                UPDATE behavior_rules
                SET applications_count = applications_count + 1,
                    last_applied = ?,
                    updated_at = ?
                WHERE id = ?
            `);

            const result = stmt.run(new Date().toISOString(), new Date().toISOString(), id);
            return result.changes > 0;
        } catch (error) {
            console.error('[BehaviorRule.incrementApplications] Error:', error);
            throw error;
        }
    }

    // Verificar se uma regra pode ser aplicada a um usuário
    static canApplyToUser(ruleId, userId) {
        try {
            const rule = this.findById(ruleId);
            if (!rule) return false;

            // Verificar cooldown
            if (rule.last_applied) {
                const lastApplied = new Date(rule.last_applied);
                const cooldownMs = rule.cooldown_hours * 60 * 60 * 1000;
                const now = new Date();

                if (now - lastApplied < cooldownMs) {
                    return false; // Ainda em cooldown
                }
            }

            // Verificar limite de aplicações por usuário
            if (rule.max_applications) {
                const stmt = db.prepare(`
                    SELECT COUNT(*) as count FROM behavioral_tags
                    WHERE user_id = ? AND tag_name = ?
                `);
                const result = stmt.get(userId, rule.tag_name);

                if (result.count >= rule.max_applications) {
                    return false; // Limite atingido
                }
            }

            return true;
        } catch (error) {
            console.error('[BehaviorRule.canApplyToUser] Error:', error);
            return false;
        }
    }

    // Estatísticas das regras
    static getStats() {
        try {
            const stmt = db.prepare(`
                SELECT
                    tag_category,
                    COUNT(*) as rule_count,
                    SUM(applications_count) as total_applications,
                    AVG(applications_count) as avg_applications,
                    MAX(applications_count) as max_applications
                FROM behavior_rules
                GROUP BY tag_category
                ORDER BY total_applications DESC
            `);

            const stats = stmt.all();

            return stats.map(stat => ({
                tag_category: stat.tag_category,
                rule_count: stat.rule_count,
                total_applications: stat.total_applications || 0,
                avg_applications: Math.round(stat.avg_applications || 0),
                max_applications: stat.max_applications || 0
            }));
        } catch (error) {
            console.error('[BehaviorRule.getStats] Error:', error);
            throw error;
        }
    }

    // Regras padrão do sistema
    static createDefaultRules() {
        try {
            const defaultRules = [
                {
                    name: 'Interesse Alto - Visualizações Múltiplas',
                    description: 'Aplica tag quando usuário vê o mesmo produto 3+ vezes',
                    tag_name: 'Interesse Alto',
                    tag_category: 'Interesse',
                    priority: 8,
                    conditions: {
                        event_type: 'page_view',
                        min_occurrences: 3,
                        time_window_hours: 24,
                        element_selector: '.product-view'
                    },
                    tag_config: {
                        confidence_score: 85,
                        expiration_days: 7
                    },
                    confidence_threshold: 80,
                    expiration_days: 7,
                    cooldown_hours: 12,
                    is_system: true
                },
                {
                    name: 'Comprador Recorrente',
                    description: 'Usuário que fez compras frequentes',
                    tag_name: 'Comprador Recorrente',
                    tag_category: 'Frequência',
                    priority: 9,
                    conditions: {
                        event_type: 'purchase',
                        min_occurrences: 3,
                        time_window_days: 30
                    },
                    tag_config: {
                        confidence_score: 95,
                        expiration_days: 90
                    },
                    confidence_threshold: 90,
                    expiration_days: 90,
                    cooldown_hours: 24,
                    is_system: true
                },
                {
                    name: 'Carrinho Abandonado',
                    description: 'Usuário adicionou itens ao carrinho mas não finalizou compra',
                    tag_name: 'Carrinho Abandonado',
                    tag_category: 'Conversão',
                    priority: 7,
                    conditions: {
                        event_type: 'cart_add',
                        no_purchase: true,
                        time_window_hours: 2
                    },
                    tag_config: {
                        confidence_score: 75,
                        expiration_days: 1
                    },
                    confidence_threshold: 70,
                    expiration_days: 1,
                    cooldown_hours: 6,
                    is_system: true
                },
                {
                    name: 'Engajamento Alto',
                    description: 'Usuário com alto nível de interação na página',
                    tag_name: 'Alto Engajamento',
                    tag_category: 'Engajamento',
                    priority: 6,
                    conditions: {
                        min_scroll_depth: 75,
                        min_time_spent_seconds: 180,
                        event_types: ['click', 'scroll', 'mouse_move'],
                        min_events: 10
                    },
                    tag_config: {
                        confidence_score: 80,
                        expiration_days: 3
                    },
                    confidence_threshold: 75,
                    expiration_days: 3,
                    cooldown_hours: 24,
                    is_system: true
                }
            ];

            const createdRules = [];
            for (const ruleData of defaultRules) {
                try {
                    const existing = db.prepare('SELECT id FROM behavior_rules WHERE name = ?').get(ruleData.name);
                    if (!existing) {
                        const rule = this.create(ruleData);
                        createdRules.push(rule);
                    }
                } catch (e) {
                    console.warn(`Failed to create rule "${ruleData.name}":`, e);
                }
            }

            return createdRules;
        } catch (error) {
            console.error('[BehaviorRule.createDefaultRules] Error:', error);
            throw error;
        }
    }
}

module.exports = BehaviorRule;