import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const RolesManager = () => {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [view, setView] = useState('matrix'); // matrix, agents, audit
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form state for new role
    const [newRole, setNewRole] = useState({ name: '', description: '', rbac_level: '', permissions: [] });

    const API_URL = import.meta.env.PUBLIC_API_URL || 'https://api.getnexo.com.br';

    const rbacLevels = useMemo(() => ({
        'super_admin': [
            'crud_tickets', 'manage_users', 'configure_whitelabel', 'view_reports', 'manage_templates', 'access_audit', 'configure_smtp',
            'manage_channels', 'configure_ai', 'manage_automation', 'view_analytics', 'manage_tags', 'handle_subtickets', 'manage_cost_timer',
            'access_audit_trail', 'manage_reminders', 'manage_hr_feedback', 'configure_domain', 'manage_attachments', 'transfer_tickets',
            'pause_sla', 'merge_duplicates', 'manage_agent_folders', 'digital_signature'
        ],
        'admin': [
            'crud_tickets', 'manage_users', 'configure_whitelabel', 'view_reports', 'manage_templates', 'access_audit', 'configure_smtp',
            'manage_channels', 'configure_ai', 'manage_automation', 'view_analytics', 'manage_tags', 'handle_subtickets', 'manage_cost_timer',
            'access_audit_trail', 'manage_reminders', 'manage_hr_feedback', 'manage_attachments', 'transfer_tickets', 'pause_sla', 'merge_duplicates',
            'manage_agent_folders', 'digital_signature'
        ],
        'manager': [
            'crud_tickets', 'manage_users', 'view_reports', 'manage_templates', 'view_analytics', 'manage_tags', 'handle_subtickets',
            'manage_cost_timer', 'access_audit_trail', 'manage_reminders', 'manage_hr_feedback', 'manage_attachments', 'transfer_tickets',
            'pause_sla', 'merge_duplicates', 'manage_agent_folders', 'digital_signature'
        ],
        'agent': [
            'crud_tickets', 'manage_templates', 'manage_tags', 'handle_subtickets', 'manage_cost_timer', 'manage_reminders',
            'manage_attachments', 'transfer_tickets', 'pause_sla', 'merge_duplicates', 'manage_agent_folders', 'digital_signature'
        ],
        'editor': [
            'manage_templates', 'manage_tags', 'manage_reminders', 'manage_attachments'
        ],
        'viewer': [
            'view_reports', 'view_analytics'
        ],
        'client_admin': [
            'crud_tickets', 'manage_users', 'configure_whitelabel', 'view_reports', 'manage_templates', 'manage_tags', 'handle_subtickets',
            'manage_cost_timer', 'manage_reminders', 'manage_attachments', 'transfer_tickets', 'pause_sla', 'merge_duplicates',
            'manage_agent_folders', 'digital_signature'
        ],
        'client_user': [
            'crud_tickets', 'manage_templates', 'manage_tags', 'handle_subtickets', 'manage_attachments', 'transfer_tickets'
        ]
    }), []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('omnichat_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const [rolesRes, usersRes, logsRes] = await Promise.all([
                axios.get(`${API_URL}/api/roles`, { headers }),
                axios.get(`${API_URL}/api/users`, { headers }),
                axios.get(`${API_URL}/api/logs`, { headers }).catch(() => ({ data: [] }))
            ]);

            setRoles(rolesRes.data || []);
            setUsers(usersRes.data || []);
            setLogs(logsRes.data || []);
        } catch (error) {
            console.error('Error fetching RBAC data:', error);
            setError('Falha ao sincronizar matriz de permissões.');
        } finally {
            setLoading(false);
        }
    };

    const handleRbacLevelChange = (level) => {
        setNewRole(prev => ({
            ...prev,
            rbac_level: level,
            permissions: level ? rbacLevels[level] || [] : []
        }));
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('omnichat_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            await axios.post(`${API_URL}/api/roles`, newRole, { headers });
            setNewRole({ name: '', description: '', rbac_level: '', permissions: [] });
            fetchData();
        } catch (error) {
            alert('Erro ao criar esfera: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDeleteRole = async (id) => {
        if (!confirm('Eliminar esta esfera de autoridade?')) return;
        try {
            const token = localStorage.getItem('omnichat_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            await axios.delete(`${API_URL}/api/roles/${id}`, { headers });
            fetchData();
        } catch (error) {
            alert('Erro ao eliminar: ' + (error.response?.data?.error || error.message));
        }
    };

    const togglePermission = (perm) => {
        setNewRole(prev => ({
            ...prev,
            permissions: prev.permissions.includes(perm)
                ? prev.permissions.filter(p => p !== perm)
                : [...prev.permissions, perm]
        }));
    };

    const availablePermissions = [
        'crud_tickets', 'manage_users', 'configure_whitelabel', 'view_reports', 'manage_templates', 'access_audit', 'configure_smtp',
        'manage_channels', 'configure_ai', 'manage_automation', 'view_analytics', 'manage_tags', 'handle_subtickets', 'manage_cost_timer',
        'access_audit_trail', 'manage_reminders', 'manage_hr_feedback', 'configure_domain', 'manage_attachments', 'transfer_tickets',
        'pause_sla', 'merge_duplicates', 'manage_agent_folders', 'digital_signature'
    ];

    if (loading && roles.length === 0) {
        return (
            <div className="p-20 text-center space-y-4">
                <div className="inline-block w-12 h-12 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black animate-pulse uppercase tracking-widest text-xs">Mapeando Matriz RBAC...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* View Switcher */}
            <div className="flex gap-4 p-1 bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl w-fit">
                {[
                    { id: 'matrix', label: 'Matriz de Funções', icon: '💎' },
                    { id: 'agents', label: 'Membros Ativos', icon: '👥' },
                    { id: 'audit', label: 'Auditoria Síncrona', icon: '👁️' }
                ].map(v => (
                    <button
                        key={v.id}
                        onClick={() => setView(v.id)}
                        className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${view === v.id
                            ? 'bg-gradient-to-r from-[#00d4ff] to-[#00ff9d] text-black shadow-lg shadow-cyan-500/20'
                            : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        <span>{v.icon}</span> {v.label}
                    </button>
                ))}
            </div>

            {view === 'matrix' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Role Creation Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-panel p-8 border-[#00ff9d]/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff9d]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#00ff9d]/10 transition-all"></div>

                            <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                                <span className="text-[#00ff9d]">✦</span> Nova Esfera
                            </h3>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Registrar Nível de Autoridade</p>

                            <form onSubmit={handleCreateRole} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#00d4ff] uppercase tracking-widest">Nome da Função</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#00d4ff] font-bold"
                                        placeholder="Ex: Supervisor de Vendas"
                                        value={newRole.name}
                                        onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#00d4ff] uppercase tracking-widest">Nível RBAC Base</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#00d4ff] font-bold"
                                        value={newRole.rbac_level}
                                        onChange={e => handleRbacLevelChange(e.target.value)}
                                    >
                                        <option value="">Escolher nível base (opcional)</option>
                                        <option value="super_admin">Super Admin - Acesso Total</option>
                                        <option value="admin">Admin - Maioria das Funcionalidades</option>
                                        <option value="manager">Manager - Gerenciamento de Equipe</option>
                                        <option value="agent">Agent - Suporte</option>
                                        <option value="editor">Editor - Conteúdo</option>
                                        <option value="viewer">Viewer - Somente Leitura</option>
                                        <option value="client_admin">Client Admin - Admin do Cliente</option>
                                        <option value="client_user">Client User - Acesso Limitado</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#00d4ff] uppercase tracking-widest">Descrição Tática</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#00d4ff] h-24 font-medium resize-none"
                                        placeholder="O que este cargo representa..."
                                        value={newRole.description}
                                        onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#00d4ff] uppercase tracking-widest block">
                                        Permissões Habilitadas {newRole.rbac_level && `(Baseado em: ${newRole.rbac_level.replace('_', ' ').toUpperCase()})`}
                                    </label>
                                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                                        {availablePermissions.map(p => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => togglePermission(p)}
                                                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${newRole.permissions.includes(p)
                                                    ? 'bg-[#00d4ff]/10 border-[#00d4ff]/30 text-[#00d4ff]'
                                                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                                                    }`}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest">{p}</span>
                                                {newRole.permissions.includes(p) && <span className="text-xs">✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-[#00ff9d] transition-all shadow-xl">
                                    Sincronizar Função
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Roles Matrix Display */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {roles.map(role => (
                                <div key={role.id} className="glass-panel p-6 border-white/5 hover:border-[#00d4ff]/30 transition-all group relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                            <h4 className="text-[#00d4ff] font-black text-lg group-hover:tracking-wider transition-all uppercase">{role.name}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Esfera ID #{role.id}</p>
                                        </div>
                                        {role.id > 2 && (
                                            <button
                                                onClick={() => handleDeleteRole(role.id)}
                                                className="p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                                                aria-label={`Excluir função ${role.name}`}
                                                title="Excluir função"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-xs font-medium mb-6 leading-relaxed line-clamp-2">{role.description || 'Sem descrição tática definida.'}</p>

                                    <div className="space-y-3">
                                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Módulos Autorizados</div>
                                        <div className="flex flex-wrap gap-2">
                                            {role.permissions?.map(p => (
                                                <span key={p} className="px-3 py-1 bg-white/5 border border-white/5 text-[9px] font-black text-gray-400 rounded-lg uppercase tracking-widest">{p.split('.')[0]}</span>
                                            ))}
                                            {(!role.permissions || role.permissions.length === 0) && <span className="text-[9px] text-gray-700 italic">Nenhum acesso definido</span>}
                                        </div>
                                    </div>

                                    {/* Decoration */}
                                    <div className="absolute bottom-4 right-4 text-white/5 font-black text-4xl pointer-events-none select-none italic">{role.name.charAt(0)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'agents' && (
                <div className="glass-panel overflow-hidden border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                    <th className="p-6">Identidade Digital</th>
                                    <th className="p-6">Credencial</th>
                                    <th className="p-6">Nível de Acesso</th>
                                    <th className="p-6">Ingresso na Rede</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gradient-to-tr from-[#00d4ff] to-[#a78bfa] rounded-xl flex items-center justify-center font-black text-black text-xs shadow-lg uppercase">
                                                    {(u.name || u.email).substring(0, 2)}
                                                </div>
                                                <span className="font-black text-white group-hover:text-[#00d4ff] transition-colors">{u.name || 'Agente Sem Nome'}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-gray-400 font-mono text-xs">{u.email}</td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${u.role_name === 'Admin'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                : 'bg-cyan-500/10 text-[#00d4ff] border-cyan-500/20'
                                                }`}>
                                                {u.role_name || 'Agente Base'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-gray-500 text-xs font-black uppercase tracking-widest">
                                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'audit' && (
                <div className="glass-panel p-10 border-white/5 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                            Monitoramento de Ações
                        </h3>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg">Tempo Real Habilitado</div>
                    </div>

                    <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-white/5">
                        {logs.length === 0 ? (
                            <p className="text-center text-gray-600 font-black uppercase tracking-[0.2em] py-20">Nenhum rastro gravitacional encontrado.</p>
                        ) : (
                            logs.slice(0, 20).map(log => (
                                <div key={log.id} className="relative pl-10 group">
                                    <div className="absolute left-0 top-1 w-6 h-6 bg-black border-2 border-white/10 rounded-full flex items-center justify-center z-10 group-hover:border-[#00d4ff] transition-all">
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-[#00d4ff]"></div>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[#00d4ff] font-black text-xs uppercase tracking-widest">{log.user_name || 'Usuário'}</span>
                                            <span className="px-3 py-1 bg-[#00ff9d]/10 text-[#00ff9d] text-[8px] font-black rounded-full uppercase tracking-widest border border-[#00ff9d]/20">
                                                {log.action || 'ATIVIDADE'}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{new Date(log.created_at).toLocaleString()}</span>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-white/[0.08] transition-all">
                                        <p className="text-gray-400 text-xs font-medium leading-relaxed italic">"{log.details || 'Integridade de dados verificada sem anotações adicionais.'}"</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesManager;
