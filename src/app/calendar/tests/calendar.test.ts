import { generateCalendarViewModel, generateDaysInMonth } from "../models/calendar.util";
import { CALENDAR_MONTHS } from "../models/calendar.model";

const JAN_IDX = 0;
const NON_LEAP_YEAR = 2023;

describe("Calendar Tests", () => {
  it("Generate all days in January", () => {
    const januaryIndex = 0;
    const month = CALENDAR_MONTHS[januaryIndex];
    const january = generateDaysInMonth(NON_LEAP_YEAR, januaryIndex);

    // expect(january.name).toBe(month);
    // expect(january.weeks.length).toBe(6);
    console.log(january);
  });

  it("should generate the view model for a given month", () => {
    const monthIdx = 9;
    const months = CALENDAR_MONTHS[monthIdx];
    const year = NON_LEAP_YEAR;

    const vm = generateCalendarViewModel(year, monthIdx);
    expect(vm.name).toBe(months);
    expect(vm.year).toBe(year);
    expect(vm.days.length).toBe(35);
  });

  it("should generate the correct number of days for a given month", () => {
    for (let month = 0; month < 12; month++) {
      const start = new Date(2023, month, 1);
      const end = new Date(2023, month + 1, 0);

      const days = generateDaysInMonth(2023, month);

      const expectedDays = end.getDate();
      const lastDay = days[days.length - 1];

      expect(days.length).toBe(expectedDays);
      expect(days[0].dayOfWeek).toBe(start.getDay());
      expect(lastDay.dayOfWeek).toBe(end.getDay());
    }
  });
});
