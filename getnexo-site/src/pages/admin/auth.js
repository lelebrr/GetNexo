// Simple Admin Auth Logic
export async function login(username, password) {
    // In production, use environment variables and a real database
    // For now, using simple check
    // Fetch from environment or fallback safely (No hardcoded credentials)
    const adminEmail = import.meta.env?.VITE_ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || 'admin@getnexo.local';
    const adminPass = import.meta.env?.VITE_ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;

    if (!adminPass) {
        console.error('FATAL: VITE_ADMIN_PASSWORD is not set.');
        return { success: false, error: 'Erro interno de configuração de segurança.' };
    }

    const isValidUser = (username.trim() === adminEmail || username.trim() === 'lelebrr@gmail.com') && password.trim() === adminPass;
    const user = isValidUser ? { email: username.trim() } : null;

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
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = '/admin/login';
}

export function isAuthenticated() {
    return !!localStorage.getItem('adminToken');
}
