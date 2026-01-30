import React, { useState, useEffect } from 'react';
import { Popover, Select, InputNumber, Button, Typography } from 'antd';
import type { Task, Link, GanttStyleConfig } from './types';
import { convertLagToDays } from './utils/dependencyParser';
import { formatDate } from './utils/dateUtils';
import { applyStyleConfig } from './utils/styleUtils';

const { Text, Paragraph } = Typography;
const { Option } = Select;

interface DependencyPopoverProps {
    task: Task;
    allTasks: Task[];
    links: Link[];
    onAddDependency: (sourceId: string, targetId: string, type: Link['type'], lag?: number) => void;
    onRemoveDependency?: (linkId: string) => void;
    children: React.ReactNode;
    styleConfig?: Partial<GanttStyleConfig>;
}

export const DependencyPopover: React.FC<DependencyPopoverProps> = ({
    task,
    allTasks,
    links,
    onAddDependency,
    onRemoveDependency,
    children,
    styleConfig,
}) => {
    const styles = applyStyleConfig(styleConfig);
    const [visible, setVisible] = useState(false);
    const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
    const [dependencyType, setDependencyType] = useState<Link['type']>('e2s');
    const [delayType, setDelayType] = useState<'lag' | 'lead'>('lag');
    const [spanValue, setSpanValue] = useState<number>(0);
    const [showPreview, setShowPreview] = useState(true);
    const spanUnit = 'day';

    // Check if task already has a dependency
    const existingDependency = links.find(l => l.target === task.id);
    const hasDependency = !!existingDependency;

    // Calculate the earliest start date from all tasks (Gantt start date)
    const ganttStartDate = React.useMemo(() => {
        if (allTasks.length === 0) return new Date();
        return new Date(Math.min(...allTasks.map(t => t.start.getTime())));
    }, [allTasks]);

    const handleAdd = () => {
        if (selectedSourceId) {
            const lagMagnitude = delayType === 'lag' ? spanValue : -spanValue;
            const lagInDays = convertLagToDays(lagMagnitude, spanUnit);
            onAddDependency(selectedSourceId, task.id, dependencyType, lagInDays);
            setVisible(false);
            resetState();
        }
    };

    const resetState = () => {
        setSelectedSourceId(null);
        setDependencyType('e2s');
        setDelayType('lag');
        setSpanValue(0);
    };

    const handleRemove = () => {
        if (existingDependency && onRemoveDependency) {
            onRemoveDependency(existingDependency.id);
            setVisible(false);
            resetState();
        }
    };

    // Load existing dependency values when popover opens
    useEffect(() => {
        if (visible) {
            // Always show preview when opening
            setShowPreview(true);

            if (existingDependency) {
                setSelectedSourceId(existingDependency.source);
                setDependencyType(existingDependency.type);

                // Handle lag/lead
                const lag = existingDependency.lag || 0;
                if (lag >= 0) {
                    setDelayType('lag');
                    setSpanValue(lag);
                } else {
                    setDelayType('lead');
                    setSpanValue(Math.abs(lag));
                }
            }
        }
    }, [visible, existingDependency]);

    const renderDiagram = () => {
        if (!showPreview) return null;

        const isFS = dependencyType === 'e2s';
        const isSS = dependencyType === 's2s';
        const isFF = dependencyType === 'e2e';
        const isSF = dependencyType === 's2e';

        // Coordinates based on 600x200 viewBox
        // T2 center Y: 60, T3 center Y: 140
        // Bars are 200 wide, 40 high.
        let t2x = 0, t3x = 0;
        let pathD = "";
        let guideX = 0;
        let secondaryGuideX = -1;

        if (isFS) {
            t2x = 50; t3x = 350;
            guideX = 250;
            secondaryGuideX = 350;
            pathD = "M 250 60 L 300 60 L 300 140 L 348 140";
        } else if (isFF) {
            t2x = 100; t3x = 100;
            guideX = 300;
            secondaryGuideX = -1;
            pathD = "M 300 60 L 350 60 L 350 140 L 302 140";
        } else if (isSS) {
            t2x = 250; t3x = 250;
            guideX = 250;
            secondaryGuideX = -1;
            pathD = "M 250 60 L 200 60 L 200 140 L 248 140";
        } else if (isSF) {
            t2x = 350; t3x = 50;
            guideX = 350;
            secondaryGuideX = 250;
            pathD = "M 350 60 L 300 60 L 300 140 L 252 140";
        }

        const isStartDateSelected = selectedSourceId === 'gantt-start-date';
        const selectedTask = allTasks.find(t => t.id === selectedSourceId);

        return (
            <div style={{
                width: '100%',
                height: 90,
                backgroundColor: '#fbfbfb',
                borderRadius: 4,
                marginBottom: 12,
                border: '1px solid #f0f0f0',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
            }}>
                <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <marker id="arrowhead" markerWidth="12" markerHeight="9" refX="12" refY="4.5" orient="auto">
                            <polygon points="0 0, 12 4.5, 0 9" fill="#8c8c8c" />
                        </marker>
                    </defs>

                    {/* Vertical guide lines (dashed) */}
                    <line x1={guideX} x2={guideX} y1="0" y2="200" stroke="#f0f0f0" strokeDasharray="3,3" />
                    {secondaryGuideX !== -1 && <line x1={secondaryGuideX} x2={secondaryGuideX} y1="0" y2="200" stroke="#f0f0f0" strokeDasharray="3,3" />}

                    {/* Task bars */}
                    <rect x={t2x} y="35" width="200" height="50" rx="4" fill="#e6f4ff" stroke="#91caff" strokeWidth="2" />
                    <text x={t2x + 100} y="66" fontSize="15" textAnchor="middle" fill="#003a8c" fontWeight="600">
                        {isStartDateSelected ? 'Start Date' : (selectedTask ? `Stage ${allTasks.indexOf(selectedTask) + 1}` : 'Predecessor')}
                    </text>

                    <rect x={t3x} y="115" width="200" height="50" rx="4" fill="#e6f4ff" stroke="#91caff" strokeWidth="2" />
                    <text x={t3x + 100} y="146" fontSize="15" textAnchor="middle" fill="#003a8c" fontWeight="600">
                        Stage {allTasks.indexOf(task) + 1}
                    </text>

                    {/* Connector Path */}
                    <path d={pathD} fill="none" stroke="#8c8c8c" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
                </svg>
            </div>
        );
    };

    const getDescription = () => {
        const isStartDateSelected = selectedSourceId === 'gantt-start-date';
        const sourceTask = allTasks.find(t => t.id === selectedSourceId);

        if (!selectedSourceId) return "Select a checklist from the list to see how it will relate to the current stage.";

        const taskNum = allTasks.indexOf(task) + 1;
        const sourceLabel = isStartDateSelected ? 'Start Date' : `Stage ${allTasks.indexOf(sourceTask!) + 1}`;

        let baseDescription = "";
        switch (dependencyType) {
            case 'e2s': baseDescription = `Stage ${taskNum} starts after ${sourceLabel} finishes`; break;
            case 's2s': baseDescription = `Stage ${taskNum} starts when ${sourceLabel} starts`; break;
            case 'e2e': baseDescription = `Stage ${taskNum} finishes when ${sourceLabel} finishes`; break;
            case 's2e': baseDescription = `Stage ${taskNum} finishes when ${sourceLabel} starts`; break;
        }

        if (spanValue > 0) {
            const lagStr = `${spanValue} ${spanUnit}${spanValue > 1 ? 's' : ''}`;
            if (delayType === 'lag') {
                baseDescription += ` + ${lagStr} delay`;
            } else {
                baseDescription += ` - ${lagStr} overlap`;
            }
        }

        return baseDescription + ".";
    };

    const content = (
        <div style={{
            width: 550,
            backgroundColor: styles.popover?.backgroundColor || '#fff',
            borderRadius: styles.popover?.borderRadius || '8px',
            padding: '16px 20px',
            boxShadow: styles.popover?.boxShadow,
            fontFamily: styles.popover?.fontFamily
        }}>
            <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: 16, color: styles.font?.color }}>
                Add Dependency
            </Text>

            {/* Task Selection and Dependency Type */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                    <Select
                        showSearch
                        placeholder="Select checklist"
                        value={selectedSourceId}
                        onChange={setSelectedSourceId}
                        style={{ width: '100%' }}
                        filterOption={(input, option) => {
                            // Handle special "Start Date" option
                            if (option?.value === 'gantt-start-date') {
                                return 'start date'.includes(input.toLowerCase());
                            }

                            const task = allTasks.find(t => t.id === option?.value);
                            if (!task) return false;
                            const taskNum = allTasks.indexOf(task) + 1;
                            return (
                                task.text.toLowerCase().includes(input.toLowerCase()) ||
                                taskNum.toString().includes(input)
                            );
                        }}
                        optionLabelProp="label"
                    >
                        {allTasks
                            .filter(t => t.id !== task.id)
                            .map(t => (
                                <Option key={t.id} value={t.id} label={t.text}>
                                    <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0' }}>
                                        <Text style={{ fontSize: '13px' }}>{allTasks.indexOf(t) + 1}. {t.text}</Text>
                                        <Text type="secondary" style={{ fontSize: '11px' }}>
                                            Start: {formatDate(t.start, 'MMM D, YYYY')}
                                        </Text>
                                    </div>
                                </Option>
                            ))}
                        {/* Start Date Option */}
                        <Option key="gantt-start-date" value="gantt-start-date" label="Start Date">
                            <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0', borderTop: '1px solid #f0f0f0', marginTop: '4px', paddingTop: '8px' }}>
                                <Text style={{ fontSize: '13px', fontWeight: 600 }}>Start Date</Text>
                                <Text type="secondary" style={{ fontSize: '11px' }}>
                                    {formatDate(ganttStartDate, 'MMM D, YYYY')}
                                </Text>
                            </div>
                        </Option>
                    </Select>
                </div>
                <div style={{ width: 100 }}>
                    <Select
                        value={dependencyType}
                        onChange={setDependencyType}
                        style={{ width: '100%' }}
                    >
                        <Option value="e2s">FS</Option>
                        <Option value="e2e">FF</Option>
                        <Option value="s2s">SS</Option>
                        <Option value="s2e">SF</Option>
                    </Select>
                </div>
            </div>

            {/* Delay Type and Days */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                    <Text style={{ fontSize: '12px', display: 'block', marginBottom: 6, color: styles.font?.color }}>
                        Delay type
                    </Text>
                    <Select
                        value={delayType}
                        onChange={setDelayType}
                        style={{ width: '100%' }}
                    >
                        <Option value="lag">Lag by</Option>
                        <Option value="lead">Lead by</Option>
                    </Select>
                </div>
                <div style={{ flex: 1 }}>
                    <Text style={{ fontSize: '12px', display: 'block', marginBottom: 6, color: styles.font?.color }}>
                        Days
                    </Text>
                    <InputNumber
                        min={0}
                        value={spanValue}
                        onChange={v => setSpanValue(v || 0)}
                        style={{ width: '100%' }}
                        placeholder="0"
                    />
                </div>
            </div>

            {/* Dependency Type Reference */}
            <div style={{
                backgroundColor: '#f5f5f5',
                padding: '10px 12px',
                borderRadius: '4px',
                marginBottom: 14
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <Text style={{ fontSize: '11px', color: styles.font?.color }}>FS: Finish to Start</Text>
                    <Text style={{ fontSize: '11px', color: styles.font?.color }}>SS: Start to Start</Text>
                    <Text style={{ fontSize: '11px', color: styles.font?.color }}>FF: Finish to Finish</Text>
                    <Text style={{ fontSize: '11px', color: styles.font?.color }}>SF: Start to Finish</Text>
                </div>
            </div>

            {/* Preview Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text strong style={{ fontSize: '13px', color: styles.font?.color }}>
                    Dependency preview
                </Text>
                <a
                    onClick={() => setShowPreview(!showPreview)}
                    style={{
                        fontSize: '12px',
                        color: '#1890ff',
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}
                >
                    {showPreview ? 'Hide preview' : 'Show preview'}
                </a>
            </div>

            {showPreview && (
                <>
                    {renderDiagram()}
                    <Paragraph style={{
                        fontSize: '12px',
                        color: styles.font?.color || '#262626',
                        marginBottom: 14,
                        lineHeight: '1.5'
                    }}>
                        {getDescription()}
                    </Paragraph>
                </>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                {hasDependency && (
                    <Button
                        danger
                        onClick={handleRemove}
                        style={{
                            ...styles.buttonDanger,
                        }}
                    >
                        Remove Dependency
                    </Button>
                )}
                <Button
                    type="primary"
                    onClick={handleAdd}
                    disabled={!selectedSourceId}
                    style={{
                        ...styles.buttonPrimary,
                        minWidth: 100
                    }}
                >
                    {hasDependency ? 'Update' : 'Add'}
                </Button>
            </div>
        </div>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            open={visible}
            onOpenChange={setVisible}
            placement="bottomLeft"
            overlayClassName="dependency-popover"
            overlayInnerStyle={{ padding: 0 }}
        >
            {children}
        </Popover>
    );
};
