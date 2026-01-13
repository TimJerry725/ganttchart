/**
 * Keyboard navigation
 */

import type { TaskId } from '../types';

export class KeyboardNavigator {
  private focusedTaskId: TaskId | null = null;

  setFocusedTask(taskId: TaskId | null): void {
    this.focusedTaskId = taskId;
  }

  getFocusedTask(): TaskId | null {
    return this.focusedTaskId;
  }

  handleNavigation(
    key: string,
    tasks: TaskId[],
    onSelect: (taskId: TaskId) => void
  ): boolean {
    if (!this.focusedTaskId) {
      if (tasks.length > 0) {
        this.focusedTaskId = tasks[0];
        onSelect(this.focusedTaskId);
        return true;
      }
      return false;
    }

    const currentIndex = tasks.indexOf(this.focusedTaskId);
    if (currentIndex === -1) return false;

    let newIndex = currentIndex;

    switch (key) {
      case 'ArrowDown':
        newIndex = Math.min(currentIndex + 1, tasks.length - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tasks.length - 1;
        break;
      default:
        return false;
    }

    if (newIndex !== currentIndex) {
      this.focusedTaskId = tasks[newIndex];
      onSelect(this.focusedTaskId);
      return true;
    }

    return false;
  }

  getARIAProps(taskId: TaskId, isSelected: boolean): Record<string, string> {
    return {
      role: 'row',
      'aria-selected': String(isSelected),
      'aria-label': `Task ${taskId}`,
      tabIndex: isSelected ? 0 : -1,
    };
  }
}
