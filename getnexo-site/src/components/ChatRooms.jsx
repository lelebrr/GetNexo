import React, { useState, useEffect, useRef } from 'react';

export default function ChatRooms() {
    const [rooms, setRooms] = useState([
        { id: 1, name: 'Geral', messages: [], active: true },
        { id: 2, name: 'Suporte', messages: [], active: false },
        { id: 3, name: 'Dicas IA', messages: [], active: false },
        { id: 4, name: 'AR/VR', messages: [], active: false }
    ]);
    const [currentRoom, setCurrentRoom] = useState(1);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('chat_username') || 'Usuário');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Load messages from localStorage
        loadRoomMessages();
        scrollToBottom();
    }, [currentRoom]);

    useEffect(() => {
        scrollToBottom();
    }, [rooms]);

    const loadRoomMessages = () => {
        const savedMessages = localStorage.getItem(`chat_room_${currentRoom}`);
        if (savedMessages) {
            const parsed = JSON.parse(savedMessages);
            setRooms(prev => prev.map(room =>
                room.id === currentRoom
                    ? { ...room, messages: parsed }
                    : room
            ));
        }
    };

    const saveRoomMessages = (roomId, messages) => {
        localStorage.setItem(`chat_room_${roomId}`, JSON.stringify(messages));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: username,
            text: message.trim(),
            timestamp: new Date()
        };

        setRooms(prev => prev.map(room => {
            if (room.id === currentRoom) {
                const updatedMessages = [...room.messages, newMessage];
                saveRoomMessages(currentRoom, updatedMessages);
                return { ...room, messages: updatedMessages };
            }
            return room;
        }));

        setMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const switchRoom = (roomId) => {
        setCurrentRoom(roomId);
        setRooms(prev => prev.map(room => ({
            ...room,
            active: room.id === roomId
        })));
    };

    const currentRoomData = rooms.find(room => room.id === currentRoom);

    return (
        <div className="chat-rooms bg-white rounded-lg shadow-xl flex h-96 max-w-4xl mx-auto">
            {/* Rooms Sidebar */}
            <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="font-bold mb-4 text-gray-800">Salas de Chat</h3>
                <div className="space-y-2">
                    {rooms.map(room => (
                        <button
                            key={room.id}
                            onClick={() => switchRoom(room.id)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${room.active
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="font-semibold">{room.name}</div>
                            <div className="text-sm opacity-75">
                                {room.messages.length} mensagens
                            </div>
                        </button>
                    ))}
                </div>

                {/* Username Input */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seu Nome:
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            localStorage.setItem('chat_username', e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite seu nome"
                    />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-blue-500 text-white p-4">
                    <h2 className="text-xl font-bold">{currentRoomData?.name}</h2>
                    <p className="text-sm opacity-90">
                        {currentRoomData?.messages.length} mensagens
                    </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {currentRoomData?.messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.user === username ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${msg.user === username
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                <div className="text-sm font-semibold mb-1">{msg.user}</div>
                                <div>{msg.text}</div>
                                <div className={`text-xs mt-1 ${msg.user === username ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                    {msg.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={`Digite sua mensagem em ${currentRoomData?.name}...`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!message.trim()}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}