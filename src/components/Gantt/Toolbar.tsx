import React from 'react';
import { Button, Space, Tooltip, Divider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearchPlus,
    faSearchMinus,
    faRotateLeft,
    faFileCsv,
    faFileExcel,
    faFileCode,
    faFilePdf,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FilterSearch } from './features/FilterSearch';
import type { FilterOptions } from './features/FilterSearch';
import type { GanttUIConfig, GanttIconConfig } from './types';

// Helper to render icon (custom component or FontAwesome)
const renderIcon = (icon: React.ReactNode | string | undefined, defaultIcon: any): React.ReactNode => {
  if (!icon) return <FontAwesomeIcon icon={defaultIcon} />;
  if (typeof icon === 'string') {
    // If string, try to find FontAwesome icon by name (simplified - you may want to use a mapping)
    return <FontAwesomeIcon icon={defaultIcon} />;
  }
  return icon as React.ReactNode;
};

interface ToolbarProps {
    zoomLevel: number;
    setZoomLevel: (zoom: number) => void;
    onBaselineToggle?: () => void; // Optional, not used when baselines always visible
    showBaselines?: boolean; // Optional, not used when baselines always visible
    onExport: (type: 'csv' | 'excel' | 'json' | 'pdf') => void;
    onFilterChange: (filters: FilterOptions) => void;
    owners: string[];
    onAddTask?: () => void;
    uiConfig: GanttUIConfig;
    iconConfig?: Partial<GanttIconConfig>;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    zoomLevel,
    setZoomLevel,
    onExport,
    onFilterChange,
    owners,
    onAddTask,
    uiConfig,
    iconConfig = {},
}) => {
    const showZoom = uiConfig.showZoomButtons !== false;
    const showExport = uiConfig.showExportButtons !== false;
    const showDivider = showZoom && showExport;

    return (
        <div className="gantt-toolbar-wrapper">
            <div className="gantt-toolbar">
                <div className="gantt-toolbar-left">
                    <Space size={8}>
                        {uiConfig.showAddTaskButton !== false && (
                            <Button
                                type="primary"
                                icon={renderIcon(iconConfig.addTask, faPlus)}
                                onClick={onAddTask}
                            >
                                {uiConfig.addTaskButtonText || 'New Task'}
                            </Button>
                        )}
                        {/* Baseline button removed - baselines are always visible and auto-created */}
                    </Space>
                </div>

                <div className="gantt-toolbar-right">
                    <Space size={4}>
                        {showZoom && (
                            <>
                                <Tooltip title={uiConfig.zoomOutTooltip || "Zoom Out"}>
                                    <Button
                                        icon={renderIcon(iconConfig.zoomOut, faSearchMinus)}
                                        onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                                    />
                                </Tooltip>
                                <Tooltip title={uiConfig.zoomInTooltip || "Zoom In"}>
                                    <Button
                                        icon={renderIcon(iconConfig.zoomIn, faSearchPlus)}
                                        onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
                                    />
                                </Tooltip>
                                <Tooltip title={uiConfig.resetZoomTooltip || "Reset Zoom"}>
                                    <Button
                                        icon={renderIcon(iconConfig.resetZoom, faRotateLeft)}
                                        onClick={() => setZoomLevel(1)}
                                    />
                                </Tooltip>
                            </>
                        )}

                        {showDivider && <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />}

                        {showExport && (
                            <>
                                <Tooltip title={uiConfig.exportCSVTooltip || "Export to CSV"}>
                                    <Button
                                        icon={renderIcon(iconConfig.exportCSV, faFileCsv)}
                                        onClick={() => onExport('csv')}
                                    />
                                </Tooltip>
                                <Tooltip title={uiConfig.exportExcelTooltip || "Export to Excel"}>
                                    <Button
                                        icon={renderIcon(iconConfig.exportExcel, faFileExcel)}
                                        onClick={() => onExport('excel')}
                                    />
                                </Tooltip>
                                <Tooltip title={uiConfig.exportJSONTooltip || "Export to JSON"}>
                                    <Button
                                        icon={renderIcon(iconConfig.exportJSON, faFileCode)}
                                        onClick={() => onExport('json')}
                                    />
                                </Tooltip>
                                <Tooltip title={uiConfig.exportPDFTooltip || "Export to PDF"}>
                                    <Button
                                        icon={renderIcon(iconConfig.exportPDF, faFilePdf)}
                                        onClick={() => onExport('pdf')}
                                    />
                                </Tooltip>
                            </>
                        )}
                    </Space>
                </div>
            </div>

            {uiConfig.showFilterSearch !== false && (
                <FilterSearch
                    onFilterChange={onFilterChange}
                    owners={owners}
                    uiConfig={uiConfig}
                />
            )}
        </div>
    );
};
