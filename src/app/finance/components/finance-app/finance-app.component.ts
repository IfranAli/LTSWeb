import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  effect,
  signal,
} from "@angular/core";
import {
  FinanceCategoryResult,
  FinanceService,
  IFinanceSummary,
} from "../../services/finance.service";
import { FinanceModel, defaultFinance } from "../../models/finance.model";
import { Router } from "@angular/router";
import {
  AddFinanceDialogComponent,
  financeDialogData,
} from "../add-finance-dialog/add-finance-dialog.component";
import {
  decrementDateByMonth,
  getTotalDaysInMonth,
  incrementDateByMonth,
  parseDateFormattedStr,
} from "../../../calendar/models/calendar.util";
import { sortFinanceModels } from "../../util/finance.util";
import { CALENDAR_MONTHS } from "../../../calendar/models/calendar.model";
import {
  BehaviorSubject,
  combineLatestWith,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from "rxjs";
import { ImportFinanceDialogComponent } from "../import-finance-dialog/import-finance-dialog.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

export interface FinanceData extends IFinanceSummary {
  items: FinanceViewModel[];
}

export interface FinanceViewModel extends FinanceModel {
  accountId: number;
  name: string;
  date: string;
  dateFormatted: string;
  amount: number;
  categoryType: number;
  categoryColour: string;
  categoryLabel: string;
  amountFormatted: string;
  isCredit: boolean;
}

export type FinanceSummary = {
  percentage: string;
  percentageRaw: number;
  colour: string;
  total: string;
  categoryName: string;
  items: FinanceViewModel[];
};

export type CategoryData = {
  typeMap: Map<number, string>;
  colorMap: Map<string, string>;
};

export type FinanceDataAll = {
  category: FinanceCategoryResult;
  summaries: FinanceSummary[];
};

const getFinancesByWeek = (
  date: Date,
  financeModels: FinanceViewModel[]
): FinanceViewModel[][] => {
  const dateStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayStart = dateStart.getDay() == 0 ? 6 : dateStart.getDay();
  const numRows = (42 - dayStart) % 7;

  return financeModels.reduce((p, c) => {
    const day = parseDateFormattedStr(c.date)?.d ?? 0;
    const week = Math.floor((dayStart + day) / 7);

    if (!p[week]) {
      p[week] = [];
    }

    p[week] = [...p[week], c];
    return p;
  }, Array.from(new Array(numRows)).fill([]));
};

export const formatCurrency = (number: number): string => {
  return "$".concat(Math.abs(number).toFixed(2));
};

@Component({
  selector: "app-finance-app",
  standalone: true,
  templateUrl: "./finance-app.component.html",
  styleUrls: ["./finance-app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    AddFinanceDialogComponent,
    ImportFinanceDialogComponent,
  ],
})
export class FinanceAppComponent implements OnInit, OnDestroy {
  $subscription2: Subscription | undefined;
  summaries$: Observable<FinanceDataAll>;
  financeData$: Observable<FinanceData[]> = of([]);
  financeModels: FinanceModel[] = [];
  title = "";
  dateFrom$ = new BehaviorSubject<Date>(new Date());
  refresh$ = new BehaviorSubject<boolean>(true);
  categoryLookup = new Map<number, string>();
  categoryColourLookup = new Map<string, string>();
  dialogAction: any;
  selectedFinance: any;

  // todo: Actually read this value from service.
  accountId = 0;

  model: FinanceModel = defaultFinance;
  showEditDialog = signal(false);
  showImportDialog = signal(false);
  $$selectedFinance = signal<FinanceModel | undefined>(undefined);

  constructor(private financeService: FinanceService, private router: Router) {
    effect(() => {
      const p = this.$$selectedFinance();
      console.log("selected finance", p);

      console.log(this.showEditDialog());
    });

    this.summaries$ = this.dateFrom$.pipe(
      combineLatestWith(this.refresh$),
      tap((value) => {
        const dateFrom = value[0];
        const monthName = CALENDAR_MONTHS[dateFrom.getMonth()];
        const year = dateFrom.getFullYear().toString();
        this.title = monthName + " " + year;
      }),
      switchMap((value) => {
        const dateFrom = value[0];
        dateFrom.setDate(1);
        const dateTo = new Date(dateFrom);
        dateTo.setDate(getTotalDaysInMonth(dateTo));

        const monthName = CALENDAR_MONTHS[dateFrom.getMonth()];
        const year = dateFrom.getFullYear().toString();
        this.title = monthName + " " + year;

        return this.financeService
          .getFinanceSummaryForDateRange(this.accountId, dateFrom, dateTo)
          .pipe(
            tap((value) => {
              this.categoryLookup = value.category.categoryTypesMap;
              this.categoryColourLookup = value.category.categoryColorMap;
            }),
            tap((data: FinanceDataAll) => {
              const summaryGraphs = data.summaries;
              const allFinances = summaryGraphs
                .map((s) => s.items)
                .flat()
                .sort(sortFinanceModels);
              const date = this.dateFrom$.value;
              const financesByWeeks: FinanceModel[][] = getFinancesByWeek(
                date,
                allFinances
              );

              this.financeModels = allFinances;

              const summaries: FinanceData[] = financesByWeeks
                .reduce<FinanceData[]>((p, c, idx) => {
                  const weekTotal = c.reduce((p, c) => p + c.amount, 0);
                  const financeViewModels = c.map<FinanceViewModel>((fm) =>
                    FinanceService.financeModelToViewModel(fm)
                  );

                  return [
                    ...p,
                    {
                      categoryName: `Week ${idx + 1}`,
                      total: formatCurrency(weekTotal),
                      items: financeViewModels,
                    },
                  ];
                }, [])
                .filter((value) => value.items.length)
                .reverse();

              this.financeData$ = of(summaries);
              return of(data);
            })
          );
      })
    );
  }

  back() {
    this.dateFrom$.next(decrementDateByMonth(this.dateFrom$.value));
  }

  forward() {
    this.dateFrom$.next(incrementDateByMonth(this.dateFrom$.value));
  }

  closeDialog() {
    this.$$selectedFinance.set(undefined);
    this.showEditDialog.set(false);
    this.showImportDialog.set(false);
  }

  openDialogAddFinance(financeId?: number) {
    const finance = financeId
      ? this.financeModels.find((value) => value.id == financeId)
      : { ...this.model, accountId: this.accountId };

    const data: financeDialogData = {
      categories: this.categoryLookup,
      financeModel: finance,
    };

    this.$$selectedFinance.set(finance);
    this.showEditDialog.set(true);
  }

  openDialogImport() {
    this.showImportDialog.set(true);
  }

  refreshData = () => {
    this.refresh$.next(true);
  };

  ngOnDestroy(): void {
    this.refresh$.complete();
    this.dateFrom$.complete();
  }

  ngOnInit(): void {}

  trackByFinanceSummary(_: any, item: FinanceSummary) {
    return item.categoryName;
  }

  trackByFinanceViewModel(_: any, item: FinanceViewModel) {
    return item.id;
  }
}
