
import React, { useState, useEffect } from 'react';

const API_URL = 'https://api.getnexo.com.br';

const CatalogManager = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [targetPhone, setTargetPhone] = useState('');

    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        const res = await fetch(`${API_URL}/catalog`);
        const data = await res.json();
        setProducts(data.products || []);
    };

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    const createOrder = async () => {
        if (!targetPhone || cart.length === 0) return alert('Selecione produtos e informe o telefone do cliente');

        await fetch(`${API_URL}/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: targetPhone,
                product_ids: cart.map(p => p.id),
                pix_key: 'loja@getnexo.com.br'
            })
        });

        alert('Pedido Criado! Link de PIX enviado para o cliente.');
        setCart([]);
    };

    return (
        <div className="flex gap-6 h-[75vh]">
            {/* Catalog Grid */}
            <div className="flex-1 overflow-y-auto">
                <h3 className="text-xl font-bold text-neon-blue mb-4">🏪 Catálogo de Produtos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.length === 0 ? (
                        <div className="col-span-3 text-gray-500">Nenhum produto cadastrado. (Use o terminal para inserir: `INSERT INTO products...`)</div>
                    ) : products.map(p => (
                        <div key={p.id} className="glass-panel p-4 rounded-xl border border-gray-800 flex flex-col items-center text-center hover:border-gray-600 transition-colors">
                            <img src={p.image_url || 'https://placehold.co/150x150/1e293b/64748b?text=Produto'} className="w-24 h-24 object-cover rounded mb-3 bg-gray-900" />
                            <h4 className="font-bold text-white">{p.name}</h4>
                            <p className="text-neon-green font-bold text-lg">R$ {p.price.toFixed(2)}</p>
                            <button onClick={() => addToCart(p)} className="mt-3 bg-gray-800 hover:bg-neon-blue hover:text-black text-gray-300 px-4 py-2 rounded text-sm font-bold w-full transition-colors">
                                + Adicionar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart / Checkout Sidebar */}
            <div className="w-1/3 glass-panel p-6 rounded-xl border border-gray-800 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-6">🛒 Novo Pedido</h3>

                <div className="mb-4">
                    <label className="text-gray-400 text-sm">Cliente (WhatsApp)</label>
                    <input
                        className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-neon-green outline-none"
                        placeholder="5511999999999"
                        value={targetPhone}
                        onChange={e => setTargetPhone(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-2 border-t border-b border-gray-800 py-2">
                    {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">{item.name}</span>
                            <span className="text-white">R$ {item.price.toFixed(2)}</span>
                        </div>
                    ))}
                    {cart.length === 0 && <span className="text-gray-600 italic">Carrinho vazio</span>}
                </div>

                <div className="flex justify-between items-center text-xl font-bold text-white mb-6">
                    <span>Total:</span>
                    <span className="text-neon-green">R$ {cart.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</span>
                </div>

                <button onClick={createOrder} className="bg-neon-green text-black font-bold p-4 rounded text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,157,0.3)]">
                    GERAR PIX 💸
                </button>
            </div>
        </div>
    );
};

export default CatalogManager;
