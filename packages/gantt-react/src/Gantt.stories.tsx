/**
 * Storybook stories for Gantt component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Gantt } from './Gantt';
import type { Task, Link } from '@gantt/core';

const meta: Meta<typeof Gantt> = {
  title: 'Gantt/Gantt',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Gantt>;

const sampleTasks: Task[] = [
  {
    id: 1,
    name: 'Task 1',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-05'),
    duration: 5,
    progress: 100,
  },
  {
    id: 2,
    name: 'Task 2',
    start: new Date('2024-01-06'),
    end: new Date('2024-01-10'),
    duration: 5,
    progress: 50,
  },
];

const sampleLinks: Link[] = [
  {
    id: '1',
    source: 1,
    target: 2,
    type: 'finish-to-start',
  },
];

export const Basic: Story = {
  args: {
    tasks: sampleTasks,
    links: sampleLinks,
    height: 400,
    width: 800,
  },
};

export const WithProgress: Story = {
  args: {
    tasks: sampleTasks.map((task) => ({ ...task, progress: 75 })),
    links: sampleLinks,
    height: 400,
    width: 800,
  },
};
