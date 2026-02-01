/**
 * Rotas de Configuração de IA
 * Gerencia ai-config.json para Security e SEO
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const AI_CONFIG_PATH = path.join(__dirname, '..', 'ai-config.json');

// Helper para carregar configuração
function loadConfig() {
    try {
        return JSON.parse(fs.readFileSync(AI_CONFIG_PATH, 'utf-8'));
    } catch (e) {
        console.error('Error loading AI config:', e.message);
        return { providers: {}, security: {}, seo: {} };
    }
}

// Helper para salvar configuração
function saveConfig(config) {
    fs.writeFileSync(AI_CONFIG_PATH, JSON.stringify(config, null, 4), 'utf-8');
}

// GET - Retorna configurações (esconde chaves parcialmente)
router.get('/', (req, res) => {
    try {
        const config = loadConfig();

        // Mascara as chaves API para segurança
        const maskedConfig = {
            activeAI: config.activeAI || 'deepseek',
            security: {
                enabled: config.security?.enabled ?? false,
                autoMonitor: config.security?.autoMonitor ?? false,
                provider: config.security?.provider || 'deepseek',
                hasKey: !!(config.providers?.[config.security?.provider || 'deepseek']?.key)
            },
            seo: {
                enabled: config.seo?.enabled ?? false,
                autoOptimize: config.seo?.autoOptimize ?? false,
                provider: config.seo?.provider || 'deepseek',
                hasKey: !!(config.providers?.[config.seo?.provider || 'deepseek']?.key)
            },
            providers: Object.keys(config.providers || {}).map(name => ({
                name,
                enabled: config.providers[name]?.enabled ?? false,
                hasKey: !!config.providers[name]?.key,
                priority: config.providers[name]?.priority || 99
            })),
            keys: {
                gemini: !!config.providers?.gemini?.key,
                openrouter: !!config.providers?.openrouter?.key,
                grok: !!config.providers?.grok?.key,
                deepseek: !!config.providers?.deepseek?.key
            }
        };

        res.json(maskedConfig);
    } catch (error) {
        console.error('Erro ao carregar config:', error);
        res.status(500).json({ error: 'Erro ao carregar configurações' });
    }
});

// POST - Salva configurações de Security
router.post('/security', (req, res) => {
    try {
        const { enabled, autoMonitor, provider, apiKey } = req.body;
        const config = loadConfig();

        // Atualiza configurações de security
        config.security = {
            enabled: enabled ?? config.security?.enabled ?? false,
            autoMonitor: autoMonitor ?? config.security?.autoMonitor ?? false,
            provider: provider || config.security?.provider || 'deepseek'
        };

        // Se uma API key foi fornecida, atualiza no provider
        if (apiKey && provider) {
            if (!config.providers) config.providers = {};
            if (!config.providers[provider]) {
                config.providers[provider] = { enabled: true, priority: 1 };
            }
            config.providers[provider].key = apiKey;
        }

        saveConfig(config);
        res.json({ success: true, message: 'Configurações de segurança salvas!' });
    } catch (error) {
        console.error('Erro ao salvar config security:', error);
        res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
});

// POST - Salva configurações de SEO
router.post('/seo', (req, res) => {
    try {
        const { enabled, autoOptimize, provider, apiKey } = req.body;
        const config = loadConfig();

        // Atualiza configurações de SEO
        config.seo = {
            enabled: enabled ?? config.seo?.enabled ?? false,
            autoOptimize: autoOptimize ?? config.seo?.autoOptimize ?? false,
            provider: provider || config.seo?.provider || 'deepseek'
        };

        // Se uma API key foi fornecida, atualiza no provider
        if (apiKey && provider) {
            if (!config.providers) config.providers = {};
            if (!config.providers[provider]) {
                config.providers[provider] = { enabled: true, priority: 1 };
            }
            config.providers[provider].key = apiKey;
        }

        saveConfig(config);
        res.json({ success: true, message: 'Configurações de SEO salvas!' });
    } catch (error) {
        console.error('Erro ao salvar config SEO:', error);
        res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
});

// POST - Testa conexão com um provider
router.post('/test', async (req, res) => {
    try {
        const { provider, apiKey } = req.body;
        const config = loadConfig();

        // Usa a key fornecida ou a salva no config
        const key = apiKey || config.providers?.[provider]?.key;

        if (!key) {
            return res.status(400).json({
                success: false,
                error: 'API key não configurada para este provider'
            });
        }

        let testResult = { success: false, message: '' };

        // Testa a conexão conforme o provider
        switch (provider) {
            case 'deepseek':
                try {
                    const resp = await axios.post('https://api.deepseek.com/v1/chat/completions', {
                        model: 'deepseek-chat',
                        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
                        max_tokens: 5
                    }, {
                        headers: {
                            'Authorization': `Bearer ${key}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    });
                    testResult = { success: true, message: 'DeepSeek conectado com sucesso!' };
                } catch (e) {
                    testResult = { success: false, message: `Erro DeepSeek: ${e.response?.data?.error?.message || e.message}` };
                }
                break;

            case 'gemini':
                try {
                    const resp = await axios.post(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
                        { contents: [{ parts: [{ text: 'Responda apenas: OK' }] }] },
                        { timeout: 10000 }
                    );
                    testResult = { success: true, message: 'Gemini conectado com sucesso!' };
                } catch (e) {
                    testResult = { success: false, message: `Erro Gemini: ${e.response?.data?.error?.message || e.message}` };
                }
                break;

            case 'grok':
                try {
                    const resp = await axios.post('https://api.x.ai/v1/chat/completions', {
                        model: 'grok-beta',
                        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
                        max_tokens: 5
                    }, {
                        headers: {
                            'Authorization': `Bearer ${key}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    });
                    testResult = { success: true, message: 'Grok conectado com sucesso!' };
                } catch (e) {
                    testResult = { success: false, message: `Erro Grok: ${e.response?.data?.error?.message || e.message}` };
                }
                break;

            case 'claude':
                try {
                    const resp = await axios.post('https://api.anthropic.com/v1/messages', {
                        model: 'claude-3-haiku-20240307',
                        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
                        max_tokens: 5
                    }, {
                        headers: {
                            'x-api-key': key,
                            'anthropic-version': '2023-06-01',
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    });
                    testResult = { success: true, message: 'Claude conectado com sucesso!' };
                } catch (e) {
                    testResult = { success: false, message: `Erro Claude: ${e.response?.data?.error?.message || e.message}` };
                }
                break;

            case 'gpt':
                try {
                    const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
                        max_tokens: 5
                    }, {
                        headers: {
                            'Authorization': `Bearer ${key}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    });
                    testResult = { success: true, message: 'GPT conectado com sucesso!' };
                } catch (e) {
                    testResult = { success: false, message: `Erro GPT: ${e.response?.data?.error?.message || e.message}` };
                }
                break;

            case 'groq':
                try {
                    const resp = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                        model: 'llama3-70b-8192',
                        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
                        max_tokens: 5
                    }, {
                        headers: {
                            'Authorization': `Bearer ${key}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    });
                } catch (e) {
                    testResult = { success: false, message: `Erro Groq: ${e.response?.data?.error?.message || e.message}` };
                }
                break;

            case 'openrouter':
                try {
                    const resp = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                        model: 'google/gemma-7b-it:free', // Use a free model for testing or a cheap one
                        messages: [{ role: 'user', content: 'Reply OK' }],
                        max_tokens: 5
                    }, {
                        headers: {
                            'Authorization': `Bearer ${key}`,
                            'HTTP-Referer': 'https://getnexo.ai',
                            'X-Title': 'GetNexo',
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    });
                    testResult = { success: true, message: 'OpenRouter conectado com sucesso!' };
                } catch (e) {
                    testResult = { success: false, message: `Erro OpenRouter: ${e.response?.data?.error?.message || e.message}` };
                }
                break;

            default:
                testResult = { success: false, message: `Provider '${provider}' não suportado` };
        }

        res.json(testResult);
    } catch (error) {
        console.error('Erro no teste de conexão:', error);
        res.status(500).json({ success: false, error: 'Erro ao testar conexão' });
    }
});

// GET - Retorna a API key atual (mascarada) para um provider
router.get('/key/:provider', (req, res) => {
    try {
        const { provider } = req.params;
        const config = loadConfig();
        const key = config.providers?.[provider]?.key || '';

        // Mascara a key mantendo apenas primeiros e últimos 4 caracteres
        let masked = '';
        if (key.length > 8) {
            masked = key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
        } else if (key.length > 0) {
            masked = '•'.repeat(key.length);
        }

        res.json({ provider, maskedKey: masked, hasKey: key.length > 0 });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar chave' });
    }
});

// POST - Salva configuração GLOBAL (Active AI + Keys)
router.post('/', (req, res) => {
    try {
        const { activeAI, geminiKey, openRouterKey, grokKey, deepseekKey, deepseekModel } = req.body;
        const config = loadConfig();

        // Atualiza IA Ativa
        if (activeAI) config.activeAI = activeAI;

        // Garante objeto providers
        if (!config.providers) config.providers = {};

        // Atualiza chaves se fornecidas
        if (geminiKey) {
            config.providers.gemini = { ...config.providers.gemini, key: geminiKey, enabled: true };
        }
        if (openRouterKey) {
            config.providers.openrouter = { ...config.providers.openrouter, key: openRouterKey, enabled: true };
        }
        if (grokKey) {
            config.providers.grok = { ...config.providers.grok, key: grokKey, enabled: true };
        }
        if (deepseekKey) {
            config.providers.deepseek = {
                ...config.providers.deepseek,
                key: deepseekKey,
                model: deepseekModel || config.providers.deepseek?.model || 'deepseek-chat',
                enabled: true
            };
        }

        saveConfig(config);

        // Tenta recarregar o serviço de IA se possível (opcional, dependendo de como o MultiAIService observa o arquivo)
        // const MultiAIService = require('../services/MultiAIService');
        // MultiAIService.reloadConfig(); 

        res.json({ success: true, message: 'Configuração global salva com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar config global:', error);
        res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
});

module.exports = router;
