import type { Task, GanttUIConfig } from './types';
import { Modal, Form, Input, DatePicker, Select, InputNumber, ColorPicker } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface TaskCreatorProps {
  onCreateTask: (task: Omit<Task, 'id'>, parentId?: string) => void;
  onClose: () => void;
  uiConfig?: Partial<GanttUIConfig>;
  parentId?: string; // For subtasks
  parentTaskName?: string; // For display purposes
}

export const TaskCreator: React.FC<TaskCreatorProps> = ({ onCreateTask, onClose, uiConfig = {}, parentId, parentTaskName }) => {
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
      parent: parentId, // Set parent for subtasks
    }, parentId);

    onClose();
  };

  return (
    <Modal
      title={parentId ? (uiConfig.taskCreatorTitle || "Create Subtask") + (parentTaskName ? ` for "${parentTaskName}"` : '') : (uiConfig.taskCreatorTitle || "Create New Task")}
      open={true}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={uiConfig.taskCreatorOkText || "Create Task"}
      cancelText={uiConfig.taskCreatorCancelText || "Cancel"}
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
          label={uiConfig.taskNameLabel || "Task Name"}
          rules={[{ required: true, message: uiConfig.taskNameRequired || 'Please enter task name' }]}
        >
          <Input placeholder={uiConfig.taskNamePlaceholder || "Enter task name"} autoFocus />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="type" label={uiConfig.typeLabel || "Type"} style={{ flex: 1 }}>
            <Select>
              <Option value="task">{uiConfig.taskTypeOptions?.task || 'Task'}</Option>
              <Option value="milestone">{uiConfig.taskTypeOptions?.milestone || 'Milestone'}</Option>
              <Option value="project">{uiConfig.taskTypeOptions?.project || 'Project'}</Option>
            </Select>
          </Form.Item>

          <Form.Item name="priority" label={uiConfig.priorityLabel || "Priority"} style={{ flex: 1 }}>
            <Select>
              <Option value="low">{uiConfig.priorityOptions?.low || 'Low'}</Option>
              <Option value="medium">{uiConfig.priorityOptions?.medium || 'Medium'}</Option>
              <Option value="high">{uiConfig.priorityOptions?.high || 'High'}</Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="start" label={uiConfig.startDateLabel || "Start Date"} style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="duration" label={uiConfig.durationLabel || "Duration (days)"} style={{ flex: 1 }}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="color" label={uiConfig.colorLabel || "Color"} style={{ flex: 1 }}>
            <ColorPicker showText />
          </Form.Item>

          <Form.Item name="progress" label={uiConfig.progressLabel || "Progress (%)"} style={{ flex: 1 }}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item name="owner" label={uiConfig.ownerLabel || "Owner"}>
          <Input placeholder={uiConfig.ownerPlaceholder || "Assign to..."} />
        </Form.Item>

        <Form.Item name="details" label={uiConfig.detailsLabel || "Details"}>
          <TextArea placeholder={uiConfig.detailsPlaceholder || "Add task description..."} rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
