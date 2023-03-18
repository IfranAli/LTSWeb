import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FinanceService, IFinanceSummary} from "../../services/finance.service";
import {FinanceModel} from "../../models/finance.model";
import {Router} from "@angular/router";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {AddFinanceDialogComponent, IDialogData, Tabs} from "../add-finance-dialog/add-finance-dialog.component";
import {
  decrementDateByMonth,
  getTotalDaysInMonth,
  incrementDateByMonth,
  parseDateFormattedStr,
} from "../../../calendar/models/calendar.util";
import {sortFinanceModels} from "../../util/finance.util";
import {CALENDAR_MONTHS, WeekDays} from "../../../calendar/models/calendar.model";
import {
  BehaviorSubject,
  Observable,
  of,
  Subscription,
  switchMap,
  tap
} from "rxjs";

export interface financeDialogData {
  categories: Map<number, string>;
}

export interface FinanceData extends IFinanceSummary {
  items: FinanceViewModel[]
}

export interface FinanceViewModel extends FinanceModel {
  accountId: number,
  name: string,
  date: string,
  dateFormatted: string,
  amount: number,
  categoryType: number,
  categoryColour: string;
  categoryLabel: string;
  amountFormatted: string;
  isCredit: boolean;
}

export type FinanceSummary = {
  percentage: string,
  percentageRaw: number,
  colour: string,
  total: string,
  categoryName: string,
  items: FinanceViewModel[]
}

export type CategoryData = {
  typeMap: Map<number, string>;
  colorMap: Map<string, string>;
}

export type FinanceDataAll = {
  category: CategoryData,
  summaries: FinanceSummary[]
};

const getFinancesByWeek = (date: Date, financeModels: FinanceViewModel[]): FinanceViewModel[][] => {
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

export const formatCurrency = (number: number): string => {
  return '$'.concat(Math.abs(number).toFixed(2));
}

@Component({
  selector: 'app-finance-app',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './finance-app.component.html',
  styleUrls: ['./finance-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceAppComponent implements OnInit, OnDestroy {
  $subscription2: Subscription | undefined;
  // summaries$: Observable<SummaryGraph[]>;
  summaries$: Observable<FinanceDataAll>;
  financeData$: Observable<FinanceData[]> = of([]);
  title = '';
  dateFrom$ = new BehaviorSubject<Date>(new Date());
  categoryLookup = new Map<number, string>;
  categoryColourLookup = new Map<string, string>;

  constructor(
    private financeService: FinanceService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.summaries$ = this.dateFrom$.pipe(
      tap(dateFrom => {
        const monthName = CALENDAR_MONTHS[dateFrom.getMonth()];
        const year = dateFrom.getFullYear().toString();
        this.title = monthName + ' ' + year;
      }),
      switchMap((dateFrom) => {
        dateFrom.setDate(1);
        const dateTo = new Date(dateFrom);
        dateTo.setDate(getTotalDaysInMonth(dateTo));

        const monthName = CALENDAR_MONTHS[dateFrom.getMonth()];
        const year = dateFrom.getFullYear().toString();
        this.title = monthName + ' ' + year;

        return this.financeService.getFinanceSummary(0, dateFrom, dateTo).pipe(
          tap((value) => {
            this.categoryLookup = value.category.typeMap;
            this.categoryColourLookup = value.category.colorMap;
          }),
          tap((data: FinanceDataAll) => {
            const summaryGraphs = data.summaries
            const allFinances = summaryGraphs.map(s => s.items).flat().sort(sortFinanceModels)
            const date = this.dateFrom$.value;
            const financesByWeeks: FinanceModel[][] = getFinancesByWeek(date, allFinances)

            const summaries: FinanceData[] = financesByWeeks.reduce<FinanceData[]>((p, c, idx) => {
                const weekTotal = c.reduce((p, c) => p + c.amount, 0);
                const financeViewModels = c.map<FinanceViewModel>((fm) =>
                  FinanceService.financeModelToViewModel(fm)
                );

                return [...p, {
                  categoryName: `Week ${idx + 1}`,
                  total: formatCurrency(weekTotal),
                  items: financeViewModels
                }]
              }, []
            ).filter(value => value.items.length).reverse();

            this.financeData$ = of(summaries);
            return of(data)
          }),
        );
      })
    )

  }

  back() {
    this.dateFrom$.next(decrementDateByMonth(this.dateFrom$.value));
  }

  forward() {
    this.dateFrom$.next(incrementDateByMonth(this.dateFrom$.value));
  }

  openDialogAddFinance() {
    const dialogRef = this.dialog.open(AddFinanceDialogComponent, {
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      // height: '100%',
      // width: '100%',
      data: {categories: this.categoryLookup},
      panelClass: ['dialog-style', 'dialog-small'],
    });

    this.$subscription2 = dialogRef.afterClosed().subscribe((result: IDialogData) => {
      if (!result || (result.data.length == 0)) {
        return;
      }

      if (result.action == Tabs.AddFinance) {
        // todo: add to model or refresh from db.
        this.financeService.createFinance(result.data.shift()!).subscribe(value => {
          console.log(value)
          // this.finances = [...(this.finances ?? []), ...value];
        })

        return;
      }

      if (result.action == Tabs.BulkImport) {
        this.financeService.createFinanceMany(result.data).subscribe(value => {
          console.log(value)
          // this.finances = [...(this.finances ?? []), ...value.data];
        })
      }

    });
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
