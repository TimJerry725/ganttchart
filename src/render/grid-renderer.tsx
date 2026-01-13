/**
 * Grid renderer (DOM-based with Tailwind)
 */

import React from 'react';
import type { Task, TaskId } from '../types';
import type { RowLayout } from './layout';

export interface GridColumn {
  id: string;
  label: string;
  width: number;
  field?: string;
  render?: (task: Task) => React.ReactNode;
}

export interface GridRendererProps {
  columns: GridColumn[];
  tasks: Task[];
  rows: Map<TaskId, RowLayout>;
  selectedTaskIds: Set<TaskId>;
  onTaskClick?: (taskId: TaskId) => void;
  onTaskSelect?: (taskId: TaskId, multi: boolean) => void;
}

export const GridRenderer: React.FC<GridRendererProps> = ({
  columns,
  tasks,
  rows,
  selectedTaskIds,
  onTaskClick,
  onTaskSelect,
}) => {
  const visibleRows = Array.from(rows.values());

  return (
    <div className="iris-gantt-grid border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="flex border-b border-gray-300 bg-gray-50 sticky top-0 z-10">
        {columns.map((column) => (
          <div
            key={column.id}
            className="px-3 py-2 font-semibold text-gray-700 text-xs uppercase"
            style={{ width: column.width }}
          >
            {column.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="relative">
        {visibleRows.map((row) => {
          const task = tasks.find((t) => t.id === row.taskId);
          if (!task) return null;

          const isSelected = selectedTaskIds.has(row.taskId);
          const indent = row.level * 20;

          return (
            <div
              key={row.taskId}
              className={`iris-gantt-row flex border-b border-gray-100 ${
                isSelected ? 'iris-gantt-row-selected bg-blue-50' : 'hover:bg-gray-50'
              }`}
              style={{ height: row.height }}
              onClick={() => {
                onTaskClick?.(row.taskId);
                onTaskSelect?.(row.taskId, false);
              }}
            >
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="px-3 py-2 flex items-center text-sm"
                  style={{ width: column.width, paddingLeft: column.id === 'name' ? indent + 12 : 12 }}
                >
                  {column.render
                    ? column.render(task)
                    : column.field
                      ? String((task as Record<string, unknown>)[column.field] || '')
                      : task.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
