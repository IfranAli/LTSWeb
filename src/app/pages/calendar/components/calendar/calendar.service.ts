import {
  Injectable,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import {
  generateCalendarViewModel,
  incrementDateByMonth,
} from "../../models/calendar.util";
import {
  CalendarEvent,
  CalendarEventCreate,
  ICalendarViewModel,
} from "../../models/calendar.model";
import { environment } from "src/environments/environment";
import { getHttpHeaders } from "src/app/constants/web-constants";
import { HttpClient } from "@angular/common/http";
import { UserService } from "src/app/services/user.service";
import { tap } from "rxjs/internal/operators/tap";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { Observable, empty } from "rxjs";
import { dateToString } from "src/app/pages/finance/util/finance.util";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  // Services
  userService = inject(UserService);
  http = inject(HttpClient);

  // Constants
  private baseUrl = environment.backendURL;
  private calendarUrl = this.baseUrl + "calendar";

  // Public signals
  $startDate = signal<Date>(new Date());
  $selectedDate = signal<Date>(this.$startDate());

  // Network Observable streams.
  public getCalendarEventsForDateRange(
    from: Date,
    to: Date
  ): Observable<CalendarEvent[]> {
    const url = this.calendarUrl + "/";
    const result = this.http
      .get<CalendarEvent[]>(url, {
        ...getHttpHeaders(),
        params: {
          from: dateToString(from),
          to: dateToString(to),
        },
      })
      .pipe(tap((events) => this.$calendarEvents.set(events)));

    return result;
  }

  $showEventDialog = signal<boolean>(false);
  $selectedEventId = signal<number>(-1);

  $calendarEvents = signal<CalendarEvent[]>([]);
  $viewModel = computed(() => this.$calendarViewModel());

  onCloseDialog(event: any) {
    this.$showEventDialog.set(false);
  }

  public GetCalendarEvent(id: number) {
    return this.$calendarEvents().find((e) => e.id == id);
  }

  public AddCalendarEvent(event: CalendarEventCreate) {
    const postData = event;
    return this.http
      .post<CalendarEvent>(this.calendarUrl, postData, getHttpHeaders())
      .pipe(
        tap((e: CalendarEvent) => {
          this.$calendarEvents.update((events) => [...events, e]);
        })
      );
  }

  public UpdateCalendarEvent(event: CalendarEvent) {
    const updateData = event;

    return this.http
      .put<CalendarEvent>(
        this.calendarUrl + "/" + updateData.id,
        updateData,
        getHttpHeaders()
      )
      .pipe(
        tap((e: CalendarEvent) => {
          this.$calendarEvents.update((events) => {
            const idx = events.findIndex((e) => e.id == event.id);
            if (idx >= 0) {
              events[idx] = e;
            }
            return events;
          });
        })
      );
  }

  public DeleteCalendarEvent(event: Pick<CalendarEvent, "id">) {
    return this.http
      .delete(this.calendarUrl + "/" + event.id, getHttpHeaders())
      .pipe(
        tap((v) => {
          this.$calendarEvents.update((events) => {
            const idx = events.findIndex((e) => e.id == event.id);
            if (idx >= 0) {
              events.splice(idx, 1);
            }
            return events;
          });
        })
      );
  }

  private allEventsByDay$ = computed(() => {
    const events = this.$calendarEvents();
    const result = events.reduce((acc, c) => {
      const dateStr = c.date ?? "";
      const dayEvents = [...(acc.get(dateStr) ?? []), c];
      return acc.set(dateStr, dayEvents);
    }, new Map<string, CalendarEvent[]>());

    return result;
  });

  private $calendarViewModel: Signal<ICalendarViewModel> = computed(() => {
    const calendar = generateCalendarViewModel(
      this.$startDate().getFullYear(),
      this.$startDate().getMonth()
    );
    const events = this.allEventsByDay$();

    if (events.size == 0) {
      return calendar;
    }

    // Assign events to days in calendar.
    events.forEach((events, dayStr) => {
      const dateObj = new Date(dayStr);
      const date = dateObj.getDate();
      const day = calendar.days.find(
        (d) => d.day == date && d.date.getMonth() == dateObj.getMonth()
      );

      if (day) {
        day.events = events;
      }
    });

    // Apply selectedDate
    const selectedDate = this.$selectedDate();
    const found = calendar.days.find(
      (d) =>
        d.date.getMonth() == selectedDate.getMonth() &&
        d.date.getDate() == selectedDate.getDate()
    );

    if (found) {
      found.selected = true;
    }
    return calendar;
  });
}
