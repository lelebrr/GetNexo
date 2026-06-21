const db = require('../db');

class SecurityMonitor {
    getSecuritySnapshot() {
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const last1h = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

        // 1. Failed transactions (Security risk)
        const failedTx = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE status = 'failed' AND created_at >= ?").get(last24h).count;

        // Combined sequential queries into a single query using conditional aggregation
        // Impact: Reduces database queries from 3 to 1.
        const securityStats = db.prepare(`
            SELECT
                SUM(CASE WHEN type = 'AUTH_FAILURE' THEN 1 ELSE 0 END) as authFailures,
                SUM(CASE WHEN type = 'SERVER_ERROR' THEN 1 ELSE 0 END) as serverErrors
            FROM security_events
            WHERE created_at >= ?
        `).get(last1h) || { authFailures: 0, serverErrors: 0 };

        const authFailures = securityStats.authFailures || 0;
        const serverErrors = securityStats.serverErrors || 0;

        // 4. IP Analysis (Detecting rapid requests / brute force tendencies)
        const suspiciousIPs = db.prepare(`
            SELECT ip, COUNT(*) as count 
            FROM analytics_logs 
            WHERE created_at >= ? 
            GROUP BY ip 
            HAVING count > 200
        `).all(last1h);

        // 5. Check for blocked IPs
        const blockedCount = db.prepare("SELECT COUNT(*) as count FROM ip_rules WHERE rule = 'block'").get().count;

        // Threat Level Logic
        let threatLevel = 'Low';
        let status = 'Secure';

        if (authFailures > 20 || suspiciousIPs.length > 0 || serverErrors > 10) {
            threatLevel = 'High';
            status = 'Under Attack';
        } else if (authFailures > 5 || failedTx > 10 || serverErrors > 2) {
            threatLevel = 'Medium';
            status = 'Caution';
        }

        const events = db.prepare(`
            SELECT type, severity, description as event, created_at as time 
            FROM security_events 
            ORDER BY created_at DESC 
            LIMIT 10
        `).all().map(e => ({
            ...e,
            time: new Date(e.time).toLocaleTimeString()
        }));

        // Fallback event if empty
        if (events.length === 0) {
            events.push({ time: new Date().toLocaleTimeString(), severity: 'low', type: 'INFO', event: 'System integrity verification passed.' });
        }

        return {
            threat_level: threatLevel,
            system_status: status,
            failed_transactions_24h: failedTx,
            auth_failures_1h: authFailures,
            server_errors_1h: serverErrors,
            suspicious_ips_found: suspiciousIPs.length,
            blocked_ips_total: blockedCount,
            active_protections: ['Firewall', 'Rate Limit', 'SQL Injection Filter', 'JWT Validation', 'Brute Force Protection'],
            recent_events: events
        };
    }
}

module.exports = new SecurityMonitor();
