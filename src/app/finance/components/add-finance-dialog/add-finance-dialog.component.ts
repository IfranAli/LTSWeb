import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
  effect,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { createFinanceModel, FinanceModel } from "../../models/finance.model";
import {
  bulkImportTextToFinanceModel,
  dateToString,
} from "../../util/finance.util";
import {
  parseDateIdentifier,
  parseDateIdentifierAsString,
} from "../../../calendar/models/calendar.util";
import { filter, Observable, of, switchMap, tap } from "rxjs";
import {
  DialogBaseComponent,
  DialogComponent,
} from "src/app/dialog/dialog.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { deleteFinance } from "src/app/actions/finance.actions";
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

  addFinance(): void {
    const p = this.getFinanceModelFromInput();
    debugger;
    // if (this.selectedTab == Tabs.BulkImport) {
    //   this.dialogAction = Actions.BulkImport;
    // }
    // switch (this.dialogAction) {
    //   case Actions.Add:
    //     const result: IDialogResult = {
    //       action: Actions.Add,
    //       data: [this.getFinanceModelFromInput()],
    //     };
    //     this.dialogRef.close(result);
    //     break;
    //   case Actions.BulkImport:
    //     const input = this.bulkImportForm.controls.input.getRawValue();
    //     if (input) {
    //       const dateRaw = this.bulkImportForm.controls.date.getRawValue() ?? "";
    //       const date = dateRaw ? dateToString(dateRaw) : "";
    //       const financeModels = getFinanceModelsFromInputBulk(input);
    //       const result: IDialogResult = {
    //         action: Actions.BulkImport,
    //         data: financeModels,
    //       };
    //       this.dialogRef.close(result);
    //     }
    //     break;
    //   case Actions.Edit:
    //     this.dialogRef.close(this.getEditData());
    //     break;
    // }
  }

  getFinanceModelFromInput = () => {
    const date = this.addFinanceForm.controls.date.getRawValue() ?? "";

    return createFinanceModel({
      name: this.addFinanceForm.controls.name.getRawValue() ?? "",
      date: date,
      amount: this.addFinanceForm.controls.amount.getRawValue() ?? 0,
      categoryType:
        this.addFinanceForm.controls.categoryType.getRawValue() ?? 0,
    });
  };

  getEditData = (): IDialogResult => {
    // let p =
    //   this.addFinanceForm.getRawValue() as unknown as Partial<FinanceModel>;

    // const dateRaw = this.addFinanceForm.controls.date.getRawValue() ?? "";
    // if (p.date && dateRaw) {
    //   p.date = dateToString(dateRaw);
    // }

    // const model = createFinanceModel(p, this.data.financeModel);

    return {
      action: Actions.Edit,
      data: [],
    };
  };

  deleteFinance() {
    // this.dialogRef.close({
    //   action: Actions.Delete,
    //   data: [this.data.financeModel!!],
    // });
  }

  private getCurrentDate(seperator = "-"): string {
    const date = new Date();

    return [
      date.getFullYear(),
      date.getMonth() == 0 ? 1 : date.getMonth(),
      date.getDay(),
    ].join(seperator);
  }
}
