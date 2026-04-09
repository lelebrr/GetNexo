import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const TeamManager = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({ email: '', password: '', role_id: 1 });

    const API_URL = import.meta.env.PUBLIC_API_URL || 'https://api.getnexo.com.br';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('omnichat_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const [usersRes, rolesRes] = await Promise.all([
                axios.get(`${API_URL}/api/users`, { headers }),
                axios.get(`${API_URL}/api/roles`, { headers })
            ]);
            setUsers(usersRes.data || []);
            setRoles(rolesRes.data || []);
        } catch (error) {
            console.error('Error fetching team data:', error);
            // Non-blocking error notification could go here
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.role_name && user.role_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: users.length,
            admins: users.filter(u => u.role_name === 'Admin').length,
            agents: users.filter(u => u.role_name !== 'Admin').length
        };
    }, [users]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('omnichat_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            if (editingUser) {
                await axios.put(`${API_URL}/api/users/${editingUser.id}`, formData, { headers });
            } else {
                await axios.post(`${API_URL}/api/users`, formData, { headers });
            }
            setModalOpen(false);
            setEditingUser(null);
            setFormData({ email: '', password: '', role_id: 1 });
            fetchData();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Erro ao salvar: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja remover este usuário?')) return;
        try {
            const token = localStorage.getItem('omnichat_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            await axios.delete(`${API_URL}/api/users/${id}`, { headers });
            fetchData();
        } catch (error) {
            alert('Erro ao remover: ' + (error.response?.data?.error || error.message));
        }
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setFormData({ email: user.email, password: '', role_id: user.role_id });
        setModalOpen(true);
    };

    const openNew = () => {
        setEditingUser(null);
        setFormData({ email: '', password: '', role_id: 1 });
        setModalOpen(true);
    };

    const getAvatarColor = (email) => {
        const colors = ['#00d4ff', '#00ff9d', '#a78bfa', '#f472b6', '#fbbf24'];
        const index = email.length % colors.length;
        return colors[index];
    };

    return (
        <div className="text-white space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total de Membros', value: stats.total, color: '#00d4ff' },
                    { label: 'Administradores', value: stats.admins, color: '#a78bfa' },
                    { label: 'Agentes Ativos', value: stats.agents, color: '#00ff9d' }
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-4 flex flex-col items-center justify-center border-l-4" style={{ borderColor: stat.color }}>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                        <span className="text-2xl font-black mt-1" style={{ color: stat.color }}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:max-w-md">
                    <input
                        type="text"
                        placeholder="Buscar por email ou cargo..."
                        className="w-full bg-black/40 border border-gray-800 rounded-xl py-3 px-12 focus:border-[#00d4ff] outline-none transition-all placeholder:text-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                </div>
                <button
                    onClick={openNew}
                    className="w-full md:w-auto bg-gradient-to-r from-[#00d4ff] to-[#00ff9d] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] text-black font-black py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                >
                    <span className="text-xl">+</span> Novo Integrante
                </button>
            </div>

            {/* Table Area */}
            <div className="glass-panel overflow-hidden border border-gray-800/50 shadow-2xl">
                {loading ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="inline-block w-8 h-8 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-medium animate-pulse">Sincronizando dados da equipe...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs uppercase font-black border-b border-white/5">
                                    <th className="p-5">Membro</th>
                                    <th className="p-5">Permissão</th>
                                    <th className="p-5">Acessos</th>
                                    <th className="p-5 text-right">Controles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-black text-sm shadow-inner"
                                                    style={{ background: `linear-gradient(135deg, ${getAvatarColor(user.email)}, white)` }}
                                                >
                                                    {user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-[#00d4ff] transition-colors">{user.email}</div>
                                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ID #{user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${user.role_name === 'Admin'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                                : 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30'
                                                }`}>
                                                {user.role_name || 'Agente'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-xs font-bold text-gray-300">Dashboard Full</div>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-500/40"></div>)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="p-2 hover:bg-[#00d4ff]/20 rounded-lg text-gray-400 hover:text-[#00d4ff] transition-all"
                                                    title="Editar"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                {user.id !== 1 && (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                                                        title="Excluir"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="p-20 text-center">
                                <span className="text-4xl block mb-4">🛸</span>
                                <p className="text-gray-500 font-bold">Nenhum integrante encontrado para "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* PREMIUM MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setModalOpen(false)}></div>
                    <div className="glass-panel w-full max-w-xl p-10 relative bg-[#0a0e17] border-[#00d4ff]/20 shadow-[0_0_100px_rgba(0,212,255,0.1)]">
                        <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white text-2xl focus-visible:ring-2 focus-visible:outline-none rounded" aria-label="Fechar">✕</button>

                        <div className="mb-10">
                            <h3 className="text-3xl font-black text-white">{editingUser ? 'Ajustar Credenciais' : 'Nova Identidade Digital'}</h3>
                            <p className="text-gray-500 font-medium mt-2">Configure o acesso seguro do novo integrante da rede Nexo.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#00d4ff]">Endereço de Acesso (Email)</label>
                                <input
                                    type="email" required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-all font-medium"
                                    value={formData.email}
                                    placeholder="agente@getnexo.com.br"
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#00d4ff]">Nível de Autoridade</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00d4ff] outline-none transition-all font-medium appearance-none"
                                        value={formData.role_id}
                                        onChange={e => setFormData({ ...formData, role_id: Number(e.target.value) })}
                                    >
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id} className="bg-[#0a0e17]">{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#00d4ff]">
                                        {editingUser ? 'Atualizar Chave' : 'Definir Senha'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00d4ff] outline-none transition-all font-medium"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={editingUser ? "Manter atual" : "••••••••"}
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00ff9d] text-black font-black py-5 rounded-xl text-lg hover:scale-[1.02] transition-transform shadow-xl">
                                    {editingUser ? 'AUTORIZAR ALTERAÇÕES' : 'CONCLUIR INTEGRAÇÃO'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManager;
