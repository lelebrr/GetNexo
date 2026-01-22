// src/components/Personalizar.jsx - Personalização completa do bot
import { useState, useEffect } from 'react';

export default function Personalizar() {
    const [configs, setConfigs] = useState({
        logo: null,
        corPrimaria: '#00f7ff',
        corSecundaria: '#0099cc',
        nomeBot: 'GetNexo Assistant',
        mensagemInicial: 'Oi! Como posso ajudar você hoje?',
        emojiBot: '🤖',
        tema: 'dark',
        notificacoes: true,
        somNotificacao: true
    });

    const [previewLogo, setPreviewLogo] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [carregando, setCarregando] = useState(true);

    // Carregar configurações atuais
    useEffect(() => {
        carregarConfigs();
    }, []);

    const carregarConfigs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/personalizar', {
                headers: { 'Authorization': token }
            });

            if (response.ok) {
                const data = await response.json();
                setConfigs({ ...configs, ...data.configs });
                if (data.configs.logo) {
                    setPreviewLogo(data.configs.logo);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar configs:', error);
        } finally {
            setCarregando(false);
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo e tamanho
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione uma imagem válida.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB
            alert('Imagem muito grande. Máximo 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewLogo(reader.result);
            setConfigs({ ...configs, logo: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const salvarConfigs = async () => {
        setSalvando(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/personalizar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(configs)
            });

            if (response.ok) {
                alert('Personalização salva com sucesso! O chat será atualizado automaticamente.');
                // Forçar reload do chat se estiver aberto
                if (window.nexoChat) {
                    window.nexoChat.reload();
                }
            } else {
                throw new Error('Erro ao salvar configurações');
            }
        } catch (error) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setSalvando(false);
        }
    };

    const resetarPadrao = () => {
        if (confirm('Tem certeza que deseja resetar para as configurações padrão?')) {
            setConfigs({
                logo: null,
                corPrimaria: '#00f7ff',
                corSecundaria: '#0099cc',
                nomeBot: 'GetNexo Assistant',
                mensagemInicial: 'Oi! Como posso ajudar você hoje?',
                emojiBot: '🤖',
                tema: 'dark',
                notificacoes: true,
                somNotificacao: true
            });
            setPreviewLogo(null);
        }
    };

    const testarNotificacao = () => {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(`${configs.emojiBot} ${configs.nomeBot}`, {
                    body: 'Esta é uma notificação de teste!',
                    icon: previewLogo || '/logo.svg'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
        }

        if (configs.somNotificacao) {
            // Tocar som de notificação
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => { }); // Ignore se falhar
        }
    };

    if (carregando) {
        return (
            <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black">Personalize seu Bot</h2>
                <div className="flex gap-3">
                    <button
                        onClick={testarNotificacao}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                    >
                        Testar Notificação
                    </button>
                    <button
                        onClick={resetarPadrao}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition"
                    >
                        Resetar Padrão
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Preview do Chat */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-bold mb-4">Preview do Chat</h3>

                    {/* Simulação do chat */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4" style={{ backgroundColor: configs.tema === 'dark' ? '#1e293b' : '#ffffff' }}>
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg" style={{ backgroundColor: configs.corPrimaria + '20' }}>
                            {previewLogo ? (
                                <img src={previewLogo} alt="Logo" className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                                    {configs.emojiBot}
                                </div>
                            )}
                            <div>
                                <div className="font-bold text-sm" style={{ color: configs.corPrimaria }}>
                                    {configs.nomeBot}
                                </div>
                                <div className="text-xs opacity-70" style={{ color: configs.tema === 'dark' ? '#e5e7eb' : '#374151' }}>
                                    Online
                                </div>
                            </div>
                        </div>

                        {/* Mensagens */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-start">
                                <div
                                    className="max-w-[80%] p-3 rounded-lg text-sm"
                                    style={{
                                        backgroundColor: configs.corSecundaria + '20',
                                        color: configs.tema === 'dark' ? '#e5e7eb' : '#374151'
                                    }}
                                >
                                    {configs.mensagemInicial}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div
                                    className="max-w-[80%] p-3 rounded-lg text-sm text-white"
                                    style={{ backgroundColor: configs.corPrimaria }}
                                >
                                    Obrigado!
                                </div>
                            </div>
                        </div>

                        {/* Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Digite sua mensagem..."
                                className="flex-1 px-3 py-2 rounded-lg text-sm"
                                style={{
                                    backgroundColor: configs.tema === 'dark' ? '#374151' : '#f3f4f6',
                                    color: configs.tema === 'dark' ? '#e5e7eb' : '#374151'
                                }}
                            />
                            <button
                                className="px-4 py-2 rounded-lg text-white font-bold"
                                style={{ backgroundColor: configs.corPrimaria }}
                            >
                                →
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        Este é o preview do seu chat personalizado. As mudanças são aplicadas automaticamente.
                    </p>
                </div>

                {/* Configurações */}
                <div className="space-y-6">
                    {/* Logo */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-bold mb-4">Logo do Bot</h3>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                {previewLogo ? (
                                    <img src={previewLogo} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl">{configs.emojiBot}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gradient-to-r file:from-cyan-500 file:to-green-500 file:text-black hover:file:from-cyan-400 hover:file:to-green-400"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG • Máx 2MB • Recomendado: 256x256px
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setPreviewLogo(null);
                                setConfigs({ ...configs, logo: null });
                            }}
                            className="text-sm text-red-400 hover:text-red-300"
                        >
                            Remover logo
                        </button>
                    </div>

                    {/* Cores */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-bold mb-4">Cores do Tema</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Cor Primária</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={configs.corPrimaria}
                                        onChange={(e) => setConfigs({ ...configs, corPrimaria: e.target.value })}
                                        className="w-12 h-8 rounded border-none cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={configs.corPrimaria}
                                        onChange={(e) => setConfigs({ ...configs, corPrimaria: e.target.value })}
                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Cor Secundária</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={configs.corSecundaria}
                                        onChange={(e) => setConfigs({ ...configs, corSecundaria: e.target.value })}
                                        className="w-12 h-8 rounded border-none cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={configs.corSecundaria}
                                        onChange={(e) => setConfigs({ ...configs, corSecundaria: e.target.value })}
                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Textos */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-bold mb-4">Textos e Mensagens</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Nome do Bot</label>
                                <input
                                    type="text"
                                    value={configs.nomeBot}
                                    onChange={(e) => setConfigs({ ...configs, nomeBot: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                                    placeholder="Ex: Meu Assistente"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Mensagem Inicial</label>
                                <input
                                    type="text"
                                    value={configs.mensagemInicial}
                                    onChange={(e) => setConfigs({ ...configs, mensagemInicial: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                                    placeholder="Oi! Como posso ajudar?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Emoji do Bot</label>
                                <input
                                    type="text"
                                    value={configs.emojiBot}
                                    onChange={(e) => setConfigs({ ...configs, emojiBot: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                                    placeholder="🤖"
                                    maxLength="2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notificações */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-bold mb-4">Notificações</h3>

                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={configs.notificacoes}
                                    onChange={(e) => setConfigs({ ...configs, notificacoes: e.target.checked })}
                                    className="mr-3"
                                />
                                <span className="text-sm">Habilitar notificações push</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={configs.somNotificacao}
                                    onChange={(e) => setConfigs({ ...configs, somNotificacao: e.target.checked })}
                                    className="mr-3"
                                />
                                <span className="text-sm">Som de notificação</span>
                            </label>
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                            As notificações ajudam seus clientes a não perderem mensagens importantes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Botão Salvar */}
            <div className="mt-8 text-center">
                <button
                    onClick={salvarConfigs}
                    disabled={salvando}
                    className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded-lg hover:from-cyan-400 hover:to-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {salvando ? 'Salvando...' : 'Salvar Personalização'}
                </button>
            </div>
        </div>
    );
}