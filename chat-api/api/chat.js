/**
 * GetNexo DeepSeek Integration Module
 * Optimized for performance and 3G connections.
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PRODUCTS_DB = path.join(__dirname, '../data/products.json');

async function getProductRecommendation(message) {
    try {
        if (!fs.existsSync(PRODUCTS_DB)) return null;
        const products = JSON.parse(fs.readFileSync(PRODUCTS_DB, 'utf-8'));
        const query = message.toLowerCase();
        return products.find(p => query.includes(p.nome.toLowerCase()) || query.includes(p.id.toLowerCase()));
    } catch (e) {
        return null;
    }
}

/**
 * Handle Streaming Chat Request with SSE
 * @param {Request} req 
 * @param {Response} res 
 */
async function streamChat(req, res) {
    const { message, history = [], trialMode = false } = req.body;

    // API key from env or global config fallback
    const deepSeekKey = process.env.DEEPSEEK_KEY ||
        process.env.DEEPSEEK_API_KEY ||
        (global.aiConfig && global.aiConfig.deepseekKey) ||
        (global.aiConfig && global.aiConfig.providers && global.aiConfig.providers.deepseek && global.aiConfig.providers.deepseek.key);

    if (!deepSeekKey || deepSeekKey === 'deepseek_key') {
        console.error('[DEEPSEEK] API Key is missing or default!');
        return res.status(500).json({ error: "DeepSeek API Key not configured." });
    }

    // Trial mode constraints: restricted length for non-trial users (optimized for 3G)
    const maxTokens = trialMode ? 2048 : 100;

    // Set SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.deepseek.com/chat/completions',
            headers: {
                'Authorization': `Bearer ${deepSeekKey}`,
                'Content-Type': 'application/json'
            },
            data: {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system', content: `Você é o vendedor top da GetNexo – IA Multimídia.
Seu objetivo: converter vendas no chat com produtos **gerados em tempo real** pela IA dedicada de imagens.

Regras obrigatórias:
- Nunca use placeholders como picsum. Sempre diga "Vou gerar a imagem perfeita agora!" e simule a imagem.
- Produto fake: nome premium (ex: "Tênis Apex White Pro", "PC Gamer Quantum Beast"), preço alto-realista (R$1.200 a R$12.000), descrição vendedora, benefícios.
- Sempre mostre card formatado com:
  - Imagem: "https://image.pollinations.ai/prompt/NOME_DO_PRODUTO_EM_INGLES" (Use esta URL para gerar a imagem real)
  - Preço em destaque
  - CTA: "Fechar no PIX agora"
  - Urgência: "Estoque gerado sob demanda – só 5 unidades hoje!"
- Voz: "Quero que você ouça como isso soa incrível!" (simule text-to-speech).
- Contexto total: lembre o usuário (Leandro), preferências anteriores.

Exemplo de resposta:
"Beleza, Leandro! Gerando agora o **Tênis Apex White Pro** tamanho 42 com detalhes azuis metálicos – edição limitada!

**Preço especial: R$ 1.899**
- Leveza de 280g
- Solado antiderrapante
- +540% vendas pra lojas que usam nossa IA
- Conversão 98% com PIX no chat

Imagem gerada na hora pela nossa IA exclusiva:
![Tênis Apex White Pro](https://image.pollinations.ai/prompt/white%20sneakers%20blue%20details%20premium%20futuristic)

Quer ver em 360°? Falar o preço pra outro tamanho? Reserva agora no PIX – estoque voando hoje! 🚀"` },
                    ...history,
                    { role: 'user', content: message }
                ],
                stream: true,
                max_tokens: maxTokens,
                temperature: 0.7
            },
            responseType: 'stream'
        });

        // Forward stream to client
        response.data.on('data', async chunk => {
            const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                const data = line.replace(/^data: /, '');
                if (data === '[DONE]') {
                    const product = await getProductRecommendation(message);
                    if (product) {
                        const productLink = `\n\n[🔄 Ver em 360° / AR: ${product.nome}](http://localhost:3000/test-360-ar?id=${product.id})`;
                        res.write(`data: ${JSON.stringify({ content: productLink })}\n\n`);
                    }
                    res.write('data: [DONE]\n\n');
                    return;
                }

                try {
                    const parsed = JSON.parse(data);
                    const delta = parsed.choices[0].delta.content;
                    if (delta) {
                        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
                    }
                } catch (e) {
                    // Ignore parsing errors for partial stream chunks
                }
            }
        });

        response.data.on('end', () => {
            res.end();
        });

        // Bônus: Success Log
        console.log("GetNexo → DeepSeek conectado");

    } catch (error) {
        const status = error.response ? error.response.status : 500;
        console.error(`[DEEPSEEK ERROR ${status}]:`, error.message);

        // Send error in SSE format
        res.write(`data: ${JSON.stringify({
            error: true,
            message: 'Provider error',
            details: error.message,
            status: status
        })}\n\n`);
        res.end();
    }
}

/**
 * Monitoring endpoint to track latency and errors
 */
function monitorPing(req, res) {
    const { error, model, timing, ip } = req.body;

    // Log for immediate visibility
    console.log(`[MONITORING] ${error ? '❌ ERROR' : '✅ SUCCESS'} | Model: ${model} | Time: ${timing}ms | IP: ${ip}`);

    res.status(200).json({ status: 'logged' });
}

module.exports = {
    streamChat,
    monitorPing
};
