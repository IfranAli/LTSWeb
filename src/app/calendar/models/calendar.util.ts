import { CALENDAR_MONTHS, IDay, Months, WeekDays } from "./calendar.model";
import { dateToString } from "../../finance/util/finance.util";

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

/**
 * Returns the weekday as a string for a given weekday number.
 * @param weekday
 * @returns
 */
const weekdayToString = function (weekday: number): string {
  if (weekday < 0 || weekday > 6) {
    throw new Error("Invalid weekday");
  }
  return WeekDays[weekday];
};

/**
 * Returns the month as a string for a given month number.
 * @param month
 * @returns
 */
export const monthToString = function (month: number): string {
  if (month < 0 || month > 11) {
    throw new Error("Invalid month");
  }
  return CALENDAR_MONTHS[month];
};

export interface ICalendarViewModel {
  name: string;
  year: number;
  days: IDay[];
}

export function generateCalendarViewModel(year: number, monthIdx: number) {
  const daysInMonth = generateDaysInMonth(year, monthIdx);

  const daysForPrevMonth = daysInMonth[0].dayOfWeek;
  let paddingStart: IDay[] = [];
  let paddingEnd: IDay[] = [];

  if (daysForPrevMonth > 0) {
    const prevMonthIdx = monthIdx == 0 ? 11 : monthIdx - 1;
    const prevMonth = generateDaysInMonth(year, prevMonthIdx);

    paddingStart = prevMonth.slice(-daysForPrevMonth).map((d) => ({
      ...d,
      currentMonth: false,
    }));
  }

  const daysForNextMonth = 6 - daysInMonth[daysInMonth.length - 1].dayOfWeek;
  if (daysForNextMonth > 0) {
    const nextMonthIdx = monthIdx == 11 ? 0 : monthIdx + 1;
    const nextMonth = generateDaysInMonth(year, nextMonthIdx);

    paddingEnd = nextMonth
      .slice(0, daysForNextMonth)
      .map((d) => ({ ...d, currentMonth: false }));
  }

  const result = {
    name: monthToString(monthIdx),
    year: year,
    days: [...paddingStart, ...daysInMonth, ...paddingEnd],
  };

  return result;
}

export function generateDaysInMonth(year: number, month: Months): IDay[] {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const monthStartDay = start.getDay();
  const nDaysInMonth = end.getDate() - start.getDate() + 1;
  const todaysDate = new Date();

  return Array(nDaysInMonth)
    .fill(0)
    .map((_, i) => {
      const date = i + 1;
      const dayOfWeek = (monthStartDay + i) % 7;
      const isToday =
        year == todaysDate.getFullYear() &&
        date == todaysDate.getDate() &&
        month == todaysDate.getMonth();

      const d: IDay = {
        date: date,
        dayOfWeek: dayOfWeek,
        currentMonth: true,
        ...(isToday ? { isToday: true } : {}),
      };

      return d;
    });
}

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

  return new Date(year, month - 1, day);
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
