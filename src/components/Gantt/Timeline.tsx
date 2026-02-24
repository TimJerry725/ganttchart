import React, { forwardRef, useState, useCallback } from 'react';
import type { Task, Link, Scale, GanttConfig, Baseline } from './types';
import { TaskBar } from './TaskBar';
import { LinkRenderer } from './LinkRenderer';
import { useDragDrop } from './DragDrop';
import { addToDate, formatDate, isWeekend, isHoliday, getStartOfDay } from './utils/dateUtils';

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
  onTaskUpdate?: (id: string, updates: Partial<Task>) => void;
  zoomLevel: number;
  baselines?: Map<string, Baseline>;
  allowBaselineOnlyMode?: boolean;
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({
    tasks,
    links,
    range,
    scales,
    config,
    selectedTask,
    onTaskClick,
    onTaskDragStart,
    onTaskDragEnd,
    onTaskUpdate,
    zoomLevel,
    baselines,
    allowBaselineOnlyMode = false,
  }, ref) => {
    const [localTasks, setLocalTasks] = useState(tasks);
    const columnWidth = (config.columnWidth || 60) * zoomLevel;
    const showBaselines = config.baselines && baselines && baselines.size > 0;

    const { dragState, handleDragStart, handleDrag, handleDragEnd } = useDragDrop(
      localTasks,
      onTaskUpdate,
      columnWidth,
      scales[1].unit,
      scales[1].step
    );

    // Update local tasks when props change - use shallow comparison for performance
    React.useEffect(() => {
      const tasksChanged = tasks.length !== localTasks.length ||
        tasks.some((t, i) => {
          const local = localTasks[i];
          return !local || t.id !== local.id ||
            t.start.getTime() !== local.start.getTime() ||
            t.end.getTime() !== local.end.getTime();
        });

      if (tasksChanged) {
        setLocalTasks(tasks);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks]);

    // Generate timeline cells - memoized for performance
    const generateCells = React.useCallback((scale: Scale) => {
      const cells: { date: Date; label: string }[] = [];
      let currentDate = new Date(range.start);

      while (currentDate <= range.end) {
        cells.push({
          date: new Date(currentDate),
          label: formatDate(currentDate, scale.format || 'D'),
        });
        currentDate = addToDate(currentDate, scale.step, scale.unit);
      }

      return cells;
    }, [range.start, range.end]);

    const getPixelPosition = React.useCallback((date: Date) => {
      const scale = scales[1]; // secondary scale
      const startMs = range.start.getTime();
      const dateMs = date.getTime();
      const diffMs = dateMs - startMs;

      const unitMsMap: Record<string, number> = {
        'hour': 3600000,
        'day': 86400000,
        'week': 604800000,
        'month': 2592000000,
        'quarter': 7776000000,
        'year': 31536000000
      };

      const unitMs = unitMsMap[scale.unit] || 86400000;
      return (diffMs / (unitMs * scale.step)) * columnWidth;
    }, [scales, range.start, columnWidth]);

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

    const getTaskPositionForLinks = (task: Task) => {
      const pos = getTaskPosition(task);
      const index = localTasks.findIndex(t => t.id === task.id);
      const rowHeight = config.rowHeight || 48;
      const taskHeight = 32;
      const topPadding = (rowHeight - taskHeight) / 2;

      return {
        left: pos.left,
        width: pos.width,
        top: index * rowHeight + topPadding,
        height: taskHeight
      };
    };

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

    const secondaryScale = scales[1];
    const secondaryCells = React.useMemo(() => generateCells(secondaryScale), [generateCells, secondaryScale]);
    const showBaselineOnlyRows = allowBaselineOnlyMode && localTasks.length === 0 && showBaselines;

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
      if (tasks.length > 0) {
        const starts = tasks.map(t => t.start.getTime());
        return getStartOfDay(new Date(Math.min(...starts)));
      }
      return null;
    }, [config.projectStartDate, tasks]);

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

    return (
      <div
        className="gantt-timeline-container"
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ width: totalWidth, position: 'relative' }}
      >
        <div className="gantt-timeline-header" style={{ width: totalWidth, minWidth: totalWidth, position: 'relative' }}>
          {/* Today and Project Start line labels - visible by default, positioned at the day row (first calendar row with dates) */}
          {todayPosition !== null && config.showTodayLine && config.todayLineLabel && config.todayLineLabel !== '' && (
            <div
              className="gantt-today-line-label"
              style={{
                position: 'absolute',
                top: `calc(var(--gantt-scale-height, 24px) * 2)`, // Position at the start of the day row (after month and range rows)
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
                top: `calc(var(--gantt-scale-height, 24px) * 2)`, // Position at the start of the day row (after month and range rows)
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

          {/* Level 1: Month/Year */}
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
          {/* Level 2: 15-day range */}
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
          {links.length > 0 && (
            <LinkRenderer
              links={links}
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
                    <TaskBar
                      task={task}
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
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';
