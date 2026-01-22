export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        // Mock data para histórico de compras
        const historico = [
            {
                id: 1,
                item: '360° AR',
                data: '20/01/2026',
                valor: 'R$ 97,00',
                status: 'ativo',
                paymentUrl: null
            },
            {
                id: 2,
                item: 'MultiZap',
                data: '15/01/2026',
                valor: 'R$ 147,00',
                status: 'pendente',
                paymentUrl: 'https://pay.hotmart.com/payment?product=multizap'
            },
            {
                id: 3,
                item: 'IA Plus',
                data: '10/01/2026',
                valor: 'R$ 197,00',
                status: 'ativo',
                paymentUrl: null
            }
        ];

        res.status(200).json({ historico });
    } catch (error) {
        console.error('Erro ao buscar histórico de compras:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}