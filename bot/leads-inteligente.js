// bot/leads-inteligente.js - Sistema Inteligente de Captura de Leads Perdidos
const Database = require('better-sqlite3');
const db = new Database('database/leads.db');

// Configurações da IA (usa DeepSeek ou Groq)
const IA_CONFIG = {
    provider: process.env.AI_PROVIDER || 'deepseek', // 'deepseek', 'groq', 'openai'
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL || 'deepseek-chat'
};

// Padrões de captura automática
const PADROES_CAPTURA = {
    interesse_produto: /(quero|quero ver|mostra|foto|tem|preço|valor|quanto|custa|disponível)/i,
    interesse_preco: /(preço|valor|quanto|custa|barato|caro|promoção|desconto|oferta)/i,
    interesse_tamanho: /(tamanho|tamanho \d+|numero \d+|eu calço|eu uso)/i,
    interesse_cor: /(cor|cor \w+|preto|branco|azul|vermelho|verde)/i,
    interesse_entrega: /(entrega|frete|envio|prazo|chega quando)/i,
    duvida_geral: /(duvida|pergunta|como|onde|quando)/i,
    objeção: /(caro|demora|muito|não sei|pensar|vou pensar)/i
};

// Classe principal do sistema de leads
class LeadsInteligente {

    constructor() {
        this.conversasAtivas = new Map(); // numero -> { mensagens: [], timestamp: '', produto: '' }
        this.intervaloVerificacao = 30 * 60 * 1000; // 30 minutos sem resposta = lead perdido
        this.iniciarMonitoramento();
    }

    // 1. CAPTURA AUTOMÁTICA - Chamado sempre que cliente manda mensagem
    async processarMensagem(cliente, mensagem, contexto = {}) {
        const numero = this.normalizarNumero(cliente.numero);

        // Verifica se é uma conversa nova
        if (!this.conversasAtivas.has(numero)) {
            this.conversasAtivas.set(numero, {
                mensagens: [],
                timestamp: new Date().toISOString(),
                produto: contexto.produto || this.extrairProduto(mensagem),
                preco: contexto.preco || 0,
                cliente: cliente
            });
        }

        const conversa = this.conversasAtivas.get(numero);
        conversa.mensagens.push({
            de: 'cliente',
            texto: mensagem,
            timestamp: new Date().toISOString()
        });

        conversa.timestamp = new Date().toISOString();

        // Verifica se deve capturar como lead
        if (this.deveCapturarComoLead(mensagem, conversa)) {
            await this.capturarLead(numero, conversa);
        }

        return conversa;
    }

    // 2. DETECTA QUANDO CLIENTE DESISTE (30min sem resposta)
    iniciarMonitoramento() {
        setInterval(() => {
            const agora = new Date();

            for (const [numero, conversa] of this.conversasAtivas.entries()) {
                const ultimaAtividade = new Date(conversa.timestamp);
                const diferencaMinutos = (agora - ultimaAtividade) / (1000 * 60);

                if (diferencaMinutos > 30) {
                    console.log(`Cliente ${numero} ficou ${Math.round(diferencaMinutos)}min sem resposta. Capturando lead...`);
                    this.capturarLeadPerdido(numero, conversa);
                    this.conversasAtivas.delete(numero);
                }
            }
        }, 5 * 60 * 1000); // Verifica a cada 5 minutos
    }

    // 3. ANÁLISE INTELIGENTE COM IA
    async analisarLeadComIA(conversa) {
        try {
            const prompt = this.criarPromptAnalise(conversa);
            const respostaIA = await this.chamarIA(prompt);

            // Parse da resposta da IA
            const analise = JSON.parse(respostaIA);

            return {
                motivo_perda: this.validarMotivo(analise.motivo_perda),
                score_intencao: Math.max(0, Math.min(100, analise.score_intencao || 0)),
                tags: this.processarTags(analise.tags || []),
                recomendacao_reengajamento: analise.recomendacao_reengajamento || 'desconto'
            };

        } catch (error) {
            console.error('Erro na análise IA:', error);
            // Fallback básico
            return {
                motivo_perda: 'outro',
                score_intencao: 50,
                tags: [],
                recomendacao_reengajamento: 'desconto'
            };
        }
    }

