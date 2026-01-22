// Ping Google sitemap após atualização
const https = require('https');

function pingGoogleSitemap(sitemapUrl) {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    https.get(googlePingUrl, (res) => {
        if (res.statusCode === 200) {
            console.log('✅ Google recebeu ping do sitemap:', sitemapUrl);
        } else {
            console.error('❌ Erro no ping do Google:', res.statusCode);
        }
    }).on('error', (err) => {
        console.error('❌ Erro de conexão com Google:', err.message);
    });
}

// Exemplo de uso
// pingGoogleSitemap('https://getnexo.com.br/sitemap.xml');

module.exports = { pingGoogleSitemap };