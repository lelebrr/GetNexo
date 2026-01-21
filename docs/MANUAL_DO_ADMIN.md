# Manual do Administrador - GetNexo

## 1. Visão Geral
O painel administrativo do GetNexo permite o gerenciamento completo da plataforma, desde a configuração de IAs até o acompanhamento de vendas e suporte.

## 2. Acesso
- **URL**: `/admin/login`
- **Credenciais**: Seu email e senha cadastrados.

## 3. Funcionalidades Principais

### Dashboard
- Visão geral de métricas.
- Status do sistema.

### Notificações (Live Pulse)
- **Comportamento Padrão**: Visitantes do site veem notificações de "Atividade de IA" (popping up no canto inferior).
- **Modo Admin/Reseller**: Ao fazer login, o sistema detecta seu `omnichat_token` e **automaticamente desativa** essas notificações para não atrapalhar sua navegação.

### Produtos e Conteúdo
- O site reflete em tempo real as alterações no código (graças ao modo Development ativo no Docker).
- Edições em `src/pages/produtos/*.astro` são visíveis imediatamente após salvar.

### APIs e Configurações
- **API de Configuração**: `/api/config` - Gerencie configurações globais e por usuário
- **API de ML**: `/api/ml` - Monitore e teste modelos de machine learning
- **API de Backup**: `/api/backup` - Faça backup e restauração de dados

### Gamificação e Usuários
- **Dashboard de Gamificação**: Acompanhe pontos, níveis e conquistas dos usuários
- **Sistema de Pontos**: Configure regras de pontuação automática
- **Leaderboard**: Monitore rankings e torneios

### Chat e Comunicação
- **Salas de Chat**: Gerencie salas de chat multi-usuário
- **Videochamadas**: Monitore sessões de videochamada
- **Bot de Chat**: Configure respostas automáticas e integração com IA

## 4. Solução de Problemas Comuns
- **Conteúdo Desatualizado**: Se o site parecer "velho", verifique se o container está rodando: `docker logs -f getnexo-frontend-1`.
- **Erro de Login**: Limpe o Cache/LocalStorage se tiver problemas de permissão.
