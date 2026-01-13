import React, { useState } from 'react';
import type { Task, Link } from '../types';

interface DependencyEditorProps {
  task: Task;
  allTasks: Task[];
  links: Link[];
  onAddDependency: (sourceId: string, targetId: string, type: Link['type'], lag?: number) => void;
  onRemoveDependency: (linkId: string) => void;
  onClose: () => void;
}

export const DependencyEditor: React.FC<DependencyEditorProps> = ({
  task,
  allTasks,
  links,
  onAddDependency,
  onRemoveDependency,
  onClose,
}) => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [dependencyType, setDependencyType] = useState<Link['type']>('e2s');
  const [lagTime, setLagTime] = useState<number>(0);

  // Get existing dependencies
  const existingDependencies = links.filter(link => link.target === task.id);
  const existingDependents = links.filter(link => link.source === task.id);

  // Get available tasks (exclude self and parent chain)
  const availableTasks = allTasks.filter(t => t.id !== task.id && t.id !== task.parent);

  const handleAdd = () => {
    if (selectedTask) {
      onAddDependency(selectedTask, task.id, dependencyType, lagTime);
      setSelectedTask('');
      setLagTime(0);
    }
  };

  const getDependencyLabel = (type: Link['type']) => {
    switch (type) {
      case 'e2s': return 'Finish-to-Start (FS)';
      case 's2s': return 'Start-to-Start (SS)';
      case 'e2e': return 'Finish-to-Finish (FF)';
      case 's2e': return 'Start-to-Finish (SF)';
    }
  };

  const getLagLabel = (lag?: number) => {
    if (!lag || lag === 0) return '';
    if (lag > 0) return `+${lag}d lag`;
    return `${lag}d lead`;
  };

  return (
    <div className="gantt-dependency-editor-overlay" onClick={onClose}>
      <div className="gantt-dependency-editor" onClick={(e) => e.stopPropagation()}>
        <div className="gantt-dependency-editor-header">
          <h3>Task Dependencies: {task.text}</h3>
          <button className="gantt-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="gantt-dependency-editor-body">
          {/* Current Dependencies (Predecessors) */}
          <div className="gantt-dependency-section">
            <h4>Depends On (Predecessors)</h4>
            {existingDependencies.length === 0 ? (
              <p className="gantt-empty-message">No dependencies</p>
            ) : (
              <ul className="gantt-dependency-list">
                {existingDependencies.map(link => {
                  const sourceTask = allTasks.find(t => t.id === link.source);
                  return (
                    <li key={link.id} className="gantt-dependency-item">
                      <div className="gantt-dependency-info">
                        <span className="gantt-dependency-task-name">
                          {sourceTask?.text || link.source}
                        </span>
                        <span className="gantt-dependency-type">
                          {getDependencyLabel(link.type)}
                        </span>
                        {link.lag !== undefined && link.lag !== 0 && (
                          <span className="gantt-dependency-lag">
                            {getLagLabel(link.lag)}
                          </span>
                        )}
                      </div>
                      <button
                        className="gantt-dependency-remove"
                        onClick={() => onRemoveDependency(link.id)}
                        title="Remove dependency"
                      >
                        🗑️
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Dependent Tasks (Successors) */}
          <div className="gantt-dependency-section">
            <h4>Dependents (Successors)</h4>
            {existingDependents.length === 0 ? (
              <p className="gantt-empty-message">No dependent tasks</p>
            ) : (
              <ul className="gantt-dependency-list">
                {existingDependents.map(link => {
                  const targetTask = allTasks.find(t => t.id === link.target);
                  return (
                    <li key={link.id} className="gantt-dependency-item">
                      <div className="gantt-dependency-info">
                        <span className="gantt-dependency-task-name">
                          {targetTask?.text || link.target}
                        </span>
                        <span className="gantt-dependency-type">
                          {getDependencyLabel(link.type)}
                        </span>
                        {link.lag !== undefined && link.lag !== 0 && (
                          <span className="gantt-dependency-lag">
                            {getLagLabel(link.lag)}
                          </span>
                        )}
                      </div>
                      <button
                        className="gantt-dependency-remove"
                        onClick={() => onRemoveDependency(link.id)}
                        title="Remove dependency"
                      >
                        🗑️
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Add New Dependency */}
          <div className="gantt-dependency-section gantt-add-dependency">
            <h4>Add New Dependency</h4>
            <div className="gantt-dependency-form">
              <div className="gantt-form-row">
                <label>Task:</label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="gantt-select"
                >
                  <option value="">Select task...</option>
                  {availableTasks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="gantt-form-row">
                <label>Type:</label>
                <select
                  value={dependencyType}
                  onChange={(e) => setDependencyType(e.target.value as Link['type'])}
                  className="gantt-select"
                >
                  <option value="e2s">Finish-to-Start (FS)</option>
                  <option value="s2s">Start-to-Start (SS)</option>
                  <option value="e2e">Finish-to-Finish (FF)</option>
                  <option value="s2e">Start-to-Finish (SF)</option>
                </select>
              </div>

              <div className="gantt-form-row">
                <label>
                  Lead/Lag (days):
                  <span className="gantt-help-text">
                    Negative = lead time, Positive = lag time
                  </span>
                </label>
                <input
                  type="number"
                  value={lagTime}
                  onChange={(e) => setLagTime(parseInt(e.target.value) || 0)}
                  className="gantt-input"
                  placeholder="0"
                />
              </div>

              <div className="gantt-form-actions">
                <button
                  onClick={handleAdd}
                  disabled={!selectedTask}
                  className="gantt-btn gantt-btn-primary"
                >
                  Add Dependency
                </button>
              </div>
            </div>
          </div>

          {/* Quick Help */}
          <div className="gantt-dependency-help">
            <h5>💡 Dependency Types:</h5>
            <ul>
              <li><strong>Finish-to-Start (FS):</strong> The successor task cannot start until the predecessor finishes</li>
              <li><strong>Start-to-Start (SS):</strong> Both tasks start at the same time</li>
              <li><strong>Finish-to-Finish (FF):</strong> Both tasks finish at the same time</li>
              <li><strong>Start-to-Finish (SF):</strong> The successor finishes when the predecessor starts</li>
            </ul>
            <h5>💡 Keyboard Shortcuts:</h5>
            <p>Format: <code>[TaskID][Type]+/-[Days]d</code></p>
            <p>Example: <code>3FS+10d</code> = Task 3, Finish-to-Start, 10 days lag</p>
          </div>
        </div>
      </div>
    </div>
  );
};
