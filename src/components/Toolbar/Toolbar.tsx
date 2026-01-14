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
    faCalendarCheck,
    faUndo,
    faRedo,
} from '@fortawesome/free-solid-svg-icons';
import { FilterSearch } from './FilterSearch';
import type { FilterOptions } from './FilterSearch';

interface ToolbarProps {
    zoomLevel: number;
    setZoomLevel: (zoom: number) => void;
    onBaselineToggle: () => void;
    showBaselines: boolean;
    onExport: (type: 'csv' | 'excel' | 'json' | 'pdf') => void;
    onFilterChange: (filters: FilterOptions) => void;
    onUndo?: () => void;
    onRedo?: () => void;
    owners: string[];
}

export const Toolbar: React.FC<ToolbarProps> = ({
    zoomLevel,
    setZoomLevel,
    onBaselineToggle,
    showBaselines,
    onExport,
    onFilterChange,
    onUndo,
    onRedo,
    owners,
}) => {
    return (
        <div className="gantt-toolbar-wrapper">
            <div className="gantt-toolbar">
                <div className="gantt-toolbar-left">
                    <Space size={8}>
                        <Button
                            type={showBaselines ? "primary" : "default"}
                            icon={<FontAwesomeIcon icon={faCalendarCheck} />}
                            onClick={onBaselineToggle}
                        >
                            {showBaselines ? 'Baselines' : 'Set Baseline'}
                        </Button>

                        <Divider type="vertical" style={{ height: 24, margin: '0 8px' }} />

                        <FilterSearch
                            onFilterChange={onFilterChange}
                            owners={owners}
                        />
                    </Space>
                </div>

                <div className="gantt-toolbar-right">
                    <Space size={4}>
                        <Tooltip title="Undo">
                            <Button
                                icon={<FontAwesomeIcon icon={faUndo} />}
                                onClick={onUndo}
                            />
                        </Tooltip>
                        <Tooltip title="Redo">
                            <Button
                                icon={<FontAwesomeIcon icon={faRedo} />}
                                onClick={onRedo}
                            />
                        </Tooltip>

                        <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

                        <Tooltip title="Zoom Out">
                            <Button
                                icon={<FontAwesomeIcon icon={faSearchMinus} />}
                                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                            />
                        </Tooltip>
                        <Tooltip title="Zoom In">
                            <Button
                                icon={<FontAwesomeIcon icon={faSearchPlus} />}
                                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
                            />
                        </Tooltip>
                        <Tooltip title="Reset Zoom">
                            <Button
                                icon={<FontAwesomeIcon icon={faRotateLeft} />}
                                onClick={() => setZoomLevel(1)}
                            />
                        </Tooltip>

                        <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

                        <Tooltip title="Export to CSV">
                            <Button
                                icon={<FontAwesomeIcon icon={faFileCsv} />}
                                onClick={() => onExport('csv')}
                            />
                        </Tooltip>
                        <Tooltip title="Export to Excel">
                            <Button
                                icon={<FontAwesomeIcon icon={faFileExcel} />}
                                onClick={() => onExport('excel')}
                            />
                        </Tooltip>
                        <Tooltip title="Export to JSON">
                            <Button
                                icon={<FontAwesomeIcon icon={faFileCode} />}
                                onClick={() => onExport('json')}
                            />
                        </Tooltip>
                        <Tooltip title="Export to PDF">
                            <Button
                                icon={<FontAwesomeIcon icon={faFilePdf} />}
                                onClick={() => onExport('pdf')}
                            />
                        </Tooltip>
                    </Space>
                </div>
            </div>
        </div>
    );
};
