import type { Meta, StoryObj } from '@storybook/react';
import { Gantt } from '../components/Gantt/Gantt';
import type { Task, Link } from '../components/Gantt/types';

const meta: Meta<typeof Gantt> = {
  title: 'Gantt/Task Dependencies',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Gantt>;

const tasks: Task[] = [
  {
    id: '1',
    text: 'Project Planning',
    start: new Date(2024, 5, 3),
    end: new Date(2024, 5, 7),
    duration: 4,
    progress: 100,
  },
  {
    id: '2',
    text: 'Requirements Analysis',
    start: new Date(2024, 5, 8),
    end: new Date(2024, 5, 14),
    duration: 6,
    progress: 50,
  },
];

const links: Link[] = [
  {
    id: 'link-1',
    source: '1',
    target: '2',
    type: 'e2s' as const,
  },
];

export const FinishToStart: Story = {
  args: {
    tasks: tasks,
    links: links,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

export const AutoScheduling: Story = {
  args: {
    tasks: tasks,
    links: links,
    config: {
      weekends: true,
      theme: 'light',
      autoSchedule: true,
    },
  },
};
