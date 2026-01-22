/**
 * GetNexo Local Fallback AI
 * Lightweight response generator for when the primary API is down.
 * Optimized for 3G and offline scenarios using a heuristic model.
 */

class LocalFallbackAI {
    constructor() {
        this.intents = {
            'greeting': ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'opa'],
            'shipping': ['frete', 'entrega', 'envio', 'prazo', 'correios', 'transporte'],
            'stock': ['estoque', 'disponível', 'tem', 'produto', 'comprar', 'unidades'],
            'help': ['ajuda', 'suporte', 'atendimento', 'duvida', 'como funciona']
        };

        this.responses = {
            'greeting': ['Olá! Sou o assistente local da GetNexo. Como posso ajudar?', 'Oi! Estou operando em modo de segurança, mas posso tirar suas dúvidas básicas.'],
            'shipping': ['O frete é calculado por CEP direto no carrinho. Compras acima de R$199 têm frete grátis!', 'Enviamos para todo o Brasil em até 48h após a confirmação.'],
            'stock': ['Nossos produtos têm alta rotatividade. Restam poucas unidades deste item!', 'O estoque está sendo atualizado. Se conseguir colocar no carrinho, ainda temos.'],
            'help': ['Posso te ajudar com frete, estoque e dúvidas básicas. O que você precisa?', 'Para problemas complexos, recomendo aguardar nossa conexão principal retornar.'],
            'default': ['Entendi. No momento estou operando com inteligência básica. Pode reformular?', 'Desculpe, a conexão principal oscilou. Anotei sua dúvida e tentarei responder melhor logo!']
        };

        console.log("GetNexo → Local Fallback Ready (Lightweight Heuristic Engine)");
    }

    /**
     * Determine intent from text and return a response
     */
    async generateResponse(text) {
        const input = text.toLowerCase().trim();
        let detectedIntent = 'default';

        for (const [intent, keywords] of Object.entries(this.intents)) {
            if (keywords.some(k => input.includes(k))) {
                detectedIntent = intent;
                break;
            }
        }

        const possible = this.responses[detectedIntent];
        const response = possible[Math.floor(Math.random() * possible.length)];

        // Simulate processing for natural feel
        await new Promise(r => setTimeout(r, 800));

        return response;
    }
}

export const localAI = new LocalFallbackAI();
