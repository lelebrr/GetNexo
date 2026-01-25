// src/components/ARViewer.jsx
import { useState, useRef, useEffect } from 'react'

export default function ARViewer({ produto = 'tenis_branco.glb', arAtivo = true, logoPulsante = true }) {
    const viewerRef = useRef()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modelLoaded, setModelLoaded] = useState(false)

    useEffect(() => {
        let modelViewerElement = null

        const initModelViewer = async () => {
            try {
                // Carrega dinamicamente o Model Viewer
                if (!window.ModelViewer) {
                    await import('@google/model-viewer')
                }

                if (viewerRef.current && !modelViewerElement) {
                    // Cria o elemento model-viewer
                    modelViewerElement = document.createElement('model-viewer')

                    // Configurações básicas
                    modelViewerElement.src = `/modelos/${produto}`
                    modelViewerElement.alt = `Modelo 3D de ${produto.replace('.glb', '').replace('_', ' ')}`
                    modelViewerElement.cameraOrbit = '45deg 55deg 2m'
                    modelViewerElement.cameraControls = true
                    modelViewerElement.autoRotate = true
                    modelViewerElement.shadowIntensity = '1'
                    modelViewerElement.environmentImage = 'neutral'
                    modelViewerElement.exposure = '0.8'
                    modelViewerElement.backgroundColor = '#0f172a'

                    // Configurações AR
                    if (arAtivo) {
                        modelViewerElement.ar = true
                        modelViewerElement.arModes = 'webxr scene-viewer quick-look'
                        modelViewerElement.arScale = 'auto'
                        modelViewerElement.arPlacement = 'floor'
                    }

                    // Poster de loading
                    modelViewerElement.poster = '/modelos/poster.jpg'

                    // Eventos
                    modelViewerElement.addEventListener('load', () => {
                        setLoading(false)
                        setModelLoaded(true)
                        setError(null)
                    })

                    modelViewerElement.addEventListener('error', (e) => {
                        console.error('Erro no Model Viewer:', e)
                        setError('Erro ao carregar o modelo 3D')
                        setLoading(false)
                    })

                    modelViewerElement.addEventListener('ar-status', (e) => {
                        console.log('AR Status:', e.detail.status)
                    })

                    // Adiciona ao container
                    viewerRef.current.appendChild(modelViewerElement)
                }
            } catch (err) {
                console.error('Erro ao inicializar Model Viewer:', err)
                setError('Erro ao inicializar visualização 3D')
                setLoading(false)
            }
        }

        initModelViewer()

        // Cleanup
        return () => {
            if (modelViewerElement && viewerRef.current) {
                viewerRef.current.removeChild(modelViewerElement)
            }
        }
    }, [produto, arAtivo])

    const toggleAutoRotate = () => {
        const model = viewerRef.current?.querySelector('model-viewer')
        if (model) {
            model.autoRotate = !model.autoRotate
        }
    }

    const resetCamera = () => {
        const model = viewerRef.current?.querySelector('model-viewer')
        if (model) {
            model.cameraOrbit = '45deg 55deg 2m'
        }
    }

    const toggleFullscreen = () => {
        if (viewerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else {
                viewerRef.current.requestFullscreen()
            }
        }
    }

    return (
        <div className="relative mx-auto max-w-4xl">
            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                        <p className="text-cyan-300 text-lg">Carregando modelo 3D...</p>
                        <p className="text-gray-400 text-sm mt-2">Isso pode levar alguns segundos</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 rounded-xl z-10">
                    <div className="text-center p-6">
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-red-300 text-lg font-semibold">{error}</p>
                        <p className="text-gray-400 text-sm mt-2">Tente recarregar a página</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        >
                            Recarregar
                        </button>
                    </div>
                </div>
            )}

            {/* Model Viewer Container */}
            <div className="model-viewer-container relative bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl">
                <div
                    ref={viewerRef}
                    className="w-full h-96 md:h-[500px] lg:h-[600px] relative"
                    style={{ minHeight: '400px' }}
                ></div>

                {/* Logo Pulsante */}
                {logoPulsante && modelLoaded && (
                    <div className="absolute bottom-4 left-4 text-4xl md:text-6xl animate-pulse opacity-80 z-20">
                        🏆
                    </div>
                )}

                {/* Controles */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    <button
                        onClick={toggleAutoRotate}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg transition transform hover:scale-105"
                        title="Alternar rotação automática"
                    >
                        🔄
                    </button>

                    <button
                        onClick={resetCamera}
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition transform hover:scale-105"
                        title="Resetar câmera"
                    >
                        🎯
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition transform hover:scale-105"
                        title="Tela cheia"
                    >
                        📺
                    </button>
                </div>

                {/* Instruções */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white p-3 rounded-lg max-w-xs z-20">
                    <p className="text-sm">
                        🖱️ <strong>Mouse:</strong> Girar e zoom<br />
                        📱 <strong>Touch:</strong> Gestos naturais<br />
                        {arAtivo && '🎯 <strong>AR:</strong> Botão no modelo'}
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 left-4 z-20">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${modelLoaded
                            ? 'bg-green-600 text-green-100'
                            : loading
                                ? 'bg-yellow-600 text-yellow-100'
                                : 'bg-red-600 text-red-100'
                        }`}>
                        {modelLoaded ? '✅ Carregado' : loading ? '⏳ Carregando' : '❌ Erro'}
                    </div>
                </div>
            </div>

            {/* Informações do Produto */}
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                    📦 {produto.replace('.glb', '').replace('_', ' ').toUpperCase()}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                        <div className="text-cyan-400 font-semibold">3D</div>
                        <div className="text-gray-400">Modelo interativo</div>
                    </div>
                    <div className="text-center">
                        <div className="text-green-400 font-semibold">AR</div>
                        <div className="text-gray-400">{arAtivo ? 'Ativado' : 'Desativado'}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-purple-400 font-semibold">Mobile</div>
                        <div className="text-gray-400">Compatível</div>
                    </div>
                    <div className="text-center">
                        <div className="text-yellow-400 font-semibold">Web</div>
                        <div className="text-gray-400">Navegadores</div>
                    </div>
                </div>
            </div>
        </div>
    )
}