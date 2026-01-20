# 🎨 White-Label & Personalização SaaS

**Origem**: Estratégia de Revenda e "Cara do Cliente" (Janeiro 2026).
**Objetivo**: Permitir que cada cliente sinta que o sistema é exclusivo dele, escondendo a marca "GetNexo".

## 1. Customização Visual (Painel do Cliente)

O cliente acessa um painel de configurações visuais (No-Code):

-   **Identidade**:
    -   **Logo**: Upload de SVG/PNG (substitui no chat, admin e e-mails).
    -   **Paleta**: Seletor de cor primária (muda botões, links, ícones).
    -   **Nome do Bot**: "Oi, sou o [Botão da Loja X]".
    -   **Fundo**: Imagem estática, cor sólida ou vídeo loop leve.
    -   **CSS Custom**: Campo para colar CSS avançado (bordas, fontes, sombras).

-   **Comportamento**:
    -   **Canais**: Liga/Desliga WhatsApp, Insta, Email.
    -   **Terminologia**: Troca "Ticket" por "Chamado", "Pedido", "Conversa".
    -   **Favicon & Título**: "Ajuda [Marca]" na aba do navegador.
    -   **Marca D'água**: Switch para remover "Powered by Ultimate System" (Plano Pro).

-   **Widget de Chat**:
    -   Posição (Dir/Esq), Tamanho, Animação de entrada (Pop/Slide).
    -   Som de notificação (Ding/Trrr/Jingle da marca).
    -   Ícone do lançador (Balão/Foto atendente/Logo).

## 2. Hierarquia Multi-Tenant (RBAC)

Um único sistema, múltiplos níveis de visão baseados no login.

| Nível | Visão & Permissões |
|-------|--------------------|
| **1. Admin Master (Dono)** | Vê TUDO. Custos de infra, IAs globais, faturamento SaaS. |
| **2. Revendedor** | Vê seus 50 clientes, comissão, cria novas licenças. Não vê infra global. |
| **3. Admin Cliente** | Vê sua loja, métricas de vendas, configura seu bot e aparência. |
| **4. Gerente** | Vê filas, metas do time, relatórios. Não mexe em config/fatura. |
| **5. Atendente** | Vê apenas tickets atribuídos + fila geral. Sem acesso a dados sensíveis. |
| **6. Financeiro** | Vê apenas vendas fechadas no chat e cupons. |
| **7. Dev/Técnico** | Vê logs de erro, status docker, prompts crus (debug). |
| **8. Cliente Final** | Portal de Suporte (ver `CUSTOMER_PORTAL_HUB.md`). |

---

## 3. Detalhes de Implementação

-   **Templates**: O sistema carrega o CSS baseado no `client_id` da sessão.
-   **Domínio Próprio**: Cliente configura CNAME `chat.sualoja.com.br` -> Aponta pro nosso Traefik -> Traefik roteia com certificado SSL automático via Let's Encrypt.
-   **Email no-reply**: Configura SMTP próprio para sair como `suporte@sualoja.com.br`.
