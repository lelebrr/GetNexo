import React from 'react';

const QueueAbandonmentIndicator = ({ data, title = "Abandono de Fila" }) => {
    const getAbandonmentColor = (rate) => {
        if (rate < 5) return 'text-green-600 bg-green-100';
        if (rate < 10) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>

            <div className="text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold mb-2 ${getAbandonmentColor(data.rate)}`}>
                    {data.rate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                    {data.abandoned} de {data.total_tickets} tickets abandonados
                </div>
            </div>

            <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxa aceitável:</span>
                    <span className="font-medium">{'< 5%'}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Meta atual:</span>
                    <span className="font-medium">2-3%</span>
                </div>
            </div>
        </div>
    );
};

export default QueueAbandonmentIndicator;