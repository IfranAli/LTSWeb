import { Component, input } from '@angular/core';
import { FinanceViewModel } from '../finance-app/finance-app.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-view',
  imports: [CommonModule],
  template: `
    @if (expense(); as e) {
      <div
        class="p-4 flex gap-4 rounded-md text-sm hover:cursor-pointer hover:bg-slate-300 hover:dark:bg-zinc-700 border"
        [style.border-color]="e.categoryColour"
      >
        <div class="flex flex-grow flex-col gap-4 items-start justify-between">
          <div class="text-lg font-extralight" [style.color]="e.categoryColour">
            {{ e.name }}
          </div>
          <div class="text-xl font-extralight">{{ e.amount | currency }}</div>
        </div>

        <div class="flex flex-col gap-4 items-end justify-between">
          <div class="text" [style.color]="e.categoryColour">
            {{ e.categoryLabel }}
          </div>
          <div>{{ e.date | date: 'short' }}</div>
        </div>
      </div>
    }
  `,
})
export class FinanceItemViewComponent {
  expense = input<FinanceViewModel>();
}
