/**
 * Sitemap Dinâmico Otimizado para SEO
 * Gera sitemap XML com todas as páginas e integrações
 */

export async function get() {
    const baseUrl = 'https://getnexo.com.br';

    // Páginas principais com prioridades e frequências
    const mainPages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/produtos', priority: '0.9', changefreq: 'weekly' },
        { url: '/integracoes', priority: '0.9', changefreq: 'weekly' },
        { url: '/precos', priority: '0.8', changefreq: 'monthly' },
        { url: '/como-funciona', priority: '0.8', changefreq: 'monthly' },
        { url: '/blog', priority: '0.7', changefreq: 'daily' },
        { url: '/contato', priority: '0.6', changefreq: 'monthly' },
        { url: '/sobre', priority: '0.6', changefreq: 'monthly' },
        { url: '/privacidade', priority: '0.4', changefreq: 'yearly' },
        { url: '/termos', priority: '0.4', changefreq: 'yearly' },
        { url: '/acessibilidade', priority: '0.5', changefreq: 'monthly' },
        { url: '/certificacoes', priority: '0.5', changefreq: 'monthly' }
    ];

    // Integrações com alta prioridade para SEO
    const integrations = [
        'zapier', 'n8n', 'make', 'hubspot', 'google-sheets', 'hotmart',
        'rd-station', 'mercado-pago', 'woocommerce', 'shopify', 'vtex',
        'tray', 'loja-integrada', 'nuvemshop', 'yampi', 'vnda',
        'eduzz', 'kiwify', '99-entrega', 'melhor-envio', 'frenet',
        'correios', 'loggi', 'calendly', 'crm-bonus', 'alterdata',
        'bling', 'tiny', 'sankhya', 'totvs-protheus', 'data-system',
        'iset', 'linx', 'cartx', 'stone', 'cielo', 'getnet', 'vindi',
        'pagseguro', 'pagar-me', 'uappi', 'wake-experience', 'wake-commerce'
    ];

    const integrationPages = integrations.map(integration => ({
        url: `/integracoes/${integration}`,
        priority: integration === 'zapier' || integration === 'n8n' || integration === 'make' || integration === 'hubspot' ? '0.9' : '0.7',
        changefreq: 'weekly'
    }));

    // Blog posts simulados (substitua por dados reais)
    const blogPages = [
        { url: '/blog/como-automatizar-whatsapp-zapier', priority: '0.8', changefreq: 'monthly' },
        { url: '/blog/integracao-n8n-self-hosted', priority: '0.8', changefreq: 'monthly' },
        { url: '/blog/make-integromat-workflows', priority: '0.8', changefreq: 'monthly' },
        { url: '/blog/hubspot-crm-whatsapp', priority: '0.8', changefreq: 'monthly' },
        { url: '/blog/whatsapp-business-api-2024', priority: '0.7', changefreq: 'monthly' },
        { url: '/blog/automacao-whatsapp-sem-codigo', priority: '0.7', changefreq: 'monthly' }
    ];

    const allPages = [...mainPages, ...integrationPages, ...blogPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${page.url.startsWith('/integracoes/') ? `    <image:image>
      <image:loc>${baseUrl}/images/integracoes/${page.url.split('/').pop()}.png</image:loc>
      <image:title>Integração ${page.url.split('/').pop().replace('-', ' ')} WhatsApp</image:title>
      <image:caption>Automação WhatsApp com ${page.url.split('/').pop().replace('-', ' ')}</image:caption>
    </image:image>` : ''}
  </url>`).join('\n')}

</urlset>`;

    return {
        body: sitemap,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600',
            'X-Robots-Tag': 'noindex, nofollow' // Remove this line in production
        }
    };
}