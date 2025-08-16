import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-date-time-input',
  template: `
    <div>
      <h2>Time and Date:</h2>
      <input type="datetime-local" [value]="valueString" (change)="onInputChange($event)" [title]="valueString" />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeInputComponent),
      multi: true,
    },
  ],
})
export class DateTimeInputComponent implements ControlValueAccessor {
  value: Date = new Date();

  get valueString(): string {
    // Format as yyyy-MM-ddTHH:mm for datetime-local input
    return this.value
      ? new Date(this.value.getTime() - this.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      : '';
  }

  onChange = (value: Date) => {};
  onTouched = () => {};

  writeValue(value: Date): void {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optionally handle disabled state
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const date = new Date(input.value);
    if (!isNaN(date.getTime())) {
      this.value = date;
      this.onChange(date);
    }
    this.onTouched();
  }
}
