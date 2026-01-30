import type { Task, GanttUIConfig, GanttStyleConfig } from './types';
import { applyStyleConfig } from './utils/styleUtils';
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
  styleConfig?: Partial<GanttStyleConfig>;
}

interface TaskFormValues {
  text: string;
  type: Task['type'];
  priority: Task['priority'];
  start: dayjs.Dayjs;
  duration: number;
  progress: number;
  color: string | { toHexString?: () => string }; // Ant Design ColorPicker value handle as any temporarily or use specific type
  owner: string;
  details: string;
}

export const TaskCreator: React.FC<TaskCreatorProps> = ({ onCreateTask, onClose, uiConfig = {}, parentId, parentTaskName, styleConfig }) => {
  const [form] = Form.useForm<TaskFormValues>();
  const styles = applyStyleConfig(styleConfig);

  const handleFinish = (values: TaskFormValues) => {
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
      title={parentId ? (uiConfig.taskCreatorTitle || "Create Checklist") + (parentTaskName ? ` for "${parentTaskName}"` : '') : (uiConfig.taskCreatorTitle || "Create New Stage")}
      open={true}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={uiConfig.taskCreatorOkText || "Create Stage"}
      cancelText={uiConfig.taskCreatorCancelText || "Cancel"}
      width={600}
      className="gantt-modal-antd"
      styles={{
        content: styles.modal,
        header: { borderBottom: `1px solid ${styles.modal?.borderColor || '#f0f0f0'}`, marginBottom: 16 }
      }}
      okButtonProps={{ style: styles.buttonPrimary }}
      cancelButtonProps={{ style: styles.buttonSecondary }}
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
          label={uiConfig.taskNameLabel || "Stage Name"}
          rules={[{ required: true, message: uiConfig.taskNameRequired || 'Please enter stage name' }]}
        >
          <Input placeholder={uiConfig.taskNamePlaceholder || "Enter stage name"} autoFocus style={styles.input} />
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
