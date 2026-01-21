const fs = require('fs');
const path = require('path');

// Pastas
const LOG_DIR = '/logs/conversas'; // onde ficam as sessões
const PATTERNS_FILE = '/logs/padroes-rapidos.json'; // salva respostas prontas

// Carrega padrões existentes (se tiver)
let padroes = fs.existsSync(PATTERNS_FILE) ? JSON.parse(fs.readFileSync(PATTERNS_FILE)) : {};

// Limpa padrões antigos (ex: só mantém os que apareceram >3x na semana)
const threshold = 3; // mínimo de vezes que uma pergunta deve aparecer
const hoje = new Date();
const semanaPassada = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);

// Lê todas as sessões da semana passada
const arquivos = fs.readdirSync(LOG_DIR, { recursive: true })
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(LOG_DIR, f))
    .filter(f => {
        const data = fs.statSync(f).mtime;
        return data >= semanaPassada && data <= hoje;
    });

// Conta padrões
const contagem = {};
arquivos.forEach(arquivo => {
    try {
        const json = JSON.parse(fs.readFileSync(arquivo));
        json.forEach(msg => {
            const chave = msg.texto.toLowerCase().trim();
            if (!contagem[chave]) contagem[chave] = 0;
            contagem[chave]++;
            // Se tem produto, salva como resposta pronta
            if (msg.produto) {
                padroes[chave] = {
                    resposta: `Sim, temos ${msg.produto.nome} por R$ ${msg.produto.preco}. Quer ver?`,
                    count: (padroes[chave]?.count || 0) + 1
                };
            }
        });
    } catch (e) {
        console.error(`Erro ao processar ${arquivo}:`, e.message);
    }
});

// Filtra só os que bateram threshold
Object.keys(contagem).forEach(p => {
    if (contagem[p] < threshold) {
        delete padroes[p];
    }
});

// Salva de volta
fs.writeFileSync(PATTERNS_FILE, JSON.stringify(padroes, null, 2));
console.log(`Padrões atualizados: ${Object.keys(padroes).length} respostas rápidas.`);