#!/usr/bin/env python3
"""
GetNexo Supply Oracle - Algoritmo Preditivo de Estoque
Sistema inteligente de gestão de inventário com predições de reposição automática
"""

import os
import json
import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from collections import defaultdict
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class SupplyOracle:
    def __init__(self):
        self.db_path = 'data/supply_oracle.db'
        self.alerts_config = {
            'low_stock_threshold': 0.1,  # 10% do estoque ideal
            'lead_time_days': 7,
            'safety_stock_days': 14,
            'reorder_point_multiplier': 1.5,
            'max_stock_days': 90
        }

        self.suppliers = {
            'local': {'lead_time': 3, 'reliability': 0.95, 'cost_multiplier': 1.0},
            'national': {'lead_time': 7, 'reliability': 0.88, 'cost_multiplier': 1.2},
            'international': {'lead_time': 21, 'reliability': 0.75, 'cost_multiplier': 1.8}
        }

        self._init_database()

    def _init_database(self):
        """Inicializa banco de dados SQLite"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Tabela de produtos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT,
                unit_cost REAL,
                selling_price REAL,
                supplier TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Tabela de movimento de estoque
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS inventory_movements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT,
                movement_type TEXT, -- 'sale', 'purchase', 'adjustment', 'return'
                quantity INTEGER,
                unit_cost REAL,
                total_value REAL,
                reference TEXT, -- order_id, invoice_number, etc.
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')

        # Tabela de níveis atuais de estoque
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS current_stock (
                product_id TEXT PRIMARY KEY,
                quantity INTEGER DEFAULT 0,
                min_stock INTEGER DEFAULT 0,
                max_stock INTEGER DEFAULT 1000,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')

        # Tabela de alertas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT,
                alert_type TEXT, -- 'low_stock', 'overstock', 'expiring', 'reorder'
                message TEXT,
                severity TEXT, -- 'low', 'medium', 'high', 'critical'
                status TEXT DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resolved_at TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')

        conn.commit()
        conn.close()

    def add_product(self, product_id, name, category, unit_cost, selling_price, supplier='local', min_stock=10, max_stock=1000):
        """Adiciona novo produto ao sistema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Inserir produto
        cursor.execute('''
            INSERT OR REPLACE INTO products
            (id, name, category, unit_cost, selling_price, supplier)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (product_id, name, category, unit_cost, selling_price, supplier))

        # Inserir nível inicial de estoque
        cursor.execute('''
            INSERT OR REPLACE INTO current_stock
            (product_id, quantity, min_stock, max_stock)
            VALUES (?, 0, ?, ?)
        ''', (product_id, min_stock, max_stock))

        conn.commit()
        conn.close()

        print(f"✅ Produto {name} ({product_id}) adicionado ao Supply Oracle")

    def record_movement(self, product_id, movement_type, quantity, unit_cost=None, reference=None):
        """Registra movimento de estoque"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Verificar se produto existe
        cursor.execute('SELECT unit_cost FROM products WHERE id = ?', (product_id,))
        result = cursor.fetchone()
        if not result:
            raise Exception(f"Produto {product_id} não encontrado")

        if unit_cost is None:
            unit_cost = result[0]

        total_value = quantity * unit_cost

        # Registrar movimento
        cursor.execute('''
            INSERT INTO inventory_movements
            (product_id, movement_type, quantity, unit_cost, total_value, reference)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (product_id, movement_type, quantity, unit_cost, total_value, reference))

        # Atualizar estoque atual
        if movement_type in ['purchase', 'return', 'adjustment']:
            cursor.execute('''
                UPDATE current_stock
                SET quantity = quantity + ?, last_updated = CURRENT_TIMESTAMP
                WHERE product_id = ?
            ''', (quantity, product_id))
        elif movement_type == 'sale':
            cursor.execute('''
                UPDATE current_stock
                SET quantity = quantity - ?, last_updated = CURRENT_TIMESTAMP
                WHERE product_id = ?
            ''', (quantity, product_id))

        conn.commit()
        conn.close()

        # Verificar alertas após movimento
        self._check_alerts(product_id)

    def get_current_stock(self, product_id=None):
        """Retorna níveis atuais de estoque"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        if product_id:
            cursor.execute('''
                SELECT cs.*, p.name, p.category
                FROM current_stock cs
                JOIN products p ON cs.product_id = p.id
                WHERE cs.product_id = ?
            ''', (product_id,))
        else:
            cursor.execute('''
                SELECT cs.*, p.name, p.category
                FROM current_stock cs
                JOIN products p ON cs.product_id = p.id
                ORDER BY p.category, p.name
            ''')

        columns = ['product_id', 'quantity', 'min_stock', 'max_stock', 'last_updated', 'name', 'category']
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]

        conn.close()
        return results

    def analyze_inventory(self, product_id):
        """Análise completa do inventário de um produto"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Dados do produto
        cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
        product = cursor.fetchone()
        if not product:
            raise Exception(f"Produto {product_id} não encontrado")

        product_data = {
            'id': product[0],
            'name': product[1],
            'category': product[2],
            'unit_cost': product[3],
            'selling_price': product[4],
            'supplier': product[5]
        }

        # Histórico de vendas (últimos 90 dias)
        cursor.execute('''
            SELECT date(timestamp) as date, SUM(quantity) as sales
            FROM inventory_movements
            WHERE product_id = ? AND movement_type = 'sale'
            AND timestamp >= date('now', '-90 days')
            GROUP BY date(timestamp)
            ORDER BY date
        ''', (product_id,))

        sales_history = [dict(zip(['date', 'sales'], row)) for row in cursor.fetchall()]

        # Estoque atual
        current_stock = self.get_current_stock(product_id)[0]

        # Análise de demanda
        demand_analysis = self._analyze_demand_pattern(product_id)

        # Predições
        predictions = self._predict_future_demand(product_id, days_ahead=30)

        # Recomendações
        recommendations = self._generate_recommendations(product_id, current_stock, demand_analysis, predictions)

        conn.close()

        return {
            'product': product_data,
            'current_stock': current_stock,
            'sales_history': sales_history,
            'demand_analysis': demand_analysis,
            'predictions': predictions,
            'recommendations': recommendations,
            'alerts': self.get_active_alerts(product_id)
        }

    def _analyze_demand_pattern(self, product_id):
        """Analisa padrões de demanda"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Vendas por dia da semana
        cursor.execute('''
            SELECT strftime('%w', timestamp) as weekday, AVG(quantity) as avg_sales
            FROM inventory_movements
            WHERE product_id = ? AND movement_type = 'sale'
            AND timestamp >= date('now', '-90 days')
            GROUP BY weekday
            ORDER BY weekday
        ''', (product_id,))

        weekday_pattern = [dict(zip(['weekday', 'avg_sales'], row)) for row in cursor.fetchall()]

        # Vendas por mês
        cursor.execute('''
            SELECT strftime('%m', timestamp) as month, SUM(quantity) as total_sales
            FROM inventory_movements
            WHERE product_id = ? AND movement_type = 'sale'
            AND timestamp >= date('now', '-365 days')
            GROUP BY month
            ORDER BY month
        ''', (product_id,))

        monthly_pattern = [dict(zip(['month', 'total_sales'], row)) for row in cursor.fetchall()]

        # Tendência (comparação mês atual vs anterior)
        cursor.execute('''
            SELECT
                SUM(CASE WHEN strftime('%Y-%m', timestamp) = strftime('%Y-%m', 'now') THEN quantity ELSE 0 END) as current_month,
                SUM(CASE WHEN strftime('%Y-%m', timestamp) = strftime('%Y-%m', 'now', '-1 month') THEN quantity ELSE 0 END) as previous_month
            FROM inventory_movements
            WHERE product_id = ? AND movement_type = 'sale'
            AND timestamp >= date('now', '-60 days')
        ''', (product_id,))

        trend_data = cursor.fetchone()
        trend = 'stable'
        if trend_data and trend_data[1] > 0:
            trend_percentage = ((trend_data[0] - trend_data[1]) / trend_data[1]) * 100
            if trend_percentage > 10:
                trend = 'increasing'
            elif trend_percentage < -10:
                trend = 'decreasing'

        conn.close()

        return {
            'weekday_pattern': weekday_pattern,
            'monthly_pattern': monthly_pattern,
            'trend': trend,
            'trend_percentage': trend_percentage if 'trend_percentage' in locals() else 0,
            'avg_daily_sales': np.mean([day['avg_sales'] for day in weekday_pattern]) if weekday_pattern else 0
        }

    def _predict_future_demand(self, product_id, days_ahead=30):
        """Prediz demanda futura usando médias móveis"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Últimas 30 dias de vendas diárias
        cursor.execute('''
            SELECT date(timestamp) as date, SUM(quantity) as sales
            FROM inventory_movements
            WHERE product_id = ? AND movement_type = 'sale'
            AND timestamp >= date('now', '-60 days')
            GROUP BY date(timestamp)
            ORDER BY date DESC
            LIMIT 30
        ''', (product_id,))

        recent_sales = cursor.fetchall()
        conn.close()

        if not recent_sales:
            return {'predicted_sales': 0, 'confidence': 'low', 'method': 'no_historical_data'}

        # Calcular médias móveis
        daily_sales = [row[1] for row in recent_sales[::-1]]  # Reverter para ordem cronológica

        if len(daily_sales) < 7:
            avg_sales = np.mean(daily_sales)
            confidence = 'low'
        else:
            # Média móvel de 7 dias
            avg_sales = np.mean(daily_sales[-7:])
            confidence = 'medium'

            # Se temos mais dados, usar média móvel de 14 dias
            if len(daily_sales) >= 14:
                avg_sales = np.mean(daily_sales[-14:])
                confidence = 'high'

        # Predição total para o período
        total_predicted = avg_sales * days_ahead

        # Intervalo de confiança (simplificado)
        margin = 0.3 if confidence == 'low' else 0.2 if confidence == 'medium' else 0.1
        lower_bound = total_predicted * (1 - margin)
        upper_bound = total_predicted * (1 + margin)

        return {
            'total_predicted_sales': round(total_predicted, 1),
            'avg_daily_sales': round(avg_sales, 2),
            'confidence_interval': {
                'lower': round(lower_bound, 1),
                'upper': round(upper_bound, 1)
            },
            'confidence': confidence,
            'method': 'moving_average',
            'days_analyzed': len(daily_sales)
        }

    def _generate_recommendations(self, product_id, current_stock, demand_analysis, predictions):
        """Gera recomendações de gestão de estoque"""
        recommendations = []

        current_qty = current_stock['quantity']
        min_stock = current_stock['min_stock']
        max_stock = current_stock['max_stock']

        avg_daily_sales = demand_analysis['avg_daily_sales']
        predicted_sales = predictions['total_predicted_sales']

        # Verificar se está abaixo do mínimo
        if current_qty <= min_stock:
            reorder_qty = max_stock - current_qty
            recommendations.append({
                'type': 'reorder',
                'priority': 'high',
                'message': f'Reordenar {reorder_qty} unidades - Estoque crítico!',
                'quantity': reorder_qty
            })

        # Verificar cobertura de demanda
        coverage_days = current_qty / avg_daily_sales if avg_daily_sales > 0 else 999

        if coverage_days < self.alerts_config['safety_stock_days']:
            additional_qty = int((self.alerts_config['safety_stock_days'] - coverage_days) * avg_daily_sales)
            recommendations.append({
                'type': 'safety_stock',
                'priority': 'medium',
                'message': f'Adicionar {additional_qty} unidades para estoque de segurança',
                'quantity': additional_qty
            })

        # Verificar excesso de estoque
        if current_qty > max_stock * 1.2:
            excess_qty = current_qty - max_stock
            recommendations.append({
                'type': 'overstock',
                'priority': 'low',
                'message': f'Considerar promoção para reduzir {excess_qty} unidades em excesso',
                'quantity': excess_qty
            })

        # Recomendações baseadas na tendência
        if demand_analysis['trend'] == 'increasing':
            growth_qty = int(avg_daily_sales * 7)  # Uma semana extra
            recommendations.append({
                'type': 'trend_growth',
                'priority': 'medium',
                'message': f'Aumentar estoque em {growth_qty} unidades devido à tendência de crescimento',
                'quantity': growth_qty
            })

        return recommendations

    def _check_alerts(self, product_id):
        """Verifica e cria alertas automaticamente"""
        current_stock = self.get_current_stock(product_id)[0]
        analysis = self.analyze_inventory(product_id)

        alerts_to_create = []

        # Alerta de estoque baixo
        if current_stock['quantity'] <= current_stock['min_stock']:
            alerts_to_create.append({
                'alert_type': 'low_stock',
                'message': f'Estoque crítico: {current_stock["quantity"]} unidades restantes',
                'severity': 'critical'
            })

        # Alerta de excesso de estoque
        if current_stock['quantity'] > current_stock['max_stock'] * 1.5:
            alerts_to_create.append({
                'alert_type': 'overstock',
                'message': f'Estoque excessivo: {current_stock["quantity"]} unidades ({current_stock["max_stock"]} máximo)',
                'severity': 'medium'
            })

        # Alerta de reorden
        reorder_point = analysis['demand_analysis']['avg_daily_sales'] * self.alerts_config['lead_time_days']
        if current_stock['quantity'] <= reorder_point:
            alerts_to_create.append({
                'alert_type': 'reorder',
                'message': f'Ponto de reorden atingido: {current_stock["quantity"]} <= {reorder_point:.1f}',
                'severity': 'high'
            })

        # Criar alertas no banco
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        for alert in alerts_to_create:
            cursor.execute('''
                INSERT INTO alerts (product_id, alert_type, message, severity)
                VALUES (?, ?, ?, ?)
            ''', (product_id, alert['alert_type'], alert['message'], alert['severity']))

        conn.commit()
        conn.close()

    def get_active_alerts(self, product_id=None):
        """Retorna alertas ativos"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        if product_id:
            cursor.execute('''
                SELECT a.*, p.name as product_name
                FROM alerts a
                JOIN products p ON a.product_id = p.id
                WHERE a.product_id = ? AND a.status = 'active'
                ORDER BY a.created_at DESC
            ''', (product_id,))
        else:
            cursor.execute('''
                SELECT a.*, p.name as product_name
                FROM alerts a
                JOIN products p ON a.product_id = p.id
                WHERE a.status = 'active'
                ORDER BY a.severity DESC, a.created_at DESC
            ''')

        columns = ['id', 'product_id', 'alert_type', 'message', 'severity', 'status', 'created_at', 'resolved_at', 'product_name']
        alerts = [dict(zip(columns, row)) for row in cursor.fetchall()]

        conn.close()
        return alerts

    def resolve_alert(self, alert_id):
        """Resolve um alerta"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            UPDATE alerts
            SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (alert_id,))

        conn.commit()
        conn.close()

    def generate_inventory_report(self):
        """Gera relatório completo de inventário"""
        products = self.get_current_stock()
        alerts = self.get_active_alerts()

        # Estatísticas gerais
        total_products = len(products)
        total_value = sum(p['quantity'] * self._get_product_cost(p['product_id']) for p in products)
        low_stock_products = len([p for p in products if p['quantity'] <= p['min_stock']])
        overstock_products = len([p for p in products if p['quantity'] > p['max_stock'] * 1.2])

        # Agrupar por categoria
        category_stats = defaultdict(lambda: {'count': 0, 'value': 0, 'low_stock': 0})
        for product in products:
            cat = product['category'] or 'Sem Categoria'
            category_stats[cat]['count'] += 1
            category_stats[cat]['value'] += product['quantity'] * self._get_product_cost(product['product_id'])
            if product['quantity'] <= product['min_stock']:
                category_stats[cat]['low_stock'] += 1

        return {
            'summary': {
                'total_products': total_products,
                'total_inventory_value': round(total_value, 2),
                'low_stock_products': low_stock_products,
                'overstock_products': overstock_products,
                'active_alerts': len(alerts)
            },
            'categories': dict(category_stats),
            'critical_products': [p for p in products if p['quantity'] <= p['min_stock']],
            'alerts': alerts[:10],  # Top 10 alertas
            'generated_at': datetime.now().isoformat()
        }

    def _get_product_cost(self, product_id):
        """Retorna custo unitário do produto"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('SELECT unit_cost FROM products WHERE id = ?', (product_id,))
        result = cursor.fetchone()

        conn.close()
        return result[0] if result else 0

    def send_inventory_alerts(self, email_config=None):
        """Envia alertas de inventário por email"""
        if not email_config:
            email_config = {
                'smtp_server': 'smtp.gmail.com',
                'smtp_port': 587,
                'username': os.getenv('ALERT_EMAIL_USER'),
                'password': os.getenv('ALERT_EMAIL_PASS'),
                'to_email': os.getenv('ALERT_RECIPIENT', 'admin@getnexo.com')
            }

        alerts = self.get_active_alerts()
        critical_alerts = [a for a in alerts if a['severity'] == 'critical']

        if not critical_alerts:
            return "Nenhum alerta crítico para enviar"

        # Criar email
        msg = MIMEMultipart()
        msg['From'] = email_config['username']
        msg['To'] = email_config['to_email']
        msg['Subject'] = f"🚨 ALERTA DE INVENTÁRIO - {len(critical_alerts)} produtos críticos"

        body = f"""
        <h2>Alertas Críticos de Inventário - GetNexo</h2>

        <p>Foram detectados {len(critical_alerts)} produtos com estoque crítico:</p>

        <ul>
        {"".join([f"<li><strong>{alert['product_name']}</strong>: {alert['message']}</li>" for alert in critical_alerts])}
        </ul>

        <p>Verifique o painel de administração para mais detalhes.</p>

        <p>Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
        """

        msg.attach(MIMEText(body, 'html'))

        # Enviar email
        try:
            server = smtplib.SMTP(email_config['smtp_server'], email_config['smtp_port'])
            server.starttls()
            server.login(email_config['username'], email_config['password'])
            server.send_message(msg)
            server.quit()

            return f"✅ {len(critical_alerts)} alertas enviados por email"

        except Exception as e:
            return f"❌ Erro ao enviar email: {e}"

def main():
    """Função principal"""
    oracle = SupplyOracle()

    import sys
    if len(sys.argv) < 2:
        print("📦 Supply Oracle - Gestão Inteligente de Estoque")
        print("Comandos disponíveis:")
        print("  add <id> <name> <cost> <price>          - Adicionar produto")
        print("  stock <product_id>                      - Ver estoque atual")
        print("  analyze <product_id>                    - Análise completa")
        print("  alerts                                  - Ver alertas ativos")
        print("  report                                  - Relatório geral")
        print("  record <product_id> <type> <qty>        - Registrar movimento")
        print("  email-alerts                            - Enviar alertas por email")
        return

    command = sys.argv[1]

    try:
        if command == 'add':
            if len(sys.argv) < 6:
                print("Uso: python supply_oracle.py add <id> <name> <cost> <price>")
                return
            product_id, name, cost, price = sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5])
            oracle.add_product(product_id, name, 'general', cost, price)

        elif command == 'stock':
            if len(sys.argv) < 3:
                print("Uso: python supply_oracle.py stock <product_id>")
                return
            stock = oracle.get_current_stock(sys.argv[2])
            if stock:
                s = stock[0]
                print(f"📦 {s['name']}: {s['quantity']} unidades (Min: {s['min_stock']}, Max: {s['max_stock']})")

        elif command == 'analyze':
            if len(sys.argv) < 3:
                print("Uso: python supply_oracle.py analyze <product_id>")
                return
            analysis = oracle.analyze_inventory(sys.argv[2])
            print("🔍 ANÁLISE COMPLETA:")
            print(json.dumps(analysis, indent=2, default=str))

        elif command == 'alerts':
            alerts = oracle.get_active_alerts()
            print(f"🚨 {len(alerts)} Alertas Ativos:")
            for alert in alerts[:5]:  # Top 5
                print(f"  {alert['severity'].upper()}: {alert['product_name']} - {alert['message']}")

        elif command == 'report':
            report = oracle.generate_inventory_report()
            print("📊 RELATÓRIO DE INVENTÁRIO:")
            print(json.dumps(report['summary'], indent=2))

        elif command == 'record':
            if len(sys.argv) < 5:
                print("Uso: python supply_oracle.py record <product_id> <type> <qty>")
                return
            product_id, movement_type, qty = sys.argv[2], sys.argv[3], int(sys.argv[4])
            oracle.record_movement(product_id, movement_type, qty)
            print(f"✅ Movimento registrado: {movement_type} {qty} unidades de {product_id}")

        elif command == 'email-alerts':
            result = oracle.send_inventory_alerts()
            print(result)

        else:
            print("Comando não reconhecido. Use sem argumentos para ver ajuda.")

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()