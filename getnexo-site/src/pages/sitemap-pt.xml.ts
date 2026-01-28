export const GET = async () => {
    const baseUrl = 'https://getnexo.com.br';
    const pages = [
        // Core Pages (PT structure)
        { url: `${baseUrl}/`, changefreq: 'daily', priority: 1.0 },
        { url: `${baseUrl}/pt/`, changefreq: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/pt/blog/`, changefreq: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/pt/precos/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/pt/como-funciona/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/pt/recursos/`, changefreq: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/pt/contato/`, changefreq: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/pt/privacidade/`, changefreq: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/pt/faq/`, changefreq: 'monthly', priority: 0.5 },

        // Extended Pages (Root structure)
        { url: `${baseUrl}/integracoes/`, changefreq: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/sobre/`, changefreq: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/termos/`, changefreq: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/revenda/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/api/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/sistema-tickets/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/gamificacao-vendas/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/programa-pontos/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/magic-replies/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/analise-sentimento/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/chat-ia-24h/`, changefreq: 'monthly', priority: 0.8 },
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `<url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
};
