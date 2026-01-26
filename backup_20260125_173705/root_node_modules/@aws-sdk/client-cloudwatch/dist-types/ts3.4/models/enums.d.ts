export declare const ActionsSuppressedBy: {
  readonly Alarm: "Alarm";
  readonly ExtensionPeriod: "ExtensionPeriod";
  readonly WaitPeriod: "WaitPeriod";
};
export type ActionsSuppressedBy =
  (typeof ActionsSuppressedBy)[keyof typeof ActionsSuppressedBy];
export declare const AlarmType: {
  readonly CompositeAlarm: "CompositeAlarm";
  readonly MetricAlarm: "MetricAlarm";
};
export type AlarmType = (typeof AlarmType)[keyof typeof AlarmType];
export declare const HistoryItemType: {
  readonly Action: "Action";
  readonly AlarmContributorAction: "AlarmContributorAction";
  readonly AlarmContributorStateUpdate: "AlarmContributorStateUpdate";
  readonly ConfigurationUpdate: "ConfigurationUpdate";
  readonly StateUpdate: "StateUpdate";
};
export type HistoryItemType =
  (typeof HistoryItemType)[keyof typeof HistoryItemType];
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
export type StandardUnit = (typeof StandardUnit)[keyof typeof StandardUnit];
export declare const AnomalyDetectorStateValue: {
  readonly PENDING_TRAINING: "PENDING_TRAINING";
  readonly TRAINED: "TRAINED";
  readonly TRAINED_INSUFFICIENT_DATA: "TRAINED_INSUFFICIENT_DATA";
};
export type AnomalyDetectorStateValue =
  (typeof AnomalyDetectorStateValue)[keyof typeof AnomalyDetectorStateValue];
export declare const AnomalyDetectorType: {
  readonly METRIC_MATH: "METRIC_MATH";
  readonly SINGLE_METRIC: "SINGLE_METRIC";
};
export type AnomalyDetectorType =
  (typeof AnomalyDetectorType)[keyof typeof AnomalyDetectorType];
export declare const ComparisonOperator: {
  readonly GreaterThanOrEqualToThreshold: "GreaterThanOrEqualToThreshold";
  readonly GreaterThanThreshold: "GreaterThanThreshold";
  readonly GreaterThanUpperThreshold: "GreaterThanUpperThreshold";
  readonly LessThanLowerOrGreaterThanUpperThreshold: "LessThanLowerOrGreaterThanUpperThreshold";
  readonly LessThanLowerThreshold: "LessThanLowerThreshold";
  readonly LessThanOrEqualToThreshold: "LessThanOrEqualToThreshold";
  readonly LessThanThreshold: "LessThanThreshold";
};
export type ComparisonOperator =
  (typeof ComparisonOperator)[keyof typeof ComparisonOperator];
export declare const StateValue: {
  readonly ALARM: "ALARM";
  readonly INSUFFICIENT_DATA: "INSUFFICIENT_DATA";
  readonly OK: "OK";
};
export type StateValue = (typeof StateValue)[keyof typeof StateValue];
export declare const ScanBy: {
  readonly TIMESTAMP_ASCENDING: "TimestampAscending";
  readonly TIMESTAMP_DESCENDING: "TimestampDescending";
};
export type ScanBy = (typeof ScanBy)[keyof typeof ScanBy];
export declare const EvaluationState: {
  readonly PARTIAL_DATA: "PARTIAL_DATA";
};
export type EvaluationState =
  (typeof EvaluationState)[keyof typeof EvaluationState];
export declare const Statistic: {
  readonly Average: "Average";
  readonly Maximum: "Maximum";
  readonly Minimum: "Minimum";
  readonly SampleCount: "SampleCount";
  readonly Sum: "Sum";
};
export type Statistic = (typeof Statistic)[keyof typeof Statistic];
export declare const StatusCode: {
  readonly COMPLETE: "Complete";
  readonly FORBIDDEN: "Forbidden";
  readonly INTERNAL_ERROR: "InternalError";
  readonly PARTIAL_DATA: "PartialData";
};
export type StatusCode = (typeof StatusCode)[keyof typeof StatusCode];
export declare const MetricStreamOutputFormat: {
  readonly JSON: "json";
  readonly OPEN_TELEMETRY_0_7: "opentelemetry0.7";
  readonly OPEN_TELEMETRY_1_0: "opentelemetry1.0";
};
export type MetricStreamOutputFormat =
  (typeof MetricStreamOutputFormat)[keyof typeof MetricStreamOutputFormat];
export declare const RecentlyActive: {
  readonly PT3H: "PT3H";
};
export type RecentlyActive =
  (typeof RecentlyActive)[keyof typeof RecentlyActive];
