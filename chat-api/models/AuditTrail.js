const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
    entityType: {
        type: String,
        required: true,
        enum: ['ticket', 'user', 'attachment', 'template', 'automation', 'system']
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['create', 'update', 'delete', 'view', 'export', 'login', 'logout', 'transfer', 'merge', 'pause', 'resume']
    },
    performedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String,
        ipAddress: String,
        userAgent: String
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    changes: {
        before: mongoose.Schema.Types.Mixed,
        after: mongoose.Schema.Types.Mixed,
        fields: [String]
    },
    metadata: {
        sessionId: String,
        requestId: String,
        endpoint: String,
        method: String,
        duration: Number, // in milliseconds
        success: {
            type: Boolean,
            default: true
        },
        error: String
    },
    compliance: {
        gdpr: {
            dataProcessed: [String],
            purpose: String,
            legalBasis: String
        },
        lgpd: {
            sensitiveData: Boolean,
            consent: Boolean,
            retentionPeriod: Number
        }
    },
    security: {
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'low'
        },
        anomalies: [{
            type: String,
            detectedAt: Date,
            description: String
        }]
    }
}, {
    timestamps: false // We use custom timestamp field
});

// Indexes
auditTrailSchema.index({ entityType: 1, entityId: 1 });
auditTrailSchema.index({ 'performedBy.userId': 1 });
auditTrailSchema.index({ timestamp: -1 });
auditTrailSchema.index({ action: 1 });
auditTrailSchema.index({ 'security.riskLevel': 1 });
auditTrailSchema.index({ 'metadata.success': 1 });

// Virtual for formatted timestamp
auditTrailSchema.virtual('formattedTimestamp').get(function () {
    return this.timestamp.toISOString();
});

// Static method to log action
auditTrailSchema.statics.logAction = async function (data) {
    const auditEntry = new this({
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        performedBy: data.performedBy,
        changes: data.changes,
        metadata: data.metadata,
        compliance: data.compliance,
        security: data.security || { riskLevel: 'low' }
    });

    return auditEntry.save();
};

// Static method to get audit trail for entity
auditTrailSchema.statics.getEntityTrail = function (entityType, entityId, options = {}) {
    const query = { entityType, entityId };

    if (options.action) {
        query.action = options.action;
    }

    if (options.dateRange) {
        query.timestamp = {};
        if (options.dateRange.start) query.timestamp.$gte = options.dateRange.start;
        if (options.dateRange.end) query.timestamp.$lte = options.dateRange.end;
    }

    return this.find(query)
        .populate('performedBy.userId', 'name email')
        .sort({ timestamp: options.sort === 'asc' ? 1 : -1 })
        .limit(options.limit || 100);
};

// Static method to get user activity
auditTrailSchema.statics.getUserActivity = function (userId, dateRange = {}) {
    const matchConditions = { 'performedBy.userId': userId };

    if (dateRange.start) {
        matchConditions.timestamp = { $gte: dateRange.start };
    }
    if (dateRange.end) {
        matchConditions.timestamp = matchConditions.timestamp || {};
        matchConditions.timestamp.$lte = dateRange.end;
    }

    return this.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    action: '$action'
                },
                count: { $sum: 1 },
                entities: { $addToSet: { type: '$entityType', id: '$entityId' } }
            }
        },
        {
            $group: {
                _id: '$_id.date',
                actions: {
                    $push: {
                        action: '$_id.action',
                        count: '$count',
                        entities: '$entities'
                    }
                },
                totalActions: { $sum: '$count' }
            }
        },
        { $sort: { '_id': -1 } },
        { $limit: 30 }
    ]);
};

// Static method to detect anomalies
auditTrailSchema.statics.detectAnomalies = function (timeframe = 24 * 60 * 60 * 1000) { // 24 hours
    const startTime = new Date(Date.now() - timeframe);

    return this.aggregate([
        { $match: { timestamp: { $gte: startTime } } },
        {
            $group: {
                _id: {
                    userId: '$performedBy.userId',
                    action: '$action',
                    ip: '$performedBy.ipAddress'
                },
                count: { $sum: 1 },
                timestamps: { $push: '$timestamp' },
                entities: { $addToSet: '$entityId' }
            }
        },
        {
            $match: {
                count: { $gt: 100 } // More than 100 actions of same type from same IP
            }
        },
        {
            $project: {
                userId: '$_id.userId',
                action: '$_id.action',
                ipAddress: '$_id.ip',
                count: 1,
                timeSpan: {
                    $subtract: [
                        { $max: '$timestamps' },
                        { $min: '$timestamps' }
                    ]
                },
                uniqueEntities: { $size: '$entities' }
            }
        }
    ]);
};

// Static method to generate compliance report
auditTrailSchema.statics.generateComplianceReport = function (standard = 'lgpd', dateRange = {}) {
    const matchConditions = {};

    if (dateRange.start) {
        matchConditions.timestamp = { $gte: dateRange.start };
    }
    if (dateRange.end) {
        matchConditions.timestamp = matchConditions.timestamp || {};
        matchConditions.timestamp.$lte = dateRange.end;
    }

    const complianceField = standard === 'lgpd' ? 'compliance.lgpd' : 'compliance.gdpr';

    return this.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                entriesWithCompliance: {
                    $sum: { $cond: [{ $ne: [`$${complianceField}`, null] }, 1, 0] }
                },
                sensitiveDataAccess: {
                    $sum: { $cond: [`$${complianceField}.sensitiveData`, 1, 0] }
                },
                consentRequired: {
                    $sum: { $cond: [`$${complianceField}.consent`, 1, 0] }
                }
            }
        },
        {
            $project: {
                totalEntries: 1,
                complianceCoverage: {
                    $multiply: [
                        { $divide: ['$entriesWithCompliance', '$totalEntries'] },
                        100
                    ]
                },
                sensitiveDataAccess: 1,
                consentRequired: 1
            }
        }
    ]);
};

// Method to check if entry is within retention period
auditTrailSchema.methods.isWithinRetentionPeriod = function () {
    const retentionDays = this.compliance?.lgpd?.retentionPeriod || 2555; // 7 years default for LGPD
    const retentionDate = new Date(this.timestamp);
    retentionDate.setDate(retentionDate.getDate() + retentionDays);

    return new Date() < retentionDate;
};

// Static method to cleanup old entries
auditTrailSchema.statics.cleanupOldEntries = async function () {
    const entries = await this.find({});
    const toDelete = [];

    for (const entry of entries) {
        if (!entry.isWithinRetentionPeriod()) {
            toDelete.push(entry._id);
        }
    }

    if (toDelete.length > 0) {
        await this.deleteMany({ _id: { $in: toDelete } });
    }

    return { deleted: toDelete.length };
};

module.exports = mongoose.model('AuditTrail', auditTrailSchema);