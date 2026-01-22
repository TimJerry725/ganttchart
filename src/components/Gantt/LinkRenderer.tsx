import React from 'react';
import type { Task, Link } from './types';

interface LinkRendererProps {
  links: Link[];
  tasks: Task[];
  getTaskPosition: (task: Task) => { left: number; top: number; width: number; height: number };
}

export const LinkRenderer: React.FC<LinkRendererProps> = ({ links, tasks, getTaskPosition }) => {
  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(t => t.id === id);
  };

  // Calculate SVG dimensions from all task positions
  const svgDimensions = React.useMemo(() => {
    let maxWidth = 0;
    let maxHeight = 0;
    
    tasks.forEach(task => {
      try {
        const pos = getTaskPosition(task);
        if (pos && typeof pos.left === 'number' && typeof pos.width === 'number') {
          maxWidth = Math.max(maxWidth, pos.left + pos.width);
        }
        if (pos && typeof pos.top === 'number' && typeof pos.height === 'number') {
          maxHeight = Math.max(maxHeight, pos.top + pos.height);
        }
      } catch (e) {
        // Skip tasks that can't be positioned
        console.warn('Failed to position task for link rendering:', task.id, e);
      }
    });
    
    return { 
      width: Math.max(maxWidth, 1000), 
      height: Math.max(maxHeight, 100) 
    };
  }, [tasks, getTaskPosition]);

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
    const minStep = 20;

    // Refined orthogonal routing
    if (link.type === 'e2s') {
      if (dx >= minStep) {
        // Simple 3-segment orthogonal
        const mx = sX + dx / 2;
        return `M ${sX},${sY} L ${mx},${sY} L ${mx},${tY} L ${tX},${tY}`;
      } else {
        // Backward link - 5 segments
        const step = minStep / 2;
        const my = sY + dy / 2;
        return `M ${sX},${sY} L ${sX + step},${sY} L ${sX + step},${my} L ${tX - step},${my} L ${tX - step},${tY} L ${tX},${tY}`;
      }
    } else if (link.type === 's2s') {
      const mx = Math.min(sX, tX) - minStep / 2;
      return `M ${sX},${sY} L ${mx},${sY} L ${mx},${tY} L ${tX},${tY}`;
    } else if (link.type === 'e2e') {
      const mx = Math.max(sX, tX) + minStep / 2;
      return `M ${sX},${sY} L ${mx},${sY} L ${mx},${tY} L ${tX},${tY}`;
    } else if (link.type === 's2e') {
      if (dx <= -minStep) {
        const mx = sX + dx / 2;
        return `M ${sX},${sY} L ${mx},${sY} L ${mx},${tY} L ${tX},${tY}`;
      } else {
        const step = minStep / 2;
        const my = sY + dy / 2;
        return `M ${sX},${sY} L ${sX - step},${sY} L ${sX - step},${my} L ${tX + step},${my} L ${tX + step},${tY} L ${tX},${tY}`;
      }
    }

    return '';
  };

  const createArrow = (link: Link): string => {
    const target = getTaskById(link.target);
    if (!target) return '';

    const tPos = getTaskPosition(target);
    const cy = tPos.top + tPos.height / 2;
    const size = 8;
    const width = 6;

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
      return `M ${x},${cy} L ${x - size},${cy - width / 2} L ${x - size},${cy + width / 2} Z`;
    } else {
      return `M ${x},${cy} L ${x + size},${cy - width / 2} L ${x + size},${cy + width / 2} Z`;
    }
  };

  if (links.length === 0) return null;

  return (
    <svg 
      className="gantt-links-layer" 
      style={{ 
        overflow: 'visible',
        width: svgDimensions.width,
        height: svgDimensions.height,
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      {links.map((link) => {
        const source = getTaskById(link.source);
        const target = getTaskById(link.target);

        if (!source || !target) return null;

        const pathD = createPath(link);
        const arrowD = createArrow(link);

        if (!pathD || !arrowD) return null;

        return (
          <g key={link.id} className="gantt-link">
            <path
              d={pathD}
              fill="none"
              strokeWidth="1.5"
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
