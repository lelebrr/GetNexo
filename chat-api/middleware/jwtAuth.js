const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_2026';

// --- BOLT: PERFORMANCE OPTIMIZATION ---
// Cache user lookups to avoid DB query on every request.
// Use a simple Map with TTL (Time To Live).
const userCache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Cleanup cache periodically (every 5 minutes)
// This prevents memory leaks if many unique users visit over time.
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of userCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            userCache.delete(key);
        }
    }
}, 5 * 60 * 1000).unref(); // unref so it doesn't keep process alive
// --------------------------------------

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

        // --- BOLT: OPTIMIZED LOOKUP ---
        const now = Date.now();
        let user;

        // 1. Check Cache
        if (userCache.has(decoded.id)) {
            const cached = userCache.get(decoded.id);
            // Verify TTL
            if (now - cached.timestamp < CACHE_TTL) {
                // Clone the user object to prevent request-specific mutations from affecting the cache
                user = { ...cached.user };
            } else {
                // Remove expired
                userCache.delete(decoded.id);
            }
        }

        // 2. Fallback to Database
        if (!user) {
            user = db.prepare('SELECT id, email, name, role, role_id, reseller_id FROM users WHERE id = ?').get(decoded.id);

            // 3. Update Cache
            if (user) {
                // Store a clean copy in the cache
                userCache.set(decoded.id, { user: { ...user }, timestamp: now });
            }
        }
        // -----------------------------

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
