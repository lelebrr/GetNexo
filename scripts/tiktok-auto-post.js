// tiktok-auto-post.js - Post automático no TikTok
// Integra com API do TikTok ou Puppeteer

const puppeteer = require('puppeteer');
const fs = require('fs');
const { TikTokAPI } = require('tiktok-api'); // assumir instalado

require('dotenv').config({ path: './.env' });

const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME;
const TIKTOK_PASSWORD = process.env.TIKTOK_PASSWORD;
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

async function uploadTikTokVideo(videoPath, caption, hashtags) {
    // Método 1: API Oficial (se disponível)
    if (TIKTOK_ACCESS_TOKEN) {
        const api = new TikTokAPI({ accessToken: TIKTOK_ACCESS_TOKEN });
        const result = await api.uploadVideo({
            video: fs.readFileSync(videoPath),
            description: `${caption} ${hashtags.join(' ')}`
        });
        return result;
    }

    // Método 2: Puppeteer (fallback)
    const browser = await puppeteer.launch({ headless: false }); // precisa GUI para login
    const page = await browser.newPage();

    // Login
    await page.goto('https://www.tiktok.com/login');
    await page.type('input[name="username"]', TIKTOK_USERNAME);
    await page.type('input[name="password"]', TIKTOK_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Upload
    await page.goto('https://www.tiktok.com/upload');
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(videoPath);

    // Caption
    await page.type('textarea', `${caption} ${hashtags.join(' ')}`);

    // Post
    await page.click('button[data-testid="upload-button"]');
    await page.waitForSelector('.success-message'); // esperar confirmação

    await browser.close();
    return { success: true };
}

async function generateContentForTikTok(keyword) {
    // Gerar legenda e hashtags baseadas na keyword
    const captions = {
        'chatbot loja': 'Chatbot que vende sozinho enquanto você dorme 💰🤖 #chatbot #vendas #automacao',
        'pix whatsapp': 'Aceite PIX direto no WhatsApp! 🚀💳 #pix #whatsapp #pagamento',
        'ia vendas': 'IA vendendo 24/7 no seu negócio 🤖📈 #ia #vendas #automacao'
    };

    const hashtags = ['#empreendedorismo', '#ecommerce', '#tecnologia', '#inovacao', '#getnexo'];

    return {
        caption: captions[keyword] || `Descubra como ${keyword} pode revolucionar seu negócio! 🔥`,
        hashtags: hashtags,
        videoPath: `./videos/${keyword.replace(' ', '_')}.mp4` // assumir vídeo existe
    };
}

async function autoPostTikTok(content) {
    const { caption, hashtags, videoPath } = await generateContentForTikTok(content.keyword);

    if (!fs.existsSync(videoPath)) {
        console.log('Vídeo não encontrado, pulando post');
        return;
    }

    try {
        const result = await uploadTikTokVideo(videoPath, caption, hashtags);
        console.log('Post TikTok realizado:', result);
        return result;
    } catch (error) {
        console.error('Erro no post TikTok:', error);
    }
}

module.exports = { autoPostTikTok };

// Se rodar direto
if (require.main === module) {
    autoPostTikTok({ keyword: 'chatbot loja' }).catch(console.error);
}