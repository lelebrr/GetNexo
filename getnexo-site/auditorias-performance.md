# Auditorias de Performance - getnexo.com.br

## 📊 Visão Geral das Métricas

| Métrica | Status | Prioridade |
|---------|--------|------------|
| **FCP** (First Contentful Paint) | Fora da pontuação | Alta |
| **LCP** (Largest Contentful Paint) | Fora da pontuação | Alta |
| **TBT** (Total Blocking Time) | Fora da pontuação | Alta |
| **CLS** (Cumulative Layout Shift) | Fora da pontuação | Alta |

---

## 🎯 Auditorias por Métrica

### 1. FCP (First Contentful Paint)

#### Solicitações Bloqueando a Renderização
**Economia estimada: 490 ms**

As solicitações estão bloqueando a renderização inicial da página, o que pode atrasar a LCP. Essas solicitações de rede podem ser deferidas ou colocadas inline para que fiquem fora do caminho crítico.

| URL | Tamanho | Duração |
|-----|---------|---------|
| getnexo.com.br Própria | 24,1 KiB | 1.650 ms |
| /_astro/index.BrD6zRbA.css | 16,3 KiB | 660 ms |
| /_astro/index.CP6dMr-o.css | 5,9 KiB | 500 ms |
| /_astro/features.Ds3VOG_-.css | 1,8 KiB | 500 ms |

#### Reduza o CSS não usado
**Economia estimada: 12 KiB**

Para diminuir o consumo de bytes da atividade da rede, reduza as regras não usadas nas folhas de estilo e adie o CSS não usado para conteúdo acima da dobra.

| URL | Tamanho | Economia estimada |
|-----|---------|-------------------|
| getnexo.com.br Própria | 15,6 KiB | 11,9 KiB |
| /_astro/index.BrD6zRbA.css | 15,6 KiB | 11,9 KiB |

---

### 2. LCP (Largest Contentful Paint)

#### Melhorar a entrega de imagens
**Economia estimada: 708 KiB**

Reduzir o tempo de download das imagens pode melhorar o tempo de carregamento percebido da página e a LCP.

| URL | Tamanho do recurso | Economia estimada |
|-----|-------------------|-------------------|
| getnexo.com.br Própria | 776,8 KiB | 708,3 KiB |
| Magic Replies AI | 776,8 KiB | 708,3 KiB |

**Problemas identificados:**
- Usar um formato de imagem moderno (WebP, AVIF) ou aumentar a compactação
- O arquivo é maior do que precisa ser (1024x1024) para as dimensões exibidas (649x649)
- Use imagens responsivas para reduzir o tamanho do download

#### Árvore de dependência da rede
**Latência máxima do caminho crítico: 2.281 ms**

Evite encadear solicitações críticas reduzindo o tamanho das cadeias, o tamanho do download de recursos ou adiando o download de recursos desnecessários.

| Recurso | Duração | Tamanho |
|---------|---------|---------|
| /data/feriados.json | 2.281 ms | 9,19 KiB |
| /assets/shepherd-Cn412SuC.js | 1.849 ms | 17,85 KiB |
| …js/mega-chat-sim.js | 1.588 ms | 2,59 KiB |
| …js/modals-demo.js | 1.549 ms | 2,49 KiB |
| …js/hero-animations.js | 1.398 ms | 1,62 KiB |
| …js/click-fireworks.js | 1.396 ms | 1,62 KiB |
| …wght/normal.woff2 | 1.355 ms | 47,72 KiB |
| /_astro/TourGuided.astro_ast….Bu-22buL.js | 1.182 ms | 3,03 KiB |
| /_astro/index.BrD6zRbA.css | 1.182 ms | 16,34 KiB |
| /_astro/index.CP6dMr-o.css | 1.178 ms | 5,90 KiB |
| /_astro/Accessibi….astro_ast….CkkWevRS.js | 1.169 ms | 2,68 KiB |
| /_astro/features.Ds3VOG_-.css | 1.138 ms | 1,85 KiB |
| /_astro/TourGuided.astro_ast….Bj-Iu3dT.js | 1.145 ms | 0,77 KiB |
| https://getnexo.com.br | 1.111 ms | 31,24 KiB |

#### Detalhamento da LCP
**Subparte: Atraso na renderização do elemento - 2.060 ms**

Cada subparte tem estratégias de melhoria específicas. O ideal é que a maior parte do tempo de LCP seja gasto no carregamento dos recursos, não em atrasos.

| Subparte | Duração |
|----------|---------|
| Time to First Byte | 0 ms |
| Atraso na renderização do elemento | 2.060 ms |

---

### 3. TBT (Total Blocking Time)

#### Evitar tarefas longas da linha de execução principal
**2 tarefas longas encontradas**

Lista as tarefas mais longas na linha de execução principal. Útil para identificar os piores contribuidores para a latência de entrada.

| URL | Horário de início | Duração |
|-----|-------------------|---------|
| getnexo.com.br Própria | 152 ms | - |
| https://getnexo.com.br | 941 ms | 97 ms |
| https://getnexo.com.br | 1.060 ms | 55 ms |

---

### 4. CLS (Cumulative Layout Shift)

#### Causas da troca de layout
**Pontuação total: 0,004**

As mudanças de layout ocorrem quando os elementos se movem sem qualquer interação do usuário. Investigue as causas de mudanças no layout, como elementos adicionados, removidos ou com fontes alteradas durante o carregamento da página.

