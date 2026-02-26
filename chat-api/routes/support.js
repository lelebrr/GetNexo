const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

// Configuração de email (Nodemailer)
let transporter = null;
try {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'lelebrr@gmail.com',
            pass: process.env.EMAIL_PASS
        }
    });
} catch (e) {
    console.log('📧 Nodemailer não configurado - emails desabilitados');
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@getnexo.com.br';

// Configurar multer para upload de múltiplos arquivos
const uploadDir = path.join(__dirname, '..', 'uploads', 'tickets');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB por arquivo
        files: 5 // Máximo 5 arquivos
    },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|pdf|txt|doc|docx|mp3|wav|ogg|webm/;
        const extname = allowed.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowed.test(file.mimetype) || file.mimetype.startsWith('audio/');
        if (extname || mimetype) {
            return cb(null, true);
        }
        cb(new Error('Tipo de arquivo não permitido'));
    }
});

// Função para enviar email
async function sendEmail(to, subject, text, html) {
    if (!transporter || !process.env.EMAIL_PASS) {
        console.log(`📧 Email (não enviado): ${subject} para ${to}`);
        return;
    }
    try {
        await transporter.sendMail({
            from: `"GetNexo Suporte" <${process.env.EMAIL_USER || 'suporte@getnexo.com.br'}>`,
            to,
            subject,
            text,
            html
        });
        console.log(`📧 Email enviado: ${subject}`);
    } catch (err) {
        console.error('Erro ao enviar email:', err);
    }
}

// Criar novo ticket (múltiplos anexos)
router.post('/tickets', upload.array('attachments', 5), (req, res) => {
    try {
        const { title, description, priority = 0 } = req.body;
        const client_id = req.user?.id || req.user?.email || 'anonymous';
        const attachments = req.files?.map(f => `/uploads/tickets/${f.filename}`) || [];

        if (!title || !description) {
            return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
        }

        const info = db.prepare(`
      INSERT INTO support_tickets (client_id, title, description, priority, attachments, status)
      VALUES (?, ?, ?, ?, ?, 'open')
    `).run(client_id, title, description, parseInt(priority), JSON.stringify(attachments));

        const ticketId = info.lastInsertRowid;
        console.log(`📩 Novo ticket #${ticketId} criado por ${client_id}: ${title}`);

        // Email pro admin
        const priorityLabels = ['Baixa', 'Média', 'Alta'];
        sendEmail(
            ADMIN_EMAIL,
            `🎫 Novo Ticket #${ticketId} - ${title}`,
            `Novo ticket aberto por ${client_id}\n\nTítulo: ${title}\nPrioridade: ${priorityLabels[priority] || 'Normal'}\n\nDescrição:\n${description}\n\nAnexos: ${attachments.length} arquivo(s)`,
            `
        <h2>🎫 Novo Ticket #${ticketId}</h2>
        <p><strong>De:</strong> ${client_id}</p>
        <p><strong>Título:</strong> ${title}</p>
        <p><strong>Prioridade:</strong> ${priorityLabels[priority] || 'Normal'}</p>
        <h3>Descrição:</h3>
        <p>${description}</p>
        <p><strong>Anexos:</strong> ${attachments.length} arquivo(s)</p>
        <hr>
        <p><a href="https://getnexo.com.br/admin/tickets">Ver no painel</a></p>
      `
        );

        res.status(201).json({
            success: true,
            ticket_id: ticketId,
            message: 'Ticket criado com sucesso'
        });
    } catch (err) {
        console.error('Erro ao criar ticket:', err);
        res.status(500).json({ error: 'Falha ao criar ticket' });
    }
});

