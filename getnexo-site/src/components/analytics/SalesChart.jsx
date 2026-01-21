import React from 'react';

const SalesChart = ({ data, title = "Vendas no Chat" }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hoje */}
                <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                        R$ {data.today.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-600">Hoje</div>
                    <div className="text-xs text-green-500 mt-1">
                        +{((data.today - data.yesterday) / data.yesterday * 100).toFixed(1)}% vs ontem
                    </div>
                </div>

                {/* Ontem */}
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                        R$ {data.yesterday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-600">Ontem</div>
                </div>
            </div>

            {/* Gráfico de barras simples para vendas por canal */}
            <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Vendas por Canal (Hoje)</h4>
                <div className="space-y-3">
                    {data.by_channel.map((channel, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${channel.channel === 'whatsapp' ? 'bg-green-500' :
                                        channel.channel === 'facebook' ? 'bg-blue-600' :
                                            channel.channel === 'email' ? 'bg-red-500' :
                                                'bg-gray-500'
                                    }`}></div>
                                <span className="text-sm capitalize">{channel.channel}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">R$ {channel.today.toFixed(2)}</span>
                                <span className={`text-xs px-2 py-1 rounded ${channel.today > channel.yesterday ? 'bg-green-100 text-green-800' :
                                        channel.today < channel.yesterday ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {channel.today > channel.yesterday ? '↑' :
                                        channel.today < channel.yesterday ? '↓' : '→'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesChart;