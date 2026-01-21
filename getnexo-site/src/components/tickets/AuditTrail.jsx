import React, { useState, useEffect } from 'react';

export default function AuditTrail({ ticketId }) {
    const [auditEntries, setAuditEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuditTrail();
    }, [ticketId]);

    const fetchAuditTrail = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}/audit-trail`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setAuditEntries(data);
            }
        } catch (err) {
            console.error('Erro ao carregar trilha de auditoria:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action) => {
        const icons = {
            'created': '➕',
            'updated': '✏️',
            'status_changed': '🔄',
            'assigned': '👤',
            'comment_added': '💬',
            'attachment_added': '📎',
            'tag_added': '🏷️',
            'transferred': '↗️',
            'subticket_created': '📝',
            'sla_paused': '⏸️',
            'merged': '🔗',
            'closed': '✅',
        };
        return icons[action] || '📋';
    };

    const formatAction = (entry) => {
        const actions = {
            'created': `Ticket criado por ${entry.user?.name || 'Sistema'}`,
            'updated': `Ticket atualizado por ${entry.user?.name || 'Sistema'}`,
            'status_changed': `Status alterado de "${entry.oldValue}" para "${entry.newValue}" por ${entry.user?.name || 'Sistema'}`,
            'assigned': `Atribuído para ${entry.newValue} por ${entry.user?.name || 'Sistema'}`,
            'comment_added': `Comentário adicionado por ${entry.user?.name || 'Sistema'}`,
            'attachment_added': `Anexo "${entry.newValue}" adicionado por ${entry.user?.name || 'Sistema'}`,
            'tag_added': `Tag "${entry.newValue}" adicionada por ${entry.user?.name || 'Sistema'}`,
            'transferred': `Transferido para ${entry.newValue} por ${entry.user?.name || 'Sistema'}`,
            'subticket_created': `Sub-ticket criado por ${entry.user?.name || 'Sistema'}`,
            'sla_paused': `SLA pausado: ${entry.newValue} por ${entry.user?.name || 'Sistema'}`,
            'merged': `Mesclado com ticket #${entry.newValue} por ${entry.user?.name || 'Sistema'}`,
            'closed': `Ticket fechado por ${entry.user?.name || 'Sistema'}`,
        };
        return actions[entry.action] || `${entry.action} por ${entry.user?.name || 'Sistema'}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Carregando histórico...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Trilha de Auditoria</h4>

            {auditEntries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma atividade registrada.</p>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {auditEntries.map((entry) => (
                        <div key={entry.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                            <div className="text-2xl flex-shrink-0">
                                {getActionIcon(entry.action)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-900 text-sm">{formatAction(entry)}</p>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                    <span>{new Date(entry.timestamp).toLocaleString('pt-BR')}</span>
                                    {entry.ipAddress && <span>IP: {entry.ipAddress}</span>}
                                    {entry.userAgent && <span className="truncate max-w-xs">Device: {entry.userAgent}</span>}
                                </div>
                                {entry.details && (
                                    <details className="mt-2">
                                        <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                                            Ver detalhes
                                        </summary>
                                        <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                                            {JSON.stringify(entry.details, null, 2)}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-xs text-gray-500 text-center pt-4 border-t">
                Total de {auditEntries.length} atividades registradas
            </div>
        </div>
    );
}