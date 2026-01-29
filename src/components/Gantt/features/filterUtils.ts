import type { Task } from '../types';

export interface FilterOptions {
    searchText: string;
    status: 'all' | 'not-started' | 'in-progress' | 'completed';
    priority: 'all' | 'low' | 'medium' | 'high';
    owner: string;
    dateRange?: { start: Date; end: Date };
}

// Filter function
export const applyFilters = (tasks: Task[], filters: FilterOptions): Task[] => {
    return tasks.filter(task => {
        // Search text filter
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase();
            const matchesText = task.text.toLowerCase().includes(searchLower);
            const matchesOwner = task.owner?.toLowerCase().includes(searchLower);
            const matchesDetails = task.details?.toLowerCase().includes(searchLower);

            if (!matchesText && !matchesOwner && !matchesDetails) {
                return false;
            }
        }

        // Status filter
        if (filters.status !== 'all') {
            const status =
                task.progress === 0 ? 'not-started' :
                    task.progress === 100 ? 'completed' :
                        'in-progress';

            if (status !== filters.status) {
                return false;
            }
        }

        // Priority filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) {
            return false;
        }

        // Owner filter
        if (filters.owner && task.owner !== filters.owner) {
            return false;
        }

        // Date range filter
        if (filters.dateRange) {
            const taskStart = task.start.getTime();
            const rangeStart = filters.dateRange.start.getTime();
            const rangeEnd = filters.dateRange.end.getTime();

            if (taskStart < rangeStart || taskStart > rangeEnd) {
                return false;
            }
        }

        return true;
    });
};
