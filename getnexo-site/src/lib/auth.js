import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

// 🛡️ Sentinel: Removed predictable hardcoded fallback secret
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
// 🛡️ Sentinel: Removed predictable hardcoded encryption key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

// Mock user database (replace with real DB later)
const users = [
    {
        id: 1,
        email: 'admin@getnexo.com.br',
        password: '$2a$10$hashedpassword', // Will hash on init
        role: 'admin',
        name: 'Admin User',
        permissions: ['all'],
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        email: 'lelebrr@gmail.com',
        password: '$2a$10$masteradmin', // Will hash on init
        role: 'superadmin',
        name: 'Leonardo Master Admin',
        permissions: ['all'],
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        email: 'reseller@example.com',
        password: '$2a$10$hashedpassword',
        role: 'reseller',
        name: 'Reseller User',
        permissions: ['products.view', 'products.create', 'products.edit', 'coupons.view', 'coupons.create', 'coupons.edit', 'reports.view', 'dashboard.view', 'conversations.view', 'conversations.manage'],
        createdAt: new Date().toISOString(),
    },
];

// Magic link tokens (in-memory storage for demo)
const magicLinks = new Map();

// Audit logs
let auditLogs = [];

// Hash passwords on startup
const initUsers = async () => {
    for (const user of users) {
        if (!user.password.startsWith('$2a$')) {
            let defaultPassword = 'password123';
            if (user.email === 'lelebrr@gmail.com') {
                defaultPassword = 'master2026';
            }
            user.password = await bcrypt.hash(defaultPassword, 10);
        }
    }
};
initUsers();

// OAuth URLs
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

// Auth functions
export const authenticateUser = async (email, password) => {
    const user = users.find(u => u.email === email);
    if (!user) return null;

    // Se a senha mockada ainda for a string literal (casos raros de sync)
    if (user.password === '$2a$10$hashedpassword') {
        user.password = await bcrypt.hash('password123', 10);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        permissions: user.permissions,
    };
};

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, permissions: user.permissions },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const findUserByEmail = (email) => {
    return users.find(u => u.email === email);
};

export const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
        id: users.length + 1,
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: 'user',
        permissions: ['dashboard.view', 'site.view'],
        company: userData.company,
        whatsapp: userData.whatsapp,
        cpf_cnpj: userData.cpf_cnpj,
        website: userData.website,
        platform: userData.platform,
        segment: userData.segment,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        permissions: newUser.permissions
    };
};

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Data encryption
export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Anonymization for GDPR
export const anonymizeData = (data) => {
    return CryptoJS.SHA256(data).toString();
};

// Audit logging
export const logAudit = (action, userId, details) => {
    auditLogs.push({
        id: auditLogs.length + 1,
        action,
        userId,
        details,
        timestamp: new Date().toISOString(),
    });
};

export const getAuditLogs = () => {
    return auditLogs;
};

// Check permissions
export const hasPermission = (userPermissions, permission) => {
    if (!userPermissions || !Array.isArray(userPermissions)) return false;
    if (userPermissions.includes('all')) return true;
    return userPermissions.includes(permission);
};

