/**
 * Baseline management
 */

import type { Task, TaskId } from '../types';

export interface Baseline {
  id: string;
  name: string;
  tasks: Map<TaskId, { start: Date; end: Date; progress?: number }>;
  createdAt: Date;
}

export class BaselineManager {
  private baselines: Map<string, Baseline> = new Map();

  createBaseline(name: string, tasks: Task[]): string {
    const baselineTasks = new Map<TaskId, { start: Date; end: Date; progress?: number }>();

    for (const task of tasks) {
      if (task.start && task.end) {
        baselineTasks.set(task.id, {
          start: new Date(task.start),
          end: new Date(task.end),
          progress: task.progress,
        });
      }
    }

    const baseline: Baseline = {
      id: `baseline-${Date.now()}`,
      name,
      tasks: baselineTasks,
      createdAt: new Date(),
    };

    this.baselines.set(baseline.id, baseline);
    return baseline.id;
  }

  getBaseline(id: string): Baseline | undefined {
    return this.baselines.get(id);
  }

  getAllBaselines(): Baseline[] {
    return Array.from(this.baselines.values());
  }

  removeBaseline(id: string): void {
    this.baselines.delete(id);
  }

  compareWithBaseline(taskId: TaskId, baselineId: string, currentTask: Task): {
    startDelta?: number;
    endDelta?: number;
    progressDelta?: number;
  } {
    const baseline = this.baselines.get(baselineId);
    if (!baseline) return {};

    const baselineTask = baseline.tasks.get(taskId);
    if (!baselineTask) return {};

    const result: {
      startDelta?: number;
      endDelta?: number;
      progressDelta?: number;
    } = {};

    if (currentTask.start && baselineTask.start) {
      result.startDelta = Math.ceil(
        (currentTask.start.getTime() - baselineTask.start.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    if (currentTask.end && baselineTask.end) {
      result.endDelta = Math.ceil(
        (currentTask.end.getTime() - baselineTask.end.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    if (currentTask.progress !== undefined && baselineTask.progress !== undefined) {
      result.progressDelta = currentTask.progress - baselineTask.progress;
    }

    return result;
  }
}
