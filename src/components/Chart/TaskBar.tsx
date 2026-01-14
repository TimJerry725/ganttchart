import React from 'react';
import type { Task, TaskSegment } from '../types';
import { Tooltip } from 'antd';
import { formatDate } from '../utils/dateUtils';

interface TaskBarProps {
  task: Task;
  position: { left: number; width: number };
  selected: boolean;
  dragging: boolean;
  onClick: () => void;
  onDragStart: (clientX: number, clientY: number, type: 'move' | 'resize-left' | 'resize-right') => void;
  dragDeltaX?: number;
  dragType?: 'move' | 'resize-left' | 'resize-right' | 'reorder' | null;
  readonly?: boolean;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  position,
  selected,
  dragging,
  onClick,
  onDragStart,
  dragDeltaX = 0,
  dragType = null,
  readonly = false,
}) => {
  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize-left' | 'resize-right') => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    onDragStart(e.clientX, e.clientY, type);
  };

  const getTaskBarClass = () => {
    const classes = ['gantt-task-bar'];

    if (task.type === 'milestone') classes.push('milestone');
    if (task.type === 'project') classes.push('project');
    if (selected) classes.push('selected');
    if (dragging) classes.push('dragging');

    return classes.join(' ');
  };

  const getTaskBarStyle = (): React.CSSProperties => {
    let left = position.left;
    let width = position.width;

    if (dragging && dragType) {
      if (dragType === 'move') {
        left += dragDeltaX;
      } else if (dragType === 'resize-left') {
        left += dragDeltaX;
        width -= dragDeltaX;
      } else if (dragType === 'resize-right') {
        width += dragDeltaX;
      }
    }

    return {
      left: `${left}px`,
      width: `${Math.max(width, 0)}px`,
      // Color handled by CSS classes (.project, .milestone) or task.color override
      backgroundColor: task.color || undefined,
    };
  };

  const renderTaskBarContent = (isSegment = false) => (
    <>
      {/* Resize handle - left */}
      {!readonly && task.type !== 'milestone' && !isSegment && (
        <div
          className="gantt-task-resize-handle gantt-task-resize-left"
          onMouseDown={(e) => handleMouseDown(e, 'resize-left')}
        />
      )}

      {/* Progress bar */}
      {!isSegment && task.type !== 'milestone' && (
        <div
          className="gantt-task-progress"
          style={{ width: `${task.progress}%` }}
        />
      )}

      {/* Task content container */}
      <div className="gantt-task-content">
        {!isSegment && task.type !== 'milestone' && (
          <span className="gantt-task-text">{task.text}</span>
        )}
      </div>

      {/* Milestone rendering (Independent of content clipping) */}
      {task.type === 'milestone' && (
        <>
          <div className="gantt-milestone-diamond" />
          <span className="gantt-milestone-text">{task.text}</span>
        </>
      )}

      {/* Resize handle - right */}
      {!readonly && task.type !== 'milestone' && !isSegment && (
        <div
          className="gantt-task-resize-handle gantt-task-resize-right"
          onMouseDown={(e) => handleMouseDown(e, 'resize-right')}
        />
      )}
    </>
  );

  const tooltipContent = (
    <div className="gantt-tooltip">
      <div className="gantt-tooltip-title">{task.text}</div>
      <div className="gantt-tooltip-dates">
        {formatDate(task.start, 'MMM D')} - {formatDate(task.end, 'MMM D')}
      </div>
      <div className="gantt-tooltip-progress">Progress: {task.progress}%</div>
      {task.owner && <div className="gantt-tooltip-owner">Owner: {task.owner}</div>}
    </div>
  );

  if (task.segments && task.segments.length > 0) {
    return (
      <div className="gantt-task-group">
        {task.segments.map((seg: TaskSegment, i) => (
          <Tooltip key={i} title={tooltipContent} mouseEnterDelay={0.5}>
            <div
              className={getTaskBarClass() + ' segment'}
              style={{
                left: `${position.left + (seg.start.getTime() - task.start.getTime()) / (task.end.getTime() - task.start.getTime()) * position.width}px`,
                width: `${(seg.end.getTime() - seg.start.getTime()) / (task.end.getTime() - task.start.getTime()) * position.width}px`,
                backgroundColor: task.color || '#ADCFFE',
              }}
              onClick={onClick}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            >
              {renderTaskBarContent(true)}
            </div>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <Tooltip title={tooltipContent} mouseEnterDelay={0.5}>
      <div
        className={getTaskBarClass()}
        style={getTaskBarStyle()}
        onClick={onClick}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
        {renderTaskBarContent()}
      </div>
    </Tooltip>
  );
};
