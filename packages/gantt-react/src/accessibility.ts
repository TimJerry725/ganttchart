/**
 * Accessibility, i18n, and RTL support
 */

import type { TaskId } from '@gantt/core';

export interface I18nConfig {
  locale: string;
  messages: Record<string, string>;
  dateFormat?: (date: Date) => string;
  numberFormat?: (num: number) => string;
}

export const defaultI18n: I18nConfig = {
  locale: 'en',
  messages: {
    'task.name': 'Task Name',
    'task.start': 'Start',
    'task.end': 'End',
    'task.duration': 'Duration',
    'task.progress': 'Progress',
    'gantt.zoom.in': 'Zoom In',
    'gantt.zoom.out': 'Zoom Out',
    'gantt.undo': 'Undo',
    'gantt.redo': 'Redo',
  },
  dateFormat: (date: Date) => date.toLocaleDateString(),
  numberFormat: (num: number) => num.toString(),
};

export class AccessibilityManager {
  private focusedTaskId: TaskId | null = null;
  private i18n: I18nConfig = defaultI18n;
  private rtl = false;

  setI18n(config: Partial<I18nConfig>): void {
    this.i18n = { ...this.i18n, ...config };
  }

  t(key: string): string {
    return this.i18n.messages[key] || key;
  }

  formatDate(date: Date): string {
    if (this.i18n.dateFormat) {
      return this.i18n.dateFormat(date);
    }
    return date.toLocaleDateString(this.i18n.locale);
  }

  formatNumber(num: number): string {
    if (this.i18n.numberFormat) {
      return this.i18n.numberFormat(num);
    }
    return num.toLocaleString(this.i18n.locale);
  }

  setRTL(rtl: boolean): void {
    this.rtl = rtl;
  }

  isRTL(): boolean {
    return this.rtl;
  }

  setFocusedTask(taskId: TaskId | null): void {
    this.focusedTaskId = taskId;
  }

  getFocusedTask(): TaskId | null {
    return this.focusedTaskId;
  }

  handleKeyboardNavigation(
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
