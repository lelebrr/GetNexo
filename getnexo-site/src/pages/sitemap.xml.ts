export async function get() {
    const baseUrl = 'https://getnexo.com.br';
    const entries: any[] = [
        { url: `${baseUrl}/`, changefreq: 'daily', priority: 1.0 },
        { url: `${baseUrl}/precos/`, changefreq: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/como-funciona/`, changefreq: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/blog/`, changefreq: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/contato/`, changefreq: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/privacidade/`, changefreq: 'yearly', priority: 0.3 },
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries.map(entry => `<url>
    <loc>${entry.url}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('')}
</urlset>`;

    return {
        body,
        headers: {
            'Content-Type': 'application/xml'
        }
    };
}