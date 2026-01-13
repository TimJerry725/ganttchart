import React, { forwardRef, useState, useCallback } from 'react';
import type { Task, Link, Scale, GanttConfig, Baseline } from '../types';
import { TaskBar } from './TaskBar';
import { LinkRenderer } from './LinkRenderer';
import { useDragDrop } from './DragDrop';
import { addToDate, formatDate, isWeekend, isHoliday } from '../utils/dateUtils';

interface TimelineProps {
  tasks: Task[];
  links: Link[];
  range: { start: Date; end: Date };
  scales: Scale[];
  config: GanttConfig;
  selectedTask: string | null;
  draggedTask: string | null;
  onTaskClick: (taskId: string) => void;
  onTaskDragStart: (taskId: string) => void;
  onTaskDragEnd: () => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onTaskUpdate?: (task: Task) => void;
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
    draggedTask,
    onTaskClick,
    onTaskDragStart,
    onTaskDragEnd,
    onScroll,
    onTaskUpdate,
    zoomLevel,
  }, ref) => {
    const [localTasks, setLocalTasks] = useState(tasks);
    const columnWidth = (config.columnWidth || 60) * zoomLevel;
    const showBaselines = config.baselines && baselines && baselines.size > 0;

    const { dragState, handleDragStart, handleDrag, handleDragEnd } = useDragDrop(
      localTasks,
      onTaskUpdate,
      columnWidth,
      range.start
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
      const rowHeight = config.rowHeight || 44;
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
        const updatedTask = handleDrag(e.clientX);
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
      }
    }, [dragState, localTasks, handleDragEnd]);

    const primaryScale = scales[0];
    const secondaryScale = scales[1];
    const primaryCells = generateCells(primaryScale);
    const secondaryCells = generateCells(secondaryScale);

    const totalWidth = secondaryCells.length * columnWidth;

    return (
      <div 
        className="gantt-timeline-container" 
        ref={ref} 
        onScroll={onScroll}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="gantt-timeline-header" style={{ width: totalWidth }}>
          {/* Primary scale (e.g., months) */}
          <div className="gantt-timeline-scale gantt-timeline-scale-primary">
            {primaryCells.map((cell, index) => (
              <div
                key={index}
                className="gantt-timeline-cell"
                style={{ minWidth: columnWidth }}
              >
                {cell.label}
              </div>
            ))}
          </div>
          {/* Secondary scale (e.g., days) */}
          <div className="gantt-timeline-scale gantt-timeline-scale-secondary">
            {secondaryCells.map((cell, index) => {
              const isWeekendDay = config.weekends && isWeekend(cell.date);
              const isHolidayDay = config.holidays && isHoliday(cell.date, config.holidays);
              
              return (
                <div
                  key={index}
                  className={`gantt-timeline-cell ${isWeekendDay ? 'weekend' : ''} ${isHolidayDay ? 'holiday' : ''}`}
                  style={{ minWidth: columnWidth }}
                >
                  {cell.label}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="gantt-timeline-body" style={{ width: totalWidth, height: localTasks.length * (config.rowHeight || 44) }}>
          {/* Grid lines */}
          <div className="gantt-timeline-grid">
            {secondaryCells.map((cell, index) => {
              const isWeekendDay = config.weekends && isWeekend(cell.date);
              const isHolidayDay = config.holidays && isHoliday(cell.date, config.holidays);
              
              return (
                <div
                  key={index}
                  className={`gantt-timeline-grid-column ${isWeekendDay ? 'weekend' : ''} ${isHolidayDay ? 'holiday' : ''}`}
                  style={{ minWidth: columnWidth }}
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
            {localTasks.map((task, index) => {
              const position = getTaskPosition(task);
              const baseline = showBaselines ? baselines?.get(task.id) : undefined;
              const baselinePosition = baseline ? getBaselinePosition(baseline) : undefined;
              
              return (
                <div
                  key={task.id}
                  className="gantt-timeline-row"
                  style={{ 
                    height: config.rowHeight,
                    top: index * (config.rowHeight || 44),
                    width: '100%'
                  }}
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
                    onClick={() => onTaskClick(task.id)}
                    onDragStart={(type) => {
                      const rect = document.querySelector('.gantt-timeline-container')?.getBoundingClientRect();
                      if (rect) {
                        handleDragStart(task.id, rect.left, type);
                      }
                    }}
                    onDragEnd={handleMouseUp}
                    onUpdate={onTaskUpdate}
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
