import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CALENDAR_MONTHS, ICalendar, IDay, IMonth, IWeek, WEEK_DAYS} from "../../models/calendar.model";
import {buildCalendar, buildCalendarMonth, calcDateDiffInDays, segmentArray} from "../../models/calendar.util";
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
  year = this.currentDate.getFullYear();
  weekdays = WEEK_DAYS.map(value => value.substring(0, 3));

  constructor() {
    this.generateCalendar();
  }

  ngOnInit(): void {
  }

  generateCalendar(): void {
    this.month = buildCalendarMonth(this.currentDate.getMonth(), this.year);
  }

  forward() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  back() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }
}
