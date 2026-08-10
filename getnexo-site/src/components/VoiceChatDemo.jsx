// src/components/VoiceChatDemo.jsx

import { useState } from 'react'
import { useVoice } from './hooks/useVoice'

export default function VoiceChatDemo() {
    const [mensagens, setMensagens] = useState([
        { user: true, texto: "Tem tênis branco?" },
        { user: false, texto: "Sim! Aqui em 360° 👇" },
        { user: true, texto: "Quero ver em AR!" },
        { user: false, texto: "Clica aqui pra ver na tua casa." },
        { user: true, texto: "Quanto custa?" },
        { user: false, texto: "R$ 199,90. Fecha?" }
    ])

    const { speak, stop, isAvailable } = useVoice()

    const limpar = () => {
        // Se quiser resetar mensagens, usa:
        // setMensagens( )
        stop()
    }

    return (
        <div className="p-6 bg-gradient-to-br from-slate-900 via-cyan-950 to-green-900 rounded-2xl shadow-2xl max-w-md mx-auto border border-cyan-700/30">
            <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text mb-4">
                Demo com Voz
            </h3>

            <div className="space-y-3">
                {mensagens.map((m, i) => (
                    <div key={i} className={`flex ${m.user ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${m.user ? 'bg-green-600/80' : 'bg-gray-800/60'} text-white`}>
                            <span className="text-sm">{m.texto}</span>
                            <button
                                onClick={() => isAvailable ? speak(m.texto) : alert("Seu navegador não suporta voz. Use Chrome/Edge.")}
                                className="ml-2 inline-flex items-center text-xs bg-black/40 px-2 py-1 rounded-full hover:bg-black/60 transition"
                                aria-label="Ouvir mensagem"
                                title="Ouvir mensagem"
                            >
                                ▶️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={limpar}
                className="w-full mt-5 py-3 bg-red-600 rounded-xl font-semibold text-white hover:bg-red-700 transition shadow-md"
            >
                Limpar e Parar Voz
            </button>

            {!isAvailable && (
                <p className="text-xs text-cyan-300 mt-3 text-center">💡 Voz ativada no Chrome, Edge ou Safari</p>
            )}
        </div>
    )
}