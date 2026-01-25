// src/components/CarShowcasePopup.jsx
// Popup de demonstração de carros com AR 360°
// Baseado no dataset: https://github.com/rszengin/carwale-360-dataset

import { useState, useEffect } from 'react'

export default function CarShowcasePopup({ isOpen, onClose }) {
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [show360, setShow360] = useState(false)

    // Dataset de carros baseado no repositório fornecido
    const carBrands = {
        'Toyota': {
            models: ['Corolla', 'Camry', 'RAV4', 'Prius', 'Hilux'],
            description: 'Confiabilidade e eficiência energética'
        },
        'Honda': {
            models: ['Civic', 'Accord', 'CR-V', 'Fit', 'HR-V'],
            description: 'Tecnologia e economia de combustível'
        },
        'Ford': {
            models: ['Focus', 'Fiesta', 'EcoSport', 'Ranger', 'Mustang'],
            description: 'Performance e durabilidade'
        },
        'Chevrolet': {
            models: ['Onix', 'Prisma', 'Tracker', 'Spin', 'Cruze'],
            description: 'Conforto e design moderno'
        },
        'Volkswagen': {
            models: ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Nivus'],
            description: 'Qualidade alemã e tecnologia'
        },
        'Hyundai': {
            models: ['HB20', 'Creta', 'Tucson', 'Santa Fe', 'i30'],
            description: 'Garantia e inovação'
        },
        'Nissan': {
            models: ['Versa', 'Kicks', 'Sentra', 'Frontier', 'Altima'],
            description: 'Tecnologia e aventura'
        },
        'BMW': {
            models: ['X1', 'X3', '320i', '330i', 'M3'],
            description: 'Luxo e performance premium'
        },
        'Mercedes-Benz': {
            models: ['Classe A', 'Classe C', 'GLA', 'GLC', 'GLE'],
            description: 'Elegância e sofisticação'
        },
        'Audi': {
            models: ['A3', 'A4', 'Q3', 'Q5', 'Q7'],
            description: 'Design e tecnologia avançada'
        }
    }

    const handleBrandSelect = (brand) => {
        setSelectedBrand(brand)
        setSelectedModel(null)
        setShow360(false)
    }

    const handleModelSelect = (model) => {
        setSelectedModel(model)
        setShow360(false)
    }

    const handleView360 = () => {
        setShow360(true)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-white">🏎️ Demonstração de Carros</h2>
                        <p className="text-gray-400 mt-1">Explore nossa frota com Realidade Aumentada 360°</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex h-[70vh]">
                    {/* Sidebar - Marcas */}
                    <div className="w-80 border-r border-gray-700 p-4 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-white mb-4">🏢 Marcas Disponíveis</h3>
                        <div className="space-y-2">
                            {Object.entries(carBrands).map(([brand, data]) => (
                                <button
                                    key={brand}
                                    onClick={() => handleBrandSelect(brand)}
                                    className={`w-full text-left p-3 rounded-lg transition ${selectedBrand === brand
                                            ? 'bg-cyan-600 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="font-semibold">{brand}</div>
                                    <div className="text-sm opacity-75">{data.models.length} modelos</div>
                                    <div className="text-xs opacity-60 mt-1">{data.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {!selectedBrand ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🚗</div>
                                <h3 className="text-xl font-semibold text-white mb-2">Selecione uma Marca</h3>
                                <p className="text-gray-400">Escolha uma marca à esquerda para ver os modelos disponíveis</p>
                            </div>
                        ) : !selectedModel ? (
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    🚙 Modelos {selectedBrand}
                                </h3>
                                <p className="text-gray-400 mb-6">{carBrands[selectedBrand].description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {carBrands[selectedBrand].models.map((model) => (
                                        <button
                                            key={model}
                                            onClick={() => handleModelSelect(model)}
                                            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition text-left"
                                        >
                                            <div className="text-white font-semibold">{model}</div>
                                            <div className="text-gray-400 text-sm mt-1">{selectedBrand}</div>
                                            <div className="text-cyan-400 text-xs mt-2">👁️ Ver em 360°</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : !show360 ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            {selectedBrand} {selectedModel}
                                        </h3>
                                        <p className="text-gray-400">Modelo disponível para visualização 360°</p>
                                    </div>
                                    <button
                                        onClick={handleView360}
                                        className="bg-gradient-to-r from-cyan-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-green-600 transition"
                                    >
                                        🌐 Ver em 360° AR
                                    </button>
                                </div>

                                {/* Mock de imagem do carro */}
                                <div className="bg-gray-800 rounded-lg p-8 text-center">
                                    <div className="text-8xl mb-4">🚗</div>
                                    <h4 className="text-xl font-semibold text-white mb-2">
                                        {selectedBrand} {selectedModel}
                                    </h4>
                                    <p className="text-gray-400 mb-4">
                                        Imagem representativa - Clique em "Ver em 360° AR" para experiência completa
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="bg-gray-700 p-3 rounded">
                                            <div className="text-cyan-400 font-semibold">2024</div>
                                            <div className="text-gray-400">Ano</div>
                                        </div>
                                        <div className="bg-gray-700 p-3 rounded">
                                            <div className="text-green-400 font-semibold">1.0L</div>
                                            <div className="text-gray-400">Motor</div>
                                        </div>
                                        <div className="bg-gray-700 p-3 rounded">
                                            <div className="text-yellow-400 font-semibold">Manual</div>
                                            <div className="text-gray-400">Câmbio</div>
                                        </div>
                                        <div className="bg-gray-700 p-3 rounded">
                                            <div className="text-purple-400 font-semibold">Gasolina</div>
                                            <div className="text-gray-400">Combustível</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={() => setSelectedModel(null)}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        ← Voltar para Modelos
                                    </button>
                                    <button
                                        onClick={handleView360}
                                        className="bg-gradient-to-r from-cyan-500 to-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-green-600 transition"
                                    >
                                        🎯 Visualizar em AR 360°
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            🌐 {selectedBrand} {selectedModel} - AR 360°
                                        </h3>
                                        <p className="text-gray-400">Visualização imersiva em Realidade Aumentada</p>
                                    </div>
                                    <button
                                        onClick={() => setShow360(false)}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        ← Voltar
                                    </button>
                                </div>

                                {/* AR Viewer Mock */}
                                <div className="bg-gray-800 rounded-lg p-8 text-center">
                                    <div className="text-8xl mb-4 animate-spin">🔄</div>
                                    <h4 className="text-xl font-semibold text-white mb-2">
                                        Carregando Visualização 360°
                                    </h4>
                                    <p className="text-gray-400 mb-4">
                                        Conectando ao dataset de carros 360°...
                                    </p>
                                    <div className="bg-gray-700 rounded-lg p-4 inline-block">
                                        <p className="text-cyan-400 font-mono text-sm">
                                            Dataset: carwale-360-dataset<br />
                                            Modelo: {selectedBrand} {selectedModel}<br />
                                            Status: Carregando imagens 360°...
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-4">
                                        Baseado em: https://github.com/rszengin/carwale-360-dataset
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}