/**
 * Command pattern for undo/redo support
 */

import type { Task, TaskId, Link } from './types';
import { GanttModel } from './model';

export interface Command {
  execute(): void;
  undo(): void;
  canUndo(): boolean;
}

export class AddTaskCommand implements Command {
  constructor(
    private model: GanttModel,
    private task: Task
  ) {}

  execute(): void {
    this.model.addTask(this.task);
  }

  undo(): void {
    this.model.removeTask(this.task.id);
  }

  canUndo(): boolean {
    return true;
  }
}

export class UpdateTaskCommand implements Command {
  private previousTask?: Task;

  constructor(
    private model: GanttModel,
    private taskId: TaskId,
    private updates: Partial<Task>
  ) {}

  execute(): void {
    const task = this.model.getTask(this.taskId);
    if (task) {
      this.previousTask = { ...task };
      this.model.updateTask(this.taskId, this.updates);
    }
  }

  undo(): void {
    if (this.previousTask) {
      this.model.updateTask(this.taskId, this.previousTask);
    }
  }

  canUndo(): boolean {
    return this.previousTask !== undefined;
  }
}

export class RemoveTaskCommand implements Command {
  private task?: Task;
  private links: Link[] = [];

  constructor(
    private model: GanttModel,
    private taskId: TaskId
  ) {}

  execute(): void {
    this.task = this.model.getTask(this.taskId);
    if (this.task) {
      this.links = this.model.getLinksForTask(this.taskId);
      this.model.removeTask(this.taskId);
    }
  }

  undo(): void {
    if (this.task) {
      this.model.addTask(this.task);
      this.links.forEach((link) => this.model.addLink(link));
    }
  }

  canUndo(): boolean {
    return this.task !== undefined;
  }
}

export class AddLinkCommand implements Command {
  constructor(
    private model: GanttModel,
    private link: Link
  ) {}

  execute(): void {
    this.model.addLink(this.link);
  }

  undo(): void {
    this.model.removeLink(this.link.id);
  }

  canUndo(): boolean {
    return true;
  }
}

export class UpdateLinkCommand implements Command {
  private previousLink?: Link;

  constructor(
    private model: GanttModel,
    private linkId: string,
    private updates: Partial<Link>
  ) {}

  execute(): void {
    const link = this.model.getLink(this.linkId);
    if (link) {
      this.previousLink = { ...link };
      this.model.updateLink(this.linkId, this.updates);
    }
  }

  undo(): void {
    if (this.previousLink) {
      this.model.updateLink(this.linkId, this.previousLink);
    }
  }

  canUndo(): boolean {
    return this.previousLink !== undefined;
  }
}

export class RemoveLinkCommand implements Command {
  private link?: Link;

  constructor(
    private model: GanttModel,
    private linkId: string
  ) {}

  execute(): void {
    this.link = this.model.getLink(this.linkId);
    if (this.link) {
      this.model.removeLink(this.linkId);
    }
  }

  undo(): void {
    if (this.link) {
      this.model.addLink(this.link);
    }
  }

  canUndo(): boolean {
    return this.link !== undefined;
  }
}

export class CommandManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private maxHistory = 100;

  execute(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  undo(): boolean {
    const command = this.undoStack.pop();
    if (command && command.canUndo()) {
      command.undo();
      this.redoStack.push(command);
      return true;
    }
    return false;
  }

  redo(): boolean {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1].canUndo();
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
