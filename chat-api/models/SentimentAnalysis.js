const mongoose = require('mongoose');

const sentimentAnalysisSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
        index: true
    },
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        index: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    sentiment: {
        type: String,
        enum: ['very_negative', 'negative', 'neutral', 'positive', 'very_positive'],
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    category: {
        type: String,
        enum: ['raiva', 'frustracao', 'neutro', 'satisfacao', 'empolgação'],
        required: true
    },
    keywords: [{
        type: String,
        trim: true
    }],
    entities: [{
        text: String,
        type: String,
        confidence: Number
    }],
    analysisType: {
        type: String,
        enum: ['initial', 'final', 'ongoing'],
        default: 'ongoing'
    },
    analyzedBy: {
        type: String,
        enum: ['ai', 'agent', 'auto'],
        default: 'ai'
    },
    alertTriggered: {
        type: Boolean,
        default: false
    },
    alertType: {
        type: String,
        enum: ['escalation', 'reward', 'warning', 'none'],
        default: 'none'
    },
    alertMessage: {
        type: String,
        trim: true
    },
    metadata: {
        language: String,
        sentimentTrend: String,
        emotionIntensity: Number,
        sarcasmDetected: Boolean,
        urgencyScore: Number
    },
    previousScore: {
        type: Number,
        min: 1,
        max: 10
    },
    scoreChange: {
        type: Number,
        min: -9,
        max: 9
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        index: true
    },
    department: {
        type: String,
        trim: true,
        index: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    responseTime: {
        type: Number, // in milliseconds
        default: null
    },
    resolutionTime: {
        type: Number, // in milliseconds
        default: null
    },
    satisfactionScore: {
        type: Number,
        min: 0,
        max: 10,
        default: null
    },
    npsScore: {
        type: Number,
        min: 0,
        max: 10,
        default: null
    },
    csatScore: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    escalationReason: {
        type: String,
        trim: true
    },
    rewardGiven: {
        type: Boolean,
        default: false
    },
    rewardType: {
        type: String,
        enum: ['cafe', 'brinde', 'desconto', 'upgrade', 'none'],
        default: 'none'
    },
    rewardDetails: {
        type: String,
        trim: true
    },
    processedAt: {
        type: Date,
        default: Date.now
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    processingTime: {
        type: Number, // in milliseconds
        default: 0
    },
    error: {
        type: String,
        trim: true
    },
    retryCount: {
        type: Number,
        default: 0
    },
    isProcessed: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
sentimentAnalysisSchema.index({ ticketId: 1, createdAt: -1 });
sentimentAnalysisSchema.index({ sentiment: 1, createdAt: -1 });
sentimentAnalysisSchema.index({ score: 1, createdAt: -1 });
sentimentAnalysisSchema.index({ agentId: 1, createdAt: -1 });
sentimentAnalysisSchema.index({ productId: 1, createdAt: -1 });
sentimentAnalysisSchema.index({ department: 1, createdAt: -1 });
sentimentAnalysisSchema.index({ alertTriggered: 1, createdAt: -1 });
sentimentAnalysisSchema.index({ analysisType: 1, createdAt: -1 });
sentimentAnalysisSchema.index({ isProcessed: 1, createdAt: -1 });
sentimentAnalysisSchema.index({ isArchived: 1, createdAt: -1 });

// Virtual for sentiment label
sentimentAnalysisSchema.virtual('sentimentLabel').get(function () {
    const labels = {
        'very_negative': 'Muito Negativo',
        'negative': 'Negativo',
        'neutral': 'Neutro',
        'positive': 'Positivo',
        'very_positive': 'Muito Positivo'
    };
    return labels[this.sentiment] || 'Desconhecido';
});

// Virtual for category label
sentimentAnalysisSchema.virtual('categoryLabel').get(function () {
    const labels = {
        'raiva': 'Raiva',
        'frustracao': 'Frustração',
        'neutro': 'Neutro',
        'satisfacao': 'Satisfação',
        'empolgação': 'Empolgação'
    };
    return labels[this.category] || 'Desconhecido';
});

// Virtual for score emoji
sentimentAnalysisSchema.virtual('scoreEmoji').get(function () {
    if (this.score <= 2) return '😡';
    if (this.score <= 4) return '😠';
    if (this.score <= 6) return '😐';
    if (this.score <= 8) return '😊';
    return '🤩';
});

// Virtual for score color
sentimentAnalysisSchema.virtual('scoreColor').get(function () {
    if (this.score <= 2) return '#ef4444'; // red-500
    if (this.score <= 4) return '#f97316'; // orange-500
    if (this.score <= 6) return '#eab308'; // yellow-500
    if (this.score <= 8) return '#22c55e'; // green-500
    return '#10b981'; // emerald-500
});

// Virtual for score badge
sentimentAnalysisSchema.virtual('scoreBadge').get(function () {
    return `[${this.scoreEmoji} ${this.score}]`;
});

// Pre-save middleware to calculate score change
sentimentAnalysisSchema.pre('save', function (next) {
    if (this.isNew && this.previousScore) {
        this.scoreChange = this.score - this.previousScore;
    }
    next();
});

// Static method to get sentiment ranges
sentimentAnalysisSchema.statics.getSentimentRanges = function () {
    return {
        very_negative: { min: 1, max: 2, label: 'Muito Negativo' },
        negative: { min: 3, max: 4, label: 'Negativo' },
        neutral: { min: 5, max: 6, label: 'Neutro' },
        positive: { min: 7, max: 8, label: 'Positivo' },
        very_positive: { min: 9, max: 10, label: 'Muito Positivo' }
    };
};

// Static method to get category ranges
sentimentAnalysisSchema.statics.getCategoryRanges = function () {
    return {
        raiva: { min: 1, max: 2, label: 'Raiva' },
        frustracao: { min: 3, max: 4, label: 'Frustração' },
        neutro: { min: 5, max: 6, label: 'Neutro' },
        satisfacao: { min: 7, max: 8, label: 'Satisfação' },
        empolgação: { min: 9, max: 10, label: 'Empolgação' }
    };
};

// Static method to get alert thresholds
sentimentAnalysisSchema.statics.getAlertThresholds = function () {
    return {
        escalation: { min: 1, max: 2, label: 'Escalonamento Urgente' },
        warning: { min: 3, max: 4, label: 'Atenção Necessária' },
        reward: { min: 9, max: 10, label: 'Recompensa' },
        none: { min: 5, max: 8, label: 'Normal' }
    };
};

// Static method to get reward types
sentimentAnalysisSchema.statics.getRewardTypes = function () {
    return {
        cafe: { label: 'Café', description: 'Cupom de café' },
        brinde: { label: 'Brinde', description: 'Brinde especial' },
        desconto: { label: 'Desconto', description: 'Desconto em compra' },
        upgrade: { label: 'Upgrade', description: 'Upgrade de serviço' },
        none: { label: 'Nenhum', description: 'Sem recompensa' }
    };
};

// Method to check if alert should be triggered
sentimentAnalysisSchema.methods.shouldTriggerAlert = function (thresholds) {
    if (!thresholds) {
        thresholds = this.constructor.getAlertThresholds();
    }

    if (this.score <= thresholds.escalation.max) {
        return { shouldTrigger: true, type: 'escalation', message: 'Cliente muito insatisfeito - escalonamento necessário' };
    }

    if (this.score <= thresholds.warning.max) {
        return { shouldTrigger: true, type: 'warning', message: 'Cliente insatisfeito - atenção necessária' };
    }

    if (this.score >= thresholds.reward.min) {
        return { shouldTrigger: true, type: 'reward', message: 'Cliente muito satisfeito - recompensa disponível' };
    }

    return { shouldTrigger: false, type: 'none', message: '' };
};

// Method to determine reward type
sentimentAnalysisSchema.methods.determineRewardType = function (score) {
    if (score >= 9) {
        const rewards = ['cafe', 'brinde'];
        return rewards[Math.floor(Math.random() * rewards.length)];
    }
    return 'none';
};

// Method to calculate satisfaction metrics
sentimentAnalysisSchema.methods.calculateSatisfactionMetrics = function () {
    const metrics = {
        overall: this.score,
        sentiment: this.sentiment,
        category: this.category,
        confidence: this.confidence,
        trend: this.scoreChange || 0,
        isImproving: this.scoreChange > 0,
        isDeteriorating: this.scoreChange < 0,
        isStable: this.scoreChange === 0
    };

    return metrics;
};

// Method to generate alert message
sentimentAnalysisSchema.methods.generateAlertMessage = function () {
    const alerts = {
        escalation: `🚨 ESCALONAMENTO URGENTE: Cliente com sentimento ${this.sentimentLabel} (Score: ${this.score})`,
        warning: `⚠️ ATENÇÃO: Cliente com sentimento ${this.sentimentLabel} (Score: ${this.score})`,
        reward: `🎉 RECOMPENSA: Cliente com sentimento ${this.sentimentLabel} (Score: ${this.score}) - ${this.rewardType}`,
        none: ''
    };

    return alerts[this.alertType] || '';
};

// Method to update sentiment analysis
sentimentAnalysisSchema.methods.updateAnalysis = function (updates) {
    Object.assign(this, updates);
    return this.save();
};

// Static method to get dashboard metrics
sentimentAnalysisSchema.statics.getDashboardMetrics = async function (filters = {}) {
    const match = {};

    if (filters.startDate && filters.endDate) {
        match.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters.agentId) {
        match.agentId = new mongoose.Types.ObjectId(filters.agentId);
    }

    if (filters.productId) {
        match.productId = new mongoose.Types.ObjectId(filters.productId);
    }

    if (filters.department) {
        match.department = filters.department;
    }

    if (filters.sentiment) {
        match.sentiment = filters.sentiment;
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                avgScore: { $avg: '$score' },
                avgConfidence: { $avg: '$confidence' },
                veryNegative: { $sum: { $cond: [{ $eq: ['$sentiment', 'very_negative'] }, 1, 0] } },
                negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
                neutral: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } },
                positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
                veryPositive: { $sum: { $cond: [{ $eq: ['$sentiment', 'very_positive'] }, 1, 0] } },
                alertsTriggered: { $sum: { $cond: [{ $eq: ['$alertTriggered', true] }, 1, 0] } },
                rewardsGiven: { $sum: { $cond: [{ $ne: ['$rewardType', 'none'] }, 1, 0] } },
                escalations: { $sum: { $cond: [{ $eq: ['$alertType', 'escalation'] }, 1, 0] } },
                warnings: { $sum: { $cond: [{ $eq: ['$alertType', 'warning'] }, 1, 0] } },
                avgResponseTime: { $avg: '$responseTime' },
                avgResolutionTime: { $avg: '$resolutionTime' },
                avgSatisfaction: { $avg: '$satisfactionScore' },
                avgNPS: { $avg: '$npsScore' },
                avgCSAT: { $avg: '$csatScore' }
            }
        }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || null;
};

