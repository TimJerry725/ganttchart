/**
 * Task scheduling engine
 */

import type { Task, Link, TaskId } from '../types';
import { TaskModel } from '../model/task';
import { LinkModel } from '../model/link';

export interface ScheduledTask extends Task {
  earlyStart?: Date;
  earlyFinish?: Date;
  lateStart?: Date;
  lateFinish?: Date;
  totalFloat?: number;
  isCritical?: boolean;
}

export class Scheduler {
  private taskModel: TaskModel;
  private linkModel: LinkModel;

  constructor(tasks: Task[], links: Link[] = []) {
    this.taskModel = new TaskModel(tasks);
    this.linkModel = new LinkModel(links);
  }

  schedule(): Map<TaskId, ScheduledTask> {
    const scheduled = new Map<TaskId, ScheduledTask>();
    const rootTasks = this.taskModel.getRootTasks();

    // Forward pass
    this.forwardPass(rootTasks, scheduled);

    // Backward pass
    const allTasks = this.taskModel.getAllTasks();
    this.backwardPass(allTasks, scheduled);

    // Mark critical path
    this.markCriticalPath(scheduled);

    return scheduled;
  }

  private forwardPass(tasks: Task[], scheduled: Map<TaskId, ScheduledTask>): void {
    for (const task of tasks) {
      const incomingLinks = this.linkModel.getAllLinks().filter((link) => link.target === task.id);
      
      let earliestStart: Date | undefined;
      
      for (const link of incomingLinks) {
        const sourceTask = scheduled.get(link.source);
        if (sourceTask?.earlyFinish) {
          const linkStart = new Date(sourceTask.earlyFinish);
          if (link.lag) {
            linkStart.setDate(linkStart.getDate() + link.lag);
          }
          if (!earliestStart || linkStart > earliestStart) {
            earliestStart = linkStart;
          }
        }
      }

      if (!earliestStart && task.start) {
        earliestStart = task.start;
      }
      if (!earliestStart) {
        earliestStart = new Date();
        earliestStart.setHours(0, 0, 0, 0);
      }

      const duration = task.duration || 1;
      const earliestFinish = new Date(earliestStart);
      earliestFinish.setDate(earliestFinish.getDate() + duration - 1);

      scheduled.set(task.id, {
        ...task,
        earlyStart: earliestStart,
        earlyFinish: earliestFinish,
      });

      // Process children
      const children = this.taskModel.getChildren(task.id);
      if (children.length > 0) {
        this.forwardPass(children, scheduled);
      }
    }
  }

  private backwardPass(tasks: Task[], scheduled: Map<TaskId, ScheduledTask>): void {
    // Simplified backward pass
    for (const task of tasks) {
      const scheduledTask = scheduled.get(task.id);
      if (!scheduledTask) continue;

      const outgoingLinks = this.linkModel.getAllLinks().filter((link) => link.source === task.id);
      
      if (outgoingLinks.length === 0) {
        scheduledTask.lateFinish = scheduledTask.earlyFinish;
        scheduledTask.lateStart = scheduledTask.earlyStart;
      } else {
        let latestFinish: Date | undefined;
        for (const link of outgoingLinks) {
          const targetTask = scheduled.get(link.target);
          if (targetTask?.lateStart) {
            const linkFinish = new Date(targetTask.lateStart);
            if (link.lag) {
              linkFinish.setDate(linkFinish.getDate() - link.lag);
            }
            if (!latestFinish || linkFinish < latestFinish) {
              latestFinish = linkFinish;
            }
          }
        }
        if (latestFinish) {
          scheduledTask.lateFinish = latestFinish;
          const duration = task.duration || 1;
          const lateStart = new Date(latestFinish);
          lateStart.setDate(lateStart.getDate() - duration + 1);
          scheduledTask.lateStart = lateStart;
        }
      }

      if (scheduledTask.earlyStart && scheduledTask.lateFinish) {
        scheduledTask.totalFloat = Math.ceil(
          (scheduledTask.lateFinish.getTime() - scheduledTask.earlyStart.getTime()) / (1000 * 60 * 60 * 24)
        ) - (task.duration || 1) + 1;
      }
    }
  }

  private markCriticalPath(scheduled: Map<TaskId, ScheduledTask>): void {
    for (const task of scheduled.values()) {
      task.isCritical = (task.totalFloat || 0) <= 0;
    }
  }
}
