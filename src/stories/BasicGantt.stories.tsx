import { Gantt } from '../components/Gantt/Gantt';
import { basicTasks, basicLinks } from './data';

export default {
  title: 'Gantt/Basic Gantt',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    tasks: basicTasks,
    links: basicLinks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

export const DarkTheme = {
  args: {
    tasks: basicTasks,
    links: basicLinks,
    config: {
      weekends: true,
      theme: 'dark',
    },
  },
};
