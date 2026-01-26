import {
  ActionsSuppressedBy,
  AlarmType,
  AnomalyDetectorStateValue,
  AnomalyDetectorType,
  ComparisonOperator,
  EvaluationState,
  HistoryItemType,
  MetricStreamOutputFormat,
  RecentlyActive,
  ScanBy,
  StandardUnit,
  StateValue,
  Statistic,
  StatusCode,
} from "./enums";
export interface AlarmContributor {
  ContributorId: string | undefined;
  ContributorAttributes: Record<string, string> | undefined;
  StateReason: string | undefined;
  StateTransitionedTimestamp?: Date | undefined;
}
export interface AlarmHistoryItem {
  AlarmName?: string | undefined;
  AlarmContributorId?: string | undefined;
  AlarmType?: AlarmType | undefined;
  Timestamp?: Date | undefined;
  HistoryItemType?: HistoryItemType | undefined;
  HistorySummary?: string | undefined;
  HistoryData?: string | undefined;
  AlarmContributorAttributes?: Record<string, string> | undefined;
}
export interface Range {
  StartTime: Date | undefined;
  EndTime: Date | undefined;
}
export interface AnomalyDetectorConfiguration {
  ExcludedTimeRanges?: Range[] | undefined;
  MetricTimezone?: string | undefined;
}
export interface Dimension {
  Name: string | undefined;
  Value: string | undefined;
}
export interface MetricCharacteristics {
  PeriodicSpikes?: boolean | undefined;
}
export interface Metric {
  Namespace?: string | undefined;
  MetricName?: string | undefined;
  Dimensions?: Dimension[] | undefined;
}
export interface MetricStat {
  Metric: Metric | undefined;
  Period: number | undefined;
  Stat: string | undefined;
  Unit?: StandardUnit | undefined;
}
export interface MetricDataQuery {
  Id: string | undefined;
  MetricStat?: MetricStat | undefined;
  Expression?: string | undefined;
  Label?: string | undefined;
  ReturnData?: boolean | undefined;
  Period?: number | undefined;
  AccountId?: string | undefined;
}
export interface MetricMathAnomalyDetector {
  MetricDataQueries?: MetricDataQuery[] | undefined;
}
export interface SingleMetricAnomalyDetector {
  AccountId?: string | undefined;
  Namespace?: string | undefined;
  MetricName?: string | undefined;
  Dimensions?: Dimension[] | undefined;
  Stat?: string | undefined;
}
export interface AnomalyDetector {
  Namespace?: string | undefined;
  MetricName?: string | undefined;
  Dimensions?: Dimension[] | undefined;
  Stat?: string | undefined;
  Configuration?: AnomalyDetectorConfiguration | undefined;
  StateValue?: AnomalyDetectorStateValue | undefined;
  MetricCharacteristics?: MetricCharacteristics | undefined;
  SingleMetricAnomalyDetector?: SingleMetricAnomalyDetector | undefined;
  MetricMathAnomalyDetector?: MetricMathAnomalyDetector | undefined;
}
export interface PartialFailure {
  FailureResource?: string | undefined;
  ExceptionType?: string | undefined;
  FailureCode?: string | undefined;
  FailureDescription?: string | undefined;
}
export interface CompositeAlarm {
  ActionsEnabled?: boolean | undefined;
  AlarmActions?: string[] | undefined;
  AlarmArn?: string | undefined;
  AlarmConfigurationUpdatedTimestamp?: Date | undefined;
  AlarmDescription?: string | undefined;
  AlarmName?: string | undefined;
  AlarmRule?: string | undefined;
  InsufficientDataActions?: string[] | undefined;
  OKActions?: string[] | undefined;
  StateReason?: string | undefined;
  StateReasonData?: string | undefined;
  StateUpdatedTimestamp?: Date | undefined;
  StateValue?: StateValue | undefined;
  StateTransitionedTimestamp?: Date | undefined;
  ActionsSuppressedBy?: ActionsSuppressedBy | undefined;
  ActionsSuppressedReason?: string | undefined;
  ActionsSuppressor?: string | undefined;
  ActionsSuppressorWaitPeriod?: number | undefined;
  ActionsSuppressorExtensionPeriod?: number | undefined;
}
export interface DashboardEntry {
  DashboardName?: string | undefined;
  DashboardArn?: string | undefined;
  LastModified?: Date | undefined;
  Size?: number | undefined;
}
export interface DashboardValidationMessage {
  DataPath?: string | undefined;
  Message?: string | undefined;
}
export interface Datapoint {
  Timestamp?: Date | undefined;
  SampleCount?: number | undefined;
  Average?: number | undefined;
  Sum?: number | undefined;
  Minimum?: number | undefined;
  Maximum?: number | undefined;
  Unit?: StandardUnit | undefined;
  ExtendedStatistics?: Record<string, number> | undefined;
}
export interface DeleteAlarmsInput {
  AlarmNames: string[] | undefined;
}
export interface DeleteAnomalyDetectorInput {
  Namespace?: string | undefined;
  MetricName?: string | undefined;
  Dimensions?: Dimension[] | undefined;
  Stat?: string | undefined;
  SingleMetricAnomalyDetector?: SingleMetricAnomalyDetector | undefined;
  MetricMathAnomalyDetector?: MetricMathAnomalyDetector | undefined;
}
export interface DeleteAnomalyDetectorOutput {}
export interface DeleteDashboardsInput {
  DashboardNames: string[] | undefined;
}
export interface DeleteDashboardsOutput {}
export interface DeleteInsightRulesInput {
  RuleNames: string[] | undefined;
}
export interface DeleteInsightRulesOutput {
  Failures?: PartialFailure[] | undefined;
}
export interface DeleteMetricStreamInput {
  Name: string | undefined;
}
export interface DeleteMetricStreamOutput {}
export interface DescribeAlarmContributorsInput {
  AlarmName: string | undefined;
  NextToken?: string | undefined;
}
export interface DescribeAlarmContributorsOutput {
  AlarmContributors: AlarmContributor[] | undefined;
  NextToken?: string | undefined;
}
export interface DescribeAlarmHistoryInput {
  AlarmName?: string | undefined;
  AlarmContributorId?: string | undefined;
  AlarmTypes?: AlarmType[] | undefined;
  HistoryItemType?: HistoryItemType | undefined;
  StartDate?: Date | undefined;
  EndDate?: Date | undefined;
  MaxRecords?: number | undefined;
  NextToken?: string | undefined;
  ScanBy?: ScanBy | undefined;
}
export interface DescribeAlarmHistoryOutput {
  AlarmHistoryItems?: AlarmHistoryItem[] | undefined;
  NextToken?: string | undefined;
}
export interface DescribeAlarmsInput {
  AlarmNames?: string[] | undefined;
  AlarmNamePrefix?: string | undefined;
  AlarmTypes?: AlarmType[] | undefined;
  ChildrenOfAlarmName?: string | undefined;
  ParentsOfAlarmName?: string | undefined;
  StateValue?: StateValue | undefined;
  ActionPrefix?: string | undefined;
  MaxRecords?: number | undefined;
  NextToken?: string | undefined;
}
export interface MetricAlarm {
  AlarmName?: string | undefined;
  AlarmArn?: string | undefined;
  AlarmDescription?: string | undefined;
  AlarmConfigurationUpdatedTimestamp?: Date | undefined;
  ActionsEnabled?: boolean | undefined;
  OKActions?: string[] | undefined;
  AlarmActions?: string[] | undefined;
  InsufficientDataActions?: string[] | undefined;
  StateValue?: StateValue | undefined;
  StateReason?: string | undefined;
  StateReasonData?: string | undefined;
  StateUpdatedTimestamp?: Date | undefined;
  MetricName?: string | undefined;
  Namespace?: string | undefined;
  Statistic?: Statistic | undefined;
  ExtendedStatistic?: string | undefined;
  Dimensions?: Dimension[] | undefined;
  Period?: number | undefined;
  Unit?: StandardUnit | undefined;
  EvaluationPeriods?: number | undefined;
  DatapointsToAlarm?: number | undefined;
  Threshold?: number | undefined;
  ComparisonOperator?: ComparisonOperator | undefined;
  TreatMissingData?: string | undefined;
  EvaluateLowSampleCountPercentile?: string | undefined;
  Metrics?: MetricDataQuery[] | undefined;
  ThresholdMetricId?: string | undefined;
  EvaluationState?: EvaluationState | undefined;
  StateTransitionedTimestamp?: Date | undefined;
}
export interface DescribeAlarmsOutput {
  CompositeAlarms?: CompositeAlarm[] | undefined;
  MetricAlarms?: MetricAlarm[] | undefined;
  NextToken?: string | undefined;
}
export interface DescribeAlarmsForMetricInput {
  MetricName: string | undefined;
  Namespace: string | undefined;
  Statistic?: Statistic | undefined;
  ExtendedStatistic?: string | undefined;
  Dimensions?: Dimension[] | undefined;
  Period?: number | undefined;
  Unit?: StandardUnit | undefined;
}
export interface DescribeAlarmsForMetricOutput {
  MetricAlarms?: MetricAlarm[] | undefined;
}
export interface DescribeAnomalyDetectorsInput {
  NextToken?: string | undefined;
  MaxResults?: number | undefined;
  Namespace?: string | undefined;
  MetricName?: string | undefined;
  Dimensions?: Dimension[] | undefined;
  AnomalyDetectorTypes?: AnomalyDetectorType[] | undefined;
}
export interface DescribeAnomalyDetectorsOutput {
  AnomalyDetectors?: AnomalyDetector[] | undefined;
  NextToken?: string | undefined;
}
export interface DescribeInsightRulesInput {
  NextToken?: string | undefined;
  MaxResults?: number | undefined;
}
export interface InsightRule {
  Name: string | undefined;
  State: string | undefined;
  Schema: string | undefined;
  Definition: string | undefined;
  ManagedRule?: boolean | undefined;
  ApplyOnTransformedLogs?: boolean | undefined;
}
export interface DescribeInsightRulesOutput {
  NextToken?: string | undefined;
  InsightRules?: InsightRule[] | undefined;
}
export interface DimensionFilter {
  Name: string | undefined;
  Value?: string | undefined;
}
export interface DisableAlarmActionsInput {
  AlarmNames: string[] | undefined;
}
export interface DisableInsightRulesInput {
  RuleNames: string[] | undefined;
}
export interface DisableInsightRulesOutput {
  Failures?: PartialFailure[] | undefined;
}
export interface EnableAlarmActionsInput {
  AlarmNames: string[] | undefined;
}
export interface EnableInsightRulesInput {
  RuleNames: string[] | undefined;
}
export interface EnableInsightRulesOutput {
  Failures?: PartialFailure[] | undefined;
}
export interface Entity {
  KeyAttributes?: Record<string, string> | undefined;
  Attributes?: Record<string, string> | undefined;
}
export interface StatisticSet {
  SampleCount: number | undefined;
  Sum: number | undefined;
  Minimum: number | undefined;
  Maximum: number | undefined;
}
export interface MetricDatum {
  MetricName: string | undefined;
  Dimensions?: Dimension[] | undefined;
  Timestamp?: Date | undefined;
  Value?: number | undefined;
  StatisticValues?: StatisticSet | undefined;
  Values?: number[] | undefined;
  Counts?: number[] | undefined;
  Unit?: StandardUnit | undefined;
  StorageResolution?: number | undefined;
}
export interface EntityMetricData {
  Entity?: Entity | undefined;
  MetricData?: MetricDatum[] | undefined;
}
export interface GetDashboardInput {
  DashboardName: string | undefined;
}
export interface GetDashboardOutput {
  DashboardArn?: string | undefined;
  DashboardBody?: string | undefined;
  DashboardName?: string | undefined;
}
export interface GetInsightRuleReportInput {
  RuleName: string | undefined;
  StartTime: Date | undefined;
  EndTime: Date | undefined;
  Period: number | undefined;
  MaxContributorCount?: number | undefined;
  Metrics?: string[] | undefined;
  OrderBy?: string | undefined;
}
export interface InsightRuleContributorDatapoint {
  Timestamp: Date | undefined;
  ApproximateValue: number | undefined;
}
export interface InsightRuleContributor {
  Keys: string[] | undefined;
  ApproximateAggregateValue: number | undefined;
  Datapoints: InsightRuleContributorDatapoint[] | undefined;
}
export interface InsightRuleMetricDatapoint {
  Timestamp: Date | undefined;
  UniqueContributors?: number | undefined;
  MaxContributorValue?: number | undefined;
  SampleCount?: number | undefined;
  Average?: number | undefined;
  Sum?: number | undefined;
  Minimum?: number | undefined;
  Maximum?: number | undefined;
}
export interface GetInsightRuleReportOutput {
  KeyLabels?: string[] | undefined;
  AggregationStatistic?: string | undefined;
  AggregateValue?: number | undefined;
  ApproximateUniqueCount?: number | undefined;
  Contributors?: InsightRuleContributor[] | undefined;
  MetricDatapoints?: InsightRuleMetricDatapoint[] | undefined;
}
export interface LabelOptions {
  Timezone?: string | undefined;
}
export interface GetMetricDataInput {
  MetricDataQueries: MetricDataQuery[] | undefined;
  StartTime: Date | undefined;
  EndTime: Date | undefined;
  NextToken?: string | undefined;
  ScanBy?: ScanBy | undefined;
  MaxDatapoints?: number | undefined;
  LabelOptions?: LabelOptions | undefined;
}
export interface MessageData {
  Code?: string | undefined;
  Value?: string | undefined;
}
export interface MetricDataResult {
  Id?: string | undefined;
  Label?: string | undefined;
  Timestamps?: Date[] | undefined;
  Values?: number[] | undefined;
  StatusCode?: StatusCode | undefined;
  Messages?: MessageData[] | undefined;
}
export interface GetMetricDataOutput {
  MetricDataResults?: MetricDataResult[] | undefined;
  NextToken?: string | undefined;
  Messages?: MessageData[] | undefined;
}
export interface GetMetricStatisticsInput {
  Namespace: string | undefined;
  MetricName: string | undefined;
  Dimensions?: Dimension[] | undefined;
  StartTime: Date | undefined;
  EndTime: Date | undefined;
  Period: number | undefined;
  Statistics?: Statistic[] | undefined;
  ExtendedStatistics?: string[] | undefined;
  Unit?: StandardUnit | undefined;
}
export interface GetMetricStatisticsOutput {
  Label?: string | undefined;
  Datapoints?: Datapoint[] | undefined;
}
export interface GetMetricStreamInput {
  Name: string | undefined;
}
export interface MetricStreamFilter {
  Namespace?: string | undefined;
  MetricNames?: string[] | undefined;
}
export interface MetricStreamStatisticsMetric {
  Namespace: string | undefined;
  MetricName: string | undefined;
}
export interface MetricStreamStatisticsConfiguration {
  IncludeMetrics: MetricStreamStatisticsMetric[] | undefined;
  AdditionalStatistics: string[] | undefined;
}
export interface GetMetricStreamOutput {
  Arn?: string | undefined;
  Name?: string | undefined;
  IncludeFilters?: MetricStreamFilter[] | undefined;
  ExcludeFilters?: MetricStreamFilter[] | undefined;
  FirehoseArn?: string | undefined;
  RoleArn?: string | undefined;
  State?: string | undefined;
  CreationDate?: Date | undefined;
  LastUpdateDate?: Date | undefined;
  OutputFormat?: MetricStreamOutputFormat | undefined;
  StatisticsConfigurations?: MetricStreamStatisticsConfiguration[] | undefined;
  IncludeLinkedAccountsMetrics?: boolean | undefined;
}
export interface GetMetricWidgetImageInput {
  MetricWidget: string | undefined;
  OutputFormat?: string | undefined;
}
export interface GetMetricWidgetImageOutput {
  MetricWidgetImage?: Uint8Array | undefined;
}
export interface ListDashboardsInput {
  DashboardNamePrefix?: string | undefined;
  NextToken?: string | undefined;
}
export interface ListDashboardsOutput {
  DashboardEntries?: DashboardEntry[] | undefined;
  NextToken?: string | undefined;
}
export interface ListManagedInsightRulesInput {
  ResourceARN: string | undefined;
  NextToken?: string | undefined;
  MaxResults?: number | undefined;
}
export interface ManagedRuleState {
  RuleName: string | undefined;
  State: string | undefined;
}
export interface ManagedRuleDescription {
  TemplateName?: string | undefined;
  ResourceARN?: string | undefined;
  RuleState?: ManagedRuleState | undefined;
}
export interface ListManagedInsightRulesOutput {
  ManagedRules?: ManagedRuleDescription[] | undefined;
  NextToken?: string | undefined;
}
export interface ListMetricsInput {
  Namespace?: string | undefined;
  MetricName?: string | undefined;
  Dimensions?: DimensionFilter[] | undefined;
  NextToken?: string | undefined;
  RecentlyActive?: RecentlyActive | undefined;
  IncludeLinkedAccounts?: boolean | undefined;
  OwningAccount?: string | undefined;
}
export interface ListMetricsOutput {
  Metrics?: Metric[] | undefined;
  NextToken?: string | undefined;
  OwningAccounts?: string[] | undefined;
}
export interface ListMetricStreamsInput {
  NextToken?: string | undefined;
  MaxResults?: number | undefined;
}
export interface MetricStreamEntry {
  Arn?: string | undefined;
  CreationDate?: Date | undefined;
  LastUpdateDate?: Date | undefined;
  Name?: string | undefined;
  FirehoseArn?: string | undefined;
  State?: string | undefined;
  OutputFormat?: MetricStreamOutputFormat | undefined;
}
export interface ListMetricStreamsOutput {
  NextToken?: string | undefined;
  Entries?: MetricStreamEntry[] | undefined;
}
export interface ListTagsForResourceInput {
  ResourceARN: string | undefined;
}
export interface Tag {
  Key: string | undefined;
  Value: string | undefined;
}
export interface ListTagsForResourceOutput {
  Tags?: Tag[] | undefined;
}
export interface PutAnomalyDetectorInput {
  Namespace?: string | undefined;
  MetricName?: string | undefined;
  Dimensions?: Dimension[] | undefined;
  Stat?: string | undefined;
  Configuration?: AnomalyDetectorConfiguration | undefined;
  MetricCharacteristics?: MetricCharacteristics | undefined;
  SingleMetricAnomalyDetector?: SingleMetricAnomalyDetector | undefined;
  MetricMathAnomalyDetector?: MetricMathAnomalyDetector | undefined;
}
export interface PutAnomalyDetectorOutput {}
export interface PutCompositeAlarmInput {
  ActionsEnabled?: boolean | undefined;
  AlarmActions?: string[] | undefined;
  AlarmDescription?: string | undefined;
  AlarmName: string | undefined;
  AlarmRule: string | undefined;
  InsufficientDataActions?: string[] | undefined;
  OKActions?: string[] | undefined;
  Tags?: Tag[] | undefined;
  ActionsSuppressor?: string | undefined;
  ActionsSuppressorWaitPeriod?: number | undefined;
  ActionsSuppressorExtensionPeriod?: number | undefined;
}
export interface PutDashboardInput {
  DashboardName: string | undefined;
  DashboardBody: string | undefined;
}
export interface PutDashboardOutput {
  DashboardValidationMessages?: DashboardValidationMessage[] | undefined;
}
export interface PutInsightRuleInput {
  RuleName: string | undefined;
  RuleState?: string | undefined;
  RuleDefinition: string | undefined;
  Tags?: Tag[] | undefined;
  ApplyOnTransformedLogs?: boolean | undefined;
}
export interface PutInsightRuleOutput {}
export interface ManagedRule {
  TemplateName: string | undefined;
  ResourceARN: string | undefined;
  Tags?: Tag[] | undefined;
}
export interface PutManagedInsightRulesInput {
  ManagedRules: ManagedRule[] | undefined;
}
export interface PutManagedInsightRulesOutput {
  Failures?: PartialFailure[] | undefined;
}
export interface PutMetricAlarmInput {
  AlarmName: string | undefined;
  AlarmDescription?: string | undefined;
  ActionsEnabled?: boolean | undefined;
  OKActions?: string[] | undefined;
  AlarmActions?: string[] | undefined;
  InsufficientDataActions?: string[] | undefined;
  MetricName?: string | undefined;
  Namespace?: string | undefined;
  Statistic?: Statistic | undefined;
  ExtendedStatistic?: string | undefined;
  Dimensions?: Dimension[] | undefined;
  Period?: number | undefined;
  Unit?: StandardUnit | undefined;
  EvaluationPeriods: number | undefined;
  DatapointsToAlarm?: number | undefined;
  Threshold?: number | undefined;
  ComparisonOperator: ComparisonOperator | undefined;
  TreatMissingData?: string | undefined;
  EvaluateLowSampleCountPercentile?: string | undefined;
  Metrics?: MetricDataQuery[] | undefined;
  Tags?: Tag[] | undefined;
  ThresholdMetricId?: string | undefined;
}
export interface PutMetricDataInput {
  Namespace: string | undefined;
  MetricData?: MetricDatum[] | undefined;
  EntityMetricData?: EntityMetricData[] | undefined;
  StrictEntityValidation?: boolean | undefined;
}
export interface PutMetricStreamInput {
  Name: string | undefined;
  IncludeFilters?: MetricStreamFilter[] | undefined;
  ExcludeFilters?: MetricStreamFilter[] | undefined;
  FirehoseArn: string | undefined;
  RoleArn: string | undefined;
  OutputFormat: MetricStreamOutputFormat | undefined;
  Tags?: Tag[] | undefined;
  StatisticsConfigurations?: MetricStreamStatisticsConfiguration[] | undefined;
  IncludeLinkedAccountsMetrics?: boolean | undefined;
}
export interface PutMetricStreamOutput {
  Arn?: string | undefined;
}
export interface SetAlarmStateInput {
  AlarmName: string | undefined;
  StateValue: StateValue | undefined;
  StateReason: string | undefined;
  StateReasonData?: string | undefined;
}
export interface StartMetricStreamsInput {
  Names: string[] | undefined;
}
export interface StartMetricStreamsOutput {}
export interface StopMetricStreamsInput {
  Names: string[] | undefined;
}
export interface StopMetricStreamsOutput {}
export interface TagResourceInput {
  ResourceARN: string | undefined;
  Tags: Tag[] | undefined;
}
export interface TagResourceOutput {}
export interface UntagResourceInput {
  ResourceARN: string | undefined;
  TagKeys: string[] | undefined;
}
export interface UntagResourceOutput {}
