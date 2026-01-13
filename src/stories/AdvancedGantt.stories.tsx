import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt Chart/Basic Examples',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Gantt>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample tasks similar to SVAR demo
const projectTasks: Task[] = [
  {
    id: '1',
    text: 'Project Planning',
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 15),
    duration: 14,
    progress: 100,
    type: 'project',
    open: true,
    color: '#52C785',
  },
  {
    id: '1.1',
    text: 'Market Research',
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 8),
    duration: 7,
    progress: 100,
    parent: '1',
    color: '#4A90E2',
  },
  {
    id: '1.2',
    text: 'Requirements Analysis',
    start: new Date(2024, 0, 8),
    end: new Date(2024, 0, 15),
    duration: 7,
    progress: 100,
    parent: '1',
    color: '#4A90E2',
  },
  {
    id: '2',
    text: 'Design Phase',
    start: new Date(2024, 0, 15),
    end: new Date(2024, 1, 5),
    duration: 21,
    progress: 85,
    type: 'project',
    open: true,
    color: '#52C785',
  },
  {
    id: '2.1',
    text: 'UI/UX Design',
    start: new Date(2024, 0, 15),
    end: new Date(2024, 0, 25),
    duration: 10,
    progress: 100,
    parent: '2',
    color: '#9B59B6',
  },
  {
    id: '2.2',
    text: 'System Architecture',
    start: new Date(2024, 0, 25),
    end: new Date(2024, 1, 5),
    duration: 11,
    progress: 70,
    parent: '2',
    color: '#9B59B6',
  },
  {
    id: '3',
    text: 'Development',
    start: new Date(2024, 1, 5),
    end: new Date(2024, 2, 15),
    duration: 39,
    progress: 60,
    type: 'project',
    open: true,
    color: '#52C785',
  },
  {
    id: '3.1',
    text: 'Frontend Development',
    start: new Date(2024, 1, 5),
    end: new Date(2024, 1, 25),
    duration: 20,
    progress: 80,
    parent: '3',
    color: '#E74C3C',
  },
  {
    id: '3.2',
    text: 'Backend Development',
    start: new Date(2024, 1, 12),
    end: new Date(2024, 2, 5),
    duration: 22,
    progress: 65,
    parent: '3',
    color: '#E74C3C',
  },
  {
    id: '3.3',
    text: 'Database Setup',
    start: new Date(2024, 1, 15),
    end: new Date(2024, 1, 22),
    duration: 7,
    progress: 90,
    parent: '3',
    color: '#E74C3C',
  },
  {
    id: '3.4',
    text: 'API Integration',
    start: new Date(2024, 1, 25),
    end: new Date(2024, 2, 10),
    duration: 14,
    progress: 40,
    parent: '3',
    color: '#E74C3C',
  },
  {
    id: '4',
    text: 'Testing',
    start: new Date(2024, 2, 10),
    end: new Date(2024, 2, 25),
    duration: 15,
    progress: 30,
    type: 'project',
    open: true,
    color: '#52C785',
  },
  {
    id: '4.1',
    text: 'Unit Testing',
    start: new Date(2024, 2, 10),
    end: new Date(2024, 2, 17),
    duration: 7,
    progress: 50,
    parent: '4',
    color: '#F39C12',
  },
  {
    id: '4.2',
    text: 'Integration Testing',
    start: new Date(2024, 2, 17),
    end: new Date(2024, 2, 25),
    duration: 8,
    progress: 20,
    parent: '4',
    color: '#F39C12',
  },
  {
    id: '5',
    text: 'Project Kickoff',
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 1),
    duration: 0,
    progress: 100,
    type: 'milestone',
    color: '#2196F3',
  },
  {
    id: '6',
    text: 'Design Review',
    start: new Date(2024, 1, 5),
    end: new Date(2024, 1, 5),
    duration: 0,
    progress: 100,
    type: 'milestone',
    color: '#2196F3',
  },
  {
    id: '7',
    text: 'Development Complete',
    start: new Date(2024, 2, 15),
    end: new Date(2024, 2, 15),
    duration: 0,
    progress: 0,
    type: 'milestone',
    color: '#2196F3',
  },
];

