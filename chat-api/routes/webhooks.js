const express = require('express');
const router = express.Router();
const axios = require('axios');
const { carregaConversa, salvaConversa, geraRespostaBot, processaComandos } = require('../chat-loader');

/**
 * GET /webhook - Verificação do Meta (Verify Token)
 */
router.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
            console.log('[WEBHOOK] Verified');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

/**
 * POST /webhook - Recebimento de mensagens (WhatsApp, Messenger, IG)
 */
router.post('/', async (req, res) => {
    const body = req.body;

    if (body.object) {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            // WhatsApp Cloud API
            const message = body.entry[0].changes[0].value.messages[0];
            const from = message.from; // Número do WhatsApp
            const text = message.text?.body || '';
            const name = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name;

            await processaEventoChat('wa', from, text, name);
        } else if (body.entry && body.entry[0].messaging) {
            // Messenger ou Instagram
            const messagingEvent = body.entry[0].messaging[0];
            const senderId = messagingEvent.sender.id;
            const text = messagingEvent.message?.text || '';

            // Detecta canal baseado no ID da página ou metadados
            const isInstagram = body.entry[0].id.length > 15; // Heurística simples ou use metadados reais
            const canal = isInstagram ? 'ig' : 'fb';

            await processaEventoChat(canal, senderId, text);
        }
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

/**
 * Processador centralizado chamando a lógica do chat-loader
 */
async function processaEventoChat(canal, id, texto, nomeProfilo = null) {
    console.log(`[CHAT-${canal.toUpperCase()}] Mensagem de ${id}: ${texto}`);

    try {
        const sessao = carregaConversa(canal, id);
        if (!sessao) return;

        // Atualiza nome se vier do perfil e não tivermos ainda
        if (nomeProfilo && !sessao.nome) {
            sessao.nome = nomeProfilo.split(' ')[0];
        }

        // 1. Verifica Comandos (/tom)
        const respostaComando = processaComandos(canal, id, texto, sessao);
        if (respostaComando) {
            await enviaParaMeta(canal, id, respostaComando);
            return;
        }

        // 2. Gera Resposta do Bot (Personalidade)
        const respostaBot = geraRespostaBot(sessao, texto);

        // 3. Salva no Histórico
        sessao.conversas.push({ de: 'cliente', texto: texto, timestamp: new Date().toISOString() });
        sessao.conversas.push({ de: 'bot', texto: respostaBot, timestamp: new Date().toISOString() });

        if (sessao.conversas.length > 50) sessao.conversas = sessao.conversas.slice(-50);

        sessao.ultimoCanal = canal;
        salvaConversa(canal, id, sessao);

        // 4. Envia resposta de volta pro canal
        await enviaParaMeta(canal, id, respostaBot);

    } catch (error) {
        console.error(`[PROCESSA-EVENTO ERROR]:`, error.message);
    }
}

/**
 * Dispara mensagem via Meta APIs (WhatsApp ou Messenger/IG)
 */
async function enviaParaMeta(canal, id, texto) {
    const accessToken = process.env.PAGE_TOKEN; // O token deve ter permissões para WA e FB/IG

    try {
        if (canal === 'wa') {
            // WhatsApp Cloud API
            const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
            await axios.post(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
                messaging_product: 'whatsapp',
                to: id,
                type: 'text',
                text: { body: texto }
            }, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
        } else {
            // Messenger ou Instagram API
            await axios.post(`https://graph.facebook.com/v18.0/me/messages`, {
                recipient: { id },
                message: { text: texto }
            }, {
                params: { access_token: accessToken }
            });
        }
        console.log(`[SEND-${canal.toUpperCase()}] Sucesso: ${texto}`);
    } catch (error) {
        console.error(`[SEND-${canal.toUpperCase()} ERROR]:`, error.response?.data || error.message);
    }
}

module.exports = router;
