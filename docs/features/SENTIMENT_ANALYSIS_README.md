# Sistema de Análise de Sentimentos - GetNexo

## 📋 Visão Geral

O Sistema de Análise de Sentimentos da GetNexo é uma solução completa que utiliza IA para analisar o tom emocional das mensagens dos clientes em tempo real. O sistema pontua sentimentos de 1-10, identifica emoções, dispara alertas automáticos e fornece insights valiosos para melhorar o atendimento ao cliente.

## 🎯 Funcionalidades Principais

### 🤖 Análise de Sentimentos em Tempo Real
- **Pontuação 1-10**: Raiva (1-2) → Empolgação (9-10)
- **Análise baseada em regras**: Fallback confiável sem dependência de APIs externas
- **Integração com LLM**: Suporte opcional ao OpenAI GPT-4 para análise avançada
- **Detecção de emoções**: Raiva, Frustração, Neutro, Satisfação, Empolgação

### 🚨 Sistema de Alertas Inteligente
- **Escalonamento automático**: Clientes muito insatisfeitos (score 1-2)
- **Alertas de atenção**: Clientes insatisfeitos (score 3-4)
- **Recompensas automáticas**: Clientes muito satisfeitos (score 9-10)
- **Notificações em tempo real**: WebSocket para alertas instantâneos

### 📊 Dashboards e Relatórios
- **Dashboard de métricas**: Visão geral por agente/produto/departamento
- **Relatório de eficácia**: Comparação tom inicial vs final
- **Análise de tendências**: Evolução temporal dos sentimentos
- **Distribuição de sentimentos**: Gráficos e estatísticas detalhadas

### 🔧 Configuração Administrativa
- **Thresholds personalizáveis**: Ajuste dos limites de alerta
- **Tipos de recompensa**: Configuração de brindes e benefícios
- **Painel de administração**: Interface completa para gerenciamento

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)      │◄──►│   (MongoDB)     │
│                 │    │                  │    │                 │
│ • SentimentIndicator │ • SentimentAnalysis│ • SentimentAnalysis│
│ • SentimentDashboard │ • TicketIntegration│ • Ticket           │
│ • ChatMessage       │ • RealtimeAlerts  │ • User             │
│ • useSentimentAnalysis│ • Routes         │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   WebSocket     │
                       │   Alerts        │
                       └─────────────────┘
```

## 📊 Escala de Sentimentos

| Score | Sentimento | Categoria | Emoji | Cor | Ação |
|-------|------------|-----------|-------|-----|------|
| 1-2 | Muito Negativo | Raiva | 😡 | 🔴 | Escalonamento Urgente |
| 3-4 | Negativo | Frustração | 😠 | 🟠 | Atenção Necessária |
| 5-6 | Neutro | Neutro | 😐 | 🟡 | Sem ação específica |
| 7-8 | Positivo | Satisfação | 😊 | 🟢 | Atendimento bom |
| 9-10 | Muito Positivo | Empolgação | 🤩 | 🟢 | Recompensa automática |

## 🚀 Instalação e Configuração

### 1. Dependências
```bash
# Backend (chat-api)
npm install axios mongoose socket.io

# Frontend (getnexo-site)
npm install react react-dom prop-types
```

### 2. Configuração de API (Opcional)
```json
// chat-api/ai-config.json
{
  "geminiKey": "your-gemini-api-key",
  "openRouterKey": "your-openrouter-key",
  "activeAI": "openrouter"
}
```

### 3. Inicialização
```bash
# Backend
cd chat-api
npm start

# Frontend
cd getnexo-site
npm run dev
```

## 📚 API Reference

### Endpoints de Análise

#### POST `/api/sentiment/analyze`
Analisa texto e retorna pontuação de sentimento.

**Request:**
```json
{
  "text": "Amei o produto, funciona perfeitamente!",
  "ticketId": "optional-ticket-id",
  "options": {
    "analysisType": "initial"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 9,
    "sentiment": "very_positive",
    "category": "empolgação",
    "confidence": 0.89,
    "keywords": ["amei", "produto"],
    "alertTriggered": true,
    "alertType": "reward",
    "rewardType": "cafe"
  }
}
```

#### POST `/api/sentiment/analyze/batch`
Analisa múltiplos textos em lote.

**Request:**
```json
{
  "texts": ["Texto 1", "Texto 2", "Texto 3"],
  "options": { "analysisType": "ongoing" }
}
```

#### GET `/api/sentiment/analysis/ticket/:ticketId`
Obtém análises de um ticket específico.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "score": 8,
      "sentiment": "positive",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 50,
    "skip": 0
  }
}
```

### Endpoints de Dashboard

#### GET `/api/sentiment/dashboard/metrics`
Métricas gerais de sentimento.

**Query Parameters:**
- `startDate`: Data inicial (ISO 8601)
- `endDate`: Data final (ISO 8601)
- `agentId`: ID do agente
- `productId`: ID do produto
- `department`: Departamento

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1250,
    "avgScore": 6.8,
    "alertsTriggered": 45,
    "rewardsGiven": 23,
    "veryNegative": 15,
    "negative": 120,
    "neutral": 450,
    "positive": 580,
    "veryPositive": 85
  }
}
```

#### GET `/api/sentiment/dashboard/effectiveness`
Relatório de eficácia do suporte.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ticketId": "TICK-123",
      "initialScore": 3,
      "finalScore": 8,
      "scoreChange": 5,
      "improvement": true,
      "agentName": "João Silva"
    }
  ]
}
```

### Endpoints de Configuração

#### GET `/api/sentiment/config/thresholds`
Obtém thresholds configuráveis.

