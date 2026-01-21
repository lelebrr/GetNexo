import React, { useState } from 'react';

export default function MergeDuplicate({ ticketId, onClose }) {
    const [action, setAction] = useState('merge'); // 'merge' ou 'duplicate'
    const [targetTicketId, setTargetTicketId] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        if (action === 'merge' && !targetTicketId) return;
        if (!reason.trim()) return;

        setLoading(true);
        try {
            const endpoint = action === 'merge' ? 'merge' : 'duplicate';
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ targetTicketId, reason }),
            });

            if (!response.ok) throw new Error(`Erro ao ${action === 'merge' ? 'mesclar' : 'duplicar'} ticket`);

            onClose?.();
        } catch (err) {
            console.error(`Erro ao ${action}:`, err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
                {action === 'merge' ? 'Mesclar Tickets' : 'Duplicar Ticket'}
            </h4>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ação
                </label>
                <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                    <option value="merge">Mesclar com outro ticket</option>
                    <option value="duplicate">Duplicar este ticket</option>
                </select>
            </div>

            {action === 'merge' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID do Ticket Alvo
                    </label>
                    <input
                        type="text"
                        value={targetTicketId}
                        onChange={(e) => setTargetTicketId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite o ID do ticket para mesclar..."
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo
                </label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Explique o motivo da ação..."
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
                    onClick={handleAction}
                    disabled={(!targetTicketId && action === 'merge') || !reason.trim() || loading}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? 'Processando...' : action === 'merge' ? 'Mesclar' : 'Duplicar'}
                </button>
            </div>
        </div>
    );
}