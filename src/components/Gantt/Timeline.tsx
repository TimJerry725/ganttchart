import React, { useState, useCallback } from 'react';
import type { Task, Link, Scale, GanttConfig, Baseline, TaskTooltipConfig, TaskDragUpdateMeta } from './types';
import { TaskBar } from './TaskBar';
import { LinkRenderer } from './LinkRenderer';
import { useDragDrop } from './DragDrop';
import { addToDate, formatDate, isWeekend, isHoliday, getStartOfDay } from './utils/dateUtils';

type TimelineHeaderCell = {
  key: string;
  label: string;
  width: number;
  date?: Date;
};

const getWeekOfMonth = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
};

const getQuarter = (date: Date): number => Math.floor(date.getMonth() / 3) + 1;

const formatScaleLabel = (date: Date, scale: Scale, fallback: string): string => {
  if (scale.unit === 'week') {
    if (scale.format?.includes('W')) {
      return scale.format.replace(/\bW\b/g, String(getWeekOfMonth(date)));
    }
    return `Week ${getWeekOfMonth(date)}`;
  }

  if (scale.unit === 'quarter') {
    if (scale.format?.includes('Q')) {
      return scale.format.replace(/\bQ\b/g, String(getQuarter(date)));
    }
    return `Q${getQuarter(date)}`;
  }

  return formatDate(date, scale.format || fallback);
};

const getScaleBucketStart = (date: Date, scale: Scale): Date => {
  const normalized = new Date(date);
  normalized.setMinutes(0, 0, 0);

  switch (scale.unit) {
    case 'hour': {
      const hour = normalized.getHours() - (normalized.getHours() % scale.step);
      normalized.setHours(hour);
      return normalized;
    }
    case 'day': {
      const dayStart = getStartOfDay(normalized);
      const day = dayStart.getDate();
      const bucketDay = day - ((day - 1) % scale.step);
      return new Date(dayStart.getFullYear(), dayStart.getMonth(), bucketDay);
    }
    case 'week': {
      const dayStart = getStartOfDay(normalized);
      const weekStart = new Date(dayStart);
      weekStart.setDate(dayStart.getDate() - dayStart.getDay());
      return weekStart;
    }
    case 'month': {
      return new Date(normalized.getFullYear(), normalized.getMonth() - (normalized.getMonth() % scale.step), 1);
    }
    case 'quarter': {
      const quarterStartMonth = Math.floor(normalized.getMonth() / 3) * 3;
      return new Date(normalized.getFullYear(), quarterStartMonth, 1);
    }
    case 'year': {
      const year = normalized.getFullYear() - (normalized.getFullYear() % scale.step);
      return new Date(year, 0, 1);
    }
    default:
      return getStartOfDay(normalized);
  }
};

interface TimelineProps {
  tasks: Task[];
  links: Link[];
  range: { start: Date; end: Date };
  scales: Scale[];
  config: GanttConfig;
  selectedTask: string | null;
  draggedTask: string | null;
  onTaskClick: (taskId: string) => void;
  onTaskDragStart: (taskId: string, clientX: number, clientY: number) => void;
  onTaskDragEnd: () => void;
  onTaskUpdate?: (id: string, updates: Partial<Task>, meta?: TaskDragUpdateMeta) => void;
  zoomLevel: number;
  baselines?: Map<string, Baseline>;
  allowBaselineOnlyMode?: boolean;
  taskTooltipConfig?: TaskTooltipConfig;
  headerHeight?: number;
}

