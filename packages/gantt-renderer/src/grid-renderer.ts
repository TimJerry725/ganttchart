/**
 * Grid renderer for task list
 */

import type { Task, TaskId } from '@gantt/core';
import type { GridColumn, RowLayout, HitTestResult, Viewport } from './types';

export interface GridRenderOptions {
  columns: GridColumn[];
  tasks: Task[];
  rows: Map<TaskId, RowLayout>;
  selectedTaskIds: Set<TaskId>;
  viewport: Viewport;
  onTaskClick?: (taskId: TaskId) => void;
  onTaskSelect?: (taskId: TaskId, multi: boolean) => void;
}

export class GridRenderer {
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') || undefined;
  }

  render(options: GridRenderOptions): void {
    if (!this.ctx || !this.canvas) return;

    const { columns, tasks, rows, selectedTaskIds, viewport } = options;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate visible rows
    const visibleRows = Array.from(rows.values()).filter(
      (row) => row.y + row.height >= viewport.y && row.y <= viewport.y + viewport.height
    );

    // Render rows
    for (const row of visibleRows) {
      const task = tasks.find((t) => t.id === row.taskId);
      if (!task) continue;

      const isSelected = selectedTaskIds.has(row.taskId);
      const y = row.y - viewport.y;

      // Render row background
      this.ctx.fillStyle = isSelected ? '#e6f7ff' : (row.level % 2 === 0 ? '#ffffff' : '#fafafa');
      this.ctx.fillRect(0, y, this.canvas.width, row.height);

      // Render selection border
      if (isSelected) {
        this.ctx.strokeStyle = '#1890ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, y, this.canvas.width, row.height);
      }

      // Render cells
      let x = 0;
      for (const column of columns) {
        const cellWidth = column.width;
        const indent = row.level * 20;

        // Render cell content
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '14px sans-serif';
        const text = this.getCellText(task, column);
        this.ctx.fillText(text, x + indent + 8, y + row.height / 2 + 5);

        // Render cell border
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, cellWidth, row.height);

        x += cellWidth;
      }
    }
  }

  private getCellText(task: Task, column: GridColumn): string {
    if (column.field) {
      const value = (task as Record<string, unknown>)[column.field];
      return value?.toString() || '';
    }
    return task.name || '';
  }

  hitTest(x: number, y: number, rows: Map<TaskId, RowLayout>, viewport: Viewport): HitTestResult {
    const absoluteY = y + viewport.y;

    for (const [taskId, row] of rows.entries()) {
      if (absoluteY >= row.y && absoluteY <= row.y + row.height) {
        return {
          type: 'task',
          taskId,
        };
      }
    }

    return { type: 'none' };
  }
}
