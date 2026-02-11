import React, { forwardRef, memo } from 'react';
import type { Task, Column, Link } from './types';
import { formatDate, addToDate } from './utils/dateUtils';
import { DependencyPopover } from './DependencyPopover';
import { formatDependencyDisplay } from './utils/dependencyParser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faGripVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, InputNumber } from 'antd';

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
  onRemoveDependency?: (linkId: string) => void;
  onDependencyClick?: (taskId: string) => void;
  links?: Link[];
  allTasks?: Task[];
  dropIndicator?: { taskId: string; position: 'above' | 'below' | 'inside' } | null;
  reorderTask?: { id: string; initialIndex: number; currentY: number; descendantIds: string[] } | null;
  iconConfig?: Partial<import('./types').GanttIconConfig>;
  styleConfig?: Partial<import('./types').GanttStyleConfig>;
}

// Memoized Grid component for performance
export const Grid = memo(forwardRef<HTMLDivElement, GridProps>(
  ({ tasks, allTasks = [], columns, selectedTask, onTaskClick, onTaskContextMenu, onTaskUpdate, onTaskDragStart, onAddTask, onAddDependency, onRemoveDependency, links = [], dropIndicator, reorderTask, styleConfig }, ref) => {
    const localRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => localRef.current!);

    const [editingDurationTaskId, setEditingDurationTaskId] = React.useState<string | null>(null);
    const [tempDuration, setTempDuration] = React.useState<number>(0);

    const calculateDepth = (task: Task, depth = 0): number => {
      if (!task.parent) return depth;
      const parentTask = tasks.find(t => t.id === task.parent);
      if (!parentTask) return depth;
      return calculateDepth(parentTask, depth + 1);
    };

    const handleDurationUpdate = (task: Task, newDuration: number) => {
      if (newDuration === task.duration) return;

      const newEndDate = addToDate(new Date(task.start), newDuration, 'day');
      onTaskUpdate?.({
        ...task,
        duration: newDuration,
        end: newEndDate
      });
    };

    const getCellValue = (task: Task, column: Column): React.ReactNode => {
      if (column.template) {
        return column.template(task);
      }

      switch (column.name) {
        case 'text': {
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
        }
        case 'start':
          return formatDate(task.start, 'DD-MM-YYYY');
        case 'end':
          return formatDate(task.end, 'DD-MM-YYYY');
        case 'duration': {
          const isEditing = editingDurationTaskId === task.id;
          if (isEditing) {
            return (
              <InputNumber
                size="small"
                min={1}
                value={tempDuration}
                onChange={(v) => setTempDuration(v || 1)}
                onBlur={() => {
                  handleDurationUpdate(task, tempDuration);
                  setEditingDurationTaskId(null);
                }}
                onPressEnter={() => {
                  handleDurationUpdate(task, tempDuration);
                  setEditingDurationTaskId(null);
                }}
                autoFocus
                style={{ width: '100%', fontSize: '12px' }}
              />
            );
          }
          return (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setEditingDurationTaskId(task.id);
                setTempDuration(task.duration);
              }}
              style={{
                backgroundColor: '#fff7e6',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #ffd591',
                fontWeight: 400,
                color: '#d46b08',
                display: 'inline-block',
                fontSize: '12px',
                cursor: 'text'
              }}
            >
              {task.duration} day{task.duration !== 1 ? 's' : ''}
            </div>
          );
        }
        case 'predecessors': {
          const predecessors = links.filter(l => l.target === task.id);
          const firstPredecessor = predecessors[0]; // Only show the first dependency
          return (
            <DependencyPopover
              task={task}
              allTasks={allTasks}
              links={links}
              onAddDependency={(sourceId, targetId, type, lag) => onAddDependency?.(sourceId, targetId, type, lag)}
              onRemoveDependency={(linkId) => onRemoveDependency?.(linkId)}
              onTaskUpdate={onTaskUpdate}
              styleConfig={styleConfig}
            >
              <div
                style={{
                  cursor: 'pointer',
                  minHeight: '24px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {firstPredecessor ? (
                  (() => {
                    const sourceTask = allTasks.find(t => t.id === firstPredecessor.source);
                    const sourceIdx = sourceTask ? allTasks.indexOf(sourceTask) + 1 : 0;
                    return (
                      <span
                        style={{
                          fontSize: '12px',
                          backgroundColor: '#e6f4ff',
                          border: '1px solid #91caff',
                          color: '#1677ff',
                          padding: '0 7px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {formatDependencyDisplay(firstPredecessor, sourceIdx)}
                      </span>
                    );
                  })()
                ) : (
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#1890ff',
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Add
                  </span>
                )}
              </div>
            </DependencyPopover>
          );
        }
        case 'add':
          // Show subtask button for all tasks
          return (
            <Button
              type="primary"
              size="small"
              icon={<FontAwesomeIcon icon={faPlus} style={{ fontSize: 12 }} />}
              onClick={(e) => {
                e.stopPropagation();
                // Add subtask - pass parent task ID
                onAddTask?.(task.id);
              }}
              title="Add Subtask"
              style={{
                minWidth: '28px',
                width: '28px',
                height: '28px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
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
          return (task as unknown as Record<string, unknown>)[column.name] as string || '';
      }
    };

    return (
      <div className="gantt-grid" ref={localRef}>
        <div className="gantt-grid-header" style={{ display: 'flex', minWidth: '100%' }}>
          {columns.map((column) => (
            <div
              key={column.name}
              className="gantt-grid-header-cell"
              style={{
                width: column.width,
                minWidth: column.width, /* Ensure column maintains width */
                justifyContent: column.align === 'center' ? 'center' : 'flex-start',
              }}
            >
              {column.name === 'add' ? (
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Add</span>
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
                style={{
                  display: 'flex',
                  minWidth: '100%', /* Ensure row spans all columns */
                }}
              >
                {columns.map((column) => {
                  // Ensure add column is always visible
                  const isAddColumn = column.name === 'add';
                  return (
                    <div
                      key={`${task.id}-${column.name}`}
                      className="gantt-grid-cell"
                      style={{
                        width: column.width,
                        minWidth: column.width, /* Ensure column maintains width */
                        textAlign: column.align || 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isAddColumn ? 'center' :
                          (column.name === 'text' ? 'flex-start' :
                            (column.align === 'center' ? 'center' :
                              (column.align === 'right' ? 'flex-end' : 'flex-start'))),
                        visibility: 'visible', /* Ensure column is visible */
                        opacity: 1, /* Ensure column is not transparent */
                      }}
                    >
                      {getCellValue(task, column)}
                    </div>
                  );
                })}
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
));

Grid.displayName = 'Grid';
