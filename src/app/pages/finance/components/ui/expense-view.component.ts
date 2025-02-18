import { Component, input } from "@angular/core";
import {
  FinanceViewModel,
} from "../finance-app/finance-app.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "expense-view",
  imports: [CommonModule],
  template: `
    @if (expense(); as e) {
    <div
      class="p-4 flex gap-4 bg-slate-200 dark:bg-zinc-800 rounded-md text-sm hover:cursor-pointer hover:bg-slate-300 hover:dark:bg-zinc-700"
    >
      <div class="flex flex-grow flex-col gap-4 items-start justify-between">
        <div class="text-xl font-extralight">{{ e.amount | currency }}</div>
        <div class="text-lg font-extralight">{{ e.name }}</div>
      </div>

      <div class="flex flex-col gap-4 items-end justify-between">
        <span class="badge" [style.color]="e.categoryColour">
          {{ e.categoryLabel }}
        </span>
        <div>{{ e.date | date }}</div>
      </div>
    </div>
    }
  `,
})
export class FinanceItemView {
  expense = input<FinanceViewModel>();
}
