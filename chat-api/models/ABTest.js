const mongoose = require('mongoose');

const abTestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true
    },
    seriesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'paused'],
        default: 'draft'
    },
    testType: {
        type: String,
        enum: ['message_content', 'timing', 'channel', 'subject_line'],
        required: true
    },
    variants: [{
        variant: {
            type: String,
            enum: ['A', 'B', 'C', 'D'],
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: String,
        weight: {
            type: Number,
            default: 25,
            min: 1,
            max: 100
        },
        config: mongoose.Schema.Types.Mixed, // Variant-specific configuration
        sampleSize: {
            type: Number,
            default: 0
        },
        conversions: {
            type: Number,
            default: 0
        },
        conversionRate: {
            type: Number,
            default: 0
        },
        confidence: {
            type: Number,
            default: 0
        }
    }],
    targetMetric: {
        type: String,
        enum: ['open_rate', 'click_rate', 'conversion_rate', 'response_rate'],
        required: true
    },
    significanceLevel: {
        type: Number,
        default: 0.05,
        min: 0.01,
        max: 0.1
    },
    minimumSampleSize: {
        type: Number,
        default: 100,
        min: 50
    },
    schedule: {
        startDate: Date,
        endDate: Date,
        duration: {
            type: Number, // in days
            default: 7
        }
    },
    winner: {
        variant: String,
        determinedAt: Date,
        confidence: Number,
        improvement: Number // percentage improvement over baseline
    },
    analytics: {
        totalParticipants: {
            type: Number,
            default: 0
        },
        completedParticipants: {
            type: Number,
            default: 0
        },
        bestVariant: String,
        bestConversionRate: {
            type: Number,
            default: 0
        },
        statisticalSignificance: {
            type: Boolean,
            default: false
        }
    },
    settings: {
        autoDeclareWinner: {
            type: Boolean,
            default: true
        },
        winnerThreshold: {
            type: Number,
            default: 0.95 // 95% confidence
        },
        allowEarlyStop: {
            type: Boolean,
            default: false
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [String],
    metadata: mongoose.Schema.Types.Mixed
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
abTestSchema.index({ seriesId: 1 });
abTestSchema.index({ status: 1 });
abTestSchema.index({ createdBy: 1 });
abTestSchema.index({ 'schedule.startDate': 1 });
abTestSchema.index({ 'schedule.endDate': 1 });

// Virtual for test duration
abTestSchema.virtual('duration').get(function () {
    if (this.schedule.startDate && this.schedule.endDate) {
        return Math.ceil((this.schedule.endDate - this.schedule.startDate) / (1000 * 60 * 60 * 24));
    }
    return this.schedule.duration;
});

// Virtual for progress percentage
abTestSchema.virtual('progress').get(function () {
    if (this.analytics.totalParticipants === 0) return 0;
    return (this.analytics.completedParticipants / this.analytics.totalParticipants) * 100;
});

// Method to assign variant to user
abTestSchema.methods.assignVariant = function (userId) {
    const totalWeight = this.variants.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;

    for (const variant of this.variants) {
        random -= variant.weight;
        if (random <= 0) {
            // Check if this variant is still available for this user
            // (implementation would check existing assignments)
            return variant.variant;
        }
    }

    // Fallback to first variant
    return this.variants[0].variant;
};

// Method to record conversion
abTestSchema.methods.recordConversion = function (variant, converted = true) {
    const variantData = this.variants.find(v => v.variant === variant);
    if (!variantData) return;

    variantData.sampleSize += 1;
    if (converted) {
        variantData.conversions += 1;
    }

    variantData.conversionRate = (variantData.conversions / variantData.sampleSize) * 100;

    this.analytics.totalParticipants += 1;
    if (variantData.sampleSize >= this.minimumSampleSize) {
        this.analytics.completedParticipants += 1;
    }

    // Update best variant
    this.updateBestVariant();
};

// Method to update best variant
abTestSchema.methods.updateBestVariant = function () {
    let bestVariant = null;
    let bestRate = 0;

    for (const variant of this.variants) {
        if (variant.sampleSize >= this.minimumSampleSize && variant.conversionRate > bestRate) {
            bestRate = variant.conversionRate;
            bestVariant = variant.variant;
        }
    }

    this.analytics.bestVariant = bestVariant;
    this.analytics.bestConversionRate = bestRate;

    // Check for statistical significance
    this.checkStatisticalSignificance();
};

// Method to check statistical significance
abTestSchema.methods.checkStatisticalSignificance = function () {
    if (this.variants.length < 2) return;

    const variants = this.variants.filter(v => v.sampleSize >= this.minimumSampleSize);
    if (variants.length < 2) return;

    // Simple significance check (in practice, you'd use proper statistical tests)
    const rates = variants.map(v => v.conversionRate);
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);

    const difference = maxRate - minRate;
    const avgRate = rates.reduce((sum, r) => sum + r, 0) / rates.length;

    // Rough significance check
    if (avgRate > 0 && difference / avgRate > 0.1) { // 10% relative difference
        this.analytics.statisticalSignificance = true;

        if (this.settings.autoDeclareWinner) {
            this.declareWinner();
        }
    }
};

// Method to declare winner
abTestSchema.methods.declareWinner = function () {
    if (!this.analytics.bestVariant) return;

    const bestVariant = this.variants.find(v => v.variant === this.analytics.bestVariant);
    if (!bestVariant) return;

    this.winner = {
        variant: this.analytics.bestVariant,
        determinedAt: new Date(),
        confidence: this.analytics.statisticalSignificance ? 0.95 : 0.8,
        improvement: bestVariant.conversionRate // Could calculate vs baseline
    };

    this.status = 'completed';
};

// Method to get variant distribution
abTestSchema.methods.getVariantDistribution = function () {
    const total = this.variants.reduce((sum, v) => sum + v.sampleSize, 0);
    return this.variants.map(v => ({
        variant: v.variant,
        name: v.name,
        sampleSize: v.sampleSize,
        percentage: total > 0 ? (v.sampleSize / total) * 100 : 0,
        conversionRate: v.conversionRate,
        conversions: v.conversions
    }));
};

// Pre-save to normalize weights
abTestSchema.pre('save', function (next) {
    if (this.variants.length > 0) {
        const totalWeight = this.variants.reduce((sum, v) => sum + v.weight, 0);
        if (totalWeight !== 100) {
            // Normalize weights to sum to 100
            this.variants.forEach(v => {
                v.weight = Math.round((v.weight / totalWeight) * 100);
            });
        }
    }
    next();
});

module.exports = mongoose.model('ABTest', abTestSchema);