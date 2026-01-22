export async function get({ params }: { params: { lang: string } }) {
    const baseUrl = 'https://getnexo.com.br';
    const lang = params.lang;

    const pages = [
        { url: `${baseUrl}/${lang}/`, changefreq: 'daily', priority: 1.0 },
        { url: `${baseUrl}/${lang}/blog/`, changefreq: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/${lang}/precos/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/${lang}/contato/`, changefreq: 'monthly', priority: 0.6 },
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `<url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

    return {
        body,
        headers: {
            'Content-Type': 'application/xml'
        }
    };
}