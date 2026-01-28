import React, { useState } from 'react';

// Simple Icons
const RobotIcon = () => <span style={{ fontSize: '1.2rem' }}>🤖</span>;
const MessageIcon = () => <span style={{ fontSize: '1.2rem' }}>💬</span>;
const ClockIcon = () => <span style={{ fontSize: '1.2rem' }}>⏱️</span>;
const ConditionIcon = () => <span style={{ fontSize: '1.2rem' }}>❓</span>;

const FlowEditor = () => {
    const [nodes, setNodes] = useState([
        { id: 1, type: 'start', label: 'Início (Gatilho)', x: 100, y: 100 },
        { id: 2, type: 'message', label: 'Boas-vindas', x: 100, y: 250 },
        { id: 3, type: 'ai', label: 'IA Responde', x: 350, y: 250 },
    ]);
    const [connections, setConnections] = useState([
        { from: 1, to: 2 },
        { from: 2, to: 3 }
    ]);
    const [selectedNode, setSelectedNode] = useState(null);

    // Mock Drag (Simple offset logic)
    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('nodeId', id);
    };

    const handleDrop = (e) => {
        // In a real lib like ReactFlow, this is handled via hooks
        // Here we just prevent default to allow drop zone feeling
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        if (type) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left - 100; // offset
            const y = e.clientY - rect.top - 20;
            const newNode = {
                id: Date.now(),
                type: type,
                label: type === 'message' ? 'Nova Mensagem' : type === 'condition' ? 'Condição' : 'Agendar',
                x: Math.max(0, x),
                y: Math.max(0, y)
            };
            setNodes([...nodes, newNode]);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const clearFlow = () => {
        setNodes([
            { id: 1, type: 'start', label: 'Início (Gatilho)', x: 100, y: 100 }
        ]);
        setConnections([]);
        setSelectedNode(null);
    };

    const [flowId, setFlowId] = useState(1);

    useEffect(() => {
        // Load Flow from API
        const token = localStorage.getItem('token');
        if (!token) return; // or redirect

        fetch(`/api/flows/${flowId}`, {
            headers: { 'Authorization': token }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.nodes) {
                    // If API returns nodes as array directly or inside object
                    // Data structure from API: { id, name, nodes: [...] }
                    // Check if data.nodes is array
                    if (Array.isArray(data.nodes)) {
                        setNodes(data.nodes);
                    }
                }
            })
            .catch(err => console.log('Flow load error or new', err));
    }, [flowId]);

    const saveFlow = () => {
        const token = localStorage.getItem('token');
        const method = flowId ? 'PUT' : 'POST';
        const url = flowId ? `/api/flows/${flowId}` : '/api/flows';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                nodes,
                // connections usually implied in nodes for simple editors, or strict if separate
                connections,
                name: 'My Flow ' + flowId,
                active: true
            })
        })
            .then(res => res.json())
            .then(d => alert('Fluxo salvo com sucesso!'))
            .catch(e => alert('Erro ao salvar fluxo'));
    };

    return (
        <div style={{ display: 'flex', height: '600px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: '#020617', overflow: 'hidden' }}>

            {/* Sidebar Palette */}
            <div style={{ width: '250px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                <h3 style={{ margin: '0 0 1rem', color: 'white', fontSize: '1rem' }}>Componentes</h3>

                <div
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('type', 'message')}
                    style={itemStyle}
                >
                    <MessageIcon /> Mensagem
                </div>
                <div
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('type', 'ai')}
                    style={itemStyle}
                >
                    <RobotIcon /> IA Generativa
                </div>
                <div
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('type', 'condition')}
                    style={itemStyle}
                >
                    <ConditionIcon /> Condição
                </div>
                <div
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('type', 'delay')}
                    style={itemStyle}
                >
                    <ClockIcon /> Delay (Espera)
                </div>

                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                    Arraste os componentes para o painel à direita para construir o fluxo.
                </div>
            </div>

            {/* Canvas */}
            <div
                style={{ flex: 1, position: 'relative', backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                    <button style={btnStyleSecondary} onClick={clearFlow}>Limpar</button>
                    <button style={btnStylePrimary} onClick={saveFlow}>Salvar Fluxo</button>
                </div>

                {/* Draw Connections (SVG) */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {connections.map((c, i) => {
                        const fromNode = nodes.find(n => n.id === c.from);
                        const toNode = nodes.find(n => n.id === c.to);
                        if (!fromNode || !toNode) return null;

                        // Simple Bezier
                        const x1 = fromNode.x + 200; // width of node is approx 200
                        const y1 = fromNode.y + 40; // mid height
                        const x2 = toNode.x;
                        const y2 = toNode.y + 40;
                        const control = Math.abs(x2 - x1) * 0.5;

                        return (
                            <path
                                key={i}
                                d={`M ${x1} ${y1} C ${x1 + control} ${y1}, ${x2 - control} ${y2}, ${x2} ${y2}`}
                                stroke="#00d4ff"
                                strokeWidth="2"
                                fill="none"
                            />
                        );
                    })}
                </svg>

                {/* Render Nodes */}
                {nodes.map(node => (
                    <div
                        key={node.id}
                        style={{
                            ...nodeStyle,
                            left: node.x,
                            top: node.y,
                            borderColor: selectedNode === node.id ? '#00d4ff' : 'rgba(255,255,255,0.1)'
                        }}
                        onMouseDown={() => setSelectedNode(node.id)}
                    >
                        <div style={{ marginBottom: '5px', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {node.type === 'ai' ? <RobotIcon /> : node.type === 'message' ? <MessageIcon /> : <span style={{ fontSize: '1rem' }}>⚡</span>}
                            {node.label}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {node.type === 'start' ? 'Gatilho: Mensagem Recebida' : 'Clique para editar...'}
                        </div>

                        {/* Ports */}
                        {node.type !== 'start' && <div style={portLeft}></div>}
                        <div style={portRight}></div>
                    </div>
                ))}

            </div>

        </div>
    );
};

// Styles
const itemStyle = {
    padding: '10px',
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    marginBottom: '10px',
    cursor: 'grab',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600'
};

const nodeStyle = {
    position: 'absolute',
    width: '200px',
    padding: '15px',
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    userSelect: 'none'
};

const portLeft = {
    position: 'absolute',
    left: '-6px',
    top: '50%',
    marginTop: '-6px',
    width: '12px',
    height: '12px',
    background: '#64748b',
    borderRadius: '50%',
    border: '2px solid #0f172a'
};

const portRight = {
    position: 'absolute',
    right: '-6px',
    top: '50%',
    marginTop: '-6px',
    width: '12px',
    height: '12px',
    background: '#00d4ff',
    borderRadius: '50%',
    border: '2px solid #0f172a'
};

const btnStylePrimary = {
    padding: '8px 16px',
    background: '#00d4ff',
    color: 'black',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer'
};

const btnStyleSecondary = {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer'
};

export default FlowEditor;
