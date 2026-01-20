# GetNexo Scalability Guide: From VPS to 10k Users

This document outlines the path to scale GetNexo from a single Docker VPS to a high-availability Cluster (Swarm or Kubernetes).

## 1. Phase 1: Single VPS (Current) - Up to 1k Users
**Infrastructure:**
- 1x VPS (4GB RAM, 2 vCPU) e.g., Hetzner CPX31 or DigitalOcean Droplet
- Docker Compose (All-in-one)

**Bottlenecks:**
- **Node.js (Backend)**: Single thread limit. If CPU > 80%, chat lags.
- **PostgreSQL**: Disk I/O.
- **WhatsApp (Evolution)**: One instance can handle ~50-100 heavily active numbers.

**Optimization Actions:**
- **PM2**: Run backend in cluster mode inside container:
  `pm2 start server.js -i max`
- **Redis**: Offload all session/queue data to Redis (already done).

---

## 2. Phase 2: Vertical Split (2-3 Servers) - Up to 5k Users
**Strategy**: Separate stateful (DB) from stateless (App).

- **Server A (App)**: Frontend + Backend + N8N
- **Server B (Data)**: PostgreSQL + Redis (Managed Database is better)
- **Server C (WhatsApp)**: Dedicated Evolution API cluster

**Configuration Change:**
- In `docker-compose.yml`, replace local DB services with external IP/URI.
- Use **Traefik** or Cloudflare Load Balancer to distribute traffic if adding more App servers.

---

## 3. Phase 3: Horizontal Scale (Docker Swarm / K8s) - 10k+ Users
**Strategy**: Auto-scaling containers based on CPU usage.

### Option A: Docker Swarm (Simpler, Cheaper)
1. **Init Swarm**: `docker swarm init` on Leader.
2. **Join Workers**: `docker swarm join ...` on 2-3 other VPS.
3. **Deploy Stack**:
   ```bash
   docker stack deploy -c docker-compose.yml getnexo
   ```
4. **Replicas**:
   Edit `docker-compose.yml` to add deploy keys:
   ```yaml
   services:
     backend:
       deploy:
         replicas: 3
         restart_policy:
           condition: on-failure
   ```

### Option B: Kubernetes (Standard Enterprise)
**Recommended for >10k users or $50k+ MRR.**
1. **Cluster**: Use managed GKE (Google) or DOKS (DigitalOcean).
2. **Manifests**: Convert Compose to Helm Charts.
3. **Ingress**: Nginx Ingress Controller handling SSL termination.
4. **Horizontal Pod Autoscaler (HPA)**:
   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: backend-hpa
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: backend
     minReplicas: 3
     maxReplicas: 20
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 60
   ```

---

## 4. Database Scaling
- **Read Replicas**: 1 Master (Write), 2+ Slaves (Read).
- **Pooling**: Use `PgBouncer` to manage connections (Node.js opens too many).
- **Backups**: Continuous archiving (WAL-G) to S3.

## 5. Global Caching (CDN)
- **Cloudflare**: Cache all static assets (JS, CSS, Images).
- **Edge Functions**: Move basic auth/routing logic to Cloudflare Workers to reduce hit on origin.