// Listar tickets do cliente
router.get('/tickets', (req, res) => {
    try {
        const client_id = req.user?.id || req.user?.email || 'anonymous';
        const isAdmin = req.user?.role === 'superadmin' || req.user?.role === 'admin';

        let tickets;
        if (isAdmin) {
            tickets = db.prepare(`
        SELECT * FROM support_tickets ORDER BY created_at DESC
      `).all();
        } else {
            tickets = db.prepare(`
        SELECT * FROM support_tickets WHERE client_id = ? ORDER BY created_at DESC
      `).all(client_id);
        }

        // Parse attachments JSON
        tickets = tickets.map(t => ({
            ...t,
            attachments: t.attachments ? JSON.parse(t.attachments) : []
        }));

        res.json(tickets);
    } catch (err) {
        console.error('Erro ao listar tickets:', err);
        res.status(500).json({ error: 'Erro ao listar tickets' });
    }
});

// Ver ticket específico
router.get('/tickets/:id', (req, res) => {
    try {
        const ticket_id = req.params.id;
        const client_id = req.user?.id || req.user?.email || 'anonymous';
        const isAdmin = req.user?.role === 'superadmin' || req.user?.role === 'admin';

        const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(ticket_id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        if (!isAdmin && ticket.client_id !== client_id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        ticket.attachments = ticket.attachments ? JSON.parse(ticket.attachments) : [];
        res.json(ticket);
    } catch (err) {
        console.error('Erro ao buscar ticket:', err);
        res.status(500).json({ error: 'Erro ao buscar ticket' });
    }
});

// Ver mensagens de um ticket
router.get('/tickets/:id/messages', (req, res) => {
    try {
        const ticket_id = req.params.id;
        const client_id = req.user?.id || req.user?.email || 'anonymous';
        const isAdmin = req.user?.role === 'superadmin' || req.user?.role === 'admin';

        const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(ticket_id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        if (!isAdmin && ticket.client_id !== client_id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        ticket.attachments = ticket.attachments ? JSON.parse(ticket.attachments) : [];

        let messages = db.prepare(`
      SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC
    `).all(ticket_id);

        // Parse attachments em cada mensagem
        messages = messages.map(m => ({
            ...m,
            attachment: m.attachment ? JSON.parse(m.attachment) : []
        }));

        res.json({ ticket, messages });
    } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
        res.status(500).json({ error: 'Erro ao carregar conversa' });
    }
});

// Responder ticket (múltiplos anexos)
router.post('/tickets/:id/reply', upload.array('attachments', 5), (req, res) => {
    try {
        const ticket_id = req.params.id;
        const client_id = req.user?.id || req.user?.email || 'anonymous';
        const isAdmin = req.user?.role === 'superadmin' || req.user?.role === 'admin';
        const { message } = req.body;
        const attachments = req.files?.map(f => `/uploads/tickets/${f.filename}`) || [];

        if (!message && attachments.length === 0) {
            return res.status(400).json({ error: 'Mensagem ou anexo obrigatório' });
        }

        const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(ticket_id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        if (!isAdmin && ticket.client_id !== client_id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const sender = isAdmin ? 'admin' : client_id;

        db.prepare(`
      INSERT INTO ticket_messages (ticket_id, sender, message, attachment)
      VALUES (?, ?, ?, ?)
    `).run(ticket_id, sender, message || '', JSON.stringify(attachments));

        db.prepare('UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(ticket_id);

        // Se admin responde, muda status
        if (isAdmin && ticket.status === 'open') {
            db.prepare("UPDATE support_tickets SET status = 'in-progress' WHERE id = ?").run(ticket_id);
        }

        console.log(`💬 Resposta no ticket #${ticket_id} por ${sender}`);

        // Email de notificação
        if (isAdmin) {
            // Notifica cliente que admin respondeu
            // (precisa ter email do cliente no DB pra funcionar)
            console.log(`📧 Notificação de resposta para cliente ${ticket.client_id}`);
        } else {
            // Notifica admin
            sendEmail(
                ADMIN_EMAIL,
                `💬 Nova resposta no Ticket #${ticket_id}`,
                `${client_id} respondeu:\n\n${message || '(anexo)'}\n\nAnexos: ${attachments.length} arquivo(s)`,
                `
          <h2>💬 Nova resposta no Ticket #${ticket_id}</h2>
          <p><strong>De:</strong> ${client_id}</p>
          <p>${message || '<em>(apenas anexo)</em>'}</p>
          <p><strong>Anexos:</strong> ${attachments.length} arquivo(s)</p>
          <hr>
          <p><a href="https://getnexo.com.br/admin/tickets">Ver no painel</a></p>
        `
            );
        }

        res.json({ success: true, message: 'Mensagem enviada' });
    } catch (err) {
        console.error('Erro ao responder ticket:', err);
        res.status(500).json({ error: 'Falha ao enviar mensagem' });
    }
});

// Atualizar status do ticket (admin only)
router.patch('/tickets/:id/status', (req, res) => {
    try {
        const ticket_id = req.params.id;
        const { status, admin_note } = req.body;
        const isAdmin = req.user?.role === 'superadmin' || req.user?.role === 'admin';

        if (!isAdmin) {
            return res.status(403).json({ error: 'Apenas admin pode alterar status' });
        }

        const validStatus = ['open', 'in-progress', 'closed'];
        if (status && !validStatus.includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        if (status) {
            db.prepare('UPDATE support_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                .run(status, ticket_id);
        }

        if (admin_note) {
            db.prepare('UPDATE support_tickets SET admin_note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                .run(admin_note, ticket_id);
        }

        res.json({ success: true, message: 'Ticket atualizado' });
    } catch (err) {
        console.error('Erro ao atualizar ticket:', err);
        res.status(500).json({ error: 'Erro ao atualizar ticket' });
    }
});

// Exportar ticket como HTML
router.get('/tickets/:id/export', (req, res) => {
    try {
        const ticket_id = req.params.id;
        const client_id = req.user?.id || req.user?.email || 'anonymous';
        const isAdmin = req.user?.role === 'superadmin' || req.user?.role === 'admin';

        const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(ticket_id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        if (!isAdmin && ticket.client_id !== client_id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const messages = db.prepare('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at').all(ticket_id);
        const ticketAttachments = ticket.attachments ? JSON.parse(ticket.attachments) : [];

        const priorityLabels = ['Baixa', 'Média', 'Alta'];
        const statusLabels = { 'open': 'Aberto', 'in-progress': 'Em andamento', 'closed': 'Fechado' };

        const escapeHtml = (text) => {
            if (!text) return '';
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        let html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Ticket #${escapeHtml(String(ticket_id))} - ${escapeHtml(ticket.title)}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px; }
    .meta { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .meta span { display: inline-block; margin-right: 20px; }
    .message { border-left: 3px solid #0891b2; padding: 10px 15px; margin: 15px 0; background: #f9fafb; }
    .message.admin { border-color: #10b981; }
    .message-header { font-weight: bold; color: #374151; margin-bottom: 5px; }
    .message-time { font-size: 12px; color: #6b7280; }
    img { max-width: 400px; margin-top: 10px; border-radius: 8px; }
    audio { margin-top: 10px; }
    .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <h1>🎫 Ticket #${escapeHtml(String(ticket_id))}</h1>
  <h2>${escapeHtml(ticket.title)}</h2>
  
  <div class="meta">
    <span><strong>Status:</strong> ${escapeHtml(statusLabels[ticket.status] || ticket.status)}</span>
    <span><strong>Prioridade:</strong> ${escapeHtml(priorityLabels[ticket.priority] || 'Normal')}</span>
    <span><strong>Criado:</strong> ${escapeHtml(ticket.created_at)}</span>
    <span><strong>Cliente:</strong> ${escapeHtml(ticket.client_id)}</span>
  </div>

  <h3>Descrição</h3>
  <p>${escapeHtml(ticket.description)}</p>
`;

        // Anexos iniciais
        ticketAttachments.forEach(att => {
            const safeAtt = escapeHtml(att);
            if (att.match(/\.(mp3|wav|ogg|webm)$/i)) {
                html += `<audio controls src="${safeAtt}"></audio><br>`;
            } else {
                html += `<img src="${safeAtt}" alt="Anexo inicial"><br>`;
            }
        });

        html += `<h3>Conversa</h3>`;

        messages.forEach(m => {
            const isAdminMsg = m.sender === 'admin';
            const msgAttachments = m.attachment ? JSON.parse(m.attachment) : [];
            html += `
  <div class="message ${isAdminMsg ? 'admin' : ''}">
    <div class="message-header">${isAdminMsg ? '👤 Suporte' : '👤 Cliente'}</div>
    <div class="message-time">${escapeHtml(m.created_at)}</div>
    <p>${escapeHtml(m.message || '')}</p>`;

            msgAttachments.forEach(att => {
                const safeAtt = escapeHtml(att);
                if (att.match(/\.(mp3|wav|ogg|webm)$/i)) {
                    html += `<audio controls src="${safeAtt}"></audio><br>`;
                } else {
                    html += `<img src="${safeAtt}" alt="Anexo"><br>`;
                }
            });

            html += `</div>`;
        });

        html += `
  <div class="footer">
    Exportado em ${new Date().toLocaleString('pt-BR')} | GetNexo Suporte
  </div>
</body>
</html>`;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="ticket_${ticket_id}.html"`);
        res.send(html);
    } catch (err) {
        console.error('Erro ao exportar ticket:', err);
        res.status(500).json({ error: 'Erro ao exportar ticket' });
    }
});

// Analytics do suporte
router.get('/analytics/dashboard', (req, res) => {
    try {
        const stats = {
            total: db.prepare('SELECT COUNT(*) as count FROM support_tickets').get().count,
            open: db.prepare("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'open'").get().count,
            inProgress: db.prepare("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'in-progress'").get().count,
            closed: db.prepare("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'closed'").get().count,
            highPriority: db.prepare('SELECT COUNT(*) as count FROM support_tickets WHERE priority = 2').get().count
        };

        res.json(stats);
    } catch (err) {
        console.error('Erro analytics:', err);
        res.json({ total: 0, open: 0, inProgress: 0, closed: 0, highPriority: 0 });
    }
});

// ========== ROTAS ADMIN ==========

// Listar TODOS os tickets (admin only)
router.get('/admin/tickets', (req, res) => {
    try {
        const isAdmin = req.user?.role === 'superadmin' || req.user?.role === 'admin';
        if (!isAdmin) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        let tickets = db.prepare(`
      SELECT * FROM support_tickets ORDER BY 
        CASE status 
          WHEN 'open' THEN 1 
          WHEN 'in-progress' THEN 2 
          ELSE 3 
        END,
        priority DESC,
        created_at DESC
    `).all();

        tickets = tickets.map(t => ({
            ...t,
            attachments: t.attachments ? JSON.parse(t.attachments) : []
        }));

        res.json(tickets);
    } catch (err) {
        console.error('Erro admin tickets:', err);
        res.status(500).json({ error: 'Erro ao listar tickets' });
    }
});

// Stats para admin
router.get('/admin/stats', (req, res) => {
    try {
        const isAdmin = req.user?.role === 'superadmin' || req.user?.role === 'admin';
        if (!isAdmin) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const stats = {
            total: db.prepare('SELECT COUNT(*) as c FROM support_tickets').get().c,
            open: db.prepare("SELECT COUNT(*) as c FROM support_tickets WHERE status = 'open'").get().c,
            inProgress: db.prepare("SELECT COUNT(*) as c FROM support_tickets WHERE status = 'in-progress'").get().c,
            closed: db.prepare("SELECT COUNT(*) as c FROM support_tickets WHERE status = 'closed'").get().c,
            highPriority: db.prepare('SELECT COUNT(*) as c FROM support_tickets WHERE priority = 2').get().c,
            todayNew: db.prepare("SELECT COUNT(*) as c FROM support_tickets WHERE date(created_at) = date('now')").get().c,
            avgResponseTime: '< 2h' // Placeholder - calcular real se quiser
        };

        res.json(stats);
    } catch (err) {
        console.error('Erro admin stats:', err);
        res.json({ total: 0, open: 0, inProgress: 0, closed: 0, highPriority: 0, todayNew: 0 });
    }
});

module.exports = router;
