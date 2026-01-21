import React, { useState } from 'react';
import { useTickets } from '../../hooks/useTickets';

export default function SLAPause({ ticketId, onClose }) {
    const { pauseSLA } = useTickets();
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState(1); // horas
    const [loading, setLoading] = useState(false);

    const handlePause = async () => {
        if (!reason.trim()) return;

        setLoading(true);
        try {
            await pauseSLA(ticketId, reason, duration);
            onClose?.();
        } catch (err) {
            console.error('Erro ao pausar SLA:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Pausar SLA</h4>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo da Pausa
                </label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Explique o motivo da pausa no SLA..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração da Pausa (horas)
                </label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                    onClick={handlePause}
                    disabled={!reason.trim() || loading}
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                >
                    {loading ? 'Pausando...' : 'Pausar SLA'}
                </button>
            </div>
        </div>
    );
}