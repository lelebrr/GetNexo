// Mock data controller for Analytics Dashboard
// In production, this would query the database (MongoDB/PostgreSQL)

exports.getDashboardAnalytics = async (req, res) => {
    try {
        const { range } = req.query; // '24h', '7d', '30d'

        // Mock data structure matching AnalyticsDashboard.jsx expectations
        const analyticsData = {
            ticket_peaks: generateHourlyPeaks(),
            channel_distribution: [
                { name: 'WhatsApp', value: 65, color: '#25D366' },
                { name: 'Instagram', value: 25, color: '#E1306C' },
                { name: 'Email', value: 10, color: '#EA4335' }
            ],
            ai_resolution: [
                { date: 'Seg', ai: 85, human: 15 },
                { date: 'Ter', ai: 88, human: 12 },
                { date: 'Qua', ai: 82, human: 18 },
                { date: 'Qui', ai: 90, human: 10 },
                { date: 'Sex', ai: 87, human: 13 },
                { date: 'Sab', ai: 95, human: 5 },
                { date: 'Dom', ai: 92, human: 8 }
            ],
            sales_comparison: {
                today: 12500.50,
                yesterday: 10200.00,
                by_channel: [
                    { channel: 'whatsapp', today: 8500, yesterday: 7000 },
                    { channel: 'instagram', today: 3000, yesterday: 2500 },
                    { channel: 'email', today: 1000.50, yesterday: 700 }
                ]
            },
            agent_clicks_heatmap: generateHeatmapData(),
            conversion_funnel: {
                saw: 5000,
                contacted: 1200,
                qualified: 450,
                purchased: 180
            },
            nps_weekly: [
                { week: 'W1', score: 72 },
                { week: 'W2', score: 75 },
                { week: 'W3', score: 71 },
                { week: 'W4', score: 78 }
            ],
            response_times: [
                { hour: '08:00', time: 1.5 },
                { hour: '12:00', time: 3.2 },
                { hour: '16:00', time: 2.1 },
                { hour: '20:00', time: 0.8 }
            ],
            top_complaints: [
                { product: 'Entrega Atrasada', count: 45 },
                { product: 'Produto Danificado', count: 12 },
                { product: 'Dúvida Tamanho', count: 8 },
                { product: 'Pagamento Recusado', count: 5 }
            ],
            brazil_heatmap: [
                { state: 'SP', value: 450 },
                { state: 'RJ', value: 210 },
                { state: 'MG', value: 150 },
                { state: 'RS', value: 80 },
                { state: 'BA', value: 65 }
            ],
            queue_abandonment: {
                rate: 12.5,
                abandoned: 45,
                total_tickets: 360
            }
        };

        res.json(analyticsData);
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Helpers
function generateHourlyPeaks() {
    const hours = [];
    for (let i = 0; i < 24; i++) {
        hours.push({
            hour: `${i.toString().padStart(2, '0')}:00`,
            tickets: Math.floor(Math.random() * 50) + 10
        });
    }
    return hours;
}

function generateHeatmapData() {
    // Generate simple heatmap points
    return Array.from({ length: 20 }, () => ({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        value: Math.floor(Math.random() * 10)
    }));
}
