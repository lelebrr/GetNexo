import { useState, useEffect, useRef } from 'react';
import { ARViewer } from './ARViewer.jsx';

export function ChatVendedor() {
    const [mensagem, setMensagem] = useState('');
    const [conversa, setConversa] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [produtoAtual, setProdutoAtual] = useState(null);
    const [mostrarCheckout, setMostrarCheckout] = useState(false);
    const [desconto, setDesconto] = useState(false);
    const inputRef = useRef(null);

    // Carregar histórico do localStorage
    useEffect(() => {
        const historico = localStorage.getItem('chatVendedor_conversa');
        if (historico) {
            setConversa(JSON.parse(historico));
        }

        // Carregar carrinho
        const carrinho = localStorage.getItem('carrinho_compras');
        if (carrinho) {
            console.log('Carrinho atual:', JSON.parse(carrinho));
        }
    }, []);

    // Salvar histórico no localStorage
    useEffect(() => {
        localStorage.setItem('chatVendedor_conversa', JSON.stringify(conversa));
    }, [conversa]);

    const processarMensagem = (texto) => {
        // Lista de produtos disponíveis
        const produtosDisponiveis = [
            'bolsa-salmon', 'oculos-de-sol', 'pulseira-prata', 'relogio-prata',
            'bota-marrom-com-barro', 'chinelo-amarelo', 'salto-bege', 'sapato-social-de-couro-preto', 'tenis-branco', 'tenis-preto',
            'abajur', 'cadeira-gamer', 'mesa-de-centro', 'quadro-3d', 'vasinho-de-planta',
            'carregador-wireless', 'fone-de-ouvido', 'smartphone', 'smartwatch', 'teclado-gamer',
            'blusa-feminina', 'camiseta-azul', 'camiseta-branca', 'calca-jeans', 'jaqueta-verde'
        ];

        // Busca produto na mensagem
        const produtoEncontrado = produtosDisponiveis.find(produto =>
            texto.toLowerCase().includes(produto.replace(/[-]/g, ' ').toLowerCase()) ||
            texto.toLowerCase().includes(produto.replace(/([A-Z])/g, ' $1').toLowerCase())
        );

        return produtoEncontrado || null;
    };

    const handleEnviar = () => {
        if (!mensagem.trim()) return;

        const novaMensagem = {
            id: Date.now(),
            texto: mensagem,
            role: 'user',
            timestamp: new Date().toISOString()
        };

        setConversa(prev => [...prev, novaMensagem]);
        setMensagem('');
        setCarregando(true);

        // Processar mensagem após um curto delay
        setTimeout(() => {
            const produtoNome = processarMensagem(mensagem);

            if (produtoNome) {
                // Produto encontrado
                setProdutoAtual(produtoNome);
                const respostaBot = {
                    id: Date.now() + 1,
                    texto: `Perfeito! Aqui está o ${produtoNome} em 3D. Veja como ele fica e escolha sua opção:`,
                    role: 'bot',
                    produto: produtoNome,
                    timestamp: new Date().toISOString()
                };
                setConversa(prev => [...prev, respostaBot]);
            } else {
                // Produto não encontrado
                const respostaBot = {
                    id: Date.now() + 1,
                    texto: `Desculpe, não encontrei esse produto. Posso te mostrar nossos modelos mais populares? Tenho tênis, blusas, acessórios...`,
                    role: 'bot',
                    timestamp: new Date().toISOString()
                };
                setConversa(prev => [...prev, respostaBot]);
            }
            setCarregando(false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEnviar();
        }
    };

    const handleComprar = () => {
        const preco = Math.floor(Math.random() * 200) + 50; // R$50-R$250
        const respostaBot = {
            id: Date.now() + 1,
            texto: `Ótima escolha! O ${produtoAtual} custa R$${preco},00. Escolha sua forma de pagamento:`,
            role: 'bot',
            produto: produtoAtual,
            preco: preco,
            timestamp: new Date().toISOString()
        };
        setConversa(prev => [...prev, respostaBot]);
        setMostrarCheckout(true);
    };

    const handleCarrinho = () => {
        // Adicionar ao carrinho
        let carrinho = JSON.parse(localStorage.getItem('carrinho_compras') || '[]');
        carrinho.push({
            produto: produtoAtual,
            data: new Date().toISOString()
        });
        localStorage.setItem('carrinho_compras', JSON.stringify(carrinho));

        const respostaBot = {
            id: Date.now() + 1,
            texto: `${produtoAtual} adicionado ao carrinho! 🛒 Você tem ${carrinho.length} item(s) no carrinho. Quer continuar comprando?`,
            role: 'bot',
            carrinho: carrinho.length,
            timestamp: new Date().toISOString()
        };
        setConversa(prev => [...prev, respostaBot]);
    };

    const handleWhatsApp = () => {
        const numero = '21999999999'; // Substitua pelo número real
        const mensagem = `Olá! Gostaria de comprar o ${produtoAtual}`;
        const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');

        const respostaBot = {
            id: Date.now() + 1,
            texto: `Abri o WhatsApp pra você! Fale com nosso vendedor sobre o ${produtoAtual}.`,
            role: 'bot',
            timestamp: new Date().toISOString()
        };
        setConversa(prev => [...prev, respostaBot]);
    };

    const handleHesitar = () => {
        setDesconto(true);
        const respostaBot = {
            id: Date.now() + 1,
            texto: `Entendo sua preocupação! 😊 Posso te dar 10% de desconto AGORA. Confirma que quer o ${produtoAtual} com desconto?`,
            role: 'bot',
            produto: produtoAtual,
            timestamp: new Date().toISOString()
        };
        setConversa(prev => [...prev, respostaBot]);
    };

    const handleConfirmarDesconto = () => {
        const precoOriginal = Math.floor(Math.random() * 200) + 50;
        const precoDesconto = Math.floor(precoOriginal * 0.9);

        const respostaBot = {
            id: Date.now() + 1,
            texto: `🎉 Desconto confirmado! ${produtoAtual} por R$${precoDesconto},00 (era R$${precoOriginal},00). Pagamento aprovado! Seu ${produtoAtual} chega em 2 dias. 🚚`,
            role: 'bot',
            produto: produtoAtual,
            preco: precoDesconto,
            status: 'comprado',
            timestamp: new Date().toISOString()
        };
        setConversa(prev => [...prev, respostaBot]);
        setMostrarCheckout(false);
        setDesconto(false);
    };

    const getPrecoProduto = (produtoNome) => {
        const precos = {
            'blusa-feminina': 89,
            'tenis-branco': 199,
            'cadeira-gamer': 899,
            'smartphone': 1299,
            'relogio-prata': 299
        };
        return precos[produtoNome] || Math.floor(Math.random() * 200) + 50;
    };

    return (
        <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                🛒 Chat Vendedor 24h
            </h2>

            <div style={{
                height: '500px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                background: '#f9f9f9'
            }}>
                {conversa.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            marginBottom: '15px',
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '80%',
                                padding: '10px 15px',
                                borderRadius: '18px',
                                background: msg.role === 'user'
                                    ? 'linear-gradient(135deg, #007bff, #0056b3)'
                                    : '#e9ecef',
                                color: msg.role === 'user' ? 'white' : '#333',
                                wordBreak: 'break-word'
                            }}
                        >
                            {msg.texto}

                            {msg.produto && !msg.status && (
                                <div style={{ marginTop: '10px' }}>
                                    <ARViewer produtoNome={msg.produto} />

                                    {/* Botões de compra */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '8px',
                                        marginTop: '10px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <button
                                            onClick={handleComprar}
                                            style={{
                                                background: 'linear-gradient(135deg, #28a745, #20c997)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            💳 Comprar agora
                                        </button>
                                        <button
                                            onClick={handleCarrinho}
                                            style={{
                                                background: 'linear-gradient(135deg, #ffc107, #e0a800)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            🛒 Carrinho
                                        </button>
                                        <button
                                            onClick={handleWhatsApp}
                                            style={{
                                                background: 'linear-gradient(135deg, #25d366, #128c7e)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            💬 WhatsApp
                                        </button>
                                        <button
                                            onClick={handleHesitar}
                                            style={{
                                                background: 'linear-gradient(135deg, #6c757d, #5a6268)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            🤔 Estou indeciso
                                        </button>
                                    </div>
                                </div>
                            )}

                            {msg.status === 'comprado' && (
                                <div style={{
                                    marginTop: '10px',
                                    padding: '10px',
                                    background: '#d4edda',
                                    border: '1px solid #c3e6cb',
                                    borderRadius: '4px',
                                    color: '#155724'
                                }}>
                                    ✅ <strong>Pedido confirmado!</strong> Seu {msg.produto} será entregue em 2 dias.
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {carregando && (
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        <div>🤖 Vendedor está pensando...</div>
                    </div>
                )}

                {mostrarCheckout && (
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
                            maxWidth: '400px',
                            width: '90%'
                        }}>
                            <h3>Finalizar Compra</h3>
                            <p><strong>Produto:</strong> {produtoAtual}</p>
                            <p><strong>Preço:</strong> R${getPrecoProduto(produtoAtual)},00</p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button
                                    onClick={() => setMostrarCheckout(false)}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
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
                                    onClick={desconto ? handleConfirmarDesconto : () => { }}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: 'linear-gradient(135deg, #28a745, #20c997)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {desconto ? 'Confirmar Desconto' : 'Pagar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <textarea
                    ref={inputRef}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite: 'quero ver blusa feminina' ou 'mostra tenis branco'"
                    style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        resize: 'vertical',
                        minHeight: '50px',
                        fontSize: '14px'
                    }}
                />
                <button
                    onClick={handleEnviar}
                    disabled={!mensagem.trim() || carregando}
                    style={{
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #28a745, #20c997)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        disabled: {
                            opacity: '0.6',
                            cursor: 'not-allowed'
                        }
                    }}
                >
                    Enviar
                </button>
            </div>

            <div style={{
                marginTop: '15px',
                padding: '10px',
                background: '#e3f2fd',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#666'
            }}>
                💡 Venda 24h: Compre diretamente no chat, adicione ao carrinho ou fale pelo WhatsApp.
            </div>
        </div>
    );
}