// Static method to get metrics by agent
sentimentAnalysisSchema.statics.getMetricsByAgent = async function (filters = {}) {
    const match = {};

    if (filters.startDate && filters.endDate) {
        match.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters.productId) {
        match.productId = new mongoose.Types.ObjectId(filters.productId);
    }

    if (filters.department) {
        match.department = filters.department;
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: '$agentId',
                total: { $sum: 1 },
                avgScore: { $avg: '$score' },
                avgConfidence: { $avg: '$confidence' },
                veryNegative: { $sum: { $cond: [{ $eq: ['$sentiment', 'very_negative'] }, 1, 0] } },
                negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
                neutral: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } },
                positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
                veryPositive: { $sum: { $cond: [{ $eq: ['$sentiment', 'very_positive'] }, 1, 0] } },
                alertsTriggered: { $sum: { $cond: [{ $eq: ['$alertTriggered', true] }, 1, 0] } },
                rewardsGiven: { $sum: { $cond: [{ $ne: ['$rewardType', 'none'] }, 1, 0] } },
                escalations: { $sum: { $cond: [{ $eq: ['$alertType', 'escalation'] }, 1, 0] } },
                warnings: { $sum: { $cond: [{ $eq: ['$alertType', 'warning'] }, 1, 0] } },
                avgResponseTime: { $avg: '$responseTime' },
                avgResolutionTime: { $avg: '$resolutionTime' },
                avgSatisfaction: { $avg: '$satisfactionScore' },
                avgNPS: { $avg: '$npsScore' },
                avgCSAT: { $avg: '$csatScore' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'agent'
            }
        },
        {
            $unwind: { path: '$agent', preserveNullAndEmptyArrays: true }
        },
        {
            $project: {
                agentId: '$_id',
                agentName: '$agent.name',
                agentEmail: '$agent.email',
                total: 1,
                avgScore: 1,
                avgConfidence: 1,
                veryNegative: 1,
                negative: 1,
                neutral: 1,
                positive: 1,
                veryPositive: 1,
                alertsTriggered: 1,
                rewardsGiven: 1,
                escalations: 1,
                warnings: 1,
                avgResponseTime: 1,
                avgResolutionTime: 1,
                avgSatisfaction: 1,
                avgNPS: 1,
                avgCSAT: 1
            }
        },
        { $sort: { avgScore: -1 } }
    ];

    return await this.aggregate(pipeline);
};

