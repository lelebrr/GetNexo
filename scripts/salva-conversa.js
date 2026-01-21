const fs = require('fs');
const path = require('path');

const LOG_DIR = '/logs/conversas';
let PATTERNS = {}; // vai crescer com o uso

// Cria pasta se não existir
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Função: salva mensagem
function salvar(mensagem) {
    const { cliente, texto, produto, timestamp } = mensagem;
    const arquivo = path.join(LOG_DIR, `${timestamp.split(' ')[0]}/${cliente}.json`);

    if (!fs.existsSync(path.dirname(arquivo))) {
        fs.mkdirSync(path.dirname(arquivo), { recursive: true });
    }

    const sessao = fs.existsSync(arquivo) ? JSON.parse(fs.readFileSync(arquivo)) : [];
    // Se tem produto ou pergunta comum, salva pra usar depois
    sessao.push({ texto, produto, timestamp });

    // Atualiza padrões (ex: blusa preta aparece 5x → resposta pronta)
    const padrao = texto.toLowerCase();
    if (produto) {
        PATTERNS[padrao] = {
            resposta: `Temos sim, ${produto.nome} por R$ ${produto.preco}. Quer ver?`,
            count: (PATTERNS[padrao]?.count || 0) + 1
        };
    }

    fs.writeFileSync(arquivo, JSON.stringify(sessao, null, 2));
}

// Função: verifica se já tem resposta pronta
function temRespostaPronto(pergunta) {
    const padrao = pergunta.toLowerCase();
    return PATTERNS[padrao] ? PATTERNS[padrao].resposta : null;
}

// Exporta pra usar no chat
module.exports = { salvar, temRespostaPronto };