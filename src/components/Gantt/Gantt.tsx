import React, { useState, useRef, useEffect } from 'react';
import { Grid } from './Grid';
import { Chart } from './Chart';
import { Toolbar } from './Toolbar';
import { TaskCreator } from './TaskCreator';
import { TaskEditor } from './TaskEditor';
import { DependencyEditor } from './DependencyEditor';
import { ContextMenu } from './ContextMenu';
import type { GanttConfig, DropIndicator, ZoomLevel, Baseline, Column, Scale, GanttUIConfig, GanttStyleConfig, GanttIconConfig, TimelineView } from './types';
import { addToDate, getStartOfDay } from './utils/dateUtils';
import { useUndoRedo } from './UndoRedo';
import * as AutoScheduler from './features/AutoScheduler';
import { createBaseline } from './features/baselineUtils';
import * as ExportUtils from './features/ExportUtils';
import { applyFilters } from './features/filterUtils';
import type { FilterOptions } from './features/filterUtils';
import type {
  DateInput,
  Task,
  TaskInput,
  Link,
  TaskReorderMeta,
  OnHoldPeriodInput,
  TaskSegmentInput,
  TaskTooltipConfig,
  TaskDragUpdatePayload,
  TaskDragUpdateMeta,
} from './types';
import './gantt.css';

