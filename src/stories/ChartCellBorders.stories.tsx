import React from 'react';
import { Gantt } from '../components/Gantt/Gantt';
import type { Task, Link } from '../components/types';

export default {
  title: 'Gantt/Chart Cell Borders',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    showVerticalBorders: {
      control: 'boolean',
      description: 'Show vertical cell borders',
      table: {
        category: 'Border Settings',
        defaultValue: { summary: 'true' },
      },
    },
    showHorizontalBorders: {
      control: 'boolean',
      description: 'Show horizontal row borders',
      table: {
        category: 'Border Settings',
        defaultValue: { summary: 'true' },
      },
    },
    borderStyle: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted'],
      description: 'Border line style',
      table: {
        category: 'Border Settings',
        defaultValue: { summary: 'solid' },
      },
    },
    borderColor: {
      control: 'color',
      description: 'Border color',
      table: {
        category: 'Border Settings',
        defaultValue: { summary: '#e0e0e0' },
      },
    },
  },
};


const tasks: Task[] = [
  {
    id: '1',
    text: 'Project planning',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 16),
    duration: 14,
    progress: 100,
    type: 'project',
    color: '#26A69A',
    open: true,
  },
  {
    id: '1.1',
    parent: '1',
    text: 'Marketing analysis',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 5),
    duration: 3,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '1.2',
    parent: '1',
    text: 'Discussions',
    start: new Date(2026, 3, 5),
    end: new Date(2026, 3, 7),
    duration: 2,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '1.3',
    parent: '1',
    text: 'Approval of strategy',
    start: new Date(2026, 3, 8),
    end: new Date(2026, 3, 8),
    duration: 0,
    progress: 100,
    type: 'milestone',
  },
  {
    id: '2',
    text: 'Project management',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 12),
    duration: 10,
    progress: 80,
    type: 'project',
    color: '#26A69A',
    open: true,
  },
  {
    id: '2.1',
    parent: '2',
    text: 'Resource planning',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 6),
    duration: 4,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '2.2',
    parent: '2',
    text: 'Getting approval',
    start: new Date(2026, 3, 6),
    end: new Date(2026, 3, 8),
    duration: 2,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '2.3',
    parent: '2',
    text: 'Team introduction',
    start: new Date(2026, 3, 8),
    end: new Date(2026, 3, 10),
    duration: 2,
    progress: 50,
    color: '#42A5F5',
  },
  {
    id: '3',
    text: 'Development',
    start: new Date(2026, 3, 9),
    end: new Date(2026, 3, 30),
    duration: 21,
    progress: 60,
    type: 'project',
    color: '#26A69A',
    open: true,
  },
  {
    id: '3.1',
    parent: '3',
    text: 'Prototyping',
    start: new Date(2026, 3, 9),
    end: new Date(2026, 3, 15),
    duration: 6,
    progress: 100,
    color: '#42A5F5',
  },
];

const links: Link[] = [
  { id: 'l1', sourceId: '1.1', targetId: '1.2', type: 'e2s' },
  { id: 'l2', sourceId: '1.2', targetId: '1.3', type: 'e2s' },
  { id: 'l3', sourceId: '2.1', targetId: '2.2', type: 'e2s' },
  { id: 'l4', sourceId: '2.2', targetId: '2.3', type: 'e2s' },
  { id: 'l5', sourceId: '3.1', targetId: '3.2', type: 'e2s' },
];

// Custom styles for chart cell borders
const ChartCellBordersWrapper: React.FC<{
  children: React.ReactNode;
  showVerticalBorders?: boolean;
  showHorizontalBorders?: boolean;
  borderStyle?: string;
  borderColor?: string;
}> = ({
  children,
  showVerticalBorders = true,
  showHorizontalBorders = true,
  borderStyle = 'solid',
  borderColor = '#e0e0e0'
}) => {
    return (
      <div
        className="chart-cell-borders-wrapper"
        style={{
          '--border-color': borderColor,
          '--border-style': borderStyle,
        } as React.CSSProperties}
      >
        <style>{`
        .chart-cell-borders-wrapper .gantt-timeline-cell {
          border-right: ${showVerticalBorders ? `1px var(--border-style) var(--border-color)` : 'none'};
          border-bottom: ${showHorizontalBorders ? `1px var(--border-style) var(--border-color)` : 'none'};
        }
        
        .chart-cell-borders-wrapper .gantt-timeline-scale-cell {
          border-right: ${showVerticalBorders ? `1px var(--border-style) var(--border-color)` : 'none'};
          border-bottom: 2px solid var(--border-color);
        }
        
        .chart-cell-borders-wrapper .gantt-timeline-row {
          border-bottom: ${showHorizontalBorders ? `1px var(--border-style) var(--border-color)` : 'none'};
        }
      `}</style>
        {children}
      </div>
    );
  };

/**
 * Chart Cell Borders - Interactive Controls
 * 
 * Customize the grid lines and cell borders in the timeline area:
 * - **Vertical borders**: Column separators (day/week dividers)
 * - **Horizontal borders**: Row separators between tasks
 * - **Border style**: Solid, dashed, or dotted lines
 * - **Border color**: Custom color selection
 * 
 * These borders help:
 * - Visualize the time scale clearly
 * - Align tasks with specific dates
 * - Distinguish between adjacent tasks
 * - Improve readability of the timeline
 * 
 * Use the Controls panel below to adjust settings in real-time!
 */
