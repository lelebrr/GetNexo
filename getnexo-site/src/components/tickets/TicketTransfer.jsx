import React, { useState, useEffect } from 'react';
import { useTickets } from '../../hooks/useTickets';

export default function TicketTransfer({ ticketId, onClose }) {
    const { transferTicket } = useTickets();
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/agents`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setAgents(data);
            }
        } catch (err) {
            console.error('Erro ao carregar agentes:', err);
        }
    };

    const handleTransfer = async () => {
        if (!selectedAgent || !reason.trim()) return;

        setLoading(true);
        try {
            await transferTicket(ticketId, selectedAgent);
            onClose?.();
        } catch (err) {
            console.error('Erro ao transferir ticket:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Transferir Ticket</h4>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Agente
                </label>
                <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Selecionar agente...</option>
                    {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                            {agent.name} - {agent.department}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo da Transferência
                </label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Explique o motivo da transferência..."
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleTransfer}
                    disabled={!selectedAgent || !reason.trim() || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Transferindo...' : 'Transferir'}
                </button>
            </div>
        </div>
    );
}