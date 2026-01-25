import React, { useState } from 'react';
import { Card } from '../design-system/components/Card';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';

const ABTestingDashboard = () => {
    const [activeTab, setActiveTab] = useState('experiments');
    const [experiments, setExperiments] = useState([
        {
            id: 1,
            name: 'Botão CTA Principal',
            status: 'running',
            variants: [
                { name: 'A', text: 'Comprar Agora', conversions: 45, visitors: 1200 },
                { name: 'B', text: 'Adquirir Produto', conversions: 52, visitors: 1180 },
                { name: 'C', text: 'Garanta o Seu', conversions: 38, visitors: 1150 }
            ],
            winner: 'B',
            confidence: 95.2,
            createdAt: '2026-01-20'
        },
        {
            id: 2,
            name: 'Página de Produto',
            status: 'completed',
            variants: [
                { name: 'A', text: 'Layout Original', conversions: 28, visitors: 950 },
                { name: 'B', text: 'Layout Moderno', conversions: 41, visitors: 980 }
            ],
            winner: 'B',
            confidence: 98.7,
            createdAt: '2026-01-15'
        },
        {
            id: 3,
            name: 'Mensagem de Boas Vindas',
            status: 'running',
            variants: [
                { name: 'A', text: 'Olá! Como posso ajudar?', conversions: 67, visitors: 1400 },
                { name: 'B', text: 'Oi! Bem-vindo ao atendimento!', conversions: 71, visitors: 1380 },
                { name: 'C', text: '👋 Olá! Sou seu assistente virtual', conversions: 58, visitors: 1420 }
            ],
            winner: null,
            confidence: 87.3,
            createdAt: '2026-01-22'
        }
    ]);

    const [newExperiment, setNewExperiment] = useState({
        name: '',
        variants: [
            { name: 'A', text: '' },
            { name: 'B', text: '' }
        ]
    });

    const [analytics] = useState({
        totalExperiments: 12,
        runningExperiments: 5,
        completedExperiments: 7,
        avgImprovement: 23.4,
        totalConversions: 15420
    });

    const addVariant = () => {
        const nextLetter = String.fromCharCode(65 + newExperiment.variants.length);
        setNewExperiment({
            ...newExperiment,
            variants: [...newExperiment.variants, { name: nextLetter, text: '' }]
        });
    };

    const removeVariant = (index) => {
        if (newExperiment.variants.length > 2) {
            setNewExperiment({
                ...newExperiment,
                variants: newExperiment.variants.filter((_, i) => i !== index)
            });
        }
    };

    const createExperiment = () => {
        if (!newExperiment.name.trim()) {
            alert('Nome do experimento é obrigatório');
            return;
        }

        const hasEmptyVariant = newExperiment.variants.some(v => !v.text.trim());
        if (hasEmptyVariant) {
            alert('Todas as variantes devem ter conteúdo');
            return;
        }

        const experiment = {
            id: experiments.length + 1,
            name: newExperiment.name,
            status: 'running',
            variants: newExperiment.variants.map(v => ({
                ...v,
                conversions: Math.floor(Math.random() * 50) + 10,
                visitors: Math.floor(Math.random() * 200) + 1000
            })),
            winner: null,
            confidence: 0,
            createdAt: new Date().toISOString().split('T')[0]
        };

        setExperiments([experiment, ...experiments]);
        setNewExperiment({
            name: '',
            variants: [
                { name: 'A', text: '' },
                { name: 'B', text: '' }
            ]
        });
        setActiveTab('experiments');
    };

    const stopExperiment = (id) => {
        setExperiments(experiments.map(exp =>
            exp.id === id ? { ...exp, status: 'completed' } : exp
        ));
    };

    const calculateConversionRate = (conversions, visitors) => {
        return ((conversions / visitors) * 100).toFixed(2);
    };

    const getImprovement = (experiment) => {
        if (!experiment.winner) return 0;
        const winner = experiment.variants.find(v => v.name === experiment.winner);
        const others = experiment.variants.filter(v => v.name !== experiment.winner);
        const avgOthers = others.reduce((sum, v) => sum + (v.conversions / v.visitors), 0) / others.length;
        const winnerRate = winner.conversions / winner.visitors;
        return (((winnerRate - avgOthers) / avgOthers) * 100).toFixed(1);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-4 text-center hover:border-cyan-500 transition-colors">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">{analytics.totalExperiments}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Total Testes</div>
                </Card>
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-4 text-center hover:border-green-500 transition-colors">
                    <div className="text-2xl font-bold text-green-400 mb-1">{analytics.runningExperiments}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Em Andamento</div>
                </Card>
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-4 text-center hover:border-purple-500 transition-colors">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{analytics.completedExperiments}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Concluídos</div>
                </Card>
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-4 text-center hover:border-yellow-500 transition-colors">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">+{analytics.avgImprovement}%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Melhoria Média</div>
                </Card>
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-4 text-center hover:border-blue-500 transition-colors">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{analytics.totalConversions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Conversões</div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg border border-gray-800 w-fit">
                {[
                    { id: 'experiments', icon: '🧪', label: 'Experimentos' },
                    { id: 'create', icon: '➕', label: 'Novo Teste' },
                    { id: 'analytics', icon: '📊', label: 'Analytics' },
                    { id: 'templates', icon: '📋', label: 'Templates' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'experiments' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">🧪 Laboratório de Testes</h2>
                                <p className="text-sm text-gray-400">Gerencie experimentos ativos e monitore conversões em tempo real.</p>
                            </div>
                            <Button onClick={() => setActiveTab('create')} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold">
                                + Novo Experimento
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {experiments.map(experiment => (
                                <Card key={experiment.id} style={{ background: '#111827', borderColor: '#1f2937' }} className="p-0 overflow-hidden hover:border-gray-700 transition-all">
                                    <div className="p-5 border-b border-gray-800 flex justify-between items-start bg-gray-900/50">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-white">{experiment.name}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${experiment.status === 'running'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                    }`}>
                                                    {experiment.status === 'running' ? '● Em Execução' : '✓ Concluído'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                {experiment.winner && (
                                                    <span className="text-yellow-400 flex items-center gap-1 font-bold">
                                                        <span>🏆</span> Vencedor: Variante {experiment.winner} (+{getImprovement(experiment)}%)
                                                    </span>
                                                )}
                                                <span className="text-gray-500">Confiança Estatística: <span className="text-gray-300">{experiment.confidence}%</span></span>
                                                <span className="text-gray-500">Criado em: <span className="text-gray-300">{experiment.createdAt}</span></span>
                                            </div>
                                        </div>

                                        {experiment.status === 'running' && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => stopExperiment(experiment.id)}
                                                className="border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs"
                                            >
                                                Parar Teste
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-1 bg-gray-800/50">
                                        {experiment.variants.map(variant => (
                                            <div
                                                key={variant.name}
                                                className={`p-4 rounded transition-all relative overflow-hidden group ${experiment.winner === variant.name
                                                    ? 'bg-gradient-to-br from-yellow-500/10 to-transparent ring-1 ring-yellow-500/30'
                                                    : 'bg-gray-900 hover:bg-gray-800'
                                                    }`}
                                            >
                                                {experiment.winner === variant.name && (
                                                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl">VENCEDOR</div>
                                                )}

                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-bold text-white bg-gray-800 px-2 py-1 rounded text-xs border border-gray-700">Variante {variant.name}</span>
                                                </div>

                                                <div className="p-3 bg-black/40 rounded border border-gray-800 text-sm text-gray-300 mb-4 font-mono">
                                                    "{variant.text}"
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-xs">
                                                    <div>
                                                        <span className="text-gray-500 block mb-1">Conversões</span>
                                                        <span className="text-green-400 font-bold text-lg">{variant.conversions}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block mb-1">Taxa Conv.</span>
                                                        <span className="text-cyan-400 font-bold text-lg">{calculateConversionRate(variant.conversions, variant.visitors)}%</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-gray-800 text-[10px] text-gray-500">
                                                    {variant.visitors.toLocaleString()} visitantes únicos
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'create' && (
                    <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-8 max-w-4xl mx-auto">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-cyan-400">➕</span> Configurar Novo Experimento
                        </h2>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="block text-gray-300 text-sm font-bold">Nome do Experimento</label>
                                <Input
                                    value={newExperiment.name}
                                    onChange={(e) => setNewExperiment({ ...newExperiment, name: e.target.value })}
                                    placeholder="Ex: Teste A/B - Hero Section Principal"
                                />
                                <p className="text-xs text-gray-500">Dê um nome descritivo para identificar o teste nos relatórios.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-gray-300 text-sm font-bold">Variantes do Teste</label>
                                    <Button onClick={addVariant} size="sm" variant="secondary" className="text-xs">
                                        + Adicionar Variante
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {newExperiment.variants.map((variant, index) => (
                                        <div key={index} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center font-bold text-white shrink-0 border border-gray-700">
                                                {variant.name}
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    value={variant.text}
                                                    onChange={(e) => {
                                                        const newVariants = [...newExperiment.variants];
                                                        newVariants[index].text = e.target.value;
                                                        setNewExperiment({ ...newExperiment, variants: newVariants });
                                                    }}
                                                    placeholder={`Conteúdo ou URL da variante ${variant.name}`}
                                                />
                                            </div>
                                            {newExperiment.variants.length > 2 && (
                                                <button
                                                    onClick={() => removeVariant(index)}
                                                    className="w-10 h-10 bg-red-900/20 text-red-500 rounded hover:bg-red-900/40 border border-red-900/30 flex items-center justify-center transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-800">
                                <Button onClick={createExperiment} className="flex-1 bg-[#ffc400] text-black font-bold hover:bg-yellow-400">
                                    🚀 Lançar Experimento
                                </Button>
                                <Button onClick={() => setActiveTab('experiments')} variant="secondary" className="px-8">
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6">
                                <h4 className="text-white font-bold mb-6 flex items-center gap-2">📈 Performance por Categoria</h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Botões CTA', val: '+18.5%', color: 'text-green-400' },
                                        { label: 'Copywriting', val: '+12.3%', color: 'text-green-400' },
                                        { label: 'Layout & Design', val: '+24.7%', color: 'text-green-400' },
                                        { label: 'Pricing', val: '-3.2%', color: 'text-red-400' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-gray-800/30 rounded border border-gray-800">
                                            <span className="text-gray-400 text-sm">{item.label}</span>
                                            <span className={`font-mono font-bold ${item.color}`}>{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6 flex flex-col justify-center items-center text-center">
                                <h4 className="text-white font-bold mb-2">Taxa Global de Sucesso</h4>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                                    73%
                                </div>
                                <p className="text-sm text-gray-500 max-w-xs">Dos experimentos realizados resultam em melhoria confirmada nas conversões.</p>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                name: 'Botão de Compra',
                                description: 'Teste diferentes textos para botões de conversão e compare CTR.',
                                variants: ['Comprar Agora', 'Adquirir', 'Garanta Já', 'Peça o Seu']
                            },
                            {
                                name: 'Headline Hero',
                                description: 'Teste as manchetes principais da sua landing page.',
                                variants: ['Transforme seu negócio', 'Revolucione seus resultados', 'Alcance o próximo nível']
                            },
                            {
                                name: 'Preço Psicológico',
                                description: 'Compare formatos de preço para maximizar percepção de valor.',
                                variants: ['R$ 99/mês', 'Apenas R$ 99', '99 mensais', '12x de R$ 9,90']
                            },
                            {
                                name: 'Prova Social',
                                description: 'Teste diferentes formatos de depoimentos e avaliações.',
                                variants: ['Vídeo Review', 'Texto com Foto', 'Nota 5 Estrelas', 'Selo de Garantia']
                            }
                        ].map((template, index) => (
                            <Card key={index} style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6 hover:border-cyan-500/50 transition-all group cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        📋
                                    </div>
                                    <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">Usar Template</Button>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{template.name}</h3>
                                <p className="text-sm text-gray-400 mb-4 h-10">{template.description}</p>

                                <div className="flex flex-wrap gap-2">
                                    {template.variants.map((v, i) => (
                                        <span key={i} className="text-[10px] bg-black border border-gray-800 text-gray-500 px-2 py-1 rounded">
                                            {v}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ABTestingDashboard;