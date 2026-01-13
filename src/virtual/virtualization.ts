/**
 * Virtualization for efficient rendering
 */

export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VirtualizedRange {
  startIndex: number;
  endIndex: number;
  offsetY: number;
}

export interface TimeRange {
  startDate: Date;
  endDate: Date;
  offsetX: number;
}

export class VirtualizationManager {
  calculateRowRange(
    viewport: Viewport,
    totalRows: number,
    rowHeight: number
  ): VirtualizedRange {
    const startIndex = Math.max(0, Math.floor(viewport.y / rowHeight) - 1);
    const endIndex = Math.min(
      totalRows - 1,
      Math.ceil((viewport.y + viewport.height) / rowHeight) + 1
    );
    const offsetY = startIndex * rowHeight;

    return {
      startIndex,
      endIndex,
      offsetY,
    };
  }

  calculateTimeRange(
    viewport: Viewport,
    timeScale: { unit: string; pixelsPerUnit: number; startDate: Date; endDate: Date }
  ): TimeRange {
    const startX = Math.max(0, viewport.x - 100);
    const endX = viewport.x + viewport.width + 100;

    const startDate = this.xToDate(startX, timeScale);
    const endDate = this.xToDate(endX, timeScale);
    const offsetX = startX;

    return {
      startDate,
      endDate,
      offsetX,
    };
  }

  private xToDate(x: number, timeScale: { unit: string; pixelsPerUnit: number; startDate: Date }): Date {
    let days: number;

    switch (timeScale.unit) {
      case 'day':
        days = x / timeScale.pixelsPerUnit;
        break;
      case 'week':
        days = (x / timeScale.pixelsPerUnit) * 7;
        break;
      case 'month':
        days = (x / timeScale.pixelsPerUnit) * 30;
        break;
      case 'quarter':
        days = (x / timeScale.pixelsPerUnit) * 90;
        break;
      case 'year':
        days = (x / timeScale.pixelsPerUnit) * 365;
        break;
      default:
        days = x / timeScale.pixelsPerUnit;
    }

    const date = new Date(timeScale.startDate);
    date.setDate(date.getDate() + days);
    return date;
  }
}
