const mongoose = require('mongoose');

const magicReplySchema = new mongoose.Schema({
    // Identificação
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },

    // Ativo/Inativo
    isActive: {
        type: Boolean,
        default: true
    },

    // Contexto de ativação
    context: {
        keywords: [{
            type: String,
            trim: true,
            lowercase: true
        }],
        sentimentThreshold: {
            min: { type: Number, min: -1, max: 1, default: -0.5 },
            max: { type: Number, min: -1, max: 1, default: 1 }
        },
        customerValue: {
            type: String,
            enum: ['low', 'medium', 'high', 'vip'],
            default: 'medium'
        },
        erpData: {
            orderValue: {
                min: { type: Number, default: 0 },
                max: { type: Number, default: Infinity }
            },
            lastPurchaseDays: {
                max: { type: Number, default: 365 }
            }
        }
    },

    // Sugestões de resposta
    suggestions: [{
        text: {
            type: String,
            required: true,
            maxlength: 1000
        },
        type: {
            type: String,
            enum: ['parcelamento', 'cupom', 'frete_gratis', 'custom'],
            default: 'custom'
        },
        priority: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        },
        erpActions: [{
            erpType: String,
            action: String,
            data: mongoose.Schema.Types.Mixed
        }],
        mlScore: {
            type: Number,
            min: 0,
            max: 1,
            default: 0.5
        }
    }],

    // Configuração de Machine Learning
    mlConfig: {
        enabled: {
            type: Boolean,
            default: false
        },
        modelVersion: {
            type: String,
            default: 'v1'
        },
        trainingData: [{
            input: String,
            output: String,
            effectiveness: {
                type: Number,
                min: 0,
                max: 1
            },
            usedCount: {
                type: Number,
                default: 0
            }
        }],
        hyperparameters: {
            learningRate: { type: Number, default: 0.01 },
            epochs: { type: Number, default: 100 }
        }
    },

    // Análise de efetividade
    effectivenessMetrics: {
        totalShown: {
            type: Number,
            default: 0
        },
        totalUsed: {
            type: Number,
            default: 0
        },
        totalEffective: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        conversionRate: {
            type: Number,
            min: 0,
            max: 1,
            default: 0
        },
        lastCalculated: Date
    },

    // Configurações específicas por ERP
    erpConfigs: {
        bling: {
            enabled: { type: Boolean, default: false },
            credentials: {
                apikey: String
            },
            mappings: {
                customerIdField: { type: String, default: 'id' },
                productIdField: { type: String, default: 'codigo' },
                orderValueField: { type: String, default: 'totalvenda' }
            }
        },
        vtex: {
            enabled: { type: Boolean, default: false },
            credentials: {
                appKey: String,
                appToken: String,
                accountName: String
            },
            mappings: {
                customerIdField: { type: String, default: 'id' },
                productIdField: { type: String, default: 'productId' },
                orderValueField: { type: String, default: 'value' }
            }
        },
        tiny: {
            enabled: { type: Boolean, default: false },
            credentials: {
                token: String
            },
            mappings: {
                customerIdField: { type: String, default: 'id' },
                productIdField: { type: String, default: 'codigo' },
                orderValueField: { type: String, default: 'total' }
            }
        }
    },

    // Logs de uso
    usageLogs: [{
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        },
        suggestionUsed: String,
        effectiveness: {
            type: Number,
            min: 0,
            max: 5
        },
        erpData: mongoose.Schema.Types.Mixed,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],

    // Metadados
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes para performance
magicReplySchema.index({ isActive: 1 });
magicReplySchema.index({ 'context.keywords': 1 });
magicReplySchema.index({ 'context.customerValue': 1 });
magicReplySchema.index({ 'effectivenessMetrics.conversionRate': -1 });

// Virtual para taxa de conversão
magicReplySchema.virtual('conversionRate').get(function () {
    if (this.effectivenessMetrics.totalShown === 0) return 0;
    return this.effectivenessMetrics.totalUsed / this.effectivenessMetrics.totalShown;
});

// Método para verificar se uma mensagem ativa o Magic Reply
magicReplySchema.methods.matchesContext = function (message, sentimentScore, customerData) {
    // Verificar keywords
    const messageLower = message.toLowerCase();
    const hasKeywords = this.context.keywords.some(keyword =>
        messageLower.includes(keyword)
    );

    // Verificar sentimento
    const sentimentMatch = sentimentScore >= this.context.sentimentThreshold.min &&
        sentimentScore <= this.context.sentimentThreshold.max;

    // Verificar valor do cliente
    const customerValueMatch = !customerData ||
        this.context.customerValue === 'any' ||
        customerData.value === this.context.customerValue;

    // Verificar dados do ERP
    let erpMatch = true;
    if (customerData && this.context.erpData) {
        if (customerData.lastOrderValue) {
            erpMatch = erpMatch && (
                customerData.lastOrderValue >= this.context.erpData.orderValue.min &&
                customerData.lastOrderValue <= this.context.erpData.orderValue.max
            );
        }
        if (customerData.lastPurchaseDays !== undefined) {
            erpMatch = erpMatch && (
                customerData.lastPurchaseDays <= this.context.erpData.lastPurchaseDays.max
            );
        }
    }

    return hasKeywords && sentimentMatch && customerValueMatch && erpMatch;
};

// Método para obter sugestões ordenadas por prioridade e ML score
magicReplySchema.methods.getSuggestions = function () {
    return this.suggestions
        .filter(s => s.text && s.text.trim())
        .sort((a, b) => {
            // Primeiro por ML score se ML estiver habilitado
            if (this.mlConfig.enabled) {
                return b.mlScore - a.mlScore;
            }
            // Senão por prioridade
            return b.priority - a.priority;
        });
};

// Método para registrar uso
magicReplySchema.methods.logUsage = function (ticketId, suggestionText, effectiveness = null) {
    this.usageLogs.push({
        ticketId,
        suggestionUsed: suggestionText,
        effectiveness,
        timestamp: new Date()
    });

    this.effectivenessMetrics.totalUsed++;

    if (effectiveness) {
        this.effectivenessMetrics.averageRating =
            (this.effectivenessMetrics.averageRating * (this.effectivenessMetrics.totalUsed - 1) + effectiveness) /
            this.effectivenessMetrics.totalUsed;
    }

    this.effectivenessMetrics.lastCalculated = new Date();
};

module.exports = mongoose.model('MagicReply', magicReplySchema);