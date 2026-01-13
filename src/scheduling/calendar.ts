/**
 * Calendar and working time management
 */

export interface Calendar {
  id: string;
  name: string;
  workingDays: number[]; // 0-6, Sunday-Saturday
  workingHours: {
    start: number; // 0-23
    end: number; // 0-23
  };
  exceptions?: CalendarException[];
}

export interface CalendarException {
  date: Date;
  working: boolean;
}

export class CalendarManager {
  private calendars: Map<string, Calendar> = new Map();
  private defaultCalendar: Calendar;

  constructor() {
    this.defaultCalendar = {
      id: 'default',
      name: 'Default',
      workingDays: [1, 2, 3, 4, 5], // Monday-Friday
      workingHours: { start: 9, end: 17 },
    };
    this.calendars.set('default', this.defaultCalendar);
  }

  addCalendar(calendar: Calendar): void {
    this.calendars.set(calendar.id, calendar);
  }

  getCalendar(id: string): Calendar {
    return this.calendars.get(id) || this.defaultCalendar;
  }

  isWorkingDay(date: Date, calendarId?: string): boolean {
    const calendar = calendarId ? this.getCalendar(calendarId) : this.defaultCalendar;
    const day = date.getDay();

    // Check exceptions first
    if (calendar.exceptions) {
      const dateStr = date.toISOString().split('T')[0];
      for (const exception of calendar.exceptions) {
        const exceptionStr = exception.date.toISOString().split('T')[0];
        if (dateStr === exceptionStr) {
          return exception.working;
        }
      }
    }

    return calendar.workingDays.includes(day);
  }

  addWorkingDays(startDate: Date, days: number, calendarId?: string): Date {
    const calendar = calendarId ? this.getCalendar(calendarId) : this.defaultCalendar;
    let current = new Date(startDate);
    let remaining = days;

    while (remaining > 0) {
      if (this.isWorkingDay(current, calendarId)) {
        remaining--;
      }
      if (remaining > 0) {
        current.setDate(current.getDate() + 1);
      }
    }

    return current;
  }

  getWorkingDaysBetween(startDate: Date, endDate: Date, calendarId?: string): number {
    const calendar = calendarId ? this.getCalendar(calendarId) : this.defaultCalendar;
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      if (this.isWorkingDay(current, calendarId)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }
}
