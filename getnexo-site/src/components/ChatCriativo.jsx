import { useState, useEffect, useRef } from 'react';
import { ARViewer } from './ARViewer.jsx';

export function ChatCriativo() {
    const [mensagem, setMensagem] = useState('');
    const [conversa, setConversa] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [gerando, setGerando] = useState(false);
    const inputRef = useRef(null);

    // Carregar histórico do localStorage
    useEffect(() => {
        const historico = localStorage.getItem('chatCriativo_conversa');
        if (historico) {
            setConversa(JSON.parse(historico));
        }
    }, []);

    // Salvar histórico no localStorage
    useEffect(() => {
        localStorage.setItem('chatCriativo_conversa', JSON.stringify(conversa));
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

    const gerarProduto = async (produtoNome) => {
        setGerando(true);

        try {
            // 1. Gerar imagem com IA (simulação)
            const prompt = `Produto ${produtoNome} realista, alta qualidade, fundo neutro, e-commerce`;
            const imageUrl = `https://picsum.photos/seed/${produtoNome}-${Date.now()}/400/400.jpg`;

            // Simular delay de IA
            await new Promise(resolve => setTimeout(resolve, 3000));

            // 2. Criar arquivo GLB falso (simulação)
            const glbPath = `/glb/Vestuário/${produtoNome}.glb`;
            const tamanhoKB = Math.floor(Math.random() * 500) + 100; // 100-600KB

            // 3. Atualizar models.json (simulação)
            const novoProduto = {
                nome: produtoNome,
                caminho: glbPath,
                tamanho: tamanhoKB,
                categoria: 'Vestuário'
            };

            // 4. Adicionar à conversa
            const respostaBot = {
                id: Date.now() + 1,
                texto: `Aqui está uma imagem do produto que gerei pra você. Agora vou criar o modelo 3D...`,
                role: 'bot',
                imagem: imageUrl,
                timestamp: new Date().toISOString()
            };

            setConversa(prev => [...prev, respostaBot]);

            // Simular criação do 3D
            await new Promise(resolve => setTimeout(resolve, 2000));

            const resposta3D = {
                id: Date.now() + 2,
                texto: `Pronto! Criei o modelo 3D de ${produtoNome}. Quer ver em AR?`,
                role: 'bot',
                produto: produtoNome,
                timestamp: new Date().toISOString()
            };

            setConversa(prev => [...prev, resposta3D]);

            // 5. Atualizar localStorage do models.json (simulação)
            console.log('Produto gerado:', novoProduto);

        } catch (error) {
            console.error('Erro ao gerar produto:', error);
            const respostaErro = {
                id: Date.now() + 1,
                texto: 'Desculpe, tive um problema ao gerar o produto. Tente outro produto?',
                role: 'bot',
                timestamp: new Date().toISOString()
            };
            setConversa(prev => [...prev, respostaErro]);
        }

        setGerando(false);
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
                // Produto não encontrado - gerar novo
                const respostaBot = {
                    id: Date.now() + 1,
                    texto: `Não achei "${mensagem}". Vou gerar um produto personalizado pra você... Aguarde 10 segundos...`,
                    role: 'bot',
                    timestamp: new Date().toISOString()
                };
                setConversa(prev => [...prev, respostaBot]);

                // Gerar produto novo
                setTimeout(() => {
                    gerarProduto(mensagem.toLowerCase().replace(/\s+/g, '-'));
                }, 1000);
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
            maxWidth: '700px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                🎨 Chat Criativo com IA
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

                            {msg.imagem && (
                                <div style={{ marginTop: '10px' }}>
                                    <img
                                        src={msg.imagem}
                                        alt="Produto gerado"
                                        style={{
                                            maxWidth: '200px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd'
                                        }}
                                    />
                                </div>
                            )}

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

                {gerando && (
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        <div>🎨 IA está criando seu produto...</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                            Gerando imagem + modelo 3D
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
                    placeholder="Digite: 'quero uma blusa vermelha' ou 'cria um tênis azul'"
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
                    disabled={!mensagem.trim() || carregando || gerando}
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
                💡 Dicas: Tente "blusa vermelha", "tênis azul", "mochila preta", "óculos moderno".
                Se não existir, a IA vai criar pra você!
            </div>

            <div style={{
                marginTop: '10px',
                padding: '10px',
                background: '#fff3cd',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#856404'
            }}>
                ⚠️ Este é um protótipo. As imagens e modelos 3D gerados são simulações.
                Em produção, integre com APIs reais (DALL-E, MidJourney, Luma AI, etc.).
            </div>
        </div>
    );
}