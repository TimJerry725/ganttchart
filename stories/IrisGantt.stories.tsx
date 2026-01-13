/**
 * Storybook stories for Iris Gantt
 */

import type { Meta, StoryObj } from '@storybook/react';
import { IrisGantt } from '../src/IrisGantt';
import type { Task, Link } from '../src/types';

const meta: Meta<typeof IrisGantt> = {
  title: 'Iris Gantt/Basic',
  component: IrisGantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IrisGantt>;

const sampleTasks: Task[] = [
  {
    id: 1,
    name: 'Project Setup',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-05'),
    duration: 5,
    progress: 100,
  },
  {
    id: 2,
    name: 'Development',
    start: new Date('2024-01-06'),
    end: new Date('2024-01-20'),
    duration: 15,
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
    width: 1200,
    height: 600,
  },
};

export const Empty: Story = {
  args: {
    tasks: [],
    links: [],
    width: 1200,
    height: 600,
  },
};
