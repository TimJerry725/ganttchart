/**
 * Feature showcase stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { IrisGantt } from '../src/IrisGantt';
import type { Task, Link } from '../src/types';

const meta: Meta<typeof IrisGantt> = {
  title: 'Iris Gantt/Features',
  component: IrisGantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IrisGantt>;

export const WithHierarchy: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Project Phase 1',
        type: 'project',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
        duration: 31,
        expanded: true,
      },
      {
        id: 2,
        name: 'Task 1.1',
        parent: 1,
        start: new Date('2024-01-01'),
        end: new Date('2024-01-10'),
        duration: 10,
        progress: 100,
      },
      {
        id: 3,
        name: 'Task 1.2',
        parent: 1,
        start: new Date('2024-01-11'),
        end: new Date('2024-01-20'),
        duration: 10,
        progress: 50,
      },
    ],
    links: [
      { id: '1', source: 2, target: 3, type: 'finish-to-start' },
    ],
    width: 1200,
    height: 600,
  },
};

export const WithMilestones: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Development',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-15'),
        duration: 15,
        progress: 60,
      },
      {
        id: 2,
        name: 'Alpha Release',
        type: 'milestone',
        start: new Date('2024-01-15'),
        end: new Date('2024-01-15'),
        duration: 0,
      },
      {
        id: 3,
        name: 'Beta Development',
        start: new Date('2024-01-16'),
        end: new Date('2024-01-30'),
        duration: 15,
        progress: 30,
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

export const WithProgress: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Task 25%',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-10'),
        duration: 10,
        progress: 25,
      },
      {
        id: 2,
        name: 'Task 50%',
        start: new Date('2024-01-11'),
        end: new Date('2024-01-20'),
        duration: 10,
        progress: 50,
      },
      {
        id: 3,
        name: 'Task 75%',
        start: new Date('2024-01-21'),
        end: new Date('2024-01-30'),
        duration: 10,
        progress: 75,
      },
      {
        id: 4,
        name: 'Task 100%',
        start: new Date('2024-01-31'),
        end: new Date('2024-02-09'),
        duration: 10,
        progress: 100,
      },
    ],
    links: [
      { id: '1', source: 1, target: 2, type: 'finish-to-start' },
      { id: '2', source: 2, target: 3, type: 'finish-to-start' },
      { id: '3', source: 3, target: 4, type: 'finish-to-start' },
    ],
    width: 1200,
    height: 600,
  },
};

export const LargeDataset: Story = {
  args: {
    tasks: Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Task ${i + 1}`,
      start: new Date(2024, 0, 1 + i * 2),
      end: new Date(2024, 0, 1 + i * 2 + 5),
      duration: 5,
      progress: Math.min(100, (i + 1) * 2),
    })),
    links: Array.from({ length: 99 }, (_, i) => ({
      id: `link-${i}`,
      source: i + 1,
      target: i + 2,
      type: 'finish-to-start' as const,
    })),
    width: 1400,
    height: 800,
  },
};
