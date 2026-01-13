import { Task, Link } from '../types';
import { formatDate } from '../utils/dateUtils';

// CSV Export
export const exportToCSV = (tasks: Task[]): void => {
  const headers = ['ID', 'Task Name', 'Start Date', 'End Date', 'Duration', 'Progress', 'Type', 'Owner', 'Priority'];
  const rows = tasks.map(task => [
    task.id,
    task.text,
    formatDate(task.start, 'YYYY-MM-DD'),
    formatDate(task.end, 'YYYY-MM-DD'),
    task.duration.toString(),
    `${task.progress}%`,
    task.type || 'task',
    task.owner || '',
    task.priority || 'medium',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  downloadFile(csvContent, 'gantt-tasks.csv', 'text/csv');
};

// Excel-compatible CSV Export (with BOM for UTF-8)
export const exportToExcel = (tasks: Task[]): void => {
  const headers = ['ID', 'Task Name', 'Start Date', 'End Date', 'Duration', 'Progress', 'Type', 'Owner', 'Priority', 'Details'];
  const rows = tasks.map(task => [
    task.id,
    task.text,
    formatDate(task.start, 'MM/DD/YYYY'),
    formatDate(task.end, 'MM/DD/YYYY'),
    task.duration.toString(),
    task.progress.toString(),
    task.type || 'task',
    task.owner || '',
    task.priority || 'medium',
    task.details || '',
  ]);

  const csvContent = '\uFEFF' + [ // BOM for UTF-8
    headers.join('\t'),
    ...rows.map(row => row.map(cell => cell.replace(/\t/g, ' ')).join('\t'))
  ].join('\n');

  downloadFile(csvContent, 'gantt-tasks.xls', 'application/vnd.ms-excel');
};

// JSON Export
export const exportToJSON = (tasks: Task[], links: Link[]): void => {
  const data = {
    tasks,
    links,
    exported: new Date().toISOString(),
    version: '1.0',
  };

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, 'gantt-project.json', 'application/json');
};

// PDF Export (basic implementation - would need a library like jsPDF for production)
export const exportToPDF = (tasks: Task[]): void => {
  // This is a placeholder. In production, use jsPDF or similar
  const content = `
GANTT CHART PROJECT
Generated: ${new Date().toLocaleString()}

Tasks:
${tasks.map((task, i) => `
${i + 1}. ${task.text}
   Start: ${formatDate(task.start, 'MM/DD/YYYY')}
   End: ${formatDate(task.end, 'MM/DD/YYYY')}
   Duration: ${task.duration} days
   Progress: ${task.progress}%
   ${task.owner ? `Owner: ${task.owner}` : ''}
`).join('\n')}
  `.trim();

  downloadFile(content, 'gantt-report.txt', 'text/plain');
  
  alert('PDF export is a simplified text version. For full PDF with charts, a PDF library would be needed.');
};

// Image Export (PNG/SVG)
export const exportToImage = (elementId: string, filename: string, format: 'png' | 'svg' = 'png'): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Could not find Gantt chart element to export');
    return;
  }

  if (format === 'svg') {
    // For SVG, we'd need to convert the DOM to SVG
    alert('SVG export requires additional library. Use PNG or implement with dom-to-svg.');
    return;
  }

  // For PNG, use html2canvas (would need to be installed)
  alert('Image export requires html2canvas library. Install with: npm install html2canvas');
  
  // Example implementation:
  // import html2canvas from 'html2canvas';
  // html2canvas(element).then(canvas => {
  //   const url = canvas.toDataURL('image/png');
  //   downloadFileFromURL(url, filename);
  // });
};

// Helper function to download file
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  downloadFileFromURL(url, filename);
  URL.revokeObjectURL(url);
};

const downloadFileFromURL = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Import from JSON
export const importFromJSON = (file: File): Promise<{ tasks: Task[], links: Link[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Convert date strings back to Date objects
        const tasks = data.tasks.map((task: any) => ({
          ...task,
          start: new Date(task.start),
          end: new Date(task.end),
        }));
        
        resolve({ tasks, links: data.links || [] });
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
