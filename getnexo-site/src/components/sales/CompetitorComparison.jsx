import React, { useState } from 'react';

const CompetitorComparison = ({
    competitors = [],
    ourAdvantages = ['Suporte 24/7', 'Garantia Estendida', 'Entrega Grátis'],
    highlightColor = '#4CAF50',
    showRatings = true,
    comparisonTable = { enabled: true, columns: ['Preço', 'Qualidade', 'Suporte', 'Garantia'] },
    onCompetitorClick = () => { },
    style = {}
}) => {
    const [selectedCompetitor, setSelectedCompetitor] = useState(null);

    const defaultCompetitors = [
        {
            name: 'Concorrente A',
            price: 299,
            features: ['Básico', 'Suporte Limitado', 'Sem Garantia'],
            rating: 3.2,
            imageUrl: ''
        },
        {
            name: 'Concorrente B',
            price: 349,
            features: ['Intermediário', 'Suporte por Email', 'Garantia 6 meses'],
            rating: 3.8,
            imageUrl: ''
        },
        {
            name: 'Nossa Loja',
            price: 279,
            features: ['Completo', 'Suporte 24/7', 'Garantia 2 anos'],
            rating: 4.9,
            imageUrl: '',
            isOurs: true
        }
    ];

    const allCompetitors = competitors.length > 0 ? competitors : defaultCompetitors;
    const ourStore = allCompetitors.find(c => c.isOurs) || allCompetitors[allCompetitors.length - 1];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push('⭐');
        }
        if (hasHalfStar) stars.push('⭐');
        while (stars.length < 5) {
            stars.push('☆');
        }

        return stars.join('');
    };

    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            background: 'white',
            ...style
        }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '8px'
                }}>
                    Por que escolher a nossa loja?
                </h3>
                <p style={{ color: '#6b7280' }}>
                    Compare preços e benefícios com a concorrência
                </p>
            </div>

            {/* Cards de comparação */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                {allCompetitors.map((competitor, index) => (
                    <div
                        key={index}
                        style={{
                            border: competitor.isOurs ? `3px solid ${highlightColor}` : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '16px',
                            background: competitor.isOurs ? '#f0f9ff' : 'white',
                            position: 'relative',
                            cursor: competitor.isOurs ? 'default' : 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onClick={() => {
                            if (!competitor.isOurs) {
                                setSelectedCompetitor(competitor);
                                onCompetitorClick(competitor);
                            }
                        }}
                        onMouseEnter={(e) => {
                            if (!competitor.isOurs) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!competitor.isOurs) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    >
                        {competitor.isOurs && (
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: highlightColor,
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                MELHOR ESCOLHA
                            </div>
                        )}

                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <h4 style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                marginBottom: '8px'
                            }}>
                                {competitor.name}
                            </h4>

                            <div style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: competitor.isOurs ? highlightColor : '#374151',
                                marginBottom: '8px'
                            }}>
                                {formatCurrency(competitor.price)}
                            </div>

                            {showRatings && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    marginBottom: '8px'
                                }}>
                                    <span>{renderStars(competitor.rating)}</span>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                        {competitor.rating}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            <h5 style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Características:
                            </h5>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {competitor.features.map((feature, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '4px',
                                        fontSize: '14px',
                                        color: '#6b7280'
                                    }}>
                                        <span style={{
                                            color: competitor.isOurs ? highlightColor : '#9ca3af',
                                            fontSize: '12px'
                                        }}>
                                            {competitor.isOurs ? '✓' : '○'}
                                        </span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nossas vantagens */}
            <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center'
            }}>
                <h4 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1e40af',
                    marginBottom: '16px'
                }}>
                    Nossas Vantagens Exclusivas
                </h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px'
                }}>
                    {ourAdvantages.map((advantage, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px',
                            background: 'white',
                            borderRadius: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <span style={{
                                color: highlightColor,
                                fontSize: '18px'
                            }}>
                                ✓
                            </span>
                            <span style={{
                                fontSize: '14px',
                                color: '#374151',
                                fontWeight: '500'
                            }}>
                                {advantage}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabela de comparação detalhada */}
            {comparisonTable.enabled && (
                <div style={{ marginTop: '24px' }}>
                    <h4 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '16px'
                    }}>
                        Comparação Detalhada
                    </h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <thead>
                                <tr style={{ background: '#f9fafb' }}>
                                    <th style={{
                                        padding: '12px',
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        borderBottom: '1px solid #e5e7eb'
                                    }}>
                                        Característica
                                    </th>
                                    {allCompetitors.map((comp, idx) => (
                                        <th key={idx} style={{
                                            padding: '12px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid #e5e7eb',
                                            background: comp.isOurs ? highlightColor : '#f9fafb',
                                            color: comp.isOurs ? 'white' : '#374151'
                                        }}>
                                            {comp.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonTable.columns.map((column, rowIdx) => (
                                    <tr key={rowIdx} style={{
                                        background: rowIdx % 2 === 0 ? 'white' : '#f9fafb'
                                    }}>
                                        <td style={{
                                            padding: '12px',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid #e5e7eb'
                                        }}>
                                            {column}
                                        </td>
                                        {allCompetitors.map((comp, colIdx) => (
                                            <td key={colIdx} style={{
                                                padding: '12px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid #e5e7eb',
                                                background: comp.isOurs && column === 'Qualidade' ? highlightColor : 'inherit',
                                                color: comp.isOurs && column === 'Qualidade' ? 'white' : 'inherit',
                                                fontWeight: comp.isOurs ? 'bold' : 'normal'
                                            }}>
                                                {comp.isOurs ? 'Excelente' : 'Bom'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompetitorComparison;