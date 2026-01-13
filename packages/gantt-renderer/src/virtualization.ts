/**
 * Virtualization utilities for efficient rendering
 */

import type { Viewport, TimeScale } from './types';

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
  /**
   * Calculate which rows should be rendered based on viewport
   */
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

  /**
   * Calculate which time range should be rendered based on viewport
   */
  calculateTimeRange(
    viewport: Viewport,
    timeScale: TimeScale
  ): TimeRange {
    const startX = Math.max(0, viewport.x - 100); // Add padding
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

  private xToDate(x: number, timeScale: TimeScale): Date {
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

  /**
   * Check if a date range intersects with the visible time range
   */
  isDateRangeVisible(
    startDate: Date,
    endDate: Date,
    visibleRange: TimeRange
  ): boolean {
    return startDate <= visibleRange.endDate && endDate >= visibleRange.startDate;
  }
}
