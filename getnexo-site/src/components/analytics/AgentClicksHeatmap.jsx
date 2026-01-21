import React from 'react';

const AgentClicksHeatmap = ({ data, title = "Cliques de Agentes" }) => {
    const maxClicks = Math.max(...data.map(item => item.clicks));

    const getHeatColor = (clicks) => {
        if (clicks === 0) return 'bg-gray-100';
        const intensity = clicks / maxClicks;
        if (intensity >= 0.8) return 'bg-red-500';
        if (intensity >= 0.6) return 'bg-orange-500';
        if (intensity >= 0.4) return 'bg-yellow-500';
        if (intensity >= 0.2) return 'bg-green-400';
        return 'bg-green-200';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((agent, index) => (
                    <div key={index} className="text-center">
                        <div className={`w-full h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg ${getHeatColor(agent.clicks)}`}>
                            {agent.clicks}
                        </div>
                        <div className="mt-2 text-xs text-gray-600 truncate" title={agent.agent}>
                            {agent.agent.length > 10 ? agent.agent.substring(0, 10) + '...' : agent.agent}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center space-x-2 text-xs">
                <span className="text-gray-600">Menos</span>
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600">Mais</span>
            </div>
        </div>
    );
};

export default AgentClicksHeatmap;