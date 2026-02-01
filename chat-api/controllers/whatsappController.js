/**
 * WhatsApp Webhook Controller
 * Processa eventos do webhook da Meta
 * @module controllers/whatsappController
 */

const db = require('../db');
const waService = require('../services/whatsappService');
const { carregaConversa, salvaConversa, geraRespostaBot, processaComandos } = require('../chat-loader');

/**
 * Processar mensagem recebida do webhook
 */
const handleIncomingMessage = async (req, res) => {
    try {
        const body = req.body;

        // Validar objeto
        if (body.object !== 'whatsapp_business_account') {
            return res.sendStatus(200);
        }

        const entry = body.entry?.[0];
        if (!entry) return res.sendStatus(200);

        const change = entry.changes?.[0];
        if (!change?.value) return res.sendStatus(200);

        const value = change.value;

        // Processar status updates (delivered, read, etc)
        if (value.statuses?.[0]) {
            await handleStatusUpdate(value.statuses[0]);
            return res.sendStatus(200);
        }

        // Processar mensagem
        if (!value.messages?.[0]) return res.sendStatus(200);

        const message = value.messages[0];
        const contact = value.contacts?.[0];
        const from = message.from;
        const waMessageId = message.id;

        console.log(`[WA-WEBHOOK] Mensagem de ${from}: ${message.type}`);

        // Marcar como lida imediatamente
        await waService.markAsRead(waMessageId);

        // Extrair dados do contato
        const contactName = contact?.profile?.name || 'Cliente';
        const contactPhone = from;

        // Upsert contato no banco
        const contactId = await upsertContact(contactPhone, contactName);

        // Processar diferentes tipos de mensagem
        let messageBody = '';
        let mediaUrl = null;
        let mediaType = null;

        switch (message.type) {
            case 'text':
                messageBody = message.text?.body || '';
                break;

            case 'image':
                mediaType = 'image';
                mediaUrl = message.image?.id; // ID da mídia para download posterior
                messageBody = message.image?.caption || '[Imagem]';
                break;

            case 'audio':
                mediaType = 'audio';
                mediaUrl = message.audio?.id;
                messageBody = '[Áudio]';
                break;

            case 'document':
                mediaType = 'document';
                mediaUrl = message.document?.id;
                messageBody = message.document?.filename || '[Documento]';
                break;

            case 'video':
                mediaType = 'video';
                mediaUrl = message.video?.id;
                messageBody = message.video?.caption || '[Vídeo]';
                break;

            case 'location':
                messageBody = `[Localização: ${message.location?.latitude}, ${message.location?.longitude}]`;
                break;

            case 'contacts':
                messageBody = `[Contato: ${message.contacts?.[0]?.name?.formatted_name || 'Sem nome'}]`;
                break;

            case 'button':
                messageBody = message.button?.text || '[Botão]';
                break;

            case 'interactive':
                messageBody = message.interactive?.button_reply?.title ||
                    message.interactive?.list_reply?.title ||
                    '[Interativo]';
                break;

            default:
                messageBody = `[${message.type}]`;
        }

        // Salvar mensagem recebida no banco
        saveMessage(contactId, messageBody, false, message.type, mediaUrl, mediaType, waMessageId);

        // Gerar resposta usando chat-loader
        const resposta = await gerarResposta(contactPhone, contactName, messageBody);

        if (resposta) {
            // Enviar resposta
            const result = await waService.sendTextMessage(from, resposta);

            // Salvar resposta enviada
            if (result?.messages?.[0]?.id) {
                saveMessage(contactId, resposta, true, 'text', null, null, result.messages[0].id);
            }
        }

        res.sendStatus(200);

    } catch (error) {
        console.error('[WA-WEBHOOK ERROR]:', error);
        // Sempre retornar 200 para o Meta não retentar
        res.sendStatus(200);
    }
};

/**
 * Processar status update (delivered, read, failed)
 */
