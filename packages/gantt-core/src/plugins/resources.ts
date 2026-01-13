/**
 * Resources plugin for resource management
 */

import type { Plugin, PluginContext } from '../plugin';
import type { Resource, ResourceAssignment, Task, TaskId } from '../types';

export interface ResourceUsage {
  resourceId: string;
  date: Date;
  usage: number;
  capacity: number;
  overloaded: boolean;
}

export class ResourcesPlugin implements Plugin {
  name = 'resources';
  version = '1.0.0';
  private context?: PluginContext;

  initialize(context: PluginContext): void {
    this.context = context;
  }

  getResourceAssignments(taskId: TaskId): ResourceAssignment[] {
    if (!this.context) return [];

    const task = this.context.model.getTask(taskId);
    if (!task?.resourceIds) return [];

    return task.resourceIds.map((resourceId) => ({
      taskId,
      resourceId,
      units: 1, // Default to full allocation
    }));
  }

  assignResource(taskId: TaskId, resourceId: string, units?: number): void {
    if (!this.context) return;

    const task = this.context.model.getTask(taskId);
    if (task) {
      const resourceIds = task.resourceIds || [];
      if (!resourceIds.includes(resourceId)) {
        this.context.model.updateTask(taskId, {
          resourceIds: [...resourceIds, resourceId],
        });
      }
    }
  }

  unassignResource(taskId: TaskId, resourceId: string): void {
    if (!this.context) return;

    const task = this.context.model.getTask(taskId);
    if (task?.resourceIds) {
      this.context.model.updateTask(taskId, {
        resourceIds: task.resourceIds.filter((id) => id !== resourceId),
      });
    }
  }

  calculateResourceUsage(
    startDate: Date,
    endDate: Date
  ): Map<string, ResourceUsage[]> {
    if (!this.context) return new Map();

    const usage = new Map<string, ResourceUsage[]>();
    const tasks = this.context.model.getAllTasks();
    const resources = this.context.model.getAllResources();

    for (const resource of resources) {
      const dailyUsage: ResourceUsage[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        let totalUsage = 0;

        for (const task of tasks) {
          if (
            task.resourceIds?.includes(resource.id) &&
            task.start &&
            task.end &&
            currentDate >= task.start &&
            currentDate <= task.end
          ) {
            totalUsage += 1; // Simplified: assume 1 unit per task
          }
        }

        const capacity = resource.capacity || 1;
        dailyUsage.push({
          resourceId: resource.id,
          date: new Date(currentDate),
          usage: totalUsage,
          capacity,
          overloaded: totalUsage > capacity,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      usage.set(resource.id, dailyUsage);
    }

    return usage;
  }
}
