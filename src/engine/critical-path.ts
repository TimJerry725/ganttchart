/**
 * Critical path calculations
 */

import type { TaskId } from '../types';
import { Scheduler, type ScheduledTask } from './scheduler';

export class CriticalPathCalculator {
  private scheduler: Scheduler;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
  }

  getCriticalPath(): TaskId[] {
    const scheduled = this.scheduler.schedule();
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
      if (!taskA?.earlyStart || !taskB?.earlyStart) return 0;
      return taskA.earlyStart.getTime() - taskB.earlyStart.getTime();
    });

    return criticalTasks;
  }

  getTaskSlack(taskId: TaskId): number | undefined {
    const scheduled = this.scheduler.schedule();
    return scheduled.get(taskId)?.totalFloat;
  }
}
