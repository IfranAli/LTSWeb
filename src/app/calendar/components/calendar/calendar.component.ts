import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IMonth, Months, WEEK_DAYS} from "../../models/calendar.model";
import {buildCalendarMonth} from "../../models/calendar.util";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  public month: IMonth = {name: '', weeks: []};

  currentDate = new Date();
  calendarDate = new Date();
  year = this.calendarDate.getFullYear();
  weekdays = WEEK_DAYS.map(value => value.substring(0, 3));

  constructor() {
    this.generateCalendar();
  }

  ngOnInit(): void {
  }

  generateCalendar(): void {
    this.month = buildCalendarMonth(this.calendarDate.getMonth(), this.calendarDate.getFullYear());
    this.year = this.calendarDate.getFullYear();
  }

  forward() {
    let m = this.calendarDate.getMonth();
    let y = this.calendarDate.getFullYear();

    if (m == Months.December) {
      y++;
      m = Months.January;
    } else {
      m++;
    }

    this.calendarDate.setFullYear(y, m);
    this.generateCalendar();
  }

  back() {
    let m = this.calendarDate.getMonth();
    let y = this.calendarDate.getFullYear();

    if (m == Months.January) {
      y = y - 1;
      m = Months.December;
    } else {
      m = m - 1;
    }

    this.calendarDate.setFullYear(y, m);
    this.generateCalendar();
  }

  isToday(day: number) {
    const sameYear = this.year == this.currentDate.getFullYear();

    if (sameYear) {
      const sameMonth = this.calendarDate.getMonth() == this.currentDate.getMonth();

      if (sameMonth) {
        return sameYear && (this.currentDate.getDate() == day);
      }
    }

    return false;
  }

}
