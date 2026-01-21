const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'waiting', 'resolved', 'closed', 'cancelled', 'draft'],
        default: 'open'
    },
    isDraft: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent', 'critical'],
        default: 'medium'
    },
    category: {
        type: String,
        trim: true,
        maxlength: 100
    },
    tags: [{
        type: String,
        trim: true
    }],
    requester: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String,
        phone: String
    },
    assignee: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String
    },
    agentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AgentFolder'
    },
    parentTicket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    subTickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    sla: {
        initialResponseTime: {
            type: Number,
            default: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        },
        resolutionTime: {
            type: Number,
            default: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        },
        paused: {
            type: Boolean,
            default: false
        },
        pauseReason: String,
        pauseStartTime: Date,
        totalPausedTime: {
            type: Number,
            default: 0
        },
        breached: {
            type: Boolean,
            default: false
        },
        breachTime: Date
    },
    checklist: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        dueDate: Date,
        completedAt: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment'
    }],
    reminders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reminder'
    }],
    costTimer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CostTimer'
    },
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    },
    mergedInto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    duplicates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    automationRules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AutomationRule'
    }],
    aiAnalysis: {
        sentiment: {
            score: Number,
            sentiment: String,
            confidence: Number
        },
        suggestedTags: [String],
        prioritySuggestion: String,
        categorySuggestion: String,
        autoAssigned: Boolean
    },
    channel: {
        type: String,
        enum: ['whatsapp', 'facebook', 'email', 'chat', 'phone', 'other'],
        default: 'other'
    },
    resolvedByAI: {
        type: Boolean,
        default: false
    },
    salesValue: {
        type: Number,
        default: 0
    },
    agentClicks: {
        type: Number,
        default: 0
    },
    region: {
        type: String,
        trim: true,
        maxlength: 50
    },
    abandonedQueue: {
        type: Boolean,
        default: false
    },
    npsScore: {
        type: Number,
        min: 0,
        max: 10
    },
    firstResponseTime: {
        type: Number, // in milliseconds
        default: null
    },
    resolutionTime: {
        type: Number, // in milliseconds
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ 'requester.userId': 1 });
ticketSchema.index({ 'assignee.userId': 1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ tags: 1 });
ticketSchema.index({ category: 1 });
ticketSchema.index({ 'sla.breached': 1 });

// Virtual for SLA calculation
ticketSchema.virtual('sla.remainingTime').get(function () {
    if (this.sla.paused) return null;

    const now = new Date();
    const startTime = this.createdAt;
    const totalElapsed = now - startTime - this.sla.totalPausedTime;

    if (this.status === 'open' || this.status === 'in_progress') {
        return Math.max(0, this.sla.resolutionTime - totalElapsed);
    }

    return null;
});

// Virtual for SLA percentage
ticketSchema.virtual('sla.percentage').get(function () {
    if (this.sla.paused) return null;

    const now = new Date();
    const startTime = this.createdAt;
    const totalElapsed = now - startTime - this.sla.totalPausedTime;

    return Math.min(100, (totalElapsed / this.sla.resolutionTime) * 100);
});

// Pre-save middleware to update SLA status
ticketSchema.pre('save', function (next) {
    if (this.sla.remainingTime === 0 && !this.sla.breached) {
        this.sla.breached = true;
        this.sla.breachTime = new Date();
    }
    next();
});

module.exports = mongoose.model('Ticket', ticketSchema);