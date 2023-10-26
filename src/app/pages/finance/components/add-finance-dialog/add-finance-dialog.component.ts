import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { createFinanceModel, FinanceModel } from "../../models/finance.model";
import { dateToString } from "../../util/finance.util";
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
  standalone: true,
  templateUrl: "./add-finance-dialog.component.html",
  styleUrls: ["./add-finance-dialog.component.scss"],
  imports: [CommonModule, ReactiveFormsModule, DialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFinanceDialogComponent extends DialogBaseComponent {
  @Input({ required: true }) selected?: FinanceModel;

  selectedTab = Tabs.AddFinance;
  dialogAction = Actions.Add;

  addFinanceForm = new FormGroup({
    name: new FormControl<string>(""),
    date: new FormControl<string>(""),
    amount: new FormControl<number>(0),
    categoryType: new FormControl<number>(0),
  });

  bulkImportForm = new FormGroup({
    input: new FormControl<string>(""),
    date: new FormControl<Date>(new Date()),
  });

  categories = this.financeService.$categories;
  destroyRef = inject(DestroyRef);

  constructor(private financeService: FinanceService) {
    super();
  }

  ngOnInit(): void {
    const defaultDate = this.getCurrentDate("-");

    if (this.selected) {
      const dateRaw = this.selected.date ?? "";
      const parsed = parseDateIdentifier(dateRaw, "/");
      const date: string = parsed ? dateToString(parsed, "-") : defaultDate;

      this.dialogAction = Actions.Edit;
      this.addFinanceForm.setValue({
        date: date,
        amount: this.selected.amount ?? 0,
        name: this.selected.name,
        categoryType: this.selected.categoryType,
      });

      this.dialogAction =
        (this.selected.id ?? 0) > 0 ? Actions.Edit : Actions.Add;
    }
  }

  deleteFinance(): void {
    const id = this.selected?.id ?? -1;
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

    return createFinanceModel({
      id: this.selected?.id ?? -1,
      name: this.addFinanceForm.controls.name.getRawValue() ?? "",
      date: date,
      amount: this.addFinanceForm.controls.amount.getRawValue() ?? 0,
      categoryType:
        this.addFinanceForm.controls.categoryType.getRawValue() ?? 0,
    });
  };

  private getCurrentDate(seperator = "-"): string {
    const date = new Date();

    return [
      date.getFullYear(),
      date.getMonth() == 0 ? 1 : date.getMonth(),
      date.getDay(),
    ].join(seperator);
  }
}
