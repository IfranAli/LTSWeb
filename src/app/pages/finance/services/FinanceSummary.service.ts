import {
  Injectable,
  computed,
  effect,
  inject,
  linkedSignal,
  resource,
  signal,
} from "@angular/core";
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
import { Observable, of, switchMap, tap } from "rxjs";
import { rxResource, toSignal } from "@angular/core/rxjs-interop";
import { UserService } from "src/app/services/user.service";
import { incrementDateByMonth } from "src/app/pages/calendar/models/calendar.util";
import { ApiFinanceSummary } from "./finance-api.models";
import { FinanceCategoryService } from "./FinanceCategory.service";

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
export class FinanceSummaryService {
  // Services.
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private categoryService = inject(FinanceCategoryService);
  private $accountId = this.userService.$userData()?.accountId ?? -1;

  public $dateFrom = signal(new Date());
  private $dateFromSimple = linkedSignal(() => {
    const d = this.$dateFrom();
    d.setDate(1);
    console.debug("DateFrom: ", d);
    return d;
  });

  private $dateTo = computed(() => {
    const d = new Date(this.$dateFromSimple());
    d.setMonth(d.getMonth() + 1);
    d.setDate(d.getDate() - 1);

    console.debug("DateTo: ", d);
    return d;
  });

  // fetches finance data  by category within the date range
  private financesByCategory = rxResource({
    request: () => ({
      from: this.$dateFromSimple(),
      to: this.$dateTo(),
    }),
    loader: ({ request: params }) => {
      console.debug(`Fetching finances from ${params.from} to ${params.to}`);

      return this.http.get<ApiFinanceSummary[]>(
        `${financesUrl}/summary/${this.$accountId}`,
        {
          ...getHttpHeaders(),
          params: {
            from: dateToString(params.from),
            to: dateToString(params.to),
            accountId: this.$accountId,
          },
        }
      );
    },
  });

  public isLoading = this.financesByCategory.isLoading;
  public financesData = computed(
    () => this.financesByCategory.value()?.flatMap((f) => f.items) ?? []
  );
  public $selectedFinance = signal<FinanceModel | null>(null);

  public summariesProcessed = computed(() => {
    const data = this.financesByCategory.value() ?? [];
    if (!data) return [];

    const grandTotal = data.reduce<number>((p, c) => {
      return p + parseFloat(c.total);
    }, 0);

    const summaryGraphs: FinanceSummary[] = data
      .map((d): FinanceSummary => {
        const total = parseFloat(d.total);
        const partPercentage = (total / grandTotal) * 100;
        const categoryName = d.categoryName ?? "";
        const color =
          this.categoryService.categoryColorMap().get(categoryName) ??
          "#A8D6D6";

        const items = d.items.map((i) => {
          const category =
            this.categoryService.categoryTypesMap().get(i.categoryType) ?? "";
          return {
            ...i,
            categoryLabel: category,
            categoryColour: color,
          };
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

    return summaryGraphs;
  });

  constructor() {
    effect(() => {
      if (!this.isLoading()) {
        console.debug("FinancesData: ", this.financesData());
        console.debug("SummaryResource State:", this.isLoading());
      }

      const hasSelectedFinance = this.$selectedFinance() !== null;
      if (hasSelectedFinance) {
        console.debug("Selected Finance: ", this.$selectedFinance());
      }
    });
  }
}
