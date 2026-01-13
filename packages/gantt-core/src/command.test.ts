/**
 * Basic tests for CommandManager
 */

import { describe, it, expect } from 'vitest';
import { CommandManager, AddTaskCommand, RemoveTaskCommand } from './command';
import { GanttModel } from './model';
import type { Task } from './types';

describe('CommandManager', () => {
  it('should execute and undo commands', () => {
    const model = new GanttModel();
    const commandManager = new CommandManager();

    const task: Task = { id: 1, name: 'Test Task' };
    const addCommand = new AddTaskCommand(model, task);

    commandManager.execute(addCommand);
    expect(model.getTask(1)).toBeDefined();

    expect(commandManager.canUndo()).toBe(true);
    commandManager.undo();
    expect(model.getTask(1)).toBeUndefined();
  });

  it('should support redo', () => {
    const model = new GanttModel();
    const commandManager = new CommandManager();

    const task: Task = { id: 1, name: 'Test Task' };
    const addCommand = new AddTaskCommand(model, task);

    commandManager.execute(addCommand);
    commandManager.undo();
    expect(model.getTask(1)).toBeUndefined();

    expect(commandManager.canRedo()).toBe(true);
    commandManager.redo();
    expect(model.getTask(1)).toBeDefined();
  });
});
