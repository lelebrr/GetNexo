#!/usr/bin/env python3
import json
import csv
import os
import smtplib
from datetime import datetime, timedelta
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sqlite3
import glob

# Configurações de e-mail (substitua pelos seus dados)
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'email_user': 'seu-email@gmail.com',
    'email_password': 'sua-senha-app',
    'email_from': 'seu-email@gmail.com',
    'email_to': 'destinatario@exemplo.com'
}

# Configurações do sistema
LOG_FILE = "vendas_log.txt"
DATABASE_FILE = "vendas.db"
RETENTION_DAYS = 30

def criar_exemplo_dados():
    """Cria dados de exemplo se não existirem"""
    # Criar arquivo de log de exemplo
    if not Path(LOG_FILE).exists():
        print("📊 Criando dados de exemplo...")
        exemplo_logs = [
            "2026-01-25,blusa-feminina,view,0",
            "2026-01-25,blusa-feminina,comprar,89.00",
            "2026-01-25,tenis-preto,view,0",
            "2026-01-25,tenis-preto,view,0",
            "2026-01-25,tenis-preto,carrinho,0",
            "2026-01-25,smartphone,view,0",
            "2026-01-25,smartphone,view,0",
            "2026-01-25,smartphone,view,0",
            "2026-01-25,smartphone,comprar,1299.00",
            "2026-01-24,cadeira-gamer,view,0",
            "2026-01-24,cadeira-gamer,view,0",
            "2026-01-24,cadeira-gamer,view,0",
            "2026-01-24,cadeira-gamer,view,0",
            "2026-01-23,oculos-de-sol,view,0",
            "2026-01-23,oculos-de-sol,comprar,159.00",
        ]
        
        with open(LOG_FILE, 'w', encoding='utf-8') as f:
            f.write('\n'.join(exemplo_logs))
        print("✅ Arquivo de log criado:", LOG_FILE)

    # Criar banco de dados SQLite
    if not Path(DATABASE_FILE).exists():
        criar_banco_dados()

