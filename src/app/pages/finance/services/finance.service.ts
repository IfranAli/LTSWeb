import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { FinanceDatabaseModel, FinanceModel } from "../models/finance.model";
import {
  getHttpHeaders,
  ResponseMessage,
} from "../../../constants/web-constants";
import {
  FinanceSummary,
  FinanceViewModel,
} from "../components/finance-app/finance-app.component";
import { UserService } from "src/app/services/user.service";
import { FinanceCategoryService } from "./FinanceCategory.service";
import { ApiFinanceItem } from "./finance-api.models";

const baseUrl = environment.backendURL;
const financesUrl = baseUrl + "finance";

export type FinanceDataAll = {
  category: any;
  summaries: FinanceSummary[];
};
export interface IFinanceSummary {
  total: string;
  categoryName: string;
  items: FinanceModel[];
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
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private CategoryService = inject(FinanceCategoryService);

  private colorMap = this.CategoryService.categoryColorMap;
  private categoryMap = this.CategoryService.categoryTypesMap;

  public financeModelToViewModel = (fm: ApiFinanceItem): FinanceViewModel => {
    const category = this.categoryMap().get(fm.categoryType) ?? "";

    return {
      categoryLabel: category,
      categoryColour: this.colorMap().get(category) ?? "#A8D6D6",
      ...fm,
    };
  };

  createFinanceMany(models: FinanceModel[]) {
    const model = models.map((model) => {
      const { id, ...noId } = model;
      return noId;
    });
    return this.http.post<FinanceDatabaseModel[]>(
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

  updateFinance(model: FinanceModel) {
    const url = financesUrl.concat("/", String(model.id));
    return this.http.put<FinanceDatabaseModel[]>(url, model, getHttpHeaders());
  }

  deleteFinance(id: number) {
    const url = financesUrl.concat("/", String(id));
    return this.http.delete<ResponseMessage>(url, getHttpHeaders());
  }
}
