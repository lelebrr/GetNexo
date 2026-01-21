const mongoose = require('mongoose');
const crypto = require('crypto');

const digitalSignatureSchema = new mongoose.Schema({
    attachment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment',
        required: true
    },
    algorithm: {
        type: String,
        enum: ['SHA-256', 'SHA-512', 'MD5'],
        default: 'SHA-256'
    },
    hash: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    certificate: {
        issuer: String,
        subject: String,
        validFrom: Date,
        validTo: Date,
        serialNumber: String,
        fingerprint: String
    },
    signedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String,
        certificate: String
    },
    signedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    verifiedAt: Date,
    isValid: {
        type: Boolean,
        default: true
    },
    verificationDetails: {
        verifiedBy: {
            userId: mongoose.Schema.Types.ObjectId,
            name: String,
            verifiedAt: Date
        },
        method: {
            type: String,
            enum: ['automatic', 'manual', 'third_party'],
            default: 'automatic'
        },
        status: {
            type: String,
            enum: ['valid', 'invalid', 'expired', 'revoked', 'unknown'],
            default: 'valid'
        },
        error: String,
        metadata: mongoose.Schema.Types.Mixed
    },
    blockchain: {
        recorded: {
            type: Boolean,
            default: false
        },
        transactionId: String,
        blockNumber: Number,
        network: String,
        timestamp: Date
    },
    compliance: {
        standard: {
            type: String,
            enum: ['LGPD', 'GDPR', 'HIPAA', 'SOX', 'ISO27001'],
            required: true
        },
        requirements: [String],
        auditTrail: [{
            action: String,
            timestamp: Date,
            userId: mongoose.Schema.Types.ObjectId,
            details: String
        }]
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        location: {
            country: String,
            region: String,
            city: String
        },
        deviceFingerprint: String
    }
}, {
    timestamps: true
});

// Indexes
digitalSignatureSchema.index({ attachment: 1 }, { unique: true });
digitalSignatureSchema.index({ 'signedBy.userId': 1 });
digitalSignatureSchema.index({ isValid: 1 });
digitalSignatureSchema.index({ signedAt: -1 });
digitalSignatureSchema.index({ 'compliance.standard': 1 });

// Pre-save middleware to generate hash if not provided
digitalSignatureSchema.pre('save', async function (next) {
    if (!this.hash && this.attachment) {
        try {
            const Attachment = mongoose.model('Attachment');
            const attachment = await Attachment.findById(this.attachment);

            if (attachment && attachment.checksum) {
                this.hash = attachment.checksum;
            } else {
                // Generate hash from attachment data
                const hashData = `${this.attachment}_${this.signedBy.userId}_${this.signedAt}`;
                this.hash = crypto.createHash('sha256').update(hashData).digest('hex');
            }
        } catch (error) {
            console.error('Error generating signature hash:', error);
        }
    }

    if (!this.signature) {
        // Generate digital signature (simplified - in production use proper crypto libraries)
        const signData = `${this.hash}_${this.signedBy.userId}_${this.signedAt}`;
        this.signature = crypto.createHash('sha256').update(signData).digest('hex');
    }

    next();
});

// Method to verify signature
digitalSignatureSchema.methods.verify = async function () {
    try {
        // Simplified verification - in production use proper certificate validation
        const currentHash = crypto.createHash('sha256')
            .update(`${this.hash}_${this.signedBy.userId}_${this.signedAt}`)
            .digest('hex');

        const isValid = this.signature === currentHash;

        this.verificationDetails = {
            verifiedBy: {
                userId: this.signedBy.userId,
                name: this.signedBy.name,
                verifiedAt: new Date()
            },
            method: 'automatic',
            status: isValid ? 'valid' : 'invalid'
        };

        this.isValid = isValid;
        this.verifiedAt = new Date();

        await this.save();
        return isValid;

    } catch (error) {
        this.verificationDetails = {
            verifiedBy: {
                userId: this.signedBy.userId,
                name: this.signedBy.name,
                verifiedAt: new Date()
            },
            method: 'automatic',
            status: 'invalid',
            error: error.message
        };

        this.isValid = false;
        await this.save();
        return false;
    }
};

// Static method to get signatures for attachment
digitalSignatureSchema.statics.getByAttachment = function (attachmentId) {
    return this.find({ attachment: attachmentId })
        .populate('signedBy.userId', 'name email')
        .populate('verificationDetails.verifiedBy.userId', 'name email')
        .sort({ signedAt: -1 });
};

// Static method to get compliance report
digitalSignatureSchema.statics.getComplianceReport = function (standard, dateRange = {}) {
    const matchConditions = { 'compliance.standard': standard };

    if (dateRange.start) {
        matchConditions.signedAt = { $gte: dateRange.start };
    }
    if (dateRange.end) {
        matchConditions.signedAt = matchConditions.signedAt || {};
        matchConditions.signedAt.$lte = dateRange.end;
    }

    return this.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: null,
                totalSignatures: { $sum: 1 },
                validSignatures: {
                    $sum: { $cond: ['$isValid', 1, 0] }
                },
                invalidSignatures: {
                    $sum: { $cond: ['$isValid', 0, 1] }
                },
                signaturesByStatus: {
                    $push: '$verificationDetails.status'
                },
                averageVerificationTime: {
                    $avg: {
                        $subtract: ['$verifiedAt', '$signedAt']
                    }
                }
            }
        },
        {
            $project: {
                totalSignatures: 1,
                validSignatures: 1,
                invalidSignatures: 1,
                complianceRate: {
                    $multiply: [
                        { $divide: ['$validSignatures', '$totalSignatures'] },
                        100
                    ]
                },
                statusBreakdown: {
                    $arrayToObject: {
                        $map: {
                            input: { $setUnion: ['$signaturesByStatus'] },
                            as: 'status',
                            in: {
                                k: '$$status',
                                v: {
                                    $size: {
                                        $filter: {
                                            input: '$signaturesByStatus',
                                            as: 's',
                                            cond: { $eq: ['$$s', '$$status'] }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                averageVerificationTimeMs: '$averageVerificationTime'
            }
        }
    ]);
};

// Static method to revoke signature
digitalSignatureSchema.statics.revokeSignature = async function (signatureId, revokedBy, reason) {
    const signature = await this.findById(signatureId);
    if (!signature) {
        throw new Error('Signature not found');
    }

    signature.isValid = false;
    signature.verificationDetails = {
        ...signature.verificationDetails,
        status: 'revoked',
        verifiedBy: {
            userId: revokedBy.userId,
            name: revokedBy.name,
            verifiedAt: new Date()
        }
    };

    signature.compliance.auditTrail.push({
        action: 'revoked',
        timestamp: new Date(),
        userId: revokedBy.userId,
        details: reason
    });

    return signature.save();
};

// Method to record on blockchain (placeholder)
digitalSignatureSchema.methods.recordOnBlockchain = async function (network = 'ethereum') {
    // Placeholder for blockchain integration
    // In production, this would interact with blockchain APIs

    this.blockchain = {
        recorded: true,
        transactionId: `0x${crypto.randomBytes(32).toString('hex')}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000, // Random block number
        network: network,
        timestamp: new Date()
    };

    return this.save();
};

module.exports = mongoose.model('DigitalSignature', digitalSignatureSchema);