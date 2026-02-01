import { integrationData } from '../data/integrationData.js';
import { glossaryData } from '../data/glossaryData.js';

export const GET = async () => {
  const baseUrl = 'https://getnexo.com.br';

  // Core and Extended Pages
  // Removing /pt/ redirects to focus on canonical URLs
  const staticPages = [
    { url: `${baseUrl}/`, changefreq: 'daily', priority: 1.0 },
    { url: `${baseUrl}/blog/`, changefreq: 'daily', priority: 0.9 },
    { url: `${baseUrl}/precos/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/como-funciona/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/recursos/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contato/`, changefreq: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacidade/`, changefreq: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/faq/`, changefreq: 'monthly', priority: 0.5 },

    // Features & Products
    { url: `${baseUrl}/integracoes/`, changefreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/sobre/`, changefreq: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/termos/`, changefreq: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/revenda/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/api/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sistema-tickets/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/gamificacao-vendas/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/programa-pontos/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/magic-replies/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/analise-sentimento/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/chat-ia-24h/`, changefreq: 'monthly', priority: 0.8 },

    // Hidden Gems / New Pages
    { url: `${baseUrl}/comparativo/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/assistente-vendas/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/demo-ia/`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/oferta/`, changefreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/changelog/`, changefreq: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/glossario/`, changefreq: 'weekly', priority: 0.6 },

    // Sales Segments (Static)
    { url: `${baseUrl}/segmentos/agencia-web/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/segmentos/clinicas/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/segmentos/consultoria/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/segmentos/delivery/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/segmentos/e-commerce/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/segmentos/educacao/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/segmentos/imobiliarias/`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/segmentos/outros/`, changefreq: 'monthly', priority: 0.6 },

    { url: `${baseUrl}/segmentos/outros/`, changefreq: 'monthly', priority: 0.6 },
  ];

  // Dynamic Integration Pages
  const integrationPages = integrationData.map(integration => ({
    url: `${baseUrl}/integracoes/${integration.slug}`,
    changefreq: 'monthly',
    priority: 0.7
  }));

  // Dynamic Glossary Pages
  const glossaryPages = glossaryData.map(item => ({
    url: `${baseUrl}/glossario/${item.slug}`,
    changefreq: 'yearly',
    priority: 0.5
  }));

  const allPages = [...staticPages, ...integrationPages, ...glossaryPages];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `<url>
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
