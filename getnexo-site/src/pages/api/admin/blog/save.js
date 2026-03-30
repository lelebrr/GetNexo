import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { title, content, lang, slug, category, date, status } = body;

    // Validar campos obrigatórios
    if (!title || !content || !lang || !slug) {
      return new Response(
        JSON.stringify({ error: 'Título, conteúdo, idioma e slug são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validSlugPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validSlugPattern.test(slug)) {
      return new Response(
        JSON.stringify({ error: 'Slug inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validLangPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validLangPattern.test(lang)) {
      return new Response(
        JSON.stringify({ error: 'Idioma inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determinar o diretório baseado no idioma
    let dirPath;
    if (lang === 'pt') {
      dirPath = path.join(process.cwd(), 'src', 'pages', 'blog');
    } else {
      dirPath = path.join(process.cwd(), 'src', 'pages', lang, 'blog');
    }

    // Criar diretório se não existir
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const layoutPath = lang === 'pt' ? '../../layouts/Layout.astro' : '../../../layouts/Layout.astro';

    // Gerar conteúdo do arquivo .astro
    const fileContent = `---
import Layout from '${layoutPath}';

const title = "${title}";
const description = "${title} - ${category || 'Blog GetNexo'}";
const keywords = "${category || 'blog'}, getnexo, whatsapp, ia, automação";
const canonical = "https://getnexo.com.br/${lang === 'pt' ? '' : lang + '/'}blog/${slug}";
const datePublished = "${date}";
const articleSection = "${category || 'Geral'}";
---

<Layout title={title} description={description} keywords={keywords}>
  <article>
    <header>
      <h1>{title}</h1>
      <p class="subtitle">${category || 'Blog GetNexo'}</p>
      <time datetime="${date}">${new Date(date).toLocaleDateString('pt-BR')}</time>
    </header>
    
    <div class="content">
      ${content}
    </div>
  </article>

  <style>
    article {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      margin-bottom: 3rem;
      text-align: center;
    }
    
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      color: #fff;
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: #00d4ff;
      margin-bottom: 0.5rem;
    }
    
    time {
      font-size: 0.9rem;
      color: #888;
    }
    
    .content {
      line-height: 1.8;
      color: #ccc;
      font-size: 1.1rem;
    }
    
    .content h2 {
      font-size: 1.8rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #fff;
    }
    
    .content p {
      margin-bottom: 1.5rem;
    }
    
    .content ul, .content ol {
      margin-bottom: 1.5rem;
      padding-left: 2rem;
    }
    
    .content li {
      margin-bottom: 0.5rem;
    }
    
    .content code {
      background: rgba(0, 212, 255, 0.1);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
    }
    
    .content pre {
      background: #080808;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 1.5rem;
      border: 1px solid #1a1a1a;
    }
    
    .content pre code {
      background: none;
      padding: 0;
    }
    
    @media (max-width: 768px) {
      article {
        padding: 1rem;
      }
      
      h1 {
        font-size: 2rem;
      }
    }
  </style>

  <script nonce={Astro.locals.nonce} type="application/ld+json" is:inline set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": datePublished,
    "dateModified": datePublished,
    "author": {
      "@type": "Organization",
      "name": "GetNexo"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GetNexo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://getnexo.com.br/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical
    },
    "articleSection": articleSection
  })}></script>
</Layout>
`;

    // Salvar o arquivo
    const filePath = path.join(dirPath, `${slug}.astro`);
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Post salvo com sucesso',
        filePath: filePath
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro ao salvar post:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno ao salvar post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
