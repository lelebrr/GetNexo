import React, { useState, useEffect } from 'react';

export default function SubTicketsManagement({ ticketId, subTickets = [], onUpdate }) {
    const [localSubTickets, setLocalSubTickets] = useState(subTickets);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newSubTicket, setNewSubTicket] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'open'
    });

    useEffect(() => {
        setLocalSubTickets(subTickets);
    }, [subTickets]);

    const handleCreateSubTicket = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}/subtickets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newSubTicket,
                    parentTicketId: ticketId
                }),
            });

            if (!response.ok) throw new Error('Erro ao criar sub-ticket');

            const created = await response.json();
            setLocalSubTickets(prev => [...prev, created]);
            setNewSubTicket({ title: '', description: '', priority: 'medium', status: 'open' });
            setShowCreateForm(false);
            onUpdate?.();
        } catch (err) {
            console.error('Erro ao criar sub-ticket:', err);
        }
    };

    const handleUpdateSubTicket = async (subTicketId, updates) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/subtickets/${subTicketId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error('Erro ao atualizar sub-ticket');

            const updated = await response.json();
            setLocalSubTickets(prev => prev.map(st => st.id === subTicketId ? updated : st));
            onUpdate?.();
        } catch (err) {
            console.error('Erro ao atualizar sub-ticket:', err);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            open: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || colors.open;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Sub-tickets</h4>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                    {showCreateForm ? 'Cancelar' : '+ Novo Sub-ticket'}
                </button>
            </div>

            {showCreateForm && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-900 mb-3">Criar Novo Sub-ticket</h5>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Título do sub-ticket"
                            value={newSubTicket.title}
                            onChange={(e) => setNewSubTicket(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            placeholder="Descrição"
                            value={newSubTicket.description}
                            onChange={(e) => setNewSubTicket(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-3">
                            <select
                                value={newSubTicket.priority}
                                onChange={(e) => setNewSubTicket(prev => ({ ...prev, priority: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select>
                            <button
                                onClick={handleCreateSubTicket}
                                disabled={!newSubTicket.title.trim()}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {localSubTickets.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum sub-ticket criado ainda.</p>
            ) : (
                <div className="space-y-2">
                    {localSubTickets.map((subTicket) => (
                        <div key={subTicket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h5 className="font-medium text-gray-900">{subTicket.title}</h5>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subTicket.status)}`}>
                                            {subTicket.status === 'open' ? 'Aberto' :
                                                subTicket.status === 'pending' ? 'Pendente' :
                                                    subTicket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded ${subTicket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                                subTicket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                    subTicket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                            }`}>
                                            {subTicket.priority === 'urgent' ? 'Urgente' :
                                                subTicket.priority === 'high' ? 'Alta' :
                                                    subTicket.priority === 'medium' ? 'Média' : 'Baixa'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{subTicket.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span>Criado: {new Date(subTicket.createdAt).toLocaleDateString('pt-BR')}</span>
                                        {subTicket.assignedAgent && <span>👤 {subTicket.assignedAgent.name}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <select
                                        value={subTicket.status}
                                        onChange={(e) => handleUpdateSubTicket(subTicket.id, { status: e.target.value })}
                                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                                    >
                                        <option value="open">Aberto</option>
                                        <option value="pending">Pendente</option>
                                        <option value="resolved">Resolvido</option>
                                        <option value="closed">Fechado</option>
                                    </select>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}