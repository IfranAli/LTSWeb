import { Component, computed, input } from "@angular/core";
import { FinanceData } from "../finance-app/finance-app.component";

@Component({
  selector: "summary-view",
  template: `
    <h1>Summary View</h1>
    <h2>Num Finances: {{ len() }}</h2>

    @for (weekData of finances(); track $index; let idx = $index) {
    <details [open]="idx == 0 ? true : false">
      <summary class="p-2 bg-zinc-900">
        <span>{{ weekData.categoryName }}</span>
        <span>{{ weekData.total }}</span>
      </summary>

      <div class="">
        @for (expense of weekData.items; track expense.id) {

        <div
          class="grid grid-cols-2 sm:grid-cols-4 bg-zinc-800 hover:bg-zinc-500"
        >
          <span>{{ expense.name }}</span>
          <span>{{ expense.amount }}</span>
          <span>{{ expense.date }}</span>
          <span>{{ expense.categoryLabel }}</span>
        </div>
        }
      </div>
    </details>
    }
  `,
  standalone: true,
})
export class SummaryView {
  finances = input<FinanceData[]>([]);

  len = computed(() => {
    const count = this.finances().length;
    console.debug("Count", this.finances());
    return count;
  });

  constructor() {
    console.debug("SummaryView created");
  }
}
