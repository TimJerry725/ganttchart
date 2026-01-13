/**
 * Baseline plugin for comparing planned vs actual
 */

import type { Plugin, PluginContext } from '../plugin';
import type { Baseline, Task, TaskId } from '../types';

export class BaselinePlugin implements Plugin {
  name = 'baseline';
  version = '1.0.0';
  private context?: PluginContext;
  private baselines: Map<string, Baseline> = new Map();

  initialize(context: PluginContext): void {
    this.context = context;
  }

  createBaseline(name: string): string {
    if (!this.context) return '';

    const tasks = this.context.model.getAllTasks();
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
    this.context.model.addBaseline(baseline);

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
}
