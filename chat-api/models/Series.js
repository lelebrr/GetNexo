const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'draft'
    },
    trigger: {
        type: {
            type: String,
            enum: ['manual', 'event', 'schedule', 'webhook'],
            required: true
        },
        event: String, // e.g., 'user_registered', 'product_viewed'
        condition: mongoose.Schema.Types.Mixed // Flexible condition object
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    channels: [{
        type: String,
        enum: ['email', 'whatsapp', 'sms', 'push'],
        required: true
    }],
    targetAudience: {
        tags: [String],
        segments: [String],
        userIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    schedule: {
        startDate: Date,
        endDate: Date,
        timezone: {
            type: String,
            default: 'America/Sao_Paulo'
        }
    },
    abTest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ABTest'
    },
    analytics: {
        totalSent: {
            type: Number,
            default: 0
        },
        totalDelivered: {
            type: Number,
            default: 0
        },
        totalOpened: {
            type: Number,
            default: 0
        },
        totalClicked: {
            type: Number,
            default: 0
        },
        totalConverted: {
            type: Number,
            default: 0
        },
        conversionRate: {
            type: Number,
            default: 0
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    n8nWorkflowId: String, // ID do workflow n8n associado
    settings: {
        maxRetries: {
            type: Number,
            default: 3
        },
        retryDelay: {
            type: Number,
            default: 3600000 // 1 hour in ms
        },
        allowPause: {
            type: Boolean,
            default: true
        },
        trackAnalytics: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
seriesSchema.index({ status: 1 });
seriesSchema.index({ 'trigger.type': 1 });
seriesSchema.index({ createdBy: 1 });
seriesSchema.index({ createdAt: -1 });

// Virtual for active executions count
seriesSchema.virtual('activeExecutions', {
    ref: 'SeriesExecution',
    localField: '_id',
    foreignField: 'seriesId',
    count: true,
    match: { status: { $in: ['active', 'paused'] } }
});

// Pre-save middleware to calculate conversion rate
seriesSchema.pre('save', function (next) {
    if (this.analytics.totalSent > 0) {
        this.analytics.conversionRate = (this.analytics.totalConverted / this.analytics.totalSent) * 100;
    }
    next();
});

module.exports = mongoose.model('Series', seriesSchema);