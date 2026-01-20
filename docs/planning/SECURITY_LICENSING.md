# 🔐 Segurança Avançada & Licenciamento (Anti-Tamper)

**Origem**: Estratégia de proteção de IP e Revenda (Janeiro 2026).
**Objetivo**: Garantir que o sistema não seja clonado, revendido sem autorização ou rodado fora do controle central.

## 1. Camadas de Proteção

### 1.1 Código Compilado
-   **Técnica**: Distribuir apenas binários ou bytecode ofuscado.
-   **Node.js**: `.js` vira binário `.node` (usando `pkg` ou compilador nativo).
-   **Ruby/Python**: Compilar para `.so` / `.pyc` ofuscado.
-   **Objetivo**: Impedir edição e leitura fácil do código fonte.

### 1.2 Validação de Inicialização (Heartbeat)
-   **Entrypoint**: Todo container, ao iniciar, faz um POST para o servidor de licença (`controle.leandrosys.com`).
-   **Payload**: `{ id: client_id, hash: SHA256_do_binario }`.
-   **Checagem**: Se o hash não bater (código alterado) ou ID for inválido, o processo morre imediatamente.

### 1.3 Serverless Checker & IP Dinâmico
-   O binário não aponta para um IP fixo.
-   Aponta para um domínio gerido via Cloudflare DNS API.
-   O IP de resposta muda frequentemente. Se tentarem burlar o DNS localmente (`/etc/hosts`), o IP estará errado em pouco tempo.

### 1.4 Assinatura Digital (RSA)
-   Arquivo `sig.bin` presente no container, assinado com chave privada do mestre.
-   **Startup**: Código verifica assinatura com chave pública embutida.
-   **Efeito**: Se copiarem o container para outro lugar, a assinatura não bate com o ambiente/hardware, gerando "Erro de Licença".

## 2. Controle de Ciclo de Vida

### 2.1 Expiração Embutida
-   Data de validade hardcoded no binário ou memória.
-   **Renovação**: O heartbeat bem-sucedido renova o token por +30 dias.
-   **Falha**: Sem internet ou sem validação por 30 dias, o sistema desliga.

### 2.2 Kill-Switch Reverso
-   **Lógica**: O sistema precisa receber um sinal "CONTINUE" do servidor.
-   **Sem sinal**: Entra em modo `Read-Only` (abre mas não funciona) ou exibe tela de bloqueio.
-   **Mensagem**: "Sistema bloqueado. Contate suporte para reativação."

### 2.3 Trava de Domínio
-   Hardcoded: O sistema só inicia se o hostname for `*.leandrosys.app` (ou o domínio autorizado).
-   Se tentarem rodar em `cliente-pirata.com.br`, falha a autenticação interna.

### 2.4 Criptografia de Volume (Docker)
-   `docker-compose.yml` e volumes sensíveis criptografados.
-   **Decriptação**: A senha/chave vem do servidor de licença no momento do boot (payload de resposta do heartbeat).
-   **Sem validação**: O volume não monta, o sistema não tem dados.

## 3. Implementação Prática

Criar um `loader` criptografado que atua como entrypoint dos containers críticos (n8n, chatwoot-backend). Esse loader faz todas as verificações acima antes de entregar o controle para a aplicação real.
