import React, { useState, useEffect } from 'react';
import SentimentIndicator from '../SentimentIndicator';

const LiveConversations = () => {
    const [conversations, setConversations] = useState([
        { id: 1, user: '+55 11 99999-0001', lastMsg: 'Gostaria de saber o preço do plano Pro', time: '14:20', score: 8, category: 'satisfacao', confidence: 0.92 },
        { id: 2, user: '+55 21 98888-1111', lastMsg: 'O bot não está carregando o boleto!', time: '14:22', score: 2, category: 'raiva', confidence: 0.98 },
        { id: 3, user: '+55 31 97777-2222', lastMsg: 'Muito obrigado pela ajuda!', time: '14:25', score: 10, category: 'empolgação', confidence: 0.88 },
        { id: 4, user: '+55 41 96666-3333', lastMsg: 'Quanto tempo demora a entrega?', time: '14:28', score: 5, category: 'neutro', confidence: 0.75 },
    ]);

    return (
        <div className="conversations-wrapper">
            <div className="conv-header">
                <h3>Live Terminal</h3>
                <div className="status-badge">4 Online</div>
            </div>

            <div className="conv-list">
                {conversations.map(conv => (
                    <div key={conv.id} className="conv-item cyber-card">
                        <div className="conv-user">
                            <span className="user-id">{conv.user}</span>
                            <span className="time">{conv.time}</span>
                        </div>

                        <div className="conv-msg">
                            <p>{conv.lastMsg}</p>
                        </div>

                        <div className="conv-footer">
                            <div className="sentiment-box">
                                <span className="label">Sentimento IA:</span>
                                <SentimentIndicator
                                    score={conv.score}
                                    category={conv.category}
                                    confidence={conv.confidence}
                                    size="small"
                                />
                            </div>
                            <button className="btn-terminal">Entrar</button>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .conversations-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .conv-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .conv-header h3 {
                    font-size: 0.9rem;
                    color: #ffc400;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .status-badge {
                    font-size: 0.6rem;
                    background: rgba(0, 247, 255, 0.1);
                    color: #00f7ff;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-weight: 800;
                }
                .conv-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .conv-item {
                    padding: 1.2rem !important;
                }
                .conv-user {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.8rem;
                }
                .user-id {
                    font-size: 0.8rem;
                    color: #fff;
                    font-family: 'JetBrains Mono', monospace;
                }
                .time {
                    font-size: 0.7rem;
                    color: #555;
                }
                .conv-msg p {
                    font-size: 0.85rem;
                    color: #aaa;
                    margin: 0;
                    margin-bottom: 1rem;
                    line-height: 1.4;
                }
                .conv-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #1a1a1a;
                    padding-top: 0.8rem;
                }
                .sentiment-box {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }
                .sentiment-box .label {
                    font-size: 0.65rem;
                    color: #666;
                    text-transform: uppercase;
                    font-weight: 800;
                }
                .btn-terminal {
                    background: none;
                    border: 1px solid #333;
                    color: #888;
                    font-size: 0.7rem;
                    padding: 0.3rem 0.8rem;
                    border-radius: 4px;
                    cursor: pointer;
                    text-transform: uppercase;
                    font-weight: 700;
                    transition: 0.3s;
                }
                .btn-terminal:hover {
                    border-color: #00f7ff;
                    color: #00f7ff;
                    box-shadow: 0 0 10px rgba(0, 247, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default LiveConversations;
