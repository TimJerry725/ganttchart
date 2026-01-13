/**
 * Editing interactions: drag, resize, inline edit
 */

import type { Task, TaskId, Link } from '@gantt/core';
import type { BarLayout, HitTestResult } from '@gantt/renderer';

export interface DragState {
  type: 'move' | 'resize-start' | 'resize-end' | 'link-create';
  taskId?: TaskId;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  initialStart?: Date;
  initialEnd?: Date;
}

export class EditingManager {
  private dragState: DragState | null = null;
  private editingTaskId: TaskId | null = null;

  startDrag(
    hit: HitTestResult,
    x: number,
    y: number,
    task: Task | undefined
  ): DragState | null {
    if (hit.type === 'bar' && hit.taskId && task) {
      this.dragState = {
        type: 'move',
        taskId: hit.taskId,
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
        initialStart: task.start,
        initialEnd: task.end,
      };
      return this.dragState;
    } else if (hit.type === 'resize-handle' && hit.taskId && hit.handle && task) {
      this.dragState = {
        type: hit.handle === 'start' ? 'resize-start' : 'resize-end',
        taskId: hit.taskId,
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
        initialStart: task.start,
        initialEnd: task.end,
      };
      return this.dragState;
    }
    return null;
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

  calculateDateDelta(
    deltaX: number,
    pixelsPerDay: number
  ): { days: number; date: Date } {
    const days = deltaX / pixelsPerDay;
    const date = new Date();
    date.setDate(date.getDate() + Math.round(days));
    return { days: Math.round(days), date };
  }

  startInlineEdit(taskId: TaskId): void {
    this.editingTaskId = taskId;
  }

  stopInlineEdit(): void {
    this.editingTaskId = null;
  }

  isEditing(taskId: TaskId): boolean {
    return this.editingTaskId === taskId;
  }

  getEditingTaskId(): TaskId | null {
    return this.editingTaskId;
  }
}

/**
 * Dependency validation
 */
export function validateDependency(
  sourceId: TaskId,
  targetId: TaskId,
  links: Link[],
  tasks: Task[]
): { valid: boolean; reason?: string } {
  // Check for self-reference
  if (sourceId === targetId) {
    return { valid: false, reason: 'Task cannot depend on itself' };
  }

  // Check for circular dependencies
  const visited = new Set<TaskId>();
  const checkCycle = (taskId: TaskId): boolean => {
    if (taskId === sourceId) {
      return true; // Cycle detected
    }
    if (visited.has(taskId)) {
      return false;
    }
    visited.add(taskId);

    const outgoingLinks = links.filter((link) => link.source === taskId);
    for (const link of outgoingLinks) {
      if (checkCycle(link.target)) {
        return true;
      }
    }
    return false;
  };

  if (checkCycle(targetId)) {
    return { valid: false, reason: 'Circular dependency detected' };
  }

  return { valid: true };
}

/**
 * Auto-scheduling rules
 */
export interface AutoSchedulingRule {
  name: string;
  apply: (task: Task, dependencies: Task[], links: Link[]) => Partial<Task>;
}

export const defaultAutoSchedulingRules: AutoSchedulingRule[] = [
  {
    name: 'as-soon-as-possible',
    apply: (task, dependencies, links) => {
      const incomingLinks = links.filter((link) => link.target === task.id);
      if (incomingLinks.length === 0) {
        return {};
      }

      let latestEnd: Date | undefined;
      for (const link of incomingLinks) {
        const depTask = dependencies.find((t) => t.id === link.source);
        if (depTask?.end) {
          const linkEnd = new Date(depTask.end);
          if (link.lag) {
            linkEnd.setDate(linkEnd.getDate() + link.lag);
          }
          if (!latestEnd || linkEnd > latestEnd) {
            latestEnd = linkEnd;
          }
        }
      }

      if (latestEnd) {
        const duration = task.duration || 1;
        const newStart = new Date(latestEnd);
        newStart.setDate(newStart.getDate() + 1);
        const newEnd = new Date(newStart);
        newEnd.setDate(newEnd.getDate() + duration - 1);
        return { start: newStart, end: newEnd };
      }

      return {};
    },
  },
];
