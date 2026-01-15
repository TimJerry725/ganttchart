import { Gantt } from '../components/Gantt/Gantt';
import type { Task } from '../components/types';

export default {
  title: 'Gantt/Custom Text',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};


const tasks: Task[] = [
  {
    id: '1',
    text: 'Project planning with custom formatted text',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 16),
    duration: 14,
    progress: 100,
    color: '#26A69A',
    details: 'Custom details and descriptions can be added to tasks',
  },
  {
    id: '2',
    text: 'Development: Backend + Frontend',
    start: new Date(2026, 3, 16),
    end: new Date(2026, 4, 15),
    duration: 29,
    progress: 60,
    color: '#42A5F5',
    details: 'Support for rich text and special characters',
  },
];

/**
 * Custom Text Formatting
 * 
 * Customize text display in task names, labels, and tooltips.
 * Supports custom formatting, templates, and localization.
 */
export const Default = {
  args: {
    tasks: tasks,
    config: {
      weekends: true,
      theme: 'light',
      locale: 'en',
    },
  },
};
