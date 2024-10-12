import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  inject,
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
import {
  bulkImportTextToFinanceModel,
  dateToString,
} from "../../util/finance.util";
import { parseDateInput } from "src/app/pages/calendar/date-parser.util";
import { FinanceService } from "../../services/finance.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-import-finance-dialog",
  standalone: true,
  templateUrl: "./import-finance-dialog.component.html",
  styleUrls: ["./import-finance-dialog.component.scss"],
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
  destroyRef = inject(DestroyRef);
  financeService = inject(FinanceService);
  $data = signal<FinanceModel[]>([]);
  $importDataIsValid = computed(() => this.$data().length != 0);

  addFinanceBulk() {
    // todo: add bulk import
    // Time is actually in the data set. just not in the preview.

    const data = this.$data();

    // todo: Date override logic should go into the parser.
    // const dateRaw = this.bulkImportForm.controls.date.getRawValue() ?? "";
    // const date = dateRaw ? dateToString(dateRaw) : "";

    if (!this.$importDataIsValid()) {
      console.error("Invalid data.", data);
      return;
    }

    this.financeService
      .createFinanceMany(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        console.log("Added ", result.length, " transactions.");
        this.onModalClose.emit(true);
      });
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
        const parsedFinances: FinanceModel[] = getFinanceModelsFromInputBulk(
          value as string
        );

        this.$data.set(parsedFinances);
        return of(parsedFinances);
      })
    );

  applyExample() {
    const importText = `feb 5
-12.0 breakfast@11:30
-5 coffee@9:00

apr 12
-15 transport@13:00

may 1
-8 choclates@15:00`;

    this.bulkImportForm.controls.input.setValue(importText);
  }
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

      // todo: show incomplete parsing warning.
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
