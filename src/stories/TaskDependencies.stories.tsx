import { Gantt } from '../components/Gantt/Gantt';

export default {
  title: 'Gantt/Task Dependencies',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

const tasks = [
  {
    id: '1',
    text: 'Project Planning',
    start: new Date(2024, 5, 3),
    end: new Date(2024, 5, 7),
    duration: 4,
    progress: 100,
  },
  {
    id: '2',
    text: 'Requirements Analysis',
    start: new Date(2024, 5, 8),
    end: new Date(2024, 5, 14),
    duration: 6,
    progress: 50,
  },
];

const links = [
  {
    id: 'link-1',
    source: '1',
    target: '2',
    type: 'e2s',
  },
];

export const FinishToStart = {
  args: {
    tasks: tasks,
    links: links,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

export const AutoScheduling = {
  args: {
    tasks: tasks,
    links: links,
    config: {
      weekends: true,
      theme: 'light',
      autoSchedule: true,
    },
  },
};