// Static method to get metrics by product
sentimentAnalysisSchema.statics.getMetricsByProduct = async function (filters = {}) {
    const match = {};

    if (filters.startDate && filters.endDate) {
        match.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters.agentId) {
        match.agentId = new mongoose.Types.ObjectId(filters.agentId);
    }

    if (filters.department) {
        match.department = filters.department;
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: '$productId',
                total: { $sum: 1 },
                avgScore: { $avg: '$score' },
                avgConfidence: { $avg: '$confidence' },
                veryNegative: { $sum: { $cond: [{ $eq: ['$sentiment', 'very_negative'] }, 1, 0] } },
                negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
                neutral: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } },
                positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
                veryPositive: { $sum: { $cond: [{ $eq: ['$sentiment', 'very_positive'] }, 1, 0] } },
                alertsTriggered: { $sum: { $cond: [{ $eq: ['$alertTriggered', true] }, 1, 0] } },
                rewardsGiven: { $sum: { $cond: [{ $ne: ['$rewardType', 'none'] }, 1, 0] } },
                escalations: { $sum: { $cond: [{ $eq: ['$alertType', 'escalation'] }, 1, 0] } },
                warnings: { $sum: { $cond: [{ $eq: ['$alertType', 'warning'] }, 1, 0] } },
                avgResponseTime: { $avg: '$responseTime' },
                avgResolutionTime: { $avg: '$resolutionTime' },
                avgSatisfaction: { $avg: '$satisfactionScore' },
                avgNPS: { $avg: '$npsScore' },
                avgCSAT: { $avg: '$csatScore' }
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $unwind: { path: '$product', preserveNullAndEmptyArrays: true }
        },
        {
            $project: {
                productId: '$_id',
                productName: '$product.name',
                total: 1,
                avgScore: 1,
                avgConfidence: 1,
                veryNegative: 1,
                negative: 1,
                neutral: 1,
                positive: 1,
                veryPositive: 1,
                alertsTriggered: 1,
                rewardsGiven: 1,
                escalations: 1,
                warnings: 1,
                avgResponseTime: 1,
                avgResolutionTime: 1,
                avgSatisfaction: 1,
                avgNPS: 1,
                avgCSAT: 1
            }
        },
        { $sort: { avgScore: -1 } }
    ];

    return await this.aggregate(pipeline);
};

