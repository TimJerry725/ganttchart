/**
 * Auto-scheduling engine
 */

import type { Task, Link } from '../types';
import { CalendarManager } from './calendar';
import { Scheduler } from '../engine/scheduler';

export interface AutoSchedulingOptions {
  mode?: 'forward' | 'backward';
  calendarId?: string;
  respectConstraints?: boolean;
}

export class AutoScheduler {
  private calendarManager: CalendarManager;
  private scheduler: Scheduler;

  constructor(tasks: Task[], links: Link[] = []) {
    this.calendarManager = new CalendarManager();
    this.scheduler = new Scheduler(tasks, links);
  }

  schedule(options: AutoSchedulingOptions = {}): Map<string | number, Task> {
    const { mode = 'forward', calendarId, respectConstraints = true } = options;
    const scheduled = this.scheduler.schedule();
    const updatedTasks: Map<string | number, Task> = new Map();

    // Auto-scheduling logic would go here
    // For now, just return scheduled tasks with updated dates
    for (const [taskId, scheduledTask] of scheduled.entries()) {
      if (scheduledTask.earlyStart && scheduledTask.earlyFinish) {
        updatedTasks.set(taskId, {
          ...scheduledTask,
          start: scheduledTask.earlyStart,
          end: scheduledTask.earlyFinish,
        });
      }
    }

    return updatedTasks;
  }

  setCalendar(calendarId: string): void {
    // Set calendar for scheduling
  }
}
