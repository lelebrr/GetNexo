export const GET = async () => {
  const baseUrl = 'https://getnexo.com.br';
  const pages = [
    // English Pages
    { url: `${baseUrl}/en/`, changefreq: 'daily', priority: 1.0 },
    { url: `${baseUrl}/en/blog/`, changefreq: 'daily', priority: 0.9 },
    { url: `${baseUrl}/en/analytics/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/en/chat-ia-24h/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/en/como-funciona/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/criar-bot/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/demo/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/en/fidelidade/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/loja/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/precos/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/en/solucoes/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/tickets/`, changefreq: 'monthly', priority: 0.7 },

    { url: `${baseUrl}/en/tickets/`, changefreq: 'monthly', priority: 0.7 },
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