// Static method to get support effectiveness report
sentimentAnalysisSchema.statics.getSupportEffectivenessReport = async function (filters = {}) {
    const match = {};

    if (filters.startDate && filters.endDate) {
        match.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters.agentId) {
        match.agentId = new mongoose.Types.ObjectId(filters.agentId);
    }

    if (filters.productId) {
        match.productId = new mongoose.Types.ObjectId(filters.productId);
    }

    if (filters.department) {
        match.department = filters.department;
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: '$ticketId',
                initialScore: { $first: '$score' },
                finalScore: { $last: '$score' },
                initialSentiment: { $first: '$sentiment' },
                finalSentiment: { $last: '$sentiment' },
                initialCategory: { $first: '$category' },
                finalCategory: { $last: '$category' },
                totalAnalyses: { $sum: 1 },
                avgScore: { $avg: '$score' },
                scoreChange: { $last: '$scoreChange' },
                alertsTriggered: { $sum: { $cond: [{ $eq: ['$alertTriggered', true] }, 1, 0] } },
                rewardsGiven: { $sum: { $cond: [{ $ne: ['$rewardType', 'none'] }, 1, 0] } },
                escalations: { $sum: { $cond: [{ $eq: ['$alertType', 'escalation'] }, 1, 0] } },
                warnings: { $sum: { $cond: [{ $eq: ['$alertType', 'warning'] }, 1, 0] } },
                avgResponseTime: { $avg: '$responseTime' },
                avgResolutionTime: { $avg: '$resolutionTime' },
                avgSatisfaction: { $avg: '$satisfactionScore' },
                avgNPS: { $avg: '$npsScore' },
                avgCSAT: { $avg: '$csatScore' }
            }
        },
        {
            $project: {
                ticketId: '$_id',
                initialScore: 1,
                finalScore: 1,
                initialSentiment: 1,
                finalSentiment: 1,
                initialCategory: 1,
                finalCategory: 1,
                totalAnalyses: 1,
                avgScore: 1,
                scoreChange: 1,
                alertsTriggered: 1,
                rewardsGiven: 1,
                escalations: 1,
                warnings: 1,
                avgResponseTime: 1,
                avgResolutionTime: 1,
                avgSatisfaction: 1,
                avgNPS: 1,
                avgCSAT: 1,
                improvement: { $cond: [{ $gt: ['$finalScore', '$initialScore'] }, true, false] },
                deterioration: { $cond: [{ $lt: ['$finalScore', '$initialScore'] }, true, false] },
                stable: { $cond: [{ $eq: ['$finalScore', '$initialScore'] }, true, false] }
            }
        },
        { $sort: { finalScore: -1 } }
    ];

    return await this.aggregate(pipeline);
};

