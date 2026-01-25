// bot/full-bot.js
require('dotenv').config(); // npm i dotenv
const { Client, LocalAuth } = require('whatsapp-web.js'); // npm i whatsapp-web.js
const qrcode = require('qrcode-terminal'); // npm i qrcode-terminal
const axios = require('axios'); // fallback
const { LeadsInteligente } = require('./leads-inteligente'); // npm i better-sqlite3
const fs = require('fs');
const path = require('path');

const client = new Client({ authStrategy: new LocalAuth() });

// Sistema de Logging Aprimorado
class Logger {
    constructor() {
        this.logDir = path.join(__dirname, 'logs');
        this.ensureLogDirectory();
        this.logLevels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };
        this.currentLevel = process.env.LOG_LEVEL || 'INFO';
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    getLogFilePath() {
        const date = new Date().toISOString().split('T')[0];
        return path.join(this.logDir, `bot-${date}.log`);
    }

    shouldLog(level) {
        return this.logLevels[level] <= this.logLevels[this.currentLevel];
    }

    formatMessage(level, message, data = null) {
        const timestamp = this.getTimestamp();
        const logEntry = {
            timestamp,
            level,
            message,
            data: data ? JSON.stringify(data) : null,
            pid: process.pid
        };
        return JSON.stringify(logEntry);
    }

    log(level, message, data = null) {
        if (!this.shouldLog(level)) return;

        const formattedMessage = this.formatMessage(level, message, data);
        const logFilePath = this.getLogFilePath();

        // Escreve no arquivo
        fs.appendFileSync(logFilePath, formattedMessage + '\n');

        // Escreve no console com cores
        const colors = {
            ERROR: '\x1b[31m',
            WARN: '\x1b[33m',
            INFO: '\x1b[36m',
            DEBUG: '\x1b[35m'
        };
        const reset = '\x1b[0m';

        console.log(`${colors[level]}[${timestamp}] ${level}: ${message}${reset}`);
        if (data) {
            console.log(`${colors[level]}Data: ${data}${reset}`);
        }
    }

    error(message, data = null) {
        this.log('ERROR', message, data);
    }

    warn(message, data = null) {
        this.log('WARN', message, data);
    }

    info(message, data = null) {
        this.log('INFO', message, data);
    }

    debug(message, data = null) {
        this.log('DEBUG', message, data);
    }

    // Método para registrar eventos do bot
    logBotEvent(event, data = null) {
        this.info(`BOT_EVENT: ${event}`, data);
    }

    // Método para registrar interações com usuários
    logUserInteraction(userId, message, response = null) {
        this.info('USER_INTERACTION', {
            userId,
            message,
            response,
            timestamp: this.getTimestamp()
        });
    }
}

// Instância global do logger
const logger = new Logger();

// Inicializa sistema de leads inteligente
const leadsSystem = new LeadsInteligente();

// Produtos reais (os 25 que combinamos)
const produtosReais = [
    'tenis branco', 'tenis preto', 'bota marrom', 'chinelo simples', 'salto bege',
    'camiseta branca', 'camiseta preta', 'calca jeans', 'jaqueta verde', 'vestido preto',
    'oculos sol', 'relógio prata', 'bolsa crossbody', 'chapeu fedora', 'pulseira prata',
    'celular preto', 'fone ouvido', 'smartwatch', 'teclado gamer', 'carregador wireless',
    'vasinho planta', 'mesa centro', 'cadeira gamer', 'abajur minimal', 'quadro 3d'
];

// Inicializa bot
client.on('qr', qr => {
    logger.info('QR Code gerado', { qr: qr.substring(0, 50) + '...' });
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    logger.info('Bot online!', {
        timestamp: new Date().toISOString(),
        clientId: client.info.wid.user
    });
    console.log('Bot online!');
});

client.on('auth_failure', (msg) => {
    logger.error('Falha na autenticação', { message: msg });
});

client.on('disconnected', (reason) => {
    logger.error('Bot desconectado', { reason });
});

client.initialize();

