/**
 * Task scheduling engine
 */

import type { Task, TaskId, Link, Calendar, ConstraintType } from './types';
import { GanttModel } from './model';

export interface ScheduledTask extends Task {
  scheduledStart: Date;
  scheduledEnd: Date;
  earlyStart?: Date;
  earlyFinish?: Date;
  lateStart?: Date;
  lateFinish?: Date;
  totalFloat?: number;
  freeFloat?: number;
  isCritical?: boolean;
}

export class Scheduler {
  constructor(private model: GanttModel) {}

  /**
   * Schedule all tasks based on dependencies and constraints
   */
  schedule(): Map<TaskId, ScheduledTask> {
    const scheduled = new Map<TaskId, ScheduledTask>();
    const visited = new Set<TaskId>();

    // Get all root tasks (no dependencies)
    const rootTasks = this.model.getRootTasks();

    // Forward pass: calculate early start/finish
    const earlySchedule = this.forwardPass(rootTasks, visited, scheduled);

    // Backward pass: calculate late start/finish and floats
    const allTasks = this.model.getAllTasks();
    this.backwardPass(allTasks, earlySchedule, scheduled);

    // Mark critical path
    this.markCriticalPath(scheduled);

    return scheduled;
  }

  private forwardPass(
    tasks: Task[],
    visited: Set<TaskId>,
    scheduled: Map<TaskId, ScheduledTask>
  ): Map<TaskId, ScheduledTask> {
    const result = new Map<TaskId, ScheduledTask>();

    for (const task of tasks) {
      if (visited.has(task.id)) continue;
      visited.add(task.id);

      const scheduledTask = this.scheduleTask(task, result);
      result.set(task.id, scheduledTask);
      scheduled.set(task.id, scheduledTask);

      // Schedule children
      const children = this.model.getChildren(task.id);
      if (children.length > 0) {
        this.forwardPass(children, visited, scheduled);
      }
    }

    return result;
  }

