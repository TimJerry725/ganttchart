/**
 * API-style OnHold & Baselines Test Stories
 *
 * These stories use data shaped exactly like a real backend API response:
 *   - ISO-8601 date strings (not Date objects)
 *   - snake_case field names
 *   - UUID-style task IDs
 *   - project-level onHoldPeriods passed as a Gantt prop
 *
 * Purpose: verify that OnHold periods and Baselines render correctly
 * when consuming data straight from an API.
 */
import { Gantt } from '../components/Gantt/Gantt';

export default {
    title: 'Gantt/API OnHold & Baselines Test',
    component: Gantt,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

// ─── Realistic API mock data ────────────────────────────────────────
// All dates are ISO strings, all field names use snake_case aliases
const apiTasks = [
    {
        id: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e01',
        text: 'Site Survey',
        type: 'project' as const,
        start_date: '2026-02-20T00:00:00.000Z',
        end_date: '2026-03-10T00:00:00.000Z',
        duration: 18,
        progress: 40,
        current_status: 'in-progress',
        planned_start: '2026-02-20T00:00:00.000Z',
        planned_end: '2026-03-08T00:00:00.000Z',
        open: true,
        sequence_id: 1,
        stage_id: null,
    },
    {
        id: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e02',
        parent: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e01',
        text: 'C1-Concrete Pouring Approval Checklist-23FEB',
        start_date: '2026-02-23T00:00:00.000Z',
        end_date: '2026-03-05T00:00:00.000Z',
        duration: 10,
        progress: 60,
        current_status: 'in-progress',
        planned_start: '2026-02-23T00:00:00.000Z',
        planned_end: '2026-03-03T00:00:00.000Z',
        sequence_id: 2,
        stage_id: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e01',
    },
    {
        id: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e03',
        parent: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e01',
        text: 'Electrical Wiring Phase 1',
        start_date: '2026-02-25T00:00:00.000Z',
        end_date: '2026-03-08T00:00:00.000Z',
        duration: 11,
        progress: 20,
        current_status: 'in-progress',
        planned_start: '2026-02-25T00:00:00.000Z',
        planned_end: '2026-03-06T00:00:00.000Z',
        sequence_id: 3,
        stage_id: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e01',
    },
    {
        id: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e04',
        text: 'Pre Completion',
        start_date: '2026-03-05T00:00:00.000Z',
        end_date: '2026-03-18T00:00:00.000Z',
        duration: 13,
        progress: 0,
        current_status: 'not-started',
        planned_start: '2026-03-05T00:00:00.000Z',
        planned_end: '2026-03-18T00:00:00.000Z',
        sequence_id: 4,
        stage_id: null,
    },
    {
        id: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e05',
        text: 'ZEON',
        start_date: '2026-02-20T00:00:00.000Z',
        end_date: '2026-03-02T00:00:00.000Z',
        duration: 10,
        progress: 100,
        current_status: 'completed',
        planned_start: '2026-02-20T00:00:00.000Z',
        planned_end: '2026-03-02T00:00:00.000Z',
        sequence_id: 5,
        stage_id: null,
    },
    {
        id: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e06',
        text: 'Commission Window Installation',
        start_date: '2026-03-01T00:00:00.000Z',
        end_date: '2026-03-15T00:00:00.000Z',
        duration: 14,
        progress: 10,
        current_status: 'in-progress',
        planned_start: '2026-03-01T00:00:00.000Z',
        planned_end: '2026-03-15T00:00:00.000Z',
        sequence_id: 6,
        stage_id: null,
    },
    {
        id: 'f1a71dge-c0b1-4f18-b4ba-8504a1f48e07',
        text: 'Final Network Setup',
        start_date: '2026-03-08T00:00:00.000Z',
        end_date: '2026-03-25T00:00:00.000Z',
        duration: 17,
        progress: 0,
        current_status: 'not-started',
        planned_start: '2026-03-08T00:00:00.000Z',
        planned_end: '2026-03-25T00:00:00.000Z',
        sequence_id: 7,
        stage_id: null,
    },
];

// ─── Project-level on-hold periods (ISO strings) ────────────────────
const projectOnHoldPeriods = [
    {
        start: '2026-02-27T00:00:00.000Z',
        end: '2026-03-03T00:00:00.000Z',
    },
];

// ═══════════════════════════════════════════════════════════
// Story 1: Project-level OnHold with API data (ISO strings)
// Verifies that the `onHoldPeriods` prop works correctly
// when all dates are ISO strings from an API.
// ═══════════════════════════════════════════════════════════
export const ProjectOnHoldAPIData = {
    name: 'Project OnHold — API Data (ISO strings)',
    args: {
        tasks: apiTasks,
        links: [],
        onHoldPeriods: projectOnHoldPeriods,
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};

// ═══════════════════════════════════════════════════════════
// Story 2: Same but with Date objects — for comparison
// ═══════════════════════════════════════════════════════════
export const ProjectOnHoldDateObjects = {
    name: 'Project OnHold — Date Objects',
    args: {
        tasks: apiTasks.map(t => ({
            ...t,
            start_date: new Date(t.start_date),
            end_date: new Date(t.end_date),
            planned_start: new Date(t.planned_start),
            planned_end: new Date(t.planned_end),
        })),
        links: [],
        onHoldPeriods: [
            {
                start: new Date('2026-02-27T00:00:00.000Z'),
                end: new Date('2026-03-03T00:00:00.000Z'),
            },
        ],
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};

// ═══════════════════════════════════════════════════════════
// Story 3: Per-task on_hold_periods from API (snake_case)
// ═══════════════════════════════════════════════════════════
export const PerTaskOnHoldAPIData = {
    name: 'Per-Task on_hold_periods — API Data (snake_case)',
    args: {
        tasks: [
            {
                id: 'task-001',
                text: 'Site Survey',
                start_date: '2026-02-20T00:00:00.000Z',
                end_date: '2026-03-10T00:00:00.000Z',
                duration: 18,
                progress: 40,
                current_status: 'in-progress',
                planned_start: '2026-02-20T00:00:00.000Z',
                planned_end: '2026-03-08T00:00:00.000Z',
                on_hold_periods: [
                    {
                        start: '2026-02-25T00:00:00.000Z',
                        end: '2026-02-28T00:00:00.000Z',
                    },
                ],
            },
            {
                id: 'task-002',
                text: 'Concrete Pouring',
                start_date: '2026-02-23T00:00:00.000Z',
                end_date: '2026-03-05T00:00:00.000Z',
                duration: 10,
                progress: 60,
                current_status: 'in-progress',
                planned_start: '2026-02-23T00:00:00.000Z',
                planned_end: '2026-03-03T00:00:00.000Z',
                on_hold_periods: [
                    {
                        start: '2026-02-26T00:00:00.000Z',
                        end: '2026-03-01T00:00:00.000Z',
                    },
                ],
            },
            {
                id: 'task-003',
                text: 'Electrical Wiring',
                start_date: '2026-02-25T00:00:00.000Z',
                end_date: '2026-03-08T00:00:00.000Z',
                duration: 11,
                progress: 20,
                current_status: 'in-progress',
                planned_start: '2026-02-25T00:00:00.000Z',
                planned_end: '2026-03-06T00:00:00.000Z',
                // No on_hold_periods — should render normally
            },
            {
                id: 'task-004',
                text: 'Final Inspection',
                start_date: '2026-03-10T00:00:00.000Z',
                end_date: '2026-03-20T00:00:00.000Z',
                duration: 10,
                progress: 0,
                current_status: 'not-started',
                planned_start: '2026-03-10T00:00:00.000Z',
                planned_end: '2026-03-20T00:00:00.000Z',
            },
        ],
        links: [],
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};

// ═══════════════════════════════════════════════════════════
// Story 4: Baselines auto-generated (no external baselines prop)
// Verifies baselines show up automatically from tasks
// ═══════════════════════════════════════════════════════════
export const BaselinesAutoGenerated = {
    name: 'Baselines — Auto-Generated from API Tasks',
    args: {
        tasks: apiTasks,
        links: [],
        config: {
            weekends: true,
            theme: 'light',
            // baselines is NOT passed — should default to true
        },
    },
};

// ═══════════════════════════════════════════════════════════
// Story 5: Baselines + OnHold together
// The ultimate test — both features simultaneously
// ═══════════════════════════════════════════════════════════
export const BaselinesAndOnHoldCombined = {
    name: 'Baselines + OnHold — Combined',
    args: {
        tasks: apiTasks,
        links: [],
        onHoldPeriods: projectOnHoldPeriods,
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};

// ═══════════════════════════════════════════════════════════
// Story 6: Dark theme — Baselines + OnHold
// ═══════════════════════════════════════════════════════════
export const BaselinesAndOnHoldDark = {
    name: 'Baselines + OnHold — Dark Theme',
    args: {
        tasks: apiTasks,
        links: [],
        onHoldPeriods: projectOnHoldPeriods,
        config: {
            weekends: true,
            theme: 'dark',
        },
    },
};

// ═══════════════════════════════════════════════════════════
// Story 7: Snake_case `on_hold_periods` prop at component level
// Tests the snake_case alias for API compatibility
// ═══════════════════════════════════════════════════════════
export const SnakeCaseOnHoldProp = {
    name: 'on_hold_periods (snake_case prop)',
    args: {
        tasks: apiTasks,
        links: [],
        on_hold_periods: projectOnHoldPeriods,
        config: {
            weekends: true,
            theme: 'light',
        },
    },
};
