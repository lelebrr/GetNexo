const mongoose = require('mongoose');

const costTimerSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    agent: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String,
        hourlyRate: {
            type: Number,
            min: 0,
            default: 0
        },
        currency: {
            type: String,
            default: 'BRL'
        }
    },
    sessions: [{
        startTime: {
            type: Date,
            required: true
        },
        endTime: Date,
        duration: {
            type: Number, // in milliseconds
            default: 0
        },
        isActive: {
            type: Boolean,
            default: false
        },
        description: String,
        category: {
            type: String,
            enum: ['analysis', 'development', 'testing', 'documentation', 'meeting', 'support', 'other'],
            default: 'support'
        },
        billable: {
            type: Boolean,
            default: true
        },
        tags: [String]
    }],
    totalTime: {
        type: Number, // in milliseconds
        default: 0
    },
    billableTime: {
        type: Number, // in milliseconds
        default: 0
    },
    totalCost: {
        type: Number,
        min: 0,
        default: 0
    },
    currency: {
        type: String,
        default: 'BRL'
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'cancelled'],
        default: 'active'
    },
    budget: {
        allocated: Number,
        used: {
            type: Number,
            default: 0
        },
        remaining: Number,
        alertThreshold: {
            type: Number,
            min: 0,
            max: 100,
            default: 80
        }
    },
    approval: {
        required: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            userId: mongoose.Schema.Types.ObjectId,
            name: String,
            approvedAt: Date
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    reporting: {
        lastReported: Date,
        reportFrequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'on_completion'],
            default: 'weekly'
        },
        recipients: [{
            userId: mongoose.Schema.Types.ObjectId,
            email: String,
            name: String
        }]
    }
}, {
    timestamps: true
});

// Indexes
costTimerSchema.index({ ticket: 1 });
costTimerSchema.index({ 'agent.userId': 1 });
costTimerSchema.index({ status: 1 });
costTimerSchema.index({ createdAt: -1 });

// Virtual for current session
costTimerSchema.virtual('currentSession').get(function () {
    return this.sessions.find(session => session.isActive);
});

// Virtual for formatted total time
costTimerSchema.virtual('formattedTotalTime').get(function () {
    const totalMinutes = Math.floor(this.totalTime / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
});

// Virtual for budget status
costTimerSchema.virtual('budgetStatus').get(function () {
    if (!this.budget.allocated) return 'no_budget';

    const percentage = (this.budget.used / this.budget.allocated) * 100;

    if (percentage >= 100) return 'exceeded';
    if (percentage >= this.budget.alertThreshold) return 'warning';
    return 'normal';
});

// Pre-save middleware to calculate totals
costTimerSchema.pre('save', function (next) {
    // Calculate total time and billable time
    this.totalTime = this.sessions.reduce((total, session) => total + session.duration, 0);
    this.billableTime = this.sessions
        .filter(session => session.billable)
        .reduce((total, session) => total + session.duration, 0);

    // Calculate cost
    const hourlyRate = this.agent.hourlyRate || 0;
    const billableHours = this.billableTime / (1000 * 60 * 60); // Convert to hours
    this.totalCost = billableHours * hourlyRate;

    // Update budget
    if (this.budget) {
        this.budget.used = this.totalCost;
        this.budget.remaining = Math.max(0, (this.budget.allocated || 0) - this.totalCost);
    }

    next();
});

// Method to start timer
costTimerSchema.methods.startTimer = function (description = '', category = 'support') {
    // Stop any active session
    this.stopTimer();

    const newSession = {
        startTime: new Date(),
        isActive: true,
        description,
        category,
        billable: true
    };

    this.sessions.push(newSession);
    return this.save();
};

// Method to stop timer
costTimerSchema.methods.stopTimer = function () {
    const activeSession = this.sessions.find(session => session.isActive);
    if (activeSession) {
        activeSession.endTime = new Date();
        activeSession.duration = activeSession.endTime - activeSession.startTime;
        activeSession.isActive = false;
    }
    return this.save();
};

// Method to pause timer
costTimerSchema.methods.pauseTimer = function () {
    const activeSession = this.sessions.find(session => session.isActive);
    if (activeSession) {
        activeSession.endTime = new Date();
        activeSession.duration = activeSession.endTime - activeSession.startTime;
        activeSession.isActive = false;
    }
    return this.save();
};

// Method to add manual time entry
costTimerSchema.methods.addManualTime = function (duration, description = '', category = 'support', billable = true) {
    const manualSession = {
        startTime: new Date(),
        endTime: new Date(),
        duration: duration * 60 * 1000, // Convert minutes to milliseconds
        isActive: false,
        description,
        category,
        billable
    };

    this.sessions.push(manualSession);
    return this.save();
};

// Static method to get active timers
costTimerSchema.statics.getActiveTimers = function (userId = null) {
    const query = { status: 'active', 'sessions.isActive': true };

    if (userId) {
        query['agent.userId'] = userId;
    }

    return this.find(query)
        .populate('ticket', 'title status')
        .populate('agent.userId', 'name email');
};

// Static method to generate cost report
costTimerSchema.statics.generateCostReport = function (dateRange = {}, userId = null) {
    const matchConditions = {};

    if (userId) {
        matchConditions['agent.userId'] = userId;
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
                _id: {
                    agentId: '$agent.userId',
                    currency: '$currency'
                },
                totalTime: { $sum: '$totalTime' },
                billableTime: { $sum: '$billableTime' },
                totalCost: { $sum: '$totalCost' },
                ticketsCount: { $sum: 1 },
                agents: { $first: '$agent' }
            }
        },
        {
            $project: {
                agentId: '$_id.agentId',
                agentName: '$agents.name',
                currency: '$_id.currency',
                totalTime,
                billableTime,
                totalCost,
                ticketsCount,
                averageCostPerTicket: { $divide: ['$totalCost', '$ticketsCount'] },
                averageTimePerTicket: { $divide: ['$totalTime', '$ticketsCount'] }
            }
        },
        { $sort: { totalCost: -1 } }
    ]);
};

// Method to complete timer
costTimerSchema.methods.complete = function () {
    this.stopTimer();
    this.status = 'completed';
    return this.save();
};

// Method to cancel timer
costTimerSchema.methods.cancel = function () {
    this.stopTimer();
    this.status = 'cancelled';
    return this.save();
};

module.exports = mongoose.model('CostTimer', costTimerSchema);