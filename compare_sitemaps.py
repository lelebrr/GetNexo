#!/usr/bin/env python3
"""
Script para comparar sitemaps entre diferentes idiomas
e identificar páginas faltantes em cada versão.
"""

import xml.etree.ElementTree as ET
import re
from collections import defaultdict
import os

def extract_urls_from_sitemap(sitemap_path):
    """Extrai todas as URLs de um arquivo sitemap"""
    try:
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
        
        # Encontra todos os elementos <loc>
        urls = []
        for loc in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
            url = loc.text.strip()
            # Extrai o caminho da URL para comparação
            path = extract_path_from_url(url)
            urls.append(path)
        
        return urls
    except Exception as e:
        print(f"Erro ao processar {sitemap_path}: {e}")
        return []

def extract_path_from_url(url):
    """Extrai o caminho da URL para comparação entre idiomas"""
    # Remove o domínio e prefixo de idioma
    if url.startswith('https://getnexo.com.br//'):
        # URLs com duplicação de domínio
        path = url.replace('https://getnexo.com.br//', '')
    elif url.startswith('https://getnexo.com.br/'):
        # URLs normais
        path = url.replace('https://getnexo.com.br/', '')
    else:
        # URLs externas
        path = url
    
    # Remove prefixos de idioma para comparar a estrutura base
    if path.startswith('en/'):
        path = path[3:]
    elif path.startswith('es/'):
        path = path[3:]
    elif path.startswith('fr/'):
        path = path[3:]
    
    return path

def analyze_sitemap_structure(sitemap_files):
    """Analisa a estrutura dos sitemaps e identifica padrões"""
    
    # Extrai URLs de cada sitemap
    sitemap_data = {}
    for lang, file_path in sitemap_files.items():
        print(f"Processando sitemap {lang}: {file_path}")
        urls = extract_urls_from_sitemap(file_path)
        sitemap_data[lang] = urls
        print(f"  - Encontradas {len(urls)} URLs")
    
    # Identifica URLs únicas em cada idioma
    all_urls = set()
    for lang, urls in sitemap_data.items():
        all_urls.update(urls)
    
    print(f"\nTotal de URLs únicas encontradas: {len(all_urls)}")
    
    # Compara cada idioma contra os outros
    print("\n" + "="*60)
    print("ANÁLISE DE PÁGINAS FALTANTES POR IDIOMA")
    print("="*60)
    
    for lang, urls in sitemap_data.items():
        print(f"\n📄 {lang.upper()}: {len(urls)} páginas")
        
        # Identifica páginas que estão apenas neste idioma
        unique_to_lang = set(urls) - all_urls.difference(set(urls))
        
        if unique_to_lang:
            print(f"  ⚠️  Páginas exclusivas de {lang} (não encontradas em outros idiomas):")
            for url in sorted(unique_to_lang)[:10]:  # Mostra até 10 exemplos
                print(f"    - {url}")
            if len(unique_to_lang) > 10:
                print(f"    ... e mais {len(unique_to_lang) - 10} páginas")
        else:
            print("  ✅ Todas as páginas têm equivalentes em outros idiomas")
    
    # Identifica páginas que faltam em cada idioma
    print("\n" + "="*60)
    print("PÁGINAS FALTANTES EM CADA IDIOMA")
    print("="*60)
    
    base_lang = 'pt'  # Considerar português como base
    if base_lang in sitemap_data:
        base_urls = set(sitemap_data[base_lang])
        
        for lang, urls in sitemap_data.items():
            if lang == base_lang:
                continue
                
            missing_in_lang = base_urls - set(urls)
            if missing_in_lang:
                print(f"\n❌ Páginas em português que faltam em {lang}:")
                for url in sorted(missing_in_lang)[:10]:  # Mostra até 10 exemplos
                    print(f"  - {url}")
                if len(missing_in_lang) > 10:
                    print(f"  ... e mais {len(missing_in_lang) - 10} páginas")
            else:
                print(f"\n✅ {lang} tem todas as páginas equivalentes ao português")
    
    # Identifica padrões de URLs problemáticas
    print("\n" + "="*60)
    print("ANÁLISE DE PADRÕES DE URLS")
    print("="*60)
    
    # URLs com duplicação de domínio
    duplicate_domain_urls = []
    for lang, urls in sitemap_data.items():
        for url in urls:
            if url.startswith('//'):
                duplicate_domain_urls.append(url)
    
    if duplicate_domain_urls:
        print(f"⚠️  Encontradas {len(duplicate_domain_urls)} URLs com duplicação de domínio:")
        for url in duplicate_domain_urls[:5]:
            print(f"  - {url}")
        if len(duplicate_domain_urls) > 5:
            print(f"  ... e mais {len(duplicate_domain_urls) - 5}")
    
    # URLs externas (não pertencentes ao domínio principal)
    external_urls = []
    for lang, urls in sitemap_data.items():
        for url in urls:
            if not url.startswith('https://getnexo.com.br') and not url.startswith('//'):
                external_urls.append(url)
    
    if external_urls:
        print(f"\n🌐 Encontradas {len(external_urls)} URLs externas:")
        for url in external_urls[:5]:
            print(f"  - {url}")
        if len(external_urls) > 5:
            print(f"  ... e mais {len(external_urls) - 5}")
    
    return sitemap_data

def main():
    """Função principal"""
    print("🔍 Iniciando análise comparativa de sitemaps...")
    
    # Define os caminhos dos sitemaps
    sitemap_files = {
        'pt': 'getnexo-site/public/sitemap-pt.xml',
        'en': 'getnexo-site/public/sitemap-en.xml',
        'es': 'getnexo-site/public/sitemap-es.xml',
        'fr': 'getnexo-site/public/sitemap-fr.xml'
    }
    
    # Verifica se os arquivos existem
    for lang, file_path in sitemap_files.items():
        if not os.path.exists(file_path):
            print(f"❌ Arquivo não encontrado: {file_path}")
            return
    
    # Executa a análise
    sitemap_data = analyze_sitemap_structure(sitemap_files)
    
    print("\n" + "="*60)
    print("ANÁLISE CONCLUÍDA")
    print("="*60)
    print("Resumo:")
    for lang, urls in sitemap_data.items():
        print(f"  - {lang.upper()}: {len(urls)} páginas")

if __name__ == "__main__":
    main()