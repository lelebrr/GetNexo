# Sistema de Behavioral Tagging Completo

## Visão Geral

Sistema completo de tagging comportamental baseado em machine learning que permite:
- **Coleta automática de eventos comportamentais** em tempo real
- **Clustering ML de usuários** usando algoritmo K-means implementado em JavaScript puro
- **Tags comportamentais automáticas** baseadas em regras configuráveis
- **Disparo de ofertas** baseado em comportamentos específicos
- **Dashboard administrativo** para configuração e monitoramento completo

## Funcionalidades Implementadas

### 1. Coleta de Eventos Comportamentais
- **Rastreamento em tempo real** de interações do usuário
- **Eventos capturados**: cliques, scroll, navegação, tempo de sessão, dispositivos
- **Armazenamento otimizado** com índices de performance
- **Integração com Magic Map** para dados de heatmap

### 2. Algoritmo de Clustering ML
- **K-means implementado em JavaScript** puro (sem dependências externas)
- **Features extraídas**: sessões, pageviews, cliques, tempo gasto, engajamento, etc.
- **Normalização z-score** automática
- **Cálculo de Silhouette Score** para avaliação de qualidade
- **Otimização automática** do número de clusters (método do cotovelo)

### 3. Tags Comportamentais Automáticas
- **Tags baseadas em regras**: 'Interesse Alto', 'Comprador Recorrente', 'Navegador Casual'
- **Sistema de confiança**: scores de 0-100% para cada tag
- **Regras configuráveis**: condições, thresholds, expiração automática
- **Cooldown e limites**: controle de aplicações por usuário

### 4. Sistema de Ofertas Inteligentes
- **Disparo automático** baseado em tags comportamentais
- **Integração com jornada do cliente**: carrinho abandonado, produto visualizado 3x
- **Múltiplos tipos de oferta**: desconto, frete grátis, upsell, cross-sell
- **A/B testing** integrado para otimização

### 5. Dashboard Administrativo Completo
- **Visão geral** com métricas em tempo real
- **Gerenciamento de clusters**: estatísticas, usuários por cluster
- **CRUD completo** de tags e regras comportamentais
- **Aplicação manual** de tags para usuários específicos
- **Monitoramento de performance** do sistema ML

## Arquitetura Técnica

### Backend (chat-api/)

#### Modelos
- `UserBehavior.js`: Perfis comportamentais agregados
- `BehavioralTag.js`: Tags aplicadas aos usuários
- `BehaviorRule.js`: Regras para aplicação automática de tags
- `UserEvent.js`: Eventos individuais (cliques, scrolls, etc.)
- `UserSession.js`: Sessões de usuário

#### Serviços
- `BehavioralTrackingService.js`: Coleta e processamento de eventos
- `UserClusteringService.js`: Algoritmo ML de clustering
- `UserBehavior.js`: Métodos de atualização em lote

#### APIs REST (`/api/clustering/`)
- `POST /run`: Executar clustering completo
- `GET /stats`: Estatísticas do último clustering
- `GET /clusters`: Lista de clusters ativos
- `GET /clusters/:id`: Detalhes de cluster específico
- `POST /predict`: Predição de cluster para novo usuário
- `POST /optimize`: Otimização automática de K
- `GET /high-conversion`: Usuários com alta probabilidade de conversão
- `GET/POST/PUT/DELETE /behavioral-tags`: CRUD de tags
- `GET/POST/PUT/DELETE /behavior-rules`: CRUD de regras
- `POST /apply-tags`: Aplicação manual de tags
- `POST /trigger-offers`: Disparo de ofertas por tags

### Frontend (getnexo-site/)

#### Componentes
- `BehavioralTaggingDashboard.jsx`: Dashboard principal com abas
- `TagForm.jsx` & `RuleForm.jsx`: Formulários para criação/edição
- `Progress.jsx`, `Badge.jsx`, etc.: Componentes do design system

#### Página Admin
- `/admin/behavioral-tagging`: Interface completa de gerenciamento

