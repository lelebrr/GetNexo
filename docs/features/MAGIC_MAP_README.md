# 🗺️ Magic Map - Sistema de Rastreamento de Usuários

O Magic Map é um sistema completo de rastreamento de usuários em tempo real que fornece insights valiosos sobre o comportamento dos visitantes do site. Desenvolvido com foco em privacidade e conformidade com GDPR.

## 🎯 Funcionalidades

### ✅ Implementado
- **Rastreamento em Tempo Real**: Posição do mouse, cliques, scroll e visualizações de página
- **Magic Map Visual**: Interface visual mostrando usuários ativos em tempo real
- **Heatmaps**: Mapas de calor para cliques, scroll e atenção do usuário
- **Mensagens Contextuais**: "Cliente olhando produto notebook 2min", etc.
- **Sistema de Consentimento GDPR**: Modal de privacidade com controle granular
- **Dashboard Analytics**: Métricas completas de comportamento do usuário
- **Alertas de Inatividade**: Notificações quando usuários ficam inativos
- **Configuração Administrativa**: Interface completa para configurar rastreamento
- **Anonimização de Dados**: Hash de IPs e controle de dados pessoais
- **Rate Limiting**: Controle inteligente de frequência de eventos
- **Armazenamento Eficiente**: Dados agregados para performance

### 🔧 Componentes Técnicos

#### Backend (chat-api/)
- **Modelos de Dados**:
  - `UserSession.js`: Gerenciamento de sessões de usuário
  - `UserEvent.js`: Eventos individuais de interação
  - `HeatmapData.js`: Dados agregados para heatmaps

- **APIs**:
  - `POST /api/tracking/session/init`: Inicializar sessão
  - `POST /api/tracking/events/batch`: Enviar eventos em lote
  - `POST /api/tracking/session/activity`: Atualizar atividade
  - `POST /api/tracking/session/end`: Finalizar sessão
  - `GET /api/tracking/magic-map`: Dados em tempo real
  - `GET /api/tracking/analytics`: Analytics comportamentais
  - `GET/POST/DELETE /api/tracking/privacy/config`: Configurações de privacidade

#### Frontend (getnexo-site/)
- **Script de Rastreamento** (`public/tracking.js`): Coleta dados do usuário
- **MagicMap Component** (`src/components/analytics/MagicMap.jsx`): Visualização em tempo real
- **HeatmapChart Component** (`src/components/analytics/HeatmapChart.jsx`): Mapas de calor
- **Admin Config** (`src/pages/admin/tracking-config.astro`): Interface administrativa

## 🔗 Locais de API

### Endpoints Principais
- **Produção**: `https://api.getnexo.com.br/api/tracking/...`
- **Desenvolvimento**: `http://localhost:3000/api/tracking/...`
- **Admin Dashboard**: `http://localhost:4321/admin/tracking-config`

### Credenciais de Acesso
- **API Key**: Configure em `.env` como `TRACKING_API_KEY`
- **Admin Username**: `admin`
- **Admin Password**: Configure em `.env` como `ADMIN_PASSWORD`

### Links Úteis
- **Dashboard Admin**: http://localhost:4321/admin/tracking-config
- **API Documentation**: http://localhost:3000/api/tracking/docs
- **Privacy Policy**: http://localhost:4321/privacy

## 🚀 Como Usar

### 1. Configuração Inicial
1. Acesse `/admin/tracking-config`
2. Configure as preferências de privacidade
3. Ative o rastreamento desejado
4. Salve as configurações

### 2. Visualização em Tempo Real
1. Vá para `/dashboard/analytics`
2. Visualize o Magic Map em tempo real
3. Veja heatmaps de comportamento
4. Monitore mensagens contextuais

### 3. Analytics Avançados
- Métricas de engajamento por página
- Taxa de conversão
- Tempo médio de sessão
- Padrões de navegação
- Zonas de atenção do usuário

## 🔒 Privacidade e GDPR

### Conformidade
- **Consentimento Explícito**: Modal de privacidade obrigatório
- **Anonimização de IP**: Últimos octetos removidos por padrão
- **Controle de Dados**: Usuários podem optar por não participar
- **Retenção Configurável**: Dados automaticamente removidos após período definido
- **Auditoria Completa**: Logs de todas as operações de dados

### Configurações de Privacidade
```javascript
{
  gdpr_required: true,           // GDPR obrigatório
  anonymize_ip: true,           // Anonimizar IPs
  cookie_consent_required: true, // Consentimento de cookies
  data_retention_days: 90,      // Retenção de dados
  sampling_rate: 1.0,          // Taxa de amostragem (0-1)
  tracking_enabled: true        // Rastreamento ativo
}
```

## 📊 Tipos de Eventos Rastreados

### Eventos Padrão
- **Cliques**: Posição, elemento, seletor CSS
- **Scroll**: Profundidade, velocidade, direção
- **Movimento do Mouse**: Caminhos, zonas de atenção
- **Visualização de Página**: Tempo, referenciador, UTM
- **Formulários**: Foco, submissão, tempo de preenchimento

