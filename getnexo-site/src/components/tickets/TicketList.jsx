import React, { useState, useEffect } from 'react';
import { useTickets } from '../../hooks/useTickets';

export default function TicketList() {
    const { tickets, loading, error, filters, setFilters, fetchTickets } = useTickets();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTickets, setSelectedTickets] = useState([]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchTerm }));
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, setFilters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const toggleTicketSelection = (ticketId) => {
        setSelectedTickets(prev =>
            prev.includes(ticketId)
                ? prev.filter(id => id !== ticketId)
                : [...prev, ticketId]
        );
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
            low: 'text-green-600',
            medium: 'text-yellow-600',
            high: 'text-orange-600',
            urgent: 'text-red-600',
        };
        return colors[priority] || colors.medium;
    };

    const getStatusText = (status) => {
        const texts = {
            open: 'Aberto',
            pending: 'Pendente',
            resolved: 'Resolvido',
            closed: 'Fechado',
        };
        return texts[status] || 'Aberto';
    };

    const getPriorityText = (priority) => {
        const texts = {
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta',
            urgent: 'Urgente',
        };
        return texts[priority] || 'Média';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Carregando tickets...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <div className="text-red-600">⚠️</div>
                    <p className="ml-2 text-red-800">{error}</p>
                </div>
                <button
                    onClick={fetchTickets}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtros Avançados */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Busca */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Título ou descrição..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Buscar tickets"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status-filter"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Filtrar por status"
                        >
                            <option value="all">Todos os status</option>
                            <option value="open">Aberto</option>
                            <option value="pending">Pendente</option>
                            <option value="resolved">Resolvido</option>
                            <option value="closed">Fechado</option>
                        </select>
                    </div>

                    {/* Prioridade */}
                    <div>
                        <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridade
                        </label>
                        <select
                            id="priority-filter"
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Filtrar por prioridade"
                        >
                            <option value="all">Todas as prioridades</option>
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                            <option value="urgent">Urgente</option>
                        </select>
                    </div>

                    {/* Período */}
                    <div>
                        <label htmlFor="period-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Período
                        </label>
                        <select
                            id="period-filter"
                            value={filters.period}
                            onChange={(e) => handleFilterChange('period', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Filtrar por período"
                        >
                            <option value="all">Todo período</option>
                            <option value="week">Esta semana</option>
                            <option value="month">Este mês</option>
                            <option value="quarter">Este trimestre</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Tickets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Tickets ({tickets.length})
                        </h3>
                        {selectedTickets.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                    {selectedTickets.length} selecionado(s)
                                </span>
                                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                    Ações em lote
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {tickets.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🎫</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum ticket encontrado</h3>
                        <p className="text-gray-600 mb-4">
                            {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                                ? 'Tente ajustar os filtros para ver mais resultados.'
                                : 'Seus tickets aparecerão aqui quando criados.'}
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Criar primeiro ticket
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => window.location.href = `/dashboard/suporte/tickets/${ticket.id}`}
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Checkbox para seleção */}
                                    <div className="flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={selectedTickets.includes(ticket.id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleTicketSelection(ticket.id);
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            aria-label={`Selecionar ticket ${ticket.title}`}
                                        />
                                    </div>

                                    {/* Ícone do ticket */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                                            {ticket.icon || '🎫'}
                                        </div>
                                    </div>

                                    {/* Conteúdo do ticket */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-900 truncate">
                                                    {ticket.title}
                                                </h4>
                                                <p className="text-gray-600 mt-1 line-clamp-2">
                                                    {ticket.description}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 ml-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                                                    {getStatusText(ticket.status)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Metadados */}
                                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center space-x-4">
                                                <span>ID: #{ticket.id}</span>
                                                <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                                                    {getPriorityText(ticket.priority)}
                                                </span>
                                                {ticket.assignedAgent && (
                                                    <span>👤 {ticket.assignedAgent.name}</span>
                                                )}
                                                {ticket.tags && ticket.tags.length > 0 && (
                                                    <div className="flex space-x-1">
                                                        {ticket.tags.slice(0, 3).map((tag) => (
                                                            <span
                                                                key={tag.id}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                                            >
                                                                {tag.name}
                                                            </span>
                                                        ))}
                                                        {ticket.tags.length > 3 && (
                                                            <span className="text-xs text-gray-500">
                                                                +{ticket.tags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span>Atualizado: {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}</span>
                                                {ticket.slaPaused && (
                                                    <span className="text-orange-600 font-medium">⏸️ SLA pausado</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}