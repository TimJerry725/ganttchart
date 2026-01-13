/**
 * Layout calculations for Gantt chart
 */

import type { Task, TaskId } from '../types';
import type { ScheduledTask } from '../engine/scheduler';

export interface RowLayout {
  taskId: TaskId;
  y: number;
  height: number;
  level: number;
}

export interface BarLayout {
  taskId: TaskId;
  x: number;
  width: number;
  y: number;
  height: number;
  progressX?: number;
  progressWidth?: number;
}

export interface LinkLayout {
  linkId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  type: string;
}

export interface LayoutResult {
  rows: Map<TaskId, RowLayout>;
  bars: Map<TaskId, BarLayout>;
  links: LinkLayout[];
  totalHeight: number;
}

export interface TimeScale {
  unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
  pixelsPerUnit: number;
  startDate: Date;
  endDate: Date;
}

export class LayoutEngine {
  private rowHeight = 40;
  private barHeight = 24;
  private indentWidth = 20;

  calculateLayout(
    tasks: Task[],
    scheduledTasks: Map<TaskId, ScheduledTask>,
    links: Array<{ id: string; source: TaskId; target: TaskId; type: string }>,
    timeScale: TimeScale,
    expandedTasks: Set<TaskId> = new Set(),
    rowHeight?: number,
    barHeight?: number
  ): LayoutResult {
    if (rowHeight) this.rowHeight = rowHeight;
    if (barHeight) this.barHeight = barHeight;
    const rows = new Map<TaskId, RowLayout>();
    const bars = new Map<TaskId, BarLayout>();
    const linkLayouts: LinkLayout[] = [];

    let currentY = 0;
    const rootTasks = tasks.filter((t) => !t.parent);

    const calculateRows = (taskList: Task[], level: number): void => {
      for (const task of taskList) {
        const isExpanded = expandedTasks.has(task.id) || task.expanded !== false;
        rows.set(task.id, {
          taskId: task.id,
          y: currentY,
          height: this.rowHeight,
          level,
        });

        // Use actual task dates, fallback to scheduled dates
        const scheduled = scheduledTasks.get(task.id);
        const startDate = task.start || scheduled?.earlyStart;
        const endDate = task.end || scheduled?.earlyFinish;
        
        if (startDate && endDate) {
          const barX = this.dateToX(startDate, timeScale);
          const endX = this.dateToX(endDate, timeScale);
          const barWidth = Math.max(4, endX - barX + 1); // Minimum 4px width

          bars.set(task.id, {
            taskId: task.id,
            x: barX,
            width: barWidth,
            y: currentY + (this.rowHeight - this.barHeight) / 2,
            height: this.barHeight,
            progressX: task.progress ? barX + (barWidth * task.progress) / 100 : undefined,
            progressWidth: task.progress ? (barWidth * task.progress) / 100 : undefined,
          });
        } else if (task.type === 'milestone' && startDate) {
          // Milestone rendering
          const milestoneX = this.dateToX(startDate, timeScale);
          bars.set(task.id, {
            taskId: task.id,
            x: milestoneX,
            width: 0,
            y: currentY + (this.rowHeight - this.barHeight) / 2,
            height: this.barHeight,
          });
        }

        currentY += this.rowHeight;

        if (isExpanded) {
          const children = tasks.filter((t) => t.parent === task.id);
          if (children.length > 0) {
            calculateRows(children, level + 1);
          }
        }
      }
    };

    calculateRows(rootTasks, 0);

    // Calculate link positions
    for (const link of links) {
      const sourceBar = bars.get(link.source);
      const targetBar = bars.get(link.target);
      const sourceRow = rows.get(link.source);
      const targetRow = rows.get(link.target);

      if (sourceBar && targetBar && sourceRow && targetRow) {
        const sourceX = link.type === 'finish-to-start' || link.type === 'finish-to-finish'
          ? sourceBar.x + sourceBar.width
          : sourceBar.x;
        const sourceY = sourceRow.y + sourceRow.height / 2;
        const targetX = link.type === 'start-to-start' || link.type === 'start-to-finish'
          ? targetBar.x
          : targetBar.x + targetBar.width;
        const targetY = targetRow.y + targetRow.height / 2;

        linkLayouts.push({
          linkId: link.id,
          sourceX,
          sourceY,
          targetX,
          targetY,
          type: link.type,
        });
      }
    }

    return {
      rows,
      bars,
      links: linkLayouts,
      totalHeight: currentY,
    };
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

  getRowHeight(): number {
    return this.rowHeight;
  }

  setRowHeight(height: number): void {
    this.rowHeight = height;
  }
}
