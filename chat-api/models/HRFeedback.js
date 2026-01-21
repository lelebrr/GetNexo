const mongoose = require('mongoose');

const hRFeedbackSchema = new mongoose.Schema({
    agent: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String,
        department: String,
        role: String
    },
    evaluator: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String,
        department: String,
        role: String
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    evaluationPeriod: {
        start: Date,
        end: Date,
        type: {
            type: String,
            enum: ['monthly', 'quarterly', 'annual', 'project', 'ad_hoc'],
            default: 'monthly'
        }
    },
    ratings: {
        overall: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        responseTime: {
            type: Number,
            min: 1,
            max: 5
        },
        resolutionQuality: {
            type: Number,
            min: 1,
            max: 5
        },
        communication: {
            type: Number,
            min: 1,
            max: 5
        },
        technicalSkills: {
            type: Number,
            min: 1,
            max: 5
        },
        customerService: {
            type: Number,
            min: 1,
            max: 5
        },
        teamwork: {
            type: Number,
            min: 1,
            max: 5
        },
        initiative: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    categories: [{
        name: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        weight: {
            type: Number,
            min: 0,
            max: 1,
            default: 1
        },
        comments: String
    }],
    comments: {
        strengths: String,
        improvements: String,
        goals: String,
        general: String
    },
    recommendations: {
        promotion: {
            recommended: Boolean,
            level: String,
            justification: String
        },
        training: [{
            topic: String,
            priority: {
                type: String,
                enum: ['low', 'medium', 'high']
            },
            reason: String
        }],
        disciplinary: {
            required: Boolean,
            type: String,
            description: String
        }
    },
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment'
    }],
    status: {
        type: String,
        enum: ['draft', 'submitted', 'reviewed', 'acknowledged', 'disputed'],
        default: 'draft'
    },
    review: {
        reviewedBy: {
            userId: mongoose.Schema.Types.ObjectId,
            name: String,
            reviewedAt: Date
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        comments: String
    },
    acknowledgment: {
        acknowledgedBy: {
            userId: mongoose.Schema.Types.ObjectId,
            name: String,
            acknowledgedAt: Date
        },
        comments: String
    },
    dispute: {
        disputedBy: {
            userId: mongoose.Schema.Types.ObjectId,
            name: String,
            disputedAt: Date
        },
        reason: String,
        resolution: String,
        resolvedBy: {
            userId: mongoose.Schema.Types.ObjectId,
            name: String,
            resolvedAt: Date
        }
    },
    metadata: {
        isAnonymous: {
            type: Boolean,
            default: false
        },
        isSelfEvaluation: {
            type: Boolean,
            default: false
        },
        source: {
            type: String,
            enum: ['manual', 'automated', 'peer_review', 'customer_feedback'],
            default: 'manual'
        }
    }
}, {
    timestamps: true
});

// Indexes
hRFeedbackSchema.index({ 'agent.userId': 1 });
hRFeedbackSchema.index({ 'evaluator.userId': 1 });
hRFeedbackSchema.index({ ticket: 1 });
hRFeedbackSchema.index({ status: 1 });
hRFeedbackSchema.index({ 'evaluationPeriod.start': 1, 'evaluationPeriod.end': 1 });
hRFeedbackSchema.index({ createdAt: -1 });

// Virtual for weighted average rating
hRFeedbackSchema.virtual('weightedAverageRating').get(function () {
    if (!this.categories || this.categories.length === 0) {
        return this.ratings.overall || 0;
    }

    let totalWeight = 0;
    let weightedSum = 0;

    this.categories.forEach(category => {
        const weight = category.weight || 1;
        const rating = category.rating || 0;
        weightedSum += rating * weight;
        totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
});

// Virtual for performance level
hRFeedbackSchema.virtual('performanceLevel').get(function () {
    const avgRating = this.weightedAverageRating;

    if (avgRating >= 4.5) return 'exceptional';
    if (avgRating >= 4.0) return 'exceeds_expectations';
    if (avgRating >= 3.5) return 'meets_expectations';
    if (avgRating >= 3.0) return 'below_expectations';
    return 'needs_improvement';
});

// Pre-save middleware to calculate overall rating if not provided
hRFeedbackSchema.pre('save', function (next) {
    if (!this.ratings.overall && this.categories && this.categories.length > 0) {
        this.ratings.overall = this.weightedAverageRating;
    }
    next();
});

// Static method to get feedback by agent
hRFeedbackSchema.statics.getByAgent = function (agentId, options = {}) {
    const query = { 'agent.userId': agentId };

    if (options.status) {
        query.status = options.status;
    }

    if (options.period) {
        query['evaluationPeriod.type'] = options.period;
    }

    return this.find(query)
        .populate('evaluator.userId', 'name email')
        .populate('ticket', 'title status')
        .sort({ createdAt: options.sort === 'asc' ? 1 : -1 })
        .limit(options.limit || 50);
};

// Static method to get performance summary
hRFeedbackSchema.statics.getPerformanceSummary = function (agentId, dateRange = {}) {
    const matchConditions = { 'agent.userId': agentId, status: { $ne: 'draft' } };

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
                totalEvaluations: { $sum: 1 },
                averageOverall: { $avg: '$ratings.overall' },
                averageResponseTime: { $avg: '$ratings.responseTime' },
                averageResolutionQuality: { $avg: '$ratings.resolutionQuality' },
                averageCommunication: { $avg: '$ratings.communication' },
                latestEvaluation: { $max: '$createdAt' },
                evaluationsByPeriod: {
                    $push: {
                        period: '$evaluationPeriod',
                        rating: '$ratings.overall',
                        date: '$createdAt'
                    }
                }
            }
        }
    ]);
};

// Static method to get team performance
hRFeedbackSchema.statics.getTeamPerformance = function (teamIds = [], dateRange = {}) {
    const matchConditions = {
        'agent.userId': { $in: teamIds },
        status: { $ne: 'draft' }
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
                _id: '$agent.userId',
                agentName: { $first: '$agent.name' },
                totalEvaluations: { $sum: 1 },
                averageRating: { $avg: '$ratings.overall' },
                lastEvaluation: { $max: '$createdAt' },
                evaluations: {
                    $push: {
                        rating: '$ratings.overall',
                        date: '$createdAt',
                        evaluator: '$evaluator.name'
                    }
                }
            }
        },
        { $sort: { averageRating: -1 } }
    ]);
};

// Method to submit feedback
hRFeedbackSchema.methods.submit = function () {
    this.status = 'submitted';
    return this.save();
};

// Method to acknowledge feedback
hRFeedbackSchema.methods.acknowledge = function (agentId, comments = '') {
    this.acknowledgment = {
        acknowledgedBy: {
            userId: agentId,
            name: '', // Would be populated from user data
            acknowledgedAt: new Date()
        },
        comments
    };
    this.status = 'acknowledged';
    return this.save();
};

// Method to dispute feedback
hRFeedbackSchema.methods.dispute = function (agentId, reason) {
    this.dispute = {
        disputedBy: {
            userId: agentId,
            name: '', // Would be populated from user data
            disputedAt: new Date()
        },
        reason
    };
    this.status = 'disputed';
    return this.save();
};

// Method to resolve dispute
hRFeedbackSchema.methods.resolveDispute = function (resolverId, resolution) {
    if (this.dispute) {
        this.dispute.resolution = resolution;
        this.dispute.resolvedBy = {
            userId: resolverId,
            name: '', // Would be populated from user data
            resolvedAt: new Date()
        };
        this.status = 'reviewed';
    }
    return this.save();
};

module.exports = mongoose.model('HRFeedback', hRFeedbackSchema);