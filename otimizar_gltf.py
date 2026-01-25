#!/usr/bin/env python3
import os
import subprocess
import sys
from pathlib import Path

def otimizar_gltf():
    # Caminhos de origem e destino
    origem = Path.home() / "usenexo" / "glb"
    destino = Path.home() / "usenexo" / "public" / "glbPronto"
    
    # Comando do gltf-transform
    gltf_cmd = "/tmp/gltf-transform/node_modules/.bin/gltf-transform"
    
    # Criar diretório de destino se não existir
    destino.mkdir(parents=True, exist_ok=True)
    
    # Encontrar todos os arquivos GLB
    glb_files = list(origem.rglob("*.glb"))
    
    print(f"Encontrados {len(glb_files)} arquivos GLB para otimizar")
    
    for arquivo in glb_files:
        # Calcular caminho relativo
        relativo = arquivo.relative_to(origem)
        arquivo_saida = destino / relativo
        
        # Criar diretório de destino se necessário
        arquivo_saida.parent.mkdir(parents=True, exist_ok=True)
        
        print(f"Otimizando: {arquivo.name}")
        
        # Construir comando
        cmd = [
            gltf_cmd,
            "optimize",
            str(arquivo),
            str(arquivo_saida),
            "--compress=draco",
            "--texture-compress=webp",
            "--texture-size=1024"
        ]
        
        try:
            # Executar comando
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Extrair informações de tamanho da saída
            output = result.stdout
            for line in output.split('\n'):
                if '→' in line and 'MB' in line:
                    print(f"  {line.strip()}")
                    
        except subprocess.CalledProcessError as e:
            print(f"  Erro ao otimizar {arquivo.name}: {e}")
            continue
    
    print("\nOtimização concluída!")
    print(f"Arquivos otimizados salvos em: {destino}")

if __name__ == "__main__":
    otimizar_gltf()