import { DatePipe } from '@angular/common';
import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-date-time-input',
  imports: [DatePipe],
  template: ` <div>
    <h2>Time and Date:</h2>
    <input
      type="datetime-local"
      [value]="inputDate() | date: 'yyyy-MM-ddTHH:mm'"
      (change)="inputUpdated($event)"
      [title]="inputDate() | date: 'medium'"
    />
  </div>`,
  styles: ``,
})
export class DateTimeInputComponent {
  inputDate = model(new Date());

  inputUpdated = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    const date = new Date(value);
    const isInvalidDate = isNaN(date.getTime());

    if (!isInvalidDate) {
      this.inputDate.set(date);
    }
  };
}
