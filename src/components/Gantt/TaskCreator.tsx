import type { Task } from '../types';
import { Modal, Form, Input, DatePicker, Select, InputNumber, ColorPicker } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface TaskCreatorProps {
  onCreateTask: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
}

export const TaskCreator: React.FC<TaskCreatorProps> = ({ onCreateTask, onClose }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const start = values.start.toDate();
    const end = new Date(start);
    end.setDate(end.getDate() + (values.duration || 1));

    onCreateTask({
      text: values.text,
      start,
      end,
      duration: values.duration || 1,
      progress: values.progress || 0,
      type: values.type,
      color: typeof values.color === 'string' ? values.color : (values.color?.toHexString?.() || '#4A90E2'),
      owner: values.owner || '',
      priority: values.priority || 'medium',
      details: values.details || '',
    });

    onClose();
  };

  return (
    <Modal
      title="Create New Task"
      open={true}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create Task"
      cancelText="Cancel"
      width={600}
      className="gantt-modal-antd"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          type: 'task',
          priority: 'medium',
          start: dayjs(),
          duration: 1,
          progress: 0,
          color: '#4A90E2',
        }}
      >
        <Form.Item
          name="text"
          label="Task Name"
          rules={[{ required: true, message: 'Please enter task name' }]}
        >
          <Input placeholder="Enter task name" autoFocus />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="type" label="Type" style={{ flex: 1 }}>
            <Select>
              <Option value="task">Task</Option>
              <Option value="milestone">Milestone</Option>
              <Option value="project">Project</Option>
            </Select>
          </Form.Item>

          <Form.Item name="priority" label="Priority" style={{ flex: 1 }}>
            <Select>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="start" label="Start Date" style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="duration" label="Duration (days)" style={{ flex: 1 }}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="color" label="Color" style={{ flex: 1 }}>
            <ColorPicker showText />
          </Form.Item>

          <Form.Item name="progress" label="Progress (%)" style={{ flex: 1 }}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item name="owner" label="Owner">
          <Input placeholder="Assign to..." />
        </Form.Item>

        <Form.Item name="details" label="Details">
          <TextArea placeholder="Add task description..." rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
