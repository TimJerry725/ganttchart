/**
 * Basic tests for Gantt component
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Gantt } from './Gantt';
import type { Task } from '@gantt/core';

// Mock canvas methods
HTMLCanvasElement.prototype.getContext = () => {
  return {
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    fillText: () => {},
    stroke: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    setLineDash: () => {},
    fill: () => {},
  } as unknown as CanvasRenderingContext2D;
};

describe('Gantt', () => {
  it('should render with tasks', () => {
    const tasks: Task[] = [
      {
        id: 1,
        name: 'Test Task',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-05'),
        duration: 5,
      },
    ];

    const { container } = render(<Gantt tasks={tasks} links={[]} />);
    expect(container).toBeDefined();
  });

  it('should render empty state', () => {
    const { container } = render(<Gantt tasks={[]} links={[]} />);
    expect(container).toBeDefined();
  });
});