## Como Usar

### 1. Configuração Inicial
```bash
# Executar clustering inicial
POST /api/clustering/run

# Criar regras básicas
POST /api/clustering/behavior-rules
{
  "name": "Interesse Alto",
  "tag_name": "high_interest",
  "tag_category": "engagement",
  "conditions": {"total_sessions": {"operator": ">", "value": 5}},
  "confidence_threshold": 70
}
```

### 2. Aplicação Automática
```bash
# Aplicar tags para usuários específicos
POST /api/clustering/apply-tags
{
  "userIds": ["user123", "user456"]
}

# Disparar ofertas baseadas em tags
POST /api/clustering/trigger-offers
{
  "tagNames": ["high_interest"],
  "offerType": "discount",
  "offerData": {"percentage": 15, "validDays": 7}
}
```

### 3. Monitoramento
- Acesse `/admin/behavioral-tagging` para dashboard completo
- Visualize clusters, tags aplicadas, regras ativas
- Monitore performance do algoritmo ML

## Exemplos de Tags Comportamentais

### Tags Automáticas
- **"Interesse Alto"**: Usuário viu produto 3x+ em uma sessão
- **"Comprador Potencial"**: Adicionou ao carrinho mas não comprou
- **"Cliente Fiel"**: Compra frequente (3+ compras/mês)
- **"Navegador Noturno"**: Ativo principalmente entre 22h-6h
- **"Mobile Preferido"**: 70%+ das sessões via mobile

### Regras de Aplicação
```javascript
{
  name: "Produto Visualizado 3x",
  conditions: {
    page_views: { operator: ">", value: 2 },
    time_spent: { operator: ">", value: 300 }
  },
  tag_config: {
    name: "high_interest",
    category: "conversion",
    confidence_score: 85
  },
  expiration_days: 7,
  cooldown_hours: 24
}
```

## Métricas de Performance

### Clustering ML
- **Silhouette Score**: Mede qualidade da separação entre clusters (0-1)
- **Iterações**: Número de iterações até convergência
- **Tempo de processamento**: Otimizado para datasets grandes

### Tags e Conversão
- **Taxa de aplicação**: Tags aplicadas por usuário
- **Conversão por tag**: Taxa de conversão para usuários com tags específicas
- **Precisão**: Acurácia das tags aplicadas

## Integrações

### Sistema de Notificações
- Alertas automáticos quando usuários atingem thresholds
- Notificações push para ofertas comportamentais

### Analytics e Relatórios
- Integração completa com dashboard de analytics existente
- Métricas específicas para behavioral tagging

### Jornada do Cliente
- Triggers automáticos baseados em comportamentos
- Sequências de email marketing personalizadas

## Segurança e Privacidade

### GDPR Compliance
- Consentimento obrigatório para tracking
- Anonimização automática de IPs
- Retenção configurável de dados (padrão: 90 dias)
- Exclusão automática de dados expirados

### Controle de Acesso
- Middleware de autenticação em todas as APIs
- Logs de auditoria para mudanças de configuração
- Controle granular de permissões

## Próximos Passos

### Melhorias Planejadas
1. **Aprendizado Contínuo**: Modelo que se adapta com novos dados
2. **Predição de Churn**: Algoritmo específico para risco de churn
3. **Recomendações Personalizadas**: Sistema de recomendação baseado em clusters
4. **A/B Testing Avançado**: Testes multivariados para ofertas

### Escalabilidade
- Suporte para milhões de usuários
- Processamento distribuído para clustering
- Cache Redis para dados comportamentais
- Integração com data warehouses externos

## Conclusão

O sistema de Behavioral Tagging implementado é uma solução completa e production-ready que combina machine learning avançado com uma interface administrativa intuitiva. Permite segmentação automática de usuários, aplicação inteligente de tags e disparo personalizado de ofertas, resultando em aumento significativo de conversões e engajamento.

**Totalmente Funcional e Configurável via Admin** ✅