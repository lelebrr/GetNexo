# ClientSidebar Premium - Documentação Completa

## Visão Geral

O componente `ClientSidebar.astro` premium é um menu ultra completo para o dashboard do cliente no JetNexus. Focado em **conversão e upsell**, ele mostra valor imediato e incentiva contratação de módulos adicionais.

## Arquivos Criados/Modificados

1. **`getnexo-site/src/components/ClientSidebar.astro`** - Componente premium completo
2. **`getnexo-site/src/layouts/ClientLayout.astro`** - Layout atualizado
3. **`getnexo-site/src/pages/client/dashboard.astro`** - Página de exemplo do dashboard
4. **`getnexo-site/src/pages/client/stats.astro`** - Página de estatísticas com gráficos
5. **`getnexo-site/CLIENT_SIDEBAR_PREMIUM_DOCUMENTATION.md`** - Esta documentação

## Características Premium

### 🎨 Design
- **Gradiente**: `from-gray-950 to-black` com borda cyan-900/50
- **Fonte**: Inter/Roboto (sans-serif)
- **Texto**: Branco com destaques cyan-400
- **Botão Upgrade**: Verde neon com gradiente animado

### 📊 Estrutura
- **Topo**: Logo + Bem-vindo + Plano atual + Botão Upgrade
- **Seção Estatísticas**: Item principal com submenu expansível (4 subitens)
- **Menu Principal**: 8 itens padrão sempre visíveis
- **Novos Itens**: Relatórios, Ranking, Notificações
- **Seção Premium**: 8 módulos condicionais com badges
- **Footer**: Contador de módulos ativos + barra de progresso

### 📱 Responsivo
- **Desktop**: Sidebar fixa à esquerda (280px)
- **Mobile**: Overlay escuro (bg-black/70) com toggle
- **Botão Hambúrguer**: Visível em telas <1024px

## Como Usar

### 1. No Layout do Cliente

```astro
---
import ClientLayout from '../../layouts/ClientLayout.astro';

// Módulos contratados (em produção viria do DB)
const clienteModules = ['white-label', 'produtos-3d', 'fidelidade', 'meta-integration', 'pix-automatico'];
const clientePlano = 'Revenda Pro';
---

<ClientLayout title="Dashboard">
  <ClientSidebar modules={clienteModules} plano={clientePlano} />
  <!-- Conteúdo da página -->
</ClientLayout>
```

### 2. Props do Componente

| Prop | Tipo | Descrição | Exemplo |
|------|------|-----------|---------|
| `modules` | `string[]` | Array de módulos contratados | `['white-label', 'produtos-3d']` |
| `plano` | `string` | Nome do plano atual | `'Revenda Pro'` ou `'Básico'` |

## Itens do Menu

### Seção Estatísticas (Com Submenu Expansível)

| Item | Ícone | Link | Descrição |
|------|-------|------|-----------|
| Estatísticas | 📊 | `/client/stats` | Item principal com submenu |
| ↳ Visão Geral | 👁️ | `/client/stats/overview` | Visão geral das métricas |
| ↳ Gráfico de Vendas | 📈 | `/client/stats/sales-chart` | Gráfico de vendas |
| ↳ ROI Avançado | 📈 | `/client/stats/roi` | **Premium** - R$ 99/mês |
| ↳ Taxa de Conversão | % | `/client/stats/conversion` | Taxa de conversão |

### Itens Padrão (Sempre Visíveis)

| Item | Ícone | Link | Descrição |
|------|-------|------|-----------|
| Dashboard | 🏠 | `/client/dashboard` | Painel principal |
| Minhas Vendas | 🛒 | `/client/sales` | Vendas realizadas |
| Funil de Vendas | 📊 | `/client/funnel` | Funil de conversão |
| Contatos / CRM | 👥 | `/client/contacts` | Base de contatos |
| Produtos / Catálogo | 📦 | `/client/products` | Catálogo de produtos |
| Configurações | ⚙️ | `/client/settings` | Configurações gerais |
| Suporte 24h | 🆘 | `/client/support` | Suporte ao cliente |
| Sair | 🚪 | `/api/logout` | Logout da conta |

### Novos Itens Principais

| Item | Ícone | Link | Descrição |
|------|-------|------|-----------|
| Relatórios | 📄 | `/client/reports` | **Premium** - R$ 79/mês - Badge "Novo" |
| Ranking Revendas | 🏆 | `/client/ranking` | **Premium** - R$ 49/mês |
| Notificações | 🔔 | `/client/notifications` | Badge com contador (ex: 3) |

### Seção Premium (Condicionais)

| Item | Ícone | Link | Módulo | Preço | Descrição |
|------|-------|------|--------|-------|-----------|
| White Label | 🎨 | `/client/white-label` | `white-label` | R$ 97/mês | Personaliza logo, cores e nome |
| IA Avançada | 🤖 | `/client/ai` | `ia-avancada` | R$ 147/mês | Prompts customizados |
| Produtos 3D | 🧊 | `/client/3d-products` | `produtos-3d` | R$ 77/mês | Modelos 3D no WhatsApp |
| Relatórios ROI | 📊 | `/client/analytics` | `relatorios-roi` | R$ 127/mês | Gráficos ROI, Meta Ads + PIX |
| Programa Fidelidade | ❤️ | `/client/loyalty` | `fidelidade` | R$ 87/mês | Pontos, cupons e cashback |
| Integrações Meta | 📘 | `/client/meta` | `meta-integration` | R$ 197/mês | Facebook/Instagram |
| PIX Automático | 💰 | `/client/pix` | `pix-automatico` | R$ 67/mês | Comprovante instantâneo |
| Automação Avançada | ⚡ | `/client/automations` | `automacao-avancada` | R$ 177/mês | n8n custom, workflows |

