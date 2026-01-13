/**
 * CSV and Excel export
 */

import type { Task, Link } from '../types';

export class CSVExporter {
  exportTasks(tasks: Task[]): string {
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

  exportLinks(links: Link[]): string {
    const headers = ['ID', 'Source', 'Target', 'Type', 'Lag'];
    const rows = [headers.join(',')];

    for (const link of links) {
      const row = [
        link.id,
        String(link.source),
        String(link.target),
        link.type,
        String(link.lag || 0),
      ];
      rows.push(row.join(','));
    }

    return rows.join('\n');
  }

  exportToExcel(tasks: Task[], links: Link[]): string {
    // Simplified Excel export (CSV format that Excel can open)
    return this.exportTasks(tasks) + '\n\n' + this.exportLinks(links);
  }

  downloadCSV(content: string, filename: string = 'iris-gantt.csv'): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
