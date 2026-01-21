const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200
    },
    category: {
        type: String,
        trim: true,
        maxlength: 50
    },
    color: {
        type: String,
        default: '#6c757d',
        validate: {
            validator: function (v) {
                return /^#[0-9A-F]{6}$/i.test(v);
            },
            message: 'Color must be a valid hex color code'
        }
    },
    icon: {
        type: String,
        trim: true,
        maxlength: 50
    },
    isSystem: {
        type: Boolean,
        default: false
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
        ref: 'User'
    },
    parentTag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    },
    childTags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    aiGenerated: {
        type: Boolean,
        default: false
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 1
    },
    metadata: {
        source: {
            type: String,
            enum: ['manual', 'ai_suggestion', 'import', 'template']
        },
        keywords: [String],
        synonyms: [String]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
tagSchema.index({ name: 1 });
tagSchema.index({ slug: 1 });
tagSchema.index({ category: 1 });
tagSchema.index({ isActive: 1 });
tagSchema.index({ usageCount: -1 });
tagSchema.index({ createdBy: 1 });

// Pre-save middleware to generate slug
tagSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    next();
});

// Virtual for full tag path
tagSchema.virtual('path').get(async function () {
    const path = [];
    let current = this;

    while (current) {
        path.unshift(current.name);
        if (current.parentTag) {
            current = await mongoose.model('Tag').findById(current.parentTag);
        } else {
            break;
        }
    }

    return path.join(' > ');
});

// Static method to get popular tags
tagSchema.statics.getPopularTags = function (limit = 20, category = null) {
    const query = { isActive: true };
    if (category) {
        query.category = category;
    }

    return this.find(query)
        .sort({ usageCount: -1 })
        .limit(limit)
        .select('name slug category color usageCount');
};

// Static method to search tags
tagSchema.statics.searchTags = function (searchTerm, limit = 10) {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
        isActive: true,
        $or: [
            { name: regex },
            { description: regex },
            { category: regex },
            { 'metadata.keywords': regex },
            { 'metadata.synonyms': regex }
        ]
    })
        .limit(limit)
        .select('name slug category color description usageCount');
};

// Static method to get tag hierarchy
tagSchema.statics.getTagHierarchy = async function () {
    const tags = await this.find({ isActive: true }).sort({ category: 1, name: 1 });

    const hierarchy = {};
    const tagMap = new Map();

    // Create tag map
    tags.forEach(tag => {
        tagMap.set(tag._id.toString(), {
            ...tag.toObject(),
            children: []
        });
    });

    // Build hierarchy
    tags.forEach(tag => {
        const tagObj = tagMap.get(tag._id.toString());

        if (tag.parentTag) {
            const parent = tagMap.get(tag.parentTag.toString());
            if (parent) {
                parent.children.push(tagObj);
            }
        } else {
            // Root level tag
            const category = tag.category || 'Uncategorized';
            if (!hierarchy[category]) {
                hierarchy[category] = [];
            }
            hierarchy[category].push(tagObj);
        }
    });

    return hierarchy;
};

// Method to increment usage count
tagSchema.methods.incrementUsage = function () {
    this.usageCount += 1;
    return this.save();
};

// Static method to bulk update usage counts
tagSchema.statics.updateUsageCounts = async function () {
    const Tag = this;

    // Get usage counts from tickets
    const usageStats = await mongoose.model('Ticket').aggregate([
        { $unwind: '$tags' },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 }
            }
        }
    ]);

    // Update tag usage counts
    const bulkOps = usageStats.map(stat => ({
        updateOne: {
            filter: { name: stat._id },
            update: { usageCount: stat.count }
        }
    }));

    if (bulkOps.length > 0) {
        await Tag.bulkWrite(bulkOps);
    }

    return usageStats.length;
};

module.exports = mongoose.model('Tag', tagSchema);