import React from 'react';

const TopComplaintsChart = ({ data, title = "Top Reclamações por Produto" }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>

            <div className="space-y-3">
                {data.slice(0, 5).map((complaint, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                            <span className="text-sm">{complaint.product}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{ width: `${(complaint.count / Math.max(...data.map(d => d.count))) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-700">{complaint.count}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopComplaintsChart;