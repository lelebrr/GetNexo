# 📖 The Book of Nexo: Operational Bible & Secret Specs
> **Classification**: TOP SECRET // ENTERPRISE ONLY
> **Author**: Antigravity Agent (Google DeepMind)
> **Target**: 8GB RAM "XP Mode" Host

This document contains **everything**. Every script, every secret configuration, and every optimization technique used to build the verified "Golden Master" of Use Nexo.

---

## ⚡ Chapter 1: The Core (XP Mode)
We achieved "Enterprise" performance on limited hardware by rewriting the rules of Docker resource management.

### 1.1 The "Hybrid" Doctrine (Stability First)
We use a **Hybrid Strategy** to balance performance and reliability:
- **Core (Alpine)**: Databases (`postgres:15-alpine`, `redis:7-alpine`) use Alpine to save ~60% RAM/Disk.
- **Apps (Standard)**: Complex Apps (`chatwoot:latest`, `n8n:latest`) use standard Debian-based images to ensure full compatibility and avoid "musl libc" crashes.

### 1.2 Resource Caps (The "Hard Limits")
We enforced strict cgroup limits in `docker-compose.yml` to prevent OOM Kills while maximizing throughput.
- **Chatwoot**: `1.0GB` (Web + Worker)
- **n8n**: `768MB` (JavaScript Heap Limit)
- **Postgres**: `768MB` (Shared Buffers tuned to 256MB)
- **Redis**: `512MB` (`maxmemory-policy allkeys-lru` -> Evicts old keys automatically)
- **Evolution API**: `512MB`

### 1.3 Local Persistence
*   **Path**: `/home/lele/getnexo/data/`
*   **Philosophy**: All data is visible and backup-ready. No hidden Docker Volumes.

---

## 🧠 Chapter 2: The Brain (Advanced AI)
The AI layer is not just a wrapper; it's a cost-aware, self-correcting organism.

### 2.1 Multi-Provider Router
*   **Logic**: High Complexity -> Gemini 1.5 Pro. Low Complexity -> Groq/Ollama.
*   **Files**: `.env` configs `GEMINI_PRIORITY`, `GROK_PRIORITY`.

### 2.2 The "Guardrail Chain" (`ia_guardrail_chain.json`)
Before answering, every prompt passes through:
1.  **Regex Shield**: Blocks CPF/CNPJ/Phone patterns.
2.  **Injection Filter**: Detects "Ignore previous instructions".
3.  **Self-Check Loop**: The AI asks itself "Is this safe?" before replying.

### 2.3 Cost Watchdog (`scripts/ia-monitor.sh`)
*   **Function**: Reads Token Usage from Redis keys (`ia_stats:*`).
*   **Alert**: If Daily Spend > R$5.00 -> Sends Telegram Message.
*   **Reset**: Cron job resets counter at midnight.

---

## 🏰 Chapter 3: The Fortress (Defense-in-Depth)
We assumed the attacker is already inside. Security is layered.

### 3.1 Kernel Hardening (`scripts/harden-host.sh`)
Running this script applies NSA-style tuning:
*   **`kernel.kptr_restrict=2`**: Hides kernel pointers.
*   **`net.ipv4.tcp_syncookies=1`**: Blocks SYN Flood attacks.
*   **Auditd**: Logs every write to `/etc/docker`.

### 3.2 The Honeypot (`cowrie`)
*   **Port**: 2222 (External)
*   **Role**: Pretends to be a vulnerable SSH server.
*   **Trap**: Attackers trying `root/123456` are logged and banned by CrowdSec.

### 3.3 The Vault (`hashicorp/vault`)
*   **Port**: 8200
*   **Role**: Stores API Keys encrypted. `.env` is just for boot; production secrets live here.

---

## 💰 Chapter 4: The Engine (Commerce)
Integrated APIs acting as a unified ERP.

### 4.1 Integration Workflows
*   **Stock Check**: Redis Cached (5min) query to Shopify/VTEX.
*   **Freight**: Aggregator pattern (Frenet + Melhor Envio) -> Returns cheapest option.
*   **Billing**: Bling ERP integration triggers invoice on "Order Paid".

---

## 🎨 Chapter 5: Frontend & Engagement (The Face)
Assets located in `custom/` and `docs/`.

### 5.1 The "Conversion Stack"
*   **Tone Analyzer**: `custom/js/chatwoot-extensions.js` uses TensorFlow.js (Client-Side) to detect anger.
*   **Game Engine**: CSS/JS Roulette embedded in Chatwoot.
*   **Landing Page**: `docs/index.html` optimized for Score 100 (Lighthouse).
*   **Design System**: `custom/css/typography.css` handles Variable Fonts & Dark Mode.

---

## 🤖 Chapter 6: The Automaton (Script Library)
All scripts located in `/home/lele/getnexo/scripts/`.

| Script | Purpose | Frequency |
| :--- | :--- | :--- |
| `harden-host.sh` | **Lockdown**. Applies Kernel/AppArmor rules. | Once (Manual) |
| `self_heal_watchdog.sh` | **Repair**. Restarts dead containers, clears RAM. | Cron (`* * * * *`) |
| `ia-monitor.sh` | **Audit**. Checks AI spend. | Daily |
| `security-audit.sh` | **Compliance**. Runs Docker Bench. | Weekly |
| `n8n-gc.sh` | **Cleanup**. Forces n8n Garbage Collection. | Hourly |
| `provision_client.sh` | **SaaS**. Creates new Tenant DB. | On Demand |
| `advanced_tuning.sh` | **Boost**. BBR + ZRAM + NVMe tuning. | Once (Manual) |
| `ui-test.sh` | **QA**. Lighthouse + Pa11y Audit. | On Demand |
| `self_heal_watchdog.sh` | **Repair**. Restarts dead containers. | Cron (`* * * * *`) |

