# Iris Gantt Props and Types Reference

Version: `1.5.0`  
Scope: Public props/types exported from:
- `src/components/Gantt/Gantt.tsx`
- `src/components/Gantt/types.ts`
- `src/components/Gantt/features/filterUtils.ts`

## Quick Index

- `GanttProps`
- `DateInput`
- `OnHoldPeriod`, `OnHoldPeriodInput`
- `Task`, `TaskInput`
- `TaskSegment`, `TaskSegmentInput`
- `Link`
- `TaskTooltipConfig`
- `Scale`, `TimelineView`, `Column`
- `GanttConfig`
- `GanttIconConfig`
- `GanttStyleConfig`
- `Marker`, `Baseline`
- `TaskReorderMeta`, `TaskDragUpdateMeta`, `TaskDragUpdatePayload`
- `ZoomLevel`
- `DropIndicator`
- `GanttUIConfig`
- `FilterOptions`

## `GanttProps`

```ts
export interface GanttProps {
  tasks: TaskInput[];
  links?: Link[];
  config?: Partial<GanttConfig>;
  uiConfig?: Partial<GanttUIConfig>;
  styleConfig?: Partial<GanttStyleConfig>;
  iconConfig?: Partial<GanttIconConfig>;
  taskTooltipConfig?: Partial<TaskTooltipConfig>;
  onHoldPeriods?: OnHoldPeriodInput[];
  on_hold_periods?: OnHoldPeriodInput[];
  onHold?: OnHoldPeriodInput[] | OnHoldPeriodInput;
  on_hold?: OnHoldPeriodInput[] | OnHoldPeriodInput;
  onhold?: OnHoldPeriodInput[] | OnHoldPeriodInput;
  onTaskUpdate?: (task: Task, reorderMeta?: TaskReorderMeta) => void;
  onTaskDragUpdate?: (payload: TaskDragUpdatePayload) => void | Promise<void>;
  onTaskCreate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onLinkCreate?: (link: Link) => void;
  onLinkDelete?: (linkId: string) => void;
  onTimelineViewChange?: (view: TimelineView) => void;

  // Storybook helper props (ignored by component but required for build)
  cellWidth?: number;
  cellHeight?: number;
  scaleHeight?: number;
  primaryUnit?: string;
  primaryStep?: number;
  primaryFormat?: string;
  secondaryUnit?: string;
  secondaryStep?: number;
  secondaryFormat?: string;
  showVerticalBorders?: boolean;
  showHorizontalBorders?: boolean;
  borderStyle?: string;
  borderColor?: string;
  showStartDate?: boolean;
  showEndDate?: boolean;
  startDateWidth?: number;
  endDateWidth?: number;
  startDateFormat?: string;
  endDateFormat?: string;
  baselines?: Map<string, Baseline>;
}
```

## Data Types

