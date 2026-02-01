export const GET = async () => {
  const baseUrl = 'https://getnexo.com.br';
  const pages = [
    // French Pages
    { url: `${baseUrl}/fr/`, changefreq: 'daily', priority: 1.0 },
    { url: `${baseUrl}/fr/blog/`, changefreq: 'daily', priority: 0.9 },
    { url: `${baseUrl}/fr/analytics/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/fr/chat-ia-24h/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/fr/como-funciona/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/fr/criar-bot/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/fr/demo/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/fr/fidelidade/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/fr/loja/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/fr/multi-agente/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/fr/openai/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/fr/precos/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/fr/solucoes/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/fr/tickets/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/fr/whatsapp-marketing/`, changefreq: 'monthly', priority: 0.7 },

    { url: `${baseUrl}/fr/whatsapp-marketing/`, changefreq: 'monthly', priority: 0.7 },
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
