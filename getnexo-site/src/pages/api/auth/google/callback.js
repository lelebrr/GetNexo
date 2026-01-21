import { exchangeGoogleCode, generateToken } from '../../../../lib/auth.js';

export async function get(req) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/?error=${error}`
            }
        });
    }

    if (!code) {
        return new Response(JSON.stringify({ error: 'No authorization code' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const user = await exchangeGoogleCode(code);

        // Here you would save user to database
        // For now, generate JWT
        const token = generateToken(user);

        // Redirect to frontend with token
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/?token=${token}`,
                'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
            }
        });
    } catch (err) {
        console.error('OAuth error:', err);
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/?error=oauth_failed`
            }
        });
    }
}