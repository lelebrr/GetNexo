require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3006;
const JWT_SECRET = process.env.JWT_SECRET;

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
    if (process.env.CORS_ORIGIN?.split(',').includes(origin)) {
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

// Middleware de Autenticação (global para /api/, exceto públicas)
const authMiddleware = (req, res, next) => {
  const publicRoutes = [
    '/api/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/health'
  ];

  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

app.use(authMiddleware);

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
const paymentRoutes = require('./routes/paymentRoutes');
const supportRoutes = require('./routes/support');
const aiRoutes = require('./routes/ai');
const revendaRoutes = require('./routes/revenda');
const a2aRoutes = require('./routes/a2a');
const ap2Routes = require('./routes/ap2');

// Montar Rotas
app.use('/api/crm', crmRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/magic', magicRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/revenda', revendaRoutes);
app.use('/api/a2a', a2aRoutes);
app.use('/api/ap2', ap2Routes);

// Endpoint de login
app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

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
    const user = db.prepare('SELECT id, email, name, role, role_id, reseller_id FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
});

// Endpoint de redefinição de senha
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.json({ message: 'Se o email estiver cadastrado, você receberá um link de redefinição' });
    }

    return res.json({ message: 'Link de redefinição enviado! Verifique seu email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
});

// Endpoint para criar conta
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insert = db.prepare('INSERT INTO users (email, password, name, role, role_id) VALUES (?, ?, ?, ?, ?)');
    const info = insert.run(email, hashedPassword, name, 'client', 3);
    const newUserId = info.lastInsertRowid;

    const token = jwt.sign(
      {
        id: newUserId,
        email,
        name,
        role: 'client',
        role_id: 3
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userData = {
      id: newUserId,
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

// Mock Tickets Data (mantido do main branch)
const tickets = [
  {
    id: 1,
    customer_name: 'João Silva',
    customer_phone: '5511999999999',
    last_message: 'Olá, gostaria de saber mais sobre os planos.',
    status: 'open',
    channel: 'whatsapp',
    priority: 1,
    sentiment: 'neutral',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    assigned_agent_name: 'Maria Atendente'
  },
  {
    id: 2,
    customer_name: 'Tech Solutions Ltda',
    customer_phone: '5511988888888',
    last_message: 'Estou com problemas na integração da API.',
    status: 'priority',
    channel: 'telegram',
    priority: 2,
    sentiment: 'negative',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    assigned_agent_name: 'Carlos Suporte'
  },
  {
    id: 3,
    customer_name: 'Ana Pereira',
    customer_phone: '5521977777777',
    last_message: 'Obrigada pelo atendimento!',
    status: 'closed',
    channel: 'instagram',
    priority: 0,
    sentiment: 'positive',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    assigned_agent_name: 'Maria Atendente'
  },
  {
    id: 4,
    customer_name: 'Marcos Oliveira',
    customer_phone: '5531966666666',
    last_message: 'Aguardando retorno sobre o orçamento.',
    status: 'waiting',
    channel: 'whatsapp',
    priority: 1,
    sentiment: 'neutral',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    assigned_agent_name: null
  }
];

// Iniciar servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor de autenticação rodando na porta ${PORT}`);
    console.log(`📝 Endpoints disponíveis:`);
    console.log(` POST /api/login - Login de usuário`);
    console.log(` GET /api/users - Verificar usuário logado`);
    console.log(` POST /api/auth/forgot-password - Redefinir senha`);
    console.log(` POST /api/auth/register - Criar conta`);
    console.log(` GET /api/health - Health check`);
    console.log(` GET /api/ai/seo/stats - AI SEO Stats`);
    console.log(` GET /api/ai/security/audit - AI Security Audit`);
    console.log(`\n🔑 Credenciais de demonstração:`);
    console.log(` Cliente: cliente@getnexo.com / demo123`);
  });
}

module.exports = app;