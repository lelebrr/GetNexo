# 💰 Modelo de Precificação & Auto-Scaling

**Origem**: Estratégia de negócios e infraestrutura elástica (Janeiro 2026).
**Conceito**: Cliente entra barato, paga apenas pelo que usa (excedente), sem travas, com infraestrutura que escala sozinha.

## 1. Tabela de Preços (Proposta)

### 1.1 Plano Base (Entry Level)
-   **Valor Fixo**: R$ 30,00 / mês
-   **Incluso**:
    -   RAM Garantida: 512 MB
    -   Tickets: Até 2.000 / mês
    -   Canais: 1 (ex: Site ou WhatsApp)

### 1.2 Excedentes (Pay-as-you-go)
Cobrado apenas no mês que ocorrer o uso extra. Não retroativo.
-   **RAM Adicional**: R$ 5,00 por cada 100 MB extras.
-   **Tickets Extras**: R$ 10,00 por cada 1.000 tickets adicionais.
-   **Canal Extra**: R$ 15,00 por canal adicional.

---

## 2. Auto-Scaling de Infraestrutura (Script)

O sistema ajusta os recursos do container automaticamente baseado na demanda, garantindo performance sem desperdício.

### 2.1 Lógica de Escalonamento (Vertical)
Script monitora a cada 5 minutos.
-   **Trigger Subida**: Se RAM > 80% por 10 minutos seguidos -> **Dobra limite**.
    -   Exemplo: 256MB -> 512MB.
    -   Comando: `docker update --memory=512m container_id` (Live update, sem restart).
-   **Trigger Descida**: Se RAM < 40% por 20 minutos seguidos -> **Reduz nível**.
-   **Hysteresis**: Mecanismo para evitar oscilação rápida (subir e descer freneticamente). Sobe rápido, desce devagar.

### 2.2 Notificação ao Cliente
-   "Seu uso aumentou. Para manter a performance, seu plano foi ajustado temporariamente para 1GB RAM (+ R$ 5,00 na próxima fatura)."
-   Opção de aprovar ou fixar limite (com risco de lentidão).

### 2.3 Estratégia de Containers
-   **Container por Cliente**: Isolamento total (Redis, Qdrant, Chatwoot próprios).
-   **Vantagem**: "Meu container, meu problema". Sem vazamento de dados entre clientes.
-   **Desafio**: Consumo de RAM.
-   **Solução Storage**: Volumes mapeados no S3 (começa vazio, cresce conforme uso, não ocupa disco local).

---

## 3. Escalonamento Horizontal (Cluster)
Se um único host (PC/Server) lotar:
-   Migration para Cluster (Kubernetes/Rancher ou Swarm simples).
-   Mover containers pesados para nós específicos na nuvem (Hetzner/DigitalOcean) apenas quando necessário.
