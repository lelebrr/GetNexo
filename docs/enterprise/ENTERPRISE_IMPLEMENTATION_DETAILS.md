# Enterprise Implementation Details

This document tracks the technical specifics of the Phase 2 implementation for manual review/debugging.

## 1. Scripts
| Script | Path | Function | Status |
| :--- | :--- | :--- | :--- |
| **Host Tuning** | `scripts/production_tuning.sh` | ZRAM, Sysctl, THP | ⚠️ Needs `sudo` |
| **Fail2Ban** | `scripts/fail2ban_setup.sh` | SSH Protection | ⚠️ Needs `sudo` |
| **Provisioning** | `scripts/provision_client.sh` | Create DB/User | ✅ Ready |
| **n8n GC** | `scripts/n8n_gc.sh` | Clean Logs | ✅ Ready |
| **Auto-Scale** | `scripts/auto_scale_monitor.sh` | Monitor Resources | ✅ Ready |
| **White Label** | `scripts/whitelabel_setup.sh` | Generate CSS/Assets | ✅ Ready |
| **Air-Gap Backup** | `scripts/airgap_backup.sh` | AES-256 Encrypt | ✅ Ready |
| **Canary Token** | `scripts/canary_deploy.sh` | Breach Detection | ✅ Ready |
| **Compliance** | `scripts/compliance_audit.sh` | LGPD Checker | ✅ Ready |
| **SSL Mock** | `scripts/ssl_cert_mock.sh` | Sim CertBot | ✅ Ready |
| **Quantum Keys** | `scripts/quantum_keygen.py` | Kyber-1024 Gen | ✅ Ready |

## 2. New Containers
| Service | Image | Port | Role |
| :--- | :--- | :--- | :--- |
| `vault` | `hashicorp/vault` | 8200 | Secret Management |
| `docker_gc` | `clockworksoul/docker-gc-cron` | - | Auto-Prune Images |
| `ssh_honeypot` | `cowrie/cowrie` | 2222 | Trap attackers |
| `landing_page` | `nginx:alpine` | 80/443 | Static Website |
| `wazuh_agent` | `wazuh/wazuh-agent:4.7.2` | - | **Disabled** (Needs Manager) |

## 3. Workflows (n8n)
- **#23 Revenda**: Calculates commission.
- **#24 License**: Validates API usage.
- **#25 Admin Panel**: Provisions clients via Form.
- **#26 Cart Push**: Recovers sales.
- **#27 Billing**: Generates invoices.
- **#28 Wearable**: Push to Apple Watch.

## 4. Assets & Contracts
- `docs/manifest.json`: PWA Config.
- `docs/roadmap.html`: Vision Page.
- `docs/foundation.html`: Legacy/Museum Page.
- `docs/contracts/NexoLoyalty.sol`: Smart Contract.
