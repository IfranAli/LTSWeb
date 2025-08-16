import { Component, computed, effect, inject, Input, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { cardComponent } from 'src/app/components/layout/card/card.component';
import { dateToString } from '../../../util/date-util';
import { FinanceService } from '../services/finance.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getHttpHeaders } from 'src/app/constants/web-constants';
import { UserService } from 'src/app/services/user.service';
import { FormsModule } from '@angular/forms';
import { DateTimeInputComponent } from 'src/app/components/date-time-input/date-time-input.component';
import { FinanceItemViewComponent } from '../components/ui/expense-view.component';

const baseUrl = environment.backendURL;
const financesUrl = baseUrl + 'finance';

@Component({
  selector: 'app-finance-search',
  imports: [FinanceItemViewComponent, cardComponent, FormsModule, DateTimeInputComponent],
  template: `
    <div class="search-container">
      <h1 class="text-2xl font-bold mb-4">Finance Search</h1>
      <app-card>
        <div card-header>
          <h2 class="text-xl font-semibold">Search Criteria</h2>
        </div>
        <div card-body>
          <form class="search-form">
            <label for="searchTerm" class="block mb-2">Search Term:</label>

            <span class="flex gap-4 mb-4">
              <app-date-time-input
                [(ngModel)]="formData().from"
                [ngModelOptions]="{ standalone: true }"
              ></app-date-time-input>

              <app-date-time-input
                [(ngModel)]="formData().to"
                [ngModelOptions]="{ standalone: true }"
              ></app-date-time-input>
            </span>

            <input
              id="searchTerm"
              type="text"
              class="input-field mb-4"
              placeholder="Enter search term"
              name="searchTerm"
              [(ngModel)]="formData().searchTerm"
            />

            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              (click)="onPerformSearch($event)"
            >
              Search
            </button>
          </form>

          <p>
            Current Search Term: {{ formData()?.searchTerm }}<br />
            From: {{ formData()?.from ? formData()?.from?.toLocaleDateString() : 'Not set' }}<br />
            To: {{ formData()?.to ? formData()?.to?.toLocaleDateString() : 'Not set' }}
          </p>

          @let searchResults = financeResource.value();

          @if (searchResults && searchResults.length > 0) {
            <h3 class="text-lg font-semibold mt-4">Search Results:</h3>
            <ul class="list-disc pl-5">
              <!-- @for (item of searchResults; track item.id) {
                <li>
                  {{ item.name }} - {{ item.amount }}
                  <span class="text-gray-500">({{ item.date }})</span>
                </li>
              } -->

              @for (item of searchResults; track item.id) {
                <app-expense-view [expense]="item" />
              }
            </ul>
          } @else if (searchResultsLoading) {
            <p>Loading search results...</p>
          } @else {
            <p>No search results found.</p>
          }
        </div>

        <div card-footer>
          <button (click)="test()">TEST</button>
          <p class="text-gray-600">Results will be displayed here.</p>
        </div>
      </app-card>
    </div>
  `,
  styles: `
    .search-container {
    }
  `,
})
export class FinanceSearchComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  private financeService = inject(FinanceService);
  private userService = inject(UserService);

  public formData = signal<FormData>({
    searchTerm: '',
    from: new Date(),
    to: new Date(),
  });

  private $accountId = this.userService.$userData()?.accountId ?? -1;

  public pageParams = toSignal(
    this.route.queryParams.pipe(
      map((params) => {
        const searchTerm = params?.['searchTerm'] ?? '';
        const from = params?.['from'] ? new Date(params['from']) : new Date();
        const to = params?.['to'] ? new Date(params['to']) : new Date();

        if (from === to) {
          from.setMonth(from.getMonth() - 2);
          from.setDate(1);
        }

        if (isNaN(from.getTime()) || isNaN(to.getTime())) {
          console.error('Invalid date parameters:', { from, to });
        }

        const data = {
          searchTerm,
          from: from instanceof Date ? from : new Date(),
          to: to instanceof Date ? to : new Date(),
          isValid: true,
          accountId: this.$accountId,
        };

        return data;
      })
    ),
    {}
  );

  // -- Resources
  public financeResource = rxResource({
    request: () => ({ ...this.formData(), accountId: this.$accountId }),
    loader: ({ request }) => {
      if (!request.from || !request.to) {
        console.warn('Search parameters are incomplete:', request);
        return of([]);
      }

      const from = dateToString(request.from, '-');
      const to = dateToString(request.to, '-');

      return this.http.get<any[]>(`${financesUrl}/search`, {
        ...getHttpHeaders(),
        params: {
          searchTerm: request.searchTerm,
          from: from,
          to: to,
          accountId: request.accountId,
        },
      });
    },
  });

  public searchResultsLoading = this.financeResource.isLoading();
  public searchResults = this.financeResource.value() ?? of([]);

  constructor() {
    effect(() => {
      const params = this.pageParams();
      if (params) {
        this.formData.update((old) => ({
          ...old,
          searchTerm: params.searchTerm ?? '',
          from: params.from ?? new Date(),
          to: params.to ?? new Date(),
        }));
      }
    });
  }

  test() {
    alert('Test function called!');
  }

  onPerformSearch(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const p = this.formData();

    const urlParams: PageParameters = {};

    if (p?.searchTerm) {
      urlParams.searchTerm = p.searchTerm;
    }

    if (p?.from && p?.to) {
      const dateFrom = dateToString(p.from, '-');
      const dateTo = dateToString(p.to, '-');

      urlParams.from = dateFrom;
      urlParams.to = dateTo;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: urlParams,
      queryParamsHandling: 'merge',
    });
  }
}

type PageParameters = {
  searchTerm?: string;
  from?: string;
  to?: string;
};

type FormData = {
  searchTerm: string;
  from: Date;
  to: Date;
};
