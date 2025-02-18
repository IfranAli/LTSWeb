import { Injectable, computed, effect, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { FinanceCategory } from "../models/finance.model";
import { getHttpHeaders } from "../../../constants/web-constants";
import { rxResource } from "@angular/core/rxjs-interop";
import { UserService } from "src/app/services/user.service";

const baseUrl = environment.backendURL;
const financeCategoryApiUrl = baseUrl + "finance" + "/category";

@Injectable({
  providedIn: "root",
})
export class FinanceCategoryService {
  // Services.
  private http = inject(HttpClient);
  private userService = inject(UserService); // TODO - implement user service
  // private $accountId = this.userService.$userData()?.accountId ?? -1;

  // fetches finance data  by category within the date range
  private apiCategories = rxResource({
    loader: () =>
      this.http.get<FinanceCategory[]>(
        `${financeCategoryApiUrl}`,
        getHttpHeaders()
      ),
  });

  public isLoading = this.apiCategories.isLoading;
  public categoriesData = computed(() => this.apiCategories.value() ?? []);

  public categoryTypesMap = computed(() => {
    const categories = this.apiCategories.value() ?? [];

    return categories.reduce((acc, c) => {
      return acc.set(c.id, c.type);
    }, new Map<number, string>());
  });

  public categoryColorMap = computed(() => {
    const categories = this.apiCategories.value() ?? [];

    return categories.reduce((acc, c) => {
      return acc.set(c.type, c.colour ?? "#A8D6D6");
    }, new Map<string, string>());
  });
}
