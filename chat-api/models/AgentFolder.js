const mongoose = require('mongoose');

const agentFolderSchema = new mongoose.Schema({
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: String,
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AgentFolder',
        default: null
    },
    color: {
        type: String,
        default: '#007bff',
        validate: {
            validator: function (v) {
                return /^#[0-9A-F]{6}$/i.test(v);
            },
            message: 'Color must be a valid hex color code'
        }
    },
    icon: {
        type: String,
        default: 'folder',
        enum: ['folder', 'folder-open', 'archive', 'inbox', 'star', 'flag', 'tag', 'bookmark']
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    isShared: {
        type: Boolean,
        default: false
    },
    sharedWith: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        permissions: {
            type: String,
            enum: ['read', 'write', 'admin'],
            default: 'read'
        }
    }],
    ticketCount: {
        type: Number,
        default: 0
    },
    unreadCount: {
        type: Number,
        default: 0
    },
    lastActivity: Date,
    sortOrder: {
        type: Number,
        default: 0
    },
    filters: {
        status: [String],
        priority: [String],
        category: [String],
        tags: [String],
        assignee: mongoose.Schema.Types.ObjectId,
        dateRange: {
            start: Date,
            end: Date
        }
    },
    autoAssignment: {
        enabled: {
            type: Boolean,
            default: false
        },
        rules: [{
            condition: {
                type: String,
                enum: ['status', 'priority', 'category', 'tags', 'requester', 'time_range']
            },
            operator: {
                type: String,
                enum: ['equals', 'contains', 'in', 'greater_than', 'less_than', 'between']
            },
            value: mongoose.Schema.Types.Mixed
        }]
    },
    notifications: {
        enabled: {
            type: Boolean,
            default: true
        },
        types: {
            newTickets: {
                type: Boolean,
                default: true
            },
            statusChanges: {
                type: Boolean,
                default: true
            },
            slaWarnings: {
                type: Boolean,
                default: true
            },
            mentions: {
                type: Boolean,
                default: true
            }
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
agentFolderSchema.index({ agentId: 1, parentFolder: 1 });
agentFolderSchema.index({ agentId: 1, name: 1 });
agentFolderSchema.index({ 'sharedWith.userId': 1 });
agentFolderSchema.index({ createdAt: -1 });

// Virtual for full path
agentFolderSchema.virtual('path').get(async function () {
    const path = [];
    let current = this;

    while (current) {
        path.unshift(current.name);
        if (current.parentFolder) {
            current = await mongoose.model('AgentFolder').findById(current.parentFolder);
        } else {
            break;
        }
    }

    return path.join(' / ');
});

// Virtual for subfolders
agentFolderSchema.virtual('subfolders', {
    ref: 'AgentFolder',
    localField: '_id',
    foreignField: 'parentFolder'
});

// Virtual for tickets in this folder
agentFolderSchema.virtual('tickets', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'agentFolder'
});

// Pre-save middleware to update counts
agentFolderSchema.pre('save', async function (next) {
    if (this.isModified('agentId') && !this.parentFolder) {
        // Ensure only one default folder per agent
        if (this.isDefault) {
            await mongoose.model('AgentFolder').updateMany(
                { agentId: this.agentId, isDefault: true, _id: { $ne: this._id } },
                { isDefault: false }
            );
        }
    }

    next();
});

// Static method to get folder tree
agentFolderSchema.statics.getFolderTree = async function (agentId) {
    const folders = await this.find({ agentId }).sort({ sortOrder: 1, createdAt: 1 });

    const folderMap = new Map();
    const rootFolders = [];

    // Create folder map
    folders.forEach(folder => {
        folderMap.set(folder._id.toString(), {
            ...folder.toObject(),
            subfolders: []
        });
    });

    // Build tree structure
    folders.forEach(folder => {
        const folderObj = folderMap.get(folder._id.toString());

        if (folder.parentFolder) {
            const parent = folderMap.get(folder.parentFolder.toString());
            if (parent) {
                parent.subfolders.push(folderObj);
            }
        } else {
            rootFolders.push(folderObj);
        }
    });

    return rootFolders;
};

// Static method to find suitable folder for ticket
agentFolderSchema.statics.findSuitableFolder = async function (agentId, ticketData) {
    const folders = await this.find({ agentId, 'autoAssignment.enabled': true });

    for (const folder of folders) {
        let matches = true;

        for (const rule of folder.autoAssignment.rules) {
            let fieldValue;
            let ruleValue = rule.value;

            switch (rule.condition) {
                case 'status':
                    fieldValue = ticketData.status;
                    break;
                case 'priority':
                    fieldValue = ticketData.priority;
                    break;
                case 'category':
                    fieldValue = ticketData.category;
                    break;
                case 'tags':
                    fieldValue = ticketData.tags || [];
                    break;
                case 'requester':
                    fieldValue = ticketData.requester?.email;
                    break;
                case 'time_range':
                    fieldValue = ticketData.createdAt;
                    break;
                default:
                    continue;
            }

            const matchResult = this.evaluateRule(fieldValue, rule.operator, ruleValue);
            if (!matchResult) {
                matches = false;
                break;
            }
        }

        if (matches) {
            return folder;
        }
    }

    return null;
};

// Helper method to evaluate auto-assignment rules
agentFolderSchema.statics.evaluateRule = function (fieldValue, operator, ruleValue) {
    switch (operator) {
        case 'equals':
            return fieldValue === ruleValue;
        case 'contains':
            if (Array.isArray(fieldValue)) {
                return fieldValue.includes(ruleValue);
            }
            return String(fieldValue).includes(String(ruleValue));
        case 'in':
            return Array.isArray(ruleValue) && ruleValue.includes(fieldValue);
        case 'greater_than':
            return fieldValue > ruleValue;
        case 'less_than':
            return fieldValue < ruleValue;
        case 'between':
            return Array.isArray(ruleValue) && ruleValue.length === 2 &&
                fieldValue >= ruleValue[0] && fieldValue <= ruleValue[1];
        default:
            return false;
    }
};

module.exports = mongoose.model('AgentFolder', agentFolderSchema);