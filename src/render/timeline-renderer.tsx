/**
 * Timeline renderer (Canvas-based)
 * Professional rendering with better visuals
 */

import React, { useRef, useEffect } from 'react';
import type { TaskId } from '../types';
import type { BarLayout, LinkLayout, TimeScale } from './layout';

export interface TimelineRendererProps {
  bars: Map<TaskId, BarLayout>;
  links: LinkLayout[];
  timeScale: TimeScale;
  viewport: { x: number; y: number; width: number; height: number };
  criticalPath?: Set<TaskId>;
  showTodayMarker?: boolean;
  showWeekends?: boolean;
  barHeight?: number;
  showProgress?: boolean;
}

export const TimelineRenderer: React.FC<TimelineRendererProps> = ({
  bars,
  links,
  timeScale,
  viewport,
  criticalPath,
  showTodayMarker = true,
  showWeekends = true,
  barHeight = 24,
  showProgress = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    // Clear
    ctx.clearRect(0, 0, viewport.width, viewport.height);

    const headerHeight = 60;

    // Draw weekend backgrounds
    if (showWeekends) {
      ctx.fillStyle = '#f9fafb';
      let currentDate = new Date(timeScale.startDate);
      while (currentDate <= timeScale.endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          const x = dateToX(currentDate, timeScale) - viewport.x;
          const nextDate = new Date(currentDate);
          nextDate.setDate(nextDate.getDate() + 1);
          const nextX = dateToX(nextDate, timeScale) - viewport.x;
          
          if (x < viewport.width && nextX > 0) {
            ctx.fillRect(
              Math.max(0, x),
              headerHeight,
              Math.min(nextX - x, viewport.width - Math.max(0, x)),
              viewport.height - headerHeight
            );
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Draw time scale header
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, viewport.width, headerHeight);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#374151';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

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
        ctx.fillText(label, x + 8, headerHeight / 2 + 4);
      }
      currentDate = addTimeUnit(currentDate, timeScale.unit, step);
    }

    // Draw today marker
    if (showTodayMarker) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (today >= timeScale.startDate && today <= timeScale.endDate) {
        const todayX = dateToX(today, timeScale) - viewport.x;
        if (todayX >= 0 && todayX <= viewport.width) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(todayX, headerHeight);
          ctx.lineTo(todayX, viewport.height);
          ctx.stroke();
        }
      }
    }

    // Draw links
    if (links.length > 0) {
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#6b7280';
      
      for (const link of links) {
        const sourceX = link.sourceX - viewport.x;
        const sourceY = link.sourceY - viewport.y;
        const targetX = link.targetX - viewport.x;
        const targetY = link.targetY - viewport.y;

        if (
          (sourceX >= 0 && sourceX <= viewport.width) ||
          (targetX >= 0 && targetX <= viewport.width)
        ) {
          // Draw curved line
          ctx.beginPath();
          const midX = (sourceX + targetX) / 2;
          ctx.moveTo(sourceX, sourceY);
          ctx.quadraticCurveTo(midX, sourceY, midX, (sourceY + targetY) / 2);
          ctx.quadraticCurveTo(midX, targetY, targetX, targetY);
          ctx.stroke();

          // Arrowhead
          const angle = Math.atan2(targetY - (sourceY + targetY) / 2, targetX - midX);
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
    }

    // Draw bars
    const visibleBars = Array.from(bars.values()).filter(
      (bar) => bar.x + bar.width >= viewport.x && bar.x <= viewport.x + viewport.width
    );

    for (const bar of visibleBars) {
      const isCritical = criticalPath?.has(bar.taskId) || false;
      const y = bar.y - viewport.y;
      const actualBarHeight = barHeight || bar.height;

      // Bar shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(
        bar.x - viewport.x + 1,
        y + 1,
        bar.width,
        actualBarHeight
      );

      // Bar background
      ctx.fillStyle = isCritical ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      const radius = 4;
      ctx.roundRect(bar.x - viewport.x, y, bar.width, actualBarHeight, radius);
      ctx.fill();

      // Progress bar
      if (showProgress && bar.progressX && bar.progressWidth && bar.progressWidth > 0) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.roundRect(
          bar.progressX - viewport.x,
          y,
          bar.progressWidth,
          actualBarHeight,
          radius
        );
        ctx.fill();
      }

      // Bar border
      ctx.strokeStyle = isCritical ? '#dc2626' : '#2563eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bar.x - viewport.x, y, bar.width, actualBarHeight, radius);
      ctx.stroke();
    }
  }, [bars, links, timeScale, viewport, criticalPath, showTodayMarker, showWeekends, barHeight, showProgress]);

  return (
    <div className="iris-gantt-timeline relative" style={{ width: viewport.width, height: viewport.height }}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{ width: viewport.width, height: viewport.height }}
      />
    </div>
  );
};

// Helper methods
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
  switch (timeScale.unit) {
    case 'day':
      return 1;
    case 'week':
      return 1;
    case 'month':
      return 1;
    case 'quarter':
      return 1;
    case 'year':
      return 1;
    default:
      return 1;
  }
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

// Polyfill for roundRect if not available
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, r: number): void;
  }
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}
