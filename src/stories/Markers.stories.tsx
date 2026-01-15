import { Gantt } from '../components/Gantt/Gantt';
import type { Task, Marker } from '../components/types';

export default {
  title: 'Gantt/Markers',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
    badges: ['PRO'],
  },
  tags: ['autodocs'],
};


const tasks: Task[] = [
  {
    id: '1',
    text: 'Project Planning',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 15),
    duration: 14,
    progress: 100,
    color: '#26A69A',
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2026, 3, 15),
    end: new Date(2026, 4, 15),
    duration: 30,
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

const markers: Marker[] = [
  {
    id: 'm1',
    date: new Date(2026, 3, 10),
    text: 'Review Meeting',
    css: 'marker-blue',
  },
  {
    id: 'm2',
    date: new Date(2026, 4, 1),
    text: 'Milestone Deadline',
    css: 'marker-red',
  },
  {
    id: 'm3',
    date: new Date(2026, 4, 20),
    text: 'Sprint End',
    css: 'marker-green',
  },
];

/**
 * Markers - Important Dates
 * 
 * Vertical lines marking important dates on the timeline.
 * Useful for highlighting deadlines, meetings, or milestones.
 */
export const Default = {
  args: {
    tasks: tasks,
    config: {
      markers: markers,
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * Today Marker
 */
export const TodayMarker = {
  args: {
    tasks: tasks,
    config: {
      markers: [
        {
          id: 'today',
          date: new Date(),
          text: 'Today',
          css: 'marker-today',
        },
      ],
      weekends: true,
      theme: 'light',
    },
  },
};
