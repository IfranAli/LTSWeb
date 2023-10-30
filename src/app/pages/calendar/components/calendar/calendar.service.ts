import {
  Injectable,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { generateCalendarViewModel } from "../../models/calendar.util";
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
import { toSignal } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";

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

  // Private netowrk methods.
  private $eventsSignal = toSignal(
    this.fetchCalendarEventsFromNetwork().pipe(
      tap((events) => this.$calendarEvents.set(events))
    )
  );

  private fetchCalendarEventsFromNetwork(): Observable<CalendarEvent[]> {
    const url = this.calendarUrl + "/";
    return this.http.get<CalendarEvent[]>(url, getHttpHeaders());
  }

  private $eventsFetch = computed(() => {
    return this.$eventsSignal() ?? [];
  });

  // Public signals
  $startDate = signal<Date>(new Date());
  $selectedDate = signal<Date>(this.$startDate());
  $activeDate = computed(() => this.$startDate());

  $showEventDialog = signal<boolean>(false);
  $selectedEventId = signal<number>(-1);

  $calendarEvents = signal<CalendarEvent[]>([]);
  $viewModel = computed(() => this.$calendarViewModel());

  onCloseDialog(event: any) {
    this.$showEventDialog.set(false);
  }

  private logger = effect(() => {
    // const events = this.$events();
    // console.log("events: ", events);
    // const p = this.$selectedEventId();
    // console.log(p);
  });

  public GetDefaultCalendarEvent() {
    return {
      id: -1,
      title: "",
      date: "",
      time: "",
    };
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

  // Netowrk methods.
}
