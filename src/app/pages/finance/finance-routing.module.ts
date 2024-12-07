import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [{ path: "", loadComponent: () => import('./components/finance-app/finance-app.component').then(m => m.FinanceAppComponent) }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [[RouterModule]],
})
export class FinanceRoutingModule {}
