import { Injectable, Signal, computed, signal } from "@angular/core";
import { IDay } from "../../models/calendar.model";
import {
  ICalendarViewModel,
  generateCalendarViewModel,
  monthToString,
} from "../../models/calendar.util";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  $startDate = signal<Date>(new Date());

  private $calendarViewModel: Signal<ICalendarViewModel> = computed(() => {
    const startDate = this.$startDate();
    const m = startDate.getMonth();
    const y = startDate.getFullYear();

    const days = generateCalendarViewModel(y, m);
    return days;
  });

  $viewModel = computed(() => this.$calendarViewModel());

  constructor() {}
}
