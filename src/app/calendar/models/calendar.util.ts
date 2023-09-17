import {
  CALENDAR_MONTHS,
  ICalendar,
  IDay,
  IMonth,
  IWeek,
  Months,
  MONTHS_MAX_DAYS,
} from "./calendar.model";
import { dateToString } from "../../finance/util/finance.util";

const FEBRUARY = 1;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const getTotalDaysInMonth = (date: Date): number => {
  const calc = new Date(date);
  calc.setDate(1);
  calc.setMonth(calc.getMonth() + 1);
  calc.setDate(calc.getDate() + -1);
  return calc.getDate();
};

export const isLeapYear = function (year: number) {
  return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
};

export const calcDateDiffInDays = function (a: Date, b: Date) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.abs(Math.floor((utc2 - utc1) / MS_PER_DAY));
};

export const getMaxDaysInMonth = function (
  numberOfMonth: number,
  is_leap_year: boolean
): number {
  const days =
    numberOfMonth == FEBRUARY && is_leap_year
      ? MONTHS_MAX_DAYS[numberOfMonth] + 1
      : MONTHS_MAX_DAYS[numberOfMonth];

  return days;
};

export const segmentArray = function (
  arr: Array<any>,
  sz: number = 2
): Array<any> {
  const length = arr.length;
  let accum = [];

  for (let i = 0; i <= length; i += sz) {
    const segment = arr.slice(i, i + sz);
    accum.push(segment);
  }

  return accum;
};

export const buildCalendarMonth = function (
  numberOfMonth: number,
  year: number
): IMonth {
  let dateStart = new Date(year, numberOfMonth, 1);
  let dateEnd = new Date(year, numberOfMonth + 1, 0);

  const prefix = dateStart.getDay() == 0 ? 6 : dateStart.getDay();
  const newDate = dateStart.getDate() - prefix;
  dateStart.setDate(newDate);

  let days: IDay[] = [];
  let diff = calcDateDiffInDays(dateStart, dateEnd);

  const suffix = 42 - diff;
  dateEnd.setDate(dateEnd.getDate() + suffix);
  diff += suffix;
  const suffix2 = diff - suffix;

  for (let i = 0; i < diff; ++i) {
    const isCurrentMonth = i >= prefix && i <= suffix2;

    days.push({
      day: dateStart.getDate(),
      currentMonth: isCurrentMonth,
    });
    dateStart.setDate(dateStart.getDate() + 1);
  }

  const weeks: IWeek[] = segmentArray(days, 7).map((value, index): IWeek => {
    return {
      name: `Week ${index + 1}`,
      days: value,
    };
  }).filter((value) => value.days.length > 0);

  return {
    name: CALENDAR_MONTHS[numberOfMonth],
    weeks: weeks,
  };
};

export const buildCalendar = function (year: number): ICalendar {
  const calendar: ICalendar = {
    months: [],
  };

  // calendar.months.push(buildCalendarMonth(0, year))
  CALENDAR_MONTHS.forEach((month, index) =>
    calendar.months.push(buildCalendarMonth(index, year))
  );

  return calendar;
};

// todo: move into own file
const isMonth = (str: string): string =>
  CALENDAR_MONTHS.find((m) => m.search(str) >= 0) ?? "";
const isDay = (str: string): number => {
  const day = parseFloat(str);
  return Number.isSafeInteger(day) && day >= 1 && day <= 31 ? day : 0;
};
const isYear = (str: string): number => {
  const y = parseFloat(str);
  return Number.isSafeInteger(y) && y > 1000 && y < 3000 ? y : 0;
};

export interface IDateParsed {
  d: number | null;
  m: number | null;
  y: number | null;
}

export const parseDateFormattedStr = (dateStr: string): IDateParsed => {
  const split = dateStr.split("/");

  return {
    d: parseInt(split[2] ?? 0),
    m: parseInt(split[1] ?? 0),
    y: parseInt(split[0] ?? 0),
  };
};

export const parseDateIdentifierAsString = (
  str: string,
  separator = "/"
): string => {
  const result = parseDateIdentifier(str);
  return result ? dateToString(result) : "";
};

export const parseDateIdentifier = (
  str: string,
  separator: string = " "
): Date | null => {
  const items = str.split(separator, 3);
  const yearString = items.find((v) => isYear(v) > 0) ?? null;

  if (!yearString) {
    return null;
  }

  const beginsWithYear = items.indexOf(yearString) == 0;
  const arr = beginsWithYear ? items.slice(1).reverse() : items.slice(0, 2);
  const day = parseInt(arr[0]);
  const month = parseInt(arr[1]);
  const year = parseInt(yearString);

  return new Date( year, month - 1, day);
};

export const incrementDateByMonth = (date: Date): Date => {
  let m = date.getMonth();
  let y = date.getFullYear();

  if (m == Months.December) {
    y++;
    m = Months.January;
  } else {
    m++;
  }

  date.setFullYear(y, m);

  return date;
};

export const decrementDateByMonth = (date: Date): Date => {
  let m = date.getMonth();
  let y = date.getFullYear();

  if (m == Months.January) {
    y = y - 1;
    m = Months.December;
  } else {
    m = m - 1;
  }

  date.setFullYear(y, m);

  return date;
};
