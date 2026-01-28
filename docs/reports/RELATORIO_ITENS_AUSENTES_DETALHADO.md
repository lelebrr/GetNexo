# 🚨 Relatório Detalhado de Pendências Técnicas

Este documento detalha as discrepâncias críticas entre a documentação do projeto e o código implementado.

## 1. Backend: Rotas Inexistentes (Crítico)
O frontend (`AnalyticsDashboard.jsx`) faz requisições para `/api/support/analytics/dashboard`, e o `server.js` tenta importar `routes/support.js`, mas **o arquivo não existe**.

**Impacto**: O Dashboard Administrativo (gráficos, vendas, tickets) está **quebrado** (Erro 500/Crash no boot do backend ou 404).

**Ação Necessária**:
- [ ] Criar `chat-api/routes/support.js`
- [ ] Criar `chat-api/controllers/supportController.js`
- [ ] Implementar a lógica real (ou mockada) para retornar os JSONs esperados pelos gráficos.

## 2. Pagamentos: Mock Apenas
Embora tenhamos criado a estrutura (`paymentRoutes.js`), as chaves de API são dummies.
- **Mercado Pago**: `TEST-000...`
- **Stripe**: `sk_test_000...`
- **Impacto**: O sistema aceita a requisição mas falhará na autenticação com os provedores reais se não configurado no `.env`.

## 3. Workflows N8N (Implementados agora)
Os seguintes arquivos foram criados manualmente nesta etapa para cumprir a documentação:
- `workflows/abandonded_cart_recovery.json`
- `workflows/birthday_coupon_workflow.json`
- `workflows/reactivation_campaign.json`
- `workflows/instagram_faq_bot.json`

**Status**: Os arquivos JSON existem, mas precisam ser **importados** dentro do N8N (via UI ou API) para rodarem de verdade.

## 4. Infraestrutura vs Roadmap
O documento `ROADMAP.md` lista centenas de serviços AWS como "TODO".
- **Realidade**: O projeto roda em Docker Compose local.
- **Veredito**: Não há código Terraform/CDK. A migração para AWS é um projeto de meses, não uma "pendência simples".

## 5. Engines de IA "Fantasmas"
A documentação menciona "40+ Engines".
- **Realidade**: O código principal está em `bot/full-bot.js` e usa bibliotecas padrão (`puter.js`). Não há 40 arquivos de "engine" separados. Muitos podem ser conceitos teóricos ou abstrações simples dentro do código do bot, não módulos independentes robustos.

## 6. Frontend: Dados Reais vs Mock
- O componente `SalesChart.jsx` e outros esperam dados reais via API.
- Como a API de suporte (`/api/support`) não existe, o frontend ficará em loading infinito ou mostrará erro.

---
**Resumo da Prioridade Imediata**:
1.  **Consertar o Backend**: Criar `routes/support.js` para que o Dashboard funcione.
2.  **Configurar .env**: Adicionar chaves reais de pagamento e IA.
3.  **Importar Workflows**: Carregar os JSONs no N8N.
