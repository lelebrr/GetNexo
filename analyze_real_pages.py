#!/usr/bin/env python3
"""
Script para analisar apenas as páginas reais dos sitemaps,
ignorando recursos externos e URLs duplicadas.
"""

import xml.etree.ElementTree as ET
import re
from collections import defaultdict, Counter
import os

def is_real_page_url(url):
    """Verifica se uma URL é uma página real (não um recurso externo ou duplicado)"""
    # Ignora URLs externas
    if url.startswith(('http://', 'https://')) and not url.startswith('https://getnexo.com.br'):
        return False
    
    # Ignora URLs com duplicação de domínio
    if url.startswith('//'):
        return False
    
    # Ignora recursos estáticos e APIs
    static_patterns = [
        r'\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|pdf|doc|docx|xls|xlsx)$',
        r'@babel/standalone/',
        r'@google/model-viewer/',
        r'api\.getnexo\.com\.br',
        r'cdn\.getnexo\.com\.br',
        r'chat\.getnexo\.com\.br',
        r'fonts\.googleapis\.com',
        r'fonts\.gstatic\.com',
        r'^\d+$',  # Apenas números
        r'^\d+x\d+$',  # Dimensões como 400x300
        r'^\d{10,}$',  # Números de telefone longos
        r'^@',  # Prefixos @
    ]
    
    for pattern in static_patterns:
        if re.search(pattern, url):
            return False
    
    # Considera como página real se passar por todos os filtros
    return True

def extract_real_pages_from_sitemap(sitemap_path):
    """Extrai apenas as páginas reais de um arquivo sitemap"""
    try:
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
        
        real_pages = []
        for loc in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
            url = loc.text.strip()
            if is_real_page_url(url):
                # Extrai o caminho da URL para comparação
                path = extract_path_from_url(url)
                real_pages.append(path)
        
        return real_pages
    except Exception as e:
        print(f"Erro ao processar {sitemap_path}: {e}")
        return []

def extract_path_from_url(url):
    """Extrai o caminho da URL para comparação entre idiomas"""
    # Remove o domínio
    if url.startswith('https://getnexo.com.br//'):
        # URLs com duplicação de domínio
        path = url.replace('https://getnexo.com.br//', '')
    elif url.startswith('https://getnexo.com.br/'):
        # URLs normais
        path = url.replace('https://getnexo.com.br/', '')
    else:
        # URLs externas (já filtradas)
        path = url
    
    # Remove prefixos de idioma para comparar a estrutura base
    if path.startswith('en/'):
        path = path[3:]
    elif path.startswith('es/'):
        path = path[3:]
    elif path.startswith('fr/'):
        path = path[3:]
    
    return path

def analyze_real_pages(sitemap_files):
    """Analisa apenas as páginas reais dos sitemaps"""
    
    # Extrai páginas reais de cada sitemap
    sitemap_data = {}
    for lang, file_path in sitemap_files.items():
        print(f"Processando sitemap {lang}: {file_path}")
        pages = extract_real_pages_from_sitemap(file_path)
        sitemap_data[lang] = pages
        print(f"  - Encontradas {len(pages)} páginas reais (filtradas)")
    
    # Identifica páginas únicas em cada idioma
    all_pages = set()
    for lang, pages in sitemap_data.items():
        all_pages.update(pages)
    
    print(f"\nTotal de páginas únicas reais encontradas: {len(all_pages)}")
    
    # Mostra as páginas de cada idioma
    print("\n" + "="*60)
    print("PÁGINAS REAIS POR IDIOMA")
    print("="*60)
    
    for lang, pages in sitemap_data.items():
        print(f"\n📄 {lang.upper()}: {len(pages)} páginas reais")
        if pages:
            print("  Páginas principais:")
            for page in sorted(pages)[:15]:  # Mostra até 15 exemplos
                print(f"    - {page}")
            if len(pages) > 15:
                print(f"    ... e mais {len(pages) - 15} páginas")
    
    # Compara cada idioma contra os outros
    print("\n" + "="*60)
    print("COMPARAÇÃO DE PÁGINAS FALTANTES")
    print("="*60)
    
    # Identifica páginas que estão apenas neste idioma
    for lang, pages in sitemap_data.items():
        unique_to_lang = set(pages) - all_pages.difference(set(pages))
        
        if unique_to_lang:
            print(f"\n🔍 Páginas exclusivas de {lang}:")
            for page in sorted(unique_to_lang)[:10]:
                print(f"  - {page}")
            if len(unique_to_lang) > 10:
                print(f"  ... e mais {len(unique_to_lang) - 10}")
    
    # Identifica páginas que faltam em cada idioma (comparando contra português)
    print("\n" + "="*60)
    print("PÁGINAS FALTANTES EM RELAÇÃO AO PORTUGUÊS")
    print("="*60)
    
    if 'pt' in sitemap_data:
        pt_pages = set(sitemap_data['pt'])
        
        for lang, pages in sitemap_data.items():
            if lang == 'pt':
                continue
                
            missing_in_lang = pt_pages - set(pages)
            if missing_in_lang:
                print(f"\n❌ Páginas em português que faltam em {lang}:")
                # Mostra apenas as páginas relevantes (ignorando números, etc.)
                relevant_missing = [p for p in missing_in_lang if not p.isdigit() and len(p) > 2]
                for page in sorted(relevant_missing)[:10]:
                    print(f"  - {page}")
                if len(relevant_missing) > 10:
                    print(f"  ... e mais {len(relevant_missing) - 10} páginas")
            else:
                print(f"\n✅ {lang} tem todas as páginas equivalentes ao português")
    
    # Identifica páginas que precisam de tradução
    print("\n" + "="*60)
    print("PÁGINAS QUE PRECISAM DE TRADUÇÃO")
    print("="*60)
    
    # Encontra páginas em português que não têm equivalentes em outros idiomas
    if 'pt' in sitemap_data:
        pt_pages = set(sitemap_data['pt'])
        
        for lang in ['en', 'es', 'fr']:
            if lang in sitemap_data:
                lang_pages = set(sitemap_data[lang])
                missing = pt_pages - lang_pages
                
                # Filtra apenas páginas relevantes
                relevant_missing = [p for p in missing if not p.isdigit() and len(p) > 2]
                
                if relevant_missing:
                    print(f"\n📝 Páginas em português que precisam de tradução para {lang}:")
                    for page in sorted(relevant_missing)[:10]:
                        print(f"  - {page}")
                    if len(relevant_missing) > 10:
                        print(f"  ... e mais {len(relevant_missing) - 10} páginas")
    
    return sitemap_data

def main():
    """Função principal"""
    print("🔍 Iniciando análise de páginas reais dos sitemaps...")
    
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
    sitemap_data = analyze_real_pages(sitemap_files)
    
    print("\n" + "="*60)
    print("ANÁLISE CONCLUÍDA")
    print("="*60)
    print("Resumo de páginas reais:")
    for lang, pages in sitemap_data.items():
        print(f"  - {lang.upper()}: {len(pages)} páginas")

if __name__ == "__main__":
    main()