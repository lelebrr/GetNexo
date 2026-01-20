import React, { useState, useEffect } from 'react';

const FlowBuilder = () => {
    const [flows, setFlows] = useState([]);
    const [selectedFlow, setSelectedFlow] = useState(null);
    const [nodes, setNodes] = useState([]);

    // Real API Fetch
    useEffect(() => {
        fetchFlows();
    }, []);

    const fetchFlows = async () => {
        try {
            const res = await fetch('https://api.getnexo.com.br/flows');
            const data = await res.json();
            setFlows(data);
        } catch (e) { }
    };

    const handleSave = async () => {
        if (!selectedFlow) return;
        const method = selectedFlow.id === 'new' ? 'POST' : 'PUT';
        const url = selectedFlow.id === 'new' ? 'https://api.getnexo.com.br/flows' : `https://api.getnexo.com.br/flows/${selectedFlow.id}`;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...selectedFlow, nodes })
        });
        alert('Fluxo Salvo!');
        fetchFlows();
    };

    const addNode = (type) => {
        const nodeConfigs = {
            message: { content: '', placeholder: 'Digite a mensagem...' },
            question: { content: '', placeholder: 'Digite a pergunta...', variable: '@resposta' },
            condition: { content: '', condition: 'Igual a', value: '' },
            action: { content: '', action: 'enviar_email', params: {} },
            webhook: { content: '', url: '', method: 'POST' },
            ai_response: { content: '', prompt: 'Responda de forma amigável', model: 'gemini' },
            delay: { content: '', delay: 5 },
            trigger: { content: 'Quando o cliente enviar: "Olá"' }
        };

        const config = nodeConfigs[type] || { content: '' };
        const newNode = {
            id: Date.now(),
            type,
            ...config,
            position: { x: 50 + nodes.length * 20, y: 50 + nodes.length * 20 }
        };
        setNodes([...nodes, newNode]);
    };

    const updateNode = (id, field, value) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, [field]: value } : n));
    };

    const deleteNode = (id) => {
        setNodes(nodes.filter(n => n.id !== id));
    };

    return (
        <div className="flex h-[80vh] bg-black/40 rounded-2xl border border-gray-800 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-64 bg-gray-900/50 border-r border-gray-700 p-4 flex flex-col">
                <button
                    onClick={() => { setSelectedFlow({ id: 'new', name: 'Novo Fluxo' }); setNodes([]); }}
                    className="bg-neon-blue text-black font-bold py-3 rounded mb-6 hover:bg-neon-green transition-colors"
                >
                    + Novo Fluxo
                </button>
                <div className="space-y-2">
                    {flows.map(f => (
                        <div
                            key={f.id}
                            onClick={() => { setSelectedFlow(f); setNodes([{ id: 1, type: 'trigger', content: 'Início', position: { x: 50, y: 50 } }]); }}
                            className={`p-3 rounded cursor-pointer ${selectedFlow?.id === f.id ? 'bg-gray-800 text-white border border-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                        >
                            {f.name}
                            <span className={`block text-[10px] mt-1 ${f.active ? 'text-green-500' : 'text-gray-600'}`}>● {f.active ? 'Ativo' : 'Inativo'}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative bg-dots-pattern overflow-hidden">
                {selectedFlow ? (
                    <>
                        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur p-2 rounded border border-gray-700 flex gap-2">
                            <div className="text-white font-bold px-2 py-1 items-center flex">{selectedFlow.name}</div>
                            <div className="h-6 w-px bg-gray-600 mx-1"></div>
                            <button onClick={() => addNode('message')} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors">💬 Mensagem</button>
                            <button onClick={() => addNode('question')} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors">❓ Pergunta</button>
                            <button onClick={() => addNode('condition')} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors">🔀 Condição</button>
                            <button onClick={() => addNode('action')} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors">⚡ Ação</button>
                            <button onClick={() => addNode('ai_response')} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors">🤖 IA</button>
                            <button onClick={() => addNode('webhook')} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors">🔗 Webhook</button>
                            <button onClick={handleSave} className="bg-green-600 text-white text-xs px-4 py-1 rounded font-bold hover:bg-green-500 ml-4">SALVAR FLUXO</button>
                        </div>

                        {/* Nodes (Draggable Simulation) */}
                        <div className="w-full h-full p-20 overflow-auto">
                            {/* SVG Connections Layer (Mock) */}
                            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                                {nodes.map((n, i) => i < nodes.length - 1 && (
                                    <line key={i} x1={150} y1={100 * (i + 1)} x2={150} y2={100 * (i + 2)} stroke="#00d4ff" strokeWidth="2" />
                                ))}
                            </svg>

                            <div className="flex flex-col gap-8 items-center">
                                {nodes.map((node, index) => (
                                    <div
                                        key={node.id}
                                        className={`w-80 bg-gray-900 border-2 rounded-xl p-4 shadow-2xl relative group ${node.type === 'condition' ? 'border-orange-500/50' : node.type === 'trigger' ? 'border-green-500/50' : 'border-neon-blue/30'}`}
                                    >
                                        <div className="flex justify-between mb-2">
                                            <span className={`text-xs font-bold uppercase ${node.type === 'condition' ? 'text-orange-400' : 'text-neon-blue'}`}>{node.type}</span>
                                            {node.type !== 'trigger' && <button onClick={() => deleteNode(node.id)} className="text-red-500 hover:text-red-400">×</button>}
                                        </div>

                                        {node.type === 'message' && (
                                            <textarea
                                                className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white resize-none h-20 outline-none focus:border-neon-blue"
                                                placeholder={node.placeholder || "Digite a mensagem..."}
                                                value={node.content || ''}
                                                onChange={e => updateNode(node.id, 'content', e.target.value)}
                                            />
                                        )}
                                        {node.type === 'question' && (
                                            <div>
                                                <input
                                                    className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white mb-2 outline-none focus:border-neon-blue"
                                                    placeholder={node.placeholder || "Digite a pergunta..."}
                                                    value={node.content || ''}
                                                    onChange={e => updateNode(node.id, 'content', e.target.value)}
                                                />
                                                <div className="text-xs text-gray-500">Salvar resposta em: <span className="text-yellow-500">{node.variable || '@resposta'}</span></div>
                                            </div>
                                        )}
                                        {node.type === 'condition' && (
                                            <div className="space-y-2">
                                                <select className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue">
                                                    <option>Campo igual a</option>
                                                    <option>Campo contém</option>
                                                    <option>Campo maior que</option>
                                                    <option>Campo menor que</option>
                                                </select>
                                                <input className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue" placeholder="Valor para comparar..." />
                                                <div className="flex gap-2">
                                                    <div className="flex-1 bg-green-900/20 p-2 rounded border border-green-900/50 text-xs text-green-400 text-center">✅ Verdadeiro</div>
                                                    <div className="flex-1 bg-red-900/20 p-2 rounded border border-red-900/50 text-xs text-red-400 text-center">❌ Falso</div>
                                                </div>
                                            </div>
                                        )}
                                        {node.type === 'action' && (
                                            <div className="space-y-2">
                                                <select className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue" value={node.action || 'enviar_email'} onChange={e => updateNode(node.id, 'action', e.target.value)}>
                                                    <option value="enviar_email">📧 Enviar Email</option>
                                                    <option value="criar_tarefa">📝 Criar Tarefa</option>
                                                    <option value="atualizar_crm">🏢 Atualizar CRM</option>
                                                    <option value="enviar_webhook">🔗 Enviar Webhook</option>
                                                </select>
                                                {node.action === 'enviar_email' && (
                                                    <input className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue" placeholder="destinatario@email.com" />
                                                )}
                                            </div>
                                        )}
                                        {node.type === 'ai_response' && (
                                            <div className="space-y-2">
                                                <select className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue" value={node.model || 'deepseek'} onChange={e => updateNode(node.id, 'model', e.target.value)}>
                                                    <option value="deepseek">🧠 DeepSeek AI (Recomendado)</option>
                                                    <option value="openai">🤖 OpenAI GPT-4</option>
                                                    <option value="claude">🎭 Claude AI</option>
                                                    <option value="gemini">✨ Google Gemini</option>
                                                </select>
                                                <textarea className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white resize-none h-16 outline-none focus:border-neon-blue" placeholder="Instruções para a IA..." value={node.prompt || ''} onChange={e => updateNode(node.id, 'prompt', e.target.value)} />
                                                <div className="flex gap-2">
                                                    <button className="flex-1 text-xs bg-purple-900/30 text-purple-300 py-1 rounded border border-purple-800/50 hover:bg-purple-900/50">📋 Usar Contexto</button>
                                                    <button className="flex-1 text-xs bg-blue-900/30 text-blue-300 py-1 rounded border border-blue-800/50 hover:bg-blue-900/50">🧪 Testar</button>
                                                </div>
                                            </div>
                                        )}
                                        {node.type === 'webhook' && (
                                            <div className="space-y-2">
                                                <input className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue" placeholder="https://api.exemplo.com/webhook" value={node.url || ''} onChange={e => updateNode(node.id, 'url', e.target.value)} />
                                                <select className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue" value={node.method || 'POST'} onChange={e => updateNode(node.id, 'method', e.target.value)}>
                                                    <option value="POST">POST</option>
                                                    <option value="GET">GET</option>
                                                    <option value="PUT">PUT</option>
                                                </select>
                                            </div>
                                        )}
                                        {node.type === 'delay' && (
                                            <div className="text-center">
                                                <div className="text-2xl mb-2">⏱️</div>
                                                <input type="number" min="1" max="60" className="bg-black/50 border border-gray-700 rounded p-2 text-center text-white outline-none focus:border-neon-blue" value={node.delay || 5} onChange={e => updateNode(node.id, 'delay', e.target.value)} />
                                                <div className="text-xs text-gray-500 mt-1">minutos</div>
                                            </div>
                                        )}
                                        {node.type === 'trigger' && (
                                            <div className="text-center text-gray-400 text-sm py-2">
                                                <div className="text-2xl mb-2">🎯</div>
                                                Quando o cliente enviar: <br /> <strong className="text-white">"{node.content || 'Olá'}"</strong>
                                            </div>
                                        )}

                                        {/* Connector Dot */}
                                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-700 rounded-full border-2 border-gray-500 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-gray-600 text-sm mt-4 animate-pulse">
                                    ↓ Arraste elementos para conectar
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="text-6xl mb-4 opacity-20">☊</div>
                        <h3 className="text-xl font-bold">Flow Builder v2</h3>
                        <p>Selecione ou crie um fluxo para começar a editar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlowBuilder;
