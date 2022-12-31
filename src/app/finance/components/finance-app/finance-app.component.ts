import {Component, OnInit} from '@angular/core';
import {FinanceService} from "../../services/finance.service";
import {FinanceModel} from "../../models/finance.model";

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

  categoryLookup = [
    'Unknown',
    'Medication',
    'Work',
    'House',
    'Food',
    'Cost of Living',
    'Tea and Coffee',
  ]

  constructor(
    private financeService: FinanceService
  ) {
  }

  ngOnInit(): void {
    this.financeService.getFinances().subscribe({
      next: value => {
        this.finances = value;
      },
      error: err => console.error(err)
    });
  }

}
