import type { Scale } from '../types';

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

  const map: Record<string, string> = {
    'YYYY': date.getFullYear().toString(),
    'YY': date.getFullYear().toString().slice(-2),
    'MMMM': monthsFull[date.getMonth()],
    'MMM': months[date.getMonth()],
    'MM': String(date.getMonth() + 1).padStart(2, '0'),
    'M': String(date.getMonth() + 1),
    'DD': String(date.getDate()).padStart(2, '0'),
    'D': String(date.getDate()),
    'dddd': days[date.getDay()],
    'HH': String(date.getHours()).padStart(2, '0'),
    'H': String(date.getHours()),
    'mm': String(date.getMinutes()).padStart(2, '0'),
    'm': String(date.getMinutes()),
  };

  const tokenPattern = /YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|HH|H|mm|m/g;

  const literals: string[] = [];
  const withPlaceholders = format.replace(/\[([^\]]*)\]/g, (_full, inner) => {
    literals.push(inner);
    return `\uE000${literals.length - 1}\uE001`;
  });

  const expanded = withPlaceholders.replace(tokenPattern, (matched) => map[matched]);

  return expanded.replace(/\uE000(\d+)\uE001/g, (_full, index) => literals[Number(index)]);
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