const handleStatusUpdate = async (status) => {
    const { id, status: statusType, timestamp, recipient_id, errors } = status;

    console.log(`[WA-STATUS] Mensagem ${id} → ${statusType}`);

    if (errors) {
        console.error('[WA-STATUS ERROR]:', errors);
    }

    // Atualizar status da mensagem no banco
    try {
        db.prepare('UPDATE messages SET status = ? WHERE wa_message_id = ?')
            .run(statusType, id);
    } catch (e) {
        // Coluna pode não existir ainda
    }
};

/**
 * Upsert contato no banco de dados
 */
const upsertContact = (phone, name) => {
    const contactId = `wa_${phone}`;

    try {
        const existing = db.prepare('SELECT id FROM contacts WHERE id = ?').get(contactId);

        if (existing) {
            db.prepare('UPDATE contacts SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                .run(name, phone, contactId);
        } else {
            db.prepare('INSERT INTO contacts (id, name, phone, source, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)')
                .run(contactId, name, phone, 'whatsapp');
        }

        return contactId;
    } catch (e) {
        console.error('[WA-CONTACT ERROR]:', e.message);
        return contactId;
    }
};

/**
 * Salvar mensagem no banco de dados
 */
const saveMessage = (contactId, body, fromMe, type, mediaUrl, mediaType, waMessageId) => {
    try {
        const id = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        db.prepare(`
      INSERT INTO messages (id, contact_id, from_me, type, body, media_url, media_type, wa_message_id, status, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, contactId, fromMe ? 1 : 0, type, body, mediaUrl, mediaType, waMessageId, 'sent', Math.floor(Date.now() / 1000));

        console.log(`[WA-DB] Mensagem salva: ${id}`);
    } catch (e) {
        console.error('[WA-DB ERROR]:', e.message);
    }
};

/**
 * Gerar resposta usando MultiAIService com fallback para ticket
 */
const gerarResposta = async (phone, name, texto) => {
    try {
        const sessao = carregaConversa('wa', phone);
        if (!sessao) {
            return 'Olá! Sou o assistente da GetNexo. Como posso ajudar?';
        }

        // Atualiza nome se não tivermos
        if (name && !sessao.nome) {
            sessao.nome = name.split(' ')[0];
        }

        // 1. Verifica Comandos
        const respostaComando = processaComandos('wa', phone, texto, sessao);
        if (respostaComando) {
            salvaConversa('wa', phone, sessao);
            return respostaComando;
        }

        // 2. Tenta MultiAIService (com fallback entre IAs)
        let respostaBot = null;
        let iaSource = 'fallback';
        let tentativas = sessao.tentativasIA || 0;

        try {
            const MultiAIService = require('../services/MultiAIService');
            const clientId = phone; // Usa phone como client_id

            const result = await MultiAIService.getReply(texto, clientId);
            respostaBot = result.reply;
            iaSource = result.source;

            // Reset contador de tentativas se IA respondeu
            if (iaSource !== 'fallback') {
                sessao.tentativasIA = 0;
            }

            console.log(`[WA-IA] Resposta via ${iaSource} para ${phone}`);
        } catch (iaError) {
            console.error('[WA-IA ERROR]:', iaError.message);
            tentativas++;
            sessao.tentativasIA = tentativas;
        }

        // 3. Se IA falhou ou resposta indica "não sei" → abre ticket
        const indicaFalha = respostaBot && (
            respostaBot.toLowerCase().includes('não sei') ||
            respostaBot.toLowerCase().includes('problema técnico') ||
            respostaBot.toLowerCase().includes('erro') ||
            iaSource === 'fallback'
        );

        if (!respostaBot || tentativas > 3 || indicaFalha) {
            // Abrir ticket automático
            const ticketId = abrirTicketAutomatico(phone, name, texto, sessao);

            if (ticketId) {
                respostaBot = `Entendi! Sua solicitação foi registrada como ticket #${ticketId}. ` +
                    `Um de nossos especialistas vai te ajudar em breve. ` +
                    `Você receberá uma resposta aqui mesmo no WhatsApp! 🙌`;

                console.log(`[WA-TICKET] Ticket #${ticketId} criado para ${phone}`);
            } else {
                // Fallback final
                respostaBot = geraRespostaBot(sessao, texto);
            }
        }

        // 4. Salva no histórico da sessão
        sessao.conversas.push({ de: 'cliente', texto: texto, timestamp: new Date().toISOString() });
        sessao.conversas.push({ de: 'bot', texto: respostaBot, timestamp: new Date().toISOString(), ia: iaSource });

        if (sessao.conversas.length > 50) {
            sessao.conversas = sessao.conversas.slice(-50);
        }

        sessao.ultimoCanal = 'wa';
        salvaConversa('wa', phone, sessao);

        return respostaBot;

    } catch (e) {
        console.error('[WA-RESPOSTA ERROR]:', e.message);
        return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
    }
};

