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
    const taskBarHeight = sourcePos.height;
    const centerY = taskBarHeight / 2;

    // Calculate connection points based on link type
    // Center points vertically on the task bars
    switch (link.type) {
      case 'e2s': // End to Start (most common)
        startX = sourcePos.left + sourcePos.width;
        startY = sourcePos.top + centerY;
        endX = targetPos.left;
        endY = targetPos.top + centerY;
        break;
      
      case 's2s': // Start to Start
        startX = sourcePos.left;
        startY = sourcePos.top + centerY;
        endX = targetPos.left;
        endY = targetPos.top + centerY;
        break;
      
      case 'e2e': // End to End
        startX = sourcePos.left + sourcePos.width;
        startY = sourcePos.top + centerY;
        endX = targetPos.left + targetPos.width;
        endY = targetPos.top + centerY;
        break;
      
      case 's2e': // Start to End
        startX = sourcePos.left;
        startY = sourcePos.top + centerY;
        endX = targetPos.left + targetPos.width;
        endY = targetPos.top + centerY;
        break;
    }

    // Calculate path with professional curves (SVAR-style)
    const dx = endX - startX;
    const dy = endY - startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    // Determine if this is a forward or backward dependency
    const isForward = dx > 0;
    const cornerRadius = 8; // Rounded corners like SVAR
    const minHorizontalSegment = 15;
    const verticalGap = 10;

    if (isForward && absDx > minHorizontalSegment * 2) {
      // Forward link with smooth S-curve
      const midX = startX + absDx / 2;
      
      if (absDy < 5) {
        // Nearly horizontal - simple straight line with slight curve
        return `M ${startX} ${startY} L ${endX - 8} ${endY}`;
      } else {
        // Use cubic bezier for smooth curve
        const controlOffset = Math.min(absDx / 3, 50);
        return `M ${startX} ${startY} 
                C ${startX + controlOffset} ${startY}, 
                  ${endX - controlOffset} ${endY}, 
                  ${endX - 8} ${endY}`;
      }
    } else {
      // Backward link or tight forward link - use rectangular path with rounded corners
      const direction = dy > 0 ? 1 : -1;
      const vOffset = Math.max(absDy / 2 + verticalGap, 20);
      
      const h1 = startX + minHorizontalSegment;
      const v1 = startY + direction * vOffset;
      const h2 = endX - minHorizontalSegment;
      const v2 = endY - direction * vOffset;
      
      // Create path with rounded corners
      return `M ${startX} ${startY}
              L ${h1 - cornerRadius} ${startY}
              Q ${h1} ${startY} ${h1} ${startY + direction * cornerRadius}
              L ${h1} ${v1 - direction * cornerRadius}
              Q ${h1} ${v1} ${h1 + cornerRadius} ${v1}
              L ${h2 - cornerRadius} ${v1}
              Q ${h2} ${v1} ${h2} ${v1 + direction * cornerRadius}
              L ${h2} ${endY - direction * cornerRadius}
              Q ${h2} ${endY} ${h2 + cornerRadius} ${endY}
              L ${endX - 8} ${endY}`;
    }
  };

  const getArrowPoints = (link: Link): { path: string; tipX: number; tipY: number } => {
    const sourceTask = getTaskById(link.source);
    const targetTask = getTaskById(link.target);

    if (!sourceTask || !targetTask) return { path: '', tipX: 0, tipY: 0 };

    const targetPos = getTaskPosition(targetTask);
    const taskBarHeight = targetPos.height;
    const centerY = taskBarHeight / 2;

    let tipX = 0, tipY = 0;
    let angle = 0;

    // Determine arrow position and direction based on link type
    switch (link.type) {
      case 'e2s':
        tipX = targetPos.left;
        tipY = targetPos.top + centerY;
        angle = 0; // pointing right
        break;
      case 's2s':
        tipX = targetPos.left;
        tipY = targetPos.top + centerY;
        angle = 180; // pointing left
        break;
      case 'e2e':
        tipX = targetPos.left + targetPos.width;
        tipY = targetPos.top + centerY;
        angle = 0; // pointing right
        break;
      case 's2e':
        tipX = targetPos.left + targetPos.width;
        tipY = targetPos.top + centerY;
        angle = 180; // pointing left
        break;
    }

    // Create arrow triangle pointing in the correct direction
    const arrowSize = 7;
    const arrowWidth = 5;
    
    if (angle === 0) {
      // Right-pointing arrow
      return {
        path: `M ${tipX} ${tipY} L ${tipX - arrowSize} ${tipY - arrowWidth} L ${tipX - arrowSize} ${tipY + arrowWidth} Z`,
        tipX,
        tipY
      };
    } else {
      // Left-pointing arrow
      return {
        path: `M ${tipX} ${tipY} L ${tipX + arrowSize} ${tipY - arrowWidth} L ${tipX + arrowSize} ${tipY + arrowWidth} Z`,
        tipX,
        tipY
      };
    }
  };

  return (
    <svg className="gantt-links-layer">
      {links.map((link) => {
        const sourceTask = getTaskById(link.source);
        const targetTask = getTaskById(link.target);
        
        if (!sourceTask || !targetTask) return null;

        const path = calculateLinkPath(link);
        const arrow = getArrowPoints(link);
        
        return (
          <g key={link.id} className="gantt-link">
            {/* Main link line */}
            <path
              d={path}
              fill="none"
              stroke="#4A90E2"
              strokeWidth="2"
              className="gantt-link-line"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Arrow head */}
            <path
              d={arrow.path}
              fill="#4A90E2"
              className="gantt-link-arrow"
            />
          </g>
        );
      })}
    </svg>
  );
};
