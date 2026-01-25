import { useState, useEffect } from 'react';

export function AdminPanel() {
    const [produtos, setProdutos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        categoria: '',
        caminho: '',
        tamanho: ''
    });
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const response = await fetch('/models.json');
            const data = await response.json();
            const todosProdutos = [];

            Object.entries(data).forEach(([categoria, itens]) => {
                itens.forEach(item => {
                    todosProdutos.push({ ...item, categoria });
                });
            });

            setProdutos(todosProdutos);
            setCarregando(false);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            setCarregando(false);
        }
    };

    const handleSalvar = async () => {
        if (!novoProduto.nome || !novoProduto.categoria || !novoProduto.caminho || !novoProduto.tamanho) {
            alert('Preencha todos os campos!');
            return;
        }

        try {
            // Carregar dados atuais
            const response = await fetch('/models.json');
            const data = await response.json();

            // Adicionar novo produto
            if (!data[novoProduto.categoria]) {
                data[novoProduto.categoria] = [];
            }

            data[novoProduto.categoria].push({
                nome: novoProduto.nome,
                caminho: novoProduto.caminho,
                tamanho: parseInt(novoProduto.tamanho),
                categoria: novoProduto.categoria
            });

            // Atualizar arquivo (simulação - em produção precisaria de API)
            console.log('Produto adicionado:', novoProduto);
            alert('Produto adicionado com sucesso! (Atualize o models.json manualmente)');

            // Resetar formulário
            setNovoProduto({ nome: '', categoria: '', caminho: '', tamanho: '' });
            setShowModal(false);
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto!');
        }
    };

    const handleOtimizar = async (produto) => {
        if (!confirm(`Deseja otimizar o arquivo: ${produto.caminho}?`)) return;

        try {
            setCarregando(true);
            // Simulação de otimização
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert(`Arquivo ${produto.nome} otimizado com sucesso!`);
            setCarregando(false);
        } catch (error) {
            console.error('Erro ao otimizar:', error);
            alert('Erro ao otimizar arquivo!');
            setCarregando(false);
        }
    };

    const categorias = ['Acessórios', 'calcados', 'Casa & Deco', 'Eletrônicos', 'Vestuário'];

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
                🛠️ Painel Admin - Gerenciar Produtos 3D
            </h1>

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        background: 'linear-gradient(135deg, #007bff, #0056b3)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px'
                    }}
                >
                    ➕ Novo Produto
                </button>
            </div>

            {carregando ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div>🔄 Carregando produtos...</div>
                </div>
            ) : (
                <div style={{
                    overflowX: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8f9fa' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Nome</th>
                                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Categoria</th>
                                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Caminho</th>
                                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Tamanho (KB)</th>
                                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map((produto, index) => (
                                <tr key={index} style={{ background: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{produto.nome}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{produto.categoria}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', fontFamily: 'monospace' }}>{produto.caminho}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{produto.tamanho}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleOtimizar(produto)}
                                            style={{
                                                background: 'linear-gradient(135deg, #28a745, #20c997)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                marginRight: '5px'
                                            }}
                                        >
                                            🗜️ Otimizar
                                        </button>
                                        <button
                                            onClick={() => alert(`Editar: ${produto.nome}`)}
                                            style={{
                                                background: 'linear-gradient(135deg, #ffc107, #e0a800)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Novo Produto */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ marginBottom: '20px', color: '#333' }}>➕ Novo Produto</h2>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome:</label>
                            <input
                                type="text"
                                value={novoProduto.nome}
                                onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                                placeholder="Ex: blusa-vermelha"
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoria:</label>
                            <select
                                value={novoProduto.categoria}
                                onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Caminho:</label>
                            <input
                                type="text"
                                value={novoProduto.caminho}
                                onChange={(e) => setNovoProduto({ ...novoProduto, caminho: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                                placeholder="/glb/Vestuário/blusa-vermelha.glb"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tamanho (KB):</label>
                            <input
                                type="number"
                                value={novoProduto.tamanho}
                                onChange={(e) => setNovoProduto({ ...novoProduto, tamanho: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                                placeholder="Ex: 240"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '10px 20px',
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSalvar}
                                style={{
                                    padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#e3f2fd',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#666'
            }}>
                💡 <strong>Dicas:</strong> O caminho deve começar com /glb/ e terminar com .glb. O tamanho é em KB.
                Após adicionar um produto, atualize manualmente o models.json.
            </div>
        </div>
    );
}