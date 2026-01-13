import React, { forwardRef } from 'react';
import type { Task, Column } from '../types';
import { formatDate } from '../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faGripVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'antd';

interface GridProps {
  tasks: Task[];
  columns: Column[];
  rowHeight: number;
  selectedTask: string | null;
  onTaskClick: (taskId: string) => void;
  onTaskContextMenu?: (e: React.MouseEvent, taskId: string) => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onTaskUpdate?: (task: Task) => void;
  onTaskDragStart?: (taskId: string, clientX: number, clientY: number, type: 'reorder') => void;
  onAddTask?: (taskId?: string) => void;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ tasks, columns, rowHeight, selectedTask, onTaskClick, onTaskContextMenu, onScroll, onTaskUpdate, onTaskDragStart, onAddTask }, ref) => {

    const calculateDepth = (task: Task, depth = 0): number => {
      if (!task.parent) return depth;
      const parentTask = tasks.find(t => t.id === task.parent);
      if (!parentTask) return depth;
      return calculateDepth(parentTask, depth + 1);
    };

    const getCellValue = (task: Task, column: Column): React.ReactNode => {
      if (column.template) {
        return column.template(task);
      }

      switch (column.name) {
        case 'text':
          const depth = calculateDepth(task);
          return (
            <div className="gantt-grid-cell-text" style={{ paddingLeft: depth * 20 }}>
              <div
                className="gantt-row-drag-handle"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onTaskDragStart?.(task.id, e.clientX, e.clientY, 'reorder');
                }}
              >
                <FontAwesomeIcon icon={faGripVertical} />
              </div>
              {task.type === 'project' && (
                <span className="gantt-tree-icon" onClick={(e) => {
                  e.stopPropagation();
                  onTaskUpdate?.({ ...task, open: !task.open });
                }}>
                  <FontAwesomeIcon icon={task.open ? faChevronDown : faChevronRight} />
                </span>
              )}
              {task.type !== 'project' && <span style={{ width: 16, display: 'inline-block' }} />}
              <span className="gantt-task-name-text">{task.text}</span>
            </div>
          );
        case 'start':
          return formatDate(task.start, 'DD-MM-YYYY');
        case 'end':
          return formatDate(task.end, 'DD-MM-YYYY');
        case 'duration':
          return `${task.duration}`;
        case 'add':
          return (
            <Button
              type="text"
              size="small"
              icon={<FontAwesomeIcon icon={faPlus} style={{ fontSize: 12, color: '#adb5bd' }} />}
              onClick={(e) => {
                e.stopPropagation();
                onAddTask?.(task.id);
              }}
            />
          );
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
              {column.name === 'add' ? (
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ fontSize: 12, color: '#adb5bd', cursor: 'pointer' }}
                  onClick={() => onAddTask?.()}
                />
              ) : column.label}
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
              onContextMenu={(e) => onTaskContextMenu?.(e, task.id)}
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
