import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FinanceAppComponent} from "./finance/components/finance-app/finance-app.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatTableModule} from "@angular/material/table";

const routes: Routes = [
  {path: 'finance', component: FinanceAppComponent},
  {path: 'projects', component: ProjectsComponent},
];

@NgModule({
  declarations: [FinanceAppComponent],
    imports: [RouterModule.forRoot(routes), NgIf, NgForOf, MatTableModule, DatePipe],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
