// Simple Admin Auth Logic
export async function login(username, password) {
    // In production, use environment variables and a real database
    // For now, using simple check
    if (username === 'admin' && password === 'nexus2026') {
        const token = btoa(username + ':' + Date.now());
        localStorage.setItem('adminToken', token);
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