// Static method to get time series data
sentimentAnalysisSchema.statics.getTimeSeriesData = async function (filters = {}) {
    const match = {};

    if (filters.startDate && filters.endDate) {
        match.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters.agentId) {
        match.agentId = new mongoose.Types.ObjectId(filters.agentId);
    }

    if (filters.productId) {
        match.productId = new mongoose.Types.ObjectId(filters.productId);
    }

    if (filters.department) {
        match.department = filters.department;
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                total: { $sum: 1 },
                avgScore: { $avg: '$score' },
                avgConfidence: { $avg: '$confidence' },
                veryNegative: { $sum: { $cond: [{ $eq: ['$sentiment', 'very_negative'] }, 1, 0] } },
                negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
                neutral: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } },
                positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
                veryPositive: { $sum: { $cond: [{ $eq: ['$sentiment', 'very_positive'] }, 1, 0] } },
                alertsTriggered: { $sum: { $cond: [{ $eq: ['$alertTriggered', true] }, 1, 0] } },
                rewardsGiven: { $sum: { $cond: [{ $ne: ['$rewardType', 'none'] }, 1, 0] } },
                escalations: { $sum: { $cond: [{ $eq: ['$alertType', 'escalation'] }, 1, 0] } },
                warnings: { $sum: { $cond: [{ $eq: ['$alertType', 'warning'] }, 1, 0] } }
            }
        },
        { $sort: { _id: 1 } }
    ];

    return await this.aggregate(pipeline);
};

// Static method to get sentiment distribution
sentimentAnalysisSchema.statics.getSentimentDistribution = async function (filters = {}) {
    const match = {};

    if (filters.startDate && filters.endDate) {
        match.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters.agentId) {
        match.agentId = new mongoose.Types.ObjectId(filters.agentId);
    }

    if (filters.productId) {
        match.productId = new mongoose.Types.ObjectId(filters.productId);
    }

    if (filters.department) {
        match.department = filters.department;
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: '$sentiment',
                count: { $sum: 1 },
                percentage: { $sum: 1 }
            }
        },
        {
            $project: {
                sentiment: '$_id',
                count: 1,
                percentage: { $multiply: [{ $divide: ['$count', { $sum: '$count' }] }, 100] }
            }
        },
        { $sort: { count: -1 } }
    ];

    return await this.aggregate(pipeline);
};

