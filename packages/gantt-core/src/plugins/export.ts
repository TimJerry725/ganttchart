/**
 * Export plugin for CSV/Excel/PDF/PNG export
 */

import type { Plugin, PluginContext } from '../plugin';
import type { Task, Link } from '../types';

export class ExportPlugin implements Plugin {
  name = 'export';
  version = '1.0.0';
  private context?: PluginContext;

  initialize(context: PluginContext): void {
    this.context = context;
  }

  exportToCSV(): string {
    if (!this.context) return '';

    const tasks = this.context.model.getAllTasks();
    const headers = ['ID', 'Name', 'Start', 'End', 'Duration', 'Progress', 'Parent'];
    const rows = [headers.join(',')];

    for (const task of tasks) {
      const row = [
        String(task.id),
        `"${task.name}"`,
        task.start?.toISOString().split('T')[0] || '',
        task.end?.toISOString().split('T')[0] || '',
        String(task.duration || 0),
        String(task.progress || 0),
        task.parent ? String(task.parent) : '',
      ];
      rows.push(row.join(','));
    }

    return rows.join('\n');
  }

  exportToJSON(): string {
    if (!this.context) return '{}';

    const project = this.context.model.toJSON();
    return JSON.stringify(project, null, 2);
  }

  async exportToPNG(
    canvas: HTMLCanvasElement,
    filename = 'gantt.png'
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png');
      } catch (error) {
        reject(error);
      }
    });
  }

  async exportToPDF(
    canvas: HTMLCanvasElement,
    filename = 'gantt.pdf'
  ): Promise<void> {
    // This would require a PDF library like jsPDF
    // For now, just a placeholder
    throw new Error('PDF export requires jsPDF library');
  }

  exportToExcel(): string {
    // Simplified Excel export (CSV format that Excel can open)
    return this.exportToCSV();
  }
}
