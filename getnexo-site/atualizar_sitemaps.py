#!/usr/bin/env python3
"""
Script para atualizar os sitemaps com todos os links encontrados no site
"""

import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse, urljoin
from datetime import datetime

# Diretório base do projeto
BASE_DIR = Path(__file__).parent

# Diretórios a serem verificados
SRC_DIR = BASE_DIR / "src"
PUBLIC_DIR = BASE_DIR / "public"

# Arquivos sitemap
SITEMAPS = {
    "pt": PUBLIC_DIR / "sitemap-pt.xml",
    "en": PUBLIC_DIR / "sitemap-en.xml",
    "es": PUBLIC_DIR / "sitemap-es.xml",
    "fr": PUBLIC_DIR / "sitemap-fr.xml",
}

# Extensões de arquivos a serem verificados
FILE_EXTENSIONS = {".astro", ".jsx", ".tsx", ".html", ".js"}

# Regex para extrair links href
HREF_REGEX = re.compile(r'href\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)

# Regex para extrair links window.location
LOCATION_REGEX = re.compile(r'window\.location\.href\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)

# Regex para extrair links src
SRC_REGEX = re.compile(r'src\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)


def extract_links_from_file(file_path):
    """Extrai todos os links de um arquivo"""
    links = set()
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extrair links href
        for match in HREF_REGEX.finditer(content):
            link = match.group(1).strip()
            if link and not link.startswith("#") and not link.startswith("javascript:"):
                links.add(link)
        
        # Extrair links window.location
        for match in LOCATION_REGEX.finditer(content):
            link = match.group(1).strip()
            if link:
                links.add(link)
        
        # Extrair links src (para recursos)
        for match in SRC_REGEX.finditer(content):
            link = match.group(1).strip()
            if link and not link.startswith("data:") and not link.startswith("blob:"):
                links.add(link)
        
    except Exception as e:
        print(f"❌ Erro ao ler {file_path}: {e}")
    
    return links


def extract_links_from_directory(directory):
    """Extrai todos os links de todos os arquivos em um diretório"""
    all_links = set()
    files_processed = 0
    
    for file_path in directory.rglob("*"):
        if file_path.is_file() and file_path.suffix.lower() in FILE_EXTENSIONS:
            links = extract_links_from_file(file_path)
            all_links.update(links)
            files_processed += 1
    
    print(f"✅ {directory.name}: {len(all_links)} links únicos de {files_processed} arquivos")
    return all_links


def normalize_url(url):
    """Normaliza uma URL para comparação"""
    if not url:
        return None
    
    # Remove barras finais
    url = url.rstrip("/")
    
    # Se for URL relativa, normaliza
    if url.startswith("/"):
        return url
    
    # Se for URL completa, extrai o path
    if url.startswith("http"):
        parsed = urlparse(url)
        return parsed.path.rstrip("/")
    
    return url


def get_language_from_path(path):
    """Determina o idioma baseado no caminho"""
    if not path or not isinstance(path, str):
        return "pt"  # Padrão para português
    
    # Verifica se o caminho começa com /en/, /es/, /fr/
    if path.startswith("/en/"):
        return "en"
    elif path.startswith("/es/"):
        return "es"
    elif path.startswith("/fr/"):
        return "fr"
    elif path.startswith("/pt/"):
        return "pt"
    
    # Para caminhos sem prefixo de idioma, assume português
    return "pt"


def classify_links_by_language(links):
    """Classifica links por idioma"""
    classified = {
        "pt": set(),
        "en": set(),
        "es": set(),
        "fr": set(),
    }
    
    for link in links:
        if not link:
            continue
        
        # Normaliza a URL
        normalized = normalize_url(link)
        if not normalized:
            continue
        
        # Determina o idioma
        lang = get_language_from_path(normalized)
        
        # Adiciona ao idioma correspondente
        classified[lang].add(normalized)
    
    return classified


def read_sitemap(sitemap_path):
    """Lê um sitemap existente e retorna as URLs"""
    urls = set()
    
    if not sitemap_path.exists():
        print(f"⚠️  Arquivo não encontrado: {sitemap_path}")
        return urls
    
    try:
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
        
        # Namespace do sitemap
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        
        # Extrair URLs
        for url_elem in root.findall(".//sm:url/sm:loc", ns):
            url = url_elem.text.strip()
            urls.add(url)
        
        print(f"✅ {sitemap_path.name}: {len(urls)} URLs existentes")
        
    except ET.ParseError as e:
        print(f"❌ Erro ao parsear {sitemap_path.name}: {e}")
    
    return urls


def create_sitemap_xml(urls, base_url="https://getnexo.com.br"):
    """Cria um XML de sitemap a partir de uma lista de URLs"""
    # Cria a estrutura XML
    root = ET.Element("urlset")
    root.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Adiciona cada URL
    for url in sorted(urls):
        url_elem = ET.SubElement(root, "url")
        
        loc_elem = ET.SubElement(url_elem, "loc")
        loc_elem.text = f"{base_url}{url}"
        
        lastmod_elem = ET.SubElement(url_elem, "lastmod")
        lastmod_elem.text = datetime.now().strftime("%Y-%m-%d")
        
        changefreq_elem = ET.SubElement(url_elem, "changefreq")
        changefreq_elem.text = "weekly"
        
        priority_elem = ET.SubElement(url_elem, "priority")
        priority_elem.text = "0.8"
    
    # Converte para string
    from xml.dom import minidom
    xml_str = minidom.parseString(ET.tostring(root)).toprettyxml(indent="  ")
    
    # Remove a declaração XML duplicada
    lines = xml_str.split("\n")
    if lines[0].startswith('<?xml'):
        lines = lines[1:]
    
    return "\n".join(lines)


def update_sitemap(sitemap_path, new_urls, base_url="https://getnexo.com.br"):
    """Atualiza um sitemap com novas URLs"""
    # Lê as URLs existentes
    existing_urls = read_sitemap(sitemap_path)
    
    # Combina URLs existentes e novas
    all_urls = existing_urls.union(new_urls)
    
    print(f"📊 {sitemap_path.name}:")
    print(f"   URLs existentes: {len(existing_urls)}")
    print(f"   URLs novas: {len(new_urls)}")
    print(f"   Total após atualização: {len(all_urls)}")
    
    # Cria o novo XML
    xml_content = create_sitemap_xml(all_urls, base_url)
    
    # Salva o arquivo
    try:
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(xml_content)
        print(f"✅ {sitemap_path.name} atualizado com sucesso!")
        return True
    except Exception as e:
        print(f"❌ Erro ao salvar {sitemap_path.name}: {e}")
        return False


def main():
    print("=" * 80)
    print("ATUALIZAÇÃO DOS SITEMAPS")
    print("=" * 80)
    print()
    
    # 1. Extrair links do site
    print("📋 EXTRAINDO LINKS DO SITE...")
    print("-" * 80)
    
    site_links = set()
    
    # Extrair links do diretório src
    if SRC_DIR.exists():
        src_links = extract_links_from_directory(SRC_DIR)
        site_links.update(src_links)
    
    # Extrair links do diretório public
    if PUBLIC_DIR.exists():
        public_links = extract_links_from_directory(PUBLIC_DIR)
        site_links.update(public_links)
    
    print(f"\n📊 TOTAL: {len(site_links)} links únicos no site")
    print()
    
    # 2. Classificar links por idioma
    print("📋 CLASSIFICANDO LINKS POR IDIOMA...")
    print("-" * 80)
    
    classified_links = classify_links_by_language(site_links)
    
    for lang, links in classified_links.items():
        print(f"✅ {lang.upper()}: {len(links)} links")
    
    print()
    
    # 3. Atualizar cada sitemap
    print("📋 ATUALIZANDO SITEMAPS...")
    print("-" * 80)
    
    base_url = "https://getnexo.com.br"
    
    for lang, sitemap_path in SITEMAPS.items():
        print(f"\n🔄 Atualizando {sitemap_path.name}...")
        
        # Obter links para este idioma
        links_for_lang = classified_links.get(lang, set())
        
        # Atualizar o sitemap
        success = update_sitemap(sitemap_path, links_for_lang, base_url)
        
        if not success:
            print(f"❌ Falha ao atualizar {sitemap_path.name}")
    
    print()
    print("=" * 80)
    print("ATUALIZAÇÃO CONCLUÍDA")
    print("=" * 80)
    print()
    
    # 4. Resumo final
    print("📊 RESUMO FINAL:")
    print("-" * 80)
    
    total_links = sum(len(links) for links in classified_links.values())
    print(f"Total de links no site: {total_links}")
    
    for lang in ["pt", "en", "es", "fr"]:
        links_count = len(classified_links.get(lang, set()))
        print(f"  {lang.upper()}: {links_count} links")
    
    print()
    print("✅ Todos os sitemaps foram atualizados com os links do site!")


if __name__ == "__main__":
    main()
