const mongoose = require('mongoose');

const partsInventorySchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    part: {
        partNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: String,
        category: {
            type: String,
            trim: true
        },
        manufacturer: String,
        model: String,
        specifications: mongoose.Schema.Types.Mixed
    },
    quantity: {
        requested: {
            type: Number,
            required: true,
            min: 1
        },
        allocated: {
            type: Number,
            default: 0,
            min: 0
        },
        delivered: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    status: {
        type: String,
        enum: ['requested', 'approved', 'allocated', 'delivered', 'returned', 'cancelled'],
        default: 'requested'
    },
    cost: {
        unitCost: {
            type: Number,
            min: 0
        },
        totalCost: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'BRL'
        }
    },
    timeline: {
        requestedAt: {
            type: Date,
            default: Date.now
        },
        approvedAt: Date,
        allocatedAt: Date,
        deliveredAt: Date,
        returnedAt: Date
    },
    requestedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
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
    allocatedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        allocatedAt: Date
    },
    deliveredBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        deliveredAt: Date
    },
    supplier: {
        name: String,
        contact: String,
        email: String,
        phone: String,
        address: String
    },
    location: {
        warehouse: String,
        aisle: String,
        shelf: String,
        bin: String
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'critical'],
        default: 'normal'
    },
    notes: [{
        content: String,
        createdBy: {
            userId: mongoose.Schema.Types.ObjectId,
            name: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment'
    }],
    erpIntegration: {
        erpId: String,
        lastSync: Date,
        syncStatus: {
            type: String,
            enum: ['pending', 'synced', 'failed'],
            default: 'pending'
        },
        syncError: String
    }
}, {
    timestamps: true
});

// Indexes
partsInventorySchema.index({ ticket: 1 });
partsInventorySchema.index({ 'part.partNumber': 1 });
partsInventorySchema.index({ status: 1 });
partsInventorySchema.index({ priority: 1 });
partsInventorySchema.index({ 'timeline.requestedAt': -1 });
partsInventorySchema.index({ 'erpIntegration.erpId': 1 });

// Virtual for isCompleted
partsInventorySchema.virtual('isCompleted').get(function () {
    return ['delivered', 'returned', 'cancelled'].includes(this.status);
});

// Virtual for remaining quantity
partsInventorySchema.virtual('remainingQuantity').get(function () {
    return this.quantity.requested - this.quantity.delivered;
});

// Pre-save middleware to calculate total cost
partsInventorySchema.pre('save', function (next) {
    if (this.cost.unitCost && this.quantity.delivered) {
        this.cost.totalCost = this.cost.unitCost * this.quantity.delivered;
    }
    next();
});

// Static method to get inventory by ticket
partsInventorySchema.statics.getByTicket = function (ticketId) {
    return this.find({ ticket: ticketId })
        .populate('requestedBy.userId', 'name email')
        .populate('approvedBy.userId', 'name email')
        .sort({ 'timeline.requestedAt': -1 });
};

// Static method to get low stock alerts
partsInventorySchema.statics.getLowStockAlerts = function (threshold = 10) {
    // This would integrate with actual inventory system
    // For now, return empty array
    return Promise.resolve([]);
};

// Static method to get pending requests
partsInventorySchema.statics.getPendingRequests = function () {
    return this.find({
        status: { $in: ['requested', 'approved', 'allocated'] }
    })
        .populate('ticket', 'title priority')
        .populate('requestedBy.userId', 'name email')
        .sort({ priority: -1, 'timeline.requestedAt': 1 });
};

// Method to approve request
partsInventorySchema.methods.approve = function (approvedBy) {
    this.status = 'approved';
    this.approvedBy = {
        userId: approvedBy.userId,
        name: approvedBy.name,
        email: approvedBy.email,
        approvedAt: new Date()
    };
    this.timeline.approvedAt = new Date();

    return this.save();
};

// Method to allocate parts
partsInventorySchema.methods.allocate = function (allocatedBy, quantity, location = {}) {
    this.status = 'allocated';
    this.quantity.allocated = quantity;
    this.allocatedBy = {
        userId: allocatedBy.userId,
        name: allocatedBy.name,
        email: allocatedBy.email,
        allocatedAt: new Date()
    };
    this.timeline.allocatedAt = new Date();

    if (location) {
        this.location = { ...this.location, ...location };
    }

    return this.save();
};

// Method to deliver parts
partsInventorySchema.methods.deliver = function (deliveredBy, quantity) {
    this.status = 'delivered';
    this.quantity.delivered = quantity;
    this.deliveredBy = {
        userId: deliveredBy.userId,
        name: deliveredBy.name,
        email: deliveredBy.email,
        deliveredAt: new Date()
    };
    this.timeline.deliveredAt = new Date();

    return this.save();
};

// Method to return parts
partsInventorySchema.methods.returnParts = function (returnedBy, reason = '') {
    this.status = 'returned';
    this.returnedBy = {
        userId: returnedBy.userId,
        name: returnedBy.name,
        email: returnedBy.email,
        returnedAt: new Date()
    };
    this.timeline.returnedAt = new Date();

    this.notes.push({
        content: `Peças retornadas: ${reason}`,
        createdBy: {
            userId: returnedBy.userId,
            name: returnedBy.name
        },
        createdAt: new Date()
    });

    return this.save();
};

// Method to cancel request
partsInventorySchema.methods.cancel = function (cancelledBy, reason = '') {
    this.status = 'cancelled';
    this.cancelledBy = {
        userId: cancelledBy.userId,
        name: cancelledBy.name,
        email: cancelledBy.email,
        cancelledAt: new Date()
    };

    this.notes.push({
        content: `Solicitação cancelada: ${reason}`,
        createdBy: {
            userId: cancelledBy.userId,
            name: cancelledBy.name
        },
        createdAt: new Date()
    });

    return this.save();
};

// Static method to generate inventory report
partsInventorySchema.statics.generateInventoryReport = function (dateRange = {}) {
    const matchConditions = {};

    if (dateRange.start) {
        matchConditions['timeline.requestedAt'] = { $gte: dateRange.start };
    }
    if (dateRange.end) {
        matchConditions['timeline.requestedAt'] = matchConditions['timeline.requestedAt'] || {};
        matchConditions['timeline.requestedAt'].$lte = dateRange.end;
    }

    return this.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: {
                    category: '$part.category',
                    status: '$status'
                },
                count: { $sum: 1 },
                totalRequested: { $sum: '$quantity.requested' },
                totalDelivered: { $sum: '$quantity.delivered' },
                totalCost: { $sum: '$cost.totalCost' }
            }
        },
        {
            $group: {
                _id: '$_id.category',
                statuses: {
                    $push: {
                        status: '$_id.status',
                        count: '$count',
                        totalRequested: '$totalRequested',
                        totalDelivered: '$totalDelivered',
                        totalCost: '$totalCost'
                    }
                },
                totalItems: { $sum: '$count' },
                totalRequested: { $sum: '$totalRequested' },
                totalDelivered: { $sum: '$totalDelivered' },
                totalCost: { $sum: '$totalCost' }
            }
        },
        { $sort: { totalItems: -1 } }
    ]);
};

module.exports = mongoose.model('PartsInventory', partsInventorySchema);