const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    category: {
        type: String,
        trim: true,
        maxlength: 50
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    templateData: {
        title: {
            type: String,
            required: true,
            maxlength: 200
        },
        description: {
            type: String,
            required: true
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent', 'critical'],
            default: 'medium'
        },
        category: String,
        tags: [String],
        checklist: [{
            title: {
                type: String,
                required: true
            },
            description: String,
            assignedRole: String // e.g., 'requester', 'agent', 'manager'
        }],
        attachments: [{
            name: String,
            type: String,
            required: Boolean,
            description: String
        }],
        customFields: [{
            name: String,
            type: {
                type: String,
                enum: ['text', 'number', 'date', 'select', 'multiselect', 'boolean']
            },
            required: Boolean,
            defaultValue: mongoose.Schema.Types.Mixed,
            options: [String] // for select/multiselect
        }],
        autoAssignment: {
            enabled: Boolean,
            department: String,
            skillRequired: [String]
        }
    },
    placeholders: [{
        key: {
            type: String,
            required: true
        },
        description: String,
        defaultValue: String,
        validation: {
            type: String,
            enum: ['text', 'email', 'number', 'date']
        }
    }],
    aiEnhancement: {
        enabled: {
            type: Boolean,
            default: false
        },
        promptTemplate: String,
        autoTags: Boolean,
        sentimentAnalysis: Boolean
    },
    approvalWorkflow: {
        required: {
            type: Boolean,
            default: false
        },
        approvers: [{
            role: String,
            userId: mongoose.Schema.Types.ObjectId
        }],
        autoApprove: {
            enabled: Boolean,
            conditions: [{
                field: String,
                operator: String,
                value: mongoose.Schema.Types.Mixed
            }]
        }
    },
    metadata: {
        version: {
            type: Number,
            default: 1
        },
        basedOn: mongoose.Schema.Types.ObjectId, // reference to another template
        tags: [String],
        estimatedResolutionTime: Number, // in hours
        successRate: Number // percentage of successful resolutions using this template
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
templateSchema.index({ name: 1 });
templateSchema.index({ category: 1 });
templateSchema.index({ isPublic: 1, isActive: 1 });
templateSchema.index({ createdBy: 1 });
templateSchema.index({ usageCount: -1 });
templateSchema.index({ 'templateData.tags': 1 });

// Virtual for full template info
templateSchema.virtual('fullInfo').get(function () {
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        category: this.category,
        usageCount: this.usageCount,
        createdAt: this.createdAt,
        templateData: this.templateData,
        placeholders: this.placeholders
    };
});

// Pre-save middleware to update version
templateSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.metadata.version += 1;
        this.lastModifiedBy = this._update?.$set?.lastModifiedBy || this.lastModifiedBy;
    }
    next();
});

// Static method to get popular templates
templateSchema.statics.getPopularTemplates = function (limit = 10, category = null) {
    const query = { isActive: true };

    if (category) {
        query.category = category;
    }

    return this.find(query)
        .sort({ usageCount: -1 })
        .limit(limit)
        .populate('createdBy', 'name email')
        .select('name description category usageCount templateData.priority');
};

// Static method to search templates
templateSchema.statics.searchTemplates = function (searchTerm, userId = null, limit = 20) {
    const query = {
        isActive: true,
        $or: [
            { name: new RegExp(searchTerm, 'i') },
            { description: new RegExp(searchTerm, 'i') },
            { category: new RegExp(searchTerm, 'i') },
            { 'templateData.tags': new RegExp(searchTerm, 'i') }
        ]
    };

    if (userId) {
        query.$or.push({ createdBy: userId });
    } else {
        query.isPublic = true;
    }

    return this.find(query)
        .limit(limit)
        .populate('createdBy', 'name email')
        .sort({ usageCount: -1, createdAt: -1 });
};

// Static method to get templates by category
templateSchema.statics.getTemplatesByCategory = function () {
    return this.aggregate([
        { $match: { isActive: true, isPublic: true } },
        {
            $group: {
                _id: '$category',
                templates: {
                    $push: {
                        id: '$_id',
                        name: '$name',
                        description: '$description',
                        usageCount: '$usageCount',
                        priority: '$templateData.priority'
                    }
                },
                totalUsage: { $sum: '$usageCount' },
                count: { $sum: 1 }
            }
        },
        { $sort: { totalUsage: -1 } }
    ]);
};

// Method to increment usage count
templateSchema.methods.incrementUsage = function () {
    this.usageCount += 1;
    return this.save();
};

// Method to create ticket from template
templateSchema.methods.createTicketFromTemplate = async function (data = {}, requester) {
    const Ticket = mongoose.model('Ticket');

    // Replace placeholders in template data
    const processedData = this.processPlaceholders(data);

    const ticketData = {
        title: processedData.title,
        description: processedData.description,
        priority: processedData.priority,
        category: processedData.category,
        tags: processedData.tags,
        requester: {
            userId: requester.userId,
            name: requester.name,
            email: requester.email
        },
        template: this._id
    };

    // Create checklist if defined
    if (processedData.checklist && processedData.checklist.length > 0) {
        ticketData.checklist = processedData.checklist.map(item => ({
            title: item.title,
            description: item.description,
            status: 'pending',
            assignedTo: this.resolveAssignee(item.assignedRole, requester)
        }));
    }

    const ticket = new Ticket(ticketData);
    await ticket.save();

    // Increment usage count
    await this.incrementUsage();

    return ticket;
};

// Helper method to process placeholders
templateSchema.methods.processPlaceholders = function (data) {
    let result = JSON.parse(JSON.stringify(this.templateData));

    // Replace placeholders in strings
    const replacePlaceholders = (str) => {
        if (typeof str !== 'string') return str;

        this.placeholders.forEach(placeholder => {
            const regex = new RegExp(`{{${placeholder.key}}}`, 'g');
            const value = data[placeholder.key] || placeholder.defaultValue || '';
            str = str.replace(regex, value);
        });

        return str;
    };

    // Recursively process object
    const processObject = (obj) => {
        if (typeof obj === 'string') {
            return replacePlaceholders(obj);
        } else if (Array.isArray(obj)) {
            return obj.map(processObject);
        } else if (obj && typeof obj === 'object') {
            const processed = {};
            for (const [key, value] of Object.entries(obj)) {
                processed[key] = processObject(value);
            }
            return processed;
        }
        return obj;
    };

    return processObject(result);
};

// Helper method to resolve assignees
templateSchema.methods.resolveAssignee = function (role, requester) {
    // This would integrate with user/role system
    // For now, return null or implement basic logic
    return null;
};

module.exports = mongoose.model('Template', templateSchema);