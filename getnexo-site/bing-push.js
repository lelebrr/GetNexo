const fetch = require('node-fetch');

const API_KEY = '174b884a9d204196b27fc8927563b232';
const SUBMISSION_URL = 'https://www.bing.com/indexnow/v1/submit';

async function enviaProBing(url) {
    try {
        const response = await fetch(SUBMISSION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Api-Key': API_KEY
            },
            body: JSON.stringify({
                host: 'getnexo.com.br',
                key: '174b884a9d204196b27fc8927563b232',
                keyLocation: 'https://getnexo.com.br/bing-key.txt',
                urlList: Array.isArray(url) ? url : [url]
            })
        });

        if (response.ok) {
            console.log('✅ Bing recebeu:', url);
        } else {
            console.error('❌ Erro no Bing:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('❌ Erro de conexão com Bing:', error.message);
    }
}

module.exports = { enviaProBing };

// Exemplo: quando publica post
// enviaProBing('https://getnexo.com.br/pt/blog/novo-truque-venda');