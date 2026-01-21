const fs = require('fs');
const path = require('path');

// Determine sessions directory
const SESSIONS_DIR = process.env.SESSIONS_DIR || path.join(__dirname, '..', 'sessions');

/**
 * Carrega ou cria uma nova conversa/sessão
 * @param {string} channel - wa, ig, fb, site (web)
 * @param {string} id - identificador único por canal
 * @returns {object} Dados da sessão
 */
function carregaConversa(channel, id) {
    const dir = channel === 'site' ? 'web' : channel;
    const subFolder = path.join(SESSIONS_DIR, dir);

    if (!fs.existsSync(subFolder)) {
        fs.mkdirSync(subFolder, { recursive: true });
    }

    const arquivo = path.join(subFolder, id + '.json');

    if (!fs.existsSync(arquivo)) {
        // Retorna modelo inicial se não existir
        return {
            id: id,
            canal: channel,
            nome: null,
            tom: 'amigo',
            ultimoCanal: channel,
            ultimaMensagem: null,
            produtoAtual: null,
            conversas: [],
            criado: new Date().toISOString(),
            ultimaAtiva: new Date().toISOString(),
            ativo: true,
            expira: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
        };
    }

    try {
        const dados = JSON.parse(fs.readFileSync(arquivo, 'utf-8'));
        return {
            ...dados,
            nome: dados.nome || null,
            ultima: dados.ultima || null,
            produto: dados.produto || null,
            canal: dados.ultimoCanal || channel
        };
    } catch (e) {
        console.error(`Error reading session file ${arquivo}:`, e);
        return null;
    }
}

/**
 * Salva a conversa/sessão
 */
function salvaConversa(channel, id, dados) {
    const dir = channel === 'site' ? 'web' : channel;
    const subFolder = path.join(SESSIONS_DIR, dir);

    if (!fs.existsSync(subFolder)) {
        fs.mkdirSync(subFolder, { recursive: true });
    }

    const arquivo = path.join(subFolder, id + '.json');
    dados.ultimaAtiva = new Date().toISOString();

    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2), 'utf-8');
    return true;
}

/**
 * Gera resposta do bot baseado no tom e estado da sessão
 */
function geraRespostaBot(sessao, mensagemCliente) {
    const tom = sessao.tom || 'amigo';
    const nome = sessao.nome;
    const agora = new Date();
    const ultimaAtiva = sessao.ultimaAtiva ? new Date(sessao.ultimaAtiva) : null;
    const diffHoras = ultimaAtiva ? (agora - ultimaAtiva) / (1000 * 60 * 60) : 999;
    const trocouCanal = sessao.ultimoCanal && sessao.ultimoCanal !== sessao.canal;

    let saudacao = "";

    // Lógica de saudação baseada no tom e tempo/canal
    if (tom === 'amigo') {
        if (trocouCanal) {
            saudacao = nome ? `E aí, ${nome}! Troca de chat, mas não troquei de memória.` : "E aí! Mudamos o canal, mas tô aqui.";
        } else if (diffHoras < 24 && sessao.conversas.length > 0) {
            saudacao = "E aí, voltou?";
        } else if (diffHoras >= 24 && diffHoras < 48) {
            saudacao = nome ? `E aí, ${nome}?` : "E aí, tudo certo?";
        } else {
            saudacao = "Oi! Tudo certo?";
        }
    } else if (tom === 'certinho') {
        if (trocouCanal) {
            saudacao = nome ? `Olá, ${nome}. Notei que você mudou de canal, como posso continuar ajudando?` : "Olá, em que canal posso ajudá-lo hoje?";
        } else {
            saudacao = nome ? `Olá, ${nome}.` : "Olá.";
        }
    } else {
        saudacao = nome ? `Sr(a). ${nome},` : "Prezado(a),";
    }

    // Lógica de corpo da mensagem
    let corpo = "";
    if (sessao.produtoAtual && sessao.produtoAtual.status === 'carrinho') {
        if (tom === 'amigo') {
            corpo = `Ainda interessado na ${sessao.produtoAtual.nome}? Tá R$ ${sessao.produtoAtual.preco} agora.`;
        } else if (tom === 'certinho') {
            corpo = `Deseja concluir a compra da ${sessao.produtoAtual.nome} por R$ ${sessao.produtoAtual.preco}?`;
        } else {
            corpo = `Informamos que a ${sessao.produtoAtual.nome} permanece disponível pelo valor de R$ ${sessao.produtoAtual.preco},00. Deseja prosseguir com o faturamento?`;
        }
    } else {
        if (tom === 'amigo') {
            corpo = "Em que posso ajudar?";
        } else if (tom === 'certinho') {
            corpo = "Como posso auxiliá-lo?";
        } else {
            corpo = "Em que podemos ser úteis em sua jornada conosco?";
        }
    }

    // Se não sabe o nome e já conversou um pouco
    if (!nome && sessao.conversas.length >= 2) {
        if (tom === 'amigo') {
            corpo = "Antes de seguir: pra eu te chamar direito, qual teu nome?";
        } else {
            corpo = "Poderia informar seu nome para que possamos identificá-lo adequadamente?";
        }
    }

    return `${saudacao} ${corpo}`;
}

/**
 * Processa comandos chat (/tom) e retorna resposta se for comando
 */
function processaComandos(channel, id, texto, sessao) {
    const txt = texto.toLowerCase().trim();

    // Comando de tom
    if (txt.startsWith('/tom ')) {
        const novoTom = txt.split(' ').pop();
        const tonsValidos = ['amigo', 'certinho', 'empresarial'];

        if (tonsValidos.includes(novoTom)) {
            sessao.tom = novoTom;
            salvaConversa(channel, id, sessao);
            return `Beleza, agora falo no modo ${novoTom}.`;
        }
    }

    // Extração automática de nome
    if (!sessao.nome && (txt.includes('meu nome é') || txt.includes('me chamo') || txt.startsWith('eu sou o ') || txt.startsWith('eu sou a '))) {
        const match = texto.match(/(?:meu nome é|me chamo|eu sou o|eu sou a)\s+([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)/i);
        if (match && match[1]) {
            const nomeExtraido = match[1].trim().split(' ')[0]; // Pega primeiro nome
            sessao.nome = nomeExtraido.charAt(0).toUpperCase() + nomeExtraido.slice(1).toLowerCase();
            salvaConversa(channel, id, sessao);
            // Não retorna resposta aqui para que o fluxo continue e o bot cumprimente com o novo nome
        }
    }

    return null;
}

module.exports = {
    carregaConversa,
    salvaConversa,
    geraRespostaBot,
    processaComandos
};
