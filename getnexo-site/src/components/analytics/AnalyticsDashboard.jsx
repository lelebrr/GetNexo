import React, { useState, useEffect } from 'react';
import TicketPeaksChart from './TicketPeaksChart.jsx';
import ChannelDistributionChart from './ChannelDistributionChart.jsx';
import AIResolutionChart from './AIResolutionChart.jsx';
import SalesChart from './SalesChart.jsx';
import AgentClicksHeatmap from './AgentClicksHeatmap.jsx';
import ConversionFunnelChart from './ConversionFunnelChart.jsx';
import NPSChart from './NPSChart.jsx';
import ResponseTimesChart from './ResponseTimesChart.jsx';
import TopComplaintsChart from './TopComplaintsChart.jsx';
import BrazilHeatmap from './BrazilHeatmap.jsx';
import QueueAbandonmentIndicator from './QueueAbandonmentIndicator.jsx';

const AnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('30d');

    useEffect(() => {
        loadAnalyticsData();
    }, [timeRange]);

    useEffect(() => {
        // Listen for time range changes
        const handleTimeRangeChange = (event) => {
            setTimeRange(event.detail.range);
        };

        const handleRefresh = () => {
            loadAnalyticsData();
        };

        window.addEventListener('timeRangeChanged', handleTimeRangeChange);
        window.addEventListener('refreshAnalytics', handleRefresh);

        return () => {
            window.removeEventListener('timeRangeChanged', handleTimeRangeChange);
            window.removeEventListener('refreshAnalytics', handleRefresh);
        };
    }, []);

    const loadAnalyticsData = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/support/analytics/dashboard?range=${timeRange}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setAnalyticsData(data);
            } else {
                setError(data.error || 'Erro ao carregar dados de analytics.');
            }
        } catch (err) {
            setError('Erro de conexão.');
            console.error('Erro ao buscar analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-gray-600">Carregando dashboard...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                    onClick={loadAnalyticsData}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="text-center text-gray-500">
                Nenhum dado disponível para o período selecionado.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Primeira linha: Picos de tickets e distribuição de canais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TicketPeaksChart
                    data={analyticsData.ticket_peaks || []}
                    title="Picos de Tickets por Hora"
                />
                <ChannelDistributionChart
                    data={analyticsData.channel_distribution || []}
                    title="Distribuição por Canal"
                />
            </div>

            {/* Segunda linha: Resolução IA e vendas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIResolutionChart
                    data={analyticsData.ai_resolution || []}
                    title="Taxa de Resolução IA vs Humano"
                />
                <SalesChart
                    data={analyticsData.sales_comparison || { today: 0, yesterday: 0, by_channel: [] }}
                    title="Vendas no Chat"
                />
            </div>

            {/* Terceira linha: Agentes e funil de conversão */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AgentClicksHeatmap
                    data={analyticsData.agent_clicks_heatmap || []}
                    title="Cliques de Agentes"
                />
                <ConversionFunnelChart
                    data={analyticsData.conversion_funnel || { saw: 0, contacted: 0, qualified: 0, purchased: 0 }}
                    title="Funil de Conversão"
                />
            </div>

            {/* Quarta linha: NPS e tempos de resposta */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NPSChart
                    data={analyticsData.nps_weekly || []}
                    title="NPS Semanal"
                />
                <ResponseTimesChart
                    data={analyticsData.response_times || []}
                    title="Tempo Médio de Resposta"
                />
            </div>

            {/* Quinta linha: Reclamações e mapa Brasil */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopComplaintsChart
                    data={analyticsData.top_complaints || []}
                    title="Top Reclamações por Produto"
                />
                <BrazilHeatmap
                    data={analyticsData.brazil_heatmap || []}
                    title="Chamados por Região do Brasil"
                />
            </div>

            {/* Indicador de abandono - linha separada */}
            <div className="grid grid-cols-1 gap-6">
                <QueueAbandonmentIndicator
                    data={analyticsData.queue_abandonment || { rate: 0, abandoned: 0, total_tickets: 0 }}
                    title="Abandono de Fila"
                />
            </div>

            {/* Informações de debug (remover em produção) */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm">
                <details>
                    <summary className="cursor-pointer font-medium">Dados brutos (debug)</summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-96">
                        {JSON.stringify(analyticsData, null, 2)}
                    </pre>
                </details>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;