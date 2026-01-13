import React, { useState } from 'react';
import type { Task } from '../types';

export interface FilterOptions {
  searchText: string;
  status: 'all' | 'not-started' | 'in-progress' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  owner: string;
  dateRange?: { start: Date; end: Date };
}

interface FilterSearchProps {
  onFilterChange: (filters: FilterOptions) => void;
  owners: string[];
}

export const FilterSearch: React.FC<FilterSearchProps> = ({ onFilterChange, owners }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: '',
    status: 'all',
    priority: 'all',
    owner: '',
  });

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared: FilterOptions = {
      searchText: '',
      status: 'all',
      priority: 'all',
      owner: '',
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = 
    filters.searchText !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.owner !== '';

  return (
    <div className="gantt-filter-container">
      <div className="gantt-filter-inline">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.searchText}
          onChange={(e) => handleFilterChange({ searchText: e.target.value })}
          className="gantt-search-input"
        />
        
        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange({ status: e.target.value as any })}
          className="gantt-filter-select"
        >
          <option value="all">All Status</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority filter */}
        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange({ priority: e.target.value as any })}
          className="gantt-filter-select"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Owner filter */}
        <select
          value={filters.owner}
          onChange={(e) => handleFilterChange({ owner: e.target.value })}
          className="gantt-filter-select"
        >
          <option value="">All Owners</option>
          {owners.map(owner => (
            <option key={owner} value={owner}>{owner}</option>
          ))}
        </select>

        {/* Clear button */}
        {hasActiveFilters && (
          <button className="gantt-filter-clear" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

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
