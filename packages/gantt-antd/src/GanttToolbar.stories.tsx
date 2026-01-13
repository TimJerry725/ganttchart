/**
 * Storybook stories for GanttToolbar component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { GanttToolbar } from './GanttToolbar';
import type { TimeScale } from '@gantt/renderer';
import { useState } from 'react';

const meta: Meta<typeof GanttToolbar> = {
  title: 'Gantt/Ant Design/Toolbar',
  component: GanttToolbar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Ant Design toolbar component for Gantt charts with zoom, undo/redo, and export controls.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GanttToolbar>;

const defaultTimeScale: TimeScale = {
  unit: 'day',
  pixelsPerUnit: 20,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-03-01'),
};

export const Basic: Story = {
  render: () => {
    const [timeScale, setTimeScale] = useState<TimeScale>(defaultTimeScale);
    
    return (
      <GanttToolbar
        timeScale={timeScale}
        onZoomIn={() => {
          setTimeScale(prev => ({
            ...prev,
            pixelsPerUnit: Math.min(prev.pixelsPerUnit * 1.5, 200),
          }));
        }}
        onZoomOut={() => {
          setTimeScale(prev => ({
            ...prev,
            pixelsPerUnit: Math.max(prev.pixelsPerUnit / 1.5, 5),
          }));
        }}
        onZoomChange={(unit) => {
          setTimeScale(prev => ({ ...prev, unit }));
        }}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        canUndo={true}
        canRedo={false}
        onExport={(format) => console.log('Export:', format)}
        onPrint={() => console.log('Print')}
      />
    );
  },
};

export const WithUndoRedo: Story = {
  render: () => {
    const [timeScale] = useState<TimeScale>(defaultTimeScale);
    const [canUndo, setCanUndo] = useState(true);
    const [canRedo, setCanRedo] = useState(false);
    
    return (
      <GanttToolbar
        timeScale={timeScale}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        onZoomChange={() => {}}
        onUndo={() => {
          setCanUndo(false);
          setCanRedo(true);
        }}
        onRedo={() => {
          setCanUndo(true);
          setCanRedo(false);
        }}
        canUndo={canUndo}
        canRedo={canRedo}
        onExport={(format) => console.log('Export:', format)}
        onPrint={() => console.log('Print')}
      />
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [timeScale, setTimeScale] = useState<TimeScale>(defaultTimeScale);
    
    return (
      <div>
        <GanttToolbar
          timeScale={timeScale}
          onZoomIn={() => {
            setTimeScale(prev => ({
              ...prev,
              pixelsPerUnit: Math.min(prev.pixelsPerUnit * 1.5, 200),
            }));
          }}
          onZoomOut={() => {
            setTimeScale(prev => ({
              ...prev,
              pixelsPerUnit: Math.max(prev.pixelsPerUnit / 1.5, 5),
            }));
          }}
          onZoomChange={(unit) => {
            setTimeScale(prev => ({ ...prev, unit }));
          }}
          onUndo={() => console.log('Undo')}
          onRedo={() => console.log('Redo')}
          canUndo={true}
          canRedo={true}
          onExport={(format) => alert(`Exporting as ${format}`)}
          onPrint={() => alert('Printing...')}
        />
        <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5' }}>
          <p>Current zoom: {timeScale.unit} ({timeScale.pixelsPerUnit}px/unit)</p>
        </div>
      </div>
    );
  },
};
