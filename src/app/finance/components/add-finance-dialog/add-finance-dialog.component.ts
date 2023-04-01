import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef
} from "@angular/material/legacy-dialog";
import {createFinanceModel, FinanceModel} from "../../models/finance.model";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {bulkImportTextToFinanceModel, dateToString} from "../../util/finance.util";
import {parseDateIdentifierAsString} from "../../../calendar/models/calendar.util";
import {filter, Observable, of, switchMap, tap} from "rxjs";

export enum Tabs {
  AddFinance = 0,
  BulkImport = 1,
}

export enum Actions {
  BulkImport = 'Bulk Import',
  Add = 'Add Finance',
  Edit = 'Edit Finance',
  Delete = 'Delete',
}

export interface IDialogResult {
  action: Actions,
  data: FinanceModel[],
}

export interface financeDialogData {
  categories: Map<number, string>;
  financeModel?: FinanceModel;
}

const getFinanceModelsFromInputBulk = (input: string) => {
  const result = input.split('\n\n').map(m => {
    const items = m.split('\n');

    if (items.length < 2) {
      return null;
    }

    const dateStr = parseDateIdentifierAsString(items[0])

    if (dateStr.length) {
      const itemsSlice = items.slice(1);
      const expectedLength = itemsSlice.length;
      const processed = bulkImportTextToFinanceModel(itemsSlice.join('\n').trim(), dateStr);
      const actualLength = processed.length

      return (expectedLength == actualLength) ? processed : null;
    }

    const expectedLength = input.split('\n').length;
    const processed = bulkImportTextToFinanceModel(input, dateToString(new Date()));
    const actualLength = processed.length

    return (expectedLength == actualLength) ? processed : null;
  }).flatMap(v => v).filter(v => v!!) as FinanceModel[];

  return result;
}

@Component({
  selector: 'app-add-finance-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatTabsModule],
  templateUrl: './add-finance-dialog.component.html',
  styleUrls: [
    // '../../../../styles/global/custom-form.scss',
    './add-finance-dialog.component.scss'
  ]
})
export class AddFinanceDialogComponent implements OnInit {
  selectedTab = Tabs.AddFinance;
  dialogAction = Actions.Add;

  addFinanceForm = new FormGroup({
    'name': new FormControl<string>(''),
    'date': new FormControl<Date>(new Date()),
    'amount': new FormControl<number>(0),
    'categoryType': new FormControl<number>(0),
  })

  bulkImportForm = new FormGroup({
    'input': new FormControl<string>(''),
    'date': new FormControl<Date>(new Date()),
  });

  test$: Observable<FinanceModel[]> = this.bulkImportForm.controls.input.valueChanges.pipe(
    filter((value) => {
      return (value != null)
    }),
    switchMap((value) => {
      const test: FinanceModel[] = getFinanceModelsFromInputBulk(value as string);
      return of(test)
    })
  );

  constructor(
    public dialogRef: MatDialogRef<AddFinanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: financeDialogData,
  ) {

    if (data.financeModel) {
      this.dialogAction = Actions.Edit

      this.addFinanceForm.setValue({
        date: new Date(data.financeModel.date),
        amount: data.financeModel.amount ?? 0,
        name: data.financeModel.name,
        categoryType: data.financeModel.categoryType
      })

    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  addFinance(): void {
    if (this.selectedTab == Tabs.BulkImport) {
      this.dialogAction = Actions.BulkImport;
    }

    switch (this.dialogAction) {
      case Actions.Add:
        const result: IDialogResult = {
          action: Actions.Add,
          data: [this.getFinanceModelFromInput()]
        }
        this.dialogRef.close(result)
        break;

      case Actions.BulkImport:
        const input = this.bulkImportForm.controls.input.getRawValue();

        if (input) {
          const dateRaw = this.bulkImportForm.controls.date.getRawValue() ?? '';
          const date = dateRaw ? dateToString(dateRaw) : '';

          const financeModels = getFinanceModelsFromInputBulk(input);

          const result: IDialogResult = {
            action: Actions.BulkImport,
            // data: financeModels
            data: []
          }

          // this.dialogRef.close(result)
        }
        break;

      case Actions.Edit:
        this.dialogRef.close(this.getEditData())
        break;
    }

  }

  getFinanceModelFromInput = () => {
    const date = this.addFinanceForm.controls.date.getRawValue() ?? null;

    return createFinanceModel({
      name: this.addFinanceForm.controls.name.getRawValue() ?? '',
      date: date ? dateToString(date) : '',
      amount: this.addFinanceForm.controls.amount.getRawValue() ?? 0,
      categoryType: this.addFinanceForm.controls.categoryType.getRawValue() ?? 0,
    });
  }

  getEditData = (): IDialogResult => {
    let p = this.addFinanceForm.getRawValue() as unknown as Partial<FinanceModel>;

    const dateRaw = this.addFinanceForm.controls.date.getRawValue() ?? ''
    if (p.date && dateRaw) {
      p.date = dateToString(dateRaw);
    }

    const model = createFinanceModel(p, this.data.financeModel);

    return {
      action: Actions.Edit,
      data: [model]
    };
  }

  deleteFinance() {
    this.dialogRef.close({
      action: Actions.Delete,
      data: [this.data.financeModel!!]
    })
  }

  private getCurrentDate(): string {
    const date = new Date();

    return [
      date.getFullYear(),
      (date.getMonth() == 0) ? 1 : date.getMonth(),
      date.getDay(),
    ].join('/')
  }
}
