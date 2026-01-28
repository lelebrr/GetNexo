#!/usr/bin/env python3
"""
Script para analisar apenas as páginas de conteúdo real dos sitemaps,
ignorando páginas administrativas, números, duplicatas e recursos.
"""

import xml.etree.ElementTree as ET
import re
from collections import defaultdict, Counter
import os

def is_content_page_url(url):
    """Verifica se uma URL é uma página de conteúdo real"""
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
    ]
    
    # Ignora páginas administrativas
    admin_patterns = [
        r'^admin/',
        r'^login',
        r'^cadastro',
        r'^register',
        r'^dashboard',
        r'^dashboard/',
        r'^painel',
        r'^painel/',
    ]
    
    # Ignora números, dimensões e identificadores
    number_patterns = [
        r'^\d+$',  # Apenas números
        r'^\d+x\d+$',  # Dimensões como 400x300
        r'^\d{10,}$',  # Números de telefone longos
        r'^@',  # Prefixos @
        r'^\d{4,}$',  # Números com 4+ dígitos
    ]
    
    # Ignora URLs problemáticas
    problem_patterns = [
        r'^https://getnexo\.com\.brhttps://getnexo\.com\.br/',  # Duplicação de domínio
        r'^//',  # URLs relativas
    ]
    
    # Verifica contra padrões de exclusão
    for pattern in static_patterns + admin_patterns + number_patterns + problem_patterns:
        if re.search(pattern, url):
            return False
    
    # Considera como página de conteúdo se passar por todos os filtros
    return True

def extract_content_pages_from_sitemap(sitemap_path):
    """Extrai apenas as páginas de conteúdo de um arquivo sitemap"""
    try:
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
        
        content_pages = []
        for loc in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
            url = loc.text.strip()
            if is_content_page_url(url):
                # Extrai o caminho da URL para comparação
                path = extract_path_from_url(url)
                content_pages.append(path)
        
        return content_pages
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

