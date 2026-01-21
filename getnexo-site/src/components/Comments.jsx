import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function Comments({ projectId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const socketRef = useRef(null);

    useEffect(() => {
        fetchComments();
        setupSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [projectId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments?projectId=${projectId}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const setupSocket = () => {
        socketRef.current = io();

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-project', projectId);
        });

        socketRef.current.on('new-comment', (comment) => {
            setComments(prev => [...prev, comment]);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    text: newComment.trim()
                })
            });

            if (response.ok) {
                setNewComment('');
                // The comment will be added via socket.io
            } else {
                console.error('Error posting comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    if (loading) return <div>Carregando comentários...</div>;

    return (
        <div className="comments-section max-w-2xl mx-auto p-4">
            <h3 className="text-lg font-semibold mb-4">Comentários ({comments.length})</h3>

            {/* Comments List */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {comments.map(comment => (
                    <div key={comment.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                            src={comment.userAvatar || '/default-avatar.png'}
                            alt={comment.userName}
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">{comment.userName}</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(comment.timestamp).toLocaleString('pt-BR')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-800 mt-1">{comment.text}</p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        Nenhum comentário ainda. Seja o primeiro!
                    </div>
                )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="flex space-x-3">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Digite seu comentário..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={500}
                />
                <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}