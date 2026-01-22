import { renderers } from "../renderers.mjs";
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
const GET = () => {
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
