import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

const MagicMap = ({
    pageUrl = null,
    realTime = true,
    showHeatmap = true,
    showUserPaths = true,
    showContextMessages = true,
    refreshInterval = 2000,
    maxUsers = 50
}) => {
    const [magicMapData, setMagicMapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pagePreview, setPagePreview] = useState(null);
    const [contextMessages, setContextMessages] = useState([]);
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const intervalRef = useRef(null);

    // Buscar dados do Magic Map
    const fetchMagicMapData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Usuário não autenticado');
                return;
            }

            const params = new URLSearchParams({
                real_time: realTime.toString(),
                ...(pageUrl && { page_url: pageUrl })
            });

            const response = await fetch(`/api/tracking/magic-map?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            setMagicMapData(data);
            setError(null);

            // Atualizar mensagens contextuais
            if (showContextMessages) {
                updateContextMessages(data.sessions);
            }

        } catch (err) {
            console.error('Erro ao buscar dados do Magic Map:', err);
            setError('Erro ao carregar dados do Magic Map');
        } finally {
            setLoading(false);
        }
    }, [pageUrl, realTime, showContextMessages]);

    // Atualizar mensagens contextuais
    const updateContextMessages = useCallback((sessions) => {
        const messages = [];

        sessions.forEach(session => {
            const lastActivity = new Date(session.last_activity);
            const now = new Date();
            const inactiveSeconds = Math.floor((now - lastActivity) / 1000);

            let message = '';
            let type = 'info';
            let icon = '👤';

            if (inactiveSeconds > 300) { // 5 minutos
                message = `Cliente inativo há ${Math.floor(inactiveSeconds / 60)} minutos`;
                type = 'warning';
                icon = '😴';
            } else if (session.mouse_position) {
                const scrollPercent = Math.round((session.scroll_position.y / (session.viewport.height - window.innerHeight)) * 100) || 0;
                message = `Cliente navegando - Scroll: ${scrollPercent}%`;
                type = 'success';
                icon = '🖱️';
            } else if (session.max_scroll_depth > 75) {
                message = `Cliente engajado - Scroll profundo (${session.max_scroll_depth}%)`;
                type = 'success';
                icon = '📖';
            } else {
                message = `Cliente visualizando página há ${Math.floor(session.duration / 60)} minutos`;
                type = 'info';
                icon = '👁️';
            }

            messages.push({
                session_id: session.session_id,
                visitor_id: session.visitor_id.substring(0, 8) + '...',
                message,
                type,
                icon,
                duration: session.duration,
                page_views: session.page_views,
                device_type: session.device_type,
                current_page: session.current_page,
                last_activity: session.last_activity
            });
        });

        // Limitar a 10 mensagens mais recentes
        setContextMessages(messages.slice(0, 10));
    }, []);

    // Desenhar no canvas
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !magicMapData) return;

        const ctx = canvas.getContext('2d');
        const { sessions } = magicMapData;

        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar fundo da página (simulação)
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenhar header simulado
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, 80);
        ctx.strokeStyle = '#e9ecef';
        ctx.strokeRect(0, 0, canvas.width, 80);

        // Desenhar usuários
        sessions.slice(0, maxUsers).forEach((session, index) => {
            const color = getUserColor(index);
            const position = getUserPosition(session, canvas);

            // Desenhar caminho do mouse se disponível
            if (showUserPaths && session.mouse_position) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.3;

                // Desenhar linha do último movimento
                const lastX = position.x - (session.mouse_position.x * canvas.width / session.viewport.width);
                const lastY = position.y - (session.mouse_position.y * canvas.height / session.viewport.height);

                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(position.x, position.y);
                ctx.stroke();

                ctx.globalAlpha = 1;
            }

            // Desenhar círculo do usuário
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(position.x, position.y, 8, 0, 2 * Math.PI);
            ctx.fill();

            // Desenhar borda
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Desenhar indicador de atividade
            const now = Date.now();
            const lastActivity = new Date(session.last_activity).getTime();
            const inactiveTime = (now - lastActivity) / 1000;

            if (inactiveTime < 30) {
                // Ativo recentemente - círculo pulsante
                ctx.strokeStyle = '#28a745';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else if (inactiveTime < 300) {
                // Ativo - borda normal
                ctx.strokeStyle = '#007bff';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                // Inativo - borda tracejada
                ctx.strokeStyle = '#6c757d';
                ctx.setLineDash([2, 2]);
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Desenhar dispositivo
            drawDeviceIcon(ctx, position.x, position.y - 15, session.device_type);
        });

        // Desenhar heatmap se habilitado
        if (showHeatmap && pageUrl) {
            drawHeatmap(ctx, canvas);
        }

    }, [magicMapData, showUserPaths, showHeatmap, pageUrl, maxUsers]);

    // Obter cor do usuário
    const getUserColor = (index) => {
        const colors = [
            '#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1',
            '#e83e8c', '#fd7e14', '#20c997', '#6c757d', '#17a2b8'
        ];
        return colors[index % colors.length];
    };

    // Calcular posição do usuário no canvas
    const getUserPosition = (session, canvas) => {
        if (session.mouse_position) {
            // Posição real do mouse
            return {
                x: (session.mouse_position.x / session.viewport.width) * canvas.width,
                y: (session.mouse_position.y / session.viewport.height) * canvas.height
            };
        } else {
            // Posição baseada no scroll
            const scrollRatio = session.scroll_position.y / (session.viewport.height - window.innerHeight);
            return {
                x: canvas.width / 2 + (Math.random() - 0.5) * 100, // Variação horizontal
                y: 100 + (scrollRatio * (canvas.height - 200)) // Baseado no scroll
            };
        }
    };

    // Desenhar ícone do dispositivo
    const drawDeviceIcon = (ctx, x, y, deviceType) => {
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';

        let icon = '💻'; // desktop default
        if (deviceType === 'mobile') icon = '📱';
        else if (deviceType === 'tablet') icon = '📱';

        ctx.fillText(icon, x, y);
    };

    // Desenhar heatmap (simplificado)
    const drawHeatmap = (ctx, canvas) => {
        // Aqui seria implementada a lógica de heatmap baseada nos dados
        // Por enquanto, apenas um exemplo visual
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, 150
        );
        gradient.addColorStop(0, 'rgba(0, 123, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 123, 255, 0.05)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Iniciar atualização automática
    useEffect(() => {
        fetchMagicMapData();

        if (realTime) {
            intervalRef.current = setInterval(fetchMagicMapData, refreshInterval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchMagicMapData, realTime, refreshInterval]);

    // Atualizar canvas quando dados mudarem
    useEffect(() => {
        if (magicMapData) {
            drawCanvas();
        }
    }, [magicMapData, drawCanvas]);

    // Handlers
    const handleUserClick = (session) => {
        setSelectedUser(session);
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchMagicMapData();
    };

    // Loading state
    if (loading && !magicMapData) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-gray-600">Carregando Magic Map...</span>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        🗺️ Magic Map - Usuários em Tempo Real
                    </h3>
                    <p className="text-sm text-gray-600">
                        {magicMapData?.active_sessions || 0} usuários ativos
                        {pageUrl && ` na página ${pageUrl}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                    >
                        🔄 Atualizar
                    </button>
                    <div className="flex items-center gap-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${realTime ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        Tempo Real {realTime ? 'ON' : 'OFF'}
                    </div>
                </div>
            </div>

            {/* Canvas principal */}
            <div className="relative border rounded-lg overflow-hidden bg-gray-50">
                <canvas
                    ref={canvasRef}
                    width={1200}
                    height={800}
                    className="w-full h-auto cursor-crosshair"
                    style={{ maxHeight: '600px' }}
                />

                {/* Legenda */}
                <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded p-2 text-xs">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span>Ativo (últimos 30s)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Movimento do mouse</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-400 rounded border border-dashed border-gray-600"></div>
                            <span>Inativo</span>
                        </div>
                    </div>
                </div>

                {/* Overlay de carregamento */}
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                )}
            </div>

            {/* Mensagens contextuais */}
            {showContextMessages && contextMessages.length > 0 && (
                <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">📝 Atividades Recentes</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {contextMessages.map((msg, index) => (
                            <div key={msg.session_id} className={`flex items-start gap-3 p-2 rounded text-sm ${msg.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                                    msg.type === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
                                        'bg-blue-50 border-l-4 border-blue-400'
                                }`}>
                                <span className="text-lg">{msg.icon}</span>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                        {msg.visitor_id}
                                    </div>
                                    <div className="text-gray-600">
                                        {msg.message}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {msg.page_views} páginas • {Math.floor(msg.duration / 60)}min • {msg.device_type}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal de detalhes do usuário */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Detalhes do Usuário</h3>
                        <div className="space-y-2 text-sm">
                            <div><strong>ID:</strong> {selectedUser.visitor_id}</div>
                            <div><strong>Dispositivo:</strong> {selectedUser.device_type}</div>
                            <div><strong>Duração:</strong> {Math.floor(selectedUser.duration / 60)} minutos</div>
                            <div><strong>Páginas:</strong> {selectedUser.page_views}</div>
                            <div><strong>Scroll Máx:</strong> {selectedUser.max_scroll_depth}%</div>
                            <div><strong>Última atividade:</strong> {new Date(selectedUser.last_activity).toLocaleString()}</div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagicMap;