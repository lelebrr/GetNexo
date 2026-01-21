import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use env var
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'encryption-key-123'; // For data encryption

// Mock user database (replace with real DB later)
const users: any[] = [
    {
        id: 1,
        email: 'admin@getnexo.com.br',
        password: '$2a$10$hashedpassword', // Will hash on init
        role: 'admin',
        name: 'Admin User',
        permissions: ['all'], // From permissions.js DEFAULT_ROLES
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        email: 'reseller@example.com',
        password: '$2a$10$hashedpassword',
        role: 'reseller',
        name: 'Reseller User',
        permissions: ['products.view', 'products.create', 'products.edit', 'coupons.view', 'coupons.create', 'coupons.edit', 'reports.view', 'dashboard.view', 'conversations.view', 'conversations.manage'],
        createdAt: new Date().toISOString(),
    },
];

// Audit logs
let auditLogs: any[] = [];

// Hash passwords on startup
const initUsers = async () => {
    for (const user of users) {
        if (!user.password.startsWith('$2a$')) {
            user.password = await bcrypt.hash('password123', 10); // Default password, change in prod
        }
    }
};
initUsers();

export const authenticateUser = async (email: string, password: string) => {
    const user = users.find(u => u.email === email);
    if (!user) return null;

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

export const generateToken = (user: any) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, permissions: user.permissions },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
};

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

// Data encryption
export const encryptData = (data: string) => {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Anonymization for GDPR
export const anonymizeData = (data: string) => {
    // Basic anonymization: hash sensitive data
    return CryptoJS.SHA256(data).toString();
};

// Audit logging
export const logAudit = (action: string, userId: number, details: any) => {
    auditLogs.push({
        id: auditLogs.length + 1,
        action,
        userId,
        details,
        timestamp: new Date().toISOString(),
    });
};

// Get audit logs
export const getAuditLogs = () => {
    return auditLogs;
};

// Check permissions
export const hasPermission = (userPermissions: string[], permission: string) => {
    if (!userPermissions || !Array.isArray(userPermissions)) return false;
    if (userPermissions.includes('all')) return true;
    return userPermissions.includes(permission);
};