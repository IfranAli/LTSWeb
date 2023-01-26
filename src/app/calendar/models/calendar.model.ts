export enum WeekDays {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export enum Months {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const CALENDAR_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

export const MONTHS_MAX_DAYS = [
  31, 28, 31, 30, 31, 30,
  31, 31, 30, 31, 30, 31
]

export interface IDay {
  day: number
  currentMonth: boolean
}

export interface IWeek {
  name: string,
  days: IDay[],
}

export interface IMonth {
  name: string,
  weeks: IWeek[],
}

export interface ICalendar {
  months: IMonth[],
}
