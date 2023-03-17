import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FinanceService, IFinanceSummary} from "../../services/finance.service";
import {FinanceCategory, FinanceModel} from "../../models/finance.model";
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
  combineLatestWith, Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
  tap
} from "rxjs";

export interface financeDialogData {
  categories: Map<number, string>;
}


interface WithFinanceViewModels {
  items: FinanceViewModel[]
}

interface IFinanceSummaryExtraProps {
  percentage: string,
  percentageRaw: number,
  colour: string,
}

interface FinanceModelExtraProps {
  categoryColour: string;
  categoryLabel: string;
  amountFormatted: string;
  isCredit: boolean;
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

const formatCurrency = (number: number): string =>  {
  return  '$'.concat(Math.abs(number).toFixed(2));
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

  categoriesData$ = new BehaviorSubject<FinanceCategory[] | undefined>(undefined);
  summaries$: Observable<SummaryGraph[]>;
  financeData$: Observable<FinanceData[]> = of([]);
  title = '';
  dateFrom$ = new BehaviorSubject<Date>(new Date());
  categoryLookup = new Map<number, string>;
  categoryColourLookup = new Map<string, string>;
  categories$: Observable<FinanceCategory[]> = this.financeService.getFinanceCategories().pipe(
    shareReplay(1),
    tap(categories => {
      this.categoriesData$.next(categories);
      this.categoryLookup = categories.reduce((acc, c) => {
        return acc.set(c.id, c.type)
      }, new Map<number, string>)

      this.categoryColourLookup = categories.reduce((acc, c) => {
        return acc.set(c.type, c.colour ?? '#A8D6D6')
      }, new Map<string, string>)
    })
  );

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
          combineLatestWith(
            this.categories$.pipe(
              tap(value => console.log(value))
            )
          ),
          switchMap(([summaries,]) => {
            return of(this.processSummary(summaries));
          }),
          tap((summaryGraph) => {
            const allFinances = summaryGraph.map(s => s.items).flat().sort(sortFinanceModels)
            const date = this.dateFrom$.value;
            const financesByWeeks: FinanceModel[][] = getFinancesByWeek(date, allFinances)

            const result = financesByWeeks.reduce<FinanceData[]>((p, c, idx) => {
                const total = c.reduce((p, c) => p + c.amount, 0);

                return [...p, {
                  categoryName: `Week ${idx + 1}`,
                  total: formatCurrency(total),
                  items: c.map(this.financeModelToViewModel),
                }]
              }, []
            ).filter(value => value.items.length).reverse();

            this.financeData$ = of(result);
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

  processSummary = (summary: IFinanceSummary[]): SummaryGraph[] => {
    const grandTotal = summary.reduce<number>((p, c) => {
      return p + parseFloat(c.total);
    }, 0);

    return summary.map((d): SummaryGraph => {
      const v = parseFloat(d.total);
      const p = (v / grandTotal) * 100;
      const categoryName = d.categoryName ?? '';
      const c = this.categoryColourLookup.get(categoryName) ?? '#A8D6D6';

      return <IFinanceSummary & IFinanceSummaryExtraProps & WithFinanceViewModels>{
        categoryName: d.categoryName,
        colour: c,
        total: formatCurrency(parseFloat(d.total)),
        items: d.items.map(p => {
          return {
            ...p, categoryColour: c,
            categoryLabel: categoryName,
          }
        }),
        percentage: p.toFixed(0).concat('%'),
        percentageRaw: parseInt(p.toFixed(0))
      }
    });

  }

  financeModelToViewModel = (fm: FinanceModel): FinanceViewModel => {
    const category = this.categoryLookup.get(fm.categoryType) ?? '';
    const colour = this.categoryColourLookup.get(category) ?? '';

    const date = new Date(fm.date);
    const weekday = WeekDays[date.getDay()].slice(0, 3);
    const dayOfMonth = date.getDate();

    const suffixes = ['st', 'nd', 'rd', 'th']
    const daySuffix = [1, 2, 3].indexOf(dayOfMonth)
    const suffix = (daySuffix > -1) ? suffixes[daySuffix] : suffixes[3];

    const dateText = [weekday, dayOfMonth.toString().concat(suffix)].join(' ')
    // const dateText = [weekday, fm.date].join(' ')
    const amount = fm.amount;

    return {
      ...fm,
      categoryLabel: category,
      categoryColour: colour,
      date: dateText,
      isCredit: (amount > 0),
      amountFormatted: formatCurrency(amount)
    }
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
