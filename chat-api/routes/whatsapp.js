/**
 * WhatsApp Business API Routes
 * @module routes/whatsapp
 */

const express = require('express');
const router = express.Router();
const config = require('../config/whatsapp');
const whatsappController = require('../controllers/whatsappController');
const verifyWebhook = require('../middleware/verifyWebhook');

/**
 * GET /api/whatsapp/webhook
 * Verificação do webhook (Meta envia GET com challenge)
 */
router.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('[WA-WEBHOOK] Verification request:', { mode, hasToken: !!token, hasChallenge: !!challenge });

    if (mode === 'subscribe' && token === config.WEBHOOK_VERIFY_TOKEN) {
        console.log('[WA-WEBHOOK] ✓ Verificado com sucesso');
        return res.status(200).send(challenge);
    }

    console.log('[WA-WEBHOOK] ✗ Verificação falhou - token incorreto');
    res.sendStatus(403);
});

/**
 * POST /api/whatsapp/webhook
 * Recebimento de mensagens e eventos
 */
router.post('/webhook', verifyWebhook, whatsappController.handleIncomingMessage);

/**
 * POST /api/whatsapp/send
 * Enviar mensagem via API interna
 * Body: { to: "5511999999999", message: "Texto", type?: "text|image|audio|document|video", mediaUrl?: "URL", caption?: "Legenda" }
 */
router.post('/send', whatsappController.sendMessage);

/**
 * GET /api/whatsapp/messages/:contactId
 * Histórico de mensagens de um contato
 * Query: ?limit=50
 */
router.get('/messages/:contactId', whatsappController.getMessageHistory);

/**
 * GET /api/whatsapp/status
 * Status da integração
 */
router.get('/status', whatsappController.getStatus);

module.exports = router;
