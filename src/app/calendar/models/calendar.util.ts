import {CALENDAR_MONTHS, ICalendar, IDay, IMonth, IWeek, MONTHS_MAX_DAYS} from "./calendar.model";

const FEBRUARY = 1;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const isLeapYear = function (year: number) {
  return (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0));
}

export const calcDateDiffInDays = function (a: Date, b: Date) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.abs(Math.floor((utc2 - utc1) / MS_PER_DAY));
}

export const getMaxDaysInMonth =
  function (numberOfMonth: number, is_leap_year: boolean): number {
    const days = ((numberOfMonth == FEBRUARY && is_leap_year) ?
        (MONTHS_MAX_DAYS[numberOfMonth] + 1)
        : (MONTHS_MAX_DAYS[numberOfMonth])
    );

    return days;
  }

export const segmentArray = function (arr: Array<any>, sz: number = 2): Array<any> {
  const length = arr.length;
  let accum = [];

  for (let i = 0; i <= length; i += sz) {
    const segment = arr.slice(i, i + sz);
    accum.push(segment)
  }

  return accum;
}

export const buildCalendarMonth = function (numberOfMonth: number, year: number): IMonth {
  let dateStart = new Date(year, numberOfMonth, 1)
  let dateEnd = new Date(year, numberOfMonth + 1, 0)

  const prefix = (dateStart.getDay() == 0 ? 6 : dateStart.getDay());
  const newDate = dateStart.getDate() - prefix;
  dateStart.setDate(newDate);

  let days: IDay[] = [];
  let diff = calcDateDiffInDays(dateStart, dateEnd);

  const suffix = (42 - diff)
  dateEnd.setDate(dateEnd.getDate() + suffix);
  diff += suffix;
  const suffix2 = diff - suffix;

  for (let i = 0; i < diff; ++i) {
    const isCurrentMonth = (i >= prefix && i <= suffix2);

    days.push({
      day: dateStart.getDate(),
      currentMonth: isCurrentMonth,
    })
    dateStart.setDate(dateStart.getDate() + 1);
  }

  const weeks: IWeek[] = segmentArray(days, 7).map((value, index): IWeek => {
    return {
      name: `Week ${index + 1}`,
      days: value,
    }
  })

  return {
    name: CALENDAR_MONTHS[numberOfMonth],
    weeks: weeks,
  }
}

export const buildCalendar = function (year: number): ICalendar {
  const calendar: ICalendar = {
    months: [],
  };

  // calendar.months.push(buildCalendarMonth(0, year))
  CALENDAR_MONTHS.forEach((month, index) =>
    calendar.months.push(buildCalendarMonth(index, year))
  );

  return calendar;
}
