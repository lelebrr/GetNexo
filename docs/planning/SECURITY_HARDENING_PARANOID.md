# 🛡️ Hardening de Segurança "Paranóica"

**Origem**: Lista "Modo Paranoia" (Janeiro 2026).
**Objetivo**: Blindar a infraestrutura contra ataques externos e internos.

## 1. Sistema Operacional (Host)

-   **SELinux/AppArmor**: Enforcing mode. Perfis customizados para containers (só acessa o necessário).
-   **SSH**:
    -   Root login: `no`.
    -   Password auth: `no` (Apenas chaves).
    -   Porta: Alterar padrão (ex: 2222).
-   **Kernel**: `kernel.kptr_restrict=1` (Esconde endereços de memória).
-   **Firewall (UFW)**: Whitelist estrita. Bloquear tudo, liberar apenas 80, 443 e porta VPN (Wireguard/Tailscale).
-   **Auditd**: Monitoramento de acesso a arquivos críticos (`/etc`, `/var/lib/docker`).
-   **ICMP**: Desligar ping (`net.ipv4.icmp_echo_ignore_all`).

## 2. Docker & Containers

-   **Segredos**: Nada de `.env` em claro. Usar Docker Secrets ou Vault.
-   **Imagens**: Scan obrigatório com Trivy. Baixar apenas de Official Hub.
-   **Mounts**: `nosuid`, `nodev`, `noexec` em todos os volumes possíveis.
-   **User**: Rodar containers como non-root user.
-   **Rede**:
    -   `127.0.0.1` binding para Redis/Postgres (nunca `0.0.0.0`).
    -   Redes isoladas (Frontend não fala com Database direto).

## 3. Aplicação e Serviços

-   **Senhas**: Geradas com `openssl rand -hex 32`.
-   **Evolution API**: Desligar webhooks externos, aceitar apenas IP do n8n interno.
-   **API Keys**: Rotação por sessão (Gemini/Groq).
-   **Honeypot**: Container 'decoy' (falsa API de pagamentos) para atrair scanners.
-   **Debug**: Desligar `DEBUG=true` em todos os ambientes de produção.

## 4. Monitoramento e Resposta

-   **Wazuh**: Agente HIDS para detecção de intrusão no host.
-   **Snort**: IDS para detecção de padrões de ataque (SQLi) na rede.
-   **CrowdSec**: Bouncer no Nginx/Traefik (bloqueia IP após 3 erros).
-   **Saneamento**: Script diário que busca e apaga senhas vazadas em logs.
-   **Kill-all.sh**: "Botão de Pânico" que corta rede e desliga containers em caso de breach confirmado.
