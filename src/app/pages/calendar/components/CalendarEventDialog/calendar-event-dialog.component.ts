import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DialogBaseComponent,
  DialogComponent,
} from "src/app/dialog/dialog.component";
import { CalendarService } from "../calendar/calendar.service";
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CalendarEvent } from "../../models/calendar.model";
import {
  RegExValidate24HourTimeStr,
  parseDateIdentifier,
} from "../../models/calendar.util";
import {
  dateToString,
  getCurrentDate,
} from "src/app/pages/finance/util/finance.util";
import { inputInvalid } from "src/app/util/forms.util";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { tap } from "rxjs/internal/operators/tap";

@Component({
  selector: "app-calendar-event-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./calendar-event-dialog.component.html",
  styleUrls: ["./calendar-event-dialog.component.css"],
  imports: [CommonModule, ReactiveFormsModule, DialogComponent],
})
export class CalendarEventDialogComponent extends DialogBaseComponent {
  calendarService = inject(CalendarService);
  destroyRef = inject(DestroyRef);

  $eventModel = computed(() => {
    const id = this.calendarService.$selectedEventId();
    const model =
      this.calendarService.GetCalendarEvent(id) ??
      this.calendarService.GetDefaultCalendarEvent();

    return model;
  });
  $isEdit = computed(() => this.$eventModel().id !== -1);
  $title = computed(() => (this.$isEdit() ? "Edit" : "Add") + " Event");

  $date = computed(() => {
    const dateRaw = this.$eventModel().date;

    if (!dateRaw) {
      return undefined;
    }

    const parsed = parseDateIdentifier(dateRaw, "/");
    const date: string = parsed
      ? dateToString(parsed, "-")
      : getCurrentDate("-");

    return date;
  });

  calendarEventForm = new FormGroup({
    title: new FormControl<string>(
      this.$eventModel().title,
      Validators.required
    ),
    date: new FormControl<string>(this.$date() ?? "", Validators.required),
    time: new FormControl<string>(this.$eventModel().time ?? "", [
      Validators.pattern(RegExValidate24HourTimeStr),
    ]),
  });

  inputInvalid = (formControl: FormControl) => {
    return inputInvalid(formControl);
  };

  deleteEvent() {
    this.calendarService
      .DeleteCalendarEvent({ id: this.$eventModel().id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.calendarService.$showEventDialog.set(false);
        },
      });
  }

  addEvent() {
    const values = this.calendarEventForm.value;
    const model: CalendarEvent = {
      id: this.$eventModel().id,
      title: values.title ?? "",
      date: values.date ?? "",
      time: values.time ?? "",
    };

    const ob = this.$isEdit()
      ? this.calendarService.UpdateCalendarEvent(model)
      : this.calendarService.AddCalendarEvent(model);

    ob.pipe(
      tap((v) => {
        console.log(v);
        this.calendarService.$showEventDialog.set(false);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
