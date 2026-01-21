const axios = require('axios');

class ERPIntegrationService {

    // Configurações de ERPs suportados
    static ERP_CONFIGS = {
        tiny: {
            name: 'Tiny ERP',
            baseUrl: 'https://api.tiny.com.br/api2',
            authType: 'token',
            endpoints: {
                products: '/produtos.pesquisa.php',
                customers: '/contatos.pesquisa.php',
                orders: '/pedidos.pesquisa.php'
            }
        },
        bling: {
            name: 'Bling',
            baseUrl: 'https://bling.com.br/Api/v2',
            authType: 'apikey',
            endpoints: {
                products: '/produtos',
                customers: '/contatos',
                orders: '/pedidos'
            }
        },
        vtex: {
            name: 'VTEX',
            baseUrl: 'https://{accountName}.vtexcommercestable.com.br',
            authType: 'appkey',
            endpoints: {
                products: '/api/catalog/pvt/product',
                customers: '/api/dataentities/CL',
                orders: '/api/oms/pvt/orders'
            }
        },
        custom: {
            name: 'ERP Personalizado',
            baseUrl: '',
            authType: 'custom',
            endpoints: {}
        }
    };

    // Conectar com ERP
    static async connect(erpConfig) {
        const { type, credentials, baseUrl } = erpConfig;

        if (!this.ERP_CONFIGS[type]) {
            throw new Error(`ERP ${type} não suportado`);
        }

        const config = { ...this.ERP_CONFIGS[type], ...erpConfig };

        // Testar conexão
        try {
            await this.testConnection(config);
            return {
                success: true,
                config,
                message: `Conectado com sucesso ao ${config.name}`
            };
        } catch (error) {
            throw new Error(`Falha na conexão: ${error.message}`);
        }
    }

    // Testar conexão com ERP
    static async testConnection(config) {
        const { type, credentials, baseUrl } = config;

        switch (type) {
            case 'tiny':
                return await this.testTinyConnection(config);

            case 'bling':
                return await this.testBlingConnection(config);

            case 'vtex':
                return await this.testVtexConnection(config);

            case 'custom':
                return await this.testCustomConnection(config);

            default:
                throw new Error('Tipo de ERP não suportado');
        }
    }

    static async testTinyConnection(config) {
        const { token, baseUrl } = config.credentials;

        const response = await axios.get(`${baseUrl}/produtos.pesquisa.php`, {
            params: {
                token,
                formato: 'json',
                pesquisa: '',
                limite: 1
            },
            timeout: 10000
        });

        if (response.data.retorno?.status !== 'OK') {
            throw new Error('Token inválido ou API inacessível');
        }

        return true;
    }

    static async testBlingConnection(config) {
        const { apikey, baseUrl } = config.credentials;

        const response = await axios.get(`${baseUrl}/contatos`, {
            params: { apikey },
            timeout: 10000
        });

        if (response.data.retorno?.erros) {
            throw new Error(response.data.retorno.erros[0].erro.msg);
        }

        return true;
    }

    static async testVtexConnection(config) {
        const { appKey, appToken, accountName } = config.credentials;
        const baseUrl = `https://${accountName}.vtexcommercestable.com.br`;

        const response = await axios.get(`${baseUrl}/api/catalog_system/pvt/category/tree/3`, {
            headers: {
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            },
            timeout: 10000
        });

        if (response.status !== 200) {
            throw new Error('Credenciais VTEX inválidas');
        }

        return true;
    }

    static async testCustomConnection(config) {
        const { baseUrl, authType, credentials } = config;

        if (!baseUrl) {
            throw new Error('URL base não configurada');
        }

        // Para ERPs customizados, fazer uma requisição simples
        const headers = {};
        if (authType === 'bearer') {
            headers['Authorization'] = `Bearer ${credentials.token}`;
        } else if (authType === 'basic') {
            headers['Authorization'] = `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`;
        }

        await axios.get(`${baseUrl}/health`, { headers, timeout: 5000 });

        return true;
    }

    // Buscar dados do cliente
    static async getCustomerData(erpConfig, customerId, fields = []) {
        const { type } = erpConfig;

        switch (type) {
            case 'tiny':
                return await this.getTinyCustomerData(erpConfig, customerId, fields);

            case 'bling':
                return await this.getBlingCustomerData(erpConfig, customerId, fields);

            case 'vtex':
                return await this.getVtexCustomerData(erpConfig, customerId, fields);

            case 'custom':
                return await this.getCustomCustomerData(erpConfig, customerId, fields);

            default:
                throw new Error('Tipo de ERP não suportado');
        }
    }