// Generate state for CSRF protection
export const generateState = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Google OAuth
export const getGoogleAuthUrl = (state, redirectUri = '/api/auth/google/callback') => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.BASE_URL || 'http://localhost:4321'}${redirectUri}`,
        response_type: 'code',
        scope: 'openid email profile',
        state: state
    });
    return `${GOOGLE_AUTH_URL}?${params}`;
};

export const exchangeGoogleCode = async (code, redirectUri = '/api/auth/google/callback') => {
    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: `${process.env.BASE_URL || 'http://localhost:4321'}${redirectUri}`
        })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || data.error);

    const userResponse = await fetch(GOOGLE_USER_URL, {
        headers: {
            'Authorization': `Bearer ${data.access_token}`
        }
    });

    const user = await userResponse.json();
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.picture,
        provider: 'google'
    };
};

// GitHub OAuth
export const getGitHubAuthUrl = (state, redirectUri = '/api/auth/github/callback') => {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: `${process.env.BASE_URL || 'http://localhost:4321'}${redirectUri}`,
        scope: 'user:email',
        state: state
    });
    return `${GITHUB_AUTH_URL}?${params}`;
};

export const exchangeGitHubCode = async (code, redirectUri = '/api/auth/github/callback') => {
    const response = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code,
            redirect_uri: `${process.env.BASE_URL || 'http://localhost:4321'}${redirectUri}`
        })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || data.error);

    const userResponse = await fetch(GITHUB_USER_URL, {
        headers: {
            'Authorization': `Bearer ${data.access_token}`,
            'User-Agent': 'GetNexo-App'
        }
    });

    const user = await userResponse.json();

    // Get email if not provided
    let email = user.email;
    if (!email) {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `Bearer ${data.access_token}`,
                'User-Agent': 'GetNexo-App'
            }
        });
        const emails = await emailResponse.json();
        email = emails.find(e => e.primary)?.email;
    }

    return {
        id: user.id,
        email: email,
        name: user.name,
        avatar: user.avatar_url,
        provider: 'github'
    };
};

// Passwordless Authentication

// Generate magic link token
export const generateMagicLink = async (email) => {
    const user = findUserByEmail(email);
    if (!user) {
        // For demo, create a new user if doesn't exist
        const newUser = await createUser({
            email,
            password: crypto.randomBytes(16).toString('hex'),
            name: email.split('@')[0]
        });
        // Remove password from created user for passwordless
        delete newUser.password;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    magicLinks.set(token, {
        email,
        expiresAt,
        used: false
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:4321';
    const magicLink = `${baseUrl}/api/auth/magic-link?token=${token}`;

    // Simulate sending email (in real app, use email service)
    console.log(`Magic Link enviado para ${email}: ${magicLink}`);

    return { success: true, message: 'Link mágico enviado' };
};

// Verify magic link token
export const verifyMagicLink = (token) => {
    const linkData = magicLinks.get(token);
    if (!linkData) return null;

    if (linkData.used || linkData.expiresAt < new Date()) {
        magicLinks.delete(token);
        return null;
    }

    linkData.used = true;
    const user = findUserByEmail(linkData.email);
    return user;
};

// Generate WhatsApp link
export const sendWhatsAppMagicLink = async (phone) => {
    // Mock user creation for phone
    const user = users.find(u => u.phone === phone);
    if (!user) {
        const newUser = {
            id: users.length + 1,
            phone,
            email: `${phone}@whatsapp.getnexo.com`, // temporary email
            role: 'customer',
            name: `Cliente ${phone}`,
            permissions: ['customer.view'],
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    magicLinks.set(token, {
        phone,
        expiresAt,
        used: false
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:4321';
    const magicLink = `${baseUrl}/api/auth/whatsapp-link?token=${token}`;

    // Simulate WhatsApp message
    console.log(`WhatsApp Link enviado para ${phone}: ${magicLink}`);

    return { success: true, message: 'Link WhatsApp enviado' };
};

// Generate QR Code data
export const generateQRCode = async (email) => {
    const user = findUserByEmail(email);
    if (!user) {
        await createUser({
            email,
            password: crypto.randomBytes(16).toString('hex'),
            name: email.split('@')[0]
        });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    magicLinks.set(token, {
        email,
        expiresAt,
        used: false
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:4321';
    const qrData = `${baseUrl}/api/auth/qr-link?token=${token}`;

    return qrData;
};

// Generate password reset link
export const generatePasswordResetLink = async (email) => {
    const user = findUserByEmail(email);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    magicLinks.set(token, {
        email,
        expiresAt,
        used: false,
        type: 'password-reset'
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:4321';
    const resetLink = `${baseUrl}/api/auth/reset-password?token=${token}`;

    // Simulate sending email (in real app, use email service)
    console.log(`Link de reset de senha enviado para ${email}: ${resetLink}`);

    return { success: true, message: 'Link de reset enviado para o email' };
};

// Reset password using token
export const resetPassword = async (token, newPassword) => {
    const linkData = magicLinks.get(token);
    if (!linkData || linkData.type !== 'password-reset') return null;

    if (linkData.used || linkData.expiresAt < new Date()) {
        magicLinks.delete(token);
        return null;
    }

    const user = findUserByEmail(linkData.email);
    if (!user) return null;

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    linkData.used = true;

    return { success: true, message: 'Senha alterada com sucesso' };
};