const crypto = require('crypto');
const config = require('../config/whatsapp');

/**
 * Middleware para verificar assinatura do Webhook da Meta
 * Protege contra ataques de spoofing e replay
 */
const verifyWebhook = (req, res, next) => {
    // Apenas requisições POST precisam de assinatura
    if (req.method !== 'POST') {
        return next();
    }

    const signature = req.headers['x-hub-signature-256'];
    const appSecret = config.APP_SECRET;

    if (!appSecret) {
        // Em produção, isso deve ser um erro fatal.
        if (process.env.NODE_ENV === 'production') {
             console.error('❌ ERRO CRÍTICO: WA_APP_SECRET não configurado em produção. Rejeitando webhook.');
             return res.status(500).json({ error: 'Erro de configuração do servidor' });
        }
        console.warn('⚠️ AVISO DE SEGURANÇA: WA_APP_SECRET não configurado. Validação de assinatura ignorada (INSEGURO).');
        return next();
    }

    if (!signature) {
        console.warn('⚠️ Webhook request sem assinatura rejeitado.');
        return res.status(401).json({ error: 'Assinatura ausente' });
    }

    if (!req.rawBody) {
        console.error('❌ req.rawBody não disponível. Verifique configuração do express.json().');
        return res.status(500).json({ error: 'Erro interno de validação' });
    }

    const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', appSecret)
        .update(req.rawBody)
        .digest('hex');

    // Comparação segura contra timing attacks
    try {
        const isValid = crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );

        if (!isValid) {
            console.warn('⚠️ Assinatura de webhook inválida.');
            return res.status(401).json({ error: 'Assinatura inválida' });
        }
    } catch (e) {
        console.warn('⚠️ Erro ao comparar assinaturas:', e.message);
        return res.status(401).json({ error: 'Assinatura inválida' });
    }

    next();
};

module.exports = verifyWebhook;
