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

  const calculateLinkPath = (link: Link): string => {
    const sourceTask = getTaskById(link.source);
    const targetTask = getTaskById(link.target);

    if (!sourceTask || !targetTask) return '';

    const sourcePos = getTaskPosition(sourceTask);
    const targetPos = getTaskPosition(targetTask);

    const taskBarHeight = sourcePos.height;
    const centerOffset = taskBarHeight / 2;
    const radius = 8; // Corner radius for rounded paths
    const gap = 15; // Horizontal/vertical gap from task bars

    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

    // Set start and end points based on dependency type
    switch (link.type) {
      case 'e2s': // Finish-to-Start
        x1 = sourcePos.left + sourcePos.width;
        y1 = sourcePos.top + centerOffset;
        x2 = targetPos.left;
        y2 = targetPos.top + centerOffset;
        break;
      
      case 's2s': // Start-to-Start
        x1 = sourcePos.left;
        y1 = sourcePos.top + centerOffset;
        x2 = targetPos.left;
        y2 = targetPos.top + centerOffset;
        break;
      
      case 'e2e': // End-to-End
        x1 = sourcePos.left + sourcePos.width;
        y1 = sourcePos.top + centerOffset;
        x2 = targetPos.left + targetPos.width;
        y2 = targetPos.top + centerOffset;
        break;
      
      case 's2e': // Start-to-Finish
        x1 = sourcePos.left;
        y1 = sourcePos.top + centerOffset;
        x2 = targetPos.left + targetPos.width;
        y2 = targetPos.top + centerOffset;
        break;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // Helper function to create rounded corner
    const corner = (x: number, y: number, toX: number, toY: number) => {
      return `Q ${x} ${y} ${toX} ${toY}`;
    };

    // FINISH-TO-START (e2s) - Most common
    if (link.type === 'e2s') {
      if (dx > 2 * gap) {
        // Simple path when target is to the right
        const midX = x1 + dx / 2;
        if (Math.abs(dy) < 5) {
          // Straight horizontal line
          return `M ${x1} ${y1} L ${x2} ${y2}`;
        } else {
          // S-curve for vertical offset
          return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
        }
      } else {
        // Rectangular path when target is to the left or nearby
        const yDir = dy >= 0 ? 1 : -1;
        const yMid = y1 + yDir * (Math.abs(dy) / 2 + gap);
        
        let path = `M ${x1} ${y1}`;
        path += ` L ${x1 + gap} ${y1}`;
        path += ` ${corner(x1 + gap, y1 + yDir * radius, x1 + gap, y1 + yDir * radius)}`;
        path += ` L ${x1 + gap} ${yMid - yDir * radius}`;
        path += ` ${corner(x1 + gap, yMid, x1 + gap - radius, yMid)}`;
        path += ` L ${x2 - gap + radius} ${yMid}`;
        path += ` ${corner(x2 - gap, yMid, x2 - gap, yMid + yDir * radius)}`;
        path += ` L ${x2 - gap} ${y2 - yDir * radius}`;
        path += ` ${corner(x2 - gap, y2, x2 - gap + radius, y2)}`;
        path += ` L ${x2} ${y2}`;
        return path;
      }
    }
    
    // START-TO-START (s2s)
    else if (link.type === 's2s') {
      const yDir = dy >= 0 ? 1 : -1;
      const leftX = Math.min(x1, x2) - gap;
      
      let path = `M ${x1} ${y1}`;
      path += ` L ${leftX + radius} ${y1}`;
      path += ` ${corner(leftX, y1, leftX, y1 + yDir * radius)}`;
      path += ` L ${leftX} ${y2 - yDir * radius}`;
      path += ` ${corner(leftX, y2, leftX + radius, y2)}`;
      path += ` L ${x2} ${y2}`;
      return path;
    }
    
    // END-TO-END (e2e)
    else if (link.type === 'e2e') {
      const yDir = dy >= 0 ? 1 : -1;
      const rightX = Math.max(x1, x2) + gap;
      
      let path = `M ${x1} ${y1}`;
      path += ` L ${rightX - radius} ${y1}`;
      path += ` ${corner(rightX, y1, rightX, y1 + yDir * radius)}`;
      path += ` L ${rightX} ${y2 - yDir * radius}`;
      path += ` ${corner(rightX, y2, rightX - radius, y2)}`;
      path += ` L ${x2} ${y2}`;
      return path;
    }
    
    // START-TO-FINISH (s2e)
    else if (link.type === 's2e') {
      if (dx < -2 * gap) {
        // Simple path when target is to the left
        const midX = x1 + dx / 2;
        if (Math.abs(dy) < 5) {
          return `M ${x1} ${y1} L ${x2} ${y2}`;
        } else {
          return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
        }
      } else {
        // Path when target is to the right
        const yDir = dy >= 0 ? 1 : -1;
        const leftX = x1 - gap;
        
        let path = `M ${x1} ${y1}`;
        path += ` L ${leftX + radius} ${y1}`;
        path += ` ${corner(leftX, y1, leftX, y1 + yDir * radius)}`;
        path += ` L ${leftX} ${y2 - yDir * radius}`;
        path += ` ${corner(leftX, y2, leftX + radius, y2)}`;
        path += ` L ${x2} ${y2}`;
        return path;
      }
    }

    return '';
  };

  const getArrowhead = (link: Link): string => {
    const targetTask = getTaskById(link.target);
    if (!targetTask) return '';

    const targetPos = getTaskPosition(targetTask);
    const centerOffset = targetPos.height / 2;
    const size = 7;
    const width = 5;

    let x = 0, y = 0, pointsRight = true;

    switch (link.type) {
      case 'e2s': // Arrow points right into target start
      case 's2s':
        x = targetPos.left;
        y = targetPos.top + centerOffset;
        pointsRight = true;
        break;
      
      case 'e2e': // Arrow points left into target end
      case 's2e':
        x = targetPos.left + targetPos.width;
        y = targetPos.top + centerOffset;
        pointsRight = false;
        break;
    }

    if (pointsRight) {
      // Right-pointing triangle
      return `M ${x} ${y} L ${x - size} ${y - width} L ${x - size} ${y + width} Z`;
    } else {
      // Left-pointing triangle
      return `M ${x} ${y} L ${x + size} ${y - width} L ${x + size} ${y + width} Z`;
    }
  };

  return (
    <svg className="gantt-links-layer">
      {links.map((link) => {
        const sourceTask = getTaskById(link.source);
        const targetTask = getTaskById(link.target);
        
        if (!sourceTask || !targetTask) return null;

        const path = calculateLinkPath(link);
        const arrowhead = getArrowhead(link);
        
        return (
          <g key={link.id} className="gantt-link">
            <path
              d={path}
              fill="none"
              stroke="#4A90E2"
              strokeWidth="2"
              className="gantt-link-line"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={arrowhead}
              fill="#4A90E2"
              className="gantt-link-arrow"
            />
          </g>
        );
      })}
    </svg>
  );
};
