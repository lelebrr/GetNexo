const mongoose = require('mongoose');

const seriesExecutionSchema = new mongoose.Schema({
    seriesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'cancelled', 'failed'],
        default: 'active'
    },
    currentMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    progress: {
        currentStep: {
            type: Number,
            default: 0
        },
        totalSteps: {
            type: Number,
            required: true
        },
        percentage: {
            type: Number,
            default: 0
        }
    },
    messages: [{
        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'sent', 'delivered', 'opened', 'clicked', 'responded', 'failed'],
            default: 'pending'
        },
        sentAt: Date,
        deliveredAt: Date,
        openedAt: Date,
        clickedAt: Date,
        respondedAt: Date,
        failedAt: Date,
        failureReason: String,
        abVariant: {
            type: String,
            enum: ['A', 'B', 'C', 'D']
        },
        response: mongoose.Schema.Types.Mixed, // User's response data
        metadata: mongoose.Schema.Types.Mixed
    }],
    variables: mongoose.Schema.Types.Mixed, // Dynamic variables for personalization
    schedule: {
        nextMessageAt: Date,
        pausedAt: Date,
        resumedAt: Date,
        completedAt: Date,
        cancelledAt: Date,
        failedAt: Date
    },
    conditions: mongoose.Schema.Types.Mixed, // Stored conditions for flow control
    abTest: {
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ABTest'
        },
        variant: {
            type: String,
            enum: ['A', 'B', 'C', 'D']
        }
    },
    analytics: {
        totalMessages: {
            type: Number,
            default: 0
        },
        sentMessages: {
            type: Number,
            default: 0
        },
        deliveredMessages: {
            type: Number,
            default: 0
        },
        openedMessages: {
            type: Number,
            default: 0
        },
        clickedMessages: {
            type: Number,
            default: 0
        },
        respondedMessages: {
            type: Number,
            default: 0
        },
        converted: {
            type: Boolean,
            default: false
        },
        conversionValue: {
            type: Number,
            default: 0
        },
        timeToConvert: Number // in milliseconds
    },
    retry: {
        attempts: {
            type: Number,
            default: 0
        },
        maxRetries: {
            type: Number,
            default: 3
        },
        lastRetryAt: Date,
        nextRetryAt: Date
    },
    n8nExecutionId: String, // If triggered via n8n workflow
    webhookData: mongoose.Schema.Types.Mixed, // Data from webhook triggers
    tags: [String], // Additional tags for filtering
    metadata: mongoose.Schema.Types.Mixed
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
seriesExecutionSchema.index({ seriesId: 1, userId: 1 }, { unique: true });
seriesExecutionSchema.index({ status: 1 });
seriesExecutionSchema.index({ userId: 1 });
seriesExecutionSchema.index({ 'schedule.nextMessageAt': 1 });
seriesExecutionSchema.index({ 'analytics.converted': 1 });
seriesExecutionSchema.index({ createdAt: -1 });

// Compound indexes for performance
seriesExecutionSchema.index({ seriesId: 1, status: 1 });
seriesExecutionSchema.index({ userId: 1, status: 1 });

// Virtual for time elapsed
seriesExecutionSchema.virtual('timeElapsed').get(function () {
    if (!this.createdAt) return 0;
    const now = this.completedAt || this.cancelledAt || this.failedAt || new Date();
    return now - this.createdAt;
});

// Virtual for engagement rate
seriesExecutionSchema.virtual('engagementRate').get(function () {
    if (this.analytics.totalMessages === 0) return 0;
    return ((this.analytics.openedMessages + this.analytics.clickedMessages + this.analytics.respondedMessages) / this.analytics.totalMessages) * 100;
});

// Pre-save middleware to update progress
seriesExecutionSchema.pre('save', function (next) {
    if (this.progress.totalSteps > 0) {
        this.progress.percentage = (this.progress.currentStep / this.progress.totalSteps) * 100;
    }

    // Update analytics counts
    this.analytics.totalMessages = this.messages.length;
    this.analytics.sentMessages = this.messages.filter(m => m.status !== 'pending' && m.status !== 'failed').length;
    this.analytics.deliveredMessages = this.messages.filter(m => ['delivered', 'opened', 'clicked', 'responded'].includes(m.status)).length;
    this.analytics.openedMessages = this.messages.filter(m => ['opened', 'clicked', 'responded'].includes(m.status)).length;
    this.analytics.clickedMessages = this.messages.filter(m => ['clicked', 'responded'].includes(m.status)).length;
    this.analytics.respondedMessages = this.messages.filter(m => m.status === 'responded').length;

    next();
});

// Method to check if execution should proceed to next message
seriesExecutionSchema.methods.shouldProceed = function () {
    return this.status === 'active' && this.progress.currentStep < this.progress.totalSteps;
};

// Method to get next message
seriesExecutionSchema.methods.getNextMessage = function () {
    if (!this.shouldProceed()) return null;

    const nextStep = this.progress.currentStep + 1;
    // This would need to be implemented with logic to find the appropriate message based on conditions
    return nextStep;
};

// Method to pause execution
seriesExecutionSchema.methods.pause = function (reason) {
    this.status = 'paused';
    this.schedule.pausedAt = new Date();
    this.metadata = this.metadata || {};
    this.metadata.pauseReason = reason;
};

// Method to resume execution
seriesExecutionSchema.methods.resume = function () {
    if (this.status === 'paused') {
        this.status = 'active';
        this.schedule.resumedAt = new Date();
        // Recalculate next message time if needed
    }
};

// Method to cancel execution
seriesExecutionSchema.methods.cancel = function (reason) {
    this.status = 'cancelled';
    this.schedule.cancelledAt = new Date();
    this.metadata = this.metadata || {};
    this.metadata.cancelReason = reason;
};

// Method to mark as converted
seriesExecutionSchema.methods.markConverted = function (value = 0) {
    this.analytics.converted = true;
    this.analytics.conversionValue = value;
    this.analytics.timeToConvert = Date.now() - this.createdAt;
};

module.exports = mongoose.model('SeriesExecution', seriesExecutionSchema);