import React, { useState, useEffect, useRef } from 'react';

const HeatmapChart = ({
    pageUrl,
    dateRange = '7d',
    deviceType = null,
    heatmapType = 'click', // 'click', 'scroll', 'attention'
    width = 800,
    height = 600,
    showLegend = true
}) => {
    const [heatmapData, setHeatmapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const canvasRef = useRef(null);

    // Buscar dados de heatmap
    useEffect(() => {
        fetchHeatmapData();
    }, [pageUrl, dateRange, deviceType, heatmapType]);

    const fetchHeatmapData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Usuário não autenticado');
                return;
            }

            const params = new URLSearchParams({
                range: dateRange,
                ...(deviceType && { device_type: deviceType }),
                ...(pageUrl && { page_url: pageUrl })
            });

            const response = await fetch(`/api/tracking/analytics?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.heatmap_data && data.heatmap_data.length > 0) {
                setHeatmapData(data.heatmap_data[0]); // Usar dados mais recentes
            } else {
                setHeatmapData(null);
            }

            setError(null);
        } catch (err) {
            console.error('Erro ao buscar dados de heatmap:', err);
            setError('Erro ao carregar heatmap');
        } finally {
            setLoading(false);
        }
    };

    // Desenhar heatmap
    useEffect(() => {
        if (heatmapData && canvasRef.current) {
            drawHeatmap();
        }
    }, [heatmapData, heatmapType]);

    const drawHeatmap = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Limpar canvas
        ctx.clearRect(0, 0, width, height);

        // Desenhar fundo da página
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // Desenhar header simulado
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, 60);
        ctx.strokeStyle = '#e9ecef';
        ctx.strokeRect(0, 0, width, 60);

        let dataPoints = [];
        let maxIntensity = 0;

        // Preparar dados baseado no tipo
        switch (heatmapType) {
            case 'click':
                dataPoints = heatmapData.clicks_data || [];
                maxIntensity = Math.max(...dataPoints.map(d => d.count), 1);
                break;
            case 'scroll':
                dataPoints = heatmapData.scroll_data || [];
                maxIntensity = Math.max(...dataPoints.map(d => d.frequency), 1);
                break;
            case 'attention':
                dataPoints = heatmapData.attention_data || [];
                maxIntensity = Math.max(...dataPoints.map(d => d.attention_time), 1);
                break;
            default:
                dataPoints = heatmapData.clicks_data || [];
                maxIntensity = Math.max(...dataPoints.map(d => d.count), 1);
        }

        if (dataPoints.length === 0) {
            // Desenhar mensagem de "sem dados"
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Nenhum dado de heatmap disponível', width / 2, height / 2);
            return;
        }

        // Desenhar pontos de calor
        dataPoints.forEach(point => {
            let intensity;
            switch (heatmapType) {
                case 'click':
                    intensity = point.count / maxIntensity;
                    break;
                case 'scroll':
                    intensity = point.frequency / maxIntensity;
                    break;
                case 'attention':
                    intensity = point.attention_time / maxIntensity;
                    break;
                default:
                    intensity = point.count / maxIntensity;
            }

            // Calcular posição relativa
            const x = (point.x / heatmapData.viewport_width) * width;
            const y = (point.y / heatmapData.viewport_height) * height;

            // Desenhar ponto de calor
            const radius = Math.max(10, intensity * 30);

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(255, 165, 0, ${intensity * 0.6})`);
            gradient.addColorStop(1, `rgba(255, 255, 0, ${intensity * 0.2})`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();

            // Desenhar indicador de intensidade se for alto
            if (intensity > 0.7) {
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                const value = heatmapType === 'click' ? point.count :
                    heatmapType === 'scroll' ? point.frequency :
                        Math.round(point.attention_time / 1000) + 's';
                ctx.fillText(value.toString(), x, y + 4);
            }
        });
    };

    const getHeatmapTypeLabel = () => {
        switch (heatmapType) {
            case 'click': return 'Cliques';
            case 'scroll': return 'Scroll';
            case 'attention': return 'Atenção';
            default: return 'Cliques';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="ml-2 text-gray-600">Carregando heatmap...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={fetchHeatmapData}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    if (!heatmapData) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">Nenhum dado de heatmap disponível para o período selecionado.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        🔥 Heatmap - {getHeatmapTypeLabel()}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Página: {heatmapData.page_url}
                    </p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={heatmapType}
                        onChange={(e) => setHeatmapType(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                        <option value="click">Cliques</option>
                        <option value="scroll">Scroll</option>
                        <option value="attention">Atenção</option>
                    </select>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative border rounded-lg overflow-hidden bg-white">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="block"
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: width,
                        maxHeight: height
                    }}
                />

                {/* Legenda */}
                {showLegend && (
                    <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded p-2">
                        <div className="flex items-center gap-2 text-xs">
                            <span>Menos</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            </div>
                            <span>Mais</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                        {heatmapData.total_sessions}
                    </div>
                    <div className="text-sm text-blue-800">Sessões</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                    <div className="text-2xl font-bold text-green-600">
                        {heatmapData.total_events}
                    </div>
                    <div className="text-sm text-green-800">Eventos</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                    <div className="text-2xl font-bold text-purple-600">
                        {Math.round(heatmapData.avg_session_duration)}s
                    </div>
                    <div className="text-sm text-purple-800">Duração Média</div>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                    <div className="text-2xl font-bold text-orange-600">
                        {Math.round(heatmapData.bounce_rate * 100)}%
                    </div>
                    <div className="text-sm text-orange-800">Bounce Rate</div>
                </div>
            </div>
        </div>
    );
};

export default HeatmapChart;