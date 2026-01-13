import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import type { Task } from '../types';

const { Search } = Input;

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
      <div className="gantt-filter-bar">
        {/* Left side - Search */}
        <div className="gantt-filter-left">
          <Search
            placeholder="Search tasks..."
            value={filters.searchText}
            onChange={(e) => handleFilterChange({ searchText: e.target.value })}
            allowClear
            className="gantt-search-antd"
            style={{ width: 250 }}
          />
        </div>

        {/* Right side - Filters */}
        <div className="gantt-filter-right">
          {/* Status filter */}
          <Select
            value={filters.status}
            onChange={(value) => handleFilterChange({ status: value as any })}
            className="gantt-filter-select-antd"
            style={{ width: 140 }}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'not-started', label: 'Not Started' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />

          {/* Priority filter */}
          <Select
            value={filters.priority}
            onChange={(value) => handleFilterChange({ priority: value as any })}
            className="gantt-filter-select-antd"
            style={{ width: 130 }}
            options={[
              { value: 'all', label: 'All Priority' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />

          {/* Owner filter */}
          <Select
            value={filters.owner || undefined}
            onChange={(value) => handleFilterChange({ owner: value || '' })}
            className="gantt-filter-select-antd"
            style={{ width: 130 }}
            placeholder="All Owners"
            allowClear
            options={[
              { value: '', label: 'All Owners' },
              ...owners.map(owner => ({ value: owner, label: owner }))
            ]}
          />

          {/* Clear button */}
          {hasActiveFilters && (
            <Button
              type="default"
              danger
              icon={<CloseCircleOutlined />}
              onClick={clearFilters}
              className="gantt-filter-clear-antd"
            >
              Clear
            </Button>
          )}
        </div>
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
