export const ActionsSuppressedBy = {
    Alarm: "Alarm",
    ExtensionPeriod: "ExtensionPeriod",
    WaitPeriod: "WaitPeriod",
};
export const AlarmType = {
    CompositeAlarm: "CompositeAlarm",
    MetricAlarm: "MetricAlarm",
};
export const HistoryItemType = {
    Action: "Action",
    AlarmContributorAction: "AlarmContributorAction",
    AlarmContributorStateUpdate: "AlarmContributorStateUpdate",
    ConfigurationUpdate: "ConfigurationUpdate",
    StateUpdate: "StateUpdate",
};
export const StandardUnit = {
    Bits: "Bits",
    Bits_Second: "Bits/Second",
    Bytes: "Bytes",
    Bytes_Second: "Bytes/Second",
    Count: "Count",
    Count_Second: "Count/Second",
    Gigabits: "Gigabits",
    Gigabits_Second: "Gigabits/Second",
    Gigabytes: "Gigabytes",
    Gigabytes_Second: "Gigabytes/Second",
    Kilobits: "Kilobits",
    Kilobits_Second: "Kilobits/Second",
    Kilobytes: "Kilobytes",
    Kilobytes_Second: "Kilobytes/Second",
    Megabits: "Megabits",
    Megabits_Second: "Megabits/Second",
    Megabytes: "Megabytes",
    Megabytes_Second: "Megabytes/Second",
    Microseconds: "Microseconds",
    Milliseconds: "Milliseconds",
    None: "None",
    Percent: "Percent",
    Seconds: "Seconds",
    Terabits: "Terabits",
    Terabits_Second: "Terabits/Second",
    Terabytes: "Terabytes",
    Terabytes_Second: "Terabytes/Second",
};
export const AnomalyDetectorStateValue = {
    PENDING_TRAINING: "PENDING_TRAINING",
    TRAINED: "TRAINED",
    TRAINED_INSUFFICIENT_DATA: "TRAINED_INSUFFICIENT_DATA",
};
export const AnomalyDetectorType = {
    METRIC_MATH: "METRIC_MATH",
    SINGLE_METRIC: "SINGLE_METRIC",
};
export const ComparisonOperator = {
    GreaterThanOrEqualToThreshold: "GreaterThanOrEqualToThreshold",
    GreaterThanThreshold: "GreaterThanThreshold",
    GreaterThanUpperThreshold: "GreaterThanUpperThreshold",
    LessThanLowerOrGreaterThanUpperThreshold: "LessThanLowerOrGreaterThanUpperThreshold",
    LessThanLowerThreshold: "LessThanLowerThreshold",
    LessThanOrEqualToThreshold: "LessThanOrEqualToThreshold",
    LessThanThreshold: "LessThanThreshold",
};
export const StateValue = {
    ALARM: "ALARM",
    INSUFFICIENT_DATA: "INSUFFICIENT_DATA",
    OK: "OK",
};
export const ScanBy = {
    TIMESTAMP_ASCENDING: "TimestampAscending",
    TIMESTAMP_DESCENDING: "TimestampDescending",
};
export const EvaluationState = {
    PARTIAL_DATA: "PARTIAL_DATA",
};
export const Statistic = {
    Average: "Average",
    Maximum: "Maximum",
    Minimum: "Minimum",
    SampleCount: "SampleCount",
    Sum: "Sum",
};
export const StatusCode = {
    COMPLETE: "Complete",
    FORBIDDEN: "Forbidden",
    INTERNAL_ERROR: "InternalError",
    PARTIAL_DATA: "PartialData",
};
export const MetricStreamOutputFormat = {
    JSON: "json",
    OPEN_TELEMETRY_0_7: "opentelemetry0.7",
    OPEN_TELEMETRY_1_0: "opentelemetry1.0",
};
export const RecentlyActive = {
    PT3H: "PT3H",
};
