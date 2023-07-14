import {
  eachDayOfInterval,
  format,
} from 'date-fns';

import { data } from './types';

export const getDatesInRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = eachDayOfInterval({ start, end })
  return days.map(day => format(day, 'yyyy-MM-dd'))
}

export const addMissingDates = (data: data[], startDate: string, endDate: string) => {
  const dates = getDatesInRange(startDate, endDate)
  return dates.map(date => {
    const match = data.find(d => d.name === date)
    return match || { name: date, value: 0 }
  });
}