import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IDay, WEEK_DAYS } from "../../models/calendar.model";
import {
  decrementDateByMonth,
  incrementDateByMonth,
} from "../../models/calendar.util";
import { CalendarService } from "./calendar.service";
import { CalendarEventDialogComponent } from "../CalendarEventDialog/calendar-event-dialog.component";
import { mergeMap, tap } from "rxjs";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
    imports: [CommonModule, CalendarEventDialogComponent]
})
export class CalendarComponent implements OnInit {
  calendarService = inject(CalendarService);

  currentDate = new Date();
  weekdays = WEEK_DAYS.map((value) => value.substring(0, 3));

  $calendarData = this.calendarService.$viewModel;
  $startDate = this.calendarService.$startDate;

  $events = toSignal(
    toObservable(this.$startDate).pipe(
      mergeMap((startDate) => {
        
        // Get three months of events. 
        const dateFrom = decrementDateByMonth(startDate);
        const dateTo = incrementDateByMonth(startDate);
        dateFrom.setDate(1);

        return this.calendarService.getCalendarEventsForDateRange(
          dateFrom,
          dateTo
        );
      })
    )
  );

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
