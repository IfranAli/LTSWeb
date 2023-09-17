import {buildCalendarMonth, getMaxDaysInMonth, isLeapYear} from "../models/calendar.util";
import {CALENDAR_MONTHS, WeekDays} from "../models/calendar.model";
import {ITestData, ITestDataSet} from "./test.interface";

const JAN_IDX = 0;
const NON_LEAP_YEAR = 2023;

describe('Calendar Tests', () => {

  it('Generate all days in January', () => {
    const januaryIndex = 0;
    const month = CALENDAR_MONTHS[januaryIndex];
    const january = buildCalendarMonth(januaryIndex, NON_LEAP_YEAR);

    expect(january.name).toBe(month);
    expect(january.weeks.length).toBe(6);
    console.log(january)
  });

  it('calculate correct amount of days for a given month', () => {
    const leapYear = isLeapYear(NON_LEAP_YEAR);
    const maxDays = getMaxDaysInMonth(JAN_IDX, leapYear);

    expect(leapYear).toBe(false);
    expect(maxDays).toBe(31);
  });
})
