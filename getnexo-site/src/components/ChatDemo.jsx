import { useEffect, useState } from 'react';

export default function ChatDemo() {
    const [msg, setMsg] = useState('');
    const [respostas, setRespostas] = useState([]);

    const enviar = async () => {
        if (!msg.trim()) return;
        setRespostas(r => [...r, { who: 'user', text: msg }]);

        /* 
           Mocking the API response for demo purposes since the backend 
           might not be reachable in this build environment. 
           In prod, uncomment the fetch.
        */
        // const resp = await fetch('https://api.jetnexo.com.br/simula', {
        //   method: 'POST', 
        //   body: JSON.stringify({ msg }),
        //   headers: { 'Content-Type': 'application/json' }
        // }).then(r => r.json());

        // Simulation Logic
        setTimeout(() => {
            const resp = {
                resposta: "Entendi perfeitamente. Se você aplicar o JetNexo hoje, seu ROI estimado é de 30x. Quer ver como?"
            };
            setRespostas(r => [...r, { who: 'bot', text: resp.resposta }]);
        }, 600);

        setMsg('');
    };

    useEffect(() => {
        // Demo inicial
        setRespostas([
            { who: 'bot', text: 'Oi! Sou JetNexo. Me pergunta qualquer coisa sobre seu negócio.' }
        ]);
    }, []);

    return (
        <div className="bg-gray-900 rounded-lg p-4 max-w-md mx-auto border border-gray-700 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-400 text-xs">JetNexo AI</span>
            </div>
            <div className="h-64 overflow-auto mb-3 space-y-3 custom-scrollbar">
                {respostas.map((r, i) => (
                    <div key={i} className={`flex ${r.who === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`text-sm p-3 rounded-xl max-w-[85%] ${r.who === 'user' ? 'bg-gray-700 text-white rounded-tr-none' : 'bg-red-600 text-white rounded-tl-none'}`}>
                            {r.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="relative">
                <input
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && enviar()}
                    placeholder="Diz aí..."
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                />
            </div>
        </div>
    );
}
