/**
 * Sistema de Permissões Granulares - GetNexo Admin
 * 
 * Define todas as permissões disponíveis no sistema e funções de verificação.
 */

// Definição de todas as permissões do sistema
export const PERMISSIONS = {
    // Usuários
    'users.view': 'Ver lista de usuários',
    'users.create': 'Criar novos usuários',
    'users.edit': 'Editar usuários',
    'users.delete': 'Excluir usuários',

    // Roles
    'roles.view': 'Ver roles',
    'roles.create': 'Criar roles',
    'roles.edit': 'Editar roles',
    'roles.delete': 'Excluir roles',

    // Produtos
    'products.view': 'Ver produtos',
    'products.create': 'Criar produtos',
    'products.edit': 'Editar produtos',
    'products.delete': 'Excluir produtos',

    // Cupons
    'coupons.view': 'Ver cupons',
    'coupons.create': 'Criar cupons',
    'coupons.edit': 'Editar cupons',
    'coupons.delete': 'Excluir cupons',

    // Relatórios
    'reports.view': 'Ver relatórios',
    'reports.export': 'Exportar relatórios',

    // Auditoria
    'audit.view': 'Ver logs de auditoria',
    'audit.export': 'Exportar logs',
    'audit.clear': 'Limpar logs antigos',

    // Segurança
    'security.view': 'Ver painel de segurança',
    'security.manage': 'Gerenciar configurações de segurança',
    'security.block_ip': 'Bloquear IPs',

    // IA
    'ai.view': 'Ver configurações de IA',
    'ai.configure': 'Configurar IAs',

    // Dashboard
    'dashboard.view': 'Ver dashboard',
    'dashboard.analytics': 'Ver analytics avançados',

    // Conversas
    'conversations.view': 'Ver conversas',
    'conversations.manage': 'Gerenciar conversas',

    // Admin Total
    'all': 'Acesso total (Super Admin)'
};

// Agrupamento de permissões por categoria
export const PERMISSION_GROUPS = {
    'Usuários': ['users.view', 'users.create', 'users.edit', 'users.delete'],
    'Roles': ['roles.view', 'roles.create', 'roles.edit', 'roles.delete'],
    'Produtos': ['products.view', 'products.create', 'products.edit', 'products.delete'],
    'Cupons': ['coupons.view', 'coupons.create', 'coupons.edit', 'coupons.delete'],
    'Relatórios': ['reports.view', 'reports.export'],
    'Auditoria': ['audit.view', 'audit.export', 'audit.clear'],
    'Segurança': ['security.view', 'security.manage', 'security.block_ip'],
    'IA': ['ai.view', 'ai.configure'],
    'Dashboard': ['dashboard.view', 'dashboard.analytics'],
    'Conversas': ['conversations.view', 'conversations.manage']
};

// Roles padrão do sistema
export const DEFAULT_ROLES = {
    'Super Admin': {
        description: 'Acesso total ao sistema',
        permissions: ['all']
    },
    'Admin': {
        description: 'Administrador com acesso a maioria das funções',
        permissions: [
            'users.view', 'users.create', 'users.edit',
            'roles.view',
            'products.view', 'products.create', 'products.edit', 'products.delete',
            'coupons.view', 'coupons.create', 'coupons.edit', 'coupons.delete',
            'reports.view', 'reports.export',
            'audit.view',
            'security.view',
            'ai.view', 'ai.configure',
            'dashboard.view', 'dashboard.analytics',
            'conversations.view', 'conversations.manage'
        ]
    },
    'Gerente': {
        description: 'Gerente com acesso a relatórios e produtos',
        permissions: [
            'products.view', 'products.create', 'products.edit',
            'coupons.view', 'coupons.create', 'coupons.edit',
            'reports.view',
            'dashboard.view',
            'conversations.view'
        ]
    },
    'Atendente': {
        description: 'Atendente com acesso básico',
        permissions: [
            'products.view',
            'coupons.view',
            'dashboard.view',
            'conversations.view', 'conversations.manage'
        ]
    },
    'Visualizador': {
        description: 'Apenas visualização',
        permissions: [
            'products.view',
            'coupons.view',
            'reports.view',
            'dashboard.view'
        ]
    }
};

/**
 * Verifica se o usuário tem uma permissão específica
 * @param {string[]} userPermissions - Array de permissões do usuário
 * @param {string} permission - Permissão a verificar
 * @returns {boolean}
 */
export function hasPermission(userPermissions, permission) {
    if (!userPermissions || !Array.isArray(userPermissions)) return false;

    // Super admin tem acesso total
    if (userPermissions.includes('all')) return true;

    return userPermissions.includes(permission);
}

/**
 * Verifica se o usuário tem alguma das permissões
 * @param {string[]} userPermissions - Array de permissões do usuário
 * @param {string[]} permissions - Permissões a verificar
 * @returns {boolean}
 */
export function hasAnyPermission(userPermissions, permissions) {
    return permissions.some(p => hasPermission(userPermissions, p));
}

/**
 * Verifica se o usuário tem todas as permissões
 * @param {string[]} userPermissions - Array de permissões do usuário
 * @param {string[]} permissions - Permissões a verificar
 * @returns {boolean}
 */
export function hasAllPermissions(userPermissions, permissions) {
    return permissions.every(p => hasPermission(userPermissions, p));
}

/**
 * Retorna as permissões do usuário logado
 * @returns {string[]}
 */
export function getCurrentUserPermissions() {
    if (typeof window === 'undefined') return [];

    try {
        const userData = localStorage.getItem('adminUser');
        if (!userData) return [];

        const user = JSON.parse(userData);
        return user.permissions || [];
    } catch {
        return [];
    }
}

/**
 * Verifica se o usuário atual tem uma permissão
 * @param {string} permission 
 * @returns {boolean}
 */
export function can(permission) {
    return hasPermission(getCurrentUserPermissions(), permission);
}
