import React, { useState } from 'react';
import { Modal, Select, InputNumber, Button, List, Tag, Typography, Space, Divider, Alert, Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLink,
  faTrash,
  faPlus,
  faInfoCircle,
  faArrowDown,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import type { Task, Link } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface DependencyEditorProps {
  task: Task;
  allTasks: Task[];
  links: Link[];
  onAddDependency: (sourceId: string, targetId: string, type: Link['type'], lag?: number) => void;
  onRemoveDependency: (linkId: string) => void;
  onClose: () => void;
}

export const DependencyEditor: React.FC<DependencyEditorProps> = ({
  task,
  allTasks,
  links,
  onAddDependency,
  onRemoveDependency,
  onClose,
}) => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [dependencyType, setDependencyType] = useState<Link['type']>('e2s');
  const [lagTime, setLagTime] = useState<number>(0);

  // Get existing dependencies
  const existingDependencies = links.filter(link => link.target === task.id);
  const existingDependents = links.filter(link => link.source === task.id);

  // Get available tasks (exclude self and parent chain)
  const availableTasks = allTasks.filter(t => t.id !== task.id && t.id !== task.parent);

  const handleAdd = () => {
    if (selectedTask) {
      onAddDependency(selectedTask, task.id, dependencyType, lagTime);
      setSelectedTask('');
      setLagTime(0);
    }
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

  const getLagTag = (lag?: number) => {
    if (!lag || lag === 0) return null;
    if (lag > 0) {
      return <Tag color="warning">+{lag}d lag</Tag>;
    }
    return <Tag color="processing">{lag}d lead</Tag>;
  };

  const renderDependencyItem = (link: Link, sourceOrTarget: 'source' | 'target') => {
    const relatedTask = allTasks.find(t => t.id === (sourceOrTarget === 'source' ? link.source : link.target));

    return (
      <List.Item
        actions={[
          <Button
            type="text"
            danger
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={() => onRemoveDependency(link.id)}
          >
            Remove
          </Button>
        ]}
      >
        <List.Item.Meta
          title={
            <Space>
              <Text strong style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                {relatedTask?.text || (sourceOrTarget === 'source' ? link.source : link.target)}
              </Text>
              <Tag color={getDependencyColor(link.type)}>
                {getDependencyLabel(link.type)}
              </Tag>
              {getLagTag(link.lag)}
            </Space>
          }
          description={
            <Text type="secondary" style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px' }}>
              {relatedTask?.owner && `Owner: ${relatedTask.owner}`}
              {relatedTask?.priority && ` • Priority: ${relatedTask.priority}`}
            </Text>
          }
        />
      </List.Item>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <FontAwesomeIcon icon={faLink} style={{ fontSize: '20px' }} />
          <Title level={4} style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace' }}>
            Task Dependencies
          </Title>
        </Space>
      }
      open={true}
      onCancel={onClose}
      width={900}
      footer={null}
      className="gantt-dependency-modal"
      styles={{
        body: { maxHeight: '70vh', overflowY: 'auto', fontFamily: 'IBM Plex Sans, sans-serif' },
      }}
    >
      {/* Task Info */}
      <Card
        size="small"
        style={{ marginBottom: 24, backgroundColor: '#f5f5f5', borderColor: '#d9d9d9' }}
      >
        <Space direction="vertical" size={4}>
          <Text strong style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '16px' }}>
            {task.text}
          </Text>
          <Text type="secondary" style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px' }}>
            {task.start.toLocaleDateString()} → {task.end.toLocaleDateString()}
            {task.owner && ` • Owner: ${task.owner}`}
            {task.priority && ` • Priority: ${task.priority}`}
          </Text>
        </Space>
      </Card>

      {/* Predecessors Section */}
      <div style={{ marginBottom: 32 }}>
        <Title
          level={5}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '13px',
            color: '#595959'
          }}
        >
          <FontAwesomeIcon icon={faArrowDown} style={{ marginRight: '8px' }} />
          Depends On (Predecessors)
        </Title>
        {existingDependencies.length === 0 ? (
          <Alert
            message="No dependencies"
            description="This task doesn't depend on any other tasks."
            type="info"
            showIcon
            style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
          />
        ) : (
          <List
            dataSource={existingDependencies}
            renderItem={link => renderDependencyItem(link, 'source')}
            bordered
            style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
          />
        )}
      </div>

      {/* Successors Section */}
      <div style={{ marginBottom: 32 }}>
        <Title
          level={5}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '13px',
            color: '#595959'
          }}
        >
          <FontAwesomeIcon icon={faArrowUp} style={{ marginRight: '8px' }} />
          Dependents (Successors)
        </Title>
        {existingDependents.length === 0 ? (
          <Alert
            message="No dependent tasks"
            description="No other tasks depend on this task."
            type="info"
            showIcon
            style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
          />
        ) : (
          <List
            dataSource={existingDependents}
            renderItem={link => renderDependencyItem(link, 'target')}
            bordered
            style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
          />
        )}
      </div>

      <Divider />

      {/* Add New Dependency Section */}
      <Card
        title={
          <Title
            level={5}
            style={{
              margin: 0,
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '14px'
            }}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
            Add New Dependency
          </Title>
        }
        style={{ marginBottom: 24 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ fontFamily: 'IBM Plex Sans, sans-serif', display: 'block', marginBottom: 8 }}>
              Select Task:
            </Text>
            <Select
              placeholder="Choose a task..."
              value={selectedTask || undefined}
              onChange={setSelectedTask}
              style={{ width: '100%', fontFamily: 'IBM Plex Sans, sans-serif' }}
              size="large"
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {availableTasks.map(t => (
                <Option key={t.id} value={t.id}>
                  {t.text}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong style={{ fontFamily: 'IBM Plex Sans, sans-serif', display: 'block', marginBottom: 8 }}>
              Dependency Type:
            </Text>
            <Select
              value={dependencyType}
              onChange={setDependencyType}
              style={{ width: '100%', fontFamily: 'IBM Plex Sans, sans-serif' }}
              size="large"
            >
              <Option value="e2s">
                <Tag color="blue">FS</Tag> Finish-to-Start
              </Option>
              <Option value="s2s">
                <Tag color="green">SS</Tag> Start-to-Start
              </Option>
              <Option value="e2e">
                <Tag color="purple">FF</Tag> Finish-to-Finish
              </Option>
              <Option value="s2e">
                <Tag color="orange">SF</Tag> Start-to-Finish
              </Option>
            </Select>
          </div>

          <div>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Text strong style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                Lead/Lag Time (days):
              </Text>
              <Text type="secondary" style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px' }}>
                Negative = lead time (overlap), Positive = lag time (delay)
              </Text>
              <InputNumber
                value={lagTime}
                onChange={(value) => setLagTime(value || 0)}
                style={{ width: '100%', fontFamily: 'IBM Plex Sans, sans-serif' }}
                size="large"
                placeholder="0"
                min={-365}
                max={365}
              />
            </Space>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleAdd}
            disabled={!selectedTask}
            block
            style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600 }}
          >
            Add Dependency
          </Button>
        </Space>
      </Card>

      {/* Help Section */}
      <Alert
        message={
          <Text strong style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
            Dependency Types Explained
          </Text>
        }
        description={
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
            <ul style={{ marginBottom: 12, paddingLeft: 20 }}>
              <li><strong>Finish-to-Start (FS):</strong> Successor starts after predecessor finishes</li>
              <li><strong>Start-to-Start (SS):</strong> Both tasks start at the same time</li>
              <li><strong>Finish-to-Finish (FF):</strong> Both tasks finish at the same time</li>
              <li><strong>Start-to-Finish (SF):</strong> Successor finishes when predecessor starts</li>
            </ul>
            <Divider style={{ margin: '12px 0' }} />
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Keyboard Shortcuts:</Text>
            <Paragraph style={{ margin: 0, fontSize: '12px' }} code>
              [TaskID][Type]+/-[Days]d
            </Paragraph>
            <Paragraph style={{ margin: 0, fontSize: '12px' }}>
              Example: <code>3FS+10d</code> = Task 3, Finish-to-Start, 10 days lag
            </Paragraph>
          </div>
        }
        type="info"
        showIcon
        icon={<FontAwesomeIcon icon={faInfoCircle} />}
        style={{ marginTop: 16 }}
      />
    </Modal>
  );
};
