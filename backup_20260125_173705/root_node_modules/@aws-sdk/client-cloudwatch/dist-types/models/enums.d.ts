/**
 * @public
 * @enum
 */
export declare const ActionsSuppressedBy: {
    readonly Alarm: "Alarm";
    readonly ExtensionPeriod: "ExtensionPeriod";
    readonly WaitPeriod: "WaitPeriod";
};
/**
 * @public
 */
export type ActionsSuppressedBy = (typeof ActionsSuppressedBy)[keyof typeof ActionsSuppressedBy];
/**
 * @public
 * @enum
 */
export declare const AlarmType: {
    readonly CompositeAlarm: "CompositeAlarm";
    readonly MetricAlarm: "MetricAlarm";
};
/**
 * @public
 */
export type AlarmType = (typeof AlarmType)[keyof typeof AlarmType];
/**
 * @public
 * @enum
 */
export declare const HistoryItemType: {
    readonly Action: "Action";
    readonly AlarmContributorAction: "AlarmContributorAction";
    readonly AlarmContributorStateUpdate: "AlarmContributorStateUpdate";
    readonly ConfigurationUpdate: "ConfigurationUpdate";
    readonly StateUpdate: "StateUpdate";
};
/**
 * @public
 */
export type HistoryItemType = (typeof HistoryItemType)[keyof typeof HistoryItemType];
/**
 * @public
 * @enum
 */
export declare const StandardUnit: {
    readonly Bits: "Bits";
    readonly Bits_Second: "Bits/Second";
    readonly Bytes: "Bytes";
    readonly Bytes_Second: "Bytes/Second";
    readonly Count: "Count";
    readonly Count_Second: "Count/Second";
    readonly Gigabits: "Gigabits";
    readonly Gigabits_Second: "Gigabits/Second";
    readonly Gigabytes: "Gigabytes";
    readonly Gigabytes_Second: "Gigabytes/Second";
    readonly Kilobits: "Kilobits";
    readonly Kilobits_Second: "Kilobits/Second";
    readonly Kilobytes: "Kilobytes";
    readonly Kilobytes_Second: "Kilobytes/Second";
    readonly Megabits: "Megabits";
    readonly Megabits_Second: "Megabits/Second";
    readonly Megabytes: "Megabytes";
    readonly Megabytes_Second: "Megabytes/Second";
    readonly Microseconds: "Microseconds";
    readonly Milliseconds: "Milliseconds";
    readonly None: "None";
    readonly Percent: "Percent";
    readonly Seconds: "Seconds";
    readonly Terabits: "Terabits";
    readonly Terabits_Second: "Terabits/Second";
    readonly Terabytes: "Terabytes";
    readonly Terabytes_Second: "Terabytes/Second";
};
/**
 * @public
 */
export type StandardUnit = (typeof StandardUnit)[keyof typeof StandardUnit];
/**
 * @public
 * @enum
 */
export declare const AnomalyDetectorStateValue: {
    readonly PENDING_TRAINING: "PENDING_TRAINING";
    readonly TRAINED: "TRAINED";
    readonly TRAINED_INSUFFICIENT_DATA: "TRAINED_INSUFFICIENT_DATA";
};
/**
 * @public
 */
export type AnomalyDetectorStateValue = (typeof AnomalyDetectorStateValue)[keyof typeof AnomalyDetectorStateValue];
/**
 * @public
 * @enum
 */
export declare const AnomalyDetectorType: {
    readonly METRIC_MATH: "METRIC_MATH";
    readonly SINGLE_METRIC: "SINGLE_METRIC";
};
/**
 * @public
 */
export type AnomalyDetectorType = (typeof AnomalyDetectorType)[keyof typeof AnomalyDetectorType];
/**
 * @public
 * @enum
 */
export declare const ComparisonOperator: {
    readonly GreaterThanOrEqualToThreshold: "GreaterThanOrEqualToThreshold";
    readonly GreaterThanThreshold: "GreaterThanThreshold";
    readonly GreaterThanUpperThreshold: "GreaterThanUpperThreshold";
    readonly LessThanLowerOrGreaterThanUpperThreshold: "LessThanLowerOrGreaterThanUpperThreshold";
    readonly LessThanLowerThreshold: "LessThanLowerThreshold";
    readonly LessThanOrEqualToThreshold: "LessThanOrEqualToThreshold";
    readonly LessThanThreshold: "LessThanThreshold";
};
/**
 * @public
 */
export type ComparisonOperator = (typeof ComparisonOperator)[keyof typeof ComparisonOperator];
/**
 * @public
 * @enum
 */
export declare const StateValue: {
    readonly ALARM: "ALARM";
    readonly INSUFFICIENT_DATA: "INSUFFICIENT_DATA";
    readonly OK: "OK";
};
/**
 * @public
 */
export type StateValue = (typeof StateValue)[keyof typeof StateValue];
/**
 * @public
 * @enum
 */
export declare const ScanBy: {
    readonly TIMESTAMP_ASCENDING: "TimestampAscending";
    readonly TIMESTAMP_DESCENDING: "TimestampDescending";
};
/**
 * @public
 */
export type ScanBy = (typeof ScanBy)[keyof typeof ScanBy];
/**
 * @public
 * @enum
 */
export declare const EvaluationState: {
    readonly PARTIAL_DATA: "PARTIAL_DATA";
};
/**
 * @public
 */
export type EvaluationState = (typeof EvaluationState)[keyof typeof EvaluationState];
/**
 * @public
 * @enum
 */
export declare const Statistic: {
    readonly Average: "Average";
    readonly Maximum: "Maximum";
    readonly Minimum: "Minimum";
    readonly SampleCount: "SampleCount";
    readonly Sum: "Sum";
};
/**
 * @public
 */
export type Statistic = (typeof Statistic)[keyof typeof Statistic];
/**
 * @public
 * @enum
 */
export declare const StatusCode: {
    readonly COMPLETE: "Complete";
    readonly FORBIDDEN: "Forbidden";
    readonly INTERNAL_ERROR: "InternalError";
    readonly PARTIAL_DATA: "PartialData";
};
/**
 * @public
 */
export type StatusCode = (typeof StatusCode)[keyof typeof StatusCode];
/**
 * @public
 * @enum
 */
export declare const MetricStreamOutputFormat: {
    readonly JSON: "json";
    readonly OPEN_TELEMETRY_0_7: "opentelemetry0.7";
    readonly OPEN_TELEMETRY_1_0: "opentelemetry1.0";
};
/**
 * @public
 */
export type MetricStreamOutputFormat = (typeof MetricStreamOutputFormat)[keyof typeof MetricStreamOutputFormat];
/**
 * @public
 * @enum
 */
export declare const RecentlyActive: {
    readonly PT3H: "PT3H";
};
/**
 * @public
 */
export type RecentlyActive = (typeof RecentlyActive)[keyof typeof RecentlyActive];