client.on('message', async msg => {
    const texto = msg.body.toLowerCase();
    const userId = msg.from;
    const userName = msg.pushName;

    // Registra interação do usuário
    logger.logUserInteraction(userId, texto);

    // Só responde mensagens diretas
    if (msg.from.includes('@g.us') || msg.from === 'status@g.us') {
        logger.debug('Mensagem ignorada (grupo/status)', { from: msg.from });
        return;
    }

    // Processa mensagem no sistema de leads
    try {
        await leadsSystem.processarMensagem({
            numero: msg.from,
            nome: msg.pushName
        }, texto, {});
        logger.debug('Mensagem processada no sistema de leads', { userId, texto });
    } catch (err) {
        logger.error('Erro ao processar mensagem no sistema de leads', { userId, texto, error: err.message });
    }

    // Extrai produto da frase
    const produtoMatch = texto.match(/tem (.*)?/i);
    const produto = produtoMatch ? produtoMatch[1].trim() : null;
    if (!produto) {
        logger.debug('Sem produto na mensagem', { userId, texto });
        return msg.reply('Oi! Qual produto você quer?');
    }

    logger.info('Produto solicitado', { userId, produto });

    // Verifica se existe real
    const temReal = produtosReais.some(p => p.toLowerCase().includes(produto.toLowerCase()));

    if (temReal) {
        logger.info('Produto encontrado no catálogo', { userId, produto });
        msg.reply(`Sim, temos ${produto}! R$ 199,90. Quer ver em 360°? 👀\n\n🛍️ Veja em AR: /ar/${produto.replace(/\s+/g, '_')}`);
        return;
    }

    // ❌ Não tem → gera IA + dados
    logger.info('Gerando imagem IA para produto inexistente', { userId, produto });
    msg.reply('Aguarda 5s... tô criando pra você 😎');

    try {
        const imagemUrl = await gerarImagemIA(produto);
        const dados = gerarDadosFake(produto);

        // Envia foto
        await client.sendMessage(msg.from, imagemUrl, { caption: dados.descricao });

        msg.reply(`Aqui ó: ${produto} por ${dados.preco}. Estoque: ${dados.estoque} unidades. Fecha?`);

        logger.info('Imagem IA enviada com sucesso', { userId, produto, preco: dados.preco });
    } catch (err) {
        logger.error('Erro ao gerar imagem IA', { userId, produto, error: err.message });
        console.error(err);
        msg.reply('Não deu pra gerar agora... mas posso te mandar o catálogo!');
    }
});

// === IA DE IMAGEM ===
async function gerarImagemIA(prompt) {
    const startTime = Date.now();
    logger.debug('Iniciando geração de imagem IA', { prompt });

    try {
        // Primeiro: Puter.js (gratuito e ilimitado)
        logger.debug('Tentando Puter.js API', { prompt });
        const res = await axios.post('https://api.puter.com/ai/image', {
            prompt: `Foto realista de ${prompt}, fundo branco, estúdio profissional`,
            model: 'flux'
        });
        const duration = Date.now() - startTime;
        logger.info('Imagem gerada via Puter.js', {
            prompt,
            duration: `${duration}ms`,
            url: res.data.url
        });
        return res.data.url;
    } catch (error) {
        logger.warn('Puter.js falhou, tentando Pixazo', { prompt, error: error.message });

        // Fallback: Pixazo
        try {
            logger.debug('Tentando Pixazo API', { prompt });
            const res = await axios.post('https://api.pixazo.ai/v1/images/generations', {
                prompt: `Foto realista de ${prompt}, fundo branco`,
                model: 'flux-schnell'
            });
            const duration = Date.now() - startTime;
            logger.info('Imagem gerada via Pixazo', {
                prompt,
                duration: `${duration}ms`,
                url: res.data.images[0].url
            });
            return res.data.images[0].url;
        } catch (error) {
            logger.warn('Pixazo falhou, tentando Hugging Face', { prompt, error: error.message });

            // Último recurso: Hugging Face
            try {
                logger.debug('Tentando Hugging Face API', { prompt });
                const res = await axios.post('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1', {
                    inputs: `Foto realista de ${prompt}, fundo branco`
                }, {
                    headers: { Authorization: `Bearer ${process.env.HF_KEY}` },
                    responseType: 'blob'
                });

                // Para blob, vamos salvar temporariamente e retornar URL local
                const tempPath = path.join(__dirname, 'temp_image.png');
                fs.writeFileSync(tempPath, res.data);
                const duration = Date.now() - startTime;
                logger.info('Imagem gerada via Hugging Face (local)', {
                    prompt,
                    duration: `${duration}ms`,
                    tempPath
                });
                return `file://${tempPath}`; // URL local
            } catch (error) {
                const duration = Date.now() - startTime;
                logger.error('Todas as APIs de imagem falharam', {
                    prompt,
                    duration: `${duration}ms`,
                    error: error.message
                });
                throw error;
            }
        }
    }
}

// === DADOS FAKES ===
function gerarDadosFake(produto) {
    const preços = [49, 79, 99, 149, 199, 299, 399, 499, 699, 999];
    const estoque = Math.floor(Math.random() * 15) + 2;

    return {
        preco: `R$ ${preços[Math.floor(Math.random() * preços.length)].toFixed(2).replace('.', ',')}`,
        estoque: estoque,
        descricao: `Produto premium ${produto}. Alta qualidade. Frete grátis acima de R$ 200.`
    };
}