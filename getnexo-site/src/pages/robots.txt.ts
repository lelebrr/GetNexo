const robotsTxt = `
User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Disallow: /dashboard/
Allow: /
Allow: /es/
Allow: /fr/
Allow: /en/
Allow: /blog/
Allow: /sitemap-*.xml

# Sitemaps
Sitemap: https://getnexo.com.br/sitemap-pt.xml
Sitemap: https://getnexo.com.br/sitemap-en.xml
Sitemap: https://getnexo.com.br/sitemap-es.xml
Sitemap: https://getnexo.com.br/sitemap-fr.xml
`.trim();

export const GET = () => {
    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
