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
import { sortFinanceModels } from "../../util/finance.util";
import { CALENDAR_MONTHS } from "../../../calendar/models/calendar.model";
import {
  BehaviorSubject,
  combineLatestWith,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs";
import { ImportFinanceDialogComponent } from "../import-finance-dialog/import-finance-dialog.component";
import { CommonModule } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";

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

type FinanceData = {
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
  // Services.
  financeService = inject(FinanceService);

  financeData$: Observable<FinanceData[]> = of([]);
  financeModels: FinanceModel[] = [];

  $vm = signal<ViewModel>({});

  title = "";
  dateFrom$ = new BehaviorSubject<Date>(new Date());
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

  private summaries$ = this.dateFrom$.pipe(
    combineLatestWith(this.refresh$),
    tap(([date, _]) => this.applyTitle(date)),
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
              this.dateFrom$.value,
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

  back() {
    this.dateFrom$.next(decrementDateByMonth(this.dateFrom$.value));
  }

  forward() {
    this.dateFrom$.next(incrementDateByMonth(this.dateFrom$.value));
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
    this.dateFrom$.complete();
  }

  ngOnInit(): void {}

  trackByFinanceSummary(_: any, item: SummaryViewModel) {
    return item.categoryName;
  }

  trackByFinanceViewModel(_: any, item: FinanceViewModel) {
    return item.id;
  }
}
