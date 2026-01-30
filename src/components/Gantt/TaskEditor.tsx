import type { Task, GanttUIConfig, GanttStyleConfig } from './types';
import { applyStyleConfig } from './utils/styleUtils';
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
  styleConfig?: Partial<GanttStyleConfig>;
}

interface TaskFormValues {
  text: string;
  type: Task['type'];
  priority: Task['priority'];
  start: dayjs.Dayjs;
  duration: number;
  progress: number;
  color: string | { toHexString?: () => string };
  owner: string;
  details: string;
}

export const TaskEditor: React.FC<TaskEditorProps> = ({ task, onUpdate, onDelete, onClose, uiConfig = {}, styleConfig }) => {
  const [form] = Form.useForm<TaskFormValues>();
  const styles = applyStyleConfig(styleConfig);

  const handleFinish = (values: TaskFormValues) => {
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
      title={uiConfig.taskEditorTitle || "Edit Stage"}
      open={true}
      onCancel={onClose}
      footer={[
        <Button key="delete" danger onClick={showDeleteConfirm} style={{ float: 'left', ...styles.buttonDanger }}>
          {uiConfig.taskEditorDeleteText || 'Delete'}
        </Button>,
        <Button key="cancel" onClick={onClose} style={styles.buttonSecondary}>
          {uiConfig.taskEditorCancelText || 'Cancel'}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} style={styles.buttonPrimary}>
          {uiConfig.taskEditorSaveText || 'Save Changes'}
        </Button>,
      ]}
      width={600}
      className="gantt-modal-antd"
      styles={{
        content: styles.modal,
        header: { borderBottom: `1px solid ${styles.modal?.borderColor || '#f0f0f0'}`, marginBottom: 16 }
      }}
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
          label={uiConfig.taskNameLabel || "Stage Name"}
          rules={[{ required: true, message: uiConfig.taskNameRequired || 'Please enter stage name' }]}
        >
          <Input placeholder={uiConfig.taskNamePlaceholder || "Enter stage name"} style={styles.input} />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="type" label={uiConfig.typeLabel || "Type"} style={{ flex: 1 }}>
            <Select style={styles.input}>
              <Option value="task">{uiConfig.taskTypeOptions?.task || 'Stage'}</Option>
              <Option value="milestone">{uiConfig.taskTypeOptions?.milestone || 'Milestone'}</Option>
              <Option value="project">{uiConfig.taskTypeOptions?.project || 'Project'}</Option>
            </Select>
          </Form.Item>

          <Form.Item name="priority" label={uiConfig.priorityLabel || "Priority"} style={{ flex: 1 }}>
            <Select style={styles.input}>
              <Option value="low">{uiConfig.priorityOptions?.low || 'Low'}</Option>
              <Option value="medium">{uiConfig.priorityOptions?.medium || 'Medium'}</Option>
              <Option value="high">{uiConfig.priorityOptions?.high || 'High'}</Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="start" label={uiConfig.startDateLabel || "Start Date"} style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%', ...styles.input }} />
          </Form.Item>

          <Form.Item name="duration" label={uiConfig.durationLabel || "Duration (days)"} style={{ flex: 1 }}>
            <InputNumber min={0} style={{ width: '100%', ...styles.input }} />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="color" label={uiConfig.colorLabel || "Color"} style={{ flex: 1 }}>
            <ColorPicker showText />
          </Form.Item>

          <Form.Item name="progress" label={uiConfig.progressLabel || "Progress (%)"} style={{ flex: 1 }}>
            <InputNumber min={0} max={100} style={{ width: '100%', ...styles.input }} />
          </Form.Item>
        </div>

        <Form.Item name="owner" label={uiConfig.ownerLabel || "Owner"}>
          <Input placeholder={uiConfig.ownerPlaceholder || "Assign to..."} style={styles.input} />
        </Form.Item>

        <Form.Item name="details" label={uiConfig.detailsLabel || "Details"}>
          <TextArea placeholder={uiConfig.detailsPlaceholder || "Add stage description..."} rows={3} style={styles.input} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
