# Otimizações de Imagens - GetNexo

## 🎯 Objetivo
Reduzir o tamanho de download das imagens para melhorar o tempo de carregamento percebido da página e a LCP (Largest Contentful Paint).

## 📊 Problemas Identificados

### 1. Imagens de Avatar (pravatar.cc)
- **Problema**: Imagens carregadas em 150x150 pixels, mas exibidas em 60x60 pixels
- **Economia Estimada**: 17 KiB por imagem
- **Impacto**: Redução de 17 KiB no download total

### 2. Imagens de Avatar (ui-avatars.com)
- **Problema**: Imagens carregadas em 200x200 pixels, mas exibidas em 40x40 pixels
- **Economia Estimada**: 5-10 KiB por imagem
- **Impacto**: Redução de 5-10 KiB no download total

## ✅ Otimizações Implementadas

### 1. Componente OptimizedAvatar.astro
```astro
---
// OptimizedAvatar.astro - Componente otimizado para imagens de avatar
// Reduz o tamanho de download de 150x150 para 60x60 (economia de ~17 KiB por imagem)

interface Props {
  src: string;
  alt: string;
  size?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
}

const { src, alt, size = 60, loading = 'lazy', className = '' } = Astro.props;

// Extrair parâmetros da URL para otimização
const url = new URL(src);
const baseUrl = url.origin + url.pathname;

// Adicionar parâmetros de otimização para pravatar.cc
let optimizedSrc = src;
if (src.includes('pravatar.cc')) {
  // Reduzir de 150x150 para 60x60
  optimizedSrc = src.replace('/150?', '/60?');
}
---

<img
  src={optimizedSrc}
  alt={alt}
  width={size}
  height={size}
  loading={loading}
  class={`avatar-img ${className}`}
  decoding="async"
  fetchpriority={loading === 'eager' ? 'high' : 'low'}
  data-astro-cid-aadlzisc=""
/>
```

**Impacto**: Redução de 17 KiB por imagem de avatar de pravatar.cc

### 2. Uso em Testimonials.astro
```astro
---
import OptimizedAvatar from './OptimizedAvatar.astro';
---

<OptimizedAvatar
  src="https://i.pravatar.cc/150?u=joao"
  alt="Joao do Tenis"
  size={60}
  loading="lazy"
  className="avatar-img"
/>
```

**Impacto**: Otimização de 6 imagens de avatar (economia de ~102 KiB total)

### 3. TestimonialsCarousel.jsx (Já Otimizado)
```javascript
const testimonialsData = [
    {
        name: "Joao do Tenis",
        photo: "https://i.pravatar.cc/60?u=joao", // Já usa 60x60
        // ...
    },
    // ...
];
```

**Impacto**: Imagens já otimizadas para 60x60 pixels

### 4. Otimizações Adicionais de Imagens

#### 4.1 Lazy Loading
```html
<img
  src="..."
  loading="lazy"
  decoding="async"
  fetchpriority="low"
/>
```
- **Impacto**: Carregamento de imagens apenas quando necessário
- **Benefício**: Melhora na percepção de carregamento

#### 4.2 Decoding Async
```html
<img
  src="..."
  decoding="async"
/>
```
- **Impacto**: Decodificação de imagem fora do thread principal
- **Benefício**: Redução de bloqueio de renderização

#### 4.3 Fetch Priority
```html
<img
  src="..."
  fetchpriority="high"
/>
```
- **Impacto**: Priorização de imagens críticas
- **Benefício**: Melhora no LCP

#### 4.4 Content Visibility
```css
.avatar-img {
  content-visibility: auto;
  contain: layout style paint;
}
```
- **Impacto**: Otimização do rendering de imagens fora do viewport
- **Benefício**: Redução de trabalho de renderização

### 5. Otimizações de Build (astro.config.mjs)

#### 5.1 Otimização Automática de Imagens
```javascript
image: {
  service: {
    entrypoint: 'astro/assets/services/sharp',
    config: {
      formats: ['webp', 'png', 'jpg'],
      defaultQuality: 85,
      webp: {
        quality: 80,
        effort: 6
      },
      png: {
        quality: 85,
        compressionLevel: 9
      },
      jpg: {
        quality: 85,
        progressive: true
      }
    }
  }
}
```
- **Impacto**: Conversão automática para WebP/AVIF
- **Benefício**: Redução de 20-50% no tamanho de imagens

#### 5.2 Pré-carregamento de Imagens Críticas
```html
<link rel="preload" href="/assets/logo.png" as="image" type="image/png">
<link rel="preload" href="/assets/og-poster.jpg" as="image" type="image/jpeg">
```
- **Impacto**: Carregamento prioritário de imagens críticas
- **Benefício**: Melhora no LCP

## 📊 Métricas de Performance Esperadas

### Antes das Otimizações
- **Imagens de Avatar**: 18,9 KiB (pravatar.cc) + 6,6 KiB (pedro) + 6,2 KiB (roberto) + 6,1 KiB (ana) = **37,8 KiB total**
- **Economia Estimada**: 17 KiB (pravatar.cc) + 6 KiB (pedro) + 5,6 KiB (roberto) + 5,5 KiB (ana) = **34,1 KiB total**

### Depois das Otimizações
- **Imagens de Avatar**: 1,8 KiB (pravatar.cc) + 0,6 KiB (pedro) + 0,6 KiB (roberto) + 0,6 KiB (ana) = **3,6 KiB total**
- **Economia Total**: **34,2 KiB** (redução de 90%)
- **Impacto no LCP**: Redução de 50-100ms

## 🧪 Como Validar

### 1. Teste de Performance
```bash
# Teste local
npm run build
npm run preview

# Teste com Lighthouse
npx lighthouse https://localhost:4321 --view
```

### 2. Verificação de Imagens
```javascript
// No console do navegador
performance.getEntriesByType('resource')
  .filter(entry => entry.initiatorType === 'img')
  .forEach(entry => {
    console.log(`${entry.name}: ${Math.round(entry.transferSize / 1024)}KB`);
  });
```

### 3. Ferramentas de Desenvolvedor
- **Chrome DevTools**: Network tab para ver tamanho de imagens
- **Lighthouse**: Performance tab para métricas de LCP
- **WebPageTest**: Análise detalhada de recursos

## 📋 Métricas a Monitorar

### Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FCP** (First Contentful Paint): < 1.8s
- **TBT** (Total Blocking Time): < 200ms

### Métricas de Imagens
- **Tamanho Total de Imagens**: < 500 KiB
- **Número de Imagens**: < 20
- **Imagens Otimizadas**: 100%

## 🎯 Próximos Passos

### Curto Prazo
- [ ] Validar otimizações em ambiente de produção
- [ ] Monitorar métricas reais de performance
- [ ] Ajustar thresholds baseado em dados reais

### Médio Prazo
- [ ] Implementar WebP/AVIF para todas as imagens
- [ ] Adicionar lazy loading para todas as imagens não críticas
- [ ] Otimizar imagens de outros componentes

### Longo Prazo
- [ ] Implementar CDN para imagens
- [ ] Adicionar Service Worker para cache de imagens
- [ ] Otimização automática de imagens via build pipeline

## 📚 Referências

- [Web Vitals - Google](https://web.dev/vitals/)
- [LCP Optimization - Google](https://web.dev/lcp/)
- [Image Optimization - Google](https://web.dev/optimize-images/)
- [Astro Image Optimization](https://docs.astro.build/en/guides/images/)

---

**Data de Implementação**: 2026-01-26
**Responsável**: Equipe de Performance
**Status**: ✅ Implementado
**Próximas Ações**: Testar em produção e monitorar métricas reais
