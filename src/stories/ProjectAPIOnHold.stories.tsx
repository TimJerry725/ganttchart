/**
 * ProjectAPIOnHold.stories.tsx
 *
 * Mock story built from the real project API response provided by the user.
 * Demonstrates that OnHold grey lines render correctly when:
 *  - Tasks use API field names: workGroupName, plannedStartDate, plannedEndDate
 *  - Project-level onHoldPeriods are passed as ISO strings at the Gantt prop level
 *  - Data comes in a nested stages → workpacks shape (flattened here)
 *
 * On-hold period: 2026-02-20 → 2026-02-26
 * Tasks that overlap this range will show the grey hatched bar.
 */
import { Gantt } from '../components/Gantt/Gantt';

export default {
    title: 'Gantt/Project API — OnHold (Real Data)',
    component: Gantt,
    parameters: { layout: 'fullscreen' },
    tags: ['autodocs'],
};

// ─── Exact API response from the project ────────────────────────────────────
const apiResponse = {
    projectId: 114,
    stationName: 'feb23',
    projectStatus: 'On-Hold',
    startDate: '2026-03-09T00:00:00.000Z',
    endDate: '2027-05-29T00:00:00.000Z',
    signatureDate: '2026-02-25T00:00:00.000Z',
    stages: [
        {
            stageId: '10a681cc-dd56-4dbd-8be4-d65fb43e6b34',
            stageName: 'Site survey',
            plannedStartDate: '2026-02-23T15:36:22.000Z',
            plannedEndDate: '2027-05-29T00:00:00.000Z',
            workpacks: [
                {
                    id: 1507,
                    workGroupName: 'C1-Concrete Pouring Approval Checklist-23FEB',
                    plannedStartDate: '2026-02-23T15:36:22.000Z',
                    plannedEndDate: '2026-02-23T15:36:41.000Z',
                    workpackStatus: 'Completed',
                    progress: 100,
                    status: 'completed',
                    duration: 15,
                    isMilestone: true,
                    milestoneName: 'Foundation Work',
                },
                {
                    id: 1508,
                    workGroupName: 'C4-Site Assessment Workpack-23FEB',
                    plannedStartDate: '2026-03-09T00:00:00.000Z',
                    plannedEndDate: '2026-05-04T00:00:00.000Z',
                    workpackStatus: 'Assigned',
                    progress: 0,
                    status: 'not-started',
                    duration: 56,
                    isMilestone: true,
                    milestoneName: 'Site Survey Completion',
                },
                {
                    id: 1543,
                    workGroupName: 'newww',
                    plannedStartDate: '2027-04-15T00:00:00.000Z',
                    plannedEndDate: '2027-05-29T00:00:00.000Z',
                    workpackStatus: 'UnAssigned',
                    progress: 0,
                    status: 'not-started',
                    duration: 44,
                    isMilestone: false,
                },
            ],
        },
        {
            stageId: '39523463-4324-4974-9fdb-59786f53862e',
            stageName: 'Civil work',
            plannedStartDate: '2026-03-14T00:00:00.000Z',
            plannedEndDate: '2026-03-24T00:00:00.000Z',
            workpacks: [
                {
                    id: 1509,
                    workGroupName: 'C2-Electrical Safety Compliance Checklist-23FEB',
                    plannedStartDate: '2026-03-14T00:00:00.000Z',
                    plannedEndDate: '2026-03-24T00:00:00.000Z',
                    workpackStatus: 'Completed',
                    progress: 100,
                    status: 'completed',
                    duration: 10,
                    isMilestone: true,
                    milestoneName: 'Electrical Inspection',
                },
            ],
        },
        {
            stageId: '8d534ba3-0a4a-47a8-baaa-e4331a0b35be',
            stageName: 'Installation & Commissioning',
            plannedStartDate: '2026-03-05T00:00:00.000Z',
            plannedEndDate: '2026-04-21T00:00:00.000Z',
            workpacks: [
                {
                    id: 1510,
                    workGroupName: 'C3-Go-Live Validation Workpack DATE-23FEB',
                    plannedStartDate: '2026-03-19T00:00:00.000Z',
                    plannedEndDate: '2026-03-29T00:00:00.000Z',
                    workpackStatus: 'Assigned',
                    progress: 0,
                    status: 'not-started',
                    duration: 10,
                    isMilestone: true,
                    milestoneName: 'Go-Live',
                },
                {
                    id: 1511,
                    workGroupName: 'C5-EV Charger Setup Workpack',
                    plannedStartDate: '2026-03-09T00:00:00.000Z',
                    plannedEndDate: '2026-04-09T00:00:00.000Z',
                    workpackStatus: 'Assigned',
                    progress: 0,
                    status: 'not-started',
                    duration: 31,
                    isMilestone: true,
                    milestoneName: 'Charger Installation',
                },
                {
                    id: 1557,
                    workGroupName: 'new checklist',
                    plannedStartDate: '2026-03-05T00:00:00.000Z',
                    plannedEndDate: '2026-04-21T00:00:00.000Z',
                    workpackStatus: 'UnAssigned',
                    progress: 0,
                    status: 'not-started',
                    duration: 47,
                    isMilestone: false,
                },
            ],
        },
    ],
    onHoldPeriods: [
        {
            start: '2026-02-20T05:22:17.213Z',
            end: '2026-02-26T05:22:17.213Z',
        },
    ],
};

