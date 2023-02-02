import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FinanceCategory, FinanceDatabaseModel, FinanceModel} from "../models/finance.model";
import {httpHeaders, ResponseMessage} from "../../constants/web-constants";

const baseUrl = environment.backendURL;
const financesUrl = baseUrl + 'finance';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  constructor(
    private http: HttpClient
  ) {
  }

  createFinance(model: FinanceModel) {
    return this.http.post<FinanceDatabaseModel>(financesUrl, model, httpHeaders);
  }

  getFinanceCategories() {
    const url = financesUrl.concat('/', 'category');
    return this.http.get<FinanceCategory[]>(url, httpHeaders);
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
