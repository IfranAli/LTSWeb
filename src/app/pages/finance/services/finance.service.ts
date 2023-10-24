import { Injectable, computed, effect, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import {
  FinanceCategory,
  FinanceDatabaseModel,
  FinanceModel,
} from "../models/finance.model";
import { getHttpHeaders, ResponseMessage } from "../../../constants/web-constants";
import { dateToString } from "../util/finance.util";
import {
  CategoryData,
  FinanceDataAll,
  FinanceSummary,
  FinanceViewModel,
  formatCurrency,
} from "../components/finance-app/finance-app.component";
import {
  combineLatestWith,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from "rxjs";
import { WeekDays } from "../../calendar/models/calendar.model";
import { toSignal } from "@angular/core/rxjs-interop";
import { UserService } from "src/app/services/user.service";
import { compileClassMetadata } from "@angular/compiler";
import { incrementDateByMonth } from "src/app/pages/calendar/models/calendar.util";

const baseUrl = environment.backendURL;
const financesUrl = baseUrl + "finance";

export interface IFinanceSummary {
  total: string;
  categoryName: string;
  items: FinanceModel[];
}

export interface IResult<T> {
  data: T[];
  errors: string[];
}

export interface FinanceCategoryResult {
  categoryTypesMap: Map<number, string>;
  categoryColorMap: Map<string, string>;
}

@Injectable({
  providedIn: "root",
})
export class FinanceService {
  private $apiCategories = toSignal(this.getFinanceCategories());

  private $categoryMaps = computed(() => {
    const categories = this.$apiCategories() ?? [];

    const categoryTypesMap = categories.reduce((acc, c) => {
      return acc.set(c.id, c.type);
    }, new Map<number, string>());

    const categoryColorMap = categories.reduce((acc, c) => {
      return acc.set(c.type, c.colour ?? "#A8D6D6");
    }, new Map<string, string>());

    const value: FinanceCategoryResult = {
      categoryTypesMap,
      categoryColorMap,
    };

    return value;
  });

  // Public signals.
  $categories = computed(() => this.$categoryMaps());

  constructor(private http: HttpClient, private userService: UserService) {
    effect(() => {
      // const v = this.$categoryMaps();
      // console.log(v);
    });
  }

  static financeModelToViewModel = (
    fm: FinanceModel,
    data?: FinanceCategoryResult
  ): FinanceViewModel => {
    const category = data?.categoryTypesMap.get(fm.categoryType) ?? "";
    const colour = data?.categoryColorMap.get(category) ?? "";

    const date = new Date(fm.date);
    const weekday = WeekDays[date.getDay()].slice(0, 3);
    const dayOfMonth = date.getDate();

    const suffixes = ["st", "nd", "rd", "th"];
    const daySuffix = [1, 2, 3].indexOf(dayOfMonth);
    const suffix = daySuffix > -1 ? suffixes[daySuffix] : suffixes[3];

    const dateText = [weekday, dayOfMonth.toString().concat(suffix)].join(" ");
    // const dateText = [weekday, fm.date].join(' ')
    const amount = fm.amount;

    return {
      categoryLabel: category,
      categoryColour: colour,
      dateFormatted: dateText,
      isCredit: amount > 0,
      amountFormatted: formatCurrency(amount),
      ...fm,
    };
  };

  // #region Finance Summary
  private processSummaries = (summaries: IFinanceSummary[]): FinanceDataAll => {
    const categoryData = this.$categoryMaps();
    const grandTotal = summaries.reduce<number>((p, c) => {
      return p + parseFloat(c.total);
    }, 0);

    const summaryGraphs: FinanceSummary[] = summaries
      .map((d): FinanceSummary => {
        const v = parseFloat(d.total);
        const p = (v / grandTotal) * 100;
        const categoryName = d.categoryName ?? "";
        const c = categoryData.categoryColorMap.get(categoryName) ?? "#A8D6D6";

        const items: FinanceViewModel[] = d.items.map((i: FinanceModel) => {
          return FinanceService.financeModelToViewModel(i, categoryData);
        });

        const financeSummary: FinanceSummary = {
          categoryName: d.categoryName,
          colour: c,
          total: formatCurrency(parseFloat(d.total)),
          items: items,
          percentage: p.toFixed(0).concat("%"),
          percentageRaw: parseInt(p.toFixed(0)),
        };

        return financeSummary;
      })
      .sort((a, b) => {
        return a.percentageRaw > b.percentageRaw ? -1 : 1;
      });

    const data: FinanceDataAll = {
      category: categoryData,
      summaries: summaryGraphs,
    };

    return data;
  };

  // #endregion

  createFinanceMany(models: FinanceModel[]) {
    const model = models.map((model) => {
      const { id, ...noId } = model;
      return noId;
    });
    return this.http.post<IResult<FinanceDatabaseModel>>(
      financesUrl,
      model,
      getHttpHeaders()
    );
  }

  createFinance(model: FinanceModel) {
    const { id, ...postData } = model;
    return this.http.post<FinanceDatabaseModel[]>(
      financesUrl,
      postData,
      getHttpHeaders()
    );
  }

  private getFinanceCategories() {
    const url = financesUrl.concat("/", "category");
    return this.http.get<FinanceCategory[]>(url, getHttpHeaders());
  }

  private $accountId = this.userService.$userData()?.accountId ?? -1;
  private $dateFrom = signal(new Date());
  private $dateTo = computed(() => incrementDateByMonth(this.$dateFrom()));

  getFinanceSummaryForDateRange(
    accountId: number,
    from: Date,
    to: Date
  ): Observable<FinanceDataAll> {
    const url = financesUrl.concat("/", "summary", "/" + String(accountId));
    const iFinanceSummary = this.http.get<IFinanceSummary[]>(url, {
      ...getHttpHeaders(),
      params: {
        from: dateToString(from),
        to: dateToString(to),
        accountId: accountId,
      },
    });

    return iFinanceSummary.pipe(
      switchMap((summaries) => of(this.processSummaries(summaries)))
    );
  }

  updateFinance(model: FinanceModel) {
    const url = financesUrl.concat("/", String(model.id));
    return this.http.put<FinanceDatabaseModel[]>(url, model, getHttpHeaders());
  }

  deleteFinance(id: number) {
    const url = financesUrl.concat("/", String(id));
    return this.http.delete<ResponseMessage>(url, getHttpHeaders());
  }
}
