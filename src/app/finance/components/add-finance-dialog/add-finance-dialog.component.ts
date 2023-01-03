import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {financeDialogData} from "../finance-app/finance-app.component";
import {FinanceModel} from "../../models/finance.model";

@Component({
  selector: 'app-add-finance-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './add-finance-dialog.component.html',
  styleUrls: ['./add-finance-dialog.component.css']
})
export class AddFinanceDialogComponent implements OnInit {
  form = new FormGroup({
    'name': new FormControl<string>(''),
    'date': new FormControl<string>(this.getCurrentDate()),
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
    const form = this.form.getRawValue() as Partial<FinanceModel>;

    console.log(form)
    return form;
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