## Estados Visuais

### Módulo Ativo (Contratado)
- **Fundo**: `bg-cyan-900/20`
- **Texto**: Branco
- **Badge**: Verde com "Desbloqueado" ✅
- **Link**: Clicável, leva para a funcionalidade

### Módulo Inativo (Não Contratado)
- **Fundo**: `bg-gray-800/50`
- **Texto**: Cinza (`text-gray-500`)
- **Badge**: Cyan com preço + seta
- **Ação**: Botão com modal teaser (implementar)

### Submenu Expansível
- **Fechado**: Ícone chevron-down direita
- **Aberto**: Ícone chevron-up direita
- **Transição**: Suave com Alpine.js

## Exemplo de Integração com Banco de Dados

```astro
---
// getnexo-site/src/pages/client/dashboard.astro

import ClientLayout from '../../layouts/ClientLayout.astro';

// Em produção, buscar do banco de dados
const clienteId = Astro.locals.user?.id;

// Exemplo com SQL
const result = await db.query(`
  SELECT m.module_name, p.plan_name 
  FROM cliente_modules cm
  JOIN modules m ON cm.module_id = m.id
  JOIN plans p ON cm.plan_id = p.id
  WHERE cm.cliente_id = ?
`, [clienteId]);

const clienteModules = result.map(r => r.module_name);
const clientePlano = result[0]?.plan_name || 'Básico';
---

<ClientLayout title="Dashboard">
  <ClientSidebar modules={clienteModules} plano={clientePlano} />
  <!-- Conteúdo da página -->
</ClientLayout>
```

## Página de Estatísticas

A página `getnexo-site/src/pages/client/stats.astro` inclui:

### Cards de Métricas
- **Vendas Hoje**: R$ 12.450 (verde)
- **Clientes Novos**: 47 (cyan)
- **Taxa de Retenção**: 68% (laranja)
- **PIX Recebido**: 92% (verde)

### Teaser Premium
- Card com gradiente roxo/índigo
- Oferta: "Desbloqueie Gráficos Avançados + Previsão de Vendas por R$ 99/mês"
- Botão "Desbloquear Agora"

### Gráficos (Teasers)
- Gráfico de Linha: Vendas da Semana
- Gráfico Donut: Fontes de Tráfego (WhatsApp 65%, Instagram 20%, Facebook 15%)
- Gráfico de Barras: Top Produtos Vendidos

### Insights Inteligentes
- Dica do Dia: "Use produtos 3D no WhatsApp e aumente conversão em 30%!"
- Oportunidade: "Seus clientes preferem PIX (92%). Ofereça mais opções."
- Ação Recomendada: "Crie campanha de fidelidade para reter clientes."

## Personalização

### Adicionar Novos Módulos

Edite `ClientSidebar.astro` e adicione ao array `premiumSections`:

```javascript
const premiumSections = [
  // ... itens existentes
  {
    name: 'Shopify Integration',
    icon: 'shopping-bag',
    link: '/client/shopify',
    module: 'shopify-integration',
    description: 'Sincronização completa com Shopify',
    price: 'R$ 247/mês'
  }
];
```

### Adicionar Novos Ícones

Adicione ao objeto `icons`:

```javascript
const icons = {
  // ... ícones existentes
  'shopping-bag': `<svg>...</svg>`,
};
```

### Estilos Customizados

Edite a tag `<style>` no final do componente:

```css
/* Gradiente animado no botão Upgrade */
.bg-gradient-to-r {
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

## Dicas de Vendas (Upsell)

### 1. Modal Teaser (Implementar)
Quando o cliente clica em um módulo não contratado, mostrar:
```javascript
// Exemplo de modal
showModal({
  title: 'Desbloqueie IA Personalizada',
  description: 'Aumente vendas em 40% com prompts inteligentes',
  price: 'R$ 147/mês',
  cta: 'Contratar Agora'
});
```

### 2. Badge de Popularidade
Adicione badges como "Mais Vendido" ou "Recomendado":
```javascript
{
  name: 'IA Avançada',
  badge: '🔥 Mais Vendido',
  // ...
}
```

### 3. Contador de Módulos
O footer mostra progresso:
- `5 / 8 módulos ativos`
- Barra de progresso visual cyan → verde

## Teste com Diferentes Planos

```javascript
// Plano Básico (poucos módulos)
const clienteModules = [];
const clientePlano = 'Básico';

// Plano Revenda Pro (muitos módulos)
const clienteModules = ['white-label', 'ia-avancada', 'produtos-3d', 'relatorios-roi', 'fidelidade', 'meta-integration', 'pix-automatico', 'automacao-avancada'];
const clientePlano = 'Revenda Pro';
```

## Fluxo de Upgrade

1. Cliente vê módulo bloqueado com preço
2. Clica no botão "Upgrade Plano" no topo
3. É redirecionado para `/client/upgrade`
4. Seleciona plano e módulos desejados
5. Sistema atualiza `clienteModules` no banco
6. Menu se atualiza automaticamente

## Suporte

Para dúvidas ou problemas, verifique:
- [`ClientSidebar.astro`](getnexo-site/src/components/ClientSidebar.astro)
- [`ClientLayout.astro`](getnexo-site/src/layouts/ClientLayout.astro)
- [`dashboard.astro`](getnexo-site/src/pages/client/dashboard.astro)
- [`stats.astro`](getnexo-site/src/pages/client/stats.astro)

---

**Nota**: Este componente foi projetado para ser usado com Alpine.js (incluso via CDN no layout) e Astro. Certifique-se de que Alpine.js está carregado no seu layout.

**Objetivo**: Fazer o cliente pensar: "Puta merda, isso vale cada centavo, quero o plano full agora!" 🚀
