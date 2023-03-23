import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FinanceCategory, FinanceDatabaseModel, FinanceModel} from "../models/finance.model";
import {httpHeaders, ResponseMessage} from "../../constants/web-constants";
import {dateToString} from "../util/finance.util";
import {
  CategoryData,
  FinanceDataAll,
  FinanceSummary,
  FinanceViewModel,
  formatCurrency
} from "../components/finance-app/finance-app.component";
import {combineLatestWith, Observable, of, shareReplay, switchMap, tap} from "rxjs";
import {WeekDays} from "../../calendar/models/calendar.model";

const baseUrl = environment.backendURL;
const financesUrl = baseUrl + 'finance';

export interface IFinanceSummary {
  total: string,
  categoryName: string,
  items: FinanceModel[]
}

export interface IResult<T> {
  data: T[],
  errors: string[]
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private categories$ = this.getFinanceCategories().pipe(
    shareReplay(1),
    switchMap((categories: FinanceCategory[]) => {
      const categoryTypesMap = categories.reduce((acc, c) => {
        return acc.set(c.id, c.type)
      }, new Map<number, string>);

      const categoryColorMap = categories.reduce((acc, c) => {
        return acc.set(c.type, c.colour ?? '#A8D6D6')
      }, new Map<string, string>)


      const value = {
        categoryTypesMap,
        categoryColorMap
      }

      return of(value)
    }),
  );

  constructor(
    private http: HttpClient
  ) {
  }

  static financeModelToViewModel = (fm: FinanceModel, data?: CategoryData): FinanceViewModel => {
    const category = data?.typeMap.get(fm.categoryType) ?? '';
    const colour = data?.colorMap.get(category) ?? '';

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
      categoryLabel: category,
      categoryColour: colour,
      dateFormatted: dateText,
      isCredit: (amount > 0),
      amountFormatted: formatCurrency(amount),
      ...fm
    }
  }

  createFinanceMany(models: FinanceModel[]) {
    const model = models.map(model => {
      const {id, ...noId} = model;
      return noId;
    })
    return this.http.post<IResult<FinanceDatabaseModel>>(financesUrl, model, httpHeaders);
  }

  createFinance(model: FinanceModel) {
    const {id, ...postData} = model;
    return this.http.post<FinanceDatabaseModel[]>(financesUrl, postData, httpHeaders);
  }

  getFinanceCategories() {
    const url = financesUrl.concat('/', 'category');
    return this.http.get<FinanceCategory[]>(url, httpHeaders);
  }

  getFinanceSummary(accountId: number, from: Date, to: Date): Observable<FinanceDataAll> {
    const url = financesUrl.concat('/', 'summary', '/' + String(accountId));
    const iFinanceSummary = this.http.get<IFinanceSummary[]>(url, {
      ...httpHeaders,
      params: {
        from: dateToString(from),
        to: dateToString(to),
        accountId: accountId,
      }
    });

    return iFinanceSummary.pipe(
      combineLatestWith(this.categories$),
      switchMap((value) => {
          const summaries = value[0];
          const categoryData: CategoryData = {
            colorMap: value[1]['categoryColorMap'],
            typeMap: value[1]['categoryTypesMap']
          };

          const grandTotal = summaries.reduce<number>((p, c) => {
            return p + parseFloat(c.total);
          }, 0);

          const summaryGraphs: FinanceSummary[] = summaries.map((d): FinanceSummary => {
            const v = parseFloat(d.total);
            const p = (v / grandTotal) * 100;
            const categoryName = d.categoryName ?? '';
            const c = categoryData.colorMap.get(categoryName) ?? '#A8D6D6';


            const items: FinanceViewModel[] = d.items.map((i: FinanceModel) => {
              return FinanceService.financeModelToViewModel(i, categoryData)
            });

            const financeSummary: FinanceSummary = {
              categoryName: d.categoryName,
              colour: c,
              total: formatCurrency(parseFloat(d.total)),
              items: items,
              percentage: p.toFixed(0).concat('%'),
              percentageRaw: parseInt(p.toFixed(0))
            }

            return financeSummary
          });

          const data: FinanceDataAll = {
            category: categoryData,
            summaries: summaryGraphs
          }

          return of(data)
        }
      )
    );
  }

  getFinances() {
    return this.http.get<FinanceModel[]>(financesUrl, httpHeaders);
  }

  updateFinance(model: FinanceModel) {
    const url = financesUrl.concat('/', String(model.id));
    return this.http.put<FinanceDatabaseModel[]>(url, model, httpHeaders);
  }

  deleteFinance(id
                  :
                  number
  ) {
    const url = financesUrl.concat('/', String(id));
    return this.http.delete<ResponseMessage>(baseUrl + url, httpHeaders);
  }
}
