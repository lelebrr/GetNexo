import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// OAuth URLs
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

// JWT functions
export const generateToken = (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
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