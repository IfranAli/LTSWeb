import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FinanceService } from '../../services/finance.service';
import { FinanceModel, defaultFinance } from '../../models/finance.model';
import { AddFinanceDialogComponent } from '../add-finance-dialog/add-finance-dialog.component';
import {
  decrementDateByMonth,
  incrementDateByMonth,
  parseDateFormattedStr,
} from '../../../calendar/models/calendar.util';
import { dateToString } from '../../util/finance.util';
import { CALENDAR_MONTHS } from '../../../calendar/models/calendar.model';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { ImportFinanceDialogComponent } from '../import-finance-dialog/import-finance-dialog.component';

import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SummaryViewComponent } from '../ui/summary-view.component';
import { CommonModule } from '@angular/common';
import { FinanceSummaryService } from '../../services/FinanceSummary.service';
import { ApiFinanceItem } from '../../services/finance-api.models';

export interface FinanceViewModel extends ApiFinanceItem {
  categoryLabel: string;
  categoryColour: string;
}

export type FinanceData = {
  name: string;
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
  financeModels: ApiFinanceItem[]
): {
  weekNumber: number;
  items: ApiFinanceItem[];
}[] => {
  const dateStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayStart = dateStart.getDay() == 0 ? 6 : dateStart.getDay();

  const result = financeModels.reduce<ApiFinanceItem[][]>((acc, curr) => {
    const date = dateToString(new Date(curr.date));
    const day = parseDateFormattedStr(date)?.d ?? 0;
    const week = Math.floor((dayStart + day) / 7);

    if (!acc[week]) {
      acc[week] = [];
    }

    acc[week] = [...acc[week], curr];
    return acc;
  }, []);

  const sorted = result.map((i, idx) => ({
    weekNumber: idx + 1,
    items: i.sort((a, b) => a.date.localeCompare(b.date)),
  }));

  return sorted;
};

type SummaryViewModel = {
  color: string;
  categoryName: string;
  total: number;
  percentage: string;
  percentageRaw: number;
};

type ViewModel = {
  summaryGraph?: {
    category: any;
    summaries: SummaryViewModel[];
    total: number;
  };
  financesByWeekly?: FinanceData[];
};

@Component({
  selector: 'app-finance-app',
  templateUrl: './finance-app.component.html',
  styleUrls: ['./finance-app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [AddFinanceDialogComponent, ImportFinanceDialogComponent, SummaryViewComponent, CommonModule],
})
export class FinanceAppComponent implements OnDestroy {
  // Services.
  route = inject(ActivatedRoute);
  router = inject(Router);
  financeService = inject(FinanceService);
  financeSummaryService = inject(FinanceSummaryService);

  financeData$: Observable<FinanceData[]> = of([]);
  financeModels: FinanceModel[] = [];

  $vm = signal<ViewModel>({});

  title = '';
  dateContext = signal<Date>(new Date());
  refresh$ = new BehaviorSubject<boolean>(true);

  model: FinanceModel = defaultFinance;
  showEditDialog = signal(false);
  showImportDialog = signal(false);
  $selectedFinance = this.financeSummaryService.$selectedFinance;

  onFinanceSelected = effect(() => {
    const selected = this.$selectedFinance();
    if (selected) {
      this.showEditDialog.set(true);
    }
  });

  applyTitle = (date: Date) => {
    const dateFrom = date;
    const monthName = CALENDAR_MONTHS[dateFrom.getMonth()];
    const year = dateFrom.getFullYear().toString();
    this.title = monthName + ' ' + year;
  };

  private pageParams$ = this.route.queryParams.pipe(
    map((params) => {
      const dateFrom = params?.['dateFrom'] ?? null;
      const date = dateFrom ? new Date(dateFrom) : new Date();
      date.setDate(1);

      this.dateContext.set(date);
      this.financeSummaryService.$dateFrom.set(date);
      this.financeSummaryService.$selectedFinance.set(null);
      this.applyTitle(date);
      return date;
    })
  );

  private params = toSignal(this.pageParams$, {});

  public summary = computed(() => {
    const isLoading = this.financeSummaryService.isLoading();

    const result: {
      financeDataByWeekly: FinanceData[];
      total: number;
      summary: FinanceSummary[];
    } = {
      financeDataByWeekly: [],
      total: 0,
      summary: [],
    };

    if (isLoading) {
      return result;
    }
    const apiData = this.financeSummaryService.financesData();
    const financesByWeeks = getFinancesByWeek(this.dateContext(), apiData);
    const financeDataByWeekly: FinanceData[] = financesByWeeks
      .reduce<FinanceData[]>((acc, curr) => {
        const name = `Week ${curr.weekNumber}`;
        const weekTotal = curr.items.reduce((p, c) => p + c.amount, 0);
        const financeViewModels = curr.items.map<FinanceViewModel>((fm) =>
          this.financeService.financeModelToViewModel(fm)
        );

        const model: FinanceData = {
          name: name,
          total: weekTotal,
          items: financeViewModels,
        };

        return [...acc, model];
      }, [])
      .filter((value) => value.items.length)
      .reverse();

    const total = financeDataByWeekly.reduce((p, c) => p + c.total, 0);
    const summary: FinanceSummary[] = this.financeSummaryService.summariesProcessed();

    result.financeDataByWeekly = financeDataByWeekly;
    result.summary = summary;
    result.total = total;

    return result;
  });

  /**
   * Adjust the date window by one month.
   * @param forwards If true, the date window is moved forwards by one month. Otherwise, it is moved backwards by one month.
   */
  setDateWindow(forwards: boolean) {
    const date = this.dateContext();
    const dateFrom = forwards ? incrementDateByMonth(date) : decrementDateByMonth(date);

    if (dateFrom) {
      console.debug('from', dateFrom);
    }

    dateFrom.setDate(1);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        dateFrom: dateToString(dateFrom, '-'),
      },
      queryParamsHandling: 'merge',
    });
  }

  onCloseDialogEvent(value: boolean) {
    this.$selectedFinance.set(null);
    this.showEditDialog.set(false);
    this.showImportDialog.set(false);

    if (value) {
      this.refreshData();
    }
  }

  openDialogAddFinance(financeId?: number) {
    const finance = financeId ? this.financeModels.find((value) => value.id == financeId) : { ...this.model };

    if (finance) {
      this.$selectedFinance.set(finance);
      this.showEditDialog.set(true);
    }
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
}
