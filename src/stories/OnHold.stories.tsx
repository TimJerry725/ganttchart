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

// ────────────────────────────────────────────────
// Per-task on-hold periods (explicit segments + hold)
// ────────────────────────────────────────────────
const perTaskOnHoldTasks: Task[] = [
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

// Default story — project-level on-hold (the primary feature)
export const Default = {
    args: {
        tasks: [
            {
                id: '1',
                text: 'Design Phase',
                start: new Date(2026, 0, 1),
                end: new Date(2026, 0, 12),
                duration: 12,
                progress: 80,
                status: 'in-progress' as const,
            },
            {
                id: '2',
                text: 'Development',
                type: 'project' as const,
                start: new Date(2026, 0, 5),
                end: new Date(2026, 0, 25),
                duration: 20,
                progress: 30,
                status: 'in-progress' as const,
                open: true,
            },
            {
                id: '2.1',
                parent: '2',
                text: 'Frontend Work',
                start: new Date(2026, 0, 5),
                end: new Date(2026, 0, 18),
                duration: 13,
                progress: 40,
                status: 'in-progress' as const,
            },
            {
                id: '2.2',
                parent: '2',
                text: 'Backend Work',
                start: new Date(2026, 0, 8),
                end: new Date(2026, 0, 22),
                duration: 14,
                progress: 20,
                status: 'in-progress' as const,
            },
            {
                id: '3',
                text: 'QA Testing (After Hold)',
                start: new Date(2026, 0, 20),
                end: new Date(2026, 0, 28),
                duration: 8,
                progress: 0,
                status: 'not-started' as const,
            },
            {
                id: '4',
                text: 'Completed Before Hold',
                start: new Date(2026, 0, 1),
                end: new Date(2026, 0, 8),
                duration: 7,
                progress: 100,
                status: 'completed' as const,
            },
        ],
        links: [],
        onHoldPeriods: [
            { start: new Date(2026, 0, 10), end: new Date(2026, 0, 16) },
        ],
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};

export const PerTaskOnHold = {
    args: {
        tasks: perTaskOnHoldTasks,
        links: [],
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};

// ────────────────────────────────────────────────
// Project-level on-hold periods
// The Gantt component automatically splits ALL
// overlapping tasks around the hold period.
// ────────────────────────────────────────────────
const projectTasks = [
    {
        id: '1',
        text: 'Design Phase',
        start: new Date(2026, 0, 1),
        end: new Date(2026, 0, 12),
        duration: 12,
        progress: 80,
        status: 'in-progress' as const,
    },
    {
        id: '2',
        text: 'Development',
        type: 'project' as const,
        start: new Date(2026, 0, 5),
        end: new Date(2026, 0, 25),
        duration: 20,
        progress: 30,
        status: 'in-progress' as const,
        open: true,
    },
    {
        id: '2.1',
        parent: '2',
        text: 'Frontend Work',
        start: new Date(2026, 0, 5),
        end: new Date(2026, 0, 18),
        duration: 13,
        progress: 40,
        status: 'in-progress' as const,
    },
    {
        id: '2.2',
        parent: '2',
        text: 'Backend Work',
        start: new Date(2026, 0, 8),
        end: new Date(2026, 0, 22),
        duration: 14,
        progress: 20,
        status: 'in-progress' as const,
    },
    {
        id: '3',
        text: 'QA Testing',
        start: new Date(2026, 0, 20),
        end: new Date(2026, 0, 28),
        duration: 8,
        progress: 0,
        status: 'not-started' as const,
    },
    {
        id: '4',
        text: 'Completed Before Hold',
        start: new Date(2026, 0, 1),
        end: new Date(2026, 0, 8),
        duration: 7,
        progress: 100,
        status: 'completed' as const,
    },
];

// Project is on hold from Jan 10 to Jan 16
const projectHoldPeriods = [
    { start: new Date(2026, 0, 10), end: new Date(2026, 0, 16) },
];

export const ProjectLevelOnHold = {
    args: {
        tasks: projectTasks,
        links: [],
        onHoldPeriods: projectHoldPeriods,
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};

export const ProjectLevelOnHoldDark = {
    args: {
        tasks: projectTasks,
        links: [],
        onHoldPeriods: projectHoldPeriods,
        config: {
            weekends: true,
            theme: 'dark',
        },
    },
};
