import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Custom Zoom',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    zoomLevel: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.1 },
      description: 'Zoom level (0.5 = zoomed out, 2 = zoomed in)',
      table: {
        category: 'Zoom Settings',
        defaultValue: { summary: 1 },
      },
    },
  },
} satisfies Meta<typeof Gantt>;

export default meta;
type Story = StoryObj<typeof meta>;

const tasks: Task[] = [
  {
    id: '1',
    text: 'Project planning',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 16),
    duration: 14,
    progress: 100,
    color: '#26A69A',
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2026, 3, 16),
    end: new Date(2026, 4, 15),
    duration: 29,
    progress: 60,
    color: '#42A5F5',
  },
  {
    id: '3',
    text: 'Testing',
    start: new Date(2026, 4, 15),
    end: new Date(2026, 5, 1),
    duration: 16,
    progress: 30,
    color: '#FF7043',
  },
];

/**
 * Custom Zoom Level
 * 
 * Adjust the zoom slider to change the timeline detail level:
 * - 0.5-0.7: Zoomed out (monthly view)
 * - 0.8-1.2: Normal (weekly/daily view)
 * - 1.3-2.0: Zoomed in (daily/hourly detail)
 * 
 * Use toolbar buttons or the slider for fine control.
 */
export const Default: Story = {
  args: {
    tasks,
    zoomLevel: 1.0,
  },
  render: (args) => {
    const { zoomLevel, ...rest } = args;
    return (
      <Gantt
        {...rest}
        tasks={tasks}
        config={{
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};
