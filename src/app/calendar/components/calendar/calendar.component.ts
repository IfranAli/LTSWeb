import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

const weekdays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const months = [
  'January',
]
// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
//   'September', 'October', 'November', 'December'
// ]

const isLeapYear = function (year: number) {
  return (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0));
}

const month_max_days = [
  31, 28, 31, 30, 31, 30,
  31, 31, 30, 31, 30, 31
]

interface ICalendarMonth {
  name: string;
  weeks: any[];
}

const segmentArray = function (arr: Array<any>, sz: number = 2): Array<any> {
  const length = arr.length;
  let accum = [];

  for (let i = 0; i <= length; i += sz) {
    const segment = arr.slice(i, i + sz);
    accum.push(segment)
  }

  return accum;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  year = this.currentDate.getFullYear();
  calendarData: ICalendarMonth[] = []
  weekdays = weekdays.map(value => value.substring(0, 3));

  constructor() {
    months.forEach((month, index) => {
      const maxDays = month_max_days[index];

      const weeks = segmentArray(Array(maxDays)
        .fill(0, 0, maxDays)
        .map((v, i) => {
            return {day: i + 1}
          }
        ), 7);

      const weekMap = weeks.map((v, i) => {
        return {i, v}
      })

      this.calendarData.push({
        name: month,
        weeks: weeks
      })
    });

    console.log(this.calendarData)
  }

  ngOnInit(): void {
  }

}
