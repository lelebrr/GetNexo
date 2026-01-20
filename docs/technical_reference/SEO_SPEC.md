# SEO & PERFORMANCE SPECIFICATION (Golden Master)
> **Philosophy**: "Velocidade é Ranking"
> **Target**: 100/100 Google Lighthouse
> **Status**: IMPLEMENTED

## 1. Technical SEO (Foundation)
The invisible layer that creates authority.

### Framework & Rendering
*   **Engine**: Astro (Static Site Generation - SSG).
*   **HTML**: Pure static HTML delivery. Zero hydration for content.
*   **Output**: `dist/` folder ready for CDN (Vercel/Cloudflare).

### Indexing Control
*   **Sitemap**: Auto-generated at `https://getnexo.com.br/sitemap-index.xml`.
*   **Robots.txt**:
    *   `Allow: /`
    *   `Disallow: /admin` (Privacidade)
    *   `Disallow: /ara` (AI Console)
    *   `Disallow: /api` (Endpoints)
*   **Canonical**: Self-referencing tags on every page to prevent duplicate content.

## 2. Core Web Vitals (Performance)
Optimization for the < 500ms paint time.

### Partytown (Web Workers)
*   **Strategy**: All third-party scripts (Analytics, Pixels, Chat Widgets) run off the main thread.
*   **Benefit**: "Total Blocking Time" (TBT) reduced to near zero.

### Critical Rendering Path
*   **CSS**: Critical styles inlined.
*   **Fonts**: `Inter` and `JetBrains Mono` preloaded with `font-display: swap`.
*   **Images**:
    *   Formats: AVIF > WebP > JPG.
    *   Attributes: `width` and `height` mandatory (CLS prevention).
    *   Loading: `loading="lazy"` for below-fold.

## 3. SEO On-Page (Schema & Microdata)
Speaking Google's native language (JSON-LD).

### Global Schema (`Layout.astro`)
*   **Organization**: Defines Logo, Name, and Social Links.
*   **WebSite**: Defines Search Action.
*   **SoftwareApplication**: Defines "GetNexo" as a product (OperatingSystem: Linux/Web, Price: 0.00).

### Content Schema
*   **Article**: For Blog posts (Headline, Author, Date).
*   **BreadcrumbList**: Navigation hierarchy.
*   **FAQPage**: For `/funcionalidades` and `/melhorias`.

### Meta Tags (Psychological CTR)
*   **Title**: `GetNexo — A Máquina de Vendas Autônoma` (Keyword + Promise).
*   **Description**: "Transforme seu WhatsApp em um canal de lucro 24/7. Sem mensalidade. Dados locais." (Pain + Solution).
*   **Open Graph**: "Shareable" cards for WhatsApp/LinkedIn.

## 4. Autonomous Content Machine
*   **Kira**: Keywords Research (Low Difficulty / High Volume).
*   **Ara**: Drafts 1500+ word articles with internal linking (`/oferta`).

## 5. Monitoring
*   **Tools**:
    *   Google Search Console (Indexing).
    *   Lighthouse CI (Performance Budget).
    *   SerpApi (Rank Tracking - Future).

---
*Maintained by Android Lele & Antigravity Agent*
