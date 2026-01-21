# Arquitetura do Sistema de Minigames no Chat

## Visão Geral
O sistema de minigames será integrado no widget de chat GetNexo, permitindo jogos interativos como roleta virtual, raspadinha, caça-preço, quiz e monte kit. Cada jogo concede pontos de fidelidade e prêmios, com analytics completos de engajamento.

## Arquitetura dos Componentes

```mermaid
graph TB
    subgraph "Frontend - Widget Chat"
        A[Chat Widget] --> B[Minigames Launcher]
        B --> C[Roleta Virtual]
        B --> D[Raspadinha]
        B --> E[Caça-Preço]
        B --> F[Quiz]
        B --> G[Monte Kit]
        C --> H[Game UI Components]
        D --> H
        E --> H
        F --> H
        G --> H
        H --> I[Points Display]
        I --> J[Loyalty Integration]
    end

    subgraph "Backend - API"
        K[Game API Endpoints] --> L[Game Session Manager]
        L --> M[Game Logic Services]
        M --> N[Roleta Service]
        M --> O[Raspadinha Service]
        M --> P[Caça-Preço Service]
        M --> Q[Quiz Service]
        M --> R[Monte Kit Service]
        L --> S[Loyalty Points Service]
        S --> T[Points Database]
        L --> U[Game Analytics]
        U --> V[Analytics Database]
    end

    subgraph "Admin Panel"
        W[Minigames Admin] --> X[Game Configuration]
        W --> Y[Points Management]
        W --> Z[Analytics Dashboard]
    end

    H --> K
    K --> A
    W --> K
```

## Modelos de Dados

### GameSession
- id: String
- userId: String
- gameType: 'roleta' | 'raspadinha' | 'caca_preco' | 'quiz' | 'monte_kit'
- status: 'active' | 'completed' | 'abandoned'
- score: Number
- pointsEarned: Number
- rewards: Array
- startedAt: Date
- completedAt: Date

### LoyaltyPoints
- userId: String
- totalPoints: Number
- availablePoints: Number
- transactions: Array
- level: Number
- badges: Array

### GameAnalytics
- gameType: String
- totalSessions: Number
- completionRate: Number
- avgSessionTime: Number
- pointsDistributed: Number
- conversionToPurchase: Number

## Fluxo de Jogo

```mermaid
sequenceDiagram
    participant U as Usuário
    participant W as Widget
    participant API as Backend API
    participant DB as Database

    U->>W: Clicar em "Jogar Roleta"
    W->>API: POST /api/minigames/roleta/start
    API->>DB: Criar GameSession
    DB-->>API: Session ID
    API-->>W: Game data + Session ID
    W-->>U: Mostrar interface da roleta

    U->>W: Girar roleta
    W->>API: POST /api/minigames/roleta/spin
    API->>API: Calcular resultado (lógica RNG)
    API->>DB: Atualizar session + pontos
    DB-->>API: Confirmação
    API-->>W: Resultado + pontos ganhos
    W-->>U: Animação + atualização pontos
```

## Integração com Fidelidade

- Cada jogo concede pontos baseados no desempenho
- Pontos podem ser trocados por descontos/recompensas
- Sistema de níveis de fidelidade
- Analytics de retenção por pontos

## Configuração Admin

- Ativar/desativar jogos individualmente
- Configurar probabilidades e prêmios
- Gerenciar catálogo de recompensas
- Dashboard de analytics em tempo real
- Configuração de campanhas sazonais