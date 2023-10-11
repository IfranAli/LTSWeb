import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DialogBaseComponent,
  DialogComponent,
} from "src/app/dialog/dialog.component";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { Observable, filter, switchMap, of, tap } from "rxjs";
import { FinanceModel } from "../../models/finance.model";
import { parseDateIdentifierAsString } from "src/app/calendar/models/calendar.util";
import {
  bulkImportTextToFinanceModel,
  dateToString,
} from "../../util/finance.util";
import { CALENDAR_MONTHS } from "src/app/calendar/models/calendar.model";
import { parseDateInput } from "src/app/calendar/date-parser.util";

@Component({
  selector: "app-import-finance-dialog",
  standalone: true,
  templateUrl: "./import-finance-dialog.component.html",
  styleUrls: ["./import-finance-dialog.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogBaseComponent,
    DialogComponent,
  ],
})
export class ImportFinanceDialogComponent extends DialogBaseComponent {
  $data = signal<FinanceModel[]>([]);
  $importDataIsValid = computed(() => this.$data().length == 0);

  addFinanceBulk() {
    
    // todo: add bulk import
    // Time is actually in the data set. just not in the preview.
    console.log(this.$data());
  }

  bulkImportForm = new FormGroup({
    input: new FormControl<string>(""),
    date: new FormControl<Date>(new Date()),
  });

  test$: Observable<FinanceModel[]> =
    this.bulkImportForm.controls.input.valueChanges.pipe(
      filter((value) => {
        return value != null;
      }),
      switchMap((value) => {
        const test: FinanceModel[] = getFinanceModelsFromInputBulk(
          value as string
        );

        this.$data.set(test);
        return of(test);
      })
    );
}

export const getFinanceModelsFromInputBulk = (
  input: string
): FinanceModel[] => {
  const ins = input
    .split("\n")
    .map((v) => {
      const r = v.trim();

      return r == "" ? "\n\n" : r;
    })
    .join("\n");

  const result = ins
    .split("\n\n")
    .filter((v) => v.length)
    .map((m) => {
      const items = m.split("\n").filter((v) => v.length);

      if (items.length < 2) {
        return null;
      }

      // const dateStr = parseDateIdentifierAsString(items[0], " ");
      const dateStr = parseDateInput(items[0]);

      if (dateStr.length) {
        const itemsSlice = items.slice(1);
        const expectedLength = itemsSlice.length;
        const processed = bulkImportTextToFinanceModel(
          itemsSlice.join("\n").trim(),
          dateStr
        );
        const actualLength = processed.length;

        return expectedLength == actualLength ? processed : null;
      }

      const expectedLength = input.split("\n").length;
      const processed = bulkImportTextToFinanceModel(
        input,
        dateToString(new Date())
      );
      const actualLength = processed.length;

      // return expectedLength == actualLength ? processed : null;
      return processed;
    })
    .flatMap((v) => v)
    .filter((v) => v!!) as FinanceModel[];

  return result;
};
