const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    seriesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    order: {
        type: Number,
        required: true,
        min: 1
    },
    channel: {
        type: String,
        enum: ['email', 'whatsapp', 'sms', 'push'],
        required: true
    },
    content: {
        subject: String, // For email
        body: {
            type: String,
            required: true
        },
        template: String, // Template name or ID
        variables: mongoose.Schema.Types.Mixed // Dynamic variables
    },
    delay: {
        type: {
            type: String,
            enum: ['fixed', 'conditional'],
            default: 'fixed'
        },
        value: {
            type: Number,
            required: true,
            min: 0 // in milliseconds
        },
        unit: {
            type: String,
            enum: ['milliseconds', 'seconds', 'minutes', 'hours', 'days'],
            default: 'hours'
        },
        condition: mongoose.Schema.Types.Mixed // For conditional delays
    },
    conditions: [{
        field: String, // e.g., 'response', 'action', 'time'
        operator: {
            type: String,
            enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'after', 'before']
        },
        value: mongoose.Schema.Types.Mixed,
        logic: {
            type: String,
            enum: ['and', 'or'],
            default: 'and'
        }
    }],
    abVariant: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        default: 'A'
    },
    actions: [{
        type: {
            type: String,
            enum: ['send_message', 'update_user', 'trigger_workflow', 'pause_series', 'end_series']
        },
        config: mongoose.Schema.Types.Mixed
    }],
    analytics: {
        sent: {
            type: Number,
            default: 0
        },
        delivered: {
            type: Number,
            default: 0
        },
        opened: {
            type: Number,
            default: 0
        },
        clicked: {
            type: Number,
            default: 0
        },
        responded: {
            type: Number,
            default: 0
        },
        converted: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    metadata: mongoose.Schema.Types.Mixed // Additional data
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
messageSchema.index({ seriesId: 1, order: 1 });
messageSchema.index({ seriesId: 1, channel: 1 });
messageSchema.index({ abVariant: 1 });
messageSchema.index({ status: 1 });

// Compound index for efficient queries
messageSchema.index({ seriesId: 1, order: 1, status: 1 });

// Virtual for conversion rate
messageSchema.virtual('conversionRate').get(function () {
    return this.analytics.sent > 0 ? (this.analytics.converted / this.analytics.sent) * 100 : 0;
});

// Virtual for open rate
messageSchema.virtual('openRate').get(function () {
    return this.analytics.sent > 0 ? (this.analytics.opened / this.analytics.sent) * 100 : 0;
});

// Virtual for click rate
messageSchema.virtual('clickRate').get(function () {
    return this.analytics.sent > 0 ? (this.analytics.clicked / this.analytics.sent) * 100 : 0;
});

// Pre-save to ensure order uniqueness within series
messageSchema.pre('save', async function (next) {
    if (this.isNew) {
        const Message = mongoose.model('Message');
        const maxOrder = await Message.find({ seriesId: this.seriesId }).sort({ order: -1 }).limit(1);
        if (maxOrder.length === 0) {
            this.order = 1;
        } else if (!this.order) {
            this.order = maxOrder[0].order + 1;
        }
    }
    next();
});

module.exports = mongoose.model('Message', messageSchema);