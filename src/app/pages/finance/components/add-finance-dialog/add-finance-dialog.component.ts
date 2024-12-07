import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { createFinanceModel, FinanceModel } from "../../models/finance.model";
import { dateToString, getCurrentDate } from "../../util/finance.util";
import { parseDateIdentifier } from "../../../calendar/models/calendar.util";
import {
  DialogBaseComponent,
  DialogComponent,
} from "src/app/dialog/dialog.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FinanceService } from "../../services/finance.service";

export enum Tabs {
  AddFinance = 0,
  BulkImport = 1,
}

export enum Actions {
  BulkImport = "Bulk Import",
  Add = "Add Finance",
  Edit = "Edit Finance",
  Delete = "Delete",
}

export interface IDialogResult {
  action: Actions;
  data: FinanceModel[];
}

export interface financeDialogData {
  categories: Map<number, string>;
  financeModel?: FinanceModel;
}

@Component({
    selector: "app-add-finance-dialog",
    templateUrl: "./add-finance-dialog.component.html",
    styleUrls: ["./add-finance-dialog.component.css"],
    imports: [CommonModule, ReactiveFormsModule, DialogComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFinanceDialogComponent extends DialogBaseComponent {
  readonly selected = input.required<FinanceModel | undefined>();

  dialogAction = Actions.Add;

  addFinanceForm = new FormGroup({
    name: new FormControl<string>(""),
    date: new FormControl<string>(""),
    amount: new FormControl<number>(0),
    categoryType: new FormControl<number>(0),
  });

  financeService = inject(FinanceService);
  categories = this.financeService.$categories;
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const defaultDate = getCurrentDate("-");

    const selected = this.selected();
    if (selected) {
      const dateRaw = selected.date ?? "";
      const parsed = parseDateIdentifier(dateRaw, "/");
      const date: string = parsed ? dateToString(parsed, "-") : defaultDate;

      this.dialogAction = Actions.Edit;
      this.addFinanceForm.setValue({
        date: date,
        amount: selected.amount ?? 0,
        name: selected.name,
        categoryType: selected.categoryType,
      });

      this.dialogAction =
        (selected.id ?? 0) > 0 ? Actions.Edit : Actions.Add;
    }
  }

  deleteFinance(): void {
    const id = this.selected()?.id ?? -1;
    if (id > 0) {
      this.financeService
        .deleteFinance(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.onModalClose.emit(true);
        });
    }
  }

  addFinance(): void {
    const financeData = this.getFinanceModelFromInput();

    if (financeData.id > 0) {
      // const oldData = this.selected;
      // todo check if data has changed

      this.financeService
        .updateFinance(financeData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.onModalClose.emit(true);
        });
    } else {
      this.financeService
        .createFinance(financeData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.onModalClose.emit(true);
        });
    }
  }

  getFinanceModelFromInput = () => {
    const date = this.addFinanceForm.controls.date.getRawValue() ?? "";

    const model = createFinanceModel({
      id: this.selected()?.id ?? -1,
      name: this.addFinanceForm.controls.name.getRawValue() ?? "",
      date: date,
      amount: this.addFinanceForm.controls.amount.getRawValue() ?? 0,
      categoryType:
        this.addFinanceForm.controls.categoryType.getRawValue() ?? 0,
    });

    console.debug("Finance model", model);
    return model;
  };
}
