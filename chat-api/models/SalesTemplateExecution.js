const mongoose = require('mongoose');

const salesTemplateExecutionSchema = new mongoose.Schema({
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SalesTemplate',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'failed', 'paused', 'cancelled'],
        default: 'active'
    },

    // Contexto de execução
    context: {
        trigger: String,
        customerData: mongoose.Schema.Types.Mixed,
        erpData: mongoose.Schema.Types.Mixed,
        customData: mongoose.Schema.Types.Mixed
    },

    // Fluxo de execução
    currentStep: {
        componentId: String,
        position: Number
    },

    steps: [{
        componentId: String,
        componentType: String,
        executedAt: Date,
        status: {
            type: String,
            enum: ['pending', 'executing', 'completed', 'failed', 'skipped']
        },
        result: mongoose.Schema.Types.Mixed,
        error: String,
        nextStepDelay: Number // minutos até próximo passo
    }],

    // A/B Test
    variantId: String, // ID da variante usada no teste
    abTest: {
        testId: mongoose.Schema.Types.ObjectId,
        variant: String
    },

    // Canal de comunicação
    channel: {
        type: String,
        enum: ['whatsapp', 'email', 'sms', 'push'],
        required: true
    },

    // Métricas
    metrics: {
        sentAt: Date,
        deliveredAt: Date,
        openedAt: Date,
        clickedAt: Date,
        convertedAt: Date,
        revenue: Number,
        orderId: String
    },

    // Tentativas e retries
    attempts: [{
        attemptNumber: Number,
        executedAt: Date,
        status: String,
        error: String
    }],
    maxRetries: {
        type: Number,
        default: 3
    },

    // Agendamento
    scheduledFor: Date,
    executedAt: Date,
    completedAt: Date,

    // Logs
    logs: [{
        timestamp: Date,
        level: String,
        message: String,
        data: mongoose.Schema.Types.Mixed
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
salesTemplateExecutionSchema.index({ templateId: 1 });
salesTemplateExecutionSchema.index({ userId: 1 });
salesTemplateExecutionSchema.index({ status: 1 });
salesTemplateExecutionSchema.index({ channel: 1 });
salesTemplateExecutionSchema.index({ scheduledFor: 1 });
salesTemplateExecutionSchema.index({ 'metrics.convertedAt': 1 });
salesTemplateExecutionSchema.index({ createdAt: -1 });

// Virtual para duração da execução
salesTemplateExecutionSchema.virtual('duration').get(function () {
    if (this.completedAt && this.executedAt) {
        return this.completedAt - this.executedAt;
    }
    return null;
});

// Virtual para conversão
salesTemplateExecutionSchema.virtual('converted').get(function () {
    return !!this.metrics.convertedAt;
});

// Métodos estáticos
salesTemplateExecutionSchema.statics.getActiveExecutions = function (templateId = null) {
    const query = { status: { $in: ['active', 'paused'] } };
    if (templateId) query.templateId = templateId;

    return this.find(query).populate('templateId', 'name category');
};

salesTemplateExecutionSchema.statics.getConversionStats = function (templateId, startDate, endDate) {
    const match = {
        templateId,
        'metrics.convertedAt': { $exists: true }
    };

    if (startDate && endDate) {
        match.createdAt = { $gte: startDate, $lte: endDate };
    }

    return this.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalConversions: { $sum: 1 },
                totalRevenue: { $sum: '$metrics.revenue' },
                avgOrderValue: { $avg: '$metrics.revenue' },
                conversionTimes: {
                    $push: {
                        $divide: [
                            { $subtract: ['$metrics.convertedAt', '$executedAt'] },
                            1000 * 60 // em minutos
                        ]
                    }
                }
            }
        }
    ]);
};

// Métodos de instância
salesTemplateExecutionSchema.methods.log = function (level, message, data = {}) {
    this.logs.push({
        timestamp: new Date(),
        level,
        message,
        data
    });
};

salesTemplateExecutionSchema.methods.markAsCompleted = function (result = {}) {
    this.status = 'completed';
    this.completedAt = new Date();
    this.steps[this.steps.length - 1].status = 'completed';
    this.steps[this.steps.length - 1].result = result;

    this.log('info', 'Execution completed', result);
    return this.save();
};

salesTemplateExecutionSchema.methods.markAsFailed = function (error) {
    this.status = 'failed';
    this.completedAt = new Date();
    this.steps[this.steps.length - 1].status = 'failed';
    this.steps[this.steps.length - 1].error = error.message || error;

    this.log('error', 'Execution failed', { error: error.message || error });
    return this.save();
};

salesTemplateExecutionSchema.methods.recordMetric = function (metric, value) {
    if (!this.metrics) this.metrics = {};

    this.metrics[metric] = value;

    // Datas especiais
    if (metric === 'sentAt' || metric === 'deliveredAt' || metric === 'openedAt' ||
        metric === 'clickedAt' || metric === 'convertedAt') {
        this.metrics[metric] = new Date();
    }

    this.log('info', `Metric recorded: ${metric}`, { value });
    return this.save();
};

salesTemplateExecutionSchema.methods.retry = function () {
    if (this.attempts.length >= this.maxRetries) {
        throw new Error('Max retries exceeded');
    }

    const attemptNumber = this.attempts.length + 1;
    this.attempts.push({
        attemptNumber,
        executedAt: new Date(),
        status: 'retrying'
    });

    this.log('info', `Retry attempt ${attemptNumber}`);
    return this.save();
};

module.exports = mongoose.model('SalesTemplateExecution', salesTemplateExecutionSchema);