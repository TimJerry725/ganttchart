import React from 'react';
import type { Baseline, Task, TaskSegment, TaskTooltipConfig } from './types';
import { Tooltip } from 'antd';
import { formatDate } from './utils/dateUtils';

interface TaskBarProps {
  task: Task;
  position: { left: number; width: number };
  selected: boolean;
  dragging: boolean;
  onClick: () => void;
  onDragStart: (clientX: number, clientY: number, type: 'move' | 'resize-left' | 'resize-right') => void;
  dragDeltaX?: number;
  dragType?: 'move' | 'resize-left' | 'resize-right' | 'reorder' | null;
  readonly?: boolean;
  baseline?: Baseline;
  dependencyRuleDescriptions?: string[];
  tooltipConfig?: TaskTooltipConfig;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  position,
  selected,
  dragging,
  onClick,
  onDragStart,
  dragDeltaX = 0,
  dragType = null,
  readonly = false,
  baseline,
  dependencyRuleDescriptions = [],
  tooltipConfig,
}) => {
  const showHandle = task.ShowHandle !== undefined ? task.ShowHandle : true;

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize-left' | 'resize-right') => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    onDragStart(e.clientX, e.clientY, type);
  };

  const getTaskBarClass = () => {
    const classes = ['gantt-task-bar'];

    if (task.type === 'milestone') classes.push('milestone');
    if (task.type === 'project') classes.push('project');
    if (selected) classes.push('selected');
    if (dragging) classes.push('dragging');

    // Add status-based class if status is defined
    if (task.status) {
      const normalizedStatus = String(task.status)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      if (normalizedStatus) {
        classes.push(`status-${normalizedStatus}`);
      }
    }

    return classes.join(' ');
  };

  const getTaskBarStyle = (): React.CSSProperties => {
    let left = position.left;
    let width = position.width;

    if (dragging && dragType) {
      if (dragType === 'move') {
        left += dragDeltaX;
      } else if (dragType === 'resize-left') {
        left += dragDeltaX;
        width -= dragDeltaX;
      } else if (dragType === 'resize-right') {
        width += dragDeltaX;
      }
    }

    return {
      left: `${left}px`,
      width: `${Math.max(width, 0)}px`,
      // Color handled by CSS classes (.project, .milestone) or task.color override
      backgroundColor: task.color || undefined,
    };
  };

  const renderTaskBarContent = (isSegment = false) => (
    <>
      {/* Resize handle - left */}
      {!readonly && showHandle && !isSegment && (
        <div
          className="gantt-task-resize-handle gantt-task-resize-left"
          onMouseDown={(e) => handleMouseDown(e, 'resize-left')}
        />
      )}

      {/* Progress bar - not shown for milestones */}
      {!isSegment && task.type !== 'milestone' && (
        <div
          className="gantt-task-progress"
          style={{ width: `${task.progress}%` }}
        >
          {task.progress > 5 && task.progress < 100 && (
            <span className="gantt-task-progress-text">{task.progress}%</span>
          )}
        </div>
      )}

      {/* Task content container */}
      <div className="gantt-task-content">
        {!isSegment && (
          <span className="gantt-task-text">{task.text}</span>
        )}
      </div>

      {/* Resize handle - right */}
      {!readonly && showHandle && !isSegment && (
        <div
          className="gantt-task-resize-handle gantt-task-resize-right"
          onMouseDown={(e) => handleMouseDown(e, 'resize-right')}
        />
      )}
    </>
  );

  const resolveDate = (value: Date | string | number | undefined, fallback: Date): Date => {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? fallback : value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? fallback : parsed;
    }
    return fallback;
  };

  const normalizeDependencyRules = (value: string | string[] | undefined): string[] | undefined => {
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

  // Merge global tooltipConfig with task-level overrides (task-level takes priority)
  const mergedConfig: TaskTooltipConfig | undefined = task.tooltipConfig
    ? { ...tooltipConfig, ...task.tooltipConfig }
    : tooltipConfig;

  const dateFormat = mergedConfig?.dateFormat || 'MMM D, YYYY';
  const taskNameRaw = mergedConfig?.taskNameAccessor?.(task) ?? task.text;
  const taskNameValue = String(taskNameRaw ?? '').trim() || `Task ${task.id}`;
  const taskNameText = mergedConfig?.taskNameFormatter
    ? mergedConfig.taskNameFormatter(taskNameValue, task)
    : taskNameValue;

  const plannedStart = resolveDate(
    mergedConfig?.plannedStartAccessor?.(task) ?? task.plannedStart ?? baseline?.start ?? task.start,
    task.start
  );
  const plannedEnd = resolveDate(
    mergedConfig?.plannedEndAccessor?.(task) ?? task.plannedEnd ?? baseline?.end ?? task.end,
    task.end
  );
  const plannedText = mergedConfig?.plannedDatesFormatter
    ? mergedConfig.plannedDatesFormatter(plannedStart, plannedEnd, task)
    : `${formatDate(plannedStart, dateFormat)} - ${formatDate(plannedEnd, dateFormat)}`;

  const actualStart = resolveDate(
    mergedConfig?.actualStartAccessor?.(task) ?? task.actualStart ?? task.start,
    task.start
  );
  const actualEnd = resolveDate(
    mergedConfig?.actualEndAccessor?.(task) ?? task.actualEnd ?? task.end,
    task.end
  );
  const actualText = mergedConfig?.actualDatesFormatter
    ? mergedConfig.actualDatesFormatter(actualStart, actualEnd, task)
    : `${formatDate(actualStart, dateFormat)} - ${formatDate(actualEnd, dateFormat)}`;

  const statusValue = mergedConfig?.statusAccessor?.(task) ?? task.status;
  const normalizedStatusValue = statusValue !== undefined && statusValue !== null
    ? String(statusValue)
    : '';
  const statusText = mergedConfig?.statusFormatter
    ? mergedConfig.statusFormatter(normalizedStatusValue, task)
    : (normalizedStatusValue ? normalizedStatusValue.replace(/-/g, ' ') : (mergedConfig?.emptyStatusText || 'Not set'));

  const ownerValue = mergedConfig?.ownerAccessor?.(task) ?? task.owner;
  const normalizedOwnerValue = ownerValue !== undefined && ownerValue !== null
    ? String(ownerValue).trim()
    : '';
  const ownerText = normalizedOwnerValue
    ? (mergedConfig?.ownerFormatter ? mergedConfig.ownerFormatter(normalizedOwnerValue, task) : normalizedOwnerValue)
    : (mergedConfig?.emptyOwnerText || '');

  const generatedDependencyRules = dependencyRuleDescriptions.length > 0
    ? dependencyRuleDescriptions
    : (task.dependencyRule || []);
  const dependencyRulesFromAccessor = normalizeDependencyRules(
    mergedConfig?.dependencyRuleAccessor?.(task, generatedDependencyRules)
  );
  const dependencyRules = dependencyRulesFromAccessor || generatedDependencyRules;
  const dependencyText = dependencyRules.length > 0
    ? dependencyRules
      .map((rule) => mergedConfig?.dependencyRuleFormatter ? mergedConfig.dependencyRuleFormatter(rule, task) : rule)
      .join(mergedConfig?.dependencySeparator || ' | ')
    : (mergedConfig?.emptyDependencyRuleText || 'No dependency rule');

  const progressRaw = mergedConfig?.progressAccessor?.(task) ?? task.progress;
  const parsedProgress = typeof progressRaw === 'number' ? progressRaw : Number(progressRaw);
  const progressValue = Number.isFinite(parsedProgress) ? parsedProgress : task.progress;
  const progressText = mergedConfig?.progressFormatter
    ? mergedConfig.progressFormatter(progressValue, task)
    : `${progressValue}%`;

  const tooltipContent = (
    <div className="gantt-tooltip">
      {mergedConfig?.showTaskName !== false && (
        <div className="gantt-tooltip-title">{taskNameText}</div>
      )}
      {mergedConfig?.showPlannedDates !== false && (
        <div className="gantt-tooltip-dates">
          {(mergedConfig?.plannedLabel || 'Planned')}: {plannedText}
        </div>
      )}
      {mergedConfig?.showActualDates !== false && (
        <div className="gantt-tooltip-dates">
          {(mergedConfig?.actualLabel || 'Actual')}: {actualText}
        </div>
      )}
      {mergedConfig?.showStatus !== false && (
        <div className="gantt-tooltip-progress">
          {(mergedConfig?.statusLabel || 'Status')}: {statusText}
        </div>
      )}
      {mergedConfig?.showOwner !== false && ownerText && (
        <div className="gantt-tooltip-owner">
          {(mergedConfig?.ownerLabel || 'Owner')}: {ownerText}
        </div>
      )}
      {mergedConfig?.showDependencyRule !== false && (
        <div className="gantt-tooltip-owner">
          {(mergedConfig?.dependencyRuleLabel || 'Dependency Rule')}: {dependencyText}
        </div>
      )}
      {mergedConfig?.showProgress !== false && (
        <div className="gantt-tooltip-progress">
          {(mergedConfig?.progressLabel || 'Progress')}: {progressText}
        </div>
      )}
    </div>
  );

  if ((task.segments && task.segments.length > 0) || (task.onHoldPeriods && task.onHoldPeriods.length > 0)) {
    const totalDuration = task.end.getTime() - task.start.getTime();
    const msInDay = 24 * 60 * 60 * 1000;

    const effectiveSegments: TaskSegment[] = (task.segments && task.segments.length > 0)
      ? task.segments
      : (() => {
        const holds = (task.onHoldPeriods || [])
          .map((hold) => ({
            startMs: Math.max(hold.start.getTime(), task.start.getTime()),
            endMs: Math.min(hold.end.getTime(), task.end.getTime()),
          }))
          .filter((hold) => hold.endMs > hold.startMs)
          .sort((a, b) => a.startMs - b.startMs);

        if (holds.length === 0) {
          return [{ start: task.start, end: task.end, duration: task.duration || 0 }];
        }

        const mergedHolds: Array<{ startMs: number; endMs: number }> = [];
        holds.forEach((hold) => {
          const last = mergedHolds[mergedHolds.length - 1];
          if (!last || hold.startMs > last.endMs) {
            mergedHolds.push({ ...hold });
            return;
          }
          last.endMs = Math.max(last.endMs, hold.endMs);
        });

        const segments: TaskSegment[] = [];
        let cursor = task.start.getTime();

        mergedHolds.forEach((hold) => {
          if (cursor < hold.startMs) {
            const segmentDurationMs = hold.startMs - cursor;
            segments.push({
              start: new Date(cursor),
              end: new Date(hold.startMs),
              duration: Math.max(Math.ceil(segmentDurationMs / msInDay), 0),
            });
          }
          cursor = Math.max(cursor, hold.endMs);
        });

        if (cursor < task.end.getTime()) {
          const segmentDurationMs = task.end.getTime() - cursor;
          segments.push({
            start: new Date(cursor),
            end: new Date(task.end.getTime()),
            duration: Math.max(Math.ceil(segmentDurationMs / msInDay), 0),
          });
        }

        return segments;
      })();

    const hasActiveSegments = effectiveSegments.length > 0;
    const segmentsToRender = hasActiveSegments
      ? effectiveSegments
      : [{ start: task.start, end: task.end, duration: task.duration || 0 }];

    return (
      <div className="gantt-task-group">
        {/* Render on-hold periods only within the task's date range */}
        {totalDuration > 0 && task.onHoldPeriods?.map((hold, i) => {
          // Clamp hold period to task boundaries for rendering
          const holdStartMs = Math.max(hold.start.getTime(), task.start.getTime());
          const holdEndMs = Math.min(hold.end.getTime(), task.end.getTime());
          const holdDuration = holdEndMs - holdStartMs;
          // Skip if the on-hold period doesn't overlap with the task range
          if (holdDuration <= 0) return null;
          const holdLeft = position.left + ((holdStartMs - task.start.getTime()) / totalDuration) * position.width;
          const holdWidth = (holdDuration / totalDuration) * position.width;
          return (
            <div
              key={`hold-${i}`}
              className="gantt-on-hold-period"
              style={{
                left: `${holdLeft}px`,
                width: `${holdWidth}px`,
              }}
            />
          );
        })}

        {/* Render active segments */}
        {segmentsToRender.map((seg: TaskSegment, i) => (
          <Tooltip key={`seg-${i}`} title={tooltipContent} mouseEnterDelay={0.5}>
            <div
              className={getTaskBarClass() + ' segment'}
              style={{
                left: `${totalDuration > 0 ? position.left + (seg.start.getTime() - task.start.getTime()) / totalDuration * position.width : position.left}px`,
                width: `${totalDuration > 0 ? (seg.end.getTime() - seg.start.getTime()) / totalDuration * position.width : position.width}px`,
                backgroundColor: hasActiveSegments ? task.color || undefined : 'transparent',
                boxShadow: hasActiveSegments ? undefined : 'none',
              }}
              onClick={onClick}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            >
              {/* Show text only in the first segment or if it's the only one */}
              {renderTaskBarContent(i > 0 || !hasActiveSegments)}
            </div>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <Tooltip title={tooltipContent} mouseEnterDelay={0.5}>
      <div
        className={getTaskBarClass()}
        style={getTaskBarStyle()}
        onClick={onClick}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
        {renderTaskBarContent()}
      </div>
    </Tooltip>
  );
};
