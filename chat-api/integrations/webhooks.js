const axios = require('axios');
const db = global.dbInstance; // Assumes global.dbInstance is set in server.js

// --- Utility: Trigger Webhook ---
const triggerWebhook = async (event, payload) => {
    try {
        // Fetch enabled webhooks for this event
        const webhooks = db.prepare('SELECT config FROM integrations_config WHERE id LIKE ? AND enabled = 1')
            .all(`webhook_%`); // We'll store ID as 'webhook_<uuid>'

        if (!webhooks || webhooks.length === 0) return;

        console.log(`[WEBHOOK] Triggering ${event} for ${webhooks.length} hooks...`);

        // Execute sequentially or Promise.all - parallel is fine for webhooks
        const promises = webhooks.map(w => {
            const config = JSON.parse(w.config);
            // Check if this webhook subscribes to this event
            if (config.events && config.events.includes(event)) {
                return axios.post(config.url, {
                    event: event,
                    timestamp: new Date().toISOString(),
                    payload: payload
                }, {
                    timeout: 5000 // 5s timeout
                }).catch(err => {
                    console.error(`[WEBHOOK] Failed to send to ${config.url}:`, err.message);
                });
            }
            return Promise.resolve();
        });

        await Promise.all(promises);

    } catch (e) {
        console.error('[WEBHOOK] Error triggering webhooks:', e.message);
    }
};

module.exports = { triggerWebhook };
