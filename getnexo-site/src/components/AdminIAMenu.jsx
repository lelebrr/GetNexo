// src/components/AdminIAMenu.jsx
// Menu administrativo de IAs com controle de créditos e tokens

import { useState, useEffect } from 'react'

export default function AdminIAMenu() {
    const [selectedAI, setSelectedAI] = useState('huggingface')
    const [aiStats, setAiStats] = useState({
        huggingface: { tokensUsed: 1250, tokensLimit: 10000, credits: 85, status: 'active' },
        grok: { tokensUsed: 890, tokensLimit: 1000, credits: 11, status: 'active' },
        deepseek: { tokensUsed: 2340, tokensLimit: 5000, credits: 53, status: 'active' },
        puter: { tokensUsed: 567, tokensLimit: 1000, credits: 43, status: 'active' },
        pixazo: { tokensUsed: 89, tokensLimit: 500, credits: 82, status: 'active' }
    })

    const aiConfigs = {
        huggingface: {
            name: 'Hugging Face',
            description: 'IA para geração de imagens e processamento de texto',
            model: 'Stable Diffusion XL',
            endpoint: 'https://api-inference.huggingface.co',
            docs: 'https://huggingface.co/docs',
            pricing: 'Gratuito até 10k tokens/mês'
        },
        grok: {
            name: 'Grok (xAI)',
            description: 'IA conversacional avançada para respostas inteligentes',
            model: 'Grok-1',
            endpoint: 'https://api.x.ai/v1',
            docs: 'https://docs.x.ai',
            pricing: 'Gratuito até 1k tokens/dia'
        },
        deepseek: {
            name: 'DeepSeek',
            description: 'IA de código e análise avançada',
            model: 'DeepSeek-Coder',
            endpoint: 'https://api.deepseek.com',
            docs: 'https://github.com/deepseek-ai/awesome-deepseek-integration',
            pricing: 'Gratuito até 5k tokens/mês'
        },
        puter: {
            name: 'Puter.js',
            description: 'Geração de imagens ilimitada e gratuita',
            model: 'Flux Schnell',
            endpoint: 'https://api.puter.com/ai/image',
            docs: 'https://developer.puter.com',
            pricing: '100% Gratuito e Ilimitado'
        },
        pixazo: {
            name: 'Pixazo AI',
            description: 'Fallback para geração de imagens',
            model: 'Flux Schnell',
            endpoint: 'https://api.pixazo.ai/v1',
            docs: 'https://pixazo.ai/models/free-api',
            pricing: 'Gratuito limitado'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-400'
            case 'warning': return 'text-yellow-400'
            case 'error': return 'text-red-400'
            default: return 'text-gray-400'
        }
    }

    const getUsagePercentage = (used, limit) => {
        return Math.round((used / limit) * 100)
    }

    const getUsageColor = (percentage) => {
        if (percentage >= 90) return 'bg-red-500'
        if (percentage >= 70) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    return (
        <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">🤖 Gerenciamento de IAs</h2>
                    <p className="text-gray-400 mt-1">Controle de créditos, tokens e configurações das IAs</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">5</div>
                    <div className="text-sm text-gray-400">IAs Ativas</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de IAs */}
                <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold text-white mb-4">IAs Disponíveis</h3>
                    <div className="space-y-2">
                        {Object.entries(aiConfigs).map(([key, config]) => {
                            const stats = aiStats[key]
                            const usagePercent = getUsagePercentage(stats.tokensUsed, stats.tokensLimit)

                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedAI(key)}
                                    className={`w-full text-left p-4 rounded-lg transition ${selectedAI === key
                                            ? 'bg-cyan-600/20 border border-cyan-500'
                                            : 'bg-gray-800 hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-white">{config.name}</h4>
                                        <span className={`text-sm ${getStatusColor(stats.status)}`}>
                                            {stats.status === 'active' ? '●' : '○'}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-400 mb-2">{config.model}</div>

                                    {/* Barra de uso */}
                                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${getUsageColor(usagePercent)}`}
                                            style={{ width: `${usagePercent}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>{stats.tokensUsed.toLocaleString()} / {stats.tokensLimit.toLocaleString()}</span>
                                        <span>{usagePercent}%</span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Detalhes da IA Selecionada */}
                <div className="lg:col-span-2">
                    {selectedAI && (
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">
                                    {aiConfigs[selectedAI].name}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${aiStats[selectedAI].status === 'active'
                                        ? 'bg-green-600 text-green-100'
                                        : 'bg-red-600 text-red-100'
                                    }`}>
                                    {aiStats[selectedAI].status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <p className="text-gray-300 mb-6">{aiConfigs[selectedAI].description}</p>

                            {/* Métricas Detalhadas */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-700 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-cyan-400">
                                        {aiStats[selectedAI].tokensUsed.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-400">Tokens Usados</div>
                                </div>

                                <div className="bg-gray-700 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-green-400">
                                        {aiStats[selectedAI].tokensLimit.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-400">Limite Total</div>
                                </div>

                                <div className="bg-gray-700 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-yellow-400">
                                        {aiStats[selectedAI].credits}%
                                    </div>
                                    <div className="text-sm text-gray-400">Créditos</div>
                                </div>

                                <div className="bg-gray-700 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-purple-400">
                                        {getUsagePercentage(aiStats[selectedAI].tokensUsed, aiStats[selectedAI].tokensLimit)}%
                                    </div>
                                    <div className="text-sm text-gray-400">Uso Atual</div>
                                </div>
                            </div>

                            {/* Informações Técnicas */}
                            <div className="bg-gray-700 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-white mb-3">Informações Técnicas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Modelo:</span>
                                        <span className="text-white ml-2">{aiConfigs[selectedAI].model}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Endpoint:</span>
                                        <span className="text-cyan-400 ml-2 font-mono text-xs">{aiConfigs[selectedAI].endpoint}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Preço:</span>
                                        <span className="text-green-400 ml-2">{aiConfigs[selectedAI].pricing}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Documentação:</span>
                                        <a
                                            href={aiConfigs[selectedAI].docs}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 ml-2 underline"
                                        >
                                            Ver Docs →
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Ações */}
                            <div className="flex gap-3">
                                <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition">
                                    🔄 Resetar Contadores
                                </button>
                                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition">
                                    ⚙️ Configurar
                                </button>
                                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition">
                                    🛑 Desativar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Resumo Geral */}
            <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">📊 Resumo Geral</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-cyan-400">
                            {Object.values(aiStats).reduce((sum, ai) => sum + ai.tokensUsed, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Total Tokens Usados</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-400">
                            {Object.values(aiStats).reduce((sum, ai) => sum + ai.tokensLimit, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Limite Total</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {Math.round(Object.values(aiStats).reduce((sum, ai) => sum + ai.credits, 0) / Object.keys(aiStats).length)}%
                        </div>
                        <div className="text-sm text-gray-400">Créditos Médios</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-purple-400">
                            {Object.values(aiStats).filter(ai => ai.status === 'active').length}
                        </div>
                        <div className="text-sm text-gray-400">IAs Ativas</div>
                    </div>
                </div>
            </div>
        </div>
    )
}