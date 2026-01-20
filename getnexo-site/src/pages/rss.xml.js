export async function GET(context) {
    const site = 'https://getnexo.com.br';
    const posts = [
        {
            title: 'Lançamento do GetNexo',
            slug: 'lancamento',
            date: '2026-01-17',
            description: 'A revolução do atendimento local começou. Veja o que mudou.'
        },
        {
            title: 'Como a IA vendeu R$ 8k em 24 horas',
            slug: 'ia-vendeu-8k',
            date: '2026-01-15',
            description: 'Caso real de um cliente que deixou a Ara rodar sozinha por um dia.'
        },
        {
            title: 'WhatsApp Automatizado: O Guia Definitivo',
            slug: 'whatsapp-automatizado-guia',
            date: '2026-01-10',
            description: 'Como escalar sem levar banimento do Facebook.'
        },
        {
            title: 'Dark Mode e Conversão: A Ciência',
            slug: 'dark-mode-conversao',
            date: '2026-01-05',
            description: 'Por que interfaces dark vendem 82% a mais.'
        }
    ];

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GetNexo Blog - Vendas com IA</title>
    <description>Estratégias de vendas automatizadas com inteligência artificial</description>
    <link>${site}</link>
    <language>pt-BR</language>
    <copyright>© 2026 GetNexo Systems</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>${site}/blog/${post.slug}</link>
      <description>${post.description}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${site}/blog/${post.slug}</guid>
    </item>
    `).join('')}
  </channel>
</rss>`;

    return new Response(rss.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600'
        }
    });
}
