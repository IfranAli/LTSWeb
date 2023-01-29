import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {financeDialogData} from "../finance-app/finance-app.component";
import {createFinanceModel, FinanceModel} from "../../models/finance.model";
import {MatDatepickerModule} from "@angular/material/datepicker";

const dateToString = function (date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');

  return y + '/' + m + '/' + d;
}

@Component({
  selector: 'app-add-finance-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './add-finance-dialog.component.html',
  styleUrls: ['./add-finance-dialog.component.scss']
})
export class AddFinanceDialogComponent implements OnInit {
  form = new FormGroup({
    'name': new FormControl<string>(''),
    'date': new FormControl<Date>(new Date()),
    'amount': new FormControl<number>(0),
    'categoryType': new FormControl<number>(0),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: financeDialogData,
  ) {
  }

  ngOnInit(): void {
  }

  addFinance() {
    const date = this.form.controls.date.getRawValue() ?? null;

    const financeModel = createFinanceModel({
      name: this.form.controls.name.getRawValue() ?? '',
      date: date ? dateToString(date) : '',
      amount: this.form.controls.amount.getRawValue() ?? 0,
      categoryType: this.form.controls.categoryType.getRawValue() ?? 0,
    })

    console.log(financeModel)
    return financeModel;
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