    static async getTinyCustomerData(config, customerId, fields) {
        const { token, baseUrl } = config.credentials;

        const response = await axios.get(`${baseUrl}/contatos.pesquisa.php`, {
            params: {
                token,
                formato: 'json',
                id: customerId
            }
        });

        if (response.data.retorno?.status !== 'OK') {
            throw new Error('Cliente não encontrado');
        }

        const contato = response.data.retorno.contatos[0]?.contato;
        if (!contato) return null;

        return {
            id: contato.id,
            name: contato.nome,
            email: contato.email,
            phone: contato.fone,
            address: contato.endereco,
            city: contato.cidade,
            state: contato.uf,
            zipCode: contato.cep,
            lastPurchase: contato.ultimo_pedido,
            totalPurchases: contato.total_pedidos
        };
    }

    static async getBlingCustomerData(config, customerId, fields) {
        const { apikey, baseUrl } = config.credentials;

        const response = await axios.get(`${baseUrl}/contato/${customerId}`, {
            params: { apikey }
        });

        if (response.data.retorno?.erros) {
            throw new Error(response.data.retorno.erros[0].erro.msg);
        }

        const contato = response.data.retorno.contatos[0];
        if (!contato) return null;

        return {
            id: contato.id,
            name: contato.nome,
            email: contato.email,
            phone: contato.fone,
            address: contato.endereco,
            city: contato.cidade,
            uf: contato.uf,
            cep: contato.cep,
            situacao: contato.situacao
        };
    }

    static async getVtexCustomerData(config, customerId, fields) {
        const { appKey, appToken, accountName } = config.credentials;
        const baseUrl = `https://${accountName}.vtexcommercestable.com.br`;

        const response = await axios.get(`${baseUrl}/api/dataentities/CL/documents/${customerId}`, {
            headers: {
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            }
        });

        if (!response.data) return null;

        return {
            id: response.data.id,
            name: response.data.firstName + ' ' + response.data.lastName,
            email: response.data.email,
            phone: response.data.phone,
            address: response.data.street + ', ' + response.data.number,
            city: response.data.city,
            state: response.data.state,
            zipCode: response.data.postalCode,
            document: response.data.document
        };
    }

    static async getCustomCustomerData(config, customerId, fields) {
        const { baseUrl, authType, credentials, endpoints } = config;

        const headers = this.buildAuthHeaders(authType, credentials);

        const response = await axios.get(`${baseUrl}${endpoints.customers}/${customerId}`, { headers });

        return response.data;
    }

    // Buscar dados do produto
    static async getProductData(erpConfig, productId, fields = []) {
        const { type } = erpConfig;

        switch (type) {
            case 'tiny':
                return await this.getTinyProductData(erpConfig, productId, fields);

            case 'bling':
                return await this.getBlingProductData(erpConfig, productId, fields);

            case 'vtex':
                return await this.getVtexProductData(erpConfig, productId, fields);

            case 'custom':
                return await this.getCustomProductData(erpConfig, productId, fields);

            default:
                throw new Error('Tipo de ERP não suportado');
        }
    }

    static async getTinyProductData(config, productId, fields) {
        const { token, baseUrl } = config.credentials;

        const response = await axios.get(`${baseUrl}/produtos.pesquisa.php`, {
            params: {
                token,
                formato: 'json',
                id: productId
            }
        });

        if (response.data.retorno?.status !== 'OK') {
            throw new Error('Produto não encontrado');
        }

        const produto = response.data.retorno.produtos[0]?.produto;
        if (!produto) return null;

        return {
            id: produto.id,
            name: produto.nome,
            code: produto.codigo,
            price: parseFloat(produto.preco),
            promotionalPrice: parseFloat(produto.preco_promocional || produto.preco),
            stock: parseInt(produto.estoque || 0),
            category: produto.categoria,
            description: produto.descricao,
            imageUrl: produto.imagem
        };
    }

