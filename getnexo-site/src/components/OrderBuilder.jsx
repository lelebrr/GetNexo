import React, { useState, useEffect } from 'react';

const OrderBuilder = ({ onSendOrder, onClose }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [step, setStep] = useState(1); // 1: Select, 2: Review/Payment

    useEffect(() => {
        fetch('https://api.getnexo.com.br/catalog')
            .then(res => res.json())
            .then(data => setProducts(data.products || []));
    }, []);

    const addToCart = (p) => {
        setCart([...cart, p]);
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const total = cart.reduce((sum, p) => sum + p.price, 0);

    const handleGenerate = () => {
        // Create the structured message
        const orderText = `🛒 *PEDIDO PREPARADO PELA LOJA*\n\n${cart.map(p => `- ${p.name}: R$${p.price.toFixed(2)}`).join('\n')}\n\n💰 *TOTAL: R$${total.toFixed(2)}*\n\n👉 *PAGUE AQUI:* https://pix.gateway.com/${Date.now()}\n\nConfirme o pagamento enviando o comprovante!`;
        onSendOrder(orderText);
    };

    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[70vh]">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        🛍️ Venda Assistida <span className="text-xs bg-neon-blue text-black px-2 rounded">Beta</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Product List */}
                    <div className="w-1/2 border-r border-gray-800 p-4 overflow-y-auto custom-scrollbar">
                        <input placeholder="Buscar produtos..." className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white mb-4" />
                        <div className="space-y-3">
                            {products.map(p => (
                                <div key={p.id} className="flex gap-3 bg-gray-800/50 p-2 rounded hover:bg-gray-800 transition-colors">
                                    <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-xl">📦</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-200 text-sm">{p.name}</div>
                                        <div className="text-neon-green text-xs font-mono">R$ {p.price.toFixed(2)}</div>
                                    </div>
                                    <button onClick={() => addToCart(p)} className="bg-neon-blue text-black w-8 h-8 rounded-full font-bold hover:scale-110 transition-transform">+</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="w-1/2 p-4 flex flex-col bg-black/20">
                        <h4 className="text-gray-400 text-xs font-bold uppercase mb-4">Carrinho Atual ({cart.length})</h4>
                        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                            {cart.length === 0 && <div className="text-center text-gray-600 mt-10 italic">Carrinho vazio</div>}
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                                    <span className="text-gray-300">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-white">R${item.price}</span>
                                        <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-400">×</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-700 pt-4">
                            <div className="flex justify-between text-xl font-bold text-white mb-4">
                                <span>Total:</span>
                                <span className="text-neon-green">R$ {total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={cart.length === 0}
                                className="w-full bg-gradient-to-r from-neon-blue to-green-400 text-black font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all"
                            >
                                ✅ Gerar Pedido & Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderBuilder;
