import { getGitHubAuthUrl, generateState } from '../../../lib/auth.js';

export async function get(req) {
    const url = new URL(req.url);
    const redirect = url.searchParams.get('redirect') || '/';

    const state = generateState();
    const authUrl = getGitHubAuthUrl(state);

    return new Response(null, {
        status: 302,
        headers: {
            Location: authUrl,
            'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`,
        }
    });
}

export async function post(req) {
    const { redirect } = await req.json();
    const state = generateState();
    const authUrl = getGitHubAuthUrl(state);

    return new Response(JSON.stringify({ authUrl }), {
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`,
        }
    });
}