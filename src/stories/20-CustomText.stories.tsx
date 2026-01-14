import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components';
import type { Task } from '../components/types';
import '../components/gantt.css';

const meta = {
  title: 'Gantt/Custom text',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Gantt>;

export default meta;
type Story = StoryObj<typeof meta>;

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
export const Default: Story = {
  args: {
    tasks,
    config: {
      weekends: true,
      theme: 'light',
      locale: 'en',
    },
  },
};
