# 🎨 UX/UI Design System & "App de Luxo"

**Origem**: Requisito de "Interface de Revista de Luxo" / "App de Banco" (Janeiro 2026).
**Objetivo**: Criar uma interface fluida, moderna e visualmente impactante.

## 1. Estética Geral (Glassmorphism & Clean)

-   **Background**: Glassmorphism (Borrado, 70% transparência, branco leitoso).
-   **Cores**: Duo-tone (Preto Carvão + Verde Menta) ou Paleta da Marca (via White-label).
-   **Fontes**: `Poppins` ou `Inter` (Nada de Roboto). Headings com peso dinâmico (Variable Fonts).
-   **Dark Mode**: Automático (detecta sistema), transição "fade" suave (não corte seco). #121212 background, #E0E0E0 texto.
-   **Ícones**: SVG Minimalista (estilo Feather/Phosphor), traço fino, sem preenchimento sólido.

## 2. Micro-interações e Animações

-   **Botões**: Efeito "Float" (sobe 2px ao passar mouse), "Ripple" (onda ao clicar).
-   **Loading**: Skeleton Screens (esqueletos cinzas) em vez de spinners. "Três pontinhos que pulam" ao digitar.
-   **Tipografia Animada**: Letras do cabeçalho deslizam da esquerda para o centro ao carregar.
-   **Scroll**: `scroll-behavior: smooth` com inércia (efeito iOS).
-   **Micro-feedback**: Coração "bate" ao curtir, Check vira "Check Duplo" ao enviar.
-   **Efeito Parallax**: Banner do topo move mais devagar que o resto ao rolar.

## 3. Elementos do Chat

-   **Bolhas**: Bordas arredondadas 14-20px, sombra interna suave (Neumorphism leve).
-   **Separador**: "Fade leve" em vez de linha sólida.
-   **Input**: Borda "Glow" (brilho) quando focado ("O atendente está escrevendo...").
-   **Anexos**: Drag & Drop na área inteira do chat.

## 4. Componentes de Interface

-   **Menu Sticky**: Some ao rolar para baixo, reaparece ao rolar para cima.
-   **Cards 3D**: Levantam 1mm com sombra ao passar o mouse (`box-shadow` dinâmico).
-   **Menu Hamburger**: Transforma em "X" animado (não apenas troca ícone).
-   **Avatar**: Redondo, foto com blur leve nas bordas, gradiente no anel de status (Online/Offline).
-   **Toggles**: Sol/Lua que giram ao trocar tema.
-   **Cursor Custom**: Setinha fina que vira "mãozinha com glow laranja" em links (Desktop).

## 5. Acessibilidade & Usabilidade

-   **High Contrast**: Modo opcional que mantém elegância.
-   **Espaçamento**: `line-height: 1.5` para "respirar". Grid 8x8 de fundo (sutil).
-   **Autocomplete**: Busca sugere "Frete", "Preço" ao digitar as primeiras letras.
-   **Notificações**: Slide-in do canto direito, somem em 3s.
