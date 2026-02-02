import { Gantt } from '../components/Gantt/Gantt';
import type { Task } from '../components/types';

export default {
    title: 'Gantt/Milestone Baselines',
    component: Gantt,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

const tasks: Task[] = [
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
        text: 'Regular Task',
        start: new Date(2026, 3, 2),
        end: new Date(2026, 3, 10),
        duration: 8,
        progress: 75,
        type: 'task',
    },
    {
        id: '3',
        text: 'Design Complete',
        start: new Date(2026, 3, 15),
        end: new Date(2026, 3, 15),
        duration: 0,
        progress: 100,
        type: 'milestone',
    },
    {
        id: '4',
        text: 'Development Task',
        start: new Date(2026, 3, 16),
        end: new Date(2026, 4, 1),
        duration: 15,
        progress: 50,
        type: 'task',
    },
    {
        id: '5',
        text: 'Launch Date',
        start: new Date(2026, 4, 15),
        end: new Date(2026, 4, 15),
        duration: 0,
        progress: 0,
        type: 'milestone',
    },
];

/**
 * Milestones with Baselines
 * 
 * Shows milestones rendered as bars with purple baseline indicators.
 * - Milestone bars are rendered as regular bars (not diamonds)
 * - Baseline bars for milestones are purple (#9b59b6)
 * - Regular task baselines remain gray
 * 
 * Click "📍 Set Baseline" to create baseline snapshots.
 */
export const MilestonesWithBaselines = {
    args: {
        tasks: tasks,
        config: {
            weekends: true,
            theme: 'light',
            baselines: true,
            showTodayLine: true,
        },
    },
};

/**
 * Dark Theme - Milestones with Baselines
 */
export const DarkThemeMilestoneBaselines = {
    args: {
        tasks: tasks,
        config: {
            weekends: true,
            theme: 'dark',
            baselines: true,
            showTodayLine: true,
        },
    },
};
