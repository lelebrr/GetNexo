# Sistema de Blog Automático - Administração

## Visão Geral

O sistema de blog automático foi implementado para gerenciar todos os posts do blog de forma centralizada e automática na página de administração.

## Funcionalidades

### 1. Listagem Automática de Posts
- **Carregamento Automático**: Todos os posts são carregados automaticamente dos arquivos `.astro` do diretório `/blog`
- **Separação por Idiomas**: Posts são agrupados automaticamente por idioma (PT, EN, ES, FR)
- **Atualização em Tempo Real**: A lista é atualizada automaticamente quando novos posts são criados ou excluídos

### 2. Busca em Tempo Real
- Filtre posts por título ou categoria
- Resultados aparecem instantaneamente
- Seções vazias são ocultadas automaticamente durante a busca

### 3. Gerenciamento de Posts
- **Criar Novo Post**: Botão "Criar Novo Post" redireciona para o editor
- **Editar Post**: Clique no ícone ✏️ para editar um post existente
- **Excluir Post**: Clique no ícone 🗑️ para excluir um post (com confirmação)

### 4. Informações Exibidas
- Título do post
- Categoria
- Status (Publicado/Rascunho)
- Data de publicação
- Idioma com bandeira

## Como Usar

### Acessando a Página de Administração
1. Acesse: `http://localhost:4321/admin/blog`
2. A página carregará automaticamente todos os posts existentes

### Criando um Novo Post
1. Clique no botão **"Criar Novo Post"**
2. Preencha os campos:
   - **Título**: Título do post
   - **Conteúdo**: Conteúdo em formato Markdown
   - **Idioma**: Selecione o idioma (PT, EN, ES, FR)
   - **Slug**: URL amigável (gerado automaticamente a partir do título)
   - **Categoria**: Categoria do post
   - **Data**: Data de publicação
3. Clique em:
   - **"Salvar Rascunho"**: Salva como rascunho
   - **"Publicar Post"**: Publica o post imediatamente

### Editando um Post Existente
1. Na lista de posts, clique no ícone **✏️** ao lado do post
2. Os dados do post serão carregados automaticamente
3. Faça as alterações necessárias
4. Clique em **"Salvar Rascunho"** ou **"Publicar Post"**

### Excluindo um Post
1. Na lista de posts, clique no ícone **🗑️** ao lado do post
2. Confirme a exclusão no diálogo
3. O post será excluído e a lista será atualizada automaticamente

## Estrutura de Arquivos

### Localização dos Posts
- **Português (PT)**: `/src/pages/blog/`
- **Inglês (EN)**: `/src/pages/en/blog/`
- **Espanhol (ES)**: `/src/pages/es/blog/`
- **Francês (FR)**: `/src/pages/fr/blog/`

### APIs
- **Listagem**: `/src/pages/admin/blog.astro` (carrega automaticamente)
- **Salvar**: `/src/pages/api/admin/blog/save.js`
- **Excluir**: `/src/pages/api/admin/blog/delete.js`

## Exemplo de Post

Um post é criado como um arquivo `.astro` com a seguinte estrutura:

```astro
---
import Layout from '../../../layouts/Layout.astro';

const title = "Título do Post";
const description = "Descrição do post";
const keywords = "blog, getnexo, whatsapp";
const canonical = "https://getnexo.com.br/blog/slug-do-post";
const datePublished = "2026-01-25";
const articleSection = "Categoria";
---

<Layout title={title} description={description} keywords={keywords}>
  <article>
    <header>
      <h1>{title}</h1>
      <p class="subtitle">{articleSection}</p>
      <time datetime={datePublished}>25/01/2026</time>
    </header>
    
    <div class="content">
      <!-- Conteúdo do post em Markdown -->
    </div>
  </article>
</Layout>
```

## Recursos Automáticos

### 1. Geração de Slug
- O slug é gerado automaticamente a partir do título
- Formato: `titulo-do-post` (minúsculas, hífens)

### 2. Schema Markup
- Cada post gera automaticamente schema.org markup
- Inclui Article, Author, Publisher, etc.

### 3. SEO Automático
- Meta tags geradas automaticamente
- Canonical URL
- Keywords e descrição

### 4. Data de Publicação
- Data é formatada automaticamente para o idioma selecionado
- Suporte para datas no futuro (programação)

## Dicas e Boas Práticas

### Para Posts em Múltiplos Idiomas
1. Crie o post principal em PT-BR
2. Use o mesmo slug para todas as versões
3. Apenas mude o idioma e o conteúdo

### Para SEO
- Use títulos descritivos
- Inclua keywords relevantes na categoria
- Mantenha o conteúdo bem formatado

### Para Organização
- Use categorias consistentes
- Mantenha uma nomenclatura clara de slugs
- Atualize posts existentes em vez de criar duplicatas

## Troubleshooting

### Posts Não Aparecem na Lista
- Verifique se o arquivo está no diretório correto
- Confira se o arquivo tem extensão `.astro`
- Verifique se o arquivo não é `index.astro`

### Erro ao Salvar Post
- Verifique se todos os campos obrigatórios estão preenchidos
- Confira se o slug não contém caracteres especiais
- Verifique permissões de escrita no sistema de arquivos

### Busca Não Funcionando
- Verifique se o JavaScript está habilitado
- Tente recarregar a página (Ctrl+F5)

## Atualizações Futuras

O sistema está configurado para:
- ✅ Carregar posts automaticamente
- ✅ Separar por idiomas
- ✅ Atualizar em tempo real
- ✅ Suportar busca
- ✅ Gerenciar criação/edição/exclusão

## Suporte

Para problemas técnicos, verifique:
1. Console do navegador (F12)
2. Logs do servidor Astro
3. Permissões do sistema de arquivos

---

**Sistema implementado em**: 25/01/2026  
**Versão**: 1.0  
**Status**: ✅ Produção
