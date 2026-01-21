import React, { useState, useRef, useEffect } from 'react';

export default function VideoCall() {
    const [isConnected, setIsConnected] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);

    useEffect(() => {
        // Request camera permission on mount
        requestCameraPermission();
        return () => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, []);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const createRoom = () => {
        const newRoomId = 'room_' + Math.random().toString(36).substr(2, 9);
        setRoomId(newRoomId);
        // In a real implementation, this would create a room on a signaling server
        alert(`Sala criada: ${newRoomId}\nCompartilhe este ID com outra pessoa para iniciar a chamada.`);
    };

    const joinRoom = () => {
        if (!roomId.trim()) {
            alert('Digite o ID da sala');
            return;
        }
        setIsJoining(true);
        // In a real implementation, this would connect to the signaling server
        setTimeout(() => {
            setIsConnected(true);
            setIsJoining(false);
        }, 2000);
    };

    const endCall = () => {
        setIsConnected(false);
        setIsJoining(false);
        setRoomId('');
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
    };

    if (isConnected) {
        return (
            <div className="video-call bg-gray-900 text-white p-6 rounded-lg max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Videochamada - Sala: {roomId}</h2>
                    <button
                        onClick={endCall}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                        Encerrar Chamada
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Você</h3>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            className="w-full h-48 bg-gray-700 rounded-lg object-cover"
                        />
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Participante Remoto</h3>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            className="w-full h-48 bg-gray-700 rounded-lg object-cover"
                        />
                        <p className="text-center text-gray-400 mt-2">Aguardando conexão...</p>
                    </div>
                </div>

                <div className="mt-4 text-center text-gray-400">
                    <p>🚧 Sistema de videochamadas em desenvolvimento</p>
                    <p>Funcionalidades completas serão implementadas em breve</p>
                </div>
            </div>
        );
    }

    return (
        <div className="video-call bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">📹 Videochamadas</h2>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Pré-visualização</h3>
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-48 bg-gray-200 rounded-lg object-cover"
                />
            </div>

            {!isJoining ? (
                <div className="space-y-4">
                    <button
                        onClick={createRoom}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        Criar Nova Sala
                    </button>

                    <div className="text-center text-gray-500">ou</div>

                    <div className="space-y-2">
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Digite o ID da sala"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={joinRoom}
                            disabled={!roomId.trim()}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Entrar na Sala
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg">Conectando à sala...</p>
                </div>
            )}

            <div className="mt-6 text-center text-gray-500 text-sm">
                <p>🚧 Sistema de videochamadas em desenvolvimento</p>
                <p>WebRTC + servidor de sinalização serão implementados</p>
            </div>
        </div>
    );
}