const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Extract token (remove "Bearer " if present)
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Token malformado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find user in DB
        const user = db.prepare('SELECT id, email, name, role, role_id, reseller_id FROM users WHERE id = ?').get(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Attach user to request
        req.user = user;
        req.userId = user.id;

        next();
    } catch (err) {
        console.error('JWT Auth Error:', err.message);
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};
