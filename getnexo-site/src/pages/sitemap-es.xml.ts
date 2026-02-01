export const GET = async () => {
  const baseUrl = 'https://getnexo.com.br';
  const pages = [
    // Main Spanish Pages
    { url: `${baseUrl}/es/`, changefreq: 'daily', priority: 1.0 },
    { url: `${baseUrl}/es/inicio/`, changefreq: 'daily', priority: 1.0 },
    { url: `${baseUrl}/es/blog/`, changefreq: 'daily', priority: 0.9 },
    { url: `${baseUrl}/es/analiticas/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/es/chat-ia-24h/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/es/como-funciona/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/es/criar-bot/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/es/demo/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/es/fidelidade/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/es/loja/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/es/precos/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/es/solucoes/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/es/tickets/`, changefreq: 'monthly', priority: 0.7 },
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
