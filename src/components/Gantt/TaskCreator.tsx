import React, { useState } from 'react';
import { Task } from '../types';
import { formatDate } from '../utils/dateUtils';

interface TaskCreatorProps {
  onCreateTask: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
}

export const TaskCreator: React.FC<TaskCreatorProps> = ({ onCreateTask, onClose }) => {
  const [formData, setFormData] = useState({
    text: '',
    start: new Date(),
    duration: 1,
    progress: 0,
    type: 'task' as Task['type'],
    color: '#4A90E2',
    owner: '',
    priority: 'medium' as Task['priority'],
    details: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const end = new Date(formData.start);
    end.setDate(end.getDate() + formData.duration);

    onCreateTask({
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

  return (
    <div className="gantt-modal-overlay" onClick={onClose}>
      <div className="gantt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gantt-modal-header">
          <h3>Create New Task</h3>
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
              placeholder="Enter task name"
              autoFocus
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
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
              />
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
            <button type="button" onClick={onClose} className="gantt-btn gantt-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="gantt-btn gantt-btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
