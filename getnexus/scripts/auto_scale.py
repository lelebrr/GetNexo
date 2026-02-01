import docker
import sqlite3
import os
import time
from datetime import datetime

# Script robusto de auto-escala
# Roda via Cron ou loop contínuo

db_path = os.path.join(os.path.dirname(__file__), '../api-central/getnexo.db')
client = docker.from_env()

def get_stats(container):
    stats = container.stats(stream=False)
    # CPU calculation
    cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats['precpu_stats']['cpu_usage']['total_usage']
    system_delta = stats['cpu_stats']['system_cpu_usage'] - stats['precpu_stats']['system_cpu_usage']
    num_cpus = stats['cpu_stats']['online_cpus']
    
    cpu_percent = (cpu_delta / system_delta) * num_cpus * 100.0 if system_delta > 0 else 0.0
    mem_mb = stats['memory_stats']['usage'] / 1024**2
    return cpu_percent, mem_mb

def scale_container(client_id, current_mem, current_cpu):
    print(f"--> Escalando {client_id}... (CPU: {current_cpu:.1f}%, Mem: {current_mem:.1f}MB)")
    # Logic to update docker-compose or use docker.update()
    # For Swarm/K8s usage pods would be better, but here we update resources.
    try:
        cont = client.containers.get(f"{client_id}-bot")
        # Update memory limit directly via Docker API
        new_limit = int((current_mem + 512) * 1024 * 1024)
        cont.update(mem_limit=new_limit, mem_reservation=int(new_limit/2))
        print(f"✅ {client_id} escalado para {current_mem+512}MB")
        return True
    except Exception as e:
        print(f"❌ Erro ao escalar {client_id}: {e}")
        return False

def main():
    while True:
        print(f"[{datetime.now()}] Verificando carga...")
        for cont in client.containers.list():
            if '-bot' in cont.name:
                client_id = cont.name.split('-')[0]
                try:
                    cpu, mem = get_stats(cont)
                    
                    # Thresholds
                    if cpu > 80 or mem > 400:
                        scale_container(client_id, mem, cpu)
                        
                    # Sync with DB
                    conn = sqlite3.connect(db_path)
                    c = conn.cursor()
                    c.execute("INSERT OR REPLACE INTO client_usage (client_id, memory_used, status, last_update) VALUES (?, ?, ?, ?)",
                              (client_id, int(mem), 'ativo', datetime.now().isoformat()))
                    conn.commit()
                    conn.close()
                except Exception as e:
                    print(f"Erro em {cont.name}: {e}")
        
        time.sleep(60) # Intervalo de 1 minuto

if __name__ == "__main__":
    main()
