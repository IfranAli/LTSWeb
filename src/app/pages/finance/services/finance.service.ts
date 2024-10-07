import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import {
  FinanceCategory,
  FinanceDatabaseModel,
  FinanceModel,
} from "../models/finance.model";
import {
  getHttpHeaders,
  ResponseMessage,
} from "../../../constants/web-constants";
import { dateToString } from "../util/finance.util";
import {
  FinanceSummary,
  FinanceViewModel,
} from "../components/finance-app/finance-app.component";
import { Observable, of, switchMap } from "rxjs";
import { WeekDays } from "../../calendar/models/calendar.model";
import { toSignal } from "@angular/core/rxjs-interop";
import { UserService } from "src/app/services/user.service";
import { incrementDateByMonth } from "src/app/pages/calendar/models/calendar.util";

const baseUrl = environment.backendURL;
const financesUrl = baseUrl + "finance";

export type FinanceDataAll = {
  category: FinanceCategoryResult;
  summaries: FinanceSummary[];
};
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

// Format a number to a currency string.
export const formatCurrency = (number: number): string => {
  const prefix = number < 0 ? "-$" : "$";
  return prefix + Math.abs(number).toFixed(2);
};

@Injectable({
  providedIn: "root",
})
export class FinanceService {
  // Services.
  http = inject(HttpClient);
  userService = inject(UserService);

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

  static financeModelToViewModel = (
    fm: FinanceModel,
    data?: FinanceCategoryResult
  ): FinanceViewModel => {
    const category = data?.categoryTypesMap.get(fm.categoryType) ?? "";
    const colour = data?.categoryColorMap.get(category) ?? "";

    const date = new Date(fm.date);
    const weekday = WeekDays[date.getDay()].slice(0, 3);
    const dayOfMonth = date.getDate();

    const dateFormatted = `${weekday} ${dayOfMonth}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const amount = fm.amount;

    return {
      categoryLabel: category,
      categoryColour: colour,
      dateFormatted: dateFormatted,
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
        const total = parseFloat(d.total);
        const partPercentage = (total / grandTotal) * 100;
        const categoryName = d.categoryName ?? "";
        const color =
          categoryData.categoryColorMap.get(categoryName) ?? "#A8D6D6";

        const items: FinanceViewModel[] = d.items.map((i: FinanceModel) => {
          return FinanceService.financeModelToViewModel(i, categoryData);
        });

        const financeSummary: FinanceSummary = {
          categoryName: d.categoryName,
          colour: color,
          total: total,
          items: items,
          percentage: partPercentage.toFixed(0).concat("%"),
          percentageRaw: parseInt(partPercentage.toFixed(0)),
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
    from: Date,
    to: Date
  ): Observable<FinanceDataAll> {
    const userId = this.userService.userAccountId$();
    const url = `${financesUrl}/summary/${userId}`;
    const iFinanceSummary = this.http.get<IFinanceSummary[]>(url, {
      ...getHttpHeaders(),
      params: {
        from: dateToString(from),
        to: dateToString(to),
        accountId: userId,
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
