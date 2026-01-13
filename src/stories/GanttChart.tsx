import React, { useState } from 'react';
import './ganttchart.css';

export interface Task {
  id: string;
  name: string;
  startDate: Date;
  duration: number;
  progress: number;
  isParent?: boolean;
  children?: Task[];
  dependencies?: string[];
  color?: string;
}

export interface GanttChartProps {
  tasks: Task[];
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({ 
  tasks, 
  onTaskUpdate,
  onTaskDelete 
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const startDate = new Date(2024, 2, 4); // March 4, 2024
  const days = 15;

  const getDaysSinceStart = (date: Date) => {
    const diff = date.getTime() - startDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditedTask({ ...task });
  };

  const handleSave = () => {
    if (editedTask && onTaskUpdate) {
      onTaskUpdate(editedTask);
      setSelectedTask(null);
      setEditedTask(null);
    }
  };

  const handleDelete = () => {
    if (editedTask && onTaskDelete) {
      onTaskDelete(editedTask.id);
      setSelectedTask(null);
      setEditedTask(null);
    }
  };

  const renderTask = (task: Task, level: number = 0) => {
    const startDay = getDaysSinceStart(task.startDate);
    const isExpanded = expandedTasks.has(task.id);

    return (
      <React.Fragment key={task.id}>
        <div className="gantt-row">
          <div 
            className="gantt-task-name" 
            style={{ paddingLeft: `${level * 20 + 10}px` }}
          >
            {task.isParent && (
              <button 
                className="gantt-expand-btn"
                onClick={() => toggleExpand(task.id)}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            {task.name}
          </div>
          <div className="gantt-timeline">
            {!task.isParent && (
              <div
                className="gantt-bar"
                style={{
                  left: `${(startDay / days) * 100}%`,
                  width: `${(task.duration / days) * 100}%`,
                  backgroundColor: task.color || '#4A90E2',
                  cursor: 'pointer'
                }}
                onClick={() => handleTaskClick(task)}
              >
                <div className="gantt-bar-label">{task.name}</div>
                <div 
                  className="gantt-bar-progress" 
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            )}
            {task.isParent && (
              <div
                className="gantt-parent-bar"
                style={{
                  left: `${(startDay / days) * 100}%`,
                  width: `${(task.duration / days) * 100}%`,
                  backgroundColor: task.color || '#52C785',
                }}
              >
                {task.name}
              </div>
            )}
          </div>
        </div>
        {task.isParent && task.children && isExpanded &&
          task.children.map(child => renderTask(child, level + 1))
        }
      </React.Fragment>
    );
  };

  const formatDate = (date: Date) => {
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="gantt-container">
      <div className="gantt-main">
        <div className="gantt-header">
          <div className="gantt-task-name-header">Task Name</div>
          <div className="gantt-timeline-header">
            {Array.from({ length: days }, (_, i) => (
              <div key={i} className="gantt-day-header">
                {i + 4}
              </div>
            ))}
          </div>
        </div>
        <div className="gantt-body">
          {tasks.map(task => renderTask(task))}
        </div>
      </div>

      {selectedTask && editedTask && (
        <div className="gantt-panel">
          <div className="gantt-panel-header">
            <h3>Task action</h3>
            <button 
              className="gantt-close-btn"
              onClick={() => {
                setSelectedTask(null);
                setEditedTask(null);
              }}
            >
              ✕
            </button>
          </div>

          <div className="gantt-panel-content">
            <div className="gantt-form-group">
              <label>Name</label>
              <input
                type="text"
                value={editedTask.name}
                onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                className="gantt-input"
              />
            </div>

            <div className="gantt-form-group">
              <label>Description</label>
              <textarea
                className="gantt-textarea"
                rows={3}
                placeholder="Add description..."
              />
            </div>

            <div className="gantt-form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formatDate(editedTask.startDate)}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setEditedTask({ ...editedTask, startDate: newDate });
                }}
                className="gantt-input"
              />
            </div>

            <div className="gantt-form-group">
              <label>Duration</label>
              <div className="gantt-duration-control">
                <button 
                  onClick={() => setEditedTask({ 
                    ...editedTask, 
                    duration: Math.max(1, editedTask.duration - 1) 
                  })}
                >
                  −
                </button>
                <input
                  type="number"
                  value={editedTask.duration}
                  onChange={(e) => setEditedTask({ 
                    ...editedTask, 
                    duration: parseInt(e.target.value) || 1 
                  })}
                  className="gantt-duration-input"
                />
                <button 
                  onClick={() => setEditedTask({ 
                    ...editedTask, 
                    duration: editedTask.duration + 1 
                  })}
                >
                  +
                </button>
              </div>
            </div>

            <div className="gantt-form-group">
              <label>Progress {editedTask.progress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={editedTask.progress}
                onChange={(e) => setEditedTask({ 
                  ...editedTask, 
                  progress: parseInt(e.target.value) 
                })}
                className="gantt-slider"
              />
            </div>
          </div>

          <div className="gantt-panel-footer">
            <button className="gantt-btn gantt-btn-delete" onClick={handleDelete}>
              Delete
            </button>
            <button className="gantt-btn gantt-btn-save" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