export const Timeline = React.memo(React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ tasks, links, range, scales, config, selectedTask, onTaskClick, onTaskDragStart, onTaskDragEnd, onTaskUpdate, zoomLevel, baselines, allowBaselineOnlyMode, taskTooltipConfig, headerHeight }, ref) => {
    const timelineContainerRef = React.useRef<HTMLDivElement | null>(null);
    const setTimelineContainerRef = React.useCallback((node: HTMLDivElement | null) => {
      timelineContainerRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);
    const [localTasks, setLocalTasks] = useState(tasks);
    const [localLinks, setLocalLinks] = useState(links);
    const [timelineViewportWidth, setTimelineViewportWidth] = useState(0);
    const baseColumnWidth = React.useMemo(
      () => Math.max((config.columnWidth || 60) * zoomLevel, config.minColumnWidth || 0),
      [config.columnWidth, config.minColumnWidth, zoomLevel]
    );
    const showBaselines = config.baselines && baselines && baselines.size > 0;
    const taskById = React.useMemo(() => {
      const map = new Map<string, Task>();
      localTasks.forEach((task) => map.set(task.id, task));
      return map;
    }, [localTasks]);

    const dependencyRulesByTargetId = React.useMemo(() => {
      const map = new Map<string, string[]>();
      const linkTypeLabel: Record<Link['type'], string> = {
        e2s: 'Finish-to-Start',
        s2s: 'Start-to-Start',
        e2e: 'Finish-to-Finish',
        s2e: 'Start-to-Finish',
      };

      const appendRules = (taskId: string, rules: string[]) => {
        const existing = map.get(taskId) || [];
        const merged = [...existing, ...rules.map((rule) => rule.trim()).filter(Boolean)];
        if (merged.length > 0) {
          map.set(taskId, Array.from(new Set(merged)));
        }
      };

      localTasks.forEach((task) => {
        if (task.dependencyRule && task.dependencyRule.length > 0) {
          appendRules(task.id, task.dependencyRule);
        }
      });

      localLinks.forEach((link) => {
        const source = taskById.get(link.source);
        const target = taskById.get(link.target);
        const sourceName = source?.text || `Task ${link.source}`;
        const targetName = target?.text || `Task ${link.target}`;
        const typeLabel = linkTypeLabel[link.type];
        const lag = typeof link.lag === 'number' && link.lag !== 0
          ? ` (${link.lag > 0 ? '+' : ''}${link.lag} ${link.lagUnit || 'day'})`
          : '';
        const ruleDescription = `${targetName} depends on ${sourceName} [${typeLabel}]${lag}`;
        appendRules(link.target, [ruleDescription]);
      });

      return map;
    }, [localLinks, localTasks, taskById]);

    // Update local tasks when props change - use shallow comparison for performance
    React.useEffect(() => {
      const tasksChanged =
        tasks.length !== localTasks.length ||
        tasks.some((t, i) => {
          const lt = localTasks[i];
          return !lt || t.id !== lt.id || t.start.getTime() !== lt.start.getTime() || t.end.getTime() !== lt.end.getTime() || t.duration !== lt.duration;
        });

      if (tasksChanged) {
        setLocalTasks(tasks);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks]);

    React.useEffect(() => {
      const linksChanged =
        links.length !== localLinks.length ||
        links.some((l, i) => {
          const ll = localLinks[i];
          return !ll || l.id !== ll.id || l.source !== ll.source || l.target !== ll.target || l.type !== ll.type;
        });

      if (linksChanged) {
        setLocalLinks(links);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [links]);

    React.useEffect(() => {
      const viewportElement = timelineContainerRef.current?.parentElement;
      if (!viewportElement) return undefined;

      const updateViewportWidth = () => {
        let nextWidth = viewportElement.clientWidth;
        const layoutElement = viewportElement.closest('.gantt-layout') as HTMLElement;
        const gridElement = layoutElement?.querySelector('.gantt-grid') as HTMLElement;
        
        if (layoutElement && gridElement) {
          nextWidth = Math.max(0, layoutElement.clientWidth - gridElement.offsetWidth);
        }
        
        setTimelineViewportWidth((currentWidth) => (
          currentWidth === nextWidth ? currentWidth : nextWidth
        ));
      };

      updateViewportWidth();

      const observerTarget = viewportElement.closest('.gantt-layout') || viewportElement;

      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', updateViewportWidth);
        return () => window.removeEventListener('resize', updateViewportWidth);
      }

      const resizeObserver = new ResizeObserver(() => {
        updateViewportWidth();
      });

      resizeObserver.observe(observerTarget);

      return () => resizeObserver.disconnect();
    }, []);

    // Generate timeline cells - memoized for performance
    const generateCells = React.useCallback((scale: Scale) => {
      const cells: { date: Date; label: string }[] = [];
      let currentDate = new Date(range.start);

      while (currentDate <= range.end) {
        let label = formatScaleLabel(
          currentDate,
          scale,
          scale.unit === 'year'
            ? 'YYYY'
            : scale.unit === 'month'
              ? 'MMM'
              : scale.unit === 'hour'
                ? 'HH'
                : 'D'
        );

        if (config.relativeDayNumbering && scale.unit === 'day') {
          // Calculate day count from project/view start
          const diffTime = currentDate.getTime() - range.start.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
          label = String(diffDays);
        }

        cells.push({
          date: new Date(currentDate),
          label,
        });
        currentDate = addToDate(currentDate, scale.step, scale.unit);
      }

      // Extend to fill viewport width if needed, to avoid empty spaces or comically fat cells
      if (timelineViewportWidth > 0) {
        const requiredCells = Math.floor(timelineViewportWidth / baseColumnWidth);
        while (cells.length < requiredCells) {
          let label = formatScaleLabel(
            currentDate,
            scale,
            scale.unit === 'year'
              ? 'YYYY'
              : scale.unit === 'month'
                ? 'MMM'
                : scale.unit === 'hour'
                  ? 'HH'
                  : 'D'
          );

          if (config.relativeDayNumbering && scale.unit === 'day') {
            const diffTime = currentDate.getTime() - range.start.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            label = String(diffDays);
          }

          cells.push({
            date: new Date(currentDate),
            label,
          });
          currentDate = addToDate(currentDate, scale.step, scale.unit);
        }
      }

      return cells;
    }, [range.start, range.end, timelineViewportWidth, baseColumnWidth]);

    const secondaryScale = scales[1] || scales[0];
    const secondaryCells = React.useMemo(() => generateCells(secondaryScale), [generateCells, secondaryScale]);
    const columnWidth = React.useMemo(() => {
      if (secondaryCells.length === 0 || timelineViewportWidth <= 0) {
        return baseColumnWidth;
      }

      return Math.max(baseColumnWidth, timelineViewportWidth / secondaryCells.length);
    }, [baseColumnWidth, secondaryCells.length, timelineViewportWidth]);
    const showBaselineOnlyRows = allowBaselineOnlyMode && localTasks.length === 0 && showBaselines;
    const hasTimelineViewFeature = Boolean(config.timelineView) || Boolean(config.timelineViews?.length);
    const headerLabelOffsetRows = React.useMemo(() => {
      if (config.showTimelineHeader === false) return 0;
      let rows = hasTimelineViewFeature ? Math.max(scales.length - 1, 0) : 2;
      if (config.showMonthHeading === false) {
        rows = Math.max(0, rows - 1);
      }
      if (config.showRangeHeading === false) {
        // If range heading is hidden, we remove the middle rows from the count.
        // Legacy has exactly 1 middle row (Level 2).
        // Dynamic mode has (scales.length - 2) total rows if we count the bottom row.
        //rowIndex === 0 is month.
        // rowIndex === dynamicHeaderRows.length - 1 is 'day' (bottom primary).
        // Middle rows are those where rowIndex !== 0 && rowIndex !== dynamicHeaderRows.length - 1
        // Number of middle rows is scales.length - 2.
        const middleRowsCount = hasTimelineViewFeature ? Math.max(0, scales.length - 2) : 1;
        rows = Math.max(0, rows - middleRowsCount);
      }
      return rows;
    }, [config.showTimelineHeader, config.showMonthHeading, config.showRangeHeading, hasTimelineViewFeature, scales.length]);

    const { dragState, handleDragStart, handleDrag, handleDragEnd } = useDragDrop(
      localTasks,
      onTaskUpdate,
      columnWidth,
      secondaryScale.unit,
      secondaryScale.step
    );

    const getPixelPosition = React.useCallback((date: Date) => {
      if (secondaryCells.length === 0) return 0;

      const dateMs = date.getTime();
      const lastIndex = secondaryCells.length - 1;

      for (let index = 0; index <= lastIndex; index++) {
        const cell = secondaryCells[index];
        const cellStart = cell.date.getTime();
        const nextCellDate = index < lastIndex
          ? secondaryCells[index + 1].date
          : addToDate(cell.date, secondaryScale.step, secondaryScale.unit);
        const cellEnd = nextCellDate.getTime();
        const safeDuration = Math.max(cellEnd - cellStart, 1);

        if (dateMs < cellStart) {
          return index * columnWidth;
        }

        if (dateMs <= cellEnd) {
          const ratio = Math.max(0, Math.min((dateMs - cellStart) / safeDuration, 1));
          return (index + ratio) * columnWidth;
        }
      }

      return secondaryCells.length * columnWidth;
    }, [secondaryCells, secondaryScale, columnWidth]);

    const getTaskPosition = (task: Task) => {
      const left = getPixelPosition(task.start);
      const right = getPixelPosition(task.end);

      return {
        left,
        width: Math.max(right - left, 0),
      };
    };

    const getBaselinePosition = (baseline: Baseline) => {
      const left = getPixelPosition(baseline.start);
      const right = getPixelPosition(baseline.end);

      return {
        left,
        width: Math.max(right - left, 0),
      };
    };

    const getTaskPositionForLinks = React.useCallback((task: Task) => {
      const pos = getTaskPosition(task);
      const index = localTasks.findIndex(t => t.id === task.id);

      // Read the actual row height from the CSS variable on the container element,
      // so the arrow positions stay correct regardless of host-project overrides.
      let rowHeight = config.rowHeight || 48;
      if (timelineContainerRef.current) {
        const cssVal = getComputedStyle(timelineContainerRef.current).getPropertyValue('--gantt-row-height');
        if (cssVal) {
          const parsed = parseFloat(cssVal);
          if (!isNaN(parsed) && parsed > 0) rowHeight = parsed;
        }
      }

      const taskHeight = config.taskHeight || 28; // matches CSS .gantt-task-bar { height: 28px }
      const topPadding = (rowHeight - taskHeight) / 2;

      return {
        left: pos.left,
        width: pos.width,
        top: index * rowHeight + topPadding,
        height: taskHeight,
      };
    }, [getTaskPosition, localTasks, config.rowHeight, config.taskHeight]);

    const mouseMoveTimeoutRef = React.useRef<number | null>(null);
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (dragState.taskId && dragState.type) {
        // Throttle to 16ms (60fps) for smooth performance
        if (mouseMoveTimeoutRef.current) {
          cancelAnimationFrame(mouseMoveTimeoutRef.current);
        }
        mouseMoveTimeoutRef.current = requestAnimationFrame(() => {
          const updatedTask = handleDrag(e.clientX, e.clientY);
          if (updatedTask) {
            setLocalTasks(prev =>
              prev.map(t => t.id === updatedTask.id ? updatedTask : t)
            );
          }
        });
      }
    }, [dragState, handleDrag]);

    const handleMouseUp = useCallback(() => {
      if (dragState.taskId) {
        const updatedTask = localTasks.find(t => t.id === dragState.taskId);
        handleDragEnd(updatedTask || null);
        onTaskDragEnd();
      }
    }, [dragState, localTasks, handleDragEnd, onTaskDragEnd]);

    const buildGroupedHeaderCells = React.useCallback((scale: Scale) => {
      const cells: TimelineHeaderCell[] = [];
      let currentKey = '';
      let currentLabel = '';
      let currentWidth = 0;

      secondaryCells.forEach((cell) => {
        const bucketStart = getScaleBucketStart(cell.date, scale);
        const key = bucketStart.toISOString();
        const fallback = scale.unit === 'year'
          ? 'YYYY'
          : scale.unit === 'month'
            ? 'MMM YYYY'
            : scale.unit === 'day'
              ? 'MMM D'
              : 'D';
        const label = formatScaleLabel(bucketStart, scale, fallback);

        if (key !== currentKey) {
          if (currentKey) {
            cells.push({ key: currentKey, label: currentLabel, width: currentWidth });
          }
          currentKey = key;
          currentLabel = label;
          currentWidth = columnWidth;
        } else {
          currentWidth += columnWidth;
        }
      });

      if (currentKey) {
        cells.push({ key: currentKey, label: currentLabel, width: currentWidth });
      }

      return cells;
    }, [secondaryCells, columnWidth]);

    const dynamicHeaderRows = React.useMemo(() => {
      if (!hasTimelineViewFeature) return [] as TimelineHeaderCell[][];

      const rows: TimelineHeaderCell[][] = [];
      const primaryScales = scales.slice(0, -1);

      primaryScales.forEach((scale) => {
        const groupedCells = buildGroupedHeaderCells(scale);
        if (groupedCells.length > 0) {
          rows.push(groupedCells);
        }
      });

      rows.push(
        secondaryCells.map((cell, index) => ({
          key: `secondary-${index}`,
          label: cell.label,
          width: columnWidth,
          date: cell.date,
        }))
      );

      return rows;
    }, [buildGroupedHeaderCells, columnWidth, hasTimelineViewFeature, scales, secondaryCells]);

    // Group cells for the top header (Month/Year) - memoized
    const generateTopHeaderCells = React.useCallback(() => {
      const cells: { label: string; width: number }[] = [];
      let currentMonth = -1;
      let currentYear = -1;
      let currentWidth = 0;
      let currentLabel = '';

      secondaryCells.forEach((cell) => {
        const month = cell.date.getMonth();
        const year = cell.date.getFullYear();
        const label = formatDate(cell.date, 'MMM YYYY');

        if (month !== currentMonth || year !== currentYear) {
          if (currentMonth !== -1) {
            cells.push({ label: currentLabel, width: currentWidth });
          }
          currentMonth = month;
          currentYear = year;
          currentWidth = columnWidth;
          currentLabel = label;
        } else {
          currentWidth += columnWidth;
        }
      });
      if (currentMonth !== -1) {
        cells.push({ label: currentLabel, width: currentWidth });
      }
      return cells;
    }, [secondaryCells, columnWidth]);

    // Group cells for the middle header (15-day ranges) - memoized
    const generateMiddleHeaderCells = React.useCallback(() => {
      const cells: { label: string; width: number }[] = [];
      let currentPeriod = -1; // 0 for 1-15, 1 for 16+
      let currentWidth = 0;
      let currentMonth = -1;
      let currentYear = -1;
      let currentLabel = '';

      secondaryCells.forEach((cell) => {
        const day = cell.date.getDate();
        const period = day <= 15 ? 0 : 1;
        const month = cell.date.getMonth();
        const year = cell.date.getFullYear();
        const monthLabel = formatDate(cell.date, 'MMM');
        const lastDay = new Date(year, month + 1, 0).getDate();
        const label = period === 0 ? `${monthLabel} 1 - 15` : `${monthLabel} 16 - ${lastDay}`;

        if (period !== currentPeriod || month !== currentMonth || year !== currentYear) {
          if (currentPeriod !== -1) {
            cells.push({ label: currentLabel, width: currentWidth });
          }
          currentPeriod = period;
          currentMonth = month;
          currentYear = year;
          currentWidth = columnWidth;
          currentLabel = label;
        } else {
          currentWidth += columnWidth;
        }
      });
      if (currentPeriod !== -1) {
        cells.push({ label: currentLabel, width: currentWidth });
      }
      return cells;
    }, [secondaryCells, columnWidth]);

    const topHeaderCells = React.useMemo(() => generateTopHeaderCells(), [generateTopHeaderCells]);
    const middleHeaderCells = React.useMemo(() => generateMiddleHeaderCells(), [generateMiddleHeaderCells]);
    const totalWidth = React.useMemo(() => secondaryCells.length * columnWidth, [secondaryCells.length, columnWidth]);

    // Calculate positions for Today and Project Start lines
    const today = React.useMemo(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }, []);

    const todayPosition = React.useMemo(() => {
      if (!config.showTodayLine) return null;
      const pos = getPixelPosition(today);
      // Only show if within visible range (with some margin)
      // Position exactly on the grid line (no offset)
      if (pos >= -columnWidth && pos <= totalWidth + columnWidth) {
        return Math.max(0, Math.min(pos, totalWidth));
      }
      return null;
    }, [config.showTodayLine, today, totalWidth, columnWidth, getPixelPosition]);

    const projectStartDate = React.useMemo(() => {
      if (config.projectStartDate) {
        return getStartOfDay(config.projectStartDate);
      }
      // Default to earliest task start
      if (localTasks.length > 0) {
        const starts = localTasks.map(t => t.start.getTime());
        return getStartOfDay(new Date(Math.min(...starts)));
      }
      return null;
    }, [config.projectStartDate, localTasks]);

    const projectStartPosition = React.useMemo(() => {
      if (!config.showProjectStartLine || !projectStartDate) return null;
      const pos = getPixelPosition(projectStartDate);
      // Only show if within visible range (with some margin)
      // Position exactly on the grid line (no offset)
      if (pos >= -columnWidth && pos <= totalWidth + columnWidth) {
        return Math.max(0, Math.min(pos, totalWidth));
      }
      return null;
    }, [config.showProjectStartLine, projectStartDate, totalWidth, columnWidth, getPixelPosition]);
    const labelTopOffset = `calc(var(--gantt-scale-height, 24px) * ${headerLabelOffsetRows})`;

    return (
      <div
        className="gantt-timeline-container"
        ref={setTimelineContainerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ width: totalWidth, position: 'relative' }}
      >
        <div className="gantt-timeline-header" style={{ width: totalWidth, minWidth: totalWidth, position: 'relative', height: headerHeight }}>
          {/* Today and Project Start line labels - visible by default, positioned at the day row (first calendar row with dates) */}
          {todayPosition !== null && config.showTodayLine && config.todayLineLabel && config.todayLineLabel !== '' && (
            <div
              className="gantt-today-line-label"
              style={{
                position: 'absolute',
                top: labelTopOffset,
                left: `${todayPosition}px`,
                transform: 'translateX(-50%)',
                backgroundColor: config.todayLineColor || '#ff4d4f',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                lineHeight: '1.2',
                zIndex: 101,
                pointerEvents: 'none',
                ...config.todayLineLabelStyle, // Allow custom styling
              }}
            >
              {config.todayLineLabel}
            </div>
          )}

          {projectStartPosition !== null && config.showProjectStartLine && config.projectStartLineLabel && config.projectStartLineLabel !== '' && (
            <div
              className="gantt-project-start-line-label"
              style={{
                position: 'absolute',
                top: labelTopOffset,
                left: `${projectStartPosition}px`,
                transform: 'translateX(-50%)',
                backgroundColor: config.projectStartLineColor || '#40a9ff',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                lineHeight: '1.2',
                zIndex: 101,
                pointerEvents: 'none',
                ...config.projectStartLineLabelStyle, // Allow custom styling
              }}
            >
              {config.projectStartLineLabel}
            </div>
          )}

          {config.showTimelineHeader !== false && (
            hasTimelineViewFeature ? (
              dynamicHeaderRows.map((row, rowIndex) => {
              const scaleClass = rowIndex === 0
                ? 'gantt-timeline-scale-month'
                : rowIndex === dynamicHeaderRows.length - 1
                  ? 'gantt-timeline-scale-day'
                  : 'gantt-timeline-scale-range';

              return (
                <div
                  key={`dynamic-row-${rowIndex}`}
                  className={`gantt-timeline-scale ${scaleClass}`}
                  style={{ width: totalWidth, display: (rowIndex === 0 && config.showMonthHeading === false) || (rowIndex !== 0 && rowIndex !== dynamicHeaderRows.length - 1 && config.showRangeHeading === false) ? 'none' : 'flex' }}
                >
                  {row.map((cell, index) => {
                    const isBottomRow = rowIndex === dynamicHeaderRows.length - 1;
                    const isWeekendDay = isBottomRow && cell.date ? config.weekends && isWeekend(cell.date) : false;
                    const isHolidayDay = isBottomRow && cell.date ? config.holidays && isHoliday(cell.date, config.holidays) : false;

                    return (
                      <div
                        key={cell.key}
                        className={`gantt-timeline-cell ${isWeekendDay ? 'weekend' : ''} ${isHolidayDay ? 'holiday' : ''}`}
                        style={{
                          width: cell.width,
                          minWidth: cell.width,
                          maxWidth: cell.width,
                          borderRight: index === row.length - 1 ? 'none' : 'var(--wx-gantt-border)'
                        }}
                      >
                        {cell.label}
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <>
              {/* Level 1: Month/Year */}
              {config.showMonthHeading !== false && (
                <div className="gantt-timeline-scale gantt-timeline-scale-month" style={{ width: totalWidth }}>

                {topHeaderCells.map((cell, index) => (
                  <div
                    key={`top-${index}`}
                    className="gantt-timeline-cell"
                    style={{
                      width: cell.width,
                      minWidth: cell.width,
                      maxWidth: cell.width,
                      borderRight: index === topHeaderCells.length - 1 ? 'none' : 'var(--wx-gantt-border)'
                    }}
                  >
                    {cell.label}
                  </div>
                ))}
              </div>
              )}
              {/* Level 2: 15-day range */}
              {config.showRangeHeading !== false && (
              <div className="gantt-timeline-scale gantt-timeline-scale-range" style={{ width: totalWidth }}>
                {middleHeaderCells.map((cell, index) => (
                  <div
                    key={`mid-${index}`}
                    className="gantt-timeline-cell"
                    style={{
                      width: cell.width,
                      minWidth: cell.width,
                      maxWidth: cell.width,
                      borderRight: index === middleHeaderCells.length - 1 ? 'none' : 'var(--wx-gantt-border)'
                    }}
                  >
                    {cell.label}
                  </div>
                ))}
              </div>
              )}
              {/* Level 3: Individual Days */}
              <div className="gantt-timeline-scale gantt-timeline-scale-day" style={{ width: totalWidth }}>
                {secondaryCells.map((cell, index) => {
                  const isWeekendDay = config.weekends && isWeekend(cell.date);
                  const isHolidayDay = config.holidays && isHoliday(cell.date, config.holidays);

                  return (
                    <div
                      key={`day-${index}`}
                      className={`gantt-timeline-cell ${isWeekendDay ? 'weekend' : ''} ${isHolidayDay ? 'holiday' : ''}`}
                      style={{
                        width: columnWidth,
                        minWidth: columnWidth,
                        maxWidth: columnWidth,
                        borderRight: index === secondaryCells.length - 1 ? 'none' : 'var(--wx-gantt-border)'
                      }}
                    >
                      {cell.label}
                    </div>
                  );
                })}
              </div>
            </>
          ))}
        </div>

        <div className="gantt-timeline-body" style={{ width: totalWidth, position: 'relative' }}>
          {/* Today and Project Start vertical lines - rendered behind grid but above task bars */}
          {todayPosition !== null && (
            <>
              {/* Today line marker at top */}
              {config.showTodayLineMarker !== false && (() => {
                const markerSize = config.todayLineMarkerSize || 8;
                const markerColor = config.todayLineColor || '#ff4d4f';
                const markerStyle = config.todayLineMarkerStyle || 'triangle';
                const opacity = config.todayLineOpacity !== undefined ? config.todayLineOpacity : 1;

                if (markerStyle === 'triangle') {
                  return (
                    <div
                      className="gantt-today-line-marker"
                      style={{
                        position: 'absolute',
                        left: `${todayPosition}px`,
                        top: '-4px',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: `${markerSize}px solid transparent`,
                        borderRight: `${markerSize}px solid transparent`,
                        borderBottom: `${markerSize}px solid ${markerColor}`,
                        zIndex: 7,
                        pointerEvents: 'none',
                        opacity,
                      }}
                    />
                  );
                } else if (markerStyle === 'arrow') {
                  return (
                    <div
                      className="gantt-today-line-marker"
                      style={{
                        position: 'absolute',
                        left: `${todayPosition}px`,
                        top: '-6px',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: `${markerSize}px solid transparent`,
                        borderRight: `${markerSize}px solid transparent`,
                        borderBottom: `${markerSize * 0.7}px solid ${markerColor}`,
                        zIndex: 7,
                        pointerEvents: 'none',
                        opacity,
                      }}
                    />
                  );
                } else if (markerStyle === 'dot') {
                  return (
                    <div
                      className="gantt-today-line-marker"
                      style={{
                        position: 'absolute',
                        left: `${todayPosition}px`,
                        top: `-${markerSize / 2}px`,
                        transform: 'translateX(-50%)',
                        width: `${markerSize}px`,
                        height: `${markerSize}px`,
                        borderRadius: '50%',
                        backgroundColor: markerColor,
                        zIndex: 7,
                        pointerEvents: 'none',
                        opacity,
                      }}
                    />
                  );
                }
                return null;
              })()}
              {/* Today line */}
              <div
                className="gantt-today-line"
                style={{
                  position: 'absolute',
                  left: `${todayPosition}px`,
                  top: 0,
                  bottom: 0,
                  width: `${config.todayLineWidth || 1}px`,
                  backgroundColor: config.todayLineColor || '#ff4d4f',
                  opacity: config.todayLineOpacity !== undefined ? config.todayLineOpacity : 1,
                  borderLeft: config.todayLineStyle === 'dashed'
                    ? `${config.todayLineWidth || 1}px dashed ${config.todayLineColor || '#ff4d4f'}`
                    : config.todayLineStyle === 'dotted'
                      ? `${config.todayLineWidth || 1}px dotted ${config.todayLineColor || '#ff4d4f'}`
                      : 'none',
                  zIndex: 6,
                  pointerEvents: 'none',
                  // Clean thin line matching reference image - positioned exactly on grid boundary
                  // For crisp rendering, use left positioning without transform
                }}
              />
            </>
          )}

          {projectStartPosition !== null && (
            <>
              {/* Project Start line marker at top */}
              {config.showProjectStartLineMarker !== false && (() => {
                const markerSize = config.projectStartLineMarkerSize || 8;
                const markerColor = config.projectStartLineColor || '#40a9ff';
                const markerStyle = config.projectStartLineMarkerStyle || 'triangle';
                const opacity = config.projectStartLineOpacity !== undefined ? config.projectStartLineOpacity : 1;

                if (markerStyle === 'triangle') {
                  return (
                    <div
                      className="gantt-project-start-line-marker"
                      style={{
                        position: 'absolute',
                        left: `${projectStartPosition}px`,
                        top: '-4px',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: `${markerSize}px solid transparent`,
                        borderRight: `${markerSize}px solid transparent`,
                        borderBottom: `${markerSize}px solid ${markerColor}`,
                        zIndex: 7,
                        pointerEvents: 'none',
                        opacity,
                      }}
                    />
                  );
                } else if (markerStyle === 'arrow') {
                  return (
                    <div
                      className="gantt-project-start-line-marker"
                      style={{
                        position: 'absolute',
                        left: `${projectStartPosition}px`,
                        top: '-6px',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: `${markerSize}px solid transparent`,
                        borderRight: `${markerSize}px solid transparent`,
                        borderBottom: `${markerSize * 0.7}px solid ${markerColor}`,
                        zIndex: 7,
                        pointerEvents: 'none',
                        opacity,
                      }}
                    />
                  );
                } else if (markerStyle === 'dot') {
                  return (
                    <div
                      className="gantt-project-start-line-marker"
                      style={{
                        position: 'absolute',
                        left: `${projectStartPosition}px`,
                        top: `-${markerSize / 2}px`,
                        transform: 'translateX(-50%)',
                        width: `${markerSize}px`,
                        height: `${markerSize}px`,
                        borderRadius: '50%',
                        backgroundColor: markerColor,
                        zIndex: 7,
                        pointerEvents: 'none',
                        opacity,
                      }}
                    />
                  );
                }
                return null;
              })()}
              {/* Project Start line */}
              <div
                className="gantt-project-start-line"
                style={{
                  position: 'absolute',
                  left: `${projectStartPosition}px`,
                  top: 0,
                  bottom: 0,
                  width: `${config.projectStartLineWidth || 1}px`,
                  backgroundColor: config.projectStartLineColor || '#40a9ff',
                  opacity: config.projectStartLineOpacity !== undefined ? config.projectStartLineOpacity : 1,
                  borderLeft: config.projectStartLineStyle === 'dashed'
                    ? `${config.projectStartLineWidth || 1}px dashed ${config.projectStartLineColor || '#40a9ff'}`
                    : config.projectStartLineStyle === 'dotted'
                      ? `${config.projectStartLineWidth || 1}px dotted ${config.projectStartLineColor || '#40a9ff'}`
                      : 'none',
                  zIndex: 6,
                  pointerEvents: 'none',
                  // Clean thin line matching reference image - positioned exactly on grid boundary
                  // For crisp rendering, use left positioning without transform
                }}
              />
            </>
          )}

          {/* Grid lines */}
          <div className="gantt-timeline-grid">
            {secondaryCells.map((cell, index) => {
              const isWeekendDay = config.weekends && isWeekend(cell.date);
              const isHolidayDay = config.holidays && isHoliday(cell.date, config.holidays);

              return (
                <div
                  key={index}
                  className={`gantt-timeline-grid-column ${isWeekendDay ? 'weekend' : ''} ${isHolidayDay ? 'holiday' : ''}`}
                  style={{ width: columnWidth, minWidth: columnWidth }}
                />
              );
            })}
          </div>

          {/* Dependency links */}
          {localLinks.length > 0 && (
            <LinkRenderer
              links={localLinks}
              tasks={localTasks}
              getTaskPosition={getTaskPositionForLinks}
            />
          )}

          {/* Task bars */}
          <div className="gantt-timeline-tasks" style={{ width: totalWidth }}>
            {showBaselineOnlyRows
              ? Array.from(baselines?.values() || []).map((baseline) => {
                const baselinePosition = getBaselinePosition(baseline);

                return (
                  <div
                    key={`baseline-only-${baseline.taskId}`}
                    className="gantt-timeline-row baseline-only"
                  >
                    <div
                      className="gantt-baseline-bar baseline-only"
                      style={{
                        left: `${baselinePosition.left}px`,
                        width: `${baselinePosition.width}px`,
                      }}
                      title={`Baseline: ${baseline.start.toLocaleDateString()} - ${baseline.end.toLocaleDateString()}`}
                    />
                  </div>
                );
              })
              : localTasks.map((task) => {
                const position = getTaskPosition(task);
                const baseline = showBaselines ? baselines?.get(task.id) : undefined;
                const baselinePosition = baseline ? getBaselinePosition(baseline) : undefined;

                return (
                  <div
                    key={task.id}
                    className="gantt-timeline-row"
                  >
                    {/* Baseline bar (shown below task bar) */}
                    {baseline && baselinePosition && (
                      <div
                        className={`gantt-baseline-bar ${task.type === 'milestone' ? 'milestone' : ''}`}
                        style={{
                          left: `${baselinePosition.left}px`,
                          width: `${baselinePosition.width}px`,
                        }}
                        title={`Baseline: ${baseline.start.toLocaleDateString()} - ${baseline.end.toLocaleDateString()}`}
                      />
                    )}

                    {/* Main task bar */}
                    {!task.hideBar && (
                      <TaskBar
                        task={task}
                        baseline={baseline}
                        dependencyRuleDescriptions={dependencyRulesByTargetId.get(task.id) || []}
                        tooltipConfig={taskTooltipConfig}
                        position={position}
                        selected={selectedTask === task.id}
                        dragging={dragState.taskId === task.id}
                        dragDeltaX={dragState.dragDeltaX}
                        dragType={dragState.type}
                        onClick={() => onTaskClick(task.id)}
                        onDragStart={(clientX, clientY, type) => {
                          handleDragStart(task.id, clientX, clientY, type);
                          onTaskDragStart(task.id, clientX, clientY);
                        }}
                        readonly={config.readonly}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  })
);

Timeline.displayName = 'Timeline';
