/**
 * A2A AI Service
 * 
 * AI integration layer for A2A message processing:
 * - Integration with configured AI providers (OpenRouter, DeepSeek, Gemini)
 * - Context-aware response generation
 * - Multi-turn conversation state management
 * - Streaming response support
 * - Intent classification for commerce/support routing
 */

const crypto = require('crypto');

// AI Provider configurations
const AI_PROVIDERS = {
    deepseek: {
        url: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat',
        getKey: () => process.env.DEEPSEEK_API_KEY
    },
    openrouter: {
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        getKey: () => process.env.OPENROUTER_API_KEY
    },
    gemini: {
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro',
        getKey: () => process.env.GEMINI_API_KEY
    }
};

// Conversation state (in-memory, should be persisted in production)
const conversationStates = new Map();

/**
 * Get the active AI provider based on configuration
 * @returns {Object} Provider configuration
 */
function getActiveProvider() {
    // Priority order: DeepSeek > OpenRouter > Gemini
    if (process.env.DEEPSEEK_ENABLED === 'true' && process.env.DEEPSEEK_API_KEY) {
        return { name: 'deepseek', ...AI_PROVIDERS.deepseek };
    }
    if (process.env.OPENROUTER_API_KEY) {
        return { name: 'openrouter', ...AI_PROVIDERS.openrouter };
    }
    if (process.env.GEMINI_ENABLED === 'true' && process.env.GEMINI_API_KEY) {
        return { name: 'gemini', ...AI_PROVIDERS.gemini };
    }
    return null;
}

/**
 * System prompt for A2A interactions
 */
const A2A_SYSTEM_PROMPT = `Você é o assistente de IA GetNexo, um agente especializado em vendas, suporte e automação empresarial.

Você está comunicando via o protocolo A2A (Agent-to-Agent) com outro agente de IA.

Diretrizes:
1. Seja conciso e objetivo - você está falando com outro agente
2. Forneça informações estruturadas quando possível (JSON)
3. Para consultas de produtos, retorne dados do catálogo
4. Para suporte, forneça soluções diretas
5. Para pagamentos, confirme valores e métodos

Capacidades disponíveis:
- Consulta de catálogo de produtos
- Processamento de pedidos
- Suporte técnico
- Integração de pagamentos via AP2

Responda sempre em português, a menos que o agente use outro idioma.`;

/**
 * Intent classification
 * @param {string} text - Message text
 * @returns {Object} { intent, confidence, entities }
 */