### Eventos Customizados
```javascript
// Enviar evento personalizado
window.MagicMap.trackEvent('product_view', {
  product_id: '123',
  product_name: 'Notebook Gamer',
  category: 'eletronicos'
});
```

## 🎨 Interface do Magic Map

### Visualização em Tempo Real
- **Círculos Coloridos**: Cada usuário ativo
- **Traços de Movimento**: Caminhos do mouse
- **Indicadores de Atividade**: Verde (ativo), Azul (navegando), Cinza (inativo)
- **Legendas**: Desktop 📱 Mobile 💻 Tablet

### Mensagens Contextuais
- "Cliente navegando - Scroll: 75%"
- "Cliente olhando produto notebook 2min"
- "Cliente inativo há 5 minutos"

## 🔧 Configuração Técnica

### Rate Limiting
- Máximo 120 eventos por minuto por usuário
- Controle automático de frequência
- Throttling inteligente

### Armazenamento
- **Tabelas SQLite**:
  - `user_sessions`: Sessões ativas e finalizadas
  - `user_events`: Eventos individuais
  - `heatmap_data`: Dados agregados
  - `tracking_privacy`: Configurações

### Performance
- **Batch Processing**: Eventos enviados em lotes
- **Compressão**: Dados agregados automaticamente
- **Cache**: Configurações em memória
- **Cleanup**: Remoção automática de dados antigos

## 🧪 Testes

### Executar Testes
```bash
# Testes do backend
cd chat-api && npm test

# Testes do frontend
cd getnexo-site && npm test
```

### Cobertura de Testes
- Modelos de dados
- APIs de rastreamento
- Sistema de consentimento
- Rate limiting
- Anonimização de dados

## 📈 Métricas e KPIs

### Métricas Principais
- **Sessões Ativas**: Usuários online em tempo real
- **Taxa de Conversão**: Sessões que resultam em vendas
- **Tempo Médio de Sessão**: Engajamento do usuário
- **Bounce Rate**: Taxa de rejeição
- **Zonas de Atenção**: Áreas mais visualizadas

### Relatórios
- **Por Página**: Comportamento específico
- **Por Dispositivo**: Desktop vs Mobile
- **Por Tempo**: Tendências horárias/diárias
- **Por Origem**: Tráfego e conversões

## 🚨 Alertas e Monitoramento

### Tipos de Alertas
- **Inatividade Prolongada**: Usuários parados por muito tempo
- **Taxa de Erro Alta**: Problemas técnicos
- **Conversões Baixas**: Possíveis problemas de UX
- **Tráfego Anômalo**: Padrões suspeitos

### Sistema de Notificações
- Push notifications no browser
- Logs estruturados
- Dashboards em tempo real
- Relatórios automáticos

## 🔧 Manutenção

### Limpeza de Dados
```sql
-- Remover dados antigos automaticamente
DELETE FROM user_events WHERE timestamp < datetime('now', '-90 days');
DELETE FROM user_sessions WHERE start_time < datetime('now', '-90 days');
DELETE FROM heatmap_data WHERE date < date('now', '-365 days');
```

### Otimização de Performance
- Índices em campos de busca
- Compressão de dados históricos
- Cache de configurações
- Monitoramento de queries lentas

## 📚 API Reference

### Endpoints Principais

#### Sessões
```http
POST /api/tracking/session/init
POST /api/tracking/session/activity
POST /api/tracking/session/end
```

#### Eventos
```http
POST /api/tracking/events/batch
```

#### Visualização
```http
GET /api/tracking/magic-map
GET /api/tracking/analytics
```

#### Configuração
```http
GET /api/tracking/privacy/config
POST /api/tracking/privacy/config
DELETE /api/tracking/privacy/config
```

## 🎯 Casos de Uso

### E-commerce
- Rastrear jornada de compra
- Identificar produtos mais visualizados
- Otimizar funnels de conversão
- Prever abandono de carrinho

### SaaS
- Monitorar uso de features
- Identificar pontos de atrito
- Otimizar onboarding
- Prever churn

### Conteúdo
- Mapear engajamento por artigo
- Identificar padrões de leitura
- Otimizar layout e conteúdo
- Personalizar recomendações

## 🔮 Roadmap

### Próximas Funcionalidades
- [ ] Machine Learning para predição de comportamento
- [ ] Integração com ferramentas de analytics externas
- [ ] A/B Testing integrado
- [ ] Relatórios automáticos por email
- [ ] API para integrações third-party
- [ ] Suporte a múltiplos domínios
- [ ] Análise de sentimento em tempo real

## 🤝 Contribuição

### Desenvolvimento
1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente com testes
4. Faça PR com documentação

### Padrões de Código
- ESLint e Prettier configurados
- Testes obrigatórios para novas funcionalidades
- Documentação em português brasileiro
- Commits seguindo conventional commits

## 📞 Suporte

### Canais
- **Issues**: Para bugs e solicitações
- **Discussions**: Para dúvidas gerais
- **Wiki**: Documentação detalhada
- **Discord**: Comunidade ativa

### SLA
- Bugs críticos: 24h
- Features: 1 semana
- Consultorias: Agendamento

---

**Magic Map v1.0** - Sistema completo de rastreamento de usuários com foco em privacidade e performance.