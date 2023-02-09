import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {financeDialogData} from "../finance-app/finance-app.component";
import {createFinanceModel, FinanceModel} from "../../models/finance.model";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTabsModule} from "@angular/material/tabs";
import {bulkImportTextToFinanceModel, dateToString} from "../../util/finance.util";

export enum Tabs {
  AddFinance = 0,
  BulkImport = 1,
}

export interface IDialogData {
  action: Tabs,
  data: FinanceModel[],
}

@Component({
  selector: 'app-add-finance-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatTabsModule],
  templateUrl: './add-finance-dialog.component.html',
  styleUrls: ['./add-finance-dialog.component.scss']
})
export class AddFinanceDialogComponent implements OnInit {
  selectedTab = Tabs.AddFinance;

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

  constructor(
    private dialogRef: MatDialogRef<AddFinanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: financeDialogData,
  ) {
  }

  ngOnInit(): void {
  }

  addFinance(): void {
    const tab = this.selectedTab;

    if (tab == Tabs.AddFinance) {
      const date = this.addFinanceForm.controls.date.getRawValue() ?? null;

      const financeModel = createFinanceModel({
        name: this.addFinanceForm.controls.name.getRawValue() ?? '',
        date: date ? dateToString(date) : '',
        amount: this.addFinanceForm.controls.amount.getRawValue() ?? 0,
        categoryType: this.addFinanceForm.controls.categoryType.getRawValue() ?? 0,
      })

      const result: IDialogData = {
        action: tab,
        data: [financeModel]
      }
      this.dialogRef.close(result)
    }

    if (this.selectedTab == Tabs.BulkImport) {
      const input = this.bulkImportForm.controls.input.getRawValue();

      if (input) {
        const dateRaw = this.bulkImportForm.controls.date.getRawValue() ?? '';
        const date = dateRaw ? dateToString(dateRaw) : '';
        const financeModels = bulkImportTextToFinanceModel(input, date);

        const expectedLength = input.split('\n').length;
        const actualLength = financeModels.length

        if (expectedLength == actualLength) {
          const result: IDialogData = {
            action: tab,
            data: financeModels
          }

          this.dialogRef.close(result)
        } else {
          console.error(`Parse error ${actualLength}/${expectedLength} lines parsed.`);
        }
      }

    }
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
