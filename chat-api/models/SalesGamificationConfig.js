const mongoose = require('mongoose');

const salesGamificationConfigSchema = new mongoose.Schema({
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
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Configurações do Contador Regressivo
    countdown: {
        enabled: { type: Boolean, default: true },
        duration: { type: Number, default: 59 }, // minutos
        format: { type: String, default: 'MM:SS', enum: ['MM:SS', 'HH:MM:SS'] },
        text: { type: String, default: 'Expira em' },
        color: { type: String, default: '#ff4444' },
        position: { type: String, default: 'top-right', enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'] },
        showOnProducts: [String], // IDs dos produtos
        autoRestart: { type: Boolean, default: true }
    },

    // Configurações de Estoque Dinâmico
    stock: {
        enabled: { type: Boolean, default: true },
        mode: { type: String, default: 'real', enum: ['real', 'fake', 'hybrid'] }, // real, fake, hybrid
        fakeStockRange: {
            min: { type: Number, default: 5 },
            max: { type: Number, default: 20 }
        },
        updateInterval: { type: Number, default: 30 }, // segundos
        lowStockThreshold: { type: Number, default: 5 },
        lowStockText: { type: String, default: 'Poucos itens restantes!' },
        outOfStockText: { type: String, default: 'Esgotado' },
        showProgressBar: { type: Boolean, default: true },
        progressBarColor: { type: String, default: '#ff6b35' }
    },

    // Configurações de Preço Dinâmico com IA
    pricing: {
        enabled: { type: Boolean, default: true },
        basePrice: { type: Number, required: true },
        minDiscount: { type: Number, default: 5 }, // %
        maxDiscount: { type: Number, default: 20 }, // %
        negotiationSteps: { type: Number, default: 3 },
        aiPersonality: { type: String, default: 'aggressive', enum: ['aggressive', 'moderate', 'conservative'] },
        responseDelay: { type: Number, default: 2000 }, // ms
        inputPlaceholder: { type: String, default: 'Digite sua proposta...' },
        acceptText: { type: String, default: 'Aceitar proposta' },
        counterText: { type: String, default: 'Fazer contra-proposta' },
        finalPrice: { type: Number } // preço final negociado
    },

    // Configurações de Frete Grátis
    freeShipping: {
        enabled: { type: Boolean, default: true },
        threshold: { type: Number, default: 100 }, // R$
        currentCartValue: { type: Number, default: 0 },
        progressBarColor: { type: String, default: '#4CAF50' },
        text: { type: String, default: 'Faltam R$ {{amount}} para frete grátis!' },
        successText: { type: String, default: '🎉 Frete grátis liberado!' },
        showAmount: { type: Boolean, default: true },
        position: { type: String, default: 'cart', enum: ['cart', 'header', 'product'] }
    },

    // Configurações de Social Proof
    socialProof: {
        enabled: { type: Boolean, default: true },
        mode: { type: String, default: 'live', enum: ['live', 'static', 'hybrid'] },
        updateInterval: { type: Number, default: 30 }, // segundos
        notifications: [{
            name: String,
            location: String,
            product: String,
            timeAgo: String,
            avatar: String,
            enabled: { type: Boolean, default: true }
        }],
        textTemplate: { type: String, default: '{{name}} {{location}} comprou' },
        animationDuration: { type: Number, default: 5000 }, // ms
        maxNotifications: { type: Number, default: 10 },
        position: { type: String, default: 'bottom-right', enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right'] }
    },

    // Configurações do Pop-up de Saída
    exitPopup: {
        enabled: { type: Boolean, default: true },
        discount: { type: Number, default: 5 }, // %
        title: { type: String, default: 'Espere!' },
        message: { type: String, default: 'Não vá embora sem este desconto especial!' },
        buttonText: { type: String, default: 'Pegar Desconto' },
        couponCode: { type: String },
        imageUrl: { type: String },
        triggerDelay: { type: Number, default: 5000 }, // ms antes de ativar
        showOncePerSession: { type: Boolean, default: true }
    },

    // Configurações de Recuperação de Carrinho
    cartRecovery: {
        enabled: { type: Boolean, default: true },
        whatsappNumber: { type: String, required: true },
        messageTemplate: { type: String, default: 'Olá! Vi que você abandonou seu carrinho. Que tal finalizar sua compra?' },
        sendPhoto: { type: Boolean, default: true },
        photoUrl: { type: String },
        delayHours: { type: Number, default: 2 },
        maxAttempts: { type: Number, default: 3 }
    },

    // Configurações de Comparativo Concorrente
    competitorComparison: {
        enabled: { type: Boolean, default: true },
        competitors: [{
            name: String,
            price: Number,
            features: [String],
            rating: Number,
            imageUrl: String
        }],
        ourAdvantages: [String],
        highlightColor: { type: String, default: '#4CAF50' },
        showRatings: { type: Boolean, default: true },
        comparisonTable: {
            enabled: Boolean,
            columns: [String]
        }
    },

    // Configurações Gerais
    settings: {
        targetProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        targetCategories: [String],
        userSegments: [String],
        geolocation: {
            enabled: Boolean,
            countries: [String],
            regions: [String]
        },
        schedule: {
            enabled: Boolean,
            daysOfWeek: [Number], // 0-6
            startTime: String, // HH:MM
            endTime: String // HH:MM
        },
        analytics: {
            trackImpressions: Boolean,
            trackClicks: Boolean,
            trackConversions: Boolean,
            customEvents: [String]
        }
    },

    // Estatísticas
    stats: {
        impressions: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },
        avgConversionRate: { type: Number, default: 0 }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
salesGamificationConfigSchema.index({ isActive: 1 });
salesGamificationConfigSchema.index({ createdBy: 1 });
salesGamificationConfigSchema.index({ 'settings.targetProducts': 1 });
salesGamificationConfigSchema.index({ 'settings.targetCategories': 1 });

// Virtual para taxa de conversão
salesGamificationConfigSchema.virtual('conversionRate').get(function () {
    if (this.stats.impressions > 0) {
        return (this.stats.conversions / this.stats.impressions) * 100;
    }
    return 0;
});

// Virtual para CTR
salesGamificationConfigSchema.virtual('clickThroughRate').get(function () {
    if (this.stats.impressions > 0) {
        return (this.stats.clicks / this.stats.impressions) * 100;
    }
    return 0;
});

// Pre-save middleware
salesGamificationConfigSchema.pre('save', function (next) {
    // Calcular taxa de conversão média
    if (this.stats.impressions > 0) {
        this.stats.avgConversionRate = (this.stats.conversions / this.stats.impressions) * 100;
    }

    next();
});

// Métodos estáticos
salesGamificationConfigSchema.statics.getActiveConfigs = function (productId = null, category = null, userSegment = null) {
    const query = { isActive: true };

    if (productId) {
        query['settings.targetProducts'] = productId;
    }

    if (category) {
        query['settings.targetCategories'] = category;
    }

    if (userSegment) {
        query['settings.userSegments'] = userSegment;
    }

    return this.find(query);
};

salesGamificationConfigSchema.statics.getConfigsForProduct = function (productId, category = null) {
    const query = {
        isActive: true,
        $or: [
            { 'settings.targetProducts': productId },
            { 'settings.targetCategories': category }
        ]
    };

    return this.find(query);
};

// Métodos de instância
salesGamificationConfigSchema.methods.isAvailableForUser = function (userData = {}) {
    // Verificar se está disponível baseado no agendamento
    if (this.settings.schedule?.enabled) {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentTime = now.toTimeString().slice(0, 5);

        if (!this.settings.schedule.daysOfWeek.includes(dayOfWeek)) {
            return false;
        }

        if (currentTime < this.settings.schedule.startTime || currentTime > this.settings.schedule.endTime) {
            return false;
        }
    }

    // Verificar segmentação por localização
    if (this.settings.geolocation?.enabled && userData.location) {
        const userCountry = userData.location.country;
        const userRegion = userData.location.region;

        if (this.settings.geolocation.countries.length > 0 && !this.settings.geolocation.countries.includes(userCountry)) {
            return false;
        }

        if (this.settings.geolocation.regions.length > 0 && !this.settings.geolocation.regions.includes(userRegion)) {
            return false;
        }
    }

    return true;
};

salesGamificationConfigSchema.methods.recordImpression = function () {
    this.stats.impressions += 1;
    return this.save();
};

salesGamificationConfigSchema.methods.recordClick = function () {
    this.stats.clicks += 1;
    return this.save();
};

salesGamificationConfigSchema.methods.recordConversion = function (revenue = 0) {
    this.stats.conversions += 1;
    this.stats.revenue += revenue;
    return this.save();
};

module.exports = mongoose.model('SalesGamificationConfig', salesGamificationConfigSchema);