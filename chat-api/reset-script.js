
// --- DANGER: SYSTEM RESET ---
app.post('/api/admin/reset-system', (req, res) => {
    try {
        const { confirm } = req.body;
        if (confirm !== 'I_UNDERSTAND_THIS_IS_IRREVERSIBLE') {
            return res.status(400).json({ error: 'Confirmation mismatch' });
        }

        console.log('!!! SYSTEM RESET INITIATED !!!');

        // 1. Truncate Business Tables
        const tablesToClear = [
            'contacts', 'messages', 'orders', 'order_items', 'tickets', 'logs',
            'inventory_logs', 'system_logs', 'ip_blacklist', 'team_invites',
            'csat', 'leads', 'reads', 'clicks', 'sessions', 'db_migrations'
        ];

        // 2. Clear Products & Categories but maybe keep defaults? User said "TUDO".
        tablesToClear.push('products', 'categories', 'coupons', 'random_phrases');

        const stmt = db.transaction(() => {
            tablesToClear.forEach(t => {
                try {
                    db.prepare(`DELETE FROM ${t}`).run();
                    // Reset Sequence
                    db.prepare(`DELETE FROM sqlite_sequence WHERE name = ?`).run(t);
                } catch (e) { /* Ignore checks if table doesn't exist */ }
            });

            // 3. SPECIAL HANDLING: USERS
            // Delete all users EXCEPT 'admin@getnexo.com.br'
            db.prepare(`DELETE FROM users WHERE email != 'admin@getnexo.com.br'`).run();
        });

        stmt();

        console.log('!!! SYSTEM RESET COMPLETED !!!');

        // 4. Force restart logic or just respond
        triggerN8n('system_reset', { by: 'admin' });

        res.json({ success: true, message: 'System wiped. Admin saved.' });

    } catch (e) {
        console.error('Reset Error:', e);
        res.status(500).json({ error: e.message });
    }
});
