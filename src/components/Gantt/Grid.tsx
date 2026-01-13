import React, { forwardRef } from 'react';
import type { Task, Column } from '../types';
import { formatDate } from '../utils/dateUtils';

interface GridProps {
  tasks: Task[];
  columns: Column[];
  rowHeight: number;
  selectedTask: string | null;
  onTaskClick: (taskId: string) => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onTaskUpdate?: (task: Task) => void;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ tasks, columns, rowHeight, selectedTask, onTaskClick, onScroll, onTaskUpdate }, ref) => {
    
    const getCellValue = (task: Task, column: Column): React.ReactNode => {
      if (column.template) {
        return column.template(task);
      }

      switch (column.name) {
        case 'text':
          return (
            <div className="gantt-grid-cell-text">
              {task.type === 'project' && (
                <span className="gantt-tree-icon">{task.open ? '▼' : '▶'}</span>
              )}
              <span>{task.text}</span>
            </div>
          );
        case 'start':
          return formatDate(task.start, 'MM/DD/YYYY');
        case 'end':
          return formatDate(task.end, 'MM/DD/YYYY');
        case 'duration':
          return `${task.duration}d`;
        case 'progress':
          return (
            <div className="gantt-progress-cell">
              <div className="gantt-progress-bar-bg">
                <div 
                  className="gantt-progress-bar-fill" 
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <span className="gantt-progress-text">{task.progress}%</span>
            </div>
          );
        default:
          return (task as any)[column.name] || '';
      }
    };

    return (
      <div className="gantt-grid" ref={ref} onScroll={onScroll}>
        <div className="gantt-grid-header">
          {columns.map((column) => (
            <div
              key={column.name}
              className="gantt-grid-header-cell"
              style={{
                width: column.width,
                textAlign: column.align || 'left',
              }}
            >
              {column.label}
            </div>
          ))}
        </div>
        <div className="gantt-grid-body">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`gantt-grid-row ${selectedTask === task.id ? 'selected' : ''}`}
              style={{ height: rowHeight }}
              onClick={() => onTaskClick(task.id)}
            >
              {columns.map((column) => (
                <div
                  key={`${task.id}-${column.name}`}
                  className="gantt-grid-cell"
                  style={{
                    width: column.width,
                    textAlign: column.align || 'left',
                  }}
                >
                  {getCellValue(task, column)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Grid.displayName = 'Grid';
