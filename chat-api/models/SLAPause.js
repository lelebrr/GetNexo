const mongoose = require('mongoose');

const slaPauseSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    pausedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String
    },
    pauseReason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    pauseCategory: {
        type: String,
        enum: ['awaiting_customer_response', 'awaiting_third_party', 'internal_review', 'resource_unavailable', 'holiday_weekend', 'other'],
        default: 'other'
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    endTime: Date,
    duration: {
        type: Number, // in milliseconds
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    autoResume: {
        enabled: {
            type: Boolean,
            default: false
        },
        conditions: {
            timeLimit: Number, // milliseconds
            statusChange: Boolean,
            newMessage: Boolean
        }
    },
    approval: {
        required: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String,
            approvedAt: Date
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved'
        }
    },
    notifications: {
        sent: {
            type: Boolean,
            default: false
        },
        sentTo: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            email: String,
            method: {
                type: String,
                enum: ['email', 'push', 'in_app'],
                default: 'in_app'
            },
            sentAt: Date
        }]
    },
    impact: {
        slaType: {
            type: String,
            enum: ['initial_response', 'resolution'],
            required: true
        },
        originalDeadline: Date,
        newDeadline: Date,
        extensionGranted: Number // milliseconds
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        location: String
    }
}, {
    timestamps: true
});

// Indexes
slaPauseSchema.index({ ticket: 1 });
slaPauseSchema.index({ 'pausedBy.userId': 1 });
slaPauseSchema.index({ isActive: 1 });
slaPauseSchema.index({ startTime: 1 });
slaPauseSchema.index({ endTime: 1 });
slaPauseSchema.index({ 'approval.status': 1 });

// Virtual for formatted duration
slaPauseSchema.virtual('formattedDuration').get(function () {
    const totalMinutes = Math.floor(this.duration / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
});

// Pre-save middleware to calculate duration
slaPauseSchema.pre('save', function (next) {
    if (this.endTime && this.startTime) {
        this.duration = this.endTime - this.startTime;
        this.isActive = false;
    } else if (!this.endTime) {
        this.isActive = true;
    }
    next();
});

// Static method to get active pauses
slaPauseSchema.statics.getActivePauses = function (ticketId = null) {
    const query = { isActive: true };
    if (ticketId) {
        query.ticket = ticketId;
    }
    return this.find(query).populate('ticket', 'title status');
};

// Static method to calculate total paused time for a ticket
slaPauseSchema.statics.getTotalPausedTime = async function (ticketId, slaType = null) {
    const query = { ticket: ticketId, isActive: false };
    if (slaType) {
        query['impact.slaType'] = slaType;
    }

    const pauses = await this.find(query);
    return pauses.reduce((total, pause) => total + pause.duration, 0);
};

// Static method to get pause statistics
slaPauseSchema.statics.getPauseStatistics = function (dateRange = {}) {
    const matchConditions = {};

    if (dateRange.start) {
        matchConditions.startTime = { $gte: dateRange.start };
    }
    if (dateRange.end) {
        matchConditions.startTime = matchConditions.startTime || {};
        matchConditions.startTime.$lte = dateRange.end;
    }

    return this.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: null,
                totalPauses: { $sum: 1 },
                activePauses: {
                    $sum: { $cond: ['$isActive', 1, 0] }
                },
                totalDuration: { $sum: '$duration' },
                avgDuration: { $avg: '$duration' },
                pausesByCategory: {
                    $push: '$pauseCategory'
                },
                pausesByReason: {
                    $push: '$pauseReason'
                }
            }
        },
        {
            $project: {
                totalPauses: 1,
                activePauses: 1,
                totalDuration: 1,
                avgDuration: 1,
                categoryBreakdown: {
                    $arrayToObject: {
                        $map: {
                            input: { $setUnion: ['$pausesByCategory'] },
                            as: 'category',
                            in: {
                                k: '$$category',
                                v: {
                                    $size: {
                                        $filter: {
                                            input: '$pausesByCategory',
                                            as: 'cat',
                                            cond: { $eq: ['$$cat', '$$category'] }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    ]);
};

// Method to resume pause
slaPauseSchema.methods.resume = function (resumedBy) {
    this.endTime = new Date();
    this.isActive = false;
    this.duration = this.endTime - this.startTime;

    if (resumedBy) {
        this.set('resumedBy', {
            userId: resumedBy.userId,
            name: resumedBy.name,
            resumedAt: new Date()
        });
    }

    return this.save();
};

module.exports = mongoose.model('SLAPause', slaPauseSchema);