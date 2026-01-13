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
    const centerY = taskBarHeight / 2;
    const cornerRadius = 10;
    const horizontalOffset = 20;
    const verticalOffset = 15;

    let startX = 0, startY = 0, endX = 0, endY = 0;

    // Calculate connection points based on link type
    switch (link.type) {
      case 'e2s': // End to Start - most common
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
      
      case 's2e': // Start to End (Start to Finish)
        startX = sourcePos.left;
        startY = sourcePos.top + centerY;
        endX = targetPos.left + targetPos.width;
        endY = targetPos.top + centerY;
        break;
    }

    const dx = endX - startX;
    const dy = endY - startY;
    const absDy = Math.abs(dy);

    // Finish-to-Start (e2s) - Standard forward dependency
    if (link.type === 'e2s') {
      if (dx > horizontalOffset) {
        // Target is to the right - smooth S-curve
        const controlOffset = Math.min(dx / 3, 40);
        if (absDy < 5) {
          return `M ${startX} ${startY} L ${endX - 6} ${endY}`;
        } else {
          return `M ${startX} ${startY} 
                  C ${startX + controlOffset} ${startY}, 
                    ${endX - controlOffset} ${endY}, 
                    ${endX - 6} ${endY}`;
        }
      } else {
        // Target is to the left or same position - go around
        const direction = dy >= 0 ? 1 : -1;
        const vOffset = Math.max(absDy / 2, taskBarHeight / 2) + verticalOffset;
        
        return `M ${startX} ${startY}
                L ${startX + horizontalOffset} ${startY}
                Q ${startX + horizontalOffset} ${startY + direction * cornerRadius} 
                  ${startX + horizontalOffset} ${startY + direction * cornerRadius}
                L ${startX + horizontalOffset} ${startY + direction * vOffset}
                Q ${startX + horizontalOffset} ${startY + direction * (vOffset + cornerRadius)}
                  ${startX + horizontalOffset - cornerRadius} ${startY + direction * (vOffset + cornerRadius)}
                L ${endX - horizontalOffset + cornerRadius} ${startY + direction * (vOffset + cornerRadius)}
                Q ${endX - horizontalOffset} ${startY + direction * (vOffset + cornerRadius)}
                  ${endX - horizontalOffset} ${startY + direction * (vOffset + cornerRadius) - direction * cornerRadius}
                L ${endX - horizontalOffset} ${endY + direction * cornerRadius}
                Q ${endX - horizontalOffset} ${endY}
                  ${endX - horizontalOffset + cornerRadius} ${endY}
                L ${endX - 6} ${endY}`;
      }
    }
    
    // Start-to-Start (s2s)
    else if (link.type === 's2s') {
      const direction = dy >= 0 ? 1 : -1;
      const vOffset = Math.max(absDy / 2, taskBarHeight / 2) + verticalOffset;
      
      return `M ${startX} ${startY}
              L ${startX - horizontalOffset} ${startY}
              Q ${startX - horizontalOffset} ${startY + direction * cornerRadius}
                ${startX - horizontalOffset} ${startY + direction * cornerRadius}
              L ${startX - horizontalOffset} ${endY - direction * cornerRadius}
              Q ${startX - horizontalOffset} ${endY}
                ${startX - horizontalOffset + cornerRadius} ${endY}
              L ${endX - 6} ${endY}`;
    }
    
    // End-to-End (e2e)
    else if (link.type === 'e2e') {
      const direction = dy >= 0 ? 1 : -1;
      const vOffset = Math.max(absDy / 2, taskBarHeight / 2) + verticalOffset;
      
      return `M ${startX} ${startY}
              L ${startX + horizontalOffset} ${startY}
              Q ${startX + horizontalOffset} ${startY + direction * cornerRadius}
                ${startX + horizontalOffset} ${startY + direction * cornerRadius}
              L ${startX + horizontalOffset} ${endY - direction * cornerRadius}
              Q ${startX + horizontalOffset} ${endY}
                ${startX + horizontalOffset - cornerRadius} ${endY}
              L ${endX + 6} ${endY}`;
    }
    
    // Start-to-End/Finish (s2e/s2f)
    else if (link.type === 's2e') {
      if (dx < -horizontalOffset) {
        // Target is to the left - smooth curve
        const controlOffset = Math.min(Math.abs(dx) / 3, 40);
        if (absDy < 5) {
          return `M ${startX} ${startY} L ${endX + 6} ${endY}`;
        } else {
          return `M ${startX} ${startY} 
                  C ${startX - controlOffset} ${startY}, 
                    ${endX + controlOffset} ${endY}, 
                    ${endX + 6} ${endY}`;
        }
      } else {
        // Target is to the right or same position - go around
        const direction = dy >= 0 ? 1 : -1;
        const vOffset = Math.max(absDy / 2, taskBarHeight / 2) + verticalOffset;
        
        return `M ${startX} ${startY}
                L ${startX - horizontalOffset} ${startY}
                Q ${startX - horizontalOffset} ${startY + direction * cornerRadius}
                  ${startX - horizontalOffset} ${startY + direction * cornerRadius}
                L ${startX - horizontalOffset} ${endY - direction * cornerRadius}
                Q ${startX - horizontalOffset} ${endY}
                  ${startX - horizontalOffset + cornerRadius} ${endY}
                L ${endX + 6} ${endY}`;
      }
    }

    return '';
  };

  const getArrowPoints = (link: Link): { path: string; tipX: number; tipY: number } => {
    const sourceTask = getTaskById(link.source);
    const targetTask = getTaskById(link.target);

    if (!sourceTask || !targetTask) return { path: '', tipX: 0, tipY: 0 };

    const targetPos = getTaskPosition(targetTask);
    const taskBarHeight = targetPos.height;
    const centerY = taskBarHeight / 2;

    let tipX = 0, tipY = 0;
    let direction: 'right' | 'left' = 'right';

    // Determine arrow position and direction based on link type
    switch (link.type) {
      case 'e2s': // Finish-to-Start: Arrow points RIGHT into start of target
        tipX = targetPos.left;
        tipY = targetPos.top + centerY;
        direction = 'right';
        break;
        
      case 's2s': // Start-to-Start: Arrow points RIGHT into start of target
        tipX = targetPos.left;
        tipY = targetPos.top + centerY;
        direction = 'right';
        break;
        
      case 'e2e': // End-to-End: Arrow points LEFT into end of target
        tipX = targetPos.left + targetPos.width;
        tipY = targetPos.top + centerY;
        direction = 'left';
        break;
        
      case 's2e': // Start-to-Finish: Arrow points LEFT into end of target
        tipX = targetPos.left + targetPos.width;
        tipY = targetPos.top + centerY;
        direction = 'left';
        break;
    }

    // Create arrow triangle pointing in the correct direction
    const arrowSize = 8;
    const arrowWidth = 6;
    
    if (direction === 'right') {
      // Right-pointing arrow (pointing into the task from left)
      return {
        path: `M ${tipX} ${tipY} L ${tipX - arrowSize} ${tipY - arrowWidth} L ${tipX - arrowSize} ${tipY + arrowWidth} Z`,
        tipX,
        tipY
      };
    } else {
      // Left-pointing arrow (pointing into the task from right)
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
