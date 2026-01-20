# 🎫 Sistema de Gestão de Tickets & Agentes (50 Pontos)

**Origem**: Lista de 50 funcionalidades de organização (Janeiro 2026).
**Objetivo**: Transformar o atendimento em uma "linha de produção" organizada.

## 1. Organização & Fluxo

-   **Pastas por Agente**: Caixa de entrada individual.
-   **Sub-tickets**: Dividir ticket complexo em tarefas menores (Login, Hardware).
-   **Vinculação**: Lista de pendências (esperando peça da China).
-   **Transferência**: Mover ticket inteiro com histórico para outro setor.
-   **Pause/Freeze**: Congelar ticket (cliente viajou), para o cronômetro SLA.
-   **Merge/Duplicar**: Unir tickets repetidos ou duplicar ticket para produtos diferentes.

## 2. Tags e Filtros Inteligentes

-   **Tags Automáticas**: "Cliente Recorrente", "VIP" (Coroa Dourada), "Bug Reportado".
-   **Prioridade Visual**: Atalho 'P' (Urgente - Vermelho), 'E' (Médio).
-   **Filtros Avançados**:
    -   "Abertos > 48h" (Pisca vermelho).
    -   "Agente Ausente" (Esconde da fila).
    -   "Nota Baixa" (NPS < 3).
    -   "Origem" (Só WhatsApp, Só App).

## 3. Ferramentas do Agente

-   **Histórico Global**: Busca por CPF/Nome puxa tudo (Whats, Email, Face) desde o início.
-   **Lembretes**: "Ligar pro fulano às 13h" (Alerta sonoro).
-   **Templates Rápidos**: Frases salvas ("Frete Grátis", "Devolução").
-   **Diagnóstico Rápido**: Campo "Travou no Boot", "Sem Wi-Fi" (Checklist).
-   **Anexos**: Drag & drop de fotos/PDFs, visualização em galeria.
-   **Assinatura Digital**: Técnico assina, gera PDF do ticket na hora.

## 4. Funcionalidades Técnicas

-   **Campo App Version**: Comparar versão do cliente (2.3) com atual (2.4).
-   **Número de Série**: Campo específico para RMA.
-   **Custo Interno**: Cronômetro de tempo gasto pelo técnico (cálculo de custo).
-   **Peças Usadas**: Baixa de estoque automática ao selecionar peça no ticket.
-   **Log de Alterações**: Audit trail de quem mudou status/texto.
-   **Feedback Interno**: Botão para reportar "Atendente foi grosso" (para RH).

## 5. Automação

-   **Duplicidade**: Sistema avisa "Já existe chamado igual aberto".
-   **Reabertura**: Motivo obrigatório ("Cliente voltou", "Não resolveu").
-   **Encerramento Automático**: Motivo ("Resolvido", "Sem resposta").
-   **Modo Treinamento (Sombra)**: Gerente vê tela do agente, grava e sugere (IA).
