import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceRoutingModule } from './finance-routing.module';
import { AddFinanceDialogComponent } from './components/add-finance-dialog/add-finance-dialog.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, FinanceRoutingModule, AddFinanceDialogComponent],
})
export class FinanceModule {}
