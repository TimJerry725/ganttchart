/**
 * Timeline renderer for Gantt bars and links
 */

import type { Task, TaskId } from '@gantt/core';
import type {
  BarLayout,
  LinkLayout,
  TimeScale,
  HitTestResult,
  Viewport,
} from './types';

export interface TimelineRenderOptions {
  tasks: Task[];
  bars: Map<TaskId, BarLayout>;
  links: LinkLayout[];
  timeScale: TimeScale;
  viewport: Viewport;
  criticalPath?: Set<TaskId>;
  baselines?: Map<TaskId, { start: Date; end: Date }>;
  onBarClick?: (taskId: TaskId) => void;
  onBarDrag?: (taskId: TaskId, deltaX: number) => void;
  onBarResize?: (taskId: TaskId, handle: 'start' | 'end', deltaX: number) => void;
}

export class TimelineRenderer {
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') || undefined;
  }

  render(options: TimelineRenderOptions): void {
    if (!this.ctx || !this.canvas) return;

    const { bars, links, timeScale, viewport, criticalPath, baselines } = options;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate visible time range
    const visibleStartX = Math.max(0, viewport.x - 100);
    const visibleEndX = viewport.x + viewport.width + 100;

    // Render time scale header
    this.renderTimeScale(timeScale, viewport, visibleStartX, visibleEndX);

    // Render baselines
    if (baselines) {
      this.renderBaselines(baselines, bars, timeScale, viewport);
    }

    // Render links
    this.renderLinks(links, viewport);

    // Render bars
    const visibleBars = Array.from(bars.values()).filter(
      (bar) => bar.x + bar.width >= visibleStartX && bar.x <= visibleEndX
    );

    for (const bar of visibleBars) {
      const task = options.tasks.find((t) => t.id === bar.taskId);
      if (!task) continue;

      const isCritical = criticalPath?.has(bar.taskId) || false;
      const y = bar.y - viewport.y;

      // Render bar background
      this.ctx.fillStyle = isCritical ? '#ff4d4f' : (task.color || '#1890ff');
      this.ctx.fillRect(bar.x - viewport.x, y, bar.width, bar.height);

      // Render progress
      if (bar.progressX && bar.progressWidth) {
        this.ctx.fillStyle = '#52c41a';
        this.ctx.fillRect(
          bar.progressX - viewport.x,
          y,
          bar.progressWidth,
          bar.height
        );
      }

      // Render bar border
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(bar.x - viewport.x, y, bar.width, bar.height);

      // Render resize handles
      const handleSize = 6;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(bar.x - viewport.x - handleSize / 2, y, handleSize, bar.height);
      this.ctx.fillRect(
        bar.x + bar.width - viewport.x - handleSize / 2,
        y,
        handleSize,
        bar.height
      );
    }
  }

  private renderTimeScale(
    timeScale: TimeScale,
    viewport: Viewport,
    startX: number,
    endX: number
  ): void {
    if (!this.ctx) return;

    const headerHeight = 30;
    this.ctx.fillStyle = '#fafafa';
    this.ctx.fillRect(0, 0, this.canvas!.width, headerHeight);

    // Render time markers
    this.ctx.strokeStyle = '#d9d9d9';
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = '#666666';
    this.ctx.font = '12px sans-serif';

    const step = this.getTimeStep(timeScale);
    let currentDate = new Date(timeScale.startDate);

    while (currentDate <= timeScale.endDate) {
      const x = this.dateToX(currentDate, timeScale) - viewport.x;

      if (x >= startX - viewport.x && x <= endX - viewport.x) {
        // Draw vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, headerHeight);
        this.ctx.stroke();

        // Draw label
        const label = this.formatDate(currentDate, timeScale.unit);
        this.ctx.fillText(label, x + 4, headerHeight / 2 + 4);
      }

      currentDate = this.addTimeUnit(currentDate, timeScale.unit, step);
    }
  }

  private renderBaselines(
    baselines: Map<TaskId, { start: Date; end: Date }>,
    bars: Map<TaskId, BarLayout>,
    timeScale: TimeScale,
    viewport: Viewport
  ): void {
    if (!this.ctx) return;

    this.ctx.strokeStyle = '#999999';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([4, 4]);

    for (const [taskId, baseline] of baselines.entries()) {
      const bar = bars.get(taskId);
      if (!bar) continue;

      const baselineX = this.dateToX(baseline.start, timeScale) - viewport.x;
      const baselineWidth = this.dateToX(baseline.end, timeScale) - baselineX;
      const y = bar.y - viewport.y;

      this.ctx.strokeRect(baselineX, y, baselineWidth, bar.height);
    }

    this.ctx.setLineDash([]);
  }

  private renderLinks(links: LinkLayout[], viewport: Viewport): void {
    if (!this.ctx) return;

    this.ctx.strokeStyle = '#666666';
    this.ctx.lineWidth = 2;

    for (const link of links) {
      const sourceX = link.sourceX - viewport.x;
      const sourceY = link.sourceY - viewport.y;
      const targetX = link.targetX - viewport.x;
      const targetY = link.targetY - viewport.y;

      // Only render if visible
      if (
        (sourceX >= 0 && sourceX <= viewport.width) ||
        (targetX >= 0 && targetX <= viewport.width)
      ) {
        this.drawLink(sourceX, sourceY, targetX, targetY, link.type);
      }
    }
  }

  private drawLink(
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
    linkType: string
  ): void {
    if (!this.ctx) return;

    this.ctx.beginPath();

    if (linkType === 'finish-to-start') {
      // Draw arrow from source end to target start
      this.ctx.moveTo(sourceX, sourceY);
      const midX = (sourceX + targetX) / 2;
      this.ctx.lineTo(midX, sourceY);
      this.ctx.lineTo(midX, targetY);
      this.ctx.lineTo(targetX, targetY);
    } else {
      // Simplified: straight line
      this.ctx.moveTo(sourceX, sourceY);
      this.ctx.lineTo(targetX, targetY);
    }

    this.ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
    const arrowLength = 8;
    const arrowAngle = Math.PI / 6;

    this.ctx.beginPath();
    this.ctx.moveTo(targetX, targetY);
    this.ctx.lineTo(
      targetX - arrowLength * Math.cos(angle - arrowAngle),
      targetY - arrowLength * Math.sin(angle - arrowAngle)
    );
    this.ctx.lineTo(
      targetX - arrowLength * Math.cos(angle + arrowAngle),
      targetY - arrowLength * Math.sin(angle + arrowAngle)
    );
    this.ctx.closePath();
    this.ctx.fill();
  }

  hitTest(x: number, y: number, bars: Map<TaskId, BarLayout>, viewport: Viewport): HitTestResult {
    const absoluteX = x + viewport.x;
    const absoluteY = y + viewport.y;

    for (const [taskId, bar] of bars.entries()) {
      const barY = bar.y;
      if (absoluteY >= barY && absoluteY <= barY + bar.height) {
        if (absoluteX >= bar.x && absoluteX <= bar.x + bar.width) {
          // Check if near resize handles
          const handleSize = 6;
          if (absoluteX <= bar.x + handleSize) {
            return { type: 'resize-handle', taskId, handle: 'start' };
          }
          if (absoluteX >= bar.x + bar.width - handleSize) {
            return { type: 'resize-handle', taskId, handle: 'end' };
          }
          return { type: 'bar', taskId };
        }
      }
    }

    return { type: 'none' };
  }

  private dateToX(date: Date, timeScale: TimeScale): number {
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

  private getTimeStep(timeScale: TimeScale): number {
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

  private addTimeUnit(date: Date, unit: TimeScale['unit'], step: number): Date {
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

  private formatDate(date: Date, unit: TimeScale['unit']): string {
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
}
