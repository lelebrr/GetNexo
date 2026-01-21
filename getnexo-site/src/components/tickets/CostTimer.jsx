import React, { useState, useEffect } from 'react';

export default function CostTimer({ ticketId }) {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [costRate, setCostRate] = useState(50); // R$/hora
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateCost = () => {
        return ((elapsedTime / 3600) * costRate).toFixed(2);
    };

    const startTimer = () => {
        setIsRunning(true);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const stopTimer = () => {
        if (elapsedTime > 0) {
            const session = {
                startTime: new Date(Date.now() - elapsedTime * 1000),
                endTime: new Date(),
                duration: elapsedTime,
                cost: calculateCost(),
            };
            setSessions(prev => [...prev, session]);
        }
        setIsRunning(false);
        setElapsedTime(0);
    };

    const totalCost = sessions.reduce((sum, session) => sum + parseFloat(session.cost), 0) + (isRunning ? parseFloat(calculateCost()) : 0);

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Cronômetro de Custos</h4>

            {/* Timer Display */}
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                    {formatTime(elapsedTime)}
                </div>
                <div className="text-lg text-gray-600 mb-4">
                    Custo atual: R$ {calculateCost()}
                </div>

                <div className="flex justify-center gap-2">
                    {!isRunning ? (
                        <button
                            onClick={startTimer}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            ▶️ Iniciar
                        </button>
                    ) : (
                        <button
                            onClick={pauseTimer}
                            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                            ⏸️ Pausar
                        </button>
                    )}
                    <button
                        onClick={stopTimer}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        ⏹️ Parar
                    </button>
                </div>
            </div>

            {/* Configurações */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Taxa por hora (R$)
                    </label>
                    <input
                        type="number"
                        value={costRate}
                        onChange={(e) => setCostRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <div className={`px-3 py-2 rounded text-center font-medium ${!isRunning ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'
                        }`}>
                        {!isRunning ? 'Pausado' : 'Rodando'}
                    </div>
                </div>
            </div>

            {/* Sessões Anteriores */}
            {sessions.length > 0 && (
                <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Sessões de Trabalho</h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {sessions.map((session, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <div className="text-sm font-medium">
                                        {session.startTime.toLocaleString('pt-BR')} - {session.endTime.toLocaleString('pt-BR')}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Duração: {formatTime(session.duration)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">R$ {session.cost}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Total */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Custo Total:</span>
                    <span className="text-blue-600">R$ {totalCost.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}