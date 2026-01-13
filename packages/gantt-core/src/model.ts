/**
 * Gantt project data model and operations
 */

import type {
  Task,
  TaskId,
  Link,
  Calendar,
  Resource,
  ResourceAssignment,
  Baseline,
  GanttProject,
} from './types';

export class GanttModel {
  private tasks: Map<TaskId, Task> = new Map();
  private links: Map<string, Link> = new Map();
  private calendars: Map<string, Calendar> = new Map();
  private resources: Map<string, Resource> = new Map();
  private baselines: Map<string, Baseline> = new Map();
  private taskIndex: Map<TaskId, Set<string>> = new Map(); // taskId -> linkIds

  constructor(project?: GanttProject) {
    if (project) {
      this.loadProject(project);
    }
  }

  loadProject(project: GanttProject): void {
    this.tasks.clear();
    this.links.clear();
    this.calendars.clear();
    this.resources.clear();
    this.baselines.clear();
    this.taskIndex.clear();

    project.tasks.forEach((task) => this.addTask(task));
    project.links?.forEach((link) => this.addLink(link));
    project.calendars?.forEach((calendar) => this.addCalendar(calendar));
    project.resources?.forEach((resource) => this.addResource(resource));
    project.baselines?.forEach((baseline) => this.addBaseline(baseline));
  }

  // Task operations
  addTask(task: Task): void {
    this.tasks.set(task.id, { ...task });
    this.taskIndex.set(task.id, new Set());
  }

  getTask(id: TaskId): Task | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  updateTask(id: TaskId, updates: Partial<Task>): void {
    const task = this.tasks.get(id);
    if (task) {
      this.tasks.set(id, { ...task, ...updates });
    }
  }

  removeTask(id: TaskId): void {
    const task = this.tasks.get(id);
    if (!task) return;

    // Remove child references
    if (task.parent) {
      const parent = this.tasks.get(task.parent);
      if (parent?.children) {
        parent.children = parent.children.filter((childId) => childId !== id);
      }
    }

    // Remove links
    const linkIds = this.taskIndex.get(id);
    if (linkIds) {
      linkIds.forEach((linkId) => this.removeLink(linkId));
    }

    this.tasks.delete(id);
    this.taskIndex.delete(id);
  }

  getChildren(id: TaskId): Task[] {
    const task = this.tasks.get(id);
    if (!task?.children) return [];
    return task.children.map((childId) => this.tasks.get(childId)!).filter(Boolean);
  }

  getRootTasks(): Task[] {
    return this.getAllTasks().filter((task) => !task.parent);
  }

  // Link operations
  addLink(link: Link): void {
    this.links.set(link.id, { ...link });
    const sourceIndex = this.taskIndex.get(link.source) || new Set();
    sourceIndex.add(link.id);
    this.taskIndex.set(link.source, sourceIndex);
    const targetIndex = this.taskIndex.get(link.target) || new Set();
    targetIndex.add(link.id);
    this.taskIndex.set(link.target, targetIndex);
  }

  getLink(id: string): Link | undefined {
    return this.links.get(id);
  }

  getAllLinks(): Link[] {
    return Array.from(this.links.values());
  }

  getLinksForTask(taskId: TaskId): Link[] {
    const linkIds = this.taskIndex.get(taskId);
    if (!linkIds) return [];
    return Array.from(linkIds)
      .map((linkId) => this.links.get(linkId))
      .filter((link): link is Link => Boolean(link));
  }

  updateLink(id: string, updates: Partial<Link>): void {
    const link = this.links.get(id);
    if (link) {
      // Update indices if source/target changed
      if (updates.source && updates.source !== link.source) {
        const oldIndex = this.taskIndex.get(link.source);
        oldIndex?.delete(id);
        const newIndex = this.taskIndex.get(updates.source) || new Set();
        newIndex.add(id);
        this.taskIndex.set(updates.source, newIndex);
      }
      if (updates.target && updates.target !== link.target) {
        const oldIndex = this.taskIndex.get(link.target);
        oldIndex?.delete(id);
        const newIndex = this.taskIndex.get(updates.target) || new Set();
        newIndex.add(id);
        this.taskIndex.set(updates.target, newIndex);
      }
      this.links.set(id, { ...link, ...updates });
    }
  }

  removeLink(id: string): void {
    const link = this.links.get(id);
    if (!link) return;

    const sourceIndex = this.taskIndex.get(link.source);
    sourceIndex?.delete(id);
    const targetIndex = this.taskIndex.get(link.target);
    targetIndex?.delete(id);

    this.links.delete(id);
  }

  // Calendar operations
  addCalendar(calendar: Calendar): void {
    this.calendars.set(calendar.id, { ...calendar });
  }

  getCalendar(id: string): Calendar | undefined {
    return this.calendars.get(id);
  }

  getAllCalendars(): Calendar[] {
    return Array.from(this.calendars.values());
  }

  // Resource operations
  addResource(resource: Resource): void {
    this.resources.set(resource.id, { ...resource });
  }

  getResource(id: string): Resource | undefined {
    return this.resources.get(id);
  }

  getAllResources(): Resource[] {
    return Array.from(this.resources.values());
  }

  // Baseline operations
  addBaseline(baseline: Baseline): void {
    this.baselines.set(baseline.id, { ...baseline });
  }

  getBaseline(id: string): Baseline | undefined {
    return this.baselines.get(id);
  }

  getAllBaselines(): Baseline[] {
    return Array.from(this.baselines.values());
  }

  // Export project
  toJSON(): GanttProject {
    return {
      tasks: this.getAllTasks(),
      links: this.getAllLinks(),
      calendars: this.getAllCalendars(),
      resources: this.getAllResources(),
      baselines: this.getAllBaselines(),
    };
  }
}
