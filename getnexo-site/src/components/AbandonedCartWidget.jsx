
import React, { useState, useEffect } from 'react';

const API_URL = 'https://api.getnexo.com.br';

const AbandonedCartWidget = () => {
    const [carts, setCarts] = useState([]);

    useEffect(() => {
        fetchCarts();
        const interval = setInterval(fetchCarts, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchCarts = async () => {
        try {
            const res = await fetch(`${API_URL}/abandoned`);
            const data = await res.json();
            setCarts(data.abandoned || []);
        } catch (e) { console.error(e); }
    };

    const sendRecovery = async (phone) => {
        const msg = "Ei! Vi que você esqueceu itens no carrinho. Quer ajuda para finalizar com 5% de desconto?";
        if (!confirm(`Enviar recuperação para ${phone}?`)) return;

        await fetch(`${API_URL}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, body: msg })
        });
        alert('Mensagem de recuperação enviada!');
    };

    if (carts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-red-500 rounded-xl p-4 shadow-2xl w-80 z-50 animate-pulse-slow">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-red-400 font-bold flex items-center gap-2">
                    🛒 Carrinhos Abandonados
                    <span className="bg-red-500 text-white text-xs px-2 rounded-full">{carts.length}</span>
                </h4>
                <button onClick={() => setCarts([])} className="text-gray-500 hover:text-white">x</button>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2">
                {carts.map(cart => (
                    <div key={cart.id} className="bg-black/40 p-2 rounded border border-gray-800 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-300 font-mono">{cart.phone.slice(-4)}</span>
                            <span className="text-gray-400 text-xs">{new Date(cart.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-green-500 font-bold">R$ {cart.total.toFixed(2)}</div>
                        <button
                            onClick={() => sendRecovery(cart.phone)}
                            className="mt-1 w-full bg-red-500/20 text-red-400 border border-red-500/50 rounded py-1 text-xs hover:bg-red-500 hover:text-white transition-all"
                        >
                            Recuperar Venda 💸
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AbandonedCartWidget;
