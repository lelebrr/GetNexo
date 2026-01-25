import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Input,
    Table,
    Badge,
    Tag,
    Loading,
    Alert,
    useToast
} from '../../design-system';

// Mock data for initial implementation
const MOCK_USERS = [
    { id: 1, name: 'Leandro Brrr', email: 'lele@getnexo.com.br', role: 'admin', status: 'active', lastLogin: '2026-01-25 07:55', plan: 'Enterprise' },
    { id: 2, name: 'Ana Silva', email: 'ana@cliente.com', role: 'user', status: 'active', lastLogin: '2026-01-24 18:20', plan: 'Pro' },
    { id: 3, name: 'Marcos Oliveira', email: 'marcos@teste.com', role: 'user', status: 'inactive', lastLogin: '2026-01-10 12:00', plan: 'Basic' },
    { id: 4, name: 'Sentinel AI', email: 'sentinel@internal.nexus', role: 'system', status: 'active', lastLogin: 'Ininterrupto', plan: 'Core' },
    { id: 5, name: 'Julia Santos', email: 'julia@getnexo.com.br', role: 'admin', status: 'active', lastLogin: '2026-01-25 08:01', plan: 'Enterprise' },
];

const UserManagement = () => {
    const [users, setUsers] = useState(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    // Logic for filtering
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleAction = (action, userName) => {
        addToast(`${action}: ${userName} processado com sucesso!`, { type: 'success' });
    };

    return (
        <div className="user-management-module animate-fadeIn">
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Registry de Operadores</h2>
                    <p className="text-gray-400 text-sm">Gerenciamento centralizado de identidades e permissões Nexus.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="small" onClick={() => addToast('Gerando relatório...', { type: 'info' })}>
                        Exportar CSV
                    </Button>
                    <Button variant="primary" size="small" onClick={() => addToast('Abrindo modal de novo usuário...', { type: 'info' })}>
                        + Novo Usuário
                    </Button>
                </div>
            </header>

            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                    <div className="md:col-span-2">
                        <Input
                            placeholder="Buscar por nome ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                        />
                    </div>
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full h-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-4 text-gray-300 focus:border-[#00f7ff] transition-colors"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </div>
                </div>
            </Card>

            <Card variant="outlined" className="overflow-hidden">
                <Table>
                    <thead>
                        <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                            <th className="p-4 text-xs font-bold text-[#ffc400] uppercase tracking-widest text-left">Usuário</th>
                            <th className="p-4 text-xs font-bold text-[#ffc400] uppercase tracking-widest text-left">Cargo</th>
                            <th className="p-4 text-xs font-bold text-[#ffc400] uppercase tracking-widest text-left">Plano</th>
                            <th className="p-4 text-xs font-bold text-[#ffc400] uppercase tracking-widest text-left">Último Acesso</th>
                            <th className="p-4 text-xs font-bold text-[#ffc400] uppercase tracking-widest text-left">Status</th>
                            <th className="p-4 text-xs font-bold text-[#ffc400] uppercase tracking-widest text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-[#1a1a1a] hover:bg-[#0a0a0a] transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <Tag variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                                            {user.role.toUpperCase()}
                                        </Tag>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-semibold text-gray-300">{user.plan}</span>
                                    </td>
                                    <td className="p-4 text-xs text-gray-400">
                                        {user.lastLogin}
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                                            {user.status === 'active' ? 'Ativo' : 'Offline'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleAction('Edição', user.name)}
                                                className="p-1 hover:text-[#00f7ff] transition-colors text-gray-600"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleAction('Logs do Usuário', user.name)}
                                                className="p-1 hover:text-[#ffc400] transition-colors text-gray-600"
                                                title="Logs"
                                            >
                                                📜
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-20 text-center text-gray-600 italic">
                                    Nenhum usuário encontrado nos registros Nexus.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <footer className="mt-4 text-[10px] text-gray-700 font-mono tracking-tighter text-right uppercase">
                &gt; Nexus Identity Protocol v2.1.0 // Cluster-Sync: OK
            </footer>
        </div>
    );
};

export default UserManagement;
