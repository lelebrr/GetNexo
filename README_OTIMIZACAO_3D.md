# 🚀 Otimizador de Modelos 3D para Blender

Script automático que otimiza todos os arquivos .glb/.gltf de uma pasta, reduzindo o tamanho e melhorando o desempenho.

## 📁 Estrutura de Pastas

```
/home/lele/usenexo/
├── models_raw/          # 📥 Coloque seus .glb pesados aqui
├── models_otimizados/  # 📨 Arquivos otimizados salvos aqui
└── otimiza_blender.py  # 🤖 Script de otimização
```

## 🛠️ Configuração

### 1. Crie as pastas (já feito)
```bash
mkdir -p models_raw models_otimizados
```

### 2. Coloque seus arquivos .glb na pasta `models_raw`
```bash
# Exemplo de como copiar arquivos
cp /caminho/seus/arquivos.glb /home/lele/usenexo/models_raw/
```

### 3. Ajuste as configurações no script (se necessário)
Abra [`otimiza_blender.py`](otimiza_blender.py) e modifique:

```python
# Configuração rápida
DECIMATE_RATIO = 0.3        # 0.3 = 70% menos polígonos (mude para 0.5 = 50% menos)
USE_DRAKE = True            # compressão extra (mantenha True)
TEXTURE_QUALITY = 1.0       # 1.0 = máxima qualidade
```

## 🎯 Como Usar

### Método 1: Via Interface do Blender (Recomendado para testes)

1. **Abra o Blender**
2. Vá para a aba **Scripting** (no topo da interface)
3. Clique em **New** para criar um novo script
4. **Copie todo o conteúdo** do arquivo [`otimiza_blender.py`](otimiza_blender.py)
5. **Cole** no editor de scripts do Blender
6. **Verifique os caminhos** no script (já configurados para Linux)
7. Clique no botão **▶ Play** (Run Script)

### Método 2: Via Terminal (Para automação completa)

```bash
# Abra o terminal e execute:
blender --background --python otimiza_blender.py
```

## 📊 Resultados Esperados

- **Redução de até 70%** no número de polígonos
- **Compressão Draco** para arquivos menores
- **Manutenção de texturas** e qualidade visual
- **Nomes de arquivo** sufixados com `_otimizado.glb`

## 🔧 Personalização

### Menos agressivo (redução de 50%)
```python
DECIMATE_RATIO = 0.5  # 50% menos polígonos
```

### Sem compressão Draco
```python
USE_DRAKE = False  # Desativa compressão extra
```

### Qualidade de textura reduzida (arquivos menores)
```python
TEXTURE_QUALITY = 0.5  # Metade da qualidade das texturas
```

## 🚨 Solução de Problemas

### Se o script travar:
1. **Teste com um arquivo só** primeiro
2. **Verifique os caminhos** no script
3. **Confira se os arquivos .glb** não estão corrompidos
4. **Atualize o Blender** para a versão mais recente

### Erros comuns:
- `FileNotFoundError`: Verifique se os arquivos estão na pasta `models_raw`
- `ImportError`: Instale dependências com `pip install bpy` (geralmente já vem com Blender)
- `PermissionError`: Verifique permissões das pastas

## 📈 Performance

- **1 arquivo pequeno**: ~10-30 segundos
- **1 arquivo médio**: ~1-3 minutos  
- **1 arquivo grande**: ~5-15 minutos

## 🎉 Pronto!

Depois de rodar o script, todos os seus modelos otimizados estarão na pasta `models_otimizados` prontos para usar em seus projetos web ou AR.

---

**Dica**: Faça backup dos seus arquivos originais antes de começar!