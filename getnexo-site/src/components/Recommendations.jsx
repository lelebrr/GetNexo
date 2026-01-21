import React, { useState, useEffect } from 'react';

const Recommendations = ({ type = 'popular', category = null, limit = 6 }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecommendations();
    }, [type, category, limit]);

    const fetchRecommendations = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        const params = new URLSearchParams({
            type,
            limit: limit.toString()
        });
        if (category) {
            params.append('category', category);
        }

        try {
            const response = await fetch(`/api/recommendations?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setRecommendations(data.recommendations || []);
            } else {
                setError(data.error || 'Erro ao carregar recomendações.');
            }
        } catch (err) {
            setError('Erro de conexão.');
            console.error('Erro ao buscar recomendações:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="text-yellow-400">★</span>);
        }
        if (hasHalfStar) {
            stars.push(<span key="half" className="text-yellow-400">☆</span>);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
        }

        return stars;
    };

    if (loading) {
        return (
            <div className="recommendations-container p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Recomendações</h3>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recommendations-container p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Recomendações</h3>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="recommendations-container p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">
                {type === 'popular' && 'Produtos Populares'}
                {type === 'similar' && 'Produtos Similares'}
                {type === 'trending' && 'Tendências'}
            </h3>

            {recommendations.length === 0 ? (
                <p className="text-gray-500">Nenhuma recomendação disponível.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <div className="mb-3">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-32 object-cover rounded"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg'; // fallback image
                                    }}
                                />
                            </div>
                            <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                            <p className="text-xs text-gray-500 mb-2 capitalize">{item.category}</p>
                            <div className="flex items-center mb-2">
                                {renderStars(item.rating)}
                                <span className="ml-2 text-sm text-gray-600">({item.rating})</span>
                            </div>
                            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded">
                                Ver Produto
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recommendations;