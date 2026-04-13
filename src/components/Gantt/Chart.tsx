import { forwardRef } from 'react';
import { Timeline } from './Timeline';
import type { Task, Link, GanttConfig, Baseline, Scale, TaskTooltipConfig, TaskDragUpdateMeta } from './types';

interface ChartProps {
    tasks: Task[];
    links: Link[];
    range: { start: Date; end: Date };
    scales: Scale[];
    config: GanttConfig;
    selectedTask: string | null;
    draggedTask: string | null;
    onTaskClick: (taskId: string) => void;
    onTaskDragStart: (taskId: string, clientX: number, clientY: number) => void;
    onTaskDragEnd: () => void;
    onTaskUpdate: (id: string, updates: Partial<Task>, meta?: TaskDragUpdateMeta) => void;
    zoomLevel: number;
    baselines: Map<string, Baseline>;
    allowBaselineOnlyMode?: boolean;
    taskTooltipConfig?: TaskTooltipConfig;
    headerHeight?: number;
}

export const Chart = forwardRef<HTMLDivElement, ChartProps>((props, ref) => {
    return (
        <div className="gantt-chart-wrapper" style={{ flex: 1, minWidth: 0 }}>
            <Timeline {...props} ref={ref} />
        </div>
    );
});

Chart.displayName = 'Chart';
