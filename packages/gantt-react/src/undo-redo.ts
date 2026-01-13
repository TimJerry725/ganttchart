/**
 * Undo/Redo integration for React
 */

import { useEffect, useCallback } from 'react';
import { CommandManager } from '@gantt/core';
import type { Command } from '@gantt/core';

export function useUndoRedo(commandManager: CommandManager) {
  const canUndo = commandManager.canUndo();
  const canRedo = commandManager.canRedo();

  const undo = useCallback(() => {
    commandManager.undo();
  }, [commandManager]);

  const redo = useCallback(() => {
    commandManager.redo();
  }, [commandManager]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
  };
}
