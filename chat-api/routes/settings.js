const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper para extrair client_id
const getClientId = (req) => req.user?.id || req.user?.email || 'anonymous';

// Obter todas as configurações
router.get('/', (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM settings').all();
        const config = {};
        settings.forEach(s => {
            config[s.key] = s.value;
        });
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
});

// Atualizar configurações
router.post('/', (req, res) => {
    try {
        const { settings } = req.body; // { key: value, ... }

        const update = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');

        const transaction = db.transaction((config) => {
            for (const [key, value] of Object.entries(config)) {
                update.run(key, String(value));
            }
        });

        transaction(settings);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
});

// =========== ENDPOINTS DE PROMPT CUSTOMIZADO ===========

// GET /settings/prompt - Retorna o prompt customizado atual
router.get('/prompt', (req, res) => {
    try {
        const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('custom_ia_prompt');
        res.json({ custom_prompt: row?.value || '' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao carregar prompt' });
    }
});

// POST /settings/prompt - Salva novo prompt customizado
router.post('/prompt', (req, res) => {
    try {
        const { custom_prompt } = req.body;
        const clientId = getClientId(req);

        if (!custom_prompt || custom_prompt.trim().length < 10) {
            return res.status(400).json({ error: 'Prompt muito curto (mín. 10 caracteres)' });
        }

        // Limita tamanho (máx 1000 chars)
        const safePrompt = custom_prompt.trim().substring(0, 1000);

        // Salva no histórico antes de atualizar
        try {
            const currentPrompt = db.prepare('SELECT value FROM settings WHERE key = ?').get('custom_ia_prompt');
            if (currentPrompt?.value) {
                db.prepare(`
                    INSERT INTO settings_history (client_id, key, value)
                    VALUES (?, ?, ?)
                `).run(clientId, 'custom_ia_prompt', currentPrompt.value);
            }
        } catch (e) {
            console.warn('Erro ao salvar histórico:', e.message);
        }

        // Atualiza prompt atual
        db.prepare(`
            INSERT OR REPLACE INTO settings (key, value, updated_at)
            VALUES ('custom_ia_prompt', ?, CURRENT_TIMESTAMP)
        `).run(safePrompt);

        console.log(`✏️ Cliente ${clientId} atualizou prompt customizado`);

        res.json({
            success: true,
            message: 'Prompt customizado salvo',
            custom_prompt: safePrompt
        });
    } catch (err) {
        console.error('Erro ao salvar prompt:', err);
        res.status(500).json({ error: 'Falha ao salvar prompt' });
    }
});

// GET /settings/prompts-history - Lista histórico de prompts
router.get('/prompts-history', (req, res) => {
    try {
        const clientId = getClientId(req);

        const history = db.prepare(`
            SELECT id, value AS prompt, updated_at AS data
            FROM settings_history
            WHERE key = 'custom_ia_prompt'
            ORDER BY updated_at DESC
            LIMIT 20
        `).all();

        // Adiciona prompt atual no topo
        const atual = db.prepare('SELECT value FROM settings WHERE key = ?').get('custom_ia_prompt');
        const result = [];

        if (atual?.value) {
            result.push({
                id: 0,
                prompt: atual.value,
                data: new Date().toISOString(),
                tipo: 'Prompt atual (ativo)'
            });
        }

        history.forEach(h => {
            result.push({
                ...h,
                tipo: 'Versão anterior'
            });
        });

        res.json({ success: true, history: result });
    } catch (err) {
        console.error('Erro histórico prompts:', err);
        res.status(500).json({ error: 'Falha ao carregar histórico' });
    }
});

// DELETE /settings/prompt/:id - Remove prompt antigo do histórico
router.delete('/prompt/:id', (req, res) => {
    try {
        const promptId = req.params.id;
        const clientId = getClientId(req);

        if (promptId === '0') {
            return res.status(400).json({ error: 'Não é possível deletar o prompt atual' });
        }

        const prompt = db.prepare('SELECT id FROM settings_history WHERE id = ?').get(promptId);

        if (!prompt) {
            return res.status(404).json({ error: 'Prompt não encontrado' });
        }

        db.prepare('DELETE FROM settings_history WHERE id = ?').run(promptId);

        console.log(`🗑️ Cliente ${clientId} deletou prompt histórico #${promptId}`);

        res.json({ success: true, message: 'Prompt removido do histórico' });
    } catch (err) {
        console.error('Erro ao deletar prompt:', err);
        res.status(500).json({ error: 'Falha ao deletar prompt' });
    }
});

// =========== ENDPOINT DE IA PREFERIDA ===========

// GET /settings/preferred-ia
router.get('/preferred-ia', (req, res) => {
    try {
        const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('preferred_ia');
        res.json({ preferred_ia: row?.value || 'deepseek' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao carregar IA preferida' });
    }
});

// POST /settings/preferred-ia
router.post('/preferred-ia', (req, res) => {
    try {
        const { preferred_ia } = req.body;
        const validIAs = ['deepseek', 'grok', 'gemini'];

        if (!preferred_ia || !validIAs.includes(preferred_ia)) {
            return res.status(400).json({ error: 'IA inválida. Opções: deepseek, grok, gemini' });
        }

        db.prepare(`
            INSERT OR REPLACE INTO settings (key, value, updated_at)
            VALUES ('preferred_ia', ?, CURRENT_TIMESTAMP)
        `).run(preferred_ia);

        res.json({ success: true, preferred_ia });
    } catch (err) {
        res.status(500).json({ error: 'Falha ao salvar IA preferida' });
    }
});

module.exports = router;

