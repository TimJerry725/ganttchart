/**
 * Inline editor for tasks
 */

import React, { useState, useRef, useEffect } from 'react';
import type { Task } from '../types';

export interface InlineEditorProps {
  task: Task;
  field: string;
  value: string | number;
  onSave: (value: string | number) => void;
  onCancel: () => void;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  task,
  field,
  value,
  onSave,
  onCancel,
}) => {
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(field === 'duration' || field === 'progress' ? Number(editValue) : editValue);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type={field === 'duration' || field === 'progress' ? 'number' : 'text'}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={() => onSave(field === 'duration' || field === 'progress' ? Number(editValue) : editValue)}
      onKeyDown={handleKeyDown}
      className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{ minWidth: '80px' }}
    />
  );
};