  private scheduleTask(
    task: Task,
    scheduled: Map<TaskId, ScheduledTask>
  ): ScheduledTask {
    const links = this.model.getLinksForTask(task.id);
    const incomingLinks = links.filter((link) => link.target === task.id);

    let earliestStart: Date | undefined;
    let earliestFinish: Date | undefined;

    // Calculate earliest start from dependencies
    for (const link of incomingLinks) {
      const sourceTask = scheduled.get(link.source);
      if (!sourceTask) continue;

      const linkStart = this.calculateLinkStart(sourceTask, link);
      if (!earliestStart || linkStart > earliestStart) {
        earliestStart = linkStart;
      }
    }

    // Apply constraint
    const constraintStart = this.applyConstraint(task);
    if (constraintStart) {
      if (!earliestStart || constraintStart > earliestStart) {
        earliestStart = constraintStart;
      }
    }

    // Use task start if provided and no dependencies
    if (!earliestStart && task.start) {
      earliestStart = task.start;
    }

    // Default to today if nothing specified
    if (!earliestStart) {
      earliestStart = new Date();
      earliestStart.setHours(0, 0, 0, 0);
    }

    // Calculate duration
    let duration = task.duration || 1;
    if (task.start && task.end) {
      duration = Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Calculate finish date
    earliestFinish = this.addWorkingDays(earliestStart, duration - 1, task.calendarId);

    return {
      ...task,
      scheduledStart: earliestStart,
      scheduledEnd: earliestFinish,
      earlyStart: earliestStart,
      earlyFinish: earliestFinish,
    };
  }

  private calculateLinkStart(sourceTask: ScheduledTask, link: Link): Date {
    const lag = link.lag || 0;
    let startDate: Date;

    switch (link.type) {
      case 'finish-to-start':
        startDate = new Date(sourceTask.scheduledEnd);
        startDate.setDate(startDate.getDate() + lag);
        break;
      case 'start-to-start':
        startDate = new Date(sourceTask.scheduledStart);
        startDate.setDate(startDate.getDate() + lag);
        break;
      case 'finish-to-finish':
        startDate = new Date(sourceTask.scheduledEnd);
        startDate.setDate(startDate.getDate() + lag);
        break;
      case 'start-to-finish':
        startDate = new Date(sourceTask.scheduledStart);
        startDate.setDate(startDate.getDate() + lag);
        break;
      default:
        startDate = new Date(sourceTask.scheduledEnd);
    }

    return startDate;
  }

  private applyConstraint(task: Task): Date | undefined {
    if (!task.constraintType || !task.constraintDate) return undefined;

    const constraintDate = new Date(task.constraintDate);
    constraintDate.setHours(0, 0, 0, 0);

    switch (task.constraintType) {
      case 'must-start-on':
      case 'start-no-earlier-than':
      case 'start-no-later-than':
        return constraintDate;
      case 'must-finish-on':
      case 'finish-no-earlier-than':
      case 'finish-no-later-than':
        // For finish constraints, we'd need duration to calculate start
        // This is simplified - full implementation would handle this properly
        return constraintDate;
      default:
        return undefined;
    }
  }

  private backwardPass(
    tasks: Task[],
    earlySchedule: Map<TaskId, ScheduledTask>,
    scheduled: Map<TaskId, ScheduledTask>
  ): void {
    // Sort tasks in reverse topological order
    const sortedTasks = this.topologicalSort(tasks).reverse();

    for (const task of sortedTasks) {
      const earlyTask = earlySchedule.get(task.id);
      if (!earlyTask) continue;

      const links = this.model.getLinksForTask(task.id);
      const outgoingLinks = links.filter((link) => link.source === task.id);

      let latestFinish: Date | undefined;
      let latestStart: Date | undefined;

      if (outgoingLinks.length === 0) {
        // No outgoing links - use early dates as late dates
        latestFinish = earlyTask.earlyFinish;
        latestStart = earlyTask.earlyStart;
      } else {
        // Calculate from dependencies
        for (const link of outgoingLinks) {
          const targetTask = scheduled.get(link.target);
          if (!targetTask) continue;

          const linkFinish = this.calculateLinkFinish(targetTask, link);
          if (!latestFinish || linkFinish < latestFinish) {
            latestFinish = linkFinish;
          }
        }
      }

      // Apply constraint
      const constraintFinish = this.applyFinishConstraint(task);
      if (constraintFinish) {
        if (!latestFinish || constraintFinish < latestFinish) {
          latestFinish = constraintFinish;
        }
      }

      if (!latestFinish) {
        latestFinish = earlyTask.earlyFinish;
      }

      const duration = task.duration || 1;
      latestStart = this.subtractWorkingDays(latestFinish, duration - 1, task.calendarId);

      const scheduledTask = scheduled.get(task.id);
      if (scheduledTask) {
        scheduledTask.lateStart = latestStart;
        scheduledTask.lateFinish = latestFinish;
        scheduledTask.totalFloat = Math.ceil(
          (latestFinish.getTime() - (earlyTask.earlyFinish?.getTime() || 0)) / (1000 * 60 * 60 * 24)
        );
      }
    }
  }

  private calculateLinkFinish(targetTask: ScheduledTask, link: Link): Date {
    const lag = link.lag || 0;
    let finishDate: Date;

    switch (link.type) {
      case 'finish-to-start':
        finishDate = new Date(targetTask.lateStart || targetTask.scheduledStart);
        finishDate.setDate(finishDate.getDate() - lag);
        break;
      case 'start-to-start':
        finishDate = new Date(targetTask.lateStart || targetTask.scheduledStart);
        finishDate.setDate(finishDate.getDate() - lag);
        break;
      case 'finish-to-finish':
        finishDate = new Date(targetTask.lateFinish || targetTask.scheduledEnd);
        finishDate.setDate(finishDate.getDate() - lag);
        break;
      case 'start-to-finish':
        finishDate = new Date(targetTask.lateFinish || targetTask.scheduledEnd);
        finishDate.setDate(finishDate.getDate() - lag);
        break;
      default:
        finishDate = new Date(targetTask.lateStart || targetTask.scheduledStart);
    }

    return finishDate;
  }

  private applyFinishConstraint(task: Task): Date | undefined {
    if (!task.constraintType || !task.constraintDate) return undefined;

    const constraintDate = new Date(task.constraintDate);
    constraintDate.setHours(23, 59, 59, 999);

    switch (task.constraintType) {
      case 'must-finish-on':
      case 'finish-no-earlier-than':
      case 'finish-no-later-than':
        return constraintDate;
      default:
        return undefined;
    }
  }

  private markCriticalPath(scheduled: Map<TaskId, ScheduledTask>): void {
    for (const task of scheduled.values()) {
      task.isCritical = (task.totalFloat || 0) <= 0;
    }
  }

  private topologicalSort(tasks: Task[]): Task[] {
    const sorted: Task[] = [];
    const visited = new Set<TaskId>();
    const visiting = new Set<TaskId>();

    const visit = (task: Task): void => {
      if (visiting.has(task.id)) {
        // Circular dependency detected
        return;
      }
      if (visited.has(task.id)) {
        return;
      }

      visiting.add(task.id);
      const links = this.model.getLinksForTask(task.id);
      const outgoingLinks = links.filter((link) => link.source === task.id);

      for (const link of outgoingLinks) {
        const targetTask = this.model.getTask(link.target);
        if (targetTask) {
          visit(targetTask);
        }
      }

      visiting.delete(task.id);
      visited.add(task.id);
      sorted.push(task);
    };

    for (const task of tasks) {
      if (!visited.has(task.id)) {
        visit(task);
      }
    }

    return sorted;
  }

  private addWorkingDays(start: Date, days: number, calendarId?: string): Date {
    const calendar = calendarId ? this.model.getCalendar(calendarId) : undefined;
    let current = new Date(start);
    let remaining = days;

    while (remaining > 0) {
      if (this.isWorkingDay(current, calendar)) {
        remaining--;
      }
      if (remaining > 0) {
        current.setDate(current.getDate() + 1);
      }
    }

    return current;
  }

  private subtractWorkingDays(end: Date, days: number, calendarId?: string): Date {
    const calendar = calendarId ? this.model.getCalendar(calendarId) : undefined;
    let current = new Date(end);
    let remaining = days;

    while (remaining > 0) {
      if (this.isWorkingDay(current, calendar)) {
        remaining--;
      }
      if (remaining > 0) {
        current.setDate(current.getDate() - 1);
      }
    }

    return current;
  }

  private isWorkingDay(date: Date, calendar?: Calendar): boolean {
    if (!calendar) {
      // Default: Monday-Friday
      const day = date.getDay();
      return day >= 1 && day <= 5;
    }

    const day = date.getDay();
    if (!calendar.workingDays.includes(day)) {
      return false;
    }

    // Check exceptions
    if (calendar.exceptions) {
      const dateStr = date.toISOString().split('T')[0];
      for (const exception of calendar.exceptions) {
        const exceptionStr = exception.date.toISOString().split('T')[0];
        if (dateStr === exceptionStr) {
          return exception.working;
        }
      }
    }

    return true;
  }
}
