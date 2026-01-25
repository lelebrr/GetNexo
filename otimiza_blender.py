import bpy
import os
from math import radians

# PADRÃO: PASTAS (Linux paths)
RAW_DIR = "/home/lele/usenexo/models_raw"        # pasta com .glb pesados
OPT_DIR = "/home/lele/usenexo/models_otimizados"  # pasta para salvar os otimizados

# CONFIGURAÇÃO RÁPIDA
DECIMATE_RATIO = 0.3        # 0.3 = 70% menos polígonos
USE_DRAKE = True            # compressão extra
TEXTURE_QUALITY = 1.0       # 1.0 = qualidade alta, 0.5 = leve

# Limpa a cena antes de começar
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Loop em todos os .glb
for arquivo in os.listdir(RAW_DIR):
    if arquivo.endswith(".glb") or arquivo.endswith(".gltf"):
        caminho = os.path.join(RAW_DIR, arquivo)
        nome_saida = os.path.splitext(arquivo)[0] + "_otimizado.glb"
        caminho_saida = os.path.join(OPT_DIR, nome_saida)
        
        print(f"Processando: {arquivo}")
        
        try:
            # Importa
            bpy.ops.import_scene.gltf(filepath=caminho)
            
            # Seleciona o objeto importado
            bpy.ops.object.select_all(action='DESELECT')
            bpy.ops.object.select_pattern(pattern=".*")
            bpy.ops.object.select_linked(type='OBDATA')
            
            # Aplica Decimate
            bpy.ops.object.modifier_add(type='DECIMATE')
            mod = bpy.context.object.modifiers[-1]
            mod.ratio = DECIMATE_RATIO
            bpy.ops.object.modifier_apply(modifier=mod.name)
            
            # Aplica transformações
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
            
            # Exporta
            bpy.ops.export_scene.gltf(
                filepath=caminho_saida,
                export_format="GLB",
                export_apply=True,
                export_compress=USE_DRAKE,
                export_selected=True
            )
            
            print(f"✅ {arquivo} -> {nome_saida}")
            
        except Exception as e:
            print(f"❌ Erro ao processar {arquivo}: {str(e)}")
            continue
        
        # Limpa cena para o próximo arquivo
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete()

print("\n🎉 Otimização concluída! Olha na pasta models_otimizados")
print(f"📁 Arquivos otimizados salvos em: {OPT_DIR}")