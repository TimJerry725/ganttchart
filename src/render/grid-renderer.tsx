/**
 * Grid renderer (DOM-based with Tailwind)
 * Professional styling
 */

import React from 'react';
import type { Task, TaskId } from '../types';
import type { RowLayout } from './layout';
import type { ColumnConfig } from '../types';

export interface GridRendererProps {
  columns: ColumnConfig[];
  tasks: Task[];
  rows: Map<TaskId, RowLayout>;
  selectedTaskIds: Set<TaskId>;
  rowHeight?: number;
  onTaskClick?: (taskId: TaskId) => void;
  onTaskSelect?: (taskId: TaskId, multi: boolean) => void;
  onTaskExpand?: (taskId: TaskId) => void;
  gridCellTemplate?: (task: Task, column: ColumnConfig) => React.ReactNode;
}

export const GridRenderer: React.FC<GridRendererProps> = ({
  columns,
  tasks,
  rows,
  selectedTaskIds,
  rowHeight = 40,
  onTaskClick,
  onTaskSelect,
  onTaskExpand,
  gridCellTemplate,
}) => {
  const visibleRows = Array.from(rows.values());

  const renderCell = (task: Task, column: ColumnConfig, indent: number) => {
    if (gridCellTemplate) {
      return gridCellTemplate(task, column);
    }

    if (column.render) {
      return column.render(task);
    }

    if (column.field) {
      const value = (task as Record<string, unknown>)[column.field];
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      return String(value || '');
    }

    return task.name;
  };

  const handleExpandClick = (e: React.MouseEvent, taskId: TaskId) => {
    e.stopPropagation();
    onTaskExpand?.(taskId);
  };

  return (
    <div className="iris-gantt-grid">
      {/* Header */}
      <div className="iris-gantt-grid-header flex">
        {columns.map((column) => (
          <div
            key={column.id}
            className="iris-gantt-grid-header-cell"
            style={{ 
              width: column.width,
              textAlign: column.align || 'left',
            }}
          >
            {column.headerRender ? column.headerRender() : column.label}
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
          const hasChildren = task.children && task.children.length > 0;

          return (
            <div
              key={row.taskId}
              className={`iris-gantt-grid-row ${
                isSelected ? 'iris-gantt-grid-row-selected' : ''
              }`}
              style={{ height: rowHeight }}
              onClick={() => {
                onTaskClick?.(row.taskId);
                onTaskSelect?.(row.taskId, false);
              }}
            >
              {columns.map((column, colIndex) => {
                const isNameColumn = column.id === 'name' || colIndex === 0;
                
                return (
                  <div
                    key={column.id}
                    className="iris-gantt-grid-cell"
                    style={{ 
                      width: column.width,
                      textAlign: column.align || 'left',
                      paddingLeft: isNameColumn ? `${indent + (hasChildren ? 24 : 12)}px` : '16px',
                    }}
                  >
                    {isNameColumn && hasChildren && (
                      <button
                        type="button"
                        className="iris-gantt-expand-button absolute left-2"
                        onClick={(e) => handleExpandClick(e, row.taskId)}
                        style={{ left: `${indent + 4}px` }}
                      >
                        {task.expanded !== false ? '−' : '+'}
                      </button>
                    )}
                    {isNameColumn && (
                      <span className="iris-gantt-grid-cell-name">
                        {renderCell(task, column, indent)}
                      </span>
                    )}
                    {!isNameColumn && renderCell(task, column, indent)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
