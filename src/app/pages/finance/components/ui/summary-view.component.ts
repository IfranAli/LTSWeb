import { Component, computed, inject, input, output } from "@angular/core";
import { FinanceData } from "../finance-app/finance-app.component";
import { FinanceItemView } from "./expense-view.component";
import { CommonModule } from "@angular/common";
import { FinanceSummaryService } from "../../services/FinanceSummary.service";

@Component({
  selector: "summary-view",
  template: `
    @for (weekData of finances(); track weekData.name; let idx = $index) {
    <details [open]="idx == 0 ? true : false">
      <summary
        class="p-2 bg-slate-300 dark:bg-zinc-900 rounded-lg my-2 font-thin hover:bg-slate-400 hover:dark:bg-zinc-800 hover:cursor-pointer"
      >
        {{ weekData.name }} {{ weekData.total | currency }} across
        {{ weekData.items.length }} items
      </summary>

      <div
        class="grid flex-wrap sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4"
      >
        @for (expense of weekData.items; track expense.id) {
        <expense-view (click)="onItemClicked(expense.id)" [expense]="expense" />
        }
      </div>
    </details>
    }
  `,
  standalone: true,
  imports: [FinanceItemView, CommonModule],
})
export class SummaryView {
  finances = input<FinanceData[]>([]);
  itemClickEvent = output<number>();

  financeSummaryService = inject(FinanceSummaryService);

  onItemClicked(id: number) {
    const expense = this.finances()
      .flatMap((f) => f.items)
      .find((f) => f.id === id);

    if (expense) {
      console.debug("Item clicked", expense);
      this.financeSummaryService.$selectedFinance.set(expense);
    }
  }

  len = computed(() => {
    return this.finances().length;
  });

  constructor() {
    console.debug("SummaryView created");
  }
}
