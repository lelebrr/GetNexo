import { useState, useEffect } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Select, Badge, Table, Modal, Tabs, Alert, Progress, Tag } from '../../design-system/components/AdminExtras';
import { apiRequest } from '../../lib/api';

const ProductCatalog = ({ initialTab = 'products' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Tenta carregar dados das APIs
            const [productsRes, categoriesRes] = await Promise.all([
                apiRequest('/api/products'),
                apiRequest('/api/products/categories')
            ]);

            setProducts(productsRes?.data || productsRes || []);
            setCategories(categoriesRes?.data || categoriesRes || []);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Não foi possível carregar os dados. As APIs podem não estar disponíveis.');

            // Dados de exemplo para demonstração
            setProducts([
                {
                    id: 1,
                    name: 'Produto Exemplo 1',
                    price: 99.90,
                    description: 'Descrição do produto exemplo',
                    category: 'Eletrônicos',
                    stock_status: 'available',
                    stock_quantity: 50,
                    images: ['/placeholder.jpg'],
                    model_3d: null,
                    is_active: true,
                    created_at: '2024-01-01'
                },
                {
                    id: 2,
                    name: 'Produto Exemplo 2',
                    price: 149.90,
                    description: 'Outro produto exemplo',
                    category: 'Roupas',
                    stock_status: 'low_stock',
                    stock_quantity: 5,
                    images: ['/placeholder2.jpg'],
                    model_3d: '/models/example.glb',
                    is_active: true,
                    created_at: '2024-01-02'
                }
            ]);

            setCategories([
                { id: 1, name: 'Eletrônicos', product_count: 15 },
                { id: 2, name: 'Roupas', product_count: 8 },
                { id: 3, name: 'Casa', product_count: 12 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCreateProduct = async (productData) => {
        try {
            const result = await apiRequest('/api/products', 'POST', productData);
            if (result.success) {
                await loadData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleUpdateProduct = async (productData) => {
        try {
            const result = await apiRequest(`/api/products/${selectedItem.id}`, 'PUT', productData);
            if (result.success) {
                await loadData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            const result = await apiRequest(`/api/products/${productId}`, 'DELETE');
            if (result.success) {
                await loadData();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleGenerateAIImage = async (productId) => {
        setLoading(true);
        try {
            const result = await apiRequest(`/api/products/${productId}/generate-image`, 'POST');
            if (result.success) {
                await loadData();
                alert('Imagem gerada com sucesso!');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Erro ao gerar imagem');
        } finally {
            setLoading(false);
        }
    };

    const renderProductsTab = () => (
        <div className="space-y-6">
            {/* Filters and Search */}
            <Card style={{ background: '#111827', borderColor: '#1f2937' }}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={[
                                { value: '', label: 'Todas as categorias' },
                                ...categories.map(cat => ({ value: cat.name, label: cat.name }))
                            ]}
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setModalType('product');
                            setSelectedItem(null);
                            setShowModal(true);
                        }}
                        variant="primary"
                    >
                        Novo Produto
                    </Button>
                </div>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <Card key={product.id} style={{ background: '#111827', borderColor: '#1f2937' }}>
                        <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden">
                            {product.images?.[0] ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    Sem imagem
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>

                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xl font-bold text-green-400">
                                R$ {product.price.toFixed(2)}
                            </span>
                            <Badge variant={
                                product.stock_status === 'available' ? 'success' :
                                    product.stock_status === 'low_stock' ? 'warning' :
                                        product.stock_status === 'out_of_stock' ? 'danger' : 'secondary'
                            }>
                                {product.stock_status === 'available' ? 'Disponível' :
                                    product.stock_status === 'low_stock' ? 'Estoque Baixo' :
                                        product.stock_status === 'out_of_stock' ? 'Esgotado' : 'Reservado'}
                            </Badge>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setModalType('product');
                                    setSelectedItem(product);
                                    setShowModal(true);
                                }}
                            >
                                Editar
                            </Button>
                            {!product.images?.[0] && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleGenerateAIImage(product.id)}
                                    disabled={loading}
                                >
                                    Gerar IA
                                </Button>
                            )}
                            {product.model_3d && (
                                <Button variant="outline" size="sm">
                                    3D
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <Card style={{ background: '#111827', borderColor: '#1f2937' }}>
                    <div className="text-center py-8">
                        <p className="text-gray-400">Nenhum produto encontrado</p>
                    </div>
                </Card>
            )}
        </div>
    );

    const renderCategoriesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Categorias</h3>
                <Button
                    onClick={() => {
                        setModalType('category');
                        setSelectedItem(null);
                        setShowModal(true);
                    }}
                    variant="primary"
                >
                    Nova Categoria
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map(category => (
                    <Card key={category.id} style={{ background: '#111827', borderColor: '#1f2937' }}>
                        <h3 className="text-lg font-semibold mb-2 text-white">{category.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            {category.product_count} produto{category.product_count !== 1 ? 's' : ''}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setModalType('category');
                                    setSelectedItem(category);
                                    setShowModal(true);
                                }}
                            >
                                Editar
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
                                        // Implementar exclusão
                                    }
                                }}
                            >
                                Excluir
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderModal = () => {
        if (!showModal) return null;

        const isEdit = !!selectedItem;

        return (
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={`${isEdit ? 'Editar' : 'Criar'} ${modalType === 'product' ? 'Produto' : 'Categoria'}`}
            >
                {modalType === 'product' ? (
                    <ProductForm
                        initialData={selectedItem}
                        categories={categories}
                        onSubmit={isEdit ? handleUpdateProduct : handleCreateProduct}
                        onCancel={() => setShowModal(false)}
                    />
                ) : (
                    <CategoryForm
                        initialData={selectedItem}
                        onSubmit={(data) => {
                            // Implementar criação/edição de categoria
                            console.log('Category data:', data);
                            setShowModal(false);
                        }}
                        onCancel={() => setShowModal(false)}
                    />
                )}
            </Modal>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Catálogo de Produtos</h1>
                <p className="text-gray-400 mt-2">
                    Gerencie seu catálogo completo de produtos com imagens, modelos 3D e controle de estoque
                </p>
            </div>

            {error && (
                <Alert variant="warning" className="mb-6">
                    <div className="flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                    <p className="text-sm mt-2 text-gray-600">
                        Mostrando dados de exemplo para demonstração.
                    </p>
                </Alert>
            )}

            <Tabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                    { id: 'products', label: 'Produtos', content: renderProductsTab() },
                    { id: 'categories', label: 'Categorias', content: renderCategoriesTab() }
                ]}
            />

            {renderModal()}
        </div>
    );
};

// Form components
const ProductForm = ({ initialData, categories, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        price: 0,
        description: '',
        category: '',
        stock_quantity: 0,
        stock_status: 'available',
        images: [],
        model_3d: null,
        is_active: true
    });

    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingModel, setUploadingModel] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleImageUpload = async (file) => {
        setUploadingImage(true);
        try {
            // Simular upload
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const result = await apiRequest('/api/upload/image', 'POST', formDataUpload);
            if (result.success) {
                setFormData({
                    ...formData,
                    images: [...formData.images, result.data.url]
                });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleModelUpload = async (file) => {
        setUploadingModel(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('model', file);

            const result = await apiRequest('/api/upload/model-3d', 'POST', formDataUpload);
            if (result.success) {
                setFormData({
                    ...formData,
                    model_3d: result.data.url
                });
            }
        } catch (error) {
            console.error('Error uploading model:', error);
        } finally {
            setUploadingModel(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome do Produto</label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Categoria</label>
                    <Select
                        value={formData.category}
                        onChange={(value) => setFormData({ ...formData, category: value })}
                        options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Quantidade em Estoque</label>
                    <Input
                        type="number"
                        min="0"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Status do Estoque</label>
                <Select
                    value={formData.stock_status}
                    onChange={(value) => setFormData({ ...formData, stock_status: value })}
                    options={[
                        { value: 'available', label: 'Disponível' },
                        { value: 'low_stock', label: 'Estoque Baixo' },
                        { value: 'out_of_stock', label: 'Esgotado' },
                        { value: 'reserved', label: 'Reservado' }
                    ]}
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium mb-1">Imagens</label>
                <div className="space-y-2">
                    {formData.images.map((image, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <img src={image} alt="" className="w-16 h-16 object-cover rounded" />
                            <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                    const newImages = formData.images.filter((_, i) => i !== index);
                                    setFormData({ ...formData, images: newImages });
                                }}
                            >
                                Remover
                            </Button>
                        </div>
                    ))}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                handleImageUpload(e.target.files[0]);
                            }
                        }}
                        className="block w-full text-sm text-gray-400"
                    />
                    {uploadingImage && <p className="text-sm text-blue-400">Enviando imagem...</p>}
                </div>
            </div>

            {/* 3D Model Upload */}
            <div>
                <label className="block text-sm font-medium mb-1">Modelo 3D (.glb)</label>
                <div className="space-y-2">
                    {formData.model_3d && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-green-400">Modelo carregado</span>
                            <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() => setFormData({ ...formData, model_3d: null })}
                            >
                                Remover
                            </Button>
                        </div>
                    )}
                    <input
                        type="file"
                        accept=".glb"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                handleModelUpload(e.target.files[0]);
                            }
                        }}
                        className="block w-full text-sm text-gray-400"
                    />
                    {uploadingModel && <p className="text-sm text-blue-400">Enviando modelo 3D...</p>}
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="product_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                />
                <label htmlFor="product_active" className="text-sm">Produto Ativo</label>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary">
                    {initialData ? 'Atualizar' : 'Criar'} Produto
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

const CategoryForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nome da Categoria</label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary">
                    {initialData ? 'Atualizar' : 'Criar'} Categoria
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

export default ProductCatalog;