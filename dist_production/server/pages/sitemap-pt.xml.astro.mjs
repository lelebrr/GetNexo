import { renderers } from "../renderers.mjs";
async function get() {
  const baseUrl = "https://getnexo.com.br";
  const pages = [
    { url: `${baseUrl}/`, changefreq: "daily", priority: 1 },
    { url: `${baseUrl}/pt/`, changefreq: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pt/blog/`, changefreq: "weekly", priority: 0.8 },
    { url: `${baseUrl}/pt/precos/`, changefreq: "monthly", priority: 0.7 },
    { url: `${baseUrl}/pt/como-funciona/`, changefreq: "monthly", priority: 0.7 },
    { url: `${baseUrl}/pt/recursos/`, changefreq: "monthly", priority: 0.6 },
    { url: `${baseUrl}/pt/contato/`, changefreq: "monthly", priority: 0.6 },
    { url: `${baseUrl}/pt/privacidade/`, changefreq: "yearly", priority: 0.3 },
    { url: `${baseUrl}/pt/faq/`, changefreq: "monthly", priority: 0.5 }
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map((page2) => `<url>
    <loc>${page2.url}</loc>
    <changefreq>${page2.changefreq}</changefreq>
    <priority>${page2.priority}</priority>
  </url>`).join("")}
</urlset>`;
  return {
    body,
    headers: {
      "Content-Type": "application/xml"
    }
  };
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
