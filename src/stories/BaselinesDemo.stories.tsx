import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link, Baseline } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'SVAR PRO/Baselines Demo',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Gantt>;

export default meta;
type Story = StoryObj<typeof meta>;

// Tasks with some that are delayed, on-track, and ahead
const projectTasks: Task[] = [
  {
    id: '1',
    text: 'On-Track Task',
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 10),
    duration: 9,
    progress: 50,
    color: '#4A90E2',
    priority: 'high',
  },
  {
    id: '2',
    text: 'Delayed Task',
    start: new Date(2024, 2, 5),
    end: new Date(2024, 2, 20),
    duration: 15,
    progress: 30,
    color: '#E74C3C',
    priority: 'high',
  },
  {
    id: '3',
    text: 'Ahead of Schedule',
    start: new Date(2024, 2, 8),
    end: new Date(2024, 2, 15),
    duration: 7,
    progress: 80,
    color: '#27AE60',
    priority: 'medium',
  },
  {
    id: '4',
    text: 'Extended Duration',
    start: new Date(2024, 2, 15),
    end: new Date(2024, 2, 30),
    duration: 15,
    progress: 20,
    color: '#F39C12',
    priority: 'medium',
  },
];

// Baselines showing the original plan
const baselines = new Map<string, Baseline>([
  ['1', {
    taskId: '1',
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 10),
  }],
  ['2', {
    taskId: '2',
    start: new Date(2024, 2, 5),
    end: new Date(2024, 2, 15), // Was planned to finish earlier
  }],
  ['3', {
    taskId: '3',
    start: new Date(2024, 2, 10), // Was planned to start later
    end: new Date(2024, 2, 18), // Was planned to take longer
  }],
  ['4', {
    taskId: '4',
    start: new Date(2024, 2, 15),
    end: new Date(2024, 2, 25), // Was planned to be shorter
  }],
]);

export const WithBaselines: Story = {
  args: {
    tasks: projectTasks,
    links: [],
    baselines: baselines,
    config: {
      weekends: true,
      theme: 'light',
      baselines: true,
    },
  },
};

export const WithBaselinesAndDependencies: Story = {
  args: {
    tasks: [
      {
        id: 'p1',
        text: 'Design Phase',
        start: new Date(2024, 2, 1),
        end: new Date(2024, 2, 15),
        duration: 14,
        progress: 100,
        type: 'project',
        open: true,
        color: '#52C785',
      },
      {
        id: 't1',
        text: 'UI Design',
        start: new Date(2024, 2, 1),
        end: new Date(2024, 2, 8),
        duration: 7,
        progress: 100,
        parent: 'p1',
        color: '#9B59B6',
      },
      {
        id: 't2',
        text: 'Prototype',
        start: new Date(2024, 2, 8),
        end: new Date(2024, 2, 15),
        duration: 7,
        progress: 100,
        parent: 'p1',
        color: '#9B59B6',
      },
      {
        id: 'p2',
        text: 'Development Phase',
        start: new Date(2024, 2, 15),
        end: new Date(2024, 3, 5),
        duration: 21,
        progress: 60,
        type: 'project',
        open: true,
        color: '#52C785',
      },
      {
        id: 't3',
        text: 'Backend API',
        start: new Date(2024, 2, 15),
        end: new Date(2024, 2, 28),
        duration: 13,
        progress: 75,
        parent: 'p2',
        color: '#E74C3C',
      },
      {
        id: 't4',
        text: 'Frontend',
        start: new Date(2024, 2, 20),
        end: new Date(2024, 3, 5),
        duration: 16,
        progress: 50,
        parent: 'p2',
        color: '#3498DB',
      },
    ],
    links: [
      { id: 'l1', source: 't1', target: 't2', type: 'e2s' },
      { id: 'l2', source: 't2', target: 't3', type: 'e2s' },
      { id: 'l3', source: 't3', target: 't4', type: 's2s' },
    ],
    baselines: new Map<string, Baseline>([
      ['t1', {
        taskId: 't1',
        start: new Date(2024, 2, 1),
        end: new Date(2024, 2, 8),
      }],
      ['t2', {
        taskId: 't2',
        start: new Date(2024, 2, 8),
        end: new Date(2024, 2, 15),
      }],
      ['t3', {
        taskId: 't3',
        start: new Date(2024, 2, 15),
        end: new Date(2024, 2, 25), // Was planned to finish earlier
      }],
      ['t4', {
        taskId: 't4',
        start: new Date(2024, 2, 20),
        end: new Date(2024, 3, 3), // Was planned to finish earlier
      }],
    ]),
    config: {
      weekends: true,
      theme: 'light',
      baselines: true,
    },
  },
};

export const DarkThemeWithBaselines: Story = {
  args: {
    ...WithBaselines.args,
    config: {
      ...WithBaselines.args?.config,
      theme: 'dark',
    },
  },
};

// Simple comparison demo
const simpleTask: Task[] = [
  {
    id: 's1',
    text: 'Task Running Behind Schedule',
    start: new Date(2024, 2, 10),
    end: new Date(2024, 2, 25),
    duration: 15,
    progress: 40,
    color: '#E74C3C',
    details: 'This task was planned to finish on March 20th but is now expected to finish on March 25th',
  },
];

const simpleBaseline = new Map<string, Baseline>([
  ['s1', {
    taskId: 's1',
    start: new Date(2024, 2, 5), // Was planned to start earlier
    end: new Date(2024, 2, 20),  // Was planned to finish earlier
  }],
]);

export const SimpleComparison: Story = {
  args: {
    tasks: simpleTask,
    links: [],
    baselines: simpleBaseline,
    config: {
      weekends: true,
      theme: 'light',
      baselines: true,
    },
  },
};
