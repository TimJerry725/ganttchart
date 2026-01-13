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

    let startX = 0, startY = 0, endX = 0, endY = 0;

    // Calculate connection points based on link type
    switch (link.type) {
      case 'e2s': // End to Start (most common)
        startX = sourcePos.left + sourcePos.width;
        startY = sourcePos.top + sourcePos.height / 2;
        endX = targetPos.left;
        endY = targetPos.top + targetPos.height / 2;
        break;
      
      case 's2s': // Start to Start
        startX = sourcePos.left;
        startY = sourcePos.top + sourcePos.height / 2;
        endX = targetPos.left;
        endY = targetPos.top + targetPos.height / 2;
        break;
      
      case 'e2e': // End to End
        startX = sourcePos.left + sourcePos.width;
        startY = sourcePos.top + sourcePos.height / 2;
        endX = targetPos.left + targetPos.width;
        endY = targetPos.top + targetPos.height / 2;
        break;
      
      case 's2e': // Start to End
        startX = sourcePos.left;
        startY = sourcePos.top + sourcePos.height / 2;
        endX = targetPos.left + targetPos.width;
        endY = targetPos.top + targetPos.height / 2;
        break;
    }

    // Create path with smooth corners
    const midX = (startX + endX) / 2;
    const offset = 20;

    if (endX > startX + 10) {
      // Forward link - simple S-curve
      return `M ${startX} ${startY} 
              C ${startX + offset} ${startY}, 
                ${endX - offset} ${endY}, 
                ${endX} ${endY}`;
    } else {
      // Backward link - goes around
      const arcRadius = 10;
      return `M ${startX} ${startY}
              L ${startX + offset} ${startY}
              L ${startX + offset} ${startY + (endY > startY ? offset : -offset)}
              L ${endX - offset} ${endY + (endY > startY ? -offset : offset)}
              L ${endX - offset} ${endY}
              L ${endX} ${endY}`;
    }
  };

  const getArrowPoints = (link: Link): string => {
    const sourceTask = getTaskById(link.source);
    const targetTask = getTaskById(link.target);

    if (!sourceTask || !targetTask) return '';

    const sourcePos = getTaskPosition(sourceTask);
    const targetPos = getTaskPosition(targetTask);

    let endX = 0, endY = 0;
    let angle = 0;

    switch (link.type) {
      case 'e2s':
        endX = targetPos.left;
        endY = targetPos.top + targetPos.height / 2;
        angle = 0; // pointing right
        break;
      case 's2s':
        endX = targetPos.left;
        endY = targetPos.top + targetPos.height / 2;
        angle = 180; // pointing left
        break;
      case 'e2e':
        endX = targetPos.left + targetPos.width;
        endY = targetPos.top + targetPos.height / 2;
        angle = 0; // pointing right
        break;
      case 's2e':
        endX = targetPos.left + targetPos.width;
        endY = targetPos.top + targetPos.height / 2;
        angle = 180; // pointing left
        break;
    }

    const arrowSize = 6;
    const radians = (angle * Math.PI) / 180;
    
    // Calculate arrow points
    const p1x = endX + arrowSize * Math.cos(radians);
    const p1y = endY + arrowSize * Math.sin(radians);
    
    const p2x = endX + arrowSize * Math.cos(radians + 2.5);
    const p2y = endY + arrowSize * Math.sin(radians + 2.5);
    
    const p3x = endX + arrowSize * Math.cos(radians - 2.5);
    const p3y = endY + arrowSize * Math.sin(radians - 2.5);

    return `${endX},${endY} ${p2x},${p2y} ${p3x},${p3y}`;
  };

  return (
    <svg className="gantt-links-layer">
      {links.map((link) => {
        const path = calculateLinkPath(link);
        const arrowPoints = getArrowPoints(link);
        
        return (
          <g key={link.id} className="gantt-link">
            <path
              d={path}
              fill="none"
              stroke="#4A90E2"
              strokeWidth="2"
              className="gantt-link-line"
            />
            <polygon
              points={arrowPoints}
              fill="#4A90E2"
              className="gantt-link-arrow"
            />
          </g>
        );
      })}
    </svg>
  );
};
