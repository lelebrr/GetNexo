const mongoose = require('mongoose');

const ticketTransferSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    fromAgent: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String
    },
    toAgent: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String
    },
    transferReason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    transferType: {
        type: String,
        enum: ['manual', 'auto_assignment', 'escalation', 'workload_balance'],
        default: 'manual'
    },
    requestedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String
    },
    approvedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        approvedAt: Date
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'completed'
    },
    rejectionReason: String,
    transferNotes: String,
    metadata: {
        previousPriority: String,
        newPriority: String,
        slaImpact: {
            type: String,
            enum: ['none', 'positive', 'negative']
        },
        workloadBefore: Number,
        workloadAfter: Number
    },
    notifications: {
        fromAgentNotified: {
            type: Boolean,
            default: false
        },
        toAgentNotified: {
            type: Boolean,
            default: false
        },
        requesterNotified: {
            type: Boolean,
            default: false
        },
        notificationMethod: {
            type: String,
            enum: ['email', 'push', 'in_app'],
            default: 'in_app'
        }
    }
}, {
    timestamps: true
});

// Indexes
ticketTransferSchema.index({ ticket: 1 });
ticketTransferSchema.index({ 'fromAgent.userId': 1 });
ticketTransferSchema.index({ 'toAgent.userId': 1 });
ticketTransferSchema.index({ status: 1 });
ticketTransferSchema.index({ createdAt: -1 });
ticketTransferSchema.index({ transferType: 1 });

// Pre-save middleware for approval workflow
ticketTransferSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'approved' && !this.approvedBy.approvedAt) {
        this.approvedBy.approvedAt = new Date();
    }
    next();
});

// Static method to get transfer history for a ticket
ticketTransferSchema.statics.getTransferHistory = function (ticketId) {
    return this.find({ ticket: ticketId })
        .populate('fromAgent.userId', 'name email')
        .populate('toAgent.userId', 'name email')
        .populate('requestedBy.userId', 'name email')
        .populate('approvedBy.userId', 'name email')
        .sort({ createdAt: -1 });
};

// Static method to get agent transfer statistics
ticketTransferSchema.statics.getAgentTransferStats = function (agentId, dateRange = {}) {
    const matchConditions = {
        $or: [
            { 'fromAgent.userId': agentId },
            { 'toAgent.userId': agentId }
        ],
        status: 'completed'
    };

    if (dateRange.start) {
        matchConditions.createdAt = { $gte: dateRange.start };
    }
    if (dateRange.end) {
        matchConditions.createdAt = matchConditions.createdAt || {};
        matchConditions.createdAt.$lte = dateRange.end;
    }

    return this.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: null,
                totalTransfers: { $sum: 1 },
                transfersFrom: {
                    $sum: {
                        $cond: [
                            { $eq: ['$fromAgent.userId', mongoose.Types.ObjectId(agentId)] },
                            1, 0
                        ]
                    }
                },
                transfersTo: {
                    $sum: {
                        $cond: [
                            { $eq: ['$toAgent.userId', mongoose.Types.ObjectId(agentId)] },
                            1, 0
                        ]
                    }
                },
                avgTransferTime: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } }
            }
        }
    ]);
};

module.exports = mongoose.model('TicketTransfer', ticketTransferSchema);