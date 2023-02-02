import {Component, OnInit} from '@angular/core';
import {FinanceService} from "../../services/finance.service";
import {FinanceModel} from "../../models/finance.model";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AddFinanceDialogComponent, IDialogData, Tabs} from "../add-finance-dialog/add-finance-dialog.component";

export interface financeDialogData {
  categories: Map<number, string>;
}

@Component({
  selector: 'app-finance-app',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './finance-app.component.html',
  styleUrls: ['./finance-app.component.scss']
})
export class FinanceAppComponent implements OnInit {
  finances: FinanceModel[] | null = null;
  displayedColumns: Array<keyof FinanceModel> = [
    "name",
    "date",
    "amount",
    "categoryType",
  ];

  categoryLookup = new Map<number, string>;

  constructor(
    private financeService: FinanceService,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.financeService.getFinanceCategories().subscribe({
      next: value => {
        this.categoryLookup = value.reduce((acc, c) => {
          return acc.set(c.id, c.type)
        }, new Map<number, string>)

        this.financeService.getFinances().subscribe({
          next: value => this.finances = value,
          error: err => console.error(err),
        })
      },
      error: err => this.router.navigate([''])
    })
  }

  openDialogAddFinance() {
    const dialogRef = this.dialog.open(AddFinanceDialogComponent, {
      data: {categories: this.categoryLookup},
      panelClass: ['dialog-style', 'dialog-small'],
    });

    dialogRef.afterClosed().subscribe((result: IDialogData) => {
      if (!result) {
        return;
      }

      // Need to refactor to use the Account object
      result.data.forEach((model) => {
        this.financeService.createFinance(model).subscribe(value => {
          console.log(value);
        })
        // this.dataProvider.updateProject(model).subscribe(value => {
        //   this.store.dispatch(updateProject({
        //     ...model
        //   }));
        // })
      });
    });
  }
}
