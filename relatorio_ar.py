#!/usr/bin/env python3
import json
import csv
import os
from datetime import datetime, timedelta
from pathlib import Path
import sqlite3
import glob

def criar_exemplo_log():
    """Cria um arquivo de log de exemplo se não existir"""
    log_file = Path("ar_log.txt")
    if not log_file.exists():
        print("📊 Criando arquivo de log de exemplo...")
        exemplo_logs = [
            "2026-01-25,blusa-feminina,view,0",
            "2026-01-25,blusa-feminina,view,0", 
            "2026-01-25,blusa-feminina,compra,1",
            "2026-01-25,tenis-preto,view,0",
            "2026-01-25,tenis-preto,view,0",
            "2026-01-25,tenis-preto,view,0",
            "2026-01-25,smartphone,view,0",
            "2026-01-25,smartphone,compra,1",
            "2026-01-24,cadeira-gamer,view,0",
            "2026-01-24,cadeira-gamer,view,0",
            "2026-01-24,cadeira-gamer,view,0",
            "2026-01-24,cadeira-gamer,view,0",
            "2026-01-23,oculos-de-sol,view,0",
            "2026-01-23,oculos-de-sol,compra,1",
            "2026-01-23,jaqueta-verde,view,0",
        ]
        
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(exemplo_logs))
        print("✅ Arquivo de log criado: ar_log.txt")

def carregar_dados():
    """Carrega dados do log e do localStorage simulado"""
    dados = []
    
    # 1. Carregar do arquivo de log
    log_file = Path("ar_log.txt")
    if log_file.exists():
        with open(log_file, 'r', encoding='utf-8') as f:
            for linha in f:
                partes = linha.strip().split(',')
                if len(partes) == 4:
                    dados.append({
                        'data': partes[0],
                        'produto': partes[1],
                        'acao': partes[2],
                        'valor': int(partes[3])
                    })
    
    # 2. Carregar do localStorage simulado (se existir)
    localStorage_file = Path("localStorage_simulado.json")
    if localStorage_file.exists():
        with open(localStorage_file, 'r', encoding='utf-8') as f:
            try:
                localStorage_data = json.load(f)
                for item in localStorage_data.get('ar_views', []):
                    dados.append({
                        'data': item.get('data', datetime.now().strftime('%Y-%m-%d')),
                        'produto': item.get('produto'),
                        'acao': 'view',
                        'valor': 0
                    })
            except:
                pass
    
    return dados

def analisar_dados(dados):
    """Analisa os dados e retorna estatísticas"""
    stats = {}
    
    # Contar views e compras por produto
    for item in dados:
        produto = item['produto']
        if produto not in stats:
            stats[produto] = {
                'views': 0,
                'compras': 0,
                'total': 0
            }
        
        if item['acao'] == 'view':
            stats[produto]['views'] += 1
        elif item['acao'] == 'compra':
            stats[produto]['compras'] += 1
        
        stats[produto]['total'] += 1
    
    # Calcular conversão
    total_views = sum(s['views'] for s in stats.values())
    total_compras = sum(s['compras'] for s in stats.values())
    
    # Calcular porcentagem de conversão
    for produto in stats:
        if stats[produto]['views'] > 0:
            stats[produto]['conversao'] = (stats[produto]['compras'] / stats[produto]['views']) * 100
        else:
            stats[produto]['conversao'] = 0
    
    return stats, total_views, total_compras

def exportar_csv(stats, total_views, total_compras):
    """Exporta dados para CSV"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    csv_file = f"relatorio_ar_{timestamp}.csv"
    
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Produto', 'Views 3D', 'Compras', 'Taxa Conversão (%)', 'Total Interações'])
        
        # Ordenar por número de views (decrescente)
        sorted_stats = sorted(stats.items(), key=lambda x: x[1]['views'], reverse=True)
        
        for produto, dados in sorted_stats:
            writer.writerow([
                produto,
                dados['views'],
                dados['compras'],
                f"{dados['conversao']:.2f}%",
                dados['total']
            ])
        
        # Linhas totais
        writer.writerow([])
        writer.writerow(['TOTAIS', total_views, total_compras, f"{(total_compras/total_views*100):.2f}%" if total_views > 0 else "0%", ''])
    
    print(f"📁 CSV exportado: {csv_file}")
    return csv_file

def mostrar_relatorio_terminal(stats, total_views, total_compras):
    """Mostra relatório no terminal"""
    print("\n" + "="*60)
    print("📊 RELATÓRIO DE ANÁLISE AR/3D")
    print("="*60)
    
    print(f"📈 Total de Views 3D: {total_views}")
    print(f"🛒 Total de Compras: {total_compras}")
    print(f"📊 Taxa Geral de Conversão: {(total_compras/total_views*100):.2f}%" if total_views > 0 else "📊 Taxa Geral de Conversão: 0%")
    
    print("\n🏆 PRODUTOS MAIS VISUALIZADOS:")
    sorted_stats = sorted(stats.items(), key=lambda x: x[1]['views'], reverse=True)
    
    for i, (produto, dados) in enumerate(sorted_stats[:10], 1):
        print(f"{i:2d}. {produto:<20} | Views: {dados['views']:3d} | Compras: {dados['compras']:2d} | Conversão: {dados['conversao']:5.1f}%")
    
    if len(sorted_stats) > 10:
        print(f"... e mais {len(sorted_stats) - 10} produtos")
    
    print("\n🎯 MELHORES TAXAS DE CONVERSÃO:")
    conversao_sorted = sorted([(p, s) for p, s in stats.items() if s['views'] > 0], 
                            key=lambda x: x[1]['conversao'], reverse=True)
    
    for i, (produto, dados) in enumerate(conversao_sorted[:5], 1):
        print(f"{i}. {produto:<20} | {dados['conversao']:5.1f}% ({dados['compras']} compras de {dados['views']} views)")
    
    print("\n" + "="*60)

def main():
    print("🚀 Iniciando análise de dados AR/3D...")
    
    # Criar arquivo de exemplo se necessário
    criar_exemplo_log()
    
    # Carregar dados
    dados = carregar_dados()
    if not dados:
        print("❌ Nenhum dado encontrado. Crie um arquivo ar_log.txt com formato: data,produto,acao,valor")
        return
    
    print(f"📋 Carregados {len(dados)} registros")
    
    # Analisar dados
    stats, total_views, total_compras = analisar_dados(dados)
    
    # Mostrar relatório no terminal
    mostrar_relatorio_terminal(stats, total_views, total_compras)
    
    # Exportar para CSV
    csv_file = exportar_csv(stats, total_views, total_compras)
    
    print(f"\n✅ Análise concluída! Arquivo CSV: {csv_file}")
    print("💡 Dica: Para adicionar mais dados, edite o arquivo ar_log.txt ou use localStorage_simulado.json")

if __name__ == "__main__":
    main()