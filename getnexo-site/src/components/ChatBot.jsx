import React, { useState, useRef, useEffect } from 'react';

const STORAGE_KEY = 'getnexo_chat_messages';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem(STORAGE_KEY);
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages).map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(parsed);
            } catch (error) {
                // Error loading chat messages - using default welcome message
                const welcomeMessage = {
                    id: 1,
                    type: 'bot',
                    content: 'Olá! Sou o GetNexo AI. Como posso ajudar você hoje?',
                    timestamp: new Date()
                };
                setMessages([welcomeMessage]);
            }
        } else {
            // Initialize with welcome message
            const welcomeMessage = {
                id: 1,
                type: 'bot',
                content: 'Olá! Sou o GetNexo AI. Como posso ajudar você hoje?',
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
        }
    }, []);

    // Save messages to localStorage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const clearChat = () => {
        const welcomeMessage = {
            id: Date.now(),
            type: 'bot',
            content: 'Olá! Sou o GetNexo AI. Como posso ajudar você hoje?',
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const quickSuggestions = [
        'Como funciona a plataforma?',
        'Quais são as funcionalidades?',
        'Preciso de ajuda com automação'
    ];

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            // Analyze sentiment of user message
            const sentimentResult = window.sentiment ? window.sentiment.analyze(userMessage.content) : null;

            // Prepare context (last 10 messages)
            const context = messages.slice(-10).map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    context: context,
                    sentiment: sentimentResult
                })
            });

            const data = await response.json();

            if (response.ok) {
                const botMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: data.response,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                const errorMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: 'Desculpe, ocorreu um erro. Tente novamente.',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            // Chat error occurred - showing user-friendly message
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: 'Erro de conexão. Verifique sua internet.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors z-50"
                aria-label="Abrir chat"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-200 transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-500 text-white rounded-t-lg">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-blue-500 font-bold text-sm">AI</span>
                        </div>
                        <div>
                            <div className="font-semibold text-sm">GetNexo AI</div>
                            <div className="text-xs opacity-75">Online</div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={clearChat}
                            className="text-white hover:text-gray-200"
                            aria-label="Limpar conversa"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200"
                            aria-label="Fechar chat"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${message.type === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {message.content}
                                <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 px-3 py-2 rounded-lg">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {messages.length === 1 && (
                    <div className="px-4 pb-2">
                        <div className="text-xs text-gray-500 mb-2">Sugestões rápidas:</div>
                        <div className="flex flex-wrap gap-2">
                            {quickSuggestions.map((suggestion) => (
                                <button
                                    key={`suggestion-${suggestion.replace(/\s+/g, '-').toLowerCase()}`}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-full transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}