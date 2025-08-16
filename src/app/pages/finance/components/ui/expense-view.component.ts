import { Component, input } from '@angular/core';
import { FinanceViewModel } from '../finance-app/finance-app.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-view',
  imports: [CommonModule],
  styleUrls: ['./expense-view.component.css'],
  template: `
    @if (expense(); as e) {
      <div
        class="item-card font-extralight"
        [style]="{
          '--category-colour': e.categoryColour,
        }"
      >
        <div class="item-row">
          <span>
            {{ e.name }}
          </span>

          <span>
            {{ e.amount | currency }}
          </span>
        </div>

        <div class="item-row ">
          <span class="">
            {{ e.categoryLabel }}
          </span>

          <span>
            {{ e.date | date: 'ccc d, HHmm' }}
          </span>
        </div>
      </div>
    }
  `,
})
export class FinanceItemViewComponent {
  expense = input<FinanceViewModel>();
}
