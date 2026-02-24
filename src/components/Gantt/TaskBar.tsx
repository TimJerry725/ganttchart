import React from 'react';
import type { Task, TaskSegment } from './types';
import { Tooltip } from 'antd';
import { formatDate } from './utils/dateUtils';

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

    // Add status-based class if status is defined
    if (task.status) {
      classes.push(`status-${task.status}`);
    }

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
      {!readonly && !isSegment && (
        <div
          className="gantt-task-resize-handle gantt-task-resize-left"
          onMouseDown={(e) => handleMouseDown(e, 'resize-left')}
        />
      )}

      {/* Progress bar - not shown for milestones */}
      {!isSegment && task.type !== 'milestone' && (
        <div
          className="gantt-task-progress"
          style={{ width: `${task.progress}%` }}
        >
          {task.progress > 5 && task.progress < 100 && (
            <span className="gantt-task-progress-text">{task.progress}%</span>
          )}
        </div>
      )}

      {/* Task content container */}
      <div className="gantt-task-content">
        {!isSegment && (
          <span className="gantt-task-text">{task.text}</span>
        )}
      </div>

      {/* Resize handle - right */}
      {!readonly && !isSegment && (
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

  if ((task.segments && task.segments.length > 0) || (task.onHoldPeriods && task.onHoldPeriods.length > 0)) {
    const totalDuration = task.end.getTime() - task.start.getTime();

    // Fallback to a single segment if no segments provided but we have on-hold periods
    const effectiveSegments = (task.segments && task.segments.length > 0)
      ? task.segments
      : [{ start: task.start, end: task.end, duration: task.duration || 0 }];

    return (
      <div className="gantt-task-group">
        {/* Render on-hold periods only within the task's date range */}
        {totalDuration > 0 && task.onHoldPeriods?.map((hold, i) => {
          // Clamp hold period to task boundaries for rendering
          const holdStartMs = Math.max(hold.start.getTime(), task.start.getTime());
          const holdEndMs = Math.min(hold.end.getTime(), task.end.getTime());
          const holdDuration = holdEndMs - holdStartMs;
          // Skip if the on-hold period doesn't overlap with the task range
          if (holdDuration <= 0) return null;
          const holdLeft = position.left + ((holdStartMs - task.start.getTime()) / totalDuration) * position.width;
          const holdWidth = (holdDuration / totalDuration) * position.width;
          return (
            <div
              key={`hold-${i}`}
              className="gantt-on-hold-period"
              style={{
                left: `${holdLeft}px`,
                width: `${holdWidth}px`,
              }}
            />
          );
        })}

        {/* Render active segments */}
        {effectiveSegments.map((seg: TaskSegment, i) => (
          <Tooltip key={`seg-${i}`} title={tooltipContent} mouseEnterDelay={0.5}>
            <div
              className={getTaskBarClass() + ' segment'}
              style={{
                left: `${totalDuration > 0 ? position.left + (seg.start.getTime() - task.start.getTime()) / totalDuration * position.width : position.left}px`,
                width: `${totalDuration > 0 ? (seg.end.getTime() - seg.start.getTime()) / totalDuration * position.width : position.width}px`,
                backgroundColor: task.color || undefined,
              }}
              onClick={onClick}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            >
              {/* Show text only in the first segment or if it's the only one */}
              {renderTaskBarContent(i > 0)}
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
