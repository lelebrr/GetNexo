
const robotsTxt = `
User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /404

# Host
Host: https://getnexo.com.br

# Sitemap
Sitemap: https://getnexo.com.br/sitemap.xml
`.trim();

export const GET = () => {
    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
