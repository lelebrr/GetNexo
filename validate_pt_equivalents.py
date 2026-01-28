#!/usr/bin/env python3
"""
Script para validar que todas as páginas em português têm equivalentes 
nos outros idiomas (inglês, espanhol, francês).
"""

import json
import os
from typing import Dict, Set, List, Tuple

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

def extract_page_equivalents(translations: Dict[str, Dict[str, any]]) -> Dict[str, Dict[str, str]]:
    """Extrai equivalentes de páginas entre os idiomas."""
    equivalents = {}
    
    # Mapeamento de slugs
    for lang in ['pt', 'en', 'es', 'fr']:
        if 'slugs' in translations[lang]:
            for slug_name, slug_value in translations[lang]['slugs'].items():
                if slug_name not in equivalents:
                    equivalents[slug_name] = {}
                equivalents[slug_name][lang] = slug_value
    
    # Mapeamento de menu items
    for lang in ['pt', 'en', 'es', 'fr']:
        if 'menu' in translations[lang]:
            for menu_name, menu_value in translations[lang]['menu'].items():
                if menu_name not in equivalents:
                    equivalents[menu_name] = {}
                equivalents[menu_name][f'menu_{lang}'] = menu_value
    
    # Mapeamento de features
    for lang in ['pt', 'en', 'es', 'fr']:
        if 'features_giant' in translations[lang]:
            for feature_name, feature_data in translations[lang]['features_giant'].items():
                if feature_name not in equivalents:
                    equivalents[feature_name] = {}
                equivalents[feature_name][f'feature_{lang}'] = feature_data.get('title', '')
    
    return equivalents

def validate_pt_equivalents(equivalents: Dict[str, Dict[str, str]]) -> Tuple[List[str], List[str], List[str]]:
    """Valida que todas as páginas em português têm equivalentes nos outros idiomas."""
    missing_in_en = []
    missing_in_es = []
    missing_in_fr = []
    
    for page_name, page_data in equivalents.items():
        # Verificar equivalente em inglês
        if 'en' not in page_data and 'menu_en' not in page_data and 'feature_en' not in page_data:
            missing_in_en.append(page_name)
        
        # Verificar equivalente em espanhol
        if 'es' not in page_data and 'menu_es' not in page_data and 'feature_es' not in page_data:
            missing_in_es.append(page_name)
        
        # Verificar equivalente em francês
        if 'fr' not in page_data and 'menu_fr' not in page_data and 'feature_fr' not in page_data:
            missing_in_fr.append(page_name)
    
    return missing_in_en, missing_in_es, missing_in_fr

