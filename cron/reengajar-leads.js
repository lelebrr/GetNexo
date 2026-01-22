// cron/reengajar-leads.js - Cron Job para Reengajamento Automático de Leads
const cron = require('node-cron');
const Database = require('better-sqlite3');
const db = new Database('../database/leads.db');

// Configurações do cron
const CONFIG = {
    horarioEnvio: '30 9 * * *', // 9:30 todos os dias (seg-sex)
    maxLeadsPorDia: 200,
    intervaloMinimo: 24 * 60 * 60 * 1000, // 24h entre reenvios
    scoreMinimo: 30 // só leads com score > 30
};

console.log('🚀 Cron de Reengajamento de Leads iniciado...');
console.log(`⏰ Executará diariamente às ${CONFIG.horarioEnvio}`);

// Cron principal - executa diariamente
cron.schedule(CONFIG.horarioEnvio, async () => {
    console.log('\n📅 === EXECUÇÃO DIÁRIA - Reengajamento de Leads ===');
    console.log(`📊 Data: ${new Date().toLocaleString('pt-BR')}`);

    try {
        // 1. Buscar leads elegíveis para reengajamento
        const leadsElegiveis = buscarLeadsElegiveis();
        console.log(`📋 Encontrados ${leadsElegiveis.length} leads elegíveis`);

        if (leadsElegiveis.length === 0) {
            console.log('ℹ️ Nenhum lead para reengajar hoje.');
            return;
        }

        // 2. Limitar quantidade por dia
        const leadsParaEnviar = leadsElegiveis.slice(0, CONFIG.maxLeadsPorDia);
        console.log(`🎯 Enviando para ${leadsParaEnviar.length} leads (limite diário)`);

        // 3. Processar cada lead
        let enviados = 0;
        let erros = 0;

        for (const lead of leadsParaEnviar) {
            try {
                const sucesso = await processarLead(lead);
                if (sucesso) {
                    enviados++;
                    console.log(`✅ ${lead.numero} - ${lead.produto}`);
                } else {
                    erros++;
                    console.log(`❌ ${lead.numero} - Falhou`);
                }

                // Pequena pausa entre envios para não sobrecarregar
                await delay(1000);

            } catch (error) {
                console.error(`💥 Erro no lead ${lead.numero}:`, error.message);
                erros++;
            }
        }

        // 4. Relatório final
        console.log('\n📈 === RELATÓRIO DO DIA ===');
        console.log(`✅ Enviados: ${enviados}`);
        console.log(`❌ Erros: ${erros}`);
        console.log(`📊 Taxa sucesso: ${((enviados / leadsParaEnviar.length) * 100).toFixed(1)}%`);
        console.log('🎉 Execução concluída!');

    } catch (error) {
        console.error('💥 ERRO CRÍTICO:', error);
    }
});

// Buscar leads elegíveis
function buscarLeadsElegiveis() {
    const query = `
    SELECT * FROM leads_perdidos
    WHERE status = 'perdido'
      AND score_intencao > ?
      AND enviado_reengajamento = 0
      AND data_captura < datetime('now', '-1 day')
      AND (ultima_tentativa_reengajamento IS NULL
           OR ultima_tentativa_reengajamento < datetime('now', '-1 day'))
    ORDER BY score_intencao DESC, data_captura ASC
  `;

    return db.prepare(query).all(CONFIG.scoreMinimo);
}

// Processar um lead específico
async function processarLead(lead) {
    try {
        // 1. Gerar mensagem personalizada
        const mensagem = gerarMensagemPorMotivo(lead);

        // 2. Registrar tentativa no histórico
        registrarTentativa(lead, mensagem);

        // 3. Enviar mensagem via WhatsApp
        const enviado = await enviarWhatsApp(lead.numero, mensagem);

        if (enviado) {
            // 4. Atualizar status do lead
            atualizarStatusLead(lead.id, 'reenviado');
            return true;
        }

        return false;

    } catch (error) {
        console.error(`Erro ao processar lead ${lead.numero}:`, error);
        return false;
    }
}

// Gerar mensagem baseada no motivo de perda
function gerarMensagemPorMotivo(lead) {
    const { produto, preco, motivo_perda, interesse, tags = '' } = lead;
    const tag = tags.split(';')[0] || ''; // primeira tag

    const templates = {
        'preco_alto': `Oi! O ${produto} que você viu tá com **R$ ${(preco * 0.9).toFixed(2)}** hoje (10% off só pra você)! ⏰ Quer fechar agora?`,

        'atendimento': `Oi! Desculpa se demorei antes. Agora tô aqui 24h. O ${produto} que você viu ainda tá disponível – quer ver de novo?`,

        'duvida_estoque': `Oi! Acabei de ver: o ${produto} ${interesse ? `(${interesse})` : ''} voltou pro estoque. Quer reservar antes que acabe?`,

        'so_consulta': `Vi que olhou o ${produto}. Chegou uma novidade e preço abaixou. Quer foto atualizada?`,

        'desistiu': `Ei, tudo bem? Fiquei pensando... se desistiu por qualquer motivo, posso mandar uma oferta especial. Só falar.`,

        'urgencia': `FLASH SALE! 30% OFF em ${produto} - só hoje! Não perca: R$ ${(preco * 0.7).toFixed(2)}`,

        'outro': `Oi! Seu ${produto} ainda tá aqui. Tá na dúvida? Posso ajudar com frete grátis.`
    };

    return templates[motivo_perda] || templates.outro;
}

// Registrar tentativa no histórico
function registrarTentativa(lead, mensagem) {
    const stmt = db.prepare(`
    INSERT INTO historico_reengajamento (lead_id, data_envio, tipo_mensagem, conteudo)
    VALUES (?, ?, ?, ?)
  `);

    stmt.run(lead.id, new Date().toISOString(), lead.motivo_perda || 'automatico', mensagem);
}

// Enviar WhatsApp (mock - integre com seu provider)
async function enviarWhatsApp(numero, mensagem) {
    try {
        console.log(`📱 Enviando para ${numero}: ${mensagem.substring(0, 50)}...`);

        // Aqui você integra com VenixBot, Twilio, etc.
        // await axios.post('https://api.seu-provider.com/send', {
        //   to: numero,
        //   message: mensagem
        // });

        // Simular sucesso (80% de taxa)
        await delay(Math.random() * 2000 + 500); // 500-2500ms
        return Math.random() > 0.2; // 80% sucesso

    } catch (error) {
        console.error(`Erro ao enviar WhatsApp para ${numero}:`, error);
        return false;
    }
}

// Atualizar status do lead
function atualizarStatusLead(leadId, status) {
    const stmt = db.prepare(`
    UPDATE leads_perdidos
    SET status = ?, enviado_reengajamento = 1, ultima_tentativa_reengajamento = ?
    WHERE id = ?
  `);

    stmt.run(status, new Date().toISOString(), leadId);
}

// Utilitário de delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Tratamento de sinais para shutdown graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Recebido SIGINT. Encerrando cron...');
    db.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Recebido SIGTERM. Encerrando cron...');
    db.close();
    process.exit(0);
});

console.log('✅ Cron configurado e aguardando execução...');
console.log(`📅 Próxima execução: ${cron.schedule(CONFIG.horarioEnvio).nextDates().next().toLocaleString('pt-BR')}`);