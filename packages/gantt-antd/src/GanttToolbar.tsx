/**
 * Ant Design toolbar component
 */

import React from 'react';
import { Button, Space, Select, Tooltip } from 'antd';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  UndoOutlined,
  RedoOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import type { TimeScale } from '@gantt/renderer';

export interface GanttToolbarProps {
  timeScale: TimeScale;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomChange?: (unit: TimeScale['unit']) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onExport?: (format: 'csv' | 'json' | 'png' | 'pdf') => void;
  onPrint?: () => void;
}

export const GanttToolbar: React.FC<GanttToolbarProps> = ({
  timeScale,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onExport,
  onPrint,
}) => {
  return (
    <div style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
      <Space>
        <Select
          value={timeScale.unit}
          onChange={onZoomChange}
          style={{ width: 120 }}
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Quarter', value: 'quarter' },
            { label: 'Year', value: 'year' },
          ]}
        />

        <Tooltip title="Zoom In">
          <Button icon={<ZoomInOutlined />} onClick={onZoomIn} />
        </Tooltip>

        <Tooltip title="Zoom Out">
          <Button icon={<ZoomOutOutlined />} onClick={onZoomOut} />
        </Tooltip>

        <Tooltip title="Undo">
          <Button icon={<UndoOutlined />} onClick={onUndo} disabled={!canUndo} />
        </Tooltip>

        <Tooltip title="Redo">
          <Button icon={<RedoOutlined />} onClick={onRedo} disabled={!canRedo} />
        </Tooltip>

        <Select
          placeholder="Export"
          style={{ width: 120 }}
          onSelect={onExport}
          options={[
            { label: 'CSV', value: 'csv' },
            { label: 'JSON', value: 'json' },
            { label: 'PNG', value: 'png' },
            { label: 'PDF', value: 'pdf' },
          ]}
        />

        <Tooltip title="Print">
          <Button icon={<PrinterOutlined />} onClick={onPrint} />
        </Tooltip>
      </Space>
    </div>
  );
};
