import { Component, computed, inject, input, linkedSignal, output, ViewEncapsulation } from '@angular/core';
import { FinanceData } from '../finance-app/finance-app.component';
import { FinanceItemViewComponent } from './expense-view.component';
import { CommonModule } from '@angular/common';
import { FinanceSummaryService } from '../../services/FinanceSummary.service';
import { cardComponent } from '../../../../components/layout/card/card.component';

@Component({
  selector: 'app-summary-view',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .list {
        margin: 0;
        padding: 0;

        .list-section-title {
          padding: 0.5rem 0.5rem;
          border-top: var(--border);
          background-color: var(--bg1);
        }

        .list-section-title:first-child {
          border-top: none;
        }
      }
    `,
  ],
  template: `
    <div class="card card-header flex flex-col gap-4">
      @for (weekData of finances(); track weekData.name; let idx = $index) {
        <app-card [noBodyPadding]="true">
          <div
            card-header
            class="flex justify-between items-center text-sm"
            (click)="onHeaderClicked(idx)"
            [class.expanded]="isExpandedLookup()[idx]"
          >
            <span>{{ weekData.total | currency }} </span>
            <span>across {{ weekData.items.length }} items</span>
          </div>

          <div card-body class="p-0">
            @if (isExpandedLookup()[idx]) {
              <div>
                @for (expense of weekData.items; track expense.id) {
                  <app-expense-view (click)="onItemClicked(expense.id)" [expense]="expense" />
                }
              </div>
            } @else {
              <div class="p-2 text-gray-500 hover:cursor-pointer" (click)="onHeaderClicked(idx)">
                Click to expand and view items
              </div>
            }
          </div>

          <div card-footer class="flex gap-2 text-sm">{{ weekData.name }}</div>
        </app-card>
        <!-- <div class="list-section-title hover:cursor-pointer text-sm" (click)="onHeaderClicked(idx)">
            {{ weekData.name }} {{ weekData.total | currency }} across {{ weekData.items.length }} items
          </div>

          @if (isExpandedLookup()[idx]) {
            <div class="grid flex-wrap sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 gap-4">
              @for (expense of weekData.items; track expense.id) {
                <app-expense-view (click)="onItemClicked(expense.id)" [expense]="expense" />
              }
            </div>
          } -->
      }
    </div>
  `,
  standalone: true,
  imports: [FinanceItemViewComponent, CommonModule, cardComponent],
})
export class SummaryViewComponent {
  finances = input<FinanceData[]>([]);
  itemClickEvent = output<number>();

  financeSummaryService = inject(FinanceSummaryService);
  isExpandedLookup = linkedSignal(() => {
    const arr: boolean[] = this.finances().map(() => true);
    return arr;
  });

  onHeaderClicked(id: number) {
    this.isExpandedLookup.update((prev) => {
      return prev.map((v, i) => {
        if (i === id) {
          return !v;
        }
        return v;
      });
    });
  }

  onItemClicked(id: number) {
    const expense = this.finances()
      .flatMap((f) => f.items)
      .find((f) => f.id === id);

    if (expense) {
      console.debug('Item clicked', expense);
      this.financeSummaryService.$selectedFinance.set(expense);
    }
  }

  len = computed(() => {
    return this.finances().length;
  });

  constructor() {
    console.debug('SummaryView created');
  }
}
