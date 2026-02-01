const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_2026';

/**
 * Optional JWT Auth Middleware
 * Attaches user to request if valid token provided, but doesn't block request if no token.
 * Use for routes that can work with or without authentication.
 */
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // If no auth header, proceed without user context
    if (!authHeader) {
        req.user = null;
        req.userId = null;
        return next();
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        req.user = null;
        req.userId = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find user in DB
        const user = db.prepare('SELECT id, email, name, role, role_id, reseller_id FROM users WHERE id = ?').get(decoded.id);

        if (!user) {
            req.user = null;
            req.userId = null;
            return next();
        }

        // Attach user to request
        req.user = user;
        req.userId = user.id;
        next();
    } catch (err) {
        // Token invalid, proceed without user context
        req.user = null;
        req.userId = null;
        next();
    }
};
