import React from 'react';

const BrazilHeatmap = ({ data, title = "Chamados por Região do Brasil" }) => {
    // Simplified Brazil map with regions
    const regions = [
        { name: 'Sudeste', states: ['SP', 'RJ', 'MG', 'ES'], color: 'bg-red-500' },
        { name: 'Sul', states: ['RS', 'SC', 'PR'], color: 'bg-orange-500' },
        { name: 'Nordeste', states: ['BA', 'PE', 'CE', 'RN', 'PB', 'AL', 'SE', 'MA', 'PI'], color: 'bg-yellow-500' },
        { name: 'Norte', states: ['AM', 'PA', 'RR', 'AP', 'TO', 'RO', 'AC'], color: 'bg-green-500' },
        { name: 'Centro-Oeste', states: ['GO', 'MT', 'MS', 'DF'], color: 'bg-blue-500' }
    ];

    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regions.map((region, index) => {
                    const regionData = data.find(d => d.region === region.name);
                    const count = regionData ? regionData.count : 0;
                    const intensity = maxCount > 0 ? (count / maxCount) * 100 : 0;

                    return (
                        <div key={index} className="text-center">
                            <div
                                className={`w-full h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2 ${region.color} opacity-${Math.max(20, Math.round(intensity / 10) * 10)}`}
                                style={{ backgroundColor: count === 0 ? '#f3f4f6' : undefined }}
                            >
                                {count}
                            </div>
                            <div className="text-xs text-gray-600">{region.name}</div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 text-sm text-gray-600">
                Total de chamados: {data.reduce((sum, d) => sum + d.count, 0)}
            </div>
        </div>
    );
};

export default BrazilHeatmap;