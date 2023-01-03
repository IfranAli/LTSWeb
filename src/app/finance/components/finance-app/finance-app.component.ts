import {Component, OnInit} from '@angular/core';
import {FinanceService} from "../../services/finance.service";
import {FinanceCategory, FinanceModel} from "../../models/finance.model";

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
    private financeService: FinanceService
  ) {
  }

  ngOnInit(): void {
    this.financeService.getFinanceCategories().subscribe({
      next: value => {
        this.categoryLookup = value.reduce((acc, c) => {
          return acc.set(c.id, c.type)
        }, new Map<number, string>)
      },
      error: err => console.error(err),
    })

    this.financeService.getFinances().subscribe({
      next: value => this.finances = value,
      error: err => console.error(err),
    })
  }

}
