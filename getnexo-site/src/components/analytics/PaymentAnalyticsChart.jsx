import React, { useState, useEffect } from 'react';

/**
 * Componente PaymentAnalyticsChart - Analytics de conversão de pagamentos
 * Mostra métricas de conversão e performance de pagamentos
 */
const PaymentAnalyticsChart = ({
    timeRange = '30d',
    showChart = true,
    compact = false
}) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    const loadAnalytics = async () => {
        try {
            const response = await fetch(`/api/payments/analytics/conversion?range=${timeRange}`);
            const data = await response.json();

            if (response.ok) {
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error('Error loading payment analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value, currency = 'BRL') => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency
        }).format(value);
    };

    const formatPercent = (value) => {
        return `${(value * 100).toFixed(1)}%`;
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center text-gray-500 py-4">
                Erro ao carregar analytics de pagamentos
            </div>
        );
    }

    if (compact) {
        return (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    📊 Conversão de Pagamentos
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {analytics.total}
                        </div>
                        <div className="text-xs text-gray-600">Total</div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {formatPercent(analytics.conversion_rate / 100)}
                        </div>
                        <div className="text-xs text-gray-600">Conversão</div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {formatCurrency(analytics.total_amount)}
                        </div>
                        <div className="text-xs text-gray-600">Valor Total</div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {formatCurrency(analytics.completed_amount)}
                        </div>
                        <div className="text-xs text-gray-600">Valor Pago</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    📊 Analytics de Pagamentos
                </h3>
                <span className="text-sm text-gray-500">
                    Período: {timeRange}
                </span>
            </div>

            {/* Métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm">💳</span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {analytics.total}
                            </div>
                            <div className="text-sm text-blue-600">
                                Transações Totais
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-600 text-sm">✅</span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">
                                {analytics.completed}
                            </div>
                            <div className="text-sm text-green-600">
                                Pagamentos Completados
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-purple-600 text-sm">📈</span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-600">
                                {formatPercent(analytics.conversion_rate / 100)}
                            </div>
                            <div className="text-sm text-purple-600">
                                Taxa de Conversão
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-orange-600 text-sm">💰</span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-600">
                                {formatCurrency(analytics.completed_amount)}
                            </div>
                            <div className="text-sm text-orange-600">
                                Receita Total
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status breakdown */}
            <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-3">
                    Status das Transações
                </h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm text-green-700">Completadas</span>
                        <span className="text-sm font-medium text-green-700">
                            {analytics.completed} ({formatPercent(analytics.completed / analytics.total)})
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm text-yellow-700">Pendentes</span>
                        <span className="text-sm font-medium text-yellow-700">
                            {analytics.pending} ({formatPercent(analytics.pending / analytics.total)})
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm text-red-700">Falhas</span>
                        <span className="text-sm font-medium text-red-700">
                            {analytics.failed} ({formatPercent(analytics.failed / analytics.total)})
                        </span>
                    </div>
                </div>
            </div>

            {/* Performance por gateway */}
            {analytics.by_gateway && Object.keys(analytics.by_gateway).length > 0 && (
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">
                        Performance por Gateway
                    </h4>
                    <div className="space-y-3">
                        {Object.entries(analytics.by_gateway).map(([gateway, stats]) => (
                            <div key={gateway} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-800 capitalize">
                                        {gateway}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {stats.total} transações
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{
                                            width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`
                                        }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    {stats.completed} de {stats.total} completadas ({formatPercent(stats.completed / stats.total)})
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Insights */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    💡 Insights
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    {analytics.conversion_rate < 50 && (
                        <li>• Taxa de conversão abaixo do ideal. Considere otimizar o fluxo de pagamento.</li>
                    )}
                    {analytics.conversion_rate > 80 && (
                        <li>• Excelente taxa de conversão! Continue com as boas práticas.</li>
                    )}
                    {analytics.failed > analytics.total * 0.1 && (
                        <li>• Alto índice de falhas. Verifique configuração dos gateways.</li>
                    )}
                    {analytics.pending > analytics.total * 0.2 && (
                        <li>• Muitos pagamentos pendentes. Considere lembretes automáticos.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default PaymentAnalyticsChart;