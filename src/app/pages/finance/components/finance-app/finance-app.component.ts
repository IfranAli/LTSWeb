import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from "@angular/core";
import {
  FinanceCategoryResult,
  FinanceDataAll,
  FinanceService,
  formatCurrency,
} from "../../services/finance.service";
import { FinanceModel, defaultFinance } from "../../models/finance.model";
import { AddFinanceDialogComponent } from "../add-finance-dialog/add-finance-dialog.component";
import {
  decrementDateByMonth,
  getTotalDaysInMonth,
  incrementDateByMonth,
  parseDateFormattedStr,
} from "../../../calendar/models/calendar.util";
import { dateToString, sortFinanceModels } from "../../util/finance.util";
import { CALENDAR_MONTHS } from "../../../calendar/models/calendar.model";
import {
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs";
import { ImportFinanceDialogComponent } from "../import-finance-dialog/import-finance-dialog.component";

import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { SummaryView } from "../ui/summary-view.component";

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

export type FinanceData = {
  categoryName: string;
  items: FinanceViewModel[];
  total: number;
};

export type FinanceSummary = {
  percentage: string;
  percentageRaw: number;
  colour: string;
  total: number;
  categoryName: string;
  items: FinanceViewModel[];
};

export type CategoryData = {
  typeMap: Map<number, string>;
  colorMap: Map<string, string>;
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

type SummaryViewModel = {
  color: string;
  categoryName: string;
  total: string;
  percentage: string;
};

type ViewModel = {
  summaryGraph?: {
    category: FinanceCategoryResult;
    summaries: SummaryViewModel[];
    total: string;
  };
  financesByWeekly?: FinanceData[];
};

@Component({
    selector: "app-finance-app",
    templateUrl: "./finance-app.component.html",
    styleUrls: ["./finance-app.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
    AddFinanceDialogComponent,
    ImportFinanceDialogComponent,
    SummaryView
]
})
export class FinanceAppComponent implements OnInit, OnDestroy {
  // Services.
  route = inject(ActivatedRoute);
  router = inject(Router);
  financeService = inject(FinanceService);

  financeData$: Observable<FinanceData[]> = of([]);
  financeModels: FinanceModel[] = [];

  $vm = signal<ViewModel>({});

  title = "";
  dateContext = signal<Date>(new Date());
  refresh$ = new BehaviorSubject<boolean>(true);

  model: FinanceModel = defaultFinance;
  showEditDialog = signal(false);
  showImportDialog = signal(false);
  $selectedFinance = signal<FinanceModel | undefined>(undefined);

  applyTitle = (date: Date) => {
    const dateFrom = date;
    const monthName = CALENDAR_MONTHS[dateFrom.getMonth()];
    const year = dateFrom.getFullYear().toString();
    this.title = monthName + " " + year;
  };

  private pageParams$ = this.route.queryParams.pipe(
    map((params) => {
      console.debug("params", params);
      const dateFrom = params?.["dateFrom"] ?? null;
      const date = dateFrom ? new Date(dateFrom) : new Date();
      this.dateContext.set(date);
      return date;
    })
  );

  private summaries$ = combineLatest([this.pageParams$, this.refresh$]).pipe(
    tap(([date, _]) => {
      this.applyTitle(date);
    }),
    switchMap(([date, _]) => {
      const dateFrom = date;
      dateFrom.setDate(1);
      const dateTo = new Date(dateFrom);
      dateTo.setDate(getTotalDaysInMonth(dateTo));

      const monthName = CALENDAR_MONTHS[dateFrom.getMonth()];
      const year = dateFrom.getFullYear().toString();
      this.title = monthName + " " + year;

      return this.financeService
        .getFinanceSummaryForDateRange(dateFrom, dateTo)
        .pipe(
          tap((data: FinanceDataAll) => {
            const allFinances = data.summaries
              .map((s) => s.items)
              .flat()
              .sort(sortFinanceModels);
            const financesByWeeks: FinanceModel[][] = getFinancesByWeek(
              dateFrom,
              allFinances
            );

            this.financeModels = allFinances;

            const financeDataByWeekly: FinanceData[] = financesByWeeks
              .reduce<FinanceData[]>((p, c, idx) => {
                const weekTotal = c.reduce((p, c) => p + c.amount, 0);
                const financeViewModels = c.map<FinanceViewModel>((fm) =>
                  FinanceService.financeModelToViewModel(fm)
                );

                const model: FinanceData = {
                  categoryName: `Week ${idx + 1}`,
                  total: weekTotal,
                  items: financeViewModels,
                };

                return [...p, model];
              }, [])
              .filter((value) => value.items.length)
              .reverse();

            const total = financeDataByWeekly.reduce((p, c) => p + c.total, 0);

            const summaryGraphViewModel: SummaryViewModel[] =
              data.summaries.map((s) => {
                return {
                  categoryName: s.categoryName,
                  color: s.colour,
                  total: formatCurrency(s.total),
                  percentage: s.percentage,
                };
              });

            this.$vm.set({
              summaryGraph: {
                category: data.category,
                summaries: summaryGraphViewModel,
                total: formatCurrency(total),
              },
              financesByWeekly: financeDataByWeekly,
            });

            return of(data);
          })
        );
    })
  );

  private _ = toSignal(this.summaries$, {});

  /**
   * Adjust the date window by one month.
   * @param forwards If true, the date window is moved forwards by one month. Otherwise, it is moved backwards by one month.
   */
  setDateWindow(forwards: boolean) {
    const date = this.dateContext();
    const dateFrom = forwards
      ? incrementDateByMonth(date)
      : decrementDateByMonth(date);

    const dateTo = incrementDateByMonth(new Date(dateFrom));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        dateFrom: dateToString(dateFrom, "-"),
        dateTo: dateToString(dateTo, "-"),
      },
      queryParamsHandling: "merge",
    });
  }

  onCloseDialogEvent(value: boolean) {
    this.$selectedFinance.set(undefined);
    this.showEditDialog.set(false);
    this.showImportDialog.set(false);

    if (value) {
      this.refreshData();
    }
  }

  openDialogAddFinance(financeId?: number) {
    const finance = financeId
      ? this.financeModels.find((value) => value.id == financeId)
      : { ...this.model };

    this.$selectedFinance.set(finance);
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
    // this.dateFrom$.complete();
  }

  trackByFinanceSummary(_: any, item: SummaryViewModel) {
    return item.categoryName;
  }

  trackByFinanceViewModel(_: any, item: FinanceViewModel) {
    return item.id;
  }

  ngOnInit(): void {}
}
