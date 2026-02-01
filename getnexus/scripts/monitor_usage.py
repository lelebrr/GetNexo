import docker
import sqlite3
from datetime import datetime
import os

client = docker.from_env()
# Adjust path to DB
db_path = os.path.join(os.path.dirname(__file__), '../api-central/getnexo.db')
conn = sqlite3.connect(db_path)
c = conn.cursor()

# Ensure table exists (though api-central should have created it)
c.execute('''CREATE TABLE IF NOT EXISTS client_usage (
    client_id TEXT PRIMARY KEY,
    memory_used INTEGER,
    messages_last_24h INTEGER,
    status TEXT,
    last_update TEXT
)''')

for cont in client.containers.list():
    if '-bot' in cont.name:
        client_id = cont.name.split('-')[0]
        try:
            stats = cont.stats(stream=False)
            # cpu logic skipped for simplicity here
            mem = stats['memory_stats']['usage'] / 1024**2
            
            # Upsert
            c.execute('''INSERT OR REPLACE INTO client_usage 
                (client_id, memory_used, messages_last_24h, status, last_update) 
                VALUES (?, ?, ?, ?, ?)''',
                (client_id, int(mem), 0, 'ativo' if cont.status == 'running' else 'parado', datetime.now().isoformat()))
            conn.commit()
        except Exception as e:
            print(f"Error reading stats for {cont.name}: {e}")

conn.close()
print("Uso atualizado")
