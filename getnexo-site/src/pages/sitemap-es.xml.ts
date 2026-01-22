export const GET = async () => {
    const baseUrl = 'https://getnexo.com.br';
    const pages = [
        { url: `${baseUrl}/es/`, changefreq: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/es/blog/`, changefreq: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/es/precios/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/es/como-funciona/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/es/recursos/`, changefreq: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/es/contato/`, changefreq: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/es/privacidad/`, changefreq: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/es/faq/`, changefreq: 'monthly', priority: 0.5 },
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