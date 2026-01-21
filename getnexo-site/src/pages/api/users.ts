import type { APIRoute } from 'astro';
import { verifyToken } from '../../lib/auth';

// Mock data - replace with real database
const users = [
    { id: 1, email: 'admin@getnexo.com', name: 'Admin', role: 'admin', permissions: ['read', 'write'] },
    { id: 2, email: 'user@getnexo.com', name: 'User', role: 'user', permissions: ['read'] },
];

export const GET: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Token não fornecido' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
        return new Response(JSON.stringify({ error: 'Token inválido' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Only admins can list all users
    if (decoded.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Acesso negado' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(users), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};

export const POST: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Token não fornecido' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Acesso negado' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { email, name, role } = await request.json();
    if (!email || !name) {
        return new Response(JSON.stringify({ error: 'Email e nome são obrigatórios' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const newUser = {
        id: users.length + 1,
        email,
        name,
        role: role || 'user',
        permissions: role === 'admin' ? ['read', 'write'] : ['read']
    };
    users.push(newUser);

    return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
};