const projectLinks: Link[] = [
  { id: 'l1', source: '1.1', target: '1.2', type: 'e2s' },
  { id: 'l2', source: '1.2', target: '2.1', type: 'e2s' },
  { id: 'l3', source: '2.1', target: '2.2', type: 'e2s' },
  { id: 'l4', source: '2.2', target: '3.1', type: 'e2s' },
  { id: 'l5', source: '2.2', target: '3.2', type: 'e2s' },
  { id: 'l6', source: '3.2', target: '3.3', type: 's2s' },
  { id: 'l7', source: '3.3', target: '3.4', type: 'e2s' },
  { id: 'l8', source: '3.4', target: '4.1', type: 'e2s' },
  { id: 'l9', source: '4.1', target: '4.2', type: 'e2s' },
];

// Default story with all features
export const Default: Story = {
  args: {
    tasks: projectTasks,
    links: projectLinks,
    config: {
      weekends: true,
      theme: 'light',
      readonly: false,
      editable: true,
    },
    onTaskUpdate: (task) => {
      console.log('Task updated:', task);
    },
    onTaskCreate: (task) => {
      console.log('Task created:', task);
    },
    onTaskDelete: (taskId) => {
      console.log('Task deleted:', taskId);
    },
    onLinkCreate: (link) => {
      console.log('Link created:', link);
    },
    onLinkDelete: (linkId) => {
      console.log('Link deleted:', linkId);
    },
  },
};

// Dark theme story
export const DarkTheme: Story = {
  args: {
    ...Default.args,
    config: {
      ...Default.args?.config,
      theme: 'dark',
    },
  },
};

// Read-only mode
export const ReadOnlyMode: Story = {
  args: {
    ...Default.args,
    config: {
      ...Default.args?.config,
      readonly: true,
    },
  },
};

// Simple project
const simpleTasks: Task[] = [
  {
    id: 's1',
    text: 'Planning',
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 7),
    duration: 6,
    progress: 100,
    color: '#4CAF50',
  },
  {
    id: 's2',
    text: 'Design',
    start: new Date(2024, 2, 7),
    end: new Date(2024, 2, 14),
    duration: 7,
    progress: 75,
    color: '#2196F3',
  },
  {
    id: 's3',
    text: 'Development',
    start: new Date(2024, 2, 14),
    end: new Date(2024, 2, 28),
    duration: 14,
    progress: 40,
    color: '#FF9800',
  },
  {
    id: 's4',
    text: 'Testing',
    start: new Date(2024, 2, 28),
    end: new Date(2024, 3, 5),
    duration: 8,
    progress: 10,
    color: '#F44336',
  },
];

export const SimpleProject: Story = {
  args: {
    tasks: simpleTasks,
    links: [],
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

// With holidays
const holidays = [
  new Date(2024, 2, 17), // St. Patrick's Day
  new Date(2024, 2, 29), // Good Friday
];

export const WithHolidays: Story = {
  args: {
    tasks: simpleTasks,
    links: [],
    config: {
      weekends: true,
      holidays: holidays,
      theme: 'light',
    },
  },
};

// Hour scale for short-term planning
const hourTasks: Task[] = [
  {
    id: 'h1',
    text: 'Morning Meeting',
    start: new Date(2024, 2, 20, 9, 0),
    end: new Date(2024, 2, 20, 10, 0),
    duration: 1,
    progress: 100,
    color: '#2196F3',
  },
  {
    id: 'h2',
    text: 'Development Sprint',
    start: new Date(2024, 2, 20, 10, 0),
    end: new Date(2024, 2, 20, 16, 0),
    duration: 6,
    progress: 50,
    color: '#4CAF50',
  },
  {
    id: 'h3',
    text: 'Code Review',
    start: new Date(2024, 2, 20, 16, 0),
    end: new Date(2024, 2, 20, 17, 30),
    duration: 1.5,
    progress: 0,
    color: '#FF9800',
  },
];

export const HourlyView: Story = {
  args: {
    tasks: hourTasks,
    links: [],
    config: {
      scales: [
        { unit: 'day', step: 1, format: 'MMMM D, YYYY' },
        { unit: 'hour', step: 1, format: 'H:00' },
      ],
      columnWidth: 80,
      weekends: false,
      theme: 'light',
    },
  },
};
