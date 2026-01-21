import { generateWebAuthnAuthenticationOptions, verifyWebAuthnAuthentication } from '../../../lib/webauthn.js';
import { verifyToken, generateToken } from '../../../lib/auth.js';

export async function get(req) {
    // Get user from JWT token
    const cookies = req.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/auth_token=([^;]+)/);

    if (!tokenMatch) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const token = tokenMatch[1];
    const user = verifyToken(token);

    if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const options = await generateWebAuthnAuthenticationOptions(user.id);
        return new Response(JSON.stringify(options), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function post(req) {
    // Get user from JWT token
    const cookies = req.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/auth_token=([^;]+)/);

    if (!tokenMatch) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const token = tokenMatch[1];
    const user = verifyToken(token);

    if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const credential = await req.json();
        const result = await verifyWebAuthnAuthentication(user.id, credential);

        if (result.success) {
            // Generate new token or refresh
            const newToken = generateToken(user);
            return new Response(JSON.stringify({ success: true }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `auth_token=${newToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
                }
            });
        } else {
            return new Response(JSON.stringify({ error: result.error }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}