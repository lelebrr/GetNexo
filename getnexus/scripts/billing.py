import sqlite3
import os
from datetime import datetime

# Adjust path to DB
db_path = os.path.join(os.path.dirname(__file__), '../api-central/getnexo.db')
conn = sqlite3.connect(db_path)
c = conn.cursor()

mes = datetime.now().strftime('%Y-%m')

c.execute('SELECT client_id, memory_used FROM client_usage')
for row in c.fetchall():
    client_id, mem = row
    if mem > 1024:
        extra_mb = mem - 1024
        valor = round(extra_mb * 0.02, 2)
        c.execute('INSERT INTO billing_history (client_id, mes, valor_extra) VALUES (?, ?, ?)',
                  (client_id, mes, valor))
        conn.commit()
        print(f"Gerada cobrança extra R$ {valor} para {client_id}")

conn.close()
