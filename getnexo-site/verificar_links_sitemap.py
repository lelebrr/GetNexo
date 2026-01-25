#!/usr/bin/env python3
"""
Script para verificar se todos os links do site estão presentes nos sitemaps.xml
"""

import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse, urljoin

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


def extract_urls_from_sitemap(sitemap_path):
    """Extrai todos os URLs de um arquivo sitemap.xml"""
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
        
        print(f"✅ {sitemap_path.name}: {len(urls)} URLs encontrados")
        
    except ET.ParseError as e:
        print(f"❌ Erro ao parsear {sitemap_path.name}: {e}")
    
    return urls


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


def main():
    print("=" * 80)
    print("VERIFICAÇÃO DE LINKS NO SITEMAP")
    print("=" * 80)
    print()
    
    # 1. Extrair URLs dos sitemaps
    print("📋 EXTRAINDO URLs DOS SITEMAPS...")
    print("-" * 80)
    
    sitemap_urls = {}
    for lang, sitemap_path in SITEMAPS.items():
        urls = extract_urls_from_sitemap(sitemap_path)
        sitemap_urls[lang] = urls
    
    # Combinar todas as URLs dos sitemaps
    all_sitemap_urls = set()
    for urls in sitemap_urls.values():
        all_sitemap_urls.update(urls)
    
    print(f"\n📊 TOTAL: {len(all_sitemap_urls)} URLs únicos em todos os sitemaps")
    print()
    
    # 2. Extrair links do site
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
    
    # 3. Normalizar URLs
    print("📋 NORMALIZANDO URLs...")
    print("-" * 80)
    
    normalized_sitemap_urls = {normalize_url(url) for url in all_sitemap_urls if url}
    normalized_site_links = {normalize_url(link) for link in site_links if link}
    
    print(f"✅ URLs normalizadas: {len(normalized_sitemap_urls)} (sitemap) | {len(normalized_site_links)} (site)")
    print()
    
    # 4. Comparar e identificar links faltantes
    print("📋 COMPARANDO LINKS...")
    print("-" * 80)
    
    # Links que estão no site mas não nos sitemaps
    missing_in_sitemap = normalized_site_links - normalized_sitemap_urls
    
    # Links que estão nos sitemaps mas não no site (pode ser normal)
    missing_in_site = normalized_sitemap_urls - normalized_site_links
    
    # Links que estão em ambos
    common_links = normalized_site_links & normalized_sitemap_urls
    
    print(f"✅ Links em ambos (site e sitemap): {len(common_links)}")
    print(f"⚠️  Links no site mas NÃO no sitemap: {len(missing_in_sitemap)}")
    print(f"ℹ️  Links no sitemap mas NÃO no site: {len(missing_in_site)}")
    print()
    
    # 5. Exibir resultados detalhados
    print("=" * 80)
    print("RESULTADOS DETALHADOS")
    print("=" * 80)
    print()
    
    # Links faltantes no sitemap
    if missing_in_sitemap:
        print("⚠️  LINKS NO SITE MAS NÃO NO SITEMAP:")
        print("-" * 80)
        
        # Agrupar por tipo
        internal_links = [link for link in missing_in_sitemap if link.startswith("/")]
        external_links = [link for link in missing_in_sitemap if link.startswith("http")]
        other_links = [link for link in missing_in_sitemap if not link.startswith("/") and not link.startswith("http")]
        
        if internal_links:
            print(f"\n🔗 Links Internos ({len(internal_links)}):")
            for link in sorted(internal_links)[:50]:  # Limitar a 50 para não poluir
                print(f"  - {link}")
            if len(internal_links) > 50:
                print(f"  ... e mais {len(internal_links) - 50} links internos")
        
        if external_links:
            print(f"\n🌐 Links Externos ({len(external_links)}):")
            for link in sorted(external_links)[:20]:
                print(f"  - {link}")
            if len(external_links) > 20:
                print(f"  ... e mais {len(external_links) - 20} links externos")
        
        if other_links:
            print(f"\n❓ Outros Links ({len(other_links)}):")
            for link in sorted(other_links)[:20]:
                print(f"  - {link}")
            if len(other_links) > 20:
                print(f"  ... e mais {len(other_links) - 20} outros links")
        
        print()
    else:
        print("✅ Todos os links do site estão presentes nos sitemaps!")
        print()
    
    # Links faltantes no site
    if missing_in_site:
        print("ℹ️  LINKS NO SITEMAP MAS NÃO NO SITE:")
        print("-" * 80)
        
        # Agrupar por tipo
        internal_links = [link for link in missing_in_site if link.startswith("/")]
        external_links = [link for link in missing_in_site if link.startswith("http")]
        
        if internal_links:
            print(f"\n🔗 Links Internos ({len(internal_links)}):")
            for link in sorted(internal_links)[:20]:
                print(f"  - {link}")
            if len(internal_links) > 20:
                print(f"  ... e mais {len(internal_links) - 20} links internos")
        
        if external_links:
            print(f"\n🌐 Links Externos ({len(external_links)}):")
            for link in sorted(external_links)[:20]:
                print(f"  - {link}")
            if len(external_links) > 20:
                print(f"  ... e mais {len(external_links) - 20} links externos")
        
        print()
    
    # 6. Estatísticas finais
    print("=" * 80)
    print("ESTATÍSTICAS FINAIS")
    print("=" * 80)
    print()
    
    total_links = len(normalized_site_links)
    total_sitemap = len(normalized_sitemap_urls)
    missing_count = len(missing_in_sitemap)
    
    if total_links > 0:
        coverage = ((total_links - missing_count) / total_links) * 100
        print(f"📊 Cobertura do Sitemap: {coverage:.1f}%")
        print(f"   Total de links no site: {total_links}")
        print(f"   Total de URLs no sitemap: {total_sitemap}")
        print(f"   Links faltantes no sitemap: {missing_count}")
        print()
        
        if coverage == 100:
            print("🎉 PARABÉNS! Todos os links do site estão nos sitemaps!")
        elif coverage >= 90:
            print("✅ BOA COBERTURA! Apenas alguns links faltando no sitemap.")
        elif coverage >= 70:
            print("⚠️  COBERTURA MÉDIA. Vários links faltando no sitemap.")
        else:
            print("❌ COBERTURA BAIXA. Muitos links faltando no sitemap.")
    else:
        print("❌ Nenhum link encontrado no site!")
    
    print()
    print("=" * 80)
    print("FIM DA VERIFICAÇÃO")
    print("=" * 80)


if __name__ == "__main__":
    main()
