/**
 * MultiAIService - Serviço unificado para múltiplas IAs com fallback
 * Suporta: DeepSeek, Grok (X.AI), Gemini
 * 
 * Features:
 * - Fallback automático entre providers
 * - Cache em memória (TTL 1h)
 * - Log de respostas para estatísticas
 * - Timeout de 15s por chamada
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const db = require('../db');

// Carregar configuração de IA
const AI_CONFIG_PATH = path.join(__dirname, '..', 'ai-config.json');
let aiConfig = {};
try {
    aiConfig = JSON.parse(fs.readFileSync(AI_CONFIG_PATH, 'utf-8'));
} catch (e) {
    console.warn('⚠️ ai-config.json não encontrado, usando env vars');
}

class MultiAIService {
    // MultiAIService.js Updated

    constructor() {
        this.cache = new Map();
        this.CACHE_TTL = 60 * 60 * 1000; // 1 hora
        this.TIMEOUT = 30000; // 30 segundos

        // Limpar cache expirado a cada 10 minutos
        setInterval(() => this._cleanCache(), 10 * 60 * 1000);
    }

    /**
     * Carrega configuração atualizado do disco
     */
    _loadConfig() {
        try {
            const fileContent = fs.readFileSync(AI_CONFIG_PATH, 'utf-8');
            return JSON.parse(fileContent);
        } catch (e) {
            console.error('Error loading AI config in service:', e.message);
            return {};
        }
    }

    /**
     * Obtém definição dos providers atualizada
     */
    _getProviders(config = null) {
        if (!config) config = this._loadConfig();

        return {
            deepseek: {
                name: 'DeepSeek',
                url: 'https://api.deepseek.com/v1/chat/completions',
                key: config.providers?.deepseek?.key || process.env.DEEPSEEK_API_KEY,
                model: config.providers?.deepseek?.model || 'deepseek-chat',
                priority: 1,
                fallback: ['grok', 'gemini', 'openrouter']
            },
            grok: {
                name: 'Grok',
                url: 'https://api.x.ai/v1/chat/completions',
                key: config.providers?.grok?.key || process.env.GROK_API_KEY,
                model: 'grok-beta',
                priority: 2,
                fallback: ['gemini', 'deepseek', 'openrouter']
            },
            gemini: {
                name: 'Gemini',
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
                key: config.providers?.gemini?.key || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
                model: 'gemini-1.5-flash',
                priority: 3,
                fallback: ['deepseek', 'grok', 'openrouter']
            },
            openrouter: {
                name: 'OpenRouter',
                url: 'https://openrouter.ai/api/v1/chat/completions',
                key: config.providers?.openrouter?.key || process.env.OPENROUTER_API_KEY,
                model: '', // Modelo é dinâmico ou definido pelo usuário, aqui deixamos genérico ou pegamos do config
                priority: 4,
                fallback: ['deepseek', 'grok', 'gemini']
            }
        };
    }

    /**
     * Obtém prompt customizado do cliente
     */
    getCustomPrompt(clientId) {
        try {
            const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('custom_ia_prompt');
            return row?.value || 'Responda como vendedor brasileiro amigável, foque em resolver dúvidas e fechar vendas via PIX.';
        } catch (err) {
            console.error('Erro ao buscar prompt:', err);
            return 'Responda como vendedor brasileiro amigável, foque em resolver dúvidas e fechar vendas via PIX.';
        }
    }

    /**
     * Obtém IA preferida do cliente (Global Config > Banco de Dados > Default)
     */
    getPreferredIA(clientId) {
        const config = this._loadConfig();

        // 1. Tenta pegar do config global (ai-config.json)
        if (config.activeAI) return config.activeAI;

        // 2. Tenta pegar do banco (settings)
        try {
            const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('preferred_ia');
            const preferred = row?.value;
            // Valida se existe provider
            const providers = this._getProviders(config);
            if (preferred && providers[preferred]) return preferred;
        } catch (err) {
            // ignore
        }

        return 'deepseek';
    }

    /**
     * Chama uma IA específica
     */
    async callProvider(providerName, fullPrompt) {
        const config = this._loadConfig();
        const providers = this._getProviders(config);
        const provider = providers[providerName];

        if (!provider || !provider.key) {
            console.warn(`⚠️ Provider ${providerName} não configurado ou sem chave`);
            return null;
        }

        try {
            let response;

            if (providerName === 'gemini') {
                // API do Gemini usa formato diferente
                const url = `${provider.url}?key=${provider.key}`;
                response = await axios.post(url, {
                    contents: [{ parts: [{ text: fullPrompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300
                    }
                }, {
                    timeout: this.TIMEOUT,
                    headers: { 'Content-Type': 'application/json' }
                });

                const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
                return text?.trim() || null;
            } else {
                // API OpenAI-compatible (DeepSeek, Grok, OpenRouter)
                const headers = {
                    'Authorization': `Bearer ${provider.key}`,
                    'Content-Type': 'application/json'
                };

                // Headers extras para OpenRouter
                if (providerName === 'openrouter') {
                    headers['HTTP-Referer'] = 'https://getnexo.ai';
                    headers['X-Title'] = 'GetNexo Chat';
                }

                // Modelo específico para cada provider
                // Para OpenRouter, tentamos pegar o modelo salvo ou usar um default
                let model = provider.model;
                if (providerName === 'openrouter') {
                    // Tenta ler modelo salvo no config (se salvarmos openRouterModel em algum lugar específico, 
                    // mas no ai-config-routes salvamos dentro de providers.openrouter se quisermos, 
                    // ou assumimos um default bom se não tiver).
                    // Por simplicidade, vamos fixar um bom modelo free ou barato se não houver config.
                    // Mas o ideal é que o frontend mande o modelo junto na hora de salvar.
                    // Vamos assumir que config.providers.openrouter.model existe (adicionaremos suporte no frontend)
                    model = config.providers?.openrouter?.model || 'google/gemma-7b-it:free';
                }

                response = await axios.post(provider.url, {
                    model: model,
                    messages: [{ role: 'user', content: fullPrompt }],
                    temperature: 0.7,
                    max_tokens: 300
                }, {
                    timeout: this.TIMEOUT,
                    headers: headers
                });

                const reply = response.data.choices?.[0]?.message?.content;
                return reply?.trim() || null;
            }
        } catch (err) {
            console.error(`❌ Erro na IA ${providerName}:`, err.message);
            if (err.response) {
                console.error('Detalhe erro:', err.response.data);
            }
            return null;
        }
    }

    /**
     * Gera resposta inteligente com fallback automático
     */
    async getReply(message, clientId) {
        if (!message || !clientId) {
            return { reply: 'Erro: mensagem e client_id são obrigatórios', source: 'error' };
        }

        // Verificar cache
        const cacheKey = `${clientId}:${message.trim().toLowerCase().substring(0, 100)}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            console.log(`📦 Cache hit para client ${clientId}`);
            return { reply: cached.reply, source: cached.source, cached: true };
        }

        // Buscar configurações do cliente
        const customPrompt = this.getCustomPrompt(clientId);
        const preferredIA = this.getPreferredIA(clientId);
        const fullPrompt = `${customPrompt}\n\nPergunta do cliente: ${message}`;

        // Carregar providers (para saber fallback)
        const config = this._loadConfig();
        const providers = this._getProviders(config);

        // Tenta IA preferida
        let reply = await this.callProvider(preferredIA, fullPrompt);
        let source = preferredIA;
        let success = 1;

        // Fallback automático
        if (!reply) {
            success = 0;
            const fallbackList = providers[preferredIA]?.fallback || ['deepseek', 'grok', 'gemini', 'openrouter'];

            for (const nextIA of fallbackList) {
                if (nextIA === preferredIA) continue;
                console.log(`🔄 Fallback para ${nextIA}...`);
                reply = await this.callProvider(nextIA, fullPrompt);
                if (reply) {
                    source = nextIA;
                    break;
                }
            }
        }

        // Último fallback: mensagem padrão
        if (!reply) {
            reply = 'Desculpe, estou com um problema técnico. Um humano vai te ajudar em breve!';
            source = 'fallback';
            success = 0;
        }

        // Salvar no cache
        this.cache.set(cacheKey, { reply, source, timestamp: Date.now() });

        // Log no banco para estatísticas
        try {
            db.prepare(`
                INSERT INTO ia_responses (client_id, message, reply, ia_used, success, timestamp)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(clientId, message.substring(0, 500), reply.substring(0, 1000), source, success, Math.floor(Date.now() / 1000));
        } catch (err) {
            console.error('Erro ao salvar log IA:', err);
        }

        console.log(`🤖 Resposta via ${source} para client ${clientId}`);
        return { reply, source, cached: false };
    }

    /**
     * Limpa entradas expiradas do cache
     */
    _cleanCache() {
        const now = Date.now();
        let cleaned = 0;
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.CACHE_TTL) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        if (cleaned > 0) {
            console.log(`🧹 Cache limpo: ${cleaned} entradas removidas`);
        }
    }

    /**
     * Estatísticas de acerto por IA (últimos 30 dias)
     */
    getAccuracyStats(clientId) {
        try {
            const stats = db.prepare(`
                SELECT 
                    ia_used,
                    COUNT(*) as total,
                    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as acertos
                FROM ia_responses
                WHERE client_id = ? AND timestamp > strftime('%s', 'now', '-30 days')
                GROUP BY ia_used
            `).all(clientId);

            const result = { deepseek: 0, grok: 0, gemini: 0 };

            stats.forEach(s => {
                const pct = s.total > 0 ? Math.round((s.acertos / s.total) * 100) : 0;
                if (result.hasOwnProperty(s.ia_used)) {
                    result[s.ia_used] = pct;
                }
            });

            return result;
        } catch (err) {
            console.error('Erro stats IA:', err);
            return { deepseek: 0, grok: 0, gemini: 0 };
        }
    }

    /**
     * Taxa de acerto por dia (últimos 30 dias)
     */
    getDailyAccuracy(clientId) {
        try {
            const rows = db.prepare(`
                SELECT 
                    date(timestamp, 'unixepoch') as dia,
                    COUNT(*) as total,
                    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as acertos
                FROM ia_responses
                WHERE client_id = ? AND timestamp > strftime('%s', 'now', '-30 days')
                GROUP BY dia
                ORDER BY dia ASC
            `).all(clientId);

            const dias = [];
            const taxas = [];

            rows.forEach(row => {
                dias.push(row.dia);
                const pct = row.total > 0 ? Math.round((row.acertos / row.total) * 100) : 0;
                taxas.push(pct);
            });

            return { dias, taxas };
        } catch (err) {
            console.error('Erro daily stats:', err);
            return { dias: [], taxas: [] };
        }
    }

    /**
     * Comparativo de acerto por IA por dia
     */
    getComparativeDaily(clientId) {
        try {
            const rows = db.prepare(`
                SELECT 
                    date(timestamp, 'unixepoch') as dia,
                    ia_used,
                    COUNT(*) as total,
                    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as acertos
                FROM ia_responses
                WHERE client_id = ? AND timestamp > strftime('%s', 'now', '-30 days')
                GROUP BY dia, ia_used
                ORDER BY dia ASC
            `).all(clientId);

            const diasSet = new Set(rows.map(r => r.dia));
            const dias = [...diasSet].sort();

            const deepseek = new Array(dias.length).fill(0);
            const grok = new Array(dias.length).fill(0);
            const gemini = new Array(dias.length).fill(0);

            rows.forEach(row => {
                const idx = dias.indexOf(row.dia);
                const pct = row.total > 0 ? Math.round((row.acertos / row.total) * 100) : 0;
                if (row.ia_used === 'deepseek') deepseek[idx] = pct;
                if (row.ia_used === 'grok') grok[idx] = pct;
                if (row.ia_used === 'gemini') gemini[idx] = pct;
            });

            return { dias, deepseek, grok, gemini };
        } catch (err) {
            console.error('Erro comparative stats:', err);
            return { dias: [], deepseek: [], grok: [], gemini: [] };
        }
    }
}

module.exports = new MultiAIService();
