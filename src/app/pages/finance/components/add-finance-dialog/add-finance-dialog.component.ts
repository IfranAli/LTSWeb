import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createFinanceModel, FinanceModel } from '../../models/finance.model';
import { DialogBaseComponent, DialogComponent } from 'src/app/dialog/dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FinanceService } from '../../services/finance.service';
import { FinanceCategoryService } from '../../services/FinanceCategory.service';
import { DateTimeInputComponent } from '../../../../components/date-time-input/date-time-input.component';

export enum Tabs {
  AddFinance = 0,
  BulkImport = 1,
}

export enum Actions {
  BulkImport = 'Bulk Import',
  Add = 'Add Finance',
  Edit = 'Edit Finance',
  Delete = 'Delete',
}

export interface IDialogResult {
  action: Actions;
  data: FinanceModel[];
}

export interface financeDialogData {
  categories: Map<number, string>;
  financeModel?: FinanceModel;
}

@Component({
  selector: 'app-add-finance-dialog',
  templateUrl: './add-finance-dialog.component.html',
  styleUrls: ['./add-finance-dialog.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, DialogComponent, DateTimeInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFinanceDialogComponent extends DialogBaseComponent {
  readonly selected = input.required<FinanceModel | undefined>();

  public categoryTypes = inject(FinanceCategoryService).categoryTypesMap();

  dialogAction = Actions.Add;

  inputName = signal('');
  inputDate = signal(new Date(Date.now()));
  inputAmount = signal(0);
  inputCategoryType = signal(0);

  financeData = computed(() =>
    createFinanceModel({
      id: this.selected()?.id ?? -1,
      name: this.inputName(),
      date: this.inputDate().toISOString(),
      amount: this.inputAmount(),
      categoryType: this.inputCategoryType(),
    })
  );

  financeService = inject(FinanceService);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const selected = this.selected();
    if (selected) {
      this.dialogAction = Actions.Edit;
      this.inputName.set(selected.name);
      this.inputAmount.set(selected.amount);
      this.inputCategoryType.set(selected.categoryType);

      const selectedDate = new Date(selected.date);
      if (!isNaN(selectedDate.getTime())) {
        this.inputDate.set(selectedDate);
      }

      this.dialogAction = (selected.id ?? 0) > 0 ? Actions.Edit : Actions.Add;
    }
  }

  deleteFinance(): void {
    const id = this.selected()?.id ?? -1;
    if (id > 0) {
      this.financeService
        .deleteFinance(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.onModalClose.emit(true);
        });
    }
  }

  eventToHtmlValue = <T>(event: Event) => {
    const v = (event.target as HTMLInputElement).value;
    console.debug('Event to HTML Value: ', v);
    return v;
  };

  eventToNumber = (event: Event): number => {
    return parseFloat(this.eventToHtmlValue(event));
  };

  addFinance(): void {
    const financeData = this.financeData();

    if (financeData.id > 0) {
      this.financeService
        .updateFinance(financeData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.onModalClose.emit(true);
        });
    } else {
      this.financeService
        .createFinance(financeData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.onModalClose.emit(true);
        });
    }
  }
}
