import React, { useState, useEffect } from 'react';
import useSentimentAnalysis from '../../hooks/useSentimentAnalysis';
import useTickets from '../../hooks/useTickets';
import SentimentIndicator from '../SentimentIndicator';

/**
 * Componente SupportEffectivenessReport
 * Relatório de eficácia do suporte mostrando evolução do sentimento (tom inicial vs final)
 */
const SupportEffectivenessReport = () => {
    const {
        getSupportEffectivenessReport,
        loading: sentimentLoading,
        error: sentimentError
    } = useSentimentAnalysis();

    const {
        tickets,
        loading: ticketsLoading,
        error: ticketsError,
        fetchTickets
    } = useTickets();

    const [effectivenessData, setEffectivenessData] = useState([]);
    const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketDetails, setTicketDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        loadEffectivenessReport();
        fetchTickets();
    }, [selectedTimeRange]);

    const loadEffectivenessReport = async () => {
        try {
            const filters = {
                startDate: getStartDate(selectedTimeRange),
                endDate: new Date().toISOString()
            };

            const data = await getSupportEffectivenessReport(filters);
            setEffectivenessData(data || []);
        } catch (err) {
            console.error('Erro ao carregar relatório de eficácia:', err);
        }
    };

    const getStartDate = (range) => {
        const now = new Date();
        switch (range) {
            case '7d': now.setDate(now.getDate() - 7); break;
            case '30d': now.setDate(now.getDate() - 30); break;
            case '90d': now.setDate(now.getDate() - 90); break;
            case '1y': now.setFullYear(now.getFullYear() - 1); break;
            default: now.setDate(now.getDate() - 30);
        }
        return now.toISOString();
    };

    const loadTicketDetails = async (ticketId) => {
        try {
            const response = await fetch(`/api/sentiment/analysis/ticket/${ticketId}`);
            const result = await response.json();

            if (result.success) {
                setTicketDetails(result.data);
                setSelectedTicket(ticketId);
            }
        } catch (err) {
            console.error('Erro ao carregar detalhes do ticket:', err);
        }
    };

    const getOverallStats = () => {
        if (!effectivenessData.length) return null;

        const totalTickets = effectivenessData.length;
        const improvedTickets = effectivenessData.filter(t => t.improvement).length;
        const deterioratedTickets = effectivenessData.filter(t => t.deterioration).length;
        const stableTickets = effectivenessData.filter(t => t.stable).length;

        const avgInitialScore = effectivenessData.reduce((sum, t) => sum + (t.initialScore || 0), 0) / totalTickets;
        const avgFinalScore = effectivenessData.reduce((sum, t) => sum + (t.finalScore || 0), 0) / totalTickets;
        const avgScoreChange = effectivenessData.reduce((sum, t) => sum + (t.scoreChange || 0), 0) / totalTickets;

        return {
            totalTickets,
            improvedTickets,
            deterioratedTickets,
            stableTickets,
            avgInitialScore,
            avgFinalScore,
            avgScoreChange,
            improvementRate: (improvedTickets / totalTickets) * 100,
            deteriorationRate: (deterioratedTickets / totalTickets) * 100,
            stabilityRate: (stableTickets / totalTickets) * 100
        };
    };

    const EffectivenessOverview = () => {
        const stats = getOverallStats();

        if (!stats) {
            return (
                <div className="text-center py-8 text-gray-500">
                    Nenhum dado de eficácia encontrado para o período selecionado.
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Métricas principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Total de Tickets</h3>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalTickets}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Taxa de Melhoria</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.improvementRate.toFixed(1)}%
                                </p>
                                <p className="text-xs text-gray-500">
                                    {stats.improvedTickets} tickets
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📈</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Taxa de Deterioração</h3>
                                <p className="text-2xl font-bold text-red-600">
                                    {stats.deteriorationRate.toFixed(1)}%
                                </p>
                                <p className="text-xs text-gray-500">
                                    {stats.deterioratedTickets} tickets
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📉</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Mudança Média</h3>
                                <p className={`text-2xl font-bold ${stats.avgScoreChange >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stats.avgScoreChange >= 0 ? '+' : ''}{stats.avgScoreChange.toFixed(1)}
                                </p>
                                <p className="text-xs text-gray-500">pontos</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⚖️</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráfico de distribuição */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Distribuição de Resultados</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm flex items-center">
                                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                    Melhorou
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 bg-green-500 rounded-full"
                                            style={{ width: `${stats.improvementRate}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium w-12 text-right">
                                        {stats.improvedTickets}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm flex items-center">
                                    <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                                    Estável
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 bg-gray-500 rounded-full"
                                            style={{ width: `${stats.stabilityRate}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium w-12 text-right">
                                        {stats.stableTickets}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm flex items-center">
                                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                    Piorou
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 bg-red-500 rounded-full"
                                            style={{ width: `${stats.deteriorationRate}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium w-12 text-right">
                                        {stats.deterioratedTickets}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Evolução do Score Médio</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Score Inicial Médio</span>
                                <SentimentIndicator
                                    score={Math.round(stats.avgInitialScore * 10) / 10}
                                    size="small"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Score Final Médio</span>
                                <SentimentIndicator
                                    score={Math.round(stats.avgFinalScore * 10) / 10}
                                    size="small"
                                />
                            </div>
                            <div className="pt-2 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Diferença</span>
                                    <span className={`text-sm font-bold ${stats.avgScoreChange >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {stats.avgScoreChange >= 0 ? '+' : ''}{stats.avgScoreChange.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const TicketDetailsView = () => {
        if (!selectedTicket || !ticketDetails) {
            return (
                <div className="text-center py-8 text-gray-500">
                    Selecione um ticket para ver os detalhes da evolução do sentimento.
                </div>
            );
        }

        const initialAnalysis = ticketDetails.find(a => a.analysisType === 'initial');
        const finalAnalysis = ticketDetails.find(a => a.analysisType === 'final') || ticketDetails[ticketDetails.length - 1];

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Evolução do Sentimento - Ticket #{selectedTicket}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="text-center">
                            <h4 className="font-medium text-gray-700 mb-2">Sentimento Inicial</h4>
                            {initialAnalysis ? (
                                <div className="space-y-2">
                                    <SentimentIndicator
                                        score={initialAnalysis.score}
                                        sentiment={initialAnalysis.sentiment}
                                        category={initialAnalysis.category}
                                        size="large"
                                    />
                                    <p className="text-sm text-gray-600">
                                        {new Date(initialAnalysis.createdAt).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500">Não disponível</p>
                            )}
                        </div>

                        <div className="text-center">
                            <h4 className="font-medium text-gray-700 mb-2">Sentimento Final</h4>
                            {finalAnalysis ? (
                                <div className="space-y-2">
                                    <SentimentIndicator
                                        score={finalAnalysis.score}
                                        sentiment={finalAnalysis.sentiment}
                                        category={finalAnalysis.category}
                                        size="large"
                                    />
                                    <p className="text-sm text-gray-600">
                                        {new Date(finalAnalysis.createdAt).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500">Não disponível</p>
                            )}
                        </div>
                    </div>

                    {/* Timeline de evolução */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Timeline de Evolução</h4>
                        <div className="space-y-2">
                            {ticketDetails.map((analysis, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <SentimentIndicator
                                            score={analysis.score}
                                            size="small"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 truncate">
                                            "{analysis.text.substring(0, 100)}..."
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(analysis.createdAt).toLocaleTimeString('pt-BR')}
                                    </div>
                                    <div className="text-xs text-gray-400 capitalize">
                                        {analysis.analysisType}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const TicketTable = () => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Análise por Ticket</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicial</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mudança</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {effectivenessData.map((ticket, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{ticket.ticketId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <SentimentIndicator
                                        score={ticket.initialScore}
                                        size="small"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <SentimentIndicator
                                        score={ticket.finalScore}
                                        size="small"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-sm font-medium ${ticket.scoreChange > 0 ? 'text-green-600' :
                                            ticket.scoreChange < 0 ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                        {ticket.scoreChange > 0 ? '+' : ''}{ticket.scoreChange?.toFixed(1) || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ticket.improvement ? 'bg-green-100 text-green-800' :
                                            ticket.deterioration ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {ticket.improvement ? 'Melhorou' :
                                            ticket.deterioration ? 'Piorou' : 'Estável'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => loadTicketDetails(ticket.ticketId)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Ver Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (sentimentLoading || ticketsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Relatório de Eficácia do Suporte</h1>
                        <p className="text-gray-600">Análise da evolução do sentimento dos clientes (tom inicial vs final)</p>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                            <option value="1y">Último ano</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {(sentimentError || ticketsError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Erro ao carregar dados
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                {sentimentError || ticketsError}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        {[
                            { id: 'overview', label: 'Visão Geral', icon: '📊' },
                            { id: 'tickets', label: 'Por Ticket', icon: '🎫' },
                            { id: 'details', label: 'Detalhes', icon: '📋' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <EffectivenessOverview />}
            {activeTab === 'tickets' && <TicketTable />}
            {activeTab === 'details' && <TicketDetailsView />}
        </div>
    );
};

export default SupportEffectivenessReport;