```ts
export type DateInput = Date | string | number;

export interface OnHoldPeriod {
  start: Date;
  end: Date;
}

export interface OnHoldPeriodInput {
  start: DateInput;
  end: DateInput;
}

export interface Task {
  id: string;
  rawId?: string | number;
  text: string;
  start: Date;
  end: Date;
  ShowHandle?: boolean;
  plannedStart?: Date;
  plannedEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  duration: number;
  progress: number;
  type?: 'task' | 'milestone' | 'project';
  parent?: string;
  open?: boolean;
  color?: string;
  details?: string;
  owner?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: string;
  onHoldPeriods?: OnHoldPeriod[];
  dependencies?: string[];
  dependencyRule?: string[];
  segments?: TaskSegment[];
  sequence_id?: number;
  stage_id?: string | null;
  tooltipConfig?: Partial<TaskTooltipConfig>;
}

export interface TaskSegment {
  start: Date;
  end: Date;
  duration: number;
}

export interface TaskSegmentInput {
  start: DateInput;
  end: DateInput;
  duration?: number | string;
}

export interface TaskInput extends Omit<
  Task,
  'id' | 'text' | 'start' | 'end' | 'plannedStart' | 'plannedEnd' |
  'actualStart' | 'actualEnd' | 'duration' | 'progress' | 'parent' |
  'onHoldPeriods' | 'dependencies' | 'dependencyRule' | 'segments'
> {
  id: string | number;
  text?: string;
  name?: string;
  title?: string;
  taskName?: string;
  task_name?: string;
  workGroupName?: string;
  ShowHandle?: boolean;
  showHandle?: boolean;

  start?: DateInput;
  end?: DateInput;
  startDate?: DateInput;
  start_date?: DateInput;
  endDate?: DateInput;
  end_date?: DateInput;
  plannedStartDate?: DateInput;
  plannedEndDate?: DateInput;

  plannedStart?: DateInput;
  plannedEnd?: DateInput;
  planned_start?: DateInput;
  planned_end?: DateInput;
  planned_start_date?: DateInput;
  planned_end_date?: DateInput;

  actualStart?: DateInput;
  actualEnd?: DateInput;
  actual_start?: DateInput;
  actual_end?: DateInput;
  actual_start_date?: DateInput;
  actual_end_date?: DateInput;

  duration?: number | string;
  progress?: number | string;
  progressPercentage?: number | string;
  progress_percentage?: number | string;

  parent?: string | number | null;
  ownerName?: string;
  owner_name?: string;
  status?: Task['status'];
  currentStatus?: Task['status'];
  current_status?: Task['status'];

  onHoldPeriods?: OnHoldPeriodInput[];
  on_hold_periods?: OnHoldPeriodInput[];
  onHold?: OnHoldPeriodInput[] | OnHoldPeriodInput;
  on_hold?: OnHoldPeriodInput[] | OnHoldPeriodInput;
  onhold?: OnHoldPeriodInput[] | OnHoldPeriodInput;

  dependencies?: Array<string | number> | string;
  dependsOn?: Array<string | number> | string;
  depends_on?: Array<string | number> | string;

  dependencyRule?: string[] | string;
  dependency_rule?: string[] | string;
  dependencyRuleDescription?: string[] | string;
  dependency_rule_description?: string[] | string;

  segments?: TaskSegmentInput[];
  tooltipConfig?: Partial<TaskTooltipConfig>;
}

export interface Link {
  id: string;
  source: string;
  target: string;
  type: 'e2s' | 's2s' | 'e2e' | 's2e';
  lag?: number;
  lagUnit?: 'day' | 'hour' | 'week' | 'month';
}
```

## Tooltip Types

```ts
export interface TaskTooltipConfig {
  showTaskName?: boolean;
  showPlannedDates?: boolean;
  showActualDates?: boolean;
  showStatus?: boolean;
  showDependencyRule?: boolean;
  showProgress?: boolean;
  showOwner?: boolean;
  plannedLabel?: string;
  actualLabel?: string;
  statusLabel?: string;
  dependencyRuleLabel?: string;
  progressLabel?: string;
  ownerLabel?: string;
  dateFormat?: string;
  dependencySeparator?: string;
  emptyStatusText?: string;
  emptyOwnerText?: string;
  emptyDependencyRuleText?: string;
  taskNameAccessor?: (task: Task) => string | undefined;
  plannedStartAccessor?: (task: Task) => DateInput | undefined;
  plannedEndAccessor?: (task: Task) => DateInput | undefined;
  actualStartAccessor?: (task: Task) => DateInput | undefined;
  actualEndAccessor?: (task: Task) => DateInput | undefined;
  statusAccessor?: (task: Task) => string | undefined;
  ownerAccessor?: (task: Task) => string | undefined;
  dependencyRuleAccessor?: (task: Task, generatedRules: string[]) => string | string[] | undefined;
  progressAccessor?: (task: Task) => number | string | undefined;
  taskNameFormatter?: (taskName: string, task: Task) => string;
  plannedDatesFormatter?: (plannedStart: Date, plannedEnd: Date, task: Task) => string;
  actualDatesFormatter?: (actualStart: Date, actualEnd: Date, task: Task) => string;
  ownerFormatter?: (owner: string, task: Task) => string;
  statusFormatter?: (status?: string, task?: Task) => string;
  progressFormatter?: (progress: number, task: Task) => string;
  dependencyRuleFormatter?: (rule: string, task: Task) => string;
}
```

## Timeline and Grid Types

```ts
export interface Scale {
  unit: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  step: number;
  format?: string;
}

export type TimelineView = 'day' | 'week' | 'month';

export interface Column {
  name: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  resize?: boolean;
  sort?: boolean;
  template?: (task: Task) => React.ReactNode;
}
```

## Config Types

