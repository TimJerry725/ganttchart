import React, { forwardRef } from 'react';
import type { Task, Column, Link } from './types';
import { formatDate } from './utils/dateUtils';
import { DependencyPopover } from './DependencyPopover';
import { formatDependencyDisplay } from './utils/dependencyParser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faGripVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'antd';

interface GridProps {
  tasks: Task[];
  columns: Column[];
  selectedTask: string | null;
  onTaskClick: (taskId: string) => void;
  onTaskContextMenu?: (e: React.MouseEvent, taskId: string) => void;

  onTaskUpdate?: (task: Task) => void;
  onTaskDragStart?: (taskId: string, clientX: number, clientY: number, type: 'reorder') => void;
  onAddTask?: (taskId?: string) => void;
  onAddDependency?: (sourceId: string, targetId: string, type: Link['type'], lag?: number) => void;
  onDependencyClick?: (taskId: string) => void;
  links?: Link[];
  allTasks?: Task[];
  dropIndicator?: { taskId: string; position: 'above' | 'below' | 'inside' } | null;
  reorderTask?: { id: string; initialIndex: number; currentY: number; descendantIds: string[] } | null;
}

// Force rebuild
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ tasks, allTasks = [], columns, selectedTask, onTaskClick, onTaskContextMenu, onTaskUpdate, onTaskDragStart, onAddTask, onAddDependency, links = [], dropIndicator, reorderTask }, ref) => {
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
          return (
            <div style={{
              backgroundColor: '#f6e7db',
              padding: '4px 12px',
              borderRadius: '4px',
              fontWeight: 600,
              color: '#434343',
              display: 'inline-block',
              minWidth: '70px',
              textAlign: 'center'
            }}>
              {task.duration} day{task.duration !== 1 ? 's' : ''}
            </div>
          );
        case 'predecessors':
          const predecessors = links.filter(l => l.target === task.id);
          return (
            <DependencyPopover
              task={task}
              allTasks={allTasks}
              links={links}
              onAddDependency={(sourceId, targetId, type, lag) => onAddDependency?.(sourceId, targetId, type, lag)}
            >
              <div style={{
                cursor: 'pointer',
                minHeight: '24px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {predecessors.map((link) => {
                  const sourceTask = allTasks.find(t => t.id === link.source);
                  const sourceIdx = sourceTask ? allTasks.indexOf(sourceTask) + 1 : 0;
                  return (
                    <span
                      key={link.id}
                      style={{
                        fontSize: '11px',
                        backgroundColor: '#e6f7ff',
                        border: '1px solid #91d5ff',
                        color: '#0050b3',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatDependencyDisplay(link, sourceIdx)}
                    </span>
                  );
                })}
              </div>
            </DependencyPopover>
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
        case 'index':
          return <span style={{ color: '#8c8c8c' }}>{allTasks.indexOf(task) + 1}</span>;
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