function classifyIntent(text) {
    const lowerText = text.toLowerCase();

    const intents = [
        {
            name: 'product_inquiry',
            keywords: ['produto', 'preço', 'catálogo', 'disponível', 'comprar', 'product', 'price'],
            confidence: 0
        },
        {
            name: 'order_status',
            keywords: ['pedido', 'entrega', 'rastreio', 'status', 'order', 'tracking'],
            confidence: 0
        },
        {
            name: 'support',
            keywords: ['ajuda', 'problema', 'erro', 'suporte', 'help', 'support', 'issue'],
            confidence: 0
        },
        {
            name: 'payment',
            keywords: ['pagamento', 'pagar', 'pix', 'cartão', 'payment', 'pay'],
            confidence: 0
        },
        {
            name: 'greeting',
            keywords: ['olá', 'oi', 'bom dia', 'hello', 'hi'],
            confidence: 0
        }
    ];

    // Calculate confidence for each intent
    for (const intent of intents) {
        const matches = intent.keywords.filter(kw => lowerText.includes(kw));
        intent.confidence = matches.length / intent.keywords.length;
    }

    // Sort by confidence
    intents.sort((a, b) => b.confidence - a.confidence);

    const topIntent = intents[0];

    // Extract entities (simple approach)
    const entities = {};

    // Extract amounts
    const amountMatch = text.match(/R?\$?\s?(\d+(?:[.,]\d{2})?)/);
    if (amountMatch) {
        entities.amount = parseFloat(amountMatch[1].replace(',', '.'));
    }

    // Extract product references
    const productMatch = text.match(/produto\s+#?(\w+)/i);
    if (productMatch) {
        entities.product_id = productMatch[1];
    }

    // Extract order references
    const orderMatch = text.match(/pedido\s+#?(\w+)/i);
    if (orderMatch) {
        entities.order_id = orderMatch[1];
    }

    return {
        intent: topIntent.confidence > 0.2 ? topIntent.name : 'general',
        confidence: topIntent.confidence,
        entities,
        allIntents: intents.slice(0, 3)
    };
}

/**
 * Process a message using AI
 * @param {Object} message - The incoming message
 * @param {string} senderId - The sender agent ID
 * @param {Object} context - Additional context
 * @returns {Promise<Object>} AI response
 */
async function processMessage(message, senderId, context = {}) {
    const provider = getActiveProvider();

    // Classify intent
    const intentResult = classifyIntent(message.text || '');

    // Get or create conversation state
    const conversationId = context.conversation_id || `${senderId}_${Date.now()}`;
    let state = conversationStates.get(conversationId) || {
        messages: [],
        started_at: new Date().toISOString(),
        turn_count: 0
    };

    // Add user message to history
    state.messages.push({
        role: 'user',
        content: message.text || '',
        timestamp: new Date().toISOString(),
        intent: intentResult.intent
    });
    state.turn_count++;

    let responseText;

    if (provider) {
        try {
            responseText = await callAIProvider(provider, state.messages);
        } catch (error) {
            console.error('[A2A-AI] Provider error:', error.message);
            responseText = generateFallbackResponse(intentResult);
        }
    } else {
        // No AI provider configured, use rule-based response
        responseText = generateFallbackResponse(intentResult);
    }

    // Add assistant response to history
    state.messages.push({
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString()
    });

    // Save state
    conversationStates.set(conversationId, state);

    // Clean old conversations (keep last 100)
    if (conversationStates.size > 100) {
        const oldestKey = conversationStates.keys().next().value;
        conversationStates.delete(oldestKey);
    }

    return {
        id: crypto.randomUUID(),
        text: responseText,
        timestamp: new Date().toISOString(),
        intent: intentResult,
        conversation_id: conversationId,
        turn_count: state.turn_count,
        context: {
            handledBy: 'GetNexo-A2A-AI',
            provider: provider?.name || 'fallback',
            intent: intentResult.intent
        }
    };
}

/**
 * Call AI provider API
 * @param {Object} provider - Provider configuration
 * @param {Array} messages - Conversation messages
 * @returns {Promise<string>} AI response text
 */
async function callAIProvider(provider, messages) {
    const apiKey = provider.getKey();

    if (!apiKey) {
        throw new Error('API key not configured');
    }

    const formattedMessages = [
        { role: 'system', content: A2A_SYSTEM_PROMPT },
        ...messages.map(m => ({
            role: m.role,
            content: m.content
        }))
    ];

    // Use dynamic import for fetch
    const fetch = (await import('node-fetch')).default;

    if (provider.name === 'gemini') {
        // Gemini has different API format
        const response = await fetch(`${provider.url}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: formattedMessages.map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }))
            })
        });

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao processar resposta.';
    }

    // OpenAI-compatible API (DeepSeek, OpenRouter)
    const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://getnexo.com.br',
            'X-Title': 'GetNexo A2A'
        },
        body: JSON.stringify({
            model: provider.model,
            messages: formattedMessages,
            max_tokens: 1000,
            temperature: 0.7
        })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Erro ao processar resposta.';
}

/**
 * Generate fallback response based on intent
 * @param {Object} intentResult - Intent classification result
 * @returns {string} Response text
 */
function generateFallbackResponse(intentResult) {
    const responses = {
        product_inquiry: 'Entendi que você está interessado em produtos. Posso fornecer informações do catálogo. Qual produto específico você procura?',
        order_status: 'Para consultar o status do seu pedido, por favor forneça o número do pedido.',
        support: 'Estou aqui para ajudar! Por favor, descreva o problema que você está enfrentando.',
        payment: 'Para processamento de pagamentos, utilizamos o protocolo AP2. Posso iniciar uma transação segura para você.',
        greeting: 'Olá! Sou o assistente GetNexo. Posso ajudar com consultas de produtos, status de pedidos, suporte ou pagamentos.',
        general: 'Recebi sua mensagem. Como posso ajudá-lo hoje? Minhas especialidades são: produtos, pedidos, suporte e pagamentos.'
    };

    return responses[intentResult.intent] || responses.general;
}

/**
 * Stream a response using SSE
 * @param {Object} message - The incoming message
 * @param {string} senderId - The sender agent ID
 * @param {Object} res - Express response object
 */
async function streamResponse(message, senderId, res) {
    const provider = getActiveProvider();
    const intentResult = classifyIntent(message.text || '');

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Send initial event
    sendEvent({
        type: 'start',
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
    });

    if (provider) {
        try {
            // For now, we simulate streaming
            // In production, use streaming API endpoints
            const response = await processMessage(message, senderId);

            // Simulate word-by-word streaming
            const words = response.text.split(' ');
            for (let i = 0; i < words.length; i++) {
                sendEvent({
                    type: 'chunk',
                    role: 'assistant',
                    content: words[i] + (i < words.length - 1 ? ' ' : '')
                });
                await new Promise(r => setTimeout(r, 50));
            }
        } catch (error) {
            sendEvent({ type: 'error', error: error.message });
        }
    } else {
        // Fallback streaming
        const fallback = generateFallbackResponse(intentResult);
        const words = fallback.split(' ');
        for (let i = 0; i < words.length; i++) {
            sendEvent({
                type: 'chunk',
                role: 'assistant',
                content: words[i] + (i < words.length - 1 ? ' ' : '')
            });
            await new Promise(r => setTimeout(r, 50));
        }
    }

    // Send end event
    sendEvent({
        type: 'end',
        intent: intentResult,
        timestamp: new Date().toISOString()
    });
}

/**
 * Get conversation history
 * @param {string} conversationId - The conversation ID
 * @returns {Object|null} Conversation state
 */
function getConversation(conversationId) {
    return conversationStates.get(conversationId) || null;
}

/**
 * Clear conversation
 * @param {string} conversationId - The conversation ID
 */
function clearConversation(conversationId) {
    conversationStates.delete(conversationId);
}

/**
 * Get AI service status
 * @returns {Object} Status information
 */
function getStatus() {
    const provider = getActiveProvider();
    return {
        active: !!provider,
        provider: provider?.name || null,
        model: provider?.model || null,
        active_conversations: conversationStates.size,
        capabilities: ['chat', 'intent_classification', 'streaming']
    };
}

module.exports = {
    processMessage,
    streamResponse,
    classifyIntent,
    getConversation,
    clearConversation,
    getStatus,
    getActiveProvider
};
