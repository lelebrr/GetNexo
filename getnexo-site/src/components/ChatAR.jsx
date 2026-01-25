import { useState, useEffect, useRef } from 'react';
import { ARViewer } from './ARViewer.jsx';

export function ChatAR() {
    const [mensagem, setMensagem] = useState('');
    const [conversa, setConversa] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const inputRef = useRef(null);

    // Carregar histórico do localStorage
    useEffect(() => {
        const historico = localStorage.getItem('chatAR_conversa');
        if (historico) {
            setConversa(JSON.parse(historico));
        }
    }, []);

    // Salvar histórico no localStorage
    useEffect(() => {
        localStorage.setItem('chatAR_conversa', JSON.stringify(conversa));
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
                const respostaBot = {
                    id: Date.now() + 1,
                    texto: `Aqui está o produto em 3D:`,
                    role: 'bot',
                    produto: produtoNome,
                    timestamp: new Date().toISOString()
                };
                setConversa(prev => [...prev, respostaBot]);
            } else {
                // Produto não encontrado
                const sugestoes = [
                    'tenis preto', 'relógio prata', 'blusa feminina',
                    'cadeira gamer', 'smartphone', 'oculos de sol'
                ];
                const respostaBot = {
                    id: Date.now() + 1,
                    texto: `Não encontrei esse produto. Tenta algo como: ${sugestoes.join(', ')}`,
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

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                🛍️ Chat com AR 3D
            </h2>

            <div style={{
                height: '400px',
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
                                maxWidth: '70%',
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

                            {msg.produto && (
                                <div style={{ marginTop: '10px' }}>
                                    <ARViewer produtoNome={msg.produto} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {carregando && (
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        <div>🤖 Bot está pensando...</div>
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
                💡 Dicas: Tente "blusa feminina", "tenis preto", "cadeira gamer", "smartphone", etc.
            </div>
        </div>
    );
}