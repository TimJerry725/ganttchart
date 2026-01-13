/**
 * Critical path plugin
 */

import type { Plugin, PluginContext } from '../plugin';
import type { Task, TaskId } from '../types';
import { Scheduler } from '../scheduler';
import type { ScheduledTask } from '../scheduler';

export class CriticalPathPlugin implements Plugin {
  name = 'critical-path';
  version = '1.0.0';
  private context?: PluginContext;

  initialize(context: PluginContext): void {
    this.context = context;
  }

  calculateCriticalPath(): TaskId[] {
    if (!this.context) return [];

    const scheduler = new Scheduler(this.context.model);
    const scheduled = scheduler.schedule();

    const criticalTasks: TaskId[] = [];
    for (const [taskId, task] of scheduled.entries()) {
      if (task.isCritical) {
        criticalTasks.push(taskId);
      }
    }

    // Sort by early start
    criticalTasks.sort((a, b) => {
      const taskA = scheduled.get(a);
      const taskB = scheduled.get(b);
      if (!taskA || !taskB) return 0;
      return (taskA.earlyStart?.getTime() || 0) - (taskB.earlyStart?.getTime() || 0);
    });

    return criticalTasks;
  }

  getTaskSlack(taskId: TaskId): number | undefined {
    if (!this.context) return undefined;

    const scheduler = new Scheduler(this.context.model);
    const scheduled = scheduler.schedule();
    const task = scheduled.get(taskId);

    return task?.totalFloat;
  }

  getCriticalTasks(): Set<TaskId> {
    const path = this.calculateCriticalPath();
    return new Set(path);
  }
}