def criar_banco_dados():
    """Cria banco de dados SQLite para armazenar vendas"""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            produto TEXT NOT NULL,
            acao TEXT NOT NULL,
            valor REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS views_3d (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            produto TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def carregar_dados():
    """Carrega dados do log e do localStorage"""
    dados = []
    
    # 1. Carregar do arquivo de log
    if Path(LOG_FILE).exists():
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            for linha in f:
                partes = linha.strip().split(',')
                if len(partes) >= 3:
                    dados.append({
                        'data': partes[0],
                        'produto': partes[1],
                        'acao': partes[2],
                        'valor': float(partes[3]) if len(partes) > 3 and partes[3] else 0
                    })
    
    # 2. Carregar do localStorage simulado
    localStorage_file = Path("localStorage_simulado.json")
    if localStorage_file.exists():
        with open(localStorage_file, 'r', encoding='utf-8') as f:
            try:
                localStorage_data = json.load(f)
                
                # Carregar views do chat
                for item in localStorage_data.get('chatVendedor_conversa', []):
                    if 'produto' in item and 'view' in item.get('texto', ''):
                        dados.append({
                            'data': datetime.now().strftime('%Y-%m-%d'),
                            'produto': item['produto'],
                            'acao': 'view',
                            'valor': 0
                        })
                
                # Carregar carrinho
                carrinho = localStorage_data.get('carrinho_compras', [])
                for item in carrinho:
                    dados.append({
                        'data': datetime.now().strftime('%Y-%m-%d'),
                        'produto': item.get('produto'),
                        'acao': 'carrinho',
                        'valor': 0
                    })
                    
            except:
                pass
    
    return dados

def salvar_no_banco(dados):
    """Salva dados no banco de dados SQLite"""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    for item in dados:
        if item['acao'] in ['comprar', 'view', 'carrinho']:
            cursor.execute('''
                INSERT INTO vendas (data, produto, acao, valor)
                VALUES (?, ?, ?, ?)
            ''', (item['data'], item['produto'], item['acao'], item['valor']))
        
        if item['acao'] == 'view':
            cursor.execute('''
                INSERT OR IGNORE INTO views_3d (data, produto)
                VALUES (?, ?)
            ''', (item['data'], item['produto']))
    
    conn.commit()
    conn.close()

def analisar_dados(dados):
    """Analisa os dados e retorna estatísticas"""
    stats = {
        'total_views': 0,
        'total_compras': 0,
        'total_carrinho': 0,
        'total_receita': 0,
        'produtos': {}
    }
    
    for item in dados:
        produto = item['produto']
        
        if produto not in stats['produtos']:
            stats['produtos'][produto] = {
                'views': 0,
                'compras': 0,
                'carrinho': 0,
                'receita': 0
            }
        
        if item['acao'] == 'view':
            stats['total_views'] += 1
            stats['produtos'][produto]['views'] += 1
        elif item['acao'] == 'comprar':
            stats['total_compras'] += 1
            stats['total_receita'] += item['valor']
            stats['produtos'][produto]['compras'] += 1
            stats['produtos'][produto]['receita'] += item['valor']
        elif item['acao'] == 'carrinho':
            stats['total_carrinho'] += 1
            stats['produtos'][produto]['carrinho'] += 1
    
    # Calcular taxa de conversão
    if stats['total_views'] > 0:
        stats['taxa_conversao'] = (stats['total_compras'] / stats['total_views']) * 100
    else:
        stats['taxa_conversao'] = 0
    
    return stats

def exportar_csv(stats, dados):
    """Exporta dados para CSV"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    csv_file = f"relatorio_vendas_{timestamp}.csv"
    
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Data', 'Produto', 'Views 3D', 'Compras', 'Carrinho', 'Receita (R$)', 'Taxa Conversão (%)'])
        
        # Exportar por produto
        for produto, dados_produto in stats['produtos'].items():
            taxa = (dados_produto['compras'] / dados_produto['views'] * 100) if dados_produto['views'] > 0 else 0
            writer.writerow([
                datetime.now().strftime('%Y-%m-%d'),
                produto,
                dados_produto['views'],
                dados_produto['compras'],
                dados_produto['carrinho'],
                f"R$ {dados_produto['receita']:.2f}",
                f"{taxa:.2f}%"
            ])
        
        # Linha total
        writer.writerow([])
        writer.writerow(['TOTAIS', '', stats['total_views'], stats['total_compras'], stats['total_carrinho'], 
                        f"R$ {stats['total_receita']:.2f}", f"{stats['taxa_conversao']:.2f}%"])
    
    return csv_file

def enviar_email_relatorio(csv_file, stats):
    """Envia relatório por e-mail"""
    try:
        # Criar mensagem
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['email_from']
        msg['To'] = EMAIL_CONFIG['email_to']
        msg['Subject'] = f"Relatório de Vendas - {datetime.now().strftime('%Y-%m-%d')}"
        
        # Corpo do e-mail
        corpo = f"""
Relatório Automático de Vendas e Views 3D
==========================================

Data: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

📊 ESTATÍSTICAS GERAIS:
• Total de Views 3D: {stats['total_views']}
• Total de Compras: {stats['total_compras']}
• Total no Carrinho: {stats['total_carrinho']}
• Receita Total: R$ {stats['total_receita']:.2f}
• Taxa de Conversão: {stats['taxa_conversao']:.2f}%

🏆 PRODUTOS MAIS VENDIDOS:
"""
        
        # Ordenar por receita
        produtos_ordenados = sorted(stats['produtos'].items(), 
                                  key=lambda x: x[1]['receita'], reverse=True)
        
        for i, (produto, dados) in enumerate(produtos_ordenados[:5], 1):
            taxa = (dados['compras'] / dados['views'] * 100) if dados['views'] > 0 else 0
            corpo += f"{i}. {produto}: R$ {dados['receita']:.2f} ({dados['compras']} compras, {taxa:.1f}% conversão)\n"
        
        corpo += f"\n📁 Arquivo completo: {csv_file}"
        
        msg.attach(MIMEText(corpo, 'plain'))
        
        # Anexar CSV
        with open(csv_file, 'rb') as f:
            anexo = MIMEText(f.read(), 'csv')
            anexo.add_header('Content-Disposition', 'attachment', filename=csv_file)
            msg.attach(anexo)
        
        # Enviar e-mail
        server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
        server.starttls()
        server.login(EMAIL_CONFIG['email_user'], EMAIL_CONFIG['email_password'])
        text = msg.as_string()
        server.sendmail(EMAIL_CONFIG['email_from'], EMAIL_CONFIG['email_to'], text)
        server.quit()
        
        print("✅ E-mail enviado com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao enviar e-mail: {e}")
        return False

def mostrar_relatorio_terminal(stats):
    """Mostra relatório no terminal"""
    print("\n" + "="*60)
    print("📊 RELATÓRIO DE VENDAS E VIEWS 3D")
    print("="*60)
    
    print(f"📈 Total de Views 3D: {stats['total_views']}")
    print(f"🛒 Total de Compras: {stats['total_compras']}")
    print(f"🛍️  Total no Carrinho: {stats['total_carrinho']}")
    print(f"💰 Receita Total: R$ {stats['total_receita']:.2f}")
    print(f"📊 Taxa de Conversão: {stats['taxa_conversao']:.2f}%")
    
    print("\n🏆 PRODUTOS MAIS VENDIDOS:")
    produtos_ordenados = sorted(stats['produtos'].items(), 
                              key=lambda x: x[1]['receita'], reverse=True)
    
    for i, (produto, dados) in enumerate(produtos_ordenados[:10], 1):
        taxa = (dados['compras'] / dados['views'] * 100) if dados['views'] > 0 else 0
        print(f"{i:2d}. {produto:<20} | Vendas: {dados['compras']:2d} | Receita: R${dados['receita']:7.2f} | Taxa: {taxa:5.1f}%")
    
    print("\n" + "="*60)

def limpar_dados_antigos():
    """Limpa dados antigos do banco"""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    data_limite = datetime.now() - timedelta(days=RETENTION_DAYS)
    
    cursor.execute("DELETE FROM vendas WHERE data < ?", (data_limite.strftime('%Y-%m-%d'),))
    cursor.execute("DELETE FROM views_3d WHERE data < ?", (data_limite.strftime('%Y-%m-%d'),))
    
    conn.commit()
    conn.close()
    
    print(f"🧹 Dados antigos (> {RETENTION_DAYS} dias) limpos")

def main():
    print("🚀 Iniciando análise de vendas e views 3D...")
    
    # Criar dados de exemplo se necessário
    criar_exemplo_dados()
    
    # Carregar dados
    dados = carregar_dados()
    if not dados:
        print("❌ Nenhum dado encontrado. Crie um arquivo de log ou use os componentes.")
        return
    
    print(f"📋 Carregados {len(dados)} registros")
    
    # Salvar no banco
    salvar_no_banco(dados)
    
    # Analisar dados
    stats = analisar_dados(dados)
    
    # Mostrar relatório no terminal
    mostrar_relatorio_terminal(stats)
    
    # Exportar para CSV
    csv_file = exportar_csv(stats, dados)
    print(f"\n📁 CSV exportado: {csv_file}")
    
    # Enviar por e-mail (se configurado)
    if EMAIL_CONFIG['email_user'] != 'seu-email@gmail.com':
        if enviar_email_relatorio(csv_file, stats):
            print("✅ Relatório enviado por e-mail!")
        else:
            print("⚠️  Falha ao enviar e-mail")
    else:
        print("💡 Dica: Configure o e-mail no script para receber relatórios automáticos")
    
    # Limpar dados antigos
    limpar_dados_antigos()
    
    print("\n✅ Análise concluída!")

if __name__ == "__main__":
    main()