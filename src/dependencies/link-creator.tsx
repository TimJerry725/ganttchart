/**
 * Link creation UI (drag to create links)
 */

import React, { useState, useRef, useEffect } from 'react';
import type { TaskId, LinkType } from '../types';

export interface LinkCreationState {
  isCreating: boolean;
  sourceTaskId?: TaskId;
  targetTaskId?: TaskId;
  previewX?: number;
  previewY?: number;
}

export interface LinkCreatorProps {
  onLinkCreate: (sourceId: TaskId, targetId: TaskId, type: LinkType) => void;
  onCancel: () => void;
}

export const LinkCreator: React.FC<LinkCreatorProps> = ({ onLinkCreate, onCancel }) => {
  const [state, setState] = useState<LinkCreationState>({ isCreating: false });

  const handleStart = (taskId: TaskId, x: number, y: number) => {
    setState({
      isCreating: true,
      sourceTaskId: taskId,
      previewX: x,
      previewY: y,
    });
  };

  const handleUpdate = (x: number, y: number) => {
    if (state.isCreating) {
      setState((prev) => ({ ...prev, previewX: x, previewY: y }));
    }
  };

  const handleEnd = (taskId: TaskId) => {
    if (state.isCreating && state.sourceTaskId && state.sourceTaskId !== taskId) {
      onLinkCreate(state.sourceTaskId, taskId, 'finish-to-start');
    }
    setState({ isCreating: false });
  };

  // Expose methods via ref or context
  useEffect(() => {
    // This would be connected to the timeline renderer
  }, []);

  if (!state.isCreating || !state.sourceTaskId || !state.previewX || !state.previewY) {
    return null;
  }

  return (
    <svg
      className="absolute pointer-events-none z-50"
      style={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <line
        x1={state.previewX}
        y1={state.previewY}
        x2={state.previewX}
        y2={state.previewY}
        stroke="#1890ff"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    </svg>
  );
};
