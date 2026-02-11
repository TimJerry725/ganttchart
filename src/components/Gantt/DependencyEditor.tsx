import React, { useState } from 'react';
import { Modal, Select, InputNumber, Button, List, Tag, Typography, Space, Divider, Alert, Card, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLink,
  faTrash,
  faPlus,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { Task, Link, GanttStyleConfig } from './types';
import { parseDependencyString, convertDependencyType, convertLagToDays } from './utils/dependencyParser';
import { applyStyleConfig } from './utils/styleUtils';
import { addToDate } from './utils/dateUtils';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface DependencyEditorProps {
  task: Task;
  allTasks: Task[];
  links: Link[];
  onAddDependency: (sourceId: string, targetId: string, type: Link['type'], lag?: number) => void;
  onRemoveDependency: (linkId: string) => void;
  onTaskUpdate?: (task: Task) => void;
  onClose: () => void;
  styleConfig?: Partial<GanttStyleConfig>;
}

export const DependencyEditor: React.FC<DependencyEditorProps> = ({
  task,
  allTasks,
  links,
  onAddDependency,
  onRemoveDependency,
  onTaskUpdate,
  onClose,
  styleConfig,
}) => {
  const styles = applyStyleConfig(styleConfig);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [dependencyType, setDependencyType] = useState<Link['type']>('e2s');
  const [lagTime, setLagTime] = useState<number>(0);
  const [lagUnit, setLagUnit] = useState<'day' | 'hour' | 'week' | 'month'>('day');
  const [duration, setDuration] = useState<number>(task.duration);
  const [quickAddValue, setQuickAddValue] = useState<string>('');

  // Get existing dependencies
  const existingDependencies = links.filter(link => link.target === task.id);

  // Get available tasks (exclude self and parent chain)
  const availableTasks = allTasks.filter(t => t.id !== task.id && t.id !== task.parent);

  const handleAdd = () => {
    if (selectedTask) {
      const lagInDays = convertLagToDays(lagTime, lagUnit);

      // Update task duration if it changed
      if (duration !== task.duration && onTaskUpdate) {
        const newEndDate = addToDate(new Date(task.start), duration, 'day');
        onTaskUpdate({
          ...task,
          duration: duration,
          end: newEndDate
        });
      }

      onAddDependency(selectedTask, task.id, dependencyType, lagInDays);
      setSelectedTask('');
      setLagTime(0);
      setLagUnit('day');
    }
  };

  const handleQuickAdd = () => {
    if (!quickAddValue.trim()) return;

    const parsed = parseDependencyString(quickAddValue.trim());
    if (!parsed) {
      alert('Invalid format. Use: [TaskNumber][Type][+/-][Lag][Unit]\nExample: 3FS+10d');
      return;
    }

    // Find task by number
    const taskIndex = parsed.taskNumber - 1;
    const sourceTask = allTasks[taskIndex];

    if (!sourceTask) {
      alert(`Task ${parsed.taskNumber} not found`);
      return;
    }

    const linkType = convertDependencyType(parsed.type);
    const lagInDays = convertLagToDays(parsed.lag, parsed.lagUnit);

    onAddDependency(sourceTask.id, task.id, linkType, lagInDays);
    setQuickAddValue('');
  };

  const getDependencyLabel = (type: Link['type']) => {
    switch (type) {
      case 'e2s': return 'Finish-to-Start (FS)';
      case 's2s': return 'Start-to-Start (SS)';
      case 'e2e': return 'Finish-to-Finish (FF)';
      case 's2e': return 'Start-to-Finish (SF)';
    }
  };

  const getDependencyColor = (type: Link['type']) => {
    switch (type) {
      case 'e2s': return 'blue';
      case 's2s': return 'green';
      case 'e2e': return 'purple';
      case 's2e': return 'orange';
    }
  };

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0, color: styles.font?.color }}>Dependency Editor</Title>}
      open={true}
      onCancel={onClose}
      footer={null}
      width={700}
      styles={{
        content: styles.modal,
        header: { borderBottom: `1px solid ${styles.modal?.borderColor || '#f0f0f0'}` }
      }}
    >
      <div style={{ padding: '8px 0' }}>
        <Alert
          message="Managing dependencies helps in auto-scheduling and critical path calculation."
          type="info"
          showIcon
          style={{ marginBottom: 20, ...styles.font }}
        />

        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
          <Card
            title={<Title level={5} style={{ margin: 0, fontSize: 14, color: styles.font?.color }}>Settings</Title>}
            size="small"
            style={{ flex: 1, ...styles.modal }}
            headStyle={{ borderBottom: `1px solid ${styles.modal?.borderColor || '#f0f0f0'}` }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text style={{ display: 'block', marginBottom: 8, fontSize: 13, color: styles.font?.color }}>Predecessor</Text>
                <Select
                  showSearch
                  placeholder="Select a task"
                  optionFilterProp="children"
                  style={{ width: '100%', ...styles.input }}
                  value={selectedTask}
                  onChange={setSelectedTask}
                >
                  {availableTasks.map(t => (
                    <Option key={t.id} value={t.id}>[{allTasks.indexOf(t) + 1}] {t.text}</Option>
                  ))}
                </Select>
              </div>

              <div>
                <Text style={{ display: 'block', marginBottom: 8, fontSize: 13, color: styles.font?.color }}>Type</Text>
                <Select
                  style={{ width: '100%', ...styles.input }}
                  value={dependencyType}
                  onChange={setDependencyType}
                >
                  <Option value="e2s">Finish-to-Start (FS)</Option>
                  <Option value="s2s">Start-to-Start (SS)</Option>
                  <Option value="e2e">Finish-to-Finish (FF)</Option>
                  <Option value="s2e">Start-to-Finish (SF)</Option>
                </Select>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Text style={{ display: 'block', marginBottom: 8, fontSize: 13, color: styles.font?.color }}>Lag/Lead</Text>
                  <InputNumber
                    style={{ width: '100%', ...styles.input }}
                    value={lagTime}
                    onChange={(v) => setLagTime(v || 0)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Text style={{ display: 'block', marginBottom: 8, fontSize: 13, color: styles.font?.color }}>Units</Text>
                  <Select
                    style={{ width: '100%', ...styles.input }}
                    value={lagUnit}
                    onChange={setLagUnit}
                  >
                    <Option value="day">Days</Option>
                    <Option value="hour">Hours</Option>
                    <Option value="week">Weeks</Option>
                    <Option value="month">Months</Option>
                  </Select>
                </div>
              </div>

              <div>
                <Text style={{ display: 'block', marginBottom: 8, fontSize: 13, color: styles.font?.color }}>Duration (days)</Text>
                <InputNumber
                  style={{ width: '100%', ...styles.input }}
                  min={1}
                  value={duration}
                  onChange={(v) => setDuration(v || 1)}
                />
              </div>

              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />}
                block
                onClick={handleAdd}
                disabled={!selectedTask}
                style={{
                  height: 40,
                  marginTop: 8,
                  ...styles.buttonPrimary
                }}
              >
                Add Dependency
              </Button>
            </Space>
          </Card>

          <Card
            title={<Title level={5} style={{ margin: 0, fontSize: 14, color: styles.font?.color }}>Quick Add</Title>}
            size="small"
            style={{ width: 250, ...styles.modal }}
            headStyle={{ borderBottom: `1px solid ${styles.modal?.borderColor || '#f0f0f0'}` }}
          >
            <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 16, color: styles.font?.color, opacity: 0.7 }}>
              Format: [TaskNumber][Type][+/-][Lag][Unit]
              <br />
              Example: 3FS+10d
            </Paragraph>
            <Input
              placeholder="e.g. 5FS+2d"
              value={quickAddValue}
              onChange={(e) => setQuickAddValue(e.target.value)}
              onPressEnter={handleQuickAdd}
              style={{
                marginBottom: 16,
                height: 40,
                ...styles.input
              }}
            />
            <Button
              block
              onClick={handleQuickAdd}
              style={{
                height: 40,
                ...styles.buttonSecondary
              }}
            >
              Apply
            </Button>
          </Card>
        </div>

        <Divider style={{ margin: '0 0 24px 0', borderColor: styles.modal?.borderColor }} />

        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          <Title level={5} style={{ fontSize: 14, marginBottom: 16, color: styles.font?.color }}>Current Dependencies</Title>
          <List
            dataSource={existingDependencies}
            locale={{ emptyText: <Text type="secondary" style={{ color: styles.font?.color, opacity: 0.5 }}>No dependencies added yet.</Text> }}
            renderItem={(link) => {
              const sourceTask = allTasks.find(t => t.id === link.source);
              return (
                <List.Item
                  style={{
                    padding: '12px 16px',
                    background: '#fafafa',
                    borderRadius: 8,
                    marginBottom: 12,
                    border: `1px solid ${styles.listItem?.borderColor || '#f0f0f0'}`
                  }}
                  actions={[
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={() => onRemoveDependency(link.id)}
                    />
                  ]}
                >
                  <List.Item.Meta
                    avatar={<div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      background: '#1890ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>{sourceTask ? allTasks.indexOf(sourceTask) + 1 : '?'}</div>}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontWeight: 600, color: styles.font?.color }}>{sourceTask?.text || 'Unknown Task'}</span>
                        <Tag color={getDependencyColor(link.type)} style={{ margin: 0 }}>
                          {getDependencyLabel(link.type)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                        <span style={{ fontSize: 12, color: styles.font?.color, opacity: 0.7 }}>
                          <FontAwesomeIcon icon={faLink} style={{ marginRight: 6 }} />
                          Lag: {link.lag || 0} days
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </div>

        <div style={{ marginTop: 24, padding: '16px', background: '#fff7e6', borderRadius: 8, border: '1px solid #ffe7ba' }}>
          <Title level={5} style={{ fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 8, color: '#fa8c16' }} />
            Coming soon
          </Title>
          <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
            Dependency visualization on the chart and automatic lag calculations based on working hours.
          </Text>
        </div>
      </div>
    </Modal>
  );
};
