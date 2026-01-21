const Database = require('better-sqlite3');

// Payment Transaction Model
class PaymentTransaction {
    constructor(db = global.dbInstance) {
        this.db = db;
    }

    // Criar nova transação
    create(data) {
        const stmt = this.db.prepare(`
            INSERT INTO payment_transactions (
                id, phone, amount, currency, payment_method, gateway, status,
                description, pix_qr_code, pix_key, external_id, metadata,
                chat_message_id, user_id, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const id = data.id || `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const info = stmt.run(
            id,
            data.phone,
            data.amount,
            data.currency || 'BRL',
            data.payment_method,
            data.gateway,
            data.status || 'pending',
            data.description,
            data.pix_qr_code,
            data.pix_key,
            data.external_id,
            JSON.stringify(data.metadata || {}),
            data.chat_message_id,
            data.user_id,
            new Date().toISOString(),
            new Date().toISOString()
        );

        return this.findById(id);
    }

    // Buscar por ID
    findById(id) {
        const stmt = this.db.prepare('SELECT * FROM payment_transactions WHERE id = ?');
        const row = stmt.get(id);

        if (row && row.metadata) {
            row.metadata = JSON.parse(row.metadata);
        }

        return row;
    }

    // Buscar por telefone
    findByPhone(phone) {
        const stmt = this.db.prepare('SELECT * FROM payment_transactions WHERE phone = ? ORDER BY created_at DESC');
        const rows = stmt.all(phone);

        return rows.map(row => {
            if (row.metadata) row.metadata = JSON.parse(row.metadata);
            return row;
        });
    }

    // Buscar por status
    findByStatus(status, limit = 50) {
        const stmt = this.db.prepare('SELECT * FROM payment_transactions WHERE status = ? ORDER BY created_at DESC LIMIT ?');
        const rows = stmt.all(status, limit);

        return rows.map(row => {
            if (row.metadata) row.metadata = JSON.parse(row.metadata);
            return row;
        });
    }

    // Atualizar status
    updateStatus(id, status, metadata = {}) {
        const currentMetadata = this.findById(id)?.metadata || {};
        const updatedMetadata = { ...currentMetadata, ...metadata };

        const stmt = this.db.prepare(`
            UPDATE payment_transactions
            SET status = ?, metadata = ?, updated_at = ?
            WHERE id = ?
        `);

        stmt.run(status, JSON.stringify(updatedMetadata), new Date().toISOString(), id);

        return this.findById(id);
    }

    // Buscar transações por período
    findByDateRange(startDate, endDate, status = null) {
        let query = 'SELECT * FROM payment_transactions WHERE created_at >= ? AND created_at <= ?';
        let params = [startDate, endDate];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const stmt = this.db.prepare(query);
        const rows = stmt.all(...params);

        return rows.map(row => {
            if (row.metadata) row.metadata = JSON.parse(row.metadata);
            return row;
        });
    }

    // Estatísticas de conversão
    getConversionStats(startDate, endDate) {
        const transactions = this.findByDateRange(startDate, endDate);

        const stats = {
            total: transactions.length,
            completed: transactions.filter(t => t.status === 'completed').length,
            pending: transactions.filter(t => t.status === 'pending').length,
            failed: transactions.filter(t => t.status === 'failed').length,
            conversion_rate: 0,
            total_amount: 0,
            completed_amount: 0,
            avg_transaction_value: 0,
            by_gateway: {},
            by_currency: {}
        };

        // Calcular valores
        stats.conversion_rate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

        stats.total_amount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        stats.completed_amount = transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        stats.avg_transaction_value = stats.total > 0 ? stats.total_amount / stats.total : 0;

        // Agrupar por gateway
        transactions.forEach(t => {
            if (!stats.by_gateway[t.gateway]) {
                stats.by_gateway[t.gateway] = { total: 0, completed: 0 };
            }
            stats.by_gateway[t.gateway].total++;
            if (t.status === 'completed') stats.by_gateway[t.gateway].completed++;
        });

        // Agrupar por moeda
        transactions.forEach(t => {
            if (!stats.by_currency[t.currency]) {
                stats.by_currency[t.currency] = { total: 0, amount: 0 };
            }
            stats.by_currency[t.currency].total++;
            stats.by_currency[t.currency].amount += t.amount || 0;
        });

        return stats;
    }
}

module.exports = PaymentTransaction;