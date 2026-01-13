/**
 * Basic tests for GanttModel
 */

import { describe, it, expect } from 'vitest';
import { GanttModel } from './model';
import type { Task, Link } from './types';

describe('GanttModel', () => {
  it('should create an empty model', () => {
    const model = new GanttModel();
    expect(model.getAllTasks()).toEqual([]);
    expect(model.getAllLinks()).toEqual([]);
  });

  it('should add a task', () => {
    const model = new GanttModel();
    const task: Task = {
      id: 1,
      name: 'Test Task',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-05'),
      duration: 5,
    };

    model.addTask(task);
    expect(model.getTask(1)).toBeDefined();
    expect(model.getTask(1)?.name).toBe('Test Task');
  });

  it('should add a link', () => {
    const model = new GanttModel();
    const task1: Task = { id: 1, name: 'Task 1' };
    const task2: Task = { id: 2, name: 'Task 2' };
    const link: Link = {
      id: '1',
      source: 1,
      target: 2,
      type: 'finish-to-start',
    };

    model.addTask(task1);
    model.addTask(task2);
    model.addLink(link);

    expect(model.getLink('1')).toBeDefined();
    expect(model.getLink('1')?.source).toBe(1);
    expect(model.getLink('1')?.target).toBe(2);
  });

  it('should remove a task', () => {
    const model = new GanttModel();
    const task: Task = { id: 1, name: 'Test Task' };

    model.addTask(task);
    expect(model.getTask(1)).toBeDefined();

    model.removeTask(1);
    expect(model.getTask(1)).toBeUndefined();
  });
});
