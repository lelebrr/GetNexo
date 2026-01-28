#!/usr/bin/env python3
"""
Script para atualizar sitemaps com base nos arquivos de tradução (i18n),
garantindo que todas as páginas traduzidas estejam presentes nos sitemaps.
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Set

def load_i18n_files() -> Dict[str, Dict[str, any]]:
    """Carrega todos os arquivos de tradução."""
    files = {
        'pt': 'getnexo-site/src/i18n/pt.json',
        'en': 'getnexo-site/src/i18n/en.json', 
        'es': 'getnexo-site/src/i18n/es.json',
        'fr': 'getnexo-site/src/i18n/fr.json'
    }
    
    translations = {}
    for lang, file_path in files.items():
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                translations[lang] = json.load(f)
        except FileNotFoundError:
            print(f"Arquivo não encontrado: {file_path}")
        except json.JSONDecodeError as e:
            print(f"Erro ao JSON no arquivo {file_path}: {e}")
    
    return translations

def extract_urls_from_i18n(translations: Dict[str, Dict[str, any]]) -> Dict[str, Set[str]]:
    """Extrai URLs dos arquivos de tradução."""
    urls_by_lang = {}
    
    for lang, data in translations.items():
        urls = set()
        
        # Base URL para o idioma
        base_url = f"https://getnexo.com.br/{lang}" if lang != 'pt' else "https://getnexo.com.br"
        
        # Adicionar páginas base dos slugs
        if 'slugs' in data:
            for slug_name, slug_value in data['slugs'].items():
                if slug_value:  # Ignora slugs vazios
                    url = f"{base_url}/{slug_value}"
                    urls.add(url)
        
        # Adicionar páginas específicas de features
        if 'features_giant' in data:
            for feature_name, feature_data in data['features_giant'].items():
                if feature_name != 'magic_replies':  # magic_replies já está no analytics
                    feature_url = f"{base_url}/{feature_name}"
                    urls.add(feature_url)
        
        # Adicionar página de blog
        if 'blog' in data:
            blog_url = f"{base_url}/blog"
            urls.add(blog_url)
        
        # Adicionar página de contato
        if 'menu' in data and 'contact' in data['menu']:
            contact_url = f"{base_url}/contato" if lang == 'pt' else f"{base_url}/contact"
            urls.add(contact_url)
        
        # Adicionar página de about
        if 'slugs' in data and 'about' in data['slugs']:
            about_url = f"{base_url}/sobre" if lang == 'pt' else f"{base_url}/about"
            urls.add(about_url)
        
        # Adicionar página de privacy
        if 'slugs' in data and 'privacy' in data['slugs']:
            privacy_url = f"{base_url}/privacidade" if lang == 'pt' else f"{base_url}/privacy"
            urls.add(privacy_url)
        
        # Adicionar página de terms
        if 'slugs' in data and 'terms' in data['slugs']:
            terms_url = f"{base_url}/termos" if lang == 'pt' else f"{base_url}/terms"
            urls.add(terms_url)
        
        # Adicionar página de FAQ
        if 'slugs' in data and 'faq' in data['slugs']:
            faq_url = f"{base_url}/faq" if lang == 'pt' else f"{base_url}/faq"
            urls.add(faq_url)
        
        urls_by_lang[lang] = urls
    
    return urls_by_lang

def generate_sitemap_xml(urls: Set[str], lang: str) -> str:
    """Gera o XML do sitemap para um idioma."""
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    xml_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''
    
    for url in sorted(urls):
        xml_content += f'''    <url>
        <loc>{url}</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
'''
    
    xml_content += '''</urlset>'''
    
    return xml_content

def update_sitemaps(urls_by_lang: Dict[str, Set[str]]):
    """Atualiza os arquivos de sitemap."""
    sitemap_files = {
        'pt': 'getnexo-site/public/sitemap-pt.xml',
        'en': 'getnexo-site/public/sitemap-en.xml',
        'es': 'getnexo-site/public/sitemap-es.xml',
        'fr': 'getnexo-site/public/sitemap-fr.xml'
    }
    
    for lang, urls in urls_by_lang.items():
        if lang in sitemap_files:
            sitemap_content = generate_sitemap_xml(urls, lang)
            
            # Criar diretório se não existir
            os.makedirs(os.path.dirname(sitemap_files[lang]), exist_ok=True)
            
            # Escrever o arquivo
            with open(sitemap_files[lang], 'w', encoding='utf-8') as f:
                f.write(sitemap_content)
            
            print(f"✅ Sitemap {lang.upper()} atualizado com {len(urls)} URLs")

def generate_comparison_report(urls_by_lang: Dict[str, Set[str]]):
    """Gera um relatório de comparação entre os sitemaps."""
    report = "# Relatório de Atualização de Sitemaps com Base em i18n\n\n"
    
    # Estatísticas
    report += "## Estatísticas de URLs por Idioma\n"
    for lang, urls in urls_by_lang.items():
        report += f"- **{lang.upper()}:** {len(urls)} URLs\n"
    
    report += "\n## URLs por Idioma\n"
    
    # Comparação de URLs
    all_urls = set()
    for urls in urls_by_lang.values():
        all_urls.update(urls)
    
    report += "\n### URLs Comuns a Todos os Idiomas\n"
    common_urls = set(urls_by_lang['pt'])
    for lang in ['en', 'es', 'fr']:
        common_urls.intersection_update(urls_by_lang[lang])
    
    for url in sorted(common_urls):
        report += f"- {url}\n"
    
    report += f"\n**Total de URLs comuns: {len(common_urls)}**\n"
    
    # URLs únicas por idioma
    report += "\n### URLs Únicas por Idioma\n"
    for lang in ['pt', 'en', 'es', 'fr']:
        unique_urls = urls_by_lang[lang] - common_urls
        if unique_urls:
            report += f"\n#### {lang.upper()} (URLs únicas: {len(unique_urls)})\n"
            for url in sorted(unique_urls):
                report += f"- {url}\n"
    
    return report

def main():
    """Função principal."""
    print("🔄 Atualizando sitemaps com base nos arquivos de tradução...")
    
    # Carregar arquivos de tradução
    translations = load_i18n_files()
    
    if not translations:
        print("❌ Nenhum arquivo de tradução carregado com sucesso.")
        return
    
    # Extrair URLs dos arquivos de tradução
    urls_by_lang = extract_urls_from_i18n(translations)
    
    # Atualizar sitemaps
    update_sitemaps(urls_by_lang)
    
    # Gerar relatório de comparação
    report = generate_comparison_report(urls_by_lang)
    
    # Salvar relatório
    with open('relatorio_atualizacao_sitemaps_i18n.md', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("✅ Relatório de atualização gerado: relatorio_atualizacao_sitemaps_i18n.md")
    
    # Imprimir resumo
    print("\n📊 Resumo:")
    total_urls = sum(len(urls) for urls in urls_by_lang.values())
    print(f"- Total de URLs processadas: {total_urls}")
    
    for lang, urls in urls_by_lang.items():
        print(f"- Sitemap {lang.upper()}: {len(urls)} URLs")

if __name__ == "__main__":
    main()