import React, { forwardRef, useState, useCallback } from 'react';
import { Task, Link, Scale, GanttConfig } from '../types';
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

    const getTaskPosition = (task: Task) => {
      const totalDays = (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24);
      const startDay = (task.start.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24);
      const taskDays = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24);

      return {
        left: (startDay / totalDays) * 100,
        width: (taskDays / totalDays) * 100,
      };
    };

    const getTaskPositionForLinks = (task: Task) => {
      const totalDays = (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24);
      const startDay = (task.start.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24);
      const taskDays = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24);
      const index = localTasks.findIndex(t => t.id === task.id);

      // Calculate pixel positions
      const containerWidth = secondaryCells.length * columnWidth;
      const left = (startDay / totalDays) * containerWidth;
      const width = (taskDays / totalDays) * containerWidth;
      const top = index * (config.rowHeight || 44) + ((config.rowHeight || 44) / 2) - 16;
      const height = 32;

      return { left, top, width, height };
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

    return (
      <div 
        className="gantt-timeline-container" 
        ref={ref} 
        onScroll={onScroll}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="gantt-timeline-header">
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
        
        <div className="gantt-timeline-body">
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
          <div className="gantt-timeline-tasks">
            {localTasks.map((task, index) => {
              const position = getTaskPosition(task);
              
              return (
                <div
                  key={task.id}
                  className="gantt-timeline-row"
                  style={{ 
                    height: config.rowHeight,
                    top: index * (config.rowHeight || 44),
                  }}
                >
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
