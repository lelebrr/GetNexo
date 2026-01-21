const mongoose = require('mongoose');

const subTicketSchema = new mongoose.Schema({
    parentTicket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
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
        enum: ['open', 'in_progress', 'waiting', 'resolved', 'closed', 'cancelled'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent', 'critical'],
        default: 'medium'
    },
    assignedTo: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String
    },
    dependencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTicket'
    }],
    dependentOn: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTicket'
    }],
    estimatedHours: {
        type: Number,
        min: 0
    },
    actualHours: {
        type: Number,
        min: 0,
        default: 0
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    dueDate: Date,
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment'
    }],
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
        completedAt: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        author: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: String
        },
        content: {
            type: String,
            required: true
        },
        isInternal: {
            type: Boolean,
            default: false
        },
        attachments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attachment'
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    order: {
        type: Number,
        default: 0
    },
    tags: [String],
    category: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
subTicketSchema.index({ parentTicket: 1 });
subTicketSchema.index({ status: 1 });
subTicketSchema.index({ 'assignedTo.userId': 1 });
subTicketSchema.index({ dueDate: 1 });
subTicketSchema.index({ createdAt: -1 });

// Virtual for completion status based on checklist
subTicketSchema.virtual('completionPercentage').get(function () {
    if (this.checklist.length === 0) return this.progress;

    const completedItems = this.checklist.filter(item => item.status === 'completed').length;
    return Math.round((completedItems / this.checklist.length) * 100);
});

// Virtual for isOverdue
subTicketSchema.virtual('isOverdue').get(function () {
    return this.dueDate && new Date() > this.dueDate && this.status !== 'closed' && this.status !== 'resolved';
});

// Pre-save middleware to update parent ticket progress
subTicketSchema.pre('save', async function (next) {
    if (this.isModified('progress') || this.isModified('status')) {
        try {
            const SubTicket = mongoose.model('SubTicket');
            const parentTicket = await mongoose.model('Ticket').findById(this.parentTicket);

            if (parentTicket) {
                // Calculate total progress of all sub-tickets
                const allSubTickets = await SubTicket.find({ parentTicket: this.parentTicket });
                const totalProgress = allSubTickets.reduce((sum, st) => sum + st.progress, 0);
                const averageProgress = allSubTickets.length > 0 ? Math.round(totalProgress / allSubTickets.length) : 0;

                // Update parent ticket with aggregated data
                parentTicket.set('progress', averageProgress);

                // If all sub-tickets are completed, mark parent as resolved
                const allCompleted = allSubTickets.every(st => st.status === 'closed' || st.status === 'resolved');
                if (allCompleted && allSubTickets.length > 0) {
                    parentTicket.set('status', 'resolved');
                }

                await parentTicket.save();
            }
        } catch (error) {
            console.error('Error updating parent ticket progress:', error);
        }
    }

    next();
});

module.exports = mongoose.model('SubTicket', subTicketSchema);