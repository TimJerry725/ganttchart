import React, { forwardRef } from 'react';
import type { Task, Column, Link } from '../types';
import { formatDate } from '../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faGripVertical, faPlus, faLink } from '@fortawesome/free-solid-svg-icons';
import { Button, Tooltip } from 'antd';

interface GridProps {
  tasks: Task[];
  columns: Column[];
  selectedTask: string | null;
  onTaskClick: (taskId: string) => void;
  onTaskContextMenu?: (e: React.MouseEvent, taskId: string) => void;

  onTaskUpdate?: (task: Task) => void;
  onTaskDragStart?: (taskId: string, clientX: number, clientY: number, type: 'reorder') => void;
  onAddTask?: (taskId?: string) => void;
  onDependencyClick?: (taskId: string) => void;
  links?: Link[];
  dropIndicator?: { taskId: string; position: 'above' | 'below' | 'inside' } | null;
  reorderTask?: { id: string; initialIndex: number; currentY: number; descendantIds: string[] } | null;
}

// Force rebuild
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ tasks, columns, selectedTask, onTaskClick, onTaskContextMenu, onTaskUpdate, onTaskDragStart, onAddTask, onDependencyClick, links = [], dropIndicator, reorderTask }, ref) => {
    const localRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => localRef.current!);

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
            <div className="gantt-grid-cell-text" style={{ paddingLeft: depth * 14 }}>
              <div
                className="gantt-row-drag-handle"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onTaskDragStart?.(task.id, e.clientX, e.clientY, 'reorder');
                }}
              >
                <FontAwesomeIcon icon={faGripVertical} />
              </div>
              {task.type === 'project' ? (
                <span className="gantt-tree-icon" onClick={(e) => {
                  e.stopPropagation();
                  onTaskUpdate?.({ ...task, open: !task.open });
                }}>
                  <FontAwesomeIcon icon={task.open ? faChevronDown : faChevronRight} />
                </span>
              ) : (
                <span style={{ width: 16, display: 'inline-block' }} />
              )}
              <span className="gantt-task-name-text">{task.text}</span>
            </div>
          );
        case 'start':
          return formatDate(task.start, 'DD-MM-YYYY');
        case 'end':
          return formatDate(task.end, 'DD-MM-YYYY');
        case 'duration':
          const hasDependencies = links.some(l => l.target === task.id || l.source === task.id);
          return (
            <Tooltip title="Click to manage dependencies">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onDependencyClick?.(task.id);
                }}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{task.duration}</span>
                {hasDependencies && (
                  <FontAwesomeIcon
                    icon={faLink}
                    style={{ fontSize: 10, color: '#1890ff', opacity: 0.7 }}
                  />
                )}
              </div>
            </Tooltip>
          );
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
      <div className="gantt-grid" ref={localRef}>
        <div className="gantt-grid-header">
          {columns.map((column) => (
            <div
              key={column.name}
              className="gantt-grid-header-cell"
              style={{
                width: column.width,
                justifyContent: column.align === 'center' ? 'center' : 'flex-start',
              }}
            >
              {column.name === 'add' ? (
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ fontSize: 12, color: '#64748b', cursor: 'pointer' }}
                  onClick={() => onAddTask?.()}
                />
              ) : (
                <>
                  {column.label}
                  {column.name === 'start' && (
                    <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: 8, fontSize: 10, color: '#64748b' }} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="gantt-grid-body">
          {tasks.map((task) => {
            const isDragging = reorderTask?.id === task.id;
            const isDescendantDragging = reorderTask?.descendantIds.includes(task.id);

            return (
              <div
                key={task.id}
                className={`gantt-grid-row ${selectedTask === task.id ? 'selected' : ''} ${isDragging ? 'dragging-row' : ''} ${isDescendantDragging ? 'descendant-dragging-row' : ''} ${dropIndicator?.taskId === task.id ? `drop-target-${dropIndicator.position}` : ''}`}
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
                {dropIndicator?.taskId === task.id && (
                  <div className={`gantt-drop-indicator ${dropIndicator.position}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

Grid.displayName = 'Grid';
