# 🚀 GetNexo Site Component

This directory contains the frontend portion of the GetNexo platform, built with **Astro** and **React**.

---

## 📖 Global Documentation

For full project documentation, architecture details, and setup guides, please refer to the central documentation portal:

👉 **[GetNexo Project Documentation](../docs/README.md)**

---

## 🛠️ Tech Stack (Site Only)

- **Framework**: [Astro 5.0](https://astro.build)
- **Library**: [React 18.2](https://reactjs.org)
- **Styling**: [TailwindCSS 3.4](https://tailwindcss.com)
- **Language**: TypeScript

---

## 🚀 Key Features

### Dynamic Integration Pages
The site automatically generates hundreds of integration landing pages (e.g., `/integracoes/shopify`, `/integracoes/vtex`) at build time.
- **Source**: `src/data/integrationData.js`
- **Template**: `src/pages/integracoes/[slug].astro`
- **Sitemap**: Automatically included via `src/pages/sitemap-pt.xml.ts`

### SEO Engine
- **Dynamic Sitemaps**: Manually controlled TypeScript endpoints generate XML sitemaps.
- **Canonical Routing**: Strict canonical URLs to prevent duplicate content.
- **i18n Strategy**: Currently focused on PT-BR content with Blog support for EN/ES/FR.

---

## 🚀 Quick Run

If you have already configured the environment in the project root:

```bash
npm install
npm run dev
```

For more complex setup instructions, including database migrations and seeds, see the **[Getting Started Guide](../docs/development/GETTING_STARTED.md)**.