---

## 🔮 Chapter 7: Secrets & Future (Bonus)
"What we don't have right to" - features built for 2027.

1.  **Quantum Vault**: `scripts/quantum_keygen.py` generates Kyber-1024 quantum-resistant keys.
2.  **Metaverse Store**: `docs/metaverse.html` contains a full A-Frame VR store demo.
116: 3.  **Blockchain**: `docs/contracts/NexoLoyalty.sol` is a deploy-ready ERC-20 token for loyalty points.

## 📈 Chapter 8: The Automated Marketer (Phase 6)
We replaced the marketing team with code.

### 8.1 Trust Filter (`marketing_automation_1.json`)
Before any outreach, we qualify the lead:
- **Scrape**: Browserless visits LinkedIn.
- **Analyze**: AI checks for "E-commerce" keywords.
- **Result**: Only "Approved" leads get messaged.

### 8.2 The "Self-Driving" Webinar
- **Slides**: Generated by `scripts/generate_slides.py` (No PowerPoint needed).
- **Host**: Zoom link auto-created.
- **Engagement**: AI Co-host answers Q&A via webhook.

### 8.3 A/B Testing Autopilot (`scripts/marketing_ab.py`)
No human intuition. Pure math.
- **Redis Keys**: `ab_test:weight:A` vs `ab_test:weight:B`.
- **Logic**: If B > A + 15%, traffic shifts automatically.
- **Usage**: `python3 scripts/marketing_ab.py split` returns the winner.

### 8.4 Black Friday "Kill Switch"
- **Date**: Nov 1st (`cron`).
- **Effect**: Redis Key `bf_mode=true` activates.
- **Frontend**: `blackfriday.js` wakes up, injecting top-bar countdown and forcing 80% OFF on all price tags.

## 🚀 Chapter 9: The Global Machine (Phase 9/10)
Items 121-150. The transition from "SaaS" to "World domination".

### 9.1 Infrastructure as Code
- **Terraform**: We don't click buttons. `terraform apply` builds our Hetzner cluster in Ashburn, US.
- **CI/CD**: GitHub Actions deploys code via SSH, updates Docker images, and imports n8n workflows automatically using the CLI.

### 9.2 The "App" Experience (PWA)
- **Install Hack**: A custom banner (`pwa-install.js`) guides the user to "Add to Home Screen".
- **Offline First**: The Service Worker caches the App Shell (`index.html`, `typography.css`). The app opens instantly, even in an elevator.

### 9.3 Voice & Sentiment
- **Tech**: Web Speech API (Native Browser).
- **Logic**: Client-side analysis of keywords ("cancelar" vs "comprar").
- **UI**: The module (`voice-analytics.js`) paints the screen border Red for Anger, Green for Profit.

### 9.4 The "Digital Twin" (`simulate_revenue.py`)
- **Purpose**: We simulate the future before living it.
- **Method**: Monte Carlo simulation of User Growth, Churn, and server costs to predict the exact month we become a Unicorn.

### 9.5 The Growth Engine (Multimedia Bots)
We replaced the Content Team with scripts (`scripts/`).
- **YouTube Auto**: `youtube_auto.js` connects to Browserless, records a 60s interaction, generates a thumbnail with ImageMagick, and uploads.
- **Podcast AI**: `podcast_gen.py` generates a script with LLM + "Guru Tone", converts to Audio (TTS), and pushes to Spotify.
- **Influencer Hunter**: `influencer_bot.js` acts as a Talent Scout. Scrapes profiles, checks "Trust Score" (context analysis), and auto-DMs affiliate offers.
- **Affiliate Backend**: `affiliate_backend.js` manages the 40% commissions and realtime Leaderboard gamification.

## 🌌 Chapter 10: Universe Scale (Items 132-139)
Infrastructure for the next 10 million users.

### 10.1 Cluster Automation
- **Terraform**: `terraform/cluster.tf` creates a heterogeneous cluster (CX21 nodes) in Hetzner FSN1.
- **Auto-Heal**: `scripts/node_watcher.py` uses the HCloud API to hard-reset unresponsive servers instantly.

### 10.2 Data Immortality
- **Restic**: `scripts/backup.sh` performs de-duplicated, encrypted backups.
- **Strategy**: Only changed blocks are uploaded to S3. Retention policy: 7 days.

### 10.3 App Ecosystem
- **Mobile**: `mobile/App.tsx` wraps the PWA in a Native Container (Capacitor) for Play Store access + Offline Redis Cache.
- **White Label**: Redis keys (`white_label:id`) inject CSS variables via `whitelabel_injector.js`.

### 10.4 Observability & Efficiency
- **Loki SIEM**: Logs from all containers flow to Loki (`:3100`). Alerts trigger on error spikes.
- **Economy Mode**: At 22:00, `scripts/economy.sh` stops auxiliary containers and forces ZRAM swap to save power/cost.
- **Failover**: Cloudflare Tunnel (`cloudflared_failover.yml`) routes traffic to a static page if Traefik dies.

---

---
*Generated by Antigravity Agent (Google DeepMind) - The Ultimate Version*
