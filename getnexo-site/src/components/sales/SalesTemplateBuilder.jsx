import React, { useState, useCallback, useRef } from 'react';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { Card } from '../design-system/components/Card';

const SalesTemplateBuilder = ({ template, onSave, onCancel }) => {
    const [nodes, setNodes] = useState(template?.flow?.components || []);
    const [connections, setConnections] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [draggedNode, setDraggedNode] = useState(null);
    const canvasRef = useRef(null);

    // Componentes disponíveis para drag and drop
    const availableComponents = [
        { type: 'message', label: 'Mensagem', icon: '💬', color: '#007bff' },
        { type: 'delay', label: 'Atraso', icon: '⏱️', color: '#ffc107' },
        { type: 'condition', label: 'Condição', icon: '🔀', color: '#28a745' },
        { type: 'action', label: 'Ação', icon: '⚡', color: '#dc3545' },
        { type: 'split-test', label: 'Teste A/B', icon: '🧪', color: '#6f42c1' }
    ];

    const handleDragStart = useCallback((component) => {
        setDraggedNode(component);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        if (!draggedNode || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newNode = {
            id: `node_${Date.now()}`,
            type: draggedNode.type,
            position: { x, y },
            data: getDefaultNodeData(draggedNode.type),
            connections: []
        };

        setNodes(prev => [...prev, newNode]);
        setDraggedNode(null);
    }, [draggedNode]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const getDefaultNodeData = (type) => {
        switch (type) {
            case 'message':
                return {
                    content: 'Digite sua mensagem aqui...',
                    media: [],
                    buttons: []
                };
            case 'delay':
                return {
                    minutes: 60,
                    label: 'Aguardar 1 hora'
                };
            case 'condition':
                return {
                    conditions: [{ field: 'status', operator: '==', value: 'active' }],
                    label: 'Verificar condição'
                };
            case 'action':
                return {
                    action: 'send_email',
                    label: 'Executar ação'
                };
            case 'split-test':
                return {
                    variants: [
                        { name: 'A', weight: 50 },
                        { name: 'B', weight: 50 }
                    ],
                    label: 'Teste A/B'
                };
            default:
                return {};
        }
    };

    const handleNodeClick = (node) => {
        setSelectedNode(node);
    };

    const handleNodeUpdate = (nodeId, updates) => {
        setNodes(prev => prev.map(node =>
            node.id === nodeId ? { ...node, data: { ...node.data, ...updates } } : node
        ));
    };

    const handleDeleteNode = (nodeId) => {
        setNodes(prev => prev.filter(node => node.id !== nodeId));
        setConnections(prev => prev.filter(conn => conn.from !== nodeId && conn.to !== nodeId));
        if (selectedNode?.id === nodeId) {
            setSelectedNode(null);
        }
    };

    const handleSave = () => {
        const flowData = {
            components: nodes,
            connections: connections,
            startComponentId: nodes.find(n => n.type === 'message')?.id || nodes[0]?.id
        };

        onSave({
            ...template,
            flow: flowData
        });
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar com componentes disponíveis */}
            <div className="w-64 bg-white border-r border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">Componentes</h3>
                <div className="space-y-2">
                    {availableComponents.map(component => (
                        <div
                            key={component.type}
                            draggable
                            onDragStart={() => handleDragStart(component)}
                            className="p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                            style={{ borderLeftColor: component.color, borderLeftWidth: '4px' }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{component.icon}</span>
                                <span className="font-medium">{component.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Canvas principal */}
            <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Construtor de Templates</h2>
                        <p className="text-gray-600">Arraste componentes para criar seu fluxo</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>
                            Salvar Template
                        </Button>
                    </div>
                </div>

                {/* Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 relative overflow-auto bg-gray-50"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {/* Grid background */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                                linear-gradient(#e5e7eb 1px, transparent 1px),
                                linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px'
                        }}
                    />

                    {/* Render nodes */}
                    {nodes.map(node => (
                        <FlowNode
                            key={node.id}
                            node={node}
                            isSelected={selectedNode?.id === node.id}
                            onClick={() => handleNodeClick(node)}
                            onDelete={() => handleDeleteNode(node.id)}
                        />
                    ))}

                    {/* Render connections */}
                    <svg className="absolute inset-0 pointer-events-none">
                        {connections.map((conn, index) => (
                            <FlowConnection
                                key={index}
                                connection={conn}
                                nodes={nodes}
                            />
                        ))}
                    </svg>
                </div>
            </div>

            {/* Panel de propriedades */}
            {selectedNode && (
                <div className="w-80 bg-white border-l border-gray-200 p-4">
                    <h3 className="text-lg font-semibold mb-4">Propriedades</h3>
                    <NodePropertiesPanel
                        node={selectedNode}
                        onUpdate={(updates) => handleNodeUpdate(selectedNode.id, updates)}
                    />
                </div>
            )}
        </div>
    );
};

// Componente para representar um nó no fluxo
const FlowNode = ({ node, isSelected, onClick, onDelete }) => {
    const getNodeStyle = (type) => {
        const styles = {
            message: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
            delay: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800' },
            condition: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
            action: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800' },
            'split-test': { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' }
        };
        return styles[type] || styles.message;
    };

    const style = getNodeStyle(node.type);

    return (
        <div
            className={`absolute cursor-pointer transition-all duration-200 ${style.bg} ${style.border} border-2 rounded-lg p-3 shadow-sm min-w-[150px] ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                left: node.position.x,
                top: node.position.y,
                transform: 'translate(-50%, -50%)'
            }}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${style.text}`}>
                    {getComponentIcon(node.type)} {getComponentLabel(node.type)}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="text-gray-400 hover:text-red-500"
                >
                    ✕
                </button>
            </div>
            <div className="text-sm text-gray-600">
                {getNodePreview(node)}
            </div>

            {/* Connection points */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
            </div>
        </div>
    );
};

// Componente para conexões entre nós
const FlowConnection = ({ connection, nodes }) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);

    if (!fromNode || !toNode) return null;

    const x1 = fromNode.position.x;
    const y1 = fromNode.position.y + 40; // Bottom of node
    const x2 = toNode.position.x;
    const y2 = toNode.position.y - 10; // Top of node

    // Simple curved line
    const midY = (y1 + y2) / 2;
    const pathData = `M ${x1} ${y1} Q ${x1} ${midY} ${x2} ${y2}`;

    return (
        <path
            d={pathData}
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
        />
    );
};

// Panel de propriedades do nó selecionado
const NodePropertiesPanel = ({ node, onUpdate }) => {
    const renderProperties = () => {
        switch (node.type) {
            case 'message':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Conteúdo da Mensagem</label>
                            <textarea
                                value={node.data.content || ''}
                                onChange={(e) => onUpdate({ content: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                placeholder="Digite a mensagem..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Botões (opcional)</label>
                            <Input
                                placeholder="Texto do botão"
                                value={node.data.buttonText || ''}
                                onChange={(e) => onUpdate({ buttonText: e.target.value })}
                            />
                        </div>
                    </div>
                );

            case 'delay':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Minutos de Atraso</label>
                            <Input
                                type="number"
                                value={node.data.minutes || 60}
                                onChange={(e) => onUpdate({
                                    minutes: parseInt(e.target.value),
                                    label: `Aguardar ${parseInt(e.target.value)} minutos`
                                })}
                            />
                        </div>
                    </div>
                );

            case 'condition':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Condição</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Campo"
                                    value={node.data.field || ''}
                                    onChange={(e) => onUpdate({ field: e.target.value })}
                                />
                                <select
                                    value={node.data.operator || '=='}
                                    onChange={(e) => onUpdate({ operator: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded"
                                >
                                    <option value="==">Igual</option>
                                    <option value="!=">Diferente</option>
                                    <option value=">">Maior</option>
                                    <option value="<">Menor</option>
                                </select>
                                <Input
                                    placeholder="Valor"
                                    value={node.data.value || ''}
                                    onChange={(e) => onUpdate({ value: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Propriedades não disponíveis para este tipo de componente.</div>;
        }
    };

    return renderProperties();
};

// Funções auxiliares
const getComponentIcon = (type) => {
    const icons = {
        message: '💬',
        delay: '⏱️',
        condition: '🔀',
        action: '⚡',
        'split-test': '🧪'
    };
    return icons[type] || '📦';
};

const getComponentLabel = (type) => {
    const labels = {
        message: 'Mensagem',
        delay: 'Atraso',
        condition: 'Condição',
        action: 'Ação',
        'split-test': 'A/B Test'
    };
    return labels[type] || type;
};

const getNodePreview = (node) => {
    switch (node.type) {
        case 'message':
            return node.data.content?.substring(0, 30) + (node.data.content?.length > 30 ? '...' : '');
        case 'delay':
            return node.data.label || `${node.data.minutes} minutos`;
        case 'condition':
            return node.data.label || 'Verificar condição';
        case 'action':
            return node.data.label || 'Executar ação';
        case 'split-test':
            return node.data.label || 'Teste A/B';
        default:
            return '';
    }
};

export default SalesTemplateBuilder;