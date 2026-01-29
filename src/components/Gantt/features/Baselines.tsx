import React from 'react';
import type { Task, Baseline } from '../types';

interface BaselineRendererProps {
  task: Task;
  baseline?: Baseline;
  position: { left: number; width: number };
  getBaselinePosition: (baseline: Baseline) => { left: number; width: number };
}

export const BaselineRenderer: React.FC<BaselineRendererProps> = ({
  task,
  baseline,
  position,
  getBaselinePosition,
}) => {
  if (!baseline) return null;

  const baselinePos = getBaselinePosition(baseline);

  // Calculate variance
  const startVariance = (task.start.getTime() - baseline.start.getTime()) / (1000 * 60 * 60 * 24);
  const endVariance = (task.end.getTime() - baseline.end.getTime()) / (1000 * 60 * 60 * 24);

  const isDelayed = startVariance > 0 || endVariance > 0;
  const isAhead = startVariance < 0 && endVariance < 0;

  return (
    <div className="gantt-baseline-container">
      {/* Baseline bar */}
      <div
        className={`gantt-baseline-bar ${task.type === 'milestone' ? 'milestone' : ''}`}
        style={{
          left: `${baselinePos.left}%`,
          width: `${baselinePos.width}%`,
        }}
        title={`Baseline: ${baseline.start.toLocaleDateString()} - ${baseline.end.toLocaleDateString()}`}
      />

      {/* Variance indicator */}
      {(isDelayed || isAhead) && (
        <div
          className={`gantt-variance-indicator ${isDelayed ? 'delayed' : 'ahead'}`}
          style={{
            left: `${Math.min(position.left, baselinePos.left)}%`,
            width: `${Math.abs(position.left - baselinePos.left) + Math.max(position.width, baselinePos.width)}%`,
          }}
        >
          <span className="gantt-variance-label">
            {isDelayed ? `+${Math.round(Math.abs(endVariance))}d` : `-${Math.round(Math.abs(endVariance))}d`}
          </span>
        </div>
      )}
    </div>
  );
};
