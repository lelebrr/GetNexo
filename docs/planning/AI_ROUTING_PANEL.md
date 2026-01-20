# 🤖 AI Economy Routing & Interface

**Objetivo**: Maximizar a margem de lucro usando IAs mais baratas (ou gratuitas) sem degradação perceptível de qualidade, e simplificar a interface para o cliente final.

## 1. Interface do Usuário (Painel)

### 1.1 Visão do Cliente (Simplificada)
O cliente final vê apenas "mágica", sem detalhes técnicos ou custos.
-   **Aba Status**: "IA Ativa" / "Manutenção".
-   **Botão Testar**: Manda um "Oi", responde em < 2s.
-   **Medidor de Velocidade**: Mostra latência (ex: 420ms).
-   **Slider "Modo Econômico"**:
    -   Ativa rotas de IAs mais baratas.
    -   Mensagem motivacional: "Você economizou R$ 0,24 hoje".
    -   *Hack*: Não explica como funciona, apenas o benefício.

### 1.2 Visão Master (Admin/Revenda)
Painel técnico para controle total de custos e providers.
-   **Inputs de API Key**: Gemini, Groq, DeepSeek, Claude, Mistral, OpenAI.
-   **Switch On/Off**: Habilita/desabilita providers individualmente.
-   **Configuração de Prioridade**:
    -   Ordem (1, 2, 3...).
    -   Custo por 1k tokens (cálculo automático).
    -   Switch "Fallback Automático" (se falhar ou estourar cota, pula pro próximo).
-   **Dashboards**:
    -   Gasto Hoje (R$).
    -   Provider Mais Rápido (ms).
    -   Provider Mais Barato (R$).

## 2. Estratégia de Roteamento (n8n "AI Router")

O nó de decisão no n8n avalia cada requisição em tempo real:

#### Critérios de Decisão:
1.  **Custo**: Prioriza o menor custo por token.
2.  **Latência**: Monitora se está respondendo em < 1s.
3.  **Capacidade/Cota**: Verifica se ainda há cota gratuita/diária disponível.

#### Tier Gratuito/Barato (Prioridade):
| Provider | Modelo | Cota Grátis/Custo | Uso Ideal |
|----------|--------|-------------------|-----------|
| **1. DeepSeek** | V3/Coder | ~20k tokens/dia free (depois $0.0001/1k) | Código, Lógica complexa |
| **2. Groq** | Llama3-70b | ~5k tokens/dia free ($0.002/1k) | Velocidade Extrema (Chat) |
| **3. Google** | Gemini 1.5 Flash | 15 req/min free ($0.35/1M input) | Janela de contexto longa |
| **4. Mistral** | Le Chat API | ~5k tokens/semana free | Fallback Geral |
| **5. Anthropic**| Claude 3 Haiku | ~50k tokens/dia (trial) | Texto humanizado |
| **6. Local** | Ollama (Llama3/Phi3) | **Custo Zero** (Usa RAM) | Último recurso (Fallback Total) |

> **Nota**: `ChatGPT 3.5 Turbo` deixado como opção cara ($0.002/1k) de baixa prioridade.

## 3. Implementação Técnica

-   **Redis Stat Tracking**:
    -   Chaves: `ia_stats:provider:today_tokens`, `ia_stats:provider:latency`.
    -   Reset diário.
-   **Fluxo n8n**:
    -   Recebe Prompt -> Consulta Redis -> Escolhe Provider -> Executa -> Se Erro, Tenta Próximo (Retry) -> Retorna e Atualiza Stats.
    -   Salva configuração em `.env` do cliente (`GROQ_ENABLED=true`, `GEMINI_PRIORITY=2`).
