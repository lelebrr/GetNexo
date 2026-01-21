/// <reference types="astro/client" />

const pages = import.meta.glob('/src/pages/**/*.astro');
const siteUrl = 'https://getnexo.com.br';

export const GET = async () => {
    const routes = Object.keys(pages)
        .filter(path => {
            // Exclude dynamic routes, 404, robots, sitemap, and private files
            return !path.includes('[') &&
                !path.includes('404') &&
                !path.includes('robots') &&
                !path.includes('sitemap') &&
                !path.includes('/_') &&
                !path.includes('/api/');
        })
        .map(path => {
            // Convert file path to URL path
            let route = path
                .replace('/src/pages', '')
                .replace('.astro', '')
                .replace('/index', '');

            if (route === '') route = '/';
            return route;
        });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
};
