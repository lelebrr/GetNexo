// SQLite-based WhiteLabelConfig model to replace mongoose
const Database = require('better-sqlite3');
const path = require('path');

// Get database instance from global or create new one
function getDb() {
    if (global.dbInstance) return global.dbInstance;

    const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'omninchat.db');
    return new Database(DB_PATH);
}

class WhiteLabelConfig {
    constructor() {
        this.db = getDb();
        this.initTable();
    }

    initTable() {
        // Create table with all necessary columns
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS white_label_configs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id TEXT UNIQUE NOT NULL,
                data TEXT NOT NULL, -- JSON string containing all config data
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create index for performance
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_whitelabel_client_id ON white_label_configs(client_id)
        `);
    }

    // Default configuration
    getDefaultConfig() {
        return {
            client_id: '',
            branding: {
                logo: '',
                colorPalette: {
                    primary: '#007bff',
                    secondary: '#6c757d',
                    accent: '#28a745',
                    background: '#ffffff'
                },
                botName: 'GetNexo Bot',
                background: '',
                customCss: ''
            },
            behavior: {
                activeChannels: ['whatsapp', 'email', 'chat'],
                terminology: {
                    welcomeMessage: 'Olá! Como posso ajudar você hoje?',
                    inputPlaceholder: 'Digite sua mensagem...'
                },
                favicon: ''
            },
            chatWidget: {
                position: 'bottom-right',
                size: { width: 350, height: 500 },
                animation: true,
                sound: true
            },
            rbac: [],
            rbac_levels: {
                'super_admin': [
                    'crud_tickets', 'manage_users', 'configure_whitelabel', 'view_reports', 'manage_templates', 'access_audit', 'configure_smtp',
                    'manage_channels', 'configure_ai', 'manage_automation', 'view_analytics', 'manage_tags', 'handle_subtickets', 'manage_cost_timer',
                    'access_audit_trail', 'manage_reminders', 'manage_hr_feedback', 'configure_domain', 'manage_attachments', 'transfer_tickets',
                    'pause_sla', 'merge_duplicates', 'manage_agent_folders', 'digital_signature'
                ],
                'admin': [
                    'crud_tickets', 'manage_users', 'configure_whitelabel', 'view_reports', 'manage_templates', 'access_audit', 'configure_smtp',
                    'manage_channels', 'configure_ai', 'manage_automation', 'view_analytics', 'manage_tags', 'handle_subtickets', 'manage_cost_timer',
                    'access_audit_trail', 'manage_reminders', 'manage_hr_feedback', 'manage_attachments', 'transfer_tickets', 'pause_sla', 'merge_duplicates',
                    'manage_agent_folders', 'digital_signature'
                ],
                'manager': [
                    'crud_tickets', 'manage_users', 'view_reports', 'manage_templates', 'view_analytics', 'manage_tags', 'handle_subtickets',
                    'manage_cost_timer', 'access_audit_trail', 'manage_reminders', 'manage_hr_feedback', 'manage_attachments', 'transfer_tickets',
                    'pause_sla', 'merge_duplicates', 'manage_agent_folders', 'digital_signature'
                ],
                'agent': [
                    'crud_tickets', 'manage_templates', 'manage_tags', 'handle_subtickets', 'manage_cost_timer', 'manage_reminders',
                    'manage_attachments', 'transfer_tickets', 'pause_sla', 'merge_duplicates', 'manage_agent_folders', 'digital_signature'
                ],
                'editor': [
                    'manage_templates', 'manage_tags', 'manage_reminders', 'manage_attachments'
                ],
                'viewer': [
                    'view_reports', 'view_analytics'
                ],
                'client_admin': [
                    'crud_tickets', 'manage_users', 'configure_whitelabel', 'view_reports', 'manage_templates', 'manage_tags', 'handle_subtickets',
                    'manage_cost_timer', 'manage_reminders', 'manage_attachments', 'transfer_tickets', 'pause_sla', 'merge_duplicates',
                    'manage_agent_folders', 'digital_signature'
                ],
                'client_user': [
                    'crud_tickets', 'manage_templates', 'manage_tags', 'handle_subtickets', 'manage_attachments', 'transfer_tickets'
                ]
            },
            domain: {
                cname: '',
                status: 'pending',
                ssl: {
                    enabled: false,
                    status: 'pending',
                    certPath: '',
                    keyPath: '',
                    issuedAt: null,
                    expiresAt: null
                }
            },
            smtp: {
                host: '',
                port: 587,
                secure: false,
                user: '',
                pass: ''
            }
        };
    }

    // Find one document by query
    findOne(query) {
        return new Promise((resolve, reject) => {
            try {
                let stmt;
                let params = [];

                if (query.client_id) {
                    stmt = this.db.prepare('SELECT * FROM white_label_configs WHERE client_id = ?');
                    params = [query.client_id];
                } else {
                    resolve(null);
                    return;
                }

                const row = stmt.get(...params);

                if (row) {
                    const config = JSON.parse(row.data);
                    config.client_id = row.client_id;
                    config._id = row.id;
                    config.createdAt = row.created_at;
                    config.updatedAt = row.updated_at;
                    resolve(config);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // Find one and update
    findOneAndUpdate(query, update, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const { upsert = false, new: returnNew = true } = options;

                // Extract the update data (remove $set if present)
                let updateData = update;
                if (update.$set) {
                    updateData = update.$set;
                }

                // First try to find existing record
                let existing = null;
                if (query.client_id) {
                    const stmt = this.db.prepare('SELECT * FROM white_label_configs WHERE client_id = ?');
                    const row = stmt.get(query.client_id);
                    if (row) {
                        existing = JSON.parse(row.data);
                        existing.client_id = row.client_id;
                        existing._id = row.id;
                        existing.createdAt = row.created_at;
                        existing.updatedAt = row.updated_at;
                    }
                }

                let result;

                if (existing) {
                    // Update existing
                    const mergedData = this.deepMerge(existing, updateData);
                    const updateStmt = this.db.prepare(`
                        UPDATE white_label_configs
                        SET data = ?, updated_at = CURRENT_TIMESTAMP
                        WHERE client_id = ?
                    `);
                    updateStmt.run(JSON.stringify(mergedData), query.client_id);
                    result = mergedData;
                } else if (upsert) {
                    // Create new with defaults merged
                    const defaults = this.getDefaultConfig();
                    const newData = this.deepMerge(defaults, updateData);
                    newData.client_id = query.client_id;

                    const insertStmt = this.db.prepare(`
                        INSERT INTO white_label_configs (client_id, data)
                        VALUES (?, ?)
                    `);
                    const info = insertStmt.run(query.client_id, JSON.stringify(newData));
                    newData._id = info.lastInsertRowid;
                    newData.createdAt = new Date().toISOString();
                    newData.updatedAt = new Date().toISOString();
                    result = newData;
                } else {
                    result = null;
                }

                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Deep merge utility
    deepMerge(target, source) {
        const result = { ...target };

        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    }
}

// Export singleton instance
module.exports = new WhiteLabelConfig();