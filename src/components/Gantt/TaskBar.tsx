import React, { useState } from 'react';
import type { Task } from '../types';

interface TaskBarProps {
  task: Task;
  position: { left: number; width: number };
  selected: boolean;
  dragging: boolean;
  onClick: () => void;
  onDragStart: (type: 'move' | 'resize-left' | 'resize-right') => void;
  onDragEnd: () => void;
  onUpdate?: (task: Task) => void;
  readonly?: boolean;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  position,
  selected,
  dragging,
  onClick,
  onDragStart,
  onDragEnd,
  onUpdate,
  readonly = false,
}) => {
  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize-left' | 'resize-right') => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    onDragStart(type);
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
    return {
      left: `${position.left}px`,
      width: `${position.width}px`,
      backgroundColor: task.color || '#5A9FD4',
    };
  };

  return (
    <div
      className={getTaskBarClass()}
      style={getTaskBarStyle()}
      onClick={onClick}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
    >
      {/* Resize handle - left */}
      {!readonly && task.type !== 'milestone' && (
        <div
          className="gantt-task-resize-handle gantt-task-resize-left"
          onMouseDown={(e) => handleMouseDown(e, 'resize-left')}
        />
      )}

      {/* Progress bar */}
      <div
        className="gantt-task-progress"
        style={{ width: `${task.progress}%` }}
      />

      {/* Task content */}
      <div className="gantt-task-content">
        {task.type === 'milestone' ? (
          <div className="gantt-milestone-marker">◆</div>
        ) : (
          <span className="gantt-task-text">{task.text}</span>
        )}
      </div>

      {/* Resize handle - right */}
      {!readonly && task.type !== 'milestone' && (
        <div
          className="gantt-task-resize-handle gantt-task-resize-right"
          onMouseDown={(e) => handleMouseDown(e, 'resize-right')}
        />
      )}
    </div>
  );
};
