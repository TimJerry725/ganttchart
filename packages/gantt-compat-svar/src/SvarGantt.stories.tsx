/**
 * Storybook stories for SVAR compatibility component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SvarGantt } from './facade';
import type { SvarTask, SvarLink } from './types';

const meta: Meta<typeof SvarGantt> = {
  title: 'Gantt/SVAR Compatibility',
  component: SvarGantt,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'SVAR Gantt API compatibility layer for easy migration from SVAR Gantt.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SvarGantt>;

const svarTasks: SvarTask[] = [
  {
    id: 1,
    text: 'Project Setup',
    start_date: '2024-01-01',
    end_date: '2024-01-05',
    duration: 5,
    progress: 100,
    type: 'task',
  },
  {
    id: 2,
    text: 'Development',
    start_date: '2024-01-06',
    end_date: '2024-01-20',
    duration: 15,
    progress: 50,
    type: 'task',
  },
  {
    id: 3,
    text: 'Testing',
    start_date: '2024-01-21',
    end_date: '2024-01-25',
    duration: 5,
    progress: 0,
    type: 'task',
  },
];

const svarLinks: SvarLink[] = [
  {
    id: 1,
    source: 1,
    target: 2,
    type: 0, // finish-to-start
  },
  {
    id: 2,
    source: 2,
    target: 3,
    type: 0, // finish-to-start
  },
];

export const Basic: Story = {
  args: {
    tasks: svarTasks,
    links: svarLinks,
    height: 400,
    width: 1000,
  },
};

export const WithSVARColumns: Story = {
  args: {
    tasks: svarTasks,
    links: svarLinks,
    columns: [
      { name: 'text', label: 'Task Name', width: 200, tree: true },
      { name: 'start_date', label: 'Start', width: 100 },
      { name: 'end_date', label: 'End', width: 100 },
      { name: 'duration', label: 'Duration', width: 80 },
      { name: 'progress', label: 'Progress', width: 80 },
    ],
    height: 400,
    width: 1200,
  },
};

export const WithEvents: Story = {
  args: {
    tasks: svarTasks,
    links: svarLinks,
    height: 400,
    width: 1000,
    onTaskClick: (id, e) => {
      console.log('SVAR Task clicked:', id, e);
      alert(`SVAR Task ${id} clicked!`);
    },
    onTaskDblClick: (id, e) => {
      console.log('SVAR Task double-clicked:', id, e);
      alert(`SVAR Task ${id} double-clicked!`);
    },
    onAfterTaskAdd: (id, task) => {
      console.log('SVAR Task added:', id, task);
    },
    onAfterTaskUpdate: (id, task) => {
      console.log('SVAR Task updated:', id, task);
    },
  },
};

export const Readonly: Story = {
  args: {
    tasks: svarTasks.map(task => ({ ...task, readonly: true })),
    links: svarLinks,
    readonly: true,
    height: 400,
    width: 1000,
  },
};