/**
 * Abre ticket automático quando IA não consegue resolver
 */
const abrirTicketAutomatico = (phone, name, mensagem, sessao) => {
    try {
        // Monta contexto das últimas mensagens
        const contexto = sessao.conversas
            .slice(-6)
            .map(c => `${c.de === 'cliente' ? '👤 Cliente' : '🤖 Bot'}: ${c.texto}`)
            .join('\n');

        // Insere ticket no banco
        const result = db.prepare(`
            INSERT INTO support_tickets (
                client_id,
                title,
                description,
                priority,
                status,
                source,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(
            phone,
            `Atendimento WhatsApp - ${name || phone}`,
            `**Última mensagem:**\n${mensagem}\n\n**Contexto da conversa:**\n${contexto}`,
            'medium', // prioridade média
            'open',
            'whatsapp_auto'
        );

        const ticketId = result.lastInsertRowid;

        // Adiciona primeira mensagem ao ticket
        db.prepare(`
            INSERT INTO ticket_messages (ticket_id, sender, message, created_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `).run(ticketId, 'customer', mensagem);

        return ticketId;
    } catch (e) {
        console.error('[WA-TICKET ERROR]:', e.message);
        return null;
    }
};

/**
 * Obter histórico de mensagens de um contato
 */
const getMessageHistory = (req, res) => {
    try {
        const { contactId } = req.params;
        const limit = parseInt(req.query.limit) || 50;

        const messages = db.prepare(`
      SELECT * FROM messages 
      WHERE contact_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(contactId, limit);

        res.json({ messages: messages.reverse() });
    } catch (error) {
        console.error('[WA-HISTORY ERROR]:', error);
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
};

/**
 * Enviar mensagem via API interna
 */
const sendMessage = async (req, res) => {
    try {
        const { to, message, type = 'text', mediaUrl, caption } = req.body;

        if (!to || !message) {
            return res.status(400).json({ error: 'Campos "to" e "message" são obrigatórios' });
        }

        let result;

        if (type === 'text') {
            result = await waService.sendTextMessage(to, message, false);
        } else if (['image', 'audio', 'document', 'video'].includes(type)) {
            result = await waService.sendMediaMessage(to, type, mediaUrl, caption);
        } else {
            return res.status(400).json({ error: 'Tipo de mensagem não suportado' });
        }

        // Salvar no banco
        const contactId = `wa_${to}`;
        if (result?.messages?.[0]?.id) {
            saveMessage(contactId, message, true, type, mediaUrl, null, result.messages[0].id);
        }

        res.json({ success: true, data: result });

    } catch (error) {
        console.error('[WA-SEND API ERROR]:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obter status da integração
 */
const getStatus = (req, res) => {
    res.json(waService.getStatus());
};

module.exports = {
    handleIncomingMessage,
    getMessageHistory,
    sendMessage,
    getStatus
};
