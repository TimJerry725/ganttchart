import React from 'react';
import type { Task, Link } from '../types';

interface LinkRendererProps {
  links: Link[];
  tasks: Task[];
  getTaskPosition: (task: Task) => { left: number; top: number; width: number; height: number };
}

export const LinkRenderer: React.FC<LinkRendererProps> = ({ links, tasks, getTaskPosition }) => {
  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(t => t.id === id);
  };

  const createPath = (link: Link): string => {
    const source = getTaskById(link.source);
    const target = getTaskById(link.target);

    if (!source || !target) return '';

    const sPos = getTaskPosition(source);
    const tPos = getTaskPosition(target);

    // Center Y position of task bars
    const sY = sPos.top + sPos.height / 2;
    const tY = tPos.top + tPos.height / 2;

    let sX = 0, tX = 0;

    // Determine start and end X positions based on link type
    switch (link.type) {
      case 'e2s': // End to Start
        sX = sPos.left + sPos.width;
        tX = tPos.left;
        break;
      case 's2s': // Start to Start
        sX = sPos.left;
        tX = tPos.left;
        break;
      case 'e2e': // End to End
        sX = sPos.left + sPos.width;
        tX = tPos.left + tPos.width;
        break;
      case 's2e': // Start to End
        sX = sPos.left;
        tX = tPos.left + tPos.width;
        break;
    }

    const dx = tX - sX;
    const dy = tY - sY;
    const gap = 20;

    // Build the path with boxy (orthogonal) lines
    if (link.type === 'e2s') {
      // Finish to Start
      if (dx > gap) {
        // Target is to the right - orthogonal zig-zag
        const mx = sX + gap / 2;
        return `M ${sX},${sY} L ${mx},${sY} L ${mx},${tY} L ${tX},${tY}`;
      } else {
        // Target is to the left - go around
        const my = sY + (dy >= 0 ? 1 : -1) * Math.max(Math.abs(dy) / 2 + gap, gap);
        return `M ${sX},${sY} L ${sX + gap / 2},${sY} L ${sX + gap / 2},${my} L ${tX - gap / 2},${my} L ${tX - gap / 2},${tY} L ${tX},${tY}`;
      }
    }

    else if (link.type === 's2s') {
      // Start to Start
      const leftX = Math.min(sX, tX) - gap / 2;
      return `M ${sX},${sY} L ${leftX},${sY} L ${leftX},${tY} L ${tX},${tY}`;
    }

    else if (link.type === 'e2e') {
      // End to End
      const rightX = Math.max(sX, tX) + gap / 2;
      return `M ${sX},${sY} L ${rightX},${sY} L ${rightX},${tY} L ${tX},${tY}`;
    }

    else if (link.type === 's2e') {
      // Start to Finish
      if (dx < -gap) {
        // Target is to the left - orthogonal zig-zag
        const mx = sX - gap / 2;
        return `M ${sX},${sY} L ${mx},${sY} L ${mx},${tY} L ${tX},${tY}`;
      } else {
        // Target is to the right - go around
        const leftX = sX - gap / 2;
        return `M ${sX},${sY} L ${leftX},${sY} L ${leftX},${tY} L ${tX},${tY}`;
      }
    }

    return '';
  };

  const createArrow = (link: Link): string => {
    const target = getTaskById(link.target);
    if (!target) return '';

    const tPos = getTaskPosition(target);
    const cy = tPos.top + tPos.height / 2;
    const size = 10;

    let x = 0;
    let pointRight = true;

    // Determine arrow position and direction
    if (link.type === 'e2s' || link.type === 's2s') {
      x = tPos.left;
      pointRight = true;
    } else {
      x = tPos.left + tPos.width;
      pointRight = false;
    }

    // Create triangle
    if (pointRight) {
      return `M ${x},${cy} L ${x - size},${cy - (size * 0.7)} L ${x - size},${cy + (size * 0.7)} Z`;
    } else {
      return `M ${x},${cy} L ${x + size},${cy - (size * 0.7)} L ${x + size},${cy + (size * 0.7)} Z`;
    }
  };

  return (
    <svg className="gantt-links-layer" style={{ overflow: 'visible' }}>
      {links.map((link) => {
        const source = getTaskById(link.source);
        const target = getTaskById(link.target);

        if (!source || !target) return null;

        const pathD = createPath(link);
        const arrowD = createArrow(link);

        return (
          <g key={link.id} className="gantt-link">
            <path
              d={pathD}
              fill="none"
              strokeWidth="2.5"
              className="gantt-link-line"
            />
            <path
              d={arrowD}
              className="gantt-link-arrow"
            />
          </g>
        );
      })}
    </svg>
  );
};
