import type { Task, GanttUIConfig } from './types';
import { Modal, Form, Input, DatePicker, Select, InputNumber, ColorPicker, Button } from 'antd';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

interface TaskEditorProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClose: () => void;
  uiConfig?: Partial<GanttUIConfig>;
}

export const TaskEditor: React.FC<TaskEditorProps> = ({ task, onUpdate, onDelete, onClose, uiConfig = {} }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const start = values.start.toDate();
    const end = new Date(start);
    end.setDate(end.getDate() + (values.duration || 1));

    onUpdate({
      ...task,
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

  const showDeleteConfirm = () => {
    confirm({
      title: uiConfig.deleteConfirmTitle ? `${uiConfig.deleteConfirmTitle}: "${task.text}"?` : `Are you sure you want to delete "${task.text}"?`,
      icon: <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#faad14', marginRight: 8 }} />,
      content: uiConfig.deleteConfirmContent || 'This action cannot be undone.',
      okText: uiConfig.deleteConfirmOkText || 'Yes, Delete',
      okType: 'danger',
      cancelText: uiConfig.deleteConfirmCancelText || 'No',
      onOk() {
        onDelete(task.id);
        onClose();
      },
    });
  };

  return (
    <Modal
      title={uiConfig.taskEditorTitle || "Edit Task"}
      open={true}
      onCancel={onClose}
      footer={[
        <Button key="delete" danger onClick={showDeleteConfirm} style={{ float: 'left' }}>
          {uiConfig.taskEditorDeleteText || 'Delete'}
        </Button>,
        <Button key="cancel" onClick={onClose}>
          {uiConfig.taskEditorCancelText || 'Cancel'}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {uiConfig.taskEditorSaveText || 'Save Changes'}
        </Button>,
      ]}
      width={600}
      className="gantt-modal-antd"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          text: task.text,
          type: task.type || 'task',
          priority: task.priority || 'medium',
          start: dayjs(task.start),
          duration: task.duration,
          progress: task.progress,
          color: task.color || '#4A90E2',
          owner: task.owner || '',
          details: task.details || '',
        }}
      >
        <Form.Item
          name="text"
          label={uiConfig.taskNameLabel || "Task Name"}
          rules={[{ required: true, message: uiConfig.taskNameRequired || 'Please enter task name' }]}
        >
          <Input placeholder={uiConfig.taskNamePlaceholder || "Enter task name"} />
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
