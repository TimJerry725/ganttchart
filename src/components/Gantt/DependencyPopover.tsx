import React, { useState, useMemo, useEffect } from 'react';
import { Popover, Input, List, Radio, Select, InputNumber, Button, Space, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { Task, Link, GanttStyleConfig } from './types';
import { convertLagToDays } from './utils/dependencyParser';
import { applyStyleConfig } from './utils/styleUtils';

const { Text, Paragraph, Link: AntdLink } = Typography;
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
    const [searchText, setSearchText] = useState('');
    const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
    const [dependencyType, setDependencyType] = useState<Link['type']>('e2s');
    const [delayType, setDelayType] = useState<'lag' | 'lead'>('lag');
    const [spanValue, setSpanValue] = useState<number>(0);
    const [showPreview, setShowPreview] = useState(true);
    const spanUnit = 'day';

    // Check if task already has a dependency
    const existingDependency = links.find(l => l.target === task.id);
    const hasDependency = !!existingDependency;

    const filteredTasks = useMemo(() => {
        if (!searchText) return allTasks.filter(t => t.id !== task.id);
        const searchLower = searchText.toLowerCase();
        return allTasks.filter(t =>
            t.id !== task.id &&
            (t.text.toLowerCase().includes(searchLower) || (allTasks.indexOf(t) + 1).toString().includes(searchLower))
        );
    }, [allTasks, searchText, task.id]);

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
        setSearchText('');
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
            guideX = 250; // T2 End
            secondaryGuideX = 350; // T3 Start
            pathD = "M 250 60 L 300 60 C 350 60, 350 140, 300 140 L 350 140";
        } else if (isFF) {
            t2x = 100; t3x = 100;
            guideX = 300; // Both End
            secondaryGuideX = -1;
            pathD = "M 300 60 L 350 60 L 350 140 L 300 140";
        } else if (isSS) {
            t2x = 250; t3x = 250;
            guideX = 250; // Both Start
            secondaryGuideX = -1;
            pathD = "M 250 60 L 200 60 L 200 140 L 250 140";
        } else if (isSF) {
            t2x = 350; t3x = 50;
            guideX = 350; // T2 Start
            secondaryGuideX = 250; // T3 End
            pathD = "M 350 60 L 300 60 C 250 60, 250 140, 300 140 L 250 140";
        }

        return (
            <div style={{
                width: '100%',
                height: 120,
                backgroundColor: '#fbfbfb',
                borderRadius: 4,
                marginBottom: 16,
                border: '1px solid #f0f0f0',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
            }}>
                <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#8c8c8c" />
                        </marker>
                    </defs>

                    {/* Vertical guide lines (dashed) */}
                    <line x1={guideX} x2={guideX} y1="0" y2="200" stroke="#f0f0f0" strokeDasharray="3,3" />
                    {secondaryGuideX !== -1 && <line x1={secondaryGuideX} x2={secondaryGuideX} y1="0" y2="200" stroke="#f0f0f0" strokeDasharray="3,3" />}

                    {/* Task bars */}
                    <rect x={t2x} y="40" width="200" height="40" rx="4" fill="#e6f4ff" stroke="#91caff" strokeWidth="1.5" />
                    <text x={t2x + 100} y="66" fontSize="13" textAnchor="middle" fill="#003a8c" fontWeight="500">
                        {selectedSourceId ? `Task ${allTasks.indexOf(allTasks.find(t => t.id === selectedSourceId)!) + 1}` : 'Predecessor'}
                    </text>

                    <rect x={t3x} y="120" width="200" height="40" rx="4" fill="#e6f4ff" stroke="#91caff" strokeWidth="1.5" />
                    <text x={t3x + 100} y="146" fontSize="13" textAnchor="middle" fill="#003a8c" fontWeight="500">
                        Task {allTasks.indexOf(task) + 1}
                    </text>

                    {/* Connector Path */}
                    <path d={pathD} fill="none" stroke="#8c8c8c" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </svg>
            </div>
        );
    };

    const getDescription = () => {
        const sourceTask = allTasks.find(t => t.id === selectedSourceId);
        if (!sourceTask) return "Select a task from the list to see how it will relate to the current task.";

        const taskNum = allTasks.indexOf(task) + 1;
        const sourceNum = allTasks.indexOf(sourceTask) + 1;

        let baseDescription = "";
        switch (dependencyType) {
            case 'e2s': baseDescription = `Task ${taskNum} starts after Task ${sourceNum} finishes`; break;
            case 's2s': baseDescription = `Task ${taskNum} starts when Task ${sourceNum} starts`; break;
            case 'e2e': baseDescription = `Task ${taskNum} finishes when Task ${sourceNum} finishes`; break;
            case 's2e': baseDescription = `Task ${taskNum} finishes when Task ${sourceNum} starts`; break;
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
            display: 'flex',
            width: 620,
            height: 540,
            backgroundColor: styles.popover?.backgroundColor || '#fff',
            borderRadius: styles.popover?.borderRadius || '8px',
            overflow: 'hidden',
            boxShadow: styles.popover?.boxShadow,
            fontFamily: styles.popover?.fontFamily
        }}>
            {/* Left Panel: Search and List */}
            <div style={{ flex: 1, borderRight: `1px solid ${styles.popover?.borderColor || '#f0f0f0'}`, display: 'flex', flexDirection: 'column', padding: 0 }}>
                <div style={{ padding: '12px' }}>
                    <Input
                        placeholder="Search task..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{
                            marginBottom: 12,
                            ...styles.input
                        }}
                        autoFocus
                    />
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <List
                        size="small"
                        dataSource={filteredTasks}
                        renderItem={(t) => (
                            <List.Item
                                className={`task-list-item ${selectedSourceId === t.id ? 'selected' : ''}`}
                                onClick={() => setSelectedSourceId(t.id)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '8px 16px',
                                    backgroundColor: selectedSourceId === t.id ? (styles.listItem?.selectedBackground || '#f0f7ff') : 'transparent',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: `1px solid ${styles.listItem?.borderColor || '#f0f0f0'}`
                                }}
                            >
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <Text type="secondary" style={{ width: 20, color: styles.font?.color }}>{allTasks.indexOf(t) + 1}</Text>
                                    <Text style={{ color: styles.font?.color }}>{t.text}</Text>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 10, color: '#bfbfbf' }} />
                            </List.Item>
                        )}
                    />
                </div>
            </div>

            {/* Right Panel: Preview and settings */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text strong style={{ fontSize: '15px', color: styles.font?.color }}>Dependency preview</Text>
                    <AntdLink
                        style={{
                            fontSize: '12px',
                            color: styles.link?.color
                        }}
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? 'Hide preview' : 'Show preview'}
                    </AntdLink>
                </div>

                {renderDiagram()}

                <Paragraph style={{
                    fontSize: '13px',
                    color: styles.font?.color || '#262626',
                    marginBottom: 20,
                    minHeight: 48,
                    lineHeight: '1.6'
                }}>
                    {getDescription()}
                </Paragraph>

                <Radio.Group
                    value={dependencyType}
                    onChange={e => setDependencyType(e.target.value)}
                    style={{ width: '100%', marginBottom: 20 }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Radio value="e2s" style={{ color: styles.font?.color }}>Finish to Start</Radio>
                            <Text type="secondary" style={{ color: styles.font?.color, opacity: 0.6 }}>FS</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Radio value="e2e" style={{ color: styles.font?.color }}>Finish to Finish</Radio>
                            <Text type="secondary" style={{ color: styles.font?.color, opacity: 0.6 }}>FF</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Radio value="s2s" style={{ color: styles.font?.color }}>Start to Start</Radio>
                            <Text type="secondary" style={{ color: styles.font?.color, opacity: 0.6 }}>SS</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Radio value="s2e" style={{ color: styles.font?.color }}>Start to Finish</Radio>
                            <Text type="secondary" style={{ color: styles.font?.color, opacity: 0.6 }}>SF</Text>
                        </div>
                    </Space>
                </Radio.Group>

                <div style={{ display: 'flex', gap: '10px', marginBottom: 20 }}>
                    <div style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: '14px',
                            display: 'block',
                            marginBottom: 8,
                            color: styles.font?.color,
                        }}>Delay type</Text>
                        <Select
                            value={delayType}
                            onChange={v => setDelayType(v)}
                            style={{ width: '100%', ...styles.input }}
                        >
                            <Option value="lag">Lag by</Option>
                            <Option value="lead">Lead by</Option>
                        </Select>
                    </div>
                    <div style={{ width: 100 }}>
                        <Text style={{
                            fontSize: '14px',
                            display: 'block',
                            marginBottom: 8,
                            color: styles.font?.color,
                        }}>Days</Text>
                        <Space.Compact style={{ width: '100%' }}>
                            <InputNumber
                                min={0}
                                value={spanValue}
                                onChange={v => setSpanValue(v || 0)}
                                style={{ width: '100%', ...styles.input }}
                                placeholder="0"
                            />
                        </Space.Compact>
                    </div>
                </div>

                <Space direction="vertical" style={{ width: '100%', marginTop: 'auto' }}>
                    <Button
                        type="primary"
                        block
                        onClick={handleAdd}
                        disabled={!selectedSourceId}
                        style={{
                            ...styles.buttonPrimary,
                            height: 36,
                        }}
                    >
                        {hasDependency ? 'Update' : 'Add'}
                    </Button>
                    {hasDependency && (
                        <Button
                            danger
                            block
                            onClick={handleRemove}
                            style={{
                                ...styles.buttonDanger,
                                height: 36,
                            }}
                        >
                            Remove Dependency
                        </Button>
                    )}
                </Space>
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