```ts
export interface GanttConfig {
  columns?: Column[];
  scales?: Scale[];
  timelineView?: TimelineView;
  timelineViews?: TimelineView[];
  timelineViewScales?: Partial<Record<TimelineView, Scale[]>>;
  readonly?: boolean;
  editable?: boolean;
  taskHeight?: number;
  rowHeight?: number;
  scaleHeight?: number;
  columnWidth?: number;
  minColumnWidth?: number;
  autoSchedule?: boolean;
  criticalPath?: boolean;
  baselines?: boolean;
  markers?: Marker[];
  weekends?: boolean;
  holidays?: Date[];
  theme?: 'light' | 'dark';
  locale?: string;
  containerHeight?: string;
  containerMinHeight?: string;
  gridWidth?: string;
  showTodayLine?: boolean;
  todayLineColor?: string;
  todayLineLabel?: string;
  todayLineWidth?: number;
  todayLineStyle?: 'solid' | 'dashed' | 'dotted';
  todayLineOpacity?: number;
  showProjectStartLine?: boolean;
  projectStartDate?: Date;
  projectStartLineColor?: string;
  projectStartLineLabel?: string;
  projectStartLineWidth?: number;
  projectStartLineStyle?: 'solid' | 'dashed' | 'dotted';
  projectStartLineOpacity?: number;
  todayLineLabelStyle?: React.CSSProperties;
  projectStartLineLabelStyle?: React.CSSProperties;
  showTodayLineMarker?: boolean;
  todayLineMarkerSize?: number;
  todayLineMarkerStyle?: 'triangle' | 'arrow' | 'dot';
  showProjectStartLineMarker?: boolean;
  projectStartLineMarkerSize?: number;
  projectStartLineMarkerStyle?: 'triangle' | 'arrow' | 'dot';
}

export interface GanttIconConfig {
  addTask?: React.ReactNode | string;
  zoomIn?: React.ReactNode | string;
  zoomOut?: React.ReactNode | string;
  resetZoom?: React.ReactNode | string;
  exportCSV?: React.ReactNode | string;
  exportExcel?: React.ReactNode | string;
  exportJSON?: React.ReactNode | string;
  exportPDF?: React.ReactNode | string;
  gripVertical?: React.ReactNode | string;
  chevronRight?: React.ReactNode | string;
  chevronDown?: React.ReactNode | string;
  plus?: React.ReactNode | string;
  edit?: React.ReactNode | string;
  delete?: React.ReactNode | string;
  copy?: React.ReactNode | string;
  link?: React.ReactNode | string;
  flag?: React.ReactNode | string;
  folder?: React.ReactNode | string;
  tasks?: React.ReactNode | string;
  rotateLeft?: React.ReactNode | string;
}

export interface GanttStyleConfig {
  primary?: string;
  primarySelected?: string;
  success?: string;
  warning?: string;
  danger?: string;
  background?: string;
  backgroundAlt?: string;
  backgroundHover?: string;
  selectColor?: string;
  taskColor?: string;
  taskFillColor?: string;
  projectColor?: string;
  milestoneColor?: string;
  fontColor?: string;
  fontColorAlt?: string;
  iconColor?: string;
  borderColor?: string;
  fontFamily?: string;
  fontMono?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string | number;
  spacingXS?: string;
  spacingSM?: string;
  spacingMD?: string;
  spacingLG?: string;
  popoverBackground?: string;
  popoverBorderColor?: string;
  popoverBorderRadius?: string;
  popoverShadow?: string;
  popoverPadding?: string;
  popoverMaxWidth?: string;
  popoverFontFamily?: string;
  popoverFontSize?: string;
  modalBackground?: string;
  modalBorderColor?: string;
  modalBorderRadius?: string;
  modalShadow?: string;
  modalOverlayBackground?: string;
  buttonPrimaryBackground?: string;
  buttonPrimaryColor?: string;
  buttonPrimaryHoverBackground?: string;
  buttonPrimaryBorderRadius?: string;
  buttonPrimaryFontWeight?: string | number;
  buttonPrimaryFontFamily?: string;
  buttonDangerBackground?: string;
  buttonDangerColor?: string;
  buttonDangerHoverBackground?: string;
  buttonSecondaryBackground?: string;
  buttonSecondaryColor?: string;
  buttonSecondaryBorderColor?: string;
  inputBackground?: string;
  inputBorderColor?: string;
  inputBorderRadius?: string;
  inputFocusBorderColor?: string;
  inputFontFamily?: string;
  inputFontSize?: string;
  inputPadding?: string;
  listItemHoverBackground?: string;
  listItemSelectedBackground?: string;
  listItemBorderColor?: string;
  menuBackground?: string;
  menuBorderColor?: string;
  menuItemHoverBackground?: string;
  badgeBackground?: string;
  badgeBorderColor?: string;
  badgeColor?: string;
  badgeFontSize?: string;
  badgePadding?: string;
  badgeBorderRadius?: string;
  linkColor?: string;
  linkHoverColor?: string;
  linkFontWeight?: string | number;
  customCSSVariables?: Record<string, string>;
}
```

