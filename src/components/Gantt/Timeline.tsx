import React, { forwardRef, useState, useCallback } from 'react';
import type { Task, Link, Scale, GanttConfig, Baseline } from './types';
import { TaskBar } from './TaskBar';
import { LinkRenderer } from './LinkRenderer';
import { useDragDrop } from './DragDrop';
import { addToDate, formatDate, isWeekend, isHoliday } from './utils/dateUtils';

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

    // Update local tasks when props change
    React.useEffect(() => {
      setLocalTasks(tasks);
    }, [tasks]);

    // Generate timeline cells
    const generateCells = (scale: Scale) => {
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
    };

    const getPixelPosition = (date: Date) => {
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
    };

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

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (dragState.taskId && dragState.type) {
        const updatedTask = handleDrag(e.clientX, e.clientY);
        if (updatedTask) {
          setLocalTasks(prev =>
            prev.map(t => t.id === updatedTask.id ? updatedTask : t)
          );
        }
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
    const secondaryCells = generateCells(secondaryScale);

    // Group cells for the top header (Month/Year)
    const generateTopHeaderCells = () => {
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
    };

    // Group cells for the middle header (15-day ranges)
    const generateMiddleHeaderCells = () => {
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
    };

    const topHeaderCells = generateTopHeaderCells();
    const middleHeaderCells = generateMiddleHeaderCells();
    const totalWidth = secondaryCells.length * columnWidth;

    return (
      <div
        className="gantt-timeline-container"
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ width: totalWidth }}
      >
        <div className="gantt-timeline-header" style={{ width: totalWidth, minWidth: totalWidth }}>
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

        <div className="gantt-timeline-body" style={{ width: totalWidth }}>
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
            {localTasks.map((task) => {
              const position = getTaskPosition(task);
              const baseline = showBaselines ? baselines?.get(task.id) : undefined;
              const baselinePosition = baseline ? getBaselinePosition(baseline) : undefined;


              return (
                <div
                  key={task.id}
                  className="gantt-timeline-row"
                >
                  {/* Baseline bar (shown below task bar) */}
                  {baseline && baselinePosition && task.type !== 'milestone' && (
                    <div
                      className="gantt-baseline-bar"
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
