import { FormControl } from "@angular/forms";

// Validates a form control for showing error messages
export function inputInvalid(control: FormControl) {
  return control.invalid && control.touched;
}


