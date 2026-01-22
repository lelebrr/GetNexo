import React from 'react';

export const Select = ({ value, onChange, options, required }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full p-2 border rounded bg-white text-black"
    >
        {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
);

export const Badge = ({ children, variant = 'info' }) => {
    const variants = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800'
    };
    return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${variants[variant] || variants.info}`}>
            {children}
        </span>
    );
};

export const Table = ({ children }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            {children}
        </table>
    </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full text-black">
                <div className="flex justify-between items-center mb-4 border-bottom pb-2">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export const Tabs = ({ activeTab, onTabChange, tabs }) => (
    <div>
        <div className="flex border-b mb-4">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
        <div>
            {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
    </div>
);

export const Alert = ({ children, variant = 'info' }) => {
    const variants = {
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        danger: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return (
        <div className={`p-4 border rounded ${variants[variant] || variants.info}`}>
            {children}
        </div>
    );
};

export const Progress = ({ value, className }) => (
    <div className={`h-2 bg-gray-200 rounded overflow-hidden ${className}`}>
        <div className="h-full bg-blue-500" style={{ width: `${value}%` }}></div>
    </div>
);

export const Tag = ({ children, variant = 'primary' }) => {
    const variants = {
        primary: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs ${variants[variant] || variants.primary}`}>
            {children}
        </span>
    );
};