def generate_validation_report(equivalents: Dict[str, Dict[str, str]], 
                             missing_in_en: List[str], 
                             missing_in_es: List[str], 
                             missing_in_fr: List[str]) -> str:
    """Gera um relatório de validação."""
    report = "# Relatório de Validação de Páginas em Português\n\n"
    
    # Estatísticas
    total_pages = len(equivalents)
    report += f"## Estatísticas Gerais\n"
    report += f"- **Total de páginas/funcionalidades:** {total_pages}\n"
    report += f"- **Páginas sem equivalente em inglês:** {len(missing_in_en)}\n"
    report += f"- **Páginas sem equivalente em espanhol:** {len(missing_in_es)}\n"
    report += f"- **Páginas sem equivalente em francês:** {len(missing_in_fr)}\n"
    
    # Páginas com equivalentes completos
    complete_pages = []
    for page_name, page_data in equivalents.items():
        has_en = 'en' in page_data or 'menu_en' in page_data or 'feature_en' in page_data
        has_es = 'es' in page_data or 'menu_es' in page_data or 'feature_es' in page_data
        has_fr = 'fr' in page_data or 'menu_fr' in page_data or 'feature_fr' in page_data
        
        if has_en and has_es and has_fr:
            complete_pages.append(page_name)
    
    report += f"- **Páginas com equivalentes completos:** {len(complete_pages)}\n"
    report += f"- **Taxa de completude:** {(len(complete_pages)/total_pages*100):.1f}%\n\n"
    
    # Páginas faltantes
    if missing_in_en:
        report += "## 🔴 Páginas em Português sem Equivalente em Inglês\n"
        for page in sorted(missing_in_en):
            report += f"- {page}\n"
        report += "\n"
    
    if missing_in_es:
        report += "## 🔴 Páginas em Português sem Equivalente em Espanhol\n"
        for page in sorted(missing_in_es):
            report += f"- {page}\n"
        report += "\n"
    
    if missing_in_fr:
        report += "## 🔴 Páginas em Português sem Equivalente em Francês\n"
        for page in sorted(missing_in_fr):
            report += f"- {page}\n"
        report += "\n"
    
    # Tabela de equivalentes
    report += "## Tabela de Equivalentes por Página\n\n"
    report += "| Página | PT | EN | ES | FR | Status |\n"
    report += "|--------|----|----|----|----|--------|\n"
    
    for page_name, page_data in sorted(equivalents.items()):
        pt_value = page_data.get('pt', page_data.get('menu_pt', page_data.get('feature_pt', 'N/A')))
        en_value = page_data.get('en', page_data.get('menu_en', page_data.get('feature_en', 'N/A')))
        es_value = page_data.get('es', page_data.get('menu_es', page_data.get('feature_es', 'N/A')))
        fr_value = page_data.get('fr', page_data.get('menu_fr', page_data.get('feature_fr', 'N/A')))
        
        has_en = 'en' in page_data or 'menu_en' in page_data or 'feature_en' in page_data
        has_es = 'es' in page_data or 'menu_es' in page_data or 'feature_es' in page_data
        has_fr = 'fr' in page_data or 'menu_fr' in page_data or 'feature_fr' in page_data
        
        if has_en and has_es and has_fr:
            status = "✅ Completo"
        elif has_en and has_es:
            status = "⚠️ FR faltante"
        elif has_en and has_fr:
            status = "⚠️ ES faltante"
        elif has_es and has_fr:
            status = "⚠️ EN faltante"
        elif has_en:
            status = "⚠️ ES+FR faltantes"
        elif has_es:
            status = "⚠️ EN+FR faltantes"
        elif has_fr:
            status = "⚠️ EN+ES faltantes"
        else:
            status = "❌ Sem equivalentes"
        
        report += f"| {page_name} | {pt_value} | {en_value} | {es_value} | {fr_value} | {status} |\n"
    
    return report

def main():
    """Função principal."""
    print("🔍 Validando equivalentes de páginas em português...")
    
    # Carregar arquivos de tradução
    translations = load_i18n_files()
    
    if not translations:
        print("❌ Nenhum arquivo de tradução carregado com sucesso.")
        return
    
    # Extrair equivalentes
    equivalents = extract_page_equivalents(translations)
    
    # Validar equivalentes
    missing_in_en, missing_in_es, missing_in_fr = validate_pt_equivalents(equivalents)
    
    # Gerar relatório
    report = generate_validation_report(equivalents, missing_in_en, missing_in_es, missing_in_fr)
    
    # Salvar relatório
    with open('relatorio_validacao_pt_equivalents.md', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("✅ Relatório de validação gerado: relatorio_validacao_pt_equivalents.md")
    
    # Imprimir resumo
    print("\n📊 Resumo:")
    total_pages = len(equivalents)
    print(f"- Total de páginas/funcionalidades: {total_pages}")
    print(f"- Páginas sem equivalente em inglês: {len(missing_in_en)}")
    print(f"- Páginas sem equivalente em espanhol: {len(missing_in_es)}")
    print(f"- Páginas sem equivalente em francês: {len(missing_in_fr)}")
    
    if not missing_in_en and not missing_in_es and not missing_in_fr:
        print("✅ Todas as páginas em português têm equivalentes nos outros idiomas!")
    else:
        print("⚠️ Algumas páginas em português estão sem equivalentes em outros idiomas.")

if __name__ == "__main__":
    main()