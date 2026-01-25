// src/components/DemoChatComTudozinho.jsx
// Demo com tudo: voz, AR, IA imagem, tour, dados fake, memória

import { useState, useEffect } from 'react'
import { useVoice } from './hooks/useVoice'
import { useDemoState } from './hooks/useDemoState'
import { useLogger } from './hooks/useLogger'
import CarShowcasePopup from './CarShowcasePopup'
import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'

// === CONFIGURAÇÃO NO PAINEL ADMIN (simulada) ===
const CONFIG_ADMIN = {
    iaResposta: 'grok-code-fast-1',
    iaImagem: 'flux-schnell',
    vozAtiva: true,
    arLogo: true,
    produtosReais: [
        'tenis branco', 'tenis preto', 'bota marrom', 'chinelo simples', 'salto bege',
        'camiseta branca', 'camiseta preta', 'calca jeans', 'jaqueta verde', 'vestido preto',
        'oculos sol', 'relógio prata', 'bolsa crossbody', 'chapeu fedora', 'pulseira prata',
        'celular preto', 'fone ouvido', 'smartwatch', 'teclado gamer', 'carregador wireless',
        'vasinho planta', 'mesa centro', 'cadeira gamer', 'abajur minimal', 'quadro 3d'
    ]
}

export default function DemoChatComTudozinho() {
    const [mensagens, setMensagens] = useState([
        { role: 'bot', text: 'Oi! Peça um produto ou diga 360/AR pra ver na hora 😎', timestamp: new Date(), id: 1 }
    ])
    const [digitando, setDigitando] = useState(false)
    const [input, setInput] = useState('')
    const [arAberto, setArAberto] = useState(false)
    const [stats, setStats] = useState({ mensagens: 1, imagensGeradas: 0, arViews: 0 })
    const { speak, isAvailable } = useVoice()

    // === TOUR GUIADO COM SHEPHERD ===
    useEffect(() => {
        const tour = new Shepherd.Tour({
            defaultStepOptions: {
                classes: 'shepherd-theme-dark',
                cancelIcon: { enabled: true },
                arrow: window.innerWidth > 768
            },
            steps: [
                {
                    id: 'chat-input',
                    text: 'Digite aqui: "Tenis em 360", "AR", "preço"...',
                    attachTo: { element: '.input-chat', on: 'bottom' },
                    buttons: [{ text: 'Fechar', type: 'cancel' }, { text: 'Próximo', type: 'next' }]
                },
                {
                    id: 'btn-voice',
                    text: 'Clica pra ouvir a resposta do bot.',
                    attachTo: { element: '.btn-voice', on: 'left' },
                    buttons: [{ text: 'Voltar', type: 'back' }, { text: 'Ver AR', type: 'next' }]
                },
                {
                    id: 'btn-ar',
                    text: 'Mostra produto em AR na tua casa!',
                    attachTo: { element: '.btn-ar', on: 'right' },
                    buttons: [{ text: 'Voltar', type: 'back' }, { text: 'Finalizar', type: 'complete' }]
                }
            ]
        })

        tour.start()
        return () => tour.cancel()
    }, [])

    // === MENSAGEM AUTOMÁTICA INICIAL ===
    useEffect(() => {
        const timer = setTimeout(() => {
            setMensagens(prev => {
                // Evita duplicar se já houver interação (opcional, mas bom pra segurança)
                if (prev.length > 1) return prev;

                return [...prev, {
                    role: 'bot',
                    text: 'Oi! Eu sou o Nexus, o bot IA do GetNexo. 😎<br>Digita qualquer produto que eu mostro preço, foto, 360° e até coloco na tua casa com AR!',
                    timestamp: new Date(),
                    id: Date.now()
                }]
            });
            // Opcional: tocar som de notificação se desejar
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // === RESPOSTA AUTOMÁTICA DO BOT ===
    const responder = async () => {
        if (!input.trim()) return

        const userInput = input.trim()
        const user = userInput.toLowerCase()
        setDigitando(true)
        setMensagens(prev => [...prev, {
            role: 'user',
            text: userInput,
            timestamp: new Date(),
            id: Date.now()
        }])
        setInput('')

        // Delay realista para simular processamento
        const delay = Math.random() * 1000 + 800 // 800-1800ms

        setTimeout(async () => {
            let resposta = ''
            let precisaIA = false
            let tipoResposta = 'texto'
            let dadosExtras = null

            // === LÓGICA INTELIGENTE DE RESPOSTAS ===
            if (user.includes('oi') || user.includes('ola') || user.includes('bom dia') || user.includes('boa tarde') || user.includes('eae')) {
                resposta = '👋 Olá! Sou o assistente virtual da GetNexo. Posso te ajudar a encontrar produtos incríveis com AR e voz! O que você procura?'
            }
            else if (user.includes('360') || user.includes('três sessenta') || user.includes('girar') || user.includes('visualizar')) {
                resposta = '🎯 Aqui em 360°! Gira o produto com o mouse ou dedo pra ver todos os ângulos. Incrível, né?'
                setArAberto(true)
                tipoResposta = 'ar'
            }
            else if (user.includes('ar') || user.includes('realidade aumentada') || user.includes('casa') || user.includes('ambiente')) {
                resposta = '🏠 AR ativado! Abra no celular e posicione o produto na sua casa real. Funciona no iOS e Android!'
                setArAberto(true)
                tipoResposta = 'ar'
            }
            else if (user.includes('preço') || user.includes('quanto') || user.includes('custa') || user.includes('valor') || user.includes('dinheiro')) {
                const preco = (Math.random() * 200 + 50).toFixed(2)
                const estoque = Math.floor(Math.random() * 10) + 1
                resposta = `💰 Preço: R$ ${preco} | 📦 Estoque: ${estoque} unidades | 🚚 Frete grátis acima de R$ 200!`
                tipoResposta = 'dados'
                dadosExtras = { preco: parseFloat(preco), estoque }
            }
            else if (user.includes('obrigado') || user.includes('valeu') || user.includes('thanks') || user.includes('agradecido')) {
                resposta = '🙏 De nada! Volte sempre. Temos produtos incríveis esperando por você! ✨'
            }
            else if (user.includes('ajuda') || user.includes('help') || user.includes('como') || user.includes('funciona')) {
                resposta = '💡 Posso te ajudar com: produtos em 360°, AR na sua casa, preços, geração de imagens IA. Tente: "tenis branco", "AR", "preço", "guitarra elétrica"'
            }
            else if (user.includes('demo') || user.includes('teste') || user.includes('exemplo')) {
                resposta = '🎪 Este é o demo completo! Teste voz, AR, IA de imagens. Digite qualquer coisa pra ver a magia acontecer!'
            }
            else if (user.includes('carro') || user.includes('veículo') || user.includes('automóvel') || user.includes('auto') || user.includes('moto') || user.includes('motocicleta')) {
                resposta = '🚗 Temos uma frota incrível de carros! Abra o popup para ver demonstrações em AR 360°.'
                setShowCarPopup(true)
                tipoResposta = 'carros'
            }
            else {
                // === VERIFICAÇÃO INTELIGENTE DE PRODUTOS ===
                const produtoEncontrado = CONFIG_ADMIN.produtosReais.find(p =>
                    user.includes(p.split(' ')[0]) ||
                    p.split(' ').some(word => user.includes(word)) ||
                    user.includes(p.replace(' ', ''))
                )

                if (produtoEncontrado) {
                    resposta = `✅ Sim! Temos ${produtoEncontrado} disponível. Quer ver em 360° ou AR na sua casa? 🎯`
                    tipoResposta = 'produto'
                    dadosExtras = { produto: produtoEncontrado }
                } else {
                    // Produto não encontrado - gerar com IA
                    const produto = userInput.split(' ').pop() || userInput
                    resposta = `🤖 Não temos ${produto} no estoque, mas posso criar uma visualização especial pra você com IA!`
                    gerarFotoIA(produto)
                    precisaIA = true
                }
            }

            if (!precisaIA) {
                setMensagens(prev => [...prev, {
                    role: 'bot',
                    text: resposta,
                    tipo: tipoResposta,
                    dados: dadosExtras,
                    timestamp: new Date(),
                    id: Date.now() + 1
                }])

                // Atualiza estatísticas
                setStats(prev => ({
                    ...prev,
                    mensagens: prev.mensagens + 1,
                    arViews: tipoResposta === 'ar' ? prev.arViews + 1 : prev.arViews
                }))

                // Voz automática se ativada
                if (CONFIG_ADMIN.vozAtiva && isAvailable) {
                    setTimeout(() => speak(resposta), 300)
                }

                setDigitando(false)
            }
        }, delay)
    }

    // === GERA IMAGEM COM IA (PUTER.JS REAL) ===
    const gerarFotoIA = async (produto) => {
        try {
            setMensagens(prev => [...prev, {
                role: 'bot',
                text: `🎨 Gerando imagem de ${produto} com IA Puter.js...`,
                tipo: 'loading',
                timestamp: new Date(),
                id: Date.now() + 2
            }])

            // === PUTER.JS - GERAÇÃO REAL DE IMAGEM ===
            let imageUrl = null

            try {
                // Primeiro tenta Puter.js (gratuito/ilimitado)
                const puterResponse = await fetch('https://api.puter.com/ai/image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: `Foto realista de ${produto}, fundo branco, estúdio profissional, alta resolução`,
                        model: CONFIG_ADMIN.iaImagem // 'flux-schnell' ou outro
                    })
                })

                if (puterResponse.ok) {
                    const puterData = await puterResponse.json()
                    imageUrl = puterData.url
                } else {
                    throw new Error('Puter.js falhou')
                }
            } catch (puterError) {
                console.warn('Puter.js falhou, tentando Pixazo:', puterError)

                try {
                    // Fallback: Pixazo AI
                    const pixazoResponse = await fetch('https://api.pixazo.ai/v1/images/generations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            prompt: `Foto realista de ${produto}, fundo branco`,
                            model: 'flux-schnell'
                        })
                    })

                    if (pixazoResponse.ok) {
                        const pixazoData = await pixazoResponse.json()
                        imageUrl = pixazoData.images[0].url
                    } else {
                        throw new Error('Pixazo falhou')
                    }
                } catch (pixazoError) {
                    console.warn('Pixazo falhou, tentando Hugging Face:', pixazoError)

                    // Último fallback: Hugging Face (precisa .env)
                    const hfResponse = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${process.env.HF_KEY || 'hf_dummy'}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            inputs: `Foto realista de ${produto}, fundo branco`
                        })
                    })

                    if (hfResponse.ok) {
                        const blob = await hfResponse.blob()
                        imageUrl = URL.createObjectURL(blob)
                    } else {
                        throw new Error('Todos os serviços falharam')
                    }
                }
            }

            if (imageUrl) {
                const precoGerado = (Math.random() * 100 + 50).toFixed(2)

                // Remove mensagem de loading e adiciona resultado
                setMensagens(prev => prev.filter(m => m.tipo !== 'loading').concat({
                    role: 'bot',
                    text: `✨ Aqui está ${produto} gerado especialmente pra você pela nossa IA Puter.js! R$ ${precoGerado}`,
                    image: imageUrl,
                    tipo: 'imagem_ia',
                    dados: { preco: parseFloat(precoGerado), produto },
                    timestamp: new Date(),
                    id: Date.now() + 3
                }))

                // Atualiza estatísticas
                setStats(prev => ({
                    ...prev,
                    mensagens: prev.mensagens + 1,
                    imagensGeradas: prev.imagensGeradas + 1
                }))

                if (CONFIG_ADMIN.vozAtiva && isAvailable) {
                    setTimeout(() => speak(`Aqui está ${produto} gerado pela nossa IA!`), 500)
                }
            } else {
                throw new Error('Nenhuma imagem gerada')
            }

        } catch (err) {
            console.error('Erro na geração de imagem:', err)
            setMensagens(prev => prev.filter(m => m.tipo !== 'loading').concat({
                role: 'bot',
                text: '😔 Desculpe, houve um erro na geração da imagem. Todos os serviços de IA estão temporariamente indisponíveis. Tente novamente mais tarde!',
                tipo: 'erro',
                timestamp: new Date(),
                id: Date.now() + 4
            }))
        } finally {
            setDigitando(false)
        }
    }

    // === RESETAR DEMO ===
    const resetar = () => {
        setMensagens([{
            role: 'bot',
            text: 'Oi! Peça um produto ou diga 360/AR pra ver na hora 😎',
            timestamp: new Date(),
            id: Date.now()
        }])
        setArAberto(false)
        setInput('')
        setStats({ mensagens: 1, imagensGeradas: 0, arViews: 0 })
    }

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-900">
            {/* CABEÇALHO */}
            <header className="text-center py-4 border-b border-cyan-700">
                <h1 className="text-2xl font-black text-cyan-400">GetNexo – Demo Completa</h1>
                <p className="text-sm text-gray-400">Tudo funcionando: IA, voz, AR, 360</p>
            </header>

            {/* CHAT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800/30 rounded-t-xl">
                {mensagens.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${m.role === 'user'
                                ? 'bg-cyan-600/80 text-white'
                                : 'bg-gray-800/80 text-gray-200'
                                }`}
                        >
                            {m.text}
                            {m.image && (
                                <img
                                    src={m.image}
                                    alt="Produto gerado por IA"
                                    className="mt-2 w-full rounded-lg shadow-md"
                                />
                            )}
                            {m.role === 'bot' && CONFIG_ADMIN.vozAtiva && isAvailable && (
                                <button
                                    onClick={() => speak(m.text)}
                                    className="btn-voice ml-2 inline-flex items-center text-xs bg-black/30 px-2 py-1 rounded-full hover:bg-black/50 transition"
                                >
                                    ▶️ Ouvir
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {digitando && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 px-4 py-3 rounded-2xl flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* AR Modal */}
            {arAberto && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-2xl max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-white">Realidade Aumentada</h4>
                            <button
                                onClick={() => setArAberto(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <model-viewer
                            src="/modelos/tenis_branco.glb"
                            alt="Produto 3D"
                            camera-orbit="45deg 55deg 2m"
                            shadow-intensity="1"
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            poster="/modelos/poster.jpg"
                            style={{ width: '100%', height: '300px' }}
                        >
                            <button slot="ar-button" className="btn-ar ar-button">
                                👓 Ver em AR
                            </button>
                        </model-viewer>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            Abra no celular para Realidade Aumentada
                        </p>
                    </div>
                </div>
            )}

            {/* INPUT */}
            <div className="p-4 border-t border-cyan-700 bg-gray-900">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && responder()}
                        placeholder="Digite aqui: 'Quero um tênis preto 42' ou 'Mostrar catálogo'"
                        className="input-chat flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                    <button
                        onClick={responder}
                        disabled={!input.trim() || digitando}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded-lg hover:from-cyan-400 hover:to-green-400 transition disabled:opacity-50"
                    >
                        Enviar
                    </button>
                </div>
            </div>

            {/* BOTÃO RESETAR */}
            <button
                onClick={resetar}
                className="absolute bottom-20 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition"
            >
                Resetar Demo
            </button>

            {/* PAINEL DE ESTATÍSTICAS */}
            <div className="absolute top-4 left-4 text-xs bg-gray-900/90 p-3 rounded-lg border border-cyan-700/50 shadow-lg">
                <p className="text-cyan-300 font-semibold mb-2">📊 Estatísticas Demo:</p>
                <div className="space-y-1">
                    <p>💬 Mensagens: {stats.mensagens}</p>
                    <p>🎨 Imagens IA: {stats.imagensGeradas}</p>
                    <p>👓 Visualizações AR: {stats.arViews}</p>
                    <p>🎤 Voz: {CONFIG_ADMIN.vozAtiva && isAvailable ? 'Ativa' : 'Indisponível'}</p>
                </div>
            </div>

            {/* Configuração simulada do painel admin */}
            <div className="absolute top-4 right-4 text-xs bg-gray-900/80 p-2 rounded-lg border border-gray-700">
                <p className="text-cyan-300">⚙️ Config Admin:</p>
                <p>IA Resposta: {CONFIG_ADMIN.iaResposta}</p>
                <p>IA Imagem: {CONFIG_ADMIN.iaImagem}</p>
                <p>Voz: {CONFIG_ADMIN.vozAtiva ? 'Ativada' : 'Desativada'}</p>
                <p>AR Logo: {CONFIG_ADMIN.arLogo ? 'Pulsando' : 'Off'}</p>
            </div>

            {/* Popup de Carros */}
            <CarShowcasePopup
                isOpen={showCarPopup}
                onClose={() => setShowCarPopup(false)}
            />
        </div>
    )
}