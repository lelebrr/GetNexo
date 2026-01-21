const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../omninchat.db');
const db = new Database(DB_PATH);

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token missing' });

    try {
        const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
        if (!session) return res.status(401).json({ error: 'Invalid token' });

        // Verificar expiração (24 horas)
        if (Date.now() - session.created_at > 24 * 60 * 60 * 1000) {
            db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
            return res.status(401).json({ error: 'Session expired' });
        }

        req.userId = session.user_id;
        next();
    } catch (e) {
        console.error('[AUTH MIDDLEWARE ERROR]:', e);
        res.status(401).json({ error: 'Authentication failed' });
    }
};
