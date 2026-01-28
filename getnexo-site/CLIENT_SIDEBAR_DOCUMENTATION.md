# ClientSidebar - Documentação

## Visão Geral

O componente `ClientSidebar.astro` é um menu dinâmico para o dashboard do cliente no JetNexus. Ele exibe itens de menu condicionalmente baseados nos módulos contratados pelo cliente, criando uma experiência personalizada e escalável.

## Arquivos Criados

1. **`getnexo-site/src/components/ClientSidebar.astro`** - Componente principal da sidebar
2. **`getnexo-site/src/layouts/ClientLayout.astro`** - Layout atualizado usando o componente
3. **`getnexo-site/src/pages/client/dashboard.astro`** - Página de exemplo do dashboard

## Como Usar

### 1. No Layout do Cliente

Importe e use o componente no seu layout:

```astro
---
import ClientSidebar from '../components/ClientSidebar.astro';

// Módulos contratados pelo cliente (em produção viria do DB)
const clienteModules = ['white-label', 'produtos-3d', 'fidelidade'];
---

<ClientLayout title="Dashboard">
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <ClientSidebar modules={clienteModules} />

    <!-- Main Content -->
    <main class="flex-1 lg:ml-0">
      <div class="p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</ClientLayout>
```

### 2. Passando Módulos via Props

O componente aceita uma prop `modules` que deve ser um array de strings:

```astro
<ClientSidebar modules={['white-label', 'ia-avancada', 'produtos-3d']} />
```

### 3. Módulos Disponíveis

Os módulos condicionais suportados são:

| Módulo | Nome no Menu | Ícone | Link |
|--------|--------------|-------|------|
| `white-label` | Personalização | 🎨 | `/client/white-label` |
| `ia-avancada` | IA Personalizada | 🤖 | `/client/ai` |
| `produtos-3d` | Produtos 3D | 🧊 | `/client/3d-products` |
| `relatorios-roi` | ROI e Analytics | 📊 | `/client/analytics` |
| `fidelidade` | Programa de Fidelidade | ❤️ | `/client/loyalty` |

## Itens do Menu

### Itens Padrão (Sempre Visíveis)

1. **Dashboard** - `/client/dashboard` (🏠)
2. **Minhas Vendas** - `/client/sales` (🛒)
3. **Contatos/CRM** - `/client/contacts` (👥)
4. **Configurações** - `/client/settings` (⚙️)
5. **Sair** - `/api/logout` (🚪)

### Itens Condicionais (Baseados nos Módulos)

- **Personalização** (White Label) - Aparece se `white-label` estiver no array
- **IA Personalizada** (IA Avançada) - Aparece se `ia-avancada` estiver no array
- **Produtos 3D** - Aparece se `produtos-3d` estiver no array
- **ROI e Analytics** - Aparece se `relatorios-roi` estiver no array
- **Programa de Fidelidade** - Aparece se `fidelidade` estiver no array

## Funcionalidades

### 1. Menu Dinâmico
- Itens condicionais aparecem/desaparecem baseados nos módulos contratados
- Layout limpo e organizado
- Seção separada para "Módulos Adicionais"

### 2. Responsivo
- **Desktop**: Sidebar fixa à esquerda (280px)
- **Mobile**: Sidebar esconde e aparece por overlay
- Botão hambúrguer no topo para toggle

### 3. Estilo
- Fundo escuro (bg-gray-900)
- Texto branco
- Ícones cyan-400
- Hover: bg-cyan-900/30
- Active: bg-cyan-800/50
- Fonte: Inter ou Roboto (sans-serif)

### 4. Ícones SVG
- Ícones inline SVG (Lucide icons)
- Sem dependências externas
- Fácil de personalizar

## Exemplo de Integração com Banco de Dados

```astro
---
// getnexo-site/src/pages/client/dashboard.astro

import ClientLayout from '../../layouts/ClientLayout.astro';

// Em produção, buscar do banco de dados
const clienteId = Astro.locals.user?.id;
const clienteModules = await getClienteModules(clienteId);
---

<ClientLayout title="Dashboard">
  <ClientSidebar modules={clienteModules} />
  <!-- Conteúdo da página -->
</ClientLayout>
```

## Personalização

### Adicionar Novos Módulos

Edite `ClientSidebar.astro` e adicione ao array `conditionalItems`:

```javascript
const conditionalItems = [
  // ... itens existentes
  {
    name: 'WhatsApp Integration',
    icon: 'message-circle',
    link: '/client/whatsapp',
    module: 'whatsapp-integration'
  }
];
```

### Adicionar Novos Ícones

Adicione ao objeto `icons`:

```javascript
const icons = {
  // ... ícones existentes
  'message-circle': `<svg>...</svg>`,
};
```

### Estilos Customizados

Edite a tag `<style>` no final do componente:

```css
aside::-webkit-scrollbar-thumb {
  background: #0891b2; /* cyan-600 */
}
```

## Exemplo de Página do Cliente

Veja `getnexo-site/src/pages/client/dashboard.astro` para um exemplo completo de como usar o layout com métricas, cards e ações rápidas.

## Dicas

1. **Em produção**, buscar os módulos do banco de dados:
   ```javascript
   const clienteModules = await db.query(
     'SELECT module FROM cliente_modules WHERE cliente_id = ?',
     [clienteId]
   );
   ```

2. **Cache**: Use Astro.locals para armazenar os módulos:
   ```javascript
   Astro.locals.modules = clienteModules;
   ```

3. **Teste**: Use diferentes combinações de módulos para testar:
   ```javascript
   const clienteModules = ['white-label', 'produtos-3d']; // Apenas 2 módulos
   ```

## Suporte

Para dúvidas ou problemas, verifique:
- [`ClientSidebar.astro`](getnexo-site/src/components/ClientSidebar.astro)
- [`ClientLayout.astro`](getnexo-site/src/layouts/ClientLayout.astro)
- [`dashboard.astro`](getnexo-site/src/pages/client/dashboard.astro)

---

**Nota**: Este componente foi projetado para ser usado com Alpine.js (incluso via CDN no layout) e Astro. Certifique-se de que Alpine.js está carregado no seu layout.
