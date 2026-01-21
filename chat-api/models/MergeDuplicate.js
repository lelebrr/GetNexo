const mongoose = require('mongoose');

const mergeDuplicateSchema = new mongoose.Schema({
    operationType: {
        type: String,
        enum: ['merge', 'duplicate'],
        required: true
    },
    primaryTicket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    secondaryTickets: [{
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true
        },
        role: {
            type: String,
            enum: ['source', 'target'],
            required: true
        }
    }],
    performedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    mergeOptions: {
        transferComments: {
            type: Boolean,
            default: true
        },
        transferAttachments: {
            type: Boolean,
            default: true
        },
        transferHistory: {
            type: Boolean,
            default: true
        },
        transferSubTickets: {
            type: Boolean,
            default: false
        },
        transferReminders: {
            type: Boolean,
            default: true
        },
        updateStatus: {
            type: String,
            enum: ['keep_primary', 'use_newest', 'manual']
        },
        priorityResolution: {
            type: String,
            enum: ['keep_primary', 'use_highest', 'manual']
        }
    },
    duplicateOptions: {
        copyAttachments: {
            type: Boolean,
            default: true
        },
        copyChecklist: {
            type: Boolean,
            default: true
        },
        copySubTickets: {
            type: Boolean,
            default: false
        },
        linkToOriginal: {
            type: Boolean,
            default: true
        }
    },
    transferredData: {
        commentsCount: {
            type: Number,
            default: 0
        },
        attachmentsCount: {
            type: Number,
            default: 0
        },
        historyEntriesCount: {
            type: Number,
            default: 0
        },
        subTicketsCount: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['completed', 'failed', 'partial'],
        default: 'completed'
    },
    errorDetails: String,
    rollbackData: {
        primaryTicketState: mongoose.Schema.Types.Mixed,
        secondaryTicketsState: [mongoose.Schema.Types.Mixed]
    },
    notifications: {
        sent: {
            type: Boolean,
            default: false
        },
        recipients: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            email: String,
            notifiedAt: Date
        }]
    }
}, {
    timestamps: true
});

// Indexes
mergeDuplicateSchema.index({ primaryTicket: 1 });
mergeDuplicateSchema.index({ 'secondaryTickets.ticketId': 1 });
mergeDuplicateSchema.index({ 'performedBy.userId': 1 });
mergeDuplicateSchema.index({ operationType: 1 });
mergeDuplicateSchema.index({ createdAt: -1 });

// Pre-save validation
mergeDuplicateSchema.pre('save', function (next) {
    if (this.operationType === 'merge' && this.secondaryTickets.length === 0) {
        return next(new Error('Merge operation requires at least one secondary ticket'));
    }

    if (this.operationType === 'duplicate' && this.secondaryTickets.length !== 1) {
        return next(new Error('Duplicate operation requires exactly one secondary ticket'));
    }

    next();
});

// Static method to check if tickets can be merged
mergeDuplicateSchema.statics.canMergeTickets = async function (primaryId, secondaryIds) {
    const Ticket = mongoose.model('Ticket');

    // Check if all tickets exist
    const primaryTicket = await Ticket.findById(primaryId);
    if (!primaryTicket) {
        return { canMerge: false, reason: 'Primary ticket not found' };
    }

    const secondaryTickets = await Ticket.find({ _id: { $in: secondaryIds } });
    if (secondaryTickets.length !== secondaryIds.length) {
        return { canMerge: false, reason: 'One or more secondary tickets not found' };
    }

    // Check if any ticket is already merged
    const mergedTickets = [...secondaryTickets, primaryTicket].filter(t => t.mergedInto);
    if (mergedTickets.length > 0) {
        return { canMerge: false, reason: 'One or more tickets are already merged' };
    }

    // Check if trying to merge with itself
    if (secondaryIds.includes(primaryId.toString())) {
        return { canMerge: false, reason: 'Cannot merge ticket with itself' };
    }

    return { canMerge: true };
};

// Static method to get merge/duplicate history
mergeDuplicateSchema.statics.getOperationHistory = function (ticketId) {
    return this.find({
        $or: [
            { primaryTicket: ticketId },
            { 'secondaryTickets.ticketId': ticketId }
        ]
    })
        .populate('primaryTicket', 'title status')
        .populate('secondaryTickets.ticketId', 'title status')
        .populate('performedBy.userId', 'name email')
        .sort({ createdAt: -1 });
};

// Method to rollback operation
mergeDuplicateSchema.methods.rollback = async function (rollbackBy) {
    try {
        const Ticket = mongoose.model('Ticket');

        // Restore primary ticket state
        if (this.rollbackData.primaryTicketState) {
            await Ticket.findByIdAndUpdate(this.primaryTicket, this.rollbackData.primaryTicketState);
        }

        // Restore secondary tickets state
        if (this.rollbackData.secondaryTicketsState) {
            for (const ticketState of this.rollbackData.secondaryTicketsState) {
                await Ticket.findByIdAndUpdate(ticketState._id, ticketState);
            }
        }

        // Update operation status
        this.status = 'rolled_back';
        this.set('rolledBackBy', {
            userId: rollbackBy.userId,
            name: rollbackBy.name,
            rolledBackAt: new Date()
        });

        await this.save();
        return { success: true };

    } catch (error) {
        this.status = 'rollback_failed';
        this.set('rollbackError', error.message);
        await this.save();
        return { success: false, error: error.message };
    }
};

module.exports = mongoose.model('MergeDuplicate', mergeDuplicateSchema);