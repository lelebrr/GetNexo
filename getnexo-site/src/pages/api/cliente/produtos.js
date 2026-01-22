// API simplificada para produtos (dados mock)
export default async function handler(req, res) {
    // Autenticação básica
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticação necessário' });
    }

    try {
        switch (req.method) {
            case 'GET':
                return await listarProdutos(req, res);
            case 'POST':
                return await criarProduto(req, res);
            case 'DELETE':
                return await excluirProduto(req, res);
            default:
                return res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de produtos:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function listarProdutos(req, res) {
    try {
        // Dados mock para produtos
        const produtos = [
            {
                id: '1',
                nome: 'Smartphone Galaxy S24',
                categoria: 'eletronicos',
                descricao: 'Smartphone flagship com câmera incrível',
                tem360: true,
                temAR: true,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                nome: 'Notebook Gamer RTX',
                categoria: 'informatica',
                descricao: 'Notebook para jogos com RTX 4070',
                tem360: false,
                temAR: false,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];

        res.json(produtos);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function criarProduto(req, res) {
    try {
        const { nome, categoria, descricao } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'Nome do produto é obrigatório' });
        }

        // Simular criação de produto
        const produtoData = {
            id: Date.now().toString(),
            nome,
            categoria: categoria || 'outros',
            descricao: descricao || '',
            tem360: false, // Por enquanto sem upload
            temAR: false,
            createdAt: new Date().toISOString()
        };

        console.log('Produto criado (mock):', produtoData);

        res.status(201).json({
            success: true,
            produto: produtoData,
            message: 'Produto criado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
}

async function excluirProduto(req, res) {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID do produto é obrigatório' });
        }

        // Simular exclusão
        console.log('Produto excluído (mock):', id);

        res.json({ success: true, message: 'Produto excluído com sucesso' });

    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
}