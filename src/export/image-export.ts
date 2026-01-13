/**
 * PNG and PDF export
 */

export class ImageExporter {
  async exportToPNG(canvas: HTMLCanvasElement, filename: string = 'iris-gantt.png'): Promise<void> {
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
    filename: string = 'iris-gantt.pdf'
  ): Promise<void> {
    // PDF export would require a library like jsPDF
    // For now, throw an error indicating it needs to be implemented
    throw new Error('PDF export requires jsPDF library. Install: npm install jspdf');
  }

  async print(): Promise<void> {
    window.print();
  }
}
