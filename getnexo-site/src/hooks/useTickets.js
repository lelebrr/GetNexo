import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        period: 'all',
        search: '',
        agent: 'all',
        tags: [],
    });

    // WebSocket para notificações em tempo real
    const [ws, setWs] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Inicializar WebSocket
        const socket = new WebSocket(`${API_URL.replace('http', 'ws')}/tickets/ws`);

        socket.onopen = () => {
            console.log('WebSocket conectado para tickets');
            setWs(socket);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ticket_update') {
                setNotifications(prev => [data, ...prev]);
                // Atualizar ticket na lista
                setTickets(prev => prev.map(ticket =>
                    ticket.id === data.ticketId ? { ...ticket, ...data.updates } : ticket
                ));
            }
        };

        socket.onclose = () => {
            console.log('WebSocket desconectado');
            setWs(null);
        };

        socket.onerror = (error) => {
            console.error('Erro no WebSocket:', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== 'all' && value !== '' && (!Array.isArray(value) || value.length > 0)) {
                    if (Array.isArray(value)) {
                        queryParams.set(key, value.join(','));
                    } else {
                        queryParams.set(key, value);
                    }
                }
            });

            const url = `${API_URL}/api/tickets${queryParams.toString() ? `?${queryParams}` : ''}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Erro ao carregar tickets');

            const data = await response.json();
            setTickets(data.tickets || data);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao buscar tickets:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const createTicket = useCallback(async (ticketData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/tickets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData),
            });

            if (!response.ok) throw new Error('Erro ao criar ticket');

            const newTicket = await response.json();
            setTickets(prev => [newTicket, ...prev]);
            return newTicket;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const updateTicket = useCallback(async (ticketId, updates) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error('Erro ao atualizar ticket');

            const updatedTicket = await response.json();
            setTickets(prev => prev.map(ticket =>
                ticket.id === ticketId ? updatedTicket : ticket
            ));
            return updatedTicket;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const deleteTicket = useCallback(async (ticketId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Erro ao deletar ticket');

            setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const addTag = useCallback(async (ticketId, tagId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/tickets/${ticketId}/tags`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tagId }),
            });

            if (!response.ok) throw new Error('Erro ao adicionar tag');

            const result = await response.json();
            // Atualizar ticket com nova tag
            setTickets(prev => prev.map(ticket =>
                ticket.id === ticketId ? { ...ticket, tags: [...(ticket.tags || []), result.tag] } : ticket
            ));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const removeTag = useCallback(async (ticketId, tagId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/tickets/${ticketId}/tags/${tagId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Erro ao remover tag');

            setTickets(prev => prev.map(ticket =>
                ticket.id === ticketId ? { ...ticket, tags: ticket.tags.filter(tag => tag.id !== tagId) } : ticket
            ));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Funções para outros recursos
    const transferTicket = useCallback(async (ticketId, agentId) => {
        return updateTicket(ticketId, { assignedAgent: agentId, transferHistory: true });
    }, [updateTicket]);

    const pauseSLA = useCallback(async (ticketId, reason, duration) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/tickets/${ticketId}/sla-pause`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason, duration }),
            });

            if (!response.ok) throw new Error('Erro ao pausar SLA');

            const result = await response.json();
            // Atualizar ticket com pausa de SLA
            setTickets(prev => prev.map(ticket =>
                ticket.id === ticketId ? { ...ticket, slaPaused: true, slaPauseHistory: [...(ticket.slaPauseHistory || []), result] } : ticket
            ));
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return {
        tickets,
        loading,
        error,
        filters,
        setFilters,
        notifications,
        fetchTickets,
        createTicket,
        updateTicket,
        deleteTicket,
        addTag,
        removeTag,
        transferTicket,
        pauseSLA,
    };
}