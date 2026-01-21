const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    ticket: {
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
        trim: true,
        maxlength: 1000
    },
    reminderDate: {
        type: Date,
        required: true,
        index: true
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrencePattern: {
        type: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom']
        },
        interval: {
            type: Number,
            min: 1,
            default: 1
        },
        daysOfWeek: [Number], // 0-6 for Sunday-Saturday
        daysOfMonth: [Number], // 1-31
        endDate: Date,
        maxOccurrences: Number
    },
    assignedTo: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String
    },
    createdBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['active', 'triggered', 'completed', 'cancelled', 'snoozed'],
        default: 'active'
    },
    notifications: {
        email: {
            type: Boolean,
            default: true
        },
        push: {
            type: Boolean,
            default: true
        },
        inApp: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        }
    },
    triggerHistory: [{
        triggeredAt: Date,
        method: {
            type: String,
            enum: ['email', 'push', 'in_app', 'sms']
        },
        success: {
            type: Boolean,
            default: true
        },
        error: String,
        recipient: String
    }],
    snoozeHistory: [{
        snoozedAt: Date,
        snoozeDuration: Number, // in minutes
        reason: String
    }],
    completedAt: Date,
    cancelledAt: Date,
    metadata: {
        source: {
            type: String,
            enum: ['manual', 'sla_warning', 'follow_up', 'escalation', 'auto_generated']
        },
        category: String,
        tags: [String]
    }
}, {
    timestamps: true
});

// Indexes
reminderSchema.index({ ticket: 1 });
reminderSchema.index({ 'assignedTo.userId': 1 });
reminderSchema.index({ status: 1 });
reminderSchema.index({ reminderDate: 1 });
reminderSchema.index({ createdAt: -1 });

// Virtual for isOverdue
reminderSchema.virtual('isOverdue').get(function () {
    return this.status === 'active' && new Date() > this.reminderDate;
});

// Virtual for nextOccurrence (for recurring reminders)
reminderSchema.virtual('nextOccurrence').get(function () {
    if (!this.isRecurring || this.status !== 'active') return null;

    let nextDate = new Date(this.reminderDate);

    switch (this.recurrencePattern.type) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + this.recurrencePattern.interval);
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + (7 * this.recurrencePattern.interval));
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + this.recurrencePattern.interval);
            break;
        case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + this.recurrencePattern.interval);
            break;
    }

    return nextDate;
});

// Pre-save middleware to handle recurrence
reminderSchema.pre('save', function (next) {
    if (this.isRecurring && this.status === 'triggered' && this.nextOccurrence) {
        // Create next occurrence
        const nextReminder = new mongoose.model('Reminder')({
            ...this.toObject(),
            _id: undefined,
            reminderDate: this.nextOccurrence,
            status: 'active',
            triggerHistory: [],
            snoozeHistory: [],
            createdAt: undefined,
            updatedAt: undefined
        });

        // Save next reminder (async, don't wait)
        nextReminder.save().catch(err => console.error('Error creating recurring reminder:', err));
    }

    next();
});

// Static method to get active reminders
reminderSchema.statics.getActiveReminders = function (dateRange = {}) {
    const query = { status: 'active' };

    if (dateRange.start) {
        query.reminderDate = { $gte: dateRange.start };
    }
    if (dateRange.end) {
        query.reminderDate = query.reminderDate || {};
        query.reminderDate.$lte = dateRange.end;
    }

    return this.find(query)
        .populate('ticket', 'title status priority')
        .populate('assignedTo.userId', 'name email')
        .sort({ reminderDate: 1 });
};

// Static method to get overdue reminders
reminderSchema.statics.getOverdueReminders = function () {
    return this.find({
        status: 'active',
        reminderDate: { $lt: new Date() }
    })
        .populate('ticket', 'title status priority')
        .populate('assignedTo.userId', 'name email')
        .sort({ reminderDate: 1 });
};

// Static method to trigger reminders
reminderSchema.statics.triggerPendingReminders = async function () {
    const now = new Date();
    const reminders = await this.find({
        status: 'active',
        reminderDate: { $lte: now }
    }).populate('assignedTo.userId').populate('ticket');

    const triggered = [];

    for (const reminder of reminders) {
        try {
            await reminder.trigger();
            triggered.push(reminder);
        } catch (error) {
            console.error(`Failed to trigger reminder ${reminder._id}:`, error);
        }
    }

    return triggered;
};

// Method to trigger reminder
reminderSchema.methods.trigger = async function () {
    // Record trigger
    this.triggerHistory.push({
        triggeredAt: new Date(),
        method: 'in_app', // Default method
        success: true
    });

    this.status = 'triggered';
    await this.save();

    // Here you would integrate with notification services
    // For now, just log the trigger
    console.log(`Reminder triggered: ${this.title} for ticket ${this.ticket}`);

    return this;
};

// Method to snooze reminder
reminderSchema.methods.snooze = function (durationMinutes, reason = '') {
    const snoozeDuration = durationMinutes * 60 * 1000; // Convert to milliseconds
    this.reminderDate = new Date(Date.now() + snoozeDuration);

    this.snoozeHistory.push({
        snoozedAt: new Date(),
        snoozeDuration: durationMinutes,
        reason
    });

    return this.save();
};

// Method to complete reminder
reminderSchema.methods.complete = function () {
    this.status = 'completed';
    this.completedAt = new Date();
    return this.save();
};

// Method to cancel reminder
reminderSchema.methods.cancel = function () {
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    return this.save();
};

// Static method to get reminder statistics
reminderSchema.statics.getReminderStatistics = function (userId, dateRange = {}) {
    const matchConditions = {};

    if (userId) {
        matchConditions.$or = [
            { 'assignedTo.userId': userId },
            { 'createdBy.userId': userId }
        ];
    }

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
                totalReminders: { $sum: 1 },
                activeReminders: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                },
                completedReminders: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                overdueReminders: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$status', 'active'] },
                                    { $lt: ['$reminderDate', new Date()] }
                                ]
                            },
                            1, 0
                        ]
                    }
                },
                recurringReminders: {
                    $sum: { $cond: ['$isRecurring', 1, 0] }
                }
            }
        }
    ]);
};

module.exports = mongoose.model('Reminder', reminderSchema);