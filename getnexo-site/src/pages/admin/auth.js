// Simple Admin Auth Logic
export async function login(username, password) {
    // In production, use environment variables and a real database
    // For now, using simple check
    const validUsers = [
        { email: 'admin@getnexo.com.br', password: 'password123' },
        { email: 'admin@getnexo.local', password: 'password123' },
        { email: 'lelebrr@gmail.com', password: 'master2026' }
    ];

    const user = validUsers.find(u =>
        u.email === username.trim() &&
        u.password === password.trim()
    );

    if (user) {
        const token = btoa(username + ':' + Date.now());
        localStorage.setItem('adminToken', token);
        // Set cookie for server-side middleware protection
        document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Strict`;
        return { success: true, token };
    }
    return { success: false, error: 'Credenciais inválidas' };
}

export function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
}

export function isAuthenticated() {
    return !!localStorage.getItem('adminToken');
}
