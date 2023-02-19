import {Component, OnInit} from '@angular/core';
import {FinanceService, IFinanceSummary} from "../../services/finance.service";
import {FinanceModel} from "../../models/finance.model";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AddFinanceDialogComponent, IDialogData, Tabs} from "../add-finance-dialog/add-finance-dialog.component";
import {
  decrementDateByMonth,
  getTotalDaysInMonth,
  incrementDateByMonth,
  parseDateFormattedStr,
} from "../../../calendar/models/calendar.util";
import {sortFinanceModels} from "../../util/finance.util";
import {CALENDAR_MONTHS} from "../../../calendar/models/calendar.model";

export interface financeDialogData {
  categories: Map<number, string>;
}


interface WithFinanceViewModels {
  items: FinanceViewModel[]
}

interface IFinanceSummaryExtraProps {
  percentage: string,
  colour: string,
}

interface FinanceModelExtraProps {
  categoryColour: string;
  categoryLabel: string;
}

type SummaryGraph = IFinanceSummary & IFinanceSummaryExtraProps & WithFinanceViewModels
type FinanceData = IFinanceSummary & WithFinanceViewModels
type FinanceViewModel = FinanceModel & FinanceModelExtraProps

const getFinancesByWeek = (date: Date, financeModels: FinanceModel[]): FinanceModel[][] => {
  const dateStart = new Date(date.getFullYear(), date.getMonth(), 1)
  const dayStart = (dateStart.getDay() == 0 ? 6 : dateStart.getDay());
  const numRows = (42 - (dayStart)) % 7

  return financeModels.reduce((p, c) => {
    const day = parseDateFormattedStr(c.date)?.d ?? 0;
    const week = Math.floor((dayStart + day) / 7)

    if (!p[week]) {
      p[week] = []
    }

    p[week] = [...p[week], c]
    return p
  }, Array.from(new Array(numRows)).fill([]));
}

@Component({
  selector: 'app-finance-app',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './finance-app.component.html',
  styleUrls: ['./finance-app.component.scss']
})
export class FinanceAppComponent implements OnInit {
  summaries: SummaryGraph[] | null = null;
  fianceData: FinanceData[] | null = null;
  title = '';

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

    this.summaries = summary.map((d): SummaryGraph => {
      const v = parseFloat(d.total);
      const p = (v / grandTotal) * 100;
      const categoryName = d.categoryName ?? '';
      const c = this.categoryColourLookup.get(categoryName) ?? '#A8D6D6';

      return {
        categoryName: d.categoryName,
        colour: c,
        total: d.total,
        items: d.items.map(p => {
          return {...p, categoryColour: c, categoryLabel: categoryName}
        }),
        percentage: p.toFixed(0).concat('%'),
      }
    });

    const financeModelToViewModel = (fm: FinanceModel): FinanceViewModel => {
      const category = this.categoryLookup.get(fm.categoryType) ?? '';
      const colour = this.categoryColourLookup.get(category) ?? '';

      return {
        ...fm,
        categoryLabel: category,
        categoryColour: colour,
      }
    }

    const financesByWeeks: FinanceModel[][] = getFinancesByWeek(this.dateFrom, allFinances)
    this.fianceData = financesByWeeks.reduce<FinanceData[]>((p, c, idx) =>
        [...p, {
          categoryName: `Week ${idx + 1}`,
          total: c.reduce((p, c) => p + c.amount, 0).toFixed(2),
          items: c.map(financeModelToViewModel),
        }],
      []);
  }

  getData = () => {
    this.financeService.getFinanceCategories().subscribe({
      next: value => {
        this.categoryLookup = value.reduce((acc, c) => {
          return acc.set(c.id, c.type)
        }, new Map<number, string>)
        this.categoryColourLookup = value.reduce((acc, c) => {
          return acc.set(c.type, c.colour ?? '#A8D6D6')
        }, new Map<string, string>)

        this.dateFrom.setDate(1);
        this.dateTo = new Date(this.dateFrom);
        this.dateTo.setDate(getTotalDaysInMonth(this.dateTo));

        const monthName = CALENDAR_MONTHS[this.dateFrom.getMonth()];
        const year = this.dateFrom.getFullYear().toString();
        this.title = monthName + ' ' + year;

        this.financeService.getFinanceSummary(0, this.dateFrom, this.dateTo).subscribe({
          next: summary => this.processSummary(summary)
        })
      },
      error: err => this.router.navigate([''])
    })
  }

  ngOnInit(): void {
    this.getData();
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
        // todo: add to model or refresh from db.
        // this.financeService.createFinance(result.data.shift()!).subscribe(value => {
        //   this.finances = [...(this.finances ?? []), ...value];
        // })

        return;
      }

      if (result.action == Tabs.BulkImport) {
        // this.financeService.createFinanceMany(result.data).subscribe(value => {
        //   this.finances = [...(this.finances ?? []), ...value.data];
        // })
      }

    });
  }

  back() {
    this.fianceData = null;
    this.dateFrom = decrementDateByMonth(this.dateFrom);

    this.getData();
  }

  forward() {
    this.fianceData = null;
    this.dateFrom = incrementDateByMonth(this.dateFrom);

    this.getData();
  }
}