    // 4. SALVAR LEAD NO BANCO
    async salvarLead(leadData) {
        try {
            const stmt = db.prepare(`
        INSERT OR REPLACE INTO leads_perdidos
        (numero, nome, produto, preco, data_captura, interesse, ultima_msg, link_compra, foto_360, conversa_json, motivo_perda, score_intencao, tags, valor_perdido, ultima_interacao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            stmt.run(
                leadData.numero,
                leadData.nome,
                leadData.produto,
                leadData.preco,
                leadData.data_captura,
                leadData.interesse,
                leadData.ultima_msg,
                leadData.link_compra,
                leadData.foto_360,
                JSON.stringify(leadData.conversa),
                leadData.motivo_perda,
                leadData.score_intencao,
                leadData.tags.join(';'),
                leadData.valor_perdido,
                leadData.ultima_interacao
            );

            console.log(`✅ Lead salvo: ${leadData.numero} - ${leadData.produto} (${leadData.score_intencao}% intenção)`);

        } catch (error) {
            console.error('Erro ao salvar lead:', error);
        }
    }

    // 5. REENGAJAMENTO AUTOMÁTICO
    async executarReengajamento() {
        const stmt = db.prepare(`
      SELECT * FROM leads_perdidos
      WHERE status = 'perdido'
        AND enviado_reengajamento = 0
        AND score_intencao > 30
        AND data_captura < datetime('now', '-1 day')
      LIMIT 10
    `);

        const leads = stmt.all();

        for (const lead of leads) {
            await this.enviarMensagemReengajamento(lead);
        }
    }

    async enviarMensagemReengajamento(lead) {
        const template = this.obterTemplatePorMotivo(lead.motivo_perda);

        const mensagem = template
            .replace('{{produto}}', lead.produto)
            .replace('{{preco}}', `R$ ${(lead.preco * 0.9).toFixed(2)}`)
            .replace('{{link}}', lead.link_compra)
            .replace('{{interesse}}', lead.interesse);

        // Enviar via WhatsApp (integre com seu provider)
        await this.enviarWhatsApp(lead.numero, mensagem);

        // Registrar no histórico
        const stmt = db.prepare(`
      INSERT INTO historico_reengajamento (lead_id, data_envio, tipo_mensagem, conteudo)
      VALUES (?, ?, ?, ?)
    `);

        stmt.run(lead.id, new Date().toISOString(), lead.motivo_perda, mensagem);

        // Marcar como enviado
        db.prepare('UPDATE leads_perdidos SET enviado_reengajamento = 1 WHERE id = ?').run(lead.id);

        console.log(`📤 Reengajamento enviado para ${lead.numero}: ${lead.motivo_perda}`);
    }

    // === MÉTODOS AUXILIARES ===

    normalizarNumero(numero) {
        return numero.replace(/\D/g, '');
    }

    deveCapturarComoLead(mensagem, conversa) {
        return Object.values(PADROES_CAPTURA).some(pattern => pattern.test(mensagem));
    }

    extrairProduto(mensagem) {
        // Lógica simples - em produção use NLP
        const palavras = mensagem.toLowerCase().split(' ');
        const produtos = ['tênis', 'sapato', 'camisa', 'celular', 'fone', 'notebook'];

        for (const palavra of palavras) {
            if (produtos.includes(palavra)) {
                return palavra.charAt(0).toUpperCase() + palavra.slice(1);
            }
        }

        return 'Produto não identificado';
    }

    async capturarLead(numero, conversa) {
        const leadData = {
            numero,
            nome: conversa.cliente?.nome || null,
            produto: conversa.produto,
            preco: conversa.preco,
            data_captura: conversa.timestamp,
            interesse: this.extrairInteresse(conversa.mensagens),
            ultima_msg: conversa.mensagens[conversa.mensagens.length - 1]?.texto || '',
            link_compra: `/loja?produto=${encodeURIComponent(conversa.produto.toLowerCase().replace(' ', '-'))}`,
            conversa: conversa.mensagens,
            valor_perdido: conversa.preco,
            ultima_interacao: conversa.timestamp
        };

        // Análise inteligente com IA
        const analise = await this.analisarLeadComIA(conversa);
        Object.assign(leadData, analise);

        await this.salvarLead(leadData);
    }

    capturarLeadPerdido(numero, conversa) {
        // Mesmo processo mas forçado
        this.capturarLead(numero, conversa);
    }

    extrairInteresse(mensagensCliente) {
        const interesses = [];

        for (const msg of mensagensCliente) {
            if (PADROES_CAPTURA.interesse_tamanho.test(msg.texto)) interesses.push('tamanho');
            if (PADROES_CAPTURA.interesse_cor.test(msg.texto)) interesses.push('cor');
            if (PADROES_CAPTURA.interesse_entrega.test(msg.texto)) interesses.push('frete');
        }

        return interesses.length > 0 ? interesses.join(', ') : 'Geral';
    }

    criarPromptAnalise(conversa) {
        const mensagens = conversa.mensagens.map(m => `${m.de}: ${m.texto}`).join('\n');

        return `Analise esta conversa de WhatsApp entre cliente e chatbot de vendas.
Retorne APENAS um JSON válido com:

{
  "motivo_perda": "preco_alto" | "atendimento" | "duvida_estoque" | "so_consulta" | "desistiu" | "outro",
  "score_intencao": número de 0-100 (quanto o cliente queria comprar),
  "tags": ["tamanho_40", "cor_preto", "frete_gratis", ...],
  "recomendacao_reengajamento": "desconto" | "estoque" | "urgencia" | "personalizada"
}

Conversa:
${mensagens}

Cliente mostrou interesse mas não comprou. Por quê?`;
    }

    async chamarIA(prompt) {
        if (IA_CONFIG.provider === 'deepseek') {
            return await this.chamarDeepSeek(prompt);
        }
        // Adicione outros providers aqui
        return '{"motivo_perda": "outro", "score_intencao": 50, "tags": [], "recomendacao_reengajamento": "desconto"}';
    }

    async chamarDeepSeek(prompt) {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${IA_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: IA_CONFIG.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 300
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }

    validarMotivo(motivo) {
        const motivosValidos = ['preco_alto', 'atendimento', 'duvida_estoque', 'so_consulta', 'desistiu', 'outro'];
        return motivosValidos.includes(motivo) ? motivo : 'outro';
    }

    processarTags(tags) {
        return tags.filter(tag => tag && tag.length < 20).slice(0, 5);
    }

    obterTemplatePorMotivo(motivo) {
        const templates = {
            'preco_alto': 'Ei! O {{produto}} que você viu tá R$ {{preco}} com desconto hoje! ⏰ Corre: {{link}}',
            'duvida_estoque': 'Boa notícia! Chegou mais {{produto}} no {{interesse}}. Reserva o seu? {{link}}',
            'atendimento': 'Oi! Agora tô aqui 24h por dia. O que precisa sobre o {{produto}}? {{link}}',
            'so_consulta': 'Lembrou do {{produto}}? Temos frete grátis hoje! {{link}}',
            'desistiu': 'Ei, voltou! O {{produto}} tá esperando você: {{link}}',
            'outro': 'Oi! Vimos que você gostou do {{produto}}. Temos uma surpresa: {{link}}'
        };

        return templates[motivo] || templates.outro;
    }

    async enviarWhatsApp(numero, mensagem) {
        // Integre com seu provider WhatsApp (VenixBot, etc.)
        console.log(`📱 Enviando para ${numero}: ${mensagem}`);

        // Exemplo com VenixBot:
        // await axios.post('https://api.venixbot.com/send', {
        //   to: numero,
        //   message: mensagem
        // });
    }
}

// Exportar para uso
module.exports = { LeadsInteligente };

// Uso no bot principal:
// const { LeadsInteligente } = require('./bot/leads-inteligente');
// const leadsSystem = new LeadsInteligente();
//
// // Quando cliente manda mensagem:
// await leadsSystem.processarMensagem(cliente, mensagem, { produto: 'Tênis Nike', preco: 399.90 });
//
// // Cron para reengajamento (diariamente):
// setInterval(() => leadsSystem.executarReengajamento(), 24 * 60 * 60 * 1000);