## Interaction and Payload Types

```ts
export interface Marker {
  id: string;
  date: Date;
  text: string;
  css?: string;
}

export interface Baseline {
  taskId: string;
  start: Date;
  end: Date;
}

export interface TaskReorderMeta {
  currentSequenceId: number;
  targetSequenceId: number;
  targetStageId: string | null;
}

export interface TaskDragUpdateMeta {
  dragType: 'move' | 'resize-left' | 'resize-right';
  previousStart: Date;
  previousEnd: Date;
  previousDuration: number;
}

export interface TaskDragUpdatePayload {
  task: Task;
  previousTask: Task;
  dragType: TaskDragUpdateMeta['dragType'] | 'reorder';
  reorderMeta?: TaskReorderMeta;
}

export type ZoomLevel = number;

export interface DropIndicator {
  taskId: string;
  position: 'above' | 'below' | 'inside';
}
```

## UI Text and Labels Type

```ts
export interface GanttUIConfig {
  headerTitle?: string;
  showHeader?: boolean;
  showAddTaskButton?: boolean;
  showBaselineButton?: boolean;
  showZoomButtons?: boolean;
  showExportButtons?: boolean;
  showFilterSearch?: boolean;
  showTimelineViewSwitcher?: boolean;
  addTaskButtonText?: string;
  baselineButtonText?: string;
  baselineButtonTextActive?: string;
  zoomOutTooltip?: string;
  zoomInTooltip?: string;
  resetZoomTooltip?: string;
  exportCSVTooltip?: string;
  exportExcelTooltip?: string;
  exportJSONTooltip?: string;
  exportPDFTooltip?: string;
  hideBaselinesTooltip?: string;
  showBaselinesTooltip?: string;
  timelineViewLabels?: Partial<Record<TimelineView, string>>;
  taskCreatorTitle?: string;
  taskCreatorOkText?: string;
  taskCreatorCancelText?: string;
  taskNameLabel?: string;
  taskNamePlaceholder?: string;
  typeLabel?: string;
  priorityLabel?: string;
  startDateLabel?: string;
  durationLabel?: string;
  colorLabel?: string;
  progressLabel?: string;
  ownerLabel?: string;
  ownerPlaceholder?: string;
  detailsLabel?: string;
  detailsPlaceholder?: string;
  taskTypeOptions?: {
    task?: string;
    milestone?: string;
    project?: string;
  };
  priorityOptions?: {
    low?: string;
    medium?: string;
    high?: string;
  };
  taskEditorTitle?: string;
  taskEditorSaveText?: string;
  taskEditorCancelText?: string;
  taskEditorDeleteText?: string;
  deleteConfirmTitle?: string;
  deleteConfirmContent?: string;
  deleteConfirmOkText?: string;
  deleteConfirmCancelText?: string;
  searchPlaceholder?: string;
  allOwnersText?: string;
  allStatusText?: string;
  allPriorityText?: string;
  clearFiltersText?: string;
  statusOptions?: {
    all?: string;
    notStarted?: string;
    inProgress?: string;
    completed?: string;
  };
  priorityFilterOptions?: {
    all?: string;
    low?: string;
    medium?: string;
    high?: string;
  };
  columnLabels?: {
    name?: string;
    dependsOn?: string;
    duration?: string;
    start?: string;
  };
  taskNameRequired?: string;
}
```

## Filter Type

```ts
export interface FilterOptions {
  searchText: string;
  status: 'all' | 'not-started' | 'in-progress' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  owner: string;
  dateRange?: { start: Date; end: Date };
}
```

## Recurring Update Process

Use this checklist every time props/types change:

1. Update source types in `src/components/Gantt/Gantt.tsx`, `src/components/Gantt/types.ts`, and/or `src/components/Gantt/features/filterUtils.ts`.
2. Update this file (`PROPS_REFERENCE.md`) in the same PR/commit.
3. Run `npm run build` (or at least `npm run build:types`).
4. Update version notes in `README.md` if the change is user-facing.
5. Publish only after docs and type checks are both green.