export interface GanttProps {
  tasks: TaskInput[];
  links?: Link[];
  config?: Partial<GanttConfig>;
  uiConfig?: Partial<GanttUIConfig>;
  styleConfig?: Partial<GanttStyleConfig>; // Colors, fonts, spacing
  iconConfig?: Partial<GanttIconConfig>; // Custom icons
  taskTooltipConfig?: Partial<TaskTooltipConfig>;
  onHoldPeriods?: OnHoldPeriodInput[]; // Project-level on-hold periods that affect all tasks
  on_hold_periods?: OnHoldPeriodInput[]; // Snake_case alias for API compatibility
  onHold?: OnHoldPeriodInput[] | OnHoldPeriodInput; // Additional API alias
  on_hold?: OnHoldPeriodInput[] | OnHoldPeriodInput; // Additional API alias
  onhold?: OnHoldPeriodInput[] | OnHoldPeriodInput; // Additional API alias
  onTaskUpdate?: (task: Task, reorderMeta?: TaskReorderMeta) => void;
  onTaskDragUpdate?: (payload: TaskDragUpdatePayload) => void | Promise<void>;
  onTaskCreate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onLinkCreate?: (link: Link) => void;
  onLinkDelete?: (linkId: string) => void;
  onTimelineViewChange?: (view: TimelineView) => void;
  showMonthHeading?: boolean;

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

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const toDate = (value: DateInput | undefined, fallback: Date): Date => {
  if (value instanceof Date) {
    const cloned = new Date(value.getTime());
    return Number.isNaN(cloned.getTime()) ? new Date(fallback.getTime()) : cloned;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date(fallback.getTime());
};

const toNumber = (value: number | string | undefined, fallback: number): number => {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

type OnHoldInput = OnHoldPeriodInput[] | OnHoldPeriodInput | undefined;

const normalizeOnHoldInput = (periods: OnHoldInput): OnHoldPeriodInput[] => {
  if (Array.isArray(periods)) {
    return periods.filter((period) => period !== undefined && period !== null);
  }
  return periods ? [periods] : [];
};

const getFirstOnHoldPeriods = (...candidates: OnHoldInput[]): OnHoldPeriodInput[] => {
  for (const candidate of candidates) {
    const normalized = normalizeOnHoldInput(candidate);
    if (normalized.length > 0) {
      return normalized;
    }
  }
  return [];
};

const normalizeDependencies = (
  value: TaskInput['dependencies']
): string[] | undefined => {
  if (Array.isArray(value)) {
    const normalized = value.map((dependencyId) => String(dependencyId).trim()).filter(Boolean);
    return normalized.length > 0 ? normalized : undefined;
  }

  if (typeof value === 'string') {
    const normalized = value
      .split(/[|,]/)
      .map((dependencyId) => dependencyId.trim())
      .filter(Boolean);
    return normalized.length > 0 ? normalized : undefined;
  }

  return undefined;
};

const normalizeDependencyRules = (value: TaskInput['dependencyRule'] | TaskInput['dependency_rule'] | TaskInput['dependencyRuleDescription'] | TaskInput['dependency_rule_description']): string[] | undefined => {
  if (Array.isArray(value)) {
    const normalized = value.map((rule) => String(rule).trim()).filter(Boolean);
    return normalized.length > 0 ? normalized : undefined;
  }

  if (typeof value === 'string') {
    const normalized = value
      .split(/\r?\n|\|/)
      .map((rule) => rule.trim())
      .filter(Boolean);
    return normalized.length > 0 ? normalized : undefined;
  }

  return undefined;
};

const normalizeOnHoldPeriods = (
  periods: OnHoldInput,
  taskStart: Date,
  taskEnd: Date
): Array<{ start: Date; end: Date }> | undefined => {
  const periodArray = normalizeOnHoldInput(periods);
  if (periodArray.length === 0) return undefined;

  const taskStartMs = taskStart.getTime();
  const taskEndMs = taskEnd.getTime();

  return periodArray
    .map((period) => {
      const rawStart = toDate(period?.start, taskStart);
      const rawEnd = toDate(period?.end, taskEnd);
      // Clamp the on-hold period to the task's date range
      const clampedStartMs = Math.max(rawStart.getTime(), taskStartMs);
      const clampedEndMs = Math.min(rawEnd.getTime(), taskEndMs);
      return {
        start: new Date(clampedStartMs),
        end: new Date(clampedEndMs),
      };
    })
    // Discard periods that fall completely outside the task range or have zero/negative duration
    .filter((period) => period.end.getTime() > period.start.getTime());
};

const normalizeSegments = (
  segments: TaskSegmentInput[] | undefined,
  taskStart: Date,
  taskEnd: Date
): Task['segments'] => {
  if (!Array.isArray(segments)) return undefined;

  return segments
    .map((segment) => {
      const start = toDate(segment?.start, taskStart);
      const endRaw = toDate(segment?.end, taskEnd);
      const end = endRaw.getTime() < start.getTime() ? start : endRaw;
      const derivedDuration = Math.max(Math.ceil((end.getTime() - start.getTime()) / MS_IN_DAY), 0);
      return {
        start,
        end,
        duration: toNumber(segment?.duration, derivedDuration),
      };
    })
    .filter((segment) => segment.end.getTime() >= segment.start.getTime());
};

const normalizeTaskInput = (task: TaskInput): Task => {
  const now = new Date();
  // Support API field names: plannedStartDate/plannedEndDate as the task bar dates
  // when no explicit start/end/start_date fields are present.
  const start = toDate(
    task.start ?? task.startDate ?? task.start_date ?? task.plannedStartDate,
    now
  );
  const endRaw = toDate(
    task.end ?? task.endDate ?? task.end_date ?? task.plannedEndDate,
    start
  );
  const end = endRaw.getTime() < start.getTime() ? start : endRaw;
  const plannedStart = toDate(task.plannedStart ?? task.planned_start ?? task.planned_start_date, start);
  const plannedEndRaw = toDate(task.plannedEnd ?? task.planned_end ?? task.planned_end_date, end);
  const plannedEnd = plannedEndRaw.getTime() < plannedStart.getTime() ? plannedStart : plannedEndRaw;
  const actualStart = toDate(task.actualStart ?? task.actual_start ?? task.actual_start_date, start);
  const actualEndRaw = toDate(task.actualEnd ?? task.actual_end ?? task.actual_end_date, end);
  const actualEnd = actualEndRaw.getTime() < actualStart.getTime() ? actualStart : actualEndRaw;
  const derivedDuration = Math.max(Math.ceil((end.getTime() - start.getTime()) / MS_IN_DAY), 0);

  const dependencies = normalizeDependencies(task.dependencies ?? task.dependsOn ?? task.depends_on);
  const dependencyRule = normalizeDependencyRules(
    task.dependencyRule ??
    task.dependency_rule ??
    task.dependencyRuleDescription ??
    task.dependency_rule_description
  );

  const onHoldPeriods = normalizeOnHoldPeriods(
    getFirstOnHoldPeriods(
      task.onHoldPeriods,
      task.on_hold_periods,
      task.onHold,
      task.on_hold,
      task.onhold
    ),
    start,
    end
  );

  return {
    id: String(task.id),
    rawId: task.id,
    // Support API field name: workGroupName as the task display name
    text: task.text || task.name || task.title || task.taskName || task.task_name || task.workGroupName || `Task ${String(task.id)}`,
    start,
    end,
    ShowHandle: task.ShowHandle ?? task.showHandle,
    plannedStart,
    plannedEnd,
    actualStart,
    actualEnd,
    duration: toNumber(task.duration, derivedDuration),
    progress: Math.max(0, Math.min(100, toNumber(task.progress ?? task.progressPercentage ?? task.progress_percentage, 0))),
    type: task.type,
    parent: task.parent !== undefined && task.parent !== null && String(task.parent).length > 0
      ? String(task.parent)
      : undefined,
    open: task.open,
    color: task.color,
    details: task.details,
    owner: task.owner || task.ownerName || task.owner_name,
    priority: task.priority,
    status: task.status ?? task.currentStatus ?? task.current_status,
    onHoldPeriods,
    dependencies,
    dependencyRule,
    segments: normalizeSegments(task.segments, start, end),
    sequence_id: task.sequence_id,
    stage_id: task.stage_id,
    tooltipConfig: task.tooltipConfig,
  };
};

const normalizeTaskInputs = (tasks: TaskInput[]): Task[] => {
  if (!Array.isArray(tasks)) return [];
  return tasks.map(normalizeTaskInput);
};

const mergeHoldPeriods = (
  periods: Array<{ start: Date; end: Date }>
): Array<{ start: Date; end: Date }> => {
  if (periods.length === 0) return [];

  const sorted = [...periods]
    .filter((period) => period.end.getTime() > period.start.getTime())
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (sorted.length === 0) return [];

  const merged: Array<{ start: Date; end: Date }> = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start.getTime() <= last.end.getTime()) {
      last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
};

const getIntersectingProjectHolds = (
  taskStartMs: number,
  taskEndMs: number,
  holdPeriods: Array<{ start: Date; end: Date }>
): Array<{ start: Date; end: Date }> => (
  holdPeriods
    .filter((hold) => taskEndMs > hold.start.getTime() && taskStartMs < hold.end.getTime())
    .map((hold) => ({
      start: new Date(hold.start.getTime()),
      end: new Date(hold.end.getTime()),
    }))
);

/**
 * Apply project-level on-hold periods as a visual overlay to all intersecting tasks.
 * This keeps task start/end/duration exactly as provided by API data and avoids
 * shifting completed tasks after the hold window.
 */
const applyProjectHoldPeriods = (
  tasks: Task[],
  holdPeriods: Array<{ start: Date; end: Date }>
): Task[] => {
  if (holdPeriods.length === 0) return tasks;

  const mergedProjectHolds = mergeHoldPeriods(holdPeriods);

  return tasks.map((task) => {
    const taskStartMs = task.start.getTime();
    const taskEndMs = task.end.getTime();
    const taskHoldOverlaps = getIntersectingProjectHolds(taskStartMs, taskEndMs, mergedProjectHolds);

    if (taskHoldOverlaps.length === 0) {
      return task;
    }

    const existingTaskHolds = task.onHoldPeriods || [];
    const mergedTaskHolds = mergeHoldPeriods([...existingTaskHolds, ...taskHoldOverlaps]);

    return {
      ...task,
      onHoldPeriods: mergedTaskHolds,
    };
  });
};

const getDefaultColumns = (uiConfig?: Partial<GanttUIConfig>): Column[] => [
  { name: 'index', label: '', width: 40, align: 'center' },
  { name: 'text', label: uiConfig?.columnLabels?.name || 'Name', width: 250, align: 'left', resize: true },
  { name: 'predecessors', label: uiConfig?.columnLabels?.dependsOn || 'Depends on', width: 120, align: 'left' },
  { name: 'duration', label: uiConfig?.columnLabels?.duration || 'Duration', width: 110, align: 'left' },
  { name: 'start', label: uiConfig?.columnLabels?.start || 'Start', width: 130, align: 'left' },
];

const defaultScales: Scale[] = [
  { unit: 'month', step: 1, format: 'MMM' },
  { unit: 'day', step: 1, format: 'D' },
];

const defaultTimelineViewScales: Record<TimelineView, Scale[]> = {
  day: [
    { unit: 'month', step: 1, format: 'MMM YYYY' },
    { unit: 'day', step: 1, format: 'D' },
  ],
  week: [
    { unit: 'month', step: 1, format: 'MMM YYYY' },
    { unit: 'week', step: 1, format: 'Week W' },
  ],
  month: [
    { unit: 'year', step: 1, format: 'YYYY' },
    { unit: 'month', step: 1, format: 'MMM' },
  ],
};

const defaultTimelineViews: TimelineView[] = ['day', 'week', 'month'];

const alignRangeDateToScale = (date: Date, scale: Scale, direction: 'start' | 'end'): Date => {
  const aligned = getStartOfDay(date);

  switch (scale.unit) {
    case 'week': {
      const dayOfWeek = aligned.getDay();
      const offset = direction === 'start' ? -dayOfWeek : 6 - dayOfWeek;
      return getStartOfDay(addToDate(aligned, offset, 'day'));
    }
    case 'month':
      return direction === 'start'
        ? new Date(aligned.getFullYear(), aligned.getMonth(), 1)
        : new Date(aligned.getFullYear(), aligned.getMonth() + 1, 0);
    case 'quarter': {
      const quarterStartMonth = Math.floor(aligned.getMonth() / 3) * 3;
      return direction === 'start'
        ? new Date(aligned.getFullYear(), quarterStartMonth, 1)
        : new Date(aligned.getFullYear(), quarterStartMonth + 3, 0);
    }
    case 'year':
      return direction === 'start'
        ? new Date(aligned.getFullYear(), 0, 1)
        : new Date(aligned.getFullYear(), 11, 31);
    default:
      return aligned;
  }
};

const defaultTaskTooltipConfig: TaskTooltipConfig = {
  showTaskName: true,
  showPlannedDates: true,
  showActualDates: true,
  showStatus: true,
  showDependencyRule: true,
  showProgress: true,
  showOwner: true,
  plannedLabel: 'Planned',
  actualLabel: 'Actual',
  statusLabel: 'Status',
  dependencyRuleLabel: 'Dependency Rule',
  progressLabel: 'Progress',
  ownerLabel: 'Owner',
  dateFormat: 'MMM D, YYYY',
  dependencySeparator: ' | ',
  emptyStatusText: 'Not set',
  emptyOwnerText: 'Not assigned',
  emptyDependencyRuleText: 'No dependency rule',
};

// Default UI configuration
const defaultUIConfig: GanttUIConfig = {
  headerTitle: 'Iris Gantt',
  showHeader: true,
  showAddTaskButton: true,
  showBaselineButton: false, // Baselines are always visible, no button needed
  showZoomButtons: true,
  showExportButtons: true,
  showFilterSearch: true,
  showTimelineViewSwitcher: true,
  addTaskButtonText: 'New Task',
  baselineButtonText: 'Set Baseline',
  baselineButtonTextActive: 'Baselines',
  zoomOutTooltip: 'Zoom Out',
  zoomInTooltip: 'Zoom In',
  resetZoomTooltip: 'Reset Zoom',
  exportCSVTooltip: 'Export to CSV',
  exportExcelTooltip: 'Export to Excel',
  exportJSONTooltip: 'Export to JSON',
  exportPDFTooltip: 'Export to PDF',
  hideBaselinesTooltip: 'Hide Baselines',
  showBaselinesTooltip: 'Show Baselines',
  timelineViewLabels: {
    day: 'Days',
    week: 'Weeks',
    month: 'Months',
  },
  taskCreatorTitle: 'Create New Task',
  taskCreatorOkText: 'Create Task',
  taskCreatorCancelText: 'Cancel',
  taskNameLabel: 'Task Name',
  taskNamePlaceholder: 'Enter task name',
  typeLabel: 'Type',
  priorityLabel: 'Priority',
  startDateLabel: 'Start Date',
  durationLabel: 'Duration (days)',
  colorLabel: 'Color',
  progressLabel: 'Progress (%)',
  ownerLabel: 'Owner',
  ownerPlaceholder: 'Assign to...',
  detailsLabel: 'Details',
  detailsPlaceholder: 'Add task description...',
  taskTypeOptions: {
    task: 'Task',
    milestone: 'Milestone',
    project: 'Project',
  },
  priorityOptions: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
  taskEditorTitle: 'Edit Task',
  taskEditorSaveText: 'Save Changes',
  taskEditorCancelText: 'Cancel',
  taskEditorDeleteText: 'Delete',
  deleteConfirmTitle: 'Delete Task',
  deleteConfirmContent: 'This action cannot be undone.',
  deleteConfirmOkText: 'Yes, Delete',
  deleteConfirmCancelText: 'No',
  searchPlaceholder: 'Search tasks...',
  allOwnersText: 'All Owners',
  allStatusText: 'All Status',
  allPriorityText: 'All Priority',
  clearFiltersText: 'Clear',
  statusOptions: {
    all: 'All Status',
    notStarted: 'Not Started',
    inProgress: 'In Progress',
    completed: 'Completed',
  },
  priorityFilterOptions: {
    all: 'All Priority',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
  columnLabels: {
    name: 'Name',
    dependsOn: 'Depends on',
    duration: 'Duration',
    start: 'Start',
  },
  taskNameRequired: 'Please enter task name',
};

export const Gantt: React.FC<GanttProps> = ({
  tasks: initialTasks = [],
  links: initialLinks = [],
  config = {},
  uiConfig = {},
  styleConfig = {},
  iconConfig = {},
  taskTooltipConfig = {},
  onHoldPeriods,
  on_hold_periods,
  onHold,
  on_hold,
  onhold,
  onTaskUpdate,
  onTaskDragUpdate,
  onTaskCreate,
  onTaskDelete,
  onLinkCreate,
  onLinkDelete,
  onTimelineViewChange,
  baselines: externalBaselines,
  showMonthHeading,
}) => {
  // Merge UI config with defaults
  const ui: GanttUIConfig = { ...defaultUIConfig, ...uiConfig };
  const mergedTaskTooltipConfig: TaskTooltipConfig = { ...defaultTaskTooltipConfig, ...taskTooltipConfig };
  const hasTimelineViewFeature = Boolean(
    config.timelineView ||
    (Array.isArray(config.timelineViews) && config.timelineViews.length > 0) ||
    config.timelineViewScales
  );
  const timelineViews = React.useMemo(() => {
    if (!hasTimelineViewFeature) return [] as TimelineView[];

    const sourceViews = Array.isArray(config.timelineViews) && config.timelineViews.length > 0
      ? config.timelineViews
      : defaultTimelineViews;

    return Array.from(new Set(sourceViews.filter((view): view is TimelineView => defaultTimelineViews.includes(view))));
  }, [config.timelineViews, hasTimelineViewFeature]);
  const resolvedTimelineViewScales = React.useMemo(
    () => ({
      ...defaultTimelineViewScales,
      ...config.timelineViewScales,
    }),
    [config.timelineViewScales]
  );
  const initialTimelineView = React.useMemo<TimelineView>(() => {
    if (hasTimelineViewFeature && config.timelineView && timelineViews.includes(config.timelineView)) {
      return config.timelineView;
    }
    if (hasTimelineViewFeature && timelineViews.length > 0) {
      return timelineViews[0];
    }
    return 'day';
  }, [config.timelineView, hasTimelineViewFeature, timelineViews]);

  // Apply style config via CSS variables
  const styleVariables: React.CSSProperties = React.useMemo(() => {
    const vars: Record<string, string> = {};

    if (styleConfig.primary) vars['--wx-gantt-primary'] = styleConfig.primary;
    if (styleConfig.primarySelected) vars['--wx-gantt-primary-selected'] = styleConfig.primarySelected;
    if (styleConfig.success) vars['--wx-gantt-success'] = styleConfig.success;
    if (styleConfig.warning) vars['--wx-gantt-warning'] = styleConfig.warning;
    if (styleConfig.danger) vars['--wx-gantt-danger'] = styleConfig.danger;
    if (styleConfig.background) vars['--wx-gantt-background'] = styleConfig.background;
    if (styleConfig.backgroundAlt) vars['--wx-gantt-background-alt'] = styleConfig.backgroundAlt;
    if (styleConfig.backgroundHover) vars['--wx-gantt-background-hover'] = styleConfig.backgroundHover;
    if (styleConfig.selectColor) vars['--wx-gantt-select-color'] = styleConfig.selectColor;
    if (styleConfig.taskColor) vars['--wx-gantt-task-color'] = styleConfig.taskColor;
    if (styleConfig.taskFillColor) vars['--wx-gantt-task-fill-color'] = styleConfig.taskFillColor;
    if (styleConfig.projectColor) vars['--wx-gantt-project-color'] = styleConfig.projectColor;
    if (styleConfig.milestoneColor) vars['--wx-gantt-milestone-color'] = styleConfig.milestoneColor;
    if (styleConfig.fontColor) vars['--wx-gantt-font-color'] = styleConfig.fontColor;
    if (styleConfig.fontColorAlt) vars['--wx-gantt-font-color-alt'] = styleConfig.fontColorAlt;
    if (styleConfig.iconColor) vars['--wx-gantt-icon-color'] = styleConfig.iconColor;
    if (styleConfig.borderColor) vars['--wx-gantt-border-color'] = styleConfig.borderColor;

    if (styleConfig.fontFamily) vars['--wx-gantt-font-family'] = styleConfig.fontFamily;
    if (styleConfig.fontMono) vars['--wx-gantt-font-mono'] = styleConfig.fontMono;
    if (styleConfig.fontSize) vars['--wx-gantt-font-size'] = styleConfig.fontSize;
    if (styleConfig.fontWeight) vars['--wx-gantt-font-weight'] = String(styleConfig.fontWeight);
    if (styleConfig.lineHeight) vars['--wx-gantt-line-height'] = String(styleConfig.lineHeight);

    if (styleConfig.spacingXS) vars['--gantt-spacing-xs'] = styleConfig.spacingXS;
    if (styleConfig.spacingSM) vars['--gantt-spacing-sm'] = styleConfig.spacingSM;
    if (styleConfig.spacingMD) vars['--gantt-spacing-md'] = styleConfig.spacingMD;
    if (styleConfig.spacingLG) vars['--gantt-spacing-lg'] = styleConfig.spacingLG;

    // Custom CSS variables
    if (styleConfig.customCSSVariables) {
      Object.entries(styleConfig.customCSSVariables).forEach(([key, value]) => {
        vars[key.startsWith('--') ? key : `--${key}`] = value;
      });
    }

    return vars as React.CSSProperties;
  }, [styleConfig]);
  // Normalize project-level on-hold periods (supports both camelCase and snake_case props)
  const normalizedProjectHolds = React.useMemo(() => {
    const projectHoldPeriodsInput = getFirstOnHoldPeriods(
      onHoldPeriods,
      on_hold_periods,
      onHold,
      on_hold,
      onhold
    );
    if (projectHoldPeriodsInput.length === 0) return [];
    const now = new Date();
    return projectHoldPeriodsInput
      .map((p: OnHoldPeriodInput) => ({
        start: toDate(p.start, now),
        end: toDate(p.end, now),
      }))
      .filter((p: { start: Date; end: Date }) => p.end.getTime() > p.start.getTime());
  }, [onHoldPeriods, on_hold_periods, onHold, on_hold, onhold]);

  // Defensive checks — normalize tasks, then apply project-level hold periods
  const safeTasks = React.useMemo(() => {
    const normalized = normalizeTaskInputs(initialTasks);
    return applyProjectHoldPeriods(normalized, normalizedProjectHolds);
  }, [initialTasks, normalizedProjectHolds]);
  const safeLinks = Array.isArray(initialLinks) ? initialLinks : [];
  // Undo/Redo system
  const {
    tasks,
    links,
    setTasks,
    setLinks,
    undo,
    redo,
    updateTask,
    createTask: createTaskWithHistory,
    deleteTask: deleteTaskWithHistory,
    saveState,
  } = useUndoRedo(safeTasks, safeLinks);

  // State management
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [taskCreatorParentId, setTaskCreatorParentId] = useState<string | undefined>(undefined);
  const [taskCreatorParentName, setTaskCreatorParentName] = useState<string | undefined>(undefined);
  const [showDependencyEditor, setShowDependencyEditor] = useState(false);
  const [dependencyEditTask, setDependencyEditTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [reorderTask, setReorderTask] = useState<{ id: string; initialIndex: number; currentX: number; currentY: number; descendantIds: string[] } | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; task: Task | null } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [timelineView, setTimelineView] = useState<TimelineView>(initialTimelineView);
  // Baselines are always visible - auto-created when tasks are first created
  // Baselines represent the original plan and remain fixed even when tasks are moved/resized
  const [baselines, setBaselines] = useState<Map<string, Baseline>>(() => {
    // 1. Priority to external baselines if provided
    if (externalBaselines && externalBaselines.size > 0) {
      return externalBaselines;
    }
    // 2. Initialize baselines from initial tasks (only for tasks that don't have baselines yet)
    // This captures the original plan when tasks are first loaded
    if (safeTasks.length > 0) {
      return createBaseline(safeTasks);
    }
    return new Map();
  });

  // Sync with external baselines if they change
  useEffect(() => {
    if (externalBaselines && externalBaselines.size > 0) {
      setBaselines(externalBaselines);
    }
  }, [externalBaselines]);

  useEffect(() => {
    if (hasTimelineViewFeature) {
      setTimelineView(initialTimelineView);
    }
  }, [hasTimelineViewFeature, initialTimelineView]);

  const [currentTheme] = useState<'light' | 'dark'>((config.theme as 'light' | 'dark') || 'light');
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: '',
    status: 'all',
    priority: 'all',
    owner: '',
  });

  const timelineRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const activeTimelineView = hasTimelineViewFeature && timelineViews.includes(timelineView)
    ? timelineView
    : initialTimelineView;
  const activeScales = hasTimelineViewFeature
    ? (resolvedTimelineViewScales[activeTimelineView] || defaultTimelineViewScales[activeTimelineView])
    : (config.scales || defaultScales);
  const showTimelineViewSwitcher = hasTimelineViewFeature && ui.showTimelineViewSwitcher !== false && timelineViews.length > 1;
  const timelineViewOptions = showTimelineViewSwitcher
    ? timelineViews.map((view) => ({
      value: view,
      label: ui.timelineViewLabels?.[view] || `${view.charAt(0).toUpperCase()}${view.slice(1)}s`,
    }))
    : [];
  const headerRowCount = hasTimelineViewFeature ? Math.max(activeScales.length, 1) : 3;

  const ganttConfigDefaults: GanttConfig = {
    columns: config.columns || getDefaultColumns(uiConfig),
    readonly: false,
    editable: true,
    taskHeight: 28,
    rowHeight: 48,
    scaleHeight: 28,
    columnWidth: 80,
    minColumnWidth: 60,
    autoSchedule: false,
    criticalPath: false,
    weekends: true,
    holidays: [],
    theme: currentTheme,
    locale: 'en',
    // Today and Project Start lines - enabled by default, labels visible by default
    showTodayLine: config.showTodayLine !== false, // Default: true
    todayLineColor: config.todayLineColor || '#ff4d4f', // Red
    todayLineLabel: config.todayLineLabel !== undefined ? config.todayLineLabel : 'Today', // Default: 'Today'
    todayLineWidth: config.todayLineWidth || 1, // Line width in pixels (default: 1px for thin line)
    todayLineStyle: config.todayLineStyle || 'solid', // 'solid' | 'dashed' | 'dotted'
    todayLineOpacity: config.todayLineOpacity !== undefined ? config.todayLineOpacity : 1, // 0-1
    todayLineLabelStyle: config.todayLineLabelStyle, // Custom label styles
    showTodayLineMarker: config.showTodayLineMarker !== false, // Default: true
    todayLineMarkerSize: config.todayLineMarkerSize || 8, // Marker size in pixels
    todayLineMarkerStyle: config.todayLineMarkerStyle || 'triangle', // Marker style
    showProjectStartLine: config.showProjectStartLine !== false, // Default: true
    projectStartDate: config.projectStartDate, // Will be calculated from tasks if not provided
    projectStartLineColor: config.projectStartLineColor || '#40a9ff', // Light blue
    projectStartLineLabel: config.projectStartLineLabel !== undefined ? config.projectStartLineLabel : 'Start Project', // Default: 'Start Project'
    projectStartLineWidth: config.projectStartLineWidth || 1, // Line width in pixels (default: 1px for thin line)
    projectStartLineStyle: config.projectStartLineStyle || 'solid', // 'solid' | 'dashed' | 'dotted'
    projectStartLineOpacity: config.projectStartLineOpacity !== undefined ? config.projectStartLineOpacity : 1, // 0-1
    projectStartLineLabelStyle: config.projectStartLineLabelStyle, // Custom label styles
    showProjectStartLineMarker: config.showProjectStartLineMarker !== false, // Default: true
    projectStartLineMarkerSize: config.projectStartLineMarkerSize || 8, // Marker size in pixels
    projectStartLineMarkerStyle: config.projectStartLineMarkerStyle || 'triangle', // Marker style
  };

  const ganttConfig: GanttConfig = {
    ...ganttConfigDefaults,
    ...config,
    scales: activeScales,
    timelineView: hasTimelineViewFeature ? activeTimelineView : config.timelineView,
    timelineViews: hasTimelineViewFeature ? timelineViews : config.timelineViews,
    timelineViewScales: hasTimelineViewFeature ? resolvedTimelineViewScales : config.timelineViewScales,
    // IMPORTANT: Re-apply baselines after spread so undefined from config doesn't override the default.
    // baselines should always be true unless the user explicitly passes false.
    baselines: config.baselines !== false,
    showMonthHeading: showMonthHeading !== undefined ? showMonthHeading : config.showMonthHeading,
  };

  // Update filtered tasks when filters or tasks change
  useEffect(() => {
    const userFiltered = applyFilters(tasks, filters);

    const getVisibleTasks = (allTasks: Task[]) => {
      const visibleTasks: Task[] = [];
      const isParentClosed = (taskId?: string): boolean => {
        if (!taskId) return false;
        const parent = allTasks.find(t => t.id === taskId);
        if (parent && !parent.open && parent.type === 'project') return true;
        return isParentClosed(parent?.parent);
      };

      allTasks.forEach(task => {
        if (!isParentClosed(task.parent)) {
          visibleTasks.push(task);
        }
      });
      return visibleTasks;
    };

    setFilteredTasks(getVisibleTasks(userFiltered));
  }, [tasks, filters]);

  // Safely extract owners with defensive checks
  const owners = React.useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    try {
      return Array.from(new Set(tasks.map(t => t?.owner).filter(Boolean))) as string[];
    } catch (error) {
      console.warn('Error extracting owners:', error);
      return [];
    }
  }, [tasks]);

