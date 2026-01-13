/**
 * Ant Design task editor component
 */

import React from 'react';
import { Drawer, Form, Input, InputNumber, DatePicker, Select, Switch, Button, Space } from 'antd';
import type { Task } from '@gantt/core';
import dayjs from 'dayjs';

export interface GanttEditorProps {
  task?: Task;
  visible: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

export const GanttEditor: React.FC<GanttEditorProps> = ({
  task,
  visible,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (task) {
      form.setFieldsValue({
        name: task.name,
        type: task.type || 'task',
        start: task.start ? dayjs(task.start) : undefined,
        end: task.end ? dayjs(task.end) : undefined,
        duration: task.duration,
        progress: task.progress,
        readonly: task.readonly,
      });
    } else {
      form.resetFields();
    }
  }, [task, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave({
        ...values,
        start: values.start?.toDate(),
        end: values.end?.toDate(),
      });
      onClose();
    });
  };

  return (
    <Drawer
      title={task ? 'Edit Task' : 'New Task'}
      open={visible}
      onClose={onClose}
      width={400}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Task Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="type" label="Type">
          <Select>
            <Select.Option value="task">Task</Select.Option>
            <Select.Option value="milestone">Milestone</Select.Option>
            <Select.Option value="project">Project</Select.Option>
            <Select.Option value="summary">Summary</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="start" label="Start Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="end" label="End Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="duration" label="Duration (days)">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="progress" label="Progress (%)">
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="readonly" valuePropName="checked">
          <Switch checkedChildren="Read-only" unCheckedChildren="Editable" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
