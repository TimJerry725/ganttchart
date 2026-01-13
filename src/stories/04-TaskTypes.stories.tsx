import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Task types',
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
    text: 'Project Phase (Summary Task)',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 30),
    duration: 29,
    progress: 75,
    type: 'project',
    color: '#26A69A',
    open: true,
  },
  {
    id: '1.1',
    parent: '1',
    text: 'Regular Task',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 10),
    duration: 9,
    progress: 100,
    type: 'task',
    color: '#42A5F5',
  },
  {
    id: '1.2',
    parent: '1',
    text: 'Milestone - Project Kickoff',
    start: new Date(2026, 3, 10),
    end: new Date(2026, 3, 10),
    duration: 0,
    progress: 100,
    type: 'milestone',
  },
  {
    id: '1.3',
    parent: '1',
    text: 'Another Regular Task',
    start: new Date(2026, 3, 10),
    end: new Date(2026, 3, 20),
    duration: 10,
    progress: 80,
    type: 'task',
    color: '#42A5F5',
  },
  {
    id: '1.4',
    parent: '1',
    text: 'Milestone - Phase Complete',
    start: new Date(2026, 3, 20),
    end: new Date(2026, 3, 20),
    duration: 0,
    progress: 100,
    type: 'milestone',
  },
  {
    id: '1.5',
    parent: '1',
    text: 'Final Task',
    start: new Date(2026, 3, 20),
    end: new Date(2026, 3, 30),
    duration: 10,
    progress: 50,
    type: 'task',
    color: '#42A5F5',
  },
];

const links: Link[] = [
  { id: 'l1', source: '1.1', target: '1.2', type: 'e2s' },
  { id: 'l2', source: '1.2', target: '1.3', type: 'e2s' },
  { id: 'l3', source: '1.3', target: '1.4', type: 'e2s' },
  { id: 'l4', source: '1.4', target: '1.5', type: 'e2s' },
];

/**
 * Task Types Demo
 * 
 * Shows different task types:
 * - Project (summary task with green color)
 * - Task (regular task with blue color)
 * - Milestone (diamond shape, zero duration)
 */
export const Default: Story = {
  args: {
    tasks,
    links,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * Only Milestones
 */
export const MilestonesOnly: Story = {
  args: {
    tasks: [
      {
        id: '1',
        text: 'Project Start',
        start: new Date(2026, 3, 1),
        end: new Date(2026, 3, 1),
        duration: 0,
        progress: 100,
        type: 'milestone',
      },
      {
        id: '2',
        text: 'Design Complete',
        start: new Date(2026, 3, 15),
        end: new Date(2026, 3, 15),
        duration: 0,
        progress: 100,
        type: 'milestone',
      },
      {
        id: '3',
        text: 'Development Complete',
        start: new Date(2026, 4, 1),
        end: new Date(2026, 4, 1),
        duration: 0,
        progress: 50,
        type: 'milestone',
      },
      {
        id: '4',
        text: 'Launch Date',
        start: new Date(2026, 4, 15),
        end: new Date(2026, 4, 15),
        duration: 0,
        progress: 0,
        type: 'milestone',
      },
    ],
    links: [
      { id: 'l1', source: '1', target: '2', type: 'e2s' },
      { id: 'l2', source: '2', target: '3', type: 'e2s' },
      { id: 'l3', source: '3', target: '4', type: 'e2s' },
    ],
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};
