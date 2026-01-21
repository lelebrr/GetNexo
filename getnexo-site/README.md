# 🚀 GetNexo Platform

**Plataforma SaaS Enterprise Completa com 250+ Funcionalidades Implementadas**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/getnexo/platform)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-18+-green)](https://nodejs.org/)
[![Astro](https://img.shields.io/badge/astro-4.16-orange)](https://astro.build)

> Uma plataforma unificada de automação, analytics, gamificação e realidade aumentada - 100% funcional e pronta para produção.

## 🌟 Visão Geral

O **GetNexo** é uma plataforma SaaS enterprise completa que combina:

- 🎨 **Interface Neural** com animações avançadas e temas dinâmicos
- 🤖 **IA Integrada** com Claude-3 para chatbots e análise de dados
- 📱 **PWA Completa** com funcionamento offline
- 🔐 **Autenticação Enterprise** com OAuth, JWT e biometria
- 📊 **Analytics Avançado** com 70+ KPIs em tempo real
- 🎮 **Gamificação** com conquistas e leaderboards
- 🎥 **Realidade Aumentada** para visualização de produtos
- 🌐 **APIs Completas** (REST + GraphQL + WebSockets)

## 🔥 Funcionalidades Principais

### 🎨 Interface & UX
- **Fundo neural animado** com efeitos visuais avançados
- **4 temas dinâmicos** (Default, Dark, Neural, Cosmic)
- **Microinterações** sutis em toda a interface
- **Animações responsivas** otimizadas para mobile/desktop
- **Internacionalização** completa (PT-BR/EN)

### 🔐 Segurança & Autenticação
- **OAuth 2.0** (Google, GitHub)
- **Biometria WebAuthn** (impressão digital, face)
- **JWT + Refresh Tokens**
- **2FA/TOTP** opcional
- **RBAC** com permissões granulares

### 🤖 Inteligência Artificial
- **Chatbot inteligente** integrado com Claude-3
- **Análise de sentimentos** em tempo real
- **Clustering de usuários** com K-means
- **Predição de comportamento** baseada em ML
- **Recomendações personalizadas**

### 📊 Business Intelligence
- **Dashboards interativos** com gráficos em tempo real
- **70+ KPIs calculados** dinamicamente
- **Forecasting financeiro** automatizado
- **Relatórios automatizados** (diário, semanal, mensal)
- **Exportação multi-formato** (JSON, CSV, PDF)

### 🎮 Gamificação & Social
- **Sistema de pontos** avançado
- **Conquistas desbloqueáveis** com badges
- **Leaderboards competitivos**
- **Torneios sazonais** e eventos
- **Compartilhamento social** integrado

### 📱 PWA & Offline
- **Instalação nativa** em dispositivos
- **Funcionamento offline** completo
- **Notificações push** inteligentes
- **Sincronização em background**
- **Cache inteligente** de service worker

### 📁 Gestão de Mídia
- **Upload múltiplo** com drag & drop
- **Compressão automática** de imagens
- **Galeria organizada** com filtros e busca
- **Edição de imagens** com filtros
- **Sistema de tags** e favoritos

### 🌐 APIs & Integrações
- **API GraphQL** completa e tipada
- **APIs REST** para todos os módulos
- **WebSockets** para tempo real
- **Webhooks configuráveis**
- **Integrações** preparadas (Stripe, ERPs, etc.)

## 🛠️ Tecnologias

### Frontend Stack
- **Astro 4.16** - Framework web moderno
- **React 18.2** - Componentes interativos
- **TailwindCSS 3.4** - Styling utility-first
- **TypeScript** - Tipagem estática

### Backend & APIs
- **Node.js 18+** - Runtime JavaScript
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e sessões
- **Socket.io** - Tempo real

### DevOps & Qualidade
- **Docker + Kubernetes** - Containerização
- **Jest** - Testes automatizados
- **Prometheus + Grafana** - Monitoramento
- **GitHub Actions** - CI/CD

## 🚀 Instalação e Execução

### Pré-requisitos
```bash
Node.js 18+
PostgreSQL 14+
Redis 7+
```

### Instalação
```bash
# Clone o repositório
git clone https://github.com/getnexo/platform.git
cd getnexo-site

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Execute migrations do banco
npm run db:migrate

# Execute seeds (dados iniciais)
npm run db:seed
```

### Execução
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm run start

# Testes
npm test

# Load testing
npm run test:load
```

## 📖 Documentação Completa

### 🎯 Visão Geral
- **[README Principal](docs/README.md)** - Visão geral da documentação
- **[Recursos de Usuário](getnexo-site/docs/USER_FEATURES.md)** - Guia completo de funcionalidades
- **[Manual do Admin](docs/MANUAL_DO_ADMIN.md)** - Administração da plataforma
- **[Escalabilidade](docs/SCALABILITY.md)** - Estratégias de escala
- **[SEO Completo](docs/SEO_COMPLETO_DOCUMENTATION.md)** - Otimização para motores de busca
- **[Matriz de Verificação](docs/VERIFICATION_MATRIX.md)** - Checklist de qualidade

### 🏗️ Arquitetura e Desenvolvimento
- **[Arquitetura Técnica](docs/technical_reference/01_PROJECT_OVERVIEW.md)** - Visão geral do projeto
- **[Arquitetura do Sistema](docs/technical_reference/02_ARCHITECTURE.md)** - Diagramas e componentes
- **[Configuração](docs/technical_reference/03_CONFIGURATION.md)** - Configurações técnicas
- **[Implementação de Segurança](docs/technical_reference/04_SECURITY_IMPL.md)** - Segurança técnica
- **[Performance](docs/technical_reference/05_PERFORMANCE_IMPL.md)** - Otimizações de performance
- **[Deployment](docs/technical_reference/06_DEPLOYMENT.md)** - Estratégias de deploy
- **[Operações](docs/technical_reference/07_OPERATIONS.md)** - Operações e manutenção
- **[Referências Técnicas](docs/technical_reference/08_REFERENCES.md)** - Referências completas

### 🎨 Branding e Design
- **[Diretrizes de Branding](docs/branding/BRAND_GUIDELINES.md)** - Identidade visual
- **[Bíblia Visual GetNexo](docs/branding/GETNEXO – BÍBLIA VISUAL E NEURAL.md)** - Guia visual completo
- **[Assets de Branding](docs/assets/branding.css)** - Recursos visuais

### 💼 Business e Estratégia
- **[Inventário Master](docs/business/MASTER_INVENTORY.md)** - Inventário completo
- **[Dossiê Secreto](docs/business/SECRET_DOSSIER.md)** - Estratégia confidencial

### 🏢 Enterprise
- **[Detalhes de Implementação](docs/enterprise/ENTERPRISE_IMPLEMENTATION_DETAILS.md)** - Implementação enterprise
- **[Manual Enterprise](docs/enterprise/ENTERPRISE_MANUAL.md)** - Guia enterprise completo

### 📈 Marketing e Vendas
- **[Pacote de Campanha](docs/marketing/CAMPAIGN_BUNDLE.md)** - Estratégias de marketing
- **[Copywriting Ads](docs/marketing/COPYWRITING_ADS.md)** - Textos publicitários
- **[Ebook GetNexo Way](docs/marketing/EBOOK_GETNEXO_WAY.md)** - Conteúdo educativo
- **[Post Reddit](docs/marketing/launch_day/reddit_post.txt)** - Conteúdo de lançamento
- **[Twitter Thread](docs/marketing/launch_day/twitter_thread.txt)** - Thread de lançamento
- **[WhatsApp Blast](docs/marketing/launch_day/whatsapp_blast.txt)** - Mensagem de lançamento

### 📋 Planejamento
- **[Painel de Roteamento IA](docs/planning/AI_ROUTING_PANEL.md)** - IA e roteamento
- **[Estratégia de Marca](docs/planning/BRAND_STRATEGY.md)** - Estratégia de branding
- **[Benchmark de Concorrentes](docs/planning/COMPETITOR_BENCHMARK.md)** - Análise competitiva
- **[Portal do Cliente](docs/planning/CUSTOMER_PORTAL_HUB.md)** - Hub do cliente
- **[Analytics Dashboard](docs/planning/DASHBOARD_ANALYTICS.md)** - Dashboards analíticos
- **[Monitoramento de Erros](docs/planning/ERROR_MONITORING.md)** - Estratégia de erros
- **[Wishlist de Features](docs/planning/FEATURE_WISHLIST.md)** - Roadmap de features
- **[Ajustes de Infraestrutura](docs/planning/INFRASTRUCTURE_TWEAKS_AND_TUNING.md)** - Otimizações infra
- **[Checklist de Lançamento](docs/planning/LAUNCH_CHECKLIST.md)** - Preparação de lançamento
- **[Stack Leve](docs/planning/LIGHTWEIGHT_STACK_REF.md)** - Arquitetura leve
- **[Integração E-commerce](docs/planning/LOGISTICS_ECOMMERCE_INTEGRATION.md)** - Integrações logísticas
- **[Estratégia Omnichannel](docs/planning/OMNICHANNEL_STRATEGY.md)** - Estratégia omnichannel
- **[Performance Tuning](docs/planning/PERFORMANCE_TUNING_ADVANCED.md)** - Otimizações avançadas
- **[Modelo de Preços](docs/planning/PRICING_SCALING_MODEL.md)** - Estratégia de preços
- **[Otimização de Recursos](docs/planning/RESOURCE_OPTIMIZATION_STRATEGY.md)** - Recursos otimizados
- **[Arquitetura SaaS](docs/planning/SAAS_ARCHITECTURE.md)** - Arquitetura SaaS
- **[Gamificação Vendas](docs/planning/SALES_GAMIFICATION_ENGAGEMENT.md)** - Gamificação vendas
- **[Hardening Segurança](docs/planning/SECURITY_HARDENING_PARANOID.md)** - Segurança máxima
- **[Licenciamento Segurança](docs/planning/SECURITY_LICENSING.md)** - Licenciamento segurança
- **[Revisão Arquitetura](docs/planning/SYSTEM_ARCHITECTURE_REVIEW.md)** - Revisão arquitetural
- **[Sistema de Tickets](docs/planning/TICKET_MANAGEMENT_SYSTEM.md)** - Gerenciamento tickets
- **[Sistema Design UX/UI](docs/planning/UX_UI_DESIGN_SYSTEM.md)** - Sistema de design
- **[Customização White Label](docs/planning/WHITE_LABEL_CUSTOMIZATION.md)** - White label

### 🔗 Referências de API
- **[API CRM](docs/references/CRM_API.md)** - Integração CRM
- **[API E-commerce](docs/references/ECOMMERCE_API.md)** - Integração e-commerce
- **[API ERP](docs/references/ERP_API.md)** - Integração ERP
- **[API Logística](docs/references/LOGISTICS_API.md)** - Integração logística
- **[API Pagamento](docs/references/PAYMENT_API.md)** - Integração pagamentos

### 🔐 Segurança
- **[Segurança Geral](docs/security/SECURITY.md)** - Estratégia de segurança
- **[Roadmap Segurança](docs/security/ROADMAP_SEGURANCA.md)** - Plano de segurança
- **[Perfil AppArmor](docs/security/n8n-apparmor.profile)** - Configuração AppArmor

### ⚖️ Compliance e Acessibilidade
- **[Certificações Acessibilidade](docs/compliance/ACCESSIBILITY_CERTIFICATIONS.md)** - Conformidade acessibilidade

### 📄 Contratos e Legal
- **[NFT GetNexo](docs/contracts/GetNexoNFT.sol)** - Contrato NFT
- **[NexoLoyalty](docs/contracts/NexoLoyalty.sol)** - Contrato Loyalty

### 🔧 Workflows Técnicos
- **[Workflows JSON](docs/workflows/)** - Workflows automatizados (28 arquivos)

### ☁️ Integração AWS (GetNexo v1.0)
- **[CI/CD](getnexo-site/docs/aws-cicd.md)** - CodeCommit, CodeBuild, CodeDeploy, CodePipeline, Cloud9
- **[Compute](getnexo-site/docs/aws-compute.md)** - EC2, Lambda, API Gateway, AppSync, Amplify, Cognito, ECS, EKS, Fargate
- **[Storage](getnexo-site/docs/aws-storage.md)** - EBS, EFS, FSx, Storage Gateway, Backup, Disaster Recovery, Snow Family
- **[Security](getnexo-site/docs/aws-security.md)** - IAM, STS, Organizations, Control Tower, Config, Trusted Advisor
- **[Billing](getnexo-site/docs/aws-billing.md)** - Marketplace, Cost Explorer, Budgets, Savings Plans, Reserved Instances
- **[Management](getnexo-site/docs/aws-management.md)** - Systems Manager, OpsWorks, Elastic Beanstalk, CloudFormation
- **[Messaging](getnexo-site/docs/aws-messaging.md)** - SES, SNS, SQS, EventBridge
- **[Monitoring](getnexo-site/docs/aws-monitoring.md)** - CloudWatch, X-Ray

### 📊 Documentação Técnica Adicional
- **[Admin Spec](docs/technical_reference/ADMIN_SPEC.md)** - Especificações admin
- **[Domínio Cloudflare](docs/technical_reference/DOMINIO_CLOUDFLARE.md)** - Configuração domínio
- **[Integrações E-commerce](docs/technical_reference/ECOMMERCE_INTEGRATIONS.md)** - Integrações e-commerce
- **[NexoGuard Prompts](docs/technical_reference/NEXOGUARD_PROMPTS.md)** - Prompts IA
- **[SEO Spec](docs/technical_reference/SEO_SPEC.md)** - Especificações SEO

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
# Banco de dados
DATABASE_URL=postgresql://user:pass@localhost:5432/getnexo

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# IA
ANTHROPIC_API_KEY=your-claude-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e

# Load testing
npm run test:load
```

## 📊 Monitoramento

### Dashboards
- **Grafana**: http://localhost:3001 (métricas de sistema)
- **Admin Panel**: `/admin` (métricas de negócio)

### Logs
```bash
# Visualizar logs em tempo real
npm run logs

# Logs de erro
npm run logs:error

# Logs de performance
npm run logs:perf
```

## 🚢 Deploy

### Docker
```bash
# Build da imagem
docker build -t getnexo .

# Executar container
docker run -p 3000:3000 getnexo
```

### Kubernetes
```bash
# Aplicar manifests
kubectl apply -f k8s/

# Verificar status
kubectl get pods
```

### Vercel/Netlify
```bash
# Deploy automático via Git
git push origin main
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- **ESLint + Prettier** para formatação
- **Conventional Commits** para mensagens
- **Testes obrigatórios** para novas funcionalidades
- **Documentação** atualizada

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **📧 Email**: suporte@getnexo.com
- **💬 Discord**: [GetNexo Community](https://discord.gg/getnexo)
- **🐛 Issues**: [GitHub Issues](https://github.com/getnexo/platform/issues)
- **📖 Docs**: [Documentação Completa](docs/)

## 🙏 Agradecimentos

- **Astro** por um framework web incrível
- **Claude-3** por capacidades de IA avançadas
- **Comunidade Open Source** por ferramentas essenciais
- **Contribuintes** por melhorarem continuamente a plataforma

---

**🎯 GetNexo Platform - Construindo o futuro da automação enterprise**

*Feito com ❤️ pela equipe GetNexo*