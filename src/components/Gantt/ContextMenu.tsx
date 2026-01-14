import React from 'react';
import { Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faCopy,
  faLink,
  faFlag,
  faFolder,
  faTasks,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import type { Task } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onDependencies: () => void;
  onConvertToMilestone: () => void;
  onConvertToTask: () => void;
  onConvertToProject: () => void;
  onAutoSchedule?: () => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  task,
  onEdit,
  onDelete,
  onCopy,
  onDependencies,
  onConvertToMilestone,
  onConvertToTask,
  onConvertToProject,
  onAutoSchedule,
  onClose,
}) => {
  if (!task) return null;

  const menuItems = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <FontAwesomeIcon icon={faEdit} />,
      onClick: () => {
        onEdit();
        onClose();
      },
    },
    {
      key: 'copy',
      label: 'Copy',
      icon: <FontAwesomeIcon icon={faCopy} />,
      onClick: () => {
        onCopy();
        onClose();
      },
    },
    {
      key: 'dependencies',
      label: 'Dependencies',
      icon: <FontAwesomeIcon icon={faLink} />,
      onClick: () => {
        onDependencies();
        onClose();
      },
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'convert',
      label: 'Convert to',
      type: 'submenu' as const,
      children: [
        {
          key: 'milestone',
          label: 'Milestone',
          icon: <FontAwesomeIcon icon={faFlag} />,
          disabled: task.type === 'milestone',
          onClick: () => {
            onConvertToMilestone();
            onClose();
          },
        },
        {
          key: 'task',
          label: 'Task',
          icon: <FontAwesomeIcon icon={faTasks} />,
          disabled: task.type === 'task',
          onClick: () => {
            onConvertToTask();
            onClose();
          },
        },
        {
          key: 'project',
          label: 'Project',
          icon: <FontAwesomeIcon icon={faFolder} />,
          disabled: task.type === 'project',
          onClick: () => {
            onConvertToProject();
            onClose();
          },
        },
      ],
    },
    {
      key: 'auto-schedule',
      label: 'Auto Schedule',
      icon: <FontAwesomeIcon icon={faRotateLeft} />,
      onClick: () => {
        onAutoSchedule?.();
        onClose();
      },
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <FontAwesomeIcon icon={faTrash} />,
      danger: true,
      onClick: () => {
        onDelete();
        onClose();
      },
    },
  ];

  return (
    <div
      className="gantt-context-menu"
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 10000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Menu
        items={menuItems}
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '6px',
          border: '1px solid #e0e0e0',
        }}
      />
    </div>
  );
};