def analyze_content_pages(sitemap_files):
    """Analisa apenas as páginas de conteúdo dos sitemaps"""
    
    # Extrai páginas de conteúdo de cada sitemap
    sitemap_data = {}
    for lang, file_path in sitemap_files.items():
        print(f"Processando sitemap {lang}: {file_path}")
        pages = extract_content_pages_from_sitemap(file_path)
        sitemap_data[lang] = pages
        print(f"  - Encontradas {len(pages)} páginas de conteúdo (filtradas)")
    
    # Identifica páginas únicas em cada idioma
    all_pages = set()
    for lang, pages in sitemap_data.items():
        all_pages.update(pages)
    
    print(f"\nTotal de páginas de conteúdo únicas encontradas: {len(all_pages)}")
    
    # Mostra as páginas de cada idioma
    print("\n" + "="*60)
    print("PÁGINAS DE CONTEÚDO POR IDIOMA")
    print("="*60)
    
    for lang, pages in sitemap_data.items():
        print(f"\n📄 {lang.upper()}: {len(pages)} páginas de conteúdo")
        if pages:
            print("  Páginas principais:")
            # Mostra apenas páginas relevantes
            relevant_pages = [p for p in pages if len(p) > 3 and not p.isdigit()]
            for page in sorted(relevant_pages)[:15]:  # Mostra até 15 exemplos
                print(f"    - {page}")
            if len(relevant_pages) > 15:
                print(f"    ... e mais {len(relevant_pages) - 15} páginas")
    
    # Compara cada idioma contra os outros
    print("\n" + "="*60)
    print("COMPARAÇÃO DE PÁGINAS DE CONTEÚDO")
    print("="*60)
    
    # Identifica páginas que estão apenas neste idioma
    for lang, pages in sitemap_data.items():
        unique_to_lang = set(pages) - all_pages.difference(set(pages))
        
        if unique_to_lang:
            relevant_unique = [p for p in unique_to_lang if len(p) > 3 and not p.isdigit()]
            if relevant_unique:
                print(f"\n🔍 Páginas de conteúdo exclusivas de {lang}:")
                for page in sorted(relevant_unique)[:10]:
                    print(f"  - {page}")
                if len(relevant_unique) > 10:
                    print(f"  ... e mais {len(relevant_unique) - 10}")
    
    # Identifica páginas que faltam em cada idioma (comparando contra português)
    print("\n" + "="*60)
    print("PÁGINAS DE CONTEÚDO FALTANTES EM RELAÇÃO AO PORTUGUÊS")
    print("="*60)
    
    if 'pt' in sitemap_data:
        pt_pages = set(sitemap_data['pt'])
        
        for lang, pages in sitemap_data.items():
            if lang == 'pt':
                continue
                
            missing_in_lang = pt_pages - set(pages)
            if missing_in_lang:
                print(f"\n❌ Páginas em português que faltam em {lang}:")
                # Mostra apenas as páginas relevantes
                relevant_missing = [p for p in missing_in_lang if len(p) > 3 and not p.isdigit()]
                for page in sorted(relevant_missing)[:10]:
                    print(f"  - {page}")
                if len(relevant_missing) > 10:
                    print(f"  ... e mais {len(relevant_missing) - 10} páginas")
            else:
                print(f"\n✅ {lang} tem todas as páginas de conteúdo equivalentes ao português")
    
    # Identifica páginas que precisam de tradução
    print("\n" + "="*60)
    print("PÁGINAS DE CONTEÚDO QUE PRECISAM DE TRADUÇÃO")
    print("="*60)
    
    # Encontra páginas em português que não têm equivalentes em outros idiomas
    if 'pt' in sitemap_data:
        pt_pages = set(sitemap_data['pt'])
        
        for lang in ['en', 'es', 'fr']:
            if lang in sitemap_data:
                lang_pages = set(sitemap_data[lang])
                missing = pt_pages - lang_pages
                
                # Filtra apenas páginas relevantes
                relevant_missing = [p for p in missing if len(p) > 3 and not p.isdigit()]
                
                if relevant_missing:
                    print(f"\n📝 Páginas em português que precisam de tradução para {lang}:")
                    for page in sorted(relevant_missing)[:10]:
                        print(f"  - {page}")
                    if len(relevant_missing) > 10:
                        print(f"  ... e mais {len(relevant_missing) - 10} páginas")
    
    # Identifica páginas comuns entre todos os idiomas
    print("\n" + "="*60)
    print("PÁGINAS COMUNS ENTRE TODOS OS IDIOMAS")
    print("="*60)
    
    common_pages = set()
    if all(lang in sitemap_data for lang in ['pt', 'en', 'es', 'fr']):
        common_pages = set(sitemap_data['pt'])
        for lang in ['en', 'es', 'fr']:
            common_pages.intersection_update(set(sitemap_data[lang]))
        
        if common_pages:
            relevant_common = [p for p in common_pages if len(p) > 3 and not p.isdigit()]
            print(f"\n✅ Páginas encontradas em todos os idiomas: {len(relevant_common)}")
            for page in sorted(relevant_common)[:10]:
                print(f"  - {page}")
            if len(relevant_common) > 10:
                print(f"  ... e mais {len(relevant_common) - 10}")
        else:
            print("\n❌ Nenhuma página encontrada em todos os idiomas")
    
    return sitemap_data

def main():
    """Função principal"""
    print("🔍 Iniciando análise de páginas de conteúdo dos sitemaps...")
    
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
    sitemap_data = analyze_content_pages(sitemap_files)
    
    print("\n" + "="*60)
    print("ANÁLISE CONCLUÍDA")
    print("="*60)
    print("Resumo de páginas de conteúdo:")
    for lang, pages in sitemap_data.items():
        relevant_pages = [p for p in pages if len(p) > 3 and not p.isdigit()]
        print(f"  - {lang.upper()}: {len(relevant_pages)} páginas de conteúdo")

if __name__ == "__main__":
    main()