// Static method to get alert statistics
sentimentAnalysisSchema.statics.getAlertStatistics = async function (filters = {}) {
    const match = { alertTriggered: true };

    if (filters.startDate && filters.endDate) {
        match.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters.agentId) {
        match.agentId = new mongoose.Types.ObjectId(filters.agentId);
    }

    if (filters.productId) {
        match.productId = new mongoose.Types.ObjectId(filters.productId);
    }

    if (filters.department) {
        match.department = filters.department;
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: '$alertType',
                count: { $sum: 1 },
                avgScore: { $avg: '$score' },
                avgConfidence: { $avg: '$confidence' },
                rewardsGiven: { $sum: { $cond: [{ $ne: ['$rewardType', 'none'] }, 1, 0] } }
            }
        },
        {
            $project: {
                alertType: '$_id',
                count: 1,
                avgScore: 1,
                avgConfidence: 1,
                rewardsGiven: 1
            }
        },
        { $sort: { count: -1 } }
    ];

    return await this.aggregate(pipeline);
};

// Static method to get reward statistics
sentimentAnalysisSchema.statics.getRewardStatistics = async function (filters = {}) {
    const match = { rewardType: { $ne: 'none' } };

    if (filters.startDate && filters.endDate) {
        match.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters.agentId) {
        match.agentId = new mongoose.Types.ObjectId(filters.agentId);
    }

    if (filters.productId) {
        match.productId = new mongoose.Types.ObjectId(filters.productId);
    }

    if (filters.department) {
        match.department = filters.department;
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: '$rewardType',
                count: { $sum: 1 },
                avgScore: { $avg: '$score' },
                avgConfidence: { $avg: '$confidence' }
            }
        },
        {
            $project: {
                rewardType: '$_id',
                count: 1,
                avgScore: 1,
                avgConfidence: 1
            }
        },
        { $sort: { count: -1 } }
    ];

    return await this.aggregate(pipeline);
};

// Static method to get sentiment trend
sentimentAnalysisSchema.statics.getSentimentTrend = async function (filters = {}) {
    const match = {};

    if (filters.startDate && filters.endDate) {
        match.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters.agentId) {
        match.agentId = new mongoose.Types.ObjectId(filters.agentId);
    }

    if (filters.productId) {
        match.productId = new mongoose.Types.ObjectId(filters.productId);
    }

    if (filters.department) {
        match.department = filters.department;
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: '$ticketId',
                scores: { $push: '$score' },
                sentiments: { $push: '$sentiment' },
                createdAt: { $push: '$createdAt' }
            }
        },
        {
            $project: {
                ticketId: '$_id',
                initialScore: { $arrayElemAt: ['$scores', 0] },
                finalScore: { $arrayElemAt: ['$scores', -1] },
                initialSentiment: { $arrayElemAt: ['$sentiments', 0] },
                finalSentiment: { $arrayElemAt: ['$sentiments', -1] },
                scoreChange: { $subtract: [{ $arrayElemAt: ['$scores', -1] }, { $arrayElemAt: ['$scores', 0] }] },
                improvement: { $cond: [{ $gt: [{ $arrayElemAt: ['$scores', -1] }, { $arrayElemAt: ['$scores', 0] }] }, true, false] },
                deterioration: { $cond: [{ $lt: [{ $arrayElemAt: ['$scores', -1] }, { $arrayElemAt: ['$scores', 0] }] }, true, false] },
                stable: { $cond: [{ $eq: [{ $arrayElemAt: ['$scores', -1] }, { $arrayElemAt: ['$scores', 0] }] }, true, false] }
            }
        },
        {
            $group: {
                _id: null,
                totalTickets: { $sum: 1 },
                improvedTickets: { $sum: { $cond: ['$improvement', 1, 0] } },
                deterioratedTickets: { $sum: { $cond: ['$deterioration', 1, 0] } },
                stableTickets: { $sum: { $cond: ['$stable', 1, 0] } },
                avgScoreChange: { $avg: '$scoreChange' },
                avgInitialScore: { $avg: '$initialScore' },
                avgFinalScore: { $avg: '$finalScore' }
            }
        }
    ];

    return await this.aggregate(pipeline);
};

module.exports = mongoose.model('SentimentAnalysis', sentimentAnalysisSchema);
