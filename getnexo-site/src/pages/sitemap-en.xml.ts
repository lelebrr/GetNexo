export const GET = async () => {
    const baseUrl = 'https://getnexo.com.br';
    const pages = [
        { url: `${baseUrl}/en/`, changefreq: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/en/blog/`, changefreq: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/en/pricing/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/en/how-it-works/`, changefreq: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/en/features/`, changefreq: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/en/contact/`, changefreq: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/en/privacy/`, changefreq: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/en/faq/`, changefreq: 'monthly', priority: 0.5 },
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