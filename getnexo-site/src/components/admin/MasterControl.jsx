import React, { useState, useEffect } from 'react';
import './MasterControl.css';

const MasterControl = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [systemStatus, setSystemStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [globalSettings, setGlobalSettings] = useState({
        maintenanceMode: false,
        debugMode: false,
        emergencyStop: false
    });

    // System configurations
    const systemsConfig = {
        ai_gateway: {
            name: 'AI Gateway',
            description: 'Roteamento inteligente Multi-LLM',
            icon: '🤖',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                strategy: 'balanced',
                timeout: 30,
                retryAttempts: 3
            },
            metrics: {
                requests_today: 1250,
                avg_response_time: '1.2s',
                success_rate: '98.5%'
            }
        },
        weather_sales: {
            name: 'Weather Sales',
            description: 'Ofertas dinâmicas baseadas no clima',
            icon: '🌤️',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                api_key: 'configured',
                update_interval: 1800,
                discount_range: '10-25%'
            },
            metrics: {
                locations_active: 45,
                offers_generated: 892,
                conversion_rate: '12.3%'
            }
        },
        supply_oracle: {
            name: 'Supply Oracle',
            description: 'Gestão inteligente de estoque',
            icon: '📦',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                safety_stock_days: 7,
                reorder_point: 'auto',
                alerts_enabled: true
            },
            metrics: {
                products_tracked: 1250,
                alerts_today: 8,
                stock_accuracy: '97.2%'
            }
        },
        viral_launch: {
            name: 'Viral Launch',
            description: 'Automação de postagens simultâneas',
            icon: '🚀',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                platforms: ['twitter', 'instagram', 'linkedin'],
                auto_schedule: true,
                content_templates: 15
            },
            metrics: {
                campaigns_created: 23,
                posts_published: 156,
                engagement_rate: '8.7%'
            }
        },
        lighthouse_guard: {
            name: 'Lighthouse Guard',
            description: 'CI/CD Quality Gate',
            icon: '🏮',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                min_score: 98,
                block_deploy: true,
                auto_baseline: true
            },
            metrics: {
                checks_today: 12,
                passed_rate: '91.7%',
                avg_score: '96.2'
            }
        },
        neuro_ai_tuner: {
            name: 'Neuro AI Tuner',
            description: 'Otimização automática de parâmetros IA',
            icon: '🧠',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                models: ['claude-3-opus', 'gpt-4', 'gemini-pro'],
                auto_tune: true,
                feedback_window: 100
            },
            metrics: {
                optimizations_today: 45,
                avg_improvement: '+8.3%',
                models_tuned: 3
            }
        },
        knowledge_feed: {
            name: 'Knowledge Feed',
            description: 'Crawler RAG automático',
            icon: '🧠',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                sources: ['techcrunch', 'arxiv', 'reddit'],
                update_interval: 3600,
                chunk_size: 1000
            },
            metrics: {
                documents_ingested: 2847,
                sources_active: 8,
                search_requests: 156
            }
        },
        chaos_monkey: {
            name: 'Chaos Monkey',
            description: 'Testes de resiliência',
            icon: '🐒',
            status: 'inactive',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: false,
                dry_run: true,
                safe_hours: '02:00-06:00',
                max_concurrent: 1
            },
            metrics: {
                experiments_run: 12,
                recovery_rate: '95.8%',
                downtime_caused: '0.02%'
            }
        },
        ar_viewer: {
            name: 'AR Product Viewer',
            description: 'Visualizador de produtos em AR',
            icon: '🪄',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                webxr_required: true,
                fallback_mode: 'image_overlay',
                performance_mode: 'high'
            },
            metrics: {
                sessions_today: 234,
                avg_session_time: '2m 34s',
                conversion_rate: '4.2%'
            }
        },
        holo_agent: {
            name: 'Holo Agent',
            description: 'IA holográfica conversacional',
            icon: '🎭',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                voice_enabled: true,
                emotion_detection: true,
                auto_responses: true
            },
            metrics: {
                conversations_today: 89,
                avg_satisfaction: '4.7/5',
                response_accuracy: '94.2%'
            }
        },
        cursor_trail: {
            name: 'Cursor Trail',
            description: 'Partículas interativas com física',
            icon: '✨',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                particle_count: 80,
                physics_enabled: true,
                color_mode: 'neon'
            },
            metrics: {
                particles_active: 80,
                interactions_today: 1250,
                performance_impact: '2.3ms'
            }
        },
        sound_system: {
            name: 'Sound Feedback',
            description: 'Sistema áudio imersivo 3D',
            icon: '🔊',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                spatial_audio: true,
                voice_synthesis: true,
                master_volume: 0.7
            },
            metrics: {
                sounds_played: 2847,
                audio_sessions: 156,
                avg_load_time: '45ms'
            }
        },
        parallax_hero: {
            name: 'Parallax Hero',
            description: 'Hero com física de fluidos',
            icon: '🌊',
            status: 'active',
            version: '1.0.0',
            lastUpdated: '2024-01-21',
            settings: {
                enabled: true,
                fluid_physics: true,
                particle_density: 0.0003,
                color_scheme: 'ocean'
            },
            metrics: {
                fluid_cells: 1024,
                render_fps: 58,
                memory_usage: '12.3MB'
            }
        }
    };

    useEffect(() => {
        loadSystemStatus();
        const interval = setInterval(loadSystemStatus, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    const loadSystemStatus = async () => {
        try {
            // Simulate API call to get system status
            const response = await fetch('/api/admin/system-status');
            if (response.ok) {
                const data = await response.json();
                setSystemStatus(data);
            } else {
                // Use static data for demo
                setSystemStatus(systemsConfig);
            }
        } catch (error) {
            console.warn('Using static system data:', error);
            setSystemStatus(systemsConfig);
        }
        setLoading(false);
    };

    const updateSystemSetting = async (systemId, setting, value) => {
        try {
            const response = await fetch(`/api/admin/systems/${systemId}/settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [setting]: value })
            });

            if (response.ok) {
                setSystemStatus(prev => ({
                    ...prev,
                    [systemId]: {
                        ...prev[systemId],
                        settings: {
                            ...prev[systemId].settings,
                            [setting]: value
                        }
                    }
                }));
            }
        } catch (error) {
            console.error('Failed to update setting:', error);
        }
    };

    const toggleSystem = async (systemId) => {
        const currentStatus = systemStatus[systemId]?.settings?.enabled;
        await updateSystemSetting(systemId, 'enabled', !currentStatus);
    };

    const emergencyStop = async () => {
        if (confirm('⚠️ ATENÇÃO: Isso irá parar TODOS os sistemas críticos. Continuar?')) {
            try {
                await fetch('/api/admin/emergency-stop', { method: 'POST' });
                setGlobalSettings(prev => ({ ...prev, emergencyStop: true }));
                // Reload page after emergency stop
                setTimeout(() => window.location.reload(), 3000);
            } catch (error) {
                console.error('Emergency stop failed:', error);
            }
        }
    };

    const renderOverview = () => {
        const activeSystems = Object.values(systemStatus).filter(s => s.status === 'active').length;
        const totalSystems = Object.keys(systemStatus).length;

        return (
            <div className="overview-grid">
                <div className="overview-card">
                    <h3>📊 Status Geral</h3>
                    <div className="metrics-grid">
                        <div className="metric">
                            <span className="value">{activeSystems}/{totalSystems}</span>
                            <span className="label">Sistemas Ativos</span>
                        </div>
                        <div className="metric">
                            <span className="value">98.7%</span>
                            <span className="label">Uptime Global</span>
                        </div>
                        <div className="metric">
                            <span className="value">1.2s</span>
                            <span className="label">Response Time</span>
                        </div>
                    </div>
                </div>

                <div className="overview-card">
                    <h3>🚨 Alertas Críticos</h3>
                    <div className="alerts-list">
                        <div className="alert-item warning">
                            <span className="alert-icon">⚠️</span>
                            <span className="alert-text">Chaos Monkey está inativo</span>
                        </div>
                        <div className="alert-item info">
                            <span className="alert-icon">ℹ️</span>
                            <span className="alert-text">5 sistemas precisam de atualização</span>
                        </div>
                    </div>
                </div>

                <div className="overview-card">
                    <h3>🎯 Performance Hoje</h3>
                    <div className="performance-chart">
                        <div className="chart-bar">
                            <div className="bar-fill" style={{ width: '92%' }}></div>
                            <span className="bar-label">CPU: 92%</span>
                        </div>
                        <div className="chart-bar">
                            <div className="bar-fill" style={{ width: '78%' }}></div>
                            <span className="bar-label">Memory: 78%</span>
                        </div>
                        <div className="chart-bar">
                            <div className="bar-fill" style={{ width: '45%' }}></div>
                            <span className="bar-label">Storage: 45%</span>
                        </div>
                    </div>
                </div>

                <div className="overview-card">
                    <h3>🎮 Controles Globais</h3>
                    <div className="global-controls">
                        <label className="control-toggle">
                            <input
                                type="checkbox"
                                checked={globalSettings.maintenanceMode}
                                onChange={(e) => setGlobalSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                            />
                            <span className="toggle-slider"></span>
                            Modo Manutenção
                        </label>

                        <label className="control-toggle">
                            <input
                                type="checkbox"
                                checked={globalSettings.debugMode}
                                onChange={(e) => setGlobalSettings(prev => ({ ...prev, debugMode: e.target.checked }))}
                            />
                            <span className="toggle-slider"></span>
                            Modo Debug
                        </label>

                        <button
                            className="emergency-btn"
                            onClick={emergencyStop}
                            disabled={globalSettings.emergencyStop}
                        >
                            🚨 PARADA DE EMERGÊNCIA
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSystems = () => {
        return (
            <div className="systems-grid">
                {Object.entries(systemStatus).map(([systemId, system]) => (
                    <div key={systemId} className={`system-card ${system.status}`}>
                        <div className="system-header">
                            <div className="system-icon">{system.icon}</div>
                            <div className="system-info">
                                <h3>{system.name}</h3>
                                <p>{system.description}</p>
                                <span className={`status-badge ${system.status}`}>
                                    {system.status === 'active' ? '✅ Ativo' : '❌ Inativo'}
                                </span>
                            </div>
                            <label className="system-toggle">
                                <input
                                    type="checkbox"
                                    checked={system.settings?.enabled || false}
                                    onChange={() => toggleSystem(systemId)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="system-content">
                            <div className="system-settings">
                                <h4>⚙️ Configurações</h4>
                                {Object.entries(system.settings || {}).map(([key, value]) => (
                                    <div key={key} className="setting-item">
                                        <label>{key.replace(/_/g, ' ').toUpperCase()}</label>
                                        {typeof value === 'boolean' ? (
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) => updateSystemSetting(systemId, key, e.target.checked)}
                                            />
                                        ) : typeof value === 'number' ? (
                                            <input
                                                type="number"
                                                value={value}
                                                onChange={(e) => updateSystemSetting(systemId, key, parseFloat(e.target.value))}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => updateSystemSetting(systemId, key, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="system-metrics">
                                <h4>📊 Métricas</h4>
                                {Object.entries(system.metrics || {}).map(([key, value]) => (
                                    <div key={key} className="metric-item">
                                        <span className="metric-label">{key.replace(/_/g, ' ').toUpperCase()}</span>
                                        <span className="metric-value">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="system-actions">
                                <button className="btn-secondary">📝 Editar</button>
                                <button className="btn-secondary">🔄 Reiniciar</button>
                                <button className="btn-danger">🗑️ Remover</button>
                            </div>
                        </div>

                        <div className="system-footer">
                            <span>v{system.version}</span>
                            <span>Atualizado: {system.lastUpdated}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando Master Control...</p>
            </div>
        );
    }

    return (
        <div className="master-control">
            <div className="control-tabs">
                <button
                    className={activeTab === 'overview' ? 'active' : ''}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Visão Geral
                </button>
                <button
                    className={activeTab === 'systems' ? 'active' : ''}
                    onClick={() => setActiveTab('systems')}
                >
                    🎛️ Sistemas
                </button>
                <button
                    className={activeTab === 'workflows' ? 'active' : ''}
                    onClick={() => setActiveTab('workflows')}
                >
                    ⚡ Workflows
                </button>
                <button
                    className={activeTab === 'analytics' ? 'active' : ''}
                    onClick={() => setActiveTab('analytics')}
                >
                    📈 Analytics
                </button>
                <button
                    className={activeTab === 'logs' ? 'active' : ''}
                    onClick={() => setActiveTab('logs')}
                >
                    📋 Logs
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'systems' && renderSystems()}
                {activeTab === 'workflows' && (
                    <div className="coming-soon">
                        <h2>⚡ Workflows N8n</h2>
                        <p>Controle de automação avançada em desenvolvimento...</p>
                    </div>
                )}
                {activeTab === 'analytics' && (
                    <div className="coming-soon">
                        <h2>📈 Analytics Avançado</h2>
                        <p>Dashboard de métricas em desenvolvimento...</p>
                    </div>
                )}
                {activeTab === 'logs' && (
                    <div className="coming-soon">
                        <h2>📋 System Logs</h2>
                        <p>Visualização de logs em desenvolvimento...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MasterControl;