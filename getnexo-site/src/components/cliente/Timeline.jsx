import { useState, useEffect } from 'react';

const Timeline = () => {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/cliente/timeline')
            .then(res => res.json())
            .then(data => {
                setTimeline(data.timeline);
                setLoading(false);
            })
            .catch(err => {
                console.error('Erro ao carregar timeline:', err);
                setLoading(false);
            });
    }, []);

    const getIcon = (type) => {
        const icons = {
            purchase: '🛒',
            ticket: '🎫',
            coupon: '🎟️',
            points: '⭐',
            wishlist: '❤️'
        };
        return icons[type] || '📅';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Hoje';
        if (days === 1) return 'Ontem';
        if (days < 7) return `${days} dias atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    if (loading) {
        return <div className="text-center py-8">Carregando timeline...</div>;
    }

    return (
        <div className="space-y-4">
            {timeline.map((item, index) => (
                <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow">
                            {getIcon(item.type)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        <p className="text-gray-400 text-xs mt-1">{formatDate(item.date)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;