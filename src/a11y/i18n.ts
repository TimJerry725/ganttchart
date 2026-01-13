/**
 * Internationalization
 */

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

export class I18nManager {
  private config: I18nConfig = defaultI18n;
  private rtl = false;

  setI18n(config: Partial<I18nConfig>): void {
    this.config = { ...this.config, ...config };
  }

  t(key: string): string {
    return this.config.messages[key] || key;
  }

  formatDate(date: Date): string {
    if (this.config.dateFormat) {
      return this.config.dateFormat(date);
    }
    return date.toLocaleDateString(this.config.locale);
  }

  formatNumber(num: number): string {
    if (this.config.numberFormat) {
      return this.config.numberFormat(num);
    }
    return num.toLocaleString(this.config.locale);
  }

  setRTL(rtl: boolean): void {
    this.rtl = rtl;
  }

  isRTL(): boolean {
    return this.rtl;
  }
}
