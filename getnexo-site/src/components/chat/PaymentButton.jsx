import React, { useState } from 'react';
import { Button } from '../design-system';

/**
 * Componente PaymentButton - Botão de pagamento WhatsApp Pay
 * Integrado no balão de chat para pagamentos diretos
 */
const PaymentButton = ({
    amount,
    currency = 'BRL',
    description = 'Pagamento',
    phone,
    chatMessageId,
    onPaymentCreated,
    onPaymentSuccess,
    disabled = false
}) => {
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [showQR, setShowQR] = useState(false);

    const handleCreatePayment = async () => {
        if (!amount || !phone) {
            alert('Dados de pagamento incompletos');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/payments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency,
                    description,
                    phone,
                    chatMessageId,
                    paymentMethod: 'pix'
                })
            });

            const data = await response.json();

            if (response.ok) {
                setPaymentData(data);
                setShowQR(true);
                onPaymentCreated?.(data);

                // Inscrever-se para atualizações em tempo real
                if (window.io) {
                    window.io.emit('join_payment_room', data.transaction_id);
                    window.io.on('payment_update', (update) => {
                        if (update.transaction_id === data.transaction_id) {
                            setPaymentData(prev => ({
                                ...prev,
                                status: update.status
                            }));

                            if (update.status === 'completed') {
                                onPaymentSuccess?.(update);
                                setShowQR(false);
                            }
                        }
                    });
                }
            } else {
                alert('Erro ao criar pagamento: ' + data.error);
            }
        } catch (error) {
            console.error('Payment creation error:', error);
            alert('Erro ao processar pagamento');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Chave Pix copiada!');
        }).catch(() => {
            // Fallback para browsers antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Chave Pix copiada!');
        });
    };

    const formatCurrency = (value, curr) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: curr
        }).format(value);
    };

    if (paymentData?.status === 'completed') {
        return (
            <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-lg">
                <div className="flex items-center text-green-700">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Pagamento Confirmado!</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                    {formatCurrency(amount, currency)} recebido com sucesso
                </p>
            </div>
        );
    }

    if (showQR && paymentData?.payment?.qr_code) {
        return (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-center">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                        Pague com Pix
                    </h4>
                    <p className="text-xs text-blue-700 mb-3">
                        {formatCurrency(amount, currency)}
                    </p>

                    {/* QR Code */}
                    <div className="mb-3">
                        <img
                            src={paymentData.payment.qr_code}
                            alt="QR Code Pix"
                            className="w-32 h-32 mx-auto border border-gray-300 rounded"
                        />
                    </div>

                    {/* Chave Pix */}
                    <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1">Chave Pix:</p>
                        <div className="flex items-center justify-center">
                            <code className="text-xs bg-white px-2 py-1 rounded border text-gray-800 mr-2 max-w-48 truncate">
                                {paymentData.payment.pix_key}
                            </code>
                            <button
                                onClick={() => copyToClipboard(paymentData.payment.pix_key)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                title="Copiar chave Pix"
                            >
                                📋
                            </button>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="text-xs text-gray-600">
                        Status: <span className={`font-medium ${paymentData.status === 'pending' ? 'text-yellow-600' :
                                paymentData.status === 'completed' ? 'text-green-600' :
                                    'text-red-600'
                            }`}>
                            {paymentData.status === 'pending' ? 'Aguardando pagamento' :
                                paymentData.status === 'completed' ? 'Pago' : 'Falhou'}
                        </span>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => setShowQR(false)}
                            className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={() => window.open(paymentData.payment.ticket_url, '_blank')}
                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Ver no App
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-2">
            <Button
                onClick={handleCreatePayment}
                disabled={disabled || loading}
                variant="primary"
                size="small"
                className="w-full"
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Criando pagamento...
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        💳 Pagar {formatCurrency(amount, currency)}
                    </div>
                )}
            </Button>

            {paymentData && !showQR && (
                <button
                    onClick={() => setShowQR(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 block mx-auto"
                >
                    Ver QR Code
                </button>
            )}
        </div>
    );
};

export default PaymentButton;