import { dateToString } from '../../util/date-util';
import { CALENDAR_MONTHS } from './models/calendar.model';

const toTitleCase = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();

export function parseDateInput(s: string) {
  const date = new Date();

  const arr = s.split(' ');
  if (![2, 3].includes(arr.length)) {
    return '';
  }

  const year = arr
    .map((v) => {
      const n = Number(v);
      return !Number.isNaN(n) && n > 1000 && n < 3000 ? n : undefined;
    })
    .filter((v) => v != null)
    .shift();

  const month = arr
    .map((v) => {
      if (v.length >= 3 && Number.isNaN(Number(v))) {
        const searchValue = toTitleCase(v);
        const monthIdx = CALENDAR_MONTHS.findIndex((m) => m.search(searchValue) >= 0);

        return monthIdx >= 0 ? monthIdx : undefined;
      }

      return undefined;
    })
    .filter((v) => v != null)
    .shift();

  const day = arr
    .map((v) => {
      const n = Number(v);
      return !Number.isNaN(n) && n > 0 && n < 32 ? n : undefined;
    })
    .filter((v) => v != null)
    .shift();

  if (day && month != undefined) {
    date.setFullYear(year ?? date.getFullYear(), month, day);
  }

  return dateToString(date, '/');
}
