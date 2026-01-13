/**
 * Timeline renderer (Canvas-based)
 */

import React, { useRef, useEffect } from 'react';
import type { Task, TaskId } from '../types';
import type { BarLayout, LinkLayout, TimeScale } from './layout';
import type { ScheduledTask } from '../engine/scheduler';

export interface TimelineRendererProps {
  tasks: Task[];
  bars: Map<TaskId, BarLayout>;
  links: LinkLayout[];
  timeScale: TimeScale;
  viewport: { x: number; y: number; width: number; height: number };
  criticalPath?: Set<TaskId>;
  onBarClick?: (taskId: TaskId) => void;
}

export const TimelineRenderer: React.FC<TimelineRendererProps> = ({
  bars,
  links,
  timeScale,
  viewport,
  criticalPath,
  onBarClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw time scale header
    const headerHeight = 30;
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, headerHeight);

    ctx.strokeStyle = '#d9d9d9';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#666666';
    ctx.font = '12px sans-serif';

    // Draw time markers
    const step = getTimeStep(timeScale);
    let currentDate = new Date(timeScale.startDate);
    while (currentDate <= timeScale.endDate) {
      const x = dateToX(currentDate, timeScale) - viewport.x;
      if (x >= 0 && x <= viewport.width) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, headerHeight);
        ctx.stroke();

        const label = formatDate(currentDate, timeScale.unit);
        ctx.fillText(label, x + 4, headerHeight / 2 + 4);
      }
      currentDate = addTimeUnit(currentDate, timeScale.unit, step);
    }

    // Draw links
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    for (const link of links) {
      const sourceX = link.sourceX - viewport.x;
      const sourceY = link.sourceY - viewport.y;
      const targetX = link.targetX - viewport.x;
      const targetY = link.targetY - viewport.y;

      if (
        (sourceX >= 0 && sourceX <= viewport.width) ||
        (targetX >= 0 && targetX <= viewport.width)
      ) {
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();

        // Arrowhead
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        const arrowLength = 8;
        const arrowAngle = Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(
          targetX - arrowLength * Math.cos(angle - arrowAngle),
          targetY - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.lineTo(
          targetX - arrowLength * Math.cos(angle + arrowAngle),
          targetY - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw bars
    const visibleBars = Array.from(bars.values()).filter(
      (bar) => bar.x + bar.width >= viewport.x && bar.x <= viewport.x + viewport.width
    );

    for (const bar of visibleBars) {
      const isCritical = criticalPath?.has(bar.taskId) || false;
      const y = bar.y - viewport.y;

      // Bar background
      ctx.fillStyle = isCritical ? '#ff4d4f' : '#1890ff';
      ctx.fillRect(bar.x - viewport.x, y, bar.width, bar.height);

      // Progress
      if (bar.progressX && bar.progressWidth) {
        ctx.fillStyle = '#52c41a';
        ctx.fillRect(bar.progressX - viewport.x, y, bar.progressWidth, bar.height);
      }

      // Border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(bar.x - viewport.x, y, bar.width, bar.height);
    }
  }, [bars, links, timeScale, viewport, criticalPath]);

  return (
    <div className="iris-gantt-timeline relative" style={{ width: viewport.width, height: viewport.height }}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{ width: viewport.width, height: viewport.height }}
        onClick={(e) => {
          // Hit testing would go here
        }}
      />
    </div>
  );
};

// Helper methods (would be in a utility class)
function dateToX(date: Date, timeScale: TimeScale): number {
  const diff = date.getTime() - timeScale.startDate.getTime();
  const days = diff / (1000 * 60 * 60 * 24);

  switch (timeScale.unit) {
    case 'day':
      return days * timeScale.pixelsPerUnit;
    case 'week':
      return (days / 7) * timeScale.pixelsPerUnit;
    case 'month':
      return (days / 30) * timeScale.pixelsPerUnit;
    case 'quarter':
      return (days / 90) * timeScale.pixelsPerUnit;
    case 'year':
      return (days / 365) * timeScale.pixelsPerUnit;
    default:
      return days * timeScale.pixelsPerUnit;
  }
}

function getTimeStep(timeScale: TimeScale): number {
  return 1;
}

function addTimeUnit(date: Date, unit: TimeScale['unit'], step: number): Date {
  const result = new Date(date);
  switch (unit) {
    case 'day':
      result.setDate(result.getDate() + step);
      break;
    case 'week':
      result.setDate(result.getDate() + step * 7);
      break;
    case 'month':
      result.setMonth(result.getMonth() + step);
      break;
    case 'quarter':
      result.setMonth(result.getMonth() + step * 3);
      break;
    case 'year':
      result.setFullYear(result.getFullYear() + step);
      break;
  }
  return result;
}

function formatDate(date: Date, unit: TimeScale['unit']): string {
  switch (unit) {
    case 'day':
      return `${date.getMonth() + 1}/${date.getDate()}`;
    case 'week':
      return `${date.getMonth() + 1}/${date.getDate()}`;
    case 'month':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    case 'quarter':
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `Q${quarter} ${date.getFullYear()}`;
    case 'year':
      return String(date.getFullYear());
    default:
      return date.toLocaleDateString();
  }
}
