/**
 * Task model and operations
 */

import type { Task, TaskId } from '../types';

export class TaskModel {
  private tasks: Map<TaskId, Task> = new Map();
  private taskTree: Map<TaskId, TaskId[]> = new Map();

  constructor(tasks: Task[] = []) {
    this.loadTasks(tasks);
  }

  loadTasks(tasks: Task[]): void {
    this.tasks.clear();
    this.taskTree.clear();

    for (const task of tasks) {
      this.tasks.set(task.id, { ...task });
      if (task.parent) {
        const siblings = this.taskTree.get(task.parent) || [];
        siblings.push(task.id);
        this.taskTree.set(task.parent, siblings);
      }
    }
  }

  getTask(id: TaskId): Task | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getRootTasks(): Task[] {
    return this.getAllTasks().filter((task) => !task.parent);
  }

  getChildren(id: TaskId): Task[] {
    const childIds = this.taskTree.get(id) || [];
    return childIds.map((childId) => this.tasks.get(childId)!).filter(Boolean);
  }

  addTask(task: Task): void {
    this.tasks.set(task.id, { ...task });
    if (task.parent) {
      const siblings = this.taskTree.get(task.parent) || [];
      siblings.push(task.id);
      this.taskTree.set(task.parent, siblings);
    }
  }

  updateTask(id: TaskId, updates: Partial<Task>): void {
    const task = this.tasks.get(id);
    if (task) {
      this.tasks.set(id, { ...task, ...updates });
    }
  }

  removeTask(id: TaskId): void {
    const task = this.tasks.get(id);
    if (task?.parent) {
      const siblings = this.taskTree.get(task.parent) || [];
      this.taskTree.set(task.parent, siblings.filter((sid) => sid !== id));
    }
    this.tasks.delete(id);
    this.taskTree.delete(id);
  }
}
