import { Gantt } from '../components/Gantt/Gantt';
import type { Task } from '../components/types';

export default {
  title: 'Gantt/Holidays',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};


const tasks: Task[] = [
  {
    id: '1',
    text: 'Project Planning',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 15),
    duration: 14,
    progress: 100,
    color: '#26A69A',
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2026, 3, 15),
    end: new Date(2026, 4, 15),
    duration: 30,
    progress: 60,
    color: '#42A5F5',
  },
];

/**
 * Holidays and Non-Working Days
 * 
 * Highlights specific dates as holidays/non-working days.
 * These days are marked differently from regular weekends.
 */
export const WithHolidays = {
  args: {
    tasks: tasks,
    config: {
      weekends: true,
      holidays: [
        new Date(2026, 3, 10), // April 10
        new Date(2026, 3, 25), // April 25
        new Date(2026, 4, 1),  // May 1
      ],
      theme: 'light',
    },
  },
};

/**
 * Weekends Only
 */
export const WeekendsOnly = {
  args: {
    tasks: tasks,
    config: {
      weekends: true,
      holidays: [],
      theme: 'light',
    },
  },
};

/**
 * No Non-Working Days
 */
export const NoNonWorkingDays = {
  args: {
    tasks: tasks,
    config: {
      weekends: false,
      holidays: [],
      theme: 'light',
    },
  },
};
