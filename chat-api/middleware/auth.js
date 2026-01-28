const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    // Skip auth for options requests (CORS preflight)
    if (req.method === 'OPTIONS') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        if (!JWT_SECRET) {
            console.error('FATAL: JWT_SECRET not defined in middleware');
            return res.status(500).json({ error: 'Erro interno de configuração de segurança.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};
