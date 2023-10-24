import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FinanceAppComponent } from "./components/finance-app/finance-app.component";

const routes: Routes = [{ path: "", component: FinanceAppComponent }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [[RouterModule]],
})
export class FinanceRoutingModule {}
