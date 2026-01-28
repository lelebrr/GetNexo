require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3006;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

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
app.use('/api/ai', aiRoutes);
app.use('/api/revenda', revendaRoutes);

// Database simulada (em produção, usar banco de dados real)
const users = [
    {
        id: 1,
        email: 'admin@getnexo.com.br',
        password: bcrypt.hashSync('admin123', 10),
        name: 'Administrador',
        role: 'superadmin',
        role_id: 1
    },
    {
        id: 2,
        email: 'revendedor@getnexo.com',
        password: bcrypt.hashSync('demo123', 10),
        name: 'Revendedor',
        role: 'reseller',
        role_id: 2
    },
    {
        id: 3,
        email: 'cliente@getnexo.com',
        password: bcrypt.hashSync('demo123', 10),
        name: 'Cliente',
        role: 'client',
        role_id: 3
    },
    {
        id: 4,
        email: 'lelebrr@gmail.com',
        password: bcrypt.hashSync('master2026', 10),
        name: 'Lele',
        role: 'superadmin',
        role_id: 1
    }
];

// Endpoint de login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Encontrar usuário
        const user = users.find(u => u.email === email);

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
                role_id: user.role_id
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
            role_id: user.role_id
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

        // Encontrar usuário
        const user = users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Retornar dados do usuário (sem senha)
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            role_id: user.role_id
        };

        return res.json(userData);

    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
});

// Endpoint de redefinição de senha (simulado)
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }

        // Verificar se usuário existe
        const user = users.find(u => u.email === email);

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
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se usuário já existe
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Criar novo usuário
        const newUser = {
            id: users.length + 1,
            email,
            password: await bcrypt.hash(password, 10),
            name,
            role: 'client',
            role_id: 3
        };

        users.push(newUser);

        // Gerar token
        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                role_id: newUser.role_id
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retornar dados do usuário (sem senha)
        const userData = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            role_id: newUser.role_id
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

// Iniciar servidor
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

// Mock Tickets Data
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
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
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
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
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
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
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
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        assigned_agent_name: null
    }
];

// O endpoint /api/tickets agora é tratado por ticketRoutes montado acima
