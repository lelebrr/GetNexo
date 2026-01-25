import { useState, useEffect, useRef } from 'react';

export function ARViewer({ produtoNome }) {
    const [modelo, setModelo] = useState(null);
    const viewerRef = useRef(null);

    useEffect(() => {
        // Puxa o JSON com os 25 modelos
        fetch('/models.json')
            .then(res => res.json())
            .then(data => {
                // Busca em todas as categorias
                for (const categoria of Object.values(data)) {
                    const item = categoria.find(m => m.nome === produtoNome);
                    if (item) {
                        setModelo(item);
                        break;
                    }
                }
            })
            .catch(err => console.error('Erro carregando models.json:', err));
    }, [produtoNome]);

    useEffect(() => {
        if (viewerRef.current && modelo) {
            viewerRef.current.load(`${modelo.caminho}`);
            viewerRef.current.addEventListener('progress', (e) => {
                if (e.detail.total > 0 && e.detail.loaded === e.detail.total) {
                    console.log(`${produtoNome} carregado!`);
                }
            });
        }
    }, [modelo]);

    if (!modelo) return <div>Carregando 3D... {produtoNome}</div>;

    return (
        <div style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
            background: '#f8f8f8'
        }}>
            <model-viewer
                ref={viewerRef}
                src={modelo.caminho}
                alt={produtoNome}
                ar
                ar-modes="webxr scene-viewer quick-look"
                auto-rotate
                camera-controls
                shadow-intensity="1"
                exposure="0.8"
                environment-image="/env.hdr"
                poster="https://via.placeholder.com/500x300?text=3D+Loading"
                style={{
                    width: '100%',
                    height: '400px',
                    display: 'block'
                }}
            >
                {/* Botão AR visível */}
                <button slot="ar-button" style={{
                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    cursor: 'pointer'
                }}>
                    Ver em AR
                </button>
            </model-viewer>

            <div style={{
                textAlign: 'center',
                padding: '8px',
                fontSize: '14px',
                color: '#666'
            }}>
                {produtoNome} • {modelo.tamanho} KB
            </div>
        </div>
    );
}