// ─── Transform nested stages → workpacks into flat Gantt task list ───────────
// Each stage becomes a parent "project" task; each workpack becomes a child task.
// The Gantt normalizer will handle workGroupName, plannedStartDate, plannedEndDate.
const buildTasks = () => {
    const tasks: Record<string, unknown>[] = [];

    // Filter out stages with no dates (empty stages)
    const activeStages = apiResponse.stages.filter(
        (s) => s.plannedStartDate && s.plannedEndDate
    );

    activeStages.forEach((stage) => {
        // Parent row: stage as a project-type task
        tasks.push({
            id: stage.stageId,
            text: stage.stageName,
            type: 'project' as const,
            plannedStartDate: stage.plannedStartDate,
            plannedEndDate: stage.plannedEndDate,
            progress: 0,
            open: true,
        });

        // Child rows: workpacks
        stage.workpacks.forEach((wp) => {
            tasks.push({
                id: String(wp.id),
                parent: stage.stageId,
                workGroupName: wp.workGroupName,   // ← resolved by new alias
                plannedStartDate: wp.plannedStartDate, // ← resolved by new alias
                plannedEndDate: wp.plannedEndDate,     // ← resolved by new alias
                duration: wp.duration,
                progress: wp.progress,
                status: wp.status,
                current_status: wp.status,
            });
        });
    });

    return tasks;
};

// ═══════════════════════════════════════════════════════════
// Story 1: Light theme — exact user API data
// OnHold period: 2026-02-20 → 2026-02-26
// Only the "Site survey" stage overlaps — its workpack C1 (Feb 23) will split.
// ═══════════════════════════════════════════════════════════
export const ProjectAPIOnHoldLight = {
    name: 'Project API — OnHold (Light)',
    args: {
        tasks: buildTasks(),
        links: [],
        onHoldPeriods: apiResponse.onHoldPeriods,
        config: {
            weekends: true,
            theme: 'light' as const,
        },
    },
};

// ═══════════════════════════════════════════════════════════
// Story 2: Dark theme
// ═══════════════════════════════════════════════════════════
export const ProjectAPIOnHoldDark = {
    name: 'Project API — OnHold (Dark)',
    args: {
        tasks: buildTasks(),
        links: [],
        onHoldPeriods: apiResponse.onHoldPeriods,
        config: {
            weekends: true,
            theme: 'dark' as const,
        },
    },
};

// ═══════════════════════════════════════════════════════════
// Story 3: Raw flat workpacks (no stages) — mimics a minimal API shape
// Confirms normalizer handles workGroupName + plannedStartDate/EndDate directly.
// ═══════════════════════════════════════════════════════════
export const FlatWorkpacksOnHold = {
    name: 'Flat Workpacks — workGroupName + plannedStartDate/EndDate (Light)',
    args: {
        tasks: apiResponse.stages.flatMap((s) =>
            s.workpacks.map((wp) => ({
                id: String(wp.id),
                workGroupName: wp.workGroupName,
                plannedStartDate: wp.plannedStartDate,
                plannedEndDate: wp.plannedEndDate,
                duration: wp.duration,
                progress: wp.progress,
                status: wp.status,
            }))
        ),
        links: [],
        onHoldPeriods: apiResponse.onHoldPeriods,
        config: {
            weekends: true,
            theme: 'light' as const,
        },
    },
};