    static async getBlingProductData(config, productId, fields) {
        const { apikey, baseUrl } = config.credentials;

        const response = await axios.get(`${baseUrl}/produto/${productId}`, {
            params: { apikey }
        });

        if (response.data.retorno?.erros) {
            throw new Error(response.data.retorno.erros[0].erro.msg);
        }

        const produto = response.data.retorno.produtos[0];
        if (!produto) return null;

        return {
            id: produto.id,
            codigo: produto.codigo,
            descricao: produto.descricao,
            preco: parseFloat(produto.preco),
            estoque: parseInt(produto.estoque || 0),
            categoria: produto.categoria,
            marca: produto.marca
        };
    }

    static async getCustomProductData(config, productId, fields) {
        const { baseUrl, authType, credentials, endpoints } = config;

        const headers = this.buildAuthHeaders(authType, credentials);

        const response = await axios.get(`${baseUrl}${endpoints.products}/${productId}`, { headers });

        return response.data;
    }

    // Buscar carrinho abandonado
    static async getAbandonedCart(erpConfig, cartId) {
        const { type } = erpConfig;

        switch (type) {
            case 'tiny':
                return await this.getTinyAbandonedCart(erpConfig, cartId);

            case 'bling':
                return await this.getBlingAbandonedCart(erpConfig, cartId);

            case 'custom':
                return await this.getCustomAbandonedCart(erpConfig, cartId);

            default:
                throw new Error('Tipo de ERP não suportado');
        }
    }

    static async getTinyAbandonedCart(config, cartId) {
        // Implementar busca de carrinho abandonado no Tiny
        // Isso pode variar dependendo de como o Tiny armazena carrinhos
        return {
            id: cartId,
            customerId: '123',
            products: [
                { id: '1', name: 'Produto 1', price: 99.90, quantity: 1 }
            ],
            total: 99.90,
            abandonedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
            cartUrl: `https://loja.com/cart/${cartId}`
        };
    }

    static async getBlingAbandonedCart(config, cartId) {
        // Implementar busca de carrinho abandonado no Bling
        return {
            id: cartId,
            customerId: '123',
            products: [],
            total: 0,
            abandonedAt: new Date(),
            cartUrl: `https://loja.com/cart/${cartId}`
        };
    }

    static async getCustomAbandonedCart(config, cartId) {
        const { baseUrl, authType, credentials, endpoints } = config;

        const headers = this.buildAuthHeaders(authType, credentials);

        const response = await axios.get(`${baseUrl}${endpoints.abandonedCarts}/${cartId}`, { headers });

        return response.data;
    }

    // Buscar dados de pedido
    static async getOrderData(erpConfig, orderId) {
        const { type } = erpConfig;

        switch (type) {
            case 'tiny':
                return await this.getTinyOrderData(erpConfig, orderId);

            case 'bling':
                return await this.getBlingOrderData(erpConfig, orderId);

            case 'vtex':
                return await this.getVtexOrderData(erpConfig, orderId);

            case 'custom':
                return await this.getCustomOrderData(erpConfig, orderId);

            default:
                throw new Error('Tipo de ERP não suportado');
        }
    }

    static async getTinyOrderData(config, orderId) {
        const { token, baseUrl } = config.credentials;

        const response = await axios.get(`${baseUrl}/pedidos.pesquisa.php`, {
            params: {
                token,
                formato: 'json',
                id: orderId
            }
        });

        if (response.data.retorno?.status !== 'OK') {
            throw new Error('Pedido não encontrado');
        }

        const pedido = response.data.retorno.pedidos[0]?.pedido;
        if (!pedido) return null;

        return {
            id: pedido.id,
            number: pedido.numero,
            customerId: pedido.id_cliente,
            status: pedido.situacao,
            total: parseFloat(pedido.total),
            items: pedido.itens?.map(item => ({
                productId: item.item.id_produto,
                name: item.item.descricao,
                quantity: parseInt(item.item.quantidade),
                price: parseFloat(item.item.valor_unitario)
            })) || [],
            createdAt: pedido.data_pedido
        };
    }

    static async getBlingOrderData(config, orderId) {
        const { apikey, baseUrl } = config.credentials;

        const response = await axios.get(`${baseUrl}/pedido/${orderId}`, {
            params: { apikey }
        });

        if (response.data.retorno?.erros) {
            throw new Error(response.data.retorno.erros[0].erro.msg);
        }

        const pedido = response.data.retorno.pedidos[0];
        if (!pedido) return null;

        return {
            numero: pedido.numero,
            data: pedido.data,
            cliente: pedido.cliente,
            itens: pedido.itens || [],
            total: parseFloat(pedido.totalvenda || 0),
            situacao: pedido.situacao
        };
    }

