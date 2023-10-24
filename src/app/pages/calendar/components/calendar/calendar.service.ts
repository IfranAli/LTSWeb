import { Injectable, Signal, computed, effect, signal } from "@angular/core";
import { generateCalendarViewModel } from "../../models/calendar.util";
import { CalendarEvent, ICalendarViewModel } from "../../models/calendar.model";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  $startDate = signal<Date>(new Date());
  $selectedDate = signal<Date>(this.$startDate());
  $activeDate = computed(() => this.$startDate());

  private events: Array<CalendarEvent> = [
    {
      id: 0,
      title: "Tea Break",
      date: "2023/10/09",
      time: "11:00",
    },
    {
      id: 1,
      title: "Reading Time",
      date: "2023/10/10",
      time: "13:00",
    },
    {
      id: 2,
      title: "Snack Break",
      date: "2023/10/15",
      time: "15:30",
    },
    {
      id: 3,
      title: "Bed Time",
      date: "2023/10/15",
      time: "22:30",
    },
    {
      id: 4,
      title: "Medication",
      date: "2023/10/13",
      time: "21:20",
    },
  ];

  calendarEvents$ = signal<CalendarEvent[]>(this.events);

  private allEventsByDay$ = computed(() => {
    const result = this.calendarEvents$().reduce((acc, c) => {
      const day = parseInt(c.date?.split("/").at(2) ?? "0");
      const dayEvents = [...(acc.get(day) ?? []), c];
      return acc.set(day, dayEvents);
    }, new Map<number, CalendarEvent[]>());
    return result;
  });

  private $calendarViewModel: Signal<ICalendarViewModel> = computed(() => {
    const startDate = this.$startDate();
    const m = startDate.getMonth();
    const y = startDate.getFullYear();

    const cal = generateCalendarViewModel(y, m);
    const events = this.allEventsByDay$();

    events.forEach((events, day) => {
      const idx = day - 1;
      if (idx > 0 && idx < cal.days.length) {
        cal.days[idx].events = events;
      }
    });

    // Apply selectedDate
    const selectedDate = this.$selectedDate();
    const found = cal.days.find(
      (d) =>
        d.date.getMonth() == selectedDate.getMonth() &&
        d.date.getDate() == selectedDate.getDate()
    );

    if (found) {
      found.selected = true;
    }

    return cal;
  });

  $viewModel = computed(() => this.$calendarViewModel());

  constructor() {}
}
