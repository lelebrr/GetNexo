
const robotsTxt = `
User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Disallow: /dashboard/
Allow: /es/
Allow: /fr/
Allow: /en/
Allow: /blog/
Allow: /sitemap-*.xml

# Sitemaps
Sitemap: https://getnexo.com.br/pt/sitemap.xml
Sitemap: https://getnexo.com.br/en/sitemap.xml
Sitemap: https://getnexo.com.br/es/sitemap.xml
Sitemap: https://getnexo.com.br/fr/sitemap.xml
`.trim();

export const GET = () => {
    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
