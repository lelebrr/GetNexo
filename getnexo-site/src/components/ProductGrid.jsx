import React, { useState, useEffect } from 'react';

const API = 'https://api.getnexo.com.br';

export default function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProd, setEditingProd] = useState(null);

    // Helpers
    const getAuthHeader = () => {
        const token = localStorage.getItem('omnichat_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/products`, {
                headers: getAuthHeader()
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (e) {
            console.error("Failed to load products", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza? A IA não poderá mais vender este item.')) return;
        try {
            await fetch(`${API}/api/products/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (e) { alert('Erro ao excluir'); }
    };

    const handleEdit = (prod) => {
        setEditingProd(prod);
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const id = editingProd ? editingProd.id : null;

        // Format types
        data.price = parseFloat(data.price);
        data.stock = parseInt(data.stock);

        try {
            const url = id ? `${API}/api/products/${id}` : `${API}/api/products`;
            const method = id ? 'PUT' : 'POST';

            await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(data)
            });

            setModalOpen(false);
            setEditingProd(null);
            loadProducts(); // Reload to be safe
        } catch (e) {
            alert('Erro ao salvar produto.');
        }
    };

    return (
        <div className="product-manager">
            {/* Header Action moved to component or kept in parent? Parent has the button. 
                 We can use a portal or just expose this UI here. 
                 For now, let's keep the grid here and maybe a "New Product" button if the parent one is removed.
                 The parent `loja.astro` had the button. We can make this component handle everything or communicate.
                 Let's make this component self-contained for the "Grid" part, but we need to trigger the modal from the parent button?
                 Actually, simpler: put the button INSIDE this component or make the parent button trigger a custom event.
                 Let's add a listener for a custom event 'open-product-modal' or just add the button here.
                 User requirement: "Lazy load in tabs/seções".
                 Better to have the whole "Product Manager" as a react Island.
             */}

            {/* Hidden button listener or expose capability? 
                Let's rely on the parent having the button but we need to open OUR modal.
                We can listen to window event.
            */}

            <div id="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {loading && <div style={{ color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center' }}>Carregando catálogo...</div>}

                {!loading && products.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        Nenhum produto cadastrado.
                    </div>
                )}

                {products.map(p => (
                    <div key={p.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        <div style={{ height: '180px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {p.image_url
                                ? <img src={p.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" onError={(e) => e.target.src = 'https://placehold.co/400x300?text=Sem+Imagem'} />
                                : <span style={{ fontSize: '3rem' }}>📦</span>}
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 0.5rem', color: 'white' }}>{p.name}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {p.description || 'Sem descrição'}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00ff9d' }}>R$ {p.price.toFixed(2)}</span>
                                <span style={{ fontSize: '0.8rem', background: '#334155', padding: '2px 8px', borderRadius: '12px', color: '#e5e7eb' }}>Estoque: {p.stock}</span>
                            </div>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEdit(p)} style={{ flex: 1, background: '#334155', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>Editar</button>
                            <button onClick={() => handleDelete(p.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid #ef4444', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>Excluir</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="glass-panel" style={{ background: '#0f172a', border: '1px solid #334155', padding: '2rem', width: '90%', maxWidth: '500px', position: 'relative' }}>
                        <h3 style={{ marginTop: 0, color: 'white' }}>{editingProd ? 'Editar Produto' : 'Novo Produto'}</h3>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            <div>
                                <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Nome do Produto</label>
                                <input name="name" required defaultValue={editingProd?.name} placeholder="Ex: Tênis Nike Air" style={{ width: '100%', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '8px', marginTop: '0.3rem' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Preço (R$)</label>
                                    <input type="number" step="0.01" name="price" required defaultValue={editingProd?.price} placeholder="0.00" style={{ width: '100%', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '8px', marginTop: '0.3rem' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Estoque</label>
                                    <input type="number" name="stock" defaultValue={editingProd?.stock || 10} style={{ width: '100%', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '8px', marginTop: '0.3rem' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Link da Imagem</label>
                                <input name="image_url" defaultValue={editingProd?.image_url} placeholder="https://..." style={{ width: '100%', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '8px', marginTop: '0.3rem' }} />
                            </div>

                            <div>
                                <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Descrição (para a IA)</label>
                                <textarea name="description" rows="3" defaultValue={editingProd?.description} placeholder="Detalhes técnicos, materiais, benefícios..." style={{ width: '100%', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '8px', marginTop: '0.3rem' }}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => { setModalOpen(false); setEditingProd(null); }} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ flex: 1, padding: '10px', background: '#00ff9d', border: 'none', color: 'black', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Listener for external trigger */}
            <ExternalTrigger setModalOpen={setModalOpen} setEditingProd={setEditingProd} />
        </div>
    );
}

// Invisible component to listen for events
function ExternalTrigger({ setModalOpen, setEditingProd }) {
    useEffect(() => {
        const handleOpen = () => {
            setEditingProd(null);
            setModalOpen(true);
        };
        window.addEventListener('open-product-modal', handleOpen);
        return () => window.removeEventListener('open-product-modal', handleOpen);
    }, []);
    return null;
}
