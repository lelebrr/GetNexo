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

        const user = db.prepare(`
            SELECT u.*, r.name as role_name 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = ?
        `).get(session.user_id);

        if (!user || user.role_name.toLowerCase() !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.userId = session.user_id;
        req.user = user;
        next();
    } catch (e) {
        console.error('[ADMIN AUTH MIDDLEWARE ERROR]:', e);
        res.status(401).json({ error: 'Authentication failed' });
    }
};
