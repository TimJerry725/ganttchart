import type { Meta, StoryObj } from '@storybook/react-vite';
import { GanttChart } from './GanttChart';
import type { Task } from './GanttChart';

const meta = {
  title: 'Example/GanttChart',
  component: GanttChart,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GanttChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data matching the image
const sampleTasks: Task[] = [
  {
    id: 'project-planning',
    name: 'Project planning',
    startDate: new Date(2024, 2, 4),
    duration: 7,
    progress: 100,
    isParent: true,
    color: '#52C785',
    children: [
      {
        id: 'marketing-analysis',
        name: 'Marketing analysis',
        startDate: new Date(2024, 2, 4),
        duration: 2,
        progress: 100,
        color: '#4A90E2',
      },
      {
        id: 'discussion',
        name: 'Discussion',
        startDate: new Date(2024, 2, 6),
        duration: 3,
        progress: 100,
        color: '#4A90E2',
      },
    ],
  },
  {
    id: 'new-task',
    name: 'New Task',
    startDate: new Date(2024, 2, 9),
    duration: 1,
    progress: 0,
    color: '#4A90E2',
  },
  {
    id: 'initial-design',
    name: 'Initial design',
    startDate: new Date(2024, 2, 7),
    duration: 5,
    progress: 80,
    color: '#4A90E2',
  },
  {
    id: 'presentation',
    name: 'Presentation',
    startDate: new Date(2024, 2, 11),
    duration: 1,
    progress: 0,
    color: '#9B59B6',
  },
  {
    id: 'prototyping',
    name: 'Prototyping',
    startDate: new Date(2024, 2, 9),
    duration: 6,
    progress: 60,
    color: '#4A90E2',
  },
  {
    id: 'user-testing',
    name: 'User testing',
    startDate: new Date(2024, 2, 11),
    duration: 5,
    progress: 40,
    color: '#4A90E2',
  },
  {
    id: 'project-management',
    name: 'Project management',
    startDate: new Date(2024, 2, 4),
    duration: 12,
    progress: 100,
    isParent: true,
    color: '#52C785',
    children: [
      {
        id: 'resource-planning',
        name: 'Resource planning',
        startDate: new Date(2024, 2, 4),
        duration: 3,
        progress: 100,
        color: '#4A90E2',
      },
      {
        id: 'getting-approval',
        name: 'Getting approval',
        startDate: new Date(2024, 2, 7),
        duration: 2,
        progress: 100,
        color: '#87CEEB',
      },
      {
        id: 'team-introduction',
        name: 'Team introduction',
        startDate: new Date(2024, 2, 9),
        duration: 3,
        progress: 100,
        color: '#4A90E2',
      },
    ],
  },
  {
    id: 'resource-management',
    name: 'Resource management',
    startDate: new Date(2024, 2, 12),
    duration: 4,
    progress: 50,
    color: '#4A90E2',
  },
  {
    id: 'development',
    name: 'Development',
    startDate: new Date(2024, 2, 13),
    duration: 3,
    progress: 30,
    isParent: true,
    color: '#52C785',
    children: [
      {
        id: 'stage-1',
        name: 'Stage 1',
        startDate: new Date(2024, 2, 13),
        duration: 3,
        progress: 30,
        color: '#4A90E2',
      },
    ],
  },
];

export const Default: Story = {
  args: {
    tasks: sampleTasks,
    onTaskUpdate: (task) => {
      console.log('Task updated:', task);
    },
    onTaskDelete: (taskId) => {
      console.log('Task deleted:', taskId);
    },
  },
};

export const SimpleProject: Story = {
  args: {
    tasks: [
      {
        id: '1',
        name: 'Planning Phase',
        startDate: new Date(2024, 2, 4),
        duration: 3,
        progress: 100,
        isParent: true,
        color: '#52C785',
        children: [
          {
            id: '1-1',
            name: 'Requirements Gathering',
            startDate: new Date(2024, 2, 4),
            duration: 2,
            progress: 100,
            color: '#4A90E2',
          },
        ],
      },
      {
        id: '2',
        name: 'Design Phase',
        startDate: new Date(2024, 2, 7),
        duration: 4,
        progress: 75,
        color: '#4A90E2',
      },
      {
        id: '3',
        name: 'Development Phase',
        startDate: new Date(2024, 2, 11),
        duration: 6,
        progress: 25,
        color: '#FF6B6B',
      },
    ],
    onTaskUpdate: (task) => {
      console.log('Task updated:', task);
    },
    onTaskDelete: (taskId) => {
      console.log('Task deleted:', taskId);
    },
  },
};
