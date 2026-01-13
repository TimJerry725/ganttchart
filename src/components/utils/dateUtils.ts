import { Scale } from '../types';

export const addToDate = (date: Date, count: number, unit: Scale['unit']): Date => {
  const newDate = new Date(date);
  
  switch (unit) {
    case 'hour':
      newDate.setHours(newDate.getHours() + count);
      break;
    case 'day':
      newDate.setDate(newDate.getDate() + count);
      break;
    case 'week':
      newDate.setDate(newDate.getDate() + count * 7);
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + count);
      break;
    case 'quarter':
      newDate.setMonth(newDate.getMonth() + count * 3);
      break;
    case 'year':
      newDate.setFullYear(newDate.getFullYear() + count);
      break;
  }
  
  return newDate;
};

export const getDaysBetween = (start: Date, end: Date): number => {
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getHoursBetween = (start: Date, end: Date): number => {
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60));
};

export const formatDate = (date: Date, format: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return format
    .replace('YYYY', date.getFullYear().toString())
    .replace('YY', date.getFullYear().toString().slice(-2))
    .replace('MMMM', monthsFull[date.getMonth()])
    .replace('MMM', months[date.getMonth()])
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('M', String(date.getMonth() + 1))
    .replace('DD', String(date.getDate()).padStart(2, '0'))
    .replace('D', String(date.getDate()))
    .replace('dddd', days[date.getDay()])
    .replace('HH', String(date.getHours()).padStart(2, '0'))
    .replace('H', String(date.getHours()))
    .replace('mm', String(date.getMinutes()).padStart(2, '0'))
    .replace('m', String(date.getMinutes()));
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isHoliday = (date: Date, holidays: Date[]): boolean => {
  return holidays.some(holiday => 
    holiday.getFullYear() === date.getFullYear() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getDate() === date.getDate()
  );
};

export const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const getEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

export const calculateDuration = (start: Date, end: Date, unit: Scale['unit'] = 'day'): number => {
  switch (unit) {
    case 'hour':
      return getHoursBetween(start, end);
    case 'day':
      return getDaysBetween(start, end);
    case 'week':
      return Math.ceil(getDaysBetween(start, end) / 7);
    case 'month':
      return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    default:
      return getDaysBetween(start, end);
  }
};
