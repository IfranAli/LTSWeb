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
  December,
}

export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const CALENDAR_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTHS_MAX_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export interface IDay {
  day: number;
  date: Date;

  dayOfWeek: number;
  events?: CalendarEvent[];

  selected?: boolean;
  currentMonth?: boolean;
  isToday?: boolean;
}

export interface IWeek {
  name: string;
  days: IDay[];
}

export interface IMonth {
  name: string;
  weeks: IWeek[];
}

export interface ICalendar {
  months: IMonth[];
}

export type ICalendarViewModel = {
  name: string;
  year: number;
  days: IDay[];
};

export type CalendarEvent = {
  id: number;
  title: string;
  date?: string;
  time?: string;
};

export type CalendarEventCreate = Omit<CalendarEvent, "id">;