**Response:**
```json
{
  "success": true,
  "data": {
    "escalation": { "min": 1, "max": 2, "label": "Escalonamento Urgente" },
    "warning": { "min": 3, "max": 4, "label": "Atenção Necessária" },
    "reward": { "min": 9, "max": 10, "label": "Recompensa" }
  }
}
```

#### PUT `/api/sentiment/config/thresholds`
Atualiza thresholds.

**Request:**
```json
{
  "thresholds": {
    "escalation": { "min": 1, "max": 3, "label": "Escalonamento Imediato" }
  }
}
```

## 🎨 Componentes React

### SentimentIndicator
Exibe ícone de sentimento com badge e tooltip.

```jsx
import SentimentIndicator from './components/SentimentIndicator';

// Uso básico
<SentimentIndicator score={8} />

// Com todas as opções
<SentimentIndicator
  score={8}
  sentiment="positive"
  category="satisfacao"
  confidence={0.85}
  showBadge={true}
  showTooltip={true}
  size="medium"
/>
```

### SentimentDashboard
Dashboard completo de métricas.

```jsx
import SentimentDashboard from './components/sentiment/SentimentDashboard';

// Uso simples - componente autocontido
<SentimentDashboard />
```

### ChatMessage com Análise
Exemplo de integração em chat.

```jsx
import ChatMessage from './components/chat/ChatMessage';

// Mensagem com análise de sentimento
<ChatMessage
  message={{
    text: "Amei o atendimento!",
    sender: "Cliente",
    timestamp: new Date()
  }}
  isUser={false}
  showSentiment={true}
/>
```

## 🔧 Configuração de Thresholds

### Thresholds de Alerta
```javascript
const thresholds = {
  escalation: { min: 1, max: 2, label: 'Escalonamento Urgente' },
  warning: { min: 3, max: 4, label: 'Atenção Necessária' },
  reward: { min: 9, max: 10, label: 'Recompensa' }
};
```

### Tipos de Recompensa
```javascript
const rewardTypes = {
  cafe: { label: 'Café', description: 'Cupom de café premium' },
  brinde: { label: 'Brinde', description: 'Brinde especial' },
  desconto: { label: 'Desconto', description: 'Desconto na próxima compra' },
  upgrade: { label: 'Upgrade', description: 'Upgrade de plano/serviço' }
};
```

## 🔌 WebSocket - Alertas em Tempo Real

### Conexão
```javascript
import io from 'socket.io-client';

const socket = io('/sentiment-alerts');

// Autenticação
socket.emit('authenticate', {
  userId: 'user123',
  token: 'jwt-token'
});

// Receber alertas
socket.on('new_alert', (alert) => {
  console.log('Novo alerta:', alert);
  // Mostrar notificação para o usuário
});

// Receber histórico
socket.emit('get_alert_history', { limit: 50 });
socket.on('alert_history', (history) => {
  console.log('Histórico:', history);
});
```

### Tipos de Alerta
```javascript
const alertTypes = {
  sentiment: { icon: '💭', color: 'blue' },
  escalation: { icon: '🚨', color: 'red' },
  warning: { icon: '⚠️', color: 'orange' },
  reward: { icon: '🎉', color: 'green' },
  system: { icon: 'ℹ️', color: 'gray' },
  performance: { icon: '📊', color: 'purple' }
};
```

## 📈 Casos de Uso

### 1. Suporte ao Cliente
- **Detecção precoce**: Identificar clientes insatisfeitos antes que desistam
- **Escalonamento inteligente**: Direcionar casos críticos para supervisores
- **Feedback automático**: Reconhecer e recompensar bons atendimentos

### 2. Qualidade de Serviço
- **Métricas de satisfação**: Acompanhar evolução do sentimento durante atendimento
- **Treinamento**: Identificar padrões de sucesso/fracasso
- **Benchmarking**: Comparar performance entre agentes

### 3. Business Intelligence
- **Tendências**: Identificar picos de insatisfação por produto/canal
- **Previsão**: Antecipar problemas baseado em padrões de sentimento
- **Segmentação**: Agrupar clientes por perfil emocional

## 🧪 Testes

### Executar Testes
```bash
# Backend
cd chat-api
npm test

# Frontend
cd getnexo-site
npm test
```

### Testes Disponíveis
- **sentiment-analysis.test.js**: Testes unitários do serviço
- **SentimentIndicator.test.jsx**: Testes do componente React
- **Integração**: Testes de API e WebSocket

## 🔒 Segurança

### Autenticação
- JWT tokens para API
- WebSocket authentication
- Role-based permissions

### Validação
- Input sanitization
- Rate limiting
- SQL injection prevention

### Privacidade
- Dados anonimizados
- Conformidade LGPD
- Audit logging

## 📚 Referências

### Documentação Técnica
- [Modelo SentimentAnalysis](./chat-api/models/SentimentAnalysis.js)
- [Serviço SentimentAnalysisService](./chat-api/services/SentimentAnalysisService.js)
- [API Routes](./chat-api/routes/sentiment.js)

### Componentes Frontend
- [SentimentIndicator](./getnexo-site/src/components/SentimentIndicator.jsx)
- [SentimentDashboard](./getnexo-site/src/components/sentiment/SentimentDashboard.jsx)
- [Hook useSentimentAnalysis](./getnexo-site/src/hooks/useSentimentAnalysis.js)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Email: suporte@getnexo.com.br
- Documentação: [docs.getnexo.com.br](https://docs.getnexo.com.br)
- Issues: [GitHub Issues](https://github.com/getnexo/sentiment-analysis/issues)

---

**Desenvolvido com ❤️ pela equipe GetNexo**

*Última atualização: Janeiro 2026*