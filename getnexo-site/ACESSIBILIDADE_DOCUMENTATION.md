# Acessibilidade - Problemas e Soluções

## Problemas Encontrados

### 1. Botões sem Nome Acessível

**Problema**: Os botões de slider (dots) não têm labels, tornando-os inutilizáveis para leitores de tela.

**Elementos com falha**:
```html
<button class="dot active" data-index="0"></button>
<button class="dot" data-index="1"></button>
<button class="dot" data-index="2"></button>
<!-- ... -->
```

**Solução**: Adicionar `aria-label` ou texto visível

```html
<!-- Opção 1: aria-label -->
<button 
  class="dot active" 
  data-index="0"
  aria-label="Slide 1 de 6"
>
</button>

<!-- Opção 2: Texto visível -->
<button 
  class="dot active" 
  data-index="0"
>
  <span class="sr-only">Slide 1 de 6</span>
</button>

<!-- Opção 3: Ícone com label -->
<button 
  class="dot active" 
  data-index="0"
  aria-label="Ir para slide 1"
>
  <span aria-hidden="true">●</span>
</button>
```

**CSS para texto oculto (sr-only)**:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 2. Contraste Insuficiente

**Problema**: Textos com baixo contraste dificultam a leitura.

**Elementos com falha**:
- Texto "Digite aqui: 'Quero um tênis preto 42' ou 'Mostrar catálogo'"
- Texto "🔒 SSL 256-BIT 🛡️ GDPR READY ⚡ 99.9% UPTIME ✅ META OFFICIAL"

**Solução**: Aumentar contraste para WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)

```css
/* Texto de instrução */
.text-instruction {
  color: #1f2937; /* gray-800 */
  background-color: #f9fafb; /* gray-50 */
}

/* Badge de confiança */
.badge-text {
  color: #111827; /* gray-900 */
  background-color: #ffffff;
  font-weight: 600;
}

/* Alternativa: usar cores mais escuras */
.badge-text-dark {
  color: #000000;
  background-color: #f3f4f6;
}
```

**Verificação de contraste**:
- Texto normal: 4.5:1 mínimo
- Texto grande (18pt+ ou 14pt+ bold): 3:1 mínimo
- UI components: 3:1 mínimo

### 3. Títulos Fora de Ordem

**Problema**: h4 aparece antes de h2/h3, quebrando a estrutura semântica.

**Elemento com falha**:
```html
<h4 class="user-name">Joao do Tenis</h4>
```

**Solução**: Reestruturar a hierarquia de títulos

```html
<!-- Estrutura correta -->
<section class="testimonials">
  <h2>Depoimentos</h2> <!-- h2 principal -->
  
  <div class="testimonial-item">
    <h3>Joao do Tenis</h3> <!-- h3 para nome do usuário -->
    <p>Depoimento do cliente...</p>
  </div>
</section>
```

**Ou, se o nome for parte de um subtítulo**:
```html
<section class="testimonials">
  <h2>Depoimentos</h2>
  
  <div class="testimonial-item">
    <h3>
      <span class="user-name">Joao do Tenis</span>
      <span class="user-role">Cliente</span>
    </h3>
    <p>Depoimento do cliente...</p>
  </div>
</section>
```

## Checklist de Acessibilidade

### ✅ Botões e Controles
- [ ] Todos os botões têm `aria-label` ou texto visível
- [ ] Botões de slider têm labels descritivos (ex: "Slide 1 de 6")
- [ ] Botões de ação têm labels claros (ex: "Adicionar ao carrinho")
- [ ] Botões de fechar têm `aria-label="Fechar"`

### ✅ Contraste de Cores
- [ ] Texto normal tem contraste mínimo 4.5:1
- [ ] Texto grande tem contraste mínimo 3:1
- [ ] UI components têm contraste mínimo 3:1
- [ ] Links têm contraste suficiente e sublinhado

### ✅ Hierarquia de Títulos
- [ ] h1 → h2 → h3 → h4 (sem saltos)
- [ ] Cada página tem um único h1
- [ ] Títulos refletem a estrutura da página

### ✅ Navegação por Teclado
- [ ] Todos os elementos interativos são focáveis
- [ ] Ordem de tabulação lógica
- [ ] Indicador de foco visível
- [ ] Skip links para conteúdo principal

### ✅ Atributos ARIA
- [ ] `aria-label` para elementos sem texto visível
- [ ] `aria-labelledby` para referências a títulos
- [ ] `aria-describedby` para descrições adicionais
- [ ] `aria-expanded` para elementos expansíveis
- [ ] `aria-current` para página atual

### ✅ Imagens e Mídia
- [ ] Todas as imagens têm `alt` descritivo
- [ ] Imagens decorativas têm `alt=""`
- [ ] Vídeos têm legendas e transcrições

### ✅ Formulários
- [ ] Todos os inputs têm `label` associado
- [ ] Mensagens de erro são anunciadas por leitores de tela
- [ ] Validação acessível

## Exemplo Completo: Slider de Depoimentos

```html
<section class="testimonials-root" aria-labelledby="testimonials-title">
  <h2 id="testimonials-title">Depoimentos de Clientes</h2>
  
  <div class="content-wrapper">
    <!-- Slider com slides -->
    <div class="slider" role="region" aria-label="Carrossel de depoimentos">
      <div class="slide active" role="group" aria-roledescription="slide" aria-label="Slide 1 de 6">
        <div class="testimonial-content">
          <blockquote>
            "Excelente produto, superou minhas expectativas!"
          </blockquote>
          <cite>
            <h3>João Silva</h3>
            <p>Cliente desde 2023</p>
          </cite>
        </div>
      </div>
      <!-- ... outros slides -->
    </div>
    
    <!-- Controles de navegação -->
    <div class="slider-controls">
      <button 
        class="prev-btn"
        aria-label="Slide anterior"
      >
        <span aria-hidden="true">←</span>
      </button>
      
      <button 
        class="next-btn"
        aria-label="Próximo slide"
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
    
    <!-- Indicadores de posição (dots) -->
    <div class="slider-dots" role="tablist" aria-label="Selecione um slide">
      <button 
        class="dot active"
        role="tab"
        aria-selected="true"
        aria-controls="slide-1"
        aria-label="Slide 1: João Silva"
      >
        <span class="sr-only">Slide 1: João Silva</span>
      </button>
      <button 
        class="dot"
        role="tab"
        aria-selected="false"
        aria-controls="slide-2"
        aria-label="Slide 2: Maria Santos"
      >
        <span class="sr-only">Slide 2: Maria Santos</span>
      </button>
      <!-- ... -->
    </div>
  </div>
</section>
```

## Ferramentas de Teste

### 1. Lighthouse (Chrome DevTools)
- Abra DevTools → Lighthouse
- Execute teste de acessibilidade
- Verifique pontuação (ideal: 100)

### 2. axe DevTools
- Extensão para Chrome/Firefox
- Detecta problemas automaticamente
- Fornece sugestões de correção

### 3. WAVE (Web Accessibility Evaluation Tool)
- Extensão ou site online
- Visualiza problemas de acessibilidade
- Gera relatórios detalhados

### 4. Teste Manual
- Navegue apenas com teclado (Tab, Shift+Tab, Enter, Espaço)
- Use leitor de tela (NVDA, JAWS, VoiceOver)
- Verifique contraste com ferramentas online

## Referências

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Prioridade de Correção**:
1. ⚠️ Crítico: Botões sem nome (afeta navegação)
2. ⚠️ Alto: Contraste insuficiente (afeta legibilidade)
3. ⚠️ Médio: Hierarquia de títulos (afeta estrutura)
