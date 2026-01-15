import React, { useState, useMemo } from 'react';
import { Popover, Input, List, Radio, Select, InputNumber, Button, Space, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { Task, Link } from './types';
import { convertLagToDays } from './utils/dependencyParser';

const { Text, Paragraph, Link: AntdLink } = Typography;
const { Option } = Select;

interface DependencyPopoverProps {
    task: Task;
    allTasks: Task[];
    links: Link[];
    onAddDependency: (sourceId: string, targetId: string, type: Link['type'], lag?: number) => void;
    children: React.ReactNode;
}

export const DependencyPopover: React.FC<DependencyPopoverProps> = ({
    task,
    allTasks,
    onAddDependency,
    children,
}) => {
    const [visible, setVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
    const [dependencyType, setDependencyType] = useState<Link['type']>('e2s');
    const [delayType, setDelayType] = useState<'lag' | 'lead'>('lag');
    const [spanValue, setSpanValue] = useState<number>(0);
    const [showPreview, setShowPreview] = useState(true);
    const spanUnit = 'day';

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

    const renderDiagram = () => {
        if (!showPreview) return null;

        const isFS = dependencyType === 'e2s';
        const isSS = dependencyType === 's2s';
        const isFF = dependencyType === 'e2e';
        const isSF = dependencyType === 's2e';

        // Coordinates based on 300x120 viewBox
        // T2 center Y: 40, T3 center Y: 90
        // Bars are 120 wide, 24 high.
        let t2x = 0, t3x = 0;
        let pathD = "";
        let guideX = 0;
        let secondaryGuideX = -1;

        if (isFS) {
            t2x = 20; t3x = 160;
            guideX = 140; // T2 End
            secondaryGuideX = 160; // T3 Start
            pathD = "M 140 40 L 150 40 C 160 40, 160 90, 150 90 L 160 90";
        } else if (isFF) {
            t2x = 60; t3x = 60;
            guideX = 180; // Both End
            secondaryGuideX = -1;
            pathD = "M 180 40 L 200 40 L 200 90 L 180 90";
        } else if (isSS) {
            t2x = 100; t3x = 100;
            guideX = 100; // Both Start
            secondaryGuideX = -1;
            pathD = "M 100 40 L 80 40 L 80 90 L 100 90";
        } else if (isSF) {
            t2x = 160; t3x = 20;
            guideX = 160; // T2 Start
            secondaryGuideX = 140; // T3 End
            pathD = "M 160 40 L 150 40 C 140 40, 140 90, 150 90 L 140 90";
        }

        return (
            <div style={{
                width: '100%',
                height: 120,
                backgroundColor: '#fff',
                borderRadius: 4,
                marginBottom: 10,
                border: '1px solid #e9ecef',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%' }}>
                    {/* Vertical guide lines (dashed) */}
                    <line x1={guideX} x2={guideX} y1="0" y2="120" stroke="#f0f0f0" strokeDasharray="3,3" />
                    {secondaryGuideX !== -1 && <line x1={secondaryGuideX} x2={secondaryGuideX} y1="0" y2="120" stroke="#f0f0f0" strokeDasharray="3,3" />}

                    {/* Task bars */}
                    <rect x={t2x} y="28" width="120" height="24" rx="4" fill="#bae7ff" stroke="#69c0ff" />
                    <text x={t2x + 60} y="44" fontSize="11" textAnchor="middle" fill="#0050b3">Task 2</text>

                    <rect x={t3x} y="78" width="120" height="24" rx="4" fill="#bae7ff" stroke="#69c0ff" />
                    <text x={t3x + 60} y="94" fontSize="11" textAnchor="middle" fill="#0050b3">Task 3</text>

                    {/* Connector Path */}
                    <path d={pathD} fill="none" stroke="#8c8c8c" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#8c8c8c" />
                        </marker>
                    </defs>
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
        <div style={{ display: 'flex', width: 620, height: 480, backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Left Panel: Search and List */}
            <div style={{ flex: 1, borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', padding: 0 }}>
                <div style={{ padding: '12px' }}>
                    <Input
                        placeholder="Search task..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ marginBottom: 8 }}
                        autoFocus
                        size="large"
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
                                    backgroundColor: selectedSourceId === t.id ? '#f0f7ff' : 'transparent',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <Text type="secondary" style={{ width: 20 }}>{allTasks.indexOf(t) + 1}</Text>
                                    <Text>{t.text}</Text>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 10, color: '#bfbfbf' }} />
                            </List.Item>
                        )}
                    />
                </div>
            </div>

            {/* Right Panel: Settings */}
            <div style={{ width: 340, padding: '24px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text strong>Dependency type</Text>
                    <AntdLink
                        style={{ fontSize: '12px' }}
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? 'Hide preview' : 'Show preview'}
                    </AntdLink>
                </div>

                {renderDiagram()}

                <Paragraph style={{ fontSize: '13px', color: '#262626', marginBottom: 20, minHeight: 48, lineHeight: '1.6' }}>
                    {getDescription()}
                </Paragraph>

                <Radio.Group
                    value={dependencyType}
                    onChange={e => setDependencyType(e.target.value)}
                    style={{ width: '100%', marginBottom: 20 }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Radio value="e2s">Finish to Start</Radio>
                            <Text type="secondary">FS</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Radio value="e2e">Finish to Finish</Radio>
                            <Text type="secondary">FF</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Radio value="s2s">Start to Start</Radio>
                            <Text type="secondary">SS</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Radio value="s2e">Start to Finish</Radio>
                            <Text type="secondary">SF</Text>
                        </div>
                    </Space>
                </Radio.Group>

                <div style={{ display: 'flex', gap: '10px', marginBottom: 20 }}>
                    <div style={{ flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 4 }}>Delay type</Text>
                        <Select value={delayType} onChange={v => setDelayType(v)} style={{ width: '100%' }} size="large">
                            <Option value="lag">Lag by</Option>
                            <Option value="lead">Lead by</Option>
                        </Select>
                    </div>
                    <div style={{ width: 100 }}>
                        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 4 }}>Days</Text>
                        <Space.Compact style={{ width: '100%' }}>
                            <InputNumber
                                min={0}
                                value={spanValue}
                                onChange={v => setSpanValue(v || 0)}
                                style={{ width: '100%' }}
                                placeholder="0"
                                size="large"
                            />
                        </Space.Compact>
                    </div>
                </div>

                <Button
                    type="primary"
                    block
                    onClick={handleAdd}
                    disabled={!selectedSourceId}
                    style={{ marginTop: 'auto', backgroundColor: '#5c67f2', height: 44, borderRadius: '6px' }}
                >
                    Add
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