    static async getCustomOrderData(config, orderId) {
        const { baseUrl, authType, credentials, endpoints } = config;

        const headers = this.buildAuthHeaders(authType, credentials);

        const response = await axios.get(`${baseUrl}${endpoints.orders}/${orderId}`, { headers });

        return response.data;
    }

    // Construir headers de autenticação
    static buildAuthHeaders(authType, credentials) {
        const headers = {};

        switch (authType) {
            case 'bearer':
                headers['Authorization'] = `Bearer ${credentials.token}`;
                break;
            case 'basic':
                headers['Authorization'] = `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`;
                break;
            case 'apikey':
                headers['apikey'] = credentials.apikey;
                break;
            case 'token':
                headers['token'] = credentials.token;
                break;
        }

        return headers;
    }

    // Buscar dados usando mapeamento personalizado
    static async getMappedData(erpConfig, mapping, context = {}) {
        const { type } = erpConfig;

        // Buscar dados baseados no tipo de entidade
        let baseData = {};

        if (mapping.entityType === 'customer' && context.customerId) {
            baseData = await this.getCustomerData(erpConfig, context.customerId);
        } else if (mapping.entityType === 'product' && context.productId) {
            baseData = await this.getProductData(erpConfig, context.productId);
        } else if (mapping.entityType === 'order' && context.orderId) {
            baseData = await this.getOrderData(erpConfig, context.orderId);
        } else if (mapping.entityType === 'cart' && context.cartId) {
            baseData = await this.getAbandonedCart(erpConfig, context.cartId);
        }

        // Aplicar mapeamento personalizado
        const mappedData = {};
        for (const [templateField, erpField] of Object.entries(mapping.fieldMapping || {})) {
            if (typeof erpField === 'string') {
                mappedData[templateField] = this.getNestedValue(baseData, erpField);
            } else if (typeof erpField === 'function') {
                mappedData[templateField] = erpField(baseData, context);
            }
        }

        // Aplicar transformações
        if (mapping.transformations) {
            for (const [field, transform] of Object.entries(mapping.transformations)) {
                if (mappedData[field] !== undefined) {
                    mappedData[field] = this.applyTransformation(mappedData[field], transform);
                }
            }
        }

        return mappedData;
    }

    // Obter valor aninhado de objeto
    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    // Aplicar transformação de dados
    static applyTransformation(value, transform) {
        switch (transform.type) {
            case 'currency':
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: transform.currency || 'BRL'
                }).format(value);

            case 'date':
                return new Date(value).toLocaleDateString('pt-BR');

            case 'uppercase':
                return String(value).toUpperCase();

            case 'lowercase':
                return String(value).toLowerCase();

            case 'substring':
                return String(value).substring(0, transform.length || 50);

