/**
 * Command implementations
 */

import type { Task, Link, TaskId } from '../types';

export interface Command {
  execute(): void;
  undo(): void;
  canUndo(): boolean;
}

export class AddTaskCommand implements Command {
  constructor(
    private tasks: Task[],
    private task: Task,
    private onTasksChange: (tasks: Task[]) => void
  ) {}

  execute(): void {
    this.onTasksChange([...this.tasks, this.task]);
  }

  undo(): void {
    this.onTasksChange(this.tasks.filter((t) => t.id !== this.task.id));
  }

  canUndo(): boolean {
    return true;
  }
}

export class UpdateTaskCommand implements Command {
  private previousTask?: Task;

  constructor(
    private tasks: Task[],
    private taskId: TaskId,
    private updates: Partial<Task>,
    private onTasksChange: (tasks: Task[]) => void
  ) {}

  execute(): void {
    const task = this.tasks.find((t) => t.id === this.taskId);
    if (task) {
      this.previousTask = { ...task };
      this.onTasksChange(
        this.tasks.map((t) => (t.id === this.taskId ? { ...t, ...this.updates } : t))
      );
    }
  }

  undo(): void {
    if (this.previousTask) {
      this.onTasksChange(
        this.tasks.map((t) => (t.id === this.taskId ? this.previousTask! : t))
      );
    }
  }

  canUndo(): boolean {
    return this.previousTask !== undefined;
  }
}

export class RemoveTaskCommand implements Command {
  private task?: Task;

  constructor(
    private tasks: Task[],
    private taskId: TaskId,
    private onTasksChange: (tasks: Task[]) => void
  ) {}

  execute(): void {
    this.task = this.tasks.find((t) => t.id === this.taskId);
    if (this.task) {
      this.onTasksChange(this.tasks.filter((t) => t.id !== this.taskId));
    }
  }

  undo(): void {
    if (this.task) {
      this.onTasksChange([...this.tasks, this.task]);
    }
  }

  canUndo(): boolean {
    return this.task !== undefined;
  }
}

export class AddLinkCommand implements Command {
  constructor(
    private links: Link[],
    private link: Link,
    private onLinksChange: (links: Link[]) => void
  ) {}

  execute(): void {
    this.onLinksChange([...this.links, this.link]);
  }

  undo(): void {
    this.onLinksChange(this.links.filter((l) => l.id !== this.link.id));
  }

  canUndo(): boolean {
    return true;
  }
}

export class RemoveLinkCommand implements Command {
  private link?: Link;

  constructor(
    private links: Link[],
    private linkId: string,
    private onLinksChange: (links: Link[]) => void
  ) {}

  execute(): void {
    this.link = this.links.find((l) => l.id === this.linkId);
    if (this.link) {
      this.onLinksChange(this.links.filter((l) => l.id !== this.linkId));
    }
  }

  undo(): void {
    if (this.link) {
      this.onLinksChange([...this.links, this.link]);
    }
  }

  canUndo(): boolean {
    return this.link !== undefined;
  }
}
