const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema({
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
    trigger: {
        type: {
            type: String,
            enum: ['ticket_created', 'ticket_updated', 'status_changed', 'priority_changed', 'sla_breached', 'time_based', 'condition_met'],
            required: true
        },
        conditions: [{
            field: {
                type: String,
                required: true,
                enum: ['status', 'priority', 'category', 'tags', 'requester', 'assignee', 'title', 'description', 'created_at', 'updated_at']
            },
            operator: {
                type: String,
                required: true,
                enum: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'greater_than', 'less_than', 'between', 'in', 'not_in']
            },
            value: mongoose.Schema.Types.Mixed,
            caseSensitive: {
                type: Boolean,
                default: false
            }
        }],
        schedule: {
            frequency: {
                type: String,
                enum: ['once', 'hourly', 'daily', 'weekly', 'monthly']
            },
            time: String, // HH:MM format
            daysOfWeek: [Number], // 0-6 for Sunday-Saturday
            daysOfMonth: [Number] // 1-31
        }
    },
    actions: [{
        type: {
            type: String,
            required: true,
            enum: ['assign_agent', 'change_status', 'change_priority', 'add_tags', 'remove_tags', 'set_category', 'send_notification', 'create_reminder', 'escalate', 'close_ticket', 'update_sla', 'add_checklist_item', 'send_email', 'webhook', 'run_script']
        },
        config: {
            agentId: mongoose.Schema.Types.ObjectId,
            status: String,
            priority: String,
            tags: [String],
            category: String,
            notification: {
                type: {
                    type: String,
                    enum: ['email', 'push', 'sms', 'in_app']
                },
                recipient: {
                    type: String,
                    enum: ['assignee', 'requester', 'supervisor', 'team', 'custom']
                },
                customRecipients: [String],
                template: String,
                subject: String,
                message: String
            },
            reminder: {
                title: String,
                description: String,
                dueDate: Date,
                assignedTo: mongoose.Schema.Types.ObjectId
            },
            checklist: {
                title: String,
                description: String,
                assignedTo: mongoose.Schema.Types.ObjectId
            },
            email: {
                to: [String],
                cc: [String],
                bcc: [String],
                subject: String,
                body: String,
                template: String
            },
            webhook: {
                url: String,
                method: {
                    type: String,
                    enum: ['GET', 'POST', 'PUT', 'PATCH'],
                    default: 'POST'
                },
                headers: mongoose.Schema.Types.Mixed,
                body: mongoose.Schema.Types.Mixed
            },
            script: {
                type: {
                    type: String,
                    enum: ['javascript', 'python', 'bash']
                },
                code: String,
                timeout: {
                    type: Number,
                    default: 30000 // 30 seconds
                }
            }
        },
        delay: {
            type: Number,
            default: 0 // minutes
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    scope: {
        departments: [String],
        categories: [String],
        priorities: [String],
        tags: [String]
    },
    settings: {
        isActive: {
            type: Boolean,
            default: true
        },
        priority: {
            type: Number,
            min: 1,
            max: 100,
            default: 50
        },
        maxExecutions: {
            type: Number,
            min: 0,
            default: 0 // 0 = unlimited
        },
        executionCount: {
            type: Number,
            default: 0
        },
        cooldown: {
            type: Number,
            default: 0 // minutes between executions for same ticket
        },
        stopOnFailure: {
            type: Boolean,
            default: true
        }
    },
    statistics: {
        executions: {
            type: Number,
            default: 0
        },
        successes: {
            type: Number,
            default: 0
        },
        failures: {
            type: Number,
            default: 0
        },
        lastExecuted: Date,
        averageExecutionTime: Number
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testMode: {
        enabled: {
            type: Boolean,
            default: false
        },
        testTickets: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }],
        logOnly: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

// Indexes
automationRuleSchema.index({ 'trigger.type': 1 });
automationRuleSchema.index({ 'settings.isActive': 1 });
automationRuleSchema.index({ 'settings.priority': -1 });
automationRuleSchema.index({ 'scope.departments': 1 });
automationRuleSchema.index({ 'scope.categories': 1 });
automationRuleSchema.index({ createdBy: 1 });
automationRuleSchema.index({ createdAt: -1 });

// Virtual for success rate
automationRuleSchema.virtual('successRate').get(function () {
    const total = this.statistics.executions;
    return total > 0 ? (this.statistics.successes / total) * 100 : 0;
});

// Static method to find applicable rules
automationRuleSchema.statics.findApplicableRules = function (triggerType, ticketData, context = {}) {
    const query = {
        'settings.isActive': true,
        'trigger.type': triggerType
    };

    // Add scope filters
    if (context.department) {
        query.$or = query.$or || [];
        query.$or.push({ 'scope.departments': { $in: [context.department] } });
        query.$or.push({ 'scope.departments': { $size: 0 } });
    }

    if (ticketData.category) {
        query.$or = query.$or || [];
        query.$or.push({ 'scope.categories': { $in: [ticketData.category] } });
        query.$or.push({ 'scope.categories': { $size: 0 } });
    }

    if (ticketData.tags && ticketData.tags.length > 0) {
        query.$or = query.$or || [];
        query.$or.push({ 'scope.tags': { $in: ticketData.tags } });
        query.$or.push({ 'scope.tags': { $size: 0 } });
    }

    return this.find(query)
        .sort({ 'settings.priority': -1 })
        .limit(50);
};

// Method to check if rule applies to ticket
automationRuleSchema.methods.appliesTo = function (ticketData, context = {}) {
    // Check trigger conditions
    for (const condition of this.trigger.conditions) {
        const fieldValue = this.getFieldValue(ticketData, condition.field);
        const matches = this.evaluateCondition(fieldValue, condition.operator, condition.value, condition.caseSensitive);

        if (!matches) {
            return false;
        }
    }

    // Check scope
    if (this.scope.departments && this.scope.departments.length > 0) {
        if (!context.department || !this.scope.departments.includes(context.department)) {
            return false;
        }
    }

    if (this.scope.categories && this.scope.categories.length > 0) {
        if (!ticketData.category || !this.scope.categories.includes(ticketData.category)) {
            return false;
        }
    }

    if (this.scope.tags && this.scope.tags.length > 0) {
        const ticketTags = ticketData.tags || [];
        const hasMatchingTag = ticketTags.some(tag => this.scope.tags.includes(tag));
        if (!hasMatchingTag) {
            return false;
        }
    }

    return true;
};

// Helper method to get field value from ticket data
automationRuleSchema.methods.getFieldValue = function (ticketData, field) {
    switch (field) {
        case 'status':
            return ticketData.status;
        case 'priority':
            return ticketData.priority;
        case 'category':
            return ticketData.category;
        case 'tags':
            return ticketData.tags || [];
        case 'requester':
            return ticketData.requester?.email || ticketData.requester?.userId;
        case 'assignee':
            return ticketData.assignee?.email || ticketData.assignee?.userId;
        case 'title':
            return ticketData.title;
        case 'description':
            return ticketData.description;
        case 'created_at':
            return ticketData.createdAt;
        case 'updated_at':
            return ticketData.updatedAt;
        default:
            return ticketData[field];
    }
};

// Helper method to evaluate condition
automationRuleSchema.methods.evaluateCondition = function (fieldValue, operator, conditionValue, caseSensitive = false) {
    if (!caseSensitive && typeof fieldValue === 'string' && typeof conditionValue === 'string') {
        fieldValue = fieldValue.toLowerCase();
        conditionValue = conditionValue.toLowerCase();
    }

    switch (operator) {
        case 'equals':
            return fieldValue === conditionValue;
        case 'not_equals':
            return fieldValue !== conditionValue;
        case 'contains':
            return String(fieldValue).includes(String(conditionValue));
        case 'not_contains':
            return !String(fieldValue).includes(String(conditionValue));
        case 'starts_with':
            return String(fieldValue).startsWith(String(conditionValue));
        case 'ends_with':
            return String(fieldValue).endsWith(String(conditionValue));
        case 'greater_than':
            return fieldValue > conditionValue;
        case 'less_than':
            return fieldValue < conditionValue;
        case 'between':
            return Array.isArray(conditionValue) && conditionValue.length === 2 &&
                fieldValue >= conditionValue[0] && fieldValue <= conditionValue[1];
        case 'in':
            return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
        case 'not_in':
            return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue);
        default:
            return false;
    }
};

// Method to execute rule
automationRuleSchema.methods.execute = async function (ticketData, context = {}) {
    const startTime = Date.now();

    try {
        // Check execution limits
        if (this.settings.maxExecutions > 0 && this.settings.executionCount >= this.settings.maxExecutions) {
            return { success: false, reason: 'Max executions reached' };
        }

        // Check cooldown
        if (this.settings.cooldown > 0 && this.statistics.lastExecuted) {
            const timeSinceLastExecution = Date.now() - this.statistics.lastExecuted.getTime();
            const cooldownMs = this.settings.cooldown * 60 * 1000;
            if (timeSinceLastExecution < cooldownMs) {
                return { success: false, reason: 'Cooldown active' };
            }
        }

        const results = [];

        // Execute actions in order
        for (const action of this.actions.sort((a, b) => a.order - b.order)) {
            try {
                const result = await this.executeAction(action, ticketData, context);
                results.push({ action: action.type, success: true, result });

                if (!result && this.settings.stopOnFailure) {
                    break;
                }
            } catch (error) {
                results.push({ action: action.type, success: false, error: error.message });

                if (this.settings.stopOnFailure) {
                    break;
                }
            }
        }

        // Update statistics
        const executionTime = Date.now() - startTime;
        this.statistics.executions += 1;
        this.statistics.lastExecuted = new Date();
        this.statistics.averageExecutionTime =
            ((this.statistics.averageExecutionTime || 0) * (this.statistics.executions - 1) + executionTime) / this.statistics.executions;

        const hasFailures = results.some(r => !r.success);
        if (hasFailures) {
            this.statistics.failures += 1;
        } else {
            this.statistics.successes += 1;
        }

        this.settings.executionCount += 1;
        await this.save();

        return {
            success: !hasFailures,
            executionTime,
            results
        };

    } catch (error) {
        this.statistics.executions += 1;
        this.statistics.failures += 1;
        await this.save();

        return {
            success: false,
            error: error.message
        };
    }
};

// Method to execute individual action
automationRuleSchema.methods.executeAction = async function (action, ticketData, context) {
    // Implementation would vary based on action type
    // This is a simplified version

    switch (action.type) {
        case 'assign_agent':
            // Update ticket assignee
            return { assigned: action.config.agentId };

        case 'change_status':
            // Update ticket status
            return { status: action.config.status };

        case 'send_notification':
            // Send notification
            return { notified: action.config.notification.recipient };

        default:
            return { executed: true };
    }
};

// Static method to get rule statistics
automationRuleSchema.statics.getRuleStatistics = function () {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalRules: { $sum: 1 },
                activeRules: {
                    $sum: { $cond: ['$settings.isActive', 1, 0] }
                },
                totalExecutions: { $sum: '$statistics.executions' },
                totalSuccesses: { $sum: '$statistics.successes' },
                totalFailures: { $sum: '$statistics.failures' },
                averageExecutionTime: { $avg: '$statistics.averageExecutionTime' }
            }
        },
        {
            $project: {
                totalRules: 1,
                activeRules: 1,
                totalExecutions: 1,
                totalSuccesses: 1,
                totalFailures: 1,
                successRate: {
                    $multiply: [
                        { $divide: ['$totalSuccesses', { $max: ['$totalExecutions', 1] }] },
                        100
                    ]
                },
                averageExecutionTime: 1
            }
        }
    ]);
};

module.exports = mongoose.model('AutomationRule', automationRuleSchema);