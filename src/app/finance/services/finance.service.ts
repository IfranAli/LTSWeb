import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FinanceCategory, FinanceDatabaseModel, FinanceModel} from "../models/finance.model";
import {httpHeaders, ResponseMessage} from "../../constants/web-constants";
import {dateToString} from "../util/finance.util";

const baseUrl = environment.backendURL;
const financesUrl = baseUrl + 'finance';

export interface IFinanceSummary {
  total: string,
  categoryName: string,
  items: {
    name: string,
    value: number,
  }[]
}

export interface IResult<T> {
  data: T[],
  errors: string[]
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  constructor(
    private http: HttpClient
  ) {
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

  getFinanceSummary(accountId: number, from: Date, to: Date) {
    const url = financesUrl.concat('/', 'summary', '/' + String(accountId));
    return this.http.get<IFinanceSummary[]>(url, {
      ...httpHeaders,
      params: {
        from: dateToString(from),
        to: dateToString(to),
        accountId: accountId,
      }
    });
    // return this.http.get<IFinanceSummary[]>(url, httpHeaders);
  }

  getFinances() {
    return this.http.get<FinanceModel[]>(financesUrl, httpHeaders);
  }

  updateFinance(model: FinanceModel) {
    const url = financesUrl.concat('/', String(model.id));
    return this.http.put<FinanceDatabaseModel[]>(baseUrl + url, model, httpHeaders);
  }

  deleteFinance(id: number) {
    const url = financesUrl.concat('/', String(id));
    return this.http.delete<ResponseMessage>(baseUrl + url, httpHeaders);
  }
}
