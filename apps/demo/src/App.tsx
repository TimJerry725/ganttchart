import React, { useState } from 'react';
import { Gantt } from '@gantt/react';
import { GanttToolbar } from '@gantt/antd';
import type { Task, Link } from '@gantt/core';
import type { TimeScale } from '@gantt/renderer';

const sampleTasks: Task[] = [
  {
    id: 1,
    name: 'Project Setup',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-05'),
    duration: 5,
    progress: 100,
  },
  {
    id: 2,
    name: 'Design Phase',
    start: new Date('2024-01-06'),
    end: new Date('2024-01-15'),
    duration: 10,
    progress: 50,
    parent: 1,
  },
  {
    id: 3,
    name: 'Development',
    start: new Date('2024-01-16'),
    end: new Date('2024-02-15'),
    duration: 30,
    progress: 25,
  },
];

const sampleLinks: Link[] = [
  {
    id: '1',
    source: 1,
    target: 2,
    type: 'finish-to-start',
  },
  {
    id: '2',
    source: 2,
    target: 3,
    type: 'finish-to-start',
  },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [links] = useState<Link[]>(sampleLinks);
  const [timeScale, setTimeScale] = useState<TimeScale>({
    unit: 'day',
    pixelsPerUnit: 20,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-01'),
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gantt Chart Demo</h1>
      <GanttToolbar
        timeScale={timeScale}
        onZoomIn={() => {
          setTimeScale((prev) => ({
            ...prev,
            pixelsPerUnit: Math.min(prev.pixelsPerUnit * 1.5, 200),
          }));
        }}
        onZoomOut={() => {
          setTimeScale((prev) => ({
            ...prev,
            pixelsPerUnit: Math.max(prev.pixelsPerUnit / 1.5, 5),
          }));
        }}
        onZoomChange={(unit) => {
          setTimeScale((prev) => ({ ...prev, unit }));
        }}
      />
      <Gantt
        tasks={tasks}
        links={links}
        timeScale={timeScale}
        height={600}
        width={1200}
        onTaskClick={(id) => {
          console.log('Task clicked:', id);
        }}
        onTaskUpdate={(id, updates) => {
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
          );
        }}
      />
    </div>
  );
}

export default App;
