/**
 * Example stories for Iris Gantt
 */

import type { Meta, StoryObj } from '@storybook/react';
import { IrisGantt } from '../src/IrisGantt';
import type { Task, Link } from '../src/types';

const meta: Meta<typeof IrisGantt> = {
  title: 'Iris Gantt/Examples',
  component: IrisGantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IrisGantt>;

const generateTasks = (count: number): Task[] => {
  const tasks: Task[] = [];
  for (let i = 1; i <= count; i++) {
    const start = new Date('2024-01-01');
    start.setDate(start.getDate() + (i - 1) * 5);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    
    tasks.push({
      id: i,
      name: `Task ${i}`,
      start,
      end,
      duration: 5,
      progress: Math.min(100, i * 10),
    });
  }
  return tasks;
};

export const WithManyTasks: Story = {
  args: {
    tasks: generateTasks(50),
    links: [],
    width: 1400,
    height: 800,
  },
};

export const WithDependencies: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Phase 1',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-10'),
        duration: 10,
        progress: 100,
      },
      {
        id: 2,
        name: 'Phase 2',
        start: new Date('2024-01-11'),
        end: new Date('2024-01-20'),
        duration: 10,
        progress: 50,
      },
      {
        id: 3,
        name: 'Phase 3',
        start: new Date('2024-01-21'),
        end: new Date('2024-01-30'),
        duration: 10,
        progress: 0,
      },
    ],
    links: [
      { id: '1', source: 1, target: 2, type: 'finish-to-start' },
      { id: '2', source: 2, target: 3, type: 'finish-to-start' },
    ],
    width: 1200,
    height: 600,
  },
};
