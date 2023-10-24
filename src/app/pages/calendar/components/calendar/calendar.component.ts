import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IDay, WEEK_DAYS } from "../../models/calendar.model";
import {
  decrementDateByMonth,
  incrementDateByMonth,
} from "../../models/calendar.util";
import { CalendarService } from "./calendar.service";

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  calendarService = inject(CalendarService);

  currentDate = new Date();
  weekdays = WEEK_DAYS.map((value) => value.substring(0, 3));

  $calendarData = this.calendarService.$viewModel;
  $startDate = this.calendarService.$startDate;

  ngOnInit(): void {}

  forward() {
    this.$startDate.update((d) => incrementDateByMonth(d));
  }

  back() {
    this.$startDate.update((d) => decrementDateByMonth(d));
  }

  selectDateEvent(day: IDay) {
    this.calendarService.$selectedDate.set(day.date);
  }
}