  const getTimelineRange = () => {
    const timelineScale = activeScales[1] || activeScales[0];
    const activeTasks = filteredTasks.length > 0 ? filteredTasks : tasks;
    if (activeTasks.length === 0) {
      const today = new Date();
      return {
        start: alignRangeDateToScale(addToDate(today, -30, 'day'), timelineScale, 'start'),
        end: alignRangeDateToScale(addToDate(today, 60, 'day'), timelineScale, 'end'),
      };
    }
    const starts = activeTasks.map(t => t.start.getTime());
    const ends = activeTasks.map(t => t.end.getTime());
    const minStart = new Date(Math.min(...starts));
    const maxEnd = new Date(Math.max(...ends));
    return {
      start: alignRangeDateToScale(addToDate(minStart, -7, 'day'), timelineScale, 'start'),
      end: alignRangeDateToScale(maxEnd, timelineScale, 'end'),
    };
  };

  const range = getTimelineRange();

  const handleTimelineViewSelect = (view: TimelineView) => {
    if (!timelineViews.includes(view) || view === activeTimelineView) return;
    setTimelineView(view);
    onTimelineViewChange?.(view);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
  };

  const handleContextMenu = (e: React.MouseEvent, taskId: string) => {
    if (ganttConfig.readonly) return;
    e.preventDefault();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setContextMenu({ x: e.clientX, y: e.clientY, task });
    }
  };

  const handleCopyTask = () => {
    if (!contextMenu?.task) return;
    const task = contextMenu.task;
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      text: `${task.text} (Copy)`,
      start: addToDate(task.start, 7, 'day'),
      end: addToDate(task.end, 7, 'day'),
    };
    createTaskWithHistory(newTask);
    if (onTaskCreate) onTaskCreate(newTask);
  };

  const handleConvertTaskType = (newType: 'task' | 'milestone' | 'project') => {
    if (!contextMenu?.task) return;
    const updatedTask = { ...contextMenu.task, type: newType };
    updateTask(updatedTask);
    if (onTaskUpdate) onTaskUpdate(updatedTask);
  };

  const getDescendantIds = React.useCallback((parentId: string, allTasks: Task[]): string[] => {
    let ids: string[] = [];
    const children = allTasks.filter(t => t.parent === parentId);
    children.forEach(child => {
      ids.push(child.id);
      ids = [...ids, ...getDescendantIds(child.id, allTasks)];
    });
    return ids;
  }, []);

  const isSameParent = (first?: string | null, second?: string | null) => (first ?? null) === (second ?? null);

  const handleTaskDragStart = (taskId: string, clientX: number, clientY: number, type?: 'reorder') => {
    if (ganttConfig.readonly) return;
    if (type === 'reorder') {
      const index = filteredTasks.findIndex(t => t.id === taskId);
      const descendantIds = getDescendantIds(taskId, tasks);
      setReorderTask({ id: taskId, initialIndex: index, currentX: clientX, currentY: clientY, descendantIds });
      document.body.classList.add('gantt-dragging');
    } else {
      setDraggedTask(taskId);
    }
  };

  const handleTaskDragEnd = () => {
    if (reorderTask && dropIndicator) {
      const sourceTask = tasks.find(t => t.id === reorderTask.id);
      const targetTask = tasks.find(t => t.id === dropIndicator.taskId);
      if (sourceTask && targetTask && sourceTask.id !== targetTask.id) {
        const groupToMoveIds = [sourceTask.id, ...reorderTask.descendantIds];
        if (!groupToMoveIds.includes(targetTask.id)) {
          const newTasks = [...tasks];
          const newParentId: string | undefined = (dropIndicator.position === 'inside' ? targetTask.id : targetTask.parent) ?? undefined;
          const sourceIdxInFull = newTasks.findIndex(t => t.id === sourceTask.id);
          if (sourceIdxInFull !== -1) newTasks[sourceIdxInFull] = { ...newTasks[sourceIdxInFull], parent: newParentId };
          const currentGroupTasks = newTasks.filter(t => groupToMoveIds.includes(t.id));
          const remainingTasks = newTasks.filter(t => !groupToMoveIds.includes(t.id));
          let insertIdx = remainingTasks.findIndex(t => t.id === targetTask.id);
          if (dropIndicator.position === 'inside') {
            // Insert after the full target subtree (not just direct children).
            const targetSubtreeIds = [targetTask.id, ...getDescendantIds(targetTask.id, remainingTasks)];
            const lastTargetSubtreeId = targetSubtreeIds[targetSubtreeIds.length - 1];
            insertIdx = remainingTasks.findIndex(t => t.id === lastTargetSubtreeId) + 1;
          } else if (dropIndicator.position === 'below') {
            const targetDescendants = getDescendantIds(targetTask.id, remainingTasks);
            if (targetDescendants.length > 0) insertIdx = remainingTasks.findIndex(t => t.id === targetDescendants[targetDescendants.length - 1]) + 1;
            else insertIdx++;
          }
          if (insertIdx < 0) insertIdx = remainingTasks.length;
          const beforeState = { tasks: [...tasks], links: [...links] };
          remainingTasks.splice(insertIdx, 0, ...currentGroupTasks);
          setTasks(remainingTasks);
          saveState('task_update', beforeState, { tasks: remainingTasks, links });

          // Calculate sequence IDs relative to siblings (within the parent/stage)
          const currentSiblings = tasks.filter(t => isSameParent(t.parent, sourceTask.parent));
          const currentSequenceId = currentSiblings.findIndex(t => t.id === sourceTask.id) + 1;

          const targetSiblings = remainingTasks.filter(t => isSameParent(t.parent, newParentId));
          const targetSequenceId = targetSiblings.findIndex(t => t.id === sourceTask.id) + 1;

          const reorderMeta: TaskReorderMeta = {
            currentSequenceId,
            targetSequenceId,
            targetStageId: newParentId ?? null,
          };

          const reorderedTask = remainingTasks.find(t => t.id === sourceTask.id);
          if (reorderedTask) {
            const taskWithMeta = {
              ...reorderedTask,
              sequence_id: targetSequenceId,
              stage_id: newParentId ?? null,
            };
            if (onTaskUpdate) {
              onTaskUpdate(taskWithMeta, reorderMeta);
            }
            if (onTaskDragUpdate) {
              onTaskDragUpdate({
                task: taskWithMeta,
                previousTask: sourceTask,
                dragType: 'reorder',
                reorderMeta,
              });
            }
          }
        }
      }
    }
    setDraggedTask(null);
    setReorderTask(null);
    setDropIndicator(null);
    document.body.classList.remove('gantt-dragging');
  };

  // Throttle mouse move for performance
  const mouseMoveTimeoutRef = useRef<number | null>(null);
  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (reorderTask) {
      const { clientX, clientY } = e;
      // Throttle to 16ms (60fps) for smooth performance
      if (mouseMoveTimeoutRef.current) {
        cancelAnimationFrame(mouseMoveTimeoutRef.current);
      }
      mouseMoveTimeoutRef.current = requestAnimationFrame(() => {
        const rowHeight = ganttConfig.rowHeight || 48;
        const gridBody = gridContainerRef.current?.querySelector('.gantt-grid-body');
        if (!gridBody || filteredTasks.length === 0) {
          setDropIndicator(null);
          return;
        }
        const rect = gridBody.getBoundingClientRect();
        // Include vertical scroll offset so hit-testing works when the grid is scrolled.
        const relativeY = clientY - rect.top + gridBody.scrollTop;
        let index = Math.floor(relativeY / rowHeight);
        index = Math.max(0, Math.min(index, filteredTasks.length - 1));
        const taskAtPointer = filteredTasks[index];
        if (taskAtPointer) {
          const isSelfOrDescendant = taskAtPointer.id === reorderTask.id || reorderTask.descendantIds.includes(taskAtPointer.id);
          if (isSelfOrDescendant) {
            setDropIndicator(null);
            setReorderTask(prev => prev ? { ...prev, currentX: clientX, currentY: clientY } : null);
            return;
          }

          const offsetInRow = relativeY - (index * rowHeight);
          let position: 'above' | 'below' | 'inside' = 'above';
          // Allow nesting for all non-milestone rows.
          if (taskAtPointer.type !== 'milestone') {
            if (offsetInRow < rowHeight * 0.3) position = 'above';
            else if (offsetInRow > rowHeight * 0.7) position = 'below';
            else position = 'inside';
          } else {
            position = offsetInRow < rowHeight / 2 ? 'above' : 'below';
          }
          setDropIndicator({ taskId: taskAtPointer.id, position });
        }
        setReorderTask(prev => prev ? { ...prev, currentX: clientX, currentY: clientY } : null);
      });
    }
  }, [reorderTask, filteredTasks, ganttConfig.rowHeight]);

  const handleMouseUp = () => {
    if (reorderTask) handleTaskDragEnd();
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id'>, parentId?: string) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      parent: parentId, // Set parent if provided (for subtasks)
    };
    createTaskWithHistory(newTask);

    // Automatically create baseline for new task with its initial dates
    // This baseline will remain fixed even when the task is moved/resized
    // The baseline represents the "original plan" and only the actual task bar will change
    const newBaseline: Baseline = {
      taskId: newTask.id,
      start: new Date(newTask.start), // Capture original start date
      end: new Date(newTask.end), // Capture original end date
    };
    setBaselines(prev => {
      const updated = new Map(prev);
      updated.set(newTask.id, newBaseline);
      return updated;
    });

    if (onTaskCreate) onTaskCreate(newTask);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask);
    if (onTaskUpdate) onTaskUpdate(updatedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskWithHistory(taskId);
    // Remove baseline when task is deleted
    setBaselines(prev => {
      const updated = new Map(prev);
      updated.delete(taskId);
      return updated;
    });
    if (onTaskDelete) onTaskDelete(taskId);
  };

  const handleAddDependency = (sourceId: string, targetId: string, type: Link['type'], lag?: number) => {
    const newLink: Link = { id: `link-${Date.now()}`, source: sourceId, target: targetId, type, lag };
    setLinks([...links, newLink]);
    if (onLinkCreate) onLinkCreate(newLink);
  };

  const handleRemoveDependency = (linkId: string) => {
    const newLinks = links.filter(l => l.id !== linkId);
    setLinks(newLinks);
    if (onLinkDelete) onLinkDelete(linkId);
  };

  // Auto-create baselines ONLY for new tasks when they are first created
  // Baselines represent the original plan and should NOT change when tasks are moved/resized
  // Only create baselines for tasks that don't have one yet
  useEffect(() => {
    if (externalBaselines && externalBaselines.size > 0) {
      return; // Do not auto-generate if baselines are fully managed externally
    }

    const newBaselines = new Map(baselines);
    let hasNewBaselines = false;

    tasks.forEach(task => {
      // Only create baseline if task doesn't have one yet
      if (!baselines.has(task.id)) {
        newBaselines.set(task.id, {
          taskId: task.id,
          start: new Date(task.plannedStart ?? task.start), // Use planned dates if available
          end: new Date(task.plannedEnd ?? task.end), // Use planned dates if available
        });
        hasNewBaselines = true;
      }
      // Do NOT update existing baselines - they remain fixed at original task dates
    });

    // Remove baselines for deleted tasks
    const taskIds = new Set(tasks.map(t => t.id));
    baselines.forEach((_baseline, taskId) => {
      if (!taskIds.has(taskId)) {
        newBaselines.delete(taskId);
        hasNewBaselines = true;
      }
    });

    if (hasNewBaselines) {
      setBaselines(newBaselines);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, externalBaselines]); // Only depend on tasks, not baselines to avoid loops

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Synchronize vertical scrolling between Grid and Timeline
  useEffect(() => {
    const gridBody = gridContainerRef.current?.querySelector('.gantt-grid-body');
    const timelineBody = timelineRef.current?.querySelector('.gantt-timeline-body');

    if (!gridBody || !timelineBody) return;

    const handleGridScroll = () => {
      if (isScrollingRef.current === 'timeline') return;
      isScrollingRef.current = 'grid';
      timelineBody.scrollTop = gridBody.scrollTop;
      requestAnimationFrame(() => { isScrollingRef.current = null; });
    };

    const handleTimelineScroll = () => {
      if (isScrollingRef.current === 'grid') return;
      isScrollingRef.current = 'timeline';
      gridBody.scrollTop = timelineBody.scrollTop;
      requestAnimationFrame(() => { isScrollingRef.current = null; });
    };

    gridBody.addEventListener('scroll', handleGridScroll, { passive: true });
    timelineBody.addEventListener('scroll', handleTimelineScroll, { passive: true });

    return () => {
      gridBody.removeEventListener('scroll', handleGridScroll);
      timelineBody.removeEventListener('scroll', handleTimelineScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [filteredTasks]);


  // Apply responsive container styles
  const containerStyle: React.CSSProperties = {
    height: config.containerHeight || '100%',
    minHeight: config.containerMinHeight || '400px',
  };

  // Keep rendered row height in sync with all drag/link position calculations
  const layoutCssVars: React.CSSProperties = {
    '--gantt-row-height': `${ganttConfig.rowHeight || 48}px`,
    '--gantt-header-rows': String(headerRowCount),
  } as React.CSSProperties;

  // Apply grid width if specified
  const gridWidthStyle = config.gridWidth ? { '--gantt-grid-width': config.gridWidth } as React.CSSProperties : {};

  return (
    <div
      className={`gantt-page-wrapper theme-${currentTheme}`}
      style={{ ...containerStyle, ...styleVariables }}
    >
      {ui.showHeader && (
        <div className="gantt-page-header">
          <div className="gantt-page-header-left"><h1 className="gantt-page-title">{ui.headerTitle}</h1></div>
        </div>
      )}

      <div
        className={`gantt-container theme-${ganttConfig.theme}`}
        ref={containerRef}
        style={{ ...gridWidthStyle, ...layoutCssVars }}
      >
        <Toolbar
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          timelineView={showTimelineViewSwitcher ? activeTimelineView : undefined}
          timelineViewOptions={timelineViewOptions}
          onTimelineViewChange={showTimelineViewSwitcher ? handleTimelineViewSelect : undefined}
          onExport={(type) => {
            if (type === 'csv') ExportUtils.exportToCSV(tasks);
            if (type === 'excel') ExportUtils.exportToExcel(tasks);
            if (type === 'json') ExportUtils.exportToJSON(tasks, links);
            if (type === 'pdf') ExportUtils.exportToPDF(tasks);
          }}
          onFilterChange={(f: FilterOptions) => setFilters(f)}
          owners={owners || []}
          onAddTask={(parentId) => {
            if (parentId) {
              const parentTask = tasks.find(t => t.id === parentId);
              setTaskCreatorParentId(parentId);
              setTaskCreatorParentName(parentTask?.text);
            } else {
              setTaskCreatorParentId(undefined);
              setTaskCreatorParentName(undefined);
            }
            setShowTaskCreator(true);
          }}
          uiConfig={ui}
          iconConfig={iconConfig}
          styleConfig={styleConfig}
        />

        <div className="gantt-layout" ref={layoutRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <Grid
            ref={gridContainerRef}
            tasks={filteredTasks}
            columns={ganttConfig.columns || []}
            selectedTask={selectedTask}
            onTaskClick={handleTaskClick}
            onTaskContextMenu={handleContextMenu}
            onTaskUpdate={handleUpdateTask}
            onTaskDragStart={handleTaskDragStart}
            onAddTask={(parentId) => {
              if (parentId) {
                const parentTask = tasks.find(t => t.id === parentId);
                setTaskCreatorParentId(parentId);
                setTaskCreatorParentName(parentTask?.text);
              } else {
                setTaskCreatorParentId(undefined);
                setTaskCreatorParentName(undefined);
              }
              setShowTaskCreator(true);
            }}
            onAddDependency={handleAddDependency}
            onRemoveDependency={handleRemoveDependency}
            onDependencyClick={(taskId) => {
              const task = tasks.find(t => t.id === taskId);
              if (task) {
                setDependencyEditTask(task);
                setShowDependencyEditor(true);
              }
            }}
            links={links}
            allTasks={tasks}
            dropIndicator={dropIndicator}
            reorderTask={reorderTask}
            iconConfig={iconConfig}
            styleConfig={styleConfig}
          />
          <Chart
            ref={timelineRef}
            tasks={filteredTasks}
            links={links}
            range={range}
            scales={ganttConfig.scales!}
            config={ganttConfig}
            selectedTask={selectedTask}
            draggedTask={draggedTask}
            onTaskClick={() => { }}
            onTaskDragStart={() => { }}
            onTaskDragEnd={() => { }}
            onTaskUpdate={(id, updates, dragMeta?: TaskDragUpdateMeta) => {
              const task = tasks.find(t => t.id === id);
              if (!task) return;

              const previousTask = { ...task };
              const updatedTask = { ...task, ...updates };
              handleUpdateTask(updatedTask);

              if (dragMeta && onTaskDragUpdate) {
                onTaskDragUpdate({
                  task: updatedTask,
                  previousTask,
                  dragType: dragMeta.dragType,
                });
              }
            }}
            zoomLevel={zoomLevel}
            baselines={baselines}
            taskTooltipConfig={mergedTaskTooltipConfig}
          />
        </div>

        {showTaskCreator && (
          <TaskCreator
            onCreateTask={handleCreateTask}
            onClose={() => {
              setShowTaskCreator(false);
              setTaskCreatorParentId(undefined);
              setTaskCreatorParentName(undefined);
            }}
            uiConfig={ui}
            parentId={taskCreatorParentId}
            parentTaskName={taskCreatorParentName}
            styleConfig={styleConfig}
          />
        )}
        {editingTask && <TaskEditor task={editingTask} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} onClose={() => setEditingTask(null)} uiConfig={ui} styleConfig={styleConfig} />}
        {showDependencyEditor && dependencyEditTask && (
          <DependencyEditor
            task={dependencyEditTask}
            allTasks={tasks}
            links={links}
            onAddDependency={handleAddDependency}
            onRemoveDependency={handleRemoveDependency}
            onTaskUpdate={handleUpdateTask}
            onClose={() => { setShowDependencyEditor(false); setDependencyEditTask(null); }}
            styleConfig={styleConfig}
          />
        )}

        {contextMenu && (
          <>
            <div className="gantt-context-menu-overlay" onClick={() => setContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }} />
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              task={contextMenu.task}
              onEdit={() => { if (contextMenu.task) setEditingTask(contextMenu.task); }}
              onDelete={() => { if (contextMenu.task) handleDeleteTask(contextMenu.task.id); }}
              onCopy={handleCopyTask}
              onDependencies={() => { if (contextMenu.task) { setDependencyEditTask(contextMenu.task); setShowDependencyEditor(true); } }}
              onConvertToMilestone={() => handleConvertTaskType('milestone')}
              onConvertToTask={() => handleConvertTaskType('task')}
              onConvertToProject={() => handleConvertTaskType('project')}
              onClose={() => setContextMenu(null)}
              onAutoSchedule={() => {
                const scheduled = AutoScheduler.autoSchedule(tasks, links, { mode: 'forward' });
                setTasks(scheduled);
                setContextMenu(null);
              }}
              iconConfig={iconConfig}
              styleConfig={styleConfig}
            />
          </>
        )}

        {reorderTask && (() => {
          const draggedTask = tasks.find(t => t.id === reorderTask.id);
          if (!draggedTask) return null;
          const safeX = Number.isFinite(reorderTask.currentX) ? reorderTask.currentX : 0;
          const safeY = Number.isFinite(reorderTask.currentY) ? reorderTask.currentY : 0;
          const rowHeight = ganttConfig.rowHeight || 48;
          const containerEl = containerRef.current;
          const containerRect = containerEl?.getBoundingClientRect();
          const previewLeft = containerRect
            ? safeX - containerRect.left + 12
            : safeX + 12;
          const previewTop = containerRect
            ? safeY - containerRect.top + 12
            : safeY + 12;
          return (
            <div
              className="gantt-drag-preview"
              style={{
                height: rowHeight,
                top: previewTop,
                left: previewLeft,
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 9999,
                maxWidth: '420px',
              }}
            >
              <span className="gantt-drag-preview-name" title={draggedTask.text}>
                {draggedTask.text}
              </span>
              {reorderTask.descendantIds.length > 0 && (
                <span className="gantt-drag-preview-count">
                  +{reorderTask.descendantIds.length}
                </span>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
