import React from 'react';

const ConversionFunnelChart = ({ data, title = "Funil de Conversão" }) => {
    const stages = [
        { name: 'Viu', value: data.saw, color: 'bg-blue-500' },
        { name: 'Contatou', value: data.contacted, color: 'bg-blue-400' },
        { name: 'Qualificado', value: data.qualified, color: 'bg-blue-300' },
        { name: 'Comprou', value: data.purchased, color: 'bg-green-500' }
    ];

    const maxValue = Math.max(...stages.map(s => s.value));

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>

            <div className="space-y-2">
                {stages.map((stage, index) => {
                    const percentage = (stage.value / stages[0].value * 100).toFixed(1);
                    const width = (stage.value / maxValue * 100);

                    return (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="w-20 text-sm text-gray-600 text-right">
                                {stage.name}
                            </div>
                            <div className="flex-1">
                                <div className="relative h-8 bg-gray-200 rounded">
                                    <div
                                        className={`h-full ${stage.color} rounded transition-all duration-500`}
                                        style={{ width: `${width}%` }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                                        {stage.value} ({percentage}%)
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                    Taxa de conversão: {(data.purchased / data.saw * 100).toFixed(2)}%
                </div>
            </div>
        </div>
    );
};

export default ConversionFunnelChart;