const mongoose = require('mongoose');

const salesTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    category: {
        type: String,
        enum: ['abandoned-cart', 'upsell', 'cross-sell', 'win-back', 'welcome', 'reactivation', 'custom'],
        required: true
    },
    type: {
        type: String,
        enum: ['flow', 'single-message'],
        default: 'flow'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Fluxo de mensagens drag-drop
    flow: {
        components: [{
            id: String, // ID único do componente
            type: {
                type: String,
                enum: ['message', 'delay', 'condition', 'action', 'split-test']
            },
            position: {
                x: Number,
                y: Number
            },
            data: mongoose.Schema.Types.Mixed, // Dados específicos do componente
            connections: [{
                targetId: String,
                condition: String // condição para conectar
            }]
        }],
        startComponentId: String
    },

    // Dados do template para mensagens únicas
    templateData: {
        title: String,
        content: String,
        media: [{
            type: String,
            url: String,
            caption: String
        }],
        buttons: [{
            type: {
                type: String,
                enum: ['quick_reply', 'url', 'call']
            },
            text: String,
            value: String
        }]
    },

    // Configurações de gatilho
    triggers: [{
        event: {
            type: String,
            enum: ['cart-abandoned', 'product-viewed', 'order-completed', 'user-inactive', 'custom-event']
        },
        conditions: [{
            field: String,
            operator: String,
            value: mongoose.Schema.Types.Mixed
        }],
        delay: {
            type: Number, // minutos
            default: 0
        }
    }],

    // Integração ERP
    erpIntegration: {
        enabled: Boolean,
        endpoint: String,
        authType: String,
        credentials: mongoose.Schema.Types.Mixed,
        mappings: [{
            templateField: String,
            erpField: String,
            transform: String // função de transformação
        }]
    },

    // A/B Testing
    abTest: {
        enabled: Boolean,
        variants: [{
            name: String,
            weight: Number, // peso para distribuição
            flow: mongoose.Schema.Types.Mixed, // variante do fluxo
            templateData: mongoose.Schema.Types.Mixed
        }],
        testDuration: Number, // dias
        targetMetric: String,
        winnerCriteria: String
    },

    // Analytics
    analytics: {
        totalSent: { type: Number, default: 0 },
        totalDelivered: { type: Number, default: 0 },
        totalOpened: { type: Number, default: 0 },
        totalClicked: { type: Number, default: 0 },
        totalConverted: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
        conversionRate: { type: Number, default: 0 },
        avgOrderValue: { type: Number, default: 0 }
    },

    // Tags e placeholders
    tags: [String],
    placeholders: [{
        key: String,
        description: String,
        type: {
            type: String,
            enum: ['text', 'number', 'date', 'erp-field']
        },
        defaultValue: String,
        erpMapping: String
    }],

    // Configurações avançadas
    settings: {
        maxRetries: { type: Number, default: 3 },
        retryDelay: { type: Number, default: 1440 }, // minutos
        channels: [{
            type: String,
            enum: ['whatsapp', 'email', 'sms', 'push']
        }],
        timezone: { type: String, default: 'America/Sao_Paulo' },
        audience: {
            segments: [String],
            excludeSegments: [String]
        }
    },

    // Metadados
    metadata: {
        version: { type: Number, default: 1 },
        basedOn: mongoose.Schema.Types.ObjectId,
        estimatedRevenue: Number,
        successRate: Number,
        lastExecutedAt: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
salesTemplateSchema.index({ category: 1 });
salesTemplateSchema.index({ isActive: 1 });
salesTemplateSchema.index({ createdBy: 1 });
salesTemplateSchema.index({ usageCount: -1 });
salesTemplateSchema.index({ 'analytics.conversionRate': -1 });
salesTemplateSchema.index({ tags: 1 });

// Virtual para ROI
salesTemplateSchema.virtual('roi').get(function () {
    if (this.analytics.totalRevenue > 0 && this.metadata.estimatedRevenue) {
        return ((this.analytics.totalRevenue - this.metadata.estimatedRevenue) / this.metadata.estimatedRevenue) * 100;
    }
    return 0;
});

// Pre-save middleware
salesTemplateSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.metadata.version += 1;
    }

    // Calcular taxa de conversão
    if (this.analytics.totalSent > 0) {
        this.analytics.conversionRate = (this.analytics.totalConverted / this.analytics.totalSent) * 100;
    }

    // Calcular valor médio do pedido
    if (this.analytics.totalConverted > 0) {
        this.analytics.avgOrderValue = this.analytics.totalRevenue / this.analytics.totalConverted;
    }

    next();
});

// Métodos estáticos
salesTemplateSchema.statics.getPopularTemplates = function (limit = 10, category = null) {
    const query = { isActive: true };
    if (category) query.category = category;

    return this.find(query)
        .sort({ usageCount: -1 })
        .limit(limit)
        .populate('createdBy', 'name email')
        .select('name description category usageCount analytics');
};

salesTemplateSchema.statics.searchTemplates = function (searchTerm, userId = null, limit = 20) {
    const query = { isActive: true };
    if (userId) query.createdBy = userId;

    return this.find({
        ...query,
        $or: [
            { name: new RegExp(searchTerm, 'i') },
            { description: new RegExp(searchTerm, 'i') },
            { category: new RegExp(searchTerm, 'i') },
            { tags: new RegExp(searchTerm, 'i') }
        ]
    })
        .limit(limit)
        .populate('createdBy', 'name email')
        .sort({ usageCount: -1, createdAt: -1 });
};

// Métodos de instância
salesTemplateSchema.methods.incrementUsage = function () {
    this.usageCount += 1;
    return this.save();
};

salesTemplateSchema.methods.processPlaceholders = function (data, erpData = {}) {
    let processed = JSON.parse(JSON.stringify(this.templateData || {}));

    // Função para substituir placeholders
    const replacePlaceholders = (str) => {
        if (typeof str !== 'string') return str;

        this.placeholders.forEach(placeholder => {
            const regex = new RegExp(`{{${placeholder.key}}}`, 'g');
            let value = data[placeholder.key] || placeholder.defaultValue || '';

            // Se for campo ERP e temos dados ERP
            if (placeholder.type === 'erp-field' && placeholder.erpMapping && erpData[placeholder.erpMapping]) {
                value = erpData[placeholder.erpMapping];
            }

            str = str.replace(regex, value);
        });

        return str;
    };

    // Processar recursivamente
    const processObject = (obj) => {
        if (typeof obj === 'string') {
            return replacePlaceholders(obj);
        } else if (Array.isArray(obj)) {
            return obj.map(processObject);
        } else if (obj && typeof obj === 'object') {
            const processed = {};
            for (const [key, value] of Object.entries(obj)) {
                processed[key] = processObject(value);
            }
            return processed;
        }
        return obj;
    };

    return processObject(processed);
};

salesTemplateSchema.methods.executeFlow = async function (userId, context = {}) {
    // Lógica para executar o fluxo baseado nos componentes drag-drop
    const execution = {
        templateId: this._id,
        userId,
        status: 'active',
        steps: [],
        context
    };

    // Implementar lógica de execução do fluxo aqui
    // ...

    return execution;
};

module.exports = mongoose.model('SalesTemplate', salesTemplateSchema);