require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./db'); // Import DB for user queries

const app = express();
const PORT = process.env.PORT || 3006;
const JWT_SECRET = process.env.JWT_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4321'; // Default to frontend dev port

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (CORS_ORIGIN.split(',').includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts, please try again later.' }
});

// Apply global limiter to all routes
app.use(globalLimiter);

// Middleware
app.use(express.json());

const authMiddleware = require('./middleware/auth');

// Importar Rotas
const crmRoutes = require('./routes/crm');
const loyaltyRoutes = require('./routes/loyalty');
const magicRoutes = require('./routes/magic-replies');
const webhookRoutes = require('./routes/webhooks');
const seriesRoutes = require('./routes/series');
const ticketRoutes = require('./routes/tickets');
const productRoutes = require('./routes/products');
const analyticsRoutes = require('./routes/analytics');
const couponRoutes = require('./routes/coupons');
const automationRoutes = require('./routes/automations');
const settingsRoutes = require('./routes/settings');
const aiRoutes = require('./routes/ai');
const revendaRoutes = require('./routes/revenda');
const dockerRoutes = require('./routes/docker');
const paymentRoutes = require('./routes/paymentRoutes');
const a2aRoutes = require('./routes/a2a');
const ap2Routes = require('./routes/ap2');

// Montar Rotas
// Rotas Protegidas (Requerem Autenticação)
app.use('/api/crm', authMiddleware, crmRoutes);
app.use('/api/loyalty', authMiddleware, loyaltyRoutes);
app.use('/api/magic', authMiddleware, magicRoutes);
app.use('/api/series', authMiddleware, seriesRoutes);
app.use('/api/tickets', authMiddleware, ticketRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/coupons', authMiddleware, couponRoutes);
app.use('/api/automations', authMiddleware, automationRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/revenda', authMiddleware, revendaRoutes);
app.use('/api/docker', authMiddleware, dockerRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);

// Rotas Parcialmente Públicas ou com Auth Própria
app.use('/api/webhooks', webhookRoutes); // Auth via assinatura/token do provedor
app.use('/api/products', productRoutes); // TODO: Proteger operações de escrita (POST/PUT/DELETE)
app.use('/api/a2a', a2aRoutes); // Verificar necessidade de auth específica
app.use('/api/ap2', ap2Routes); // Verificar necessidade de auth específica

// Endpoint de login (Updated to use DB instead of mock array)
app.post('/api/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Encontrar usuário no DB
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                role_id: user.role_id,
                reseller_id: user.reseller_id
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retornar dados do usuário (sem senha)
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            role_id: user.role_id,
            reseller_id: user.reseller_id
        };

        return res.json({
            token,
            user: userData,
            message: 'Login realizado com sucesso'
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Endpoint para verificar usuário (validar token)
app.get('/api/users', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);

        // Encontrar usuário no DB
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Retornar dados do usuário (sem senha)
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            role_id: user.role_id,
            reseller_id: user.reseller_id
        };

        return res.json(userData);

    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
});

// Endpoint de redefinição de senha (simulado)
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }

        // Verificar se usuário existe
        const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

        if (!user) {
            // Não revelar se o usuário existe ou não (segurança)
            return res.json({
                message: 'Se o email estiver cadastrado, você receberá um link de redefinição'
            });
        }

        // Em produção, aqui você enviaria um email com o link de redefinição
        // Por enquanto, apenas retornamos sucesso
        return res.json({
            message: 'Link de redefinição enviado! Verifique seu email.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ error: 'Erro ao processar solicitação' });
    }
});

// Endpoint para criar conta (simulado)
app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se usuário já existe
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Criar novo usuário
        const hashedPassword = await bcrypt.hash(password, 10);
        const info = db.prepare('INSERT INTO users (email, password, name, role, role_id) VALUES (?, ?, ?, ?, ?)')
            .run(email, hashedPassword, name, 'client', 3);

        const userId = info.lastInsertRowid;

        // Gerar token
        const token = jwt.sign(
            {
                id: userId,
                email,
                name,
                role: 'client',
                role_id: 3
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retornar dados do usuário (sem senha)
        const userData = {
            id: userId,
            email,
            name,
            role: 'client',
            role_id: 3
        };

        return res.status(201).json({
            token,
            user: userData,
            message: 'Conta criada com sucesso'
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ error: 'Erro ao criar conta' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API está funcionando' });
});

// Iniciar servidor apenas se não estiver em teste
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor de autenticação rodando na porta ${PORT}`);
        console.log(`📝 Endpoints disponíveis:`);
        console.log(`   POST /api/login - Login de usuário`);
        console.log(`   GET  /api/users - Verificar usuário logado`);
        console.log(`   POST /api/auth/forgot-password - Redefinir senha`);
        console.log(`   POST /api/auth/register - Criar conta`);
        console.log(`   GET  /api/health - Health check`);
        console.log(`   GET  /api/ai/seo/stats - AI SEO Stats`);
        console.log(`   GET  /api/ai/security/audit - AI Security Audit`);
        console.log(`\n🔑 Credenciais de demonstração:`);
        console.log(`   Cliente: cliente@getnexo.com / demo123`);
    });
}

module.exports = app;