export const Default = {
  args: {
    tasks: tasks,
    links: links,
    showVerticalBorders: true,
    showHorizontalBorders: true,
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
  },
  render: (args: any) => {
    const { showVerticalBorders, showHorizontalBorders, borderStyle, borderColor, ...rest } = args;
    return (
      <ChartCellBordersWrapper
        showVerticalBorders={showVerticalBorders}
        showHorizontalBorders={showHorizontalBorders}
        borderStyle={borderStyle}
        borderColor={borderColor}
      >
        <Gantt
          {...rest}
          tasks={tasks}
          links={links}
          config={{
            weekends: true,
            theme: 'light',
          }}
        />
      </ChartCellBordersWrapper>
    );
  },
};

/**
 * Vertical Borders Only
 * 
 * Shows only vertical grid lines (column separators).
 * Useful for emphasizing time periods without cluttering rows.
 */
export const VerticalBordersOnly = {
  args: {
    tasks: tasks,
    links: links,
    showVerticalBorders: true,
    showHorizontalBorders: false,
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
  },
  render: (args: any) => {
    const { showVerticalBorders, showHorizontalBorders, borderStyle, borderColor, ...rest } = args;
    return (
      <ChartCellBordersWrapper
        showVerticalBorders={showVerticalBorders}
        showHorizontalBorders={showHorizontalBorders}
        borderStyle={borderStyle}
        borderColor={borderColor}
      >
        <Gantt
          {...rest}
          tasks={tasks}
          links={links}
          config={{
            weekends: true,
            theme: 'light',
          }}
        />
      </ChartCellBordersWrapper>
    );
  },
};

/**
 * Horizontal Borders Only
 * 
 * Shows only horizontal grid lines (row separators).
 * Useful for distinguishing between tasks without time divisions.
 */
export const HorizontalBordersOnly = {
  args: {
    tasks: tasks,
    links: links,
    showVerticalBorders: false,
    showHorizontalBorders: true,
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
  },
  render: (args: any) => {
    const { showVerticalBorders, showHorizontalBorders, borderStyle, borderColor, ...rest } = args;
    return (
      <ChartCellBordersWrapper
        showVerticalBorders={showVerticalBorders}
        showHorizontalBorders={showHorizontalBorders}
        borderStyle={borderStyle}
        borderColor={borderColor}
      >
        <Gantt
          {...rest}
          tasks={tasks}
          links={links}
          config={{
            weekends: true,
            theme: 'light',
          }}
        />
      </ChartCellBordersWrapper>
    );
  },
};

/**
 * Dashed Borders
 * 
 * Uses dashed lines for a lighter, less prominent grid.
 */
export const DashedBorders = {
  args: {
    tasks: tasks,
    links: links,
    showVerticalBorders: true,
    showHorizontalBorders: true,
    borderStyle: 'dashed',
    borderColor: '#d0d0d0',
  },
  render: (args: any) => {
    const { showVerticalBorders, showHorizontalBorders, borderStyle, borderColor, ...rest } = args;
    return (
      <ChartCellBordersWrapper
        showVerticalBorders={showVerticalBorders}
        showHorizontalBorders={showHorizontalBorders}
        borderStyle={borderStyle}
        borderColor={borderColor}
      >
        <Gantt
          {...rest}
          tasks={tasks}
          links={links}
          config={{
            weekends: true,
            theme: 'light',
          }}
        />
      </ChartCellBordersWrapper>
    );
  },
};

/**
 * Dotted Borders
 * 
 * Uses dotted lines for the most subtle grid.
 */
export const DottedBorders = {
  args: {
    tasks: tasks,
    links: links,
    showVerticalBorders: true,
    showHorizontalBorders: true,
    borderStyle: 'dotted',
    borderColor: '#c0c0c0',
  },
  render: (args: any) => {
    const { showVerticalBorders, showHorizontalBorders, borderStyle, borderColor, ...rest } = args;
    return (
      <ChartCellBordersWrapper
        showVerticalBorders={showVerticalBorders}
        showHorizontalBorders={showHorizontalBorders}
        borderStyle={borderStyle}
        borderColor={borderColor}
      >
        <Gantt
          {...rest}
          tasks={tasks}
          links={links}
          config={{
            weekends: true,
            theme: 'light',
          }}
        />
      </ChartCellBordersWrapper>
    );
  },
};

/**
 * Custom Color Borders
 * 
 * Uses a custom blue color for borders.
 * Try changing the border color in the Controls panel!
 */
export const CustomColorBorders = {
  args: {
    tasks: tasks,
    links: links,
    showVerticalBorders: true,
    showHorizontalBorders: true,
    borderStyle: 'solid',
    borderColor: '#90CAF9',
  },
  render: (args: any) => {
    const { showVerticalBorders, showHorizontalBorders, borderStyle, borderColor, ...rest } = args;
    return (
      <ChartCellBordersWrapper
        showVerticalBorders={showVerticalBorders}
        showHorizontalBorders={showHorizontalBorders}
        borderStyle={borderStyle}
        borderColor={borderColor}
      >
        <Gantt
          {...rest}
          tasks={tasks}
          links={links}
          config={{
            weekends: true,
            theme: 'light',
          }}
        />
      </ChartCellBordersWrapper>
    );
  },
};

/**
 * No Borders
 * 
 * Clean timeline without any grid lines.
 * Provides a minimal, uncluttered view.
 */
export const NoBorders = {
  args: {
    tasks: tasks,
    links: links,
    showVerticalBorders: false,
    showHorizontalBorders: false,
  },
  render: (args: any) => {
    const { showVerticalBorders, showHorizontalBorders, ...rest } = args;
    return (
      <ChartCellBordersWrapper
        showVerticalBorders={showVerticalBorders}
        showHorizontalBorders={showHorizontalBorders}
      >
        <Gantt
          {...rest}
          tasks={tasks}
          links={links}
          config={{
            weekends: true,
            theme: 'light',
          }}
        />
      </ChartCellBordersWrapper>
    );
  },
};
