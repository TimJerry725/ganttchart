import React, { useState } from 'react';
import { Task } from '../types';
import { formatDate } from '../utils/dateUtils';

interface TaskEditorProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClose: () => void;
}

export const TaskEditor: React.FC<TaskEditorProps> = ({ task, onUpdate, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    text: task.text,
    start: task.start,
    duration: task.duration,
    progress: task.progress,
    type: task.type || 'task',
    color: task.color || '#4A90E2',
    owner: task.owner || '',
    priority: task.priority || 'medium',
    details: task.details || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const end = new Date(formData.start);
    end.setDate(end.getDate() + formData.duration);

    onUpdate({
      ...task,
      text: formData.text,
      start: formData.start,
      end: end,
      duration: formData.duration,
      progress: formData.progress,
      type: formData.type,
      color: formData.color,
      owner: formData.owner,
      priority: formData.priority,
      details: formData.details,
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${task.text}"?`)) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="gantt-modal-overlay" onClick={onClose}>
      <div className="gantt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gantt-modal-header">
          <h3>Edit Task</h3>
          <button className="gantt-modal-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="gantt-modal-body">
          <div className="gantt-form-row">
            <label>Task Name *</label>
            <input
              type="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
            />
          </div>

          <div className="gantt-form-row-group">
            <div className="gantt-form-row">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Task['type'] })}
              >
                <option value="task">Task</option>
                <option value="milestone">Milestone</option>
                <option value="project">Project</option>
              </select>
            </div>

            <div className="gantt-form-row">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="gantt-form-row-group">
            <div className="gantt-form-row">
              <label>Start Date</label>
              <input
                type="date"
                value={formatDate(formData.start, 'YYYY-MM-DD')}
                onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
              />
            </div>

            <div className="gantt-form-row">
              <label>Duration (days)</label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div className="gantt-form-row-group">
            <div className="gantt-form-row">
              <label>Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            <div className="gantt-form-row">
              <label>Progress (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              />
              <span className="gantt-progress-value">{formData.progress}%</span>
            </div>
          </div>

          <div className="gantt-form-row">
            <label>Owner</label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="Assign to..."
            />
          </div>

          <div className="gantt-form-row">
            <label>Details</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Add task description..."
              rows={3}
            />
          </div>

          <div className="gantt-modal-footer">
            <button type="button" onClick={handleDelete} className="gantt-btn gantt-btn-danger">
              Delete
            </button>
            <div className="gantt-modal-footer-right">
              <button type="button" onClick={onClose} className="gantt-btn gantt-btn-secondary">
                Cancel
              </button>
              <button type="submit" className="gantt-btn gantt-btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
