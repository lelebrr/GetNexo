import React, { useState, useEffect } from 'react';

/**
 * Componente PaymentHistory - Histórico de transações no chat
 * Mostra todas as transações de pagamento relacionadas a uma conversa
 */
const PaymentHistory = ({ phone, compact = false }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(!compact);

    useEffect(() => {
        if (phone) {
            loadPaymentHistory();
        }
    }, [phone]);

    const loadPaymentHistory = async () => {
        try {
            const response = await fetch(`/api/payments/phone/${phone}`);
            const data = await response.json();

            if (response.ok) {
                setTransactions(data.transactions || []);
            }
        } catch (error) {
            console.error('Error loading payment history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value, currency) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency || 'BRL'
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'failed': return 'text-red-600 bg-red-100';
            case 'cancelled': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Pago';
            case 'pending': return 'Pendente';
            case 'failed': return 'Falhou';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="text-xs text-gray-500 animate-pulse">
                Carregando histórico...
            </div>
        );
    }

    if (transactions.length === 0) {
        return null;
    }

    const totalPaid = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    return (
        <div className="mt-2 border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700">
                    💳 Histórico de Pagamentos
                </h4>
                {compact && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        aria-expanded={expanded}
                        aria-controls="payment-history-list"
                    >
                        {expanded ? 'Ocultar' : 'Mostrar'} ({transactions.length})
                    </button>
                )}
            </div>

            {totalPaid > 0 && (
                <div className="mb-2 p-2 bg-green-50 rounded text-xs">
                    <span className="font-medium text-green-700">
                        Total Pago: {formatCurrency(totalPaid, 'BRL')}
                    </span>
                </div>
            )}

            {expanded && (
                <div id="payment-history-list" className="space-y-2 max-h-48 overflow-y-auto">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="p-2 bg-gray-50 rounded border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-800">
                                    {formatCurrency(transaction.amount, transaction.currency)}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(transaction.status)}`}>
                                    {getStatusText(transaction.status)}
                                </span>
                            </div>

                            <p className="text-xs text-gray-600 mb-1 truncate">
                                {transaction.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>
                                    {transaction.gateway === 'mercadopago' ? 'Mercado Pago' :
                                        transaction.gateway === 'stripe' ? 'Stripe' :
                                            transaction.gateway === 'pix' ? 'Pix' : transaction.gateway}
                                </span>
                                <span>
                                    {formatDate(transaction.created_at)}
                                </span>
                            </div>

                            {transaction.status === 'completed' && (
                                <div className="mt-1 text-xs text-green-600">
                                    ✅ Confirmado em {formatDate(transaction.updated_at)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {!expanded && (
                <div className="text-xs text-gray-600">
                    {transactions.length} transação(ões) • {transactions.filter(t => t.status === 'completed').length} pago(s)
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;