| Elemento | Pontuação da troca de layout |
|----------|------------------------------|
| Total | 0,004 |
| `<span class="cursor">` | 0,000 |
| `<span class="cursor">` | 0,000 |
| `<span class="cursor">` | 0,000 |
| `<span class="cursor">` | 0,000 |
| `<span class="cursor">` | 0,000 |

#### Elementos de imagem sem width e height explícitas
Defina uma largura e altura explícitas em elementos de imagem para reduzir mudanças de layout e melhorar a CLS.

| Elemento | URL |
|----------|-----|
| Magic Replies AI | getnexo.com.br Própria |
| Loyalty System | getnexo.com.br Própria |
| Advanced Analytics | getnexo.com.br Própria |
| Integrations Map | getnexo.com.br Própria |

#### Evitar animações não compostas
**4 elementos animados encontrados**

Animações que não são compostas podem ficar instáveis e aumentar a CLS.

| Elemento | Nome | Propriedade CSS incompatível |
|----------|------|------------------------------|
| IA INTELIGENTE | textGradientMove | background-position-x |
| TESTE AQUI.. SE SURPREENDA | pulseSurprise | box-shadow |
| body > main#main-content > div#roi-calculator > ::before | shimmer | background-position-x |
| ! | gentlePulse | box-shadow |

---

## 📈 Insights Gerais (Múltiplas Métricas)

### Origens pré-conectadas
**Status: Nenhuma origem foi pré-conectada**

As dicas de pré-conexão ajudam o navegador a estabelecer uma conexão mais cedo durante o carregamento da página, poupando tempo quando a primeira solicitação para essa origem é feita.

**Candidatos à pré-conexão:**
- Nenhuma outra origem é uma boa candidata para a pré-conexão
- Adicione dicas de pré-conexão às suas origens mais importantes, mas tente não usar mais que 4

### Ciclos de vida eficientes de cache
**Economia estimada: 3 KiB**

Um cache com ciclo de vida longo pode acelerar visitas repetidas à sua página.

| Solicitação | Cache TTL | Tamanho da transferência |
|-------------|-----------|--------------------------|
| Cloudflare utility | 1 dia | 7 KiB |
| /beacon.min.js/vcd15cbe…(static.cloudflareinsights.com) | 1 dia | 7 KiB |

### Otimizar o tamanho do DOM
**Total de elementos: 781**

Um DOM grande pode aumentar a duração dos cálculos de estilo e reflows de layout, o que afeta a capacidade de resposta da página. Um DOM grande também aumenta o uso da memória.

| Estatística | Valor |
|-------------|-------|
| Total de elementos | 781 |
| Profundidade do DOM | 13 |
| Maioria das crianças | body (26) |

### Terceiros
Código de terceiros pode afetar significativamente a performance de carregamento. Reduza e adie o carregamento de código de terceiros para priorizar o conteúdo da sua página.

| Terceiro | Tamanho da transferência | Tempo na linha de execução principal |
|----------|--------------------------|--------------------------------------|
| Cloudflare utility | 7 KiB | 10 ms |
| /beacon.min.js/vcd15cbe…(static.cloudflareinsights.com) | 7 KiB | 10 ms |

### Evitar payloads de rede muito grandes
**Tamanho total: 3.259 KiB**

Grandes payloads de rede geram custos para o usuário e estão diretamente relacionados a tempos de carregamento maiores.

| URL | Tamanho da transferência |
|-----|--------------------------|
| getnexo.com.br Própria | 3.221,7 KiB |
| …features/integrations.png | 792,2 KiB |
| …features/magic-replies.png | 777,5 KiB |
| …features/analytics.png | 777,4 KiB |
| …features/loyalty.png | 752,3 KiB |
| …wght/normal.woff2 | 47,7 KiB |
| https://getnexo.com.br | 31,2 KiB |
| /assets/shepherd-Cn412SuC.js | 17,8 KiB |
| /_astro/index.BrD6zRbA.css | 16,3 KiB |
| /data/feriados.json | 9,2 KiB |
| Cloudflare utility | 7,1 KiB |
| /beacon.min.js/vcd15cbe…(static.cloudflareinsights.com) | 7,1 KiB |

---

## 🎯 Prioridades de Ação

### Prioridade 1 (Alta Impacto)
1. **Otimizar imagens** - Converter para WebP/AVIF e usar imagens responsivas
2. **Deferir solicitações CSS** - Mover CSS não crítico para lazy loading
3. **Reduzir tamanho do DOM** - Remover elementos desnecessários
4. **Otimizar árvore de dependência** - Reduzir cadeias de solicitações críticas

### Prioridade 2 (Médio Impacto)
1. **Adicionar dimensões explícitas** às imagens
2. **Implementar pré-conexão** para origens críticas
3. **Otimizar cache** com TTL mais longo
4. **Revisar animações** para composição adequada

### Prioridade 3 (Baixo Impacto)
1. **Reduzir CSS não usado** - Remover regras não utilizadas
2. **Otimizar terceiros** - Adiar scripts não críticos
3. **Revisar tarefas longas** na linha de execução principal

---

## 📚 Referências

- **LCP**: Largest Contentful Paint - Ideal: < 2.5s
- **FCP**: First Contentful Paint - Ideal: < 1.8s
- **TBT**: Total Blocking Time - Ideal: < 200ms
- **CLS**: Cumulative Layout Shift - Ideal: < 0.1

**Ferramentas recomendadas:**
- Chrome DevTools Performance Panel
- Lighthouse (Chrome DevTools)
- WebPageTest
- GTmetrix

---

*Documento gerado em: 2026-01-23*
*Site analisado: getnexo.com.br*
