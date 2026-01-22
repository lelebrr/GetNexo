export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { adicionalId } = req.body;

        if (!adicionalId) {
            return res.status(400).json({ error: 'ID do adicional é obrigatório' });
        }

        // Mock de processamento de pagamento
        const paymentUrls = {
            '360-ar': 'https://pay.hotmart.com/payment?product=360-ar',
            'multizap': 'https://pay.hotmart.com/payment?product=multizap',
            'ia-plus': 'https://pay.hotmart.com/payment?product=ia-plus',
            'equipe': 'https://pay.hotmart.com/payment?product=equipe'
        };

        const paymentUrl = paymentUrls[adicionalId];

        if (!paymentUrl) {
            return res.status(400).json({ error: 'Adicional não encontrado' });
        }

        // Simular processamento (em produção, isso seria integrado com gateway de pagamento)
        console.log(`[PAGAMENTO] Processando compra do adicional: ${adicionalId}`);

        res.status(200).json({
            success: true,
            paymentUrl,
            message: 'Redirecionando para pagamento...'
        });

    } catch (error) {
        console.error('Erro ao processar compra:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}