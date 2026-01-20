# 🌐 Guia de Conexão: Registro.br + Cloudflare Tunnel
**Cenário**: Você tem o domínio (ex: `getnexo.com.br`) e o servidor (seu PC/VPS com Docker), mas **não tem hospedagem** tradicional (cPanel, Hostgator, etc).

Nós vamos usar a tecnologia **Cloudflare Tunnel**. Ela cria um tubo seguro e criptografado direto do seu servidor para a internet, sem precisar abrir portas no roteador.

---

## Passo 1: Configurar a Cloudflare (O "Gerente")
1.  Crie uma conta em [dash.cloudflare.com](https://dash.cloudflare.com/).
2.  Clique em **"Add a Site"** e digite seu domínio (ex: `getnexo.com.br`).
3.  Escolha o plano **Free** (Grátis).
4.  A Cloudflare vai te dar dois "Nameservers" (Servidores DNS). Eles parecem com isso:
    *   `ellen.ns.cloudflare.com`
    *   `ross.ns.cloudflare.com`
    *   *(Os nomes mudam, copie os que aparecerem para você)*.

---

## Passo 2: Configurar o Registro.br (O "Dono")
1.  Acesse [registro.br](https://registro.br) e logue.
2.  Clique no seu domínio.
3.  Vá até a seção **DNS** e clique em **"Alterar Servidores DNS"**.
4.  No **Master**, cole o primeiro nameserver da Cloudflare (ex: `ellen...`).
5.  No **Slave 1**, cole o segundo (ex: `ross...`).
6.  Salve.
    *   *Nota: Pode levar de 1 a 24h para propagar, mas geralmente é rápido.*

---

## Passo 3: Criar o Túnel (A "Ponte")
Agora vamos conectar seu Docker com a Cloudflare.

1.  No painel da Cloudflare, vá no menu lateral esquerdo: **Zero Trust**.
2.  Se for o primeiro acesso, ele pedirá para criar um time (coloque qualquer nome).
3.  Vá em **Networks > Tunnels**.
4.  Clique em **"Create a Tunnel"**.
5.  Escolha **"Cloudflared"** (Select).
6.  Dê um nome para o túnel (ex: `getnexo-server`) e salve.
7.  **IMPORTANTE**: Na próxima tela ("Install and run a connector"), você verá um comando enorme. **Nós só precisamos do TOKEN**.
    *   O comando será algo como: `cloudflared.exe service install eyJhIjoiM...`
    *   Copie **apenas o código gigante** que começa com `eyJh...`. Isso é seu **TUNNEL_TOKEN**.

---

## Passo 4: Conectar seu Servidor
1.  Abra seu arquivo `.env` no servidor:
    ```bash
    nano /home/lele/getnexo/.env
    ```
2.  Procure a linha `CLOUDFLARED_TOKEN=...` e cole seu token gigante ali.
    ```env
    CLOUDFLARED_TOKEN=eyJhIjoiM2MwNz...
    ```
3.  Salve (`Ctrl+O`, `Enter`) e saia (`Ctrl+X`).
4.  Reinicie o container do túnel:
    ```bash
    docker compose up -d --force-recreate cloudflared
    ```
5.  Volte no site da Cloudflare Zero Trust. Você deve ver o status do túnel ficar **"HEALTHY"** (Verde).

---

## Passo 5: Apontar os Domínios (Rotas Públicas)
Ainda no painel **Zero Trust > Tunnels > Seu Túnel > Configure > Public Hostname**:

Você vai adicionar "Subdomínios" para cada serviço do GetNexo.

| Subdomain | Domain | Service | URL (Container) |
| :--- | :--- | :--- | :--- |
| `@` (Deixe vazio) | `getnexo.com.br` | HTTP | `landing_page:80` |
| `api` | `getnexo.com.br` | HTTP | `evolution_api:8080` |
| `n8n` | `getnexo.com.br` | HTTP | `n8n:5678` |
| `chat` | `getnexo.com.br` | HTTP | `chatwoot:3000` |
| `auth` | `getnexo.com.br` | HTTP | `keycloak:8080` |
| `dashboard` | `getnexo.com.br` | HTTP | `traefik:8080` |

**Como fazer (Exemplo para o Site Principal):**
1.  **Subdomain**: Deixe em branco (para usar `getnexo.com.br`).
2.  **Domain**: Selecione seu domínio.
3.  **Type**: `HTTP`.
4.  **URL**: `landing_page:80` (Usamos o nome do container docker).
5.  **Save hostname**.

**Repita para o n8n:**
1.  **Subdomain**: `n8n`.
2.  **Type**: `HTTP`.
3.  **URL**: `n8n:5678`.
4.  **Save**.

---

### ✅ Pronto!
Agora, quando alguém digitar `getnexo.com.br`, a Cloudflare recebe, joga pelo túnel criptografado, e seu Docker entrega a página. Sem abrir portas, sem pagar hospedagem extra, e com SSL (Cadeado) automático.
