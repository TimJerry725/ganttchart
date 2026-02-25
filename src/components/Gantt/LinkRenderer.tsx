import React from 'react';
import type { Task, Link } from './types';

interface LinkRendererProps {
  links: Link[];
  tasks: Task[];
  getTaskPosition: (task: Task) => { left: number; top: number; width: number; height: number };
}

export const LinkRenderer: React.FC<LinkRendererProps> = ({ links, tasks, getTaskPosition }) => {
  const taskById = React.useMemo(() => {
    const map = new Map<string, Task>();
    tasks.forEach((task) => map.set(task.id, task));
    return map;
  }, [tasks]);

  const getTaskById = (id: string): Task | undefined => taskById.get(id);

  const linkLaneInfo = React.useMemo(() => {
    const outgoingCountByTaskId = new Map<string, number>();
    const incomingCountByTaskId = new Map<string, number>();
    const outgoingIndexByLinkId = new Map<string, number>();
    const incomingIndexByLinkId = new Map<string, number>();

    links.forEach((link) => {
      outgoingCountByTaskId.set(link.source, (outgoingCountByTaskId.get(link.source) || 0) + 1);
      incomingCountByTaskId.set(link.target, (incomingCountByTaskId.get(link.target) || 0) + 1);
    });

    const outgoingSeenByTaskId = new Map<string, number>();
    const incomingSeenByTaskId = new Map<string, number>();

    links.forEach((link) => {
      const outIdx = outgoingSeenByTaskId.get(link.source) || 0;
      outgoingIndexByLinkId.set(link.id, outIdx);
      outgoingSeenByTaskId.set(link.source, outIdx + 1);

      const inIdx = incomingSeenByTaskId.get(link.target) || 0;
      incomingIndexByLinkId.set(link.id, inIdx);
      incomingSeenByTaskId.set(link.target, inIdx + 1);
    });

    return {
      outgoingCountByTaskId,
      incomingCountByTaskId,
      outgoingIndexByLinkId,
      incomingIndexByLinkId,
    };
  }, [links]);

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

  const getEndpointOffset = (index: number, taskHeight: number): number => {
    const laneGap = Math.max(3, Math.round(taskHeight / 7));
    const maxOffset = Math.max(2, taskHeight / 2 - 2);
    return Math.min((index + 1) * laneGap, maxOffset);
  };

  const createGeometry = (link: Link): { path: string; arrow: string } => {
    const source = getTaskById(link.source);
    const target = getTaskById(link.target);

    if (!source || !target) return { path: '', arrow: '' };

    const sPos = getTaskPosition(source);
    const tPos = getTaskPosition(target);

    // Both source and target Y should be at the exact vertical center of the bar
    const sourceHasBoth = (linkLaneInfo.outgoingCountByTaskId.get(source.id) || 0) > 0
      && (linkLaneInfo.incomingCountByTaskId.get(source.id) || 0) > 0;
    const targetHasBoth = (linkLaneInfo.outgoingCountByTaskId.get(target.id) || 0) > 0
      && (linkLaneInfo.incomingCountByTaskId.get(target.id) || 0) > 0;

    // If a task has both incoming and outgoing links, offset the endpoints so "in" and "out"
    // don't share the same line on a single bar.
    const sY = (sPos.top + sPos.height / 2) + (sourceHasBoth
      ? getEndpointOffset(linkLaneInfo.outgoingIndexByLinkId.get(link.id) || 0, sPos.height)
      : 0);
    const tY = (tPos.top + tPos.height / 2) - (targetHasBoth
      ? getEndpointOffset(linkLaneInfo.incomingIndexByLinkId.get(link.id) || 0, tPos.height)
      : 0);

    const ROUTING = {
      sourceStub: 14,
      targetStub: 8,
      detourPadding: 24,
      minHorizontalSpan: 18,
      arrowGap: 2,
      arrowLength: 14,
      arrowWidth: 14,
      arrowStemOverlap: 1,
      chevronNotchDepth: 5,
    };

    let sX = 0;
    let tX = 0;
    let sourceOutDir: 1 | -1 = 1;
    let targetInDir: 1 | -1 = 1;

    switch (link.type) {
      case 'e2s':
        sX = sPos.left + sPos.width;
        tX = tPos.left;
        sourceOutDir = 1;
        targetInDir = 1;
        break;
      case 's2s':
        sX = sPos.left;
        tX = tPos.left;
        sourceOutDir = -1;
        targetInDir = 1;
        break;
      case 'e2e':
        sX = sPos.left + sPos.width;
        tX = tPos.left + tPos.width;
        sourceOutDir = 1;
        targetInDir = -1;
        break;
      case 's2e':
        sX = sPos.left;
        tX = tPos.left + tPos.width;
        sourceOutDir = -1;
        targetInDir = -1;
        break;
    }

    const sourceStubX = sX + sourceOutDir * ROUTING.sourceStub;
    const arrowTipX = tX - targetInDir * ROUTING.arrowGap;
    const arrowBaseX = arrowTipX - targetInDir * ROUTING.arrowLength;
    const arrowNotchX = arrowBaseX + targetInDir * ROUTING.chevronNotchDepth;
    const targetStubX = arrowNotchX - targetInDir * ROUTING.targetStub;
    const arrowJoinX = arrowNotchX + targetInDir * ROUTING.arrowStemOverlap;

    const isCrossRow = Math.abs(tY - sY) > 1;
    let points: Array<{ x: number; y: number }>;

    if (isCrossRow) {
      const laneGap = 6;
      const movingDown = tY > sY;
      // Keep the long horizontal segment near the source row, not in the middle rows.
      // This avoids links visually "starting" from an intermediate task row.
      let laneY = movingDown
        ? Math.min(sPos.top + sPos.height + laneGap, tPos.top - laneGap)
        : Math.max(sPos.top - laneGap, tPos.top + tPos.height + laneGap);

      // Ensure we keep a small vertical move from both endpoints.
      if (Math.abs(laneY - sY) < 2) {
        laneY = sY + (movingDown ? 2 : -2);
      }
      if (Math.abs(laneY - tY) < 2) {
        laneY = tY + (movingDown ? -2 : 2);
      }

      points = [
        { x: sX, y: sY },
        { x: sourceStubX, y: sY },
        { x: sourceStubX, y: laneY },
        { x: targetStubX, y: laneY },
        { x: targetStubX, y: tY },
        { x: arrowJoinX, y: tY },
      ];
    } else {
      let turnX: number;
      if (sourceOutDir === targetInDir) {
        const hasForwardSpan = sourceOutDir === 1
          ? (targetStubX - sourceStubX) >= ROUTING.minHorizontalSpan
          : (sourceStubX - targetStubX) >= ROUTING.minHorizontalSpan;

        if (hasForwardSpan) {
          turnX = (sourceStubX + targetStubX) / 2;
        } else {
          turnX = sourceOutDir === 1
            ? Math.max(sX, tX) + ROUTING.detourPadding
            : Math.min(sX, tX) - ROUTING.detourPadding;
        }
      } else {
        turnX = sourceOutDir === 1
          ? Math.max(sX, tX) + ROUTING.detourPadding
          : Math.min(sX, tX) - ROUTING.detourPadding;
      }

      points = [
        { x: sX, y: sY },
        { x: sourceStubX, y: sY },
        { x: turnX, y: sY },
        { x: turnX, y: tY },
        { x: targetStubX, y: tY },
        { x: arrowJoinX, y: tY },
      ];
    }

    const compactPoints = points.filter((point, idx) => {
      if (idx === 0) return true;
      const prev = points[idx - 1];
      return Math.abs(point.x - prev.x) > 0.5 || Math.abs(point.y - prev.y) > 0.5;
    });

    const path = compactPoints.length > 0
      ? compactPoints.map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${point.x},${point.y}`).join(' ')
      : '';

    const halfArrowWidth = ROUTING.arrowWidth / 2;
    // Filled chevron arrowhead (closed path with center notch)
    const arrow = `M ${arrowBaseX},${tY - halfArrowWidth} L ${arrowTipX},${tY} L ${arrowBaseX},${tY + halfArrowWidth} L ${arrowNotchX},${tY} Z`;

    return { path, arrow };
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

        const geometry = createGeometry(link);
        const pathD = geometry.path;
        const arrowD = geometry.arrow;

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
