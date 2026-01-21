import React, { useState, useEffect } from 'react';
import SentimentIndicator from '../SentimentIndicator';
import PaymentButton from './PaymentButton';
import useSentimentAnalysis from '../../hooks/useSentimentAnalysis';

/**
 * Componente ChatMessage
 * Exemplo de como integrar análise de sentimentos em mensagens de chat
 */
const ChatMessage = ({ message, isUser = false, showSentiment = true }) => {
    const { analyzeText, loading: sentimentLoading, lastAnalysis } = useSentimentAnalysis();
    const [sentimentData, setSentimentData] = useState(null);
    const [showAnalysis, setShowAnalysis] = useState(false);

    useEffect(() => {
        // Analisa o sentimento da mensagem quando ela é recebida
        if (showSentiment && message.text && !isUser) {
            analyzeText(message.text).then(setSentimentData).catch(console.error);
        }
    }, [message.text, showSentiment, isUser, analyzeText]);

    const handleSentimentClick = () => {
        setShowAnalysis(!showAnalysis);
    };

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                {/* Cabeçalho da mensagem */}
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs opacity-70">
                        {isUser ? 'Você' : message.sender || 'Cliente'}
                    </span>

                    {/* Indicador de sentimento */}
                    {showSentiment && sentimentData && !isUser && (
                        <div
                            className="cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={handleSentimentClick}
                        >
                            <SentimentIndicator
                                score={sentimentData.score}
                                sentiment={sentimentData.sentiment}
                                category={sentimentData.category}
                                confidence={sentimentData.confidence}
                                size="small"
                                showBadge={false}
                            />
                        </div>
                    )}

                    {/* Loading do sentimento */}
                    {showSentiment && sentimentLoading && !isUser && (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    )}
                </div>

                {/* Conteúdo da mensagem */}
                <p className="text-sm">{message.text}</p>

                {/* Botão de pagamento WhatsApp Pay */}
                {message.paymentData && (
                    <PaymentButton
                        amount={message.paymentData.amount}
                        currency={message.paymentData.currency || 'BRL'}
                        description={message.paymentData.description || message.text}
                        phone={message.senderPhone || phone}
                        chatMessageId={message.id}
                        onPaymentCreated={(data) => {
                            console.log('Pagamento criado:', data);
                            // Aqui poderia emitir um evento para atualizar o chat
                        }}
                        onPaymentSuccess={(data) => {
                            console.log('Pagamento confirmado:', data);
                            // Aqui poderia mostrar uma notificação de sucesso
                        }}
                    />
                )}

                {/* Timestamp */}
                <span className="text-xs opacity-70 block mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>

                {/* Análise detalhada de sentimento */}
                {showAnalysis && sentimentData && (
                    <div className="mt-3 p-2 bg-white bg-opacity-10 rounded border border-white border-opacity-20">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="font-semibold">Score:</span> {sentimentData.score}/10
                            </div>
                            <div>
                                <span className="font-semibold">Categoria:</span> {sentimentData.category}
                            </div>
                            <div>
                                <span className="font-semibold">Confiança:</span> {Math.round(sentimentData.confidence * 100)}%
                            </div>
                            <div>
                                <span className="font-semibold">Palavras-chave:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {sentimentData.keywords?.slice(0, 3).map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="bg-white bg-opacity-20 px-1 py-0.5 rounded text-xs"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Barra de sentimento */}
                        <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                                <span>Raiva</span>
                                <span>Satisfação</span>
                            </div>
                            <div className="w-full bg-gray-700 bg-opacity-50 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${sentimentData.score * 10}%`,
                                        backgroundColor: sentimentData.score <= 2 ? '#ef4444' :
                                            sentimentData.score <= 4 ? '#f97316' :
                                                sentimentData.score <= 6 ? '#eab308' :
                                                    sentimentData.score <= 8 ? '#22c55e' : '#10b981'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
