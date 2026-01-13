/**
 * Drag and drop handler for tasks
 */

import type { TaskId } from '../types';
import type { BarLayout } from '../render/layout';

export interface DragState {
  type: 'move' | 'resize-start' | 'resize-end' | 'progress';
  taskId: TaskId;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  initialStart?: Date;
  initialEnd?: Date;
  initialProgress?: number;
}

export class DragHandler {
  private dragState: DragState | null = null;

  startDrag(
    taskId: TaskId,
    type: DragState['type'],
    x: number,
    y: number,
    bar: BarLayout,
    task: { start?: Date; end?: Date; progress?: number }
  ): DragState | null {
    this.dragState = {
      type,
      taskId,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      initialStart: task.start,
      initialEnd: task.end,
      initialProgress: task.progress,
    };
    return this.dragState;
  }

  updateDrag(x: number, y: number): void {
    if (this.dragState) {
      this.dragState.currentX = x;
      this.dragState.currentY = y;
    }
  }

  endDrag(): DragState | null {
    const state = this.dragState;
    this.dragState = null;
    return state;
  }

  isDragging(): boolean {
    return this.dragState !== null;
  }

  getDragState(): DragState | null {
    return this.dragState;
  }

  calculateDateDelta(deltaX: number, pixelsPerDay: number): number {
    return Math.round(deltaX / pixelsPerDay);
  }
}