            default:
                return value;
        }
    }

    // Webhook para receber atualizações do ERP
    static async handleERPWebhook(erpConfig, webhookData) {
        const { event, data } = webhookData;

        // Processar diferentes tipos de eventos
        switch (event) {
            case 'order_completed':
                await this.handleOrderCompleted(erpConfig, data);
                break;
            case 'cart_abandoned':
                await this.handleCartAbandoned(erpConfig, data);
                break;
            case 'product_viewed':
                await this.handleProductViewed(erpConfig, data);
                break;
            default:
                console.log(`Evento ERP não tratado: ${event}`);
        }
    }

    static async handleOrderCompleted(erpConfig, orderData) {
        // Disparar templates de upsell para o cliente
        const SalesTemplateService = require('./SalesTemplateService');

        const upsellTemplates = await SalesTemplate.find({
            category: 'upsell',
            isActive: true,
            'triggers.event': 'order-completed'
        });

        for (const template of upsellTemplates) {
            try {
                await SalesTemplateService.executeTemplate(
                    template._id,
                    orderData.customerId,
                    { orderData },
                    'whatsapp'
                );
            } catch (error) {
                console.error(`Erro ao executar template upsell ${template._id}:`, error);
            }
        }
    }

    static async handleCartAbandoned(erpConfig, cartData) {
        // Disparar templates de recuperação de carrinho
        const SalesTemplateService = require('./SalesTemplateService');

        const cartTemplates = await SalesTemplate.find({
            category: 'abandoned-cart',
            isActive: true,
            'triggers.event': 'cart-abandoned'
        });

        for (const template of cartTemplates) {
            try {
                await SalesTemplateService.executeTemplate(
                    template._id,
                    cartData.customerId,
                    { cartData },
                    'whatsapp'
                );
            } catch (error) {
                console.error(`Erro ao executar template carrinho ${template._id}:`, error);
            }
        }
    }

    static async handleProductViewed(erpConfig, viewData) {
        // Disparar templates de cross-sell
        const SalesTemplateService = require('./SalesTemplateService');

        const crossSellTemplates = await SalesTemplate.find({
            category: 'cross-sell',
            isActive: true,
            'triggers.event': 'product-viewed'
        });

        for (const template of crossSellTemplates) {
            try {
                // Verificar condições do template
                const trigger = template.triggers.find(t => t.event === 'product-viewed');
                if (trigger && this.evaluateTriggerConditions(trigger.conditions, viewData)) {
                    await SalesTemplateService.executeTemplate(
                        template._id,
                        viewData.customerId,
                        { viewData },
                        'whatsapp'
                    );
                }
            } catch (error) {
                console.error(`Erro ao executar template cross-sell ${template._id}:`, error);
            }
        }
    }

    static async getVtexProductData(config, productId, fields) {
        const { appKey, appToken, accountName } = config.credentials;
        const baseUrl = `https://${accountName}.vtexcommercestable.com.br`;

        const response = await axios.get(`${baseUrl}/api/catalog/pvt/product/${productId}`, {
            headers: {
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            }
        });

        if (!response.data) return null;

        return {
            id: response.data.Id,
            name: response.data.Name,
            code: response.data.ProductRefId,
            price: parseFloat(response.data.Items?.[0]?.Price || 0),
            promotionalPrice: parseFloat(response.data.Items?.[0]?.ListPrice || response.data.Items?.[0]?.Price || 0),
            stock: parseInt(response.data.Items?.[0]?.Quantity || 0),
            category: response.data.Category?.Name,
            description: response.data.Description,
            imageUrl: response.data.Items?.[0]?.Images?.[0]?.ImageUrl
        };
    }

    static async getVtexOrderData(config, orderId) {
        const { appKey, appToken, accountName } = config.credentials;
        const baseUrl = `https://${accountName}.vtexcommercestable.com.br`;

        const response = await axios.get(`${baseUrl}/api/oms/pvt/orders/${orderId}`, {
            headers: {
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            }
        });

        if (!response.data) return null;

        return {
            id: response.data.orderId,
            number: response.data.orderId,
            customerId: response.data.clientProfileData?.userProfileId,
            status: response.data.status,
            total: parseFloat(response.data.value),
            items: response.data.items?.map(item => ({
                productId: item.productId,
                name: item.name,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price)
            })) || [],
            createdAt: response.data.creationDate
        };
    }

    // === INTEGRAÇÃO COM SISTEMA DE FIDELIDADE ===

    // Sincronizar pontos de fidelidade com ERP
    static async syncLoyaltyPoints(erpConfig, userId, pointsData) {
        const { type } = erpConfig;

        switch (type) {
            case 'tiny':
                return await this.syncTinyLoyaltyPoints(erpConfig, userId, pointsData);

            case 'bling':
                return await this.syncBlingLoyaltyPoints(erpConfig, userId, pointsData);

            case 'vtex':
                return await this.syncVtexLoyaltyPoints(erpConfig, userId, pointsData);

            case 'custom':
                return await this.syncCustomLoyaltyPoints(erpConfig, userId, pointsData);

            default:
                throw new Error('Tipo de ERP não suportado para sincronização de pontos');
        }
    }

    static async syncTinyLoyaltyPoints(config, userId, pointsData) {
        const { token, baseUrl } = config.credentials;

        // Tiny pode não ter sistema nativo de pontos, então armazenamos como metadata
        const response = await axios.post(`${baseUrl}/contatos.pesquisa.php`, {
            token,
            formato: 'json',
            id: userId,
            // Adicionar pontos como observação ou campo personalizado
        });

        return {
            success: response.data.retorno?.status === 'OK',
            syncedData: pointsData
        };
    }

    static async syncBlingLoyaltyPoints(config, userId, pointsData) {
        const { apikey, baseUrl } = config.credentials;

        // Bling pode armazenar pontos como campo personalizado
        const loyaltyData = {
            pontos_fidelidade: pointsData.totalPoints,
            nivel_fidelidade: pointsData.levelName,
            ultima_atividade: pointsData.lastActivity
        };

        const response = await axios.put(`${baseUrl}/contato/${userId}`, {
            apikey,
            ...loyaltyData
        });

        return {
            success: !response.data.retorno?.erros,
            syncedData: loyaltyData
        };
    }

    static async syncVtexLoyaltyPoints(config, userId, pointsData) {
        const { appKey, appToken, accountName } = config.credentials;
        const baseUrl = `https://${accountName}.vtexcommercestable.com.br`;

        // VTEX Loyalty Program API
        const loyaltyData = {
            id: userId,
            balance: pointsData.totalPoints,
            level: pointsData.level,
            lastActivity: pointsData.lastActivity
        };

        const response = await axios.put(`${baseUrl}/api/loyalty-program/members/${userId}`, loyaltyData, {
            headers: {
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            }
        });

        return {
            success: response.status === 200,
            syncedData: loyaltyData
        };
    }

    static async syncCustomLoyaltyPoints(config, userId, pointsData) {
        const { baseUrl, authType, credentials, endpoints } = config;

        const headers = this.buildAuthHeaders(authType, credentials);

        const response = await axios.post(`${baseUrl}${endpoints.loyaltySync || '/loyalty/sync'}`, {
            userId,
            ...pointsData
        }, { headers });

        return {
            success: response.data.success !== false,
            syncedData: pointsData
        };
    }

    // Buscar pontos de fidelidade do ERP
    static async getLoyaltyPoints(erpConfig, userId) {
        const { type } = erpConfig;

        switch (type) {
            case 'tiny':
                return await this.getTinyLoyaltyPoints(erpConfig, userId);

            case 'bling':
                return await this.getBlingLoyaltyPoints(erpConfig, userId);

            case 'vtex':
                return await this.getVtexLoyaltyPoints(erpConfig, userId);

            case 'custom':
                return await this.getCustomLoyaltyPoints(erpConfig, userId);

            default:
                return { totalPoints: 0, availablePoints: 0 };
        }
    }

    static async getTinyLoyaltyPoints(config, userId) {
        // Tiny pode armazenar pontos em campos personalizados ou observações
        return { totalPoints: 0, availablePoints: 0, source: 'erp' };
    }

    static async getBlingLoyaltyPoints(config, userId) {
        const { apikey, baseUrl } = config.credentials;

        const response = await axios.get(`${baseUrl}/contato/${userId}`, {
            params: { apikey }
        });

        if (response.data.retorno?.erros) {
            return { totalPoints: 0, availablePoints: 0 };
        }

        const contato = response.data.retorno.contatos[0];
        return {
            totalPoints: parseInt(contato.pontos_fidelidade || 0),
            availablePoints: parseInt(contato.pontos_fidelidade || 0),
            levelName: contato.nivel_fidelidade || 'Bronze',
            source: 'erp'
        };
    }

    static async getVtexLoyaltyPoints(config, userId) {
        const { appKey, appToken, accountName } = config.credentials;
        const baseUrl = `https://${accountName}.vtexcommercestable.com.br`;

        try {
            const response = await axios.get(`${baseUrl}/api/loyalty-program/members/${userId}`, {
                headers: {
                    'X-VTEX-API-AppKey': appKey,
                    'X-VTEX-API-AppToken': appToken
                }
            });

            return {
                totalPoints: response.data.balance || 0,
                availablePoints: response.data.balance || 0,
                level: response.data.level || 1,
                lastActivity: response.data.lastActivity,
                source: 'erp'
            };
        } catch (error) {
            return { totalPoints: 0, availablePoints: 0, source: 'erp' };
        }
    }

    static async getCustomLoyaltyPoints(config, userId) {
        const { baseUrl, authType, credentials, endpoints } = config;

        const headers = this.buildAuthHeaders(authType, credentials);

        try {
            const response = await axios.get(`${baseUrl}${endpoints.loyaltyPoints || '/loyalty/points'}/${userId}`, { headers });
            return { ...response.data, source: 'erp' };
        } catch (error) {
            return { totalPoints: 0, availablePoints: 0, source: 'erp' };
        }
    }

    // Sincronizar histórico de transações
    static async syncTransactionHistory(erpConfig, userId, transactions) {
        // Implementar sincronização de histórico de transações se necessário
        // Por enquanto, apenas log
        console.log(`Sincronizando ${transactions.length} transações para usuário ${userId} no ERP`);

        return {
            success: true,
            syncedTransactions: transactions.length
        };
    }

    // Buscar histórico de compras para cálculo de pontos
    static async getPurchaseHistory(erpConfig, userId, period = { months: 12 }) {
        const { type } = erpConfig;

        switch (type) {
            case 'tiny':
                return await this.getTinyPurchaseHistory(erpConfig, userId, period);

            case 'bling':
                return await this.getBlingPurchaseHistory(erpConfig, userId, period);

            case 'vtex':
                return await this.getVtexPurchaseHistory(erpConfig, userId, period);

            case 'custom':
                return await this.getCustomPurchaseHistory(erpConfig, userId, period);

            default:
                return [];
        }
    }

    static async getTinyPurchaseHistory(config, userId, period) {
        const { token, baseUrl } = config.credentials;

        // Buscar pedidos do cliente
        const response = await axios.get(`${baseUrl}/pedidos.pesquisa.php`, {
            params: {
                token,
                formato: 'json',
                id_cliente: userId,
                data_inicial: new Date(Date.now() - period.months * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        });

        if (response.data.retorno?.status !== 'OK') {
            return [];
        }

        const pedidos = response.data.retorno.pedidos || [];
        return pedidos.map(pedido => ({
            id: pedido.id,
            total: parseFloat(pedido.total),
            date: pedido.data_pedido,
            status: pedido.situacao,
            items: pedido.itens?.length || 0
        }));
    }

    static async getBlingPurchaseHistory(config, userId, period) {
        const { apikey, baseUrl } = config.credentials;

        // Buscar pedidos do cliente no Bling
        const response = await axios.get(`${baseUrl}/pedidos`, {
            params: {
                apikey,
                filters: `cliente[${userId}]`
            }
        });

        if (response.data.retorno?.erros) {
            return [];
        }

        const pedidos = response.data.retorno.pedidos || [];
        return pedidos.map(pedido => ({
            id: pedido.numero,
            total: parseFloat(pedido.totalvenda || 0),
            date: pedido.data,
            status: pedido.situacao,
            items: pedido.itens?.length || 0
        }));
    }

    static async getVtexPurchaseHistory(config, userId, period) {
        const { appKey, appToken, accountName } = config.credentials;
        const baseUrl = `https://${accountName}.vtexcommercestable.com.br`;

        const response = await axios.get(`${baseUrl}/api/oms/user/orders`, {
            headers: {
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            },
            params: {
                clientEmail: userId, // Assuming userId is email
                creationDate: `creationDate:[${new Date(Date.now() - period.months * 30 * 24 * 60 * 60 * 1000).toISOString()}]`
            }
        });

        return response.data.list?.map(order => ({
            id: order.orderId,
            total: parseFloat(order.value),
            date: order.creationDate,
            status: order.status,
            items: order.items?.length || 0
        })) || [];
    }

    static async getCustomPurchaseHistory(config, userId, period) {
        const { baseUrl, authType, credentials, endpoints } = config;

        const headers = this.buildAuthHeaders(authType, credentials);

        const response = await axios.get(`${baseUrl}${endpoints.purchaseHistory || '/purchases'}`, {
            headers,
            params: { userId, months: period.months }
        });

        return response.data || [];
    }

    // Avaliar condições de gatilho
    static evaluateTriggerConditions(conditions, data) {
        return conditions.every(condition => {
            const value = this.getNestedValue(data, condition.field);
            switch (condition.operator) {
                case '==': return value == condition.value;
                case '!=': return value != condition.value;
                case '>': return value > condition.value;
                case '<': return value < condition.value;
                case '>=': return value >= condition.value;
                case '<=': return value <= condition.value;
                case 'contains': return String(value).toLowerCase().includes(String(condition.value).toLowerCase());
                default: return false;
            }
        });
    }
}

module.exports = ERPIntegrationService;