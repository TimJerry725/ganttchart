import { Gantt } from '../components/Gantt/Gantt';
import type { Task, Link } from '../components/types';

export default {
    title: 'Gantt/Status Colors',
    component: Gantt,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

// Sample tasks demonstrating status-based color coding
export const statusTasks: Task[] = [
    {
        id: '1',
        text: 'Completed Task',
        start: new Date(2026, 3, 2),
        end: new Date(2026, 3, 8),
        duration: 6,
        progress: 100,
        status: 'completed', // Blue
    },
    {
        id: '2',
        text: 'In Progress Task',
        start: new Date(2026, 3, 9),
        end: new Date(2026, 3, 16),
        duration: 7,
        progress: 60,
        status: 'in-progress', // Green
    },
    {
        id: '3',
        text: 'Delayed Task',
        start: new Date(2026, 3, 17),
        end: new Date(2026, 3, 23),
        duration: 6,
        progress: 30,
        status: 'delayed', // Red
    },
    {
        id: '4',
        text: 'Not Started Task',
        start: new Date(2026, 3, 24),
        end: new Date(2026, 3, 30),
        duration: 6,
        progress: 0,
        status: 'not-started', // Gray
    },
    {
        id: '5',
        text: 'Project Phase',
        start: new Date(2026, 4, 1),
        end: new Date(2026, 4, 15),
        duration: 14,
        progress: 75,
        type: 'project',
        status: 'in-progress', // Green project bar
        open: true,
    },
    {
        id: '5.1',
        parent: '5',
        text: 'Completed Subtask',
        start: new Date(2026, 4, 1),
        end: new Date(2026, 4, 5),
        duration: 4,
        progress: 100,
        status: 'completed', // Blue
    },
    {
        id: '5.2',
        parent: '5',
        text: 'Delayed Subtask',
        start: new Date(2026, 4, 6),
        end: new Date(2026, 4, 10),
        duration: 4,
        progress: 40,
        status: 'delayed', // Red
    },
    {
        id: '5.3',
        parent: '5',
        text: 'In Progress Subtask',
        start: new Date(2026, 4, 11),
        end: new Date(2026, 4, 15),
        duration: 4,
        progress: 50,
        status: 'in-progress', // Green
    },
    {
        id: '6',
        text: 'Milestone',
        start: new Date(2026, 4, 15),
        end: new Date(2026, 4, 15),
        duration: 0,
        progress: 0,
        type: 'milestone',
    },
];

export const statusLinks: Link[] = [
    { id: 'l1', source: '1', target: '2', type: 'e2s' },
    { id: 'l2', source: '2', target: '3', type: 'e2s' },
    { id: 'l3', source: '3', target: '4', type: 'e2s' },
    { id: 'l4', source: '4', target: '5', type: 'e2s' },
    { id: 'l5', source: '5.1', target: '5.2', type: 'e2s' },
    { id: 'l6', source: '5.2', target: '5.3', type: 'e2s' },
    { id: 'l7', source: '5.3', target: '6', type: 'e2s' },
];

export const StatusBasedColors = {
    args: {
        tasks: statusTasks,
        links: statusLinks,
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};

export const StatusBasedColorsDark = {
    args: {
        tasks: statusTasks,
        links: statusLinks,
        config: {
            weekends: true,
            theme: 'dark',
        },
    },
};
