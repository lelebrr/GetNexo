
import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [subSection, setSubSection] = useState('');
    const [stats, setStats] = useState({ storage: '0 MB', apiCalls: 0 });
    const [users, setUsers] = useState([]);

    // Fetch initial data
    useEffect(() => {
        fetch('https://api.getnexo.com.br/dashboard-stats')
            .then(res => res.json())
            .then(data => setStats(data));
    }, []);

    const MenuItem = ({ icon, label, id, subs = [] }) => (
        <div className="mb-2">
            <div
                onClick={() => { setActiveSection(id); setSubSection(''); }}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${activeSection === id ? 'bg-neon-blue/20 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
            >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
                {subs.length > 0 && <span className="ml-auto text-xs">▼</span>}
            </div>
            {activeSection === id && subs.length > 0 && (
                <div className="ml-9 border-l border-gray-700 pl-4 space-y-2 mt-1">
                    {subs.map(s => (
                        <div
                            key={s.id}
                            onClick={(e) => { e.stopPropagation(); setSubSection(s.id); }}
                            className={`text-sm cursor-pointer hover:text-white ${subSection === s.id ? 'text-neon-blue' : 'text-gray-500'}`}
                        >
                            {s.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex h-[80vh] bg-black/40 rounded-2xl border border-gray-800 overflow-hidden">

            {/* Sidebar (Zendesk Style) */}
            <div className="w-64 bg-gray-900/50 p-4 border-r border-gray-800 flex flex-col overflow-y-auto custom-scrollbar">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Central de Administração</h3>

                <MenuItem icon="🏠" label="Página inicial" id="home" />
                <MenuItem icon="🏢" label="Conta" id="account" subs={[
                    { id: 'usage', label: 'Uso e Cobrança' },
                    { id: 'security', label: 'Segurança' },
                    { id: 'api', label: 'API' }
                ]} />
                <MenuItem icon="👥" label="Pessoas" id="people" subs={[
                    { id: 'team', label: 'Equipe' },
                    { id: 'groups', label: 'Grupos' },
                    { id: 'end-users', label: 'Usuários Finais' }
                ]} />
                <MenuItem icon="⇄" label="Canais" id="channels" subs={[
                    { id: 'messaging', label: 'Mensagens (WhatsApp)' },
                    { id: 'email', label: 'Email' },
                    { id: 'web', label: 'Web Widget' }
                ]} />

                <MenuItem icon="✨" label="IA" id="ai_admin" subs={[
                    { id: 'ai_agents', label: 'Agentes de IA' },
                    { id: 'ai_copilot', label: 'Copiloto do administrador' },
                    { id: 'ai_triage', label: 'Triagem inteligente' }
                ]} />

                <MenuItem icon="🖥️" label="Espaços de trabalho" id="workspaces" subs={[
                    { id: 'agent_tools', label: 'Ferramentas de agente' },
                    { id: 'macros_admin', label: 'Macros' },
                    { id: 'views', label: 'Visualizações' },
                    { id: 'agent_interface', label: 'Interface do agente' }
                ]} />

                <MenuItem icon="📦" label="Objetos e regras" id="objects" subs={[
                    { id: 'tickets', label: 'Tickets' },
                    { id: 'routing', label: 'Encaminhamento omnichannel' },
                    { id: 'triggers', label: 'Gatilhos' },
                    { id: 'automations', label: 'Automações' },
                    { id: 'slas', label: 'Contratos de nível de serviço (SLA)' }
                ]} />

                <MenuItem icon="📈" label="Marketing & Analytics" id="marketing" subs={[
                    { id: 'retargeting', label: 'Retargeting' },
                    { id: 'ads', label: 'Click-to-WhatsApp Ads' },
                    { id: 'clicks', label: 'Rastreamento de Cliques' },
                    { id: 'csat', label: 'Relatório CSAT' }
                ]} />

                <MenuItem icon="🔌" label="Aplicativos e integrações" id="apps" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">

                {/* HEADERS */}
                <div className="mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-bold text-white">
                        {activeSection === 'home' && 'Central de Administração'}
                        {activeSection === 'account' && 'Conta'}
                        {activeSection === 'people' && 'Gerenciar Pessoas'}
                        {activeSection === 'channels' && 'Canais de Atendimento'}
                    </h1>
                    <p className="text-gray-400 mt-2">Gerencie as configurações da sua conta OmniChat.</p>
                </div>

                {/* HOME DASHBOARD */}
                {activeSection === 'home' && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo, Admin</h2>
                            <p className="text-gray-400">Aqui está o resumo da sua operação hoje.</p>
                        </div>

                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-4 gap-4">
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

                        {/* Storage and API Usage */}
                        <div className="grid grid-cols-2 gap-6">
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
                )}

                {/* CHANNELS (Evolution Status) */}
                {activeSection === 'channels' && (
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#25D366] p-3 rounded-lg"><span className="text-2xl text-black font-bold">W</span></div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">WhatsApp Primário (Porta 3000)</h3>
                                    <p className="text-gray-400 text-sm">Instância Evolution API 1</p>
                                </div>
                            </div>
                            <button onClick={() => window.open('https://evolution.getnexo.com.br', '_blank')} className="border border-gray-600 hover:border-white text-white px-4 py-2 rounded transition-colors">Configurar</button>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#25D366] p-3 rounded-lg"><span className="text-2xl text-black font-bold">W2</span></div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">WhatsApp Secundário (Porta 3001)</h3>
                                    <p className="text-gray-400 text-sm">Instância Evolution API 2 (Revenda/Suporte)</p>
                                </div>
                            </div>
                            <button onClick={() => window.open('https://evolution.getnexo.com.br', '_blank')} className="border border-gray-600 hover:border-white text-white px-4 py-2 rounded transition-colors">Configurar</button>
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
                )}

                {/* AI ADMIN */}
                {activeSection === 'ai_admin' && (
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-2">Agentes de IA</h3>
                            <p className="text-gray-400 mb-4">Automatize conversas e resolva tickets instantaneamente.</p>
                            <label className="flex items-center gap-3 bg-black/40 p-4 rounded border border-gray-700">
                                <input type="checkbox" checked readOnly className="w-5 h-5 accent-neon-blue" />
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

                {/* MARKETING */}
                {activeSection === 'marketing' && (
                    <div className="space-y-6">
                        {subSection === 'retargeting' && (
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                                <h3 className="text-xl font-bold text-white mb-2">Retargeting Automático</h3>
                                <p className="text-gray-400 mb-4">Re-enviar mensagem para usuários que não leram a campanha anterior (últimos 7 dias).</p>
                                <button
                                    onClick={async () => {
                                        const res = await fetch('https://api.getnexo.com.br/retarget', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaign_id: '1' }) });
                                        const data = await res.json();
                                        alert(`Campanha de Retargeting enviada! ${data.unread} contatos impactados.`);
                                    }}
                                    className="bg-orange-500 text-white font-bold px-6 py-3 rounded hover:bg-orange-600 transition-colors"
                                >
                                    📢 Disparar Retargeting Agora
                                </button>
                            </div>
                        )}

                        {subSection === 'ads' && (
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                                <h3 className="text-xl font-bold text-white mb-2">Gerador de Link (Ads)</h3>
                                <p className="text-gray-400 mb-4">Gerar link para anúncios Click-to-WhatsApp.</p>
                                <div className="flex flex-col gap-4 max-w-md">
                                    <input id="ad-phone" placeholder="Número (ex: 5511999999999)" className="bg-black/40 border border-gray-700 p-3 rounded text-white" />
                                    <button
                                        onClick={async () => {
                                            const phone = document.getElementById('ad-phone').value;
                                            const res = await fetch(`https://api.getnexo.com.br/ad-link?phone=${phone}`);
                                            const data = await res.json();
                                            document.getElementById('generated-link').value = data.link;
                                        }}
                                        className="bg-neon-blue text-black font-bold px-4 py-2 rounded"
                                    >
                                        🔗 Gerar Link
                                    </button>
                                    <div className="bg-black p-3 rounded border border-gray-800">
                                        <p className="text-xs text-gray-500 mb-1">Seu Link:</p>
                                        <input id="generated-link" readOnly className="w-full bg-transparent text-green-400 font-mono text-sm focus:outline-none" placeholder="..." />
                                    </div>
                                </div>
                            </div>
                        )}

                        {subSection === 'clicks' && (
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                                <h3 className="text-xl font-bold text-white mb-2">Relatório de Cliques (CTAs)</h3>
                                <div id="clicks-report" className="space-y-2 mt-4">
                                    <div className="animate-pulse text-gray-500">Carregando dados...</div>
                                </div>
                                <button
                                    onClick={async () => {
                                        const res = await fetch('https://api.getnexo.com.br/clicks');
                                        const data = await res.json();
                                        const container = document.getElementById('clicks-report');
                                        if (data.length === 0) {
                                            container.innerHTML = '<div class="text-gray-500">Nenhum clique registrado ainda.</div>';
                                            return;
                                        }
                                        container.innerHTML = data.map(c => `
                                            <div class="flex justify-between items-center bg-gray-800/50 p-3 rounded border border-gray-700">
                                                <span class="text-neon-blue font-mono">${c.cta_id}</span>
                                                <span class="text-gray-400 text-sm">${new Date(c.timestamp).toLocaleString()}</span>
                                            </div>
                                        `).join('');
                                    }}
                                    className="mt-4 text-sm text-neon-blue underline cursor-pointer"
                                >
                                    ↻ Atualizar Relatório
                                </button>
                            </div>
                        )}

                        {subSection === 'csat' && (
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                                <h3 className="text-xl font-bold text-white mb-2">Relatório CSAT</h3>
                                <div id="csat-summary" className="text-4xl font-bold text-white mb-4">- / 5.0</div>
                                <div id="csat-list" className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    <div className="animate-pulse text-gray-500">Carregando...</div>
                                </div>
                                <button
                                    onClick={async () => {
                                        const res = await fetch('https://api.getnexo.com.br/csat-report');
                                        const data = await res.json();
                                        const avg = data.reduce((s, a) => s + a.nota, 0) / (data.length || 1);
                                        document.getElementById('csat-summary').innerText = list = `${avg.toFixed(1)} / 5.0`;

                                        document.getElementById('csat-list').innerHTML = data.map(c => `
                                            <div class="flex justify-between items-center bg-gray-800/50 p-2 rounded">
                                                <span class="text-gray-300">${c.phone}</span>
                                                <span class="text-yellow-400 font-bold">★ ${c.nota}</span>
                                            </div>
                                        `).join('');
                                    }}
                                    className="mt-4 text-sm text-neon-blue underline cursor-pointer"
                                >
                                    ↻ Atualizar Dados
                                </button>
                            </div>
                        )}

                        {activeSection === 'marketing' && !subSection && (
                            <div className="text-center text-gray-500 mt-20">
                                <h2 className="text-2xl font-bold text-gray-400">Marketing & Analytics</h2>
                                <p>Selecione uma ferramenta no menu lateral.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* WORKSPACES & OBJECTS (Generic Placeholder) */}
                {(activeSection === 'workspaces' || activeSection === 'objects') && (
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-gray-900 border border-gray-800 p-4 rounded-xl hover:border-gray-600 cursor-pointer transition-colors">
                                <div className="w-8 h-8 bg-gray-800 rounded mb-3"></div>
                                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                                <div className="h-2 bg-gray-800 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TEAM (Mock) */}
                {activeSection === 'people' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
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
                        <div className="p-4 border-t border-gray-800">
                            <button className="bg-neon-blue text-black font-bold px-4 py-2 rounded hover:opacity-90">Adicionar Membro</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminPanel;
