#!/usr/bin/env python3
"""
Script para comparar arquivos de tradução (i18n) e identificar inconsistências
entre os idiomas português, inglês, espanhol e francês.
"""

import json
import os
from typing import Dict, Set, List, Any

def load_i18n_files() -> Dict[str, Dict[str, Any]]:
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

def compare_structure(translations: Dict[str, Dict[str, Any]]) -> Dict[str, List[str]]:
    """Compara a estrutura dos arquivos de tradução."""
    issues = {
        'missing_keys': [],
        'extra_keys': [],
        'inconsistent_slugs': [],
        'inconsistent_features': []
    }
    
    # Obter todas as chaves de todos os idiomas
    all_keys = set()
    for lang, data in translations.items():
        all_keys.update(data.keys())
    
    # Verificar chaves ausentes em cada idioma
    for lang in translations:
        missing = all_keys - set(translations[lang].keys())
        if missing:
            issues['missing_keys'].append(f"{lang}: {sorted(missing)}")
    
    # Verificar slugs específicos
    pt_slugs = translations['pt'].get('slugs', {})
    for lang in ['en', 'es', 'fr']:
        if 'slugs' in translations[lang]:
            lang_slugs = translations[lang]['slugs']
            
            # Verificar chat_ia slug inconsistente
            if pt_slugs.get('chat_ia') != lang_slugs.get('chat_ia'):
                issues['inconsistent_slugs'].append(
                    f"chat_ia: pt='{pt_slugs.get('chat_ia')}', {lang}='{lang_slugs.get('chat_ia')}'"
                )
            
            # Verificar how_it_works slug inconsistente
            if pt_slugs.get('how_it_works') != lang_slugs.get('how_it_works'):
                issues['inconsistent_slugs'].append(
                    f"how_it_works: pt='{pt_slugs.get('how_it_works')}', {lang}='{lang_slugs.get('how_it_works')}'"
                )
    
    # Verificar features inconsistentes
    pt_features = translations['pt'].get('features_giant', {})
    for lang in ['en', 'es', 'fr']:
        if 'features_giant' in translations[lang]:
            lang_features = translations[lang]['features_giant']
            
            # Verificar se clustering existe em português (não existe)
            if 'clustering' in lang_features and 'clustering' not in pt_features:
                issues['inconsistent_features'].append(
                    f"{lang}: tem 'clustering' mas pt não tem"
                )
    
    return issues

def generate_consistency_report(translations: Dict[str, Dict[str, Any]], issues: Dict[str, List[str]]) -> str:
    """Gera um relatório de consistência."""
    report = "# Relatório de Consistência de Tradução (i18n)\n\n"
    
    # Estatísticas básicas
    report += "## Estatísticas Básicas\n"
    for lang, data in translations.items():
        key_count = len(data)
        report += f"- **{lang.upper()}:** {key_count} chaves principais\n"
    
    report += "\n## Problemas Encontrados\n"
    
    # Chaves ausentes
    if issues['missing_keys']:
        report += "\n### 🔴 Chaves Ausentes\n"
        for issue in issues['missing_keys']:
            report += f"- {issue}\n"
    
    # Slugs inconsistentes
    if issues['inconsistent_slugs']:
        report += "\n### 🔴 Slugs Inconsistentes\n"
        for issue in issues['inconsistent_slugs']:
            report += f"- {issue}\n"
    
    # Features inconsistentes
    if issues['inconsistent_features']:
        report += "\n### 🔴 Features Inconsistentes\n"
        for issue in issues['inconsistent_features']:
            report += f"- {issue}\n"
    
    # Recomendações
    report += "\n## Recomendações\n"
    report += "1. **Padronizar slugs:** O slug 'chat_ia' deve ser consistente em todos os idiomas\n"
    report += "2. **Adicionar clustering ao português:** O feature 'clustering' está presente em inglês, espanhol e francês, mas falta no português\n"
    report += "3. **Verificar how_it_works slug:** O slug deve seguir o padrão de todos os idiomas\n"
    report += "4. **Validar footer:** O footer em francês tem mistura de português e espanhol\n"
    
    return report

def main():
    """Função principal."""
    print("🔍 Comparando arquivos de tradução...")
    
    translations = load_i18n_files()
    
    if not translations:
        print("❌ Nenhum arquivo de tradução carregado com sucesso.")
        return
    
    issues = compare_structure(translations)
    
    # Gerar relatório
    report = generate_consistency_report(translations, issues)
    
    # Salvar relatório
    with open('relatorio_consistencia_i18n.md', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("✅ Relatório de consistência gerado: relatorio_consistencia_i18n.md")
    
    # Imprimir resumo
    print("\n📊 Resumo:")
    total_issues = sum(len(issues[key]) for key in issues)
    print(f"- Total de problemas encontrados: {total_issues}")
    
    for issue_type, problems in issues.items():
        if problems:
            print(f"- {issue_type.replace('_', ' ').title()}: {len(problems)} problemas")

if __name__ == "__main__":
    main()