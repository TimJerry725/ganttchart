/**
 * Resource management
 */

import type { Resource, Task, TaskId } from '../types';

export interface ResourceAssignment {
  taskId: TaskId;
  resourceId: string;
  units: number; // 0-1 or absolute units
}

export interface ResourceUsage {
  resourceId: string;
  date: Date;
  usage: number;
  capacity: number;
  overloaded: boolean;
}

export class ResourceManager {
  private resources: Map<string, Resource> = new Map();
  private assignments: Map<string, ResourceAssignment[]> = new Map(); // taskId -> assignments

  loadResources(resources: Resource[]): void {
    this.resources.clear();
    for (const resource of resources) {
      this.resources.set(resource.id, { ...resource });
    }
  }

  getResource(id: string): Resource | undefined {
    return this.resources.get(id);
  }

  getAllResources(): Resource[] {
    return Array.from(this.resources.values());
  }

  assignResource(taskId: TaskId, resourceId: string, units: number = 1): void {
    const taskAssignments = this.assignments.get(String(taskId)) || [];
    const existing = taskAssignments.find((a) => a.resourceId === resourceId);
    
    if (existing) {
      existing.units = units;
    } else {
      taskAssignments.push({ taskId, resourceId, units });
    }
    
    this.assignments.set(String(taskId), taskAssignments);
  }

  unassignResource(taskId: TaskId, resourceId: string): void {
    const taskAssignments = this.assignments.get(String(taskId)) || [];
    this.assignments.set(
      String(taskId),
      taskAssignments.filter((a) => a.resourceId !== resourceId)
    );
  }

  getTaskAssignments(taskId: TaskId): ResourceAssignment[] {
    return this.assignments.get(String(taskId)) || [];
  }

  calculateUsage(
    tasks: Task[],
    startDate: Date,
    endDate: Date
  ): Map<string, ResourceUsage[]> {
    const usage = new Map<string, ResourceUsage[]>();

    for (const resource of this.resources.values()) {
      const dailyUsage: ResourceUsage[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        let totalUsage = 0;

        for (const task of tasks) {
          const assignments = this.getTaskAssignments(task.id);
          const assignment = assignments.find((a) => a.resourceId === resource.id);
          
          if (assignment && task.start && task.end) {
            if (currentDate >= task.start && currentDate <= task.end) {
              totalUsage += assignment.units;
            }
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
