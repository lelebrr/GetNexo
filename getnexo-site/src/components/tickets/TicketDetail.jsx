import React, { useState, useEffect } from 'react';
import { useTickets } from '../../hooks/useTickets';

export default function TicketDetail({ ticketId }) {
    const { updateTicket, addTag, removeTag, transferTicket, pauseSLA } = useTickets();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [comment, setComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchTicketDetail();
    }, [ticketId]);

    const fetchTicketDetail = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Erro ao carregar ticket');

            const data = await response.json();
            setTicket(data);
            setEditForm(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTicket = async () => {
        try {
            const updated = await updateTicket(ticketId, editForm);
            setTicket(updated);
            setIsEditing(false);
        } catch (err) {
            console.error('Erro ao atualizar ticket:', err);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment }),
            });

            if (!response.ok) throw new Error('Erro ao adicionar comentário');

            setComment('');
            fetchTicketDetail(); // Recarregar para mostrar novo comentário
        } catch (err) {
            console.error('Erro ao adicionar comentário:', err);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            open: 'bg-red-100 text-red-800 border-red-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            resolved: 'bg-green-100 text-green-800 border-green-200',
            closed: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[status] || colors.open;
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            urgent: 'bg-red-100 text-red-800',
        };
        return colors[priority] || colors.medium;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Carregando ticket...</span>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <div className="text-red-600 text-2xl">⚠️</div>
                    <div className="ml-3">
                        <h3 className="text-lg font-semibold text-red-800">Erro ao carregar ticket</h3>
                        <p className="text-red-600">{error || 'Ticket não encontrado'}</p>
                    </div>
                </div>
                <button
                    onClick={fetchTicketDetail}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'details', label: 'Detalhes', icon: '📋' },
        { id: 'comments', label: 'Comentários', icon: '💬', count: ticket.comments?.length || 0 },
        { id: 'attachments', label: 'Anexos', icon: '📎', count: ticket.attachments?.length || 0 },
        { id: 'history', label: 'Histórico', icon: '📚' },
        { id: 'subtickets', label: 'Sub-tickets', icon: '📝', count: ticket.subTickets?.length || 0 },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-3xl">
                            {ticket.icon || '🎫'}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                                    {ticket.status === 'open' ? 'Aberto' :
                                        ticket.status === 'pending' ? 'Pendente' :
                                            ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority === 'low' ? 'Baixa' :
                                        ticket.priority === 'medium' ? 'Média' :
                                            ticket.priority === 'high' ? 'Alta' : 'Urgente'}
                                </span>
                            </div>
                            <p className="text-gray-600 text-lg">{ticket.description}</p>
                            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                                <span>ID: #{ticket.id}</span>
                                <span>Criado: {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                                <span>Atualizado: {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}</span>
                                {ticket.assignedAgent && <span>👤 {ticket.assignedAgent.name}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Editar
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleUpdateTicket}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditForm(ticket);
                                    }}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Tab Content */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                                        <input
                                            type="text"
                                            value={editForm.title || ''}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={editForm.status || 'open'}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="open">Aberto</option>
                                            <option value="pending">Pendente</option>
                                            <option value="resolved">Resolvido</option>
                                            <option value="closed">Fechado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                                        <select
                                            value={editForm.priority || 'medium'}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="low">Baixa</option>
                                            <option value="medium">Média</option>
                                            <option value="high">Alta</option>
                                            <option value="urgent">Urgente</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                                        <textarea
                                            value={editForm.description || ''}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Gerais</h3>
                                        <dl className="space-y-3">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">ID do Ticket</dt>
                                                <dd className="text-sm text-gray-900">#{ticket.id}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                <dd className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status === 'open' ? 'Aberto' : ticket.status === 'pending' ? 'Pendente' : ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Prioridade</dt>
                                                <dd className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority === 'low' ? 'Baixa' : ticket.priority === 'medium' ? 'Média' : ticket.priority === 'high' ? 'Alta' : 'Urgente'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Criado por</dt>
                                                <dd className="text-sm text-gray-900">{ticket.createdBy?.name || 'Sistema'}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Datas e Atribuições</h3>
                                        <dl className="space-y-3">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Data de Criação</dt>
                                                <dd className="text-sm text-gray-900">{new Date(ticket.createdAt).toLocaleString('pt-BR')}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Última Atualização</dt>
                                                <dd className="text-sm text-gray-900">{new Date(ticket.updatedAt).toLocaleString('pt-BR')}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Agente Atribuído</dt>
                                                <dd className="text-sm text-gray-900">{ticket.assignedAgent?.name || 'Não atribuído'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">SLA</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {ticket.slaPaused ? '⏸️ Pausado' : ticket.slaBreached ? '❌ Violado' : '✅ Dentro do prazo'}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'comments' && (
                        <div className="space-y-6">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Comentário</h4>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Digite seu comentário..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!comment.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Adicionar Comentário
                                </button>
                            </div>

                            <div className="space-y-4">
                                {ticket.comments?.map((comment) => (
                                    <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                                                {comment.author?.name?.charAt(0)?.toUpperCase() || 'S'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="font-semibold text-gray-900">{comment.author?.name || 'Sistema'}</span>
                                                    <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
                                                </div>
                                                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) || (
                                        <p className="text-gray-500 text-center py-8">Nenhum comentário ainda.</p>
                                    )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'attachments' && (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <div className="text-4xl mb-4">📎</div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Anexar Arquivos</h4>
                                <p className="text-gray-600 mb-4">Arraste arquivos aqui ou clique para selecionar</p>
                                <input type="file" multiple className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                                    Selecionar Arquivos
                                </label>
                            </div>

                            {ticket.attachments?.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-lg font-semibold text-gray-900">Anexos ({ticket.attachments.length})</h4>
                                    {ticket.attachments.map((attachment) => (
                                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl">📄</div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{attachment.filename}</p>
                                                    <p className="text-sm text-gray-500">{attachment.size} • {new Date(attachment.uploadedAt).toLocaleDateString('pt-BR')}</p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded">
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900">Histórico de Atividades</h4>
                            {ticket.auditTrail?.map((entry) => (
                                <div key={entry.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                                        📝
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900">{entry.action}</p>
                                        <p className="text-sm text-gray-500">
                                            {entry.user?.name || 'Sistema'} • {new Date(entry.timestamp).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            )) || (
                                    <p className="text-gray-500 text-center py-8">Nenhuma atividade registrada.</p>
                                )}
                        </div>
                    )}

                    {activeTab === 'subtickets' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold text-gray-900">Sub-tickets</h4>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Criar Sub-ticket
                                </button>
                            </div>

                            {ticket.subTickets?.length > 0 ? (
                                <div className="space-y-2">
                                    {ticket.subTickets.map((subTicket) => (
                                        <div key={subTicket.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h5 className="font-medium text-gray-900">{subTicket.title}</h5>
                                                    <p className="text-sm text-gray-600">{subTicket.description}</p>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(subTicket.status)}`}>
                                                    {subTicket.status === 'open' ? 'Aberto' : subTicket.status === 'pending' ? 'Pendente' : 'Resolvido'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Nenhum sub-ticket criado.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}