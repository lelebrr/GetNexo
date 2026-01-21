const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnail: {
        path: String,
        url: String
    },
    checksum: {
        type: String,
        required: true
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    uploadedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String
    },
    category: {
        type: String,
        enum: ['general', 'screenshot', 'log', 'document', 'image', 'video', 'audio', 'archive'],
        default: 'general'
    },
    tags: [String],
    description: String,
    isPublic: {
        type: Boolean,
        default: false
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    lastDownloaded: Date,
    digitalSignature: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DigitalSignature'
    },
    metadata: {
        dimensions: {
            width: Number,
            height: Number
        },
        duration: Number, // for video/audio
        pages: Number, // for PDFs
        encoding: String,
        compression: String
    },
    processing: {
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'completed'
        },
        error: String,
        startedAt: Date,
        completedAt: Date
    },
    retention: {
        deleteAfter: Date,
        autoDelete: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Indexes
attachmentSchema.index({ ticket: 1 });
attachmentSchema.index({ 'uploadedBy.userId': 1 });
attachmentSchema.index({ checksum: 1 });
attachmentSchema.index({ category: 1 });
attachmentSchema.index({ createdAt: -1 });
attachmentSchema.index({ 'retention.deleteAfter': 1 });

// Virtual for formatted size
attachmentSchema.virtual('formattedSize').get(function () {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.size;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
});

// Virtual for file extension
attachmentSchema.virtual('extension').get(function () {
    return this.filename.split('.').pop().toLowerCase();
});

// Virtual for is image
attachmentSchema.virtual('isImage').get(function () {
    return this.mimeType.startsWith('image/');
});

// Virtual for is video
attachmentSchema.virtual('isVideo').get(function () {
    return this.mimeType.startsWith('video/');
});

// Virtual for is document
attachmentSchema.virtual('isDocument').get(function () {
    const docTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument'];
    return docTypes.some(type => this.mimeType.includes(type)) ||
        ['txt', 'md', 'doc', 'docx', 'pdf'].includes(this.extension);
});

// Pre-save middleware to generate URL if not provided
attachmentSchema.pre('save', function (next) {
    if (!this.url && this.path) {
        this.url = `/api/attachments/${this._id}/download`;
    }

    if (this.thumbnail && this.thumbnail.path && !this.thumbnail.url) {
        this.thumbnail.url = `/api/attachments/${this._id}/thumbnail`;
    }

    next();
});

// Static method to get attachments by ticket
attachmentSchema.statics.getByTicket = function (ticketId, options = {}) {
    const query = { ticket: ticketId };

    if (options.category) {
        query.category = options.category;
    }

    if (options.isPublic !== undefined) {
        query.isPublic = options.isPublic;
    }

    return this.find(query)
        .populate('uploadedBy.userId', 'name email')
        .populate('digitalSignature')
        .sort({ createdAt: options.sort === 'asc' ? 1 : -1 })
        .limit(options.limit || 0);
};

// Static method to get storage usage by user
attachmentSchema.statics.getStorageUsage = function (userId, dateRange = {}) {
    const matchConditions = { 'uploadedBy.userId': userId };

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
                totalFiles: { $sum: 1 },
                totalSize: { $sum: '$size' },
                filesByCategory: {
                    $push: '$category'
                },
                filesByType: {
                    $push: '$mimeType'
                }
            }
        },
        {
            $project: {
                totalFiles: 1,
                totalSize: 1,
                averageFileSize: { $divide: ['$totalSize', '$totalFiles'] },
                categoryBreakdown: {
                    $arrayToObject: {
                        $map: {
                            input: { $setUnion: ['$filesByCategory'] },
                            as: 'category',
                            in: {
                                k: '$$category',
                                v: {
                                    $size: {
                                        $filter: {
                                            input: '$filesByCategory',
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

// Static method to find duplicates by checksum
attachmentSchema.statics.findDuplicates = function (checksum) {
    return this.find({ checksum })
        .populate('ticket', 'title')
        .populate('uploadedBy.userId', 'name email')
        .sort({ createdAt: -1 });
};

// Method to increment download count
attachmentSchema.methods.recordDownload = function () {
    this.downloadCount += 1;
    this.lastDownloaded = new Date();
    return this.save();
};

// Method to generate thumbnail (would integrate with image processing library)
attachmentSchema.methods.generateThumbnail = async function () {
    if (!this.isImage) return null;

    // Implementation would depend on image processing library (Sharp, etc.)
    // This is a placeholder
    this.thumbnail = {
        path: `${this.path}.thumb.jpg`,
        url: `${this.url}/thumbnail`
    };

    this.processing.status = 'completed';
    this.processing.completedAt = new Date();

    return this.save();
};

// Static method to cleanup old attachments
attachmentSchema.statics.cleanupOldAttachments = async function (daysOld = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const oldAttachments = await this.find({
        'retention.autoDelete': true,
        createdAt: { $lt: cutoffDate }
    });

    // In a real implementation, you would:
    // 1. Delete files from storage
    // 2. Remove database records
    // 3. Log the cleanup operation

    return {
        found: oldAttachments.length,
        deleted: 0, // Would be updated after actual deletion
        cutoffDate
    };
};

module.exports = mongoose.model('Attachment', attachmentSchema);