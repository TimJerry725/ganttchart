import { Gantt } from '../components/Gantt/Gantt';
import type { Task } from '../components/types';

export default {
    title: 'Gantt/On-Hold Periods',
    component: Gantt,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

const onHoldTasks: Task[] = [
    {
        id: '1',
        text: 'Task with On-Hold Period',
        start: new Date(2026, 0, 1),
        end: new Date(2026, 0, 15),
        duration: 15,
        progress: 50,
        status: 'in-progress',
        segments: [
            { start: new Date(2026, 0, 1), end: new Date(2026, 0, 5), duration: 5 },
            { start: new Date(2026, 0, 10), end: new Date(2026, 0, 15), duration: 5 },
        ],
        onHoldPeriods: [
            { start: new Date(2026, 0, 6), end: new Date(2026, 0, 9) }
        ]
    },
    {
        id: '2',
        text: 'Project with On-Hold Phase',
        type: 'project',
        start: new Date(2026, 0, 1),
        end: new Date(2026, 0, 25),
        duration: 25,
        progress: 30,
        status: 'in-progress',
        open: true,
        segments: [
            { start: new Date(2026, 0, 1), end: new Date(2026, 0, 10), duration: 10 },
            { start: new Date(2026, 0, 18), end: new Date(2026, 0, 25), duration: 7 },
        ],
        onHoldPeriods: [
            { start: new Date(2026, 0, 11), end: new Date(2026, 0, 17) }
        ]
    },
    {
        id: '2.1',
        parent: '2',
        text: 'Subtask 1',
        start: new Date(2026, 0, 1),
        end: new Date(2026, 0, 10),
        duration: 10,
        progress: 100,
        status: 'completed',
    },
    {
        id: '2.2',
        parent: '2',
        text: 'Subtask 2 (Starts after hold)',
        start: new Date(2026, 0, 18),
        end: new Date(2026, 0, 25),
        duration: 7,
        progress: 0,
        status: 'not-started',
    }
];

export const Default = {
    args: {
        tasks: onHoldTasks,
        links: [],
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};

export const DarkTheme = {
    args: {
        tasks: onHoldTasks,
        links: [],
        config: {
            weekends: true,
            theme: 'dark',
        },
    },
};
