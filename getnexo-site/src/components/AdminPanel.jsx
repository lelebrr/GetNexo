
import React, { useState, useEffect, memo, useCallback } from 'react';

// --- Sub-components (Memoized for performance) ---

const MenuItem = memo(({ icon, label, id, activeSection, subSection, subs = [], setActiveSection, setSubSection }) => (
    <div className="mb-2">
        <button
            aria-expanded={activeSection === id}
            aria-controls={`submenu-${id}`}
            onClick={() => { setActiveSection(id); setSubSection(''); }}
            className={`w-full flex items-center gap-3 p-2 rounded cursor-pointer transition-colors text-left ${activeSection === id ? 'bg-neon-blue/20 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
        >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
            {subs.length > 0 && <span className="ml-auto text-xs">▼</span>}
        </button>
        {activeSection === id && subs.length > 0 && (
            <div id={`submenu-${id}`} className="ml-9 border-l border-gray-700 pl-4 space-y-2 mt-1" role="group">
                {subs.map(s => (
                    <button
                        key={s.id}
                        onClick={(e) => { e.stopPropagation(); setSubSection(s.id); }}
                        className={`block w-full text-left text-sm cursor-pointer hover:text-white transition-colors ${subSection === s.id ? 'text-neon-blue font-medium' : 'text-gray-500'}`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        )}
    </div>
));

const HomeDashboard = memo(({ stats }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo, Admin</h2>
            <p className="text-gray-400">Aqui está o resumo da sua operação hoje.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Tickets Abertos</h4>
                <div className="text-3xl font-bold text-white">{stats.open_tickets || 0}</div>
                <div className="text-xs text-green-500 mt-1">● Em atendimento</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">CSAT (Satisfação)</h4>
                <div className="text-3xl font-bold text-white">{stats.csat ? Number(stats.csat).toFixed(1) : '0.0'}</div>
                <div className="text-xs text-gray-500 mt-1">Média geral</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Vendas Totais</h4>
                <div className="text-3xl font-bold text-neon-green">R$ {stats.sales ? Number(stats.sales).toFixed(2) : '0.00'}</div>
                <div className="text-xs text-gray-500 mt-1">Via PIX/Chat</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Total Tickets</h4>
                <div className="text-3xl font-bold text-white">{stats.tickets || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Histórico completo</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h3 className="text-neon-blue font-bold mb-4">Uso do Armazenamento</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Dados de tickets</span>
                            <span>{stats.storage} / 500 MB</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-neon-blue w-[10%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Arquivos</span>
                            <span>12 MB / 10 GB</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[1%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h3 className="text-neon-green font-bold mb-4">Uso da API (últimos 7 dias)</h3>
                <div className="text-4xl font-mono text-white mb-2">{stats.apiCalls}</div>
                <p className="text-sm text-gray-500">Requisições processadas com sucesso.</p>
                <div className="mt-4 flex gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">0% Erros 429</span>
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">Status Operacional</span>
                </div>
            </div>
        </div>
    </div>
));

const ChannelsSection = memo(() => {
    const handleConfig = useCallback((url) => window.open(url, '_blank'), []);

    return (
        <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-[#25D366] p-3 rounded-lg"><span className="text-2xl text-black font-bold">W</span></div>
                    <div>
                        <h3 className="font-bold text-white text-lg">WhatsApp Primário (Porta 3000)</h3>
                        <p className="text-gray-400 text-sm">Instância Evolution API 1</p>
                    </div>
                </div>
                <button onClick={() => handleConfig('https://evolution.getnexo.com.br')} className="border border-gray-600 hover:border-white text-white px-4 py-2 rounded transition-colors">Configurar</button>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-[#25D366] p-3 rounded-lg"><span className="text-2xl text-black font-bold">W2</span></div>
                    <div>
                        <h3 className="font-bold text-white text-lg">WhatsApp Secundário (Porta 3001)</h3>
                        <p className="text-gray-400 text-sm">Instância Evolution API 2 (Revenda/Suporte)</p>
                    </div>
                </div>
                <button onClick={() => handleConfig('https://evolution.getnexo.com.br')} className="border border-gray-600 hover:border-white text-white px-4 py-2 rounded transition-colors">Configurar</button>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl opacity-50">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-500 p-3 rounded-lg"><span className="text-2xl text-white font-bold">F</span></div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Facebook Messenger</h3>
                        <p className="text-gray-400 text-sm">Em breve (Roadmap v2.0)</p>
                    </div>
                </div>
                <button className="cursor-not-allowed border border-gray-700 text-gray-500 px-4 py-2 rounded">Indisponível</button>
            </div>
        </div>
    );
});

const MarketingSection = memo(({ subSection }) => {
    const [adPhone, setAdPhone] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [clicksData, setClicksData] = useState([]);
    const [isClicksLoading, setIsClicksLoading] = useState(false);
    const [csatData, setCsatData] = useState([]);
    const [csatAvg, setCsatAvg] = useState(0);
    const [isCsatLoading, setIsCsatLoading] = useState(false);

    const runRetargeting = useCallback(async () => {
        try {
            const res = await fetch('/api/marketing/retarget', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaign_id: '1' }) });
            const data = await res.json();
            alert(`Campanha de Retargeting enviada! ${data.unread} contatos impactados.`);
        } catch (e) { alert('Erro ao disparar retargeting.'); }
    }, []);

    const generateAdLink = useCallback(async () => {
        if (!adPhone) return;
        try {
            const res = await fetch(`/api/marketing/ad-link?phone=${adPhone}`);
            const data = await res.json();
            setGeneratedLink(data.link);
        } catch (e) { alert('Erro ao gerar link.'); }
    }, [adPhone]);

    const fetchClicks = useCallback(async () => {
        setIsClicksLoading(true);
        try {
            const res = await fetch('/api/marketing/clicks');
            const data = await res.json();
            setClicksData(data);
        } catch (e) { console.error(e); }
        finally { setIsClicksLoading(false); }
    }, []);

    const fetchCsat = useCallback(async () => {
        setIsCsatLoading(true);
        try {
            const res = await fetch('/api/marketing/csat-report');
            const data = await res.json();
            const avg = data.reduce((s, a) => s + a.nota, 0) / (data.length || 1);
            setCsatData(data);
            setCsatAvg(avg);
        } catch (e) { console.error(e); }
        finally { setIsCsatLoading(false); }
    }, []);

    useEffect(() => {
        if (subSection === 'clicks') fetchClicks();
        if (subSection === 'csat') fetchCsat();
    }, [subSection, fetchClicks, fetchCsat]);

    return (
        <div className="space-y-6">
            {subSection === 'retargeting' && (
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-2">Retargeting Automático</h3>
                    <p className="text-gray-400 mb-4">Re-enviar mensagem para usuários que não leram a campanha anterior (últimos 7 dias).</p>
                    <button onClick={runRetargeting} className="bg-orange-500 text-white font-bold px-6 py-3 rounded hover:bg-orange-600 transition-colors">📢 Disparar Retargeting Agora</button>
                </div>
            )}

            {subSection === 'ads' && (
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-2">Gerador de Link (Ads)</h3>
                    <p className="text-gray-400 mb-4">Gerar link para anúncios Click-to-WhatsApp.</p>
                    <div className="flex flex-col gap-4 max-w-md">
                        <input value={adPhone} onChange={(e) => setAdPhone(e.target.value)} placeholder="Número (ex: 5511999999999)" className="bg-black/40 border border-gray-700 p-3 rounded text-white" />
                        <button onClick={generateAdLink} className="bg-neon-blue text-black font-bold px-4 py-2 rounded">🔗 Gerar Link</button>
                        <div className="bg-black p-3 rounded border border-gray-800">
                            <p className="text-xs text-gray-500 mb-1">Seu Link:</p>
                            <input value={generatedLink} readOnly className="w-full bg-transparent text-green-400 font-mono text-sm focus:outline-none" placeholder="..." />
                        </div>
                    </div>
                </div>
            )}

            {subSection === 'clicks' && (
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-2">Relatório de Cliques (CTAs)</h3>
                    <div className="space-y-2 mt-4">
                        {isClicksLoading ? (
                            <div className="animate-pulse text-gray-500">Carregando dados...</div>
                        ) : clicksData.length === 0 ? (
                            <div className="text-gray-500">Nenhum clique registrado ainda.</div>
                        ) : (
                            clicksData.map((c, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-800/50 p-3 rounded border border-gray-700">
                                    <span className="text-neon-blue font-mono">{c.cta_id}</span>
                                    <span className="text-gray-400 text-sm">{new Date(c.timestamp).toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <button onClick={fetchClicks} className="mt-4 text-sm text-neon-blue underline cursor-pointer bg-transparent border-none">↻ Atualizar Relatório</button>
                </div>
            )}

            {subSection === 'csat' && (
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-2">Relatório CSAT</h3>
                    <div className="text-4xl font-bold text-white mb-4">{csatAvg.toFixed(1)} / 5.0</div>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {isCsatLoading ? (
                            <div className="animate-pulse text-gray-500">Carregando...</div>
                        ) : (
                            csatData.map((c, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-800/50 p-2 rounded">
                                    <span className="text-gray-300">{c.phone}</span>
                                    <span className="text-yellow-400 font-bold">★ {c.nota}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <button onClick={fetchCsat} className="mt-4 text-sm text-neon-blue underline cursor-pointer bg-transparent border-none">↻ Atualizar Dados</button>
                </div>
            )}

            {!subSection && (
                <div className="text-center text-gray-500 mt-20">
                    <h2 className="text-2xl font-bold text-gray-400">Marketing & Analytics</h2>
                    <p>Selecione uma ferramenta no menu lateral.</p>
                </div>
            )}
        </div>
    );
});

// --- Main Component ---

const AdminPanel = ({ initialSection = 'home', initialSubSection = '', hideSidebar = false }) => {
    const [activeSection, setActiveSection] = useState(initialSection);
    const [subSection, setSubSection] = useState(initialSubSection);
    const [stats, setStats] = useState({ storage: '0 MB', apiCalls: 0 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Sync state with prop changes if needed (optional but helpful for Astro routing)
    useEffect(() => {
        if (initialSection) setActiveSection(initialSection);
        if (initialSubSection) setSubSection(initialSubSection);
    }, [initialSection, initialSubSection]);

    useEffect(() => {
        fetch('/api/analytics?type=dashboard')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(e => console.error("Error fetching stats:", e));
    }, []);

    const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

    return (
        <div className="flex flex-col lg:flex-row h-full glass-panel overflow-hidden relative min-h-[600px]">

            {/* Mobile Header Toggle */}
            {!hideSidebar && (
                <div className="lg:hidden p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <span className="font-bold text-white">Menu</span>
                    <button
                        onClick={toggleSidebar}
                        className="text-white text-2xl focus-visible:ring-2 focus-visible:outline-none rounded"
                        aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
                    >
                        <span aria-hidden="true">{isSidebarOpen ? '✖' : '☰'}</span>
                    </button>
                </div>
            )}

            {/* Sidebar */}
            {!hideSidebar && (
                <div className={`absolute lg:relative z-50 h-full w-64 bg-gray-900/95 lg:bg-gray-900/50 p-4 border-r border-gray-800 flex flex-col overflow-y-auto custom-scrollbar transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Central de Administração</h3>

                    <MenuItem icon="🏠" label="Página inicial" id="home" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} />
                    <MenuItem icon="🏢" label="Conta" id="account" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} subs={[
                        { id: 'usage', label: 'Uso e Cobrança' },
                        { id: 'security', label: 'Segurança' },
                        { id: 'api', label: 'API' }
                    ]} subSection={subSection} />
                    <MenuItem icon="👥" label="Pessoas" id="people" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} subs={[
                        { id: 'team', label: 'Equipe' },
                        { id: 'groups', label: 'Grupos' },
                        { id: 'end-users', label: 'Usuários Finais' }
                    ]} subSection={subSection} />
                    <MenuItem icon="⇄" label="Canais" id="channels" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} subs={[
                        { id: 'messaging', label: 'Mensagens (WhatsApp)' },
                        { id: 'email', label: 'Email' },
                        { id: 'web', label: 'Web Widget' }
                    ]} subSection={subSection} />

                    <MenuItem icon="✨" label="IA" id="ai_admin" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} subs={[
                        { id: 'ai_agents', label: 'Agentes de IA' },
                        { id: 'ai_copilot', label: 'Copiloto do administrador' },
                        { id: 'ai_triage', label: 'Triagem inteligente' }
                    ]} subSection={subSection} />

                    <MenuItem icon="🖥️" label="Espaços de trabalho" id="workspaces" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} subs={[
                        { id: 'agent_tools', label: 'Ferramentas de agente' },
                        { id: 'macros_admin', label: 'Macros' },
                        { id: 'views', label: 'Visualizações' },
                        { id: 'agent_interface', label: 'Interface do agente' }
                    ]} subSection={subSection} />

                    <MenuItem icon="📦" label="Objetos e regras" id="objects" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} subs={[
                        { id: 'tickets', label: 'Tickets' },
                        { id: 'routing', label: 'Encaminhamento omnichannel' },
                        { id: 'triggers', label: 'Gatilhos' },
                        { id: 'automations', label: 'Automações' },
                        { id: 'slas', label: 'Contratos de nível de serviço (SLA)' }
                    ]} subSection={subSection} />

                    <MenuItem icon="📈" label="Marketing & Analytics" id="marketing" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} subs={[
                        { id: 'retargeting', label: 'Retargeting' },
                        { id: 'ads', label: 'Click-to-WhatsApp Ads' },
                        { id: 'clicks', label: 'Rastreamento de Cliques' },
                        { id: 'csat', label: 'Relatório CSAT' }
                    ]} subSection={subSection} />

                    <MenuItem icon="🔌" label="Aplicativos e integrações" id="apps" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} />
                    <MenuItem icon="🤖" label="Protocolos A2A & AP2" id="a2a_protocol" activeSection={activeSection} setActiveSection={setActiveSection} setSubSection={setSubSection} />
                </div>
            )}

            {/* Overlay for Mobile */}
            {!hideSidebar && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Content Area */}
            <div className="flex-1 p-4 lg:p-8 overflow-y-auto w-full custom-scrollbar">

                {/* HEADERS */}
                <div className="mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-bold text-white">
                        {activeSection === 'home' && 'Central de Administração'}
                        {activeSection === 'account' && 'Conta'}
                        {activeSection === 'people' && 'Gerenciar Pessoas'}
                        {activeSection === 'channels' && 'Canais de Atendimento'}
                        {activeSection === 'ai_admin' && 'Inteligência Artificial'}
                        {activeSection === 'workspaces' && 'Espaços de Trabalho'}
                        {activeSection === 'objects' && 'Objetos e Regras'}
                        {activeSection === 'marketing' && 'Marketing & Analytics'}
                        {activeSection === 'apps' && 'Aplicativos e Integrações'}
                    </h1>
                    <p className="text-gray-400 mt-2">Gerencie as configurações da sua conta OmniChat.</p>
                </div>

                {/* SECTIONS */}
                {activeSection === 'home' && <HomeDashboard stats={stats} />}
                {activeSection === 'channels' && <ChannelsSection />}
                {activeSection === 'marketing' && <MarketingSection subSection={subSection} />}
                {activeSection === 'a2a_protocol' && (
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-2">Protocolo A2A (Agent-to-Agent)</h3>
                            <p className="text-gray-400 mb-4">Gerencie como seu agente interage com outros agentes de IA.</p>
                            <div className="bg-black/40 p-4 rounded border border-gray-700">
                                <p className="text-xs text-blue-400 font-mono">Status: Ativo / .well-known configurado</p>
                            </div>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-2">AP2 Agent Payments</h3>
                            <p className="text-gray-400 mb-4">Configure mandatos VDC para transações autônomas.</p>
                            <button onClick={() => window.location.href = '/admin/a2a'} className="bg-blue-600 text-white font-bold px-4 py-2 rounded">Abrir Gestão Completa</button>
                        </div>
                    </div>
                )}

                {activeSection === 'ai_admin' && (
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-2">Agentes de IA</h3>
                            <p className="text-gray-400 mb-4">Automatize conversas e resolva tickets instantaneamente.</p>
                            <label className="flex items-center gap-3 bg-black/40 p-4 rounded border border-gray-700 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-5 h-5 accent-neon-blue" />
                                <span className="text-gray-200">Ativar respostas generativas (GPT-4)</span>
                            </label>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-2">Triagem Inteligente</h3>
                            <p className="text-gray-400">Classificar automaticamente intenção e sentimento.</p>
                            <div className="mt-4 flex gap-2">
                                <span className="bg-gray-800 px-3 py-1 rounded text-xs">Intenção</span>
                                <span className="bg-gray-800 px-3 py-1 rounded text-xs">Idioma</span>
                                <span className="bg-gray-800 px-3 py-1 rounded text-xs">Sentimento</span>
                            </div>
                        </div>
                    </div>
                )}

                {(activeSection === 'workspaces') && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-neon-blue transition-colors group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-neon-blue/20 p-3 rounded-lg"><span className="text-xl">🛠️</span></div>
                                    <h3 className="font-bold text-white text-lg">Ferramentas de Agente</h3>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">Gerencie as ferramentas disponíveis para os atendentes durante o chat.</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-gray-800 px-2 py-1 rounded text-[10px] text-gray-300">Base de Conhecimento</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-[10px] text-gray-300">Editor de Imagens</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-[10px] text-gray-300">Calculadora</span>
                                </div>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-purple-500 transition-colors group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-purple-500/20 p-3 rounded-lg"><span className="text-xl">⚡</span></div>
                                    <h3 className="font-bold text-white text-lg">Macros de Resposta</h3>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">Atalhos para respostas rápidas e ações frequentes.</p>
                                <button className="text-xs text-purple-400 font-bold hover:underline">Ver todas as 24 macros →</button>
                            </div>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                            <h3 className="font-bold text-white mb-4">Visualizações de Fila</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-800">
                                    <span className="text-sm text-gray-300">Meus tickets abertos</span>
                                    <span className="bg-neon-blue text-black text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-800">
                                    <span className="text-sm text-gray-300">Não atribuídos</span>
                                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(activeSection === 'objects') && (
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-4">Configuração de Tickets</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-black/40 border border-gray-700 rounded-lg">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Campos Customizados</p>
                                    <p className="text-2xl font-bold text-white">15</p>
                                </div>
                                <div className="p-4 bg-black/40 border border-gray-700 rounded-lg">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Tipos de Ticket</p>
                                    <p className="text-2xl font-bold text-white">4</p>
                                </div>
                                <div className="p-4 bg-black/40 border border-gray-700 rounded-lg">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Status Personalizados</p>
                                    <p className="text-2xl font-bold text-white">6</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-emerald-500 transition-colors">
                                <h3 className="font-bold text-white mb-2">Gatilhos (Triggers)</h3>
                                <p className="text-gray-400 text-sm mb-4">Ações automáticas disparadas por eventos específicos.</p>
                                <div className="text-xs text-emerald-400">8 Gatilhos ativos</div>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-yellow-500 transition-colors">
                                <h3 className="font-bold text-white mb-2">Automations (Time-based)</h3>
                                <p className="text-gray-400 text-sm mb-4">Ações baseadas em tempo (ex: fechar ticket após 24h).</p>
                                <div className="text-xs text-yellow-500">3 Automações ativas</div>
                            </div>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                            <h3 className="font-bold text-white mb-2">SLA (Service Level Agreement)</h3>
                            <p className="text-gray-400 text-sm mb-4">Metas de tempo para primeira resposta e resolução.</p>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[92%]"></div>
                                </div>
                                <span className="text-xs font-bold text-emerald-400">92% de adesão</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'people' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-800 text-gray-400 text-sm">
                                    <tr>
                                        <th className="p-4">Nome / Email</th>
                                        <th className="p-4">Função</th>
                                        <th className="p-4">Ultimo Login</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="p-4"><strong>Admin</strong><br /><span className="text-xs text-gray-500">admin@getnexo.local</span></td>
                                        <td className="p-4"><span className="bg-neon-blue/20 text-neon-blue px-2 py-1 rounded text-xs font-bold">Administrador</span></td>
                                        <td className="p-4">Agora</td>
                                        <td className="p-4"><span className="text-green-500">● Ativo</span></td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50">
                                        <td className="p-4"><strong>Suporte N1</strong><br /><span className="text-xs text-gray-500">suporte@getnexo.local</span></td>
                                        <td className="p-4"><span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Agente</span></td>
                                        <td className="p-4">Há 2 dias</td>
                                        <td className="p-4"><span className="text-yellow-500">● Ausente</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-gray-800">
                            <button className="bg-neon-blue text-black font-bold px-4 py-2 rounded hover:opacity-90">Adicionar Membro</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default memo(AdminPanel);
