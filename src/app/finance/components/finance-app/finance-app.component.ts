import {Component, OnInit} from '@angular/core';
import {FinanceService, IFinanceSummary} from "../../services/finance.service";
import {FinanceModel} from "../../models/finance.model";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AddFinanceDialogComponent, IDialogData, Tabs} from "../add-finance-dialog/add-finance-dialog.component";
import {getTotalDaysInMonth, parseDateFormattedStr, parseDateIdentifier} from "../../../calendar/models/calendar.util";
import {sortFinanceModels} from "../../util/finance.util";

export interface financeDialogData {
  categories: Map<number, string>;
}

interface ViewModelProps {
  percentage: string,
  colour: string,
}

type ViewModel = IFinanceSummary & ViewModelProps

const generateWeekSummaries = (date: Date, financeModels: FinanceModel[]): IFinanceSummary[] => {
  const dateStart = new Date(date.getFullYear(), date.getMonth(), 1)
  const dayStart = (dateStart.getDay() == 0 ? 6 : dateStart.getDay());
  const numRows = (42 - (dayStart)) % 7

  return financeModels.reduce((p, c) => {
    const day = parseDateFormattedStr(c.date)?.d ?? 0;
    const week = Math.floor((dayStart + day) / 7)

    p[week] = [...p[week], c]
    return p
  }, Array.from(new Array(numRows)).fill([]))
    .reduce<IFinanceSummary[]>((previousValue, currentValue: FinanceModel[], currentIndex) =>
      [...previousValue, {
        categoryName: `Week ${currentIndex + 1}`,
        total: currentValue.reduce((p, c) => p + c.amount, 0).toFixed(2),
        items: currentValue
      }], []
    )
}

@Component({
  selector: 'app-finance-app',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './finance-app.component.html',
  styleUrls: ['./finance-app.component.scss']
})
export class FinanceAppComponent implements OnInit {
  summaries: ViewModel[] | null = null;
  finances: FinanceModel[] | null = null;
  weekSummaries: IFinanceSummary[] | null = null;

  categoryLookup = new Map<number, string>;
  categoryColourLookup = new Map<string, string>;

  dateFrom = new Date();
  dateTo = new Date();

  constructor(
    private financeService: FinanceService,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  processSummary = (summary: IFinanceSummary[]) => {
    const allFinances: FinanceModel[] = summary
      .map(s => s.items).flat().sort(sortFinanceModels);

    const grandTotal = summary.reduce<number>((p, c) => {
      return p + parseFloat(c.total);
    }, 0);

    this.summaries = summary.map(d => {
      const v = parseFloat(d.total);
      const p = (v / grandTotal) * 100;
      const c = this.categoryColourLookup.get(d.categoryName) ?? '';

      return {
        categoryName: d.categoryName,
        colour: c.length ? c : '#A8D6D6',
        total: d.total,
        items: d.items,
        percentage: p.toFixed(0).concat('%'),
      }
    });

    this.weekSummaries = generateWeekSummaries(this.dateFrom, allFinances)
    this.finances = allFinances;
  }

  ngOnInit(): void {
    this.financeService.getFinanceCategories().subscribe({
      next: value => {
        this.categoryLookup = value.reduce((acc, c) => {
          return acc.set(c.id, c.type)
        }, new Map<number, string>)
        this.categoryColourLookup = value.reduce((acc, c) => {
          return acc.set(c.type, c.colour ?? '#A8D6D6')
        }, new Map<string, string>)

        this.dateFrom.setDate(1);
        this.dateTo.setDate(getTotalDaysInMonth(this.dateTo));
        this.financeService.getFinanceSummary(0, this.dateFrom, this.dateTo).subscribe({
          next: summary => this.processSummary(summary)
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
      if (!result || (result.data.length == 0)) {
        return;
      }

      if (result.action == Tabs.AddFinance) {
        this.financeService.createFinance(result.data.shift()!).subscribe(value => {
          this.finances = [...(this.finances ?? []), ...value];
        })

        return;
      }

      if (result.action == Tabs.BulkImport) {
        this.financeService.createFinanceMany(result.data).subscribe(value => {
          this.finances = [...(this.finances ?? []), ...value.data];
        })
      }

    });
  }
}
